import { defaultState, INITIATIVES, STORAGE_KEY } from "./defaults";
import type { Diagnostics, WorkbookState } from "./types";

export function diagnosticCounts(d: Diagnostics): [number, number, number, number] {
  const n = (keys: (keyof Diagnostics)[]) =>
    keys.reduce((sum, key) => sum + (d[key] ? 1 : 0), 0);
  return [
    n(["a1", "a2", "a3"]),
    n(["b1", "b2", "b3"]),
    n(["c1", "c2", "c3"]),
    n(["d1", "d2", "d3"]),
  ];
}

export function frictionPercent(d: Diagnostics): number {
  const total = diagnosticCounts(d).reduce((a, b) => a + b, 0);
  return Math.round((total / 12) * 100);
}

export function frictionBadge(percent: number): { text: string; className: string } {
  if (percent > 65) {
    return {
      text: `High Friction (${percent}/100)`,
      className: "text-lg font-bold text-red-600",
    };
  }
  if (percent > 30) {
    return {
      text: `Moderate Friction (${percent}/100)`,
      className: "text-lg font-bold text-brand-blue",
    };
  }
  return {
    text: `Low Friction (${percent}/100)`,
    className: "text-lg font-bold text-emerald-600",
  };
}

export function frictionAnalysis(counts: [number, number, number, number]): string {
  const labels = [
    "Time & Boundaries",
    "Voice & Psychological Safety",
    "Message Clarity",
    "Power Distance & Hierarchy",
  ];
  const primary = labels.filter((_, i) => counts[i] >= 2);
  if (primary.length > 0) {
    return `Your project exhibits critical friction in ${primary.join(", ")}. Prioritize explicit SLA response times and one named DRI per deliverable.`;
  }
  return "Your project shows balanced alignment across parameters. Keep refining SLAs for the live peer-audit session.";
}

export function roiHours(calc: WorkbookState["calc"]): {
  monthly: number;
  pilot: number;
} {
  const weeklySaved = calc.teamSize * calc.hoursPerWk * (calc.pctGain / 100);
  return {
    monthly: Math.round(weeklySaved * 4),
    pilot: Math.round(weeklySaved * 6),
  };
}

const GENERIC_COMPANY = new Set(["acme global", "acme"]);

export function isNamedCompany(name: string | undefined): boolean {
  const value = (name ?? "").trim();
  if (!value) return false;
  return !GENERIC_COMPANY.has(value.toLowerCase());
}

export function companyInCopy(name: string | undefined): string {
  return isNamedCompany(name) ? (name ?? "").trim() : "the company";
}

export function companyAsName(name: string | undefined): string {
  return isNamedCompany(name) ? (name ?? "").trim() : "The company";
}

export function initiativeLabel(state: WorkbookState): string {
  if (state.initiativeId === "other") {
    return state.customInitiative.trim() || "Custom operational focus";
  }
  return INITIATIVES.find((item) => item.id === state.initiativeId)?.label ?? state.initiativeId;
}

export function activeRegionsLabel(state: WorkbookState): string {
  return state.regions
    .filter((region) => state.activeRegionIds.includes(region.id))
    .map((region) => `${region.code} ${region.name}`)
    .join(", ");
}

export function mergeState(parsed: Partial<WorkbookState>): WorkbookState {
  const merged: WorkbookState = {
    ...defaultState,
    ...parsed,
    diagnostics: { ...defaultState.diagnostics, ...parsed.diagnostics },
    examples: { ...defaultState.examples, ...parsed.examples },
    sla: { ...defaultState.sla, ...parsed.sla },
    dri: { ...defaultState.dri, ...parsed.dri },
    pilot: { ...defaultState.pilot, ...parsed.pilot },
    calc: { ...defaultState.calc, ...parsed.calc },
    regions:
      parsed.regions && parsed.regions.length > 0
        ? parsed.regions
        : defaultState.regions,
    activeRegionIds:
      parsed.activeRegionIds && parsed.activeRegionIds.length > 0
        ? parsed.activeRegionIds
        : defaultState.activeRegionIds,
  };
  // Older saves had no flag — treat progressed packs as Purpose already done.
  if (typeof parsed.briefingComplete !== "boolean") {
    merged.briefingComplete = Boolean(
      (parsed.projectName ?? "").trim() ||
        (parsed.authorFullName ?? "").trim() ||
        Object.values(parsed.diagnostics ?? {}).some(Boolean),
    );
  }
  merged.companyName = isNamedCompany(merged.companyName)
    ? merged.companyName.trim()
    : "";
  return merged;
}

export function loadState(): WorkbookState | null {
  try {
    const primary = localStorage.getItem(STORAGE_KEY);
    if (primary) {
      return mergeState(JSON.parse(primary) as Partial<WorkbookState>);
    }
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith(`${STORAGE_KEY}:`)) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      localStorage.setItem(STORAGE_KEY, raw);
      return mergeState(JSON.parse(raw) as Partial<WorkbookState>);
    }
    return null;
  } catch {
    return null;
  }
}

export function saveState(state: WorkbookState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode / quota — ignore.
  }
}

export function fileSlug(projectName: string): string {
  const slug = projectName.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
  return slug || "workbook";
}
