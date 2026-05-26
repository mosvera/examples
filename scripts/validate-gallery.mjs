// SPDX-License-Identifier: Apache-2.0

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const providers = ["openai", "flux", "sdxl"];
const packCount = 25;
const hex = /^#[0-9a-f]{6}$/;

function pngSize(path) {
  const data = readFileSync(path);
  if (data.toString("ascii", 1, 4) !== "PNG") {
    throw new Error(`${path} is not a PNG`);
  }
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    bytes: data.byteLength,
  };
}

function webpSize(path) {
  const data = readFileSync(path);
  if (data.toString("ascii", 0, 4) !== "RIFF" || data.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error(`${path} is not a WebP`);
  }
  const chunk = data.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return {
      width: data.readUInt16LE(26) & 0x3fff,
      height: data.readUInt16LE(28) & 0x3fff,
      bytes: data.byteLength,
    };
  }
  if (chunk === "VP8L") {
    const b0 = data[21];
    const b1 = data[22];
    const b2 = data[23];
    const b3 = data[24];
    return {
      width: 1 + (((b1 & 0x3f) << 8) | b0),
      height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      bytes: data.byteLength,
    };
  }
  if (chunk === "VP8X") {
    return {
      width: 1 + data.readUIntLE(24, 3),
      height: 1 + data.readUIntLE(27, 3),
      bytes: data.byteLength,
    };
  }
  throw new Error(`${path} has unsupported WebP chunk ${chunk}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
  const dir = join(root, entry.name);
  const metadataPath = join(dir, "generated", "metadata.json");
  if (!existsSync(metadataPath)) continue;
  const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
  for (const provider of providers) {
    const image = metadata[provider]?.image;
    if (image === undefined) throw new Error(`${entry.name}: missing ${provider} image metadata`);
    const imagePath = join(dir, "generated", image.file);
    if (!existsSync(imagePath)) throw new Error(`${entry.name}: missing ${provider} image ${image.file}`);
    const actual = pngSize(imagePath);
    for (const key of ["width", "height", "bytes"]) {
      if (actual[key] !== image[key]) {
        throw new Error(`${entry.name}: ${provider} ${key} metadata ${image[key]} != actual ${actual[key]}`);
      }
    }
  }
}

const packsDir = join(root, "packs");
const galleryPath = join(packsDir, "gallery.json");
assert(existsSync(galleryPath), "missing packs/gallery.json");

const gallery = readJson(galleryPath);
assert(gallery.version === "0.1.0", "gallery version must be 0.1.0");
assert(gallery.default === "quiet-editorial", "gallery default must be quiet-editorial");
assert(gallery.count === packCount, `gallery count must be ${packCount}`);
assert(Array.isArray(gallery.aesthetics), "gallery aesthetics must be an array");
assert(gallery.aesthetics.length === packCount, `gallery must include ${packCount} aesthetics`);

const ids = new Set();
const assets = new Set();
for (const aesthetic of gallery.aesthetics) {
  assert(typeof aesthetic.id === "string" && aesthetic.id.length > 0, "aesthetic missing id");
  assert(!ids.has(aesthetic.id), `duplicate aesthetic id ${aesthetic.id}`);
  ids.add(aesthetic.id);
  assert(typeof aesthetic.label === "string" && aesthetic.label.length > 0, `${aesthetic.id}: missing label`);
  assert(typeof aesthetic.summary === "string" && aesthetic.summary.length > 0, `${aesthetic.id}: missing summary`);
  assert(aesthetic.pack_file === `packs/${aesthetic.id}.mosvera.json`, `${aesthetic.id}: pack_file mismatch`);
  assert(aesthetic.asset_file === `packs/assets/hero-${aesthetic.id}.webp`, `${aesthetic.id}: asset_file mismatch`);
  assert(
    aesthetic.download_url === `https://raw.githubusercontent.com/mosvera/examples/main/packs/${aesthetic.id}.mosvera.json`,
    `${aesthetic.id}: download_url mismatch`,
  );
  assert(
    aesthetic.source_url === `https://github.com/mosvera/examples/blob/main/packs/${aesthetic.id}.mosvera.json`,
    `${aesthetic.id}: source_url mismatch`,
  );
  for (const [name, value] of Object.entries(aesthetic.swatches ?? {})) {
    assert(hex.test(value), `${aesthetic.id}: swatch ${name} is not a lowercase hex color`);
  }

  const assetPath = join(root, aesthetic.asset_file);
  assert(existsSync(assetPath), `${aesthetic.id}: missing asset ${aesthetic.asset_file}`);
  assert(!assets.has(aesthetic.asset_file), `${aesthetic.id}: duplicate asset ${aesthetic.asset_file}`);
  assets.add(aesthetic.asset_file);
  const asset = webpSize(assetPath);
  assert(asset.width === 1280 && asset.height === 853, `${aesthetic.id}: asset must be 1280x853`);
  assert(asset.bytes > 4000, `${aesthetic.id}: asset appears too small to be a real preview`);

  const packPath = join(root, aesthetic.pack_file);
  assert(existsSync(packPath), `${aesthetic.id}: missing pack ${aesthetic.pack_file}`);
  const pack = readJson(packPath);
  assert(pack.kind === "mosvera.aesthetic_pack", `${aesthetic.id}: pack kind mismatch`);
  assert(pack.version === "0.1", `${aesthetic.id}: pack version mismatch`);
  assert(pack.id === aesthetic.id, `${aesthetic.id}: pack id mismatch`);
  assert(pack.entrypoint?.kind === "composition", `${aesthetic.id}: entrypoint kind mismatch`);
  assert(pack.entrypoint?.id === aesthetic.id, `${aesthetic.id}: entrypoint id mismatch`);
  assert(pack.name === aesthetic.label, `${aesthetic.id}: pack name mismatch`);
  assert(pack.description === aesthetic.summary, `${aesthetic.id}: pack description mismatch`);

  const templateId = `${aesthetic.id}-base`;
  const template = pack.documents?.templates?.[templateId];
  const composition = pack.documents?.compositions?.[aesthetic.id];
  assert(template?.id === templateId, `${aesthetic.id}: missing base template`);
  assert(composition?.base === templateId, `${aesthetic.id}: composition does not point at base template`);
  for (const field of ["palette", "typography", "layout", "motion", "imagery", "voice"]) {
    assert(template[field] !== undefined, `${aesthetic.id}: template missing ${field}`);
    assert(aesthetic.canonical?.[field] !== undefined, `${aesthetic.id}: gallery canonical missing ${field}`);
  }
  assert(template.imagery.src === `/assets/aesthetics/hero-${aesthetic.id}.webp`, `${aesthetic.id}: imagery src mismatch`);
  assert(JSON.stringify(aesthetic.composition) === JSON.stringify(composition), `${aesthetic.id}: gallery composition drift`);
}

console.log("Mosvera gallery validation passed");
