# @francav/policies

Reference governance-policy packs for DPG. Each pack is a resolved
`PolicySnapshot` (one governance tier of the baseline policy) that validates
against the L1 policy schema. `baseline-tier-1` requires a runtime profile and
demands deterministic Axis-Y; `baseline-tier-2` relaxes both for
engine-agnostic, policy-dependent work. The raw JSON is published under the
`@francav/policies/packs/*` subpath.

## Install

```sh
npm install @francav/policies
```

## Usage

```ts
import { loadPolicyPack, loadAllPolicyPacks, POLICY_PACK_IDS } from "@francav/policies";

const tier1 = loadPolicyPack("baseline-tier-1");
const all = loadAllPolicyPacks();
```

## License

Apache-2.0
