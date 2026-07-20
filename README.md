# WigExporter B2B website

Inquiry-led B2B website for the staged replacement of `wigexporter.com`. It is not a consumer ecommerce store.

## Content publishing

Core collection pages and buyer guides are generated from:

```text
content/site-content.json
```

After editing the content data, run:

```sh
npm run build
```

The generator creates five commercial collection pages and the buyer-guide articles while preserving shared SEO metadata, structured data, navigation and conversion sections.

## Preview

Run any static HTTP server from this directory, for example:

```sh
python3 -m http.server 4199
```

Then open `http://127.0.0.1:4199/`.

## Boundary

- This prototype does not change the live WordPress website.
- The RFQ forms validate locally but do not transmit messages. A live form endpoint must be connected and tested before launch.
- MOQ, price, certification and lead-time claims are deliberately omitted until verified.
- Product and factory media are copied from the user's existing workspace or current WigExporter site.
