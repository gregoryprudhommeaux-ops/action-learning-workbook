"use client";

import { SlaBarChart } from "@/components/charts/sla-bar";
import { useWorkbook } from "@/components/workbook-provider";

export function GovernanceSection() {
  const { state, patch, setTab } = useWorkbook();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
          Pre-work Step 3
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          Draft the working agreement and SLA protocol
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Set quantitative targets for cross-border communication and
          escalation. Do not leave these blank before the live session.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-lg border border-red-200 bg-red-50/30 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
                Priority 1: Critical
              </span>
              <span className="text-xs font-semibold text-red-600">
                Outage, audit finding, safety / quality stop
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Primary channel
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
                  Target SLA (hours)
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
              <strong>Expectation:</strong> Immediate verbal confirmation +
              formal incident owner within 2 hours.
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                Priority 2: Standard operations
              </span>
              <span className="text-xs font-semibold text-amber-700">
                SOP review, process inquiry
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Primary channel
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
                  Target SLA (business days)
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
              <strong>Expectation:</strong> Written feedback or an extension
              request before the deadline.
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-800">
                Priority 3: Info-only
              </span>
              <span className="text-xs font-semibold text-blue-700">
                Weekly status, general progress
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Primary channel
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
                  Target SLA
                </label>
                <input
                  type="text"
                  readOnly
                  value="No live response required"
                  className="w-full rounded border border-slate-200 bg-slate-100 p-2 text-xs font-medium text-slate-600"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              <strong>Expectation:</strong> Reviewed asynchronously; questions
              raised in scheduled syncs.
            </p>
          </div>

          <div className="space-y-3 rounded-lg bg-slate-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Directly Responsible Individual (DRI) rule
              </h4>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                Mandatory principle
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Every cross-regional deliverable has <strong>one named DRI</strong>.
              Co-ownership across sites creates accountability voids when
              friction hits.
            </p>
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <input
                type="text"
                value={state.dri.task}
                onChange={(event) => patch("dri", { task: event.target.value })}
                placeholder="Deliverable"
                className="rounded border border-slate-700 bg-slate-800 p-2 text-xs text-white focus:ring-1 focus:ring-sky-400"
              />
              <input
                type="text"
                value={state.dri.owner}
                onChange={(event) =>
                  patch("dri", { owner: event.target.value })
                }
                placeholder="Named DRI"
                className="rounded border border-slate-700 bg-slate-800 p-2 text-xs font-semibold text-sky-300 focus:ring-1 focus:ring-sky-400"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-36 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-1 text-center text-sm font-bold text-slate-800">
              Baseline vs. target response times
            </h3>
            <p className="mb-4 text-center text-xs text-slate-500">
              Targeted reduction in communication friction (hours)
            </p>
            <SlaBarChart
              p1Hours={state.sla.p1Hours}
              p2Days={state.sla.p2Days}
            />
            <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-white p-3">
              <span className="block text-xs font-bold text-slate-800">
                3-tier cross-border escalation path
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 p-2">
                  <span className="font-semibold text-slate-700">
                    Level 1: DRI task owner
                  </span>
                  <span className="text-slate-500">Resolves within SLA</span>
                </div>
                <div className="text-center text-xs font-bold text-slate-400">
                  ↓ (SLA exceeded)
                </div>
                <div className="flex items-center justify-between rounded border border-blue-200 bg-blue-50 p-2">
                  <span className="font-semibold text-brand-blue">
                    Level 2: Site leads sync
                  </span>
                  <span className="text-brand-blue">Joint alignment call</span>
                </div>
                <div className="text-center text-xs font-bold text-slate-400">
                  ↓ (Deadlock)
                </div>
                <div className="flex items-center justify-between rounded border border-red-200 bg-red-50 p-2">
                  <span className="font-semibold text-red-700">
                    Level 3: Executive sponsor
                  </span>
                  <span className="text-red-600">Final decision rights</span>
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
          Proceed to regional playbook →
        </button>
      </div>
    </div>
  );
}
