#!/usr/bin/env python3
"""Filesystem link checker: for every HTML file, resolve same-origin relative
href/src/srcset references on disk and report any target file that is missing.
Catches the locale-subdir 404 class of bugs (relative CSS/JS/favicon)."""
import os, re, sys
from collections import defaultdict

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
ROOT = os.path.abspath(ROOT)
ASSET_RE = re.compile(r'(?:href|src|srcset)="([^"]+)"')
SKIP_SCHEMES = ("http", "mailto:", "tel:", "data:", "//")

def clean(ref: str) -> str:
    ref = ref.strip()
    if not ref:
        return None
    if any(ref.startswith(s) for s in SKIP_SCHEMES):
        return None
    # strip fragment
    ref = ref.split("#", 1)[0]
    # keep query for asset versioning check (file may have ?v= but on disk no query)
    return ref

broken = defaultdict(list)
checked = 0
for dirpath, _, files in os.walk(ROOT):
    if "/.git" in dirpath or dirpath.endswith("/.git"):
        continue
    for fn in files:
        if not fn.endswith(".html"):
            continue
        page = os.path.join(dirpath, fn)
        try:
            html = open(page, encoding="utf-8", errors="ignore").read()
        except Exception:
            continue
        page_dir = os.path.dirname(page)
        for m in ASSET_RE.finditer(html):
            ref = clean(m.group(1))
            if ref is None:
                continue
            # split query for on-disk existence (assets use ?v=)
            base = ref.split("?", 1)[0]
            if base.startswith("/"):
                target = os.path.normpath(os.path.join(ROOT, base.lstrip("/")))
            else:
                target = os.path.normpath(os.path.join(page_dir, base))
            # only flag if it looks like a real local resource (has extension)
            if "." not in os.path.basename(base):
                continue
            checked += 1
            if not os.path.exists(target):
                rel = os.path.relpath(page, ROOT)
                broken[ref].append(f"{rel} -> {os.path.relpath(target, ROOT)}")

print(f"Checked {checked} local resource references.")
if not broken:
    print("RESULT: 0 broken links ✓")
else:
    total = sum(len(v) for v in broken.values())
    print(f"RESULT: {total} broken references across {len(broken)} distinct targets:")
    for ref in sorted(broken):
        print(f"\n  [{ref}]  ({len(broken[ref])} refs)")
        for r in broken[ref][:6]:
            print(f"      {r}")
        if len(broken[ref]) > 6:
            print(f"      … +{len(broken[ref]) - 6} more")
