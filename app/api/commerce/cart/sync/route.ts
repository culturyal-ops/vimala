import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";
import { CommerceError, toApiError } from "@/lib/commerce/contracts/errors";
import { syncCartSchema } from "@/lib/commerce/contracts/schemas";
import { syncServerCart } from "@/lib/commerce/services/checkout";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting handled by middleware

    const body: unknown = await req.json();
    const parsed = syncCartSchema.safeParse(body);
    if (!parsed.success) {
      throw new CommerceError("VALIDATION_ERROR", parsed.error.message, 400);
    }

    const supabase = createAdminClient();
    const result = await syncServerCart(
      supabase,
      parsed.data.sessionToken,
      parsed.data.lines
    );
    return NextResponse.json(result);
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
