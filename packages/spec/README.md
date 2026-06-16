# @francav/spec

The DPG L1 spec: the normative JSON Schemas (draft 2020-12) that define the
compiler's public input/output contract, together with the TypeScript types
generated from them. The raw schema files are published under the
`@francav/spec/schemas/*` subpath. This package ships no runtime dependencies
and no validator; bring your own JSON Schema validator.

## Install

```sh
npm install @francav/spec
```

## Usage

```ts
import { l1Schemas } from "@francav/spec";
import type { CompilerResult, Finding } from "@francav/spec";

// All schema objects, keyed by their canonical $id:
const schemaIds = Object.keys(l1Schemas);

// The raw .json files are also importable directly:
// import classification from "@francav/spec/schemas/classification.schema.json";
```

## License

Apache-2.0
