<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# Open Design Integration

This directory contains generated compatibility artifacts for
[Open Design](https://github.com/nexu-io/open-design).

`mosvera-public/` is an Open Design design-system project generated from the
canonical Mosvera light/dark pack pair:

- `packs/mosvera-public.mosvera.json`
- `packs/mosvera-public-dark.mosvera.json`

Regenerate it from the repository root:

```sh
node scripts/export-open-design-system.mjs
```

Verify it has not drifted:

```sh
node scripts/export-open-design-system.mjs --check
```
