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
    <div className="min-h-[calc(100vh-var(--header-height))] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <p className="font-body text-[10px] font-medium uppercase tracking-[0.45em] text-gold-muted mb-4">
            Vimala Silk House
          </p>
          <h1 className="font-display text-4xl text-crimson mb-3">
            Your shopping account
          </h1>
          <p className="font-body text-sm text-ink/60 max-w-md mx-auto">
            Sign in with a one-time code. No password to remember.
          </p>
        </div>

        <div className="bg-ivory-warm border border-gold/20 rounded-2xl p-8 md:p-10">
          {step === "email" ? (
            <>
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block font-body text-xs font-medium uppercase tracking-wider text-ink/60 mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/30" />
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gold/30 bg-white py-3.5 pl-12 pr-4 font-body text-base outline-none transition-all focus:border-crimson focus:ring-2 focus:ring-crimson/10"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-crimson/5 border border-crimson/20 p-3">
                    <p className="font-body text-sm text-crimson">{error}</p>
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full py-6 text-base">
                  {loading ? "Sending code..." : "Continue with email"}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-gold/15">
                <p className="text-center font-body text-sm text-ink/50">
                  Ordered as a guest?{" "}
                  <Link href="/account" className="text-crimson hover:underline font-medium">
                    Track order without signing in
                  </Link>
                </p>
              </div>
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
                className="mb-8 inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-ink/50 hover:text-crimson transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Change email
              </button>

              <div className="mb-8">
                <h2 className="font-display text-2xl text-crimson mb-3">
                  Enter your code
                </h2>
                <p className="font-body text-sm text-ink/60">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-ink">{email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />

                {error && (
                  <div className="rounded-lg bg-crimson/5 border border-crimson/20 p-3">
                    <p className="text-center font-body text-sm text-crimson">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-6 text-base"
                >
                  {loading ? "Verifying..." : "Verify and continue"}
                </Button>

                <p className="text-center font-body text-sm text-ink/50">
                  Didn&apos;t receive it?{" "}
                  <button
                    type="button"
                    disabled={resendIn > 0 || loading}
                    onClick={() => sendCode(email)}
                    className="text-crimson hover:underline disabled:text-ink/30 font-medium"
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                  </button>
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center font-body text-xs text-ink/40 mt-8">
          Est. 1987 | Kattappana, Kerala
        </p>
      </div>
    </div>
  );
}
