"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-16 md:py-24">
      <h1 className="font-display text-4xl font-medium text-crimson">Sign In</h1>
      <p className="mt-3 font-body text-sm text-ink/55">
        Welcome back. Sign in to view your orders and saved details.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="font-body text-xs font-medium uppercase tracking-widest text-ink/60"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gold/25 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-crimson/40"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="font-body text-xs font-medium uppercase tracking-widest text-ink/60"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gold/25 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-crimson/40"
          />
        </div>

        {error && (
          <p className="font-body text-sm text-crimson">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 font-body text-sm text-ink/55">
        New here?{" "}
        <Link href="/signup" className="text-crimson hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-2 font-body text-sm text-ink/55">
        Guest checkout?{" "}
        <Link href="/account" className="text-crimson hover:underline">
          Track your order
        </Link>
      </p>
    </div>
  );
}
