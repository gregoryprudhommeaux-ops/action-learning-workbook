"use client";

import { useSignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useLocale } from "@/components/locale-provider";
import { GoogleMark } from "@/components/auth/google-mark";

export default function SignInPage() {
  return (
    <Suspense>
      <AdminSignIn />
    </Suspense>
  );
}

function AdminSignIn() {
  const { t } = useLocale();
  const { signIn, fetchStatus } = useSignIn();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const ready = Boolean(signIn) && fetchStatus !== "fetching";
  const redirectUrl = searchParams.get("redirect_url") || "/admin";
  const signUpHref =
    redirectUrl === "/admin"
      ? "/sign-up"
      : `/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`;

  async function continueWithGoogle() {
    if (!signIn) return;
    setError(null);
    const result = await signIn.sso({
      strategy: "oauth_google",
      redirectUrl,
      redirectCallbackUrl: "/sso-callback",
    });
    if (result.error) {
      setError(result.error.message ?? t("admin.googleFail"));
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded bg-brand-blue px-2.5 py-1 text-xs font-bold tracking-wider text-white uppercase">
              ALP
            </span>
            <LocaleSwitcher variant="light" />
          </div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-brand-blue uppercase">
            Admin
          </p>
          <h1 className="mt-1 text-2xl font-bold text-navy-900">
            {t("admin.signin")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{t("admin.signinLead")}</p>
        </div>
        <button
          type="button"
          onClick={() => void continueWithGoogle()}
          disabled={!ready}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <GoogleMark />
          {t("admin.google")}
        </button>
        {error ? (
          <p className="mt-3 text-center text-xs text-red-600">{error}</p>
        ) : null}
        <p className="mt-6 text-center text-xs text-slate-500">
          {t("admin.needAccount")}{" "}
          <Link href={signUpHref} className="text-brand-blue hover:underline">
            {t("admin.signupLink")}
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-slate-400">
          <Link href="/" className="text-brand-blue hover:underline">
            {t("admin.back")}
          </Link>
        </p>
      </div>
    </div>
  );
}
