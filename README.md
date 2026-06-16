# dpg-spec

Machine-readable specifications for **Deterministic Process Governance (DPG)** — schemas, profiles,
policies, and conformance fixtures for governing the behavioral predictability of automated BPM
processes.

## Status

Early development (0.1.0). Schemas and APIs are unstable and subject to change.

## Packages

- `@francav/spec` — core schemas
- `@francav/profiles` — conformance profiles
- `@francav/policies` — policy definitions
- `@francav/conformance` — conformance fixtures and test vectors

## Develop

Requires Node.js >= 18 and npm. This is an npm workspaces monorepo.

```sh
npm install
npm run build
npm test
```

## License

Schemas and code are licensed under [Apache-2.0](./LICENSE); normative prose under
[CC-BY-4.0](./LICENSE-DOCS); conformance fixtures under CC0-1.0. See [LICENSING.md](./LICENSING.md).

Copyright 2026 Victor França.

## Contributing

A contribution guide will follow.
