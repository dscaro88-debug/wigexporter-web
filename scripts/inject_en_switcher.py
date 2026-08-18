#!/usr/bin/env python3
"""Inject hreflang + language switcher into English hand-written HTML pages.

This only touches the EN source files (index.html, products.html, etc.).
It does NOT translate anything; it just adds the UI for switching to es/de/fr.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCALES = ["es", "de", "fr"]
ALL_LANGS = ["en"] + LOCALES
LANG_LABEL = {"en": "EN", "es": "ES", "de": "DE", "fr": "FR"}
PAGES = [
    "index.html",
    "products.html",
    "trade-account.html",
    "contact.html",
    "about.html",
    "sample.html",
    "free-color-kits.html",
    "blog.html",
]


def hreflang_block(page: str) -> str:
    canon = "" if page == "index.html" else page
    lines = []
    for l in ALL_LANGS:
        href = f"https://wigexporter.com/{canon}" if l == "en" else f"https://wigexporter.com/{l}/{canon}"
        lines.append(f'  <link rel="alternate" hreflang="{l}" href="{href}">')
    lines.append(f'  <link rel="alternate" hreflang="x-default" href="https://wigexporter.com/{canon}">')
    return "\n".join(lines)


def lang_switch(page: str) -> str:
    parts = []
    for l in ALL_LANGS:
        href = f"/{page}" if l == "en" else f"/{l}/{page}"
        cls = "lang-opt current" if l == "en" else "lang-opt"
        aria = ' aria-current="true"' if l == "en" else ""
        parts.append(f'<a class="{cls}" href="{href}" hreflang="{l}" lang="{l}"{aria}>{LANG_LABEL[l]}</a>')
    return '<div class="lang-switch" aria-label="Language">' + "".join(parts) + "</div>"


LANG_SWITCH_CSS = """  <style>
  .lang-switch{display:inline-flex;gap:.15rem;align-items:center;margin-left:.6rem}
  .lang-switch .lang-opt{display:inline-block;padding:.18rem .4rem;font-size:.68rem;letter-spacing:.06em;
    font-weight:600;color:#111;text-decoration:none;border:1px solid rgba(17,17,17,.18);border-radius:2px;line-height:1}
  .lang-switch .lang-opt:hover{border-color:#111}
  .lang-switch .lang-opt.current{background:#111;color:#fff;border-color:#111}
  </style>"""


def inject(page: str) -> bool:
    path = os.path.join(ROOT, page)
    with open(path, encoding="utf-8") as fh:
        html = fh.read()

    changed = False

    # hreflang block (avoid duplicate)
    marker = 'hreflang="en"'
    if marker not in html:
        html = html.replace("</head>", hreflang_block(page) + "\n" + LANG_SWITCH_CSS + "\n</head>", 1)
        changed = True

    # language switcher (avoid duplicate)
    if 'class="lang-switch"' not in html:
        switch = lang_switch(page)
        if '<div class="header-tools">' in html:
            # inject right after the opening tag so it sits beside TRADE ACCOUNT / REQUEST QUOTE
            html = html.replace('<div class="header-tools">', f'<div class="header-tools">{switch}', 1)
            changed = True
        elif "</header>" in html:
            html = html.replace("</header>", f"  {switch}\n  </header>", 1)
            changed = True

    if changed:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(html)
    return changed


def main():
    pages = sys.argv[1:] or PAGES
    for page in pages:
        if not os.path.exists(os.path.join(ROOT, page)):
            print(f"  ! missing: {page}")
            continue
        changed = inject(page)
        print(f"  {'updated' if changed else 'unchanged'}  {page}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
