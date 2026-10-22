# FAIR DEAL PROPERTIES LTD
## Website - Single-Document Build

**Version 6.0 | 14 October 2026**
Prepared for Fair Deal Properties Ltd by Stephen Alaekwe & Co

---

## What this is

`fair-deal-properties-standalone.html` is the complete website as **one file**, with
JavaScript page switching, exactly as version 5 worked. Eighteen pages, every form,
every interaction, the Inspection Hub, the marketplace filters and the cookie consent
notice - all of it in a single document you can open by double-clicking it.

Nothing is linked externally. The stylesheet, the script, both logos, the favicon and
all nine illustrations are inlined, so the file works from a local disk, an email
attachment, a USB stick or any web host, with no `assets` folder beside it.

| | |
|---|---|
| File | `fair-deal-properties-standalone.html` |
| Size | 1,800 KB |
| Pages | 18, switched by `showPage()` |
| External requests | One, for the Google Fonts stylesheet. Remove that `<link>` and the file is fully offline |
| Verified | 18 of 18 routes, 0 JavaScript errors, 0 failed requests, 0 broken images |

---

## It carries every correction made since version 5

This is not the version 5 file. It is version 6 content in the version 5 shape.

| Correction | Why |
|---|---|
| The thirty-day data subject response is described as **our commitment**, not a statutory deadline | NDPA 2023 s.34 sets no number of days. The old copy cited s.38, which is Data portability |
| **Cross-border transfer disclosed** in the Privacy Notice - AWS, Ireland, eu-west-1, and the s.41(1)(a) basis | NDPA 2023 s.27 |
| Grievance form corrected to **Standard Notice to Address Grievance, Schedule 9** | It said Schedule 2 and used a name the Directive does not use |
| Three stray closing tags repaired - one in About, two in Terms | They pushed the About call-to-action band outside every page container, so it rendered on **all eighteen pages at once** |
| Literal `’` showing to visitors in the Privacy Notice | An escaping defect that had survived five releases |
| Font families corrected in the document head | Cormorant Garamond, DM Sans, DM Mono - matching what the stylesheet actually asks for |
| Malformed inline `url()` in the marketplace hero | The browser requested a broken image URL on every page load |

---

## Visual parity, measured

Every page in this file renders at **exactly** the same height as the eighteen-document
build, which in turn matches the version you supplied. Measured at 1440px:

| Page | Height | Page | Height |
|---|---|---|---|
| Home | 9,387 | Inspections | 2,338 |
| About | 4,734 | Technology | 4,511 |
| Services | 3,165 | Platform | 7,469 |
| Marketplace | 11,887 | Privacy Notice | 9,303 |
| Diaspora | 3,337 | Cookie Notice | 3,400 |
| How It Works | 3,157 | Data Rights | 2,627 |
| Developers | 2,539 | Terms | 10,221 |
| Insights | 1,923 | FAQ | 2,006 |
| Financing | 2,197 | Contact | 1,618 |

The stylesheet was compared rule by rule against the version you supplied: **422 shared
selectors, one deliberate difference** (`.page{display:block}`, which exists only in the
multi-page build and is absent here, as it must be).

---

## What it is good for, and what it is not

**Good for:** sending to a client or partner as an attachment. Showing the site with no
hosting. Archiving a dated snapshot of exactly what the site said on a given day -
useful when a representation may later be disputed. A fallback if hosting lapses.

**Not good for search.** This is the limitation that produced the eighteen-document
build. A crawler reaching this file sees **one URL, one title, one meta description** for
the whole firm. Every page of content is in the markup, but none of it is separately
addressable, rankable or linkable. The structured data here covers the organization, the
website and the FAQ; it cannot carry eighteen distinct `WebPage` entities because there
is only one page.

**Not good for forms.** The forms render a success message client-side and transmit
nothing - including the data subject request form and the grievance form. Use the
Next.js build for anything that must actually receive a submission.

---

## Which build to use

| Need | Build |
|---|---|
| Search visibility, shareable page links | `fair-deal-properties-html-v6.zip` - eighteen documents |
| Working forms, a real database, retention enforcement | `fair-deal-properties-next.zip` - Next.js and TypeScript |
| One file to attach, archive or demonstrate | **This file** |

All three are generated from the same corrected source and are visually identical.

---

**Prepared for Fair Deal Properties Ltd by Stephen Alaekwe & Co**
Version 6.0 · 14 October 2026 · [PRINCIPAL SIGN-OFF REQUIRED]
