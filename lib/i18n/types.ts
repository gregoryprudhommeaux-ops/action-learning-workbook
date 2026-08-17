export const LOCALES = ["en", "es", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  zh: "中文",
};

export const LOCALE_HTML: Record<Locale, string> = {
  en: "en",
  es: "es",
  zh: "zh-CN",
};

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "alp_locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "es" || value === "zh";
}
