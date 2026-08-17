"use client";

import { useMemo, useState } from "react";
import { cohortStats, isPackReady } from "@/lib/cohort-stats";
import {
  diagnosticCounts,
  frictionAnalysis,
  initiativeLabel,
  activeRegionsLabel,
  roiHours,
} from "@/lib/workbook-state";
import { packStatusLabel } from "@/lib/completeness";
import type { SubmissionRecord } from "@/lib/submission-snapshot";
import { frictionBand } from "@/lib/submission-snapshot";

type Filter = "all" | "ready" | "incomplete";

export function AdminDashboard({
  initialSubmissions,
}: {
  initialSubmissions: SubmissionRecord[];
}) {
  const [rows] = useState(initialSubmissions);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSubmissions[0]?.id ?? null,
  );
  const [exporting, setExporting] = useState(false);

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

  async function exportSelectedPdf() {
    if (!selected) return;
    setExporting(true);
    try {
      const { downloadWorkbookPdf } = await import("@/lib/export-pdf");
      const state = selected.payload;
      await downloadWorkbookPdf({
        state,
        initiative: initiativeLabel(state),
        regionsLabel: activeRegionsLabel(state),
        frictionText: selected.frictionText,
        analysis: frictionAnalysis(diagnosticCounts(state.diagnostics)),
        roi: roiHours(state.calc),
        packStatus: packStatusLabel(state),
      });
    } finally {
      setExporting(false);
    }
  }

  const bandTotal = Math.max(stats.total, 1);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Packs submitted" value={String(stats.total)} />
        <Stat label="Ready for live audit" value={String(stats.ready)} accent />
        <Stat label="Still incomplete" value={String(stats.incomplete)} />
        <Stat label="Avg friction" value={`${stats.avgFriction}/100`} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-navy-900">
            Friction across the cohort
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            High friction packs should go first in the live audit.
          </p>
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
            <span>Low {stats.bands.low}</span>
            <span>Moderate {stats.bands.moderate}</span>
            <span>High {stats.bands.high}</span>
            <span>{stats.companies} companies</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-navy-900">Initiatives</h2>
          <ul className="mt-3 space-y-2 text-xs text-slate-600">
            {stats.initiatives.length === 0 ? (
              <li>No packs yet.</li>
            ) : (
              stats.initiatives.map((item) => (
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
              Submitted tests
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
                  {item === "all"
                    ? "All"
                    : item === "ready"
                      ? "Ready"
                      : "Incomplete"}
                </button>
              ))}
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, email, company"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs sm:w-52"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Submitted</th>
                  <th className="px-4 py-2 font-medium">Person</th>
                  <th className="px-4 py-2 font-medium">Company</th>
                  <th className="px-4 py-2 font-medium">Friction</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      No packs match this filter.
                    </td>
                  </tr>
                ) : (
                  visible.map((row) => {
                    const active = row.id === selectedId;
                    const band = frictionBand(row.frictionPercent);
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedId(row.id)}
                        className={`cursor-pointer border-t border-slate-100 ${
                          active ? "bg-brand-soft" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                          {formatWhen(row.createdAt)}
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
                          {isPackReady(row) ? (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                              Ready
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-800">
                              Incomplete
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
                  Pack detail
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
                <Detail label="Project" value={selected.projectName} />
                <Detail label="Initiative" value={selected.initiativeLabel} />
                <Detail label="Regions" value={selected.regionsLabel} />
                <Detail label="Friction" value={selected.frictionText} />
                <Detail label="Status" value={selected.packStatus} />
                <Detail
                  label="Submitted"
                  value={new Date(selected.createdAt).toLocaleString()}
                />
              </dl>
              <p className="text-xs leading-relaxed text-slate-600">
                {selected.payload.impactNarrative}
              </p>
              <button
                type="button"
                onClick={() => void exportSelectedPdf()}
                disabled={exporting}
                className="w-full rounded-lg bg-brand-blue px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {exporting ? "Preparing PDF…" : "Export PDF"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Submitted packs will appear here. Export PDF is facilitator-only.
            </p>
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

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
