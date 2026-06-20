import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/client";
import { CommerceError, toApiError } from "@/lib/commerce/contracts/errors";
import { snapshotAbandonedCart } from "@/lib/commerce/services/abandoned-cart";
import { rateLimit } from "@/lib/commerce/middleware/rate-limit";

const abandonedCartSchema = z.object({
  sessionToken: z.string().min(8).max(64),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, 30);
    if (limited) return limited;

    const body: unknown = await req.json();
    const parsed = abandonedCartSchema.safeParse(body);
    if (!parsed.success) {
      throw new CommerceError("VALIDATION_ERROR", parsed.error.message, 400);
    }

    const supabase = createAdminClient();
    await snapshotAbandonedCart(
      supabase,
      parsed.data.sessionToken,
      parsed.data.email,
      parsed.data.phone
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
