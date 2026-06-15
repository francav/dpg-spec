// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Victor França
import { readFileSync } from "node:fs";
import type { CompilerResult } from "@dpg/spec";

/**
 * A conformance case: a CC0 BPMN/DMN input pairing plus the compiler configuration used to capture
 * its golden vector. Downstream compilers run the inputs under the same configuration and compare
 * their `CompilerResult` to {@link loadConformanceVector}.
 */
export interface ConformanceCase {
  /** Stable case id; also the basename of the fixture and the golden vector. */
  readonly id: string;
  /** BPMN fixture path, relative to the package `fixtures/` directory. */
  readonly bpmn: string;
  /** Optional DMN fixture path, relative to `fixtures/`. */
  readonly dmn?: string;
  /** Reference profile pack id the vector was captured under (see `@dpg/profiles`). */
  readonly runtimeProfileId?: string;
  /** Governance tier the vector was captured under. */
  readonly governanceTier?: string;
}

/**
 * The conformance catalog. `simple-process` and `runtime-bound` exercise the policy-dependent and
 * runtime-bound determinism baselines on the built-in defaults; `loan-preapproval` is the
 * contract-bearing model, captured under the `camunda-7` profile at tier-2 so its external service
 * tasks surface as missing-contract integration boundaries.
 */
export const CONFORMANCE_CASES: readonly ConformanceCase[] = [
  { id: "simple-process", bpmn: "bpmn/simple-process.bpmn" },
  { id: "runtime-bound", bpmn: "bpmn/runtime-bound.bpmn", dmn: "dmn/runtime-bound.dmn" },
  {
    id: "loan-preapproval",
    bpmn: "bpmn/loan-preapproval.bpmn",
    dmn: "dmn/eligibility-score.dmn",
    runtimeProfileId: "camunda-7",
    governanceTier: "tier-2",
  },
];

/** A conformance case with its CC0 fixture XML loaded and ready to feed a compiler. */
export interface LoadedConformanceFixture extends ConformanceCase {
  readonly bpmnXml: string;
  readonly dmnXml?: string;
}

function readFixture(relativePath: string): string {
  return readFileSync(new URL(`../fixtures/${relativePath}`, import.meta.url), "utf8");
}

/** Read a single CC0 fixture file (e.g. `"bpmn/simple-process.bpmn"`) as a string. */
export function loadFixtureXml(relativePath: string): string {
  return readFixture(relativePath);
}

/** Load every conformance case with its fixture XML inlined, for feeding a downstream compiler. */
export function getConformanceFixtures(): LoadedConformanceFixture[] {
  return CONFORMANCE_CASES.map((c) => ({
    ...c,
    bpmnXml: readFixture(c.bpmn),
    dmnXml: c.dmn ? readFixture(c.dmn) : undefined,
  }));
}

/** Load the golden `CompilerResult` vector captured for a conformance case. */
export function loadConformanceVector(id: string): CompilerResult {
  return JSON.parse(
    readFileSync(new URL(`../vectors/${id}.json`, import.meta.url), "utf8"),
  ) as CompilerResult;
}

/** Load every golden vector, in {@link CONFORMANCE_CASES} order. */
export function getConformanceVectors(): CompilerResult[] {
  return CONFORMANCE_CASES.map((c) => loadConformanceVector(c.id));
}
