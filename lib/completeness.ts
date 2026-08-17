import type { TabId, WorkbookState } from "./types";
import { isNamedCompany } from "./workbook-state";

export type StepStatus = "done" | "todo" | "blocked";

export function filled(value: string | number | undefined): boolean {
  if (typeof value === "number") return Number.isFinite(value) && value > 0;
  return Boolean(value && value.trim());
}

export function scopeComplete(state: WorkbookState): boolean {
  const initiativeOk =
    state.initiativeId !== "other" || filled(state.customInitiative);
  return (
    filled(state.projectName) &&
    initiativeOk &&
    state.activeRegionIds.length >= 1
  );
}

export function governanceComplete(state: WorkbookState): boolean {
  return (
    filled(state.sla.p1Channel) &&
    filled(state.sla.p1Hours) &&
    filled(state.sla.p2Channel) &&
    filled(state.sla.p2Days) &&
    filled(state.sla.p3Channel) &&
    filled(state.dri.task) &&
    filled(state.dri.owner)
  );
}

export function diagnosticStarted(state: WorkbookState): boolean {
  return (
    Object.values(state.diagnostics).some(Boolean) ||
    Object.values(state.examples).some((example) => filled(example))
  );
}

export function playbookComplete(state: WorkbookState): boolean {
  const active = state.regions.filter((region) =>
    state.activeRegionIds.includes(region.id),
  );
  if (active.length === 0) return false;
  return active.every(
    (region) =>
      filled(region.name) &&
      filled(region.communication) &&
      filled(region.meetingNorms),
  );
}

export function pilotComplete(state: WorkbookState): boolean {
  return (
    filled(state.pilot.change1) &&
    filled(state.pilot.kpiBase1) &&
    filled(state.pilot.kpiTarg1)
  );
}

export function identityComplete(state: WorkbookState): boolean {
  return (
    filled(state.authorFullName) &&
    isEmail(state.authorEmail) &&
    isNamedCompany(state.companyName) &&
    filled(state.authorPosition)
  );
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function pdfExportReady(state: WorkbookState): boolean {
  return identityComplete(state);
}

export function auditReady(state: WorkbookState): boolean {
  return scopeComplete(state) && governanceComplete(state);
}

export type PackStatusKey = "needIdentity" | "incomplete" | "ready";

export function packStatusKey(state: WorkbookState): PackStatusKey {
  if (!identityComplete(state)) return "needIdentity";
  if (!auditReady(state)) return "incomplete";
  return "ready";
}

export function packStatusLabel(state: WorkbookState): string {
  switch (packStatusKey(state)) {
    case "needIdentity":
      return "Add author details to submit";
    case "incomplete":
      return "Incomplete draft";
    case "ready":
      return "Ready for live audit";
  }
}

export type MissingItemId =
  | "projectName"
  | "customInitiative"
  | "region"
  | "p1"
  | "p2"
  | "p3"
  | "dri"
  | "fullName"
  | "email"
  | "company"
  | "position";

export function missingAuditItems(state: WorkbookState): {
  tab: TabId;
  id: MissingItemId;
  label: string;
}[] {
  const items: { tab: TabId; id: MissingItemId; label: string }[] = [];
  if (!filled(state.projectName)) {
    items.push({ tab: "scope", id: "projectName", label: "Project name" });
  }
  if (state.initiativeId === "other" && !filled(state.customInitiative)) {
    items.push({
      tab: "scope",
      id: "customInitiative",
      label: "Initiative description",
    });
  }
  if (state.activeRegionIds.length < 1) {
    items.push({ tab: "scope", id: "region", label: "At least one region" });
  }
  if (!filled(state.sla.p1Channel) || !filled(state.sla.p1Hours)) {
    items.push({ tab: "governance", id: "p1", label: "P1 SLA" });
  }
  if (!filled(state.sla.p2Channel) || !filled(state.sla.p2Days)) {
    items.push({ tab: "governance", id: "p2", label: "P2 SLA" });
  }
  if (!filled(state.sla.p3Channel)) {
    items.push({ tab: "governance", id: "p3", label: "P3 channel" });
  }
  if (!filled(state.dri.task) || !filled(state.dri.owner)) {
    items.push({ tab: "governance", id: "dri", label: "Named DRI" });
  }
  if (!filled(state.authorFullName)) {
    items.push({ tab: "scope", id: "fullName", label: "Full name" });
  }
  if (!isEmail(state.authorEmail)) {
    items.push({ tab: "scope", id: "email", label: "Email" });
  }
  if (!isNamedCompany(state.companyName)) {
    items.push({ tab: "scope", id: "company", label: "Company" });
  }
  if (!filled(state.authorPosition)) {
    items.push({ tab: "scope", id: "position", label: "Position" });
  }
  return items;
}

export function stepStatus(tab: TabId, state: WorkbookState): StepStatus {
  switch (tab) {
    case "briefing":
      return "done";
    case "scope":
      return scopeComplete(state) ? "done" : "blocked";
    case "diagnostic":
      return diagnosticStarted(state) ? "done" : "todo";
    case "governance":
      return governanceComplete(state) ? "done" : "blocked";
    case "playbook":
      return playbookComplete(state) ? "done" : "todo";
    case "pilot":
      return pilotComplete(state) ? "done" : "todo";
    case "compiled":
      return auditReady(state) && identityComplete(state) ? "done" : "blocked";
  }
}
