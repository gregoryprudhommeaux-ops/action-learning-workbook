"use client";

import { SlaBarChart } from "@/components/charts/sla-bar";
import { useWorkbook } from "@/components/workbook-provider";
import { useLocale } from "@/components/locale-provider";

export function GovernanceSection() {
  const { t } = useLocale();
  const { state, patch, setTab } = useWorkbook();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
          {t("gov.kicker")}
        </span>
        <h2 className="text-xl font-bold text-slate-900">{t("gov.title")}</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">{t("gov.lead")}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-lg border border-red-200 bg-red-50/30 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
                {t("gov.p1")}
              </span>
              <span className="text-xs font-semibold text-red-600">
                {t("gov.p1.when")}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  {t("gov.channel")}
                </label>
                <input
                  type="text"
                  value={state.sla.p1Channel}
                  onChange={(event) =>
                    patch("sla", { p1Channel: event.target.value })
                  }
                  className="w-full rounded border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  {t("gov.slaHours")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={state.sla.p1Hours}
                  onChange={(event) =>
                    patch("sla", {
                      p1Hours: Number(event.target.value) || 1,
                    })
                  }
                  className="w-full rounded border border-slate-300 p-2 text-xs font-bold text-red-700 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              <strong>{t("gov.expect")}</strong> {t("gov.p1.expect")}
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                {t("gov.p2")}
              </span>
              <span className="text-xs font-semibold text-amber-700">
                {t("gov.p2.when")}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  {t("gov.channel")}
                </label>
                <input
                  type="text"
                  value={state.sla.p2Channel}
                  onChange={(event) =>
                    patch("sla", { p2Channel: event.target.value })
                  }
                  className="w-full rounded border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  {t("gov.slaDays")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={state.sla.p2Days}
                  onChange={(event) =>
                    patch("sla", {
                      p2Days: Number(event.target.value) || 1,
                    })
                  }
                  className="w-full rounded border border-slate-300 p-2 text-xs font-bold text-amber-800 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              <strong>{t("gov.expect")}</strong> {t("gov.p2.expect")}
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-800">
                {t("gov.p3")}
              </span>
              <span className="text-xs font-semibold text-blue-700">
                {t("gov.p3.when")}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  {t("gov.channel")}
                </label>
                <input
                  type="text"
                  value={state.sla.p3Channel}
                  onChange={(event) =>
                    patch("sla", { p3Channel: event.target.value })
                  }
                  className="w-full rounded border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  {t("gov.sla")}
                </label>
                <input
                  type="text"
                  readOnly
                  value={t("gov.p3.readonly")}
                  className="w-full rounded border border-slate-200 bg-slate-100 p-2 text-xs font-medium text-slate-600"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              <strong>{t("gov.expect")}</strong> {t("gov.p3.expect")}
            </p>
          </div>

          <div className="space-y-3 rounded-lg bg-slate-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                {t("gov.dri")}
              </h4>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                {t("gov.dri.badge")}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              {t("gov.dri.body")}
            </p>
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <input
                type="text"
                value={state.dri.task}
                onChange={(event) => patch("dri", { task: event.target.value })}
                placeholder={t("gov.dri.task")}
                className="rounded border border-slate-700 bg-slate-800 p-2 text-xs text-white focus:ring-1 focus:ring-sky-400"
              />
              <input
                type="text"
                value={state.dri.owner}
                onChange={(event) =>
                  patch("dri", { owner: event.target.value })
                }
                placeholder={t("gov.dri.owner")}
                className="rounded border border-slate-700 bg-slate-800 p-2 text-xs font-semibold text-sky-300 focus:ring-1 focus:ring-sky-400"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-36 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-1 text-center text-sm font-bold text-slate-800">
              {t("gov.chart")}
            </h3>
            <p className="mb-4 text-center text-xs text-slate-500">
              {t("gov.chartHelp")}
            </p>
            <SlaBarChart
              p1Hours={state.sla.p1Hours}
              p2Days={state.sla.p2Days}
            />
            <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-white p-3">
              <span className="block text-xs font-bold text-slate-800">
                {t("gov.path")}
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 p-2">
                  <span className="font-semibold text-slate-700">
                    {t("gov.l1")}
                  </span>
                  <span className="text-slate-500">{t("gov.l1.meta")}</span>
                </div>
                <div className="text-center text-xs font-bold text-slate-400">
                  {t("gov.exceeded")}
                </div>
                <div className="flex items-center justify-between rounded border border-blue-200 bg-blue-50 p-2">
                  <span className="font-semibold text-brand-blue">
                    {t("gov.l2")}
                  </span>
                  <span className="text-brand-blue">{t("gov.l2.meta")}</span>
                </div>
                <div className="text-center text-xs font-bold text-slate-400">
                  {t("gov.deadlock")}
                </div>
                <div className="flex items-center justify-between rounded border border-red-200 bg-red-50 p-2">
                  <span className="font-semibold text-red-700">
                    {t("gov.l3")}
                  </span>
                  <span className="text-red-600">{t("gov.l3.meta")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => setTab("playbook")}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          {t("gov.next")}
        </button>
      </div>
    </div>
  );
}
