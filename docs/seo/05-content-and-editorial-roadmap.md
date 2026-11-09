# Content and editorial roadmap

Date: 9 November 2026
Section: `/resources`
Published: 3 articles
Planned: 10 ideas, not written

## Editorial position

The resources section exists to answer real operating questions and to earn links, not to fill a
calendar. Publishing cadence is capacity-led: a realistic target is one substantial guide per month,
or two when a cluster has a clear gap. A thin article published to hit a quota is worse than no
article.

Every article must:

- Be tied to a real product workflow or a real operating problem the company understands.
- State its limits, including when a product is unreleased.
- Avoid invented statistics, survey results, customer stories and quotations.
- Name the local context where it matters: Ghana, NaCCA, mobile money, susu, electrical retail.
- Link to one product and to at least one other article.
- Be reviewed by someone who has done the work described.

## Published

| # | Slug | Title | Cluster | Purpose |
| --- | --- | --- | --- | --- |
| 1 | `scheme-of-learning-to-weekly-lesson-plans` | How to turn a scheme of learning into weekly lesson plans | Education | Informational entry for SchemeKnit |
| 2 | `mobile-money-business-recordkeeping` | Recordkeeping for a mobile money business: a daily routine that works | Financial operations | Informational entry for MaaCash |
| 3 | `electrical-shop-stock-control` | Stock control for electrical shops: item codes, counts and accountability | Retail operations | Informational entry for TillProof |

Each is 9–10 minutes of reading, structured with headings, lists and numbered steps, and carries
Article and BreadcrumbList structured data.

## Planned ideas

These are candidates, not commitments. Write one only when the answer is specific and the author can
support it.

| # | Working title | Cluster | Target product | Intent | Notes |
| --- | --- | --- | --- | --- | --- |
| 4 | Writing a lesson plan objective a supervisor can check | Education | SchemeKnit | Informational | Complements article 1; focuses on observable verbs and evidence |
| 5 | What to do when a scheme of learning does not match the timetable | Education | SchemeKnit | Informational | Handles the real planning failure described in article 1 |
| 6 | A mobile money opening and closing checklist for agents | Financial operations | MaaCash | Informational + lead magnet candidate | Could be a printable checklist; no email gate |
| 7 | Susu collection records: what a collector should hand over each day | Financial operations | MaaCash | Informational | Deepens the susu section of article 2 |
| 8 | Float, cash and profit are three different numbers | Financial operations | MaaCash | Informational | Explains a common accounting confusion without giving financial advice |
| 9 | Why supplier item names break your stock record | Retail operations | TillProof | Informational | Expands the item-code section of article 3 |
| 10 | A cycle count schedule for a small electrical shop | Retail operations | TillProof | Informational | Practical schedule with roles and cut-off rules |
| 11 | Choosing software for a Ghanaian small business: questions to ask first | Cross-cluster | Company | Commercial investigation | Supports `/services`; must stay vendor-neutral and honest |
| 12 | What "in development" means for a software product | Cross-cluster | TillProof | Trust | Explains the company's product-stage policy; short |
| 13 | Data protection basics for a small business handling customer records | Cross-cluster | MaaCash | Informational | Must state it is not legal advice and cite the Act by name only if verified |

Ideas 4–7 and 9–10 strengthen the three existing clusters. Ideas 8, 11, 12 and 13 are broader and
should wait until the first clusters show impressions.

## Article structure

```text
Title                specific, no clickbait
Description          one sentence, what the reader will be able to do
Category             Teaching practice | Business operations | Retail operations
Product              exactly one related product
Published / updated  ISO dates
Reading time         computed from length, not guessed
Blocks               paragraph | heading | subheading | list | steps | note
```

The `note` block is reserved for the product disclosure: what the product does, what it does not do,
and whether it is released.

## Review checklist before publishing

- [ ] Every claim can be supported by the author's own experience or a named public source.
- [ ] No invented numbers, clients, testimonials or rankings.
- [ ] Product status is accurate.
- [ ] The article answers the question in the first two paragraphs.
- [ ] Headings are statements, not keywords stacked together.
- [ ] Links: one product, one related article, one path back to `/resources`.
- [ ] Title under ~60 characters where possible; description under ~155.
- [ ] Spelling consistent with the rest of the site (British English).
- [ ] Added to `RESOURCES`; sitemap and `/resources` pick it up automatically.
- [ ] Article JSON-LD dates match the record.

## Distribution

Publishing is not distribution. For each article:

1. Link it from the home page resources block and the resources index.
2. Link it from the related product page where it answers an objection.
3. Share it once on the company's verified profiles with a plain description.
4. Send it to one relevant practitioner or community and ask for a correction, not a share.
5. Add it to any email signature or proposal where it is genuinely relevant.

No purchased traffic, no link exchanges, no auto-generated social posts.

## Retirement policy

If an article becomes wrong, update it and change the `updated` date. If it becomes irrelevant,
remove it from `RESOURCES` and add a redirect to the closest replacement. Do not leave stale content
indexed with an old product claim.
