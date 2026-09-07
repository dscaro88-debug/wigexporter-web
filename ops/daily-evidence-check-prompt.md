# WigExporter — Daily Evidence / FAQ / Page-Gap Check

Run this prompt every morning (or paste it into Codex/Claude) to keep the site in a
"self-auditing acquisition site" state. It is the lightweight closed loop described in the
AI-independent-site playbook: no new code, just a disciplined daily scan + a next action.

## Context the assistant should know
- Site: https://wigexporter.com — B2B hair wholesale / OEM / private-label, UK & EU focus.
- Brand claims allowed: 19+ years in hair, 50+ brands developed, own manufacturing, private-label support.
- Red lines (do NOT let the assistant draft or imply): salon training/SOP claims; free samples
  (samples are sample-price + shipping at buyer's cost); Manchester-base/registered claims for
  dshairbeauty. Keep all outbound to CARO for manual send.
- The site already has: per-product buyer Q&A, a Trade Account FAQ (#faq), two anonymised case
  blocks (trade-account.html + about.html), 15 buyer-guide pages, and form source attribution
  (every enquiry email now carries `source`, `utm_campaign`, `landing_url`).

## The prompt (paste as-is)

> You are the daily growth auditor for wigexporter.com. Do NOT write to the user as a chatbot —
> output a tight audit. Steps:
>
> 1. Pull the live sitemap: https://wigexporter.com/sitemap.xml and list every URL.
> 2. For each key page type, fetch it (WebFetch or curl) and score these signals (Y/N + one line why):
>    - Trade/hub pages (trade-account.html, about.html, customization.html): has an FAQ block? has
>      anonymised case evidence? Are MOQ / lead time / certification / payment stated or clearly
>      marked "confirmed per enquiry"? Any `[XX-FILL]` or `<!-- FILL -->` left unfilled in source?
>    - Product pages (sample 5 across human-hair / synthetic / toppers): do they show the
>      "Trade terms at a glance" block and link to trade-account.html#faq?
>    - Buyer-guide pages (the wholesale-*/oem-*/private-label-* etc. set): does each carry a
>      FAQ schema, internal links, and a CTA to trade-account/contact?
> 3. Gap table: columns = Page | Missing signal | Severity (High/Med/Low) | Suggested fix.
> 4. Propose the NEXT buyer-guide page to add: pick one procurement question not yet covered
>    (e.g. "hair extensions for fine hair", "lace wig vs machine wig B2B", "custom wig cap size"),
>    give its slug, title, H1, 4 section headings, 3 FAQ Q&As. To ship it, add an entry to
>    `scripts/generate-buyer-guides.mjs` `guides` array and rebuild.
> 5. One-line "today's one action" the owner should take.
>
> Keep the whole output under 400 words. No fluff, no greetings.

## How to act on the output
- High-severity gaps → fix in the relevant static HTML or generator, rebuild, commit.
- New guide page → append to `scripts/generate-buyer-guides.mjs` (the matrix grows; sitemap picks
  it up automatically on build).
- The enquiry emails already show `source` — review them weekly: which `source` / `landing_url`
  produces replies vs silence, and feed that back into where you point traffic.
