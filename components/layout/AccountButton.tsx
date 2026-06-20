"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, Package, LogIn } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

export function AccountButton({ className }: { className?: string }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const isAccountRoute =
    pathname.startsWith("/account") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  const iconClass = cn(
    "h-5 w-5 stroke-[1.5]",
    isAccountRoute && "text-crimson"
  );

  if (loading) {
    return (
      <span
        className={cn(
          "touch-target inline-flex h-9 w-9 items-center justify-center text-ink/30",
          className
        )}
        aria-hidden
      >
        <User className={iconClass} />
      </span>
    );
  }

  if (user) {
    return (
      <>
        <Link
          href="/account"
          aria-label="My account"
          className={cn(
            "touch-target inline-flex items-center justify-center text-ink-muted hover:text-crimson md:hidden",
            isAccountRoute && "text-crimson",
            className
          )}
        >
          <User className={iconClass} />
        </Link>
        <div className="group relative hidden md:block">
          <Link
            href="/account"
            aria-label="My account"
            className={cn(
              "touch-target inline-flex items-center justify-center text-ink-muted hover:text-crimson",
              isAccountRoute && "text-crimson",
              className
            )}
          >
            <User className={iconClass} />
          </Link>
          <div className="pointer-events-none absolute right-0 top-full z-50 w-48 pt-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
            <div className="rounded-lg border border-border bg-canvas py-1 shadow-premium-sm">
              <p className="truncate px-3 py-2 font-body text-[11px] text-ink/50">
                {user.email}
              </p>
              <Link
                href="/account"
                className="flex items-center gap-2 px-3 py-2 font-body text-sm text-ink hover:bg-surface hover:text-crimson"
              >
                <Package className="h-4 w-4" />
                My orders
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="flex w-full items-center gap-2 px-3 py-2 font-body text-sm text-ink hover:bg-surface hover:text-crimson"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        aria-label="Sign in"
        className={cn(
          "touch-target inline-flex items-center justify-center text-ink-muted hover:text-crimson md:hidden",
          isAccountRoute && "text-crimson",
          className
        )}
      >
        <User className={iconClass} />
      </Link>
      <div className="group relative hidden md:block">
        <Link
          href="/login"
          aria-label="Sign in"
          className={cn(
            "touch-target inline-flex items-center justify-center text-ink-muted hover:text-crimson",
            isAccountRoute && "text-crimson",
            className
          )}
        >
          <User className={iconClass} />
        </Link>
        <div className="pointer-events-none absolute right-0 top-full z-50 w-44 pt-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
          <div className="rounded-lg border border-border bg-canvas py-1 shadow-premium-sm">
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-2 font-body text-sm text-ink hover:bg-surface hover:text-crimson"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
            <Link
              href="/account"
              className="flex items-center gap-2 px-3 py-2 font-body text-sm text-ink hover:bg-surface hover:text-crimson"
            >
              <Package className="h-4 w-4" />
              Track order
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
