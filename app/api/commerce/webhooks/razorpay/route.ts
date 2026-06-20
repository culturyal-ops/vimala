import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/client";
import { toApiError } from "@/lib/commerce/contracts/errors";
import { markOrderPaid } from "@/lib/commerce/services/payments";
import { createShipment } from "@/lib/commerce/services/shipping";

function verifyWebhookSignature(body: string, signature: string | null): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return true;
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

type RazorpayWebhookPayload = {
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id: string;
        order_id: string;
        status: string;
      };
    };
  };
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Invalid signature" } },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody) as RazorpayWebhookPayload;

    if (
      event.event === "payment.captured" &&
      event.payload?.payment?.entity
    ) {
      const payment = event.payload.payment.entity;
      const supabase = createAdminClient();

      const { data: paymentRow } = await supabase
        .from("payments")
        .select("order_id")
        .eq("provider_order_id", payment.order_id)
        .single();

      if (paymentRow?.order_id) {
        const orderId = paymentRow.order_id as string;
        await markOrderPaid(supabase, orderId, payment.id);

        const { data: session } = await supabase
          .from("checkout_sessions")
          .select("shipping_method")
          .eq("order_id", orderId)
          .single();

        const { data: items } = await supabase
          .from("order_items")
          .select("quantity, products(weight_grams)")
          .eq("order_id", orderId);

        let weightGrams = 0;
        for (const item of items ?? []) {
          const product = item.products as unknown as {
            weight_grams: number | null;
          } | null;
          weightGrams +=
            (product?.weight_grams ?? 500) * (item.quantity as number);
        }

        await createShipment(
          supabase,
          orderId,
          (session?.shipping_method as string) ?? "standard",
          weightGrams
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
