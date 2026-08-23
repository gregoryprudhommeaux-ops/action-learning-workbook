"use client";

import Link from "next/link";
import { AuthUser } from "@/components/auth-user";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useLocale } from "@/components/locale-provider";
import type { AdminRole } from "@/lib/admin-auth";

export function AdminWaiting({
  name,
  email,
  role,
  superAdminEmailsConfigured,
}: {
  name: string;
  email: string;
  role: Extract<AdminRole, "pending" | "rejected">;
  superAdminEmailsConfigured: boolean;
}) {
  const { t } = useLocale();
  const needsConfig = !superAdminEmailsConfigured && role === "pending";
  const title = needsConfig
    ? t("admin.waiting.configTitle")
    : role === "rejected"
      ? t("admin.waiting.rejectedTitle")
      : t("admin.waiting.pendingTitle");
  const body = needsConfig
    ? t("admin.waiting.configBody")
    : role === "rejected"
      ? t("admin.waiting.rejectedBody")
      : t("admin.waiting.pendingBody");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-700 bg-navy-900 text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded bg-brand-blue px-2.5 py-1 text-xs font-bold tracking-wider uppercase transition hover:bg-blue-700"
              aria-label={t("admin.workbook")}
            >
              ALP
            </Link>
            <div>
              <h1 className="text-sm font-semibold sm:text-base">
                {t("admin.title")}
              </h1>
              <p className="hidden text-xs text-slate-400 sm:block">
                {name} · {email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href="/"
              className="text-xs text-slate-300 transition hover:text-white"
            >
              {t("admin.workbook")}
            </Link>
            <AuthUser />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-xs font-semibold tracking-widest text-brand-blue uppercase">
            {needsConfig ? t("admin.waiting.configBadge") : t("admin.waiting.badge")}
          </p>
          <h2 className="mt-3 text-xl font-bold text-navy-900">{title}</h2>
          <p className="mt-3 text-sm text-slate-600">{body}</p>
          <p className="mt-6 text-xs text-slate-400">{email}</p>
        </div>
      </main>
    </div>
  );
}
