# FAIR DEAL PROPERTIES LTD
## Website Codebase - Static Multi-Page HTML Build

**Version 6.0 | 14 October 2026**
Prepared for Fair Deal Properties Ltd by Sir Stephen Alaekwe & Co

---

## What changed from version 5

Version 5 was a single HTML document with JavaScript page switching. A search engine
crawler reaching that document saw **one URL, one title and one meta description** for
the entire firm. Every page of content existed in the markup but none of it was
separately addressable, rankable, or linkable.

This build serves **eighteen separate HTML documents**, each with its own URL, title,
meta description, canonical link, social preview and structured data. Nothing was
removed - every page, every interaction and every form is intact. The visual output is
unchanged.

| | v5 single-page | v6 multi-page |
|---|---|---|
| Indexable URLs | 1 | 18 |
| Unique `<title>` / meta description | 1 | 18 |
| Canonical links | 0 | 18 |
| Open Graph / Twitter cards | 1 generic | 18 page-specific |
| schema.org JSON-LD | none | 18 pages, 8 entity types |
| sitemap.xml | none | 18 URLs, prioritized |
| robots.txt | none | present, AI crawlers permitted |
| Images with intrinsic dimensions | none | all (removes layout shift) |
| Base64-embedded illustrations | 9 inline | 9 cacheable `.svg` files |
| Page weight, landing page | 1,428 KB | 50 KB + shared cached assets |

---

## File structure

```
fair-deal-properties-html/
├── index.html              Landing page           (SEO-primary)
├── platform.html           The Fair Deal Platform
├── marketplace.html        Verified marketplace
├── inspections.html        Inspection Hub
├── financing.html          Financing advisory
├── services.html           Services
├── diaspora.html           Diaspora advisory
├── how-it-works.html       Engagement process
├── developers.html         Developer and partner advisory
├── insights.html           Market intelligence
├── about.html              About the firm
├── technology.html         Technology, security and compliance
├── faq.html                FAQ                    (FAQPage schema)
├── contact.html            Contact and consultations
├── privacy-notice.html     Privacy Notice         NDPA 2023 / GAID 2025
├── cookie-notice.html      Cookie Notice          NDPA 2023 / GAID 2025
├── data-rights.html        Data subject rights portal
├── terms.html              Terms of Service
├── 404.html                Not-found page         (noindex)
├── sitemap.xml             18 URLs, lastmod, changefreq, priority
├── robots.txt              Crawl directives + sitemap pointer
├── .htaccess               Apache: HTTPS, canonical host, 301s, headers, caching
├── _redirects              Netlify / Cloudflare Pages redirects
├── netlify.toml            Netlify headers and caching
├── vercel.json             Vercel redirects, headers and caching
└── assets/
    ├── css/fdp.css         57 KB - all styling
    ├── js/fdp.js           38 KB - all behaviour
    ├── illustrations/      i0-i8.svg - nine original brand illustrations
    ├── logo-primary.png    Dark-ink wordmark
    ├── logo-reversed.png   Light-ink wordmark (dark backgrounds)
    └── favicon.png
```

---

## Landing page SEO - what was engineered

### 1. Document head

| Element | Value |
|---|---|
| `<title>` | Fair Deal Properties Ltd \| Verified Property, Transaction Facilitation and PropTech in Nigeria |
| Meta description | 244 characters, keyword-bearing, no truncation at 160 for the snippet's first clause |
| Canonical | `https://www.fairdealng.com/` |
| Robots | `index,follow,max-image-preview:large,max-snippet:-1` |
| Language | `lang="en-NG"`, `og:locale en_NG` |
| Geo targeting | `geo.region NG-FC`, `geo.placename Abuja` |

### 2. Structured data (JSON-LD, `@graph`)

| Node | Carries |
|---|---|
| `Organization` + `RealEstateAgent` | Legal name, logo, telephone, email, postal address, areaServed (Abuja, Lagos, Port Harcourt, Nigeria), knowsAbout |
| `WebSite` | Site identity and publisher linkage |
| `WebPage` | Per-page name, description, language, breadcrumb linkage |
| `BreadcrumbList` | Home → page, on all 17 interior pages |
| `ContactPoint` | Landing page only - telephone, email, language |
| `FAQPage` | **7 question/answer pairs extracted from the live FAQ markup** - eligible for rich results |
| `Service` × 5 | Services page - the five service lines, each with provider linkage |

Entity `@id` values cross-reference, so the graph resolves as one connected entity
rather than seven disconnected fragments.

### 3. Core Web Vitals

- Masthead logo and each page's first illustration load **eagerly** with
  `fetchpriority="high"` - lazy-loading a hero image delays Largest Contentful Paint,
  which is a ranking signal.
- Every image carries explicit `width` and `height` - this removes Cumulative Layout
  Shift, which is a second ranking signal.
- CSS and JavaScript are external and cacheable rather than inline, so the landing
  page transfers 50 KB instead of 1,428 KB and every subsequent page reuses the cache.
- Fonts are preconnected; the stylesheet is preloaded; the script is deferred.

### 4. Crawl directives

`robots.txt` explicitly permits GPTBot, ClaudeBot, PerplexityBot and Google-Extended.
This is a deliberate commercial decision, not an oversight: the firm publishes verified
market intelligence in order to be cited, and an answer engine that cannot read the
Insights pages cannot name Fair Deal Properties as the source.

Reverse it by changing `Allow: /` to `Disallow: /` under each of those four agents.

---

## Deployment

### Any Apache host (cPanel, shared hosting)

Upload the folder contents to `public_html/`. `.htaccess` is included and handles
HTTPS redirection, canonical host enforcement (`fairdealng.com` → `www.fairdealng.com`),
legacy URL redirects, security headers and asset caching. **Confirm `mod_rewrite`,
`mod_headers` and `mod_expires` are enabled** - most cPanel hosts enable all three.

### Netlify or Cloudflare Pages

Drag the folder into the deploy pane, or connect a Git repository with
publish directory `.`. `netlify.toml` and `_redirects` are read automatically.

### Vercel

`vercel --prod` from inside the folder. `vercel.json` is read automatically.

### Post-deployment checklist

| # | Action | Where |
|---|---|---|
| 1 | Confirm the live domain matches `https://www.fairdealng.com` everywhere, or run a find-and-replace across all 18 files and `sitemap.xml` | Canonical and og:url tags |
| 2 | Submit `sitemap.xml` | Google Search Console, Bing Webmaster Tools |
| 3 | Test the landing page and FAQ | Google Rich Results Test |
| 4 | Verify the Organization entity | Google Search Console → Enhancements |
| 5 | Claim and complete the Google Business Profile at the Utako address, matching the `PostalAddress` in the JSON-LD exactly | business.google.com |
| 6 | Set `lastmod` in `sitemap.xml` on each content change | sitemap.xml |

---

## Open items carried forward

These are stated plainly because they affect whether the site performs, not merely how
it looks.

**1. Seven forms still submit nowhere.** Contact, property enquiry, property alert,
inspection request, newsletter, data subject request and SNAG all render a success
message client-side without transmitting anything. Two of them carry regulatory rather
than commercial consequence: under the Nigeria Data Protection Act 2023 the response
clock on a data subject request runs from receipt, and a request the firm never
received is still a request the data subject made. This is task 01 of the 90-day
implementation sequence in the Automation Pack (FDP-AUT-11). **The Next.js build in the
companion zip resolves this** - it ships working API route handlers for all seven.

**2. Social profile links are absent.** The `sameAs` property of the Organization
entity is the mechanism by which Google ties a website to its verified social presence.
It was left out rather than populated with invented URLs. Supply the firm's LinkedIn,
Instagram, Facebook and X handles and they should be added to the `@graph` on every
page.

**3. The landing page `<h1>` is "Property, made transparent."** It is brand-led rather
than keyword-led. The primary keywords are carried by the `<title>`, the meta
description, the opening paragraph and the structured data, which is where they weigh
most. Changing the `<h1>` to a keyword string would trade a strong brand statement for
a marginal ranking gain. **Recommendation: leave it.** Flagged here so the choice is
visible rather than assumed. **[PRINCIPAL SIGN-OFF REQUIRED]**

**4. Statistics on the landing page are unverified.** "₦12B+ in transactions
facilitated", "100% title-verified listings", "15+ years advisory experience". Each is
a representation to consumers. Section 116 of the Federal Competition and Consumer
Protection Act 2018 addresses false or misleading representations. Each figure must be
traceable to a schedule the firm can produce on demand, or it must come down.
**[PRINCIPAL SIGN-OFF REQUIRED]**

---

## Browser and crawler verification performed

All 19 documents were loaded in Chromium and confirmed to produce **no JavaScript
errors and no failed resource requests**. Three defects inherited from the v5
single-page build were repaired in the process:

1. `updateCalc()` ran at script load and read the mortgage calculator inputs
   unconditionally, throwing a TypeError on every page that does not contain the
   calculator. Now guarded and deferred to DOM ready.
2. The marketplace hero carried an inline `style` attribute containing escaped double
   quotes inside `url(...)`. The browser terminated the attribute at the stray quote
   and issued a request for a malformed image URL on every page load. Repaired.
3. The page wrapper would have carried two `id` attributes after promotion to `<main>`.
   Resolved by retaining the original id.

---

*Eighteen pages. Eighteen chances to be found.*

**Prepared for Fair Deal Properties Ltd by Sir Stephen Alaekwe & Co**
Version 6.0 · 14 October 2026 · [PRINCIPAL SIGN-OFF REQUIRED]
