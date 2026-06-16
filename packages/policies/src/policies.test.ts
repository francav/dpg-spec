// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Victor França
import Ajv2020, { type ValidateFunction } from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";
import { l1Schemas } from "@francav/spec";
import { POLICY_PACK_IDS, loadPolicyPack } from "./index.js";

// WU-1.4 done-criterion: every reference policy pack validates against the L1 schemas.
// The policy schema has no root $ref, so validate against the named $def. ajv is dev-only.
const POLICY_DEF = "https://spec.dpg.dev/l1/v1/policy.schema.json#/$defs/PolicySnapshot";

function buildValidator(ref: string): ValidateFunction {
  const ajv = new Ajv2020({ strict: true, allErrors: true });
  for (const schema of Object.values(l1Schemas)) {
    ajv.addSchema(schema);
  }
  const validate = ajv.getSchema(ref);
  if (!validate) throw new Error(`schema not found: ${ref}`);
  return validate;
}

describe("reference policy packs validate against policy.schema.json", () => {
  const validate = buildValidator(POLICY_DEF);

  for (const id of POLICY_PACK_IDS) {
    it(`${id} is a valid PolicySnapshot`, () => {
      const ok = validate(loadPolicyPack(id));
      expect(validate.errors ?? []).toEqual([]);
      expect(ok).toBe(true);
    });
  }
});

describe("policy schema rejects malformed packs", () => {
  const validate = buildValidator(POLICY_DEF);

  it("rejects a pack missing the required ruleToggles field", () => {
    expect(validate({ id: "x", version: "1", governanceTier: "tier-1" })).toBe(false);
  });

  it("rejects a pack whose ruleToggles hold a non-boolean value", () => {
    expect(
      validate({
        id: "x",
        version: "1",
        governanceTier: "tier-1",
        ruleToggles: { SOME_RULE: "yes" },
      }),
    ).toBe(false);
  });
});
