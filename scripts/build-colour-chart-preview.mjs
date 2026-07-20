import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chart = JSON.parse(fs.readFileSync(path.join(root, 'content/colors.json'), 'utf8'));
const colours = chart.groups.flatMap((group) => group.colours);
const columns = 8;
const cellWidth = 240;
const imageHeight = 300;
const labelHeight = 68;
const gap = 3;
const rows = Math.ceil(colours.length / columns);
const width = columns * cellWidth + (columns - 1) * gap;
const height = rows * (imageHeight + labelHeight) + (rows - 1) * gap;

const xml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const composites = [];
for (const [index, colour] of colours.entries()) {
  const left = (index % columns) * (cellWidth + gap);
  const top = Math.floor(index / columns) * (imageHeight + labelHeight + gap);
  const image = await sharp(path.join(root, colour.image))
    .resize(cellWidth, imageHeight, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82 })
    .toBuffer();
  const label = Buffer.from(`<svg width="${cellWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <text x="15" y="25" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#171717">${xml(colour.code)}</text>
    <text x="15" y="48" font-family="Arial, sans-serif" font-size="10" fill="#5f5b56">${xml(colour.name.length > 31 ? `${colour.name.slice(0, 29)}…` : colour.name)}</text>
  </svg>`);
  composites.push({ input: image, left, top });
  composites.push({ input: label, left, top: top + imageHeight });
}

await sharp({
  create: {
    width,
    height,
    channels: 3,
    background: '#e5dfd6'
  }
})
  .composite(composites)
  .jpeg({ quality: 84, progressive: true })
  .toFile(path.join(root, 'assets/colour-chart.jpg'));

console.log(`Built Colour Chart 2 preview with ${colours.length} shades.`);
