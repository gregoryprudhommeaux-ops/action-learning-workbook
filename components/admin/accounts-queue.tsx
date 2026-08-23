"use client";

import { useState } from "react";
import { useLocale } from "@/components/locale-provider";
import type { FacilitatorRecord } from "@/lib/facilitators";

function statusBadgeClass(status: FacilitatorRecord["status"]) {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700";
    case "rejected":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-800";
  }
}

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

  const pendingCount = rows.filter((row) => row.status === "pending").length;

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
        <div>
          <h2 className="text-sm font-semibold text-navy-900">
            {t("admin.accounts.title")}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">{t("admin.accounts.lead")}</p>
        </div>
        <p className="text-xs text-slate-500">{t("admin.accounts.help")}</p>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      ) : null}
      {pendingCount > 0 ? (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {t("admin.accounts.pendingNotice", { n: pendingCount })}
        </p>
      ) : null}
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{t("admin.accounts.none")}</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-slate-500">
              <tr>
                <th className="px-2 py-2 font-medium">{t("admin.accounts.colEmail")}</th>
                <th className="px-2 py-2 font-medium">{t("admin.accounts.colStatus")}</th>
                <th className="px-2 py-2 font-medium">{t("admin.accounts.colSince")}</th>
                <th className="px-2 py-2 font-medium">{t("admin.accounts.colActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => {
                const busy = busyId === row.id;
                const statusLabel =
                  row.status === "approved"
                    ? t("admin.accounts.approved")
                    : row.status === "rejected"
                      ? t("admin.accounts.rejected")
                      : t("admin.accounts.pending");
                return (
                  <tr key={row.id}>
                    <td className="px-2 py-3 font-medium text-slate-800">
                      {row.email}
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadgeClass(row.status)}`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-slate-500">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="px-2 py-3">
                      {row.status === "approved" ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void setStatus(row.id, "approved")}
                            className="rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
                          >
                            {t("admin.accounts.approve")}
                          </button>
                          {row.status === "pending" ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void setStatus(row.id, "rejected")}
                              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                              {t("admin.accounts.reject")}
                            </button>
                          ) : null}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
