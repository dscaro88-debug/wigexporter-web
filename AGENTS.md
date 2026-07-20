# WigExporter project notes

- This directory is the source of truth. Do not edit the preview mirror directly.
- The persistent preview service serves `/Users/kkkk/Library/Application Support/DSHair/WigExporterPreview` on `http://localhost:4199/` because macOS background services cannot reliably read the iCloud Desktop directory.
- After changing website files, refresh the mirror with `./START_WIGEXPORTER_PREVIEW.command --no-open` and verify the affected URL returns HTTP 200.
- The user can double-click `START_WIGEXPORTER_PREVIEW.command` to sync the latest source, restart the service, and open the product-page preview.
