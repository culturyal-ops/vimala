import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";
import { CommerceError, toApiError } from "@/lib/commerce/contracts/errors";
import { createReturnSchema } from "@/lib/commerce/contracts/schemas";
import { createReturnRequest } from "@/lib/commerce/services/returns";
import { rateLimit } from "@/lib/commerce/middleware/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, 20);
    if (limited) return limited;

    const body: unknown = await req.json();
    const parsed = createReturnSchema.safeParse(body);
    if (!parsed.success) {
      throw new CommerceError("VALIDATION_ERROR", parsed.error.message, 400);
    }

    const supabase = createAdminClient();
    const result = await createReturnRequest(
      supabase,
      parsed.data.orderId,
      parsed.data.reason,
      parsed.data.items
    );
    return NextResponse.json(result);
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
