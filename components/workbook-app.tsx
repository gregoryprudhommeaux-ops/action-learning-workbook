"use client";

import { BriefingSection } from "@/components/sections/briefing";
import { CompiledSection } from "@/components/sections/compiled";
import { DiagnosticSection } from "@/components/sections/diagnostic";
import { GovernanceSection } from "@/components/sections/governance";
import { PilotSection } from "@/components/sections/pilot";
import { PlaybookSection } from "@/components/sections/playbook";
import { ScopeSection } from "@/components/sections/scope";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { StepNav } from "@/components/step-nav";
import { useLocale } from "@/components/locale-provider";
import { useWorkbook, WorkbookProvider } from "@/components/workbook-provider";

function WorkbookShell() {
  const { t } = useLocale();
  const {
    tab,
    setTab,
    toast,
    saveManual,
    state,
    stepStatusFor,
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
                {t("app.title")}
              </h1>
              <h1 className="text-base font-semibold tracking-tight text-slate-100 md:hidden">
                {t("app.titleShort")}
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
              <LocaleSwitcher />
              <button
                type="button"
                onClick={saveManual}
                title={t("app.saveTitle")}
                className="flex items-center space-x-1 rounded border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-slate-200 transition hover:bg-slate-700"
              >
                <span className="sm:hidden">{t("app.saveShort")}</span>
                <span className="hidden sm:inline">{t("app.save")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <StepNav tab={tab} setTab={setTab} stepStatusFor={stepStatusFor} />

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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:items-end sm:px-6 lg:px-8">
          <div className="space-y-1 text-center sm:text-left">
            <div>
              <span className="font-bold text-slate-200">{t("app.title")}</span>{" "}
              — {t("app.tagline")}
            </div>
            <p>
              {t("app.developed")}{" "}
              <a
                href="https://nextstep-suite.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-300 underline decoration-slate-600 underline-offset-2 transition hover:text-white"
              >
                {t("app.suite")}
              </a>
              <span className="text-slate-600"> · </span>
              <a
                href="/admin"
                className="font-medium text-slate-300 underline decoration-slate-600 underline-offset-2 transition hover:text-white"
              >
                {t("app.adminLogin")}
              </a>
            </p>
          </div>
          <div className="max-w-md text-center sm:text-right">
            {t("app.footerStatus")}
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
