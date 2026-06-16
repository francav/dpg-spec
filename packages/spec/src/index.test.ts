// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Victor França
import { describe, expect, it } from "vitest";
import { l1Schemas, type CompilerResult, type CompileOptions } from "./index.js";

describe("@francav/spec public surface", () => {
  it("exposes all six L1 schemas keyed by canonical $id", () => {
    const ids = Object.keys(l1Schemas);
    expect(ids).toHaveLength(6);
    for (const id of ids) {
      expect(id).toMatch(/^https:\/\/spec\.dpg\.dev\/l1\/v1\//);
    }
  });

  it("re-exports the generated types for downstream use", () => {
    // Type-only smoke check: these annotations fail to compile if the exports are missing.
    const options: CompileOptions = { modelId: "smoke" };
    const result: Pick<CompilerResult, "summary"> | null = null;
    expect(options.modelId).toBe("smoke");
    expect(result).toBeNull();
  });
});
