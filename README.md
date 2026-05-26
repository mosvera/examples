<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# Mosvera Examples

End-to-end Mosvera examples — concrete aesthetic systems expressed
as Mosvera compositions, rendered through multiple provider
adapters to demonstrate that the abstraction holds.

People understand infrastructure through examples. This directory is
where the abstraction becomes legible: schemas + composition + at
least two providers + comparable rendered outputs, all in one place
per example.

## Aesthetic Pack Gallery

[`packs/`](./packs/) is the canonical source for the public `mosvera.io`
pack gallery. It contains 26 portable `.mosvera.json` aesthetic packs,
gallery metadata, and WebP thumbnail previews. The packs carry registry
documents only; thumbnails are gallery assets and are not embedded in the
pack files.

`mosvera-public` is the canonical public-site aesthetic and default gallery
mode. The other packs remain exchange examples that users can preview, import,
resolve, and compile inside their own local registries.

The website mirrors this gallery data into its static deploy bundle so every
pack can be downloaded, previewed, imported into a local registry, and used to
re-theme the live demonstrator.

## Conventions

Each example is a self-contained directory:

```text
examples/<example-name>/
├── README.md                 # Aesthetic intent in prose, what this example demonstrates
├── composition.yaml          # The Mosvera composition document
├── templates/                # Templates this composition references
├── palettes/                 # Palettes this composition references
├── modifiers/                # Modifiers this composition uses
└── outputs/
    ├── openai/               # Rendered outputs via the OpenAI adapter
    └── flux/                 # Rendered outputs via the Flux adapter
```

Each example must compile successfully through **all reference
provider adapters available at the example's release time**. An
example that only compiles to one provider is not a valid Mosvera
example.

## Phase 5 Example Set

The initial example set covers a deliberately diverse range of aesthetic
intent so the spec's coverage is testable:

- [`cinematic-editorial/`](./cinematic-editorial/) — long-form magazine /
  film-still aesthetic with checked-in OpenAI, FLUX, and SDXL images
- [`dashboard-minimalism/`](./dashboard-minimalism/) — clean, information-dense
  UI-adjacent imagery with checked-in OpenAI, FLUX, and SDXL images
- [`documentary-realism/`](./documentary-realism/) — naturalistic,
  observational imagery with checked-in OpenAI, FLUX, and SDXL images

| Construct | Cinematic Editorial | Dashboard Minimalism | Documentary Realism |
|-----------|---------------------|----------------------|---------------------|
| `medium` | `cinematic` | `digital_illustration` | `photographic` |
| `lighting.scheme` | `three_point` | `flat` | `natural` |
| `lighting.mood` | `warm` | `neutral` | `observational` |
| `color_grade` | `very_high` / `desaturated` | `medium` / `muted` | `low` / `natural` |
| `palette.accent` | warm amber `#c8943f` | corporate blue `#8ab4f8` | none |

Additional examples will be welcome from community contributors after Phase 5
ships.

## Status

Phase 5 examples are present with generated image artifacts and deterministic
payload metadata for all three reference image adapters. Phase 6N adds the
large aesthetic gallery consumed by `mosvera.io`; Phase 6S adds the canonical
`mosvera-public` site aesthetic.

## License

Examples are licensed dual: CC-BY-4.0 for the prose, schema files,
and composition documents (documentation per
[ADR-0001](https://github.com/mosvera/spec/blob/main/docs/decisions/0001-license-choice.md)); Apache-2.0
for any runtime / build glue. Rendered output images carry the
license of the provider that produced them (consult each provider's
output license).

## Validation

```sh
node scripts/generate-pack-gallery.mjs
node scripts/validate-gallery.mjs
```
