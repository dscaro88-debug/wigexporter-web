import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localeIdx = process.argv.indexOf('--locale');
const lang = localeIdx !== -1 ? process.argv[localeIdx + 1] : null;
const contentDir = lang ? path.join(root, 'content', lang) : path.join(root, 'content');
let products;
try {
  products = JSON.parse(fs.readFileSync(path.join(contentDir, 'products.json'), 'utf8'));
} catch {
  products = JSON.parse(fs.readFileSync(path.join(root, 'content', 'products.json'), 'utf8'));
}
const colourCharts = JSON.parse(fs.readFileSync(path.join(root, 'content', 'colors.json'), 'utf8'));
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

const UI = {
  en: {
    skipToContent: 'Skip to content', openNavigation: 'Open navigation', tradeAccount: 'TRADE ACCOUNT',
    requestQuote: 'REQUEST QUOTE', home: 'Home', collections: 'Collections', discussRequirement: 'Discuss your requirement →',
    productCode: 'PRODUCT CODE · ', specBasedNoSku: 'SPECIFICATION-BASED PRODUCT · NO SKU',
    discussSample: 'DISCUSS A SAMPLE', enquireWhatsApp: 'Enquire via WhatsApp',
    accuracyNote: 'Commercial terms and unconfirmed technical details are provided only after specification review.',
    buyerAnswer: 'BUYER ANSWER', whatIsThisFor: 'What is this product for?',
    evaluationPoints: 'EVALUATION POINTS', whatVerify: 'What your team should verify.',
    evaluateHint: 'Use a representative sample to turn visual impressions into an approved, repeatable product reference.',
    specificationStatus: 'SPECIFICATION STATUS', specStatusDesc: 'Confirmed facts, clearly separated from open items.',
    specStatusNote: 'DS HAIR does not publish assumptions as product specifications. Open items are confirmed against the selected supply batch and quotation.',
    confirmedOnReference: 'Confirmed on this reference', toConfirmBeforeOrder: 'To confirm before order',
    oemPrivateLabel: 'OEM / PRIVATE LABEL', oemHeading: 'Build the specification around your market.',
    exploreCustomPackaging: 'EXPLORE CUSTOM PACKAGING', buyerQuestions: 'BUYER QUESTIONS', beforeYouRequest: 'Before you request a quote',
    reference: 'REFERENCE · ', productBrief: 'PRODUCT BRIEF · NO SKU', sendBuyingBrief: 'SEND YOUR BUYING BRIEF',
    referenceShown: 'REFERENCE SHOWN', requestToConfirm: 'REQUEST TO CONFIRM',
    clipInRangeTier: 'CLIP-IN RANGE BY MARKET TIER', clipInHeading: 'Three demand tiers. Three different volume and margin profiles.',
    clipInIntro: 'Build a clip-in programme around what actually sells: proven full-set classics, fast-rising seamless constructions, and low-competition halo-wire pieces. Each tier uses the same 100% Remy human hair base; the difference is construction, wearer profile and specification.',
    includes: 'Includes', typicalSpec: 'Typical spec', weightGuidance: 'Weight guidance', whyStock: 'Why stock it', buildThisProduct: 'BUILD THIS PRODUCT →',
    verifiedSetMaps: 'VERIFIED SET MAPS', setMapHeading: 'Know exactly what is inside each full set.',
    setMapIntro: 'These piece maps come from the existing DS HAIR product record. Final grams, construction, length and colour are confirmed with the selected sample.',
    quantity: 'Quantity', weftWidth: 'Weft width', clipLayout: 'Clip layout',
    buildBrief: 'BUILD YOUR BUYING BRIEF', buildBriefHeading: 'Select the specification you want us to review.',
    buildBriefIntro: 'These controls prepare an enquiry; they do not indicate live stock. Final feasibility, MOQ, price and lead time are confirmed in writing.',
    yourSpec: 'YOUR REQUESTED SPECIFICATION', colour: 'Colour', selectShade: 'Select a Colour Chart 2 shade',
    specSummaryStatus: 'Reference selections are photographed or documented. Other selections remain requests until confirmed.',
    sendThisSpec: 'SEND THIS SPECIFICATION', primaryColourSystem: 'PRIMARY COLOUR SYSTEM', requestColourKit: 'REQUEST A PHYSICAL COLOUR KIT →',
    allThirtyOne: 'All 31', scrollHint: 'Scroll horizontally to compare methods →',
    similarComparison: 'SIMILAR PRODUCT COMPARISON', buyerQuestion: 'Buyer question',
    productSelectionLogic: 'PRODUCT SELECTION LOGIC', completeDefinition: 'THE COMPLETE PRODUCT DEFINITION',
    sixLayers: 'Six layers make one repeatable specification.', sixLayersIntro: 'A catalogue name is not enough. These six layers must agree before sample approval and quotation.',
    constructionKnowledge: 'CONSTRUCTION KNOWLEDGE', decisionPoint: 'Decision point',
    dsHairDifference: 'THE DS HAIR DIFFERENCE', dsHairHeading: 'A structured sourcing process, not an unsupported quality claim.',
    dsHairIntro: 'We compare the way a project is managed—not make unverified statements about another supplier’s hair.',
    structuredWorkflow: 'DS HAIR structured workflow', unstructuredRisk: 'Unstructured sourcing risk',
    proKnowledge: 'PROFESSIONAL PRODUCT KNOWLEDGE', proKnowledgeHeading: 'Use the page to make a better buying decision.',
    proKnowledgeIntro: 'Practical guidance for salons, distributors and private-label teams. Product-specific claims still require sample approval.',
    relatedDirections: 'RELATED DEVELOPMENT DIRECTIONS', discussThisProduct: 'DISCUSS THIS PRODUCT →', relatedHeading: 'Build a coherent extension range.', relatedIntro: 'These are enquiry pathways, not live-stock listings. Each product requires its own specification and sample reference.'
  },
  es: {
    skipToContent: 'Saltar al contenido', openNavigation: 'Abrir navegación', tradeAccount: 'CUENTA PROFESIONAL',
    requestQuote: 'SOLICITAR COTIZACIÓN', home: 'Inicio', collections: 'Colecciones', discussRequirement: 'Comente su requisito →',
    productCode: 'CÓDIGO DE PRODUCTO · ', specBasedNoSku: 'PRODUCTO SEGÚN ESPECIFICACIÓN · SIN SKU',
    discussSample: 'CONSULTAR UNA MUESTRA', enquireWhatsApp: 'Consultar por WhatsApp',
    accuracyNote: 'Los términos comerciales y los detalles técnicos sin confirmar se facilitan solo tras la revisión de la especificación.',
    buyerAnswer: 'RESPUESTA DEL COMPRADOR', whatIsThisFor: '¿Para qué sirve este producto?',
    evaluationPoints: 'PUNTOS DE EVALUACIÓN', whatVerify: 'Qué debe verificar su equipo.',
    evaluateHint: 'Use una muestra representativa para convertir las impresiones visuales en una referencia de producto aprobada y repetible.',
    specificationStatus: 'ESTADO DE LA ESPECIFICACIÓN', specStatusDesc: 'Hechos confirmados, claramente separados de los puntos abiertos.',
    specStatusNote: 'DS HAIR no publica suposiciones como especificaciones de producto. Los puntos abiertos se confirman con el lote de suministro seleccionado y la cotización.',
    confirmedOnReference: 'Confirmado en esta referencia', toConfirmBeforeOrder: 'Por confirmar antes del pedido',
    oemPrivateLabel: 'OEM / MARCA PRIVADA', oemHeading: 'Construya la especificación según su mercado.',
    exploreCustomPackaging: 'EXPLORAR EMBALAJE PERSONALIZADO', buyerQuestions: 'PREGUNTAS DEL COMPRADOR', beforeYouRequest: 'Antes de solicitar una cotización',
    reference: 'REFERENCIA · ', productBrief: 'FICHA DE PRODUCTO · SIN SKU', sendBuyingBrief: 'ENVIAR SU FICHA DE COMPRA',
    referenceShown: 'REFERENCIA MOSTRADA', requestToConfirm: 'SOLICITAR CONFIRMACIÓN',
    clipInRangeTier: 'GAMA CLIP-IN POR NIVEL DE MERCADO', clipInHeading: 'Tres niveles de demanda. Tres perfiles distintos de volumen y margen.',
    clipInIntro: 'Construya un programa clip-in en torno a lo que realmente se vende: clásicos de juego completo probados, construcciones seamless en auge y piezas halo-wire de baja competencia. Cada nivel usa la misma base de cabello humano Remy 100%; la diferencia está en la construcción, el perfil de quien lo usa y la especificación.',
    includes: 'Incluye', typicalSpec: 'Especificación típica', weightGuidance: 'Guía de peso', whyStock: 'Por qué stockarlo', buildThisProduct: 'ARMAR ESTE PRODUCTO →',
    verifiedSetMaps: 'MAPAS DE JUEGO VERIFICADOS', setMapHeading: 'Sepa exactamente qué hay dentro de cada juego completo.',
    setMapIntro: 'Estos mapas de piezas provienen del registro de producto DS HAIR existente. Los gramos, la construcción, la longitud y el color finales se confirman con la muestra seleccionada.',
    quantity: 'Cantidad', weftWidth: 'Ancho de la trena', clipLayout: 'Distribución de clips',
    buildBrief: 'ARMAR SU FICHA DE COMPRA', buildBriefHeading: 'Seleccione la especificación que quiere que revisemos.',
    buildBriefIntro: 'Estos controles preparan una consulta; no indican stock en vivo. La viabilidad, el MOQ, el precio y el plazo se confirman por escrito.',
    yourSpec: 'SU ESPECIFICACIÓN SOLICITADA', colour: 'Color', selectShade: 'Seleccione un tono del Colour Chart 2',
    specSummaryStatus: 'Las selecciones de referencia se fotografían o documentan. Las demás selecciones siguen como solicitudes hasta confirmarse.',
    sendThisSpec: 'ENVIAR ESTA ESPECIFICACIÓN', primaryColourSystem: 'SISTEMA DE COLOR PRINCIPAL', requestColourKit: 'SOLICITAR UN KIT DE COLOR FÍSICO →',
    allThirtyOne: 'Todos los 31', scrollHint: 'Desplácese horizontalmente para comparar métodos →',
    similarComparison: 'COMPARACIÓN DE PRODUCTOS SIMILARES', buyerQuestion: 'Pregunta del comprador',
    productSelectionLogic: 'LÓGICA DE SELECCIÓN DE PRODUCTO', completeDefinition: 'LA DEFINICIÓN COMPLETA DEL PRODUCTO',
    sixLayers: 'Seis capas conforman una especificación repetible.', sixLayersIntro: 'Un nombre de catálogo no basta. Estas seis capas deben coincidir antes de la aprobación de la muestra y la cotización.',
    constructionKnowledge: 'CONOCIMIENTO DE CONSTRUCCIÓN', decisionPoint: 'Punto de decisión',
    dsHairDifference: 'LA DIFERENCIA DS HAIR', dsHairHeading: 'Un proceso de abastecimiento estructurado, no una afirmación de calidad sin respaldo.',
    dsHairIntro: 'Comparamos la forma en que se gestiona un proyecto, no hacemos afirmaciones sin verificar sobre el cabello de otro proveedor.',
    structuredWorkflow: 'Flujo de trabajo estructurado de DS HAIR', unstructuredRisk: 'Riesgo de abastecimiento no estructurado',
    proKnowledge: 'CONOCIMIENTO PROFESIONAL DEL PRODUCTO', proKnowledgeHeading: 'Use la página para tomar una mejor decisión de compra.',
    proKnowledgeIntro: 'Orientación práctica para salones, distribuidores y equipos de marca privada. Las afirmaciones específicas del producto requieren la aprobación de la muestra.',
    relatedDirections: 'LÍNEAS DE DESARROLLO RELACIONADAS', discussThisProduct: 'COMENTE ESTE PRODUCTO →', relatedHeading: 'Construya una gama de extensiones coherente.', relatedIntro: 'Estas son vías de consulta, no listados de stock en vivo. Cada producto requiere su propia especificación y referencia de muestra.'
  },
  de: {
    skipToContent: 'Zum Inhalt springen', openNavigation: 'Navigation öffnen', tradeAccount: 'HANDELSKONTO',
    requestQuote: 'ANGEBOT ANFRAGEN', home: 'Startseite', collections: 'Kollektionen', discussRequirement: 'Besprechen Sie Ihr Anliegen →',
    productCode: 'PRODUKTCODE · ', specBasedNoSku: 'PRODUKT NACH SPEZIFIKATION · OHNE SKU',
    discussSample: 'MUSTER BESPRECHEN', enquireWhatsApp: 'Über WhatsApp anfragen',
    accuracyNote: 'Handelsbedingungen und nicht bestätigte technische Details werden erst nach Prüfung der Spezifikation mitgeteilt.',
    buyerAnswer: 'KÄUFERANTWORT', whatIsThisFor: 'Wofür ist dieses Produkt?',
    evaluationPoints: 'BEWERTUNGSPUNKTE', whatVerify: 'Was Ihr Team prüfen sollte.',
    evaluateHint: 'Nutzen Sie eine repräsentative Probe, um visuelle Eindrücke in eine genehmigte, wiederholbare Produktreferenz zu verwandeln.',
    specificationStatus: 'SPECIFIKATIONSSTATUS', specStatusDesc: 'Bestätigte Fakten, klar von offenen Punkten getrennt.',
    specStatusNote: 'DS HAIR veröffentlicht keine Annahmen als Produktspezifikationen. Offene Punkte werden mit der ausgewählten Liefercharge und dem Angebot bestätigt.',
    confirmedOnReference: 'Bestätigt in dieser Referenz', toConfirmBeforeOrder: 'Vor Bestellung zu bestätigen',
    oemPrivateLabel: 'OEM / PRIVATE LABEL', oemHeading: 'Erstellen Sie die Spezifikation passend zu Ihrem Markt.',
    exploreCustomPackaging: 'INDIVIDUELLES VERPACKEN ENTDECKEN', buyerQuestions: 'KÄUFERFRAGEN', beforeYouRequest: 'Bevor Sie ein Angebot anfordern',
    reference: 'REFERENZ · ', productBrief: 'PRODUKTBRIEF · OHNE SKU', sendBuyingBrief: 'KAUFBRIEF SENDEN',
    referenceShown: 'REFERENZ ANGEZEIGT', requestToConfirm: 'BESTÄTIGUNG ANFORDERN',
    clipInRangeTier: 'CLIP-IN-SORTIMENT NACH MARKTSEGMENT', clipInHeading: 'Drei Nachfragestufen. Drei unterschiedliche Volumen- und Margenprofile.',
    clipInIntro: 'Bauen Sie ein Clip-in-Programm um das, was sich wirklich verkauft: bewährte Klassiker im vollen Satz, schnell wachsende nahtlose Konstruktionen und Stücke mit Halo-Draht bei geringer Konkurrenz. Jede Stufe verwendet dieselbe 100 % Remy Echthaarbasis; der Unterschied liegt in Konstruktion, Trägerprofil und Spezifikation.',
    includes: 'Enthält', typicalSpec: 'Typische Spezifikation', weightGuidance: 'Gewichtsleitfaden', whyStock: 'Warum führen', buildThisProduct: 'DIESES PRODUKT ERSTELLEN →',
    verifiedSetMaps: 'VERIFIZIERTE SET-KARTEN', setMapHeading: 'Wissen Sie genau, was in jedem vollen Satz enthalten ist.',
    setMapIntro: 'Diese Stückkarten stammen aus dem bestehenden DS HAIR Produktdatensatz. Endgültige Gramm, Konstruktion, Länge und Farbe werden mit der ausgewählten Probe bestätigt.',
    quantity: 'Menge', weftWidth: 'Webbreite', clipLayout: 'Clip-Anordnung',
    buildBrief: 'KAUFBRIEF ERSTELLEN', buildBriefHeading: 'Wählen Sie die Spezifikation, die wir prüfen sollen.',
    buildBriefIntro: 'Diese Steuerelemente bereiten eine Anfrage vor; sie bedeuten keinen Live-Bestand. Machbarkeit, MOQ, Preis und Lieferzeit werden schriftlich bestätigt.',
    yourSpec: 'IHRE ANGEFRAGTE SPEZIFIKATION', colour: 'Farbe', selectShade: 'Wählen Sie einen Ton der Colour Chart 2',
    specSummaryStatus: 'Referenzauswahlen werden fotografiert oder dokumentiert. Andere Auswahlen bleiben bis zur Bestätigung Anfragen.',
    sendThisSpec: 'DIESE SPEZIFIKATION SENDEN', primaryColourSystem: 'PRIMÄRES FARBSYSTEM', requestColourKit: 'PHYSISCHES FARBKIT ANFORDERN →',
    allThirtyOne: 'Alle 31', scrollHint: 'Horizontal scrollen, um Methoden zu vergleichen →',
    similarComparison: 'VERGLEICH ÄHNLICHER PRODUKTE', buyerQuestion: 'Käuferfrage',
    productSelectionLogic: 'PRODUKTAUSWAHL-LOGIK', completeDefinition: 'DIE VOLLSTÄNDIGE PRODUKTDEFINITION',
    sixLayers: 'Sechs Schichten ergeben eine wiederholbare Spezifikation.', sixLayersIntro: 'Ein Katalogname reicht nicht. Diese sechs Schichten müssen vor Mustergenehmigung und Angebot übereinstimmen.',
    constructionKnowledge: 'KONSTRUKTIONSWISSEN', decisionPoint: 'Entscheidungspunkt',
    dsHairDifference: 'DER DS HAIR UNTERSCHIED', dsHairHeading: 'Ein strukturierter Beschaffungsprozess, keine unbelegte Qualitätsbehauptung.',
    dsHairIntro: 'Wir vergleichen, wie ein Projekt gemanagt wird – nicht unbestätigte Aussagen über das Haar eines anderen Lieferanten.',
    structuredWorkflow: 'Strukturierter DS HAIR Arbeitsablauf', unstructuredRisk: 'Risiko unstrukturierter Beschaffung',
    proKnowledge: 'FACHWISSEN ZUM PRODUKT', proKnowledgeHeading: 'Nutzen Sie die Seite für eine bessere Kaufentscheidung.',
    proKnowledgeIntro: 'Praktische Hinweise für Salons, Distributoren und Private-Label-Teams. Produktspezifische Behauptungen erfordern die Mustergenehmigung.',
    relatedDirections: 'VERWANDTE ENTWICKLUNGSRICHTUNGEN', discussThisProduct: 'DIESES PRODUKT BESPRECHEN →', relatedHeading: 'Bauen Sie eine kohärente Extensions-Reihe auf.', relatedIntro: 'Dies sind Anfragewege, keine Live-Bestandslisten. Jedes Produkt benötigt eine eigene Spezifikation und Mustereferenz.'
  },
  fr: {
    skipToContent: 'Aller au contenu', openNavigation: 'Ouvrir la navigation', tradeAccount: 'COMPTE PROFESSIONNEL',
    requestQuote: 'DEMANDER UN DEVIS', home: 'Accueil', collections: 'Collections', discussRequirement: 'Discuter de votre besoin →',
    productCode: 'CODE PRODUIT · ', specBasedNoSku: 'PRODUIT SELON SPÉCIFICATION · SANS SKU',
    discussSample: 'ÉCHANGER SUR UN ÉCHANTILLON', enquireWhatsApp: 'Nous contacter sur WhatsApp',
    accuracyNote: 'Les conditions commerciales et les détails techniques non confirmés sont communiqués uniquement après examen de la spécification.',
    buyerAnswer: 'RÉPONSE DE L’ACTEUR'.replace('ACTEUR', 'ACHETEUR'), whatIsThisFor: 'À quoi sert ce produit ?',
    evaluationPoints: 'POINTS D’ÉVALUATION', whatVerify: 'Ce que votre équipe doit vérifier.',
    evaluateHint: 'Utilisez un échantillon représentatif pour transformer les impressions visuelles en une référence produit approuvée et reproductible.',
    specificationStatus: 'STATUT DE LA SPÉCIFICATION', specStatusDesc: 'Faits confirmés, clairement séparés des points ouverts.',
    specStatusNote: 'DS HAIR ne publie pas d’hypothèses comme spécifications produit. Les points ouverts sont confirmés avec le lot d’approvisionnement sélectionné et le devis.',
    confirmedOnReference: 'Confirmé sur cette référence', toConfirmBeforeOrder: 'À confirmer avant commande',
    oemPrivateLabel: 'OEM / MARQUE PRIVÉE', oemHeading: 'Construisez la spécification autour de votre marché.',
    exploreCustomPackaging: 'DÉCOUVRIR L’EMBALLAGE PERSONNALISÉ', buyerQuestions: 'QUESTIONS DE L’ACHETEUR', beforeYouRequest: 'Avant de demander un devis',
    reference: 'RÉFÉRENCE · ', productBrief: 'FICHE PRODUIT · SANS SKU', sendBuyingBrief: 'ENVOYER VOTRE FICHE D’ACHAT',
    referenceShown: 'RÉFÉRENCE AFFICHÉE', requestToConfirm: 'DEMANDER À CONFIRMER',
    clipInRangeTier: 'GAMME CLIP-IN PAR NIVEAU DE MARCHÉ', clipInHeading: 'Trois niveaux de demande. Trois profils de volume et de marge différents.',
    clipInIntro: 'Construisez un programme clip-in autour de ce qui se vend vraiment : classiques plein jeu éprouvés, constructions seamless en forte croissance et pièces halo-wire à faible concurrence. Chaque niveau utilise la même base 100 % cheveux humains Remy ; la différence tient à la construction, au profil de la porteuse et à la spécification.',
    includes: 'Comprend', typicalSpec: 'Spécification typique', weightGuidance: 'Guide de poids', whyStock: 'Pourquoi le stocker', buildThisProduct: 'CRÉER CE PRODUIT →',
    verifiedSetMaps: 'PLANS DE JEU VÉRIFIÉS', setMapHeading: 'Sachez exactement ce qui se trouve dans chaque jeu complet.',
    setMapIntro: 'Ces cartes de pièces proviennent de la fiche produit DS HAIR existante. Les grammes, la construction, la longueur et la couleur finaux sont confirmés avec l’échantillon sélectionné.',
    quantity: 'Quantité', weftWidth: 'Largeur de la tresse', clipLayout: 'Disposition des clips',
    buildBrief: 'CRÉER VOTRE FICHE D’ACHAT', buildBriefHeading: 'Sélectionnez la spécification que vous souhaitez nous faire examiner.',
    buildBriefIntro: 'Ces contrôles préparent une demande ; ils n’indiquent pas de stock en direct. Faisabilité, MOQ, prix et délai sont confirmés par écrit.',
    yourSpec: 'VOTRE SPÉCIFICATION DEMANDÉE', colour: 'Couleur', selectShade: 'Sélectionnez une teinte du Colour Chart 2',
    specSummaryStatus: 'Les sélections de référence sont photographiées ou documentées. Les autres sélections restent des demandes jusqu’à confirmation.',
    sendThisSpec: 'ENVOYER CETTE SPÉCIFICATION', primaryColourSystem: 'SYSTÈME DE COULEUR PRINCIPAL', requestColourKit: 'DEMANDER UN KIT DE COULEUR PHYSIQUE →',
    allThirtyOne: 'Tous les 31', scrollHint: 'Faites défiler horizontalement pour comparer les méthodes →',
    similarComparison: 'COMPARAISON DE PRODUITS SIMILAIRES', buyerQuestion: 'Question de l’acheteur',
    productSelectionLogic: 'LOGIQUE DE SÉLECTION DE PRODUIT', completeDefinition: 'LA DÉFINITION COMPLÈTE DU PRODUIT',
    sixLayers: 'Six couches forment une spécification reproductible.', sixLayersIntro: 'Un nom de catalogue ne suffit pas. Ces six couches doivent concorder avant l’approbation de l’échantillon et le devis.',
    constructionKnowledge: 'CONNAISSANCE DE LA CONSTRUCTION', decisionPoint: 'Point de décision',
    dsHairDifference: 'LA DIFFÉRENCE DS HAIR', dsHairHeading: 'Un processus d’approvisionnement structuré, pas une affirmation de qualité sans fondement.',
    dsHairIntro: 'Nous comparons la façon dont un projet est géré — et ne faisons pas d’affirmations non vérifiées sur le cheveu d’un autre fournisseur.',
    structuredWorkflow: 'Processus structuré DS HAIR', unstructuredRisk: 'Risque d’approvisionnement non structuré',
    proKnowledge: 'CONNAISSANCE PROFESSIONNELLE DU PRODUIT', proKnowledgeHeading: 'Utilisez la page pour prendre une meilleure décision d’achat.',
    proKnowledgeIntro: 'Conseils pratiques pour les salons, distributeurs et équipes private label. Les affirmations spécifiques au produit nécessitent l’approbation de l’échantillon.',
    relatedDirections: 'AXES DE DÉVELOPPEMENT LIÉS', discussThisProduct: 'DISCUTER DE CE PRODUIT →', relatedHeading: 'Construisez une gamme d’extensions cohérente.', relatedIntro: 'Ce sont des voies de demande, pas des listes de stock en direct. Chaque produit nécessite sa propre spécification et référence d’échantillon.'
  }
};
const _ = (key) => UI[lang] ? (UI[lang][key] || UI.en[key]) : UI.en[key];
const VERSION = '20260731-2';
const chartFor = (id) => colourCharts.id === id ? colourCharts : null;

function optionStatus(status) {
  return status === 'reference' ? _('referenceShown') : _('requestToConfirm');
}

function productVisual(product) {
  if (!product.images.length) return '';
    return `<div class="product-gallery${product.images.length === 1 ? ' is-single' : ''}">
    ${product.images.map((image, index) => `<figure class="${index === 0 ? 'product-gallery-main' : ''}"><img${image.fit === 'contain' ? ' class="is-contain"' : ''} src="${image.src}" alt="${esc(image.alt)}" decoding="async"${index > 0 ? ' loading="lazy"' : ''}>${index === 0 && product.imageStatusNote ? `<figcaption>${esc(product.imageStatusNote)}</figcaption>` : ''}</figure>`).join('')}
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
    <div class="product-section-heading"><p class="eyebrow">${_('clipInRangeTier')}</p><h2>${_('clipInHeading')}</h2><p>${_('clipInIntro')}</p></div>
    <div class="clip-type-grid is-three-tiers">${product.productTypes.map((item) => `<article class="clip-type-card has-image"><figure><img src="${item.image}" alt="${esc(item.imageAlt)}" decoding="async" loading="lazy"></figure><div><span>${esc(item.tier)}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p><dl><div><dt>${_('includes')}</dt><dd>${esc(item.includes)}</dd></div><div><dt>${_('typicalSpec')}</dt><dd>${esc(item.typicalSpec)}</dd></div><div><dt>${item.guidanceLabel || _('weightGuidance')}</dt><dd>${esc(item.guidance)}</dd></div><div><dt>${_('whyStock')}</dt><dd>${esc(item.whyStock)}</dd></div></dl><a href="#build-your-brief">${_('buildThisProduct')}</a></div></article>`).join('')}</div>
  </section>`;
}

function setMapSection(product) {
  if (!product.setMaps) return '';
  return `<section class="set-map-section"><div class="product-section-heading"><p class="eyebrow">${_('verifiedSetMaps')}</p><h2>${_('setMapHeading')}</h2><p>${_('setMapIntro')}</p></div><div class="set-map-grid is-count-${product.setMaps.length}">${product.setMaps.map((set) => `<article><div><span>${esc(set.title)}</span><p>${esc(set.summary)}</p></div><table><thead><tr><th>${_('quantity')}</th><th>${_('weftWidth')}</th><th>${_('clipLayout')}</th></tr></thead><tbody>${set.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></article>`).join('')}</div></section>`;
}

function configurationBuilder(product) {
  if (!product.configuration || !product.configuration.length) return '';
  const chart = chartFor(product.colourChart);
  const productIdentity = product.code || product.title;
  return `<section class="spec-builder" id="build-your-brief" data-spec-builder data-product-code="${esc(productIdentity)}">
    <div class="spec-builder-heading"><div><p class="eyebrow">${_('buildBrief')}</p><h2>${_('buildBriefHeading')}</h2></div><p>${_('buildBriefIntro')}</p></div>
    <div class="spec-builder-layout">
      <div class="spec-fields">
        ${product.configuration.map((group) => `<fieldset class="spec-field" data-spec-field="${esc(group.key)}"><legend>${esc(group.label)}</legend><div class="spec-options">${group.options.map((option) => `<button class="spec-option${option.status === 'reference' ? ' is-selected' : ''}" type="button" data-value="${esc(option.value)}" data-status="${esc(option.status)}" aria-pressed="${option.status === 'reference' ? 'true' : 'false'}"><span>${esc(option.value)}</span><small>${optionStatus(option.status)}</small></button>`).join('')}</div><p>${esc(group.note)}</p></fieldset>`).join('')}
      </div>
      <aside class="spec-summary" aria-live="polite">
        <p class="eyebrow">${_('yourSpec')}</p>
        <h3>${esc(product.referenceLabel || product.title)}</h3>
        <dl>${product.configuration.map((group) => `<div><dt>${esc(group.label)}</dt><dd data-summary="${esc(group.key)}">${esc(group.options.find((option) => option.status === 'reference')?.value || 'Select an option')}</dd></div>`).join('')}<div><dt>${_('colour')}</dt><dd data-summary="colour">${_('selectShade')}</dd></div></dl>
        <p class="spec-summary-status">${_('specSummaryStatus')}</p>
        <a class="button button-dark" data-spec-enquiry href="contact.html?product=${encodeURIComponent(productIdentity)}">${_('sendThisSpec')}</a>
      </aside>
    </div>
    ${chart ? `<div class="colour-chart" data-colour-chart>
      <div class="colour-chart-heading"><div><p class="eyebrow">${_('primaryColourSystem')}</p><h2>${esc(chart.name)}</h2></div><div><p>${esc(chart.notice)}</p><a href="free-color-kits.html">${_('requestColourKit')}</a></div></div>
      <div class="colour-filters" aria-label="Colour families"><button class="is-active" type="button" data-colour-filter="all" aria-pressed="true">${_('allThirtyOne')}</button>${chart.groups.map((group) => `<button type="button" data-colour-filter="${esc(group.name)}" aria-pressed="false">${esc(group.name)}</button>`).join('')}</div>
      <div class="colour-grid">${chart.groups.flatMap((group) => group.colours.map((colour) => `<button class="colour-card" type="button" data-colour-group="${esc(group.name)}" data-colour-code="${esc(colour.code)}" data-colour-name="${esc(colour.name)}" aria-pressed="false"><img src="${colour.image}" alt="" loading="lazy"><span><strong>${esc(colour.code)}</strong>${esc(colour.name)}</span></button>`)).join('')}</div>
    </div>` : ''}
  </section>`;
}

function comparisonTable(product) {
  const comparison = product.methodComparison;
  if (!comparison) return '';
  return `<section class="method-comparison"><div class="product-section-heading"><p class="eyebrow">${esc(comparison.eyebrow || _('similarComparison'))}</p><h2>${esc(comparison.title || 'Choose the method by the buying decision.')}</h2><p>${esc(comparison.intro || comparison.notice)}</p></div><p class="comparison-scroll-hint">${_('scrollHint')}</p><div class="comparison-scroll" role="region" aria-label="Hair extension method comparison" tabindex="0"><table><thead><tr><th scope="col">${_('buyerQuestion')}</th>${comparison.columns.map((column) => `<th scope="col">${esc(column)}</th>`).join('')}</tr></thead><tbody>${comparison.rows.map(([label, ...values]) => `<tr><th scope="row">${esc(label)}</th>${values.map((value) => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="comparison-notice">${esc(comparison.notice)}</p></section>`;
}

function decisionFramework(product) {
  const section = product.decisionFramework;
  if (!section) return '';
  return `<section class="product-decisions"><div class="product-section-heading"><p class="eyebrow">${_('productSelectionLogic')}</p><h2>${esc(section.title)}</h2><p>${esc(section.intro)}</p></div><div class="decision-grid">${section.items.map((item) => `<article><span>${esc(item.label)}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('')}</div></section>`;
}

function specificationAnatomy(product) {
  if (!product.specificationAnatomy) return '';
  return `<section class="spec-anatomy"><div><p class="eyebrow">${_('completeDefinition')}</p><h2>${_('sixLayers')}</h2><p>${_('sixLayersIntro')}</p></div><ol>${product.specificationAnatomy.map(([number, title, body]) => `<li><span>${esc(number)}</span><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></li>`).join('')}</ol></section>`;
}

function constructionComparison(product) {
  const comparison = product.constructionComparison;
  if (!comparison) return '';
  return `<section class="construction-comparison"><div class="product-section-heading"><p class="eyebrow">${_('constructionKnowledge')}</p><h2>${esc(comparison.title || 'Compare constructions before approving a sample.')}</h2><p>${esc(comparison.notice)}</p></div><div class="comparison-scroll" role="region" aria-label="Clip-in construction comparison" tabindex="0"><table><thead><tr><th scope="col">${_('decisionPoint')}</th>${comparison.columns.map((column) => `<th scope="col">${esc(column)}</th>`).join('')}</tr></thead><tbody>${comparison.rows.map(([label, ...values]) => `<tr><th scope="row">${esc(label)}</th>${values.map((value) => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
}

function serviceComparison(product) {
  if (!product.serviceComparison || !product.serviceComparison.length) return '';
  return `<section class="service-comparison"><div><p class="eyebrow">${_('dsHairDifference')}</p><h2>${_('dsHairHeading')}</h2><p>${_('dsHairIntro')}</p></div><div class="service-comparison-table"><div class="service-comparison-head"><strong>${_('decisionPoint')}</strong><strong>${_('structuredWorkflow')}</strong><strong>${_('unstructuredRisk')}</strong></div>${product.serviceComparison.map(([label, ours, risk]) => `<div><strong>${esc(label)}</strong><span>${esc(ours)}</span><span>${esc(risk)}</span></div>`).join('')}</div></section>`;
}

function knowledgeSection(product) {
  if (!product.knowledge || !product.knowledge.length) return '';
  const count = product.knowledge.length;
  const gridClass = count <= 5 ? `is-count-${count}` : count === 6 ? 'is-count-6' : 'is-count-many';
  return `<section class="product-knowledge"><div class="product-section-heading"><p class="eyebrow">${_('proKnowledge')}</p><h2>${_('proKnowledgeHeading')}</h2><p>${_('proKnowledgeIntro')}</p></div><div class="knowledge-grid ${gridClass}">${product.knowledge.map((item, index) => `<article><span>0${index + 1}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('')}</div></section>`;
}

// Per-product display metadata for the auto-generated related-products cards.
// Keeps the method-style eyebrow and short titles used across the site.
const RELATED_META = {
  'clip-in-human-hair-extensions': { eyebrow: 'CLIP-IN METHOD', title: 'Clip-In Hair Extensions' },
  'tape-in-human-hair-extensions': { eyebrow: 'TAPE-IN METHOD', title: 'Tape-In Hair Extensions' },
  'k-tip-human-hair-extensions': { eyebrow: 'KERATIN METHOD', title: 'K-Tip Hair Extensions' },
  'genius-weft-human-hair-extensions': { eyebrow: 'WEFT METHOD', title: 'Genius Weft Hair Extensions' },
  'machine-weft-human-hair-extensions': { eyebrow: 'WEFT METHOD', title: 'Machine Weft Hair Extensions' },
  'nano-ring-human-hair-extensions': { eyebrow: 'NANO RING METHOD', title: 'Nano Ring Hair Extensions' },
  'synthetic-clip-in-chignon-hairpiece': { eyebrow: 'SYNTHETIC HAIRPIECE', title: 'Clip-In Chignon Hairpiece' },
  'synthetic-22-inch-straight-clip-in-hairpiece': { eyebrow: 'SYNTHETIC HAIRPIECE', title: 'Straight Clip-In Hairpiece' },
  'synthetic-21-inch-soft-curls-claw-clip-ponytail': { eyebrow: 'SYNTHETIC PONYTAIL', title: 'Soft-Curls Claw-Clip Ponytail' },
  'synthetic-21-inch-straight-claw-clip-ponytail': { eyebrow: 'SYNTHETIC PONYTAIL', title: 'Straight Claw-Clip Ponytail' },
  'synthetic-26-inch-elastic-band-braiding-ponytail': { eyebrow: 'SYNTHETIC PONYTAIL', title: 'Elastic-Band Braiding Ponytail' },
  'synthetic-12-inch-coily-drawstring-ponytail': { eyebrow: 'SYNTHETIC PONYTAIL', title: 'Coily Drawstring Ponytail' },
  'synthetic-elastic-band-hair-bun-scrunchie': { eyebrow: 'SYNTHETIC HAIRPIECE', title: 'Elastic-Band Hair Bun' },
  'synthetic-layered-clip-in-crown-topper': { eyebrow: 'SYNTHETIC TOPPER', title: 'Layered Clip-In Crown Topper' },
  'synthetic-beach-wave-clip-in-crown-topper': { eyebrow: 'SYNTHETIC TOPPER', title: 'Beach-Wave Clip-In Crown Topper' },
  'lace-wig-201': { eyebrow: 'LACE WIG', title: 'Lace Wig Model 201' },
  'lace-wig-202': { eyebrow: 'LACE WIG', title: 'Lace Wig Model 202' },
  'lace-wig-203': { eyebrow: 'LACE WIG', title: 'Lace Wig Model 203' },
  'lace-wig-204': { eyebrow: 'LACE WIG', title: 'Lace Wig Model 204' },
  'human-hair-topper-01': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 01' },
  'human-hair-topper-02': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 02' },
  'human-hair-topper-03': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 03' },
  'human-hair-topper-04': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 04' },
  'human-hair-topper-05': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 05' },
  'human-hair-topper-06': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 06' },
  'human-hair-topper-07': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 07' },
  'human-hair-topper-08': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 08' },
  'human-hair-topper-09': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 09' },
  'human-hair-topper-10': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 10' },
  'human-hair-topper-11': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 11' },
  'human-hair-topper-12': { eyebrow: 'HUMAN HAIR TOPPER', title: 'Human Hair Topper Model 12' },
  'synthetic-wig-dsw-2501': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2502': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2503': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2504': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2505': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2506': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2507': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Lace Front Wig' },
  'synthetic-wig-dsw-2508': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2509': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2510': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2511': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Wavy with Side-Swept Bangs Long Wig' },
  'synthetic-wig-dsw-2512': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Bob Wig' },
  'synthetic-wig-dsw-2513': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2514': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Wavy Long Wig' },
  'synthetic-wig-dsw-2515': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Lace Front Bob Straight Short Wig' },
  'synthetic-wig-dsw-2516': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Lace Front Straight Long Wig' },
  'synthetic-wig-dsw-2517': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2518': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Wavy with Side-Swept Bangs Wig' },
  'synthetic-wig-dsw-2519': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic with Side-Swept Bangs Wig' },
  'synthetic-wig-dsw-2520': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2521': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2522': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
  'synthetic-wig-dsw-2523': { eyebrow: 'SYNTHETIC WIG', title: 'Synthetic Full Wig' },
};

// Method/segment eyebrow labels, translated per locale. English keys map to themselves.
const METHOD_EYEBROW = {
  en: { 'CLIP-IN METHOD': 'CLIP-IN METHOD', 'TAPE-IN METHOD': 'TAPE-IN METHOD', 'KERATIN METHOD': 'KERATIN METHOD', 'WEFT METHOD': 'WEFT METHOD', 'NANO RING METHOD': 'NANO RING METHOD', 'SYNTHETIC HAIRPIECE': 'SYNTHETIC HAIRPIECE', 'SYNTHETIC PONYTAIL': 'SYNTHETIC PONYTAIL', 'SYNTHETIC TOPPER': 'SYNTHETIC TOPPER', 'LACE WIG': 'LACE WIG', 'HUMAN HAIR TOPPER': 'HUMAN HAIR TOPPER', 'SYNTHETIC WIG': 'SYNTHETIC WIG' },
  es: { 'CLIP-IN METHOD': 'MÉTODO CLIP-IN', 'TAPE-IN METHOD': 'MÉTODO TAPE-IN', 'KERATIN METHOD': 'MÉTODO QUERATINA', 'WEFT METHOD': 'MÉTODO WEFT', 'NANO RING METHOD': 'MÉTODO NANO RING', 'SYNTHETIC HAIRPIECE': 'PIEZA SINTÉTICA', 'SYNTHETIC PONYTAIL': 'COLA SINTÉTICA', 'SYNTHETIC TOPPER': 'TOPPER SINTÉTICO', 'LACE WIG': 'PELUCA LACE', 'HUMAN HAIR TOPPER': 'TOPPER DE CABELLO HUMANO', 'SYNTHETIC WIG': 'PELUCA SINTÉTICA' },
  de: { 'CLIP-IN METHOD': 'CLIP-IN-METHODE', 'TAPE-IN METHOD': 'TAPE-IN-METHODE', 'KERATIN METHOD': 'KERATIN-METHODE', 'WEFT METHOD': 'WEFT-METHODE', 'NANO RING METHOD': 'NANO-RING-METHODE', 'SYNTHETIC HAIRPIECE': 'SYNTHETISCHES HAARTEIL', 'SYNTHETIC PONYTAIL': 'SYNTHETISCHER ZOPF', 'SYNTHETIC TOPPER': 'SYNTHETISCHER TOPPER', 'LACE WIG': 'LACE-PERÜCKE', 'HUMAN HAIR TOPPER': 'ECHTHAAR-TOPPER', 'SYNTHETIC WIG': 'SYNTHETISCHE PERÜCKE' },
  fr: { 'CLIP-IN METHOD': 'MÉTHODE CLIP-IN', 'TAPE-IN METHOD': 'MÉTHODE TAPE-IN', 'KERATIN METHOD': 'MÉTHODE KÉRATINE', 'WEFT METHOD': 'MÉTHODE WEFT', 'NANO RING METHOD': 'MÉTHODE NANO RING', 'SYNTHETIC HAIRPIECE': 'ACCESSOIRE SYNTHÉTIQUE', 'SYNTHETIC PONYTAIL': 'QUEUE-DE-CHEVAL SYNTHÉTIQUE', 'SYNTHETIC TOPPER': 'TOPPER SYNTHÉTIQUE', 'LACE WIG': 'PERUQUE LACE', 'HUMAN HAIR TOPPER': 'TOPPER EN CHEVEUX NATURELS', 'SYNTHETIC WIG': 'PERUQUE SYNTHÉTIQUE' },
};

function relatedPool(product) {
  const sameCat = products.filter((p) => p.category === product.category && p.slug !== product.slug);
  const selfIndex = products.findIndex((p) => p.slug === product.slug);
  const start = ((selfIndex % sameCat.length) + sameCat.length) % sameCat.length;
  const count = Math.min(4, sameCat.length);
  const picked = [];
  for (let k = 0; k < count; k++) picked.push(sameCat[(start + k) % sameCat.length]);
  return picked;
}

function relatedProducts(product) {
  const cards = relatedPool(product).map((item) => {
    const meta = RELATED_META[item.slug] || {};
    const eyebrow = (METHOD_EYEBROW[lang] && METHOD_EYEBROW[lang][meta.eyebrow || item.category]) || meta.eyebrow || item.category;
    const title = item.title;
    const image = item.images && item.images.length ? item.images[0] : null;
    return `<a class="related-product-card" href="${item.slug}.html"><img src="${image.src}" alt="${esc(image.alt || title)}" decoding="async" loading="lazy"><div><span>${esc(eyebrow)}</span><h3>${esc(title)}</h3><p>${esc(item.summary)}</p><strong>${_('discussThisProduct')}</strong></div></a>`;
  }).join('');
  return `<section class="related-products"><div class="product-section-heading"><p class="eyebrow">${_('relatedDirections')}</p><h2>${_('relatedHeading')}</h2><p>${_('relatedIntro')}</p></div><div class="related-product-grid">${cards}</div></section>`;
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
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(product.metaTitle)}">
  <meta property="og:description" content="${esc(product.description)}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="DS HAIR | WigExporter">
  <meta property="og:locale" content="en_GB">
  ${product.images.length ? `<meta property="og:image" content="https://wigexporter.com/${product.images[0].src}"><meta property="og:image:alt" content="${esc(product.title)} – DS HAIR wholesale reference">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(product.metaTitle)}">
  <meta name="twitter:description" content="${esc(product.description)}">
  ${product.images.length ? `<meta name="twitter:image" content="https://wigexporter.com/${product.images[0].src}">` : ''}
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css?v=${VERSION}">
  <link rel="stylesheet" href="content.css?v=${VERSION}">
  <link rel="stylesheet" href="product.css?v=${VERSION}">
</head>
<body>
  <a class="skip-link" href="#main">${_('skipToContent')}</a>
  <div class="notice">DS HAIR · B2B samples · OEM & private label <a href="contact.html">${_('discussRequirement')}</a></div>
  <header class="site-header"><button class="menu-toggle" type="button" aria-label="${_('openNavigation')}" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span></button><nav id="primary-nav" class="primary-nav" aria-label="Primary navigation"></nav><a class="wordmark" href="index.html" aria-label="DS HAIR home"><strong>DS HAIR</strong><span>WIGEXPORTER · GLOBAL B2B</span></a><div class="header-tools"><a class="trade-link" href="trade-account.html">${_('tradeAccount')}</a><a class="quote-link" href="contact.html">${_('requestQuote')}</a></div></header>
  <main id="main">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">${_('home')}</a><span>›</span><a href="products.html">${_('collections')}</a><span>›</span><a href="${product.categoryUrl}">${esc(product.category)}</a><span>›</span><span>${esc(product.title)}</span></nav>
    <section class="product-hero${product.images.length ? '' : ' product-hero-text-only'}">
      ${productVisual(product)}
      <div class="product-summary">
        ${product.draftNotice ? `<p class="draft-notice">${esc(product.draftNotice)}</p>` : ''}
        <p class="eyebrow">${esc(product.brand)} · ${esc(product.category)}</p>
        <h1>${esc(product.title)}</h1>
        <p class="product-code">${product.code ? `${_('productCode')}${esc(product.code)}` : esc(product.referenceLabel || _('specBasedNoSku'))}</p>
        ${conversion.tradeCard}
        <p class="product-dek">${esc(product.summary)}</p>
        <dl class="quick-specs">${product.confirmedFacts.map(([name, value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
        ${conversion.trustBadges}
        <div class="product-actions"><a class="button button-dark" href="contact.html?product=${encodeURIComponent(productIdentity)}">${_('requestQuote')}</a><a class="button button-light" href="sample.html?product=${encodeURIComponent(productIdentity)}">${_('discussSample')}</a>${wa ? `<a class="button button-whatsapp" href="${esc(wa)}" target="_blank" rel="noopener">${_('enquireWhatsApp')}</a>` : ''}</div>
        <p class="accuracy-note">${_('accuracyNote')}</p>
      </div>
    </section>
    ${conversion.serviceBar}
    ${productTypeChooser(product)}
    ${decisionFramework(product)}
    ${setMapSection(product)}
    ${specificationAnatomy(product)}
    ${configurationBuilder(product)}
    <section class="product-answer"><p class="eyebrow">${_('buyerAnswer')}</p><h2>${_('whatIsThisFor')}</h2><p>${esc(product.summary)}</p></section>
    <section class="product-section">
      <div class="product-section-heading"><p class="eyebrow">${_('evaluationPoints')}</p><h2>${_('whatVerify')}</h2><p>${_('evaluateHint')}</p></div>
      <div class="buyer-checks">${product.buyerChecks.map(([name, text], index) => `<article><span>0${index + 1}</span><h3>${esc(name)}</h3><p>${esc(text)}</p></article>`).join('')}</div>
    </section>
    ${constructionComparison(product)}
    ${comparisonTable(product)}
    ${serviceComparison(product)}
    <section class="product-specification">
      <div><p class="eyebrow">${_('specificationStatus')}</p><h2>${_('specStatusDesc')}</h2><p>${_('specStatusNote')}</p></div>
      <div>
        <h3>${_('confirmedOnReference')}</h3>
        <dl>${product.confirmedFacts.map(([name, value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
        <h3>${_('toConfirmBeforeOrder')}</h3>
        <ul>${product.unconfirmed.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
      </div>
    </section>
    <section class="product-customisation">
      <div><p class="eyebrow">${_('oemPrivateLabel')}</p><h2>${_('oemHeading')}</h2></div>
      <ul>${product.customisation.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
      <a class="button button-dark" href="customization.html#custom-packaging">${_('exploreCustomPackaging')}</a>
    </section>
    ${knowledgeSection(product)}
    ${relatedProducts(product)}
    <section class="faq-section"><div><p class="eyebrow">${_('buyerQuestions')}</p><h2>${_('beforeYouRequest')}</h2></div><div class="faq-list">${product.faqs.map(([name, text]) => `<details><summary>${esc(name)}</summary><p>${esc(text)}</p></details>`).join('')}</div></section>
    <section class="final-cta"><p class="eyebrow">${product.code ? `${_('reference')}${esc(product.code)}` : _('productBrief')}</p><h2>${esc(product.ctaTitle || `Request the DS HAIR ${product.title} specification.`)}</h2><p>${esc(product.ctaText || 'Include your target market, preferred construction, length, weight, colour direction and estimated quantity so the sourcing team can respond with the right next step.')}</p><a class="button button-light" href="contact.html?product=${encodeURIComponent(productIdentity)}">${_('sendBuyingBrief')}</a></section>
  </main>
  <footer class="site-footer"></footer>
  <script type="application/ld+json">${json(productSchema)}</script>
  <script type="application/ld+json">${json(faqSchema)}</script>
  <script type="application/ld+json">${json({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wigexporter.com/' },
      { '@type': 'ListItem', position: 2, name: 'Collections', item: 'https://wigexporter.com/products.html' },
      { '@type': 'ListItem', position: 3, name: product.category, item: `https://wigexporter.com/${product.categoryUrl}` },
      { '@type': 'ListItem', position: 4, name: product.title, item: url }
    ]
  })}</script>
  <script src="product-config.js?v=${VERSION}"></script>
  <script src="script.js?v=${VERSION}"></script>
</body>
</html>`;
  let finalHtml = html;
  if (lang) {
    finalHtml = finalHtml
      .replace('<html lang="en">', `<html lang="${lang}">`)
      .replace('og:locale" content="en_GB"', `og:locale" content="${OG_LOCALE[lang]}"`)
      .replace(new RegExp('https://wigexporter.com/' + product.slug + '.html', 'g'), `https://wigexporter.com/${lang}/${product.slug}.html`)
      .replace(/"styles\.css/g, '"/styles.css')
      .replace(/"content\.css/g, '"/content.css')
      .replace(/"product\.css/g, '"/product.css')
      .replace(/"product-config\.js/g, '"/product-config.js')
      .replace(/"script\.js/g, '"/script.js')
      .replace(/"favicon\.svg/g, '"/favicon.svg')
      .replace(/"category-layout\.css/g, '"/category-layout.css')
      .replace(/"homepage-layout\.css/g, '"/homepage-layout.css')
      .replace(/"colour-packaging\.css/g, '"/colour-packaging.css')
      .replace(/"colour-packaging\.js/g, '"/colour-packaging.js')
      .replace(/"customization\.css/g, '"/customization.css')
      .replace(/"assets\//g, '"/assets/')
      .replace(/href="(index|products|trade-account|contact|synthetic-wigs-hairpieces)\.html"/g, 'href="/$1.html"')
      .replace('<div class="header-tools">', '<div class="header-tools">' + langSwitch(product.slug, lang))
      .replace('</head>', hreflangBlock(product.slug) + '\n' + LANG_SWITCH_STYLE + '\n</head>');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${product.slug}.html`), finalHtml.replace(/[ \t]+$/gm, ''));
  } else {
    finalHtml = html
      .replace('<div class="header-tools">', '<div class="header-tools">' + langSwitch(product.slug, 'en'))
      .replace('</head>', hreflangBlock(product.slug) + '\n' + LANG_SWITCH_STYLE + '\n</head>');
    fs.writeFileSync(path.join(root, `${product.slug}.html`), finalHtml.replace(/[ \t]+$/gm, ''));
  }
}

console.log(`Generated ${products.length} product page.`);
