import { NextRequest, NextResponse } from "next/server";
import { CommerceError, toApiError } from "@/lib/commerce/contracts/errors";

export const dynamic = "force-dynamic";
import { shippingRatesSchema } from "@/lib/commerce/contracts/schemas";
import { calculateShippingRates } from "@/lib/commerce/services/shipping";
import { rateLimit } from "@/lib/commerce/middleware/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const limited = rateLimit(req);
    if (limited) return limited;

    const params = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = shippingRatesSchema.safeParse({
      pincode: params.pincode,
      weightGrams: params.weightGrams
        ? Number(params.weightGrams)
        : undefined,
    });
    if (!parsed.success) {
      throw new CommerceError("VALIDATION_ERROR", parsed.error.message, 400);
    }

    const rates = calculateShippingRates(
      parsed.data.pincode,
      parsed.data.weightGrams ?? 500
    );
    return NextResponse.json({ rates });
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
