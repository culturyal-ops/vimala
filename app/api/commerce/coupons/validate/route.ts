import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";
import { CommerceError, toApiError } from "@/lib/commerce/contracts/errors";
import { validateCouponSchema } from "@/lib/commerce/contracts/schemas";
import { validateCoupon } from "@/lib/commerce/services/coupons";
import { rateLimit } from "@/lib/commerce/middleware/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req);
    if (limited) return limited;

    const body: unknown = await req.json();
    const parsed = validateCouponSchema.safeParse(body);
    if (!parsed.success) {
      throw new CommerceError("VALIDATION_ERROR", parsed.error.message, 400);
    }

    const supabase = createAdminClient();
    const result = await validateCoupon(
      supabase,
      parsed.data.code,
      parsed.data.subtotal
    );
    return NextResponse.json(result);
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
