import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cohortStats } from "./cohort-stats";
import type { SubmissionRecord } from "./submission-snapshot";
import { defaultState } from "./defaults";

function row(
  patch: Partial<SubmissionRecord> & Pick<SubmissionRecord, "id">,
): SubmissionRecord {
  return {
    createdAt: new Date().toISOString(),
    authorFullName: "Alex Chen",
    authorEmail: "alex@acme.com",
    authorPosition: "QA Lead",
    companyName: "Acme",
    projectName: "Transfer",
    initiativeId: "audit",
    initiativeLabel: "Regulatory / compliance audit",
    regionsLabel: "HQ Headquarters",
    frictionPercent: 40,
    frictionText: "Moderate",
    packStatus: "Ready for live audit",
    auditReady: true,
    identityComplete: true,
    payload: defaultState,
    ...patch,
  };
}

describe("cohortStats", () => {
  it("counts ready vs incomplete and friction bands", () => {
    const stats = cohortStats([
      row({ id: "1", frictionPercent: 10, auditReady: true }),
      row({ id: "2", frictionPercent: 80, auditReady: false }),
      row({
        id: "3",
        frictionPercent: 50,
        companyName: "Northwind",
        initiativeLabel: "Cross-site transfer",
      }),
    ]);
    assert.equal(stats.total, 3);
    assert.equal(stats.ready, 2);
    assert.equal(stats.incomplete, 1);
    assert.equal(stats.bands.low, 1);
    assert.equal(stats.bands.high, 1);
    assert.equal(stats.companies, 2);
    assert.equal(stats.initiatives[0]?.count, 2);
  });
});
