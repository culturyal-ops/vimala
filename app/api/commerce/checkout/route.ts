import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";
import { CommerceError, toApiError } from "@/lib/commerce/contracts/errors";
import { createCheckoutSchema } from "@/lib/commerce/contracts/schemas";
import { createOrderFromCheckout } from "@/lib/commerce/services/checkout";
import { trackEvent } from "@/lib/commerce/services/analytics";
import { rateLimit } from "@/lib/commerce/middleware/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, 30);
    if (limited) return limited;

    const body: unknown = await req.json();
    const parsed = createCheckoutSchema.safeParse(body);
    if (!parsed.success) {
      throw new CommerceError("VALIDATION_ERROR", parsed.error.message, 400);
    }

    const supabase = createAdminClient();
    await trackEvent(supabase, {
      eventName: "checkout_started",
      sessionId: parsed.data.sessionToken,
      properties: { paymentMethod: parsed.data.paymentMethod },
    });

    const result = await createOrderFromCheckout(supabase, parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
