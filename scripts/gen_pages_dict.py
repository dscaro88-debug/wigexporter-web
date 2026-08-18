#!/usr/bin/env python3
"""Generate scripts/i18n/pages_dict.py from hand-authored normalized translations.

Why this exists: the localization script (localize_pages.py) does *exact* whole-node
matching, so dictionary keys must equal the raw source strings byte-for-byte (including
`&amp;` vs bare `&`, curly vs straight quotes, en-dash vs hyphen). Authoring 360 keys by
hand is error-prone. Instead we author translations keyed by a *normalized* form, and this
generator maps each exact source segment to its translation. Exact keys are derived at build
time, so transcription risk disappears.

Run:  python3 scripts/gen_pages_dict.py
"""
import re
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEGMENTS_JSON = "/tmp/uniq_segs.json"  # produced by extract_page_segments.py

# --- Normalization (must mirror the one used to build /tmp/norm_segs.json) ---
def norm(s: str) -> str:
    s = s.replace("&amp;", "&").replace("&AMP;", "&")
    for a, b in [("“", '"'), ("”", '"'), ("‘", "'"), ("’", "'"), ("–", "-"), ("—", "-")]:
        s = s.replace(a, b)
    s = s.replace(" ", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s.lower()

# --- Brand names / product codes that must NOT be translated ---
BRAND = {
    "ds hair",
    "wigexporter · global b2b",
    "ds hair home",
    "wigexporter",
    "d.s hair beauty",
    "uk & eu",
}
CODES = (
    [f"ds-wig-lw-{i:03d}" for i in range(1, 5)]
    + [f"ds-top-hh-{i:03d}" for i in range(1, 14)]
    + ["ds-b-001"]
)

# --- Translations keyed by NORMALIZED segment -> (es, de, fr) ---
T = {
    # ---- Navigation / UI labels ----
    "samples": ("Muestras", "Muster", "Échantillons"),
    "contact": ("Contacto", "Kontakt", "Contact"),
    "primary navigation": ("Navegación principal", "Hauptnavigation", "Navigation principale"),
    "trade account": ("Cuenta comercial", "Handelskonto", "Compte professionnel"),
    "request quote": ("Solicitar cotización", "Angebot anfordern", "Demander un devis"),
    "collections": ("Colecciones", "Kollektionen", "Collections"),
    "customization": ("Personalización", "Individualisierung", "Personnalisation"),
    "about": ("Acerca de", "Über uns", "À propos"),
    "home": ("Inicio", "Startseite", "Accueil"),
    "products": ("Productos", "Produkte", "Produits"),
    "salon": ("Salón", "Salon", "Salon"),
    "sample": ("Muestra", "Muster", "Échantillon"),
    "name": ("Nombre", "Name", "Nom"),
    "email": ("Correo electrónico", "E-Mail", "E-mail"),
    "company": ("Empresa", "Unternehmen", "Entreprise"),
    "country": ("País", "Land", "Pays"),
    "today": ("Hoy", "Heute", "Aujourd'hui"),
    "next": ("Siguiente", "Weiter", "Suivant"),
    "explore": ("Explorar", "Entdecken", "Explorer"),
    "view category →": ("Ver categoría →", "Kategorie ansehen →", "Voir la catégorie →"),
    "read buyer guide →": ("Leer guía para compradores →", "Käuferleitfaden lesen →", "Lire le guide acheteurs →"),
    "select product category": ("Seleccionar categoría de producto", "Produktkategorie auswählen", "Sélectionner la catégorie de produit"),
    "product category": ("Categoría de producto", "Produktkategorie", "Catégorie de produit"),
    "trade service": ("Servicio comercial", "Handelsservice", "Service professionnel"),
    "salon supplies": ("Suministros de salón", "Salonbedarf", "Fournitures de salon"),
    "colour kits": ("Kits de color", "Farbsets", "Kits de couleur"),
    "custom packaging": ("Embalaje personalizado", "Individuelle Verpackung", "Emballage personnalisé"),
    "human hair": ("Pelo humano", "Echthaar", "Cheveux humains"),
    "synthetic hair": ("Pelo sintético", "Synthetikhaar", "Cheveux synthétiques"),
    "work email": ("Correo de trabajo", "Geschäftliche E-Mail", "E-mail professionnel"),
    "your name": ("Su nombre", "Ihr Name", "Votre nom"),
    "division": ("División", "Sparte", "Division"),
    "divisions": ("Divisiones", "Sparten", "Divisions"),
    "oem": ("OEM", "OEM", "OEM"),
    "oem / private label": ("OEM / Marca privada", "OEM / Private Label", "OEM / Marque privée"),
    "private label": ("Marca privada", "Private Label", "Marque privée"),
    "global": ("Global", "Global", "Global"),
    "human hair extensions": ("Extensiones de pelo humano", "Echthaar-Extensions", "Extensions de cheveux humains"),
    "synthetic wigs & hairpieces": ("Pelucas sintéticas y complementos", "Synthetische Perücken und Haarteile", "Perruques synthétiques et accessoires"),
    "human hair wigs & toppers": ("Pelucas y toppers de pelo humano", "Echthaar-Perücken und Topper", "Perruques et toupes en cheveux humains"),
    "colour & packaging studio": ("Estudio de color y embalaje", "Farb- und Verpackungsstudio", "Studio couleur et emballage"),
    "synthetic wigs and hairpieces category": ("Categoría de pelucas y complementos sintéticos", "Kategorie synthetische Perücken und Haarteile", "Catégorie perruques synthétiques et accessoires"),
    "synthetic wig and hairpiece category": ("Categoría de peluca y complemento sintéticos", "Kategorie synthetische Perücke und Haarteil", "Catégorie perruque synthétique et accessoire"),
    # ---- Headings / CTAs (uppercase originals normalize to these) ----
    "trade account ": ("CUENTA COMERCIAL", "HANDELSKONTO", "COMPTE PROFESSIONNEL"),
    "request quote ": ("SOLICITAR COTIZACIÓN", "ANGEBOT ANFORDERN", "DEMANDER UN DEVIS"),
    "human hair": ("PELO HUMANO", "ECHTHAAR", "CHEVEUX HUMAINS"),
    "synthetic hair": ("PELO SINTÉTICO", "SYNTHETIKHAAR", "CHEVEUX SYNTHÉTIQUES"),
    "salon supplies": ("SUMINISTROS DE SALÓN", "SALONBEDARF", "FOURNITURES DE SALON"),
    "private label": ("MARCA PRIVADA", "PRIVATE LABEL", "MARQUE PRIVÉE"),
    "oem": ("OEM", "OEM", "OEM"),
    "samples": ("MUESTRAS", "MUSTER", "ÉCHANTILLONS"),
    "collections": ("COLECCIONES", "KOLLEKTIONEN", "COLLECTIONS"),
    "products": ("PRODUCTOS", "PRODUKTE", "PRODUITS"),
    "explore": ("EXPLORAR", "ENTDECKEN", "EXPLORER"),
    "customization": ("PERSONALIZACIÓN", "INDIVIDUALISIERUNG", "PERSONNALISATION"),
    "about": ("ACERCA DE", "ÜBER UNS", "À PROPOS"),
    "home": ("INICIO", "STARTSEITE", "ACCUEIL"),
    "contact": ("CONTACTO", "KONTAKT", "CONTACT"),
    "salon": ("SALÓN", "SALON", "SALON"),
    "sample": ("MUESTRA", "MUSTER", "ÉCHANTILLON"),
    "next": ("SIGUIENTE", "WEITER", "SUIVANT"),
    "name": ("NOMBRE", "NAME", "NOM"),
    "email": ("CORREO ELECTRÓNICO", "E-MAIL", "E-MAIL"),
    "company": ("EMPRESA", "UNTERNEHMEN", "ENTREPRISE"),
    "country": ("PAÍS", "LAND", "PAYS"),
    "today": ("HOY", "HEUTE", "AUJOURD'HUI"),
    "division": ("DIVISIÓN", "SPARTE", "DIVISION"),
    "global": ("GLOBAL", "GLOBAL", "GLOBAL"),
    "request quote": ("SOLICITAR COTIZACIÓN", "ANGEBOT ANFORDERN", "DEMANDER UN DEVIS"),
    "request samples": ("SOLICITAR MUESTRAS", "MUSTER ANFORDERN", "DEMANDER DES ÉCHANTILLONS"),
    "request samples →": ("Solicitar muestras →", "Muster anfordern →", "Demander des échantillons →"),
    "start with a sample →": ("Empiece con una muestra →", "Beginnen Sie mit einem Muster →", "Commencez par un échantillon →"),
    "request sample support": ("Solicitar soporte de muestras", "Muster-Support anfordern", "Demander un support échantillon"),
    "request free color kit": ("Solicitar kit de color gratis", "Kostenloses Farbset anfordern", "Demander un kit de couleur gratuit"),
    "free color kits": ("KITS DE COLOR GRATIS", "KOSTENLOSE FARBSETS", "KITS DE COULEUR GRATUITS"),
    "free color kit": ("KIT DE COLOR GRATIS", "KOSTENLOSES FARBSET", "KIT DE COULEUR GRATUIT"),
    "apply for trade account": ("Solicite una cuenta comercial", "Beantragen Sie ein Handelskonto", "Demandez un compte professionnel"),
    "open a trade account": ("Abra una cuenta comercial", "Eröffnen Sie ein Handelskonto", "Ouvrez un compte professionnel"),
    "become a trade partner": ("Conviértase en socio comercial", "Werden Sie Handelspartner", "Devenez partenaire professionnel"),
    "send project brief": ("Enviar brief del proyecto", "Projektbrief senden", "Envoyer le brief projet"),
    "start a project": ("Iniciar un proyecto", "Projekt starten", "Démarrer un projet"),
    "explore collections": ("Explorar colecciones", "Kollektionen entdecken", "Explorer les collections"),
    "explore human hair extensions →": ("Explorar extensiones de pelo humano →", "Echthaar-Extensions entdecken →", "Explorer les extensions de cheveux humains →"),
    "explore synthetic wigs & hairpieces →": ("Explorar pelucas y complementos sintéticos →", "Synthetische Perücken und Haarteile entdecken →", "Explorer perruques et accessoires synthétiques →"),
    "explore wigs & toppers →": ("Explorar pelucas y toppers →", "Perücken und Topper entdecken →", "Explorer perruques et toupes →"),
    "explore salon supplies →": ("Explorar suministros de salón →", "Salonbedarf entdecken →", "Explorer les fournitures de salon →"),
    "explore colours & packaging →": ("Explorar colores y embalaje →", "Farben und Verpackung entdecken →", "Explorer couleurs et emballage →"),
    "explore customization": ("Explorar personalización", "Individualisierung entdecken", "Explorer la personnalisation"),
    "explore packaging": ("Explorar embalaje", "Verpackung entdecken", "Explorer l'emballage"),
    "browse colours & packaging": ("Ver colores y embalaje", "Farben und Verpackung ansehen", "Voir couleurs et emballage"),
    "browse all 31 colours →": ("Ver los 31 colores →", "Alle 31 Farben ansehen →", "Voir les 31 couleurs →"),
    "how sampling works →": ("Cómo funciona el muestreo →", "So funktioniert das Musterwesen →", "Comment fonctionne l'échantillonnage →"),
    "product architecture": ("Arquitectura de producto", "Produktarchitektur", "Architecture produit"),
    "our story & process": ("Nuestra historia y proceso", "Unsere Story und Prozess", "Notre histoire et processus"),
    "our story": ("NUESTRA HISTORIA", "UNSERE STORY", "NOTRE HISTOIRE"),
    "by the numbers": ("EN NÚMEROS", "IN ZAHLEN", "EN CHIFFRES"),
    "why choose us": ("POR QUÉ ELEGIRNOS", "WARUM UNS WÄHLEN", "POURQUOI NOUS CHOISIR"),
    "what you receive": ("QUÉ RECIBE", "WAS SIE ERHALTEN", "CE QUE VOUS RECEVEZ"),
    "who it is for": ("PARA QUIÉN ES", "FÜR WEN ES IST", "POUR QUI EST-CE"),
    "what to review": ("QUÉ REVISAR", "WAS ZU PRÜFEN IST", "QUE VÉRIFIER"),
    "ask a question": ("HAGA UNA PREGUNTA", "STELLEN SIE EINE FRAGE", "POSEZ UNE QUESTION"),
    "colour systems": ("SISTEMAS DE COLOR", "FARBSYSTEME", "SYSTÈMES DE COULEUR"),
    "wigs & toppers": ("PERUCAS Y TOPPERS", "PERÜCKEN UND TOPPER", "PERRUQUES ET TOUPES"),
    "buyer support": ("SOPORTE AL COMPRADOR", "KÄUFER-SUPPORT", "SUPPORT ACHETEUR"),
    "sample support": ("SOPORTE DE MUESTRAS", "MUSTER-SUPPORT", "SUPPORT ÉCHANTILLON"),
    "private label": ("MARCA PRIVADA", "PRIVATE LABEL", "MARQUE PRIVÉE"),
    "product brief": ("BRIEF DE PRODUCTO", "PRODUKT-BRIEF", "BRIEF PRODUIT"),
    "repeat supply": ("SUMINISTRO RECURRENTE", "WIEDERHOLTE LIEFERUNG", "RÉAPPROVISIONNEMENT"),
    "business type": ("TIPO DE EMPRESA", "GESCHÄFTSTYP", "TYPE D'ENTREPRISE"),
    "contact / rfq": ("CONTACTO / SOLICITUD", "KONTAKT / ANFRAGE", "CONTACT / DEMANDE"),
    "fast start": ("INICIO RÁPIDO", "SCHNELLER START", "DÉMARRAGE RAPIDE"),
    "trusted by": ("CONFIAN EN NOSOTROS", "VERTRAUT VON", "ILS NOUS FONT CONFIANCE"),
    "your partner": ("SU SOCIO", "IHR PARTNER", "VOTRE PARTENAIRE"),
    "development": ("DESARROLLO", "ENTWICKLUNG", "DÉVELOPPEMENT"),
    "requirement": ("REQUISITO", "ANFORDERUNG", "EXIGENCE"),
    "oem support": ("SOPORTE OEM", "OEM-SUPPORT", "SUPPORT OEM"),
    "uk & eu": ("UK Y UE", "UK UND EU", "UK ET UE"),
    "wigexporter": ("WigExporter", "WigExporter", "WigExporter"),
    "human hair": ("PELO HUMANO", "ECHTHAAR", "CHEVEUX HUMAINS"),
    "hair focus": ("ENFOQUE EN CABELLO", "HAAR-FOKUS", "FOCUS CHEVEUX"),
    "extensions": ("EXTENSIONES", "EXTENSIONS", "EXTENSIONS"),
    "next step": ("SIGUIENTE PASO", "NÄCHSTER SCHRITT", "PROCHAINE ÉTAPE"),
    "products": ("PRODUCTOS", "PRODUKTE", "PRODUITS"),
    "2 tracks": ("2 VÍAS", "2 WEGE", "2 VOIES"),
    "company": ("EMPRESA", "UNTERNEHMEN", "ENTREPRISE"),
    "explore": ("EXPLORAR", "ENTDECKEN", "EXPLORER"),
    "country": ("PAÍS", "LAND", "PAYS"),
    "sample": ("MUESTRA", "MUSTER", "ÉCHANTILLON"),
    "salon": ("SALÓN", "SALON", "SALON"),
    "today": ("HOY", "HEUTE", "AUJOURD'HUI"),
    "name": ("NOMBRE", "NAME", "NOM"),
    "next": ("SIGUIENTE", "WEITER", "SUIVANT"),
    # ---- Category / collection labels ----
    "human hair extensions": ("Extensiones de pelo humano", "Echthaar-Extensions", "Extensions de cheveux humains"),
    "human hair wigs & toppers": ("Pelucas y toppers de pelo humano", "Echthaar-Perücken und Topper", "Perruques et toupes en cheveux humains"),
    "synthetic wigs & hairpieces": ("Pelucas sintéticas y complementos", "Synthetische Perücken und Haarteile", "Perruques synthétiques et accessoires"),
    "salon supplies": ("Suministros de salón", "Salonbedarf", "Fournitures de salon"),
    "human hair wigs · lace wigs · human hair toppers · ponytails": ("Pelucas de pelo humano · Perucas de encaje · Toppers de pelo humano · Colas", "Echthaar-Perücken · Spitzenperücken · Echthaar-Topper · Pferdeschwänze", "Perruques cheveux humains · Perruques dentelle · Toupes cheveux humains · Queues de cheval"),
    "synthetic wigs · hairpieces · bangs / fringes · clip-in toppers": ("Pelucas sintéticas · Complementos · Flequillos · Toppers clip-in", "Synthetische Perücken · Haarteile · Pony · Clip-in-Topper", "Perruques synthétiques · Accessoires · Franges · Toupes clip-in"),
    "clip-in · tape-in · k-tip · genius weft · machine weft · nano ring": ("Clip-in · Tape-in · K-tip · Genius Weft · Machine Weft · Nano Ring", "Clip-in · Tape-in · K-Tip · Genius Weft · Machine Weft · Nano Ring", "Clip-in · Tape-in · K-tip · Genius Weft · Machine Weft · Nano Ring"),
    "clip-in · tape-in · k-tip · three weft types": ("Clip-in · Tape-in · K-tip · Tres tipos de weft", "Clip-in · Tape-in · K-Tip · Drei Weft-Arten", "Clip-in · Tape-in · K-tip · Trois types de weft"),
    "kits: extension starter · monthly restock · nano newbie · dual method · pro upgrade": ("Kits: Inicio extensiones · Reposición mensual · Nano Newbie · Doble método · Pro Upgrade", "Sets: Extension-Starter · Monatliche Nachfüllung · Nano Newbie · Dual-Methode · Pro Upgrade", "Kits: Démarrage extensions · Réappro mensuel · Nano Newbie · Double méthode · Pro Upgrade"),
    "single products: nano rings · tape tabs · sectioning clips · keratin · heat protector discs · loop tool · tint brush": ("Productos sueltos: Nano Rings · Tape Tabs · Clip de sección · Queratina · Discos protector térmico · Loop Tool · Pincel tintes", "Einzelprodukte: Nano Rings · Tape Tabs · Trennclips · Keratin · Hitzeschutz-Scheiben · Loop Tool · Färbepinsel", "Produits seuls: Nano Rings · Tape Tabs · Pinces de section · Kératine · Disques protecteurs thermiques · Loop Tool · Pince à teinte"),
    "three product families · four categories": ("Tres familias de producto · Cuatro categorías", "Drei Produktfamilien · Vier Kategorien", "Trois familles de produits · Quatre catégories"),
    "five kits · eight single products": ("Cinco kits · Ocho productos sueltos", "Fünf Sets · Acht Einzelprodukte", "Cinq kits · Huit produits seuls"),
    "wigexporter edit": ("Edición WigExporter", "WigExporter-Edition", "Édition WigExporter"),
    "the hair edit · 01—03": ("The Hair Edit · 01—03", "The Hair Edit · 01—03", "The Hair Edit · 01—03"),
    "the wigexporter edit": ("La edición WigExporter", "Die WigExporter-Edition", "L'édition WigExporter"),
    "real production footage": ("Imágenes reales de producción", "Echte Produktionsaufnahmen", "Images réelles de production"),
    "from development to dispatch": ("Del desarrollo al envío", "Von der Entwicklung bis zum Versand", "Du développement à l'expédition"),
    "product divisions": ("Divisiones de producto", "Produktsparten", "Divisions produit"),
    "what do you need?": ("¿Qué necesita?", "Was benötigen Sie?", "De quoi avez-vous besoin ?"),
    "tell us about your requirement": ("Cuéntenos sobre su requisito", "Beschreiben Sie Ihr Anliegen", "Parlez-nous de votre besoin"),
    "tell us what you want to source": ("Cuéntenos qué desea abastecer", "Sagen Sie uns, was Sie beziehen möchten", "Dites-nous quoi sourcer"),
    "tell us about your salon, customer base or planned wholesale range": ("Cuéntenos sobre su salón, clientela o gama mayorista planeada", "Erzählen Sie uns von Ihrem Salon, Kundenstamm oder geplantem Großhandelssortiment", "Parlez-nous de votre salon, clientèle ou gamme de gros prévue"),
    "tell us where and how you sell hair": ("Cuéntenos dónde y cómo vende cabello", "Sagen Sie uns, wo und wie Sie Haar verkaufen", "Dites-nous où et comment vous vendez des cheveux"),
    "company / country": ("Empresa / País", "Unternehmen / Land", "Entreprise / Pays"),
    "company / market": ("Empresa / Mercado", "Unternehmen / Markt", "Entreprise / Marché"),
    "country / market": ("País / Mercado", "Land / Markt", "Pays / Marché"),
    "salon / company": ("Salón / Empresa", "Salon / Unternehmen", "Salon / Entreprise"),
    "distributor / wholesaler": ("Distribuidor / Mayorista", "Distributor / Großhändler", "Distributeur / Grossiste"),
    "other professional buyer": ("Otro comprador profesional", "Anderer Fachkäufer", "Autre acheteur professionnel"),
    "hair brand / retailer": ("Marca de cabello / Minorista", "Haarmarke / Einzelhändler", "Marque capillaire / Détaillant"),
    "ecommerce seller": ("Vendedor de ecommerce", "E-Commerce-Verkäufer", "Vendeur e-commerce"),
    "for salons · distributors · hair brands · professional buyers": ("Para salones · Distribuidores · Marcas de cabello · Compradores profesionales", "Für Salons · Distributoren · Haarmarken · Fachkäufer", "Pour salons · Distributeurs · Marques capillaires · Acheteurs professionnels"),
    "human hair extension range": ("Gama de extensiones de pelo humano", "Echthaar-Extensions-Sortiment", "Gamme d'extensions de cheveux humains"),
    "human hair extension tool kit": ("Kit de herramientas para extensiones de pelo humano", "Werkzeugset für Echthaar-Extensions", "Kit d'outils pour extensions de cheveux humains"),
    "human hair wig and topper construction": ("Construcción de pelucas y toppers de pelo humano", "Bauweise von Echthaar-Perücken und Toppern", "Construction de perruques et toupes en cheveux humains"),
    "human hair wig cap construction": ("Construcción de la capa de peluca de pelo humano", "Cap-Konstruktion der Echthaar-Perücke", "Construction de la coque de perruque en cheveux humains"),
    "wig cap construction detail": ("Detalle de construcción de la capa", "Cap-Konstruktionsdetail", "Détail de construction de la coque"),
    "hair made for your market.": ("Cabello hecho para su mercado.", "Haar für Ihren Markt.", "Des cheveux faits pour votre marché."),
    "find the right product family first.": ("Primero encuentre la familia de producto correcta.", "Finden Sie zuerst die richtige Produktfamilie.", "Trouvez d'abord la bonne famille de produit."),
    "build your next hair range with us.": ("Construya su próxima gama de cabello con nosotros.", "Entwickeln Sie Ihr nächstes Haar-Sortiment mit uns.", "Construisez votre prochaine gamme capillaire avec nous."),
    "from the first brief to the repeat order.": ("Del primer brief al pedido recurrente.", "Vom ersten Brief bis zur Wiederholbestellung.", "Du premier brief à la commande récurrente."),
    "more useful than a random product sample.": ("Más útil que una muestra de producto al azar.", "Nützlicher als eine zufällige Produktprobe.", "Plus utile qu'un échantillon produit au hasard."),
    "your long-term hair supply partner.": ("Su socio de suministro de cabello a largo plazo.", "Ihr langfristiger Haar-Beschaffungspartner.", "Votre partenaire d'approvisionnement capillaire à long terme."),
    "professional supply, shaped around your business.": ("Suministro profesional, diseñado para su negocio.", "Professionelle Lieferung, zugeschnitten auf Ihr Geschäft.", "Approvisionnement professionnel, adapté à votre entreprise."),
    "a supply partner, not a catalogue middleman.": ("Un socio de suministro, no un intermediario de catálogo.", "Ein Beschaffungspartner, kein Katalog-Zwischenhändler.", "Un partenaire d'approvisionnement, pas un intermédiaire de catalogue."),
    "wholesale collections · samples before scale": ("Colecciones al por mayor · Muestras antes de escalar", "Großhandels-Kollektionen · Muster vor der Skalierung", "Collections en gros · Échantillons avant le scale"),
    "sample-first sourcing · confirm before scale": ("Abastecimiento primero muestra · Confirme antes de escalar", "Muster-zuerst-Beschaffung · Bestätigen vor Skalierung", "Sourcing d'abord l'échantillon · Confirmer avant le scale"),
    "wholesale inquiry · sample · oem · private label": ("Consulta mayorista · Muestra · OEM · Marca privada", "Großhandels-Anfrage · Muster · OEM · Private Label", "Demande de gros · Échantillon · OEM · Marque privée"),
    "buyer guides · product knowledge · salon insights": ("Guías para compradores · Conocimiento de producto · Ideas de salón", "Käuferleitfäden · Produktwissen · Salon-Einblicke", "Guides acheteurs · Connaissances produit · Idées salon"),
    "built through two decades in international hair.": ("Construido durante dos décadas en cabello internacional.", "Aufgebaut über zwei Jahrzehnte im internationalen Haarhandel.", "Bâti sur deux décennies dans les cheveux internationaux."),
    "commercially useful experience.": ("Experiencia comercialmente útil.", "Kaufmännisch nützliche Erfahrung.", "Expérience commercialement utile."),
    "experience buyers can build on.": ("Experiencia en la que los compradores pueden apoyarse.", "Erfahrung, auf die Käufer aufbauen können.", "Une expérience sur laquelle les acheteurs peuvent s'appuyer."),
    "practical information for hair brands, salons, distributors and professional buyers—from construction and colour to samples and repeat supply.": ("Información práctica para marcas de cabello, salones, distribuidores y compradores profesionales—de la construcción y el color a las muestras y el suministro recurrente.", "Praktische Informationen für Haarmarken, Salons, Distributoren und Fachkäufer — von Konstruktion und Farbe bis zu Mustern und Wiederbeschaffung.", "Informations pratiques pour marques capillaires, salons, distributeurs et acheteurs professionnels — de la construction et la couleur aux échantillons et réapprovisionnement."),
    "professional extensions, wigs and toppers for salon, distributor and private-label programmes.": ("Extensiones, pelucas y toppers profesionales para programas de salón, distribuidor y marca privada.", "Professionelle Extensions, Perücken und Topper für Salon-, Distributor- und Private-Label-Programme.", "Extensions, perruques et toupes professionnelles pour salons, distributeurs et programmes de marque privée."),
    "installation tools and repeat-use accessories for extension professionals and trade buyers.": ("Herramientas de instalación y accesorios de uso recurrente para profesionales de extensiones y compradores comerciales.", "Installationswerkzeuge und Mehrweg-Zubehör für Extension-Profis und Fachkäufer.", "Outils d'installation et accessoires réutilisables pour professionnels des extensions et acheteurs pro."),
    "commercial synthetic collections for fashion, coverage and ready-to-wear hair additions.": ("Colecciones sintéticas comerciales para moda, cobertura y adiciones de cabello listas para usar.", "Kommerzielle synthetische Kollektionen für Mode, Abdeckung und sofort tragbare Haar-Ergänzungen.", "Collections synthétiques commerciales pour la mode, la couverture et ajouts capillaires prêts à porter."),
    "professional hair extension salon supplies": ("Suministros de salón para extensiones de cabello profesionales", "Professioneller Salonbedarf für Haarextensions", "Fournitures de salon pour extensions capillaires professionnelles"),
    "professional hair colour chart": ("Carta de color de cabello profesional", "Professionelle Haarfarbkarte", "Nuancier de cheveux professionnel"),
    "physical shade reference": ("Referencia física de tono", "Physische Farbreferenz", "Référence physique de teinte"),
    "colour ring and shade review": ("Anillo de color y revisión de tono", "Farbring und Farbprüfung", "Chevalet de couleurs et revue des teintes"),
    "colour consultation support": ("Soporte de consultoría de color", "Farbberatungs-Support", "Support conseil couleur"),
    "professional shade matching support for qualified trade buyers": ("Soporte de coincidencia de tono profesional para compradores comerciales calificados", "Professionelle Farbabstimmung für qualifizierte Fachkäufer", "Support d'appariement de teinte professionnel pour acheteurs pro qualifiés"),
    "ds hair colour chart 2 with 31 professional shade references": ("Carta de color DS HAIR 2 con 31 referencias de tono profesional", "DS HAIR Farbkarte 2 mit 31 professionellen Farbreferenzen", "Nuancier DS HAIR 2 avec 31 références de teinte professionnelles"),
    "ds hair colour chart 2 with 31 individual shade references": ("Carta de color DS HAIR 2 con 31 referencias de tono individuales", "DS HAIR Farbkarte 2 mit 31 einzelnen Farbreferenzen", "Nuancier DS HAIR 2 avec 31 références de teinte individuelles"),
    "ds hair colour chart 2 with 31 shade references": ("Carta de color DS HAIR 2 con 31 referencias de tono", "DS HAIR Farbkarte 2 mit 31 Farbreferenzen", "Nuancier DS HAIR 2 avec 31 références de teinte"),
    "explore the ds hair 31-colour chart and custom packaging studio": ("Explore la carta de 31 colores DS HAIR y el estudio de embalaje personalizado", "Entdecken Sie die DS HAIR 31-Farbkarte und das individuelle Verpackungsstudio", "Explorez le nuancier 31 couleurs DS HAIR et le studio d'emballage personnalisé"),
    "wholesale, oem and private-label support through wigexporter.": ("Soporte mayorista, OEM y marca privada a través de WigExporter.", "Großhandel, OEM und Private-Label-Support über WigExporter.", "Support de gros, OEM et marque privée via WigExporter."),
    "wholesale samples · colour matching · oem & private label": ("Muestras al por mayor · Coincidencia de color · OEM y marca privada", "Großhandels-Muster · Farbabstimmung · OEM und Private Label", "Échantillons en gros · Appariement couleur · OEM et marque privée"),
    "wholesale extensions, wigs, toppers and salon supplies—with colour development, sampling and private-label support for global buyers.": ("Extensiones, pelucas, toppers y suministros de salón al por mayor—con desarrollo de color, muestreo y soporte de marca privada para compradores globales.", "Großhandels-Extensions, Perücken, Topper und Salonbedarf — mit Farbentwicklung, Musterwesen und Private-Label-Support für globale Käufer.", "Extensions, perruques, toupes et fournitures de salon en gros — avec développement couleur, échantillonnage et support marque privée pour acheteurs mondiaux."),
    "b2b hair supply · oem & private label": ("Suministro de cabello B2B · OEM y marca privada", "B2B Haar-Beschaffung · OEM und Private Label", "Approvisionnement cheveux B2B · OEM et marque privée"),
    "for global wholesale & oem, and": ("Para mayorista global y OEM, y", "Für globalen Großhandel und OEM, und", "Pour le gros mondial et OEM, et"),
    "wigexporter for global b2b & oem, plus a uk salon brand (d.s hair beauty).": ("WigExporter para B2B global y OEM, además de una marca de salón en Reino Unido (D.S Hair Beauty).", "WigExporter für globalen B2B und OEM, plus eine UK-Salonmarke (D.S Hair Beauty).", "WigExporter pour le B2B mondial et OEM, plus une marque de salon UK (D.S Hair Beauty)."),
    "ds hair wholesale hair extensions, wigs and colour development": ("DS HAIR extensiones de cabello al por mayor, pelucas y desarrollo de color", "DS HAIR Großhandel Haarextensions, Perücken und Farbentwicklung", "DS HAIR extensions capillaires en gros, perruques et développement couleur"),
    "professional hair extensions, wigs and colour development": ("Extensiones de cabello, pelucas y desarrollo de color profesionales", "Professionelle Haarextensions, Perücken und Farbentwicklung", "Extensions capillaires, perruques et développement couleur professionnels"),
    "manufacturing and overseas buyer relationships developed.": ("Relaciones de fabricación y compradores en el extranjero desarrolladas.", "Fertigungs- und Auslandskäuferbeziehungen aufgebaut.", "Relations de fabrication et acheteurs outre-mer développées."),
    "operating in the international hair-products industry since 2007.": ("Operando en la industria internacional de productos capilares desde 2007.", "Tätig in der internationalen Haarproduktbranche seit 2007.", "Présent dans l'industrie internationale des produits capillaires depuis 2007."),
    "the business moved into the global hair-products industry.": ("El negocio se incorporó a la industria global de productos capilares.", "Das Unternehmen wechselte in die globale Haarproduktbranche.", "L'entreprise est passée à l'industrie mondiale des produits capillaires."),
    "the start of the founder’s international trade journey.": ("El inicio del viaje de comercio internacional del fundador.", "Der Beginn der internationalen Handelsreise des Gründers.", "Le début du parcours commercial international du fondateur."),
    "hair-industry experience since 2005": ("Experiencia en la industria del cabello desde 2005", "Haarbranchen-Erfahrung seit 2005", "Expérience de l'industrie capillaire depuis 2005"),
    "across the uk and europe since 2007.": ("En el Reino Unido y Europa desde 2007.", "In UK und Europa seit 2007.", "Au Royaume-Uni et en Europe depuis 2007."),
    "long-term supply relationships with professional buyers across the uk and europe.": ("Relaciones de suministro a largo plazo con compradores profesionales en el Reino Unido y Europa.", "Langfristige Lieferbeziehungen mit Fachkäufern in UK und Europa.", "Relations d'approvisionnement à long terme avec acheteurs pro au Royaume-Uni et en Europe."),
    "business began": ("EL NEGOCIO COMENZÓ", "GESCHÄFTSBEGINN", "LE DÉBUT DE L'ENTREPRISE"),
    "our business journey began in 2005 and moved into hair products in 2007. manufacturing knowledge and long-term export relationships followed, including professional buyers across europe and other overseas markets.": ("Nuestro recorrido comercial comenzó en 2005 y pasó a productos capilares en 2007. Siguió el conocimiento de fabricación y relaciones de exportación a largo plazo, incluyendo compradores profesionales en Europa y otros mercados extranjeros.", "Unsere Unternehmensreise begann 2005 und wechselte 2007 in Haarprodukte. Fertigungswissen und langfristige Exportbeziehungen folgten, darunter Fachkäufer in Europa und anderen Überseemärkten.", "Notre parcours a commencé en 2005 et est passé aux produits capillaires en 2007. Des connaissances en fabrication et relations d'export à long terme ont suivi, avec des acheteurs pro en Europe et autres marchés outre-mer."),
    "today, we focus on wigs, toppers, hair additions, extensions and salon supplies—with sample, colour and private-label support under one sourcing relationship.": ("Hoy nos enfocamos en pelucas, toppers, adiciones de cabello, extensiones y suministros de salón—con soporte de muestra, color y marca privada bajo una misma relación de abastecimiento.", "Heute konzentrieren wir uns auf Perücken, Topper, Haar-Ergänzungen, Extensions und Salonbedarf — mit Muster-, Farb- und Private-Label-Support in einer Beschaffungsbeziehung.", "Aujourd'hui, nous nous concentrons sur perruques, toupes, ajouts capillaires, extensions et fournitures de salon — avec support échantillon, couleur et marque privée dans une seule relation de sourcing."),
    "we aim to clarify the information required for samples or quotation rather than send a generic catalogue without context.": ("Buscamos aclarar la información requerida para muestras o cotización en lugar de enviar un catálogo genérico sin contexto.", "Wir klären die für Muster oder Angebot nötigen Informationen, statt einen generischen Katalog ohne Kontext zu senden.", "Nous clarifions les informations requises pour échantillons ou devis plutôt que d'envoyer un catalogue générique sans contexte."),
    "our role is not simply to show a catalogue. we help buyers reduce sourcing uncertainty before scaling.": ("Nuestro rol no es simplemente mostrar un catálogo. Ayudamos a los compradores a reducir la incertidumbre de abastecimiento antes de escalar.", "Unsere Rolle ist nicht nur, einen Katalog zu zeigen. Wir helfen Käufern, Beschaffungsunsicherheit vor der Skalierung zu reduzieren.", "Notre rôle n'est pas seulement d'afficher un catalogue. Nous aidons les acheteurs à réduire l'incertitude d'approvisionnement avant de passer à l'échelle."),
    "wigexporter is the global wholesale and oem entry point for d.s hair beauty. we help professional buyers define, sample, brand and reorder hair products with clearer communication.": ("WigExporter es el punto de entrada mayorista y OEM global para D.S Hair Beauty. Ayudamos a compradores profesionales a definir, muestrear, marcar y reordenar productos capilares con comunicación más clara.", "WigExporter ist der globale Großhandels- und OEM-Einstiegspunkt für D.S Hair Beauty. Wir helfen Fachkäufern, Haarprodukte zu definieren, zu mustern, zu markieren und nachzubestellen — mit klarerer Kommunikation.", "WigExporter est le point d'entrée grossiste et OEM mondial de D.S Hair Beauty. Nous aidons les acheteurs pro à définir, échantillonner, marquer et réapprovisionner les produits capillaires avec une communication plus claire."),
    "these are verified facts about the d.s hair beauty supply record — not marketing claims.": ("Estos son hechos verificados sobre el registro de suministro de D.S Hair Beauty — no afirmaciones de marketing.", "Dies sind verifizierte Fakten zur Lieferhistorie von D.S Hair Beauty — keine Marketingbehauptungen.", "Ce sont des faits vérifiés sur le dossier d'approvisionnement de D.S Hair Beauty — pas des allégations marketing."),
    "no unverified certification, “medical-grade” claim, moq, lead time or price is stated in this prototype. commercial specifications require written confirmation.": ("Ninguna certificación no verificada, afirmación “medical-grade”, MOQ, plazo de entrega o precio se indica en este prototipo. Las especificaciones comerciales requieren confirmación por escrito.", "Keine unverifizierte Zertifizierung, „medical-grade“-Behauptung, MOQ, Lieferzeit oder Preis ist in diesem Prototyp angegeben. Kommerzielle Spezifikationen erfordern schriftliche Bestätigung.", "Aucune certification non vérifiée, allégation « medical-grade », MOQ, délai ou prix n'est indiqué dans ce prototype. Les spécifications commerciales requièrent une confirmation écrite."),
    "your application will be sent securely to our sourcing team.": ("Su solicitud se enviará de forma segura a nuestro equipo de abastecimiento.", "Ihre Bewerbung wird sicher an unser Beschaffungsteam gesendet.", "Votre candidature sera envoyée en toute sécurité à notre équipe de sourcing."),
    "your details will be sent securely to our sourcing team.": ("Sus datos se enviarán de forma segura a nuestro equipo de abastecimiento.", "Ihre Daten werden sicher an unser Beschaffungsteam gesendet.", "Vos coordonnées seront envoyées en toute sécurité à notre équipe de sourcing."),
    "skip to content": ("Saltar al contenido", "Zum Inhalt springen", "Aller au contenu"),
    "open navigation": ("Abrir navegación", "Navigation öffnen", "Ouvrir la navigation"),
    "search collections": ("Buscar colecciones", "Kollektionen suchen", "Rechercher dans les collections"),
    "what to review": ("QUÉ REVISAR", "WAS ZU PRÜFEN IST", "QUE VÉRIFIER"),
    "review sample": ("REVISAR MUESTRA", "MUSTER PRÜFEN", "RÉVISER L'ÉCHANTILLON"),
    "review the product before the order.": ("Revise el producto antes del pedido.", "Prüfen Sie das Produkt vor der Bestellung.", "Vérifiez le produit avant la commande."),
    "confirm the product before the order.": ("Confirme el producto antes del pedido.", "Bestätigen Sie das Produkt vor der Bestellung.", "Confirmez le produit avant la commande."),
    "assess the approved quality and colour reference with your team.": ("Evalúe la calidad aprobada y la referencia de color con su equipo.", "Bewerten Sie die freigegebene Qualität und Farbreferenz mit Ihrem Team.", "Évaluez la qualité approuvée et la référence couleur avec votre équipe."),
    "review shade, density, length and base details against the approved brief.": ("Revise tono, densidad, largo y detalles de base contra el brief aprobado.", "Prüfen Sie Ton, Dichte, Länge und Basidetails gegen den freigegebenen Brief.", "Vérifiez teinte, densité, longueur et détails de base par rapport au brief approuvé."),
    "review your target shade range, rooted blends and repeat-order references before launch. final availability and development requirements are confirmed with your quote.": ("Revise su rango de tono objetivo, mezclas con raíz y referencias de pedido recurrente antes del lanzamiento. La disponibilidad final y los requisitos de desarrollo se confirman con su cotización.", "Prüfen Sie Ihren Zieltonbereich, rooted Blends und Wiederbestell-Referenzen vor dem Launch. Finale Verfügbarkeit und Entwicklungsanforderungen werden mit dem Angebot bestätigt.", "Revoyez votre gamme de teintes cible, mélanges enracinés et références de réappro avant le lancement. Disponibilité finale et exigences de développement confirmées avec votre devis."),
    "review construction, fibre or hair quality, colour and packaging direction before repeat production.": ("Revise construcción, calidad de fibra o cabello, color y dirección de embalaje antes de la producción recurrente.", "Prüfen Sie Konstruktion, Faser- oder Haarqualität, Farbe und Verpackungsrichtung vor der Wiederproduktion.", "Vérifiez construction, qualité de fibre ou cheveux, couleur et direction d'emballage avant la production récurrente."),
    "review cap or base construction, colour, length, density and styling requirements.": ("Revise construcción de capa o base, color, largo, densidad y requisitos de peinado.", "Prüfen Sie Cap- oder Basiskonstruktion, Farbe, Länge, Dichte und Styling-Anforderungen.", "Vérifiez construction de coque ou base, couleur, longueur, densité et exigences de coiffage."),
    "review the elements that control your customer experience: material direction, feel, colour, density, base or attachment, dimensions, packaging and expected reorder consistency.": ("Revise los elementos que controlan la experiencia de su cliente: dirección de material, tacto, color, densidad, base o fijación, dimensiones, embalaje y consistencia de reorden esperada.", "Prüfen Sie die Elemente, die das Kundenerlebnis steuern: Materialrichtung, Griff, Farbe, Dichte, Base oder Befestigung, Maße, Verpackung und erwartete Wiederbestell-Konsistenz.", "Vérifiez les éléments qui contrôlent l'expérience client : orientation matériau, toucher, couleur, densité, base ou fixation, dimensions, emballage et cohérence de réappro attendue."),
    "what professional buyers should verify in a wig sample": ("Qué deben verificar los compradores profesionales en una muestra de peluca", "Was Fachkäufer in einer Perückenprobe prüfen sollten", "Ce que les acheteurs pro doivent vérifier dans un échantillon de perruque"),
    "better decisions begin with better product knowledge.": ("Mejores decisiones comienzan con mejor conocimiento del producto.", "Bessere Entscheidungen beginnen mit besserem Produktwissen.", "De meilleures décisions commencent avec une meilleure connaissance produit."),
    "a practical tool for buyer and salon conversations.": ("Una herramienta práctica para conversaciones de comprador y salón.", "Ein praktisches Werkzeug für Käufer- und Salongespräche.", "Un outil pratique pour conversations acheteur et salon."),
    "tape hair, k-tips or wefts: which range fits your market?": ("Cabello tape-in, K-tips o wefts: ¿qué gama se ajusta a su mercado?", "Tape-Haar, K-Tips oder Wefts: Welche Range passt zu Ihrem Markt?", "Cheveux tape-in, K-tips ou wefts : quelle gamme convient à votre marché ?"),
    "how to build a shade range buyers can reorder confidently": ("Cómo construir una gama de tonos que los compradores puedan reordenar con confianza", "Wie man einen Farbbereich aufbaut, den Käufer sicher nachbestellen", "Comment construire une gamme de teintes que les acheteurs peuvent réapprovisionner en confiance"),
    "why rooted blends, physical references and clear shade naming matter at wholesale.": ("Por qué las mezclas con raíz, referencias físicas y nombres de tono claros importan al por mayor.", "Warum rooted Blends, physische Referenzen und klare Farbnamen im Großhandel zählen.", "Pourquoi les mélanges enracinés, références physiques et noms de teinte clairs comptent en gros."),
    "build a colour system your buyers can trust.": ("Construya un sistema de color en el que sus compradores confíen.", "Bauen Sie ein Farbsystem, dem Ihre Käufer vertrauen können.", "Construisez un système de couleur en qui vos acheteurs ont confiance."),
    "make the product fit your market.": ("Haga que el producto se ajuste a su mercado.", "Machen Sie das Produkt passend für Ihren Markt.", "Adaptez le produit à votre marché."),
    "start with the buying requirement.": ("Empiece con el requisito de compra.", "Beginnen Sie mit der Kaufanforderung.", "Commencez par le besoin d'achat."),
    "match shades with more confidence.": ("Coincida tonos con más confianza.", "Farben mit mehr Sicherheit abstimmen.", "Appariez les teintes avec plus de confiance."),
    "find the right product family first.": ("Encuentre la familia de producto correcta primero.", "Finden Sie zuerst die richtige Produktfamilie.", "Trouvez d'abord la bonne famille de produit."),
    "two routes, one supply engine:": ("Dos rutas, un motor de suministro:", "Zwei Wege, eine Beschaffungsmaschine:", "Deux voies, un moteur d'approvisionnement :"),
    "your business and colour needs": ("Su negocio y necesidades de color", "Ihr Geschäft und Farbbedarf", "Votre entreprise et besoins couleur"),
    "packaging and brand support": ("Soporte de embalaje y marca", "Verpackungs- und Marken-Support", "Support emballage et marque"),
    "colour consultation support": ("Soporte de consultoría de color", "Farbberatungs-Support", "Support conseil couleur"),
    "hair made for your market.": ("Cabello hecho para su mercado.", "Haar für Ihren Markt.", "Des cheveux faits pour votre marché."),
    "talk to the sourcing team.": ("Hable con el equipo de abastecimiento.", "Sprechen Sie mit dem Beschaffungsteam.", "Parlez à l'équipe de sourcing."),
    "clear buyer communication": ("Comunicación clara con el comprador", "Klare Käuferkommunikation", "Communication acheteur claire"),
    "four focused categories.": ("Cuatro categorías enfocadas.", "Vier fokussierte Kategorien.", "Quatre catégories ciblées."),
    "three product families.": ("Tres familias de producto.", "Drei Produktfamilien.", "Trois familles de produit."),
    "build repeatable ranges": ("Construya gamas repetibles", "Wiederholbare Sortimente aufbauen", "Construisez des gammes répétables"),
    "wholesale buyer support": ("Soporte a comprador mayorista", "Großhandels-Käufer-Support", "Support acheteur en gros"),
    "sample-first sourcing": ("Abastecimiento primero muestra", "Muster-zuerst-Beschaffung", "Sourcing d'abord l'échantillon"),
    "approval before scale": ("Aprobación antes de escalar", "Freigabe vor Skalierung", "Approbation avant le scale"),
    "private-label support": ("Soporte de marca privada", "Private-Label-Support", "Support marque privée"),
    "global export support": ("Soporte de exportación global", "Globaler Export-Support", "Support export mondial"),
    "export communication": ("Comunicación de exportación", "Export-Kommunikation", "Communication export"),
    "reduce sourcing risk": ("Reduzca el riesgo de abastecimiento", "Beschaffungsrisiko reduzieren", "Réduire le risque d'approvisionnement"),
    "trade range planning": ("Planificación de gama comercial", "Handels-Sortimentsplanung", "Planification de gamme pro"),
    "repeat-order clarity": ("Claridad de pedido recurrente", "Wiederbestell-Klarheit", "Clarté de réappro"),
    "construction samples": ("Muestras de construcción", "Konstruktionsmuster", "Échantillons de construction"),
    "product sampling": ("Muestreo de producto", "Produktmusterung", "Échantillonnage produit"),
    "focused sourcing": ("Abastecimiento enfocado", "Fokussierte Beschaffung", "Sourcing ciblé"),
    "packaging direction": ("Dirección de embalaje", "Verpackungsrichtung", "Direction d'emballage"),
    "professional buyers": ("Compradores profesionales", "Fachkäufer", "Acheteurs professionnels"),
    "oem / private label": ("OEM / Marca privada", "OEM / Private Label", "OEM / Marque privée"),
    "hair-category focus": ("Enfoque en categoría de cabello", "Haar-Kategorie-Fokus", "Focus catégorie cheveux"),
    "production & export": ("Producción y exportación", "Produktion und Export", "Production et export"),
    "colour development": ("Desarrollo de color", "Farbentwicklung", "Développement couleur"),
    "confirm options": ("Confirmar opciones", "Optionen bestätigen", "Confirmer les options"),
    "plan next order": ("Planificar próximo pedido", "Nächste Bestellung planen", "Planifier prochaine commande"),
    "send your brief": ("Envíe su brief", "Senden Sie Ihren Brief", "Envoyez votre brief"),
    "free color kits": ("KITS DE COLOR GRATIS", "KOSTENLOSE FARBSETS", "KITS DE COULEUR GRATUITS"),
    "sample support": ("SOPORTE DE MUESTRAS", "MUSTER-SUPPORT", "SUPPORT ÉCHANTILLON"),
    "direct contact": ("CONTACTO DIRECTO", "DIREKTER KONTAKT", "CONTACT DIRECT"),
    "about d.s hair": ("ACERCA DE D.S HAIR", "ÜBER D.S HAIR", "À PROPOS DE D.S HAIR"),
    "brands developed": ("MARCAS DESARROLLADAS", "ENTWICKELTE MARKEN", "MARQUES DÉVELOPPÉES"),
    "50+ hair brands": ("50+ MARCAS DE CABELLO", "50+ HAARMARKEN", "50+ MARQUES CAPILLAIRES"),
    "years in hair": ("AÑOS EN CABELLO", "JAHRE IM HAAR", "ANNÉES DANS LES CHEVEUX"),
    "trusted by": ("CONFIAN EN NOSOTROS", "VERTRAUT VON", "ILS NOUS FONT CONFIANCE"),
    "your partner": ("SU SOCIO", "IHR PARTNER", "VOTRE PARTENAIRE"),
    "make & brand": ("HAGA Y MARQUE", "MACHE & MARKE", "FAITES & MARQUEZ"),
    "product brief": ("BRIEF DE PRODUCTO", "PRODUKT-BRIEF", "BRIEF PRODUIT"),
    "repeat supply": ("SUMINISTRO RECURRENTE", "WIEDERHOLTE LIEFERUNG", "RÉAPPROVISIONNEMENT"),
    "business type": ("TIPO DE EMPRESA", "GESCHÄFTSTYP", "TYPE D'ENTREPRISE"),
    "contact / rfq": ("CONTACTO / SOLICITUD", "KONTAKT / ANFRAGE", "CONTACT / DEMANDE"),
    "development": ("DESARROLLO", "ENTWICKLUNG", "DÉVELOPPEMENT"),
    "requirement": ("REQUISITO", "ANFORDERUNG", "EXIGENCE"),
    "oem support": ("SOPORTE OEM", "OEM-SUPPORT", "SUPPORT OEM"),
    "uk & eu": ("UK Y UE", "UK UND EU", "UK ET EU"),
    "human hair": ("PELO HUMANO", "ECHTHAAR", "CHEVEUX HUMAINS"),
    "hair focus": ("ENFOQUE EN CABELLO", "HAAR-FOKUS", "FOCUS CHEVEUX"),
    "extensions": ("EXTENSIONES", "EXTENSIONS", "EXTENSIONS"),
    "next step": ("SIGUIENTE PASO", "NÄCHSTER SCHRITT", "PROCHAINE ÉTAPE"),
    "products": ("PRODUCTOS", "PRODUKTE", "PRODUITS"),
    "2 tracks": ("2 VÍAS", "2 WEGE", "2 VOIES"),
    "company": ("EMPRESA", "UNTERNEHMEN", "ENTREPRISE"),
    "explore": ("EXPLORAR", "ENTDECKEN", "EXPLORER"),
    "country": ("PAÍS", "LAND", "PAYS"),
    "sample": ("MUESTRA", "MUSTER", "ÉCHANTILLON"),
    "salon": ("SALÓN", "SALON", "SALON"),
    "today": ("HOY", "HEUTE", "AUJOURD'HUI"),
    "name": ("NOMBRE", "NAME", "NOM"),
    "next": ("SIGUIENTE", "WEITER", "SUIVANT"),
    # ---- Titles (page <title> and meta) ----
    "apply for a wholesale hair trade account | wigexporter": ("Solicite una cuenta comercial de cabello al por mayor | WigExporter", "Beantragen Sie ein Großhandels-Konto für Haarprodukte | WigExporter", "Demandez un compte professionnel de cheveux en gros | WigExporter"),
    "apply for a wholesale hair trade account | wigexporter – ds hair": ("Solicite una cuenta comercial de cabello al por mayor | WigExporter – DS HAIR", "Beantragen Sie ein Großhandels-Konto für Haarprodukte | WigExporter – DS HAIR", "Demandez un compte professionnel de cheveux en gros | WigExporter – DS HAIR"),
    "wholesale wigs & hair extensions supplier | ds hair": ("Proveedor mayorista de pelucas y extensiones de cabello | DS HAIR", "Großhändler für Perücken und Haarextensions | DS HAIR", "Fournisseur de perruques et extensions capillaires en gros | DS HAIR"),
    "free hair color kits for trade buyers | wigexporter": ("Kits de color de cabello gratis para compradores profesionales | WigExporter", "Kostenlose Haarfarben-Sets für Fachkäufer | WigExporter", "Kits de couleur capillaire gratuits pour acheteurs professionnels | WigExporter"),
    "free hair color kits for trade buyers | wigexporter – ds hair": ("Kits de color de cabello gratis para compradores profesionales | WigExporter – DS HAIR", "Kostenlose Haarfarben-Sets für Fachkäufer | WigExporter – DS HAIR", "Kits de couleur capillaire gratuits pour acheteurs professionnels | WigExporter – DS HAIR"),
    "wholesale hair collections | wigexporter": ("Colecciones de cabello al por mayor | WigExporter", "Großhandels-Kollektionen für Haar | WigExporter", "Collections de cheveux en gros | WigExporter"),
    "wholesale hair collections | wigexporter – ds hair": ("Colecciones de cabello al por mayor | WigExporter – DS HAIR", "Großhandels-Kollektionen für Haar | WigExporter – DS HAIR", "Collections de cheveux en gros | WigExporter – DS HAIR"),
    "request a wholesale hair quote | ds hair": ("Solicite una cotización de cabello al por mayor | DS HAIR", "Fordern Sie ein Großhandels-Angebot für Haar an | DS HAIR", "Demandez un devis de cheveux en gros | DS HAIR"),
    "request a wholesale hair quote | ds hair – ds hair": ("Solicite una cotización de cabello al por mayor | DS HAIR – DS HAIR", "Fordern Sie ein Großhandels-Angebot für Haar an | DS HAIR – DS HAIR", "Demandez un devis de cheveux en gros | DS HAIR – DS HAIR"),
    "wholesale hair samples | wigexporter": ("Muestras de cabello al por mayor | WigExporter", "Großhandels-Muster für Haar | WigExporter", "Échantillons de cheveux en gros | WigExporter"),
    "wholesale hair samples | wigexporter – ds hair": ("Muestras de cabello al por mayor | WigExporter – DS HAIR", "Großhandels-Muster für Haar | WigExporter – DS HAIR", "Échantillons de cheveux en gros | WigExporter – DS HAIR"),
    "about d.s hair beauty | wigexporter": ("Acerca de D.S Hair Beauty | WigExporter", "Über D.S Hair Beauty | WigExporter", "À propos de D.S Hair Beauty | WigExporter"),
    "about d.s hair beauty | wigexporter – ds hair": ("Acerca de D.S Hair Beauty | WigExporter – DS HAIR", "Über D.S Hair Beauty | WigExporter – DS HAIR", "À propos de D.S Hair Beauty | WigExporter – DS HAIR"),
    "wholesale hair knowledge & buyer guides | wigexporter blog": ("Conocimientos de cabello al por mayor y guías para compradores | Blog de WigExporter", "Großhandels-Wissen und Käuferleitfäden | WigExporter Blog", "Connaissances cheveux en gros et guides acheteurs | Blog WigExporter"),
    "wholesale hair knowledge & buyer guides | wigexporter blog – ds hair": ("Conocimientos de cabello al por mayor y guías para compradores | Blog de WigExporter – DS HAIR", "Großhandels-Wissen und Käuferleitfäden | WigExporter Blog – DS HAIR", "Connaissances cheveux en gros et guides acheteurs | Blog WigExporter – DS HAIR"),
    "wholesale hair knowledge & buyer guides | wigexporter blog": ("Conocimientos de cabello al por mayor y guías para compradores | Blog de WigExporter", "Großhandels-Wissen und Käuferleitfäden | WigExporter Blog", "Connaissances cheveux en gros et guides acheteurs | Blog WigExporter"),
    # ---- Long descriptive paragraphs (meta descriptions / intros) ----
    "ds hair supplies wholesale wigs, toppers, ponytails and human hair extensions for global b2b buyers, with oem, private-label, colour and sample support.": ("DS HAIR suministra pelucas, toppers, colas y extensiones de pelo humano al por mayor para compradores B2B globales, con soporte OEM, marca privada, color y muestras.", "DS HAIR liefert Großhandels-Perücken, Topper, Pferdeschwänze und Echthaar-Extensions für globale B2B-Käufer, mit OEM, Private-Label, Farbe und Muster-Support.", "DS HAIR fournit en gros perruques, toupes, queues de cheval et extensions de cheveux humains pour acheteurs B2B mondiaux, avec support OEM, marque privée, couleur et échantillons."),
    "meet d.s hair beauty: our hair-industry story, why professional buyers choose us and how we support wholesale and private-label partners.": ("Conozca D.S Hair Beauty: nuestra historia en la industria del cabello, por qué los compradores profesionales nos eligen y cómo apoyamos a socios mayoristas y de marca privada.", "Lernen Sie D.S Hair Beauty kennen: unsere Haarbranchen-Story, warum Fachkäufer uns wählen und wie wir Großhandels- und Private-Label-Partner unterstützen.", "Découvrez D.S Hair Beauty : notre histoire dans l'industrie capillaire, pourquoi les acheteurs pro nous choisissent et comment nous soutenons les partenaires de gros et de marque privée."),
    "practical wholesale hair guides covering extensions, wigs, toppers, colour systems, sampling, private label and salon supply.": ("Guías prácticas de cabello al por mayor que cubren extensiones, pelucas, toppers, sistemas de color, muestreo, marca privada y suministros de salón.", "Praktische Großhandels-Haarguides zu Extensions, Perücken, Toppern, Farbsystemen, Musterwesen, Private Label und Salonbedarf.", "Guides cheveux en gros pratiques couvrant extensions, perruques, toupes, systèmes de couleur, échantillonnage, marque privée et fournitures de salon."),
    "apply for a wigexporter trade account for wholesale wigs, toppers, hair extensions, salon supplies and oem development.": ("Solicite una cuenta comercial WigExporter para pelucas, toppers, extensiones, suministros de salón y desarrollo OEM al por mayor.", "Beantragen Sie ein WigExporter-Handelskonto für Großhandels-Perücken, Topper, Haarextensions, Salonbedarf und OEM-Entwicklung.", "Demandez un compte professionnel WigExporter pour perruques, toupes, extensions, fournitures de salon et développement OEM en gros."),
    "contact ds hair at wigexporter for wholesale wigs, toppers, hair extensions, samples and private-label development.": ("Contacte a DS HAIR en WigExporter para pelucas, toppers, extensiones, muestras y desarrollo de marca privada al por mayor.", "Kontaktieren Sie DS HAIR bei WigExporter für Großhandels-Perücken, Topper, Haarextensions, Muster und Private-Label-Entwicklung.", "Contactez DS HAIR chez WigExporter pour perruques, toupes, extensions, échantillons et développement de marque privée en gros."),
    "explore wholesale wigs, toppers, ponytails and human hair extensions for oem, private-label and repeat supply.": ("Explore pelucas, toppers, colas y extensiones de pelo humano al por mayor para OEM, marca privada y suministro recurrente.", "Entdecken Sie Großhandels-Perücken, Topper, Pferdeschwänze und Echthaar-Extensions für OEM, Private Label und Wiederbeschaffung.", "Explorez perruques, toupes, queues de cheval et extensions de cheveux humains en gros pour OEM, marque privée et réapprovisionnement."),
    "request a free hair colour kit for professional shade matching and wholesale range planning with wigexporter.": ("Solicite un kit de color de cabello gratis para coincidencia de tono profesional y planificación de gama mayorista con WigExporter.", "Fordern Sie ein kostenloses Haarfarben-Set für professionelle Farbabstimmung und Großhandels-Sortimentsplanung mit WigExporter an.", "Demandez un kit de couleur capillaire gratuit pour appariement de teinte pro et planification de gamme de gros avec WigExporter."),
    "request wholesale wig, topper and hair-extension samples before repeat supply or private-label development.": ("Solicite muestras de pelucas, toppers y extensiones de cabello al por mayor antes del suministro recurrente o desarrollo de marca privada.", "Fordern Sie Großhandels-Perücken-, Topper- und Haarextensions-Muster vor Wiederbeschaffung oder Private-Label-Entwicklung an.", "Demandez des échantillons de perruques, toupes et extensions capillaires en gros avant réappro ou développement de marque privée."),
    "our business journey began in 2005 and moved into hair products in 2007. manufacturing knowledge and long-term export relationships followed, including professional buyers across europe and other overseas markets.": ("Nuestro recorrido comercial comenzó en 2005 y pasó a productos capilares en 2007. Siguió el conocimiento de fabricación y relaciones de exportación a largo plazo, incluyendo compradores profesionales en Europa y otros mercados extranjeros.", "Unsere Unternehmensreise begann 2005 und wechselte 2007 in Haarprodukte. Fertigungswissen und langfristige Exportbeziehungen folgten, darunter Fachkäufer in Europa und anderen Überseemärkten.", "Notre parcours a commencé en 2005 et est passé aux produits capillaires en 2007. Des connaissances en fabrication et relations d'export à long terme ont suivi, avec des acheteurs pro en Europe et autres marchés outre-mer."),
    "use the kit to compare shades in person, discuss target blends and create a clearer reference before product sampling. availability and delivery eligibility are confirmed after review.": ("Use el kit para comparar tonos en persona, discutir mezclas objetivo y crear una referencia más clara antes del muestreo de producto. La disponibilidad y elegibilidad de entrega se confirman tras revisión.", "Nutzen Sie das Set, um Töne persönlich zu vergleichen, Zielmischungen zu besprechen und eine klarere Referenz vor der Produktmusterung zu erstellen. Verfügbarkeit und Lieferberechtigung werden nach Prüfung bestätigt.", "Utilisez le kit pour comparer les teintes en personne, discuter mélanges cibles et créer une référence plus claire avant l'échantillonnage produit. Disponibilité et éligibilité livraison confirmées après revue."),
    "we coordinate the details that make a wholesale relationship workable: product direction, colour references, sample approval, packaging, production communication and export support.": ("Coordinamos los detalles que hacen viable una relación mayorista: dirección de producto, referencias de color, aprobación de muestras, embalaje, comunicación de producción y soporte de exportación.", "Wir koordinieren die Details, die eine Großhandelsbeziehung funktionsfähig machen: Produktrichtung, Farbreferenzen, Musterfreigabe, Verpackung, Produktionskommunikation und Export-Support.", "Nous coordonnons les détails qui rendent une relation de gros viable : orientation produit, références couleur, approbation échantillon, emballage, communication production et support export."),
    "choose one of four product categories across human hair, synthetic hair and salon supplies. samples, colour kits, packaging, oem and trade accounts remain separate trade services.": ("Elija una de cuatro categorías de producto entre pelo humano, pelo sintético y suministros de salón. Muestras, kits de color, embalaje, OEM y cuentas comerciales siguen siendo servicios comerciales separados.", "Wählen Sie eine von vier Produktkategorien aus Echthaar, Synthetikhaar und Salonbedarf. Muster, Farbsets, Verpackung, OEM und Handelskonten bleiben separate Handelsservices.", "Choisissez l'une des quatre catégories de produit parmi cheveux humains, cheveux synthétiques et fournitures de salon. Échantillons, kits couleur, emballage, OEM et comptes pro restent des services pro séparés."),
    "choose the material family first, then the product category. this keeps human hair, synthetic hair and salon supplies commercially clear for buyers, sampling and repeat orders.": ("Elija primero la familia de material, luego la categoría de producto. Esto mantiene pelo humano, pelo sintético y suministros de salón comercialmente claros para compradores, muestreo y pedidos recurrentes.", "Wählen Sie zuerst die Materialfamilie, dann die Produktkategorie. Das hält Echthaar, Synthetikhaar und Salonbedarf kommerziell klar für Käufer, Musterwesen und Wiederbestellungen.", "Choisissez d'abord la famille de matériau, puis la catégorie. Cela garde cheveux humains, cheveux synthétiques et fournitures de salon clairs commercialement pour acheteurs, échantillonnage et commandes récurrentes."),
    "a sample is the beginning of a quality reference. tell us what you are comparing and which market you serve; we will identify the information needed before a sample quote.": ("Una muestra es el inicio de una referencia de calidad. Cuéntenos qué compara y qué mercado atiende; identificaremos la información necesaria antes de una cotización de muestra.", "Ein Muster ist der Beginn einer Qualitätsreferenz. Sagen Sie uns, was Sie vergleichen und welchen Markt Sie bedienen; wir ermitteln die nötigen Informationen vor einem Musterangebot.", "Un échantillon est le début d'une référence qualité. Dites-nous quoi comparer et quel marché vous servez ; nous identifierons les infos nécessaires avant un devis échantillon."),
    "for a useful first reply, include the product type, material direction, target market, expected quantity and whether you need standard wholesale or private label.": ("Para una primera respuesta útil, incluya el tipo de producto, dirección de material, mercado objetivo, cantidad esperada y si necesita mayorista estándar o marca privada.", "Für eine nützliche erste Antwort nennen Sie Produkttyp, Materialrichtung, Zielmarkt, erwartete Menge und ob Sie Standard-Großhandel oder Private Label benötigen.", "Pour une première réponse utile, indiquez type de produit, orientation matériau, marché cible, quantité prévue et si vous voulez du gros standard ou marque privée."),
    "tell us about your company, target market and product needs. we will identify the right collection, sampling route and information needed for a quotation.": ("Cuéntenos sobre su empresa, mercado objetivo y necesidades de producto. Identificaremos la colección correcta, la ruta de muestreo y la información necesaria para una cotización.", "Erzählen Sie uns von Ihrem Unternehmen, Zielmarkt und Produktbedarf. Wir ermitteln die richtige Kollektion, Musterroute und Infos für ein Angebot.", "Parlez-nous de votre entreprise, marché cible et besoins produit. Nous identifierons la bonne collection, la voie d'échantillonnage et les infos pour un devis."),
    "qualified salons and professional buyers can request a physical colour reference to support consultations, range planning and more reliable repeat orders.": ("Salones calificados y compradores profesionales pueden solicitar una referencia de color física para apoyar consultas, planificación de gama y pedidos recurrentes más confiables.", "Qualifizierte Salons und Fachkäufer können eine physische Farbreferenz anfordern, um Beratungen, Sortimentsplanung und verlässlichere Wiederbestellungen zu unterstützen.", "Salons qualifiés et acheteurs pro peuvent demander une référence couleur physique pour soutenir consultations, planification de gamme et commandes récurrentes plus fiables."),
    "we support overseas buyers with product development, colour review, sample coordination and export communication across wigs, toppers and extensions.": ("Apoyamos a compradores en el extranjero con desarrollo de producto, revisión de color, coordinación de muestras y comunicación de exportación en pelucas, toppers y extensiones.", "Wir unterstützen Auslandskäufer bei Produktentwicklung, Farbprüfung, Musterkoordination und Export-Kommunikation über Perücken, Topper und Extensions.", "Nous soutenons acheteurs outre-mer avec développement produit, revue couleur, coordination échantillons et communication export sur perruques, toupes et extensions."),
    "reduce buying risk before committing to a range. review fibre or hair quality, colour, base construction and packaging direction with your team.": ("Reduzca el riesgo de compra antes de comprometerse con una gama. Revise calidad de fibra o cabello, color, construcción de base y dirección de embalaje con su equipo.", "Reduzieren Sie das Einkaufsrisiko vor der Festlegung auf ein Sortiment. Prüfen Sie Faser- oder Haarqualität, Farbe, Basiskonstruktion und Verpackungsrichtung mit Ihrem Team.", "Réduisez le risque d'achat avant de vous engager sur une gamme. Vérifiez qualité de fibre ou cheveux, couleur, construction de base et direction d'emballage avec votre équipe."),
    "we review requests so the colour support goes to active salons and relevant trade buyers.": ("Revisamos las solicitudes para que el soporte de color llegue a salones activos y compradores comerciales relevantes.", "Wir prüfen Anfragen, damit der Farb-Support an aktive Salons und relevante Fachkäufer geht.", "Nous examinons les demandes pour que le support couleur aille aux salons actifs et acheteurs pro pertinents."),
    "human hair, synthetic hair and salon supplies are kept commercially clear for specification and repeat ordering.": ("Pelo humano, pelo sintético y suministros de salón se mantienen comercialmente claros para especificación y pedidos recurrentes.", "Echthaar, Synthetikhaar und Salonbedarf bleiben kommerziell klar für Spezifikation und Wiederbestellung.", "Cheveux humains, cheveux synthétiques et fournitures de salon restent clairs commercialement pour spécification et commandes récurrentes."),
    "your request will be reviewed by our sourcing team. eligibility and delivery terms are confirmed separately.": ("Su solicitud será revisada por nuestro equipo de abastecimiento. La elegibilidad y términos de entrega se confirman por separado.", "Ihre Anfrage wird von unserem Beschaffungsteam geprüft. Berechtigung und Lieferbedingungen werden separat bestätigt.", "Votre demande sera examinée par notre équipe de sourcing. Éligibilité et conditions de livraison confirmées séparément."),
    "customisation is developed around your brief and confirmed through samples before repeat production.": ("La personalización se desarrolla en torno a su brief y se confirma mediante muestras antes de la producción recurrente.", "Die Individualisierung wird um Ihren Brief entwickelt und vor der Wiederproduktion über Muster bestätigt.", "La personnalisation est développée autour de votre brief et confirmée par échantillons avant la production récurrente."),
    "review construction, fibre or hair quality, colour and packaging direction before repeat production.": ("Revise construcción, calidad de fibra o cabello, color y dirección de embalaje antes de la producción recurrente.", "Prüfen Sie Konstruktion, Faser- oder Haarqualität, Farbe und Verpackungsrichtung vor der Wiederproduktion.", "Vérifiez construction, qualité de fibre ou cheveux, couleur et direction d'emballage avant la production récurrente."),
    "build product and brand details around your market rather than accepting a one-size-fits-all range.": ("Construya detalles de producto y marca en torno a su mercado en lugar de aceptar una gama única para todos.", "Bauen Sie Produkt- und Markendetails um Ihren Markt statt einer Einheitsgröße für alle.", "Construisez les détails produit et marque autour de votre marché plutôt qu'accepter une gamme unique pour tous."),
    "develop professional ranges by method, colour, length, weight and packaging direction.": ("Desarrolle gamas profesionales por método, color, largo, peso y dirección de embalaje.", "Entwickeln Sie professionelle Sortimente nach Methode, Farbe, Länge, Gewicht und Verpackungsrichtung.", "Développez des gammes pro par méthode, couleur, longueur, poids et direction d'emballage."),
    "a buyer-focused comparison of application, maintenance and positioning considerations.": ("Una comparación centrada en el comprador de consideraciones de aplicación, mantenimiento y posicionamiento.", "Ein käuferfokussierter Vergleich von Anwendung, Pflege und Positionierung.", "Une comparaison centrée acheteur des considérations d'application, entretien et positionnement."),
    "base construction, density, hair direction and the details that affect repeat quality.": ("Construcción de base, densidad, dirección del cabello y los detalles que afectan la calidad recurrente.", "Basiskonstruktion, Dichte, Haarrichtung und Details, die die Wiederholqualität beeinflussen.", "Construction de base, densité, direction cheveux et détails qui affectent la qualité récurrente."),
    "define target buyer, construction, fibre or hair direction and commercial position.": ("Defina comprador objetivo, construcción, dirección de fibra o cabello y posición comercial.", "Definieren Sie Zielkäufer, Konstruktion, Faser- oder Haarrichtung und kommerzielle Position.", "Définissez acheteur cible, construction, direction de fibre ou cheveux et position commerciale."),
    "why rooted blends, physical references and clear shade naming matter at wholesale.": ("Por qué las mezclas con raíz, referencias físicas y nombres de tono claros importan al por mayor.", "Warum rooted Blends, physische Referenzen und klare Farbnamen im Großhandel zählen.", "Pourquoi les mélanges enracinés, références physiques et noms de teinte clairs comptent en gros."),
    "private-label and wholesale programmes supported for more than fifty hair brands.": ("Programas de marca privada y mayorista respaldados para más de cincuenta marcas de cabello.", "Private-Label- und Großhandelsprogramme für mehr als fünfzig Haarmarken unterstützt.", "Programmes de marque privée et de gros soutenus pour plus de cinquante marques capillaires."),
    "develop style, fibre, colour and packaging around your target buyer and channel.": ("Desarrolle estilo, fibra, color y embalaje en torno a su comprador objetivo y canal.", "Entwickeln Sie Stil, Faser, Farbe und Verpackung um Ihren Zielkäufer und Kanal.", "Développez style, fibre, couleur et emballage autour de votre acheteur cible et canal."),
    "confirm production, quality reference and reorder communication before scaling.": ("Confirme producción, referencia de calidad y comunicación de reorden antes de escalar.", "Bestätigen Sie Produktion, Qualitätsreferenz und Wiederbestell-Kommunikation vor der Skalierung.", "Confirmez production, référence qualité et communication de réappro avant le scale."),
    "develop labels, packaging and supporting product information for your market.": ("Desarrolle etiquetas, embalaje e información de producto de soporte para su mercado.", "Entwickeln Sie Etiketten, Verpackung und unterstützende Produktinformationen für Ihren Markt.", "Développez étiquettes, emballage et informations produit de support pour votre marché."),
    "client-neutral rigid drawer box concept for private-label hair packaging": ("Concepto de caja de cajón rígida neutra para cliente para embalaje de cabello de marca privada", "Kundenneutrales Konzept einer starren Schubladenbox für Private-Label-Haarverpackung", "Concept de boîte tiroir rigide neutre pour client pour emballage cheveux marque privée"),
    "the packaging visual is an original, client-neutral concept preview—not a photograph of a finished customer order.": ("El visual de embalaje es una vista previa de concepto original y neutral para el cliente—no una fotografía de un pedido de cliente terminado.", "Die Verpackungsgrafik ist eine originale, kundenneutrale Konzeptvorschau — kein Foto eines fertigen Kundenauftrags.", "Le visuel d'emballage est un aperçu de concept original et neutre pour client — pas une photo d'une commande client finie."),
    "target product, quality, colour range, estimated quantity and launch market": ("Producto objetivo, calidad, gama de color, cantidad estimada y mercado de lanzamiento", "Zielprodukt, Qualität, Farbbereich, geschätzte Menge und Launch-Markt", "Produit cible, qualité, gamme de couleur, quantité estimée et marché de lancement"),
    "product, material, colour range, quantity and target market": ("Producto, material, gama de color, cantidad y mercado objetivo", "Produkt, Material, Farbbereich, Menge und Zielmarkt", "Produit, matériau, gamme de couleur, quantité et marché cible"),
    "product, material, colour, quantity and target market": ("Producto, material, color, cantidad y mercado objetivo", "Produkt, Material, Farbe, Menge und Zielmarkt", "Produit, matériau, couleur, quantité et marché cible"),
    "product type, target market, quantity range and quality position.": ("Tipo de producto, mercado objetivo, rango de cantidad y posición de calidad.", "Produkttyp, Zielmarkt, Mengenbereich und Qualitätsposition.", "Type de produit, marché cible, fourchette de quantité et position qualité."),
    "target product, quality, colour range, estimated quantity and launch market": ("Producto objetivo, calidad, gama de color, cantidad estimada y mercado de lanzamiento", "Zielprodukt, Qualität, Farbbereich, geschätzte Menge und Launch-Markt", "Produit cible, qualité, gamme de couleur, quantité estimée et marché de lancement"),
    "review shade, density, length and base details against the approved brief.": ("Revise tono, densidad, largo y detalles de base contra el brief aprobado.", "Prüfen Sie Ton, Dichte, Länge und Basidetails gegen den freigegebenen Brief.", "Vérifiez teinte, densité, longueur et détails de base par rapport au brief approuvé."),
    "the packaging visual is an original, client-neutral concept preview—not a photograph of a finished customer order.": ("El visual de embalaje es una vista previa de concepto original y neutral para el cliente—no una fotografía de un pedido terminado.", "Die Verpackungsgrafik ist eine originale, kundenneutrale Konzeptvorschau — kein Foto eines fertigen Auftrags.", "Le visuel d'emballage est un aperçu de concept original et neutre — pas une photo d'un commande finie."),
    "client-neutral rigid drawer box concept for private-label hair packaging": ("Concepto de caja de cajón rígida neutra para cliente para embalaje de marca privada", "Kundenneutrale starre Schubladenbox als Private-Label-Haarverpackungskonzept", "Concept de boîte tiroir rigide neutre pour emballage cheveux marque privée"),
    "we clarify the specification and what must be verified.": ("Aclaramos la especificación y qué debe verificarse.", "Wir klären die Spezifikation und was verifiziert werden muss.", "Nous clarifions la spécification et ce qui doit être vérifié."),
    "final commercial terms are confirmed before production.": ("Los términos comerciales finales se confirman antes de la producción.", "Finale kommerzielle Bedingungen werden vor der Produktion bestätigt.", "Les conditions commerciales finales sont confirmées avant la production."),
    "confirm the product before the order.": ("Confirme el producto antes del pedido.", "Bestätigen Sie das Produkt vor der Bestellung.", "Confirmez le produit avant la commande."),
    "start safely": ("COMIENCE SEGURO", "SICHER STARTEN", "COMMENCEZ EN SÉCURITÉ"),
    "market focus": ("ENFOQUE DE MERCADO", "MARKTFOKUS", "FOCUS MARCHÉ"),
    "brand system": ("SISTEMA DE MARCA", "MARKENSYSTEM", "SYSTÈME DE MARQUE"),
    "company name": ("NOMBRE DE EMPRESA", "FIRMENNAME", "NOM D'ENTREPRISE"),
    "salon / company": ("SALÓN / EMPRESA", "SALON / UNTERNEHMEN", "SALON / ENTREPRISE"),
    "business began": ("EL NEGOCIO COMENZÓ", "GESCHÄFTSBEGINN", "LE DÉBUT DE L'ENTREPRISE"),
    "years in hair": ("AÑOS EN CABELLO", "JAHRE IM HAAR", "ANNÉES DANS LES CHEVEUX"),
    "trusted by": ("CONFIAN EN NOSOTROS", "VERTRAUT VON", "ILS NOUS FONT CONFIANCE"),
    "50+ hair brands": ("50+ MARCAS DE CABELLO", "50+ HAARMARKEN", "50+ MARQUES CAPILLAIRES"),
    "brands developed": ("MARCAS DESARROLLADAS", "ENTWICKELTE MARKEN", "MARQUES DÉVELOPPÉES"),
    "our story & process": ("NUESTRA HISTORIA Y PROCESO", "UNSERE STORY UND PROZESS", "NOTRE HISTOIRE ET PROCESSUS"),
    "product architecture": ("ARQUITECTURA DE PRODUCTO", "PRODUKTARCHITEKTUR", "ARCHITECTURE PRODUIT"),
    "how sampling works →": ("Cómo funciona el muestreo →", "So funktioniert das Musterwesen →", "Comment fonctionne l'échantillonnage →"),
    "what you receive": ("QUÉ RECIBE", "WAS SIE ERHALTEN", "CE QUE VOUS RECEVEZ"),
    "request your kit": ("SOLICITE SU KIT", "FORDERN SIE IHR SET AN", "DEMANDEZ VOTRE KIT"),
    "ask a question": ("HAGA UNA PREGUNTA", "STELLEN SIE EINE FRAGE", "POSEZ UNE QUESTION"),
    "direct contact": ("CONTACTO DIRECTO", "DIREKTER KONTAKT", "CONTACT DIRECT"),
    "about d.s hair": ("ACERCA DE D.S HAIR", "ÜBER D.S HAIR", "À PROPOS DE D.S HAIR"),
    "by the numbers": ("EN NÚMEROS", "IN ZAHLEN", "EN CHIFFRES"),
    "why choose us": ("POR QUÉ ELEGIRNOS", "WARUM UNS WÄHLEN", "POURQUOI NOUS CHOISIR"),
    "colour systems": ("SISTEMAS DE COLOR", "FARBSYSTEME", "SYSTÈMES DE COULEUR"),
    "wigs & toppers": ("PERUCAS Y TOPPERS", "PERÜCKEN UND TOPPER", "PERRUQUES ET TOUPES"),
    "buyer support": ("SOPORTE AL COMPRADOR", "KÄUFER-SUPPORT", "SUPPORT ACHETEUR"),
    "sample support": ("SOPORTE DE MUESTRAS", "MUSTER-SUPPORT", "SUPPORT ÉCHANTILLON"),
    "private label": ("MARCA PRIVADA", "PRIVATE LABEL", "MARQUE PRIVÉE"),
    "product brief": ("BRIEF DE PRODUCTO", "PRODUKT-BRIEF", "BRIEF PRODUIT"),
    "repeat supply": ("SUMINISTRO RECURRENTE", "WIEDERHOLTE LIEFERUNG", "RÉAPPROVISIONNEMENT"),
    "who it is for": ("PARA QUIÉN ES", "FÜR WEN ES IST", "POUR QUI EST-CE"),
    "business type": ("TIPO DE EMPRESA", "GESCHÄFTSTYP", "TYPE D'ENTREPRISE"),
    "contact / rfq": ("CONTACTO / SOLICITUD", "KONTAKT / ANFRAGE", "CONTACT / DEMANDE"),
    "fast start": ("INICIO RÁPIDO", "SCHNELLER START", "DÉMARRAGE RAPIDE"),
    "your partner": ("SU SOCIO", "IHR PARTNER", "VOTRE PARTENAIRE"),
    "development": ("DESARROLLO", "ENTWICKLUNG", "DÉVELOPPEMENT"),
    "requirement": ("REQUISITO", "ANFORDERUNG", "EXIGENCE"),
    "oem support": ("SOPORTE OEM", "OEM-SUPPORT", "SUPPORT OEM"),
    "oem / private label": ("OEM / MARCA PRIVADA", "OEM / PRIVATE LABEL", "OEM / MARQUE PRIVÉE"),
    "hair focus": ("ENFOQUE EN CABELLO", "HAAR-FOKUS", "FOCUS CHEVEUX"),
    "extensions": ("EXTENSIONES", "EXTENSIONS", "EXTENSIONS"),
    "production & export": ("PRODUCCIÓN Y EXPORTACIÓN", "PRODUKTION UND EXPORT", "PRODUCTION ET EXPORT"),
    "colour development": ("DESARROLLO DE COLOR", "FARBENTWICKLUNG", "DÉVELOPPEMENT COULEUR"),
    "search collections": ("BUSCAR COLECCIONES", "KOLLEKTIONEN SUCHEN", "RECHERCHER COLLECTIONS"),
    "skip to content": ("SALTAR AL CONTENIDO", "ZUM INHALT SPRINGEN", "ALLER AU CONTENU"),
    "open navigation": ("ABRIR NAVEGACIÓN", "NAVIGATION ÖFFNEN", "OUVRIR LA NAVIGATION"),
    # ---- Remaining standalone segments (headings / short phrases) ----
    "© 2026 ds hair · wigexporter. prototype for review.": ("© 2026 DS HAIR · WigExporter. Prototipo para revisión.", "© 2026 DS HAIR · WigExporter. Prototyp zur Prüfung.", "© 2026 DS HAIR · WigExporter. Prototype pour revue."),
    "© 2026 ds hair · wigexporter. b2b wholesale, oem and private-label enquiries.": ("© 2026 DS HAIR · WigExporter. Consultas de gros B2B, OEM y marca privada.", "© 2026 DS HAIR · WigExporter. B2B Großhandel, OEM und Private-Label-Anfragen.", "© 2026 DS HAIR · WigExporter. Demandes de gros B2B, OEM et marque privée."),
    "sample-first process": ("PROCESO PRIMERO MUESTRA", "MUSTER-ZUERST-PROZESS", "PROCESSUS D'ABORD L'ÉCHANTILLON"),
    "share the product type, target market and approximate quantity. we will reply with the information needed to move toward samples or a quote.": ("Comparta el tipo de producto, mercado objetivo y cantidad aproximada. Responderemos con la información necesaria para avanzar hacia muestras o una cotización.", "Teilen Sie Produkttyp, Zielmarkt und ungefähre Menge. Wir antworten mit den Informationen, die für Muster oder ein Angebot nötig sind.", "Partagez le type de produit, marché cible et quantité approximative. Nous répondons avec les infos pour avancer vers échantillons ou devis."),
    "suitable for established salons, ecommerce hair brands, distributors, retailers and new private-label projects with a defined market.": ("Apto para salones consolidados, marcas de cabello de ecommerce, distribuidores, minoristas y nuevos proyectos de marca privada con mercado definido.", "Geeignet für etablierte Salons, E-Commerce-Haarmarken, Distributoren, Einzelhändler und neue Private-Label-Projekte mit definiertem Markt.", "Adapté aux salons établis, marques capillaires e-commerce, distributeurs, détaillants et nouveaux projets de marque privée avec marché défini."),
    "wigs · hairpieces · fringes · clip-in toppers": ("PERUCAS · COMPLEMENTOS · FLEQUILLOS · TOPPERS CLIP-IN", "PERÜCKEN · HAARTEILE · PONY · CLIP-IN-TOPPER", "PERRUQUES · ACCESSOIRES · FRANGES · TOUPES CLIP-IN"),
    "wigs · lace wigs · toppers · ponytails": ("PERUCAS · PERUCAS DE ENCAJE · TOPPERS · COLAS", "PERÜCKEN · SPITZENPERÜCKEN · TOPPER · PFERDESCHWÄNZE", "PERRUQUES · PERRUQUES DENTELLE · TOUPES · QUEUES DE CHEVAL"),
    "human hair extensions in blonde shades": ("EXTENSIONES DE PELO HUMANO EN TONOS RUBIOS", "ECHTHAAR-EXTENSIONS IN BLONDEN TÖNEN", "EXTENSIONS DE CHEVEUX HUMAINS EN TONS BLONDS"),
    "professional hair extension tool kit": ("KIT DE HERRAMIENTAS PARA EXTENSIONES PROFESIONALES", "PROFESSIONELLES WERKZEUGSET FÜR HAAREXTENSIONS", "KIT D'OUTILS POUR EXTENSIONS CAPILLAIRES PROFESSIONNELLES"),
    "tell us where and how you sell hair.": ("Cuéntenos dónde y cómo vende cabello.", "Sagen Sie uns, wo und wie Sie Haar verkaufen.", "Dites-nous où et comment vous vendez des cheveux."),
    "tell us what you want to source.": ("Cuéntenos qué desea abastecer.", "Sagen Sie uns, was Sie beziehen möchten.", "Dites-nous quoi sourcer."),
    "clip-in bangs / fringe hairpiece": ("COMPLEMENTO DE FLEQUILLO CLIP-IN", "CLIP-IN-PONY / STRÄHNEN-HAARTEIL", "ACCESSOIRE FRANGE CLIP-IN"),
    "for the uk salon market.": ("para el mercado de salón del reino unido.", "für den UK-Salonmarkt.", "pour le marché des salons au Royaume-Uni."),
    "tape-in hair extensions": ("EXTENSIONES DE CABELLO TAPE-IN", "TAPE-IN HAAREXTENSIONS", "EXTENSIONS CAPILLAIRES TAPE-IN"),
    "repeat-order reference": ("REFERENCIA DE PEDIDO RECURRENTE", "WIEDERBESTELL-REFERENZ", "RÉFÉRENCE DE RÉAPPROVISIONNEMENT"),
    "professional supply": ("SUMINISTRO PROFESIONAL", "PROFESSIONELLE LIEFERUNG", "APPROVISIONNEMENT PROFESSIONNEL"),
    "colour & sample": ("COLOR Y MUESTRA", "FARBE UND MUSTER", "COULEUR ET ÉCHANTILLON"),
}

# Human Hair Topper Model 01..13 and Lace Wig Model 201..204 (keep number, translate label)
for i in range(1, 14):
    T[f"human hair topper model {i:02d}"] = (f"Topper de pelo humano modelo {i:02d}", f"Echthaar-Topper Modell {i:02d}", f"Toupe en cheveux humains modèle {i:02d}")
for i in range(201, 205):
    T[f"lace wig model {i}"] = (f"Peruca de encaje modelo {i}", f"Spitzenperücke Modell {i}", f"Perruque dentelle modèle {i}")


def main():
    segs = json.load(open(SEGMENTS_JSON, encoding="utf-8"))
    Tn = {norm(k): v for k, v in T.items()}  # normalized lookup kills en/em-dash & quote mismatches
    translations = {}
    do_not = set()
    missing = []
    for s in segs:
        n = norm(s)
        if n in BRAND or n in CODES:
            do_not.add(s)
            continue
        tri = Tn.get(n)
        if not tri:
            missing.append(s)
            continue
        translations[s] = {"es": tri[0], "de": tri[1], "fr": tri[2]}

    # Write pages_dict.py
    out_path = os.path.join(ROOT, "scripts", "i18n", "pages_dict.py")
    lines = []
    lines.append('"""Translations for hand-written standalone HTML pages (es/de/fr).')
    lines.append("")
    lines.append("Keys are EXACT source segments (raw, with &amp; / curly quotes preserved).")
    lines.append("Generated by scripts/gen_pages_dict.py — edit the generator's T table, not this file.")
    lines.append('"""')
    lines.append("")
    lines.append("PAGES = [")
    lines.append('    "index.html", "products.html", "trade-account.html", "contact.html",')
    lines.append('    "about.html", "sample.html", "free-color-kits.html", "blog.html",')
    lines.append("]")
    lines.append("")
    lines.append("DO_NOT_TRANSLATE = {")
    for s in sorted(do_not):
        lines.append(f"    {s!r},")
    lines.append("}")
    lines.append("")
    lines.append("TRANSLATIONS = {")
    for s in segs:
        if s in translations:
            t = translations[s]
            lines.append(f"    {s!r}: {t!r},")
    lines.append("}")
    lines.append("")
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))

    print(f"segments total: {len(segs)}")
    print(f"translated: {len(translations)}")
    print(f"do-not-translate (brand/code): {len(do_not)}")
    print(f"MISSING (kept English): {len(missing)}")
    for m in missing[:40]:
        print("   -", m)
    if len(missing) > 40:
        print(f"   … +{len(missing) - 40} more")
    print(f"wrote {out_path}")


if __name__ == "__main__":
    main()
