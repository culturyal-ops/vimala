"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { DEPARTMENTS } from "@/lib/catalog";
import {
  MEGA_MENU_SHOP,
  MEGA_MENU_SILKS,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { PromoTicker } from "@/components/layout/PromoTicker";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { BagButton } from "@/components/cart/BagButton";
import { AccountButton } from "@/components/layout/AccountButton";
import { MegaMenu } from "@/components/layout/MegaMenu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MenuId = "shop" | "silks" | null;

const DESKTOP_NAV = [
  { label: "New In", href: "/shop" },
  { label: "Silks", href: "/shop/category/silks" },
  { label: "Bridal", href: "/shop/category/bridal" },
  { label: "Women", href: "/shop/category/women" },
  { label: "Men", href: "/shop/category/men" },
  { label: "Kids", href: "/shop/category/kids" },
  { label: "Readymade", href: "/shop/category/readymade" },
  { label: "Lookbook", href: "/lookbook" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuId>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <PromoTicker />

      <div
        className={cn(
          "border-b border-slate/60 bg-parchment transition-shadow duration-300",
          scrolled && "shadow-premium-sm"
        )}
      >
        <div className="page-container flex h-14 items-center justify-between sm:h-16">
          <div className="flex flex-1 items-center gap-1">
            <SearchDialog
              trigger={
                <button
                  type="button"
                  aria-label="Search"
                  className="touch-target flex items-center justify-center text-ink-muted hover:text-crimson"
                >
                  <Search className="h-5 w-5 stroke-[1.5]" />
                </button>
              }
            />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="touch-target flex items-center justify-center text-ink md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] border-slate/40 bg-parchment sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle className="font-display text-xl text-ink">Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-border py-3.5 font-body text-sm font-medium uppercase tracking-widest text-ink hover:text-crimson"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-border py-3.5 font-body text-sm font-medium uppercase tracking-widest text-ink hover:text-crimson"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-border py-3.5 font-body text-sm font-medium uppercase tracking-widest text-ink hover:text-crimson"
                  >
                    My Orders
                  </Link>
                  <p className="label-caps mt-6 mb-2">Departments</p>
                  {DEPARTMENTS.map((d) => (
                    <Link
                      key={d.id}
                      href={`/shop/category/${d.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="py-2.5 font-body text-sm text-ink-muted hover:text-crimson"
                    >
                      {d.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-center"
          >
            <span className="font-display text-xl font-light tracking-[0.22em] text-ink sm:text-2xl">
              VIMALA
            </span>
            <span className="block font-body text-[7px] font-medium uppercase tracking-[0.45em] text-stone sm:text-[8px]">
              Silk House · Est. 1987
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-2">
            <Link
              href="/contact"
              className="hidden font-body text-[10px] font-medium uppercase tracking-widest text-ink-muted hover:text-crimson lg:inline"
            >
              Stores
            </Link>
            <AccountButton />
            <BagButton className="touch-target text-ink-muted hover:text-crimson" />
          </div>
        </div>
      </div>

      <nav
        className="relative hidden border-b border-slate/40 bg-parchment-warm md:block"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <ul className="page-container flex items-center justify-center gap-7 py-3 lg:gap-9">
          <li className="static" onMouseEnter={() => setActiveMenu("shop")}>
            <Link
              href={MEGA_MENU_SHOP.href}
              className={cn(
                "nav-link inline-flex items-center gap-1",
                (activeMenu === "shop" || isActive("/shop")) && "text-crimson"
              )}
            >
              Shop <ChevronDown className="h-3 w-3" />
            </Link>
            <MegaMenu
              open={activeMenu === "shop"}
              columns={MEGA_MENU_SHOP.columns}
              onClose={() => setActiveMenu(null)}
              featured={{
                title: "New Arrivals",
                href: "/shop",
                imageUrl:
                  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
              }}
            />
          </li>
          <li className="static" onMouseEnter={() => setActiveMenu("silks")}>
            <Link
              href={MEGA_MENU_SILKS.href}
              className={cn(
                "nav-link inline-flex items-center gap-1",
                (activeMenu === "silks" || isActive("/collections/silk-sarees")) &&
                  "text-crimson"
              )}
            >
              Silk Sarees <ChevronDown className="h-3 w-3" />
            </Link>
            <MegaMenu
              open={activeMenu === "silks"}
              columns={MEGA_MENU_SILKS.columns}
              onClose={() => setActiveMenu(null)}
              featured={{
                title: "Bridal Edit",
                href: "/shop/category/bridal",
                imageUrl:
                  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
              }}
            />
          </li>
          {DESKTOP_NAV.map((item) => (
            <li key={item.href} onMouseEnter={() => setActiveMenu(null)}>
              <Link
                href={item.href}
                className={cn("nav-link", isActive(item.href) && "text-crimson")}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
