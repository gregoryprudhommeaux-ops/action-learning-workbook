import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canReadPacks,
  isSuperAdmin,
  parseSuperAdminEmails,
  resolveAdminRole,
} from "./admin-auth";

describe("parseSuperAdminEmails", () => {
  it("splits, trims, lowercases, and drops empties", () => {
    assert.deepEqual(
      parseSuperAdminEmails("  Ada@Example.com , bob@test.com,,  "),
      ["ada@example.com", "bob@test.com"],
    );
  });

  it("returns empty when unset", () => {
    assert.deepEqual(parseSuperAdminEmails(undefined), []);
    assert.deepEqual(parseSuperAdminEmails("  "), []);
  });
});

describe("isSuperAdmin", () => {
  it("matches case-insensitively against the env list", () => {
    assert.equal(
      isSuperAdmin("Ada@Example.com", "ada@example.com, other@x.com"),
      true,
    );
    assert.equal(isSuperAdmin("nobody@x.com", "ada@example.com"), false);
  });

  it("is false when the env list is empty", () => {
    assert.equal(isSuperAdmin("ada@example.com", ""), false);
    assert.equal(isSuperAdmin("ada@example.com", undefined), false);
  });
});

describe("canReadPacks", () => {
  it("allows super admin and approved facilitator only", () => {
    assert.equal(canReadPacks("superAdmin"), true);
    assert.equal(canReadPacks("facilitator"), true);
    assert.equal(canReadPacks("pending"), false);
    assert.equal(canReadPacks("rejected"), false);
  });
});

describe("resolveAdminRole", () => {
  it("prefers super admin over facilitator row", () => {
    assert.equal(
      resolveAdminRole({
        email: "gregory@example.com",
        facilitatorStatus: "pending",
        superAdminEmailsEnv: "gregory@example.com",
      }),
      "superAdmin",
    );
  });

  it("maps facilitator status when not a super admin", () => {
    assert.equal(
      resolveAdminRole({
        email: "f@example.com",
        facilitatorStatus: "approved",
        superAdminEmailsEnv: "gregory@example.com",
      }),
      "facilitator",
    );
    assert.equal(
      resolveAdminRole({
        email: "f@example.com",
        facilitatorStatus: "rejected",
        superAdminEmailsEnv: "gregory@example.com",
      }),
      "rejected",
    );
    assert.equal(
      resolveAdminRole({
        email: "f@example.com",
        facilitatorStatus: null,
        superAdminEmailsEnv: "gregory@example.com",
      }),
      "pending",
    );
  });
});
