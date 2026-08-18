import json, os

ROOT = '/Users/kkkk/Library/Mobile Documents/com~apple~CloudDocs/Desktop/dshairbeauty/wigexporter/wigexporter-web'
src_cat = json.load(open(os.path.join(ROOT, 'content', 'product-catalog.json')))
src_site = json.load(open(os.path.join(ROOT, 'content', 'site-content.json')))
dsw = [p for p in src_cat['products'] if p['code'].startswith('DSW')]
syn = [c for c in src_site['collections'] if c['slug'] == 'synthetic-wigs-hairpieces'][0]

TR = {
  'es': {
    'title': 'Pelucas y accesorios capilares sintéticos al por mayor',
    'metaTitle': 'Pelucas y accesorios capilares sintéticos al por mayor | WigExporter',
    'description': 'Suministre pelucas y accesorios capilares sintéticos al por mayor, incluidas coletas, flequillos, bangs y toppers clip-in con fibra.',
    'intro': 'Defina una gama sintética comercialmente clara especificando la usuaria, la silueta, la longitud y el uso diario o de moda.'
  },
  'de': {
    'title': 'Synthetische Perücken & Haarteile Großhandel',
    'metaTitle': 'Synthetische Perücken & Haarteile Großhandel | WigExporter',
    'description': 'Beziehen Sie synthetische Perücken und Haarteile großhandelsweise, einschließlich Pferdeschwänze, Pony, Bangs und Clip-in-Topper mit Faser.',
    'intro': 'Definieren Sie eine kommerziell klare synthetische Range über Trägerin, Silhouette, Länge und Alltags- oder Modenutzung.'
  },
  'fr': {
    'title': 'Perruques et accessoires capillaires synthétiques en gros',
    'metaTitle': 'Perruques et accessoires capillaires synthétiques en gros | WigExporter',
    'description': 'Sourcez des perruques et accessoires capillaires synthétiques en gros, y compris queues de cheval, franges, bangs et toppers clip-in en fibre.',
    'intro': 'Définissez une gamme synthétique commercialement claire en précisant la porteuse, la silhouette, la longueur et l’usage quotidien ou mode.'
  },
}

for lang in ['es', 'de', 'fr']:
    prods = json.load(open(os.path.join(ROOT, 'content', lang, 'products.json')))
    tmap = {p['code']: p['title'] for p in prods}
    out_prod = []
    for p in dsw:
        np = dict(p)
        np['name'] = tmap.get(p['code'], p['name'])
        out_prod.append(np)
    cat = dict(src_cat)
    cat['products'] = out_prod
    json.dump(cat, open(os.path.join(ROOT, 'content', lang, 'product-catalog.json'), 'w'), ensure_ascii=False, indent=2)

    c = dict(syn)
    t = TR[lang]
    c['title'], c['metaTitle'], c['description'], c['intro'] = t['title'], t['metaTitle'], t['description'], t['intro']
    site = {'collections': [c], 'articles': []}
    json.dump(site, open(os.path.join(ROOT, 'content', lang, 'site-content.json'), 'w'), ensure_ascii=False, indent=2)
    print(lang, 'content+catalog wrote', len(out_prod))
