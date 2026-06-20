"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { lookupOrdersByEmail } from "@/app/account/actions";
import { useAuth } from "@/components/auth/AuthProvider";
import type { OrderSummary } from "@/lib/commerce/contracts/types";
import { formatPrice } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [pending, startTransition] = useTransition();

  function loadOrders(forEmail: string) {
    setError(null);
    startTransition(async () => {
      const result = await lookupOrdersByEmail(forEmail);
      setOrders(result.orders);
      setError(result.error ?? null);
      setSearched(true);
    });
  }

  useEffect(() => {
    if (authLoading) return;
    if (user?.email) {
      setEmail(user.email);
      loadOrders(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, authLoading]);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    loadOrders(email);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-medium text-crimson">
            {user ? "My Account" : "Your Orders"}
          </h1>
          <p className="mt-3 font-body text-sm text-ink/55">
            {user
              ? `Signed in as ${user.email}`
              : "Enter the email used at checkout, or sign in to see your orders."}
          </p>
        </div>
        {user ? (
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sign out
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>

      {!user && (
        <form onSubmit={handleLookup} className="mt-8 flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-lg border border-gold/25 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-crimson/40"
          />
          <Button type="submit" disabled={pending}>
            {pending ? "Loading…" : "Look up"}
          </Button>
        </form>
      )}

      {error && (
        <p className="mt-4 font-body text-sm text-crimson">{error}</p>
      )}

      {searched && !error && orders.length === 0 && (
        <p className="mt-8 font-body text-sm text-ink/50">
          No orders found for this email.
        </p>
      )}

      {orders.length > 0 && (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-xl border border-gold/20 bg-ivory-warm p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-ink">
                    {order.orderNumber}
                  </p>
                  <p className="font-body text-xs text-ink/45">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-body text-lg font-semibold text-crimson">
                    {formatPrice(order.total)}
                  </p>
                  <p className="font-body text-xs text-ink/50">
                    {STATUS_LABELS[order.status] ?? order.status}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href={`/account/orders/${order.id}`}>View details</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
