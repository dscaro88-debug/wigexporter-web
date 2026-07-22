# DS HAIR product code system

This file defines the shared product-code and asset-folder rules for
`wigexporter.com` and Alibaba International. Product codes are stable internal
references; colour, length and texture choices are specifications, not new
styles.

## Human hair extensions

Extensions use one family code per construction method. Do not add a sequential
style number.

| Product family | Family code |
| --- | --- |
| Clip-in | `DS-EXT-CI` |
| Tape-in | `DS-EXT-TI` |
| K-tip | `DS-EXT-KT` |
| Genius Weft | `DS-EXT-GW` |
| Machine Weft | `DS-EXT-MW` |
| Hand-tied Weft | `DS-EXT-HTW` |

When an order-line reference is needed, append confirmed variant tokens to the
family code:

`FAMILY-COLOUR-LENGTH-TEXTURE-PACK`

Example: `DS-EXT-TI-1B-22-ST-50G`.

Variant tokens must come from the confirmed quotation or production
specification. They must not be invented from a photograph.

## Style products

Wigs, toppers, ponytails and other products with a defined construction or
silhouette use a three-digit sequential model number.

| Product type | Code pattern |
| --- | --- |
| Human hair wig | `DS-WIG-HH-001` |
| Lace wig | `DS-WIG-LW-001` |
| Human hair topper | `DS-TOP-HH-001` |
| Synthetic wig | `DS-WIG-SY-001` |
| Synthetic ponytail | `DS-PON-SY-001` |
| Synthetic hairpiece | `DS-HPC-SY-001` |
| Synthetic bangs / fringes | `DS-BNG-SY-001` |
| Synthetic clip-in topper | `DS-TOP-SY-CI-001` |

If the fibre material is not confirmed, use a neutral review code such as
`DS-PON-001` and keep the asset in `_review/material-to-confirm`. Move it into a
selling category only after material verification.

## Salon supplies

Salon-supply codes distinguish single products from kits:

- Single product: `DS-SAL-S-001`
- Kit: `DS-SAL-K-001`

## Image gate

Images copied into the organised product folders have passed both a technical
and visual review. The following are excluded:

- unreadable or visibly low-resolution files;
- exact duplicates when one clean source is enough;
- customer logos, supplier watermarks or third-party branding;
- promotional collages with embedded sales copy;
- images that do not clearly show the product;
- files marked “do not upload”.

An organised folder does not automatically mean a product is ready to publish.
The catalogue manifest separately records image completeness, specification
verification and publication status.
