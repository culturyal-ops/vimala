import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";
import { CommerceError, toApiError } from "@/lib/commerce/contracts/errors";
import { getOrderDetail } from "@/lib/commerce/services/orders";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting handled by middleware

    const orderId = params.id;
    if (!orderId || !/^[0-9a-f-]{36}$/i.test(orderId)) {
      throw new CommerceError("VALIDATION_ERROR", "Invalid order ID", 400);
    }

    const supabase = createAdminClient();
    const order = await getOrderDetail(supabase, orderId);
    return NextResponse.json(order);
  } catch (error) {
    const { status, body } = toApiError(error);
    return NextResponse.json(body, { status });
  }
}
