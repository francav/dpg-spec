// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Victor França
import Ajv2020, { type ValidateFunction } from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";
import { l1Schemas } from "@dpg/spec";
import { CONFORMANCE_CASES, getConformanceFixtures, loadConformanceVector } from "./index.js";

// WU-1.4 done-criterion: every captured conformance vector is valid real compiler I/O per the L1
// schemas. The compiler-result schema validates at its root. ajv is dev-only.
const RESULT_ID = "https://spec.dpg.dev/l1/v1/compiler-result.schema.json";

function buildValidator(id: string): ValidateFunction {
  const ajv = new Ajv2020({ strict: true, allErrors: true });
  for (const schema of Object.values(l1Schemas)) {
    ajv.addSchema(schema);
  }
  const validate = ajv.getSchema(id);
  if (!validate) throw new Error(`schema not found: ${id}`);
  return validate;
}

describe("golden conformance vectors validate against compiler-result.schema.json", () => {
  const validate = buildValidator(RESULT_ID);

  for (const c of CONFORMANCE_CASES) {
    it(`${c.id} is a valid CompilerResult`, () => {
      const ok = validate(loadConformanceVector(c.id));
      expect(validate.errors ?? []).toEqual([]);
      expect(ok).toBe(true);
    });
  }
});

describe("conformance fixtures are loadable", () => {
  it("exposes every case with non-empty BPMN XML", () => {
    const fixtures = getConformanceFixtures();
    expect(fixtures).toHaveLength(CONFORMANCE_CASES.length);
    for (const f of fixtures) {
      expect(f.bpmnXml).toContain("<");
      if (f.dmn) expect(f.dmnXml).toContain("<");
    }
  });
});

describe("contract-bearing model exercises ContractCoverageEntry", () => {
  // Closes the WU-1.3 open item: loan-preapproval (captured under the camunda-7 profile) surfaces
  // its two external service tasks as missing-contract integration boundaries.
  it("loan-preapproval reports both external tasks as missing contracts", () => {
    const result = loadConformanceVector("loan-preapproval");
    expect(result.contractCoverage.length).toBeGreaterThan(0);
    const boundaryIds = result.contractCoverage.map((e) => e.boundaryId).sort();
    expect(boundaryIds).toEqual(["ServiceTask_CreditCheck", "ServiceTask_ManualReview"]);
    for (const entry of result.contractCoverage) {
      expect(entry.missingContract).toBe(true);
      expect(entry.implementationType).toBe("externalTask");
    }
  });
});
