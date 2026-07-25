# DS HAIR product code system

This file defines the shared product-code and asset-folder rules for
`wigexporter.com` and Alibaba International. Product codes are stable internal
references; colour, length and texture choices are specifications, not new
styles.

## Standardized vs differentiated (货号规则总纲)

- **Standardized products do NOT get a product SKU.** These are "method /
  construction" families with no style variation — e.g. the six Human Hair
  Extension application methods (Clip-in, Tape-in, K-tip, Genius Weft, Machine
  Weft, Hand-tied Weft). Each method is a category/method page, not a SKU.
  Colour, length, weight and texture are specifications selected on that page.
- **Differentiated products DO get a SKU.** Products with a fixed style/model
  where different models differ in form, construction or use (wigs, toppers,
  hairpieces, ponytails, and — pending confirmation — salon supplies) carry a
  three-digit model number.
- Rule of thumb: if two items differ only by colour/length/weight, they are the
  same product with different specs. If they differ in style/construction, they
  are different products and get different codes.

The `DS-EXT-*` codes below are **method / organization identifiers** (used for
navigation and asset folders) and are NOT customer-facing product SKUs.

## Human hair extensions

Extensions are a STANDARDIZED product family. Use one method code per
construction method; do not add a sequential style number. These codes are
method/organization identifiers only — the method page itself carries no
product SKU.

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

> Status: **pending confirmation.** Salon supplies may be treated as
> differentiated (keep SKUs below) or as standardized accessories (drop SKUs,
> use type/method pages like the extension family). Awaiting owner decision.

Salon-supply codes (if treated as differentiated) distinguish single products
from kits:

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
