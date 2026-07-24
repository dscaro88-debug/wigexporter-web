import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html')).sort();
const errors = [];
const titles = new Map();
const canonicals = new Map();
const colourChart = JSON.parse(fs.readFileSync(path.join(root, 'content/colors.json'), 'utf8'));
const colours = colourChart.groups.flatMap((group) => group.colours);

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
  if (!title) errors.push(`${file}: missing title`);
  if (!description) errors.push(`${file}: missing meta description`);
  if (!canonical) errors.push(`${file}: missing canonical`);
  if (h1Count !== 1) errors.push(`${file}: expected one H1, found ${h1Count}`);
  if (title) {
    if (titles.has(title)) errors.push(`${file}: duplicate title with ${titles.get(title)}`);
    titles.set(title, file);
  }
  if (canonical) {
    if (canonicals.has(canonical)) errors.push(`${file}: duplicate canonical with ${canonicals.get(canonical)}`);
    canonicals.set(canonical, file);
  }

  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (/^(?:https?:|mailto:|tel:|#)/.test(reference)) continue;
    const local = reference.split(/[?#]/)[0];
    if (!local) continue;
    if (!fs.existsSync(path.resolve(root, local))) errors.push(`${file}: missing local reference ${local}`);
  }
  for (const forbidden of ['DANQI HAIR', 'OEMPrivatelabel.png', 'assets/private-label.png']) {
    if (html.includes(forbidden)) errors.push(`${file}: forbidden client packaging reference ${forbidden}`);
  }
}

if (colours.length !== 31) errors.push(`content/colors.json: expected 31 colours, found ${colours.length}`);
for (const field of ['code', 'name', 'image']) {
  const values = colours.map((colour) => colour[field]);
  if (new Set(values).size !== values.length) errors.push(`content/colors.json: duplicate colour ${field}`);
}
for (const colour of colours) {
  if (!fs.existsSync(path.join(root, colour.image))) errors.push(`content/colors.json: missing image ${colour.image}`);
}

const studioFile = path.join(root, 'hair-colour-chart-custom-packaging.html');
if (!fs.existsSync(studioFile)) {
  errors.push('hair-colour-chart-custom-packaging.html: missing generated studio page');
} else {
  const studioHtml = fs.readFileSync(studioFile, 'utf8');
  const studioCards = (studioHtml.match(/class="studio-colour-card"/g) || []).length;
  if (studioCards !== 31) errors.push(`hair-colour-chart-custom-packaging.html: expected 31 colour cards, found ${studioCards}`);
}

const productsHtml = fs.readFileSync(path.join(root, 'products.html'), 'utf8');
const productCategoryCards = (productsHtml.match(/class="product-card"/g) || []).length;
if (productCategoryCards !== 4) {
  errors.push(`products.html: expected 4 product category cards, found ${productCategoryCards}`);
}
if (!productsHtml.includes('THREE PRODUCT FAMILIES · FOUR CATEGORIES')) {
  errors.push('products.html: missing the three-family / four-category architecture label');
}

const sharedScript = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const collectionsMenu = sharedScript.match(/<div class="mega-menu mega-menu-collections">([\s\S]*?)<a class="mega-all"/)?.[1] || '';
const expectedCategoryLinks = [
  'human-hair-extensions.html',
  'human-hair-wigs-toppers.html',
  'synthetic-wigs-hairpieces.html',
  'salon-supplies.html'
];
for (const categoryLink of expectedCategoryLinks) {
  if (!collectionsMenu.includes(`href="${categoryLink}`)) {
    errors.push(`script.js: Collections menu missing ${categoryLink}`);
  }
}
for (const misplacedEntry of ['genius-weft-human-hair-extensions.html', 'free-color-kits.html', 'sample.html']) {
  if (collectionsMenu.includes(`href="${misplacedEntry}"`)) {
    errors.push(`script.js: Collections menu contains misplaced entry ${misplacedEntry}`);
  }
}

const formCategoryLabels = [
  'Human hair extensions',
  'Human hair wigs & toppers',
  'Synthetic wigs & hairpieces',
  'Salon supplies'
];
for (const [formFile, fieldName] of [['index.html', 'interest'], ['trade-account.html', 'interest'], ['contact.html', 'product']]) {
  const formHtml = fs.readFileSync(path.join(root, formFile), 'utf8');
  const selectHtml = formHtml.match(new RegExp(`<select name="${fieldName}"[^>]*>([\\s\\S]*?)<\\/select>`))?.[1] || '';
  for (const categoryLabel of formCategoryLabels) {
    if (!selectHtml.includes(`<option>${categoryLabel}</option>`)) {
      errors.push(`${formFile}: product category selector missing ${categoryLabel}`);
    }
  }
  if (selectHtml.includes('OEM / private label') || selectHtml.includes('Private label project')) {
    errors.push(`${formFile}: service option is mixed into the product category selector`);
  }
  if (selectHtml.includes('Synthetic toppers')) {
    errors.push(`${formFile}: legacy Synthetic toppers category is still present`);
  }
}

for (const legacyReference of ['synthetic-toppers.html', '>Synthetic Toppers<', '>Tools & Consumables<']) {
  if (productsHtml.includes(legacyReference) || collectionsMenu.includes(legacyReference)) {
    errors.push(`primary taxonomy contains legacy entry ${legacyReference}`);
  }
}

const requiredServices = ['Samples', 'Colour Kits', 'Colour &amp; Packaging Studio', 'OEM / Private Label', 'Custom Packaging', 'Trade Account'];
for (const formFile of ['index.html', 'trade-account.html', 'contact.html']) {
  const formHtml = fs.readFileSync(path.join(root, formFile), 'utf8');
  const serviceSelect = formHtml.match(/<select name="service"[^>]*>([\s\S]*?)<\/select>/)?.[1] || '';
  for (const service of requiredServices) {
    if (!serviceSelect.includes(`<option>${service}</option>`)) errors.push(`${formFile}: Trade Services selector missing ${service}`);
  }
}

for (const [file, anchors] of Object.entries({
  'human-hair-extensions.html': ['clip-in', 'tape-in', 'k-tip', 'genius-weft', 'machine-weft', 'hand-tied-weft'],
  'human-hair-wigs-toppers.html': ['human-hair-wigs', 'lace-wigs', 'human-hair-toppers', 'ponytails'],
  'synthetic-wigs-hairpieces.html': ['synthetic-wigs', 'hairpieces', 'bangs-fringes', 'clip-in-toppers'],
  'salon-supplies.html': ['kits', 'single-products']
})) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  for (const anchor of anchors) if (!html.includes(`id="${anchor}"`)) errors.push(`${file}: missing taxonomy anchor #${anchor}`);
}

const syntheticCollectionHtml = fs.readFileSync(path.join(root, 'synthetic-wigs-hairpieces.html'), 'utf8');
for (const anchor of ['hairpieces', 'clip-in-toppers']) {
  const matches = syntheticCollectionHtml.match(new RegExp(`id="${anchor}"`, 'g')) || [];
  if (matches.length !== 1) errors.push(`synthetic-wigs-hairpieces.html: expected one catalog anchor #${anchor}, found ${matches.length}`);
  if (!syntheticCollectionHtml.includes(`<h3 id="${anchor}">`)) errors.push(`synthetic-wigs-hairpieces.html: #${anchor} must identify its catalog heading`);
  if (!syntheticCollectionHtml.includes(`id="scope-${anchor}"`)) errors.push(`synthetic-wigs-hairpieces.html: missing separate scope anchor #scope-${anchor}`);
}
const navigationScript = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
if (!navigationScript.includes('scrollToHashTarget')) errors.push('script.js: missing post-render hash navigation handler');

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const file of htmlFiles) {
  const url = file === 'index.html' ? 'https://wigexporter.com/' : `https://wigexporter.com/${file}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) errors.push(`sitemap.xml: missing ${url}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${htmlFiles.length} HTML pages: unique titles/canonicals, one H1, local references and sitemap coverage.`);
}
