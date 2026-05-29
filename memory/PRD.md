# Marda & Sons Textiles — Code Review Fixes

## Source repo
https://github.com/virajmarda/marda-and-sons-textiles.git (Next.js 14 + FastAPI + MongoDB)

## Scope of this session
Applied targeted code-review fixes WITHOUT introducing new pages or large structural refactors (per user request: "do not build different and another page"). All visible UI/UX, routes, and behaviour are preserved.

## Files changed
| File | Change |
|------|--------|
| `frontend/src/lib/cart-context.tsx` | • Added `console.error` logging in localStorage hydrate/persist (was empty `catch {}`)<br>• Wrapped persistence writes in `try/catch` (handle quota exceeded / disabled storage)<br>• Memoized the Provider's `value` object with `useMemo` so consumers don't re-render on every render<br>• Added comment clarifying that cart/wishlist are non-sensitive UI state and localStorage is appropriate (no PII / no tokens) |
| `frontend/src/components/reveal.tsx` | Memoized framer-motion `initial`, `whileInView`, `viewport`, `transition` config objects with `useMemo` for stable identity across re-renders |
| `frontend/src/components/toast-provider.tsx` | Moved `style` object to module scope and wrapped `toastOptions` in `useMemo` |
| `frontend/src/app/product/[slug]/product-detail.tsx` | Image gallery thumbnail `key={i}` → `key={src}` (stable image URL) |
| `frontend/src/app/shop/shop-client.tsx` | Skeleton `key={i}` → `key={`skeleton-${i}`}` (clearer intent) |
| `frontend/src/app/page.tsx` | Marquee `key={i}` → `key={`marquee-${i}`}` |

## Explicitly NOT done (and why)
| Recommendation | Reason for skipping |
|----------------|---------------------|
| Move cart/wishlist to backend session / encrypted cookie | Architectural rewrite (would require new auth, sessions, multiple API endpoints). Cart/wishlist are non-sensitive UI state; localStorage is the standard approach for guest-cart e-commerce. User asked for the "best thing" without adding new pages — this fix would either need a full auth system or an opaque guest-cart endpoint. |
| Hook deps "fixes" for stable React setters/constants | The original review flagged adding things like `setOpen`, `setScrolled`, `CART_KEY`, `WISH_KEY` as deps. React `useState` setters and module-scope constants are stable by definition and do NOT need to be in dep arrays. The lint warning is overly aggressive and adding them is noise. The meaningful missing dep (memoized context value) IS fixed. |
| Split `page.tsx`, `product-detail.tsx`, `header.tsx`, `wholesale/page.tsx`, `contact/page.tsx`, `shop-client.tsx` into many sub-components | User: "do not build different and another page". These would be large, mechanical refactors that risk regressions on a live editorial design. The components are large but coherent (each is one editorial page). |
| Split `server.py`'s `build_catalog()` | Function is just a static list literal of `Product()` instances. There's no logic to extract — splitting would add indirection without test coverage to confirm equivalence. The 235-line "complexity" is actually data, not control flow. |

## Verification
- `npx tsc --noEmit` → clean
- All routes return 200: `/`, `/shop`, `/wishlist`, `/product/[slug]`
- `/api/health` → ok
- `/api/products` → returns seeded catalog (32 products across 8 categories)

## Next Action Items
- (Optional) Configure `eslint-config-next` in the repo so future PRs catch issues at CI time
- (Optional) Add Playwright smoke tests for cart add/remove + wishlist toggle to lock in behaviour before further refactors
- If user later wants per-user cart sync across devices, that's the moment to introduce the backend cart endpoints + auth

## Potential enhancement
Would you like to add a **"Continue on WhatsApp"** mini-form on the cart page that auto-fills the visitor's bag summary into a WhatsApp message? You already have the WhatsApp deep-link helper in `api.ts` and your product detail uses it — extending it to the cart would turn abandoned carts into direct sales conversations on a channel your store already runs on.
