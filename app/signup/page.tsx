"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import { linkCustomerAccount } from "@/app/account/actions";
import { getAuthCallbackUrl } from "@/lib/site-url";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: getAuthCallbackUrl("/account"),
        data: {
          full_name: fullName.trim(),
          role: "customer",
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (data.user) {
      await linkCustomerAccount({
        authUserId: data.user.id,
        email: trimmedEmail,
        fullName: fullName.trim(),
      });
    }

    setLoading(false);

    if (data.session) {
      router.push("/account");
      router.refresh();
      return;
    }

    setMessage(
      "Account created. Check your email to confirm, then sign in."
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-16 md:py-24">
      <h1 className="font-display text-4xl font-medium text-crimson">
        Create Account
      </h1>
      <p className="mt-3 font-body text-sm text-ink/55">
        Save your details and track orders in one place.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="font-body text-xs font-medium uppercase tracking-widest text-ink/60"
          >
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gold/25 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-crimson/40"
          />
        </div>
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
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gold/25 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-crimson/40"
          />
        </div>

        {error && (
          <p className="font-body text-sm text-crimson">{error}</p>
        )}
        {message && (
          <p className="font-body text-sm text-ink/70">{message}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account…" : "Sign up"}
        </Button>
      </form>

      <p className="mt-6 font-body text-sm text-ink/55">
        Already have an account?{" "}
        <Link href="/login" className="text-crimson hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
