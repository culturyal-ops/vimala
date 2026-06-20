import type { SupabaseClient } from "@supabase/supabase-js";
import type { OrderDetail } from "@/lib/commerce/contracts/types";
import { CommerceError } from "@/lib/commerce/contracts/errors";
import { releaseReservations } from "@/lib/commerce/services/inventory";
import { queueNotification } from "@/lib/commerce/services/notifications";

function mapAddress(raw: Record<string, string> | null) {
  if (!raw) return null;
  return {
    fullName: raw.full_name,
    phone: raw.phone,
    addressLine1: raw.address_line1,
    addressLine2: raw.address_line2 ?? undefined,
    city: raw.city,
    state: raw.state,
    pincode: raw.pincode,
    country: raw.country,
  };
}

export async function getOrderDetail(
  supabase: SupabaseClient,
  orderId: string
): Promise<OrderDetail> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    throw new CommerceError("NOT_FOUND", "Order not found", 404);
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_name, quantity, unit_price, line_total, size")
    .eq("order_id", orderId);

  const { data: shipments } = await supabase
    .from("shipments")
    .select("id, awb, courier_name, tracking_url, status")
    .eq("order_id", orderId);

  return {
    id: order.id as string,
    orderNumber: order.order_number as string,
    status: order.status,
    paymentStatus: order.payment_status,
    fulfillmentStatus: order.fulfillment_status,
    total: Number(order.total),
    currency: order.currency as string,
    createdAt: order.created_at as string,
    email: order.email as string | null,
    phone: order.phone as string | null,
    subtotal: Number(order.subtotal),
    shippingTotal: Number(order.shipping_total),
    taxTotal: Number(order.tax_total),
    discountTotal: Number(order.discount_total),
    shippingAddress: mapAddress(order.shipping_address as Record<string, string>),
    items: (items ?? []).map((i) => ({
      id: i.id as string,
      productName: i.product_name as string,
      quantity: i.quantity as number,
      unitPrice: Number(i.unit_price),
      lineTotal: Number(i.line_total),
      size: i.size as string | null,
    })),
    shipments: (shipments ?? []).map((s) => ({
      id: s.id as string,
      awb: s.awb as string | null,
      courierName: s.courier_name as string | null,
      trackingUrl: s.tracking_url as string | null,
      status: s.status,
    })),
  };
}

export async function listOrders(
  supabase: SupabaseClient,
  filters: {
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  let query = supabase
    .from("orders")
    .select("*", { count: "exact" });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.search) {
    query = query.or(
      `order_number.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
    );
  }

  const from = (page - 1) * pageSize;
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) throw new CommerceError("INTERNAL_ERROR", error.message, 500);
  return { orders: data ?? [], total: count ?? 0 };
}

export async function updateOrderStatus(
  supabase: SupabaseClient,
  orderId: string,
  updates: {
    status?: string;
    fulfillmentStatus?: string;
    notes?: string;
  },
  staffUserId?: string
): Promise<void> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.status) patch.status = updates.status;
  if (updates.fulfillmentStatus) patch.fulfillment_status = updates.fulfillmentStatus;
  if (updates.notes) patch.notes = updates.notes;

  if (updates.status === "cancelled") {
    patch.cancelled_at = new Date().toISOString();
    await releaseReservations(supabase, orderId);
  }
  if (updates.status === "shipped") patch.shipped_at = new Date().toISOString();
  if (updates.status === "delivered") patch.delivered_at = new Date().toISOString();

  const { data: order } = await supabase
    .from("orders")
    .update(patch)
    .eq("id", orderId)
    .select("email, order_number")
    .single();

  if (order?.email && updates.status) {
    await queueNotification(supabase, {
      channel: "email",
      recipient: order.email as string,
      template: `order_${updates.status}`,
      payload: { orderId, orderNumber: order.order_number },
    });
  }

  if (staffUserId) {
    await supabase.from("audit_log").insert({
      user_id: staffUserId,
      action: "update",
      resource_type: "order",
      resource_id: orderId,
      changes: updates,
    });
  }
}
