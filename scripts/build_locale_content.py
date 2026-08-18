#!/usr/bin/env python3
import json, os

ROOT = '/Users/kkkk/Library/Mobile Documents/com~apple~CloudDocs/Desktop/dshairbeauty/wigexporter/wigexporter-web'
src_cat = json.load(open(os.path.join(ROOT, 'content', 'product-catalog.json')))
src_site = json.load(open(os.path.join(ROOT, 'content', 'site-content.json')))

COLLECTION_TR = {
    'human-hair-extensions': {
        'es': {
            'title': 'Extensiones de pelo humano al por mayor',
            'metaTitle': 'Proveedor de extensiones de pelo humano al por mayor | WigExporter',
            'description': 'Suministre extensiones de pelo humano al por mayor para salones, distribuidores y marcas private label, incluyendo clip-in, tape-in, k-tip, genius weft, machine weft y nano ring.',
            'intro': 'Desarrolle una gama coherente de extensiones en torno al método de aplicación, cliente objetivo, sistema de color y posicionamiento comercial.',
        },
        'de': {
            'title': 'Echthaar Extensions Großhandel',
            'metaTitle': 'Echthaar Extensions Großhandelslieferant | WigExporter',
            'description': 'Beziehen Sie Echthaar Extensions im Großhandel für Salons, Distributoren und Private-Label-Marken, einschließlich Clip-in, Tape-in, K-tip, Genius Weft, Machine Weft und Nano Ring.',
            'intro': 'Entwickeln Sie eine kohärente Extensions-Linie rund um Anwendungsmethode, Zielkunde, Farbsystem und kommerzielle Positionierung.',
        },
        'fr': {
            'title': 'Extensions de cheveux humains en gros',
            'metaTitle': 'Fournisseur d’extensions de cheveux humains en gros | WigExporter',
            'description': 'Approvisionnez des extensions de cheveux humains en gros pour salons, distributeurs et marques privées, incluant clip-in, tape-in, k-tip, genius weft, machine weft et nano ring.',
            'intro': 'Développez une gamme cohérente d’extensions autour de la méthode d’application, du client cible, du système de couleur et du positionnement commercial.',
        },
    },
    'human-hair-wigs-toppers': {
        'es': {
            'title': 'Pelucas y toppers de pelo humano al por mayor',
            'metaTitle': 'Pelucas y toppers de pelo humano al por mayor | WigExporter',
            'description': 'Desarrolle pelucas y toppers de pelo humano al por mayor con soporte de base, color, densidad, longitud, muestras y marca privada.',
            'intro': 'Construya una oferta de pelucas o toppers en torno a la usuaria, necesidad de cobertura, construcción de la base y acabado.',
        },
        'de': {
            'title': 'Echthaar Perücken & Topper Großhandel',
            'metaTitle': 'Echthaar Perücken & Topper Großhandel | WigExporter',
            'description': 'Entwickeln Sie Echthaar Perücken und Topper im Großhandel mit Support für Kappe, Basis, Farbe, Dichte, Länge, Muster und Eigenmarke.',
            'intro': 'Bauen Sie ein Perücken- oder Topper-Angebot um Trägerin, Deckungsbedarf, Kappen-Konstruktion und Finish herum.',
        },
        'fr': {
            'title': 'Perruques et toupes en cheveux humains en gros',
            'metaTitle': 'Perruques et toupes en cheveux humains en gros | WigExporter',
            'description': 'Développez des perruques et toupes en cheveux humains en gros avec support de base, couleur, densité, longueur, échantillons et marque privée.',
            'intro': 'Construisez une offre de perruques ou toupes autour de la porteuse, du besoin de couverture, de la construction de base et de la finition.',
        },
    },
    'synthetic-wigs-hairpieces': {
        'es': {
            'title': 'Pelucas y accesorios capilares sintéticos al por mayor',
            'metaTitle': 'Pelucas y accesorios capilares sintéticos al por mayor | WigExporter',
            'description': 'Suministre pelucas y accesorios capilares sintéticos al por mayor, incluidas coletas, flequillos, bangs y toppers clip-in con fibra.',
            'intro': 'Defina una gama sintética comercialmente clara especificando la usuaria, la silueta, la longitud y el uso diario o de moda.',
        },
        'de': {
            'title': 'Synthetische Perücken & Haarteile Großhandel',
            'metaTitle': 'Synthetische Perücken & Haarteile Großhandel | WigExporter',
            'description': 'Beziehen Sie synthetische Perücken und Haarteile großhandelsweise, einschließlich Pferdeschwänze, Pony, Bangs und Clip-in-Topper mit Faser.',
            'intro': 'Definieren Sie eine kommerziell klare synthetische Range über Trägerin, Silhouette, Länge und Alltags- oder Modenutzung.',
        },
        'fr': {
            'title': 'Perruques et accessoires capillaires synthétiques en gros',
            'metaTitle': 'Perruques et accessoires capillaires synthétiques en gros | WigExporter',
            'description': 'Sourcez des perruques et accessoires capillaires synthétiques en gros, y compris queues de cheval, franges, bangs et toppers clip-in en fibre.',
            'intro': 'Définissez une gamme synthétique commercialement claire en précisant la porteuse, la silhouette, la longueur et l’usage quotidien ou mode.',
        },
    },
    'salon-supplies': {
        'es': {
            'title': 'Suministros profesionales para extensiones de cabello al por mayor',
            'metaTitle': 'Herramientas y suministros profesionales para extensiones al por mayor | WigExporter',
            'description': 'Suministre la misma estructura de productos profesionales usada por D.S Hair Beauty: cinco kits por método más ocho productos individuales profesionales.',
            'intro': 'Apoye a profesionales de extensiones con herramientas de instalación, consumibles y bundles prácticos. La compatibilidad, tamaños y cantidades se confirman según el brief.',
        },
        'de': {
            'title': 'Professional Salon Supplies für Haarextensions Großhandel',
            'metaTitle': 'Werkzeuge & Salon Supplies für Haarextensions Großhandel | WigExporter',
            'description': 'Beziehen Sie dieselbe professionelle Produktstruktur wie D.S Hair Beauty: fünf methodenbasierte Kits plus acht professionelle Einzelprodukte.',
            'intro': 'Unterstützen Sie Extension-Profis mit Installationswerkzeugen, Verbrauchsmaterialien und praktischen Bundles. Kompatibilität, Größen und Mengen werden nach Brief bestätigt.',
        },
        'fr': {
            'title': 'Fournitures professionnelles pour extensions capillaires en gros',
            'metaTitle': 'Outils et fournitures professionnels pour extensions en gros | WigExporter',
            'description': 'Approvisionnez la même structure de produits professionnels utilisée par D.S Hair Beauty : cinq kits par méthode plus huit produits unitaires professionnels.',
            'intro': 'Accompagnez les professionnels des extensions avec outils d’installation, consommables et bundles pratiques. Compatibilité, tailles et quantités confirmées selon le brief.',
        },
    },
}

COLLECTION_SPEC_FAQ = {
    'human-hair-extensions': {
        'es': {
            'specs': [
                ['Método', 'Seleccione el método de fijación o weft según el flujo de trabajo del estilista y el cliente final.'],
                ['Dirección del cabello', 'Defina la posición de calidad, textura, acabado y uso esperado antes de enviar muestras.'],
                ['Sistema de color', 'Planifique tonos base, mezclas con raíz y referencias físicas para reorders más fiables.'],
                ['Presentación de marca', 'Revise peso, formato de empaque, etiquetas e información de soporte para su canal de venta.']
            ],
            'faqs': [
                ['¿Qué métodos de extensiones puede suministrar WigExporter?', 'Nuestro alcance incluye Clip-in, Tape-in, K-tip, Genius Weft, Machine Weft y Nano Ring. Las opciones manuales también pueden revisarse según el brief.'],
                ['¿Puedo solicitar extensiones de marca privada?', 'Sí. La viabilidad de marca privada puede incluir especificación del producto, etiquetas, empaque y dirección de color.'],
                ['¿Puedo revisar muestras antes de un pedido mayorista?', 'Sí. Recomendamos revisar la construcción, tono y dirección de empaque relevantes antes de la producción repetida.']
            ]
        },
        'de': {
            'specs': [
                ['Methode', 'Wählen Sie Befestigungs- oder Weft-Konstruktion nach Stylisten-Workflow und Endkunde.'],
                ['Haarrichtung', 'Definieren Sie Qualitätsposition, Textur, Finish und erwartete Nutzung vor Mustersendung.'],
                ['Farbkonzept', 'Planen Sie Basistöne, Ansatzmischungen und physische Referenzen für zuverlässigere Wiederbestellungen.'],
                ['Markenpräsentation', 'Prüfen Sie Gewicht, Packformat, Etiketten und Begleitinformationen für Ihren Vertriebskanal.']
            ],
            'faqs': [
                ['Welche Extensions-Methoden kann WigExporter liefern?', 'Unser Scope umfasst Clip-in, Tape-in, K-tip, Genius Weft, Machine Weft und Nano Ring. Handgebundene Optionen können nach Brief geprüft werden.'],
                ['Kann ich Private-Label-Haarextensions anfragen?', 'Ja. Private-Label-Machbarkeit kann Produktspezifikation, Etiketten, Verpackung und Farbrichtung umfassen.'],
                ['Kann ich vor einem Großhandelsauftrag Muster prüfen?', 'Ja. Wir empfehlen, relevante Konstruktion, Farbnuance und Verpackungsrichtung vor Wiederbestellung zu prüfen.']
            ]
        },
        'fr': {
            'specs': [
                ['Méthode', 'Sélectionnez la fixation ou la construction weft selon le flux de travail du styliste et le client final.'],
                ['Direction du cheveu', 'Définissez la position qualité, texture, finition et usage attendu avant envoi d’échantillons.'],
                ['Système de couleur', 'Planifiez les tons de base, mélanges avec racine et références physiques pour des réapprovisionnements plus fiables.'],
                ['Présentation de la marque', 'Vérifiez le poids, le format de pack, les étiquettes et les informations support pour votre canal de vente.']
            ],
            'faqs': [
                ['Quelles méthodes d’extensions WigExporter peut-il fournir ?', 'Notre scope inclut Clip-in, Tape-in, K-tip, Genius Weft, Machine Weft et Nano Ring. Les options manuelles peuvent être examinées selon le brief.'],
                ['Puis-je demander des extensions en marque privée ?', 'Oui. La faisabilité de marque privée peut inclure spécification produit, étiquettes, emballage et direction couleur.'],
                ['Puis-je examiner des échantillons avant une commande en gros ?', 'Oui. Nous recommandons d’examiner la construction, la nuance et la direction d’emballage pertinentes avant la production répétée.']
            ]
        },
    },
    'human-hair-wigs-toppers': {
        'es': {
            'specs': [
                ['Construcción de base', 'Revise encaje, monofilamento, partido, perímetro y requisitos de fijación.'],
                ['Cobertura y densidad', 'Defina la usuaria prevista, área de cobertura y resultado visual antes de seleccionar el producto.'],
                ['Cabello y color', 'Alinee textura, longitud, arquitectura de tono y acabado con su mercado comprador.'],
                ['Referencia repetible', 'Documente la muestra aprobada para que futuras comunicaciones partan de un punto de referencia claro.']
            ],
            'faqs': [
                ['¿Qué debe verificar un comprador profesional en una muestra de peluca o topper?', 'Revise la construcción de base, dimensiones, dirección del cabello, densidad, color, fijación, comodidad y acabado.'],
                ['¿Apoyan el desarrollo de pelucas y toppers personalizados?', 'Podemos revisar requisitos personalizados de producto, color, etiqueta y empaque. La viabilidad se confirma tras el brief.'],
                ['¿Están estos productos destinados a consumidores minoristas?', 'WigExporter es un sitio B2B para compradores profesionales, marcas, distribuidores y salones. No vendemos directamente al consumidor final.']
            ]
        },
        'de': {
            'specs': [
                ['Kappen-Konstruktion', 'Prüfen Sie Spitze, Monofilament, Scheitel, Perimeter und Befestigungsanforderungen.'],
                ['Deckung & Dichte', 'Definieren Sie die voraussichtige Trägerin, Deckungsbereich und visuelles Ergebnis vor Produktauswahl.'],
                ['Haar & Farbe', 'Stimmen Sie Textur, Länge, Farbarchitektur und Finish auf Ihren Käufermarkt ab.'],
                ['Wiederholbare Referenz', 'Dokumentieren Sie das freigegebene Muster, damit zukünftige Kommunikation von einem klaren Maßstab ausgeht.']
            ],
            'faqs': [
                ['Was sollte ein professioneller Käufer bei einer Perücken- oder Topper-Musterprüfung kontrollieren?', 'Prüfen Sie Kappen-Konstruktion, Maße, Haarrichtung, Dichte, Farbe, Befestigung, Komfort und Finish.'],
                ['Unterstützen Sie kundenspezifische Perücken- und Topper-Entwicklung?', 'Wir können individuelle Produkt-, Farb-, Etiketten- und Verpackungsanforderungen prüfen. Machbarkeit wird nach Brief bestätigt.'],
                ['Sind diese Produkte für Endverbraucher gedacht?', 'WigExporter ist eine B2B-Sourcing-Website für professionelle Käufer, Marken, Distributoren und Salons. Wir verkaufen nicht direkt an Endverbraucher.']
            ]
        },
        'fr': {
            'specs': [
                ['Construction de base', 'Examinez la dentelle, le monofilament, la raie, le périmètre et les exigences de fixation.'],
                ['Couverture et densité', 'Définissez la porteuse prévue, la zone de couverture et le résultat visuel avant la sélection du produit.'],
                ['Cheveux et couleur', 'Alignez texture, longueur, architecture des nuances et finition avec votre marché acheteur.'],
                ['Référence répétable', 'Documentez l’échantillon approuvé pour que les futures communications partent d’un repère clair.']
            ],
            'faqs': [
                ['Que doit vérifier un acheteur professionnel lors de l’examen d’un échantillon de perruque ou toupe ?', 'Examinez la construction de base, dimensions, direction des cheveux, densité, couleur, fixation, confort et finition.'],
                ['Prenez-vous en charge le développement de perruques et toupes sur mesure ?', 'Nous pouvons examiner les besoins personnalisés en produit, couleur, étiquette et emballage. La faisabilité est confirmée après le brief.'],
                ['Ces produits sont-ils destinés aux consommateurs de détail ?', 'WigExporter est un site de sourcing B2B pour acheteurs professionnels, marques, distributeurs et salons. Nous ne vendons pas directement au consommateur final.']
            ]
        },
    },
    'synthetic-wigs-hairpieces': {
        'es': {
            'specs': [
                ['Brief de estilo', 'Empiece con la usuaria, silueta, longitud y uso cotidiano o de moda previsto.'],
                ['Dirección de fibra', 'Confirme las características de la fibra y expectativas de cuidado a través del brief y la muestra.'],
                ['Construcción', 'Revise detalles de base o fijación, ajuste, cobertura y requisitos de acabado.'],
                ['Planificación de gama', 'Coordine color, empaque e información del producto en toda la colección prevista.']
            ],
            'faqs': [
                ['¿Qué productos de cabello sintético están disponibles al por mayor?', 'El alcance de abastecimiento incluye pelucas sintéticas, accesorios capilares (incluidas coletas), flequillos/bangs y toppers clip-in. La disponibilidad se confirma según estilo y especificación.'],
                ['¿Se pueden personalizar el color y el empaque?', 'El desarrollo potencial de color, etiqueta y empaque puede revisarse para programas de marca privada. Los términos comerciales dependen del brief final.'],
                ['¿Cómo empezamos?', 'Envíe mercado objetivo, referencia de producto, rango de cantidad esperada y posición de calidad. Identificaremos la información necesaria para muestras o cotización.']
            ]
        },
        'de': {
            'specs': [
                ['Style-Brief', 'Beginnen Sie mit Trägerin, Silhouette, Länge und vorgesehenem Alltags- oder Modeeinsatz.'],
                ['Faserrichtung', 'Bestätigen Sie Fasereigenschaften und Pflegeerwartungen über Brief und Muster.'],
                ['Konstruktion', 'Prüfen Sie Kappen- oder Befestigungsdetails, Passform, Deckung und Finish-Anforderungen.'],
                ['Range-Planung', 'Koordinieren Sie Farbe, Verpackung und Produktinformationen über die geplante Kollektion.']
            ],
            'faqs': [
                ['Welche synthetischen Haarprodukte sind im Großhandel verfügbar?', 'Der Sourcing-Scope umfasst synthetische Perücken, Haarteile (einschließlich Pferdeschwänze), Pony/Bangs und Clip-in-Topper. Verfügbarkeit wird nach Stil und Spezifikation bestätigt.'],
                ['Können Farbe und Verpackung individualisiert werden?', 'Mögliche Farb-, Etiketten- und Verpackungsentwicklung kann für Private-Label-Programme geprüft werden. Geschäftsbedingungen hängen vom finalen Brief ab.'],
                ['Wie beginnen wir?', 'Senden Sie Zielmarkt, Produktreferenz, erwarteten Mengenbereich und Qualitätsposition. Wir ermitteln die für Muster oder Angebot nötigen Informationen.']
            ]
        },
        'fr': {
            'specs': [
                ['Brief style', 'Commencez par la porteuse, la silhouette, la longueur et l’usage quotidien ou mode prévu.'],
                ['Direction fibre', 'Confirmez les caractéristiques de la fibre et attentes d’entretien via le brief et l’échantillon.'],
                ['Construction', 'Examinez les détails de base ou de fixation, l’ajustement, la couverture et les exigences de finition.'],
                ['Planification de gamme', 'Coordonnez couleur, emballage et informations produit sur la collection prévue.']
            ],
            'faqs': [
                ['Quels produits capillaires synthétiques sont disponibles en gros ?', 'Le scope d’approvisionnement inclut perruques synthétiques, accessoires capillaires (y compris queues de cheval), franges/bangs et toupes clip-in. La disponibilité est confirmée selon style et spécification.'],
                ['La couleur et l’emballage peuvent-ils être personnalisés ?', 'Le développement potentiel de couleur, étiquette et emballage peut être examiné pour les programmes de marque privée. Les conditions commerciales dépendent du brief final.'],
                ['Comment commençons-nous ?', 'Envoyez le marché cible, la référence produit, la plage de quantité attendue et la position qualité. Nous identifierons les informations nécessaires pour échantillons ou devis.']
            ]
        },
    },
    'salon-supplies': {
        'es': {
            'specs': [
                ['Compatibilidad', 'Empareje herramientas y consumibles con los métodos de instalación que sus clientes usan realmente.'],
                ['Formato de pack', 'Defina cantidades por unidad, packs de uso profesional y cantidades de reposición para el canal.'],
                ['Lógica de bundle', 'Cree kits de inicio, doble método o profesionales en torno a un caso de uso claro del estilista.'],
                ['Marca privada', 'Revise etiquetas, instrucciones y empaque donde el programa admita personalización.']
            ],
            'faqs': [
                ['¿Qué suministros de salón se pueden abastecer?', 'La gama refleja la estructura de suministros de D.S Hair Beauty: cinco kits por método y ocho productos individuales profesionales.'],
                ['¿Pueden crear kits de inicio para salones?', 'Sí. Un kit debe construirse en torno al método de instalación, nivel de usuario y canal de venta previsto. La viabilidad se confirma tras el brief.'],
                ['¿Se pueden pedir suministros junto con extensiones?', 'Se puede revisar un brief de abastecimiento combinado para que accesorios y consumibles se alineen con las extensiones.']
            ]
        },
        'de': {
            'specs': [
                ['Kompatibilität', 'Passen Sie Werkzeuge und Verbrauchsmaterial an die Installationsmethoden an, die Ihre Kunden tatsächlich nutzen.'],
                ['Packformat', 'Definieren Sie Stückzahlen, professionelle Gebrauchspacks und Nachbestellmengen für den Kanal.'],
                ['Bundle-Logik', 'Erstellen Sie Starter-, Dual-Method- oder Profi-Kits um einen klaren Stylisten-Anwendungsfall.'],
                ['Eigenmarke', 'Prüfen Sie Etiketten, Anleitungen und Verpackung, wo das Programm Anpassung ermöglicht.']
            ],
            'faqs': [
                ['Welche Salon Supplies können bezogen werden?', 'Die Range spiegelt die D.S Hair Beauty Salon-Supply-Struktur wider: fünf methodenbasierte Kits plus acht professionelle Einzelprodukte.'],
                ['Können Sie Salon-Starter-Kits erstellen?', 'Ja. Ein Kit sollte um Installationsmethode, Nutzerlevel und vorgesehenen Vertriebskanal herum aufgebaut werden. Machbarkeit wird nach Brief bestätigt.'],
                ['Können Supplies zusammen mit Haarextensions bestellt werden?', 'Ein kombinierter Sourcing-Brief kann geprüft werden, damit Zubehör und Verbrauchsmaterial zu den Extensions passen.']
            ]
        },
        'fr': {
            'specs': [
                ['Compatibilité', 'Faites correspondre outils et consommables aux méthodes d’installation que vos clients utilisent réellement.'],
                ['Format de pack', 'Définissez quantités unitaires, packs usage professionnel et quantités de réapprovisionnement pour le canal.'],
                ['Logique de bundle', 'Créez des kits de démarrage, double méthode ou professionnels autour d’un cas d’usage styliste clair.'],
                ['Marque privée', 'Examinez étiquettes, instructions et emballage lorsque le programme permet la personnalisation.']
            ],
            'faqs': [
                ['Quels fournitures de salon peuvent être approvisionnées ?', 'La gamme reflète la structure de fournitures salon de D.S Hair Beauty : cinq kits par méthode plus huit produits unitaires professionnels.'],
                ['Pouvez-vous créer des kits de démarrage salon ?', 'Oui. Un kit doit être construit autour de la méthode d’installation, du niveau d’utilisateur et du canal de vente prévu. La faisabilité est confirmée après le brief.'],
                ['Les fournitures peuvent-elles être commandées avec des extensions ?', 'Un brief d’approvisionnement combiné peut être examiné pour que accessoires et consommables s’alignent avec les extensions.']
            ]
        },
    },
}

ARTICLE_SPEC_FAQ = {
    'tape-hair-vs-k-tip-vs-weft': {
        'es': {
            'faqs': [
                ['¿Qué método de extensión es mejor para una nueva gama mayorista?', 'No hay un método universalmente mejor. El punto de partida correcto depende de su base de estilistas, modelo de cliente, capacidad de servicio y posición de precio.'],
                ['¿Debería cada método usar la misma gama de colores?', 'Una arquitectura de tonos base compartida puede simplificar la oferta, pero la disponibilidad y los resultados visuales deben revisarse en cada construcción.']
            ]
        },
        'de': {
            'faqs': [
                ['Welche Extensions-Methode ist am besten für eine neue Großhandelsrange?', 'Es gibt keine universell beste Methode. Der richtige Ausgangspunkt hängt von Ihrer Stylistenbasis, Kundenmodell, Servicefähigkeit und Preisposition ab.'],
                ['Sollte jede Methode dieselbe Farbpalette verwenden?', 'Eine gemeinsame Basis-Farbarchitektur kann das Angebot vereinfachen, aber Verfügbarkeit und visuelle Ergebnisse sollten pro Konstruktion geprüft werden.']
            ]
        },
        'fr': {
            'faqs': [
                ['Quelle méthode d’extension est la meilleure pour une nouvelle gamme en gros ?', 'Il n’existe pas de méthode universellement meilleure. Le bon point de départ dépend de votre base de stylistes, modèle client, capacité de service et positionnement prix.'],
                ['Chaque méthode devrait-elle utiliser la même gamme de couleurs ?', 'Une architecture de tons de base partagée peut simplifier l’offre, mais la disponibilité et les résultats visuels doivent être examinés sur chaque construction.']
            ]
        },
    },
    'how-to-evaluate-wholesale-wig-sample': {
        'es': {
            'faqs': [
                ['¿Qué es lo más importante al revisar una muestra de peluca?', 'El paso más importante es comparar la muestra contra un brief escrito de usuaria y producto. La calidad se juzga por ajuste, construcción, acabado y repetibilidad.'],
                ['¿Por qué los compradores deberían conservar una muestra aprobada?', 'Una muestra física aprobada y un registro escrito proporcionan una referencia compartida para futura producción, control de calidad y reorders.']
            ]
        },
        'de': {
            'faqs': [
                ['Was ist beim Perücken-Muster-Review am wichtigsten?', 'Der wichtigste Schritt ist der Vergleich des Musters mit einem schriftlichen Träger- und Produktbrief. Qualität wird an Passform, Konstruktion, Finish und Wiederholbarkeit gemessen.'],
                ['Warum sollten Käufer ein freigegebenes Muster aufbewahren?', 'Ein freigegebenes physisches Muster und schriftlicher Datensatz bieten eine gemeinsame Referenz für zukünftige Produktion, QC und Wiederbestellungen.']
            ]
        },
        'fr': {
            'faqs': [
                ['Quelle est la partie la plus importante de l’examen d’un échantillon de perruque ?', 'L’étape la plus importante est de comparer l’échantillon à un brief porteuse et produit écrit. La qualité se juge à l’ajustement, construction, finition et répétabilité.'],
                ['Pourquoi les acheteurs devraient-ils conserver un échantillon approuvé ?', 'Un échantillon physique approuvé et un enregistrement écrit fournissent une référence partagée pour la production future, le contrôle qualité et les réapprovisionnements.']
            ]
        },
    },
    'build-repeatable-hair-colour-system': {
        'es': {
            'faqs': [
                ['¿Por qué son importantes las referencias de color físicas para el cabello al por mayor?', 'Las pantallas y la fotografía varían. Una referencia física ofrece a compradores y proveedores una base más consistente para aprobaciones.'],
                ['¿Debería un sistema de color ser idéntico en cada producto?', 'La nomenclatura central puede compartirse, pero el resultado visual debe revisarse en construcciones representativas antes de confirmar.']
            ]
        },
        'de': {
            'faqs': [
                ['Warum sind physische Farbreferenzen für Großhandelshaar wichtig?', 'Bildschirme und Fotografie variieren. Eine physische Referenz bietet Käufern und Lieferanten eine konsistentere Basis für Freigaben.'],
                ['Sollte ein Farbsystem über jedes Produkt identisch sein?', 'Kernbenennung kann geteilt werden, aber das visuelle Ergebnis sollte an repräsentativen Konstruktionen geprüft werden, bevor es freigegeben wird.']
            ]
        },
        'fr': {
            'faqs': [
                ['Pourquoi les références de couleur physiques sont-elles importantes pour les cheveux en gros ?', 'Les écrans et la photographie varient. Une référence physique offre aux acheteurs et fournisseurs une base plus cohérente pour les approbations.'],
                ['Un système de couleur devrait-il être identique sur chaque produit ?', 'La nomenclature centrale peut être partagée, mais le résultat visuel doit être examiné sur des constructions représentatives avant confirmation.']
            ]
        },
    },
}

ARTICLE_TR = {
    'tape-hair-vs-k-tip-vs-weft': {
        'es': {'title': 'Tape-in vs K-tip vs Weft', 'metaTitle': 'Tape-in vs K-tip vs Weft: guía del comprador | WigExporter', 'description': 'Compare tape-in, K-tip y weft desde el punto de vista del comprador profesional: aplicación, mantenimiento, MOQ y margen.', 'dek': 'Elija el método de extensión adecuado para su mercado.', 'category': 'Comparativa'},
        'de': {'title': 'Tape-In vs K-Tip vs Weft', 'metaTitle': 'Tape-In vs K-Tip vs Weft: Käuferleitfaden | WigExporter', 'description': 'Vergleichen Sie Tape-In, K-Tip und Weft aus Sicht professioneller Käufer: Anwendung, Pflege, MOQ und Marge.', 'dek': 'Wählen Sie die richtige Extensions-Methode für Ihren Markt.', 'category': 'Vergleich'},
        'fr': {'title': 'Tape-in vs K-tip vs Weft', 'metaTitle': 'Tape-in vs K-tip vs Weft : guide acheteur | WigExporter', 'description': 'Comparez tape-in, K-tip et weft du point de vue de l’acheteur professionnel : application, entretien, MOQ et marge.', 'dek': 'Choisissez la bonne méthode d’extension pour votre marché.', 'category': 'Comparatif'},
    },
    'how-to-evaluate-wholesale-wig-sample': {
        'es': {'title': 'Cómo evaluar una muestra de peluca al por mayor', 'metaTitle': 'Cómo evaluar una muestra de peluca al por mayor | WigExporter', 'description': 'Lista de verificación práctica para evaluar muestras de pelucas: fibra, construcción, color, densidad y acabado.', 'dek': 'Reduzca el riesgo de compra con una evaluación de muestra sistemática.', 'category': 'Control de calidad'},
        'de': {'title': 'Perückenmuster im Großhandel bewerten', 'metaTitle': 'Perückenmuster im Großhandel bewerten | WigExporter', 'description': 'Praktische Checkliste zur Bewertung von Perückenmustern: Faser, Konstruktion, Farbe, Dichte und Finish.', 'dek': 'Reduzieren Sie Einkaufsrisiken mit einer systematischen Musterbewertung.', 'category': 'Qualitätskontrolle'},
        'fr': {'title': 'Comment évaluer un échantillon de perruque en gros', 'metaTitle': 'Évaluer un échantillon de perruque en gros | WigExporter', 'description': 'Check-list pratique pour évaluer les échantillons de perruques : fibre, construction, couleur, densité et finition.', 'dek': 'Réduisez le risque d’achat avec une évaluation systématique des échantillons.', 'category': 'Contrôle qualité'},
    },
    'build-repeatable-hair-colour-system': {
        'es': {'title': 'Cómo construir un sistema de color repetible', 'metaTitle': 'Cómo construir un sistema de color repetible | WigExporter', 'description': 'Cree un sistema de color profesional basado en referencias físicas, numeración de carta y aprobación de muestra.', 'dek': 'Estandarice el color en su gama de extensiones o pelucas.', 'category': 'Color'},
        'de': {'title': 'Ein wiederholbares Haarfarbsystem aufbauen', 'metaTitle': 'Wiederholbares Haarfarbsystem aufbauen | WigExporter', 'description': 'Erstellen Sie ein professionelles Farbsystem basierend auf physischen Referenzen, Farbkarten-Nummerierung und Musterfreigabe.', 'dek': 'Standardisieren Sie die Farbe in Ihrer Extensions- oder Perücken-Linie.', 'category': 'Farbe'},
        'fr': {'title': 'Construire un système de couleur reproductible', 'metaTitle': 'Construire un système de couleur reproductible | WigExporter', 'description': 'Créez un système de couleur professionnel basé sur des références physiques, une numérotation de nuancier et une approbation d’échantillon.', 'dek': 'Standardisez la couleur dans votre gamme d’extensions ou perruques.', 'category': 'Couleur'},
    },
}

for lang in ['es', 'de', 'fr']:
    prods = json.load(open(os.path.join(ROOT, 'content', lang, 'products.json')))
    tmap_code = {p['code']: p['title'] for p in prods if 'code' in p}
    tmap_slug = {p['slug']: p['title'] for p in prods}

    CODE_TO_SLUG = {
        'DS-EXT-CI': 'clip-in-human-hair-extensions',
        'DS-EXT-TI': 'tape-in-human-hair-extensions',
        'DS-EXT-KT': 'k-tip-human-hair-extensions',
        'DS-EXT-GW': 'genius-weft-human-hair-extensions',
        'DS-EXT-MW': 'machine-weft-human-hair-extensions',
        'DS-EXT-NH': 'nano-ring-human-hair-extensions',
        'DS-HPC-SY-001': 'synthetic-clip-in-chignon-hairpiece',
        'DS-HPC-SY-002': 'synthetic-22-inch-straight-clip-in-hairpiece',
        'DS-HPC-SY-003': 'synthetic-21-inch-soft-curls-claw-clip-ponytail',
        'DS-HPC-SY-004': 'synthetic-21-inch-straight-claw-clip-ponytail',
        'DS-HPC-SY-005': 'synthetic-26-inch-elastic-band-braiding-ponytail',
        'DS-HPC-SY-006': 'synthetic-12-inch-coily-drawstring-ponytail',
        'DS-HPC-SY-007': 'synthetic-elastic-band-hair-bun-scrunchie',
        'DS-HPC-SY-008': 'synthetic-25-inch-straight-wrap-around-ponytail',
        'DS-TOP-SY-CI-001': 'synthetic-layered-clip-in-crown-topper',
        'DS-TOP-SY-CI-002': 'synthetic-beach-wave-clip-in-crown-topper',
        'DS-B-001': 'synthetic-clip-in-bangs-fringe',
        'DS-WIG-LW-001': 'lace-wig-201',
        'DS-WIG-LW-002': 'lace-wig-202',
        'DS-WIG-LW-003': 'lace-wig-203',
        'DS-WIG-LW-004': 'lace-wig-204',
        'DS-TOP-HH-001': 'human-hair-topper-01',
        'DS-TOP-HH-002': 'human-hair-topper-02',
        'DS-TOP-HH-003': 'human-hair-topper-03',
        'DS-TOP-HH-004': 'human-hair-topper-04',
        'DS-TOP-HH-005': 'human-hair-topper-05',
        'DS-TOP-HH-006': 'human-hair-topper-06',
        'DS-TOP-HH-007': 'human-hair-topper-07',
        'DS-TOP-HH-008': 'human-hair-topper-08',
        'DS-TOP-HH-009': 'human-hair-topper-09',
        'DS-TOP-HH-010': 'human-hair-topper-10',
        'DS-TOP-HH-011': 'human-hair-topper-11',
        'DS-TOP-HH-012': 'human-hair-topper-12',
        'DS-TOP-HH-013': 'human-hair-topper-13',
    }
    for n in range(1, 24):
        CODE_TO_SLUG[f'DSW-{2500 + n}'] = f'synthetic-wig-dsw-{2500 + n}'

    # product-catalog.json: keep all products, translate name only
    out_cat = []
    for p in src_cat['products']:
        np = dict(p)
        slug = CODE_TO_SLUG.get(p['code'])
        np['name'] = tmap_code.get(p['code']) or (tmap_slug.get(slug) if slug else None) or p['name']
        out_cat.append(np)
    cat = dict(src_cat)
    cat['products'] = out_cat
    json.dump(cat, open(os.path.join(ROOT, 'content', lang, 'product-catalog.json'), 'w'), ensure_ascii=False, indent=2)

    # site-content.json: translate all 4 collections + 3 articles
    collections = []
    for c in src_site['collections']:
        nc = dict(c)
        tr = COLLECTION_TR[c['slug']][lang]
        nc['title'] = tr['title']
        nc['metaTitle'] = tr['metaTitle']
        nc['description'] = tr['description']
        nc['intro'] = tr['intro']
        sf = COLLECTION_SPEC_FAQ[c['slug']][lang]
        nc['specs'] = sf['specs']
        nc['faqs'] = sf['faqs']
        collections.append(nc)
    articles = []
    for a in src_site['articles']:
        na = dict(a)
        tr = ARTICLE_TR.get(a['slug'], {}).get(lang, {})
        for k, v in tr.items():
            na[k] = v
        af = ARTICLE_SPEC_FAQ.get(a['slug'], {}).get(lang, {})
        if 'faqs' in af:
            na['faqs'] = af['faqs']
        articles.append(na)
    site = {'collections': collections, 'articles': articles}
    json.dump(site, open(os.path.join(ROOT, 'content', lang, 'site-content.json'), 'w'), ensure_ascii=False, indent=2)
    print(lang, 'collections:', len(collections), 'articles:', len(articles), 'catalog:', len(out_cat))
