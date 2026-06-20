import type { SupabaseClient } from "@supabase/supabase-js";
import type { AnalyticsEventName } from "@/lib/commerce/contracts/types";

export async function trackEvent(
  supabase: SupabaseClient,
  input: {
    eventName: AnalyticsEventName;
    sessionId?: string;
    customerId?: string;
    orderId?: string;
    productId?: string;
    properties?: Record<string, unknown>;
  }
): Promise<void> {
  await supabase.from("analytics_events").insert({
    event_name: input.eventName,
    session_id: input.sessionId ?? null,
    customer_id: input.customerId ?? null,
    order_id: input.orderId ?? null,
    product_id: input.productId ?? null,
    properties: input.properties ?? {},
  });
}

export async function getCommerceDashboardStats(supabase: SupabaseClient) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [ordersRes, revenueRes, returnsRes, abandonedRes, eventsRes] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo),
      supabase
        .from("orders")
        .select("total")
        .gte("created_at", thirtyDaysAgo)
        .in("payment_status", ["paid", "pending"]),
      supabase
        .from("returns")
        .select("id", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo),
      supabase
        .from("abandoned_cart_snapshots")
        .select("id", { count: "exact", head: true })
        .eq("recovery_status", "open"),
      supabase
        .from("analytics_events")
        .select("event_name")
        .gte("created_at", thirtyDaysAgo),
    ]);

  const revenue = (revenueRes.data ?? []).reduce(
    (sum, o) => sum + Number(o.total),
    0
  );

  const funnel = {
    productViews: 0,
    addToCart: 0,
    checkoutStarted: 0,
    checkoutCompleted: 0,
  };

  for (const e of eventsRes.data ?? []) {
    if (e.event_name === "product_view") funnel.productViews++;
    if (e.event_name === "add_to_cart") funnel.addToCart++;
    if (e.event_name === "checkout_started") funnel.checkoutStarted++;
    if (e.event_name === "checkout_completed") funnel.checkoutCompleted++;
  }

  return {
    ordersLast30Days: ordersRes.count ?? 0,
    revenueLast30Days: revenue,
    returnsLast30Days: returnsRes.count ?? 0,
    openAbandonedCarts: abandonedRes.count ?? 0,
    funnel,
    conversionRate:
      funnel.checkoutStarted > 0
        ? Math.round((funnel.checkoutCompleted / funnel.checkoutStarted) * 100)
        : 0,
  };
}
