"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/browser";
import { linkCustomerAccount } from "@/app/account/actions";
import { getAuthCallbackUrl } from "@/lib/site-url";
import { OtpInput } from "@/components/auth/OtpInput";
import { Button } from "@/components/ui/button";

type Step = "email" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  async function sendCode(targetEmail: string) {
    setError(null);
    setLoading(true);

    const trimmed = targetEmail.trim().toLowerCase();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: getAuthCallbackUrl("/account"),
      },
    });

    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return false;
    }

    setEmail(trimmed);
    setStep("otp");
    setOtp("");
    setResendIn(60);
    return true;
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    await sendCode(email);
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    setError(null);
    setLoading(true);

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (verifyError) {
      setLoading(false);
      setError(verifyError.message);
      return;
    }

    if (data.user) {
      await linkCustomerAccount({
        authUserId: data.user.id,
        email,
        fullName:
          (data.user.user_metadata?.full_name as string | undefined) ?? "",
      });
    }

    setLoading(false);
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] md:grid md:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-ink-soft p-12 text-ivory md:flex lg:p-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 48px)",
          }}
        />
        <div className="relative">
          <p className="font-body text-[10px] font-medium uppercase tracking-[0.55em] text-gold">
            Vimala Silk House
          </p>
          <h1 className="mt-6 font-display text-4xl font-light leading-tight lg:text-5xl">
            Your private
            <br />
            shopping account
          </h1>
          <p className="mt-5 max-w-sm font-body text-sm leading-relaxed text-ivory/60">
            Sign in with a one-time code — no password to remember. Track
            orders, faster checkout, curated for you.
          </p>
        </div>
        <p className="relative font-body text-xs text-ivory/40">
          Est. 1987 · Kattappana, Kerala
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-16 md:px-10 md:py-24">
        <div className="w-full max-w-md">
          <div className="md:hidden">
            <p className="font-body text-[10px] font-medium uppercase tracking-[0.45em] text-gold-muted">
              Vimala Silk House
            </p>
          </div>

          {step === "email" ? (
            <>
              <h2 className="mt-4 font-display text-3xl text-crimson md:mt-0 md:text-4xl">
                Sign in
              </h2>
              <p className="mt-3 font-body text-sm text-ink/55">
                We&apos;ll email you a secure 6-digit code. Works for new and
                returning customers.
              </p>

              <form onSubmit={handleEmailSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="font-body text-[10px] font-medium uppercase tracking-widest text-ink/50"
                  >
                    Email address
                  </label>
                  <div className="relative mt-2">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-gold/25 bg-ivory-warm py-3 pl-10 pr-4 font-body text-sm outline-none transition-colors focus:border-crimson/50"
                    />
                  </div>
                </div>

                {error && (
                  <p className="font-body text-sm text-crimson">{error}</p>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending code…" : "Continue with email"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setError(null);
                  setOtp("");
                }}
                className="mb-6 inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-widest text-ink/45 hover:text-crimson"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change email
              </button>

              <h2 className="font-display text-3xl text-crimson md:text-4xl">
                Enter your code
              </h2>
              <p className="mt-3 font-body text-sm text-ink/55">
                Sent to{" "}
                <span className="font-medium text-ink">{email}</span>. Check
                inbox and spam.
              </p>

              <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />

                {error && (
                  <p className="text-center font-body text-sm text-crimson">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full"
                >
                  {loading ? "Verifying…" : "Verify & continue"}
                </Button>

                <p className="text-center font-body text-xs text-ink/45">
                  Didn&apos;t get it?{" "}
                  <button
                    type="button"
                    disabled={resendIn > 0 || loading}
                    onClick={() => sendCode(email)}
                    className="text-crimson hover:underline disabled:text-ink/30"
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                  </button>
                </p>
              </form>
            </>
          )}

          <div className="mt-10 border-t border-gold/15 pt-6">
            <p className="font-body text-sm text-ink/50">
              Ordered as a guest?{" "}
              <Link href="/account" className="text-crimson hover:underline">
                Track order without signing in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
