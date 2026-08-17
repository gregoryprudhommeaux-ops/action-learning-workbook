"use client";

import { useWorkbook } from "@/components/workbook-provider";

export function PilotSection() {
  const { state, patch, roi, setTab } = useWorkbook();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
          Implementation & metrics
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          4–6 week pilot commitment & KPI calculator
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Name the behavioral routines you will test, then quantify estimated
          efficiency gains.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            A. Pilot routine commitments
          </h3>
          <div className="space-y-3">
            {(
              [
                ["change1", "Routine change 1: Email tagging & SLA protocol"],
                ["change2", "Routine change 2: Meeting leadership rotation"],
                ["change3", "Routine change 3: Governance DRI rule"],
              ] as const
            ).map(([field, label]) => (
              <div
                key={field}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3.5"
              >
                <label className="mb-1 block text-xs font-semibold text-slate-800">
                  {label}
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
            B. Target KPI matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200 text-xs">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="border-b p-2 text-left">Metric area</th>
                  <th className="border-b p-2 text-left">Baseline (current)</th>
                  <th className="border-b p-2 text-left">Target (post-pilot)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {(
                  [
                    [
                      "SOP review response time",
                      "kpiBase1",
                      "kpiTarg1",
                    ],
                    [
                      "Off-hours call frequency",
                      "kpiBase2",
                      "kpiTarg2",
                    ],
                    [
                      "Cross-site trust rating",
                      "kpiBase3",
                      "kpiTarg3",
                    ],
                  ] as const
                ).map(([label, base, target]) => (
                  <tr key={label}>
                    <td className="p-2 font-medium">{label}</td>
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
                Estimated efficiency gain
              </h3>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                Live projection
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block text-slate-300">
                  Team size across sites
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
                  Avg weekly hours in alignment / follow-ups per person
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
                  Estimated friction-reduction efficiency
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
                  <span>10% (minor)</span>
                  <span className="font-bold text-sky-300">
                    {state.calc.pctGain}% efficiency gain
                  </span>
                  <span>50% (major)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-lg border border-slate-700 bg-slate-800 p-4">
              <span className="block text-[11px] font-semibold uppercase text-slate-400">
                Projected pilot savings
              </span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded border border-slate-700 bg-slate-900 p-2">
                  <span className="block text-xl font-bold text-emerald-400">
                    {roi.monthly} hrs
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Hours saved / month
                  </span>
                </div>
                <div className="rounded border border-slate-700 bg-slate-900 p-2">
                  <span className="block text-xl font-bold text-sky-300">
                    {roi.pilot} hrs
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Saved in 6-wk pilot
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 italic">
              Reducing response lag and naming one DRI per deliverable is how
              the team reclaims engineering and operations hours.
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
          Proceed to Step 7: Compiled summary →
        </button>
      </div>
    </div>
  );
}
