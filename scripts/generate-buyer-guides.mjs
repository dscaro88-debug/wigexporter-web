import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = 'https://wigexporter.com';
const VERSION = '20260818-2';

// Buyer-guide pages: problem-led SEO pages around procurement questions.
// English only (no es/de/fr variants) on purpose — they carry a self-ref canonical
// and NO hreflang alternates, so they never create the duplicate-hreflang bug.
// New entries here are picked up automatically by generate-sitemap.mjs.
const guides = [
  {
    slug: 'wholesale-hair-extensions-moq',
    title: 'Wholesale Hair Extensions MOQ: What Actually Sets the Minimum',
    description: 'How minimum order quantities work for wholesale hair extensions, and the factors that change your real MOQ per style and market.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Wholesale hair extensions MOQ, explained.',
    intro: 'Minimum order quantity is not one number across a catalogue. It is set per construction, material and whether the item is private-label. Here is what moves it.',
    sections: [
      ['Why MOQ is not one number', 'Extensions are made in very different ways — clip-in, tape-in, weft, nano-ring — and in human or synthetic fibre. A single site-wide MOQ would misrepresent how the product is actually built. Suppliers that quote one number for everything are usually quoting a stock line, not your specification.'],
      ['What typically moves your MOQ', 'Piece count per style, how many colour codes you spread across the range, custom packaging, and whether the item is made-to-order versus kept in stock. More shades and bespoke packs raise the minimum because each adds setup.'],
      ['How to get a useful MOQ answer', 'Share your target product, construction, colour count and volume. A supplier confirms the exact minimum per reference during the specification review — not before, because the number depends on the brief.'],
      ['MOQ versus a development run', 'New brands can often start with a smaller development run to approve a reference, then scale. Ask specifically about a first-run minimum rather than the full production MOQ.']
    ],
    faqs: [
      ['Is there a single MOQ for all extensions?', 'No. It is set per construction, material and private-label status, and confirmed against your specific brief.'],
      ['Can a new brand order a small first run?', 'Often yes, as a development run. The exact minimum is confirmed per product and brief.'],
      ['Do more colours increase MOQ?', 'Usually, because each shade adds setup. Discuss your colour spread early so the minimum reflects it.']
    ],
    related: ['hair-extensions-lead-time', 'private-label-wig-supplier-uk', 'hair-extensions-quality-checklist']
  },
  {
    slug: 'oem-hair-topper-manufacturer',
    title: 'OEM Hair Topper Manufacturer: How to Brief a Factory',
    description: 'What an OEM hair topper manufacturer needs from you, and how to turn a brief into an approved, repeatable topper reference.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Briefing an OEM hair topper manufacturer.',
    intro: 'With OEM, you supply the specification and the factory builds to it. The brief — not the catalogue photo — defines the product. Here is how to write one that works.',
    sections: [
      ['What "OEM" means for toppers', 'You own the specification: base material, construction, size, density, colour reference and target wearer. The factory executes it and documents the result as a reference.'],
      ['The brief that actually works', 'Cover base material (human or synthetic), construction (mono, silk or lace base), size, density, colour reference, and the wearer profile. Vague briefs produce vague samples.'],
      ['From brief to approved reference', 'A representative sample is approved, documented and used as the repeatable standard. Changes after approval need a new reference, so approve carefully.'],
      ['What to confirm in writing', 'MOQ, lead time, price, and which facts are confirmed versus open before the order. Keep this in the quotation, not in email threads.']
    ],
    faqs: [
      ['Do I need a full tech pack?', 'A clear brief with material, construction, size, density and colour reference is enough to start.'],
      ['How is a topper reference approved?', 'Via a representative sample documented against your specification.'],
      ['Can the same topper be private-label?', 'Yes, with logo and packaging applied per your brand brief.']
    ],
    related: ['how-to-choose-wig-manufacturer', 'custom-hair-colour-matching', 'hair-topper-vs-wig']
  },
  {
    slug: 'private-label-wig-supplier-uk',
    title: 'Private Label Wig Supplier for the UK: What Salons and Brands Should Check',
    description: 'A practical checklist for UK salons and hair brands evaluating a private-label wig supplier — from specification to packaging and compliance.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Choosing a private-label wig supplier in the UK.',
    intro: 'UK salons and emerging brands can launch a wig range without owning a factory — but the supplier must build to your brief and keep it repeatable. Check these points.',
    sections: [
      ['Start from your market, not a catalogue', 'Define the wearer, price tier and sales channel before comparing suppliers. The right partner fits your segment, not a generic list.'],
      ['Specification control', 'Can the supplier build to your brief — cap construction, fibre, density, colour — and keep it repeatable across batches? If not, your "brand" drifts.'],
      ['Packaging and brand', 'Logo, shade/SKU labels, care cards and retail boxes; confirm MOQ and cost per packaging brief. Packaging is part of the product, not an afterthought.'],
      ['UK/EU practicalities', 'Compliance documents on request, express sample shipping (about 3–5 working days to the UK), and Incoterms for bulk. Confirm these early.']
    ],
    faqs: [
      ['Can a UK salon launch a private-label wig range?', 'Yes, with a right-sized brief and packaging plan — you do not need your own factory.'],
      ['What should I verify before ordering?', 'Sample approval, confirmed MOQ and lead time, and an approved packaging reference.'],
      ['Do you handle UK shipping?', 'Samples ship by DHL/UPS express; bulk by air or sea per Incoterms.']
    ],
    related: ['starting-a-hair-brand-checklist', 'private-label-packaging-requirements', 'hair-extensions-supplier-certifications']
  },
  {
    slug: 'hair-extensions-supplier-certifications',
    title: 'Hair Extensions Supplier Certifications: What UK/EU Buyers Should Ask For',
    description: 'Which compliance and material documents matter when sourcing hair extensions for the UK and EU, and how to request them without delay.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Certifications that matter for UK/EU buyers.',
    intro: 'Certification is market-specific. Ask for documents relevant to your destination, not a generic certificate list, and line them up at the brief stage.',
    sections: [
      ['Certifications are market-specific', 'The documents you need depend on where you sell. A supplier should tell you what it can actually provide for your market, not hand over an unrelated certificate.'],
      ['Material and composition', 'Composition statements, and where relevant fibre identification for synthetic lines, are the baseline. They support, but do not replace, a physical reference.'],
      ['Compliance for the EU/UK', 'REACH-related documentation and any required test reports may apply. Confirm what the supplier holds and can issue for your product and destination.'],
      ['How to request without delay', 'Name your market and product at brief stage so documents are prepared alongside the sample, not chased after.']
    ],
    faqs: [
      ['Which certificates do I need for the UK?', 'It depends on product and claim. Ask the supplier to confirm the documents available for your market.'],
      ['Are test reports always available?', 'They are provided on request where the supplier holds them; confirm availability early.'],
      ['Does certification replace a sample?', 'No. Documents support the file; a physical reference still approves the product.']
    ],
    related: ['wholesale-hair-extensions-moq', 'private-label-wig-supplier-uk', 'hair-extensions-quality-checklist']
  },
  {
    slug: 'how-to-choose-wig-manufacturer',
    title: 'How to Choose a Wig Manufacturer for Your Brand',
    description: 'Selection criteria for a wig manufacturer: specification control, sampling discipline, repeatability and commercial terms.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Choosing a wig manufacturer for your brand.',
    intro: 'Price is the easiest thing to compare and the worst thing to decide on. Compare manufacturers on the same written brief and approved reference instead.',
    sections: [
      ['Specification, not showroom', 'Choose a manufacturer who builds to your brief and documents it. A showroom photo is not a contract.'],
      ['Sampling discipline', 'A clear sample-approval step prevents "looks like the photo" ambiguity at reorder. Ask how approval is recorded.'],
      ['Repeatability', 'Ask how the reference is kept stable across batches — material source, construction checks, documented deviations.'],
      ['Commercial clarity', 'MOQ, lead time, price and open items confirmed in writing before production. Ambiguity here is where margins leak.']
    ],
    faqs: [
      ['What matters more than price?', 'Repeatability and sample-approval discipline. They protect your brand at reorder.'],
      ['Should I visit the factory?', 'If volume justifies it. Otherwise a documented reference system is the working proxy.'],
      ['How do I compare two manufacturers?', 'On the same written brief and approved reference — not catalogue photos.']
    ],
    related: ['oem-hair-topper-manufacturer', 'wig-sampling-process', 'starting-a-hair-brand-checklist']
  },
  {
    slug: 'human-hair-vs-synthetic-extensions',
    title: 'Human Hair vs Synthetic Extensions: A B2B Buying Guide',
    description: 'How to choose between human hair and synthetic extensions for wholesale, by wearer profile, margin and care.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Human hair vs synthetic extensions.',
    intro: 'This is not "one is better". It is two different value propositions. Choose by wearer profile, margin and care, and stock both tiers with clear guidance.',
    sections: [
      ['The real difference', 'Human hair behaves like natural hair and can be heat-styled within limits. Synthetic holds its style, costs less, but reacts to heat differently.'],
      ['Wearer profile fit', 'Daily wear and styling flexibility favour human hair. Fashion and occasional wear favour synthetic for price and style-hold.'],
      ['Margin and stock', 'Synthetic usually has a lower unit cost and simpler stock. Human hair is higher value with narrower shade batches to manage.'],
      ['What to confirm per line', 'For synthetic: fibre quality and heat tolerance. For human: grade, processing and how cuticle alignment is maintained.']
    ],
    faqs: [
      ['Which sells better for salons?', 'It depends on the client. Offer both tiers with honest care guidance.'],
      ['Is synthetic lower quality?', 'Not necessarily — it is a different value proposition focused on style-hold and price.'],
      ['Can both be private-label?', 'Yes, with appropriate care and label content per line.']
    ],
    related: ['remy-human-hair-supplier', 'hair-extensions-quality-checklist', 'hair-extensions-supplier-certifications']
  },
  {
    slug: 'wig-sampling-process',
    title: 'Wig Sampling Process: How to Approve a Reference Before Bulk',
    description: 'A step-by-step sampling workflow that turns a wig idea into an approved, repeatable production reference.',
    eyebrow: 'BUYER GUIDE',
    h1: 'The wig sampling process, step by step.',
    intro: 'A representative sample converts a visual impression into an approved standard. Run this workflow before any bulk commitment.',
    sections: [
      ['Why sample first', 'A sample is the only way to agree on construction, fibre, density and colour before money is tied up in production.'],
      ['The sampling steps', 'Brief, representative sample, documented review, corrections, approved reference. Each step is recorded against the brief.'],
      ['What to document', 'Construction, fibre, density, colour, and any deviation from the brief. The document is the reorder contract.'],
      ['Cost and timing', 'Samples are supplied at sample price plus shipping at the buyer’s cost; timing is confirmed per construction.']
    ],
    faqs: [
      ['Are samples free?', 'No. Human-hair samples are high-value and supplied at sample price plus shipping at the buyer’s cost.'],
      ['How long does sampling take?', 'A few working days to a couple of weeks, depending on construction.'],
      ['What if the sample is wrong?', 'Request corrections and re-approve before bulk — do not approve and hope.']
    ],
    related: ['how-to-choose-wig-manufacturer', 'hair-extensions-quality-checklist', 'custom-hair-colour-matching']
  },
  {
    slug: 'private-label-packaging-requirements',
    title: 'Private Label Hair Packaging Requirements (UK/EU)',
    description: 'The packaging inputs a private-label hair supplier needs, and the market requirements that affect your pack.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Private-label packaging requirements.',
    intro: 'Packaging is approved as its own reference. Give the supplier the right inputs early and the pack matches your brand, not a generic box.',
    sections: [
      ['Start with the brief', 'Product, market, channel, quantity and packaging level. Right-size the pack to launch, not to a maximalist wish list.'],
      ['Artwork inputs', 'Vector logo, brand colours, language, barcode or QR, legal text and dimensions. Raster logos are checked for quality before artwork begins.'],
      ['Pack format options', 'Labels, backing cards, care cards, pouches, retail boxes. Each adds structure, material and print decisions.'],
      ['Market requirements', 'UK/EU language and any mandatory pack information. Confirm per destination so the pack clears the market.']
    ],
    faqs: [
      ['What file should I send?', 'A vector file (AI, EPS, SVG or print-ready PDF). Raster quality is checked first.'],
      ['Is there a fixed packaging MOQ?', 'No — it depends on structure, material, print and quantity, confirmed after the brief.'],
      ['Can packaging be approved separately?', 'Yes, as its own reference alongside the product specification.']
    ],
    related: ['private-label-wig-supplier-uk', 'starting-a-hair-brand-checklist', 'custom-hair-colour-matching']
  },
  {
    slug: 'hair-extensions-lead-time',
    title: 'Hair Extensions Lead Time: Sampling vs Production',
    description: 'How lead times work for hair extensions, and why sampling and production windows are quoted separately.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Hair extensions lead time, two clocks.',
    intro: 'Sampling and production are different windows. Treat them as two separate clocks and put both in writing.',
    sections: [
      ['Two clocks', 'Sampling and production do not run on the same timeline. Assuming they match is how launches slip.'],
      ['Sampling window', 'Driven by construction complexity and colour matching. Simple stock lines are faster than bespoke builds.'],
      ['Production window', 'Driven by order volume, material availability and custom packaging. It is quoted per order, not assumed.'],
      ['Keep it written', 'Both windows appear in your quotation. If a window is only "verbal", treat it as unknown.']
    ],
    faqs: [
      ['How long is sampling?', 'A few working days to a couple of weeks by construction.'],
      ['Why is production longer?', 'Volume, material and custom packaging add time beyond sampling.'],
      ['Can I expedite?', 'Discuss at brief stage. Express sample shipping to the UK/EU is about 3–5 working days.']
    ],
    related: ['wholesale-hair-extensions-moq', 'wig-sampling-process', 'wholesale-wig-shipping-uk-eu']
  },
  {
    slug: 'starting-a-hair-brand-checklist',
    title: 'Starting a Hair Brand: A B2B Checklist',
    description: 'The sourcing and specification steps to launch a hair brand, from first sample to repeatable reference.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Starting a hair brand, checklist.',
    intro: 'You do not need your own factory to launch a hair brand. You need a coherent brief, approved references and written commercial terms.',
    sections: [
      ['Define the brand before the product', 'Wearer, price tier, channel and range shape. A clear brand brief makes supplier answers useful.'],
      ['Pick a development pathway', 'Private label versus bespoke. Right-size to launch; you can deepen the programme later.'],
      ['Approve references', 'Product and packaging each get an approved sample. Two references, not one vague "ok".'],
      ['Confirm commercial terms', 'MOQ, lead time, price and shipping in writing before you scale beyond the first run.']
    ],
    faqs: [
      ['Do I need my own factory?', 'No — a private-label or OEM supplier coordinates manufacturing for you.'],
      ['What is the first deliverable?', 'An approved sample reference, not a bulk order.'],
      ['How many SKUs to start?', 'Fewer, coherent SKUs beat a wide untested range.']
    ],
    related: ['private-label-wig-supplier-uk', 'private-label-packaging-requirements', 'hair-topper-vs-wig']
  },
  {
    slug: 'remy-human-hair-supplier',
    title: 'What "Remy Human Hair" Means When Sourcing B2B',
    description: 'Cut through the Remy label: what it should mean for wholesale, and what to verify with a supplier.',
    eyebrow: 'BUYER GUIDE',
    h1: 'What "Remy" should mean when you source.',
    intro: 'Remy is one of the most loosely used words in hair. A sample and a reference are the only real check.',
    sections: [
      ['The claim', 'Remy means cuticle-aligned human hair. Properly done, it tangles less and behaves more like natural hair.'],
      ['Why verification matters', 'The term is used loosely across the trade. A supplier’s label is not proof; a sample is.'],
      ['What to confirm', 'Grade, processing, and how cuticle alignment is maintained per batch. Ask specifically, do not assume.'],
      ['Set the reference', 'Approve a representative Remy sample and keep it as the reorder standard. Re-check bulk against it.']
    ],
    faqs: [
      ['Is all Remy the same?', 'No — grade and processing vary. Verify by sample, not by the word.'],
      ['Does Remy cost more?', 'Typically yes; the value is in behaviour and longevity, not the label.'],
      ['How do I protect quality at reorder?', 'Keep an approved reference and re-check bulk against it.']
    ],
    related: ['human-hair-vs-synthetic-extensions', 'hair-extensions-quality-checklist', 'wig-sampling-process']
  },
  {
    slug: 'hair-topper-vs-wig',
    title: 'Hair Topper vs Wig: Which to Stock for Your Market',
    description: 'A buying-side comparison of hair toppers and wigs to help salons and distributors choose their assortment.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Hair topper vs wig: which to stock.',
    intro: 'Toppers and wigs solve different problems. Stocking both tiers — with a clear reason for each — usually converts better than guessing.',
    sections: [
      ['Coverage difference', 'Toppers target partial coverage (crown or thinning areas). Wigs cover the full head.'],
      ['Wearer profile', 'Toppers suit thinning or top-of-head concerns. Wigs suit full-coverage needs.'],
      ['Assortment strategy', 'Toppers often convert salon clients first; wigs follow as needs grow. Stock both with intent.'],
      ['Specification overlap', 'The same base decisions — fibre, colour, density — apply to both, so a shared colour system helps.']
    ],
    faqs: [
      ['Which should a new salon stock first?', 'Often toppers, then wigs as clients mature.'],
      ['Are toppers cheaper?', 'Usually lower unit cost than full wigs; margin differs by tier.'],
      ['Can both be private-label?', 'Yes, with shared colour and packaging systems.']
    ],
    related: ['oem-hair-topper-manufacturer', 'hair-extensions-supplier-certifications', 'starting-a-hair-brand-checklist']
  },
  {
    slug: 'wholesale-wig-shipping-uk-eu',
    title: 'Wholesale Wig Shipping to the UK & EU: Timelines and Terms',
    description: 'How wig orders ship to the UK and EU, sample versus bulk routes, and the terms to confirm before ordering.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Wholesale wig shipping to the UK & EU.',
    intro: 'Shipping is two routes — sample and bulk — with different speed and cost. Confirm the terms, not the assumption.',
    sections: [
      ['Sample shipping', 'DHL/UPS express, China to UK/EU in about 3–5 working days. Fast enough to keep development moving.'],
      ['Bulk shipping', 'Air or sea to optimise cost. Timing and cost are confirmed per order volume.'],
      ['Incoterms', 'Confirm who handles freight and risk at each stage. The term decides where your cost and responsibility start.'],
      ['Plan around both clocks', 'Sample approval precedes bulk, so start the sample clock early — shipping is rarely the bottleneck.']
    ],
    faqs: [
      ['How fast are samples?', 'About 3–5 working days express to the UK and EU.'],
      ['Sea or air for bulk?', 'Depends on urgency versus cost; both are supported.'],
      ['Who arranges customs?', 'Confirmed via Incoterms in your quotation.']
    ],
    related: ['hair-extensions-lead-time', 'wig-sampling-process', 'private-label-wig-supplier-uk']
  },
  {
    slug: 'custom-hair-colour-matching',
    title: 'Custom Hair Colour Matching for Private Label',
    description: 'How custom colour matching works for private-label hair, from shade reference to repeatable colour.',
    eyebrow: 'BUYER GUIDE',
    h1: 'Custom hair colour matching.',
    intro: 'Colour is where private-label ranges win or drift. Start from a physical reference and keep an approved shade as the standard.',
    sections: [
      ['Start from a reference', 'A physical shade reference beats a screen colour. Screens lie about hair tone and depth.'],
      ['Colour systems', 'Structured charts — for example a 31-shade system — make repeats consistent across batches and seasons.'],
      ['Approval', 'Approve a physical colour reference and document the code. The code, not memory, drives reorder.'],
      ['Repeatability', 'Keep the approved shade as the reorder standard and re-check bulk against it.']
    ],
    faqs: [
      ['Can you match my brand colour?', 'Yes, against a physical reference. Screen colours are indicative only.'],
      ['How many shades to launch?', 'A focused, coherent set beats a sprawling untested one.'],
      ['Is colour stable at reorder?', 'With an approved reference, yes — re-check against it.']
    ],
    related: ['private-label-packaging-requirements', 'remy-human-hair-supplier', 'hair-extensions-quality-checklist']
  },
  {
    slug: 'hair-extensions-quality-checklist',
    title: 'Hair Extensions Quality Checklist Before You Reorder',
    description: 'The checks to run on a hair extensions sample before committing to a repeatable bulk reference.',
    eyebrow: 'BUYER GUIDE',
    h1: 'A pre-reorder quality checklist.',
    intro: 'Before bulk, run these checks on the sample and document the result. That document is what bulk is measured against.',
    sections: [
      ['Construction check', 'Weft or seam quality, clip or tape security, and how the piece lies against the head. Poor construction fails first.'],
      ['Fibre check', 'For human hair, cuticle alignment and behaviour. For synthetic, heat tolerance and style-hold.'],
      ['Colour check', 'Match to your approved shade reference, not a screen. Tone drift is the common reorder complaint.'],
      ['Reference it', 'Document the approved sample so bulk is judged against it, not against a photo from the listing.']
    ],
    faqs: [
      ['What is the first check?', 'Construction and how it wears, before colour.'],
      ['Do I need a lab?', 'Usually a documented sample reference is enough; formal tests are available on request.'],
      ['How do I avoid drift at reorder?', 'Re-check bulk against the approved reference, not against memory.']
    ],
    related: ['wig-sampling-process', 'remy-human-hair-supplier', 'hair-extensions-supplier-certifications']
  }
];

const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function faqSchema(g) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: g.faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }))
  };
}

function buildGuide(g) {
  const url = `${base}/${g.slug}.html`;
  const relatedLinks = g.related.map((slug) => {
    const target = guides.find((x) => x.slug === slug);
    const label = target ? target.title : slug;
    return `<li><a href="${slug}.html">${esc(label)}</a></li>`;
  }).join('');
  const sections = g.sections.map(([h2, body]) => `<section class="content-section"><div class="section-heading"><div><h2>${esc(h2)}</h2></div><p>${esc(body)}</p></div></section>`).join('');
  const faqs = g.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(g.title)}</title>
  <meta name="description" content="${esc(g.description)}">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index,follow">
  <meta property="og:title" content="${esc(g.title)}">
  <meta property="og:description" content="${esc(g.description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="DS HAIR | WigExporter">
  <meta property="og:locale" content="en_GB">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(g.title)}">
  <meta name="twitter:description" content="${esc(g.description)}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css?v=${VERSION}">
  <link rel="stylesheet" href="content.css?v=${VERSION}">
</head>
<body>
  <div class="notice">Buyer guide · Wholesale · OEM · Private label</div>
  <header class="site-header"><button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span></button><nav id="primary-nav" class="primary-nav" aria-label="Primary navigation"></nav><a class="wordmark" href="index.html" aria-label="DS HAIR home"><strong>DS HAIR</strong><span>WIGEXPORTER · GLOBAL B2B</span></a><div class="header-tools"><a class="trade-link" href="trade-account.html">TRADE ACCOUNT</a><a class="quote-link" href="contact.html">REQUEST QUOTE</a></div></header>
  <main>
    <section class="page-hero"><div><p class="eyebrow">${esc(g.eyebrow)}</p><h1>${esc(g.h1)}</h1></div><p>${esc(g.intro)}</p></section>
${sections}
    <section class="content-section"><div class="section-heading"><div><p class="eyebrow">QUESTIONS BUYERS ASK</p><h2>Before you shortlist a supplier.</h2></div></div><div class="faq-list">${faqs}</div></section>
    <section class="content-section"><div class="section-heading"><div><p class="eyebrow">RELATED BUYER GUIDES</p><h2>Keep reading.</h2></div></div><ul class="tick-list">${relatedLinks}</ul><p class="form-note full">Ready to discuss a specification? <a href="trade-account.html">Apply for a trade account</a> or <a href="contact.html">contact the sourcing team</a>. See our <a href="trade-account.html#faq">Trade Account FAQ</a> for MOQ, lead time, certification and shipping.</p></section>
  </main>
  <footer class="site-footer"></footer>
  <script type="application/ld+json">${JSON.stringify(faqSchema(g))}</script>
  <script src="script.js?v=${VERSION}"></script>
</body>
</html>`;
}

for (const g of guides) {
  fs.writeFileSync(path.join(root, `${g.slug}.html`), buildGuide(g));
}
console.log(`Generated ${guides.length} buyer-guide pages.`);
