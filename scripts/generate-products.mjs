import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const products = JSON.parse(fs.readFileSync(path.join(root, 'content/products.json'), 'utf8'));
const colourCharts = JSON.parse(fs.readFileSync(path.join(root, 'content/colors.json'), 'utf8'));
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');
const chartFor = (id) => colourCharts.id === id ? colourCharts : null;

function optionStatus(status) {
  return status === 'reference' ? 'REFERENCE SHOWN' : 'REQUEST TO CONFIRM';
}

function productVisual(product) {
  if (!product.images.length) return '';
  return `<div class="product-gallery${product.images.length === 1 ? ' is-single' : ''}">
    ${product.images.map((image, index) => `<figure class="${index === 0 ? 'product-gallery-main' : ''}"><img${image.fit === 'contain' ? ' class="is-contain"' : ''} src="${image.src}" alt="${esc(image.alt)}"${index > 0 ? ' loading="lazy"' : ''}>${index === 0 && product.imageStatusNote ? `<figcaption>${esc(product.imageStatusNote)}</figcaption>` : ''}</figure>`).join('')}
  </div>`;
}

function whatsappLink(number, message) {
  const clean = String(number).replace(/\D/g, '');
  if (!clean) return null;
  return `https://wa.me/${clean}?text=${encodeURIComponent(message || '')}`;
}

function conversionModule(product) {
  const defaults = {
    tradeCard: {
      title: 'Trade Pricing & Samples',
      subtitle: 'Wholesale pricing and sample support for registered trade partners',
      primaryCta: 'Apply for Trade Account',
      primaryHref: 'trade-account.html',
      secondaryCta: 'Enquire via WhatsApp',
      whatsappNumber: '8613516946001',
      whatsappMessage: `Hi DS HAIR, I'm interested in wholesale ${product.title}. Please send trade pricing and sample information.`
    },
    trustBadges: [
      { label: 'MOQ & Samples', sublabel: 'Negotiable' },
      { label: 'Private Label', sublabel: 'OEM packaging' },
      { label: 'Global Shipping', sublabel: '3–5 days express' },
      { label: '19 Years', sublabel: 'Industry experience' }
    ],
    serviceBar: [
      { label: 'Quality Guarantee', sublabel: 'Sample approval before production' },
      { label: 'Reorder Support', sublabel: 'Return to approved specification' },
      { label: 'Colour Matching', sublabel: 'Physical references available' },
      { label: 'Flexible Lead Times', sublabel: 'Express or scheduled' }
    ]
  };
  const c = { ...defaults, ...product.conversion };
  c.tradeCard = { ...defaults.tradeCard, ...c.tradeCard };
  const wa = whatsappLink(c.tradeCard.whatsappNumber, c.tradeCard.whatsappMessage);
  return {
    tradeCard: `<div class="trade-card"><div class="trade-card-title"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M20.2 9.6c.1 1.5-.4 3-1.4 4.2l-6.8 7.8-6.8-7.8c-1-1.2-1.5-2.7-1.4-4.2.2-2.8 2.5-5.1 5.3-5.3 1.5-.1 3 .4 4.2 1.4l.7.6.7-.6c1.2-1 2.7-1.5 4.2-1.4 2.8.2 5.1 2.5 5.3 5.3Z"/></svg><div><strong>${esc(c.tradeCard.title)}</strong><span>${esc(c.tradeCard.subtitle)}</span></div></div><div class="trade-card-actions"><a class="button button-dark" href="${esc(c.tradeCard.primaryHref)}">${esc(c.tradeCard.primaryCta)}</a>${wa ? `<a class="button button-whatsapp" href="${esc(wa)}" target="_blank" rel="noopener">${esc(c.tradeCard.secondaryCta)}</a>` : ''}</div></div>`,
    trustBadges: `<ul class="product-trust-badges">${c.trustBadges.map((badge) => `<li><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><span><strong>${esc(badge.label)}</strong>${esc(badge.sublabel)}</span></li>`).join('')}</ul>`,
    serviceBar: `<section class="product-service-bar" aria-label="Trade services">${c.serviceBar.map((item) => `<div><strong>${esc(item.label)}</strong><span>${esc(item.sublabel)}</span></div>`).join('')}</section>`
  };
}

function productTypeChooser(product) {
  if (!product.productTypes) return '';
  return `<section class="clip-type-section">
    <div class="product-section-heading"><p class="eyebrow">CLIP-IN RANGE BY MARKET TIER</p><h2>Three demand tiers. Three different volume and margin profiles.</h2><p>Build a clip-in programme around what actually sells: proven full-set classics, fast-rising seamless constructions, and low-competition halo-wire pieces. Each tier uses the same 100% Remy human hair base; the difference is construction, wearer profile and specification.</p></div>
    <div class="clip-type-grid is-three-tiers">${product.productTypes.map((item) => `<article class="clip-type-card has-image"><figure><img src="${item.image}" alt="${esc(item.imageAlt)}" loading="lazy"></figure><div><span>${esc(item.tier)}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p><dl><div><dt>Includes</dt><dd>${esc(item.includes)}</dd></div><div><dt>Typical spec</dt><dd>${esc(item.typicalSpec)}</dd></div><div><dt>${item.guidanceLabel || 'Weight guidance'}</dt><dd>${esc(item.guidance)}</dd></div><div><dt>Why stock it</dt><dd>${esc(item.whyStock)}</dd></div></dl><a href="#build-your-brief">BUILD THIS PRODUCT →</a></div></article>`).join('')}</div>
  </section>`;
}

function setMapSection(product) {
  if (!product.setMaps) return '';
  return `<section class="set-map-section"><div class="product-section-heading"><p class="eyebrow">VERIFIED SET MAPS</p><h2>Know exactly what is inside each full set.</h2><p>These piece maps come from the existing DS HAIR product record. Final grams, construction, length and colour are confirmed with the selected sample.</p></div><div class="set-map-grid">${product.setMaps.map((set) => `<article><div><span>${esc(set.title)}</span><p>${esc(set.summary)}</p></div><table><thead><tr><th>Quantity</th><th>Weft width</th><th>Clip layout</th></tr></thead><tbody>${set.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></article>`).join('')}</div></section>`;
}

function configurationBuilder(product) {
  const chart = chartFor(product.colourChart);
  const productIdentity = product.code || product.title;
  return `<section class="spec-builder" id="build-your-brief" data-spec-builder data-product-code="${esc(productIdentity)}">
    <div class="spec-builder-heading"><div><p class="eyebrow">BUILD YOUR BUYING BRIEF</p><h2>Select the specification you want us to review.</h2></div><p>These controls prepare an enquiry; they do not indicate live stock. Final feasibility, MOQ, price and lead time are confirmed in writing.</p></div>
    <div class="spec-builder-layout">
      <div class="spec-fields">
        ${product.configuration.map((group) => `<fieldset class="spec-field" data-spec-field="${esc(group.key)}"><legend>${esc(group.label)}</legend><div class="spec-options">${group.options.map((option) => `<button class="spec-option${option.status === 'reference' ? ' is-selected' : ''}" type="button" data-value="${esc(option.value)}" data-status="${esc(option.status)}" aria-pressed="${option.status === 'reference' ? 'true' : 'false'}"><span>${esc(option.value)}</span><small>${optionStatus(option.status)}</small></button>`).join('')}</div><p>${esc(group.note)}</p></fieldset>`).join('')}
      </div>
      <aside class="spec-summary" aria-live="polite">
        <p class="eyebrow">YOUR REQUESTED SPECIFICATION</p>
        <h3>${esc(product.referenceLabel || product.title)}</h3>
        <dl>${product.configuration.map((group) => `<div><dt>${esc(group.label)}</dt><dd data-summary="${esc(group.key)}">${esc(group.options.find((option) => option.status === 'reference')?.value || 'Select an option')}</dd></div>`).join('')}<div><dt>Colour</dt><dd data-summary="colour">Select a Colour Chart 2 shade</dd></div></dl>
        <p class="spec-summary-status">Reference selections are photographed or documented. Other selections remain requests until confirmed.</p>
        <a class="button button-dark" data-spec-enquiry href="contact.html?product=${encodeURIComponent(productIdentity)}">SEND THIS SPECIFICATION</a>
      </aside>
    </div>
    ${chart ? `<div class="colour-chart" data-colour-chart>
      <div class="colour-chart-heading"><div><p class="eyebrow">PRIMARY COLOUR SYSTEM</p><h2>${esc(chart.name)}</h2></div><div><p>${esc(chart.notice)}</p><a href="free-color-kits.html">REQUEST A PHYSICAL COLOUR KIT →</a></div></div>
      <div class="colour-filters" aria-label="Colour families"><button class="is-active" type="button" data-colour-filter="all" aria-pressed="true">All 31</button>${chart.groups.map((group) => `<button type="button" data-colour-filter="${esc(group.name)}" aria-pressed="false">${esc(group.name)}</button>`).join('')}</div>
      <div class="colour-grid">${chart.groups.flatMap((group) => group.colours.map((colour) => `<button class="colour-card" type="button" data-colour-group="${esc(group.name)}" data-colour-code="${esc(colour.code)}" data-colour-name="${esc(colour.name)}" aria-pressed="false"><img src="${colour.image}" alt="" loading="lazy"><span><strong>${esc(colour.code)}</strong>${esc(colour.name)}</span></button>`)).join('')}</div>
    </div>` : ''}
  </section>`;
}

function comparisonTable(product) {
  const comparison = product.methodComparison;
  return `<section class="method-comparison"><div class="product-section-heading"><p class="eyebrow">${esc(comparison.eyebrow || 'SIMILAR PRODUCT COMPARISON')}</p><h2>${esc(comparison.title || 'Choose the method by the buying decision.')}</h2><p>${esc(comparison.intro || comparison.notice)}</p></div><p class="comparison-scroll-hint">Scroll horizontally to compare methods →</p><div class="comparison-scroll" role="region" aria-label="Hair extension method comparison" tabindex="0"><table><thead><tr><th scope="col">Buyer question</th>${comparison.columns.map((column) => `<th scope="col">${esc(column)}</th>`).join('')}</tr></thead><tbody>${comparison.rows.map(([label, ...values]) => `<tr><th scope="row">${esc(label)}</th>${values.map((value) => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="comparison-notice">${esc(comparison.notice)}</p></section>`;
}

function decisionFramework(product) {
  const section = product.decisionFramework;
  if (!section) return '';
  return `<section class="product-decisions"><div class="product-section-heading"><p class="eyebrow">PRODUCT SELECTION LOGIC</p><h2>${esc(section.title)}</h2><p>${esc(section.intro)}</p></div><div class="decision-grid">${section.items.map((item) => `<article><span>${esc(item.label)}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('')}</div></section>`;
}

function specificationAnatomy(product) {
  if (!product.specificationAnatomy) return '';
  return `<section class="spec-anatomy"><div><p class="eyebrow">THE COMPLETE PRODUCT DEFINITION</p><h2>Six layers make one repeatable specification.</h2><p>A catalogue name is not enough. These six layers must agree before sample approval and quotation.</p></div><ol>${product.specificationAnatomy.map(([number, title, body]) => `<li><span>${esc(number)}</span><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></li>`).join('')}</ol></section>`;
}

function constructionComparison(product) {
  const comparison = product.constructionComparison;
  if (!comparison) return '';
  return `<section class="construction-comparison"><div class="product-section-heading"><p class="eyebrow">CONSTRUCTION KNOWLEDGE</p><h2>${esc(comparison.title || 'Compare constructions before approving a sample.')}</h2><p>${esc(comparison.notice)}</p></div><div class="comparison-scroll" role="region" aria-label="Clip-in construction comparison" tabindex="0"><table><thead><tr><th scope="col">Decision point</th>${comparison.columns.map((column) => `<th scope="col">${esc(column)}</th>`).join('')}</tr></thead><tbody>${comparison.rows.map(([label, ...values]) => `<tr><th scope="row">${esc(label)}</th>${values.map((value) => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
}

function serviceComparison(product) {
  return `<section class="service-comparison"><div><p class="eyebrow">THE DS HAIR DIFFERENCE</p><h2>A structured sourcing process, not an unsupported quality claim.</h2><p>We compare the way a project is managed—not make unverified statements about another supplier’s hair.</p></div><div class="service-comparison-table"><div class="service-comparison-head"><strong>Decision point</strong><strong>DS HAIR structured workflow</strong><strong>Unstructured sourcing risk</strong></div>${product.serviceComparison.map(([label, ours, risk]) => `<div><strong>${esc(label)}</strong><span>${esc(ours)}</span><span>${esc(risk)}</span></div>`).join('')}</div></section>`;
}

function knowledgeSection(product) {
  const count = product.knowledge.length;
  const gridClass = count <= 5 ? `is-count-${count}` : count === 6 ? 'is-count-6' : 'is-count-many';
  return `<section class="product-knowledge"><div class="product-section-heading"><p class="eyebrow">PROFESSIONAL PRODUCT KNOWLEDGE</p><h2>Use the page to make a better buying decision.</h2><p>Practical guidance for salons, distributors and private-label teams. Product-specific claims still require sample approval.</p></div><div class="knowledge-grid ${gridClass}">${product.knowledge.map((item, index) => `<article><span>0${index + 1}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('')}</div></section>`;
}

function relatedProducts(product) {
  return `<section class="related-products"><div class="product-section-heading"><p class="eyebrow">RELATED DEVELOPMENT DIRECTIONS</p><h2>Build a coherent extension range.</h2><p>These are enquiry pathways, not live-stock listings. Each product requires its own specification and sample reference.</p></div><div class="related-product-grid">${product.relatedProducts.map((item) => `<a class="related-product-card" href="${item.href}"><img src="${item.image}" alt="${esc(item.imageAlt)}" loading="lazy"><div><span>${esc(item.eyebrow)}</span><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><strong>DISCUSS THIS PRODUCT →</strong></div></a>`).join('')}</div></section>`;
}

for (const product of products) {
  const url = `https://wigexporter.com/${product.slug}.html`;
  const productIdentity = product.code || product.title;
  const conversion = conversionModule(product);
  const wa = whatsappLink(
    product.conversion?.tradeCard?.whatsappNumber || '8613516946001',
    product.conversion?.tradeCard?.whatsappMessage || `Hi DS HAIR, I'm interested in wholesale ${product.title}. Please send trade pricing and sample information.`
  );
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    ...(product.code ? { sku: product.code } : {}),
    brand: { '@type': 'Brand', '@id': 'https://wigexporter.com/#brand', name: product.brand },
    manufacturer: { '@type': 'Organization', '@id': 'https://wigexporter.com/#organization', name: 'DS HAIR', url: 'https://wigexporter.com/' },
    category: product.category,
    description: product.description,
    ...(product.images.length ? { image: product.images.map((image) => `https://wigexporter.com/${image.src}`) } : {}),
    additionalProperty: product.confirmedFacts.map(([name, value]) => ({
      '@type': 'PropertyValue',
      name,
      value
    }))
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faqs.map(([name, text]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text }
    }))
  };
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(product.metaTitle)}</title>
  <meta name="description" content="${esc(product.description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(product.metaTitle)}">
  <meta property="og:description" content="${esc(product.description)}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${url}">
  ${product.images.length ? `<meta property="og:image" content="https://wigexporter.com/${product.images[0].src}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css?v=20260725-12">
  <link rel="stylesheet" href="content.css?v=20260725-12">
  <link rel="stylesheet" href="product.css?v=20260725-12">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="notice">DS HAIR · B2B samples · OEM & private label <a href="contact.html">Discuss your requirement →</a></div>
  <header class="site-header"><button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span></button><nav id="primary-nav" class="primary-nav" aria-label="Primary navigation"></nav><a class="wordmark" href="index.html" aria-label="DS HAIR home"><strong>DS HAIR</strong><span>WIGEXPORTER · GLOBAL B2B</span></a><div class="header-tools"><a class="trade-link" href="trade-account.html">TRADE ACCOUNT</a><a class="quote-link" href="contact.html">REQUEST QUOTE</a></div></header>
  <main id="main">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>›</span><a href="products.html">Collections</a><span>›</span><a href="${product.categoryUrl}">${esc(product.category)}</a><span>›</span><span>${esc(product.title)}</span></nav>
    <section class="product-hero${product.images.length ? '' : ' product-hero-text-only'}">
      ${productVisual(product)}
      <div class="product-summary">
        ${product.draftNotice ? `<p class="draft-notice">${esc(product.draftNotice)}</p>` : ''}
        <p class="eyebrow">${esc(product.brand)} · ${esc(product.category)}</p>
        <h1>${esc(product.title)}</h1>
        <p class="product-code">${product.code ? `PRODUCT CODE · ${esc(product.code)}` : esc(product.referenceLabel || 'SPECIFICATION-BASED PRODUCT · NO SKU')}</p>
        ${conversion.tradeCard}
        <p class="product-dek">${esc(product.summary)}</p>
        <dl class="quick-specs">${product.confirmedFacts.map(([name, value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
        ${conversion.trustBadges}
        <div class="product-actions"><a class="button button-dark" href="contact.html?product=${encodeURIComponent(productIdentity)}">REQUEST QUOTE</a><a class="button button-light" href="sample.html?product=${encodeURIComponent(productIdentity)}">DISCUSS A SAMPLE</a>${wa ? `<a class="button button-whatsapp" href="${esc(wa)}" target="_blank" rel="noopener">Enquire via WhatsApp</a>` : ''}</div>
        <p class="accuracy-note">Commercial terms and unconfirmed technical details are provided only after specification review.</p>
      </div>
    </section>
    ${conversion.serviceBar}
    ${productTypeChooser(product)}
    ${decisionFramework(product)}
    ${setMapSection(product)}
    ${specificationAnatomy(product)}
    ${configurationBuilder(product)}
    <section class="product-answer"><p class="eyebrow">BUYER ANSWER</p><h2>What is this product for?</h2><p>${esc(product.summary)}</p></section>
    <section class="product-section">
      <div class="product-section-heading"><p class="eyebrow">EVALUATION POINTS</p><h2>What your team should verify.</h2><p>Use a representative sample to turn visual impressions into an approved, repeatable product reference.</p></div>
      <div class="buyer-checks">${product.buyerChecks.map(([name, text], index) => `<article><span>0${index + 1}</span><h3>${esc(name)}</h3><p>${esc(text)}</p></article>`).join('')}</div>
    </section>
    ${constructionComparison(product)}
    ${comparisonTable(product)}
    ${serviceComparison(product)}
    <section class="product-specification">
      <div><p class="eyebrow">SPECIFICATION STATUS</p><h2>Confirmed facts, clearly separated from open items.</h2><p>DS HAIR does not publish assumptions as product specifications. Open items are confirmed against the selected supply batch and quotation.</p></div>
      <div>
        <h3>Confirmed on this reference</h3>
        <dl>${product.confirmedFacts.map(([name, value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
        <h3>To confirm before order</h3>
        <ul>${product.unconfirmed.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
      </div>
    </section>
    <section class="product-customisation">
      <div><p class="eyebrow">OEM / PRIVATE LABEL</p><h2>Build the specification around your market.</h2></div>
      <ul>${product.customisation.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
      <a class="button button-dark" href="customization.html#custom-packaging">EXPLORE CUSTOM PACKAGING</a>
    </section>
    ${knowledgeSection(product)}
    ${relatedProducts(product)}
    <section class="faq-section"><div><p class="eyebrow">BUYER QUESTIONS</p><h2>Before you request a quote</h2></div><div class="faq-list">${product.faqs.map(([name, text]) => `<details><summary>${esc(name)}</summary><p>${esc(text)}</p></details>`).join('')}</div></section>
    <section class="final-cta"><p class="eyebrow">${product.code ? `REFERENCE · ${esc(product.code)}` : 'PRODUCT BRIEF · NO SKU'}</p><h2>${esc(product.ctaTitle || `Request the DS HAIR ${product.title} specification.`)}</h2><p>${esc(product.ctaText || 'Include your target market, preferred construction, length, weight, colour direction and estimated quantity so the sourcing team can respond with the right next step.')}</p><a class="button button-light" href="contact.html?product=${encodeURIComponent(productIdentity)}">SEND YOUR BUYING BRIEF</a></section>
  </main>
  <footer class="site-footer"></footer>
  <script type="application/ld+json">${json(productSchema)}</script>
  <script type="application/ld+json">${json(faqSchema)}</script>
  <script src="product-config.js?v=20260725-12"></script>
  <script src="script.js?v=20260725-12"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(root, `${product.slug}.html`), html.replace(/[ \t]+$/gm, ''));
}

console.log(`Generated ${products.length} product page.`);
