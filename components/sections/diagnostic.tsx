"use client";

import { FrictionRadar } from "@/components/charts/friction-radar";
import { useWorkbook } from "@/components/workbook-provider";
import { useLocale } from "@/components/locale-provider";
import { DIAGNOSTIC_AXES } from "@/lib/defaults";

export function DiagnosticSection() {
  const { t } = useLocale();
  const { state, patch, toggleDiagnostic, friction, setTab } = useWorkbook();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
            {t("diag.kicker")}
          </span>
          <h2 className="text-xl font-bold text-slate-900">{t("diag.title")}</h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {t("diag.lead")}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
          <span className="block text-xs font-medium text-slate-500">
            {t("diag.score")}
          </span>
          <span className={friction.badge.className}>{friction.badge.text}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {DIAGNOSTIC_AXES.map((axis) => (
            <div
              key={axis.key}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-800">
                  {axis.emoji} {t(`diag.${axis.key}.title`)}
                </h3>
                <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-xs text-slate-700">
                  {t(`diag.${axis.key}.tag`)}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {axis.items.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-start space-x-2.5 text-xs text-slate-700"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 rounded text-brand-blue"
                      checked={state.diagnostics[item.id]}
                      onChange={() => toggleDiagnostic(item.id)}
                    />
                    <span>{t(`diag.${item.id}`)}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  {t("diag.example")}
                </label>
                <input
                  type="text"
                  value={state.examples[axis.key]}
                  onChange={(event) =>
                    patch("examples", {
                      [axis.key]: event.target.value,
                    } as Partial<typeof state.examples>)
                  }
                  placeholder={t(`diag.${axis.key}.ph`)}
                  className="w-full rounded border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-brand-blue"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-36 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-1 text-center text-sm font-bold text-slate-800">
              {t("diag.radar")}
            </h3>
            <p className="mb-4 text-center text-xs text-slate-500">
              {t("diag.radarHelp")}
            </p>
            <FrictionRadar counts={friction.counts} />
            <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
              <span className="block text-xs font-bold text-slate-800">
                {t("diag.synthesis")}
              </span>
              <p className="leading-relaxed">{friction.analysis}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => setTab("governance")}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          {t("diag.next")}
        </button>
      </div>
    </div>
  );
}
