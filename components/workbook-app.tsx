"use client";

import { BriefingSection } from "@/components/sections/briefing";
import { CompiledSection } from "@/components/sections/compiled";
import { DiagnosticSection } from "@/components/sections/diagnostic";
import { GovernanceSection } from "@/components/sections/governance";
import { PilotSection } from "@/components/sections/pilot";
import { PlaybookSection } from "@/components/sections/playbook";
import { ScopeSection } from "@/components/sections/scope";
import { useWorkbook, WorkbookProvider } from "@/components/workbook-provider";
import { TABS } from "@/lib/defaults";

function WorkbookShell() {
  const {
    tab,
    setTab,
    toast,
    saveManual,
    submitPack,
    state,
    stepStatusFor,
    packStatus,
  } = useWorkbook();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased">
      {toast ? (
        <div className="fixed right-5 bottom-5 z-50 flex items-center space-x-2 rounded-lg bg-navy-900 px-4 py-3 text-xs text-white shadow-xl">
          <span>{toast.icon}</span>
          <span>{toast.message}</span>
        </div>
      ) : null}

      <header className="no-print sticky top-0 z-50 border-b border-slate-700 bg-navy-900 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="rounded bg-brand-blue px-2.5 py-1 text-xs font-bold tracking-wider text-white uppercase">
                ALP
              </span>
              <h1 className="hidden text-lg font-semibold tracking-tight text-slate-100 md:block">
                Action Learning Workbook
              </h1>
              <h1 className="text-base font-semibold tracking-tight text-slate-100 md:hidden">
                ALP Workbook
              </h1>
              {state.authorFullName ? (
                <span className="hidden text-xs text-slate-400 lg:inline">
                  · {state.authorFullName}
                  {state.companyName ? ` · ${state.companyName}` : ""}
                </span>
              ) : state.companyName ? (
                <span className="hidden text-xs text-slate-400 lg:inline">
                  · {state.companyName}
                </span>
              ) : null}
            </div>
            <div className="flex items-center space-x-2 text-xs sm:space-x-3">
              <button
                type="button"
                onClick={saveManual}
                title="Saves in this browser only"
                className="flex items-center space-x-1 rounded border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-slate-200 transition hover:bg-slate-700"
              >
                <span className="sm:hidden">Save here</span>
                <span className="hidden sm:inline">Save on this device</span>
              </button>
              <button
                type="button"
                onClick={() => void submitPack()}
                className="flex items-center space-x-1 rounded bg-brand-blue px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
              >
                <span>Submit pack</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="no-print sticky top-16 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="no-scrollbar flex space-x-1 overflow-x-auto py-2 text-xs font-medium text-slate-600 sm:text-sm">
            {TABS.map((item) => {
              const active = tab === item.id;
              const status = stepStatusFor(item.id);
              const dotClass =
                status === "done"
                  ? "bg-emerald-500"
                  : status === "blocked"
                    ? "bg-amber-500"
                    : "bg-slate-300";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-current={active ? "step" : undefined}
                  className={`flex items-center whitespace-nowrap rounded-md px-3 py-2 transition sm:px-4 ${
                    active
                      ? "border-b-2 border-brand-blue bg-brand-soft font-semibold text-brand-blue"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${dotClass}`}
                    aria-hidden="true"
                  />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-6 sm:px-6 lg:px-8">
        {tab === "briefing" ? <BriefingSection /> : null}
        {tab === "scope" ? <ScopeSection /> : null}
        {tab === "diagnostic" ? <DiagnosticSection /> : null}
        {tab === "governance" ? <GovernanceSection /> : null}
        {tab === "playbook" ? <PlaybookSection /> : null}
        {tab === "pilot" ? <PilotSection /> : null}
        {tab === "compiled" ? <CompiledSection /> : null}
      </main>

      <footer className="no-print mt-12 border-t border-slate-800 bg-navy-950 py-6 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between space-y-3 px-4 sm:flex-row sm:space-y-0 sm:px-6 lg:px-8">
          <div>
            <span className="font-bold text-slate-200">
              Action Learning Workbook
            </span>{" "}
            — cross-border operational excellence
          </div>
          <div className="flex space-x-6">
            <span>
              {packStatus}. Submit the pack so the facilitator can export the
              PDF for the live audit.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function WorkbookApp() {
  return (
    <WorkbookProvider>
      <WorkbookShell />
    </WorkbookProvider>
  );
}
