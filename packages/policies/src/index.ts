// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Victor França
import { readFileSync } from "node:fs";
import type { PolicySnapshot } from "@francav/spec";

/**
 * Reference governance-policy packs shipped by @francav/policies. Each pack is a resolved
 * {@link PolicySnapshot} (one governance tier of the baseline `standard-governance-policy`) that
 * validates against the L1 policy schema. `baseline-tier-1` requires a runtime profile and demands
 * deterministic Axis-Y; `baseline-tier-2` relaxes both for engine-agnostic, policy-dependent work.
 */
export const POLICY_PACK_IDS = ["baseline-tier-1", "baseline-tier-2"] as const;

export type PolicyPackId = (typeof POLICY_PACK_IDS)[number];

/** Load a single reference policy pack by id. */
export function loadPolicyPack(id: PolicyPackId): PolicySnapshot {
  const url = new URL(`../packs/${id}.json`, import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as PolicySnapshot;
}

/** Load every reference policy pack, in {@link POLICY_PACK_IDS} order. */
export function loadAllPolicyPacks(): PolicySnapshot[] {
  return POLICY_PACK_IDS.map(loadPolicyPack);
}
