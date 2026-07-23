#!/usr/bin/env node

import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(import.meta.dirname, "..");
const workspaceRoot = path.resolve(projectRoot, "..", "..");
const sourceRoot = path.join(workspaceRoot, "04-产品开发");
const productRoot = path.join(projectRoot, "assets", "products");

const normalise = (value) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/gi, "")
    .toUpperCase();

async function findDirectory(parent, expectedName) {
  const entries = await readdir(parent, { withFileTypes: true });
  const expected = normalise(expectedName);
  const match = entries.find(
    (entry) => entry.isDirectory() && normalise(entry.name) === expected,
  );
  if (!match) {
    throw new Error(`Missing source directory: ${parent}/${expectedName}`);
  }
  return path.join(parent, match.name);
}

async function copyNamedFiles(sourceDir, destinationDir, code, fileNames) {
  await mkdir(destinationDir, { recursive: true });
  for (const [index, fileName] of fileNames.entries()) {
    const extension = path.extname(fileName).toLowerCase().replace(".jpeg", ".jpg");
    const outputName = `${code.toLowerCase()}-${String(index + 1).padStart(2, "0")}${extension}`;
    await copyFile(path.join(sourceDir, fileName), path.join(destinationDir, outputName));
  }
}

async function copyMatchingFiles(
  sourceDir,
  destinationDir,
  code,
  predicate,
  limit,
) {
  const entries = (await readdir(sourceDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && predicate(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .slice(0, limit);
  await copyNamedFiles(sourceDir, destinationDir, code, entries);
}

async function ensureTaxonomyFolders() {
  const folders = [
    "human-hair-extensions/ds-ext-ci-clip-in",
    "human-hair-extensions/ds-ext-ti-tape-in",
    "human-hair-extensions/ds-ext-kt-k-tip",
    "human-hair-extensions/ds-ext-gw-genius-weft",
    "human-hair-extensions/ds-ext-mw-machine-weft",
    "human-hair-extensions/ds-ext-htw-hand-tied-weft",
    "human-hair-wigs-toppers/human-hair-wigs",
    "human-hair-wigs-toppers/lace-wigs",
    "human-hair-wigs-toppers/human-hair-toppers",
    "human-hair-wigs-toppers/ponytails",
    "synthetic-wigs-hairpieces/synthetic-wigs",
    "synthetic-wigs-hairpieces/hairpieces",
    "synthetic-wigs-hairpieces/bangs-fringes",
    "synthetic-wigs-hairpieces/clip-in-toppers",
    "salon-supplies/single-products",
    "salon-supplies/kits",
    "_review/material-to-confirm",
  ];
  await Promise.all(
    folders.map((folder) => mkdir(path.join(productRoot, folder), { recursive: true })),
  );
}

async function organiseExtensions() {
  await copyNamedFiles(
    path.join(sourceRoot, "Genius Weft"),
    path.join(productRoot, "human-hair-extensions", "ds-ext-gw-genius-weft"),
    "DS-EXT-GW",
    ["1.JPEG", "2.JPEG", "3.JPEG", "4.JPEG"],
  );
  await copyNamedFiles(
    path.join(sourceRoot, "TAPE IN"),
    path.join(productRoot, "human-hair-extensions", "ds-ext-ti-tape-in"),
    "DS-EXT-TI",
    ["12.jpg"],
  );
  await copyNamedFiles(
    path.join(sourceRoot, "K tips"),
    path.join(productRoot, "human-hair-extensions", "ds-ext-kt-k-tip"),
    "DS-EXT-KT",
    ["3.jpg"],
  );
}

async function organiseToppers() {
  const topperRoot = path.join(sourceRoot, "DS-HAIR-TOP");
  const plans = [
    ["TOP01", "DS-TOP-HH-001", 5, (name) => /^TOP-01-[23457]\.jpg$/i.test(name)],
    ["TOP-02", "DS-TOP-HH-002", 5, (name) => /^DM.*\.jpg$/i.test(name)],
    ["TOP-03", "DS-TOP-HH-003", 5, (name) => /^DM.*\.jpg$/i.test(name)],
    ["TOP-04", "DS-TOP-HH-004", 6, (name) => /^DM.*\.jpg$/i.test(name)],
    ["TOP-05", "DS-TOP-HH-005", 6, (name) => /^DM.*\.jpg$/i.test(name)],
    ["TOP-06", "DS-TOP-HH-006", 6, (name) => /^DM.*\.jpg$/i.test(name)],
    ["TOP-07", "DS-TOP-HH-007", 6, (name) => /^DM.*\.jpg$/i.test(name)],
    ["TOP-08", "DS-TOP-HH-008", 6, (name) => /^DM.*\.jpg$/i.test(name)],
    ["TOP-09", "DS-TOP-HH-009", 6, (name) => /^DM.*\.jpg$/i.test(name)],
    ["TOP-10", "DS-TOP-HH-010", 6, (name) => /^DM.*\.jpg$/i.test(name)],
    ["TOP-11", "DS-TOP-HH-011", 6, (name) => /^DM.*\.jpg$/i.test(name)],
    ["TOP-12", "DS-TOP-HH-012", 4, (name) => /^DM.*\.jpg$/i.test(name)],
  ];

  for (const [sourceName, code, limit, predicate] of plans) {
    const sourceDir = await findDirectory(topperRoot, sourceName);
    await copyMatchingFiles(
      sourceDir,
      path.join(
        productRoot,
        "human-hair-wigs-toppers",
        "human-hair-toppers",
        code.toLowerCase(),
      ),
      code,
      predicate,
      limit,
    );
  }
}

async function organiseWigs() {
  const wigRoot = path.join(sourceRoot, "DS-HAIR-WIG", "CHEMO & SOFT WIG ");
  const models = ["WIG-201", "WIG-202", "WIG-203", "WIG-204"];
  for (const [index, model] of models.entries()) {
    const code = `DS-WIG-LW-${String(index + 1).padStart(3, "0")}`;
    await copyMatchingFiles(
      path.join(wigRoot, model),
      path.join(
        productRoot,
        "human-hair-wigs-toppers",
        "lace-wigs",
        code.toLowerCase(),
      ),
      code,
      (name) => /^DM.*\.jpg$/i.test(name),
      6,
    );
  }
}

async function organisePonytailReview() {
  await copyMatchingFiles(
    path.join(sourceRoot, "Ponytail", "DSP-01"),
    path.join(productRoot, "_review", "material-to-confirm", "ds-pon-001"),
    "DS-PON-001",
    (name) => /\.(jpg|webp)$/i.test(name) && !/^27-60---Sample/i.test(name),
    3,
  );
}

async function organiseSalonSupplies() {
  const salonRoot = path.join(sourceRoot, "salon supplies");
  const singlesRoot = path.join(productRoot, "salon-supplies", "single-products");
  const singles = [
    ["01-nano-rings-silicone", "DS-SAL-S-001", /^(SKU_0[1-7]|主图_01)/i, 7],
    ["02-nano-copper rings-non-silicone", "DS-SAL-S-002", /^SKU_0[1-8]/i, 8],
    ["03-tape-tabs", "DS-SAL-S-003", /^主图_01\.jpg$/i, 1],
    ["04-sectioning-clips", "DS-SAL-S-004", /^主图_0[1-5]\.jpg$/i, 5],
    ["05-keratin-glue-sticks", "DS-SAL-S-005", /^主图_0[1-4]\.jpg$/i, 4],
    ["06-heat-protection-pad", "DS-SAL-S-006", /^(SKU_02|详情_0[23])/i, 3],
    ["07-threading-tool", "DS-SAL-S-007", /^主图_(01|03|05|06|10)\.jpg$/i, 5],
    ["08-tint-brush", "DS-SAL-S-008", /^主图_(03|04|06)\.jpg$/i, 3],
  ];

  for (const [sourceName, code, predicate, limit] of singles) {
    await copyMatchingFiles(
      path.join(salonRoot, sourceName),
      path.join(singlesRoot, code.toLowerCase()),
      code,
      (name) => predicate.test(name),
      limit,
    );
  }

  const kitsRoot = path.join(productRoot, "salon-supplies", "kits");
  const kits = [
    ["09-starter-kit", "DS-SAL-K-001"],
    ["10-monthly-restock", "DS-SAL-K-002"],
    ["11-nano-newbie", "DS-SAL-K-003"],
    ["12-dual-method", "DS-SAL-K-004"],
    ["13-pro-upgrade", "DS-SAL-K-005"],
  ];
  for (const [sourceName, code] of kits) {
    await copyNamedFiles(
      path.join(salonRoot, sourceName),
      path.join(kitsRoot, code.toLowerCase()),
      code,
      ["bundle_clean.png"],
    );
  }
}

await ensureTaxonomyFolders();
await organiseExtensions();
await organiseToppers();
await organiseWigs();
await organisePonytailReview();
await organiseSalonSupplies();

console.log(`Organised approved product assets under ${productRoot}`);
