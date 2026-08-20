import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultState, exampleState } from "./defaults";
import {
  auditReady,
  identityComplete,
  missingAuditItems,
  packStatusLabel,
  pdfExportReady,
  scopeComplete,
  stepStatus,
} from "./completeness";
import type { WorkbookState } from "./types";

function withPatch(patch: Partial<WorkbookState>): WorkbookState {
  return {
    ...exampleState,
    ...patch,
    sla: { ...exampleState.sla, ...patch.sla },
    dri: { ...exampleState.dri, ...patch.dri },
  };
}

describe("completeness", () => {
  it("starts empty so a new participant is not audit-ready", () => {
    assert.equal(auditReady(defaultState), false);
    assert.equal(scopeComplete(defaultState), false);
    assert.equal(identityComplete(defaultState), false);
    assert.equal(packStatusLabel(defaultState), "Add author details to submit");
    assert.equal(stepStatus("briefing", defaultState), "todo");
    assert.equal(stepStatus("scope", defaultState), "blocked");
  });

  it("marks Purpose done after Continue to Scope", () => {
    assert.equal(
      stepStatus("briefing", { ...defaultState, briefingComplete: true }),
      "done",
    );
  });

  it("treats the example pack as ready for audit but not for PDF until author details exist", () => {
    assert.equal(auditReady(exampleState), true);
    assert.equal(packStatusLabel(exampleState), "Add author details to submit");
    assert.equal(stepStatus("briefing", exampleState), "done");
    assert.equal(stepStatus("compiled", exampleState), "blocked");
    const labels = missingAuditItems(exampleState).map((item) => item.label);
    assert.ok(labels.includes("Company"));
    assert.ok(labels.includes("Full name"));
    assert.ok(labels.includes("Email"));
    assert.ok(labels.includes("Position"));
  });

  it("allows PDF export once name, email, company, and position are set", () => {
    const state = withPatch({
      authorFullName: "Alex Chen",
      authorEmail: "alex.chen@acme.com",
      authorPosition: "HQ QA Lead",
      companyName: "Northwind",
    });
    assert.equal(identityComplete(state), true);
    assert.equal(pdfExportReady(state), true);
    assert.equal(packStatusLabel(state), "Ready for live audit");
    assert.equal(stepStatus("compiled", state), "done");
  });

  it("rejects Acme Global as a real company name", () => {
    const state = withPatch({
      authorFullName: "Alex Chen",
      authorEmail: "alex.chen@acme.com",
      authorPosition: "HQ QA Lead",
      companyName: "Acme Global",
    });
    assert.equal(identityComplete(state), false);
    assert.ok(
      missingAuditItems(state)
        .map((item) => item.label)
        .includes("Company"),
    );
  });

  it("blocks audit readiness without a project name or region", () => {
    const state = withPatch({
      projectName: "  ",
      activeRegionIds: [],
      authorFullName: "Alex Chen",
      authorEmail: "alex.chen@acme.com",
      authorPosition: "HQ QA Lead",
      companyName: "Northwind",
    });
    assert.equal(scopeComplete(state), false);
    assert.equal(auditReady(state), false);
    assert.equal(packStatusLabel(state), "Incomplete draft");
    assert.equal(stepStatus("scope", state), "blocked");
    assert.equal(stepStatus("compiled", state), "blocked");
    const labels = missingAuditItems(state).map((item) => item.label);
    assert.ok(labels.includes("Project name"));
    assert.ok(labels.includes("At least one region"));
  });

  it("requires a custom initiative label when type is other", () => {
    const state = withPatch({
      initiativeId: "other",
      customInitiative: "",
    });
    assert.equal(auditReady(state), false);
    const labels = missingAuditItems(state).map((item) => item.label);
    assert.ok(labels.includes("Initiative description"));
  });

  it("blocks readiness when DRI or SLA is empty", () => {
    const state = withPatch({
      sla: { ...exampleState.sla, p1Channel: "", p1Hours: 0 },
      dri: { task: "", owner: "" },
    });
    assert.equal(auditReady(state), false);
    assert.equal(stepStatus("governance", state), "blocked");
    const labels = missingAuditItems(state).map((item) => item.label);
    assert.ok(labels.includes("P1 SLA"));
    assert.ok(labels.includes("Named DRI"));
  });
});
