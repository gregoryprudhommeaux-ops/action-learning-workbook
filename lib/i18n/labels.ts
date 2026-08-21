import { DEFAULT_REGIONS } from "../defaults";
import {
  packStatusKey,
  type MissingItemId,
} from "../completeness";
import type { Region, WorkbookState } from "../types";
import { isNamedCompany } from "../workbook-state";
import { translate } from "./translate";
import type { Locale } from "./types";

export function tCompanyInCopy(locale: Locale, name?: string) {
  return isNamedCompany(name) ? (name ?? "").trim() : translate(locale, "company.the");
}

export function tCompanyAsName(locale: Locale, name?: string) {
  return isNamedCompany(name) ? (name ?? "").trim() : translate(locale, "company.The");
}

export function tInitiativeLabel(locale: Locale, state: WorkbookState) {
  if (state.initiativeId === "other") {
    return (
      state.customInitiative.trim() || translate(locale, "init.customFallback")
    );
  }
  return translate(locale, `init.${state.initiativeId}.label`);
}

export function tRegionName(locale: Locale, region: Region) {
  return tRegionField(locale, region, "name");
}

export function tRegionTagline(locale: Locale, region: Region) {
  return tRegionField(locale, region, "tagline");
}

export type RegionTextField =
  | "name"
  | "tagline"
  | "communication"
  | "meetingNorms"
  | "tip";

/** Translate catalog defaults; keep custom edits as-is. */
export function tRegionField(
  locale: Locale,
  region: Region,
  field: RegionTextField,
) {
  const catalog = DEFAULT_REGIONS.find((item) => item.id === region.id);
  if (catalog && region[field] === catalog[field]) {
    return translate(locale, `region.${region.id}.${field}`);
  }
  return region[field];
}

export function tActiveRegionsLabel(locale: Locale, state: WorkbookState) {
  return state.regions
    .filter((region) => state.activeRegionIds.includes(region.id))
    .map((region) => `${region.code} ${tRegionName(locale, region)}`)
    .join(", ");
}

export function tFrictionBadge(locale: Locale, percent: number) {
  const key =
    percent > 65
      ? "friction.high"
      : percent > 30
        ? "friction.moderate"
        : "friction.low";
  return translate(locale, key, { percent });
}

export function tFrictionAnalysis(
  locale: Locale,
  counts: [number, number, number, number],
) {
  const axes = (
    [
      "friction.axis.time",
      "friction.axis.voice",
      "friction.axis.clarity",
      "friction.axis.power",
    ] as const
  )
    .filter((_, index) => counts[index] >= 2)
    .map((key) => translate(locale, key));
  if (axes.length > 0) {
    return translate(locale, "friction.analysis.critical", {
      axes: axes.join(", "),
    });
  }
  return translate(locale, "friction.analysis.balanced");
}

export function tPackStatus(locale: Locale, state: WorkbookState) {
  return translate(locale, `status.${packStatusKey(state)}`);
}

export function tMissingLabel(locale: Locale, id: MissingItemId) {
  return translate(locale, `missing.${id}`);
}
