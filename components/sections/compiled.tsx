"use client";

import { useRef } from "react";
import { useWorkbook } from "@/components/workbook-provider";
import { companyAsName } from "@/lib/workbook-state";

export function CompiledSection() {
  const {
    state,
    initiative,
    regionsLabel,
    friction,
    importJson,
    submitPack,
    exportJson,
    packStatus,
    readyForAudit,
    pdfReady,
    missingAudit,
    setTab,
  } = useWorkbook();
  const fileRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="no-print mb-6 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
            Final output
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Compiled Action Learning Project workbook
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {readyForAudit && pdfReady
              ? "Ready for the facilitator to export the live-audit PDF."
              : "Finish the required fields below before submitting the pack."}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => void submitPack()}
            className="rounded-lg bg-brand-blue px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
          >
            Submit pack
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-900"
          >
            Print
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Backup JSON
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Import state
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importJson(file);
              event.target.value = "";
            }}
          />
        </div>
      </div>

      {!readyForAudit || !pdfReady ? (
        <div className="no-print mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-950">
          <p className="font-semibold">Not ready to submit</p>
          <p className="mt-1 text-amber-800">
            Required: initiative, at least one region, SLA protocol, a named
            DRI, plus author name, email, company, and position.
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {missingAudit.map((item) => (
              <li key={`${item.tab}-${item.label}`}>
                <button
                  type="button"
                  onClick={() => setTab(item.tab)}
                  className="rounded-full border border-amber-300 bg-white px-2.5 py-1 font-medium text-amber-900 transition hover:bg-amber-100"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-6 text-slate-800">
        <div className="border-b-2 border-navy-900 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">
                {companyAsName(state.companyName)} · Global Action Learning
                Project
              </span>
              <h1 className="mt-1 text-2xl font-bold text-navy-900">
                {state.projectName}
              </h1>
              {state.authorFullName ? (
                <p className="mt-1 text-xs text-slate-500">
                  Prepared by {state.authorFullName}
                  {state.authorPosition ? ` · ${state.authorPosition}` : ""}
                  {state.companyName ? ` · ${state.companyName}` : ""}
                  {state.authorEmail ? ` · ${state.authorEmail}` : ""}
                </p>
              ) : null}
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>
                <strong>Status:</strong> {packStatus}
              </p>
              <p>
                <strong>Date:</strong> {today}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs sm:grid-cols-4">
          <div>
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              Selected initiative
            </span>
            <span className="font-bold text-slate-800">{initiative}</span>
          </div>
          <div>
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              Active regions
            </span>
            <span className="font-bold text-slate-800">{regionsLabel}</span>
          </div>
          <div>
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              Diagnostic score
            </span>
            <span className="font-bold text-brand-blue">
              {friction.badge.text}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              Priority 1 target SLA
            </span>
            <span className="font-bold text-red-600">
              {state.sla.p1Hours} hours
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            1. Operational impact narrative
          </h3>
          <p className="rounded border border-blue-100 bg-blue-50/50 p-3 text-xs leading-relaxed text-slate-700 italic">
            “{state.impactNarrative}”
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            2. Diagnostic friction & examples
          </h3>
          <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
            {(
              [
                ["Diagnostic A: Urgency & Time", state.examples.a],
                ["Diagnostic B: Voice & Trust", state.examples.b],
                ["Diagnostic C: Message & Clarity", state.examples.c],
                ["Diagnostic D: Power & Structure", state.examples.d],
              ] as const
            ).map(([title, example]) => (
              <div
                key={title}
                className="space-y-1 rounded border border-slate-200 bg-slate-50 p-3"
              >
                <strong className="block font-semibold text-slate-800">
                  {title}
                </strong>
                <p className="text-slate-600">Example: {example}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            3. Team working agreement & SLA protocol
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200 text-left text-xs">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="border-b p-2">Priority</th>
                  <th className="border-b p-2">Primary channel</th>
                  <th className="border-b p-2">Target response SLA</th>
                  <th className="border-b p-2">Action expectations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="p-2 font-bold text-red-700">
                    Priority 1: Critical
                  </td>
                  <td className="p-2">{state.sla.p1Channel}</td>
                  <td className="p-2 font-bold">{state.sla.p1Hours} hours</td>
                  <td className="p-2">
                    Immediate verbal confirmation + formal incident owner in 2
                    hrs.
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-amber-800">
                    Priority 2: Standard
                  </td>
                  <td className="p-2">{state.sla.p2Channel}</td>
                  <td className="p-2 font-bold">
                    {state.sla.p2Days} business days
                  </td>
                  <td className="p-2">
                    Written feedback or extension requested before deadline.
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-blue-800">
                    Priority 3: Info-only
                  </td>
                  <td className="p-2">{state.sla.p3Channel}</td>
                  <td className="p-2 font-medium">
                    No live response required
                  </td>
                  <td className="p-2">
                    Reviewed asynchronously; questions in scheduled syncs.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            4. Designated DRI governance
          </h3>
          <div className="flex items-center justify-between rounded bg-slate-900 p-3 text-xs text-white">
            <span>Deliverable: {state.dri.task}</span>
            <span className="font-bold text-sky-300">{state.dri.owner}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            5. 4–6 week pilot plan & targets
          </h3>
          <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
            {[state.pilot.change1, state.pilot.change2, state.pilot.change3].map(
              (change, index) => (
                <div
                  key={index}
                  className="rounded border border-slate-200 bg-slate-50 p-3"
                >
                  <span className="mb-1 block font-bold text-brand-blue">
                    Routine {index + 1}
                  </span>
                  <p className="text-slate-600">{change}</p>
                </div>
              ),
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200 text-left text-xs">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="border-b p-2">KPI</th>
                  <th className="border-b p-2">Baseline</th>
                  <th className="border-b p-2">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="p-2">SOP review response time</td>
                  <td className="p-2">{state.pilot.kpiBase1}</td>
                  <td className="p-2 font-semibold text-brand-blue">
                    {state.pilot.kpiTarg1}
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Off-hours call frequency</td>
                  <td className="p-2">{state.pilot.kpiBase2}</td>
                  <td className="p-2 font-semibold text-brand-blue">
                    {state.pilot.kpiTarg2}
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Cross-site trust rating</td>
                  <td className="p-2">{state.pilot.kpiBase3}</td>
                  <td className="p-2 font-semibold text-brand-blue">
                    {state.pilot.kpiTarg3}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            6. Regional playbook (active sites)
          </h3>
          <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
            {state.regions
              .filter((region) => state.activeRegionIds.includes(region.id))
              .map((region) => (
                <div
                  key={region.id}
                  className="rounded border border-slate-200 bg-slate-50 p-3"
                >
                  <strong className="block text-slate-800">
                    {region.flag} {region.code} · {region.name}
                  </strong>
                  <p className="mt-1 text-slate-500">{region.tagline}</p>
                  <p className="mt-2 text-slate-600">
                    <span className="font-semibold">Tip:</span> {region.tip}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-300 pt-6 text-xs text-slate-500">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="border-t border-slate-300 pt-2">
              <p className="font-bold text-slate-700">Team ALP lead</p>
              <p className="text-[10px]">Confirmed pre-work</p>
            </div>
            <div className="border-t border-slate-300 pt-2">
              <p className="font-bold text-slate-700">
                Cross-regional counterpart
              </p>
              <p className="text-[10px]">Confirmed pre-work</p>
            </div>
            <div className="border-t border-slate-300 pt-2">
              <p className="font-bold text-slate-700">Facilitator / coach</p>
              <p className="text-[10px]">Pending live audit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
