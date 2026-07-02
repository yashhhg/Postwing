# Postwing — SEO Report & Ranking Strategy

_Last updated: 2 Jul 2026 · Domain: postwing-production.up.railway.app_

---

## 1. Executive summary

The site is technically clean after the fixes below. The biggest lever now is **not**
technical — it's **content and target-keyword selection**. Postwing currently has one thin
marketing page and three `noindex` app pages, so there is almost nothing for Google to rank.
Ranking growth will come from (a) picking real, winnable keywords and (b) publishing content
that targets them.

> ⚠️ **Note on the requested term "99 seo scro":** this is not a real search query (no volume,
> no intent). Optimizing for it would produce no traffic. The keyword targets below are the
> ones Postwing can realistically rank for and convert. Replace them with your validated list
> once you run keyword research (Ahrefs Keywords Explorer / Google Keyword Planner).

---

## 2. Technical SEO — current status

### ✅ Fixed (verified live)
| Issue (Ahrefs) | Root cause | Fix |
| --- | --- | --- |
| Meta description too long | Descriptions > 160 chars | Shortened site + landing to ~148 chars |
| Open Graph tags incomplete | No `og:image` | Added generated `og:image` (1200×630) + full OG set |
| 404 / 4XX page | `/favicon.ico` missing | Added multi-size `favicon.ico` (+ `icon.svg`) |
| Page has no outgoing links | Landing CTAs were `<button>` (JS nav) | Converted to real `<a href>` links, SPA nav preserved |
| 404 / 4XX / Broken redirect | `preconnect` to bare `fonts.googleapis.com` / `fonts.gstatic.com` (404) | Removed preconnect hints; 200 font stylesheet kept |

### ℹ️ Remaining Ahrefs notices — informational, **not defects** (leave or "Turn off" in Ahrefs)
- **HTTP → HTTPS redirect** — mandatory, correct security behavior.
- **3XX redirect** — `/login/ → /login` trailing-slash canonicalization (recommended).
- **Redirected page has no incoming internal links** — nothing links to those redirect variants; harmless.

### ✅ Already implemented in the codebase
- Server-rendered HTML (crawlable), per-page `<title>` / meta description / canonical.
- `robots.txt` + `sitemap.xml` (auto-generated).
- JSON-LD structured data: `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`.
- OpenGraph + Twitter cards, favicon, mobile-responsive, HTTPS.
- `noindex` on `/login`, `/register`, `/coming-soon` (correct — thin/private pages).

### 🔧 Technical to-dos (priority order)
1. **Set `NEXT_PUBLIC_SITE_URL`** on Railway to the canonical domain so all absolute URLs
   (canonical, OG, sitemap) are correct. _Why:_ wrong base URL = duplicate-content / wrong
   canonical signals.
2. **Move to a custom domain** (e.g. `postwing.com`). _Why:_ `*.up.railway.app` is a shared
   host, weaker for branding/trust/link-building, and can't be verified as a property root.
3. **Add `Cache-Control` / performance budget** and run **Core Web Vitals** (PageSpeed Insights).
   _Why:_ CWV (LCP, INP, CLS) is a ranking factor; the marquee/animation should not hurt CLS.
4. **Submit sitemap in Google Search Console + Bing Webmaster Tools**, and enable **IndexNow**
   (Ahrefs flagged it) for faster indexing.

---

## 3. Keyword strategy

### 3.1 How to choose targets (the method that works for any term)
For each candidate keyword, score it on:
- **Search volume** — is anyone searching it? (>0; ideally 100+/mo)
- **Keyword difficulty (KD)** — can a new site realistically rank? (start with KD < 20–30)
- **Intent match** — does the searcher want what Postwing sells?
- **Business value** — will it convert to sign-ups?

Win **long-tail, low-difficulty, high-intent** terms first; they rank faster and convert better
than broad head terms you can't yet compete for.

### 3.2 Recommended target clusters for Postwing
| Cluster | Example keywords (validate volume/KD) | Intent | Page type |
| --- | --- | --- | --- |
| Category / head | "social media scheduler", "social media scheduling tool" | Commercial | Landing (home) |
| Affordability angle (your USP) | "affordable social media scheduler", "cheap Buffer alternative" | Commercial | Comparison page |
| Platform-specific | "schedule Instagram posts", "cross-post to TikTok and YouTube" | Commercial | Feature/use-case pages |
| Alternatives | "Hootsuite alternative", "Buffer alternative for creators" | Commercial | `/alternatives/*` pages |
| How-to / informational | "how to cross-post to all social media", "best time to post on X" | Informational | Blog posts |
| Audience | "social media scheduler for creators / small business" | Commercial | Use-case landing pages |

_Reasoning:_ Postwing's differentiator is **affordable, all-in-one cross-posting for creators &
small teams**. Alternatives/comparison and platform how-to content capture buyers actively
evaluating tools — the highest-converting, most winnable space for a new brand.

---

## 4. On-page SEO (per target page)
1. **One primary keyword per page**, reflected in: `<title>` (≤60 chars), H1, meta description
   (≤160), URL slug, first 100 words, and 1–2 subheadings. _Why:_ unambiguous relevance signals.
2. **Search-intent match** — if the query is "Buffer alternative", the page must compare, not
   just describe Postwing. _Why:_ Google ranks intent match, not keyword stuffing.
3. **Internal linking** — link new pages from the homepage/nav and to each other with
   descriptive anchor text. _Why:_ spreads authority and aids discovery/crawl.
4. **Unique, substantial content** — 800+ words for money pages, genuinely useful. _Why:_ thin
   pages don't rank; helpful content is the core ranking system.
5. **Media** with descriptive `alt` text; compress images. _Why:_ accessibility + image search.

---

## 5. Content plan (drives 80% of ranking growth)
Add a **`/blog`** and **use-case/comparison pages** — currently the site has nothing to rank
beyond the home page.

**First 90 days (example):**
- Week 1–2: `Postwing vs Buffer`, `Postwing vs Hootsuite` (comparison, high intent).
- Week 3–4: `How to cross-post to Instagram, TikTok & YouTube at once`.
- Week 5–6: `Best times to post on every platform in 2026` (link-bait, informational).
- Week 7–8: Use-case pages: `for creators`, `for small businesses`, `for agencies`.
- Ongoing: 1–2 helpful posts/week targeting long-tail how-to queries.

_Reasoning:_ comparison + how-to content ranks fastest for new domains and pulls buyers at the
decision stage. Each post becomes an internal link source and a link-earning asset.

---

## 6. Off-page / authority
1. **Get listed** on software directories: G2, Capterra, Product Hunt, AlternativeTo, SaaS
   directories. _Why:_ high-authority backlinks + referral traffic + "alternative" discovery.
2. **Digital PR / guest posts** on creator-economy and marketing blogs. _Why:_ topical,
   authoritative backlinks are still the strongest off-page ranking factor.
3. **Build in public** (X/LinkedIn), free tools (e.g. a "best time to post" calculator) to earn
   natural links. _Why:_ linkable assets scale backlinks without manual outreach.

---

## 7. AEO & GEO (answer & generative engines)
Because buyers increasingly ask ChatGPT/Perplexity/Google AI Overviews:
1. Keep and expand **`FAQPage` + `SoftwareApplication`** structured data (already present).
2. Write content in **clear question → concise answer** format. _Why:_ AI answer engines extract
   direct answers; structured, factual content gets cited.
3. State facts explicitly (pricing, supported platforms, limits) in text, not just images.
   _Why:_ LLMs read text; they can't parse claims baked into graphics.
4. Maintain accurate `Organization` data and consistent NAP/brand info across the web.

---

## 8. Measurement
- **Google Search Console** — impressions, clicks, average position, indexing status (primary).
- **Ahrefs Site Audit** — keep technical health at 100; re-crawl after each change.
- **Ahrefs Rank Tracker** — track the target keyword list weekly.
- **GA4** — organic sessions → sign-up conversions.
- Review monthly; double down on pages/queries gaining impressions.

---

## 9. Prioritized next actions
1. Set `NEXT_PUBLIC_SITE_URL` on Railway + verify the domain in Google Search Console & Bing.
2. Run keyword research; finalize the target list (replace the examples above).
3. Ship the first 2 comparison pages + `/blog` scaffold.
4. Submit to G2 / Capterra / Product Hunt / AlternativeTo.
5. Re-crawl in Ahrefs to confirm 0 errors; then track rankings.
