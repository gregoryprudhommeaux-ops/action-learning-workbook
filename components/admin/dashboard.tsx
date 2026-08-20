"use client";

import { useEffect, useMemo, useState } from "react";
import { cohortStats, isPackReady } from "@/lib/cohort-stats";
import {
  diagnosticCounts,
  roiHours,
} from "@/lib/workbook-state";
import { packStatusKey } from "@/lib/completeness";
import type { SubmissionRecord } from "@/lib/submission-snapshot";
import { frictionBand } from "@/lib/submission-snapshot";
import { useLocale } from "@/components/locale-provider";
import {
  LOCALES,
  tActiveRegionsLabel,
  tFrictionAnalysis,
  tFrictionBadge,
  tInitiativeLabel,
  tPackStatus,
} from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/types";

type Filter = "all" | "ready" | "incomplete";

export function AdminDashboard({
  initialSubmissions,
}: {
  initialSubmissions: SubmissionRecord[];
}) {
  const { locale, t } = useLocale();
  const [rows, setRows] = useState(initialSubmissions);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSubmissions[0]?.id ?? null,
  );
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [pdfLocale, setPdfLocale] = useState<Locale>(locale);

  useEffect(() => {
    setPdfLocale(locale);
  }, [locale]);

  const stats = useMemo(() => cohortStats(rows), [rows]);
  const selected = rows.find((row) => row.id === selectedId) ?? null;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter === "ready" && !isPackReady(row)) return false;
      if (filter === "incomplete" && isPackReady(row)) return false;
      if (!needle) return true;
      return [
        row.authorFullName,
        row.authorEmail,
        row.companyName,
        row.projectName,
        row.authorPosition,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [filter, query, rows]);

  const initiatives = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of rows) {
      const label = tInitiativeLabel(locale, row.payload);
      map.set(label, (map.get(label) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [locale, rows]);

  async function exportSelectedPdf() {
    if (!selected) return;
    setExporting(true);
    try {
      const { downloadWorkbookPdf } = await import("@/lib/export-pdf");
      const state = selected.payload;
      const counts = diagnosticCounts(state.diagnostics);
      await downloadWorkbookPdf({
        state,
        initiative: tInitiativeLabel(pdfLocale, state),
        regionsLabel: tActiveRegionsLabel(pdfLocale, state),
        frictionText: tFrictionBadge(pdfLocale, selected.frictionPercent),
        analysis: tFrictionAnalysis(pdfLocale, counts),
        roi: roiHours(state.calc),
        packStatus: tPackStatus(pdfLocale, state),
        locale: pdfLocale,
      });
    } finally {
      setExporting(false);
    }
  }

  async function deleteSelected() {
    if (!selected) return;
    const label =
      selected.authorFullName || selected.authorEmail || selected.id;
    if (!window.confirm(t("admin.deleteConfirm", { name: label }))) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/submissions/${selected.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setDeleteError(data.error ?? t("admin.deleteFail"));
        return;
      }
      setRows((prev) => {
        const next = prev.filter((row) => row.id !== selected.id);
        setSelectedId(next[0]?.id ?? null);
        return next;
      });
    } catch {
      setDeleteError(t("admin.deleteFail"));
    } finally {
      setDeleting(false);
    }
  }

  const bandTotal = Math.max(stats.total, 1);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={t("admin.stat.packs")} value={String(stats.total)} />
        <Stat
          label={t("admin.stat.ready")}
          value={String(stats.ready)}
          accent
        />
        <Stat
          label={t("admin.stat.incomplete")}
          value={String(stats.incomplete)}
        />
        <Stat
          label={t("admin.stat.friction")}
          value={`${stats.avgFriction}/100`}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-navy-900">
            {t("admin.cohort")}
          </h2>
          <p className="mt-1 text-xs text-slate-500">{t("admin.cohortHelp")}</p>
          <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-100">
            <span
              className="bg-emerald-500"
              style={{ width: `${(stats.bands.low / bandTotal) * 100}%` }}
            />
            <span
              className="bg-brand-blue"
              style={{ width: `${(stats.bands.moderate / bandTotal) * 100}%` }}
            />
            <span
              className="bg-red-500"
              style={{ width: `${(stats.bands.high / bandTotal) * 100}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
            <span>{t("admin.low", { n: stats.bands.low })}</span>
            <span>{t("admin.mod", { n: stats.bands.moderate })}</span>
            <span>{t("admin.high", { n: stats.bands.high })}</span>
            <span>{t("admin.companies", { n: stats.companies })}</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-navy-900">
            {t("admin.inits")}
          </h2>
          <ul className="mt-3 space-y-2 text-xs text-slate-600">
            {initiatives.length === 0 ? (
              <li>{t("admin.none")}</li>
            ) : (
              initiatives.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="truncate">{item.label}</span>
                  <span className="font-semibold text-navy-900">
                    {item.count}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white xl:col-span-3">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-navy-900">
              {t("admin.tests")}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {(["all", "ready", "incomplete"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    filter === item
                      ? "bg-navy-900 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {t(`admin.${item}`)}
                </button>
              ))}
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("admin.search")}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs sm:w-52"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">{t("admin.col.when")}</th>
                  <th className="px-4 py-2 font-medium">
                    {t("admin.col.person")}
                  </th>
                  <th className="px-4 py-2 font-medium">
                    {t("admin.col.company")}
                  </th>
                  <th className="px-4 py-2 font-medium">
                    {t("admin.col.friction")}
                  </th>
                  <th className="px-4 py-2 font-medium">
                    {t("admin.col.status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      {t("admin.empty")}
                    </td>
                  </tr>
                ) : (
                  visible.map((row) => {
                    const active = row.id === selectedId;
                    const band = frictionBand(row.frictionPercent);
                    const ready = isPackReady(row);
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedId(row.id)}
                        className={`cursor-pointer border-t border-slate-100 ${
                          active ? "bg-brand-soft" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                          {formatWhen(row.createdAt, locale)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-navy-900">
                            {row.authorFullName}
                          </div>
                          <div className="text-slate-500">{row.authorEmail}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.companyName}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              band === "high"
                                ? "font-semibold text-red-600"
                                : band === "moderate"
                                  ? "font-semibold text-brand-blue"
                                  : "font-semibold text-emerald-600"
                            }
                          >
                            {row.frictionPercent}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {ready ? (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                              {t("admin.ready")}
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-800">
                              {t("admin.incomplete")}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-2">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-brand-blue uppercase">
                  {t("admin.detail")}
                </p>
                <h3 className="mt-1 text-lg font-bold text-navy-900">
                  {selected.authorFullName}
                </h3>
                <p className="text-sm text-slate-500">
                  {selected.authorPosition} · {selected.companyName}
                </p>
                <p className="text-xs text-slate-400">{selected.authorEmail}</p>
              </div>
              <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <Detail label={t("admin.project")} value={selected.projectName} />
                <Detail
                  label={t("admin.initiative")}
                  value={tInitiativeLabel(locale, selected.payload)}
                />
                <Detail
                  label={t("admin.regions")}
                  value={tActiveRegionsLabel(locale, selected.payload)}
                />
                <Detail
                  label={t("admin.friction")}
                  value={tFrictionBadge(locale, selected.frictionPercent)}
                />
                <Detail
                  label={t("admin.status")}
                  value={t(`status.${packStatusKey(selected.payload)}`)}
                />
                <Detail
                  label={t("admin.submitted")}
                  value={new Date(selected.createdAt).toLocaleString(
                    locale === "zh" ? "zh-CN" : locale,
                  )}
                />
              </dl>
              <p className="text-xs leading-relaxed text-slate-600">
                {selected.payload.impactNarrative}
              </p>
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {t("lang.pdf")}
                </label>
                <select
                  value={pdfLocale}
                  onChange={(event) =>
                    setPdfLocale(event.target.value as Locale)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                >
                  {LOCALES.map((item) => (
                    <option key={item} value={item}>
                      {t(`lang.${item}`)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => void exportSelectedPdf()}
                  disabled={exporting || deleting}
                  className="w-full rounded-lg bg-brand-blue px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {exporting ? t("admin.preparing") : t("admin.export")}
                </button>
                <button
                  type="button"
                  onClick={() => void deleteSelected()}
                  disabled={exporting || deleting}
                  className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {deleting ? t("admin.deleting") : t("admin.delete")}
                </button>
                {deleteError ? (
                  <p className="text-xs text-red-600">{deleteError}</p>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">{t("admin.emptyDetail")}</p>
          )}
        </aside>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`mt-1 text-2xl font-semibold ${
          accent ? "text-brand-blue" : "text-navy-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-800">{value || "—"}</dd>
    </div>
  );
}

function formatWhen(iso: string, locale: Locale) {
  return new Date(iso).toLocaleString(locale === "zh" ? "zh-CN" : locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
