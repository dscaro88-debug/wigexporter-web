#!/usr/bin/env bash
# run_all.sh — fully localize wigexporter-web into es/de/fr, build, verify, commit.
# Requires: DEEPSEEK_API_KEY exported in the environment.
#
# Usage (on the Mac, in the repo root):
#   export DEEPSEEK_API_KEY=sk-xxxxxxxx
#   bash scripts/i18n/run_all.sh
#
# In the WorkBuddy sandbox the API is reachable but git push is blocked, so the
# agent runs the same steps and you only do the final `git push`.
set -e
cd "$(dirname "$0")/../.."

echo "== 1/6 translate content/*.json (products/catalog/site-content) =="
python3 scripts/i18n/sync_translate.py --all

echo "== 2/6 build site from translated content =="
npm run build

echo "== 3/6 localize standalone HTML pages (chrome + asset absolutize) =="
python3 scripts/localize_pages.py

echo "== 4/6 translate standalone HTML body text (synthetic-*, colour-chart) =="
python3 scripts/i18n/translate_html.py --all

echo "== 5/6 verify zero broken local links =="
python3 scripts/i18n/scan_links.py

echo "== 6/6 commit =="
git add -A
git commit -q -m "fix(i18n): full es/de/fr localization of product content, FAQs, knowledge, standalone pages"
echo "DONE. Now: git push"
