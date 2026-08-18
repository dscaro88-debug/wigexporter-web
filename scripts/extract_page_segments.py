#!/usr/bin/env python3
"""Extract translatable segments from hand-written standalone HTML pages.

Usage: python3 scripts/extract_page_segments.py page1.html page2.html ...
Prints a deduplicated, frequency-sorted list of segments so translations can be
written against the exact source strings.
"""
import re
import sys
from collections import Counter

# Text inside these tags must never be translated.
SKIP_TAGS = ("script", "style", "svg", "video", "source", "noscript")

ATTRS = ("alt", "aria-label", "placeholder", "title", "content", "value")

# Attributes named `content` only matter on these meta names/properties.
META_TRANSLATABLE = (
    "description",
    "og:title",
    "og:description",
    "og:image:alt",
    "twitter:title",
    "twitter:description",
)


def strip_skipped(html: str) -> str:
    for tag in SKIP_TAGS:
        html = re.sub(
            rf"<{tag}\b[^>]*>.*?</{tag}>", f"<{tag}></{tag}>", html, flags=re.S | re.I
        )
    return html


def is_translatable(text: str) -> bool:
    t = text.strip()
    if not t:
        return False
    # Pure punctuation / numbers / symbols / entities.
    if not re.search(r"[A-Za-z]{2}", t):
        return False
    # Bare URLs, emails, phone numbers, file paths.
    if re.fullmatch(r"[\w.+-]+@[\w.-]+", t):
        return False
    if t.startswith(("http://", "https://", "mailto:", "tel:", "/", "#")):
        return False
    if re.fullmatch(r"[\d\s+()·—–-]+", t):
        return False
    return True


def extract(html: str) -> list:
    segs = []
    cleaned = strip_skipped(html)

    # 1) Text nodes between tags.
    for raw in re.split(r"<[^>]+>", cleaned):
        # A text node may contain several sentences; keep it whole so
        # translations stay natural, but trim surrounding whitespace.
        if is_translatable(raw):
            segs.append(raw.strip())

    # 2) Translatable attributes.
    for m in re.finditer(r"<([a-zA-Z0-9-]+)\b([^>]*)>", cleaned):
        tag, attrs = m.group(1).lower(), m.group(2)
        if tag in SKIP_TAGS:
            continue
        pairs = dict(re.findall(r'([a-zA-Z-]+)\s*=\s*"([^"]*)"', attrs))
        for attr in ATTRS:
            if attr not in pairs:
                continue
            val = pairs[attr]
            if attr == "content":
                key = (pairs.get("name") or pairs.get("property") or "").lower()
                if key not in META_TRANSLATABLE:
                    continue
            if attr == "value" and tag != "option":
                continue
            if is_translatable(val):
                segs.append(val.strip())

    # 3) <title>
    for m in re.finditer(r"<title>(.*?)</title>", html, flags=re.S | re.I):
        if is_translatable(m.group(1)):
            segs.append(m.group(1).strip())

    return segs


def main():
    files = sys.argv[1:]
    if not files:
        print("usage: extract_page_segments.py <html files...>")
        return 1
    counter = Counter()
    per_file = {}
    for f in files:
        with open(f, encoding="utf-8") as fh:
            segs = extract(fh.read())
        per_file[f] = len(segs)
        counter.update(segs)

    words = sum(len(s.split()) for s in counter)
    print(f"# files: {len(files)}  segments(total): {sum(per_file.values())}  unique: {len(counter)}  unique words: {words}")
    for f, n in per_file.items():
        print(f"#   {n:4d}  {f}")
    print("# ---- unique segments (freq desc, then length desc) ----")
    for seg, n in sorted(counter.items(), key=lambda kv: (-kv[1], -len(kv[0]))):
        print(f"{n}\t{seg}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
