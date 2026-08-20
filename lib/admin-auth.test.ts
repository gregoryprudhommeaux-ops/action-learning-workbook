import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canReadPacks,
  isDeveloper,
  parseDeveloperEmails,
  resolveAdminRole,
} from "./admin-auth";

describe("parseDeveloperEmails", () => {
  it("splits, trims, lowercases, and drops empties", () => {
    assert.deepEqual(
      parseDeveloperEmails("  Ada@Example.com , bob@test.com,,  "),
      ["ada@example.com", "bob@test.com"],
    );
  });

  it("returns empty when unset", () => {
    assert.deepEqual(parseDeveloperEmails(undefined), []);
    assert.deepEqual(parseDeveloperEmails("  "), []);
  });
});

describe("isDeveloper", () => {
  it("matches case-insensitively against the env list", () => {
    assert.equal(
      isDeveloper("Ada@Example.com", "ada@example.com, other@x.com"),
      true,
    );
    assert.equal(isDeveloper("nobody@x.com", "ada@example.com"), false);
  });

  it("is false when the env list is empty", () => {
    assert.equal(isDeveloper("ada@example.com", ""), false);
    assert.equal(isDeveloper("ada@example.com", undefined), false);
  });
});

describe("canReadPacks", () => {
  it("allows developer and approved facilitator only", () => {
    assert.equal(canReadPacks("developer"), true);
    assert.equal(canReadPacks("facilitator"), true);
    assert.equal(canReadPacks("pending"), false);
    assert.equal(canReadPacks("rejected"), false);
  });
});

describe("resolveAdminRole", () => {
  it("prefers developer over facilitator row", () => {
    assert.equal(
      resolveAdminRole({
        email: "dev@example.com",
        facilitatorStatus: "pending",
        developerEmailsEnv: "dev@example.com",
      }),
      "developer",
    );
  });

  it("maps facilitator status when not a developer", () => {
    assert.equal(
      resolveAdminRole({
        email: "f@example.com",
        facilitatorStatus: "approved",
        developerEmailsEnv: "dev@example.com",
      }),
      "facilitator",
    );
    assert.equal(
      resolveAdminRole({
        email: "f@example.com",
        facilitatorStatus: "rejected",
        developerEmailsEnv: "dev@example.com",
      }),
      "rejected",
    );
    assert.equal(
      resolveAdminRole({
        email: "f@example.com",
        facilitatorStatus: null,
        developerEmailsEnv: "dev@example.com",
      }),
      "pending",
    );
  });
});
