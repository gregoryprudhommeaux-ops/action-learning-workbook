"use client";

import { useState } from "react";
import { ACCENT_STYLES } from "@/lib/defaults";
import type { Region, RegionAccent, RegionCategory } from "@/lib/types";
import { useWorkbook } from "@/components/workbook-provider";
import { useLocale } from "@/components/locale-provider";
import { tRegionField, tRegionName } from "@/lib/i18n";
import type { RegionTextField } from "@/lib/i18n/labels";

const ACCENTS: RegionAccent[] = [
  "red",
  "amber",
  "emerald",
  "blue",
  "purple",
  "slate",
];

function newCategory(): RegionCategory {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `cat-${Date.now()}`,
    title: "",
    detail: "",
  };
}

export function PlaybookSection() {
  const { locale, t } = useLocale();
  const { state, upsertRegion, addRegion, removeRegion, setTab } =
    useWorkbook();
  const [selectedId, setSelectedId] = useState(state.regions[0]?.id ?? "");

  const selected =
    state.regions.find((region) => region.id === selectedId) ??
    state.regions[state.regions.length - 1];

  if (!selected) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">{t("play.empty")}</p>
        <button
          type="button"
          onClick={addRegion}
          className="mt-4 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white"
        >
          {t("play.add")}
        </button>
      </div>
    );
  }

  const styles = ACCENT_STYLES[selected.accent];
  const categories = selected.categories ?? [];

  function edit(field: RegionTextField | "flag" | "code", value: string) {
    upsertRegion({ ...selected, [field]: value });
  }

  function setCategories(next: RegionCategory[]) {
    upsertRegion({ ...selected, categories: next });
  }

  function editCategory(
    id: string,
    field: "title" | "detail",
    value: string,
  ) {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, [field]: value } : category,
      ),
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
          {t("play.kicker")}
        </span>
        <h2 className="text-xl font-bold text-slate-900">{t("play.title")}</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">{t("play.lead")}</p>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center">
        <div className="flex w-full space-x-2 overflow-x-auto sm:w-auto">
          {state.regions.map((region) => {
            const active = region.id === selected.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => setSelectedId(region.id)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                  active
                    ? "border border-brand-blue bg-blue-50 text-brand-blue"
                    : "border border-slate-200 text-slate-600"
                }`}
              >
                {region.flag} {tRegionName(locale, region)}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedId(addRegion());
          }}
          className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          {t("play.addPlus")}
        </button>
      </div>

      <div className="mt-6">
        <div className={`space-y-4 rounded-xl border p-5 ${styles.wrap}`}>
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center space-x-3">
              <input
                value={selected.flag}
                onChange={(event) => edit("flag", event.target.value)}
                className="w-16 rounded border border-white/80 bg-white p-2 text-center text-2xl"
                aria-label={t("play.emoji")}
              />
              <div className="space-y-1">
                <input
                  value={tRegionField(locale, selected, "name")}
                  onChange={(event) => edit("name", event.target.value)}
                  className="w-full rounded border border-white/80 bg-white px-2 py-1 text-base font-bold text-slate-900"
                />
                <input
                  value={tRegionField(locale, selected, "tagline")}
                  onChange={(event) => edit("tagline", event.target.value)}
                  className={`w-full rounded border border-white/80 bg-white px-2 py-1 text-xs font-medium ${styles.tag}`}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {t("play.code")}
              </label>
              <input
                value={selected.code}
                onChange={(event) =>
                  edit("code", event.target.value.toUpperCase().slice(0, 6))
                }
                className="w-20 rounded border border-white/80 bg-white px-2 py-1 text-xs font-bold"
              />
              <select
                value={selected.accent}
                onChange={(event) =>
                  upsertRegion({
                    ...selected,
                    accent: event.target.value as RegionAccent,
                  })
                }
                className="rounded border border-white/80 bg-white px-2 py-1 text-xs"
              >
                {ACCENTS.map((accent) => (
                  <option key={accent} value={accent}>
                    {t(`play.accent.${accent}`)}
                  </option>
                ))}
              </select>
              {state.regions.length > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const remaining = state.regions.filter(
                      (region) => region.id !== selected.id,
                    );
                    removeRegion(selected.id);
                    setSelectedId(remaining[0]?.id ?? "");
                  }}
                  className="rounded border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700"
                >
                  {t("play.remove")}
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
            {(
              [
                ["communication", "play.comm", "play.commExample"],
                ["meetingNorms", "play.meet", "play.meetExample"],
                ["tip", "play.tipField", "play.tipExample"],
              ] as const
            ).map(([field, labelKey, exampleKey]) => (
              <div
                key={field}
                className={`rounded-lg border bg-white p-3.5 shadow-sm ${styles.card}`}
              >
                <strong className="mb-1 block text-slate-800">
                  {t(labelKey)}
                </strong>
                <textarea
                  rows={5}
                  value={tRegionField(locale, selected, field)}
                  onChange={(event) => edit(field, event.target.value)}
                  placeholder={t(exampleKey)}
                  className="w-full resize-y rounded border border-slate-200 p-2 text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                />
              </div>
            ))}
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`rounded-lg border bg-white p-3.5 shadow-sm ${styles.card}`}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <label className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                      {t("play.categoryName")}
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setCategories(
                          categories.filter((item) => item.id !== category.id),
                        )
                      }
                      className="text-[10px] font-semibold text-red-600 hover:text-red-700"
                    >
                      {t("play.removeCategory")}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={category.title}
                    onChange={(event) =>
                      editCategory(category.id, "title", event.target.value)
                    }
                    placeholder={t("play.categoryName")}
                    className="mb-3 w-full rounded border border-slate-200 p-2 font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                  <label className="mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                    {t("play.categoryDetail")}
                  </label>
                  <textarea
                    rows={4}
                    value={category.detail}
                    onChange={(event) =>
                      editCategory(category.id, "detail", event.target.value)
                    }
                    placeholder={t("play.categoryDetail")}
                    className="w-full resize-y rounded border border-slate-200 p-2 text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div>
            <button
              type="button"
              onClick={() => setCategories([...categories, newCategory()])}
              className="rounded-lg border border-dashed border-slate-300 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-slate-700 uppercase transition hover:border-brand-blue hover:text-brand-blue"
            >
              {t("play.addCategory")}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-400">{t("play.stored")}</span>
        <button
          type="button"
          onClick={() => setTab("pilot")}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          {t("play.next")}
        </button>
      </div>
    </div>
  );
}
