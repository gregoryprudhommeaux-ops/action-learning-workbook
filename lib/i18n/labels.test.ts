import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_REGIONS } from "./defaults";
import { tRegionField } from "./i18n/labels";

describe("tRegionField", () => {
  it("translates catalog defaults when the stored value is untouched", () => {
    const us = DEFAULT_REGIONS.find((region) => region.id === "us")!;
    assert.equal(tRegionField("zh", us, "name"), "美国");
    assert.match(tRegionField("zh", us, "communication"), /低语境/);
    assert.equal(tRegionField("en", us, "name"), "United States");
  });

  it("keeps custom edits as written", () => {
    const custom = {
      ...DEFAULT_REGIONS[0],
      tip: "My custom tip",
    };
    assert.equal(tRegionField("zh", custom, "tip"), "My custom tip");
  });
});
