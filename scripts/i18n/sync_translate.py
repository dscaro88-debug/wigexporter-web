#!/usr/bin/env python3
"""
sync_translate.py — fully localize content/*.json (products + site) per language.

Strategy: align EN source tree against each locale tree by PATH.
 - A leaf needs translation when: it's a display string in EN, and the locale
   leaf still equals the EN value (i.e. never translated).
 - Leaves already different from EN (already localized) are preserved untouched.
This avoids value-based mismatches and keeps existing translations safe.

Modes:
  --dry-run          diagnose: count untranslated unique strings per language
  --translate        call DeepSeek (needs DEEPSEEK_API_KEY) -> /tmp/trans_map.json
  --apply            rewrite content/<lang>/*.json using /tmp/trans_map.json
  --all              translate then apply

Glossary terms (kept as-is across languages unless a clear localized form exists):
  DS HAIR, OEM, B2B, Remy, weft, keratin, clip-in, tape-in, nano ring, K-tip,
  Genius Weft, Colour Chart 2, MOQ
"""
import json, os, re, sys, argparse
from collections import OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONTENT = os.path.join(ROOT, "content")
TARGETS = ["es", "de", "fr"]
EN_FILES = ["products.json", "product-catalog.json", "site-content.json"]

SKIP = re.compile(r'(/|\.html|\.jpg|\.png|#)|^[A-Z0-9-]{4,}$|^[a-z-]+$')
def is_display(s):
    if not isinstance(s, str): return False
    if not re.search(r'[A-Za-z]', s): return False
    if SKIP.search(s): return False
    if len(s.split()) > 40: return False
    return True

def load(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)

def collect_leaves_paths(obj, path="", out=None):
    """out: list of (path, value) for every string leaf."""
    if out is None: out = []
    if isinstance(obj, str):
        out.append((path, obj))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            collect_leaves_paths(v, f"{path}[{i}]", out)
    elif isinstance(obj, dict):
        for k, v in obj.items():
            collect_leaves_paths(v, f"{path}.{k}" if path else k, out)
    return out

def align_paths(en_obj, lang_obj, lang, needed):
    """Walk EN; where lang leaf == EN leaf and EN is display -> mark needed."""
    en_leaves = collect_leaves_paths(en_obj)
    lang_leaves = {p: v for p, v in collect_leaves_paths(lang_obj)}
    for p, ev in en_leaves:
        if not is_display(ev):
            continue
        lv = lang_leaves.get(p)
        if lv is None:
            continue
        if lv == ev:  # still raw English -> needs translation
            needed[lang].setdefault(ev, set()).add(p)

def dry_run():
    for lang in TARGETS:
        needed = OrderedDict()
        for fn in EN_FILES:
            ep = os.path.join(CONTENT, fn)
            lp = os.path.join(CONTENT, lang, fn)
            if not os.path.exists(ep) or not os.path.exists(lp):
                continue
            # reuse align_paths by passing a per-lang container keyed by lang
            tmp = {lang: needed}
            align_paths(load(ep), load(lp), lang, tmp)
        print(f"{lang}: {len(needed)} unique strings still English across {', '.join(EN_FILES)}")

def translate():
    import urllib.request
    key = os.environ.get("DEEPSEEK_API_KEY")
    if not key:
        print("ERROR: set DEEPSEEK_API_KEY first (export DEEPSEEK_API_KEY=sk-...)")
        sys.exit(1)
    # gather all needed strings across langs (same EN set; translate once per lang)
    needed = {l: OrderedDict() for l in TARGETS}
    for lang in TARGETS:
        for fn in EN_FILES:
            ep = os.path.join(CONTENT, fn); lp = os.path.join(CONTENT, lang, fn)
            if os.path.exists(ep) and os.path.exists(lp):
                align_paths(load(ep), load(lp), lang, needed)
    trans_map = {}  # en -> {es,de,fr}
    url = "https://api.deepseek.com/v1/chat/completions"
    lang_names = {"es": "Spanish", "de": "German", "fr": "French"}
    glossary = ("Keep brand 'DS HAIR', 'OEM', 'B2B', 'Remy', 'MOQ', 'Colour Chart 2' as-is. "
                "Use professional hair-extension industry wording. "
                "Translate ONLY the JSON value text, return compact JSON: "
                '{"es":"...","de":"...","fr":"..."}. No commentary.')
    items = list(needed[TARGETS[0]].keys())
    print(f"Total unique EN strings to translate: {len(items)}")
    # batch of 40
    B = 40
    for i in range(0, len(items), B):
        batch = items[i:i+B]
        sys_p = ("You are a translator for a B2B hair-extensions website. " + glossary)
        user_p = "Translate each string to Spanish, German, French.\n" + json.dumps(batch, ensure_ascii=False)
        body = json.dumps({"model":"deepseek-chat","messages":[
            {"role":"system","content":sys_p},
            {"role":"user","content":user_p}],"temperature":0.2}).encode()
        req = urllib.request.Request(url, data=body, headers={
            "Authorization": f"Bearer {key}", "Content-Type":"application/json"})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                resp = json.loads(r.read().decode())
            content = resp["choices"][0]["message"]["content"]
            # strip code fences if any
            content = re.sub(r'^```(?:json)?\s*|\s*```$','',content.strip())
            parsed = json.loads(content)
            for idx, en in enumerate(batch):
                if idx < len(parsed):
                    rec = parsed[idx]
                    trans_map[en] = {l: rec.get(l,"") for l in TARGETS}
        except Exception as e:
            print(f"  batch {i} failed: {e}; saving progress")
            break
        print(f"  translated {min(i+B,len(items))}/{len(items)}")
    # save
    with open("/tmp/trans_map.json","w",encoding="utf-8") as f:
        json.dump(trans_map, f, ensure_ascii=False, indent=1)
    print("Saved /tmp/trans_map.json with", len(trans_map), "entries")

def apply_map():
    if not os.path.exists("/tmp/trans_map.json"):
        print("ERROR: /tmp/trans_map.json missing; run --translate first")
        sys.exit(1)
    trans_map = json.load(open("/tmp/trans_map.json", encoding="utf-8"))
    for lang in TARGETS:
        for fn in EN_FILES:
            ep = os.path.join(CONTENT, fn); lp = os.path.join(CONTENT, lang, fn)
            if not (os.path.exists(ep) and os.path.exists(lp)): continue
            en_obj = load(ep); lang_obj = load(lp)
            replaced = [0]
            def walk(e, l):
                if isinstance(e, str):
                    if isinstance(l, str) and e == l and l in trans_map and trans_map[l].get(lang):
                        replaced[0]+=1
                        return trans_map[l][lang]
                    return l
                elif isinstance(e, list) and isinstance(l, list):
                    return [walk(e[i], l[i]) if i < len(l) else e[i] for i in range(len(e))]
                elif isinstance(e, dict) and isinstance(l, dict):
                    return {k: walk(e[k], l.get(k, e[k])) for k in e}
                return l
            new_lang = walk(en_obj, lang_obj)
            with open(lp, "w", encoding="utf-8") as f:
                json.dump(new_lang, f, ensure_ascii=False, indent=2)
            print(f"  {lang}/{fn}: replaced {replaced[0]} strings")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--translate", action="store_true")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--all", action="store_true")
    a = ap.parse_args()
    if a.dry_run or not (a.translate or a.apply or a.all):
        dry_run()
    if a.translate or a.all:
        translate()
    if a.apply or a.all:
        apply_map()
