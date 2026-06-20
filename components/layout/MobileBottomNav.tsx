"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Menu, Search, ShoppingBag } from "lucide-react";
import { NAV_LINKS, CONTACT } from "@/lib/constants";
import { DEPARTMENTS } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartProvider";
import { SearchDialog } from "@/components/layout/SearchDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/shop",
    label: "Shop",
    icon: LayoutGrid,
    match: (p: string) => p.startsWith("/shop"),
  },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openBag } = useCart();

  const isProductPage =
    pathname.startsWith("/shop/") && !pathname.startsWith("/shop/category");

  if (isProductPage) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-canvas md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "touch-target flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 transition-colors",
                active ? "text-crimson" : "text-ink/45 active:text-crimson"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-crimson")} strokeWidth={active ? 2.25 : 1.75} />
              <span className="font-body text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        <SearchDialog
          trigger={
            <button
              type="button"
              aria-label="Search"
              className="touch-target flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 text-ink/45 active:text-crimson"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
              <span className="font-body text-[10px] font-medium">Search</span>
            </button>
          }
        />

        <button
          type="button"
          aria-label={`Bag, ${itemCount} items`}
          onClick={openBag}
          className="touch-target relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 text-ink/45 active:text-crimson"
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
          {itemCount > 0 && (
            <span className="absolute right-3 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 font-body text-[9px] font-bold text-ivory shadow-skeuo">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
          <span className="font-body text-[10px] font-medium">Bag</span>
        </button>

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="touch-target flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 text-ink/45 active:text-crimson"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
              <span className="font-body text-[10px] font-medium">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="glass-panel border-gold/25 bg-ivory/95 text-ink">
            <SheetHeader>
              <SheetTitle className="font-display text-crimson">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="touch-target rounded-2xl px-3 py-2.5 font-body text-sm font-medium text-ink/80 transition-colors hover:bg-ivory-warm hover:text-crimson"
                >
                  {link.label}
                </Link>
              ))}
              <p className="mt-4 px-3 font-body text-[10px] font-semibold uppercase tracking-widest text-gold-muted">
                Departments
              </p>
              {DEPARTMENTS.map((d) => (
                <Link
                  key={d.id}
                  href={`/shop/category/${d.id}`}
                  className="touch-target rounded-2xl px-3 py-2 font-body text-sm text-ink/65 hover:bg-ivory-warm hover:text-crimson"
                >
                  {d.label}
                </Link>
              ))}
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target mt-4 rounded-2xl bg-green-600 px-4 py-3 text-center font-body text-sm font-medium text-white shadow-skeuo"
              >
                Chat on WhatsApp
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
