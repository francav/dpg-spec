// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Victor França
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { l1Schemas } from "./generated/schemas.js";

// Guards that the generated artifacts stay faithful to the normative schemas and cover the full
// in-scope surface of compiler-core/src/types.ts (the source these schemas formalize).

const generatedTypes = readFileSync(new URL("./generated/types.ts", import.meta.url), "utf8");

// Every public I/O type formalized in WU-1.3 (CompilerResult closure + CompileOptions closure +
// classification vocabulary). IR/AST pipeline internals are intentionally out of scope.
const EXPECTED_TYPES = [
  "Severity",
  "AxisYClass",
  "AxisYClassCompat",
  "AxisXClass",
  "ExpressionLanguage",
  "Finding",
  "FindingDraft",
  "PolicySnapshot",
  "RuntimeProfileSnapshot",
  "RunMetadata",
  "CompileOptions",
  "DeterminismEntry",
  "RuntimeDependencyEntry",
  "DecisionAnalysisEntry",
  "ContractCoverageEntry",
  "ContractNode",
  "IntegrationBoundaryNode",
  "BusinessRuleTaskDescriptor",
  "ExpressionDescriptor",
  "GatewayDescriptor",
  "DmnExpressionDescriptor",
  "DmnDecisionDescriptor",
  "MaturitySignal",
  "ResultMetadata",
  "ResultSummary",
  "CompilerResult",
];

const SCHEMA_FILES = [
  ["classification.schema.json", "https://spec.dpg.dev/l1/v1/classification.schema.json"],
  ["policy.schema.json", "https://spec.dpg.dev/l1/v1/policy.schema.json"],
  ["runtime-profile.schema.json", "https://spec.dpg.dev/l1/v1/runtime-profile.schema.json"],
  ["contract.schema.json", "https://spec.dpg.dev/l1/v1/contract.schema.json"],
  ["compile-options.schema.json", "https://spec.dpg.dev/l1/v1/compile-options.schema.json"],
  ["compiler-result.schema.json", "https://spec.dpg.dev/l1/v1/compiler-result.schema.json"],
] as const;

describe("generated types cover the in-scope contract surface", () => {
  it.each(EXPECTED_TYPES)("declares %s", (name) => {
    const re = new RegExp(`^export (interface|type) ${name}\\b`, "m");
    expect(generatedTypes).toMatch(re);
  });

  it("does not leak the internal codegen wrapper", () => {
    expect(generatedTypes).not.toContain("DpgL1Bundle");
  });

  it("uses no `any` (strictness preserved from the source types)", () => {
    expect(generatedTypes).not.toMatch(/:\s*any\b/);
  });
});

describe("inlined schemas are in sync with the published files", () => {
  it.each(SCHEMA_FILES)("%s matches its l1Schemas entry", (file, id) => {
    const onDisk = JSON.parse(readFileSync(new URL(`../schemas/${file}`, import.meta.url), "utf8"));
    const inlined = (l1Schemas as Record<string, unknown>)[id];
    expect(inlined).toBeDefined();
    expect(inlined).toEqual(onDisk);
  });
});
