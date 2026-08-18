import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = 'https://wigexporter.com';
const today = new Date().toISOString().slice(0, 10);
const LANGS = ['en', 'es', 'de', 'fr'];

// Collect every HTML page: root .html files + each locale subdirectory.
const pages = []; // { file, lang, slug }
for (const file of fs.readdirSync(root)) {
  if (file.endsWith('.html') && !file.startsWith('.')) {
    pages.push({ file, lang: 'en', slug: file.replace(/\.html$/, '') });
  }
}
for (const lang of ['es', 'de', 'fr']) {
  const dir = path.join(root, lang);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.html') && !file.startsWith('.')) {
      pages.push({ file, lang, slug: file.replace(/\.html$/, '') });
    }
  }
}

function priority(file) {
  if (file === 'index.html') return '1.0';
  const HIGH = new Set([
    'products.html',
    'human-hair-extensions.html',
    'human-hair-wigs-toppers.html',
    'synthetic-wigs-hairpieces.html',
    'salon-supplies.html'
  ]);
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

const urlFor = (lang, slug) => (lang === 'en' ? `${base}/${slug}.html` : `${base}/${lang}/${slug}.html`);

const urls = pages
  .map(({ file, lang, slug }) => {
    const loc = urlFor(lang, slug);
    const alternates = LANGS
      .filter((l) => pages.some((p) => p.slug === slug && p.lang === l))
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l, slug)}"/>`)
      .join('\n');
    const xdefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor('en', slug)}"/>`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority(file)}</priority>\n${alternates}\n${xdefault}\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log(`Generated sitemap.xml with ${pages.length} URLs.`);
