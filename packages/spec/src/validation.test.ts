// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Victor França
import { readFileSync } from "node:fs";
import Ajv2020, { type ValidateFunction } from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";
import { l1Schemas } from "./generated/schemas.js";

// WU-1.3 done-criterion: real compiler I/O validates against the L1 schemas.
// Fixtures are captured output of compileModel() over the CC0 loan-preapproval BPMN + loan-decision
// DMN (see STATE.md). ajv is a dev-only dependency — @dpg/spec ships no validator of its own.

const RESULT_ID = "https://spec.dpg.dev/l1/v1/compiler-result.schema.json";
const OPTIONS_ID = "https://spec.dpg.dev/l1/v1/compile-options.schema.json";

function loadFixture(name: string): unknown {
  return JSON.parse(readFileSync(new URL(`../test/fixtures/${name}`, import.meta.url), "utf8"));
}

function buildValidator(id: string): ValidateFunction {
  const ajv = new Ajv2020({ strict: true, allErrors: true });
  for (const schema of Object.values(l1Schemas)) {
    ajv.addSchema(schema);
  }
  const validate = ajv.getSchema(id);
  if (!validate) throw new Error(`schema not found: ${id}`);
  return validate;
}

describe("L1 schemas accept real compiler I/O", () => {
  it("a captured CompilerResult validates against compiler-result.schema.json", () => {
    const validate = buildValidator(RESULT_ID);
    const ok = validate(loadFixture("compiler-result.sample.json"));
    expect(validate.errors ?? []).toEqual([]);
    expect(ok).toBe(true);
  });

  it("a captured CompileOptions validates against compile-options.schema.json", () => {
    const validate = buildValidator(OPTIONS_ID);
    const ok = validate(loadFixture("compile-options.sample.json"));
    expect(validate.errors ?? []).toEqual([]);
    expect(ok).toBe(true);
  });
});

describe("L1 schemas reject malformed input", () => {
  it("rejects a CompilerResult with a wrong-typed summary field", () => {
    const validate = buildValidator(RESULT_ID);
    const result = loadFixture("compiler-result.sample.json") as {
      summary: { structuralErrors: unknown };
    };
    result.summary.structuralErrors = "not-a-number";
    expect(validate(result)).toBe(false);
  });

  it("rejects a CompilerResult missing a required top-level field", () => {
    const validate = buildValidator(RESULT_ID);
    const result = loadFixture("compiler-result.sample.json") as Record<string, unknown>;
    delete result.summary;
    expect(validate(result)).toBe(false);
  });

  it("rejects an unknown determinism axis value", () => {
    const validate = buildValidator(RESULT_ID);
    const result = loadFixture("compiler-result.sample.json") as {
      determinismMap: { axisY: unknown }[];
    };
    if (result.determinismMap.length > 0) {
      result.determinismMap[0]!.axisY = "totallyDeterministic";
      expect(validate(result)).toBe(false);
    }
  });
});
