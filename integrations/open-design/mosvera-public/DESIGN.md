# Mosvera Public

> Category: Developer Tools
> A warm technical editorial system generated from Mosvera aesthetic packs.

## 1. Visual Theme & Atmosphere

Mosvera Public is a warm technical editorial system for local-first AI tools,
developer documentation, pack galleries, and agent-facing product surfaces. The
system should feel inspectable and practical: paper and ink, schema panes,
tessera-like blocks, restrained rust, and teal technical signal.

The dark mode is not a separate brand. It is the `mosvera-public-dark` Mosvera
pack mapped to Open Design's `[data-theme="dark"]` override pattern. Keep it
warm, low-light, and legible. Do not turn it into neon cyberpunk.

## 2. Color

All values are tokens. Do not invent new hex values.

Light mode from `mosvera-public`:

- **Background:** `#f5efe4` - warm paper canvas.
- **Surface:** `#fffaf2` - cards, panels, and elevated blocks.
- **Surface warm:** `#e7dccb` - secondary wells and soft dividers.
- **Foreground:** `#201a14` - primary text and strong rules.
- **Muted:** `#62584d` - secondary copy and captions.
- **Border:** `#cdbda8` - hairlines and card edges.
- **Accent:** `#bd5838` - primary action, key marks, and one strong moment.
- **Accent 2:** `#2f7f73` - technical signal, success, and secondary emphasis.
- **Code background source value:** `#15110d`; **code ink source value:** `#f7ead9`.

Dark mode from `mosvera-public-dark`:

- **Background:** `#14110e`
- **Surface:** `#201a15`
- **Surface warm:** `#2b241d`
- **Foreground:** `#f6efe3`
- **Muted:** `#c5b8a7`
- **Border:** `#4b3d31`
- **Accent:** `#d66a43`
- **Accent 2:** `#4db3a3`
- **Code background source value:** `#0c0907`; **code ink source value:** `#f9e6c8`.

Use rust for decisive action and teal for technical structure. The page should
never read as a one-hue beige system; rust and teal must both appear in
meaningful but controlled amounts.

## 3. Typography

Use editorial display type with pragmatic product copy. Headings can be large
and confident, but panels, controls, tables, and code/spec surfaces should stay
compact enough to scan.

Font labels for catalog extraction:

Display: "Fraunces", Georgia, serif
Body: "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif
Mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Consolas, monospace

- **Display:** Fraunces, weight 650, no negative letter spacing.
- **Body:** Hanken Grotesk, 400-650, line-height around 1.5.
- **Mono:** IBM Plex Mono for IDs, schema paths, hashes, code, and metadata.
- **Scale:** use 12, 14, 16, 20, 24, 32, 48, and 64px as the working range.

## 4. Spacing

Base spacing is an 8px rhythm with 4px available for tight internal details.
Use generous section spacing and tighter panel internals.

- **Container:** max-width `1180px`.
- **Desktop sections:** around 96px vertical spacing.
- **Tablet sections:** around 64px vertical spacing.
- **Phone sections:** around 40px vertical spacing.
- **Panel padding:** 16-24px depending on density.

## 5. Layout & Composition

Compose pages like an inspectable system, not a marketing splash. Prefer
asymmetric but orderly grids, visible artifact panels, code/spec blocks, and
download/source actions that are easy to compare.

- Use one strong hero visual or artifact preview, never decorative blobs.
- Pair prose with concrete artifacts: packs, tokens, schema paths, examples.
- Keep cards shallow and purposeful; avoid nested cards.
- Use color swatches, metadata strips, and source links as recurring structure.
- Code/spec panels should be real content, not ornamental texture.

## 6. Components

- **Buttons:** 7px radius, rust primary fill, surface secondary fill, 1px border.
- **Cards:** warm surface, 1px border, 7px radius, raised shadow from `--elev-raised`.
- **Code/spec panels:** use `--surface-warm`, `--fg-2`, and the mono stack; keep overflow scrollable.
- **Links:** rust for primary links, teal for technical secondary links.
- **Inputs/selects:** surface fill, border hairline, rust or teal focus ring.
- **Gallery tiles:** image preview, title, one-line summary, palette swatches, and direct actions.

## 7. Motion & Interaction

Motion should be measured and functional. Use 230ms as the
default transition duration.

- Hover may lift buttons/cards by 1-2px.
- Theme switches should feel immediate and reversible.
- Respect `prefers-reduced-motion` by disabling lifts and long transitions on
  specific interactive elements.
- Do not animate code/spec text in a way that harms reading.

## 8. Voice & Brand

Voice is direct, technical, and calm. Mosvera is aesthetic infrastructure, not a
hosted design service. Copy should make local ownership clear.

Use this phrasing when helpful:

- "named aesthetic"
- "aesthetic pack"
- "local registry"
- "composition document"
- "tokens and CSS variables"
- "no hosted runtime dependency"

## 9. Anti-patterns

- Do not use purple or blue gradient hero backgrounds.
- Do not use generic SaaS glassmorphism.
- Do not replace the warm rust/teal accent pair with arbitrary brand colors.
- Do not make dark mode neon, cyberpunk, or nightclub-like.
- Do not imply Mosvera requires a hosted runtime or sends provider requests.
- Do not bury code/spec panels inside decorative cards.
- Do not use stock-like atmospheric imagery when an artifact preview would be clearer.
