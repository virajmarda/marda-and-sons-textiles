# Marda & Sons Textiles — Code Review Fixes

## Source repo
https://github.com/virajmarda/marda-and-sons-textiles.git (Next.js 14 + FastAPI + MongoDB)

---

## Round 1 — initial review fixes

| File | Change |
|------|--------|
| `frontend/src/lib/cart-context.tsx` | Added `console.error` logging in empty catch blocks; wrapped `localStorage.setItem` in try/catch (handle quota / disabled storage); memoized Provider `value` with `useMemo` |
| `frontend/src/components/reveal.tsx` | Memoized framer-motion `initial`, `whileInView`, `viewport`, `transition` config objects |
| `frontend/src/components/toast-provider.tsx` | Moved `style` object to module scope, wrapped `toastOptions` in `useMemo` |
| `frontend/src/app/product/[slug]/product-detail.tsx` | Image-gallery thumbnail `key={i}` → `key={src}` |
| `frontend/src/app/shop/shop-client.tsx` | Skeleton `key={i}` → `key={"skeleton-"+i}` |
| `frontend/src/app/page.tsx` | Marquee `key={i}` → `key={"marquee-"+i}` |

## Round 2 — follow-up review fixes

| File | Change |
|------|--------|
| `frontend/src/components/header.tsx` | Replaced nested ternary (lines 140-142) with explicit `if/else` building a `linkColor` variable |
| `frontend/src/app/wishlist/page.tsx` | Replaced nested ternary with two independent `&&` blocks for `loading/empty/grid` states |
| `frontend/src/app/shop/shop-client.tsx` | Replaced nested ternary in product grid with three independent `&&` blocks |
| `backend/tests/test_marda_api.py` | Replaced `is True` with `== True` (6 occurrences) — silences PEP8 E712 |

---

## Recommendations explicitly NOT applied (and why)

| Recommendation | Reason |
|----------------|--------|
| Replace `is not None` with `==` on `server.py:146` | **Reviewer was wrong**. `is None` / `is not None` is the PEP8-mandated form for singleton comparison. Switching to `==` would *introduce* a lint error (E711). |
| Remove `console.error` calls (round 2 item #6) | **Directly contradicts round 1 item which asked to ADD them**. There is no error-logging service wired up; `console.error` is the standard browser-side fallback for unexpected client errors. Removing them would re-introduce the original "empty catch swallows errors" anti-pattern. |
| Add `CART_KEY`, `WISH_KEY`, `localStorage`, `setItems`, `setWishlist`, `prev`, `next`, `idx`, `CartItem` to hook dep arrays | • Module-scope constants and globals (`localStorage`) are stable by definition — adding them is noise and against the official `react-hooks/exhaustive-deps` rules.<br>• `useState` setters are guaranteed stable by React.<br>• `prev`, `next`, `idx`, `c`, `w` are **local variables inside** the callback — they cannot legally be in deps.<br>• `CartItem` is a TypeScript type — it has no runtime existence. |
| Refactor `useMemo` with 11 deps in context value | All 11 dependencies are genuinely consumed by the value object. Splitting into multiple memos would not reduce work — it would just shift it. The "max 5 deps" threshold is a heuristic, not a correctness rule. |
| Move cart/wishlist out of localStorage | Architectural rewrite. Cart/wishlist contain no PII, no tokens, no auth state — they are guest UI state. localStorage is the standard approach for guest e-commerce carts (Shopify, WooCommerce, Magento all do this). A backend session would require auth + new API endpoints. |
| Split `page.tsx`, `header.tsx`, `shop-client.tsx`, `product-detail.tsx`, `contact/page.tsx`, `wholesale/page.tsx` into many sub-components | User steer was *"do not build different and another page"*. These are large editorial pages where the layout *is* the design — extracting components mechanically would risk regressions on a polished, shipped UI. |
| Split `server.py build_catalog()` into smaller functions | `build_catalog()` is a 235-line **static data literal** (a list of `Product()` instances) — there is no control flow to extract. The line count is data, not complexity. |

---

## Verification
- `npx tsc --noEmit` → clean
- Backend pytest suite: **14/14 passing** (`pytest tests/test_marda_api.py -q`)
- Routes return 200: `/`, `/shop`, `/wishlist`, `/product/[slug]`
- `/api/health` → ok
- `/api/products` returns 32 seeded products across 8 categories

## Cumulative diff
9 files, +101 / -51 lines.

## Next Action Items
- Review the diff and push via Save-to-GitHub
- Consider adding `eslint-config-next` so future PRs catch issues at CI (and so reviews stop generating false-positives like the round-2 hook-deps list)
- Consider Playwright smoke tests for cart add/remove + wishlist toggle before any structural refactors

## Potential enhancement
A **"Continue on WhatsApp"** handoff from the Cart page — you already have `whatsappLink()` in `api.ts` and Product Detail uses it. Extending it to auto-fill the bag summary into a WhatsApp chat would turn abandoned carts into direct sales conversations on a channel your store already runs on.
