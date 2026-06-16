// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Victor França
import { readFileSync } from "node:fs";
import type { RuntimeProfileSnapshot } from "@francav/spec";

/**
 * Reference runtime-profile packs shipped by @francav/profiles. Each pack is a
 * {@link RuntimeProfileSnapshot} that validates against the L1 runtime-profile schema and models
 * the capabilities a DPG-conformant engine exposes. `camunda-7`, `cib-seven`, and `operaton`
 * share the Camunda-7 lineage; `camunda-8` is the Zeebe-based successor.
 */
export const PROFILE_PACK_IDS = ["camunda-7", "camunda-8", "cib-seven", "operaton"] as const;

export type ProfilePackId = (typeof PROFILE_PACK_IDS)[number];

/** Load a single reference profile pack by id. */
export function loadProfilePack(id: ProfilePackId): RuntimeProfileSnapshot {
  const url = new URL(`../packs/${id}.json`, import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as RuntimeProfileSnapshot;
}

/** Load every reference profile pack, in {@link PROFILE_PACK_IDS} order. */
export function loadAllProfilePacks(): RuntimeProfileSnapshot[] {
  return PROFILE_PACK_IDS.map(loadProfilePack);
}
