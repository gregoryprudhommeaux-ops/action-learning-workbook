"use client";

import { useEffect, useRef, useState } from "react";
import { TABS } from "@/lib/defaults";
import { useLocale } from "@/components/locale-provider";
import type { StepStatus } from "@/lib/completeness";
import type { TabId } from "@/lib/types";

function statusKey(status: StepStatus) {
  if (status === "done") return "nav.complete";
  if (status === "blocked") return "nav.blocked";
  return "nav.todo";
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
  const { t } = useLocale();
  const index = TABS.findIndex((item) => item.id === tab);
  const current = TABS[index] ?? TABS[0];
  const prev = index > 0 ? TABS[index - 1] : null;
  const next = index < TABS.length - 1 ? TABS[index + 1] : null;
  const doneAtOpen = useRef<Partial<Record<TabId, boolean>>>({});
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    doneAtOpen.current = Object.fromEntries(
      TABS.map((item) => [item.id, stepStatusFor(item.id) === "done"]),
    );
    setSessionReady(true);
    // Snapshot once per page load — not when the pack later changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      className="no-print sticky top-16 z-40 border-b border-slate-200 bg-white"
      aria-label={t("nav.aria")}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <ol className="relative grid grid-cols-7 gap-0 py-2.5 sm:py-3">
          <span
            aria-hidden="true"
            className="absolute top-[20px] right-[calc(100%/14)] left-[calc(100%/14)] h-px bg-slate-200 sm:top-[22px]"
          />
          {TABS.map((item, stepIndex) => {
            const active = tab === item.id;
            const status = stepStatusFor(item.id);
            const completedThisVisit =
              sessionReady &&
              status === "done" &&
              !doneAtOpen.current[item.id];
            const label = t(`tab.${item.id}`);
            return (
              <li key={item.id} className="relative z-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-current={active ? "step" : undefined}
                  aria-label={t("nav.stepAria", {
                    n: stepIndex + 1,
                    label,
                    status: t(statusKey(status)),
                  })}
                  title={label}
                  className="group flex w-full max-w-[7.5rem] flex-col items-center gap-1 py-0.5 sm:gap-1.5"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold transition sm:h-7 sm:w-7 ${circleClass(active, completedThisVisit)}`}
                  >
                    {completedThisVisit && !active ? (
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
                    {t(`tab.short.${item.id}`)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 py-1.5 md:hidden">
          <button
            type="button"
            disabled={!prev}
            onClick={() => prev && setTab(prev.id)}
            className="min-h-10 min-w-14 rounded-md px-3 py-2 text-xs font-medium text-slate-600 disabled:opacity-30"
          >
            {t("nav.prev")}
          </button>
          <p className="min-w-0 flex-1 truncate px-1 text-center text-xs font-semibold text-navy-900">
            {index + 1} / {TABS.length} · {t(`tab.${current.id}`)}
          </p>
          <button
            type="button"
            disabled={!next}
            onClick={() => next && setTab(next.id)}
            className="min-h-10 min-w-14 rounded-md px-3 py-2 text-xs font-medium text-brand-blue disabled:opacity-30"
          >
            {t("nav.next")}
          </button>
        </div>
      </div>
    </nav>
  );
}

function circleClass(active: boolean, completedThisVisit: boolean) {
  if (active) return "bg-brand-blue text-white shadow-sm";
  if (completedThisVisit) return "bg-emerald-600 text-white";
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
