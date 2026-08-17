import type { WorkbookState } from "@/lib/types";
import {
  auditReady,
  identityComplete,
  packStatusLabel,
} from "@/lib/completeness";
import {
  activeRegionsLabel,
  frictionBadge,
  frictionPercent,
  initiativeLabel,
} from "@/lib/workbook-state";

export type SubmissionRecord = {
  id: string;
  createdAt: string;
  authorFullName: string;
  authorEmail: string;
  authorPosition: string;
  companyName: string;
  projectName: string;
  initiativeId: string;
  initiativeLabel: string;
  regionsLabel: string;
  frictionPercent: number;
  frictionText: string;
  packStatus: string;
  auditReady: boolean;
  identityComplete: boolean;
  payload: WorkbookState;
};

export function snapshotFromState(state: WorkbookState) {
  const percent = frictionPercent(state.diagnostics);
  return {
    authorFullName: state.authorFullName.trim(),
    authorEmail: state.authorEmail.trim().toLowerCase(),
    authorPosition: state.authorPosition.trim(),
    companyName: state.companyName.trim(),
    projectName: state.projectName.trim(),
    initiativeId: state.initiativeId,
    initiativeLabel: initiativeLabel(state),
    regionsLabel: activeRegionsLabel(state),
    frictionPercent: percent,
    frictionText: frictionBadge(percent).text,
    packStatus: packStatusLabel(state),
    auditReady: auditReady(state),
    identityComplete: identityComplete(state),
    payload: state,
  };
}

export function frictionBand(percent: number): "low" | "moderate" | "high" {
  if (percent > 65) return "high";
  if (percent > 30) return "moderate";
  return "low";
}
