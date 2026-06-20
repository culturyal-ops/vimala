import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/client";
import { getOrderDetail } from "@/lib/commerce/services/orders";
import { formatPrice } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = pageMetadata({
  title: "Order Details | Vimala Silk House",
  description: "View your Vimala Silk House order status and shipment details.",
  path: "/account/orders",
});

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let order;
  try {
    const supabase = createAdminClient();
    order = await getOrderDetail(supabase, params.id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-16">
      <Button variant="outline" size="sm" asChild>
        <Link href="/account">← Back to orders</Link>
      </Button>

      <h1 className="mt-6 font-display text-3xl font-medium text-crimson">
        Order {order.orderNumber}
      </h1>
      <p className="mt-2 font-body text-sm text-ink/50">
        Placed{" "}
        {new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        · {STATUS_LABELS[order.status] ?? order.status}
      </p>

      <section className="mt-8 rounded-xl border border-gold/20 bg-ivory-warm p-6">
        <h2 className="font-display text-lg text-ink">Items</h2>
        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between font-body text-sm"
            >
              <span>
                {item.productName}
                {item.size ? ` · Size ${item.size}` : ""} × {item.quantity}
              </span>
              <span className="text-ink/70">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-gold/15 pt-4 font-body text-sm">
          <div className="flex justify-between text-ink/60">
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-ink/60">
            <dt>Shipping</dt>
            <dd>{formatPrice(order.shippingTotal)}</dd>
          </div>
          {order.discountTotal > 0 && (
            <div className="flex justify-between text-green-700">
              <dt>Discount</dt>
              <dd>−{formatPrice(order.discountTotal)}</dd>
            </div>
          )}
          <div className="flex justify-between text-ink/60">
            <dt>Tax (GST)</dt>
            <dd>{formatPrice(order.taxTotal)}</dd>
          </div>
          <div className="flex justify-between font-semibold text-crimson">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      {order.shippingAddress && (
        <section className="mt-6 rounded-xl border border-gold/20 p-6">
          <h2 className="font-display text-lg text-ink">Shipping address</h2>
          <address className="mt-3 not-italic font-body text-sm text-ink/70">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.addressLine1}
            {order.shippingAddress.addressLine2 && (
              <>
                <br />
                {order.shippingAddress.addressLine2}
              </>
            )}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.pincode}
            <br />
            {order.shippingAddress.phone}
          </address>
        </section>
      )}

      {order.shipments.length > 0 && (
        <section className="mt-6 rounded-xl border border-gold/20 p-6">
          <h2 className="font-display text-lg text-ink">Shipment</h2>
          {order.shipments.map((s) => (
            <div key={s.id} className="mt-3 font-body text-sm text-ink/70">
              {s.courierName && <p>{s.courierName}</p>}
              {s.awb && <p>AWB: {s.awb}</p>}
              {s.trackingUrl && (
                <a
                  href={s.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crimson underline"
                >
                  Track shipment
                </a>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
