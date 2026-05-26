<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# Mosvera Aesthetic Pack Gallery

This directory is the canonical source for the public Mosvera pack gallery.
Each `.mosvera.json` file contains portable registry documents for one named
aesthetic. The WebP thumbnails are gallery previews only; v1 packs do not
embed assets, credentials, provider manifests, remote URLs, or zip contents.

## Packs

- [Quiet Editorial](./quiet-editorial.mosvera.json) - A calm public-standard home: readable, measured, and institutional without feeling sterile.
- [Technical Manual](./technical-manual.mosvera.json) - Dense, precise, and engineered for scanning: a spec bench rather than a campaign page.
- [Cinematic Lab](./cinematic-lab.mosvera.json) - High-contrast, image-forward, and expressive while keeping the schema surface legible.
- [Claymation Playful Builder](./claymation-playful-builder.mosvera.json) - Tactile, warm, handmade, and constructive: proof that Mosvera can carry real personality.
- [Neon Noir Console](./neon-noir-console.mosvera.json) - A rain-slick command surface with magenta voltage, cyan glass, and deep cinematic shadow.
- [Botanical Glasshouse](./botanical-glasshouse.mosvera.json) - Layered green glass, humid highlights, and living-organic structure for softer technical systems.
- [Lunar Industrial](./lunar-industrial.mosvera.json) - Powder-gray moon dust, hazard amber, and machined surfaces for heavy engineering stories.
- [Ukiyo-e Interface](./ukiyo-e-interface.mosvera.json) - Flat ink fields, wave rhythm, and vermilion accents translated into a crisp digital surface.
- [Bauhaus Signal](./bauhaus-signal.mosvera.json) - Primary geometry, strong rhythm, and poster-like hierarchy for bold civic/product communication.
- [Desert Modernist](./desert-modernist.mosvera.json) - Sun-washed plaster, adobe shadow, cactus green, and restrained resort-modern geometry.
- [Alpine Research](./alpine-research.mosvera.json) - Glacial whites, topographic lines, cold blue accents, and field-station precision.
- [Maximalist Zine](./maximalist-zine.mosvera.json) - Cut-paper energy, loud contrast, and photocopy texture for expressive community surfaces.
- [Luxury Atelier](./luxury-atelier.mosvera.json) - Deep ink, champagne metal, quiet shadows, and editorial restraint for premium product surfaces.
- [Retro Future Terminal](./retro-future-terminal.mosvera.json) - Amber phosphor, mint glow, and chunky terminal optimism from an imagined 1983 future.
- [Oceanic Biolume](./oceanic-biolume.mosvera.json) - Deep water gradients, luminous cyan organisms, and soft pressure for immersive knowledge spaces.
- [Brutalist Civic](./brutalist-civic.mosvera.json) - Concrete gray, safety red, large blocks, and public-infrastructure seriousness.
- [Soft Focus Wellness](./soft-focus-wellness.mosvera.json) - Diffuse blush, moss, and linen tones for calmer human-care and coaching surfaces.
- [Spacecraft Telemetry](./spacecraft-telemetry.mosvera.json) - Black-panel instrumentation, orbital blue, and high-density readouts for mission-control systems.
- [Museum Archive](./museum-archive.mosvera.json) - Catalog paper, archival labels, burgundy marks, and careful hierarchy for collections and records.
- [Arcade Pop](./arcade-pop.mosvera.json) - Candy color, black outlines, chunky rhythm, and playful confidence for interactive experiences.
- [Graphite Studio](./graphite-studio.mosvera.json) - Charcoal paper, pencil marks, and precise monochrome composition for serious creative tools.
- [Stained Glass Fable](./stained-glass-fable.mosvera.json) - Jewel panels, dark leading, and luminous storybook contrast for narrative product surfaces.
- [Kinetic Sports Broadcast](./kinetic-sports-broadcast.mosvera.json) - Scoreboard contrast, motion graphics, electric green, and fast editorial pacing.
- [Cybernetic Garden](./cybernetic-garden.mosvera.json) - Synthetic foliage, circuit traces, lime bloom, and black soil for hybrid nature-machine systems.
- [Porcelain Minimal](./porcelain-minimal.mosvera.json) - Cool porcelain whites, cobalt hairlines, and restrained detail for premium quiet surfaces.

## Use With Claude Desktop

```text
Use Mosvera to preview importing this aesthetic pack:
/path/to/claymation-playful-builder.mosvera.json

Use Mosvera to import this aesthetic pack into my local registry.

Use Mosvera to resolve claymation-playful-builder and compile it into CSS variables.
```

## Maintenance

Pack JSON and gallery metadata are generated from
[`scripts/generate-pack-gallery.mjs`](../scripts/generate-pack-gallery.mjs).
Thumbnail assets are generated separately through Forge and committed as
optimized WebP files. The generator has a `--placeholder-assets` fallback for
local visual scaffolding, but do not use that flag for the public gallery.

```sh
node scripts/generate-pack-gallery.mjs
node scripts/validate-gallery.mjs
```
