# @francav/conformance

The DPG conformance suite: CC0-licensed BPMN/DMN input fixtures paired with the
golden `CompilerResult` vectors captured for them. A DPG-conformant compiler runs
the fixtures under the documented configuration and compares its output to the
matching vector. Fixtures are published under `@francav/conformance/fixtures/*`
and vectors under `@francav/conformance/vectors/*`.

## Install

```sh
npm install @francav/conformance
```

## Usage

```ts
import {
  CONFORMANCE_CASES,
  getConformanceFixtures,
  getConformanceVectors,
  loadConformanceVector,
} from "@francav/conformance";

for (const fixture of getConformanceFixtures()) {
  // feed fixture.bpmnXml / fixture.dmnXml to your compiler, then compare
  // its CompilerResult against loadConformanceVector(fixture.id)
}
```

## License

CC0-1.0
