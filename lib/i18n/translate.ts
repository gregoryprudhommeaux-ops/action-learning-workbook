import type { Locale } from "./types";
import { en } from "./en";
import { zh } from "./zh";

const dictionaries: Record<Locale, Record<string, string>> = { en, zh };

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const table = dictionaries[locale] ?? en;
  let text = table[key] ?? en[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export function messagesFor(locale: Locale) {
  return dictionaries[locale] ?? en;
}
