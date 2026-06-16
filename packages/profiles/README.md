# @francav/profiles

Reference runtime-profile packs for DPG. Each pack is a `RuntimeProfileSnapshot`
that validates against the L1 runtime-profile schema and models the capabilities
a target engine exposes. The bundled packs are `camunda-7`, `camunda-8`,
`cib-seven`, and `operaton`; the raw JSON is published under the
`@francav/profiles/packs/*` subpath.

## Install

```sh
npm install @francav/profiles
```

## Usage

```ts
import { loadProfilePack, loadAllProfilePacks, PROFILE_PACK_IDS } from "@francav/profiles";

const camunda7 = loadProfilePack("camunda-7");
const all = loadAllProfilePacks();
```

## License

Apache-2.0
