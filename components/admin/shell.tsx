"use client";

import Link from "next/link";
import { AuthUser } from "@/components/auth-user";
import { AdminDashboard } from "@/components/admin/dashboard";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useLocale } from "@/components/locale-provider";
import type { SubmissionRecord } from "@/lib/submission-snapshot";

export function AdminShell({
  name,
  email,
  submissions,
}: {
  name: string;
  email: string;
  submissions: SubmissionRecord[];
}) {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-700 bg-navy-900 text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded bg-brand-blue px-2.5 py-1 text-xs font-bold tracking-wider uppercase">
              ALP
            </span>
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="mb-6 max-w-2xl text-sm text-slate-600">{t("admin.lead")}</p>
        <AdminDashboard initialSubmissions={submissions} />
      </main>
    </div>
  );
}
