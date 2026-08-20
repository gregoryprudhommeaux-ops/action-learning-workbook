"use client";

import { useState } from "react";
import { useLocale } from "@/components/locale-provider";
import type { FacilitatorRecord } from "@/lib/facilitators";

export function AccountsQueue({
  initialFacilitators,
  superAdminEmailsConfigured,
}: {
  initialFacilitators: FacilitatorRecord[];
  superAdminEmailsConfigured: boolean;
}) {
  const { t } = useLocale();
  const [rows, setRows] = useState(initialFacilitators);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!superAdminEmailsConfigured) {
    return (
      <section className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="text-sm font-semibold text-amber-900">
          {t("admin.accounts.title")}
        </h2>
        <p className="mt-1 text-sm text-amber-800">{t("admin.accounts.config")}</p>
      </section>
    );
  }

  const reviewable = rows.filter((row) => row.status !== "approved");

  async function setStatus(id: string, status: "approved" | "rejected") {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/facilitators/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as {
        facilitator?: FacilitatorRecord;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? t("admin.accounts.fail"));
        return;
      }
      if (data.facilitator) {
        setRows((prev) =>
          prev.map((row) => (row.id === id ? data.facilitator! : row)),
        );
      }
    } catch {
      setError(t("admin.accounts.fail"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="mb-8 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-navy-900">
          {t("admin.accounts.title")}
        </h2>
        <p className="text-xs text-slate-500">{t("admin.accounts.help")}</p>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      ) : null}
      {reviewable.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{t("admin.accounts.empty")}</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {reviewable.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">{row.email}</p>
                <p className="text-xs text-slate-500">
                  {row.status === "rejected"
                    ? t("admin.accounts.rejected")
                    : t("admin.accounts.pending")}{" "}
                  · {new Date(row.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => void setStatus(row.id, "approved")}
                  className="rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
                >
                  {t("admin.accounts.approve")}
                </button>
                <button
                  type="button"
                  disabled={busyId === row.id || row.status === "rejected"}
                  onClick={() => void setStatus(row.id, "rejected")}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  {t("admin.accounts.reject")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
