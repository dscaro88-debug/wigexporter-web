import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const LOCALES = ['es', 'de', 'fr'];
const START = '/*__LOCALIZED_PAGES_START__*/';
const END = '/*__LOCALIZED_PAGES_END__*/';

// A page counts as "localized" only when it exists in EVERY locale.
// That guarantees the language switcher never points at a 404.
const perLocale = LOCALES.map((l) => {
  const dir = path.join(root, l);
  if (!fs.existsSync(dir)) return new Set();
  return new Set(fs.readdirSync(dir).filter((f) => f.endsWith('.html')));
});

const complete = [...(perLocale[0] || new Set())]
  .filter((f) => perLocale.every((s) => s.has(f)))
  .sort();

const map = {};
complete.forEach((f) => {
  map[f] = true;
});

const scriptPath = path.join(root, 'script.js');
let src = fs.readFileSync(scriptPath, 'utf8');
const startIdx = src.indexOf(START);
const endIdx = src.indexOf(END);
if (startIdx === -1 || endIdx === -1) {
  console.error('generate-locale-manifest: markers not found in script.js — aborting.');
  process.exit(1);
}

const before = src.slice(0, startIdx + START.length);
const after = src.slice(endIdx);
const next = before + JSON.stringify(map) + after;

if (next !== src) {
  fs.writeFileSync(scriptPath, next);
  console.log(`Locale manifest updated: ${complete.length} page(s) localized in all of ${LOCALES.join('/')}.`);
} else {
  console.log(`Locale manifest unchanged: ${complete.length} page(s).`);
}

// Report per-locale gaps so partial translations are visible during build.
LOCALES.forEach((l, i) => {
  const missing = complete.filter((f) => !perLocale[i].has(f));
  const extra = [...perLocale[i]].filter((f) => !map[f]).sort();
  if (extra.length) {
    console.log(`  ${l}: ${extra.length} page(s) not yet in all locales (excluded from switcher): ${extra.slice(0, 6).join(', ')}${extra.length > 6 ? ' …' : ''}`);
  }
  if (missing.length) console.log(`  ${l}: MISSING ${missing.join(', ')}`);
});
