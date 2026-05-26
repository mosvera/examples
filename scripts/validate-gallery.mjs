// SPDX-License-Identifier: Apache-2.0

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const providers = ["openai", "flux", "sdxl"];

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

console.log("Mosvera gallery validation passed");
