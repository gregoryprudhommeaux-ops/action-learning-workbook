"use client";

import { useWorkbook } from "@/components/workbook-provider";
import { useLocale } from "@/components/locale-provider";
import { tCompanyInCopy } from "@/lib/i18n";

export function BriefingSection() {
  const { locale, t } = useLocale();
  const { state, setTab, loadExample } = useWorkbook();

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-navy-900 via-navy-800 to-brand-blue p-6 text-white shadow-md">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-300">
            {t("briefing.kicker")}
          </span>
          <h2 className="mt-1 mb-3 text-2xl font-bold sm:text-3xl">
            {t("briefing.hero")}
          </h2>
          <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
            {t("briefing.lead", {
              company: tCompanyInCopy(locale, state.companyName),
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center space-x-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
              <span>{t("briefing.why")}</span>
            </h3>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p>{t("briefing.p1")}</p>
              <p>{t("briefing.p2")}</p>
              <div className="my-4 rounded-r-md border-l-4 border-brand-blue bg-blue-50 p-4">
                <p className="text-xs font-medium text-navy-900 sm:text-sm">
                  {t("briefing.callout")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
              {t("briefing.roadmap")}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(["r2", "r3", "r4"] as const).map((card) => (
                <div
                  key={card}
                  className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                      {t(`briefing.${card}.step`)}
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-800">
                      {t(`briefing.${card}.title`)}
                    </h4>
                    <p className="mt-2 text-xs text-slate-500">
                      {t(`briefing.${card}.body`)}
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-medium text-slate-400">
                    {t(`briefing.${card}.foot`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b border-slate-100 pb-3 text-base font-bold text-slate-900">
              {t("briefing.workspace")}
            </h3>
            <p className="mb-4 text-xs text-slate-500">
              {t("briefing.workspaceLead")}
            </p>
            <ul className="space-y-3 text-xs text-slate-600">
              {(["w1", "w2", "w3", "w4"] as const).map((item) => (
                <li key={item}>
                  <strong className="text-slate-800">
                    {t(`briefing.${item}.title`)}
                  </strong>{" "}
                  {t(`briefing.${item}.body`)}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setTab("scope")}
                className="block w-full rounded-lg bg-navy-900 py-2.5 text-center text-xs font-medium text-white transition hover:bg-slate-800"
              >
                {t("briefing.continue")}
              </button>
              <button
                type="button"
                onClick={loadExample}
                className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 text-center text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                {t("briefing.example")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
