import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/client";
import { CommerceError, toApiError } from "@/lib/commerce/contracts/errors";
import { updateShipmentFromWebhook } from "@/lib/commerce/services/shipping";

const shiprocketWebhookSchema = z.object({
  awb: z.string().min(1),
  current_status: z.string().min(1),
  current_status_id: z.number().optional(),
  shipment_status: z.string().optional(),
  remarks: z.string().optional(),
});

const STATUS_MAP: Record<string, string> = {
  "6": "in_transit",
  "7": "delivered",
  "17": "rto",
  "18": "cancelled",
  "19": "picked_up",
  in_transit: "in_transit",
  delivered: "delivered",
  rto: "rto",
  cancelled: "cancelled",
  picked_up: "picked_up",
};

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("x-shiprocket-token");
    const expected = process.env.SHIPROCKET_WEBHOOK_TOKEN;
    if (expected && token !== expected) {
      throw new CommerceError("UNAUTHORIZED", "Invalid webhook token", 401);
    }

    const body: unknown = await req.json();
    const parsed = shiprocketWebhookSchema.safeParse(body);
    if (!parsed.success) {
      throw new CommerceError("VALIDATION_ERROR", parsed.error.message, 400);
    }

    const statusKey =
      parsed.data.current_status_id !== undefined
        ? String(parsed.data.current_status_id)
        : parsed.data.current_status.toLowerCase();
    const mappedStatus = STATUS_MAP[statusKey] ?? "in_transit";

    const supabase = createAdminClient();
    await updateShipmentFromWebhook(
      supabase,
      parsed.data.awb,
      mappedStatus,
      parsed.data.remarks ?? parsed.data.shipment_status
    );

    return NextResponse.json({ received: true });
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
