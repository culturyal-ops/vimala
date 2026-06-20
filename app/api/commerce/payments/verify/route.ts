import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";
import { CommerceError, toApiError } from "@/lib/commerce/contracts/errors";
import { razorpayVerifySchema } from "@/lib/commerce/contracts/schemas";
import {
  verifyRazorpaySignature,
  markOrderPaid,
} from "@/lib/commerce/services/payments";
import { createShipment } from "@/lib/commerce/services/shipping";
import { queueNotification } from "@/lib/commerce/services/notifications";
import { rateLimit } from "@/lib/commerce/middleware/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, 20);
    if (limited) return limited;

    const body: unknown = await req.json();
    const parsed = razorpayVerifySchema.safeParse(body);
    if (!parsed.success) {
      throw new CommerceError("VALIDATION_ERROR", parsed.error.message, 400);
    }

    const valid = verifyRazorpaySignature(
      parsed.data.razorpay_order_id,
      parsed.data.razorpay_payment_id,
      parsed.data.razorpay_signature
    );
    if (!valid) {
      throw new CommerceError("PAYMENT_FAILED", "Invalid payment signature", 400);
    }

    const supabase = createAdminClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id, email, order_number, total, payment_status")
      .eq("id", parsed.data.orderId)
      .single();

    if (!order) {
      throw new CommerceError("NOT_FOUND", "Order not found", 404);
    }

    if (order.payment_status !== "paid") {
      await markOrderPaid(
        supabase,
        parsed.data.orderId,
        parsed.data.razorpay_payment_id
      );

      const { data: session } = await supabase
        .from("checkout_sessions")
        .select("shipping_method")
        .eq("order_id", parsed.data.orderId)
        .single();

      const { data: items } = await supabase
        .from("order_items")
        .select("quantity, products(weight_grams)")
        .eq("order_id", parsed.data.orderId);

      let weightGrams = 0;
      for (const item of items ?? []) {
        const product = item.products as unknown as {
          weight_grams: number | null;
        } | null;
        weightGrams += (product?.weight_grams ?? 500) * (item.quantity as number);
      }

      await createShipment(
        supabase,
        parsed.data.orderId,
        (session?.shipping_method as string) ?? "standard",
        weightGrams
      );

      if (order.email) {
        await queueNotification(supabase, {
          channel: "email",
          recipient: order.email as string,
          template: "payment_confirmed",
          payload: {
            orderId: order.id,
            orderNumber: order.order_number,
            total: order.total,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      orderId: parsed.data.orderId,
    });
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
