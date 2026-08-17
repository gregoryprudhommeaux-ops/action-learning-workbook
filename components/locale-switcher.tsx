"use client";

import { LOCALES } from "@/lib/i18n/types";
import { useLocale } from "@/components/locale-provider";

const SHORT: Record<(typeof LOCALES)[number], string> = {
  en: "EN",
  zh: "中文",
  es: "ES",
};

export function LocaleSwitcher({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const { locale, setLocale, t } = useLocale();
  const dark = variant === "dark";

  return (
    <div
      role="group"
      aria-label={t("lang.switch")}
      className={`flex overflow-hidden rounded-md border text-[11px] font-semibold ${
        dark
          ? "border-slate-600 bg-slate-800"
          : "border-slate-200 bg-white"
      }`}
    >
      {LOCALES.map((item) => {
        const active = locale === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => setLocale(item)}
            aria-pressed={active}
            title={t(`lang.${item}`)}
            className={`px-2 py-1.5 transition ${
              active
                ? dark
                  ? "bg-brand-blue text-white"
                  : "bg-navy-900 text-white"
                : dark
                  ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                  : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {SHORT[item]}
          </button>
        );
      })}
    </div>
  );
}
