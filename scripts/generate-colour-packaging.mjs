import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const colourChart = JSON.parse(fs.readFileSync(path.join(root, 'content/colors.json'), 'utf8'));
const outputFile = 'hair-colour-chart-custom-packaging.html';
const url = `https://wigexporter.com/${outputFile}`;
const colours = colourChart.groups.flatMap((group) =>
  group.colours.map((colour) => ({ ...colour, group: group.name }))
);

const packagingOptions = [
  {
    value: 'Extension backing card + clear sleeve',
    title: 'Extension card & sleeve',
    image: 'assets/packaging-studio/extension-backing-card-concept.jpg',
    alt: 'Blank extension backing card and clear sleeve concept for private-label development',
    summary: 'For tape-ins, clip-ins, K-tips and wefts that need a clear product view and organised shade or SKU labelling.',
    note: 'Backing card · protective sleeve · belly band'
  },
  {
    value: 'Satin pouch + folding carton',
    title: 'Satin pouch & carton',
    image: 'assets/packaging-studio/satin-pouch-carton-concept.jpg',
    alt: 'Blank satin pouch and folding carton concept for wig and topper packaging',
    summary: 'A soft inner presentation with a practical outer carton for wigs, toppers or premium extension sets.',
    note: 'Satin pouch · tissue · folding carton'
  },
  {
    value: 'Rigid drawer box',
    title: 'Rigid drawer box',
    image: 'assets/packaging-studio/rigid-drawer-box-concept.jpg',
    alt: 'Blank rigid drawer box concept for premium private-label hair packaging',
    summary: 'A higher-presentation structure for premium programmes where protection and unboxing experience matter.',
    note: 'Rigid board · drawer sleeve · inner wrap'
  },
  {
    value: 'Cards, tags + labels',
    title: 'Cards, tags & labels',
    image: 'assets/packaging-studio/cards-tags-labels-concept.jpg',
    alt: 'Blank care cards, insert, hang tag and label concepts for private-label hair products',
    summary: 'Build a consistent information system across care, shade, SKU and product-identification touchpoints.',
    note: 'Care card · insert · hang tag · labels'
  }
];

const logoTreatments = [
  {
    value: 'Single-colour print',
    title: 'Ink print',
    className: 'logo-print',
    note: 'Clear, efficient artwork for cards, cartons and labels.'
  },
  {
    value: 'Metallic foil',
    title: 'Foil detail',
    className: 'logo-foil',
    note: 'A controlled metallic accent subject to material and sample approval.'
  },
  {
    value: 'Blind emboss or deboss',
    title: 'Emboss / deboss',
    className: 'logo-emboss',
    note: 'Tactile relief without adding another print colour.'
  },
  {
    value: 'Applied label or sticker',
    title: 'Applied label',
    className: 'logo-label',
    note: 'A flexible route for smaller runs, shade coding and launch tests.'
  }
];

const faqs = [
  [
    'Are the 31 colours guaranteed to look identical on every product?',
    'No. The digital chart is for shortlisting. Fibre or hair direction, density, lighting and product construction can change the visual result, so representative samples and physical approval are required.'
  ],
  [
    'Can I choose several shades for a new range?',
    'Yes. Use the page to identify an initial shade direction, then include your target product, market and quantity range in the brief. Final availability and development requirements are confirmed in writing.'
  ],
  [
    'Are the packaging images finished customer orders?',
    'No. They are original DS HAIR concept previews with blank branding areas. Structure, dimensions, materials, printing, MOQ, cost and lead time require a project quotation and physical approval.'
  ],
  [
    'Can DS HAIR place my own logo on the packaging?',
    'Yes, after file and feasibility review. Vector artwork is preferred. Logo size, colour, print method, placement and required market information are confirmed through the packaging brief.'
  ]
];

const esc = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'DS HAIR Colour Chart 2 and Custom Packaging Studio',
  description:
    'Browse 31 DS HAIR colour references, review physical colour confirmation and prepare a custom hair packaging brief.',
  url,
  isPartOf: { '@type': 'WebSite', '@id': 'https://wigexporter.com/#website', name: 'WigExporter' },
  about: [
    { '@type': 'Thing', name: 'Wholesale hair colour development' },
    { '@type': 'Thing', name: 'Private-label hair packaging' }
  ],
  mainEntity: {
    '@type': 'ItemList',
    name: colourChart.name,
    numberOfItems: colours.length,
    itemListElement: colours.map((colour, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${url}#colour-${index + 1}`,
      name: `${colour.code} ${colour.name}`,
      image: `https://wigexporter.com/${colour.image}`
    }))
  }
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'DS HAIR Colour and Custom Packaging Development',
  url,
  provider: {
    '@type': 'Organization',
    '@id': 'https://wigexporter.com/#organization',
    name: 'DS HAIR',
    alternateName: 'WigExporter',
    url: 'https://wigexporter.com/'
  },
  areaServed: 'Worldwide',
  audience: {
    '@type': 'BusinessAudience',
    audienceType: 'Hair brands, distributors, salons and professional buyers'
  },
  serviceType: [
    'Wholesale hair colour shortlisting and physical approval support',
    'Private-label hair packaging development',
    'Hair packaging artwork and sample coordination'
  ],
  description:
    'A B2B development service connecting shade shortlisting, physical colour references, packaging structure and private-label artwork approval.'
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([name, text]) => ({
    '@type': 'Question',
    name,
    acceptedAnswer: { '@type': 'Answer', text }
  }))
};

const colourCards = colourChart.groups
  .flatMap((group) =>
    group.colours.map((colour, indexWithinGroup) => {
      const preceding = colourChart.groups
        .slice(0, colourChart.groups.indexOf(group))
        .reduce((total, item) => total + item.colours.length, 0);
      const position = preceding + indexWithinGroup + 1;
      return `<button class="studio-colour-card" id="colour-${position}" type="button" data-colour-group="${esc(group.name)}" data-colour-code="${esc(colour.code)}" data-colour-name="${esc(colour.name)}" aria-pressed="false">
        <span class="choice-marker" aria-hidden="true">SELECTED</span>
        <img src="${esc(colour.image)}" alt="DS HAIR Colour Chart 2 shade ${esc(colour.code)} ${esc(colour.name)}" loading="lazy" width="512" height="640">
        <span class="studio-colour-meta"><strong>${esc(colour.code)}</strong><span>${esc(colour.name)}</span><small>${esc(group.name)}</small></span>
      </button>`;
    })
  )
  .join('');

const ringCards = colours
  .map((colour, index) => {
    const angle = -87 + (174 / (colours.length - 1)) * index;
    return `<span class="ring-swatch" style="--angle:${angle.toFixed(2)}deg;--stack:${index}" aria-hidden="true"><img src="${esc(colour.image)}" alt="" loading="lazy"></span>`;
  })
  .join('');

const packagingCards = packagingOptions
  .map(
    (option) => `<button class="packaging-card" type="button" data-choice-group="packaging" data-choice-value="${esc(option.value)}" aria-pressed="false">
      <span class="concept-badge">ORIGINAL CONCEPT PREVIEW</span>
      <span class="choice-marker" aria-hidden="true">SELECTED</span>
      <img src="${esc(option.image)}" alt="${esc(option.alt)}" loading="lazy" width="1120" height="1400">
      <span class="packaging-card-copy"><small>${esc(option.note)}</small><strong>${esc(option.title)}</strong><span>${esc(option.summary)}</span></span>
    </button>`
  )
  .join('');

const logoCards = logoTreatments
  .map(
    (option) => `<button class="logo-treatment-card" type="button" data-choice-group="logo_treatment" data-choice-value="${esc(option.value)}" aria-pressed="false">
      <span class="logo-treatment-preview ${esc(option.className)}"><strong>DS HAIR</strong><small>PRIVATE LABEL PREVIEW</small></span>
      <span class="logo-treatment-copy"><strong>${esc(option.title)}</strong><span>${esc(option.note)}</span></span>
      <span class="choice-marker" aria-hidden="true">SELECTED</span>
    </button>`
  )
  .join('');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Hair Colour Chart & Custom Packaging | DS HAIR B2B</title>
  <meta name="description" content="Browse 31 DS HAIR hair colour references, review physical colour approval and select private-label packaging structures and logo finishes for a B2B development brief.">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="Hair Colour Chart & Custom Packaging | DS HAIR B2B">
  <meta property="og:description" content="Shortlist 31 hair shades and build a private-label colour and packaging brief with DS HAIR.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="https://wigexporter.com/assets/packaging-studio/extension-backing-card-concept.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css?v=20260720-5">
  <link rel="stylesheet" href="content.css?v=20260720-5">
  <link rel="stylesheet" href="colour-packaging.css?v=20260720-1">
</head>
<body class="studio-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="notice">DS HAIR · 31-shade colour system · Private-label packaging <a href="#brief-builder">Build your brief →</a></div>
  <header class="site-header">
    <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span></button>
    <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation"></nav>
    <a class="wordmark" href="index.html" aria-label="DS HAIR home"><strong>DS HAIR</strong><span>WIGEXPORTER · GLOBAL B2B</span></a>
    <div class="header-tools"><a class="trade-link" href="trade-account.html">TRADE ACCOUNT</a><a class="quote-link" href="#brief-builder">BUILD A BRIEF</a></div>
  </header>

  <main id="main" data-colour-packaging-studio>
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>›</span><a href="customization.html">Customization</a><span>›</span><span>Colour & Packaging Studio</span></nav>

    <section class="studio-hero">
      <div class="studio-hero-copy">
        <p class="eyebrow">COLOUR & PACKAGING STUDIO</p>
        <h1>Build the range.<br>Shape the brand.</h1>
        <p>Shortlist from 31 DS HAIR colour references, understand the physical approval step and select a packaging direction for your B2B development brief.</p>
        <div class="button-row"><a class="button button-dark" href="#colour-studio">EXPLORE 31 COLOURS</a><a class="button button-light" href="#packaging-studio">VIEW PACKAGING</a></div>
        <p class="studio-accuracy-note">This page prepares an enquiry. It does not indicate live stock, confirmed MOQ, price or production feasibility.</p>
      </div>
      <div class="studio-hero-visual">
        <img src="assets/colour-ring/physical-swatch-loop-web.jpg" alt="DS HAIR physical blended hair swatches arranged in loops" width="1800" height="1202">
        <div><span>31</span><p><strong>DS HAIR Colour Chart 2</strong>Digital shortlist + physical approval</p></div>
      </div>
    </section>

    <section class="studio-proof" aria-label="Colour and packaging development summary">
      <div><strong>31</strong><span>digital shade references</span></div>
      <div><strong>4</strong><span>colour families</span></div>
      <div><strong>Physical</strong><span>approval before scale</span></div>
      <div><strong>B2B</strong><span>brand and range development</span></div>
    </section>

    <section class="colour-studio" id="colour-studio">
      <div class="studio-section-heading">
        <div><p class="eyebrow">01 · SHADE SHORTLIST</p><h2>31 colours. One clearer starting point.</h2></div>
        <div><p>${esc(colourChart.notice)}</p><a href="free-color-kits.html">REQUEST A PHYSICAL COLOUR KIT →</a></div>
      </div>
      <div class="colour-toolbar">
        <div class="studio-filters" aria-label="Filter by colour family">
          <button class="is-active" type="button" data-colour-filter="all" aria-pressed="true">All 31</button>
          ${colourChart.groups.map((group) => `<button type="button" data-colour-filter="${esc(group.name)}" aria-pressed="false">${esc(group.name)}</button>`).join('')}
        </div>
        <p aria-live="polite"><span>Selected shade</span><strong data-live-colour>None yet</strong></p>
      </div>
      <div class="studio-colour-grid">${colourCards}</div>
      <p class="reference-note"><strong>Reference-code note:</strong> Ref 13–16, Ref 25 and Ref 29 are temporary website identifiers where the source chart has no published production shade code. Confirm the final coding and physical sample before order.</p>
    </section>

    <section class="ring-section" id="physical-colour-ring">
      <div class="ring-heading"><p class="eyebrow">02 · PHYSICAL REFERENCE</p><h2>Turn a screen shortlist into a working colour reference.</h2><p>The fan below maps all 31 digital shade images into one range view. The photographs show DS HAIR physical swatch references. Final approval still belongs to a representative physical ring or product sample.</p></div>
      <div class="ring-layout">
        <figure class="ring-stage">
          <div class="ring-fan">${ringCards}<span class="ring-pivot" aria-hidden="true"></span></div>
          <figcaption><strong>31-shade digital range map</strong><span>Built from the individual Colour Chart 2 images</span></figcaption>
        </figure>
        <div class="physical-reference">
          <figure><img src="assets/colour-ring/physical-swatch-loop-web.jpg" alt="DS HAIR physical blended hair swatches arranged in loops" loading="lazy" width="1800" height="1202"><figcaption>Physical blended swatch reference</figcaption></figure>
          <figure><img src="assets/colour-ring/physical-swatch-10.jpg" alt="DS HAIR physical colour swatch number 10 with identification tag" loading="lazy" width="808" height="753"><figcaption>Tagged swatch identification detail</figcaption></figure>
          <ul><li>Shade matching</li><li>Range planning</li><li>Sample approval</li><li>Repeat-order reference</li></ul>
          <a class="button button-light" href="free-color-kits.html">REQUEST COLOUR KIT SUPPORT</a>
        </div>
      </div>
    </section>

    <section class="packaging-studio" id="packaging-studio">
      <div class="studio-section-heading">
        <div><p class="eyebrow">03 · PACKAGING STRUCTURE</p><h2>Choose the format before decorating the surface.</h2></div>
        <div><p>These original, client-neutral images show development directions only. No customer logo or customer order is displayed. Structure, dimensions, materials, printing and commercial terms require review.</p><a href="customization.html#custom-packaging">HOW PRIVATE LABEL WORKS →</a></div>
      </div>
      <div class="packaging-grid">${packagingCards}</div>
      <p class="concept-disclosure">Concept previews created for DS HAIR’s public B2B website. They are not photographs of finished customer orders and must not be used as proof of production without an approved physical sample.</p>

      <div class="logo-treatment-section">
        <div><p class="eyebrow">04 · LOGO APPLICATION</p><h2>Select the finish your artwork should explore.</h2><p>The exact result depends on logo detail, substrate, size, print process and supplier capability. A visual mockup does not replace a physical approval sample.</p></div>
        <div class="logo-treatment-grid">${logoCards}</div>
      </div>
    </section>

    <section class="brief-builder" id="brief-builder">
      <div class="brief-builder-intro"><p class="eyebrow">YOUR DEVELOPMENT BRIEF</p><h2>Carry your shortlist into one useful enquiry.</h2><p>Select a shade, packaging structure and logo treatment above. We will carry the choices into the contact brief so you can add product, market and quantity information.</p><button type="button" data-clear-brief>CLEAR SELECTIONS</button></div>
      <aside class="brief-summary" aria-live="polite">
        <p class="eyebrow">CURRENT SHORTLIST</p>
        <dl>
          <div><dt>Colour</dt><dd data-summary="colour">Not selected</dd></div>
          <div><dt>Packaging</dt><dd data-summary="packaging">Not selected</dd></div>
          <div><dt>Logo treatment</dt><dd data-summary="logo_treatment">Not selected</dd></div>
        </dl>
        <p data-brief-status>0 of 3 directions selected. You can still send a general project brief.</p>
        <a class="button button-light" data-studio-enquiry href="contact.html?project=Colour+and+Packaging+Studio">SEND THIS DEVELOPMENT BRIEF</a>
      </aside>
    </section>

    <section class="studio-process">
      <div><p class="eyebrow">05 · APPROVAL PATH</p><h2>What happens after the online shortlist.</h2></div>
      <ol>
        <li><span>01</span><div><strong>Share the commercial context</strong><p>Product, target buyer, market, quantity range, launch timing and expected positioning.</p></div></li>
        <li><span>02</span><div><strong>Review shade & structure</strong><p>Confirm what can be sampled, which materials are practical and which items remain open.</p></div></li>
        <li><span>03</span><div><strong>Prepare artwork inputs</strong><p>Vector logo, colours, product information, language, care guidance and identification requirements.</p></div></li>
        <li><span>04</span><div><strong>Approve physical references</strong><p>Record shade, product and packaging corrections before production or repeat ordering.</p></div></li>
      </ol>
    </section>

    <section class="faq-section studio-faq"><div><p class="eyebrow">BUYER QUESTIONS</p><h2>Before colour or packaging development</h2></div><div class="faq-list">${faqs.map(([name, text]) => `<details><summary>${esc(name)}</summary><p>${esc(text)}</p></details>`).join('')}</div></section>

    <section class="final-cta"><p class="eyebrow">DS HAIR · GLOBAL B2B</p><h2>Start with a shortlist. Approve before scale.</h2><p>Tell us the product, market, quantity range, colour direction and packaging level. We will identify the next facts, files and samples needed.</p><a class="button button-light" href="#brief-builder">BUILD YOUR COLOUR & PACKAGING BRIEF</a></section>
  </main>

  <footer class="site-footer"></footer>
  <script type="application/ld+json">${json(collectionSchema)}</script>
  <script type="application/ld+json">${json(serviceSchema)}</script>
  <script type="application/ld+json">${json(faqSchema)}</script>
  <script src="colour-packaging.js?v=20260720-1"></script>
  <script src="script.js?v=20260720-5"></script>
</body>
</html>`;

fs.writeFileSync(path.join(root, outputFile), html);
console.log(`Generated ${outputFile} with ${colours.length} colour cards.`);
