import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/client";
import { CommerceError, toApiError } from "@/lib/commerce/contracts/errors";
import { createRazorpayOrder } from "@/lib/commerce/services/payments";
import { rateLimit } from "@/lib/commerce/middleware/rate-limit";

const razorpayOrderSchema = z.object({
  orderId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, 20);
    if (limited) return limited;

    const body: unknown = await req.json();
    const parsed = razorpayOrderSchema.safeParse(body);
    if (!parsed.success) {
      throw new CommerceError("VALIDATION_ERROR", parsed.error.message, 400);
    }

    const supabase = createAdminClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, order_number, total, payment_status")
      .eq("id", parsed.data.orderId)
      .single();

    if (error || !order) {
      throw new CommerceError("NOT_FOUND", "Order not found", 404);
    }
    if (order.payment_status === "paid") {
      throw new CommerceError("VALIDATION_ERROR", "Order already paid", 400);
    }

    const amountPaise = Math.round(Number(order.total) * 100);
    const rzOrder = await createRazorpayOrder(
      amountPaise,
      order.order_number as string
    );

    await supabase.from("payments").insert({
      order_id: order.id,
      provider: "razorpay",
      provider_order_id: rzOrder.id,
      amount: order.total,
      status: "pending",
    });

    return NextResponse.json({
      razorpayOrderId: rzOrder.id,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "rzp_test_mock",
      amount: rzOrder.amount,
      currency: rzOrder.currency,
      orderId: order.id,
    });
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
