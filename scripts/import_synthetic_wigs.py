#!/usr/bin/env python3
"""
Import the 23 synthetic full-wig products (货号 DSW-2501..DSW-2523) into the
wigexporter.com static site.

What it does (end-to-end, reproducible):
  1. Copies each 货号's REAL product images from the incoming folder into
     assets/products/synthetic-wigs-hairpieces/synthetic-wigs/<code>/ with the
     site's naming convention (<code>-NN.ext).
  2. Appends 23 product records to content/products.json.
     - colourChart is intentionally OMITTED so the 31-shade HUMAN-HAIR colour
       chart is NEVER shown on synthetic wig pages (per business rule).
  3. Appends 23 entries to content/product-catalog.json with
     category "Synthetic Wigs" so the category page auto-creates that section.

Run from anywhere:
  python3 scripts/import_synthetic_wigs.py
"""
import os
import re
import json
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = "/Users/kkkk/Library/Mobile Documents/com~apple~CloudDocs/Desktop/dshairbeauty/wigexporter/incoming-products/Synthetic Hair/Synthetic wigs"
ASSET_DIR = os.path.join(ROOT, "assets", "products", "synthetic-wigs-hairpieces", "synthetic-wigs")
PRODUCTS_JSON = os.path.join(ROOT, "content", "products.json")
CATALOG_JSON = os.path.join(ROOT, "content", "product-catalog.json")

CODES = [f"DSW-{n}" for n in range(2501, 2504)] + [f"DSW-{n}" for n in range(2504, 2524)]

IMG_EXT = (".png", ".jpg", ".jpeg", ".webp")

# ---- Chinese -> English shade translation (greedy longest match) -------------
ZH_MAP = {
    "黑茶棕": "Black-Tea Brown", "黑棕色": "Black-Brown", "黑棕": "Black-Brown",
    "棕色渐变金": "Brown-to-Gold Ombré", "棕色渐变白金": "Brown-to-Platinum Ombré",
    "棕色渐变灰": "Brown-to-Grey Ombré", "棕色渐变金色": "Brown-to-Gold Ombré",
    "棕色渐变灰色": "Brown-to-Grey Ombré", "棕色挑染粉": "Brown Highlight with Pink",
    "黑棕色挑染": "Black-Brown Highlight", "黑色挑染蓝": "Black Highlight with Blue",
    "棕色挑染": "Brown Highlight", "深棕渐变米黄": "Dark Brown-to-Beige Ombré",
    "黑色渐变棕": "Black-to-Brown Ombré", "黑色渐变灰": "Black-to-Grey Ombré",
    "棕金渐变": "Brown-Gold Ombré", "烟粉渐变": "Smoke Pink Ombré",
    "渐变浅棕": "Light Brown Ombré", "渐变白金色": "Platinum Ombré",
    "渐变白金": "Platinum Ombré", "渐变金色": "Gold Ombré", "渐变粉色": "Pink Ombré",
    "渐变粉": "Pink Ombré", "渐变棕": "Brown Ombré", "渐变灰": "Grey Ombré",
    "渐变金": "Gold Ombré", "渐变": "Ombré", "挑染": "Highlight",
    "黑茶": "Black-Tea", "亚麻茶棕": "Linen Tea Brown", "亚麻茶": "Linen Tea",
    "蜜茶金色": "Honey Tea Gold", "蜜茶棕": "Honey Tea Brown", "蜜茶": "Honey Tea",
    "冰金亚麻": "Ice Gold Linen", "冰金": "Ice Gold", "烤棕": "Roast Brown",
    "摩卡棕": "Mocha Brown", "摩卡": "Mocha", "暗沙金": "Dark Sand Gold",
    "枫叶橙": "Maple Orange", "枫叶": "Maple", "元气橙": "Vitality Orange",
    "欧珀橙": "Opal Orange", "橘红色": "Orange-Red", "橘红": "Orange-Red",
    "酒红色挑染": "Wine Red Highlight", "酒红": "Wine Red", "酒红色": "Wine Red",
    "幽兰紫": "Orchid Purple", "紫": "Purple", "冰川蓝": "Glacier Blue", "蓝": "Blue",
    "奶奶灰棕": "Silver Grey-Brown", "奶奶灰": "Silver Grey", "灰棕": "Grey-Brown",
    "冷棕": "Cool Brown", "浅棕": "Light Brown", "深棕": "Dark Brown",
    "灰": "Grey", "棕": "Brown", "黑": "Black", "金": "Gold", "白金": "Platinum",
    "铂金": "Platinum", "粉": "Pink", "橙": "Orange", "茶": "Tea", "亚麻": "Linen",
    "八字刘海": "", "网": "", "帽": "", "头套": "", "背面": "", "打毛款": "Teased",
    "CAP": "", "NET": "", "LACE": "", "LACE TOP": "",
}
ZH_KEYS = sorted(ZH_MAP.keys(), key=len, reverse=True)


def natural_key(s):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]


def collect_sources(code):
    folder = os.path.join(SRC, code)
    if not os.path.isdir(folder):
        folder = os.path.join(SRC, code.replace("-", ""))
    if os.path.isdir(folder):
        files = [os.path.join(folder, f) for f in os.listdir(folder)]
    else:
        cand = os.path.join(SRC, code + ".png")
        files = [cand] if os.path.exists(cand) else []
    all_files = sorted(files, key=lambda x: natural_key(os.path.basename(x)))
    imgs = [f for f in all_files if f.lower().endswith(IMG_EXT)]
    return imgs, all_files


def sort_key(code, f):
    base = os.path.splitext(os.path.basename(f))[0]
    prefix = 0 if base == code else 1
    return (prefix,) + tuple(natural_key(base))


def shade_label(fname, code):
    base = os.path.splitext(os.path.basename(fname))[0]
    for pref in (code, code.replace("-", "")):
        if base.upper().startswith(pref.upper()):
            base = base[len(pref):]
    base = re.sub(r"\b\d+\s*(cm|in|inch|″)\b", "", base, flags=re.I)
    base = base.replace("--", " ").replace("-", " ").strip()
    if not base:
        return None
    if base.startswith("#"):
        return base
    out = base
    for k in ZH_KEYS:
        if k in out:
            out = out.replace(k, (ZH_MAP[k] + " ") if ZH_MAP[k] else " ")
    out = re.sub(r"\s+", " ", out).strip(" -_")
    out = re.sub(r"^[0-9 ]+$|^[-_ ]+$", "", out).strip()
    return out or None


def is_valid_shade(s):
    if s.startswith("#"):
        return True
    if re.search(r"[一-鿿]", s):
        return False
    if re.search(r"微信|O1CN|cib|!!|\d{4,}", s):
        return False
    return True


def extract_shades(code, imgs):
    seen, out = set(), []
    for f in imgs:
        s = shade_label(f, code)
        if s and is_valid_shade(s) and s not in seen:
            seen.add(s)
            out.append(s)
    return out


def style_hint(code, imgs):
    blob = " ".join(os.path.basename(f) for f in imgs).lower()
    tags = []
    if re.search(r"蕾丝|lace|1[36][ ×x×_]?6", blob):
        tags.append("Lace Front")
    if re.search(r"波波头|bobo", blob):
        tags.append("Bob")
    if re.search(r"大波浪|波浪|卷", blob):
        tags.append("Wavy")
    if re.search(r"直", blob) and "wavy" not in [t.lower() for t in tags]:
        tags.append("Straight")
    if re.search(r"八字刘海", blob):
        tags.append("with Side-Swept Bangs")
    if re.search(r"短", blob):
        tags.append("Short")
    elif re.search(r"长", blob):
        tags.append("Long")
    return " ".join(tags)


def copy_assets(code, imgs):
    dest = os.path.join(ASSET_DIR, code.lower())
    os.makedirs(dest, exist_ok=True)
    copied = []
    for i, src in enumerate(sorted(imgs, key=lambda x: sort_key(code, x)), 1):
        ext = os.path.splitext(src)[1].lower()
        if ext == ".jpeg":
            ext = ".jpg"
        name = f"{code.lower()}-{i:02d}{ext}"
        shutil.copy(src, os.path.join(dest, name))
        copied.append(name)
    return copied


def main():
    products = json.load(open(PRODUCTS_JSON, encoding="utf-8"))
    catalog = json.load(open(CATALOG_JSON, encoding="utf-8"))
    existing_codes = {p.get("code") for p in products}

    new_products, new_catalog, injections = [], [], []
    summary = []

    for code in CODES:
        if code in existing_codes:
            print(f"  skip {code} (already in products.json)")
            continue
        imgs, all_files = collect_sources(code)
        if not imgs:
            print(f"  !! {code}: no images found, skipping")
            continue
        copied = copy_assets(code, imgs)
        shades = extract_shades(code, imgs)
        style = style_hint(code, all_files)
        slug = f"synthetic-wig-{code.lower()}"
        title = f"Synthetic {style} Wig {code}".replace("  ", " ").strip()
        if style == "":
            title = f"Synthetic Full Wig {code}"

        images = [
            {"src": f"assets/products/synthetic-wigs-hairpieces/synthetic-wigs/{code.lower()}/{n}",
             "alt": f"{title} — reference image {i+1}"}
            for i, n in enumerate(copied)
        ]
        colour_options = (
            [{"value": s, "status": "reference"} for s in shades[:12]]
            + [{"value": "Custom shade from physical reference", "status": "request"}]
        )
        colour_note = (
            "Synthetic fibre colours are matched from the physical references shown in the gallery. "
            "The 31-shade human-hair Colour Chart 2 is NOT applied to synthetic wig lines."
        )
        display_colours = ", ".join(shades[:10]) if shades else "Multiple fashion shades (see gallery)"

        product = {
            "slug": slug,
            "code": code,
            "brand": "DS HAIR",
            "category": "Synthetic Wigs & Hairpieces",
            "categoryUrl": "synthetic-wigs-hairpieces.html#synthetic-wigs",
            "title": title,
            "metaTitle": f"Wholesale {title} | DS HAIR",
            "description": (
                f"Source the {title.lower()} — a ready-to-wear synthetic fibre full wig for fashion, "
                f"daily wear and wholesale private-label ranges. Review construction, colour directions and OEM options."
            ),
            "summary": (
                f"A {style.lower() if style else 'full'} synthetic wig reference for professional buyers developing "
                f"ready-to-wear and private-label wig ranges. The photographed reference shows the display colour and "
                f"cap finish; fibre, cap construction, length, density and commercial terms are confirmed against the "
                f"approved sample and written specification."
            ),
            "images": images,
            "confirmedFacts": [
                ["Product format", "Full synthetic wig (ready-to-wear cap)"],
                ["Fibre family", "Synthetic hair"],
                ["Display colour directions", display_colours],
                ["Reference images", f"{len(copied)} approved images"],
                ["Sales channel", "B2B wholesale / OEM enquiry"],
            ],
            "configuration": [
                {
                    "key": "length",
                    "label": "Length direction",
                    "options": [
                        {"value": "As photographed reference", "status": "reference"},
                        {"value": "Buyer-defined", "status": "request"},
                    ],
                    "note": "The photographed reference shows the display length. Confirm the production measurement method and tolerance on the sample.",
                },
                {
                    "key": "style",
                    "label": "Style direction",
                    "options": [
                        {"value": style or "As photographed", "status": "reference"},
                        {"value": "Buyer-defined", "status": "request"},
                    ],
                    "note": "Style, texture and parting are confirmed against the approved sample.",
                },
                {
                    "key": "colour",
                    "label": "Colour direction",
                    "options": colour_options,
                    "note": colour_note,
                },
                {
                    "key": "cap",
                    "label": "Cap construction",
                    "options": [
                        {"value": "As photographed (full cap with adjustable straps)", "status": "reference"},
                        {"value": "Buyer-defined", "status": "request"},
                    ],
                    "note": "Confirm cap base, adjusters and comfort band on the sample.",
                },
            ],
            "buyerChecks": [
                ["Fibre & heat resistance", "Confirm fibre type and heat-tolerant temperature before any styling or colouring guidance."],
                ["Cap fit & adjusters", "Check cap circumference, straps and comfort against the target wearer profile."],
                ["Colour match", "Compare display shades to a physical reference; synthetic shades are matched separately from the human-hair Colour Chart 2."],
                ["Density & finish", "Review hair density, parting and root treatment for the intended market."],
                ["Packaging & labelling", "Confirm retail or bulk packaging and private-label requirements."],
            ],
            "customisation": [
                "Private-label branding and custom packaging development.",
                "Colour direction reviewed from physical references.",
                "Length, density and cap base adjusted to the agreed specification.",
                "Bulk and mixed-style assortment planning for wholesale programmes.",
            ],
            "knowledge": [
                ["Synthetic vs human hair", "Synthetic wigs hold style and need no restyling, but use lower heat and separate colour matching from human-hair charts."],
                ["Ready-to-wear appeal", "Full-cap synthetic wigs suit fashion, daily wear and volume buyers wanting instant results."],
                ["Colour systems differ", "Synthetic fibre colours are matched from physical samples; the 31-shade human-hair Colour Chart 2 is not used for synthetic lines."],
            ],
            "unconfirmed": [
                "Exact fibre specification (e.g. high-temperature fibre grade)",
                "Cap base construction and adjuster type",
                "Length, density and weight per size",
                "MOQ, price and lead time",
                "Certification and care labelling for the destination market",
            ],
            "faqs": [
                ["Can synthetic wig colours use the 31-shade human-hair colour chart?",
                 "No. The 31-shade Colour Chart 2 is for human-hair products. Synthetic wig colours are matched from the physical references shown on each product page."],
                ["Are these available for private label?",
                 "Yes. Colour, length, density, cap base and packaging can be reviewed for OEM and private-label programmes; commercial terms are confirmed in writing."],
                ["How do we start a wholesale enquiry?",
                 "Send the target market, product code, preferred style, colour direction and quantity range. We will identify the next information needed for sampling or quotation."],
            ],
        }
        # NOTE: colourChart is intentionally omitted -> no 31-shade human-hair chart.

        cat = {
            "code": code,
            "legacyCode": "",
            "name": title,
            "section": "Synthetic Hair",
            "group": "Synthetic Wigs & Hairpieces",
            "category": "Synthetic Wigs",
            "assetFolder": f"assets/products/synthetic-wigs-hairpieces/synthetic-wigs/{code.lower()}",
            "approvedImageCount": len(copied),
            "imageStatus": "approved_set" if len(copied) >= 3 else "limited",
            "specificationStatus": "partially_verified_reference",
            "publicationStatus": "draft_ready",
            "notes": "Synthetic fibre full wig. Synthetic colours matched from physical references; human-hair Colour Chart 2 not applied.",
        }

        products.append(product)
        catalog["products"].append(cat)
        injections.append((code, slug, title))
        summary.append((code, len(copied), len(shades), title))

    json.dump(products, open(PRODUCTS_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    json.dump(catalog, open(CATALOG_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    print(f"\nImported {len(summary)} synthetic wig products.")
    for code, n_img, n_shades, title in summary:
        print(f"  {code}: {n_img} imgs, {n_shades} shades -> {title}")
    print("\n--- generator injections (code -> page) ---")
    for code, slug, _ in injections:
        print(f"    '{code}': '{slug}.html',")
    print("\n--- RELATED_META injections ---")
    for code, slug, title in injections:
        short = title.replace(f" {code}", "")
        print(f"  '{slug}': {{ eyebrow: 'SYNTHETIC WIG', title: '{short}' }},")


if __name__ == "__main__":
    main()
