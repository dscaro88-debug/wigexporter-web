#!/usr/bin/env python3
"""
Build content/{es,de,fr}/products.json containing ALL 56 products:
- keep existing 23 DSW synthetic wig translations
- add translated core fields for the 33 non-DSW products
"""
import json, re, copy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EN = json.loads((ROOT / "content" / "products.json").read_text(encoding="utf-8"))
if isinstance(EN, dict):
    EN = EN.get("products", [])

DSW_ES = json.loads((ROOT / "content" / "es" / "products.json").read_text(encoding="utf-8"))
DSW_DE = json.loads((ROOT / "content" / "de" / "products.json").read_text(encoding="utf-8"))
DSW_FR = json.loads((ROOT / "content" / "fr" / "products.json").read_text(encoding="utf-8"))

def dsw_map(arr):
    return {p["slug"]: p for p in arr}

DSW = {"es": dsw_map(DSW_ES), "de": dsw_map(DSW_DE), "fr": dsw_map(DSW_FR)}

LANGS = ["es", "de", "fr"]

LABEL_MAP = {
    # confirmedFacts / unconfirmed / buyerChecks keys
    "Product family": ("Familia de producto", "Produktfamilie", "Famille de produit"),
    "Product types": ("Tipos de producto", "Produkttypen", "Types de produit"),
    "Product format": ("Formato de producto", "Produktformat", "Format de produit"),
    "Material detail": ("Detalle de material", "Materialdetail", "Détail matériau"),
    "Set formats": ("Formatos de set", "Set-Formate", "Formats de set"),
    "Colour system": ("Sistema de color", "Farbkonzept", "Système de couleur"),
    "Length range": ("Rango de longitud", "Längenbereich", "Gamme de longueurs"),
    "Product code": ("Código de producto", "Produktcode", "Code produit"),
    "Sales channel": ("Canal de venta", "Vertriebskanal", "Canal de vente"),
    "Order basis": ("Base de pedido", "Bestellbasis", "Base de commande"),
    "Reference images": ("Imágenes de referencia", "Referenzbilder", "Images de référence"),
    "Display colour directions": ("Direcciones de color de exhibición", "Anzeigefarbnuancen", "Tendances couleur affichées"),
    "Fibre family": ("Familia de fibra", "Faserfamilie", "Famille de fibre"),
    "Cap construction": ("Construcción de base", "Kappen-Konstruktion", "Construction de base"),
    "Texture directions": ("Direcciones de textura", "Texturrichtungen", "Directions de texture"),
    "Dispatch for approved references": ("Envío para referencias aprobadas", "Versand für freigegebene Referenzen", "Expédition pour références approuvées"),
    "Cap base": ("Base de cap", "Kappenbasis", "Base de coiffe"),
    "Hair type": ("Tipo de cabello", "Haartyp", "Type de cheveux"),
    "Typical weight": ("Peso típico", "Typisches Gewicht", "Poids typique"),
    "Parting options": ("Opciones de partido", "Scheiteloptionen", "Options de raie"),
    "Attachment": ("Fijación", "Befestigung", "Fixation"),
    "Coverage": ("Cobertura", "Abdeckung", "Couverture"),
    "Style": ("Estilo", "Stil", "Style"),
    "Recommended user": ("Usuario recomendado", "Empfohlener Anwender", "Utilisateur recommandé"),
    "MOQ": ("MOQ", "MOQ", "MOQ"),
    "Sample lead time": ("Plazo de muestra", "Muster-Lieferzeit", "Délai échantillon"),
    "Production lead time": ("Plazo de producción", "Produktions-Lieferzeit", "Délai production"),
    "Packaging": ("Empaque", "Verpackung", "Emballage"),
    "Customisation": ("Personalización", "Personalisierung", "Personnalisation"),
    "Quality check": ("Control de calidad", "Qualitätskontrolle", "Contrôle qualité"),
    "Usage": ("Uso", "Verwendung", "Utilisation"),
    "Hair length": ("Longitud del cabello", "Haarlänge", "Longueur cheveux"),
    "Base size": ("Tamaño de base", "Basisgröße", "Taille de base"),
    "Base material": ("Material de base", "Basismaterial", "Matériau de base"),
    "Knotting": ("Nudado", "Knotung", "Nouage"),
    "Density": ("Densidad", "Dichte", "Densité"),
    " parting": (" partido", " Scheitel", " raie"),
    # option values (frequent)
    "Classic / Seamless / One-piece / Single": ("Clásico / Sin costuras / One-piece / Individual", "Klassisch / Nahtlos / One-piece / Einzeln", "Classique / Sans couture / One-pièce / Individuel"),
    "100% Remy human hair": ("100% cabello humano Remy", "100% Remy Echthaar", "100% cheveux humains Remy"),
    "7 pcs / set · 8 pcs / set · single piece": ("7 pzas/set · 8 pzas/set · pieza individual", "7-tlg./Set · 8-tlg./Set · Einzelstück", "7 pcs / set · 8 pcs / set · pièce unique"),
    "31 shades · Colour Chart 2": ("31 tonos · Carta de color 2", "31 Nuancen · Colour Chart 2", "31 nuances · Nuancier 2"),
    "14 in – 24 in (request)": ("14–24 in (consultar)", "14–24 in (anfragen)", "14–24 in (sur demande)"),
    "Not used for this product family": ("No se usa para esta familia", "Für diese Familie nicht verwendet", "Non utilisé pour cette famille"),
    "B2B wholesale / OEM enquiry": ("Consulta B2B / OEM", "B2B-Großhandel / OEM-Anfrage", "Demande B2B / OEM"),
    "Approved product type + full specification": ("Tipo aprobado + especificación completa", "Freigegebener Typ + vollständige Spezifikation", "Type approuvé + spécification complète"),
    "As photographed reference": ("Referencia fotografiada", "Fotografierte Referenz", "Référence photographiée"),
    "Buyer-defined": ("Definido por comprador", "Käuferdefiniert", "Défini par l'acheteur"),
    "Synthetic hair": ("Cabello sintético", "Synthetisches Haar", "Cheveux synthétiques"),
    "Multiple fashion shades (see gallery)": ("Varios tonos fashion (ver galería)", "Mehrere Fashion-Nuancen (siehe Galerie)", "Plusieurs nuances fashion (voir galerie)"),
    "1 approved images": ("1 imagen aprobada", "1 Bild freigegeben", "1 image approuvée"),
    "Ready-to-wear synthetic wig": ("Peluca sintética lista para usar", "Fertig getragene Synthetikperücke", "Perruque synthétique prête à porter"),
    "Full synthetic wig (ready-to-wear cap)": ("Peluca sintética completa (base lista)", "Volle Synthetikperücke (fertige Kappe)", "Perruque synthétique complète (base prête)"),
}

def translate_labels(obj, lang_idx):
    if isinstance(obj, str):
        for en, tri in LABEL_MAP.items():
            if obj.strip() == en:
                return tri[lang_idx]
        # partial match for "X parting" patterns
        for en, tri in LABEL_MAP.items():
            if en.endswith(" parting") and obj.endswith(en.replace(" parting", " parting")):
                # only exact match already handled
                pass
        return obj
    if isinstance(obj, list):
        return [translate_labels(v, lang_idx) for v in obj]
    if isinstance(obj, dict):
        return {k: translate_labels(v, lang_idx) for k, v in obj.items()}
    return obj

# ---- Human Hair Extensions (6) ----
HH_EXT = {
    "clip-in-human-hair-extensions": {
        "es": {
            "title": "Extensiones de clip de pelo humano",
            "metaTitle": "Extensiones de clip de pelo humano al por mayor | DS HAIR",
            "description": "Desarrolle extensiones de clip de pelo humano al por mayor en formatos clásico, sin costuras, one-piece y clip individual, con sets de 7 y 8 piezas, longitud, peso, color y empaque confirmados según su brief B2B.",
            "summary": "Una gama completa de extensiones clip-in para salones, distribuidores y marcas private label. Elija primero la construcción y el formato, luego confirme el set, longitud, gramos totales, color y empaque como una especificación repetible.",
        },
        "de": {
            "title": "Echthaar Clip-In Extensions",
            "metaTitle": "Echthaar Clip-In Extensions Großhandel | DS HAIR",
            "description": "Entwickeln Sie Echthaar Clip-In Extensions im Großhandel in klassischen, nahtlosen, One-Piece- und Einzel-Clip-Formaten mit 7- und 8-teiligen Sets, Länge, Gewicht, Farbe und Verpackung nach Ihrem B2B-Brief.",
            "summary": "Eine komplette Clip-In-Linie für Salons, Distributoren und Private-Label-Marken. Wählen Sie zuerst Konstruktion und Format, dann bestätigen Sie Set, Länge, Gesamtgramm, Farbe und Verpackung als wiederholbare Spezifikation.",
        },
        "fr": {
            "title": "Extensions clip-in cheveux humains",
            "metaTitle": "Extensions clip-in cheveux humains en gros | DS HAIR",
            "description": "Développez des extensions clip-in cheveux humains en gros en formats classique, sans couture, one-piece et clip individuel, avec sets 7 et 8 pièces, longueur, poids, couleur et emballage confirmés selon votre brief B2B.",
            "summary": "Une gamme clip-in complète pour salons, distributeurs et marques privées. Choisissez d’abord la construction et le format, puis confirmez le set, la longueur, le poids total, la couleur et l’emballage comme spécification répétable.",
        },
    },
    "tape-in-human-hair-extensions": {
        "es": {
            "title": "Extensiones tape-in de pelo humano",
            "metaTitle": "Extensiones tape-in de pelo humano al por mayor | DS HAIR",
            "description": "Suministre extensiones tape-in de pelo humano al por mayor para salones, distribuidores y marcas private label. Tape clásico, invisible y de microlínea con cinta europea, grosor, longitud, color y empaque confirmados.",
            "summary": "Extensiones tape-in de pelo humano Remy para programas B2B. Confirme el tipo de cinta, grosor de la malla, longitud, peso por pieza, color y empaque para una especificación repetible.",
        },
        "de": {
            "title": "Echthaar Tape-In Extensions",
            "metaTitle": "Echthaar Tape-In Extensions Großhandel | DS HAIR",
            "description": "Beziehen Sie Echthaar Tape-In Extensions im Großhandel für Salons, Distributoren und Private-Label-Marken. Klassisches, unsichtbares und Microl-Tape mit europäischem Klebeband, Banddicke, Länge, Farbe und Verpackung.",
            "summary": "Remy Echthaar Tape-In Extensions für B2B-Programme. Bestätigen Sie Tape-Typ, Banddicke, Länge, Gewicht pro Piece, Farbe und Verpackung als wiederholbare Spezifikation.",
        },
        "fr": {
            "title": "Extensions tape-in cheveux humains",
            "metaTitle": "Extensions tape-in cheveux humains en gros | DS HAIR",
            "description": "Approvisionnez des extensions tape-in cheveux humains en gros pour salons, distributeurs et marques privées. Tape classique, invisible et micro-ligne avec adhésif européen, épaisseur, longueur, couleur et emballage confirmés.",
            "summary": "Extensions tape-in cheveux humains Remy pour programmes B2B. Confirmez le type de tape, l’épaisseur de bande, la longueur, le poids par pièce, la couleur et l’emballage comme spécification répétable.",
        },
    },
    "k-tip-human-hair-extensions": {
        "es": {
            "title": "Extensiones K-Tip de pelo humano",
            "metaTitle": "Extensiones K-Tip de pelo humano al por mayor | DS HAIR",
            "description": "Suministre extensiones K-Tip (keratina) de pelo humano al por mayor para salones y marcas private label. Punta de queratina italiana, grosor, longitud, color y empaque confirmados según el brief B2B.",
            "summary": "Extensiones K-Tip de pelo humano Remy para programas profesionales. Confirme el tipo de punta, grosor, longitud, mechas por paquete, color y empaque para una especificación repetible.",
        },
        "de": {
            "title": "Echthaar K-Tip Extensions",
            "metaTitle": "Echthaar K-Tip Extensions Großhandel | DS HAIR",
            "description": "Beziehen Sie Echthaar K-Tip (Keratin) Extensions im Großhandel für Salons und Private-Label-Marken. Italienische Keratinspitze, Dicke, Länge, Farbe und Verpackung nach B2B-Brief.",
            "summary": "Remy Echthaar K-Tip Extensions für professionelle Programme. Bestätigen Sie Spitzentyp, Dicke, Länge, Strähnen pro Packung, Farbe und Verpackung als wiederholbare Spezifikation.",
        },
        "fr": {
            "title": "Extensions K-Tip cheveux humains",
            "metaTitle": "Extensions K-Tip cheveux humains en gros | DS HAIR",
            "description": "Approvisionnez des extensions K-Tip (kératine) cheveux humains en gros pour salons et marques privées. Pointe kératine italienne, épaisseur, longueur, couleur et emballage confirmés selon le brief B2B.",
            "summary": "Extensions K-Tip cheveux humains Remy pour programmes professionnels. Confirmez le type de pointe, l’épaisseur, la longueur, les mèches par paquet, la couleur et l’emballage comme spécification répétable.",
        },
    },
    "genius-weft-human-hair-extensions": {
        "es": {
            "title": "Extensiones Genius Weft de pelo humano",
            "metaTitle": "Extensiones Genius Weft de pelo humano al por mayor | DS HAIR",
            "description": "Suministre extensiones Genius Weft de pelo humano al por mayor. Weft fino, flexible y sin retorno para salones y marcas private label. Longitud, peso, color y empaque confirmados.",
            "summary": "Extensiones Genius Weft de pelo humano Remy para programas B2B. Confirme el ancho del weft, grosor, longitud, peso por metro, color y empaque para una especificación repetible.",
        },
        "de": {
            "title": "Echthaar Genius Weft Extensions",
            "metaTitle": "Echthaar Genius Weft Extensions Großhandel | DS HAIR",
            "summary": "Remy Echthaar Genius Weft Extensions für B2B-Programme. Bestätigen Sie Weft-Breite, Dicke, Länge, Gewicht pro Meter, Farbe und Verpackung als wiederholbare Spezifikation.",
            "description": "Beziehen Sie Echthaar Genius Weft Extensions im Großhandel. Dünner, flexibler, rückenfreier Weft für Salons und Private-Label-Marken. Länge, Gewicht, Farbe und Verpackung bestätigt.",
        },
        "fr": {
            "title": "Extensions Genius Weft cheveux humains",
            "metaTitle": "Extensions Genius Weft cheveux humains en gros | DS HAIR",
            "description": "Approvisionnez des extensions Genius Weft cheveux humains en gros. Weft fin, flexible et sans retour pour salons et marques privées. Longueur, poids, couleur et emballage confirmés.",
            "summary": "Extensions Genius Weft cheveux humains Remy pour programmes B2B. Confirmez la largeur du weft, l’épaisseur, la longueur, le poids au mètre, la couleur et l’emballage comme spécification répétable.",
        },
    },
    "machine-weft-human-hair-extensions": {
        "es": {
            "title": "Extensiones Machine Weft de pelo humano",
            "metaTitle": "Extensiones Machine Weft de pelo humano al por mayor | DS HAIR",
            "description": "Suministre extensiones Machine Weft de pelo humano al por mayor para salones, distribuidores y marcas private label. Costura reforzada, longitud, peso, color y empaque confirmados según el brief.",
            "summary": "Extensiones Machine Weft de pelo humano Remy para programas B2B. Confirme el tipo de costura, longitud, peso por metro, color y empaque para una especificación repetible.",
        },
        "de": {
            "title": "Echthaar Machine Weft Extensions",
            "metaTitle": "Echthaar Machine Weft Extensions Großhandel | DS HAIR",
            "description": "Beziehen Sie Echthaar Machine Weft Extensions im Großhandel für Salons, Distributoren und Private-Label-Marken. Verstärkte Naht, Länge, Gewicht, Farbe und Verpackung bestätigt.",
            "summary": "Remy Echthaar Machine Weft Extensions für B2B-Programme. Bestätigen Sie Nahttyp, Länge, Gewicht pro Meter, Farbe und Verpackung als wiederholbare Spezifikation.",
        },
        "fr": {
            "title": "Extensions Machine Weft cheveux humains",
            "metaTitle": "Extensions Machine Weft cheveux humains en gros | DS HAIR",
            "description": "Approvisionnez des extensions Machine Weft cheveux humains en gros pour salons, distributeurs et marques privées. Couture renforcée, longueur, poids, couleur et emballage confirmés.",
            "summary": "Extensions Machine Weft cheveux humains Remy pour programmes B2B. Confirmez le type de couture, la longueur, le poids au mètre, la couleur et l’emballage comme spécification répétable.",
        },
    },
    "nano-ring-human-hair-extensions": {
        "es": {
            "title": "Extensiones Nano Ring de pelo humano",
            "metaTitle": "Extensiones Nano Ring de pelo humano al por mayor | DS HAIR",
            "description": "Suministre extensiones Nano Ring de pelo humano al por mayor para salones profesionales. Anillo nano de silicona, grosor, longitud, color y empaque confirmados según el brief B2B.",
            "summary": "Extensiones Nano Ring de pelo humano Remy para programas B2B. Confirme el tipo de anillo, grosor, longitud, mechas por paquete, color y empaque para una especificación repetible.",
        },
        "de": {
            "title": "Echthaar Nano Ring Extensions",
            "metaTitle": "Echthaar Nano Ring Extensions Großhandel | DS HAIR",
            "description": "Beziehen Sie Echthaar Nano Ring Extensions im Großhandel für professionelle Salons. Silikon-Nano-Ring, Dicke, Länge, Farbe und Verpackung nach B2B-Brief.",
            "summary": "Remy Echthaar Nano Ring Extensions für B2B-Programme. Bestätigen Sie Ringtyp, Dicke, Länge, Strähnen pro Packung, Farbe und Verpackung als wiederholbare Spezifikation.",
        },
        "fr": {
            "title": "Extensions Nano Ring cheveux humains",
            "metaTitle": "Extensions Nano Ring cheveux humains en gros | DS HAIR",
            "description": "Approvisionnez des extensions Nano Ring cheveux humains en gros pour salons professionnels. Anneau nano en silicone, épaisseur, longueur, couleur et emballage confirmés selon le brief B2B.",
            "summary": "Extensions Nano Ring cheveux humains Remy pour programmes B2B. Confirmez le type d’anneau, l’épaisseur, la longueur, les mèches par paquet, la couleur et l’emballage comme spécification répétable.",
        },
    },
}

# ---- Lace Wigs (4) ----
def lace_wig_trans(model):
    n = int(model)
    return {
        "es": {
            "title": f"Peluca de encaje modelo {n}",
            "metaTitle": f"Peluca de encaje modelo {n} al por mayor | DS HAIR",
            "description": f"Suministre la peluca de encaje modelo {n} para programas de salón, distribuidor y marca privada. Las fotos muestran la referencia DS HAIR; especificaciones escritas, MOQ, precio y plazo se confirman bajo solicitud.",
            "summary": f"Peluca de encaje modelo {n}: referencia DS HAIR para evaluación B2B, desarrollo de muestras y programas de marca privada.",
        },
        "de": {
            "title": f"Spitzenperücke Modell {n}",
            "metaTitle": f"Spitzenperücke Modell {n} Großhandel | DS HAIR",
            "description": f"Beziehen Sie die Spitzenperücke Modell {n} für Salon-, Distributoren- und Private-Label-Programme. Fotos zeigen die DS HAIR-Referenz; schriftliche Spezifikationen, MOQ, Preis und Lieferzeit auf Anfrage.",
            "summary": f"Spitzenperücke Modell {n} – eine DS HAIR-Referenz für B2B-Evaluierung, Musterentwicklung und Private-Label-Programme.",
        },
        "fr": {
            "title": f"Perruque dentelle modèle {n}",
            "metaTitle": f"Perruque dentelle modèle {n} en gros | DS HAIR",
            "description": f"Approvisionnez la perruque dentelle modèle {n} pour programmes salon, distributeur et marque privée. Les photos montrent la référence DS HAIR ; spécifications écrites, MOQ, prix et délai confirmés sur demande.",
            "summary": f"Perruque dentelle modèle {n} – une référence DS HAIR pour évaluation B2B, développement d’échantillons et programmes de marque privée.",
        },
    }

LACE_WIG = {f"lace-wig-{n}": lace_wig_trans(n) for n in [201, 202, 203, 204]}

# ---- Human Hair Toppers (13) ----
def topper_trans(model):
    n = int(model)
    return {
        "es": {
            "title": f"Topper de pelo humano modelo {n:02d}",
            "metaTitle": f"Topper de pelo humano modelo {n:02d} al por mayor | DS HAIR",
            "description": f"Suministre el topper de pelo humano modelo {n:02d} para programas de salón, distribuidor y marca privada. Las fotos muestran la referencia DS HAIR; especificaciones escritas, MOQ, precio y plazo se confirman bajo solicitud.",
            "summary": f"Topper de pelo humano modelo {n:02d}: referencia DS HAIR para evaluación B2B, desarrollo de muestras y programas de marca privada.",
        },
        "de": {
            "title": f"Echthaar-Topper Modell {n:02d}",
            "metaTitle": f"Echthaar-Topper Modell {n:02d} Großhandel | DS HAIR",
            "description": f"Beziehen Sie den Echthaar-Topper Modell {n:02d} für Salon-, Distributoren- und Private-Label-Programme. Fotos zeigen die DS HAIR-Referenz; schriftliche Spezifikationen, MOQ, Preis und Lieferzeit auf Anfrage.",
            "summary": f"Echthaar-Topper Modell {n:02d} – eine DS HAIR-Referenz für B2B-Evaluierung, Musterentwicklung und Private-Label-Programme.",
        },
        "fr": {
            "title": f"Toupe en cheveux humains modèle {n:02d}",
            "metaTitle": f"Toupe en cheveux humains modèle {n:02d} en gros | DS HAIR",
            "description": f"Approvisionnez la toupe en cheveux humains modèle {n:02d} pour programmes salon, distributeur et marque privée. Les photos montrent la référence DS HAIR ; spécifications écrites, MOQ, prix et délai confirmés sur demande.",
            "summary": f"Toupe en cheveux humains modèle {n:02d} – une référence DS HAIR pour évaluation B2B, développement d’échantillons et programmes de marque privée.",
        },
    }

TOPPER = {f"human-hair-topper-{n:02d}": topper_trans(n) for n in range(1, 14)}

# ---- Synthetic Hairpieces & Ponytails (10) ----
SYNTHETIC = {
    "synthetic-clip-in-chignon-hairpiece": {
        "es": {"title": "Recogido clip-in sintético", "metaTitle": "Recogido clip-in sintético al por mayor | DS HAIR", "description": "Suministre recogidos clip-in sintéticos para salones, distribuidores y marcas private label. Base, fibra, color y empaque confirmados según el brief B2B.", "summary": "Recogido clip-in sintético para programas B2B. Confirme la base, fibra, color y empaque para una especificación repetible."},
        "de": {"title": "Synthetisches Clip-In Chignon-Haarteil", "metaTitle": "Synthetisches Clip-In Chignon-Haarteil Großhandel | DS HAIR", "description": "Beziehen Sie synthetische Clip-In Chignon-Haarteile für Salons, Distributoren und Private-Label-Marken. Basis, Faser, Farbe und Verpackung nach B2B-Brief.", "summary": "Synthetisches Clip-In Chignon-Haarteil für B2B-Programme. Bestätigen Sie Basis, Faser, Farbe und Verpackung als wiederholbare Spezifikation."},
        "fr": {"title": "Chignon clip-in synthétique", "metaTitle": "Chignon clip-in synthétique en gros | DS HAIR", "description": "Approvisionnez des chignons clip-in synthétiques pour salons, distributeurs et marques privées. Base, fibre, couleur et emballage confirmés selon le brief B2B.", "summary": "Chignon clip-in synthétique pour programmes B2B. Confirmez la base, la fibre, la couleur et l’emballage comme spécification répétable."},
    },
    "synthetic-22-inch-straight-clip-in-hairpiece": {
        "es": {"title": "Extension clip-in sintética lisa 22 in", "metaTitle": "Extension clip-in sintética lisa 22 in al por mayor | DS HAIR", "description": "Suministre extensiones clip-in sintéticas lisas de 22 in para programas B2B. Longitud, fibra, color y empaque confirmados.", "summary": "Extension clip-in sintética lisa de 22 in para programas B2B. Confirme longitud, fibra, color y empaque."},
        "de": {"title": "22 Zoll glattes synthetisches Clip-In Haarteil", "metaTitle": "22 Zoll glattes synthetisches Clip-In Haarteil Großhandel | DS HAIR", "description": "Beziehen Sie 22 Zoll glatte synthetische Clip-In Haarteile für B2B-Programme. Länge, Faser, Farbe und Verpackung bestätigt.", "summary": "22 Zoll glattes synthetisches Clip-In Haarteil für B2B-Programme. Bestätigen Sie Länge, Faser, Farbe und Verpackung."},
        "fr": {"title": "Extension clip-in synthétique lisse 22 in", "metaTitle": "Extension clip-in synthétique lisse 22 in en gros | DS HAIR", "description": "Approvisionnez des extensions clip-in synthétiques lisses de 22 in pour programmes B2B. Longueur, fibre, couleur et emballage confirmés.", "summary": "Extension clip-in synthétique lisse de 22 in pour programmes B2B. Confirmez longueur, fibre, couleur et emballage."},
    },
    "synthetic-21-inch-soft-curls-claw-clip-ponytail": {
        "es": {"title": "Cola de caballo con pinza y rizos suaves sintética 21 in", "metaTitle": "Cola de caballo con pinza y rizos suaves sintética 21 in al por mayor | DS HAIR", "description": "Suministre colas de caballo con pinza y rizos suaves sintéticas de 21 in para programas B2B. Longitud, fibra, color y empaque confirmados.", "summary": "Cola de caballo con pinza y rizos suaves sintética de 21 in para programas B2B. Confirme longitud, fibra, color y empaque."},
        "de": {"title": "21 Zoll synthetischer Krallenclip-Pferdeschwanz mit weichen Locken", "metaTitle": "21 Zoll synthetischer Krallenclip-Pferdeschwanz mit weichen Locken Großhandel | DS HAIR", "description": "Beziehen Sie 21 Zoll synthetische Krallenclip-Pferdeschwänze mit weichen Locken für B2B-Programme. Länge, Faser, Farbe und Verpackung bestätigt.", "summary": "21 Zoll synthetischer Krallenclip-Pferdeschwanz mit weichen Locken für B2B-Programme. Bestätigen Sie Länge, Faser, Farbe und Verpackung."},
        "fr": {"title": "Queue de cheval clip griffe synthétique boucles souples 21 in", "metaTitle": "Queue de cheval clip griffe synthétique boucles souples 21 in en gros | DS HAIR", "description": "Approvisionnez des queues de cheval clip griffe synthétiques boucles souples de 21 in pour programmes B2B. Longueur, fibre, couleur et emballage confirmés.", "summary": "Queue de cheval clip griffe synthétique boucles souples de 21 in pour programmes B2B. Confirmez longueur, fibre, couleur et emballage."},
    },
    "synthetic-21-inch-straight-claw-clip-ponytail": {
        "es": {"title": "Cola de caballo con pinza lisa sintética 21 in", "metaTitle": "Cola de caballo con pinza lisa sintética 21 in al por mayor | DS HAIR", "description": "Suministre colas de caballo con pinza lisas sintéticas de 21 in para programas B2B. Longitud, fibra, color y empaque confirmados.", "summary": "Cola de caballo con pinza lisa sintética de 21 in para programas B2B. Confirme longitud, fibra, color y empaque."},
        "de": {"title": "21 Zoll glatter synthetischer Krallenclip-Pferdeschwanz", "metaTitle": "21 Zoll glatter synthetischer Krallenclip-Pferdeschwanz Großhandel | DS HAIR", "description": "Beziehen Sie 21 Zoll glatte synthetische Krallenclip-Pferdeschwänze für B2B-Programme. Länge, Faser, Farbe und Verpackung bestätigt.", "summary": "21 Zoll glatter synthetischer Krallenclip-Pferdeschwanz für B2B-Programme. Bestätigen Sie Länge, Faser, Farbe und Verpackung."},
        "fr": {"title": "Queue de cheval clip griffe synthétique lisse 21 in", "metaTitle": "Queue de cheval clip griffe synthétique lisse 21 in en gros | DS HAIR", "description": "Approvisionnez des queues de cheval clip griffe synthétiques lisses de 21 in pour programmes B2B. Longueur, fibre, couleur et emballage confirmés.", "summary": "Queue de cheval clip griffe synthétique lisse de 21 in pour programmes B2B. Confirmez longueur, fibre, couleur et emballage."},
    },
    "synthetic-26-inch-elastic-band-braiding-ponytail": {
        "es": {"title": "Cola de caballo para trenzas con banda elástica sintética 26 in", "metaTitle": "Cola de caballo para trenzas con banda elástica sintética 26 in al por mayor | DS HAIR", "description": "Suministre colas de caballo para trenzas con banda elástica sintéticas de 26 in para programas B2B. Longitud, fibra, color y empaque confirmados.", "summary": "Cola de caballo para trenzas con banda elástica sintética de 26 in para programas B2B. Confirme longitud, fibra, color y empaque."},
        "de": {"title": "26 Zoll synthetischer Zopf-Pferdeschwanz mit Haargummi", "metaTitle": "26 Zoll synthetischer Zopf-Pferdeschwanz mit Haargummi Großhandel | DS HAIR", "description": "Beziehen Sie 26 Zoll synthetische Zopf-Pferdeschwänze mit Haargummi für B2B-Programme. Länge, Faser, Farbe und Verpackung bestätigt.", "summary": "26 Zoll synthetischer Zopf-Pferdeschwanz mit Haargummi für B2B-Programme. Bestätigen Sie Länge, Faser, Farbe und Verpackung."},
        "fr": {"title": "Queue de cheval tressage synthétique bande élastique 26 in", "metaTitle": "Queue de cheval tressage synthétique bande élastique 26 in en gros | DS HAIR", "description": "Approvisionnez des queues de cheval tressage synthétiques bande élastique de 26 in pour programmes B2B. Longueur, fibre, couleur et emballage confirmés.", "summary": "Queue de cheval tressage synthétique bande élastique de 26 in pour programmes B2B. Confirmez longueur, fibre, couleur et emballage."},
    },
    "synthetic-12-inch-coily-drawstring-ponytail": {
        "es": {"title": "Cola de caballo rizada con cordón sintética 12 in", "metaTitle": "Cola de caballo rizada con cordón sintética 12 in al por mayor | DS HAIR", "description": "Suministre colas de caballo rizadas con cordón sintéticas de 12 in para programas B2B. Longitud, fibra, color y empaque confirmados.", "summary": "Cola de caballo rizada con cordón sintética de 12 in para programas B2B. Confirme longitud, fibra, color y empaque."},
        "de": {"title": "12 Zoll gelockter synthetischer Kordelzug-Pferdeschwanz", "metaTitle": "12 Zoll gelockter synthetischer Kordelzug-Pferdeschwanz Großhandel | DS HAIR", "description": "Beziehen Sie 12 Zoll gelockte synthetische Kordelzug-Pferdeschwänze für B2B-Programme. Länge, Faser, Farbe und Verpackung bestätigt.", "summary": "12 Zoll gelockter synthetischer Kordelzug-Pferdeschwanz für B2B-Programme. Bestätigen Sie Länge, Faser, Farbe und Verpackung."},
        "fr": {"title": "Queue de cheval frisée cordon synthétique 12 in", "metaTitle": "Queue de cheval frisée cordon synthétique 12 in en gros | DS HAIR", "description": "Approvisionnez des queues de cheval frisées cordon synthétiques de 12 in pour programmes B2B. Longueur, fibre, couleur et emballage confirmés.", "summary": "Queue de cheval frisée cordon synthétique de 12 in pour programmes B2B. Confirmez longueur, fibre, couleur et emballage."},
    },
    "synthetic-elastic-band-hair-bun-scrunchie": {
        "es": {"title": "Moño scrunchie con banda elástica sintético", "metaTitle": "Moño scrunchie con banda elástica sintético al por mayor | DS HAIR", "description": "Suministre moños scrunchie con banda elástica sintéticos para programas B2B. Base, fibra, color y empaque confirmados.", "summary": "Moño scrunchie con banda elástica sintético para programas B2B. Confirme base, fibra, color y empaque."},
        "de": {"title": "Synthetischer Dutt Scrunchie mit Haargummi", "metaTitle": "Synthetischer Dutt Scrunchie mit Haargummi Großhandel | DS HAIR", "description": "Beziehen Sie synthetische Dutt Scrunchies mit Haargummi für B2B-Programme. Basis, Faser, Farbe und Verpackung bestätigt.", "summary": "Synthetischer Dutt Scrunchie mit Haargummi für B2B-Programme. Bestätigen Sie Basis, Faser, Farbe und Verpackung."},
        "fr": {"title": "Chignon scrunchie synthétique bande élastique", "metaTitle": "Chignon scrunchie synthétique bande élastique en gros | DS HAIR", "description": "Approvisionnez des chignons scrunchie synthétiques bande élastique pour programmes B2B. Base, fibre, couleur et emballage confirmés.", "summary": "Chignon scrunchie synthétique bande élastique pour programmes B2B. Confirmez base, fibre, couleur et emballage."},
    },
    "synthetic-layered-clip-in-crown-topper": {
        "es": {"title": "Topper clip-in en capas sintético para corona", "metaTitle": "Topper clip-in en capas sintético para corona al por mayor | DS HAIR", "description": "Suministre toppers clip-in en capas sintéticos para corona para programas B2B. Base, fibra, color y empaque confirmados.", "summary": "Topper clip-in en capas sintético para corona para programas B2B. Confirme base, fibra, color y empaque."},
        "de": {"title": "Synthetischer gestufter Clip-In Crown Topper", "metaTitle": "Synthetischer gestufter Clip-In Crown Topper Großhandel | DS HAIR", "description": "Beziehen Sie synthetische gestufte Clip-In Crown Topper für B2B-Programme. Basis, Faser, Farbe und Verpackung bestätigt.", "summary": "Synthetischer gestufter Clip-In Crown Topper für B2B-Programme. Bestätigen Sie Basis, Faser, Farbe und Verpackung."},
        "fr": {"title": "Toupe clip-in synthétique en couches pour couronne", "metaTitle": "Toupe clip-in synthétique en couches pour couronne en gros | DS HAIR", "description": "Approvisionnez des toupes clip-in synthétiques en couches pour couronne pour programmes B2B. Base, fibre, couleur et emballage confirmés.", "summary": "Toupe clip-in synthétique en couches pour couronne pour programmes B2B. Confirmez base, fibre, couleur et emballage."},
    },
    "synthetic-beach-wave-clip-in-crown-topper": {
        "es": {"title": "Topper clip-in ondas playeras sintético para corona", "metaTitle": "Topper clip-in ondas playeras sintético para corona al por mayor | DS HAIR", "description": "Suministre toppers clip-in con ondas playeras sintéticos para corona para programas B2B. Base, fibra, color y empaque confirmados.", "summary": "Topper clip-in ondas playeras sintético para corona para programas B2B. Confirme base, fibra, color y empaque."},
        "de": {"title": "Synthetischer Beach-Wave Clip-In Crown Topper", "metaTitle": "Synthetischer Beach-Wave Clip-In Crown Topper Großhandel | DS HAIR", "description": "Beziehen Sie synthetische Beach-Wave Clip-In Crown Topper für B2B-Programme. Basis, Faser, Farbe und Verpackung bestätigt.", "summary": "Synthetischer Beach-Wave Clip-In Crown Topper für B2B-Programme. Bestätigen Sie Basis, Faser, Farbe und Verpackung."},
        "fr": {"title": "Toupe clip-in synthétique beach waves pour couronne", "metaTitle": "Toupe clip-in synthétique beach waves pour couronne en gros | DS HAIR", "description": "Approvisionnez des toupes clip-in synthétiques beach waves pour couronne pour programmes B2B. Base, fibre, couleur et emballage confirmés.", "summary": "Toupe clip-in synthétique beach waves pour couronne pour programmes B2B. Confirmez base, fibre, couleur et emballage."},
    },
    "synthetic-clip-in-bangs-fringe": {
        "es": {"title": "Flequillo clip-in sintético", "metaTitle": "Flequillo clip-in sintético al por mayor | DS HAIR", "description": "Suministre flequillos clip-in sintéticos para salones, distribuidores y marcas private label. Base, fibra, color y empaque confirmados según el brief B2B.", "summary": "Flequillo clip-in sintético para programas B2B. Confirme base, fibra, color y empaque para una especificación repetible."},
        "de": {"title": "Synthetischer Clip-In Pony", "metaTitle": "Synthetischer Clip-In Pony Großhandel | DS HAIR", "description": "Beziehen Sie synthetische Clip-In Ponys für Salons, Distributoren und Private-Label-Marken. Basis, Faser, Farbe und Verpackung nach B2B-Brief.", "summary": "Synthetischer Clip-In Pony für B2B-Programme. Bestätigen Sie Basis, Faser, Farbe und Verpackung als wiederholbare Spezifikation."},
        "fr": {"title": "Frange clip-in synthétique", "metaTitle": "Frange clip-in synthétique en gros | DS HAIR", "description": "Approvisionnez des franges clip-in synthétiques pour salons, distributeurs et marques privées. Base, fibre, couleur et emballage confirmés selon le brief B2B.", "summary": "Frange clip-in synthétique pour programmes B2B. Confirmez la base, la fibre, la couleur et l’emballage comme spécification répétable."},
    },
}

TRANS = {}
TRANS.update(HH_EXT)
TRANS.update(LACE_WIG)
TRANS.update(TOPPER)
TRANS.update(SYNTHETIC)

# ---- Generic UI translation helpers ----
UI = {
    "es": {
        "tradePricingSamples": "Precios profesionales y muestras",
        "wholesalePricingSampleSupport": "Precios mayoristas y soporte de muestras para socios profesionales registrados",
        "applyTradeAccount": "Solicitar cuenta profesional",
        "enquireWhatsApp": "Consultar por WhatsApp",
        "moqSamples": "MOQ y muestras",
        "negotiable": "Negociable",
        "privateLabel": "Marca privada",
        "oemPackaging": "Empaque OEM",
        "globalShipping": "Envío global",
        "daysExpress": "3–5 días express",
        "years": "19 años",
        "industryExperience": "Experiencia en la industria",
        "qualityGuarantee": "Garantía de calidad",
        "sampleApprovalBeforeProduction": "Aprobación de muestra antes de producción",
        "reorderSupport": "Soporte de reorden",
        "returnToApprovedSpec": "Volver a especificación aprobada",
        "colourMatching": "Coincidencia de color",
        "physicalReferencesAvailable": "Referencias físicas disponibles",
        "flexibleLeadTimes": "Plazos flexibles",
        "expressOrScheduled": "Express o programado",
        "requestVerifiedSpec": "Solicitar especificación verificada",
        "discussRequirement": "Hablemos de su requerimiento",
        "draftNotice": "Borrador de referencia — las especificaciones comerciales se confirman con la muestra aprobada.",
        "imageStatusNote": "IMAGERÍA DE REFERENCIA DE MERCADO · REEMPLAZAR CON FOTOS DS HAIR ANTES DE VENTA",
    },
    "de": {
        "tradePricingSamples": "Handelspreise & Muster",
        "wholesalePricingSampleSupport": "Großhandelspreise und Muster-Support für registrierte Handelspartner",
        "applyTradeAccount": "Handelskonto beantragen",
        "enquireWhatsApp": "Per WhatsApp anfragen",
        "moqSamples": "MOQ & Muster",
        "negotiable": "Verhandelbar",
        "privateLabel": "Eigenmarke",
        "oemPackaging": "OEM-Verpackung",
        "globalShipping": "Weltweiter Versand",
        "daysExpress": "3–5 Tage Express",
        "years": "19 Jahre",
        "industryExperience": "Branchenerfahrung",
        "qualityGuarantee": "Qualitätsgarantie",
        "sampleApprovalBeforeProduction": "Musterfreigabe vor Produktion",
        "reorderSupport": "Wiederbestell-Support",
        "returnToApprovedSpec": "Zurück zur freigegebenen Spezifikation",
        "colourMatching": "Farbabgleich",
        "physicalReferencesAvailable": "Physische Referenzen verfügbar",
        "flexibleLeadTimes": "Flexible Lieferzeiten",
        "expressOrScheduled": "Express oder terminiert",
        "requestVerifiedSpec": "Geprüfte Spezifikation anfragen",
        "discussRequirement": "Anforderung besprechen",
        "draftNotice": "Referenzentwurf — Geschäftsbedingungen werden mit freigegebenem Muster bestätigt.",
        "imageStatusNote": "MARKTREFERENZ-BILDMATERIAL · VOR LIVE-HANDEL DURCH DS HAIR-FOTOS ERSETZEN",
    },
    "fr": {
        "tradePricingSamples": "Tarifs professionnels & échantillons",
        "wholesalePricingSampleSupport": "Prix de gros et support échantillons pour partenaires professionnels enregistrés",
        "applyTradeAccount": "Demander un compte pro",
        "enquireWhatsApp": "Demander par WhatsApp",
        "moqSamples": "MOQ & échantillons",
        "negotiable": "Négociable",
        "privateLabel": "Marque privée",
        "oemPackaging": "Emballage OEM",
        "globalShipping": "Expédition mondiale",
        "daysExpress": "3–5 jours express",
        "years": "19 ans",
        "industryExperience": "Expérience de l’industrie",
        "qualityGuarantee": "Garantie qualité",
        "sampleApprovalBeforeProduction": "Approbation échantillon avant production",
        "reorderSupport": "Support réapprovisionnement",
        "returnToApprovedSpec": "Retour à la spécification approuvée",
        "colourMatching": "Assortiment couleur",
        "physicalReferencesAvailable": "Références physiques disponibles",
        "flexibleLeadTimes": "Délais flexibles",
        "expressOrScheduled": "Express ou programmé",
        "requestVerifiedSpec": "Demander une spécification vérifiée",
        "discussRequirement": "Discuter de votre besoin",
        "draftNotice": "Brouillon de référence — les conditions commerciales sont confirmées avec l’échantillon approuvé.",
        "imageStatusNote": "IMAGERIE DE RÉFÉRENCE MARCHÉ · REMPLACER PAR LES PHOTOS DS HAIR AVANT VENTE",
    },
}

BADGE_MAP = {
    "MOQ & Samples": ("MOQ y muestras", "MOQ & Muster", "MOQ & échantillons"),
    "Private Label": ("Marca privada", "Eigenmarke", "Marque privée"),
    "Global Shipping": ("Envío global", "Weltweiter Versand", "Expédition mondiale"),
    "19 Years": ("19 años", "19 Jahre", "19 ans"),
    "Quality Guarantee": ("Garantía de calidad", "Qualitätsgarantie", "Garantie qualité"),
    "Reorder Support": ("Soporte de reorden", "Wiederbestell-Support", "Support réapprovisionnement"),
    "Colour Matching": ("Coincidencia de color", "Farbabgleich", "Assortiment couleur"),
    "Flexible Lead Times": ("Plazos flexibles", "Flexible Lieferzeiten", "Délais flexibles"),
    "Negotiable": ("Negociable", "Verhandelbar", "Négociable"),
    "OEM packaging": ("Empaque OEM", "OEM-Verpackung", "Emballage OEM"),
    "3–5 days express": ("3–5 días express", "3–5 Tage Express", "3–5 jours express"),
    "Industry experience": ("Experiencia en la industria", "Branchenerfahrung", "Expérience de l’industrie"),
    "Sample approval before production": ("Aprobación de muestra antes de producción", "Musterfreigabe vor Produktion", "Approbation échantillon avant production"),
    "Return to approved specification": ("Volver a especificación aprobada", "Zurück zur freigegebenen Spezifikation", "Retour à la spécification approuvée"),
    "Physical references available": ("Referencias físicas disponibles", "Physische Referenzen verfügbar", "Références physiques disponibles"),
    "Express or scheduled": ("Express o programado", "Express oder terminiert", "Express ou programmé"),
}

SUB_MAP = {
    "Negotiable": ("Negociable", "Verhandelbar", "Négociable"),
    "OEM packaging": ("Empaque OEM", "OEM-Verpackung", "Emballage OEM"),
    "3–5 days express": ("3–5 días express", "3–5 Tage Express", "3–5 jours express"),
    "Industry experience": ("Experiencia en la industria", "Branchenerfahrung", "Expérience de l’industrie"),
    "Sample approval before production": ("Aprobación de muestra antes de producción", "Musterfreigabe vor Produktion", "Approbation échantillon avant production"),
    "Return to approved specification": ("Volver a especificación aprobada", "Zurück zur freigegebenen Spezifikation", "Retour à la spécification approuvée"),
    "Physical references available": ("Referencias físicas disponibles", "Physische Referenzen verfügbar", "Références physiques disponibles"),
    "Express or scheduled": ("Express o programado", "Express oder terminiert", "Express ou programmé"),
}

def translate_ui_struct(product, lang_idx):
    """Translate tradeCard, trustBadges, serviceBar, ctaTitle, ctaText, draftNotice, imageStatusNote."""
    if "tradeCard" in product:
        tc = product["tradeCard"]
        product["tradeCard"] = {
            **tc,
            "title": UI[LANGS[lang_idx]]["tradePricingSamples"],
            "subtitle": UI[LANGS[lang_idx]]["wholesalePricingSampleSupport"],
            "primaryCta": UI[LANGS[lang_idx]]["applyTradeAccount"],
            "secondaryCta": UI[LANGS[lang_idx]]["enquireWhatsApp"],
        }
    if "trustBadges" in product:
        product["trustBadges"] = [
            {"label": BADGE_MAP.get(b["label"], (b["label"],)*3)[lang_idx],
             "sublabel": SUB_MAP.get(b["sublabel"], (b["sublabel"],)*3)[lang_idx]}
            for b in product["trustBadges"]
        ]
    if "serviceBar" in product:
        product["serviceBar"] = [
            {"label": BADGE_MAP.get(b["label"], (b["label"],)*3)[lang_idx],
             "sublabel": SUB_MAP.get(b["sublabel"], (b["sublabel"],)*3)[lang_idx]}
            for b in product["serviceBar"]
        ]
    if "ctaTitle" in product:
        product["ctaTitle"] = UI[LANGS[lang_idx]]["requestVerifiedSpec"]
    if "ctaText" in product:
        product["ctaText"] = UI[LANGS[lang_idx]]["discussRequirement"]
    if "draftNotice" in product:
        product["draftNotice"] = UI[LANGS[lang_idx]]["draftNotice"]
    if "imageStatusNote" in product:
        product["imageStatusNote"] = UI[LANGS[lang_idx]]["imageStatusNote"]
    return product


def build_for(lang):
    idx = LANGS.index(lang)
    result = []
    for p in EN:
        slug = p["slug"]
        if slug in DSW[lang]:
            # keep existing DSW translation
            result.append(DSW[lang][slug])
            continue
        # clone english product
        prod = copy.deepcopy(p)
        # apply slug-level translations
        if slug in TRANS:
            for k, v in TRANS[slug][lang].items():
                prod[k] = v
        # translate labels in confirmedFacts / unconfirmed / buyerChecks / customisation etc.
        for key in prod:
            if key in ("images",):
                continue
            prod[key] = translate_labels(prod[key], idx)
        # translate standard UI blocks
        prod = translate_ui_struct(prod, idx)
        result.append(prod)
    return result


for lang in LANGS:
    out = ROOT / "content" / lang / "products.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(build_for(lang), ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {out} ({len(build_for(lang))} products)")
