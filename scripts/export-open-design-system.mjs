// SPDX-License-Identifier: Apache-2.0

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const check = process.argv.includes("--check");
const outDir = join(root, "integrations", "open-design", "mosvera-public");
const sourceDir = join(outDir, "source");

const lightPath = join(root, "packs", "mosvera-public.mosvera.json");
const darkPath = join(root, "packs", "mosvera-public-dark.mosvera.json");

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, stable(child)]),
    );
  }
  return value;
}

function json(value) {
  return `${JSON.stringify(stable(value), null, 2)}\n`;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function packTemplate(pack) {
  const templateId = pack.documents.compositions[pack.entrypoint.id].base;
  return pack.documents.templates[templateId];
}

function cssString(value) {
  return String(value).replace(/"/g, '\\"');
}

function cssBlock(selector, template, { dark = false } = {}) {
  const p = template.palette;
  const t = template.typography;
  const l = template.layout;
  const accentOn = dark ? p.background : p.surface;
  return `${selector} {
  --bg: ${p.background};
  --surface: ${p.surface};
  --surface-warm: ${p.surface_alt};
  --fg: ${p.ink};
  --fg-2: ${p.ink};
  --muted: ${p.muted};
  --meta: ${p.muted};
  --border: ${p.border};
  --border-soft: ${p.surface_alt};
  --accent: ${p.accent};
  --accent-on: ${accentOn};
  --accent-hover: color-mix(in oklab, var(--accent), ${dark ? "white" : "black"} 8%);
  --accent-active: color-mix(in oklab, var(--accent), ${dark ? "white" : "black"} 14%);
  --success: ${p.accent_2};
  --warn: #d99a2b;
  --danger: #c94a3a;
  --font-display: "${cssString(t.display)}", Georgia, serif;
  --font-body: "${cssString(t.body)}", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "${cssString(t.mono)}", ui-monospace, SFMono-Regular, Consolas, monospace;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 20px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --text-3xl: 48px;
  --text-4xl: 64px;
  --leading-body: 1.5;
  --leading-tight: 1.05;
  --tracking-display: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --section-y-desktop: 96px;
  --section-y-tablet: 64px;
  --section-y-phone: 40px;
  --radius-sm: ${l.radius};
  --radius-md: ${l.radius};
  --radius-lg: 12px;
  --radius-pill: 999px;
  --elev-flat: none;
  --elev-raised: ${l.shadow};
  --elev-ring: 0 0 0 2px color-mix(in oklab, var(--accent), transparent 64%);
  --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 68%);
  --motion-fast: 150ms;
  --motion-base: ${template.motion.duration};
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --container-max: ${l.max_width};
  --container-gutter-desktop: 48px;
  --container-gutter-tablet: 32px;
  --container-gutter-phone: 16px;
}`;
}

function tokensCss(light, dark) {
  return `/* SPDX-License-Identifier: Apache-2.0
 *
 * Open Design token projection for Mosvera Public.
 *
 * Generated from:
 * - source/mosvera-public.mosvera.json
 * - source/mosvera-public-dark.mosvera.json
 *
 * Open Design agents should copy these token blocks rather than inventing
 * raw hex values. Mosvera remains the source aesthetic-pack format; this file
 * maps the canonical Mosvera pair into Open Design's expected token names.
 */

${cssBlock(":root", light)}

${cssBlock('[data-theme="dark"]', dark, { dark: true })}
`;
}

function componentsHtml(light, dark) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mosvera Public Components</title>
    <style>
${cssBlock(":root", light)}

${cssBlock('[data-theme="dark"]', dark, { dark: true })}

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        line-height: var(--leading-body);
      }

      a {
        color: var(--accent);
        text-decoration-thickness: 0.08em;
        text-underline-offset: 0.18em;
      }

      .container {
        width: min(var(--container-max), calc(100% - (var(--container-gutter-phone) * 2)));
        margin-inline: auto;
        padding-block: var(--section-y-phone);
      }

      section,
      .stack-3,
      .stack-4,
      .stack-6 {
        display: grid;
      }

      section {
        gap: var(--space-8);
      }

      .stack-3 {
        gap: var(--space-3);
      }

      .stack-4 {
        gap: var(--space-4);
      }

      .stack-6 {
        gap: var(--space-6);
      }

      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
      }

      h1,
      h2,
      h3 {
        margin: 0;
        font-family: var(--font-display);
        line-height: var(--leading-tight);
      }

      h1 {
        max-width: 12ch;
        font-size: var(--text-4xl);
      }

      h2 {
        font-size: var(--text-3xl);
      }

      h3 {
        font-size: var(--text-xl);
      }

      p {
        margin: 0;
      }

      .lead {
        max-width: 66ch;
        color: var(--muted);
        font-size: var(--text-lg);
      }

      .eyebrow,
      .body-sm,
      .body-muted,
      .badge,
      kbd {
        font-size: var(--text-sm);
      }

      .eyebrow,
      .badge,
      kbd {
        font-family: var(--font-mono);
      }

      .eyebrow {
        color: var(--accent);
        font-weight: 600;
        text-transform: uppercase;
      }

      .body-muted {
        color: var(--muted);
      }

      .card {
        display: grid;
        gap: var(--space-4);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        background: var(--surface);
        box-shadow: var(--elev-raised);
      }

      .btn {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: var(--space-3) var(--space-5);
        background: var(--surface);
        color: var(--fg);
        font: 650 var(--text-base) var(--font-body);
        text-decoration: none;
        transition: transform var(--motion-fast) var(--ease-standard);
      }

      .btn-primary {
        border-color: var(--accent);
        background: var(--accent);
        color: var(--accent-on);
      }

      .btn-secondary {
        background: transparent;
      }

      .btn:hover,
      .btn:focus-visible {
        transform: translateY(-1px);
      }

      .btn:focus-visible,
      input:focus-visible {
        outline: none;
        outline-offset: 3px;
        box-shadow: var(--focus-ring);
      }

      .field {
        display: grid;
        gap: var(--space-2);
      }

      label {
        color: var(--muted);
        font-size: var(--text-sm);
        font-weight: 650;
      }

      input {
        min-height: 44px;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: var(--space-3) var(--space-4);
        background: var(--surface);
        color: var(--fg);
        font: inherit;
      }

      .badge {
        width: fit-content;
        border: 1px solid var(--border);
        border-radius: var(--radius-pill);
        padding: var(--space-1) var(--space-3);
        background: var(--surface-warm);
        color: var(--accent);
        text-transform: uppercase;
      }

      kbd {
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 2px 6px;
        background: var(--surface-warm);
      }

      .icon {
        width: 32px;
        height: 32px;
        display: inline-grid;
        place-items: center;
        border-radius: var(--radius-sm);
        background: var(--accent);
        color: var(--accent-on);
      }

      .artifact-panel {
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        background: var(--surface-warm);
        color: var(--fg-2);
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        overflow: auto;
      }

      @media (min-width: 760px) {
        .container {
          width: min(var(--container-max), calc(100% - (var(--container-gutter-tablet) * 2)));
          padding-block: var(--section-y-desktop);
        }
      }

      @media (min-width: 1100px) {
        .container {
          width: min(var(--container-max), calc(100% - (var(--container-gutter-desktop) * 2)));
        }
      }
    </style>
  </head>
  <body>
    <main class="container">
      <section>
        <div class="stack-4">
          <p class="eyebrow">Mosvera Public</p>
          <h1>Aesthetic infrastructure for local tools.</h1>
          <p class="lead">
            A warm technical editorial system generated from Mosvera aesthetic
            packs and projected into Open Design tokens.
          </p>
          <div class="row-between">
            <a class="btn btn-primary" href="#">Import pack</a>
            <a class="btn btn-secondary" href="#">View source</a>
          </div>
        </div>

        <article class="card">
          <div class="row-between">
            <span class="badge">Local registry</span>
            <span class="icon" aria-hidden="true">M</span>
          </div>
          <div class="stack-3">
            <h2>Composition document</h2>
            <p class="body-muted">
              Resolve a named aesthetic, compile tokens, and keep the runtime
              inside the user's own toolchain.
            </p>
            <p class="body-sm">
              Press <kbd>Cmd</kbd> <kbd>K</kbd> to switch tasks in the host app.
            </p>
          </div>
          <div class="field">
            <label for="pack-id">Pack id</label>
            <input id="pack-id" value="mosvera-public" />
          </div>
          <pre class="artifact-panel"><code>--bg: var(--bg);
--surface: var(--surface);
--accent: var(--accent);</code></pre>
          <a href="#">Download .mosvera.json</a>
        </article>
      </section>
    </main>
  </body>
</html>
`;
}

function designMd(lightPack, darkPack, light, dark) {
  const lp = light.palette;
  const dp = dark.palette;
  return `# Mosvera Public

> Category: Developer Tools
> A warm technical editorial system generated from Mosvera aesthetic packs.

## 1. Visual Theme & Atmosphere

Mosvera Public is a warm technical editorial system for local-first AI tools,
developer documentation, pack galleries, and agent-facing product surfaces. The
system should feel inspectable and practical: paper and ink, schema panes,
tessera-like blocks, restrained rust, and teal technical signal.

The dark mode is not a separate brand. It is the \`${darkPack.id}\` Mosvera
pack mapped to Open Design's \`[data-theme="dark"]\` override pattern. Keep it
warm, low-light, and legible. Do not turn it into neon cyberpunk.

## 2. Color

All values are tokens. Do not invent new hex values.

Light mode from \`${lightPack.id}\`:

- **Background:** \`${lp.background}\` - warm paper canvas.
- **Surface:** \`${lp.surface}\` - cards, panels, and elevated blocks.
- **Surface warm:** \`${lp.surface_alt}\` - secondary wells and soft dividers.
- **Foreground:** \`${lp.ink}\` - primary text and strong rules.
- **Muted:** \`${lp.muted}\` - secondary copy and captions.
- **Border:** \`${lp.border}\` - hairlines and card edges.
- **Accent:** \`${lp.accent}\` - primary action, key marks, and one strong moment.
- **Accent 2:** \`${lp.accent_2}\` - technical signal, success, and secondary emphasis.
- **Code background source value:** \`${lp.code_bg}\`; **code ink source value:** \`${lp.code_ink}\`.

Dark mode from \`${darkPack.id}\`:

- **Background:** \`${dp.background}\`
- **Surface:** \`${dp.surface}\`
- **Surface warm:** \`${dp.surface_alt}\`
- **Foreground:** \`${dp.ink}\`
- **Muted:** \`${dp.muted}\`
- **Border:** \`${dp.border}\`
- **Accent:** \`${dp.accent}\`
- **Accent 2:** \`${dp.accent_2}\`
- **Code background source value:** \`${dp.code_bg}\`; **code ink source value:** \`${dp.code_ink}\`.

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

- **Container:** max-width \`${light.layout.max_width}\`.
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
- **Cards:** warm surface, 1px border, 7px radius, raised shadow from \`--elev-raised\`.
- **Code/spec panels:** use \`--surface-warm\`, \`--fg-2\`, and the mono stack; keep overflow scrollable.
- **Links:** rust for primary links, teal for technical secondary links.
- **Inputs/selects:** surface fill, border hairline, rust or teal focus ring.
- **Gallery tiles:** image preview, title, one-line summary, palette swatches, and direct actions.

## 7. Motion & Interaction

Motion should be measured and functional. Use ${light.motion.duration} as the
default transition duration.

- Hover may lift buttons/cards by 1-2px.
- Theme switches should feel immediate and reversible.
- Respect \`prefers-reduced-motion\` by disabling lifts and long transitions on
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
`;
}

function sourceReadme() {
  return `# Mosvera Source Packs

This folder preserves the Mosvera source aesthetics used to generate the Open
Design \`mosvera-public\` design system.

- \`mosvera-public.mosvera.json\` maps to the Open Design \`:root\` token block.
- \`mosvera-public-dark.mosvera.json\` maps to \`[data-theme="dark"]\`.

The Open Design design system does not require Mosvera at runtime. These packs
are provenance and exchange artifacts only. They contain registry documents, not
secrets, provider credentials, generated media, remote auth, or local MCP
configuration.
`;
}

const lightPackText = readFileSync(lightPath, "utf8");
const darkPackText = readFileSync(darkPath, "utf8");
const lightPack = readJson(lightPath);
const darkPack = readJson(darkPath);
const light = packTemplate(lightPack);
const dark = packTemplate(darkPack);

const outputs = new Map([
  [
    join(outDir, "manifest.json"),
    json({
      schemaVersion: "od-design-system-project/v1",
      id: "mosvera-public",
      name: "Mosvera Public",
      category: "Developer Tools",
      description: "A warm technical editorial design system generated from Mosvera aesthetic packs.",
      source: {
        type: "bundled",
        origin: "Mosvera aesthetic packs",
      },
      files: {
        components: "components.html",
        design: "DESIGN.md",
        tokens: "tokens.css",
      },
    }),
  ],
  [join(outDir, "DESIGN.md"), designMd(lightPack, darkPack, light, dark)],
  [join(outDir, "tokens.css"), tokensCss(light, dark)],
  [join(outDir, "components.html"), componentsHtml(light, dark)],
  [join(sourceDir, "mosvera-public.mosvera.json"), lightPackText],
  [join(sourceDir, "mosvera-public-dark.mosvera.json"), darkPackText],
  [join(sourceDir, "README.md"), sourceReadme()],
]);

if (!check) {
  mkdirSync(sourceDir, { recursive: true });
}

const drift = [];
for (const [path, content] of outputs) {
  if (check) {
    let existing;
    try {
      existing = readFileSync(path, "utf8");
    } catch {
      drift.push(path);
      continue;
    }
    if (existing !== content) drift.push(path);
  } else {
    writeFileSync(path, content);
  }
}

if (drift.length > 0) {
  throw new Error(`Open Design export is out of date:\n${drift.join("\n")}`);
}

console.log(`${check ? "Verified" : "Generated"} Open Design Mosvera Public design system`);
