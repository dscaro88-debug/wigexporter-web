# Staged replacement plan

## Current state

- The new site exists only in `wigexporter-redesign/`.
- The live WordPress site at `wigexporter.com` has not been changed.
- The inquiry form is a validated prototype and does not transmit data.

## Recommended release sequence

### 1. Private staging

Publish this directory to a private preview URL or protected staging subdomain. Review desktop and mobile with the real business owner before attaching the production domain.

Acceptance gates:

- Brand and product imagery approved.
- All product categories reflect what can actually be supplied.
- MOQ, sample fee, lead time, material, colour and certification language confirmed in writing.
- Factory video and historical claims approved for public use.
- No competitor name, image, testimonial or copied paragraph remains.

### 2. Connect inquiry delivery

The forms currently do not send messages. Before launch, connect them to one approved destination and test end to end:

- `caro@wigexporter.com`, or
- an approved CRM / form endpoint.

Required evidence:

- One harmless test inquiry appears in the destination.
- The sender receives a clear success state.
- Spam protection and rate limiting are active.
- No secret key is exposed in frontend files.

### 3. Production cutover

Recommended reversible cutover:

1. Back up the current WordPress site and database.
2. Keep the old site available on a temporary backup URL.
3. Publish the approved static build or recreate it as the production WordPress theme.
4. Preserve useful existing URLs with redirects.
5. Recheck canonical URLs, sitemap, robots, analytics and contact delivery.
6. Only then point `wigexporter.com` to the approved production deployment.

## Do not publish yet

- Unverified prices, MOQ, lead times or certification claims.
- Product files containing competitor brands or uncertain ownership.
- A form that only appears to submit but does not deliver an inquiry.
