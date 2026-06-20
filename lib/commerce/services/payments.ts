import type { SupabaseClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";
import { CommerceError } from "@/lib/commerce/contracts/errors";
import { commitReservations } from "@/lib/commerce/services/inventory";

type RazorpayOrderResponse = {
  id: string;
  amount: number;
  currency: string;
};

export async function createRazorpayOrder(
  amountPaise: number,
  receipt: string
): Promise<RazorpayOrderResponse> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return {
      id: `order_mock_${receipt}`,
      amount: amountPaise,
      currency: "INR",
    };
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new CommerceError("PAYMENT_FAILED", `Razorpay order failed: ${err}`, 502);
  }

  return res.json() as Promise<RazorpayOrderResponse>;
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return true;
  const body = `${orderId}|${paymentId}`;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

export async function recordPayment(
  supabase: SupabaseClient,
  orderId: string,
  amount: number,
  providerOrderId: string,
  providerPaymentId: string | null,
  status: string,
  idempotencyKey: string
): Promise<void> {
  const { data: existing } = await supabase
    .from("idempotency_keys")
    .select("resource_id")
    .eq("key", idempotencyKey)
    .single();

  if (existing?.resource_id) return;

  await supabase.from("payments").insert({
    order_id: orderId,
    provider: "razorpay",
    provider_order_id: providerOrderId,
    provider_payment_id: providerPaymentId,
    amount,
    status,
    idempotency_key: idempotencyKey,
  });

  await supabase.from("idempotency_keys").insert({
    key: idempotencyKey,
    resource_type: "payment",
    resource_id: orderId,
  });
}

export async function markOrderPaid(
  supabase: SupabaseClient,
  orderId: string,
  paymentId: string
): Promise<void> {
  await supabase
    .from("orders")
    .update({
      status: "paid",
      payment_status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  await supabase
    .from("payments")
    .update({
      status: "captured",
      provider_payment_id: paymentId,
    })
    .eq("order_id", orderId);

  await commitReservations(supabase, orderId);
}

export async function processCodOrder(
  supabase: SupabaseClient,
  orderId: string,
  total: number
): Promise<void> {
  await supabase.from("payments").insert({
    order_id: orderId,
    provider: "cod",
    amount: total,
    status: "pending",
    method: "cod",
  });

  await supabase
    .from("orders")
    .update({
      status: "processing",
      payment_status: "pending",
    })
    .eq("id", orderId);

  await commitReservations(supabase, orderId);
}
