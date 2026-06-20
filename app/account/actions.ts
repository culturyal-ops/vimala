"use server";

import { createAdminClient } from "@/lib/supabase/client";
import { listOrders } from "@/lib/commerce/services/orders";
import type { OrderSummary } from "@/lib/commerce/contracts/types";

export async function linkCustomerAccount(input: {
  authUserId: string;
  email: string;
  fullName: string;
}) {
  try {
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("email", input.email)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("customers")
        .update({
          auth_user_id: input.authUserId,
          full_name: input.fullName,
        })
        .eq("id", existing.id);
      return;
    }

    await supabase.from("customers").insert({
      email: input.email,
      full_name: input.fullName,
      auth_user_id: input.authUserId,
    });
  } catch {
    // Non-fatal — account still works via email lookup
  }
}

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
