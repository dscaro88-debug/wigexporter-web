import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = 'https://wigexporter.com';
const today = new Date().toISOString().slice(0, 10);

const files = fs.readdirSync(root)
  .filter((file) => file.endsWith('.html') && !file.startsWith('.'))
  .sort();

const HIGH = new Set([
  'index.html',
  'products.html',
  'human-hair-extensions.html',
  'human-hair-wigs-toppers.html',
  'synthetic-wigs-hairpieces.html',
  'salon-supplies.html'
]);

function priority(file) {
  if (file === 'index.html') return '1.0';
  if (HIGH.has(file)) return '0.8';
  if (
    file.endsWith('-human-hair-extensions.html') ||
    /^lace-wig-\d+\.html$/.test(file) ||
    /^human-hair-topper-\d+\.html$/.test(file) ||
    file.startsWith('synthetic-')
  ) return '0.8';
  if (['blog.html', 'tape-hair-vs-k-tip-vs-weft.html', 'how-to-evaluate-wholesale-wig-sample.html', 'build-repeatable-hair-colour-system.html'].includes(file)) return '0.7';
  if (['about.html', 'contact.html', 'trade-account.html', 'free-color-kits.html', 'sample.html', 'customization.html', 'hair-colour-chart-custom-packaging.html'].includes(file)) return '0.6';
  return '0.5';
}

const urls = files.map((file) => {
  const loc = file === 'index.html' ? `${base}/` : `${base}/${file}`;
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority(file)}</priority>\n  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log(`Generated sitemap.xml with ${files.length} URLs.`);
