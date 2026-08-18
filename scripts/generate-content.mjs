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
const UI_LANG = lang || 'en';
const UI = {
  en: {
    home: 'Home', collections: 'Collections', b2bWholesale: 'B2B WHOLESALE',
    requestSpecification: 'REQUEST A SPECIFICATION', discussSamples: 'DISCUSS SAMPLES',
    atAGlance: 'AT A GLANCE', whatCanBuyersSource: 'What can professional buyers source?',
    selectedReferences: 'SELECTED PRODUCT REFERENCES', reviewApprovedImagery: 'Review products with approved local imagery.',
    imageryDisclaimer: 'Images have passed visual review. Product specifications, availability, MOQ, price and lead time remain subject to written confirmation.',
    productReferences: 'PRODUCT REFERENCES', reviewDocumentedReference: 'Review a documented product reference.',
    documentedReferenceNote: 'Each page separates confirmed facts from details that still require specification review.',
    buyerBrief: 'BUYER BRIEF', defineDetails: 'Define the details that control the result.',
    availabilityNote: 'Final availability, minimum quantities, price and lead time depend on the confirmed product specification.',
    b2bProcess: 'B2B PROCESS', processHeadline: 'From buying requirement to approved reference.',
    processSteps: [
      ['Share the market brief', 'Buyer, channel, product direction and quantity range.'],
      ['Clarify the specification', 'Construction, material, colour and presentation.'],
      ['Review representative samples', 'Record approvals and required corrections.'],
      ['Confirm commercial terms', 'Quotation, production details and reorder reference.']
    ],
    buyerQuestions: 'BUYER QUESTIONS', frequentlyAsked: 'Frequently asked questions',
    startRequirement: 'START WITH YOUR REQUIREMENT', planningRange: 'Planning a wholesale or private-label range?',
    buyingBriefPrompt: 'Tell us the product, market and expected quantity. We will identify the next information needed for a useful sourcing discussion.',
    sendBuyingBrief: 'SEND YOUR BUYING BRIEF',
    viewProductReference: 'VIEW PRODUCT REFERENCE', requestVerifiedSpec: 'REQUEST VERIFIED SPECIFICATION',
    limitedImageReference: 'LIMITED IMAGE REFERENCE', approvedImages: 'APPROVED IMAGES', b2bEnquiry: 'B2B ENQUIRY',
    referenceSingular: 'reference', referencePlural: 'references',
    tradeAccount: 'TRADE ACCOUNT', requestQuote: 'REQUEST QUOTE',
    notice: 'B2B wholesale · Samples · OEM & private label', noticeCta: 'Discuss your requirement →',
    skipToContent: 'Skip to content', openNavigation: 'Open navigation',
    applyGuide: 'APPLY THE GUIDE', turnIdeaIntoBrief: 'Turn your product idea into a clear buying brief.',
    guidePrompt: 'Share the target market, product direction and quantity range. We will identify what should be clarified before samples or quotation.',
    contactSourcingTeam: 'CONTACT THE SOURCING TEAM', inThisGuide: 'IN THIS GUIDE',
    buyerSummary: 'Buyer summary:', questionsBuyersAsk: 'Questions buyers ask',
    editorialTeam: 'DS HAIR Editorial Team · Updated 18 July 2026', buyerGuide: 'BUYER GUIDE'
  },
  es: {
    home: 'Inicio', collections: 'Colecciones', b2bWholesale: 'VENTA AL POR MAYOR B2B',
    requestSpecification: 'SOLICITAR ESPECIFICACIÓN', discussSamples: 'CONSULTAR MUESTRAS',
    atAGlance: 'DE UN VISTAZO', whatCanBuyersSource: '¿Qué pueden abastecer los compradores profesionales?',
    selectedReferences: 'REFERENCIAS DE PRODUCTOS SELECCIONADAS', reviewApprovedImagery: 'Revise productos con imágenes locales aprobadas.',
    imageryDisclaimer: 'Las imágenes han pasado la revisión visual. Especificaciones, disponibilidad, MOQ, precio y plazo de entrega quedan sujetos a confirmación por escrito.',
    productReferences: 'REFERENCIAS DE PRODUCTOS', reviewDocumentedReference: 'Revise una referencia documentada.',
    documentedReferenceNote: 'Cada página separa los datos confirmados de los detalles que aún requieren revisión de especificación.',
    buyerBrief: 'BRIEF DEL COMPRADOR', defineDetails: 'Defina los detalles que controlan el resultado.',
    availabilityNote: 'La disponibilidad final, cantidades mínimas, precio y plazo dependen de la especificación confirmada.',
    b2bProcess: 'PROCESO B2B', processHeadline: 'De la necesidad de compra a la referencia aprobada.',
    processSteps: [
      ['Comparta el brief de mercado', 'Comprador, canal, dirección del producto y rango de cantidad.'],
      ['Aclare la especificación', 'Construcción, material, color y presentación.'],
      ['Revise muestras representativas', 'Registre aprobaciones y correcciones requeridas.'],
      ['Confirme términos comerciales', 'Cotización, detalles de producción y referencia de reorden.']
    ],
    buyerQuestions: 'PREGUNTAS DE COMPRADORES', frequentlyAsked: 'Preguntas frecuentes',
    startRequirement: 'EMPIECE CON SU REQUERIMIENTO', planningRange: '¿Planea una gama mayorista o de marca privada?',
    buyingBriefPrompt: 'Cuéntenos el producto, mercado y cantidad estimada. Identificaremos la información siguiente para una conversación útil.',
    sendBuyingBrief: 'ENVIAR BRIEF DE COMPRA',
    viewProductReference: 'VER REFERENCIA DE PRODUCTO', requestVerifiedSpec: 'SOLICITAR ESPECIFICACIÓN VERIFICADA',
    limitedImageReference: 'REFERENCIA DE IMAGEN LIMITADA', approvedImages: 'IMÁGENES APROBADAS', b2bEnquiry: 'CONSULTA B2B',
    referenceSingular: 'referencia', referencePlural: 'referencias',
    tradeAccount: 'CUENTA PROFESIONAL', requestQuote: 'SOLICITAR COTIZACIÓN',
    notice: 'Venta al por mayor B2B · Muestras · OEM y marca privada', noticeCta: 'Hablemos de su requerimiento →',
    skipToContent: 'Saltar al contenido', openNavigation: 'Abrir navegación',
    applyGuide: 'APLIQUE LA GUÍA', turnIdeaIntoBrief: 'Convierta su idea de producto en un brief claro.',
    guidePrompt: 'Comparta mercado objetivo, dirección del producto y rango de cantidad. Identificaremos qué aclarar antes de muestras o cotización.',
    contactSourcingTeam: 'CONTACTAR AL EQUIPO DE COMPRAS', inThisGuide: 'EN ESTA GUÍA',
    buyerSummary: 'Resumen para comprador:', questionsBuyersAsk: 'Preguntas frecuentes',
    editorialTeam: 'Equipo editorial DS HAIR · Actualizado el 18 de julio de 2026', buyerGuide: 'GUÍA DEL COMPRADOR'
  },
  de: {
    home: 'Startseite', collections: 'Kollektionen', b2bWholesale: 'B2B-GROßHANDEL',
    requestSpecification: 'SPEZIFIKATION ANFRAGEN', discussSamples: 'MUSTER BESPRECHEN',
    atAGlance: 'AUF EINEN BLICK', whatCanBuyersSource: 'Was können professionelle Käufer beziehen?',
    selectedReferences: 'AUSGEWÄHLTE PRODUKTREFERENZEN', reviewApprovedImagery: 'Produkte mit geprüften lokalen Bildern ansehen.',
    imageryDisclaimer: 'Bilder wurden visuell geprüft. Spezifikationen, Verfügbarkeit, MOQ, Preis und Lieferzeit bleiben schriftlicher Bestätigung vorbehalten.',
    productReferences: 'PRODUKTREFERENZEN', reviewDocumentedReference: 'Eine dokumentierte Referenz ansehen.',
    documentedReferenceNote: 'Jede Seite trennt bestätigte Fakten von Details, die noch einer Spezifikationsprüfung bedürfen.',
    buyerBrief: 'KÄUFERBRIEF', defineDetails: 'Definieren Sie die Details, die das Ergebnis steuern.',
    availabilityNote: 'Verfügbarkeit, Mindestmengen, Preis und Lieferzeit hängen von der bestätigten Produktspezifikation ab.',
    b2bProcess: 'B2B-PROZESS', processHeadline: 'Vom Einkaufsbedarf zur freigegebenen Referenz.',
    processSteps: [
      ['Marktbrief teilen', 'Käufer, Kanal, Produktausrichtung und Mengenbereich.'],
      ['Spezifikation klären', 'Konstruktion, Material, Farbe und Präsentation.'],
      ['Repräsentative Muster prüfen', 'Freigaben und erforderliche Korrekturen dokumentieren.'],
      ['Geschäftsbedingungen bestätigen', 'Angebot, Produktionsdetails und Wiederbestellreferenz.']
    ],
    buyerQuestions: 'KÄUFERFRAGEN', frequentlyAsked: 'Häufig gestellte Fragen',
    startRequirement: 'STARTEN SIE MIT IHREM BEDARF', planningRange: 'Planen Sie eine Großhandels- oder Eigenmarkenlinie?',
    buyingBriefPrompt: 'Teilen Sie Produkt, Markt und erwartete Menge mit. Wir ermitteln die nächsten Informationen für ein nützliches Sourcing-Gespräch.',
    sendBuyingBrief: 'KÄUFERBRIEF SENDEN',
    viewProductReference: 'PRODUKTREFERENZ ANSEHEN', requestVerifiedSpec: 'GEPRÜFTE SPEZIFIKATION ANFRAGEN',
    limitedImageReference: 'BEGRENZTE BILDREFERENZ', approvedImages: 'BILDER GEPRÜFT', b2bEnquiry: 'B2B-ANFRAGE',
    referenceSingular: 'Referenz', referencePlural: 'Referenzen',
    tradeAccount: 'HANDELSKONTO', requestQuote: 'ANGEBOT ANFRAGEN',
    notice: 'B2B-Großhandel · Muster · OEM & Eigenmarke', noticeCta: 'Anforderung besprechen →',
    skipToContent: 'Zum Inhalt springen', openNavigation: 'Navigation öffnen',
    applyGuide: 'LEITFADEN ANWENDEN', turnIdeaIntoBrief: 'Verwandeln Sie Ihre Produktidee in einen klaren Käuferbrief.',
    guidePrompt: 'Teilen Sie Zielmarkt, Produktausrichtung und Mengenbereich mit. Wir klären, was vor Muster oder Angebot geklärt werden muss.',
    contactSourcingTeam: 'SOURCING-TEAM KONTAKTIEREN', inThisGuide: 'IN DIESEM LEITFADEN',
    buyerSummary: 'Käuferzusammenfassung:', questionsBuyersAsk: 'Häufige Käuferfragen',
    editorialTeam: 'DS HAIR Redaktion · Aktualisiert am 18. Juli 2026', buyerGuide: 'KÄUFERLEITFADEN'
  },
  fr: {
    home: 'Accueil', collections: 'Collections', b2bWholesale: 'VENTE EN GROS B2B',
    requestSpecification: 'DEMANDER UNE SPÉCIFICATION', discussSamples: 'DISCUTER ÉCHANTILLONS',
    atAGlance: 'EN UN COUP D’ŒIL', whatCanBuyersSource: 'Que peuvent approvisionner les acheteurs professionnels ?',
    selectedReferences: 'RÉFÉRENCES PRODUIT SÉLECTIONNÉES', reviewApprovedImagery: 'Consultez les produits avec imagerie locale approuvée.',
    imageryDisclaimer: 'Les images ont passé la revue visuelle. Spécifications, disponibilité, MOQ, prix et délais restent soumis à confirmation écrite.',
    productReferences: 'RÉFÉRENCES PRODUIT', reviewDocumentedReference: 'Consultez une référence documentée.',
    documentedReferenceNote: 'Chaque page sépare les faits confirmés des détails nécessitant encore une revue de spécification.',
    buyerBrief: 'BRIEF ACHETEUR', defineDetails: 'Définissez les détails qui contrôlent le résultat.',
    availabilityNote: 'Disponibilité finale, quantités minimales, prix et délais dépendent de la spécification confirmée.',
    b2bProcess: 'PROCESSUS B2B', processHeadline: 'Du besoin d’achat à la référence approuvée.',
    processSteps: [
      ['Partagez le brief marché', 'Acheteur, canal, direction produit et plage de quantité.'],
      ['Précisez la spécification', 'Construction, matériau, couleur et présentation.'],
      ['Examinez les échantillons représentatifs', 'Enregistrez les validations et corrections requises.'],
      ['Confirmez les conditions commerciales', 'Devis, détails de production et référence de réapprovisionnement.']
    ],
    buyerQuestions: 'QUESTIONS ACHETEURS', frequentlyAsked: 'Questions fréquentes',
    startRequirement: 'COMMENCEZ PAR VOTRE BESOIN', planningRange: 'Vous planifiez une gamme en gros ou en marque privée ?',
    buyingBriefPrompt: 'Indiquez le produit, le marché et la quantité estimée. Nous identifierons les prochaines informations pour un échange utile.',
    sendBuyingBrief: 'ENVOYER LE BRIEF ACHETEUR',
    viewProductReference: 'VOIR LA RÉFÉRENCE PRODUIT', requestVerifiedSpec: 'DEMANDER UNE SPÉCIFICATION VÉRIFIÉE',
    limitedImageReference: 'RÉFÉRENCE IMAGE LIMITÉE', approvedImages: 'IMAGES APPROUVÉES', b2bEnquiry: 'DEMANDE B2B',
    referenceSingular: 'référence', referencePlural: 'références',
    tradeAccount: 'COMPTE PROFESSIONNEL', requestQuote: 'DEMANDER UN DEVIS',
    notice: 'Vente en gros B2B · Échantillons · OEM & marque privée', noticeCta: 'Discuter de votre besoin →',
    skipToContent: 'Aller au contenu', openNavigation: 'Ouvrir la navigation',
    applyGuide: 'APPLIQUER LE GUIDE', turnIdeaIntoBrief: 'Transformez votre idée produit en un brief clair.',
    guidePrompt: 'Partagez marché cible, direction produit et plage de quantité. Nous préciserons ce qui doit être clarifié avant échantillons ou devis.',
    contactSourcingTeam: 'CONTACTER L’ÉQUIPE SOURCING', inThisGuide: 'DANS CE GUIDE',
    buyerSummary: 'Résumé acheteur :', questionsBuyersAsk: 'Questions fréquentes',
    editorialTeam: 'Équipe éditoriale DS HAIR · Mis à jour le 18 juillet 2026', buyerGuide: 'GUIDE ACHETEUR'
  }
};
const _ = (key) => UI[UI_LANG][key] || UI.en[key];
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');
const VERSION = '20260818-1';
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

function refCount(n) {
  return `${n} ${n === 1 ? _('referenceSingular') : _('referencePlural')}`;
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
  const action = productPages[product.code] ? _('viewProductReference') : _('requestVerifiedSpec');
  const status = product.imageStatus === 'limited' ? _('limitedImageReference') : `${product.approvedImageCount} ${_('approvedImages')}`;
  return `<a class="catalog-product-card" href="${productPage}"><img src="${product.image}" alt="${esc(product.name)} product reference" decoding="async" loading="lazy"><div><span>${esc(product.code)}</span><h4>${esc(product.name)}</h4><p>${esc(status)} · ${_('b2bEnquiry')}</p><strong>${action} →</strong></div></a>`;
}

function catalogGroupCard(group, products) {
  const groupProducts = products.filter((product) => product.category === group);
  return `<article class="catalog-method-card" aria-labelledby="${slugify(group)}"><div class="catalog-group-heading"><h3 id="${slugify(group)}">${esc(group)}</h3><span>${refCount(groupProducts.length)}</span></div><div class="catalog-product-grid">${groupProducts.map(catalogProductCard).join('')}</div></article>`;
}

function catalogSection(item) {
  const products = catalogProductsFor(item);
  if (!products.length) return '';
  const groups = [...new Set(products.map((product) => product.category))];
  const isMethodGrid = groups.length > 1 && groups.every((group) => products.filter((product) => product.category === group).length === 1);
  return `<section class="catalog-products${isMethodGrid ? ' catalog-products--method-grid' : ''}">
    <div class="section-heading"><div><p class="eyebrow">${_('selectedReferences')}</p><h2>${_('reviewApprovedImagery')}</h2></div><p>${_('imageryDisclaimer')}</p></div>
    ${isMethodGrid ? `<div class="catalog-method-grid">${groups.map((group) => catalogGroupCard(group, products)).join('')}</div>` : groups.map((group) => `<section class="catalog-group" aria-labelledby="${slugify(group)}"><div class="catalog-group-heading"><h3 id="${slugify(group)}">${esc(group)}</h3><span>${refCount(products.filter((product) => product.category === group).length)}</span></div><div class="catalog-product-grid">${products.filter((product) => product.category === group).map(catalogProductCard).join('')}</div></section>`).join('')}
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
  <a class="skip-link" href="#main">${_('skipToContent')}</a>
  <div class="notice">${_('notice')} <a href="contact.html">${_('noticeCta')}</a></div>
  <header class="site-header"><button class="menu-toggle" type="button" aria-label="${_('openNavigation')}" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span></button><nav id="primary-nav" class="primary-nav" aria-label="Primary navigation"></nav><a class="wordmark" href="index.html" aria-label="DS HAIR home"><strong>DS HAIR</strong><span>WIGEXPORTER · GLOBAL B2B</span></a><div class="header-tools"><a class="trade-link" href="trade-account.html">${_('tradeAccount')}</a><a class="quote-link" href="contact.html">${_('requestQuote')}</a></div></header>
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
  const processSteps = _('processSteps').map(([ strong, span ]) => `<li><strong>${esc(strong)}</strong><span>${esc(span)}</span></li>`).join('');
  const main = `<main id="main">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">${_('home')}</a><span>›</span><a href="products.html">${_('collections')}</a><span>›</span><span>${esc(item.title)}</span></nav>
    <section class="collection-hero"><div><p class="eyebrow">${esc(item.division)} · ${_('b2bWholesale')}</p><h1>${esc(item.title)}</h1><p>${esc(item.intro)}</p><div class="button-row"><a class="button button-dark" href="contact.html">${_('requestSpecification')}</a><a class="button button-light" href="sample.html">${_('discussSamples')}</a></div></div><img src="${item.image}" alt="${esc(item.imageAlt)}"></section>
    <section class="answer-block"><p class="eyebrow">${_('atAGlance')}</p><h2>${_('whatCanBuyersSource')}</h2>${productScope(item)}</section>
    ${catalogSection(item)}
    ${!catalogProductsFor(item).length && item.featuredProducts?.length ? `<section class="featured-products"><div class="section-heading"><div><p class="eyebrow">${_('productReferences')}</p><h2>${_('reviewDocumentedReference')}</h2></div><p>${_('documentedReferenceNote')}</p></div><div class="featured-product-grid">${item.featuredProducts.map((product) => `<a class="featured-product-card" href="${product.slug}.html"><img src="${product.image}" alt="${esc(product.imageAlt)}" decoding="async" loading="lazy"><div><span>${esc(product.code)}</span><h3>${esc(product.title)}</h3><p>${esc(product.summary)}</p><strong>${_('viewProductReference')} →</strong></div></a>`).join('')}</div></section>` : ''}
    <section class="content-section"><div class="section-heading"><div><p class="eyebrow">${_('buyerBrief')}</p><h2>${_('defineDetails')}</h2></div><p>${_('availabilityNote')}</p></div><div class="spec-grid">${item.specs.map(([name, text], index) => `<article><span>0${index + 1}</span><h3>${esc(name)}</h3><p>${esc(text)}</p></article>`).join('')}</div></section>
    <section class="process-band"><div><p class="eyebrow">${_('b2bProcess')}</p><h2>${_('processHeadline')}</h2></div><ol>${processSteps}</ol></section>
    <section class="faq-section"><div><p class="eyebrow">${_('buyerQuestions')}</p><h2>${_('frequentlyAsked')}</h2></div><div class="faq-list">${item.faqs.map(([name, text]) => `<details><summary>${esc(name)}</summary><p>${esc(text)}</p></details>`).join('')}</div></section>
    <section class="final-cta"><p class="eyebrow">${_('startRequirement')}</p><h2>${_('planningRange')}</h2><p>${_('buyingBriefPrompt')}</p><a class="button button-light" href="contact.html">${_('sendBuyingBrief')}</a></section>
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
      .replace(/"script\.js/g, '"/script.js')
      .replace(/"favicon\.svg/g, '"/favicon.svg')
      .replace(/"category-layout\.css/g, '"/category-layout.css')
      .replace(/"homepage-layout\.css/g, '"/homepage-layout.css')
      .replace(/"colour-packaging\.css/g, '"/colour-packaging.css')
      .replace(/"colour-packaging\.js/g, '"/colour-packaging.js')
      .replace(/"customization\.css/g, '"/customization.css')
      .replace(/"assets\//g, '"/assets/')
      .replace(/href="(index|products|trade-account|contact|synthetic-wigs-hairpieces)\.html"/g, 'href="/$1.html"')
      .replace('<div class="header-tools">', '<div class="header-tools">' + langSwitch(item.slug, lang))
      .replace('</head>', hreflangBlock(item.slug) + '\n' + LANG_SWITCH_STYLE + '\n</head>');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${item.slug}.html`), finalHtml);
  } else {
    finalHtml = finalHtml
      .replace('<div class="header-tools">', '<div class="header-tools">' + langSwitch(item.slug, 'en'))
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
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">${_('home')}</a><span>›</span><a href="blog.html">Blog</a><span>›</span><span>${esc(article.category)}</span></nav>
    <article class="editorial">
      <header class="article-hero"><div><p class="eyebrow">${esc(article.category)} · ${_('buyerGuide')}</p><h1>${esc(article.title)}</h1><p>${esc(article.dek)}</p><span>${_('editorialTeam')}</span></div><img src="${article.image}" alt="${esc(article.imageAlt)}"></header>
      <div class="article-layout"><aside><strong>${_('inThisGuide')}</strong>${article.sections.map(([name], index) => `<a href="#section-${index + 1}">${esc(name)}</a>`).join('')}${article.slug === 'build-repeatable-hair-colour-system' ? '<a class="article-cta" href="hair-colour-chart-custom-packaging.html">Browse all 31 DS HAIR colours →</a>' : ''}<a class="article-cta" href="contact.html">Discuss a sourcing requirement →</a></aside><div class="article-body"><p class="article-summary"><strong>${_('buyerSummary')}</strong> ${esc(article.description)}</p>${article.sections.map(([name, text], index) => `<section id="section-${index + 1}"><h2>${esc(name)}</h2><p>${esc(text)}</p>${article.slug === 'build-repeatable-hair-colour-system' && index === 1 ? '<p><a href="hair-colour-chart-custom-packaging.html">Explore the 31-shade DS HAIR Colour Chart 2 and physical-reference workflow →</a></p>' : ''}</section>`).join('')}<section><h2>${_('questionsBuyersAsk')}</h2><div class="faq-list">${article.faqs.map(([name, text]) => `<details><summary>${esc(name)}</summary><p>${esc(text)}</p></details>`).join('')}</div></section></div></div>
    </article>
    <section class="final-cta"><p class="eyebrow">${_('applyGuide')}</p><h2>${_('turnIdeaIntoBrief')}</h2><p>${_('guidePrompt')}</p><a class="button button-light" href="contact.html">${_('contactSourcingTeam')}</a></section>
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
      .replace(/"script\.js/g, '"/script.js')
      .replace(/"favicon\.svg/g, '"/favicon.svg')
      .replace(/"category-layout\.css/g, '"/category-layout.css')
      .replace(/"homepage-layout\.css/g, '"/homepage-layout.css')
      .replace(/"colour-packaging\.css/g, '"/colour-packaging.css')
      .replace(/"colour-packaging\.js/g, '"/colour-packaging.js')
      .replace(/"customization\.css/g, '"/customization.css')
      .replace(/"assets\//g, '"/assets/')
      .replace(/href="(index|products|trade-account|contact|synthetic-wigs-hairpieces)\.html"/g, 'href="/$1.html"')
      .replace('<div class="header-tools">', '<div class="header-tools">' + langSwitch(article.slug, lang))
      .replace('</head>', hreflangBlock(article.slug) + '\n' + LANG_SWITCH_STYLE + '\n</head>');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${article.slug}.html`), finalHtml);
  } else {
    finalHtml = finalHtml
      .replace('<div class="header-tools">', '<div class="header-tools">' + langSwitch(article.slug, 'en'))
      .replace('</head>', hreflangBlock(article.slug) + '\n' + LANG_SWITCH_STYLE + '\n</head>');
    fs.writeFileSync(path.join(root, `${article.slug}.html`), finalHtml);
  }
}

console.log(`Generated ${data.collections.length} collection pages and ${data.articles.length} buyer guides.`);
