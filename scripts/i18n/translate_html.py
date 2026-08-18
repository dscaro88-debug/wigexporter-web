#!/usr/bin/env python3
"""
translate_html.py — translate visible English text in standalone HTML pages
(synthetic-* product pages, colour-chart, etc.) into es/de/fr using DeepSeek.

Approach:
 - Parse HTML with html.parser, collect visible text nodes (skip <script>,
   <style>, and JSON-LD <script type=application/ld+json>).
 - Only nodes that are predominantly English (>=3 english words, not pure
   brand/code/url) are queued for translation.
 - Batch-translate via DeepSeek (DEEPSEEK_API_KEY env), then rewrite only the
   text nodes, preserving all tags/attributes/entities.

Usage:
  python translate_html.py --dry-run            # count english nodes per lang
  python translate_html.py --translate          # build /tmp/html_trans_map.json
  python translate_html.py --apply              # rewrite es/de/fr html files
  python translate_html.py --all
"""
import os, re, sys, json, argparse, html
from collections import OrderedDict
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TARGETS = ["es", "de", "fr"]
LANGS = {"es": "Spanish", "de": "German", "fr": "French"}

# pages present in root dir (English source) that also have es/de/fr copies
ROOT_PAGES = ["synthetic-wigs-hairpieces.html", "hair-colour-chart-custom-packaging.html"]
# plus all synthetic-*.html
def root_html_pages():
    out = list(ROOT_PAGES)
    root = ROOT
    for f in os.listdir(root):
        if f.startswith("synthetic-") and f.endswith(".html"):
            out.append(f)
    return out

SKIP_TAGS = {"script", "style"}
class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.nodes = []          # list of (text, is_cdata_context)
        self._skip = 0
        self._stack = []
    def handle_starttag(self, tag, attrs):
        self._stack.append(tag)
        if tag in SKIP_TAGS:
            self._skip += 1
        # JSON-LD is script -> already skipped; fine
    def handle_endtag(self, tag):
        if self._stack and self._stack[-1] == tag:
            self._stack.pop()
        if tag in SKIP_TAGS and self._skip > 0:
            self._skip -= 1
    def handle_data(self, data):
        if self._skip > 0:
            return
        self.nodes.append(data)

def visible_texts(path):
    p = TextExtractor()
    p.feed(open(path, encoding="utf-8").read())
    return [t for t in p.nodes if t.strip()]

WORD = re.compile(r'[A-Za-z]{3,}')
def is_english_node(s):
    s = s.strip()
    if not s: return False
    if not re.search(r'[A-Za-z]', s): return False
    # skip urls, codes, brand-only
    if re.search(r'(https?://|/|\.html|\.jpg|\.png|#)', s): return False
    if re.fullmatch(r'[A-Z0-9 &·-]+', s): return False
    words = WORD.findall(s)
    if len(words) < 3: return False
    return True

def collect_needed():
    """Return {lang: OrderedDict(en_text -> set(occurrences))} across all pages."""
    needed = {l: OrderedDict() for l in TARGETS}
    for page in root_html_pages():
        en_path = os.path.join(ROOT, page)
        if not os.path.exists(en_path): continue
        en_texts = [t for t in visible_texts(en_path) if is_english_node(t)]
        for lang in TARGETS:
            lp = os.path.join(ROOT, lang, page)
            if not os.path.exists(lp): continue
            lp_texts = set(t for t in visible_texts(lp) if is_english_node(t))
            for t in en_texts:
                if t in lp_texts:  # still raw English in locale copy
                    needed[lang].setdefault(t, 0)
                    needed[lang][t] += 1
    return needed

def dry_run():
    needed = collect_needed()
    for lang in TARGETS:
        print(f"{lang}: {len(needed[lang])} unique English text nodes across standalone HTML pages")

# ---- DeepSeek batch translate (shared signature with sync_translate) ----
def batch_translate(items, key):
    import urllib.request
    url = "https://api.deepseek.com/v1/chat/completions"
    glossary = ("Keep brand 'DS HAIR', 'OEM', 'B2B', 'Remy', 'MOQ', 'Colour Chart 2' as-is. "
                "Use professional hair-extension industry wording. "
                'Return compact JSON array (same order) of {"es":"...","de":"...","fr":"..."}. No commentary.')
    out = {}
    B = 40
    for i in range(0, len(items), B):
        batch = items[i:i+B]
        sys_p = "You are a translator for a B2B hair-extensions website. " + glossary
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
            content = re.sub(r'^```(?:json)?\s*|\s*```$','',content.strip())
            parsed = json.loads(content)
            for idx, en in enumerate(batch):
                if idx < len(parsed):
                    rec = parsed[idx]
                    out[en] = {l: rec.get(l,"") for l in TARGETS}
        except Exception as e:
            print(f"  batch {i} failed: {e}")
            break
        print(f"  translated {min(i+B,len(items))}/{len(items)}")
    return out

def translate():
    key = os.environ.get("DEEPSEEK_API_KEY")
    if not key:
        print("ERROR: set DEEPSEEK_API_KEY first"); sys.exit(1)
    needed = collect_needed()
    items = []
    for l in TARGETS: items += list(needed[l].keys())
    items = list(OrderedDict.fromkeys(items))
    print(f"Total unique English HTML nodes to translate: {len(items)}")
    m = batch_translate(items, key)
    json.dump(m, open("/tmp/html_trans_map.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
    print("Saved /tmp/html_trans_map.json with", len(m), "entries")

def apply_map():
    if not os.path.exists("/tmp/html_trans_map.json"):
        print("ERROR: run --translate first"); sys.exit(1)
    m = json.load(open("/tmp/html_trans_map.json", encoding="utf-8"))
    for lang in TARGETS:
        for page in root_html_pages():
            lp = os.path.join(ROOT, lang, page)
            if not os.path.exists(lp): continue
            raw = open(lp, encoding="utf-8").read()
            # build replacement map for this lang: original node -> translated
            repl = {}
            for en, rec in m.items():
                tr = rec.get(lang,"")
                if tr and tr != en:
                    repl[en] = tr
            # replace text nodes safely via parser
            out = []
            p = _Replacer(repl, out)
            p.feed(raw)
            new = "".join(out)
            open(lp, "w", encoding="utf-8").write(new)
            print(f"  {lang}/{page}: applied {len(repl)} replacements")

class _Replacer(HTMLParser):
    def __init__(self, repl, out):
        super().__init__(convert_charrefs=True)
        self.repl = repl; self.out = out
    def handle_starttag(self, tag, attrs):
        self.out.append(self.get_starttag_text())
    def handle_endtag(self, tag):
        self.out.append(f"</{tag}>")
    def handle_startendtag(self, tag, attrs):
        self.out.append(self.get_starttag_text())
    def handle_data(self, data):
        d = data
        if d in self.repl:
            d = self.repl[d]
        self.out.append(d)
    def handle_entityref(self, name):
        self.out.append(f"&{name};")
    def handle_charref(self, name):
        self.out.append(f"&#{name};")

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
