"use client";

import { useState } from "react";
import { useWorkbook } from "@/components/workbook-provider";
import { useLocale } from "@/components/locale-provider";
import { tCompanyAsName, tRegionField, tRegionName, tRegionTagline } from "@/lib/i18n";

export function CompiledSection() {
  const { locale, t } = useLocale();
  const {
    state,
    initiative,
    regionsLabel,
    friction,
    submitPack,
    exportPdf,
    packStatus,
    readyForAudit,
    pdfReady,
    missingAudit,
    setTab,
  } = useWorkbook();
  const today = new Date().toISOString().split("T")[0];
  const company = tCompanyAsName(locale, state.companyName);
  const [exporting, setExporting] = useState(false);

  async function downloadPdf() {
    setExporting(true);
    try {
      await exportPdf();
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="no-print mb-6 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
            {t("sum.kicker")}
          </span>
          <h2 className="text-xl font-bold text-slate-900">{t("sum.title")}</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {readyForAudit && pdfReady ? t("sum.ready") : t("sum.finish")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => void downloadPdf()}
            disabled={exporting}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-navy-900 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {exporting ? t("sum.preparing") : t("sum.downloadPdf")}
          </button>
          <button
            type="button"
            onClick={() => void submitPack()}
            className="rounded-lg bg-brand-blue px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
          >
            {t("app.submit")}
          </button>
        </div>
      </div>

      {!readyForAudit || !pdfReady ? (
        <div className="no-print mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-950">
          <p className="font-semibold">{t("sum.notReady")}</p>
          <p className="mt-1 text-amber-800">{t("sum.required")}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {missingAudit.map((item) => (
              <li key={`${item.tab}-${item.id}`}>
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
                {t("sum.alp", { company })}
              </span>
              <h1 className="mt-1 text-2xl font-bold text-navy-900">
                {state.projectName || t("sum.untitled")}
              </h1>
              {state.authorFullName ? (
                <p className="mt-1 text-xs text-slate-500">
                  {t("sum.prepared")} {state.authorFullName}
                  {state.authorPosition ? ` · ${state.authorPosition}` : ""}
                  {state.companyName ? ` · ${state.companyName}` : ""}
                  {state.authorEmail ? ` · ${state.authorEmail}` : ""}
                </p>
              ) : null}
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>
                <strong>{t("sum.status")}</strong> {packStatus}
              </p>
              <p>
                <strong>{t("sum.date")}</strong> {today}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs sm:grid-cols-4">
          <div>
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              {t("sum.initiative")}
            </span>
            <span className="font-bold text-slate-800">{initiative}</span>
          </div>
          <div>
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              {t("sum.regions")}
            </span>
            <span className="font-bold text-slate-800">{regionsLabel}</span>
          </div>
          <div>
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              {t("sum.score")}
            </span>
            <span className="font-bold text-brand-blue">
              {friction.badge.text}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              {t("sum.p1sla")}
            </span>
            <span className="font-bold text-red-600">
              {t("sum.hours", { n: state.sla.p1Hours })}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("sum.s1")}
          </h3>
          <p className="rounded border border-blue-100 bg-blue-50/50 p-3 text-xs leading-relaxed text-slate-700 italic">
            “{state.impactNarrative}”
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("sum.s2")}
          </h3>
          <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
            {(
              [
                ["sum.diagA", state.examples.a],
                ["sum.diagB", state.examples.b],
                ["sum.diagC", state.examples.c],
                ["sum.diagD", state.examples.d],
              ] as const
            ).map(([titleKey, example]) => (
              <div
                key={titleKey}
                className="space-y-1 rounded border border-slate-200 bg-slate-50 p-3"
              >
                <strong className="block font-semibold text-slate-800">
                  {t(titleKey)}
                </strong>
                <p className="text-slate-600">
                  {t("sum.ex", { text: example })}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("sum.s3")}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200 text-left text-xs">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="border-b p-2">{t("sum.priority")}</th>
                  <th className="border-b p-2">{t("sum.channel")}</th>
                  <th className="border-b p-2">{t("sum.sla")}</th>
                  <th className="border-b p-2">{t("sum.expect")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="p-2 font-bold text-red-700">{t("gov.p1")}</td>
                  <td className="p-2">{state.sla.p1Channel}</td>
                  <td className="p-2 font-bold">
                    {t("sum.hours", { n: state.sla.p1Hours })}
                  </td>
                  <td className="p-2">{t("gov.p1.expect")}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-amber-800">
                    {t("sum.p2short")}
                  </td>
                  <td className="p-2">{state.sla.p2Channel}</td>
                  <td className="p-2 font-bold">
                    {t("sum.days", { n: state.sla.p2Days })}
                  </td>
                  <td className="p-2">{t("gov.p2.expect")}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-blue-800">{t("gov.p3")}</td>
                  <td className="p-2">{state.sla.p3Channel}</td>
                  <td className="p-2 font-medium">{t("gov.p3.readonly")}</td>
                  <td className="p-2">{t("gov.p3.expect")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("sum.s4")}
          </h3>
          <div className="flex items-center justify-between rounded bg-slate-900 p-3 text-xs text-white">
            <span>{t("sum.deliverable", { task: state.dri.task })}</span>
            <span className="font-bold text-sky-300">{state.dri.owner}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("sum.s5")}
          </h3>
          <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
            {[state.pilot.change1, state.pilot.change2, state.pilot.change3].map(
              (change, index) => (
                <div
                  key={index}
                  className="rounded border border-slate-200 bg-slate-50 p-3"
                >
                  <span className="mb-1 block font-bold text-brand-blue">
                    {t("sum.routine", { n: index + 1 })}
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
                  <th className="border-b p-2">{t("sum.kpi")}</th>
                  <th className="border-b p-2">{t("sum.base")}</th>
                  <th className="border-b p-2">{t("sum.targ")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="p-2">
                    {state.pilot.kpiName1?.trim() || t("pilot.k1")}
                  </td>
                  <td className="p-2">{state.pilot.kpiBase1}</td>
                  <td className="p-2 font-semibold text-brand-blue">
                    {state.pilot.kpiTarg1}
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    {state.pilot.kpiName2?.trim() || t("pilot.k2")}
                  </td>
                  <td className="p-2">{state.pilot.kpiBase2}</td>
                  <td className="p-2 font-semibold text-brand-blue">
                    {state.pilot.kpiTarg2}
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    {state.pilot.kpiName3?.trim() || t("pilot.k3")}
                  </td>
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
            {t("sum.s6")}
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
                    {region.flag} {region.code} · {tRegionName(locale, region)}
                  </strong>
                  <p className="mt-1 text-slate-500">
                    {tRegionTagline(locale, region)}
                  </p>
                  <p className="mt-2 text-slate-600">
                    <span className="font-semibold">{t("sum.comm")}</span>{" "}
                    {tRegionField(locale, region, "communication")}
                  </p>
                  <p className="mt-1 text-slate-600">
                    <span className="font-semibold">{t("sum.meet")}</span>{" "}
                    {tRegionField(locale, region, "meetingNorms")}
                  </p>
                  <p className="mt-1 text-slate-600">
                    <span className="font-semibold">{t("sum.tip")}</span>{" "}
                    {tRegionField(locale, region, "tip")}
                  </p>
                  {(region.categories ?? [])
                    .filter(
                      (category) =>
                        category.title.trim() || category.detail.trim(),
                    )
                    .map((category) => (
                      <p key={category.id} className="mt-1 text-slate-600">
                        <span className="font-semibold">
                          {category.title.trim() || t("play.categoryName")}:
                        </span>{" "}
                        {category.detail}
                      </p>
                    ))}
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-300 pt-6 text-xs text-slate-500">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="border-t border-slate-300 pt-2">
              <p className="font-bold text-slate-700">{t("sum.lead")}</p>
              <p className="text-[10px]">{t("sum.confirmed")}</p>
            </div>
            <div className="border-t border-slate-300 pt-2">
              <p className="font-bold text-slate-700">{t("sum.counterpart")}</p>
              <p className="text-[10px]">{t("sum.confirmed")}</p>
            </div>
            <div className="border-t border-slate-300 pt-2">
              <p className="font-bold text-slate-700">{t("sum.facilitator")}</p>
              <p className="text-[10px]">{t("sum.pending")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
