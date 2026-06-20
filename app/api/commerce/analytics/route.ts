import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";
import { CommerceError, toApiError } from "@/lib/commerce/contracts/errors";
import { analyticsEventSchema } from "@/lib/commerce/contracts/schemas";
import { trackEvent } from "@/lib/commerce/services/analytics";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting handled by middleware

    const body: unknown = await req.json();
    const parsed = analyticsEventSchema.safeParse(body);
    if (!parsed.success) {
      throw new CommerceError("VALIDATION_ERROR", parsed.error.message, 400);
    }

    const supabase = createAdminClient();
    await trackEvent(supabase, {
      eventName: parsed.data.eventName,
      sessionId: parsed.data.sessionId,
      productId: parsed.data.productId,
      properties: parsed.data.properties,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
