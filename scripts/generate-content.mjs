import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localeIdx = process.argv.indexOf('--locale');
const lang = localeIdx !== -1 ? process.argv[localeIdx + 1] : null;
const contentDir = lang ? path.join(root, 'content', lang) : path.join(root, 'content');
let data;
try {
  data = JSON.parse(fs.readFileSync(path.join(contentDir, 'site-content.json'), 'utf8'));
} catch {
  data = JSON.parse(fs.readFileSync(path.join(root, 'content', 'site-content.json'), 'utf8'));
}
let productCatalog;
try {
  productCatalog = JSON.parse(fs.readFileSync(path.join(contentDir, 'product-catalog.json'), 'utf8'));
} catch {
  productCatalog = JSON.parse(fs.readFileSync(path.join(root, 'content', 'product-catalog.json'), 'utf8'));
}
const LANGS = ['en', 'es', 'de', 'fr'];
const OG_LOCALE = { en: 'en_GB', es: 'es_ES', de: 'de_DE', fr: 'fr_FR' };
const outDir = lang ? path.join(root, lang) : root;
function hreflangBlock(slug) {
  const links = LANGS.map((l) => {
    const href = l === 'en' ? `https://wigexporter.com/${slug}.html` : `https://wigexporter.com/${l}/${slug}.html`;
    return `  <link rel="alternate" hreflang="${l}" href="${href}">`;
  }).join('\n');
  return links + `\n  <link rel="alternate" hreflang="x-default" href="https://wigexporter.com/${slug}.html">`;
}
const LANG_LABELS = { en: 'EN', es: 'ES', de: 'DE', fr: 'FR' };
function langSwitch(pageFile, currentLang) {
  const file = `${pageFile}.html`;
  const links = LANGS.map((l) => {
    const href = l === 'en' ? `/${file}` : `/${l}/${file}`;
    const current = l === currentLang ? ' aria-current="true"' : '';
    return `<a href="${href}"${current}>${LANG_LABELS[l]}</a>`;
  }).join('');
  return `<div class="lang-switch" role="navigation" aria-label="Language / Idioma / Sprache / Langue">${links}</div>`;
}
const LANG_SWITCH_STYLE = `<style>.lang-switch{display:flex;align-items:center;gap:.3rem;margin-left:1rem;font:600 10px/1 var(--sans);letter-spacing:.08em}.lang-switch a{display:inline-flex;align-items:center;justify-content:center;min-width:26px;height:24px;padding:0 .4rem;border:1px solid rgba(17,17,17,.25);border-radius:999px;color:#171513;text-decoration:none}.lang-switch a:hover{border-color:#171513;background:rgba(17,17,17,.05)}.lang-switch a[aria-current="true"]{background:#171513;color:#fff;border-color:#171513}@media(max-width:1100px){.lang-switch{margin:0}.lang-switch a{min-width:22px;height:20px;font-size:9px}}</style>`;
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');
const VERSION = '20260726-9';
const slugify = (value) => String(value).toLowerCase().replaceAll('&', 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function productScope(item) {
  const catalogGroupSlugs = new Set(catalogProductsFor(item).map((product) => slugify(product.category)));
  const scopeId = (label) => {
    const slug = slugify(label);
    return catalogGroupSlugs.has(slug) ? `scope-${slug}` : slug;
  };
  if (item.productGroups?.length) {
    return `<div class="scope-groups">${item.productGroups.map((group) => `<section id="${scopeId(group.title)}"><h3>${esc(group.title)}</h3><ul>${group.items.map((product) => `<li id="${scopeId(product)}">${esc(product)}</li>`).join('')}</ul></section>`).join('')}</div>`;
  }
  return `<ul class="scope-list">${item.products.map((product) => `<li id="${scopeId(product)}">${esc(product)}</li>`).join('')}</ul>`;
}

function firstApprovedImage(product) {
  if (product.thumbnail) return product.thumbnail;
  const folder = path.join(root, product.assetFolder);
  if (!fs.existsSync(folder)) return null;
  const file = fs.readdirSync(folder)
    .filter((name) => /\.(avif|jpe?g|png|webp)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))[0];
  return file ? `${product.assetFolder}/${file}` : null;
}

function catalogProductsFor(item) {
  const rules = {
    'human-hair-extensions': (product) => product.group === 'Human Hair Extensions',
    'human-hair-wigs-toppers': (product) => product.group === 'Human Hair Wigs & Toppers',
    'synthetic-wigs-hairpieces': (product) => product.section === 'Synthetic Hair',
    'salon-supplies': (product) => product.section === 'Salon Supplies'
  };
  const matches = rules[item.slug];
  if (!matches) return [];
  return productCatalog.products
    .filter((product) => matches(product) && product.approvedImageCount > 0)
    .map((product) => ({ ...product, image: firstApprovedImage(product) }))
    .filter((product) => product.image);
}

function catalogProductCard(product) {
  const productPages = {
    'DS-EXT-CI': 'clip-in-human-hair-extensions.html',
    'DS-EXT-TI': 'tape-in-human-hair-extensions.html',
    'DS-EXT-KT': 'k-tip-human-hair-extensions.html',
    'DS-EXT-GW': 'genius-weft-human-hair-extensions.html',
    'DS-EXT-MW': 'machine-weft-human-hair-extensions.html',
    'DS-EXT-NH': 'nano-ring-human-hair-extensions.html',
    'DS-HPC-SY-001': 'synthetic-clip-in-chignon-hairpiece.html',
    'DS-HPC-SY-002': 'synthetic-22-inch-straight-clip-in-hairpiece.html',
    'DS-HPC-SY-003': 'synthetic-21-inch-soft-curls-claw-clip-ponytail.html',
    'DS-HPC-SY-004': 'synthetic-21-inch-straight-claw-clip-ponytail.html',
    'DS-HPC-SY-005': 'synthetic-26-inch-elastic-band-braiding-ponytail.html',
    'DS-HPC-SY-006': 'synthetic-12-inch-coily-drawstring-ponytail.html',
    'DS-HPC-SY-007': 'synthetic-elastic-band-hair-bun-scrunchie.html',
    'DS-HPC-SY-008': 'synthetic-25-inch-straight-wrap-around-ponytail.html',
    'DS-TOP-SY-CI-001': 'synthetic-layered-clip-in-crown-topper.html',
    'DS-TOP-SY-CI-002': 'synthetic-beach-wave-clip-in-crown-topper.html',
    'DS-B-001': 'synthetic-clip-in-bangs-fringe.html',
    'DS-WIG-LW-001': 'lace-wig-201.html',
    'DS-WIG-LW-002': 'lace-wig-202.html',
    'DS-WIG-LW-003': 'lace-wig-203.html',
    'DS-WIG-LW-004': 'lace-wig-204.html',
    'DS-TOP-HH-001': 'human-hair-topper-01.html',
    'DS-TOP-HH-002': 'human-hair-topper-02.html',
    'DS-TOP-HH-003': 'human-hair-topper-03.html',
    'DS-TOP-HH-004': 'human-hair-topper-04.html',
    'DS-TOP-HH-005': 'human-hair-topper-05.html',
    'DS-TOP-HH-006': 'human-hair-topper-06.html',
    'DS-TOP-HH-007': 'human-hair-topper-07.html',
    'DS-TOP-HH-008': 'human-hair-topper-08.html',
    'DS-TOP-HH-009': 'human-hair-topper-09.html',
    'DS-TOP-HH-010': 'human-hair-topper-10.html',
    'DS-TOP-HH-011': 'human-hair-topper-11.html',
    'DS-TOP-HH-012': 'human-hair-topper-12.html',
    'DS-TOP-HH-013': 'human-hair-topper-13.html',
    'DSW-2501': 'synthetic-wig-dsw-2501.html',
    'DSW-2502': 'synthetic-wig-dsw-2502.html',
    'DSW-2503': 'synthetic-wig-dsw-2503.html',
    'DSW-2504': 'synthetic-wig-dsw-2504.html',
    'DSW-2505': 'synthetic-wig-dsw-2505.html',
    'DSW-2506': 'synthetic-wig-dsw-2506.html',
    'DSW-2507': 'synthetic-wig-dsw-2507.html',
    'DSW-2508': 'synthetic-wig-dsw-2508.html',
    'DSW-2509': 'synthetic-wig-dsw-2509.html',
    'DSW-2510': 'synthetic-wig-dsw-2510.html',
    'DSW-2511': 'synthetic-wig-dsw-2511.html',
    'DSW-2512': 'synthetic-wig-dsw-2512.html',
    'DSW-2513': 'synthetic-wig-dsw-2513.html',
    'DSW-2514': 'synthetic-wig-dsw-2514.html',
    'DSW-2515': 'synthetic-wig-dsw-2515.html',
    'DSW-2516': 'synthetic-wig-dsw-2516.html',
    'DSW-2517': 'synthetic-wig-dsw-2517.html',
    'DSW-2518': 'synthetic-wig-dsw-2518.html',
    'DSW-2519': 'synthetic-wig-dsw-2519.html',
    'DSW-2520': 'synthetic-wig-dsw-2520.html',
    'DSW-2521': 'synthetic-wig-dsw-2521.html',
    'DSW-2522': 'synthetic-wig-dsw-2522.html',
    'DSW-2523': 'synthetic-wig-dsw-2523.html',
  };
  const productPage = productPages[product.code] || `contact.html?product=${encodeURIComponent(product.code)}`;
  const action = productPages[product.code] ? 'VIEW PRODUCT REFERENCE' : 'REQUEST VERIFIED SPECIFICATION';
  const status = product.imageStatus === 'limited' ? 'LIMITED IMAGE REFERENCE' : `${product.approvedImageCount} APPROVED IMAGES`;
  return `<a class="catalog-product-card" href="${productPage}"><img src="${product.image}" alt="${esc(product.name)} product reference" decoding="async" loading="lazy"><div><span>${esc(product.code)}</span><h4>${esc(product.name)}</h4><p>${esc(status)} · B2B ENQUIRY</p><strong>${action} →</strong></div></a>`;
}

function catalogGroupCard(group, products) {
  const groupProducts = products.filter((product) => product.category === group);
  return `<article class="catalog-method-card" aria-labelledby="${slugify(group)}"><div class="catalog-group-heading"><h3 id="${slugify(group)}">${esc(group)}</h3><span>${groupProducts.length} reference${groupProducts.length === 1 ? '' : 's'}</span></div><div class="catalog-product-grid">${groupProducts.map(catalogProductCard).join('')}</div></article>`;
}

function catalogSection(item) {
  const products = catalogProductsFor(item);
  if (!products.length) return '';
  const groups = [...new Set(products.map((product) => product.category))];
  const isMethodGrid = groups.length > 1 && groups.every((group) => products.filter((product) => product.category === group).length === 1);
  return `<section class="catalog-products${isMethodGrid ? ' catalog-products--method-grid' : ''}">
    <div class="section-heading"><div><p class="eyebrow">SELECTED PRODUCT REFERENCES</p><h2>Review products with approved local imagery.</h2></div><p>Images have passed visual review. Product specifications, availability, MOQ, price and lead time remain subject to written confirmation.</p></div>
    ${isMethodGrid ? `<div class="catalog-method-grid">${groups.map((group) => catalogGroupCard(group, products)).join('')}</div>` : groups.map((group) => `<section class="catalog-group" aria-labelledby="${slugify(group)}"><div class="catalog-group-heading"><h3 id="${slugify(group)}">${esc(group)}</h3><span>${products.filter((product) => product.category === group).length} references</span></div><div class="catalog-product-grid">${products.filter((product) => product.category === group).map(catalogProductCard).join('')}</div></section>`).join('')}
  </section>`;
}

function breadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

function head({ title, description, slug, type = 'website', image }) {
  const url = `https://wigexporter.com/${slug}.html`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="DS HAIR | WigExporter">
  <meta property="og:locale" content="en_GB">
  <meta property="og:image" content="https://wigexporter.com/${image}">
  <meta property="og:image:alt" content="${esc(title)} – DS HAIR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="https://wigexporter.com/${image}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css?v=${VERSION}">
  <link rel="stylesheet" href="content.css?v=${VERSION}">
</head>`;
}

function shell(main, schemas = []) {
  return `<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="notice">B2B wholesale · Samples · OEM & private label <a href="contact.html">Discuss your requirement →</a></div>
  <header class="site-header"><button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span></button><nav id="primary-nav" class="primary-nav" aria-label="Primary navigation"></nav><a class="wordmark" href="index.html" aria-label="DS HAIR home"><strong>DS HAIR</strong><span>WIGEXPORTER · GLOBAL B2B</span></a><div class="header-tools"><a class="trade-link" href="trade-account.html">TRADE ACCOUNT</a><a class="quote-link" href="contact.html">REQUEST QUOTE</a></div></header>
  ${main}
  <footer class="site-footer"></footer>
  ${schemas.map((schema) => `<script type="application/ld+json">${json(schema)}</script>`).join('\n  ')}
  <script src="script.js?v=${VERSION}"></script>
</body>
</html>`;
}

for (const item of data.collections) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: item.faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }))
  };
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: item.title,
    provider: { '@type': 'Organization', name: 'DS HAIR', alternateName: 'WigExporter', url: 'https://wigexporter.com/' },
    areaServed: 'Worldwide',
    audience: { '@type': 'BusinessAudience', audienceType: 'Hair brands, distributors, salons and professional buyers' },
    description: item.description
  };
  const main = `<main id="main">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>›</span><a href="products.html">Collections</a><span>›</span><span>${esc(item.title)}</span></nav>
    <section class="collection-hero"><div><p class="eyebrow">${esc(item.division)} · B2B WHOLESALE</p><h1>${esc(item.title)}</h1><p>${esc(item.intro)}</p><div class="button-row"><a class="button button-dark" href="contact.html">REQUEST A SPECIFICATION</a><a class="button button-light" href="sample.html">DISCUSS SAMPLES</a></div></div><img src="${item.image}" alt="${esc(item.imageAlt)}"></section>
    <section class="answer-block"><p class="eyebrow">AT A GLANCE</p><h2>What can professional buyers source?</h2>${productScope(item)}</section>
    ${catalogSection(item)}
    ${!catalogProductsFor(item).length && item.featuredProducts?.length ? `<section class="featured-products"><div class="section-heading"><div><p class="eyebrow">PRODUCT REFERENCES</p><h2>Review a documented product reference.</h2></div><p>Each page separates confirmed facts from details that still require specification review.</p></div><div class="featured-product-grid">${item.featuredProducts.map((product) => `<a class="featured-product-card" href="${product.slug}.html"><img src="${product.image}" alt="${esc(product.imageAlt)}" decoding="async" loading="lazy"><div><span>${esc(product.code)}</span><h3>${esc(product.title)}</h3><p>${esc(product.summary)}</p><strong>VIEW PRODUCT REFERENCE →</strong></div></a>`).join('')}</div></section>` : ''}
    <section class="content-section"><div class="section-heading"><div><p class="eyebrow">BUYER BRIEF</p><h2>Define the details that control the result.</h2></div><p>Final availability, minimum quantities, price and lead time depend on the confirmed product specification.</p></div><div class="spec-grid">${item.specs.map(([name, text], index) => `<article><span>0${index + 1}</span><h3>${esc(name)}</h3><p>${esc(text)}</p></article>`).join('')}</div></section>
    <section class="process-band"><div><p class="eyebrow">B2B PROCESS</p><h2>From buying requirement to approved reference.</h2></div><ol><li><strong>Share the market brief</strong><span>Buyer, channel, product direction and quantity range.</span></li><li><strong>Clarify the specification</strong><span>Construction, material, colour and presentation.</span></li><li><strong>Review representative samples</strong><span>Record approvals and required corrections.</span></li><li><strong>Confirm commercial terms</strong><span>Quotation, production details and reorder reference.</span></li></ol></section>
    <section class="faq-section"><div><p class="eyebrow">BUYER QUESTIONS</p><h2>Frequently asked questions</h2></div><div class="faq-list">${item.faqs.map(([name, text]) => `<details><summary>${esc(name)}</summary><p>${esc(text)}</p></details>`).join('')}</div></section>
    <section class="final-cta"><p class="eyebrow">START WITH YOUR REQUIREMENT</p><h2>Planning a wholesale or private-label range?</h2><p>Tell us the product, market and expected quantity. We will identify the next information needed for a useful sourcing discussion.</p><a class="button button-light" href="contact.html">SEND YOUR BUYING BRIEF</a></section>
  </main>`;
  const collectionBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: 'https://wigexporter.com/' },
    { name: 'Collections', url: 'https://wigexporter.com/products.html' },
    { name: item.title, url: `https://wigexporter.com/${item.slug}.html` }
  ]);
  let finalHtml = head({ title: item.metaTitle, description: item.description, slug: item.slug, image: item.image }) + shell(main, [serviceSchema, faqSchema, collectionBreadcrumb]);
  if (lang) {
    finalHtml = finalHtml
      .replace('<html lang="en">', `<html lang="${lang}">`)
      .replace('og:locale" content="en_GB"', `og:locale" content="${OG_LOCALE[lang]}"`)
      .replace(new RegExp('https://wigexporter.com/' + item.slug + '.html', 'g'), `https://wigexporter.com/${lang}/${item.slug}.html`)
      .replace(/"styles\.css/g, '"/styles.css')
      .replace(/"content\.css/g, '"/content.css')
      .replace(/"product\.css/g, '"/product.css')
      .replace(/"assets\//g, '"/assets/')
      .replace(/href="(index|products|trade-account|contact|synthetic-wigs-hairpieces)\.html"/g, 'href="/$1.html"')
      .replace('REQUEST QUOTE</a></div></header>', `REQUEST QUOTE</a>${langSwitch(item.slug, lang)}</div></header>`)
      .replace('</head>', hreflangBlock(item.slug) + '\n' + LANG_SWITCH_STYLE + '\n</head>');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${item.slug}.html`), finalHtml);
  } else {
    finalHtml = finalHtml
      .replace('REQUEST QUOTE</a></div></header>', `REQUEST QUOTE</a>${langSwitch(item.slug, 'en')}</div></header>`)
      .replace('</head>', hreflangBlock(item.slug) + '\n' + LANG_SWITCH_STYLE + '\n</head>');
    fs.writeFileSync(path.join(root, `${item.slug}.html`), finalHtml);
  }
}

for (const article of data.articles) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: `https://wigexporter.com/${article.image}`,
    datePublished: '2026-07-18',
    dateModified: '2026-07-18',
    author: { '@type': 'Organization', name: 'DS HAIR', alternateName: 'WigExporter' },
    publisher: { '@type': 'Organization', name: 'DS HAIR', alternateName: 'WigExporter', url: 'https://wigexporter.com/' },
    mainEntityOfPage: `https://wigexporter.com/${article.slug}.html`
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }))
  };
  const main = `<main id="main">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>›</span><a href="blog.html">Blog</a><span>›</span><span>${esc(article.category)}</span></nav>
    <article class="editorial">
      <header class="article-hero"><div><p class="eyebrow">${esc(article.category)} · BUYER GUIDE</p><h1>${esc(article.title)}</h1><p>${esc(article.dek)}</p><span>DS HAIR Editorial Team · Updated 18 July 2026</span></div><img src="${article.image}" alt="${esc(article.imageAlt)}"></header>
      <div class="article-layout"><aside><strong>IN THIS GUIDE</strong>${article.sections.map(([name], index) => `<a href="#section-${index + 1}">${esc(name)}</a>`).join('')}${article.slug === 'build-repeatable-hair-colour-system' ? '<a class="article-cta" href="hair-colour-chart-custom-packaging.html">Browse all 31 DS HAIR colours →</a>' : ''}<a class="article-cta" href="contact.html">Discuss a sourcing requirement →</a></aside><div class="article-body"><p class="article-summary"><strong>Buyer summary:</strong> ${esc(article.description)}</p>${article.sections.map(([name, text], index) => `<section id="section-${index + 1}"><h2>${esc(name)}</h2><p>${esc(text)}</p>${article.slug === 'build-repeatable-hair-colour-system' && index === 1 ? '<p><a href="hair-colour-chart-custom-packaging.html">Explore the 31-shade DS HAIR Colour Chart 2 and physical-reference workflow →</a></p>' : ''}</section>`).join('')}<section><h2>Questions buyers ask</h2><div class="faq-list">${article.faqs.map(([name, text]) => `<details><summary>${esc(name)}</summary><p>${esc(text)}</p></details>`).join('')}</div></section></div></div>
    </article>
    <section class="final-cta"><p class="eyebrow">APPLY THE GUIDE</p><h2>Turn your product idea into a clear buying brief.</h2><p>Share the target market, product direction and quantity range. We will identify what should be clarified before samples or quotation.</p><a class="button button-light" href="contact.html">CONTACT THE SOURCING TEAM</a></section>
  </main>`;
  const articleBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: 'https://wigexporter.com/' },
    { name: 'Blog', url: 'https://wigexporter.com/blog.html' },
    { name: article.category, url: `https://wigexporter.com/${article.slug}.html` }
  ]);
  let finalHtml = head({ title: article.metaTitle, description: article.description, slug: article.slug, type: 'article', image: article.image }) + shell(main, [articleSchema, faqSchema, articleBreadcrumb]);
  if (lang) {
    finalHtml = finalHtml
      .replace('<html lang="en">', `<html lang="${lang}">`)
      .replace('og:locale" content="en_GB"', `og:locale" content="${OG_LOCALE[lang]}"`)
      .replace(new RegExp('https://wigexporter.com/' + article.slug + '.html', 'g'), `https://wigexporter.com/${lang}/${article.slug}.html`)
      .replace(/"styles\.css/g, '"/styles.css')
      .replace(/"content\.css/g, '"/content.css')
      .replace(/"product\.css/g, '"/product.css')
      .replace(/"assets\//g, '"/assets/')
      .replace(/href="(index|products|trade-account|contact|synthetic-wigs-hairpieces)\.html"/g, 'href="/$1.html"')
      .replace('</head>', hreflangBlock(article.slug) + '\n</head>');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${article.slug}.html`), finalHtml);
  } else {
    finalHtml = finalHtml
      .replace('REQUEST QUOTE</a></div></header>', `REQUEST QUOTE</a>${langSwitch(article.slug, 'en')}</div></header>`)
      .replace('</head>', hreflangBlock(article.slug) + '\n' + LANG_SWITCH_STYLE + '\n</head>');
    fs.writeFileSync(path.join(root, `${article.slug}.html`), finalHtml);
  }
}

console.log(`Generated ${data.collections.length} collection pages and ${data.articles.length} buyer guides.`);
