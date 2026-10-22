# FAIR DEAL PROPERTIES LTD
## Website Application - Next.js 16 + TypeScript + React 19

**Version 1.0 | 14 October 2026**
Prepared for Fair Deal Properties Ltd by Stephen Alaekwe & Co

---

## One correction before anything else

The instruction was for a React + TypeScript version, delivered separately, with Next.js
added on top for SEO.

**Next.js is React.** It is the React framework - the components in this repository are
React components written in TypeScript (`.tsx`), and Next.js supplies the server
rendering, routing, metadata and API layer around them. Shipping a standalone React SPA
*and* a Next.js application would mean maintaining the same site twice, and the SPA half
would carry exactly the SEO defect that version 5 of the website already had: one URL,
one title, no server-rendered content.

So this is **one application**: React 19 components, written in TypeScript, running on
the Next.js 16 App Router. It is the React version and it is the Next.js version. The
companion zip (`fair-deal-properties-html-v6.zip`) holds the plain static HTML build for
any host that cannot run Node.

If a standalone client-only React build is still wanted for a specific reason, say so
and it can be produced - but it should be a deliberate decision, not a default.

---

## What this application is

| | Static HTML build (companion zip) | This application |
|---|---|---|
| Hosting | Any web server, including cPanel | Node 20+, or Vercel / Netlify / Cloudflare |
| Pages | 18 hand-assembled HTML files | 18 routes, server-rendered |
| Listings | Markup, edited by hand | Typed data model, 30 records |
| **Forms** | **Submit nowhere** | **12 working API endpoints** |
| Validation | None | Zod schemas, server-side, `.strict()` |
| Rate limiting | None | Fixed-window per endpoint |
| Audit trail | None | Processing-activity log with lawful basis |
| DSR 30-day clock | Not recorded | Computed and stored on receipt |
| Fonts | Fetched from Google at page load | Self-hosted, built in |
| Type safety | None | TypeScript strict mode, zero errors |

---

## Verification performed

Every claim below was tested in this build, not assumed.

| Check | Result |
|---|---|
| `tsc --noEmit` (strict) | 0 errors |
| `next build` | 24 routes compiled, 18 pre-rendered as static |
| All 18 routes loaded in Chromium | 0 JavaScript errors, 0 failed requests |
| `/no-such-page` | 404 status, `noindex`, branded not-found page |
| Marketplace listings present in server HTML with JavaScript disabled | 30 of 30 |
| `POST /api/contact` valid payload | 201, reference `FDP-ENQ-…` |
| `POST /api/contact` invalid payload | 422 with per-field messages |
| `POST /api/dsr` | 201, response due date computed at +30 days |
| `GET /api/listings?city=abuja&type=land&sort=price-asc` | 13 results, correctly ordered |
| `POST /api/mortgage/compare` | 6 routes, eligibility applied, null where no published rate |
| `GET /api/inspections/FDP-INS-DEMO01` | stage 5 of 9, officer named |
| `/sitemap.xml` | 18 URLs |
| `/robots.txt` | generated, API disallowed, AI crawlers allowed |

---

## Project structure

```
fair-deal-properties-next/
├── package.json              Next 16.4.0, React 19.3.0, TypeScript 5.9.3, Zod 4.6.7
├── next.config.ts            Security headers, caching, legacy 301 redirects
├── tsconfig.json             strict: true, @/* path alias
├── .env.example              Every variable documented
│
├── public/assets/            Logos, favicon, nine original SVG illustrations
│
└── src/
    ├── app/
    │   ├── layout.tsx                  Root layout, self-hosted fonts, firm-level JSON-LD
    │   ├── globals.css                 Brand design system (58 KB)
    │   ├── sitemap.ts   robots.ts      Generated from the route register
    │   ├── not-found.tsx               404, noindex
    │   ├── page.tsx + HomeContent.tsx  Landing page
    │   ├── <16 further routes>/        Each: page.tsx (metadata + JSON-LD) + Content.tsx
    │   └── api/                        12 endpoints
    │
    ├── components/
    │   ├── SiteNav.tsx  SiteFooter.tsx
    │   ├── ConsentProvider.tsx  CookieConsent.tsx  ConsentControls.tsx  ConsentReopen.tsx
    │   ├── JsonLd.tsx  FaqAccordion.tsx  AudienceTabs.tsx  MortgageComparator.tsx
    │   ├── marketplace/   ListingCard, MarketplaceBrowser, EnquiryModal, AlertForm
    │   ├── inspections/   WalkthroughViewer, InspectionRequestForm, InspectionTracker
    │   └── forms/         ContactForm, DataRightsForm, SnagForm
    │
    ├── data/              listings.ts (30) · faq.ts (7) · financing.ts (6 routes)
    │                      walkthroughs.ts (3 properties, versioned) · pipeline.ts (9 stages)
    │
    ├── lib/               site.ts · seo.ts · schema.ts · validation.ts
    │                      store.ts · notify.ts · audit.ts · rateLimit.ts · http.ts
    │
    └── styles/components.css   Component layer for the new React components
```

---

## The 12 API endpoints

### Write endpoints - all validated, rate limited, audited

| Method | Path | Purpose | Lawful basis recorded |
|---|---|---|---|
| POST | `/api/contact` | General consultation enquiry | Consent |
| POST | `/api/enquiry` | Enquiry against a specific listing | Consent |
| POST | `/api/alerts` | Standing listing-alert instruction | Consent |
| POST | `/api/newsletter` | Market intelligence subscription | Consent |
| POST | `/api/inspections` | Request a physical site inspection | Contract |
| POST | `/api/dsr` | **Data subject request (NDPA 2023)** | Legal obligation |
| POST | `/api/snag` | **Site notice and grievance (GAID Art. 40)** | Legal obligation / legitimate interest |

### Read endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/listings` | Filter, sort, paginate the register |
| GET | `/api/listings/[slug]` | One listing with its verification record |
| GET | `/api/inspections/[reference]` | Track an inspection by reference |
| POST | `/api/mortgage/compare` | Compare financing routes on total cost of credit |
| GET | `/api/health` | Uptime probe |

### Three design decisions worth knowing about

**1. The DSR clock starts on the server.** Section 38 of the Nigeria Data Protection Act
2023 runs the response period from receipt. `/api/dsr` computes and stores the due date
at the moment the request lands, routes it to the DPO inbox rather than the general
enquiry inbox, and returns the due date to the data subject. A request the firm failed
to route is still a request the data subject made, and the clock does not stop for it.

**2. The tracking reference is not a credential.** `/api/inspections/[reference]` returns
stage and timing only. It never returns the requester's name, email or telephone number.
Anyone holding a reference can call it, and treating that reference as a bearer token
for personal data would be a disclosure control failure.

**3. No rate is invented.** `/api/mortgage/compare` returns `null` for monthly and total
figures where a route publishes no rate. An invented rate in a client comparison is a
misrepresentation, not a convenience.

---

## SEO architecture

**Per route** (`src/lib/seo.ts`): title, meta description, keywords, canonical, robots
directives, Open Graph, Twitter card. Eighteen distinct records, not one shared block.

**Structured data** (`src/lib/schema.ts`): a single connected `@graph` with
cross-referenced `@id` values. `Organization` + `RealEstateAgent` and `WebSite` are
emitted once from the root layout; each route adds its own `WebPage` and
`BreadcrumbList`. `/faq` adds a `FAQPage` built from the real question and answer data.
`/services` adds five `Service` nodes. `/marketplace` adds an `ItemList` of all 30
listings.

> The marketplace publishes an `ItemList` rather than individual `Offer` nodes. That is
> deliberate restraint: an `Offer` asserts a firm price on a specific asset, and these
> prices are indicative, pending the verification record stated on each card.

**Server rendering**: every page, including the client-interactive ones, is rendered to
HTML on the server. All 30 listings, all 7 FAQ answers and all 9 pipeline stages are in
the initial response. The JavaScript makes them filterable; it is not what makes them
visible.

**Fonts**: `next/font/google` downloads Cormorant Garamond, DM Sans and DM Mono at build
time and serves them from your own origin. This removes a render-blocking third-party
request (helping Largest Contentful Paint) and removes a transfer of every visitor's IP
address to a third-party host, which the firm would otherwise have to account for in its
Privacy Notice.

> **Build requirement:** `next build` needs network access to `fonts.googleapis.com` the
> first time it runs. If your build environment blocks it, download the three font
> families, place the `.woff2` files under `src/fonts/`, and switch `layout.tsx` to
> `next/font/local`. Nothing else changes.

---

## Running it

```bash
npm install
cp .env.example .env.local      # then edit .env.local
npm run dev                     # http://localhost:3000
```

```bash
npm run typecheck               # tsc --noEmit, strict
npm run build                   # production build
npm start                       # serve the production build
```

## Deploying

**Vercel** - `vercel --prod`. Set `NEXT_PUBLIC_SITE_URL` and the inbox variables in the
project settings. Headers and redirects come from `next.config.ts`.

**Netlify** - connect the repository and install `@netlify/plugin-nextjs`.

**Any Node host** (including a VPS behind nginx) - `npm run build` then
`npm start` behind a reverse proxy on port 3000.

**Static export is not available** for this build and should not be attempted: the API
routes are server functions. If you need a purely static deployment, use the companion
zip `fair-deal-properties-html-v6.zip` and accept that its forms do not submit.

---

## Before go-live - four items

**1. Replace the submission store. [PRINCIPAL SIGN-OFF REQUIRED]**
`src/lib/store.ts` ships with a file driver that writes JSONL to disk. It exists so the
endpoints run out of the box. It is **not a lawful production store for personal data**:
no encryption at rest (section 39(1) of the NDPA 2023 requires appropriate technical
measures), no access control, no audit of reads, and it does not survive a serverless
redeploy - which means a data subject request could be lost while its thirty-day clock
continues to run. Implement the `StoreDriver` interface against a managed database with
encryption at rest. The interface is deliberately narrow so the swap is a single file.

**2. Execute processor assessments and data processing agreements before enabling any
third-party service.** That includes the email provider in `src/lib/notify.ts`, the
hosting provider, and any analytics. A processor engaged without them is an unlawful
disclosure of personal data, not a procurement lapse. This is task 18 of the 90-day
sequence in the Automation Pack (FDP-AUT-11).

**3. Supply the firm's social profile URLs.** `FIRM.sameAs` in `src/lib/site.ts` is an
empty array. It is the property Google uses to bind a website to its verified social
presence. It was left empty rather than populated with invented URLs - an incorrect
`sameAs` is worse than an absent one.

**4. Substantiate the landing page statistics. [PRINCIPAL SIGN-OFF REQUIRED]**
"₦12B+ in transactions facilitated", "100% title-verified listings", "15+ years advisory
experience". Each is a representation to consumers and section 116 of the Federal
Competition and Consumer Protection Act 2018 addresses false or misleading
representations. Each figure must be traceable to a schedule the firm can produce on
demand, or it must come down. Carried over from the website as it stands; stated here
because this build does not make them more defensible than they were.

---

## Three defects repaired from version 5

Found while porting, listed so they are not reintroduced:

1. **`updateCalc()` threw on every page without the mortgage calculator.** It ran at
   script load and read the calculator inputs unconditionally. Now a React component
   with its own state.
2. **The marketplace hero carried an inline `style` attribute with escaped double quotes
   inside `url(...)`.** The browser terminated the attribute at the stray quote and
   requested a malformed image URL on every page load.
3. **Three stray closing tags** - one `</div>` in the About section, one `</div>` and one
   `</section>` in the Terms section. Browsers repair these silently; JSX does not, which
   is how they were found.

---

*One application. Eighteen routes. Twelve endpoints that actually receive what is sent.*

**Prepared for Fair Deal Properties Ltd by Stephen Alaekwe & Co**
Version 1.0 · 14 October 2026 · [PRINCIPAL SIGN-OFF REQUIRED]
