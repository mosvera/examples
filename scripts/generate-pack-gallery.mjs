// SPDX-License-Identifier: Apache-2.0

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const root = process.cwd();
const packsDir = join(root, "packs");
const assetsDir = join(packsDir, "assets");
const width = 1280;
const height = 853;
const generatePlaceholderAssets = process.argv.includes("--placeholder-assets");

const packBaseUrl = "https://raw.githubusercontent.com/mosvera/examples/main/packs";
const packSourceUrl = "https://github.com/mosvera/examples/blob/main/packs";

const fontSets = {
  editorial: { display: "Fraunces", body: "Hanken Grotesk", mono: "IBM Plex Mono", scale: "editorial" },
  compact: { display: "IBM Plex Mono", body: "Hanken Grotesk", mono: "IBM Plex Mono", scale: "compact" },
  large: { display: "Fraunces", body: "Hanken Grotesk", mono: "IBM Plex Mono", scale: "large" },
  friendly: { display: "Fraunces", body: "Hanken Grotesk", mono: "IBM Plex Mono", scale: "friendly" },
};

const packs = [
  {
    id: "mosvera-public",
    label: "Mosvera Public",
    summary: "The canonical Mosvera public-site aesthetic: warm, technical, open, and quietly distinctive.",
    category: "Canonical brand",
    palette: ["#f5efe4", "#fffaf2", "#e7dccb", "#201a14", "#62584d", "#bd5838", "#2f7f73", "#cdbda8", "#15110d", "#f7ead9"],
    typography: "editorial",
    layout: ["comfortable", "7px", "0 20px 62px rgba(54, 37, 23, 0.17)", "1180px"],
    motion: ["measured", "230ms"],
    treatment: "brand_tessera",
    voice: [
      "Canonical Mosvera public aesthetic",
      "Aesthetic infrastructure you can bring into your own tools.",
      "Mosvera turns named aesthetic intent into portable packs, local registries, design tokens, CSS variables, and provider payloads without a hosted runtime dependency.",
    ],
    art: "brand",
  },
  {
    id: "quiet-editorial",
    label: "Quiet Editorial",
    summary: "A calm public-standard home: readable, measured, and institutional without feeling sterile.",
    category: "Public standard",
    palette: ["#f7f2e7", "#fffaf0", "#eee3d4", "#211b16", "#665c50", "#bd5838", "#2e6b5f", "#d8c8b6", "#181513", "#f5ebdd"],
    typography: "editorial",
    layout: ["comfortable", "6px", "0 18px 55px rgba(58, 38, 21, 0.16)", "1160px"],
    motion: ["steady", "220ms"],
    treatment: "paper_field",
    voice: ["Canonical public home", "Aesthetic infrastructure you can inspect.", "Mosvera turns aesthetic intent into typed, portable, reviewable artifacts that teams can run inside their own platforms."],
    art: "paper",
  },
  {
    id: "technical-manual",
    label: "Technical Manual",
    summary: "Dense, precise, and engineered for scanning: a spec bench rather than a campaign page.",
    category: "Reference",
    palette: ["#f2f5f1", "#ffffff", "#dfe8e2", "#10211c", "#50615b", "#17745f", "#5847a6", "#b9c8c0", "#07130f", "#d9f7ea"],
    typography: "compact",
    layout: ["compact", "2px", "0 1px 0 rgba(16, 33, 28, 0.24)", "1220px"],
    motion: ["quick", "120ms"],
    treatment: "schematic",
    voice: ["Implementation reference", "Same site, compiled as a technical surface.", "This mode compresses the interface, raises structure, and makes the underlying Mosvera artifacts feel like a spec you can build from."],
    art: "schematic",
  },
  {
    id: "cinematic-lab",
    label: "Cinematic Lab",
    summary: "High-contrast, image-forward, and expressive while keeping the schema surface legible.",
    category: "Visual research",
    palette: ["#12100f", "#1e1a18", "#2f2524", "#f6eee6", "#c7b8aa", "#e05b45", "#7cc9d8", "#4c3b39", "#080707", "#f8e6c8"],
    typography: "large",
    layout: ["spacious", "8px", "0 28px 80px rgba(0, 0, 0, 0.42)", "1240px"],
    motion: ["cinematic", "320ms"],
    treatment: "spotlit",
    voice: ["Visual research mode", "The standard can carry drama without losing structure.", "Cinematic Lab pushes contrast, scale, and image presence while the same composition, schema, and token panes stay readable."],
    art: "spotlight",
  },
  {
    id: "claymation-playful-builder",
    label: "Claymation Playful Builder",
    summary: "Tactile, warm, handmade, and constructive: proof that Mosvera can carry real personality.",
    category: "Tactile builder",
    palette: ["#f6e7cc", "#fff3dc", "#ead2ad", "#2a2118", "#695946", "#d45f3f", "#2f8f9d", "#c99a68", "#2b2119", "#ffe3bc"],
    typography: "friendly",
    layout: ["roomy", "8px", "0 18px 0 rgba(96, 63, 39, 0.26)", "1160px"],
    motion: ["bouncy", "260ms"],
    treatment: "tabletop_model",
    voice: ["Tactile builder mode", "Same architecture, built out of warm clay and shop light.", "This mode keeps the spec serious while the surface becomes handmade, constructive, and a little mischievous."],
    art: "clay",
  },
  {
    id: "neon-noir-console",
    label: "Neon Noir Console",
    summary: "A rain-slick command surface with magenta voltage, cyan glass, and deep cinematic shadow.",
    category: "Noir interface",
    palette: ["#08070d", "#13111f", "#201b33", "#f4f1ff", "#9b90b8", "#ff2e88", "#00d6ff", "#3f315d", "#05040a", "#dff9ff"],
    typography: "compact",
    layout: ["compact", "4px", "0 20px 70px rgba(255, 46, 136, 0.24)", "1220px"],
    motion: ["electric", "180ms"],
    treatment: "neon_reflection",
    voice: ["Signal in the rain", "A console glowing through noir weather.", "This aesthetic turns product structure into a night interface: legible, high voltage, and a little dangerous."],
    art: "neon",
  },
  {
    id: "botanical-glasshouse",
    label: "Botanical Glasshouse",
    summary: "Layered green glass, humid highlights, and living-organic structure for softer technical systems.",
    category: "Organic glass",
    palette: ["#edf6e8", "#fbfff7", "#d7ead1", "#17251a", "#5f7463", "#2f9f6b", "#e6a83a", "#a9c6a2", "#0f1a12", "#eaffdb"],
    typography: "editorial",
    layout: ["comfortable", "10px", "0 22px 64px rgba(47, 159, 107, 0.18)", "1180px"],
    motion: ["breathing", "300ms"],
    treatment: "greenhouse_glass",
    voice: ["Living systems mode", "A glasshouse for calm technical growth.", "Botanical Glasshouse makes Mosvera feel alive without losing the grid underneath the leaves."],
    art: "botanical",
  },
  {
    id: "lunar-industrial",
    label: "Lunar Industrial",
    summary: "Powder-gray moon dust, hazard amber, and machined surfaces for heavy engineering stories.",
    category: "Industrial",
    palette: ["#d8d9d2", "#f4f3ec", "#bfc0b8", "#151713", "#5c6059", "#e7a822", "#426b7c", "#8f9188", "#11120f", "#f2eddb"],
    typography: "compact",
    layout: ["compact", "3px", "0 10px 0 rgba(21, 23, 19, 0.18)", "1240px"],
    motion: ["mechanical", "150ms"],
    treatment: "moon_foundry",
    voice: ["Off-world fabrication", "A lunar factory floor for aesthetic systems.", "This pack makes the interface feel machined, dusty, and operational, like instructions printed on pressure-rated metal."],
    art: "industrial",
  },
  {
    id: "ukiyo-e-interface",
    label: "Ukiyo-e Interface",
    summary: "Flat ink fields, wave rhythm, and vermilion accents translated into a crisp digital surface.",
    category: "Illustrated heritage",
    palette: ["#efe4cf", "#fff8e8", "#dfcaa8", "#1d2430", "#70624f", "#d64a2f", "#2b6f88", "#b79c75", "#141a22", "#f7e8c7"],
    typography: "editorial",
    layout: ["comfortable", "5px", "0 14px 0 rgba(29, 36, 48, 0.18)", "1160px"],
    motion: ["flowing", "260ms"],
    treatment: "woodblock_wave",
    voice: ["Woodblock interface", "A digital surface with ink, rhythm, and restraint.", "Ukiyo-e Interface uses flat planes and wave motion to make technical content feel composed and artful."],
    art: "wave",
  },
  {
    id: "bauhaus-signal",
    label: "Bauhaus Signal",
    summary: "Primary geometry, strong rhythm, and poster-like hierarchy for bold civic/product communication.",
    category: "Graphic system",
    palette: ["#f5f1dc", "#fffdf0", "#e5dfc8", "#171717", "#59564c", "#d63230", "#1769aa", "#c9b33c", "#101010", "#f8efcc"],
    typography: "large",
    layout: ["comfortable", "0px", "0 16px 0 rgba(23, 23, 23, 0.18)", "1200px"],
    motion: ["snappy", "160ms"],
    treatment: "primary_geometry",
    voice: ["Poster logic", "A signal system built from circles, bars, and conviction.", "Bauhaus Signal makes Mosvera feel like a modernist poster that learned to compile."],
    art: "bauhaus",
  },
  {
    id: "desert-modernist",
    label: "Desert Modernist",
    summary: "Sun-washed plaster, adobe shadow, cactus green, and restrained resort-modern geometry.",
    category: "Warm modern",
    palette: ["#efe0c3", "#fff2d6", "#d8b98d", "#2c2118", "#755f48", "#c56f36", "#4c7f59", "#b58a60", "#241a13", "#ffe8bd"],
    typography: "editorial",
    layout: ["roomy", "7px", "0 20px 50px rgba(117, 95, 72, 0.20)", "1160px"],
    motion: ["sunlit", "240ms"],
    treatment: "desert_plaster",
    voice: ["Sunlit modernism", "A warm, spare system with long shadows.", "Desert Modernist gives the site dry air, simple forms, and a grounded sense of place."],
    art: "desert",
  },
  {
    id: "alpine-research",
    label: "Alpine Research",
    summary: "Glacial whites, topographic lines, cold blue accents, and field-station precision.",
    category: "Research fieldwork",
    palette: ["#edf4f5", "#ffffff", "#d8e5e8", "#12202a", "#5a6c75", "#2d80c3", "#d94f3d", "#a9bcc4", "#0c151c", "#e5f6ff"],
    typography: "compact",
    layout: ["compact", "3px", "0 18px 55px rgba(18, 32, 42, 0.14)", "1240px"],
    motion: ["crisp", "150ms"],
    treatment: "topographic_field",
    voice: ["Field station mode", "A cold, exacting map for research systems.", "Alpine Research turns dense information into something like a snow survey: crisp, structured, and outdoors-aware."],
    art: "topographic",
  },
  {
    id: "maximalist-zine",
    label: "Maximalist Zine",
    summary: "Cut-paper energy, loud contrast, and photocopy texture for expressive community surfaces.",
    category: "Editorial chaos",
    palette: ["#fff1d8", "#fffaf2", "#f2c3d1", "#171114", "#6f4b59", "#f03a77", "#21a0a0", "#e0a72d", "#16100f", "#ffe9a8"],
    typography: "friendly",
    layout: ["roomy", "6px", "0 12px 0 rgba(240, 58, 119, 0.26)", "1140px"],
    motion: ["jump_cut", "190ms"],
    treatment: "collage_zine",
    voice: ["Cut and paste mode", "A zine table with a working type system.", "Maximalist Zine lets Mosvera get loud: collage, color, and motion with the contract still intact."],
    art: "zine",
  },
  {
    id: "luxury-atelier",
    label: "Luxury Atelier",
    summary: "Deep ink, champagne metal, quiet shadows, and editorial restraint for premium product surfaces.",
    category: "Luxury",
    palette: ["#11100e", "#1d1a16", "#2d251d", "#f7efe2", "#c9bba7", "#c9a45a", "#7aa6a1", "#4a3f31", "#080807", "#fff2d2"],
    typography: "large",
    layout: ["spacious", "5px", "0 30px 90px rgba(0, 0, 0, 0.45)", "1180px"],
    motion: ["slow", "360ms"],
    treatment: "atelier_metal",
    voice: ["Private atelier", "A precise surface with metal, shadow, and air.", "Luxury Atelier makes the interface feel intentional, expensive, and unhurried without losing its documentation spine."],
    art: "luxury",
  },
  {
    id: "retro-future-terminal",
    label: "Retro Future Terminal",
    summary: "Amber phosphor, mint glow, and chunky terminal optimism from an imagined 1983 future.",
    category: "Terminal",
    palette: ["#15160d", "#202313", "#30351c", "#f5ffd6", "#adb681", "#ffb84d", "#78f0a4", "#5b6234", "#090a06", "#eaffba"],
    typography: "compact",
    layout: ["compact", "4px", "0 0 38px rgba(120, 240, 164, 0.18)", "1220px"],
    motion: ["scanline", "140ms"],
    treatment: "phosphor_terminal",
    voice: ["Warm terminal future", "A glowing interface from an alternate workstation timeline.", "Retro Future Terminal gives Mosvera a command-line soul with just enough amber optimism."],
    art: "terminal",
  },
  {
    id: "oceanic-biolume",
    label: "Oceanic Biolume",
    summary: "Deep water gradients, luminous cyan organisms, and soft pressure for immersive knowledge spaces.",
    category: "Bioluminescent",
    palette: ["#06151b", "#0d2730", "#123b46", "#e3fbff", "#99bec6", "#29e3d0", "#7b6ff0", "#275e68", "#031015", "#d9fffb"],
    typography: "large",
    layout: ["spacious", "10px", "0 28px 85px rgba(41, 227, 208, 0.16)", "1220px"],
    motion: ["drifting", "340ms"],
    treatment: "deep_sea_glow",
    voice: ["Below the surface", "A bioluminescent system for quiet depth.", "Oceanic Biolume pulls the interface underwater: luminous, slow, and surprisingly readable."],
    art: "ocean",
  },
  {
    id: "brutalist-civic",
    label: "Brutalist Civic",
    summary: "Concrete gray, safety red, large blocks, and public-infrastructure seriousness.",
    category: "Civic",
    palette: ["#d7d5ce", "#f1f0ea", "#bab8af", "#151515", "#55534d", "#d3362d", "#2f6f88", "#8c8981", "#0d0d0d", "#efeadc"],
    typography: "compact",
    layout: ["compact", "0px", "0 8px 0 rgba(21, 21, 21, 0.22)", "1260px"],
    motion: ["direct", "110ms"],
    treatment: "concrete_civic",
    voice: ["Public works mode", "A concrete interface with civic authority.", "Brutalist Civic makes the site feel like signage on a serious public building: blunt, useful, and accountable."],
    art: "brutalist",
  },
  {
    id: "soft-focus-wellness",
    label: "Soft Focus Wellness",
    summary: "Diffuse blush, moss, and linen tones for calmer human-care and coaching surfaces.",
    category: "Wellness",
    palette: ["#f5eadf", "#fff7ef", "#e6d7cb", "#29211d", "#75685f", "#c97a72", "#6f9b78", "#d0b9aa", "#201917", "#ffe9dc"],
    typography: "friendly",
    layout: ["roomy", "12px", "0 24px 70px rgba(117, 104, 95, 0.16)", "1120px"],
    motion: ["soft", "320ms"],
    treatment: "diffuse_linen",
    voice: ["Gentle care mode", "A soft-focus system that still knows its structure.", "Soft Focus Wellness makes product surfaces feel humane, slower, and warmer without becoming vague."],
    art: "wellness",
  },
  {
    id: "spacecraft-telemetry",
    label: "Spacecraft Telemetry",
    summary: "Black-panel instrumentation, orbital blue, and high-density readouts for mission-control systems.",
    category: "Mission control",
    palette: ["#080b12", "#121827", "#1c2638", "#eff6ff", "#9fb0c6", "#4cc9f0", "#f7b731", "#33445c", "#03050a", "#d8edff"],
    typography: "compact",
    layout: ["compact", "2px", "0 0 44px rgba(76, 201, 240, 0.16)", "1280px"],
    motion: ["orbital", "150ms"],
    treatment: "telemetry_panel",
    voice: ["Mission control", "A telemetry wall for aesthetic infrastructure.", "Spacecraft Telemetry makes every panel feel instrumented, crisp, and ready for launch-day scrutiny."],
    art: "space",
  },
  {
    id: "museum-archive",
    label: "Museum Archive",
    summary: "Catalog paper, archival labels, burgundy marks, and careful hierarchy for collections and records.",
    category: "Archive",
    palette: ["#eee6d6", "#fffaf0", "#dbcfbb", "#221a14", "#6a5e50", "#8f2f3f", "#3f6b63", "#bdad96", "#17120e", "#f5e6c8"],
    typography: "editorial",
    layout: ["comfortable", "3px", "0 16px 50px rgba(34, 26, 20, 0.14)", "1160px"],
    motion: ["careful", "240ms"],
    treatment: "archive_label",
    voice: ["Collection record", "An archive table with modern instruments.", "Museum Archive gives Mosvera catalog calm: index cards, provenance, and restrained color."],
    art: "archive",
  },
  {
    id: "arcade-pop",
    label: "Arcade Pop",
    summary: "Candy color, black outlines, chunky rhythm, and playful confidence for interactive experiences.",
    category: "Play",
    palette: ["#fff0f4", "#ffffff", "#ffd6e2", "#1f1520", "#6b5268", "#ff3b8d", "#2cc9ff", "#ffc94d", "#140d14", "#ffe7f1"],
    typography: "friendly",
    layout: ["roomy", "8px", "0 16px 0 rgba(255, 59, 141, 0.24)", "1160px"],
    motion: ["pop", "170ms"],
    treatment: "arcade_cabinet",
    voice: ["Press start mode", "A playable interface with real structure underneath.", "Arcade Pop makes the site feel bright, responsive, and alive, like a cabinet full of documentation."],
    art: "arcade",
  },
  {
    id: "graphite-studio",
    label: "Graphite Studio",
    summary: "Charcoal paper, pencil marks, and precise monochrome composition for serious creative tools.",
    category: "Studio",
    palette: ["#e6e3dc", "#f8f6f0", "#c9c5bb", "#1d1c1a", "#66615a", "#6e6a62", "#b84a3c", "#aaa49a", "#11100f", "#f3eadb"],
    typography: "editorial",
    layout: ["comfortable", "4px", "0 18px 60px rgba(29, 28, 26, 0.16)", "1180px"],
    motion: ["measured", "220ms"],
    treatment: "graphite_study",
    voice: ["Studio table", "A graphite study for deliberate creative systems.", "Graphite Studio strips the palette down until hierarchy, texture, and judgment carry the surface."],
    art: "graphite",
  },
  {
    id: "stained-glass-fable",
    label: "Stained Glass Fable",
    summary: "Jewel panels, dark leading, and luminous storybook contrast for narrative product surfaces.",
    category: "Narrative",
    palette: ["#17111c", "#21182a", "#392745", "#fff3d0", "#ccb6d6", "#e84f6f", "#2ec4b6", "#7f5aa2", "#0d0911", "#ffeeb8"],
    typography: "large",
    layout: ["spacious", "8px", "0 28px 90px rgba(232, 79, 111, 0.20)", "1200px"],
    motion: ["luminous", "300ms"],
    treatment: "stained_glass",
    voice: ["Illuminated fable", "A luminous system made from colored panes.", "Stained Glass Fable gives technical material storybook depth while keeping every pane inspectable."],
    art: "glass",
  },
  {
    id: "kinetic-sports-broadcast",
    label: "Kinetic Sports Broadcast",
    summary: "Scoreboard contrast, motion graphics, electric green, and fast editorial pacing.",
    category: "Broadcast",
    palette: ["#0b1014", "#151d24", "#22303a", "#f7fff4", "#abc0b7", "#b7ff2a", "#28a8ff", "#41525d", "#05080a", "#edffd1"],
    typography: "compact",
    layout: ["compact", "4px", "0 18px 0 rgba(183, 255, 42, 0.18)", "1260px"],
    motion: ["kinetic", "130ms"],
    treatment: "broadcast_package",
    voice: ["Live package", "A broadcast surface with speed and scorekeeping.", "Kinetic Sports Broadcast turns Mosvera into a fast graphic package: sharp, loud, and built for scanning."],
    art: "sports",
  },
  {
    id: "cybernetic-garden",
    label: "Cybernetic Garden",
    summary: "Synthetic foliage, circuit traces, lime bloom, and black soil for hybrid nature-machine systems.",
    category: "Hybrid",
    palette: ["#07100c", "#101b16", "#1b2d24", "#ecffe8", "#9cb59d", "#7cff6b", "#41d1c2", "#365240", "#040806", "#e7ffcb"],
    typography: "friendly",
    layout: ["roomy", "9px", "0 25px 80px rgba(124, 255, 107, 0.16)", "1180px"],
    motion: ["growing", "280ms"],
    treatment: "synthetic_foliage",
    voice: ["Machine garden", "An interface where circuitry grows leaves.", "Cybernetic Garden lets the system feel alive and technical at once, with glowing growth rings and clean structure."],
    art: "cybergarden",
  },
  {
    id: "porcelain-minimal",
    label: "Porcelain Minimal",
    summary: "Cool porcelain whites, cobalt hairlines, and restrained detail for premium quiet surfaces.",
    category: "Minimal",
    palette: ["#f5f7f3", "#ffffff", "#e3e8e4", "#121819", "#5a6667", "#2458a7", "#9a6a4f", "#c8d2cf", "#071012", "#e9f3ff"],
    typography: "editorial",
    layout: ["comfortable", "6px", "0 22px 70px rgba(18, 24, 25, 0.12)", "1140px"],
    motion: ["quiet", "260ms"],
    treatment: "porcelain_cobalt",
    voice: ["Porcelain quiet", "A minimal system with blue hairline precision.", "Porcelain Minimal keeps the site calm and exact, like cobalt marks on a white ceramic field."],
    art: "porcelain",
  },
];

function title(value) {
  return value.replace(/(^|-)([a-z])/g, (_, sep, letter) => `${sep === "-" ? " " : ""}${letter.toUpperCase()}`);
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, child]) => [key, stable(child)]));
  }
  return value;
}

function json(value) {
  return `${JSON.stringify(stable(value), null, 2)}\n`;
}

function paletteObject(entry) {
  const [
    background,
    surface,
    surfaceAlt,
    ink,
    muted,
    accent,
    accent2,
    border,
    codeBg,
    codeInk,
  ] = entry.palette;
  return {
    background,
    surface,
    surface_alt: surfaceAlt,
    ink,
    muted,
    accent,
    accent_2: accent2,
    border,
    code_bg: codeBg,
    code_ink: codeInk,
  };
}

function canonical(entry) {
  const [density, radius, shadow, maxWidth] = entry.layout;
  const [pace, duration] = entry.motion;
  return {
    palette: paletteObject(entry),
    typography: fontSets[entry.typography],
    layout: { density, radius, shadow, max_width: maxWidth },
    motion: { pace, duration },
    imagery: {
      treatment: entry.treatment,
      src: `/assets/aesthetics/hero-${entry.id}.webp`,
      alt: `${entry.label} Mosvera aesthetic thumbnail with ${entry.treatment.replace(/_/g, " ")} treatment.`,
      blend: entry.palette[0].startsWith("#0") || entry.palette[0].startsWith("#1") ? "screen" : "normal",
      saturation: entry.typography === "compact" ? "1.04" : "1.08",
      contrast: entry.typography === "large" ? "1.12" : "1.02",
    },
    voice: {
      eyebrow: entry.voice[0],
      headline: entry.voice[1],
      body: entry.voice[2],
    },
  };
}

function composition(entry) {
  return {
    $schema: "https://mosvera.io/schema/0.1/composition",
    id: entry.id,
    base: `${entry.id}-base`,
  };
}

function pack(entry) {
  const templateId = `${entry.id}-base`;
  return {
    $schema: "https://mosvera.io/schema/0.1/aesthetic-pack",
    kind: "mosvera.aesthetic_pack",
    version: "0.1",
    id: entry.id,
    name: entry.label,
    description: entry.summary,
    entrypoint: { kind: "composition", id: entry.id },
    documents: {
      templates: {
        [templateId]: {
          $schema: "https://mosvera.io/schema/0.1/template",
          id: templateId,
          ...canonical(entry),
        },
      },
      palettes: {},
      modifiers: {},
      compositions: {
        [entry.id]: composition(entry),
      },
    },
  };
}

function galleryEntry(entry) {
  return {
    id: entry.id,
    label: entry.label,
    summary: entry.summary,
    category: entry.category,
    pack_file: `packs/${entry.id}.mosvera.json`,
    asset_file: `packs/assets/hero-${entry.id}.webp`,
    download_url: `${packBaseUrl}/${entry.id}.mosvera.json`,
    source_url: `${packSourceUrl}/${entry.id}.mosvera.json`,
    swatches: {
      background: entry.palette[0],
      surface: entry.palette[1],
      ink: entry.palette[3],
      accent: entry.palette[5],
      accent_2: entry.palette[6],
      border: entry.palette[7],
    },
    composition: composition(entry),
    canonical: canonical(entry),
  };
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shapeSet(entry, index) {
  const p = paletteObject(entry);
  const phase = (index + 1) * 37;
  const circles = Array.from({ length: 8 }, (_, i) => {
    const cx = 120 + ((phase + i * 157) % 1040);
    const cy = 95 + ((phase * 2 + i * 109) % 650);
    const r = 52 + ((phase + i * 29) % 130);
    const color = [p.accent, p.accent_2, p.surface_alt, p.border][i % 4];
    const opacity = 0.12 + (i % 4) * 0.055;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`;
  }).join("");
  const bars = Array.from({ length: 12 }, (_, i) => {
    const x = -160 + i * 130;
    const h = 180 + ((phase + i * 47) % 420);
    const color = [p.accent, p.accent_2, p.ink][i % 3];
    return `<rect x="${x}" y="${height - h}" width="78" height="${h + 120}" rx="18" fill="${color}" opacity="0.16" transform="rotate(-18 ${x + 39} ${height / 2})"/>`;
  }).join("");
  const grid = Array.from({ length: 20 }, (_, i) => {
    const x = i * 72;
    return `<path d="M ${x} 0 L ${x - 320} ${height}" stroke="${p.border}" stroke-width="2" opacity="0.22"/>`;
  }).join("") + Array.from({ length: 14 }, (_, i) => {
    const y = i * 70;
    return `<path d="M 0 ${y} L ${width} ${y - 160}" stroke="${p.border}" stroke-width="2" opacity="0.18"/>`;
  }).join("");
  const waves = Array.from({ length: 9 }, (_, i) => {
    const y = 130 + i * 72;
    return `<path d="M -80 ${y} C 120 ${y - 90}, 260 ${y + 90}, 440 ${y} S 760 ${y - 90}, 940 ${y} S 1160 ${y + 90}, 1360 ${y}" fill="none" stroke="${i % 2 ? p.accent : p.accent_2}" stroke-width="${8 + i}" opacity="0.18"/>`;
  }).join("");
  const tiles = Array.from({ length: 56 }, (_, i) => {
    const x = (i % 8) * 170 - 45;
    const y = Math.floor(i / 8) * 132 - 30;
    const color = [p.surface, p.surface_alt, p.accent, p.accent_2, p.border][i % 5];
    return `<rect x="${x}" y="${y}" width="126" height="86" rx="${entry.layout[1].replace("px", "")}" fill="${color}" opacity="${0.16 + (i % 3) * 0.06}" transform="rotate(${(i % 5 - 2) * 4} ${x + 63} ${y + 43})"/>`;
  }).join("");
  const rays = Array.from({ length: 32 }, (_, i) => {
    const angle = (360 / 32) * i;
    return `<path d="M 640 426 L 1640 426" stroke="${i % 2 ? p.accent : p.accent_2}" stroke-width="${i % 3 === 0 ? 18 : 8}" opacity="0.11" transform="rotate(${angle} 640 426)"/>`;
  }).join("");
  const dots = Array.from({ length: 160 }, (_, i) => {
    const cx = (phase * 7 + i * 83) % width;
    const cy = (phase * 11 + i * 61) % height;
    const color = [p.accent, p.accent_2, p.surface, p.ink][i % 4];
    return `<circle cx="${cx}" cy="${cy}" r="${2 + (i % 7)}" fill="${color}" opacity="${0.12 + (i % 5) * 0.035}"/>`;
  }).join("");
  const topographic = Array.from({ length: 16 }, (_, i) => {
    const inset = i * 28;
    return `<rect x="${150 + inset}" y="${70 + inset * 0.55}" width="${980 - inset * 2}" height="${690 - inset * 1.1}" rx="${80 - i * 2}" fill="none" stroke="${i % 2 ? p.accent : p.accent_2}" stroke-width="3" opacity="0.16"/>`;
  }).join("");
  const glass = Array.from({ length: 22 }, (_, i) => {
    const x = 80 + ((phase + i * 97) % 1060);
    const y = 60 + ((phase * 3 + i * 71) % 700);
    const color = [p.accent, p.accent_2, p.surface_alt][i % 3];
    return `<polygon points="${x},${y} ${x + 110},${y + 28} ${x + 70},${y + 142} ${x - 42},${y + 92}" fill="${color}" opacity="0.18" stroke="${p.ink}" stroke-opacity="0.16" stroke-width="3"/>`;
  }).join("");

  const map = {
    brand: `${tiles}${grid}${circles}`,
    paper: `${tiles}${dots}`,
    schematic: `${grid}${bars}`,
    spotlight: `${rays}${circles}`,
    clay: `${tiles}${circles}`,
    neon: `${grid}${rays}${dots}`,
    botanical: `${waves}${circles}${dots}`,
    industrial: `${grid}${bars}`,
    wave: `${waves}${tiles}`,
    bauhaus: `${rays}${tiles}${circles}`,
    desert: `${rays}${waves}`,
    topographic: `${topographic}${dots}`,
    zine: `${tiles}${bars}${dots}`,
    luxury: `${rays}${glass}`,
    terminal: `${grid}${dots}`,
    ocean: `${waves}${circles}${dots}`,
    brutalist: `${bars}${grid}`,
    wellness: `${circles}${waves}`,
    space: `${grid}${rays}${dots}`,
    archive: `${tiles}${topographic}`,
    arcade: `${tiles}${dots}${circles}`,
    graphite: `${topographic}${bars}`,
    glass: `${glass}${rays}`,
    sports: `${bars}${rays}${grid}`,
    cybergarden: `${waves}${grid}${dots}`,
    porcelain: `${topographic}${tiles}`,
  };
  return map[entry.art] ?? `${tiles}${circles}`;
}

function svg(entry, index) {
  const p = paletteObject(entry);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.background}"/>
      <stop offset="0.5" stop-color="${p.surface}"/>
      <stop offset="1" stop-color="${p.surface_alt}"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="30%" r="72%">
      <stop offset="0" stop-color="${p.accent}" stop-opacity="0.42"/>
      <stop offset="0.42" stop-color="${p.accent_2}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${p.background}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1280" height="853" fill="url(#bg)"/>
  <rect width="1280" height="853" fill="url(#glow)"/>
  <g>${shapeSet(entry, index)}</g>
  <rect x="56" y="56" width="1168" height="741" rx="28" fill="none" stroke="${p.border}" stroke-width="2" opacity="0.58"/>
  <g transform="translate(84 612)">
    <rect x="0" y="0" width="630" height="132" rx="18" fill="${p.surface}" opacity="0.72"/>
    <rect x="24" y="24" width="92" height="14" rx="7" fill="${p.accent}"/>
    <text x="24" y="75" fill="${p.ink}" font-family="Arial, sans-serif" font-size="34" font-weight="700">${escapeXml(entry.label)}</text>
    <text x="24" y="108" fill="${p.muted}" font-family="Arial, sans-serif" font-size="18">${escapeXml(entry.category)}</text>
  </g>
  <g opacity="0.18">
    ${Array.from({ length: 90 }, (_, i) => {
      const x = (index * 43 + i * 67) % width;
      const y = (index * 71 + i * 53) % height;
      return `<circle cx="${x}" cy="${y}" r="1.2" fill="${p.ink}"/>`;
    }).join("")}
  </g>
</svg>`;
}

function readme() {
  const list = packs.map((entry) => `- [${entry.label}](./${entry.id}.mosvera.json) - ${entry.summary}`).join("\n");
  return `<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# Mosvera Aesthetic Pack Gallery

This directory is the canonical source for the public Mosvera pack gallery.
Each \`.mosvera.json\` file contains portable registry documents for one named
aesthetic. The WebP thumbnails are gallery previews only; v1 packs do not
embed assets, credentials, provider manifests, remote URLs, or zip contents.

## Packs

${list}

## Use With Claude Desktop

\`\`\`text
Use Mosvera to preview importing this aesthetic pack:
/path/to/claymation-playful-builder.mosvera.json

Use Mosvera to import this aesthetic pack into my local registry.

Use Mosvera to resolve claymation-playful-builder and compile it into CSS variables.
\`\`\`

## Maintenance

Pack JSON and gallery metadata are generated from
[\`scripts/generate-pack-gallery.mjs\`](../scripts/generate-pack-gallery.mjs).
Thumbnail assets are generated separately and committed as optimized WebP
files. The generator has a \`--placeholder-assets\` fallback for local visual
scaffolding, but do not use that flag for the public gallery.

\`\`\`sh
node scripts/generate-pack-gallery.mjs
node scripts/validate-gallery.mjs
\`\`\`
`;
}

function main() {
  mkdirSync(assetsDir, { recursive: true });
  for (const entry of packs) {
    writeFileSync(join(packsDir, `${entry.id}.mosvera.json`), json(pack(entry)));
  }
  const gallery = {
    version: "0.1.0",
    default: "mosvera-public",
    count: packs.length,
    aesthetics: packs.map(galleryEntry),
  };
  writeFileSync(join(packsDir, "gallery.json"), json(gallery));
  writeFileSync(join(packsDir, "README.md"), readme());

  if (generatePlaceholderAssets) {
    for (const [index, entry] of packs.entries()) {
      const svgPath = join(tmpdir(), `mosvera-${entry.id}.svg`);
      const webpPath = join(assetsDir, `hero-${entry.id}.webp`);
      writeFileSync(svgPath, svg(entry, index));
      execFileSync("convert", [svgPath, "-quality", "88", webpPath], { stdio: "inherit" });
      rmSync(svgPath, { force: true });
    }
  }

  console.log(`Generated ${packs.length} Mosvera aesthetic pack documents`);
}

main();
