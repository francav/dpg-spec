# DPG Conformance Fixtures

Minimal BPMN/DMN models that any DPG-conformant compiler should process identically. These inputs
are **CC0-1.0** (public domain — see the package `LICENSE`) so downstream test suites can embed them
freely. Each `<?xml?>` declaration is followed by an `SPDX-License-Identifier: CC0-1.0` marker.

## Layout

- `bpmn/` — BPMN process models.
- `dmn/` — DMN decision tables paired with the BPMN flows.

## Catalog

| Case               | Inputs                                                     | Exercises                                                                                                                                                                                                     |
| ------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `simple-process`   | `bpmn/simple-process.bpmn`                                 | Linear happy path; stays policy-dependent on both axes.                                                                                                                                                       |
| `runtime-bound`    | `bpmn/runtime-bound.bpmn` + `dmn/runtime-bound.dmn`        | FEEL `now()` forces a runtime-bound Axis-Y downgrade.                                                                                                                                                         |
| `loan-preapproval` | `bpmn/loan-preapproval.bpmn` + `dmn/eligibility-score.dmn` | Contract-bearing model: two external service tasks (missing contracts), a `decisionRef` to a UNIQUE-hit-policy DMN with coverage gaps, a non-deterministic Groovy script, and FEEL + JUEL gateway conditions. |

`dmn/loan-decision.dmn` (two chained FIRST-hit-policy decisions) is also bundled as a standalone
decision-only fixture.

## Golden vectors

Each case has a captured `CompilerResult` in `../vectors/<case>.json`, produced by running the
reference compiler (`@dpg/compiler-core`) over these exact inputs. `loan-preapproval` is captured
under the `camunda-7` reference profile (`@dpg/profiles`) at governance tier-2, which is what makes
its external service tasks resolve as missing-contract integration boundaries.

## Usage

The package exposes the inputs and the golden vectors programmatically:

```js
import { getConformanceFixtures, getConformanceVectors } from "@dpg/conformance";

for (const fixture of getConformanceFixtures()) {
  // feed fixture.bpmnXml / fixture.dmnXml into your compiler, then diff against the golden vector
}
```

To eyeball the captured summaries and the Axis-Y distribution per case:

```bash
npm run fixtures --workspace @dpg/conformance
```
