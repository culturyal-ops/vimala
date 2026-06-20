import type { SupabaseClient } from "@supabase/supabase-js";
import { CommerceError } from "@/lib/commerce/contracts/errors";
import { releaseReservations } from "@/lib/commerce/services/inventory";

export async function createReturnRequest(
  supabase: SupabaseClient,
  orderId: string,
  reason: string,
  items: Array<{ orderItemId: string; quantity: number }>
) {
  const { data: order } = await supabase
    .from("orders")
    .select("id, status, order_number")
    .eq("id", orderId)
    .single();

  if (!order) {
    throw new CommerceError("NOT_FOUND", "Order not found", 404);
  }
  if (!["delivered", "shipped", "paid", "processing"].includes(order.status as string)) {
    throw new CommerceError("VALIDATION_ERROR", "Order not eligible for return", 400);
  }

  const { data: returnNumber } = await supabase.rpc("generate_return_number");

  const { data: ret, error } = await supabase
    .from("returns")
    .insert({
      order_id: orderId,
      return_number: returnNumber ?? `RET-${Date.now()}`,
      reason,
      status: "requested",
    })
    .select("id, return_number")
    .single();

  if (error || !ret) {
    throw new CommerceError("INTERNAL_ERROR", "Return creation failed", 500);
  }

  for (const item of items) {
    await supabase.from("return_items").insert({
      return_id: ret.id,
      order_item_id: item.orderItemId,
      quantity: item.quantity,
    });
  }

  return ret;
}

export async function approveReturn(
  supabase: SupabaseClient,
  returnId: string,
  staffUserId: string,
  refundAmount: number,
  restock = true
): Promise<void> {
  const { data: ret } = await supabase
    .from("returns")
    .select("id, order_id")
    .eq("id", returnId)
    .single();

  if (!ret) throw new CommerceError("NOT_FOUND", "Return not found", 404);

  await supabase
    .from("returns")
    .update({
      status: "approved",
      refund_amount: refundAmount,
      restock,
      approved_by: staffUserId,
    })
    .eq("id", returnId);

  if (restock) {
    const { data: returnItems } = await supabase
      .from("return_items")
      .select("quantity, order_items(product_id)")
      .eq("return_id", returnId);

    for (const ri of returnItems ?? []) {
      const productId = (ri.order_items as unknown as { product_id: string })
        .product_id;
      const { data: product } = await supabase
        .from("products")
        .select("inventory_quantity")
        .eq("id", productId)
        .single();

      if (product) {
        const newQty = (product.inventory_quantity as number) + ri.quantity;
        await supabase
          .from("products")
          .update({
            inventory_quantity: newQty,
            stock_status: newQty === 0 ? "out_of_stock" : newQty <= 5 ? "low_stock" : "in_stock",
          })
          .eq("id", productId);
      }
    }
  }

  await supabase
    .from("orders")
    .update({
      status: "refunded",
      payment_status: "refunded",
      fulfillment_status: "returned",
    })
    .eq("id", ret.order_id);

  await releaseReservations(supabase, ret.order_id as string);
}
