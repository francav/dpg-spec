// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Victor França

/**
 * DPG L1 spec: the normative JSON Schemas (draft 2020-12) for the compiler's public I/O contract,
 * plus the TypeScript types derived from them.
 *
 * - Types (`Finding`, `CompilerResult`, `CompileOptions`, the Axis X/Y classifications, …) are
 *   generated from `schemas/*.json` and re-exported here.
 * - The schema objects are re-exported as `l1Schemas` (keyed by canonical `$id`) and individually.
 *   The raw `.json` files are also published under the `@dpg/spec/schemas/*` subpath.
 *
 * `@dpg/spec` ships no runtime dependencies and no validator; bring your own JSON Schema validator.
 */
export * from "./generated/types.js";
export * from "./generated/schemas.js";
