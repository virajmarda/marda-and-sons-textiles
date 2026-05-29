# Marda & Sons Textiles — Implementation Log

## Source repo
https://github.com/virajmarda/marda-and-sons-textiles.git (Next.js 14 + FastAPI + MongoDB)

---

## Session 1 — Code-review round 1 (Critical fixes)
Empty catch logging, memoized Provider value, stable array keys, memoized inline objects.

## Session 2 — Code-review round 2 (Nested ternaries + Python tests)
Unwrapped 3 nested ternaries; `is True` → `== True` in pytest. Pushed back on linter false-positives & contradictions.

## Session 3 — "Continue on WhatsApp" feature
Name+phone capture form, auto order-ref `MS-XXXX-DDMM`, mobile sticky bar, product URLs in WA message, lead saved via `POST /api/cart-enquiry` before opening WhatsApp, pre-opened tab to defeat popup-blockers.

## Session 4 — Navbar legibility + masterpiece heroes
Always-visible solid-cream header with dark ink text; new reusable `<PageHero>` component applied to 7 interior pages with consistent editorial vocabulary (chapter mark, paisley ornament, vertical Est rail, italic-accented headline, marathi accent, decorative diamond hairline). Wrapped `.eyebrow` in `@layer components` so Tailwind color utilities win the cascade.

## Session 5 — `/admin/leads` page (this session)

### Backend (`backend/server.py`, `.env`)
- New env var: `ADMIN_TOKEN` (set to `marda-atelier-2026` for this preview)
- New FastAPI dependency `require_admin` validates `X-Admin-Token` header against the env var
- Extended `Lead` model with `contacted_at: Optional[datetime]`
- New endpoints:
  - `GET /api/admin/leads` — supports `?type=`, `?contacted=`, `?limit=`. Returns `{ok, leads[], counts{all,contact,wholesale,newsletter,cart_enquiry,uncontacted}}`.
  - `PATCH /api/admin/leads/{id}` — body `{contacted: true|false}` toggles `contacted_at` (now/None). 400 on invalid id, 404 on not-found, 401 on missing/wrong token.

### Frontend
- `lib/api.ts`: `AdminLead` + `AdminCounts` types, `getAdminLeads()`, `markLeadContacted()`, internal `adminFetch()` helper that clears token on 401.
- New page `/admin/leads`:
  - **Login screen** — `PageHero` chapter 09 ("The ledger."), centered token form. Token stored in localStorage `marda_admin_token_v1`.
  - **Authenticated workspace** — 5 filter tabs (All / Cart enquiries / Contact / Wholesale / Newsletter) with live counts, "Only uncontacted" checkbox, client-side search (name/email/phone/order_ref), Refresh, Sign out.
  - **Table** — type badge (color-coded), name+email+phone+company, type-specific detail (cart total + item count / message preview / wholesale city), timestamp, status with **Mark contacted** toggle (optimistic UI), per-row WhatsApp deep-link (`wa.me/{digits}`).
  - **Expandable rows** for cart_enquiry (full bag breakdown + subtotal), wholesale (interested_in, volume, message), contact (full message). Newsletter rows are not expandable.

### Verification (iteration_5 testing report)
- **Backend pytest: 29/29 passing** (17 original + 12 new admin tests in `tests/test_admin_leads.py`)
  - Token enforcement: 401 missing, 401 wrong, 200 correct
  - Filters: ?type=, ?contacted=true/false, ?limit
  - PATCH: happy path (writes ISO contacted_at, persists via GET, toggles back), 400 invalid id, 404 not-found, 400 empty body, 401 no-token
- **Frontend Playwright: 21/21 assertions passing**
  - Login disabled when blank, wrong token shows `admin-auth-error`, correct token transitions to `admin-leads-page`
  - All 5 tabs render with counts; switching tabs filters rows
  - Only-uncontacted checkbox filters; search filters
  - Mark-contacted toggle is optimistic AND persisted across refresh
  - Newsletter rows have NO expand chevron (correctly)
  - Sign-out clears localStorage and returns to login
- **All 8 existing site routes** still return 200; PageHero / cart enquiry / navbar visibility unchanged

### Cumulative diff vs origin/main (sessions 1–5)
**21 files**, **+1529 / -259 lines**.

| File | Status |
|------|--------|
| `backend/server.py` | +115 |
| `backend/tests/test_admin_leads.py` | NEW (+209) — 12 admin tests |
| `backend/tests/test_marda_api.py` | +66 (TestCartEnquiry block from session 3) |
| `frontend/src/app/admin/leads/page.tsx` | NEW (+394) |
| `frontend/src/components/page-hero.tsx` | NEW (+213) |
| `frontend/src/components/header.tsx` | rewritten |
| `frontend/src/app/page.tsx` | hero elevated |
| `frontend/src/app/{shop,categories,heritage,wholesale,contact,wishlist,cart}/*.tsx` | use PageHero |
| `frontend/src/app/globals.css` | `.eyebrow` in `@layer components` |
| `frontend/src/lib/api.ts` | +95 (cart enquiry + admin helpers) |
| `frontend/src/lib/cart-context.tsx` | error handling + memoized value |

---

## Next Action Items
- Review `git diff origin/main` and push via Save-to-GitHub
- **Rotate `ADMIN_TOKEN`** in production (it's `marda-atelier-2026` for this preview; replace with `openssl rand -hex 32`)
- (Optional) Per-type uncontacted counts so the admin tabs can show e.g. "Cart enquiries 13 · 7 pending"
- (Optional) Replace `payload: dict` in `PATCH /api/admin/leads/{id}` with a tight Pydantic model for explicit allow-listing

## Future / Backlog
- CSV export from `/admin/leads`
- Per-user cart sync (requires auth)
- Product detail image zoom
- Marathi-first language toggle

## Test credentials
See `/app/memory/test_credentials.md`.
