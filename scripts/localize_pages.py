#!/usr/bin/env python3
"""Localize hand-written standalone HTML pages into /es /de /fr.

Strategy: whole-node replacement. A text node or attribute value is replaced only
when its *entire* trimmed content matches a dictionary key. This makes the pass
idempotent and immune to substring corruption (e.g. "DS HAIR" can never damage an
already-translated headline that happens to contain it).

Also rewrites, per locale:
  - <html lang>
  - canonical + og:url        -> /<lang>/ prefixed
  - og:locale
  - hreflang alternates (+ x-default)
  - root-absolute asset/link paths (page lives one directory deeper)
  - a language switcher in the header

Usage:
  python3 scripts/localize_pages.py                 # all configured pages, all locales
  python3 scripts/localize_pages.py index.html      # a subset
"""
import os
import re
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from i18n.pages_dict import TRANSLATIONS, DO_NOT_TRANSLATE, PAGES  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCALES = ["es", "de", "fr"]
ALL_LANGS = ["en"] + LOCALES
OG_LOCALE = {"en": "en_GB", "es": "es_ES", "de": "de_DE", "fr": "fr_FR"}
LANG_LABEL = {"en": "EN", "es": "ES", "de": "DE", "fr": "FR"}

SKIP_TAGS = ("script", "style", "svg", "video", "source", "noscript")
ATTRS = ("alt", "aria-label", "placeholder", "title")
META_TRANSLATABLE = (
    "description",
    "og:title",
    "og:description",
    "og:image:alt",
    "twitter:title",
    "twitter:description",
)

# Root-relative files that must be loaded from / when the page sits in /<lang>/.
ABS_TARGETS = (
    "styles.css",
    "homepage-layout.css",
    "product.css",
    "script.js",
    "product-config.js",
    "favicon.svg",
)

missing_counter = Counter()


def protect_skipped(html: str):
    """Replace <script>/<style>/<svg>/<video> blocks with placeholders."""
    store = []

    def _sub(m):
        store.append(m.group(0))
        return f"\x00BLOCK{len(store) - 1}\x00"

    for tag in SKIP_TAGS:
        html = re.sub(rf"<{tag}\b[^>]*>.*?</{tag}>", _sub, html, flags=re.S | re.I)
    return html, store


def restore_skipped(html: str, store) -> str:
    for i, block in enumerate(store):
        html = html.replace(f"\x00BLOCK{i}\x00", block)
    return html


def tr(text: str, lang: str, page: str):
    """Return translation for a whole trimmed segment, or None to keep English."""
    if text in DO_NOT_TRANSLATE:
        return None
    entry = TRANSLATIONS.get(text)
    if not entry:
        if re.search(r"[A-Za-z]{2}", text):
            missing_counter[(page, text)] += 1
        return None
    return entry.get(lang) or None


def translate_text_nodes(html: str, lang: str, page: str) -> str:
    out = []
    pos = 0
    for m in re.finditer(r"<[^>]+>", html):
        chunk = html[pos:m.start()]
        if chunk.strip():
            lead = chunk[: len(chunk) - len(chunk.lstrip())]
            trail = chunk[len(chunk.rstrip()):]
            core = chunk.strip()
            new = tr(core, lang, page)
            out.append(lead + (new if new else core) + trail)
        else:
            out.append(chunk)
        out.append(m.group(0))
        pos = m.end()
    tail = html[pos:]
    if tail.strip():
        new = tr(tail.strip(), lang, page)
        out.append(tail.replace(tail.strip(), new) if new else tail)
    else:
        out.append(tail)
    return "".join(out)


def translate_attributes(html: str, lang: str, page: str) -> str:
    def fix_tag(m):
        tag_name = m.group(1).lower()
        inner = m.group(0)
        if tag_name in SKIP_TAGS:
            return inner
        attrs = dict(re.findall(r'([a-zA-Z-]+)\s*=\s*"([^"]*)"', m.group(2)))

        def replace_attr(attr, value):
            new = tr(value.strip(), lang, page)
            return new if new else None

        for attr in ATTRS:
            if attr in attrs:
                new = replace_attr(attr, attrs[attr])
                if new:
                    inner = inner.replace(f'{attr}="{attrs[attr]}"', f'{attr}="{new}"', 1)
        # <meta content="..."> only for known translatable meta keys
        if tag_name == "meta" and "content" in attrs:
            key = (attrs.get("name") or attrs.get("property") or "").lower()
            if key in META_TRANSLATABLE:
                new = replace_attr("content", attrs["content"])
                if new:
                    inner = inner.replace(f'content="{attrs["content"]}"', f'content="{new}"', 1)
        # <option>Text</option> values
        if tag_name == "option" and "value" in attrs and attrs["value"].strip():
            new = replace_attr("value", attrs["value"])
            if new:
                inner = inner.replace(f'value="{attrs["value"]}"', f'value="{new}"', 1)
        return inner

    return re.sub(r"<([a-zA-Z0-9-]+)\b([^>]*)>", fix_tag, html)


def translate_title(html: str, lang: str, page: str) -> str:
    def _sub(m):
        new = tr(m.group(1).strip(), lang, page)
        return f"<title>{new}</title>" if new else m.group(0)

    return re.sub(r"<title>(.*?)</title>", _sub, html, flags=re.S | re.I)


def hreflang_block(page: str) -> str:
    canon = "" if page == "index.html" else page
    lines = []
    for l in ALL_LANGS:
        href = f"https://wigexporter.com/{canon}" if l == "en" else f"https://wigexporter.com/{l}/{canon}"
        lines.append(f'  <link rel="alternate" hreflang="{l}" href="{href}">')
    lines.append(f'  <link rel="alternate" hreflang="x-default" href="https://wigexporter.com/{canon}">')
    return "\n".join(lines)


def lang_switch(page: str, current: str) -> str:
    parts = []
    for l in ALL_LANGS:
        href = f"/{page}" if l == "en" else f"/{l}/{page}"
        cls = "lang-opt current" if l == current else "lang-opt"
        aria = ' aria-current="true"' if l == current else ""
        parts.append(f'<a class="{cls}" href="{href}" hreflang="{l}" lang="{l}"{aria}>{LANG_LABEL[l]}</a>')
    return '<div class="lang-switch" aria-label="Language">' + "".join(parts) + "</div>"


LANG_SWITCH_CSS = """  <style>
  .lang-switch{display:inline-flex;gap:.15rem;align-items:center;margin-left:.6rem}
  .lang-switch .lang-opt{display:inline-block;padding:.18rem .4rem;font-size:.68rem;letter-spacing:.06em;
    font-weight:600;color:#111;text-decoration:none;border:1px solid rgba(17,17,17,.18);border-radius:2px;line-height:1}
  .lang-switch .lang-opt:hover{border-color:#111}
  .lang-switch .lang-opt.current{background:#111;color:#fff;border-color:#111}
  </style>"""


def absolutize(html: str) -> str:
    """Make root-relative references load from / since the page moved into /<lang>/."""
    for target in ABS_TARGETS:
        html = html.replace(f'href="{target}', f'href="/{target}')
        html = html.replace(f'src="{target}', f'src="/{target}')
    html = html.replace('src="assets/', 'src="/assets/')
    html = html.replace('href="assets/', 'href="/assets/')
    html = html.replace('srcset="assets/', 'srcset="/assets/')
    html = html.replace('content="assets/', 'content="/assets/')
    html = html.replace('url(assets/', 'url(/assets/')
    return html


def localize(page: str, lang: str) -> str:
    src_path = os.path.join(ROOT, page)
    with open(src_path, encoding="utf-8") as fh:
        html = fh.read()

    html, store = protect_skipped(html)
    html = translate_text_nodes(html, lang, page)
    html = translate_attributes(html, lang, page)
    html = restore_skipped(html, store)
    html = translate_title(html, lang, page)

    # head/meta rewrites
    html = html.replace('<html lang="en">', f'<html lang="{lang}">', 1)
    html = re.sub(
        r'<meta property="og:locale" content="[^"]*">',
        f'<meta property="og:locale" content="{OG_LOCALE[lang]}">',
        html,
    )
    canon_path = "" if page == "index.html" else page
    html = re.sub(
        r'<link rel="canonical" href="[^"]*">',
        f'<link rel="canonical" href="https://wigexporter.com/{lang}/{canon_path}">',
        html,
    )
    html = re.sub(
        r'<meta property="og:url" content="[^"]*">',
        f'<meta property="og:url" content="https://wigexporter.com/{lang}/{canon_path}">',
        html,
    )

    html = absolutize(html)

    # hreflang + switcher styles
    html = html.replace("</head>", hreflang_block(page) + "\n" + LANG_SWITCH_CSS + "\n</head>", 1)

    # language switcher inside header tools (fall back to end of header)
    switch = lang_switch(page, lang)
    if '<div class="header-tools">' in html:
        html = html.replace("</div>\n  </header>", f"  {switch}\n    </div>\n  </header>", 1)
        if switch not in html:  # header-tools closed differently
            html = html.replace('<div class="header-tools">', f'<div class="header-tools">{switch}', 1)
    elif "</header>" in html:
        html = html.replace("</header>", f"  {switch}\n  </header>", 1)
    return html


def main():
    pages = sys.argv[1:] or PAGES
    written = 0
    for lang in LOCALES:
        out_dir = os.path.join(ROOT, lang)
        os.makedirs(out_dir, exist_ok=True)
        for page in pages:
            if not os.path.exists(os.path.join(ROOT, page)):
                print(f"  ! missing source: {page}")
                continue
            html = localize(page, lang)
            with open(os.path.join(out_dir, page), "w", encoding="utf-8") as fh:
                fh.write(html)
            written += 1
        print(f"-- {lang} -- wrote {len(pages)} standalone page(s)")

    if missing_counter:
        by_page = {}
        for (page, text), _ in missing_counter.items():
            by_page.setdefault(page, []).append(text)
        total = sum(len(v) for v in by_page.values())
        print(f"\n!! untranslated segments: {total} (kept in English)")
        for page, items in sorted(by_page.items()):
            print(f"   {page}: {len(items)}")
            for text in items[:8]:
                print(f"      - {text[:95]}")
            if len(items) > 8:
                print(f"      … +{len(items) - 8} more")
    else:
        print("\n✓ full segment coverage — no untranslated text")
    print(f"\nTotal files written: {written}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
