import json, os, re

ROOT = '/Users/kkkk/Library/Mobile Documents/com~apple~CloudDocs/Desktop/dshairbeauty/wigexporter/wigexporter-web'
products = json.load(open(os.path.join(ROOT, 'content', 'products.json')))

TYPE_ES = {
  'Full': 'completa',
  'Lace Front': 'con frente de encaje',
  'Wavy with Side-Swept Bangs Long': 'ondulada con flequillo lateral larga',
  'Bob': 'bob',
  'Wavy Long': 'ondulada larga',
  'Lace Front Bob Straight Short': 'con frente de encaje bob lisa corta',
  'Lace Front Straight Long': 'con frente de encaje lisa larga',
  'Wavy with Side-Swept Bangs': 'ondulada con flequillo lateral',
  'with Side-Swept Bangs': 'con flequillo lateral',
}
TYPE_DE = {
  'Full': 'vollständige',
  'Lace Front': 'Lace-Front',
  'Wavy with Side-Swept Bangs Long': 'wellig mit seitlich gelegtem Pony lang',
  'Bob': 'Bob',
  'Wavy Long': 'wellig lang',
  'Lace Front Bob Straight Short': 'Lace-Front-Bob glatt kurz',
  'Lace Front Straight Long': 'Lace-Front glatt lang',
  'Wavy with Side-Swept Bangs': 'wellig mit seitlich gelegtem Pony',
  'with Side-Swept Bangs': 'mit seitlich gelegtem Pony',
}
TYPE_FR = {
  'Full': 'intégrale',
  'Lace Front': 'à front en dentelle',
  'Wavy with Side-Swept Bangs Long': 'ondulée avec frange balayée longue',
  'Bob': 'bob',
  'Wavy Long': 'ondulée longue',
  'Lace Front Bob Straight Short': 'à front en dentelle bob lisse courte',
  'Lace Front Straight Long': 'à front en dentelle lisse longue',
  'Wavy with Side-Swept Bangs': 'ondulée avec frange balayée',
  'with Side-Swept Bangs': 'avec frange balayée',
}

def extract_type(title):
    t = title.replace('Synthetic ', '', 1)
    t = re.sub(r'\s+Wig\s+DSW[-\w]+$', '', t)
    return t

def tr(type_en, lang, code):
    t = {'es': TYPE_ES, 'de': TYPE_DE, 'fr': TYPE_FR}[lang][type_en]
    c, cl = code, code.lower()
    if lang == 'es':
        return (
            f'Peluca sintética {t} {c}',
            f'Peluca sintética {t} {c} al por mayor | DS HAIR',
            f'Referencia de peluca sintética {t} para compradores profesionales que desarrollan gamas de pelucas listas para usar y de marca privada. La referencia fotografiada muestra el color de exhibición y el acabado de la base; la fibra, la construcción de la base, la longitud, la densidad y las condiciones comerciales se confirman con la muestra aprobada y la especificación por escrito.',
            f'Suministre la peluca sintética {t} {cl} — una peluca de fibra sintética lista para usar para moda, uso diario y gamas de marca privada al por mayor. Revise la construcción, las direcciones de color y las opciones de OEM.'
        )
    if lang == 'de':
        return (
            f'Synthetische {t} {c}',
            f'Synthetische {t} {c} Großhandel | DS HAIR',
            f'Referenz einer synthetischen {t} für professionelle Käufer, die Ready-to-wear- und Private-Label-Peluken-Sortimente entwickeln. Die fotografierte Referenz zeigt die Display-Farbe und die Cap-Ausführung; Faser, Cap-Konstruktion, Länge, Dichte und Handelsbedingungen werden anhand des freigegebenen Musters und der schriftlichen Spezifikation bestätigt.',
            f'Beziehen Sie die synthetische {t} {cl} — eine tragfertige synthetische Vollfaserperücke für Mode, Alltag und Private-Label-Großhandelssortimente. Prüfen Sie Konstruktion, Farbrichtungen und OEM-Optionen.'
        )
    if lang == 'fr':
        return (
            f'Perruque synthétique {t} {c}',
            f'Perruque synthétique {t} {c} en gros | DS HAIR',
            f'Référence de perruque synthétique {t} pour les acheteurs professionnels développant des gammes de perruques prêtes à porter et à marque privée. La référence photographiée montre la couleur de présentation et la finition de la base; la fibre, la construction de la base, la longueur, la densité et les conditions commerciales sont confirmées par l’échantillon approuvé et la fiche technique écrite.',
            f'Sourcez la perruque synthétique {t} {cl} — une perruque en fibre synthétique prête à porter pour la mode, le port quotidien et les gammes de marque privée en gros. Examinez la construction, les orientations couleur et les options OEM.'
        )

dsw = [p for p in products if p.get('code', '').startswith('DSW')]
for lang in ['es', 'de', 'fr']:
    out = []
    for p in dsw:
        np = dict(p)
        title, meta, summary, desc = tr(extract_type(p['title']), lang, p['code'])
        np['title'], np['metaTitle'], np['summary'], np['description'] = title, meta, summary, desc
        out.append(np)
    d = os.path.join(ROOT, 'content', lang)
    os.makedirs(d, exist_ok=True)
    json.dump(out, open(os.path.join(d, 'products.json'), 'w'), ensure_ascii=False, indent=2)
    print(lang, 'wrote', len(out), 'products')
