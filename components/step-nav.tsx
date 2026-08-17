"use client";

import { TABS } from "@/lib/defaults";
import type { StepStatus } from "@/lib/completeness";
import type { TabId } from "@/lib/types";

function statusPhrase(status: StepStatus) {
  if (status === "done") return "complete";
  if (status === "blocked") return "needs input";
  return "not started";
}

export function StepNav({
  tab,
  setTab,
  stepStatusFor,
}: {
  tab: TabId;
  setTab: (id: TabId) => void;
  stepStatusFor: (id: TabId) => StepStatus;
}) {
  const index = TABS.findIndex((item) => item.id === tab);
  const current = TABS[index] ?? TABS[0];
  const prev = index > 0 ? TABS[index - 1] : null;
  const next = index < TABS.length - 1 ? TABS[index + 1] : null;

  return (
    <nav
      className="no-print sticky top-16 z-40 border-b border-slate-200 bg-white"
      aria-label="Workbook steps"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ol className="relative grid grid-cols-7 gap-0 py-3">
          <span
            aria-hidden="true"
            className="absolute top-[22px] right-[calc(100%/14)] left-[calc(100%/14)] h-px bg-slate-200"
          />
          {TABS.map((item, stepIndex) => {
            const active = tab === item.id;
            const status = stepStatusFor(item.id);
            return (
              <li key={item.id} className="relative z-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`Step ${stepIndex + 1}, ${item.label}, ${statusPhrase(status)}`}
                  title={item.label}
                  className="group flex w-full max-w-[7.5rem] flex-col items-center gap-1.5"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition ${circleClass(active, status)}`}
                  >
                    {status === "done" && !active ? (
                      <CheckIcon />
                    ) : (
                      stepIndex + 1
                    )}
                  </span>
                  <span
                    className={`hidden text-center text-[11px] leading-tight md:block ${
                      active
                        ? "font-semibold text-brand-blue"
                        : "font-medium text-slate-500 group-hover:text-navy-900"
                    }`}
                  >
                    {item.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 py-2 md:hidden">
          <button
            type="button"
            disabled={!prev}
            onClick={() => prev && setTab(prev.id)}
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 disabled:opacity-30"
          >
            Previous
          </button>
          <p className="min-w-0 truncate text-center text-xs font-semibold text-navy-900">
            {index + 1} / {TABS.length} · {current.label}
          </p>
          <button
            type="button"
            disabled={!next}
            onClick={() => next && setTab(next.id)}
            className="rounded-md px-2 py-1 text-xs font-medium text-brand-blue disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </nav>
  );
}

function circleClass(active: boolean, status: StepStatus) {
  if (active) return "bg-brand-blue text-white shadow-sm";
  if (status === "done") return "bg-emerald-600 text-white";
  if (status === "blocked") {
    return "border-2 border-amber-500 bg-white text-amber-700";
  }
  return "border border-slate-300 bg-white text-slate-500";
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
