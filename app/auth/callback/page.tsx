"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient();
    const next = searchParams.get("next") ?? "/account";

    async function finishAuth() {
      const code = searchParams.get("code");

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
        router.replace(next);
        return;
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError(sessionError.message);
        return;
      }
      if (data.session) {
        router.replace(next);
        return;
      }

      setError("Confirmation link invalid or expired. Try signing in again.");
    }

    finishAuth();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-crimson">Sign-in failed</h1>
        <p className="mt-4 font-body text-sm text-ink/60">{error}</p>
        <Button className="mt-8" asChild>
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-body text-sm text-ink/60">Confirming your account…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <p className="font-body text-sm text-ink/60">Confirming your account…</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
