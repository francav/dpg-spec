#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Victor França
/* global console, URL */
import { readFile } from "node:fs/promises";

// Dep-free analog of the reuse-mine fixture runner. @dpg/conformance ships in the L2-free dpg-spec
// repo, so instead of invoking the compiler it prints the captured golden vectors: each case's
// summary plus its Axis-Y determinism distribution. Observe the runtime-bound downgrade alongside
// the policy-dependent baseline, and the missing-contract boundaries on loan-preapproval.
const CASES = [
  { id: "simple-process", label: "Baseline (policy-dependent)" },
  { id: "runtime-bound", label: "Runtime-bound expressions" },
  { id: "loan-preapproval", label: "Contract-bearing (camunda-7, tier-2)" },
];

async function loadVector(id) {
  const url = new URL(`../vectors/${id}.json`, import.meta.url);
  return JSON.parse(await readFile(url, "utf8"));
}

for (const { id, label } of CASES) {
  const result = await loadVector(id);
  console.log(`\n=== ${label} (${id}) ===`);
  console.log(JSON.stringify(result.summary, null, 2));
  console.log("Determinism axisY distribution:");
  const distribution = result.determinismMap.reduce((acc, entry) => {
    acc[entry.axisY] = (acc[entry.axisY] ?? 0) + 1;
    return acc;
  }, {});
  for (const [axisY, count] of Object.entries(distribution)) {
    console.log(`- ${axisY}: ${count}`);
  }
  if (result.contractCoverage.length > 0) {
    const missing = result.contractCoverage.filter((e) => e.missingContract).length;
    console.log(`Integration boundaries missing a contract: ${missing}`);
  }
}
