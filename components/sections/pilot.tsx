"use client";

import { useWorkbook } from "@/components/workbook-provider";
import { useLocale } from "@/components/locale-provider";

export function PilotSection() {
  const { t } = useLocale();
  const { state, patch, roi, setTab } = useWorkbook();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
          {t("pilot.kicker")}
        </span>
        <h2 className="text-xl font-bold text-slate-900">{t("pilot.title")}</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">{t("pilot.lead")}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {t("pilot.routines")}
          </h3>
          <div className="space-y-3">
            {(
              [
                ["change1", "pilot.c1"],
                ["change2", "pilot.c2"],
                ["change3", "pilot.c3"],
              ] as const
            ).map(([field, labelKey]) => (
              <div
                key={field}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3.5"
              >
                <label className="mb-1 block text-xs font-semibold text-slate-800">
                  {t(labelKey)}
                </label>
                <input
                  type="text"
                  value={state.pilot[field]}
                  onChange={(event) =>
                    patch("pilot", { [field]: event.target.value })
                  }
                  className="w-full rounded border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-brand-blue"
                />
              </div>
            ))}
          </div>

          <h3 className="pt-3 text-xs font-bold uppercase tracking-wider text-slate-700">
            {t("pilot.kpi")}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200 text-xs">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="border-b p-2 text-left">{t("pilot.metric")}</th>
                  <th className="border-b p-2 text-left">
                    {t("pilot.baseline")}
                  </th>
                  <th className="border-b p-2 text-left">{t("pilot.target")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {(
                  [
                    ["kpiName1", "pilot.k1", "kpiBase1", "kpiTarg1"],
                    ["kpiName2", "pilot.k2", "kpiBase2", "kpiTarg2"],
                    ["kpiName3", "pilot.k3", "kpiBase3", "kpiTarg3"],
                  ] as const
                ).map(([name, placeholderKey, base, target]) => (
                  <tr key={name}>
                    <td className="p-2">
                      <input
                        type="text"
                        value={state.pilot[name]}
                        onChange={(event) =>
                          patch("pilot", { [name]: event.target.value })
                        }
                        placeholder={t(placeholderKey)}
                        className="w-full rounded border border-slate-300 p-1 text-xs font-medium"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={state.pilot[base]}
                        onChange={(event) =>
                          patch("pilot", { [base]: event.target.value })
                        }
                        className="w-full rounded border border-slate-300 p-1 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={state.pilot[target]}
                        onChange={(event) =>
                          patch("pilot", { [target]: event.target.value })
                        }
                        className="w-full rounded border border-slate-300 p-1 text-xs font-semibold text-brand-blue"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-36 space-y-4 rounded-xl bg-slate-900 p-5 text-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-sky-400">
                {t("pilot.gain")}
              </h3>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                {t("pilot.live")}
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block text-slate-300">
                  {t("pilot.team")}
                </label>
                <input
                  type="number"
                  min={2}
                  max={100}
                  value={state.calc.teamSize}
                  onChange={(event) =>
                    patch("calc", {
                      teamSize: Number(event.target.value) || 2,
                    })
                  }
                  className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-xs font-bold text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-300">
                  {t("pilot.hours")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={state.calc.hoursPerWk}
                  onChange={(event) =>
                    patch("calc", {
                      hoursPerWk: Number(event.target.value) || 1,
                    })
                  }
                  className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-xs font-bold text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-300">
                  {t("pilot.pct")}
                </label>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={state.calc.pctGain}
                  onChange={(event) =>
                    patch("calc", {
                      pctGain: Number(event.target.value) || 10,
                    })
                  }
                  className="w-full accent-brand-light"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{t("pilot.minor")}</span>
                  <span className="font-bold text-sky-300">
                    {t("pilot.pctValue", { n: state.calc.pctGain })}
                  </span>
                  <span>{t("pilot.major")}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-lg border border-slate-700 bg-slate-800 p-4">
              <span className="block text-[11px] font-semibold uppercase text-slate-400">
                {t("pilot.savings")}
              </span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded border border-slate-700 bg-slate-900 p-2">
                  <span className="block text-xl font-bold text-emerald-400">
                    {t("pilot.hrs", { n: roi.monthly })}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t("pilot.month")}
                  </span>
                </div>
                <div className="rounded border border-slate-700 bg-slate-900 p-2">
                  <span className="block text-xl font-bold text-sky-300">
                    {t("pilot.hrs", { n: roi.pilot })}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t("pilot.six")}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 italic">
              {t("pilot.note")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => setTab("compiled")}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          {t("pilot.next")}
        </button>
      </div>
    </div>
  );
}
