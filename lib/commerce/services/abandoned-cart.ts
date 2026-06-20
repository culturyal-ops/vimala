import type { SupabaseClient } from "@supabase/supabase-js";

export async function snapshotAbandonedCart(
  supabase: SupabaseClient,
  sessionToken: string,
  email?: string,
  phone?: string
): Promise<void> {
  const { data: cart } = await supabase
    .from("carts")
    .select("id, customer_id")
    .eq("session_token", sessionToken)
    .eq("status", "active")
    .single();

  if (!cart) return;

  const { data: items } = await supabase
    .from("cart_items")
    .select("quantity, unit_price, size, products(name, thumbnail)")
    .eq("cart_id", cart.id);

  if (!items?.length) return;

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.unit_price) * i.quantity,
    0
  );

  const { data: existing } = await supabase
    .from("abandoned_cart_snapshots")
    .select("id")
    .eq("cart_id", cart.id)
    .eq("recovery_status", "open")
    .single();

  const payload = {
    cart_id: cart.id,
    customer_id: cart.customer_id,
    email: email ?? null,
    phone: phone ?? null,
    items,
    subtotal,
    recovery_status: "open",
  };

  if (existing) {
    await supabase
      .from("abandoned_cart_snapshots")
      .update(payload)
      .eq("id", existing.id);
  } else {
    await supabase.from("abandoned_cart_snapshots").insert(payload);
  }

  await supabase
    .from("carts")
    .update({ status: "abandoned" })
    .eq("id", cart.id);
}

export async function sendAbandonedCartReminders(
  supabase: SupabaseClient
): Promise<number> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: carts } = await supabase
    .from("abandoned_cart_snapshots")
    .select("id, email, phone, subtotal, items")
    .eq("recovery_status", "open")
    .lt("created_at", oneDayAgo)
    .is("last_reminder_at", null)
    .limit(20);

  if (!carts?.length) return 0;

  for (const cart of carts) {
    const recipient = cart.email ?? cart.phone;
    if (!recipient) continue;

    await supabase.from("notifications").insert({
      channel: cart.email ? "email" : "whatsapp",
      recipient,
      template: "abandoned_cart",
      payload: { subtotal: cart.subtotal, items: cart.items },
      status: "pending",
    });

    await supabase
      .from("abandoned_cart_snapshots")
      .update({
        recovery_status: "email_sent",
        last_reminder_at: new Date().toISOString(),
      })
      .eq("id", cart.id);
  }

  return carts.length;
}

export async function computeCustomerSegments(
  supabase: SupabaseClient
): Promise<void> {
  const { data: customers } = await supabase
    .from("customers")
    .select("id, lifetime_value, order_count");

  for (const c of customers ?? []) {
    let segment = "regular";
    if ((c.order_count as number) >= 5) segment = "vip";
    else if ((c.order_count as number) === 0) segment = "prospect";
    else if (Number(c.lifetime_value) >= 50000) segment = "high_value";

    await supabase
      .from("customers")
      .update({ segment })
      .eq("id", c.id);
  }
}
