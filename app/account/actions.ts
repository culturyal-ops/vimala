"use server";

import { createAdminClient } from "@/lib/supabase/client";
import { listOrders } from "@/lib/commerce/services/orders";
import type { OrderSummary } from "@/lib/commerce/contracts/types";

export async function lookupOrdersByEmail(
  email: string
): Promise<{ orders: OrderSummary[]; error?: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) {
    return { orders: [], error: "Enter a valid email address" };
  }

  try {
    const supabase = createAdminClient();
    const { orders } = await listOrders(supabase, {
      search: trimmed,
      pageSize: 50,
    });

    const matched = (orders ?? [])
      .filter((o) => (o.email as string | null)?.toLowerCase() === trimmed)
      .map(
        (o): OrderSummary => ({
          id: o.id as string,
          orderNumber: o.order_number as string,
          status: o.status,
          paymentStatus: o.payment_status,
          fulfillmentStatus: o.fulfillment_status,
          total: Number(o.total),
          currency: (o.currency as string) ?? "INR",
          createdAt: o.created_at as string,
        })
      );

    return { orders: matched };
  } catch {
    return { orders: [], error: "Unable to load orders. Try again later." };
  }
}
