"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, Truck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { calculateGst } from "@/lib/commerce/services/coupons";
import type { ShippingRate } from "@/lib/commerce/contracts/types";
import {
  createCheckout,
  fetchShippingRates,
  syncCart,
  trackAnalyticsEvent,
  validateCoupon,
  verifyRazorpayPayment,
  snapshotAbandonedCart,
  CommerceApiError,
} from "@/lib/commerce/client";

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { open: () => void };

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "Kerala",
  pincode: "",
  country: "IN" as const,
};

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, clearBag } = useCart();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [loadingRates, setLoadingRates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weightGrams = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * 500, 0),
    [items]
  );

  const taxTotal = useMemo(
    () => calculateGst(Math.max(0, subtotal - discount)),
    [subtotal, discount]
  );
  const total = subtotal - discount + shippingCost + taxTotal;

  const syncServerCart = useCallback(async () => {
    await syncCart(
      items.map((item) => ({
        productId: item.productId,
        slug: item.slug,
        quantity: item.quantity,
        size: item.size,
      }))
    );
  }, [items]);

  useEffect(() => {
    if (items.length === 0) return;
    syncServerCart().catch(() => undefined);
    trackAnalyticsEvent({ eventName: "checkout_started" }).catch(() => undefined);
  }, [items.length, syncServerCart]);

  useEffect(() => {
    loadRazorpayScript().catch(() => undefined);
  }, []);

  useEffect(() => {
    const onLeave = () => {
      if (email || phone) {
        snapshotAbandonedCart({ email: email || undefined, phone: phone || undefined }).catch(
          () => undefined
        );
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [email, phone]);

  async function fetchRates(pincode: string) {
    if (!/^\d{6}$/.test(pincode)) return;
    setLoadingRates(true);
    try {
      const { rates } = await fetchShippingRates(pincode, weightGrams);
      setShippingRates(rates);
      if (rates.length > 0 && !shippingMethod) {
        setShippingMethod(rates[0].id);
        setShippingCost(rates[0].cost);
      }
    } catch {
      setError("Could not load shipping rates. Check pincode.");
    } finally {
      setLoadingRates(false);
    }
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponMessage(null);
    try {
      const result = await validateCoupon(couponCode.trim(), subtotal);
      if (result.valid) {
        setDiscount(result.discountAmount);
        setCouponMessage(`Applied. Saved ${formatPrice(result.discountAmount)}`);
      } else {
        setDiscount(0);
        setCouponMessage(result.message ?? "Invalid coupon");
      }
    } catch (err) {
      setDiscount(0);
      setCouponMessage(
        err instanceof CommerceApiError ? err.message : "Coupon check failed"
      );
    }
  }

  function selectShipping(rate: ShippingRate) {
    setShippingMethod(rate.id);
    setShippingCost(rate.cost);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!shippingMethod) {
      setError("Select a shipping method");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await syncServerCart();
      const idempotencyKey = crypto.randomUUID();
      const result = await createCheckout({
        email,
        phone,
        shippingAddress: { ...address, phone },
        shippingMethod,
        shippingCost,
        paymentMethod,
        couponCode: discount > 0 ? couponCode.trim() : undefined,
        idempotencyKey,
      });

      if (paymentMethod === "cod") {
        clearBag();
        router.push(`/account/orders/${result.orderId}`);
        return;
      }

      const { payment } = result;
      if (!payment.razorpayOrderId || !payment.razorpayKeyId) {
        throw new Error("Payment setup failed");
      }

      await loadRazorpayScript();
      if (!window.Razorpay) throw new Error("Razorpay unavailable");

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay!({
          key: payment.razorpayKeyId,
          amount: payment.amount,
          currency: payment.currency ?? "INR",
          name: "Vimala Silk House",
          description: `Order ${result.orderNumber}`,
          order_id: payment.razorpayOrderId,
          prefill: {
            name: address.fullName,
            email,
            contact: phone,
          },
          handler: async (response: RazorpayHandlerResponse) => {
            try {
              await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: result.orderId,
              });
              clearBag();
              router.push(`/account/orders/${result.orderId}`);
              resolve();
            } catch (payErr) {
              reject(payErr);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        });
        rzp.open();
      });
    } catch (err) {
      const message =
        err instanceof CommerceApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Checkout failed";
      setError(message);
      trackAnalyticsEvent({
        eventName: "payment_failed",
        properties: { message },
      }).catch(() => undefined);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center md:px-16">
        <h1 className="font-display text-3xl text-crimson">Checkout</h1>
        <p className="mt-4 font-body text-sm text-ink/55">Your bag is empty.</p>
        <Button asChild className="mt-8">
          <Link href="/shop">Shop Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-16 md:py-20">
      <h1 className="font-display text-4xl font-medium text-crimson">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="font-display text-xl text-ink">Contact</legend>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gold/25 px-4 py-2.5 font-body text-sm outline-none focus:border-crimson/40"
            />
            <input
              type="tel"
              required
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gold/25 px-4 py-2.5 font-body text-sm outline-none focus:border-crimson/40"
            />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-display text-xl text-ink">Shipping address</legend>
            {(
              [
                ["fullName", "Full name"],
                ["addressLine1", "Address line 1"],
                ["addressLine2", "Address line 2 (optional)"],
                ["city", "City"],
                ["state", "State"],
              ] as const
            ).map(([key, label]) => (
              <input
                key={key}
                required={key !== "addressLine2"}
                placeholder={label}
                value={address[key]}
                onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
                className="w-full rounded-lg border border-gold/25 px-4 py-2.5 font-body text-sm outline-none focus:border-crimson/40"
              />
            ))}
            <input
              required
              placeholder="Pincode"
              maxLength={6}
              value={address.pincode}
              onChange={(e) => {
                const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
                setAddress((a) => ({ ...a, pincode: pin }));
              }}
              onBlur={() => fetchRates(address.pincode)}
              className="w-full rounded-lg border border-gold/25 px-4 py-2.5 font-body text-sm outline-none focus:border-crimson/40"
            />
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-xl text-ink">Shipping method</legend>
            {loadingRates && (
              <p className="flex items-center gap-2 font-body text-sm text-ink/50">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading rates…
              </p>
            )}
            {shippingRates.map((rate) => (
              <label
                key={rate.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                  shippingMethod === rate.id
                    ? "border-crimson/40 bg-crimson/5"
                    : "border-gold/20"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === rate.id}
                  onChange={() => selectShipping(rate)}
                  className="accent-crimson"
                />
                <Truck className="h-4 w-4 shrink-0 text-ink/40" />
                <div className="flex-1">
                  <p className="font-body text-sm font-medium text-ink">{rate.name}</p>
                  <p className="font-body text-xs text-ink/45">{rate.estimatedDays}</p>
                </div>
                <span className="font-body text-sm text-crimson">
                  {rate.cost === 0 ? "Free" : formatPrice(rate.cost)}
                </span>
              </label>
            ))}
            {!loadingRates && shippingRates.length === 0 && address.pincode.length === 6 && (
              <p className="font-body text-xs text-ink/45">
                Enter pincode to see shipping options.
              </p>
            )}
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-xl text-ink">Coupon</legend>
            <div className="flex gap-2">
              <input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 rounded-lg border border-gold/25 px-4 py-2.5 font-body text-sm uppercase outline-none focus:border-crimson/40"
              />
              <Button type="button" variant="outline" onClick={applyCoupon}>
                Apply
              </Button>
            </div>
            {couponMessage && (
              <p className="font-body text-xs text-ink/55">{couponMessage}</p>
            )}
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-xl text-ink">Payment</legend>
            {(["razorpay", "cod"] as const).map((method) => (
              <label
                key={method}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                  paymentMethod === method
                    ? "border-crimson/40 bg-crimson/5"
                    : "border-gold/20"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="accent-crimson"
                />
                <CreditCard className="h-4 w-4 text-ink/40" />
                <span className="font-body text-sm">
                  {method === "razorpay" ? "Pay online (Razorpay)" : "Cash on delivery"}
                </span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="h-fit rounded-2xl border border-gold/20 bg-ivory-warm p-6">
          <h2 className="font-display text-xl text-ink">Order summary</h2>
          <ul className="mt-6 space-y-4">
            {items.map((item) => (
              <li key={item.lineId} className="flex gap-4">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm text-ink">{item.name}</p>
                  {item.size && (
                    <p className="font-body text-[10px] text-ink/40">Size {item.size}</p>
                  )}
                  <p className="font-body text-xs text-ink/50">
                    Qty {item.quantity} · {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-gold/15 pt-4 font-body text-sm">
            <div className="flex justify-between text-ink/60">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <dt>Discount</dt>
                <dd>−{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between text-ink/60">
              <dt>Shipping</dt>
              <dd>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</dd>
            </div>
            <div className="flex justify-between text-ink/60">
              <dt>GST (5%)</dt>
              <dd>{formatPrice(taxTotal)}</dd>
            </div>
            <div className="flex justify-between border-t border-gold/15 pt-3 text-lg font-semibold text-crimson">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          {error && (
            <p className="mt-4 font-body text-sm text-crimson">{error}</p>
          )}

          <Button type="submit" className="mt-6 w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : paymentMethod === "cod" ? (
              "Place order (COD)"
            ) : (
              "Pay with Razorpay"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
