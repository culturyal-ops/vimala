"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, WHATSAPP_URL } from "@/lib/constants";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/conversion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const {
    items,
    subtotal,
    isOpen,
    closeBag,
    removeFromBag,
    updateQuantity,
  } = useCart();

  const shippingGap = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress =
    FREE_SHIPPING_THRESHOLD > 0
      ? Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
      : 100;

  const whatsappLines = items
    .map(
      (item) =>
        `• ${item.name}${item.size ? ` (${item.size})` : ""} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");
  const whatsappMessage = encodeURIComponent(
    `Hi, I'd like to order:\n${whatsappLines}\n\nTotal: ${formatPrice(subtotal)}`
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeBag()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-gold/20 bg-ivory p-0 sm:max-w-md [&>button]:text-ink/60 [&>button]:hover:text-ink"
      >
        <SheetHeader className="border-b border-gold/15 px-6 py-5 text-left">
          <SheetTitle className="font-display text-2xl text-crimson">
            Your Bag
          </SheetTitle>
          <p className="font-body text-xs text-ink/45">
            {items.length === 0
              ? "No items yet"
              : `${items.length} style${items.length === 1 ? "" : "s"}`}
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <p className="font-display text-lg text-ink/70">Your bag is empty</p>
              <Button asChild className="mt-6">
                <Link href="/shop" onClick={closeBag}>
                  Continue Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.lineId} className="flex gap-4">
                  <Link
                    href={`/shop/${item.slug}`}
                    onClick={closeBag}
                    className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-ivory-warm"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={closeBag}
                      className="line-clamp-2 font-display text-sm text-ink hover:text-crimson"
                    >
                      {item.name}
                    </Link>
                    {item.size && (
                      <p className="mt-0.5 font-body text-[10px] uppercase tracking-wider text-ink/40">
                        Size {item.size}
                      </p>
                    )}
                    <p className="mt-1 font-body text-sm font-semibold text-crimson">
                      {formatPrice(item.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-gold/25">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.lineId, item.quantity - 1)
                          }
                          className="px-2 py-1 text-ink/60 hover:text-crimson"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[1.25rem] text-center font-body text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.lineId, item.quantity + 1)
                          }
                          className="px-2 py-1 text-ink/60 hover:text-crimson"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromBag(item.lineId)}
                        className="text-ink/35 hover:text-crimson"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gold/15 px-6 py-5">
            {shippingGap > 0 ? (
              <div className="mb-4">
                <p className="font-body text-xs text-ink/55">
                  Add {formatPrice(shippingGap)} more for free shipping
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-gold/15">
                  <div
                    className="h-full rounded-full bg-gold transition-all"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="mb-4 font-body text-xs text-gold-muted">
                You qualify for free shipping
              </p>
            )}

            <div className="mb-4 flex items-baseline justify-between">
              <span className="font-body text-sm text-ink/60">Subtotal</span>
              <span className="font-body text-lg font-semibold text-crimson">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/checkout" onClick={closeBag}>
                  Checkout
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full text-xs">
                <Link
                  href={`${WHATSAPP_URL}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Order on WhatsApp instead
                </Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
