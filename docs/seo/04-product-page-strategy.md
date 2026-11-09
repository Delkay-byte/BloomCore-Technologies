# Product page SEO strategy

Date: 9 November 2026
Pages: `/products/schemeknit`, `/products/maacash`, `/products/tillproof`.
Company identity: BloomCore Technologies. Products: SchemeKnit, MaaCash, TillProof.

## Shared page contract

Every product page must answer, in this order:

1. What is it, in one sentence a buyer would repeat?
2. Who is it for?
3. What does it actually do today?
4. What does it deliberately not do?
5. What does it cost or how is it obtained?
6. What happens when I enquire?

The page must not publish a price, customer count, rating, review, certification or release date that
does not exist. Where a fact is unknown, the page says so in plain language.

Shared elements now implemented:

- Breadcrumb trail and `BreadcrumbList` schema.
- Product-specific title and description.
- `SoftwareApplication` schema where the product is available.
- Visible FAQ block mirrored by `FAQPage` schema.
- Product-view event and tracked enquiry/outbound clicks.
- Links to the other two products.
- A direct enquiry path using the company email address.

## SchemeKnit

**Search intent:** a teacher or school leader wants to reduce the time between a scheme of learning
and a usable lesson plan.

**Positioning:** a planning tool, not a curriculum publisher. It extracts a scheme, shows the
structure for review, generates plans around indicators, allows editing, and exports.

**Primary queries:** lesson plan generator Ghana; scheme of learning to lesson plan; NaCCA lesson
planning software.

**Content decisions:**

- Name the curriculum structure (strands, sub-strands, content standards, indicators) because that
  is the vocabulary teachers search with.
- State explicitly that SchemeKnit is not endorsed by NaCCA or the Ghana Education Service.
- Explain what happens when extraction is wrong: the structure is shown for review before
  generation.
- Pricing question answered honestly: credits and packages exist inside the application; the page
  does not quote a price because packages change.

**FAQ set:** curriculum source, editing, extraction errors, export, pricing.

**Conversion path:** view product → read workflow → open SchemeKnit (outbound) or send an enquiry.
Outbound clicks are tracked without personal data.

## MaaCash

**Search intent:** an owner or manager of a mobile money, susu or multi-location operation needs
records, roles and reconciliation they can trust.

**Positioning:** an operations platform. Not a bank, not a mobile money provider, not a
deposit-taking institution, does not hold customer funds.

**Primary queries:** mobile money management software Ghana; susu collection software; multi-branch
mobile money records.

**Content decisions:**

- Lead with the operating problem: cash and float, staff accountability across locations.
- Explain role scoping: administrative, manager, collector, operations.
- Do not claim a specific provider integration. Say integration depends on deployment.
- Answer the "is this a bank?" question in the FAQ, because it is the first trust objection.

**FAQ set:** regulatory status, multiple locations, provider integration, record visibility, susu
support, onboarding.

**Conversion path:** view product → understand scope → send a short description of locations, roles
and current process.

## TillProof

**Search intent:** an electrical retailer is looking for stock, pricing and cash control, often
before any product is purchased.

**Positioning:** in development. No public application, no release date. The page describes intended
capability only.

**Primary queries:** electrical shop inventory software Ghana; stock control electrical shop;
electrical retail stock accountability.

**Content decisions:**

- Keep the in-development status visible near the top, not buried.
- Do not emit `SoftwareApplication` schema.
- Do not publish pricing, availability dates or a waitlist count.
- Use the FAQ to answer "can I use it now?" first.
- Direct the reader to the stock-control guide, which is useful immediately.

**FAQ set:** availability, target businesses, whether features are live, how to register interest.

**Conversion path:** read the operational guide → understand intended scope → register interest by
email. The guide carries the informational traffic while the product is unfinished.

## Status labels

| Product | Label | Schema | Purchase intent |
| --- | --- | --- | --- |
| SchemeKnit | Available | `SoftwareApplication` | Allowed |
| MaaCash | Available | `SoftwareApplication` | Allowed |
| TillProof | In development | Breadcrumb + FAQ only | Not targeted |

## What not to do

- Do not add review stars, aggregate ratings or `Offer` schema without real, verifiable data.
- Do not create a thin page for every feature. One strong product page beats ten fragments.
- Do not duplicate the resource article inside the product page; link to it.
- Do not use "revolutionary", "cutting-edge", "world-class" or similar unverifiable claims.
- Do not hide the in-development status of TillProof to improve conversion. It would convert worse
  and damage trust.

## Measurement

Per product:

- Product page views.
- Enquiry CTA clicks by location (hero, footer, guide).
- Outbound launch clicks (SchemeKnit, MaaCash).
- FAQ open rate is not tracked; adding it would require extra client code and is not necessary.

Events are defined in `07-analytics-and-conversion-tracking.md`.
