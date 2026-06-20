import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateCheckoutInput } from "@/lib/commerce/contracts/schemas";
import type { Address } from "@/lib/commerce/contracts/types";
import { CommerceError } from "@/lib/commerce/contracts/errors";
import { validateCoupon, redeemCoupon, calculateGst } from "@/lib/commerce/services/coupons";
import { reserveInventory } from "@/lib/commerce/services/inventory";
import {
  createRazorpayOrder,
  processCodOrder,
} from "@/lib/commerce/services/payments";
import { createShipment } from "@/lib/commerce/services/shipping";
import { queueNotification } from "@/lib/commerce/services/notifications";
import { trackEvent } from "@/lib/commerce/services/analytics";

function toDbAddress(addr: Address) {
  return {
    full_name: addr.fullName,
    phone: addr.phone,
    address_line1: addr.addressLine1,
    address_line2: addr.addressLine2 ?? null,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    country: addr.country,
  };
}

async function resolveProductId(
  supabase: SupabaseClient,
  productId?: string,
  slug?: string
): Promise<string> {
  if (productId) return productId;
  if (!slug) {
    throw new CommerceError("VALIDATION_ERROR", "Product reference missing", 400);
  }
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error || !data) {
    throw new CommerceError("NOT_FOUND", `Product not found: ${slug}`, 404);
  }
  return data.id as string;
}

export async function syncServerCart(
  supabase: SupabaseClient,
  sessionToken: string,
  lines: Array<{ productId?: string; slug?: string; quantity: number; size?: string }>
) {
  let { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_token", sessionToken)
    .eq("status", "active")
    .single();

  if (!cart) {
    const { data: newCart, error } = await supabase
      .from("carts")
      .insert({
        session_token: sessionToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("id")
      .single();
    if (error || !newCart) throw new CommerceError("INTERNAL_ERROR", "Cart create failed", 500);
    cart = newCart;
  }

  await supabase.from("cart_items").delete().eq("cart_id", cart.id);

  for (const line of lines) {
    const resolvedId = await resolveProductId(supabase, line.productId, line.slug);
    const { data: product } = await supabase
      .from("products")
      .select("id, price, is_active, publish_status")
      .eq("id", resolvedId)
      .single();

    if (!product?.is_active || product.publish_status === "draft") {
      throw new CommerceError("NOT_FOUND", `Product unavailable: ${resolvedId}`, 404);
    }

    await supabase.from("cart_items").insert({
      cart_id: cart.id,
      product_id: resolvedId,
      quantity: line.quantity,
      unit_price: product.price,
      size: line.size ?? null,
    });
  }

  await supabase
    .from("carts")
    .update({ last_activity_at: new Date().toISOString() })
    .eq("id", cart.id);

  return { cartId: cart.id as string };
}

export async function createOrderFromCheckout(
  supabase: SupabaseClient,
  input: CreateCheckoutInput
) {
  const { data: existingKey } = await supabase
    .from("idempotency_keys")
    .select("response")
    .eq("key", input.idempotencyKey)
    .single();

  if (existingKey?.response) {
    return existingKey.response as Record<string, unknown>;
  }

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_token", input.sessionToken)
    .eq("status", "active")
    .single();

  if (!cart) {
    throw new CommerceError("NOT_FOUND", "Cart not found", 404);
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, products(id, name, sku, gst_rate, hsn_code, weight_grams)")
    .eq("cart_id", cart.id);

  if (!cartItems?.length) {
    throw new CommerceError("VALIDATION_ERROR", "Cart is empty", 400);
  }

  let subtotal = 0;
  let totalWeight = 0;
  const orderLines: Array<{
    productId: string;
    name: string;
    sku: string | null;
    size: string | null;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    hsn: string | null;
    lineTotal: number;
  }> = [];

  for (const item of cartItems) {
    const product = item.products as {
      id: string;
      name: string;
      sku: string | null;
      gst_rate: number;
      hsn_code: string | null;
      weight_grams: number | null;
    };
    const lineTotal = Number(item.unit_price) * item.quantity;
    subtotal += lineTotal;
    totalWeight += (product.weight_grams ?? 500) * item.quantity;
    orderLines.push({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      size: item.size,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      taxRate: Number(product.gst_rate ?? 5),
      hsn: product.hsn_code,
      lineTotal,
    });
  }

  let discountTotal = 0;
  let couponId: string | undefined;
  if (input.couponCode) {
    const couponResult = await validateCoupon(supabase, input.couponCode, subtotal);
    if (!couponResult.valid) {
      throw new CommerceError("COUPON_INVALID", couponResult.message ?? "Invalid coupon", 400);
    }
    discountTotal = couponResult.discountAmount;
    couponId = couponResult.couponId;
  }

  const taxableSubtotal = subtotal - discountTotal;
  const taxTotal = calculateGst(taxableSubtotal);
  const total = taxableSubtotal + input.shippingCost + taxTotal;

  const shippingAddr = toDbAddress(input.shippingAddress);
  const billingAddr = input.billingAddress
    ? toDbAddress(input.billingAddress)
    : shippingAddr;

  const { data: orderNumber } = await supabase.rpc("generate_order_number");

  let customerId: string | null = null;
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", input.email)
    .maybeSingle();

  if (existingCustomer) {
    customerId = existingCustomer.id as string;
    await supabase
      .from("customers")
      .update({
        phone: input.phone,
        full_name: input.shippingAddress.fullName,
      })
      .eq("id", customerId);
  } else {
    const { data: newCustomer } = await supabase
      .from("customers")
      .insert({
        email: input.email,
        phone: input.phone,
        full_name: input.shippingAddress.fullName,
      })
      .select("id")
      .single();
    customerId = (newCustomer?.id as string) ?? null;
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber ?? `VSH-${Date.now()}`,
      customer_id: customerId,
      email: input.email,
      phone: input.phone,
      status: "pending",
      payment_status: "pending",
      subtotal,
      shipping_total: input.shippingCost,
      tax_total: taxTotal,
      discount_total: discountTotal,
      total,
      shipping_address: shippingAddr,
      billing_address: billingAddr,
    })
    .select("id, order_number, total")
    .single();

  if (orderError || !order) {
    throw new CommerceError("INTERNAL_ERROR", "Order creation failed", 500);
  }

  for (const line of orderLines) {
    const lineTax = calculateGst(line.lineTotal, line.taxRate);
    await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: line.productId,
      product_name: line.name,
      product_sku: line.sku,
      size: line.size,
      quantity: line.quantity,
      unit_price: line.unitPrice,
      tax_rate: line.taxRate,
      tax_amount: lineTax,
      line_total: line.lineTotal,
      hsn_code: line.hsn,
    });
  }

  if (taxTotal > 0) {
    await supabase.from("tax_lines").insert({
      order_id: order.id,
      title: "GST (5%)",
      rate: 5,
      amount: taxTotal,
    });
  }

  await reserveInventory(
    supabase,
    order.id as string,
    orderLines.map((l) => ({ productId: l.productId, quantity: l.quantity }))
  );

  if (couponId) {
    await redeemCoupon(supabase, couponId, order.id as string, customerId, discountTotal);
  }

  const { data: checkoutSession } = await supabase
    .from("checkout_sessions")
    .insert({
      cart_id: cart.id,
      order_id: order.id,
      customer_id: customerId,
      email: input.email,
      phone: input.phone,
      shipping_address: shippingAddr,
      billing_address: billingAddr,
      shipping_method: input.shippingMethod,
      shipping_cost: input.shippingCost,
      tax_amount: taxTotal,
      discount_amount: discountTotal,
      coupon_id: couponId ?? null,
      payment_method: input.paymentMethod,
      status: "open",
      idempotency_key: input.idempotencyKey,
    })
    .select("id")
    .single();

  let paymentPayload: Record<string, unknown> = {};

  if (input.paymentMethod === "razorpay") {
    const rzOrder = await createRazorpayOrder(
      Math.round(total * 100),
      order.order_number as string
    );
    await supabase.from("payments").insert({
      order_id: order.id,
      provider: "razorpay",
      provider_order_id: rzOrder.id,
      amount: total,
      status: "pending",
      idempotency_key: `${input.idempotencyKey}-pay`,
    });
    paymentPayload = {
      razorpayOrderId: rzOrder.id,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "rzp_test_mock",
      amount: rzOrder.amount,
      currency: rzOrder.currency,
    };
  } else if (input.paymentMethod === "cod") {
    await processCodOrder(supabase, order.id as string, total);
    await createShipment(supabase, order.id as string, input.shippingMethod, totalWeight);
    paymentPayload = { cod: true };
  }

  await supabase
    .from("carts")
    .update({ status: "converted" })
    .eq("id", cart.id);

  await queueNotification(supabase, {
    channel: "email",
    recipient: input.email,
    template: "order_confirmation",
    payload: { orderId: order.id, orderNumber: order.order_number, total },
  });

  await trackEvent(supabase, {
    eventName: "checkout_completed",
    orderId: order.id as string,
    properties: { total, paymentMethod: input.paymentMethod },
  });

  const response = {
    orderId: order.id,
    orderNumber: order.order_number,
    total,
    checkoutSessionId: checkoutSession?.id,
    payment: paymentPayload,
  };

  await supabase.from("idempotency_keys").insert({
    key: input.idempotencyKey,
    resource_type: "checkout",
    resource_id: order.id,
    response,
  });

  return response;
}
