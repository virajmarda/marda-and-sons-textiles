# Marda & Sons Textiles — Implementation Log

## Source repo
https://github.com/virajmarda/marda-and-sons-textiles.git (Next.js 14 + FastAPI + MongoDB)

---

## Session 1 — Code-review round 1 fixes
Empty catch logging, memoized Provider value, stable array keys, memoized inline objects (`reveal.tsx`, `toast-provider.tsx`).

## Session 2 — Code-review round 2 fixes
Three nested ternaries unwrapped (`header.tsx`, `wishlist/page.tsx`, `shop-client.tsx`); `is True` → `== True` in tests. Pushed back on linter false-positives.

## Session 3 — "Continue on WhatsApp" feature
Cart page: name+phone capture form, auto order-ref MS-XXXX-DDMM, mobile sticky bar, product URLs in WA message, lead saved via `POST /api/cart-enquiry` before opening WhatsApp, pre-opened tab to defeat popup-blockers. Backend pytest 17/17 (3 new TestCartEnquiry cases).

## Session 4 — Navbar legibility + masterpiece heroes (this session)

### Header rewrite (`components/header.tsx`)
- **Removed** the `onHero` theme-switching logic that made the navbar dark over light pages.
- **Always** solid cream `bg-[#FDFBF7]/[0.97]` backdrop with `text-ink` nav links and `text-brand` for the active route.
- Subtle border/shadow that elevates only on scroll (`scrolled > 24px`).
- Top gold thread always present.
- Cart/wishlist badges now `rounded-full`.
- Mobile drawer also uses `text-ink` / `text-brand` for active.

### New `<PageHero>` component (`components/page-hero.tsx`)
Single reusable masterpiece hero used across every interior page. Editorial vocabulary kept consistent:
- **Chapter mark** — oversized serif italic number (e.g. "01", "02") with horizontal gold thread + "CHAPTER" label
- **Top gold thread** — subtle gradient hairline beneath the header
- **Paisley SVG ornament** in the top-right (very subtle, gold/brand-tinted)
- **Vertical rail** on the right edge: "Est. 1970 · Solapur · India" (with mid-line divider, vertical writing mode)
- **Eyebrow** + **Headline** (animated via framer-motion, supports JSX with italic accent span) + **Marathi** accent + **Lede**
- **Decorative bottom hairline** with centered gold diamond ornament
- Supports `tone='light'|'dark'`, `layout='single'|'split'` (split = sidebar prop), `height='md'|'lg'|'xl'`, optional `bgImage` with slow Ken-Burns motion

### PageHero applied to (with consistent chapter numbering)
| Page | Chapter | Notes |
|------|---------|-------|
| Shop (`shop-client.tsx`) | 02 | bgImage = active category image when filtered |
| Categories | 03 | "Eight chapters. One Solapur." |
| Heritage | 04 | bgImage = macro thread shot, `height='xl'` |
| Wholesale | 05 | "Become a house partner." |
| Contact | 06 | `layout='split'` with sidebar greeting |
| Wishlist | 07 | `height='md'`, dynamic headline (empty vs N pieces saved) |
| Cart | 08 | `height='md'`, order-ref shown as lede |

### Home hero (`app/page.tsx`) — kept bespoke + elevated
Retained the full-bleed dark hero image but layered in the same masterpiece vocabulary:
- "01 · CHAPTER" gold serif mark
- "THE HOUSE OF मर्दा ॲन्ड सन्स" eyebrow
- Existing massive split headline kept
- Vertical "Est. 1970 · Solapur · India" rail
- Subtle paisley SVG ornament top-right
- Decorative bottom diamond hairline above the marquee
- Removed the now-unnecessary top scrim (header is solid cream)

### Critical CSS fix (`globals.css`)
- Wrapped `.eyebrow` rule in `@layer components` so Tailwind utility classes (`text-gold`, `text-bg-primary`, etc.) win the cascade. Previously `.eyebrow { color: var(--ink-soft) }` was overriding every utility, making gold eyebrows on the dark hero unreadable.

### Verification
- TypeScript: `tsc --noEmit` clean
- Backend pytest: **17/17 passing**
- Testing-agent iteration_4: **100%** pass — all 8 routes, navbar visibility on every page, masterpiece hero treatments, active route highlighting, mobile drawer, cart regression
- Computed nav-link colors verified:
  - Inactive: `rgb(42, 29, 26)` (ink) — AAA contrast on cream
  - Active: `rgb(106, 26, 42)` (brand maroon)

### Cumulative diff vs origin/main (sessions 1+2+3+4)
17 files, ~+970 / -310 lines.

---

## Next Action Items
- Review the cumulative `git diff origin/main` and push via Save-to-GitHub
- (Optional) Admin `/api/leads` (token-gated) listing endpoint so the store can read cart enquiries / contact / wholesale / newsletter leads from the browser
- (Optional) Add `eslint-config-next` for CI lint enforcement
- (Optional, low-priority) The Wishlist empty-state CTA is currently gated behind `!loading`; consider showing the skeleton during fetch or always rendering the CTA to avoid the brief empty moment during navigation (called out by testing agent)

## Future / Backlog
- Per-user cart sync across devices (requires auth)
- Product detail page image zoom
- "Recently viewed" sidebar
- Internationalisation (Marathi-first toggle)
