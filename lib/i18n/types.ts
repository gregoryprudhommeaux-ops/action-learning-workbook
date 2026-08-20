export const LOCALES = ["en", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  zh: "中文",
};

export const LOCALE_HTML: Record<Locale, string> = {
  en: "en",
  zh: "zh-CN",
};

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "alp_locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "zh";
}
