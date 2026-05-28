# Marda & Sons — Heritage Textile E-commerce

## Original problem statement
"Build a landing page: i have my family business of wholesale textile trading in which recently we started selling some as retail but consider mostly wholesale, we want a shift from it, not completely stop it but increase the share of retail market. it is Marda & sons in solapur. … decide and plan for the designs, premium and traditional classic theme and colour palette best suited. craft the unique idea that can bring revolution in the market making it trillion dollar business … important note to be taken - it must be a masterpiece."

## User choices captured
- Scope: Full multi-page commerce experience (Amazon-style breadth, atelier-style depth)
- Products: Towels, Bedsheets, Shawls, Phetas, Topis, Lungi, Blankets / Solapuri Chaddars, Chatais
- Palette: Royal Maroon + Ivory + Antique Gold (regal heritage)
- Language: Mostly English with Hindi/Marathi accents in taglines & quotes
- Integrations: WhatsApp enquiry (+91 9422460420), Google Maps embed, Contact form, Wholesale form, Newsletter
- Address: Marda & Sons, 430, Chattigalli, Mangalwar Peth, Solapur

## Architecture
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind + framer-motion + lucide-react + react-hot-toast
- Backend: FastAPI + Motor (async MongoDB) + Pydantic v2
- Database: MongoDB (collections: `products`, `leads`, `meta` for seed versioning)
- Cart & Wishlist: client-side via localStorage (keys: `marda_cart_v1`, `marda_wish_v1`)
- Order checkout: WhatsApp deep-link (no payment gateway)
- Hosting: Supervisor — backend on :8001, frontend (next dev) on :3000; `/api/*` proxied to backend by ingress.

## Pages (implemented)
- `/` Home — cinematic hero, marquee, house intro, 8 category editorial grid, Marda Edit (featured), heritage CTA, value pillars, testimonial, wholesale/retail split, atelier visit with embedded map
- `/shop` — category filters, search, sort, responsive product grid
- `/shop?category=:slug` — filtered listing per category
- `/product/[slug]` — gallery, retail/wholesale price toggle (with MOQ), quantity, color swatches, Add to Bag, Wishlist, "Ask on WhatsApp", related products
- `/categories` — full collections landing with alternating editorial layout
- `/heritage` — story page with 1970→2026 timeline, three brand principles
- `/wholesale` — partner segments, stats, form (interests + qty range) → POST `/api/wholesale`
- `/contact` — split form + Google Maps iframe → POST `/api/contact`
- `/cart` — list, qty controls, subtotal, "Confirm via WhatsApp" deep-link
- `/wishlist` — saved products

## Backend API
- `GET /api/health`
- `GET /api/categories` → 8 categories with marathi/tagline/cover image
- `GET /api/products?category=&featured=&q=&limit=` 
- `GET /api/products/{slug}`
- `POST /api/contact` → stores lead (type: contact)
- `POST /api/wholesale` → stores lead (type: wholesale)
- `POST /api/newsletter` → stores lead (idempotent on email)

Seed catalog: 24 curated products across 8 categories, with retail & wholesale prices, MOQs, badges (Bestseller / Heritage / Wedding / Premium / Solapur Famous / B2B).

## Design system
- Type: Bodoni Moda (editorial display, italic), Marcellus (serif sub), Jost (body sans), Yatra One (Devanagari accent)
- Color tokens: `#FDFBF7` ivory paper, `#2A1D1A` ink, `#6A1A2A` brand maroon, `#C5A059` antique gold, `#D8CDBF` line, `#F3EFE6` secondary paper
- Motion: framer-motion reveals on scroll, slow image zoom, animated underlines, marquee strip
- Texture: paper grain overlay via SVG noise; Devanagari watermark in footer; Hindi/Marathi pull-quotes throughout

## Testing
- Iteration 1: Backend 100% (14/14 pytest). Frontend ~92%. Issues found: 3 broken Unsplash IDs, 1 hydration mismatch in Header badges, 1 missing testid (shop-search).
- Iteration 2: Backend 100%. Frontend ~98%. All Iter1 issues fixed. One residual low-priority hydration warning on `/contact` "Other ways" list — patched after Iter2 by wrapping literal text in `<span>`.

## What's implemented (2026-01-28)
- Multi-page Next.js app with 9 routes
- 24-product seeded MongoDB catalog
- Lead capture (contact, wholesale, newsletter)
- Client-side cart and wishlist with localStorage
- WhatsApp deep-link checkout
- Google Maps embed on Home and Contact
- Responsive design tested at 1920×800

## Backlog (P0 / P1 / P2)
- **P1**: Replace seed catalog with real Marda & Sons product photos (currently using Unsplash heritage imagery)
- **P1**: Admin login + a small dashboard to view captured leads (currently leads accumulate in MongoDB only)
- **P1**: Razorpay / UPI payment integration if user wants real checkout (currently WhatsApp checkout)
- **P2**: Pincode-based shipping calculator
- **P2**: Multi-image gallery uploads via S3 / Cloudinary
- **P2**: Blog / Journal route (`/journal`) for SEO and storytelling
- **P2**: Wedding bundle builder (multi-product gift hampers)
- **P2**: Bilingual toggle (full Marathi/Hindi site)

## Owner contacts
- Phone / WhatsApp: +91 94224 60420
- Address: 430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra
- Hours: Mon–Sat · 10:00 AM – 8:30 PM
