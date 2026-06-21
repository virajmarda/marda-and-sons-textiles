import Link from 'next/link';
import { ArrowRight, Award, Hand, Leaf, Sparkles, Truck } from 'lucide-react';
import { Reveal, SectionLabel } from '@/components/reveal';
import { ProductCard } from '@/components/product-card';
import { MAPS_DIRECTIONS, ESTABLISHED, whatsappLink } from '@/lib/api';
import type { Product } from '@/lib/api';

export const revalidate = 60; // ISR: re-fetch from Odoo every 60s

const hero =
  'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/bfd7c66015eb89044445dbab3149d88f192cba8791da7bac01a5df9b37c95428.png';
const macro =
  'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/85fde45f54ca0616d6a74571cd3f6b4b0497577453850b7019bdb09ade3190b3.png';
const editorial =
  'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/6ee061934d03a5fc78962a067d6eb5b00c915d6aee9992d61cd1ff9b93f6da20.png';

// ─────────────────────────────────────────────────────────────────────────────
// Odoo helpers
// ─────────────────────────────────────────────────────────────────────────────

const ODOO_URL      = process.env.ODOO_URL      ?? '';
const ODOO_DB       = process.env.ODOO_DB       ?? '';
const ODOO_USERNAME = process.env.ODOO_USERNAME ?? '';
const ODOO_PASSWORD = process.env.ODOO_PASSWORD ?? '';

/** Low-level JSON-RPC call */
async function odooCall(service: string, method: string, args: unknown[]) {
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: 1,
      params: { service, method, args },
    }),
  });

  if (!res.ok) throw new Error(`Odoo HTTP error: ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error?.data?.message ?? 'Odoo RPC error');
  return json.result;
}

/** Authenticate once per request; returns uid */
async function odooUid(): Promise<number> {
  return odooCall('common', 'login', [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD]);
}

/** Convenience: search_read */
async function searchRead(
  uid: number,
  model: string,
  domain: unknown[],
  fields: string[],
  opts: { limit?: number; order?: string } = {},
): Promise<Record<string, unknown>[]> {
  return odooCall('object', 'execute_kw', [
    ODOO_DB,
    uid,
    ODOO_PASSWORD,
    model,
    'search_read',
    [domain],
    { fields, limit: opts.limit ?? 20, order: opts.order ?? 'id asc' },
  ]);
}

/** Build a direct Odoo image URL for any record */
function odooImg(model: string, id: number, field = 'image_512') {
  return `${ODOO_URL}/web/image/${model}/${id}/${field}`;
}

/** Convert an Odoo record name → URL slug */
function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─────────────────────────────────────────────────────────────────────────────
// Fallback images (used when Odoo has no image for a record)
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_IMAGES = [macro, hero, editorial];

// ─────────────────────────────────────────────────────────────────────────────
// Data-fetching functions
// ─────────────────────────────────────────────────────────────────────────────

type Category = {
  id: number;
  slug: string;
  name: string;
  marathi: string;
  tagline: string;
  image: string;
};

const CATEGORY_TAGLINES: Record<string, string> = {
  bedsheets:         'The Solapuri chaddar — in homes since 1970.',
  towels:            'Terry loop, honest cotton, built to last.',
  phetas:            'The ceremonial turban of Maharashtra.',
  blankets:          'Wool and cotton, for Indian winters.',
  shawls:            'Lightweight drapes for every occasion.',
  gifting:           'Curated sets for weddings & celebrations.',
  ceremonial:        'Temple and puja textiles from Solapur.',
  'wholesale-bundles': 'Bulk packs for retailers.',
};

async function fetchCategories(): Promise<Category[]> {
  try {
    const uid = await odooUid();
    const records = await searchRead(
      uid,
      'product.public.category',
      [['name', '!=', false]],
      ['id', 'name'],
      { limit: 8, order: 'id asc' },
    );

    return records.map((c, i) => {
      const slug = slugify(c.name as string);
      return {
        id:      c.id as number,
        slug,
        name:    c.name as string,
        marathi: c.name as string,   // replace with a custom Marathi field if you add one in Odoo
        tagline: CATEGORY_TAGLINES[slug] ?? 'Honest textile craft from Solapur.',
        image:   odooImg('product.public.category', c.id as number, 'image_512'),
      };
    });
  } catch (err) {
    console.error('[Odoo] fetchCategories failed:', err);
    // Graceful fallback — static categories so the page never breaks
    return [
      { id: 1, slug: 'bedsheets',         name: 'Bedsheets',         marathi: 'चादरी',       tagline: 'The Solapuri chaddar — in homes since 1970.',  image: macro     },
      { id: 2, slug: 'towels',            name: 'Towels',            marathi: 'टॉवेल',       tagline: 'Terry loop, honest cotton, built to last.',    image: hero      },
      { id: 3, slug: 'phetas',            name: 'Phetas',            marathi: 'फेटे',        tagline: 'The ceremonial turban of Maharashtra.',        image: editorial },
      { id: 4, slug: 'blankets',          name: 'Blankets',          marathi: 'ब्लँकेट',     tagline: 'Wool and cotton, for Indian winters.',         image: macro     },
      { id: 5, slug: 'shawls',            name: 'Shawls',            marathi: 'शाल',         tagline: 'Lightweight drapes for every occasion.',      image: editorial },
      { id: 6, slug: 'gifting',           name: 'Gifting',           marathi: 'भेटवस्तू',    tagline: 'Curated sets for weddings & celebrations.',   image: hero      },
      { id: 7, slug: 'ceremonial',        name: 'Ceremonial',        marathi: 'पूजा वस्त्र', tagline: 'Temple and puja textiles from Solapur.',      image: macro     },
      { id: 8, slug: 'wholesale-bundles', name: 'Wholesale Bundles', marathi: 'घाऊक',        tagline: 'Bulk packs for retailers.',                   image: editorial },
    ];
  }
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const uid = await odooUid();
    const records = await searchRead(
      uid,
      'product.template',
      [
        ['website_published', '=', true],
        ['sale_ok', '=', true],
      ],
      [
        'id',
        'name',
        'website_description',
        'list_price',
        'default_code',
        'public_categ_ids',
        'website_published',
      ],
      { limit: 8, order: 'id desc' },
    );

    return records.map((p) => {
      const catIds = p.public_categ_ids as number[];
      return {
        slug:            slugify(p.name as string),
        name:            p.name as string,
        subtitle:        (p.default_code as string) || 'Solapur textile',
        description:
          ((p.website_description as string) ?? '')
            .replace(/<[^>]*>/g, '')
            .trim() || 'Crafted textile from the looms of Solapur.',
        category:        catIds?.length ? String(catIds[0]) : 'uncategorized',
        price_retail:    Number(p.list_price ?? 0),
        price_wholesale: null,
        moq_wholesale:   null,
        images:          [odooImg('product.template', p.id as number, 'image_512')],
        badges:          ['Handloom'],
        in_stock:        true,
        featured:        true,
      } satisfies Product;
    });
  } catch (err) {
    console.error('[Odoo] fetchProducts failed:', err);
    // Graceful fallback so the page never breaks
    return [
      {
        slug: 'solapuri-chaddar-classic-white', name: 'Solapuri Chaddar — Classic White',
        subtitle: 'The original Solapur weave',
        description: 'Pure cotton Solapuri handloom bedsheet, single/double bed.',
        category: 'bedsheets', price_retail: 899, price_wholesale: 699, moq_wholesale: 12,
        images: [macro, editorial], badges: ['Bestseller', 'Handloom'], in_stock: true, featured: true,
      },
      {
        slug: 'solapuri-chaddar-royal-border', name: 'Solapuri Chaddar — Royal Border',
        subtitle: 'Heritage stripe border, double bed',
        description: 'Double-bed Solapuri chaddar with traditional woven border.',
        category: 'bedsheets', price_retail: 1099, price_wholesale: 849, moq_wholesale: 12,
        images: [editorial, macro], badges: ['Heritage', 'Handloom'], in_stock: true, featured: true,
      },
      {
        slug: 'solapuri-terry-towel-premium', name: 'Solapuri Terry Towel — Premium',
        subtitle: 'Thick loop, fast dry',
        description: 'Premium terry towel from Solapur — 100% combed cotton.',
        category: 'towels', price_retail: 349, price_wholesale: 270, moq_wholesale: 24,
        images: [hero, macro], badges: ['Bestseller'], in_stock: true, featured: true,
      },
      {
        slug: 'solapuri-pheta-traditional', name: 'Solapuri Pheta — Traditional',
        subtitle: 'Ceremonial turban cloth',
        description: 'The traditional Solapuri pheta — worn at weddings across Maharashtra.',
        category: 'phetas', price_retail: 599, price_wholesale: 449, moq_wholesale: 10,
        images: [editorial, hero], badges: ['Heritage', 'Ceremonial'], in_stock: true, featured: true,
      },
      {
        slug: 'solapuri-woolen-blanket-classic', name: 'Solapuri Woolen Blanket — Classic',
        subtitle: 'Winter staple since 1970',
        description: 'Warm wool-blend blanket from the looms of Solapur.',
        category: 'blankets', price_retail: 1799, price_wholesale: 1399, moq_wholesale: 6,
        images: [macro, editorial], badges: ['Premium', 'Handloom'], in_stock: true, featured: true,
      },
      {
        slug: 'solapuri-shawl-cotton-checks', name: 'Solapuri Shawl — Cotton Checks',
        subtitle: 'Everyday drape in classic check',
        description: 'Lightweight cotton shawl in the classic Solapuri check.',
        category: 'shawls', price_retail: 699, price_wholesale: 549, moq_wholesale: 12,
        images: [editorial, macro], badges: ['Heritage'], in_stock: true, featured: false,
      },
      {
        slug: 'solapuri-chaddar-king-size', name: 'Solapuri Chaddar — King Size',
        subtitle: 'King & queen extra-wide weave',
        description: 'Extra-wide king-size Solapuri chaddar for larger beds.',
        category: 'bedsheets', price_retail: 1299, price_wholesale: 999, moq_wholesale: 10,
        images: [hero, editorial], badges: ['New'], in_stock: true, featured: false,
      },
      {
        slug: 'solapuri-towel-set-gift', name: 'Solapuri Towel Gift Set — 3 Piece',
        subtitle: 'Bath + hand + face towel set',
        description: 'A curated 3-piece towel gift set in matched cotton terry.',
        category: 'towels', price_retail: 899, price_wholesale: 699, moq_wholesale: 6,
        images: [macro, hero], badges: ['Gift', 'Bestseller'], in_stock: true, featured: false,
      },
    ];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  return (
    <div data-testid="home-page" className="bg-paper">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        data-testid="hero-section"
        className="relative flex min-h-[100svh] items-end overflow-hidden"
      >
        <img
          src={hero}
          alt="Solapur handloom textiles"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ transform: 'scale(1.04)', transformOrigin: 'center' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,8,6,0.98) 0%, rgba(10,8,6,0.88) 28%, rgba(10,8,6,0.50) 55%, rgba(10,8,6,0.18) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(10,8,6,0.75) 0%, rgba(10,8,6,0.20) 50%, transparent 100%)',
          }}
        />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        <div
          aria-hidden
          className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
          style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.38)' }}
        >
          <span className="font-sub text-[10px] uppercase tracking-[0.2em]">Est. {ESTABLISHED}</span>
          <span
            className="h-16 w-px"
            style={{ background: 'rgba(212,175,90,0.4)', writingMode: 'horizontal-tb' }}
          />
          <span className="font-sub text-[10px] uppercase tracking-[0.2em]">Solapur · India</span>
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-12 pt-28 sm:px-6 sm:pb-20 sm:pt-40 md:px-12 md:pb-28 md:pt-48 lg:px-24 lg:pb-32 lg:pt-56">
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">

            <div className="lg:col-span-8">
              <Reveal delay={0.05}>
                <div className="mb-7 flex items-center gap-3 sm:gap-4 md:mb-9">
                  <span
                    className="font-sub text-[10px] uppercase tracking-[0.26em]"
                    style={{ color: 'rgba(212,175,90,0.65)' }}
                  >
                    01
                  </span>
                  <span className="h-px w-10 sm:w-14" style={{ background: 'rgba(212,175,90,0.45)' }} />
                  <span
                    className="font-sub text-[10px] uppercase tracking-[0.26em]"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    मर्दा ॲन्ड सन्स · since {ESTABLISHED}
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <h1
                  className="font-heading italic font-normal text-white"
                  style={{ fontSize: 'clamp(2.2rem, 6.5vw, 7rem)', lineHeight: '1.08', letterSpacing: '-0.01em' }}
                >
                  All in One Textile
                  <br />
                  <em style={{ color: 'rgba(212,175,90,1)' }}>Destination.</em>
                </h1>
              </Reveal>

              <Reveal delay={0.28}>
                <p
                  className="font-accent mt-5 sm:mt-6"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: 'rgba(212,175,90,0.78)', letterSpacing: '0.04em' }}
                >
                  विश्वास की परंपरा, वर्षों का साथ
                </p>
              </Reveal>

              <Reveal delay={0.40}>
                <p
                  className="font-sub mt-5 max-w-xl text-base leading-relaxed sm:max-w-2xl sm:text-lg md:mt-6"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  For fifty-five years, the looms of Solapur have woven for one family that listens.
                  Today,{' '}
                  <span className="font-brand not-italic" style={{ color: 'rgba(212,175,90,0.9)' }}>
                    मर्दा ॲन्ड सन्स
                  </span>{' '}
                  brings that craft and care into your home — and into the world.
                </p>
              </Reveal>

              <Reveal delay={0.54}>
                <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4 md:mt-12">
                  <Link href="/shop" data-testid="hero-shop-cta" className="btn-primary w-full justify-center sm:w-auto">
                    Explore the Collection <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/wholesale"
                    data-testid="hero-wholesale-cta"
                    className="flex w-full items-center justify-center border px-6 py-4 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-white/10 sm:w-auto sm:px-7"
                    style={{ borderColor: 'rgba(255,255,255,0.40)', color: 'rgba(255,255,255,0.80)' }}
                  >
                    For Wholesale Partners
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-4">
              <Reveal delay={0.66}>
                <div
                  className="p-7 backdrop-blur-sm sm:p-8"
                  style={{ border: '1px solid rgba(212,175,90,0.30)', background: 'rgba(10,8,6,0.55)' }}
                >
                  <p
                    className="font-sub mb-1 text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: 'rgba(212,175,90,0.70)' }}
                  >
                    Visiting Solapur?
                  </p>
                  <p
                    className="font-sub mt-3 text-sm leading-relaxed sm:text-base"
                    style={{ color: 'rgba(255,255,255,0.80)' }}
                  >
                    Our store at{' '}
                    <em className="not-italic" style={{ color: 'rgba(255,255,255,0.95)' }}>
                      430, Chattigalli, Mangalwar Peth
                    </em>{' '}
                    has welcomed three generations of trust.
                  </p>
                  <a
                    href={MAPS_DIRECTIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="hero-directions"
                    className="mt-6 inline-flex items-center gap-2 font-sub text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
                    style={{ color: 'rgba(212,175,90,0.90)' }}
                  >
                    Get Directions <ArrowRight size={12} />
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="relative mt-14 sm:mt-16 md:mt-20" aria-hidden>
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-xs"
              style={{ color: 'rgba(212,175,90,0.55)' }}
            >
              ◆
            </span>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <section
        aria-hidden
        className="overflow-hidden border-y border-gold/20 bg-ink py-4 text-bg-primary sm:py-5 md:py-6"
      >
        <div className="marquee-track flex whitespace-nowrap gap-8 px-4 sm:gap-10 md:gap-12">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={`marquee-${i}`}
              className="flex shrink-0 items-center gap-8 font-heading text-xl italic sm:gap-10 sm:text-2xl md:gap-12 md:text-3xl"
            >
              <span>Handloom Bedsheets</span>
              <span className="text-gold">◆</span>
              <span className="font-accent text-gold">सोलापूरची शान</span>
              <span className="text-gold">◆</span>
              <span>Woolen Blankets</span>
              <span className="text-gold">◆</span>
              <span>Royal Phetas</span>
              <span className="text-gold">◆</span>
              <span className="font-accent text-gold">परंपरा</span>
              <span className="text-gold">◆</span>
              <span>Heritage Shawls</span>
              <span className="text-gold">◆</span>
              <span>Quality Towels</span>
              <span className="text-gold">◆</span>
              <span className="font-accent text-gold">मर्दा ॲन्ड सन्स</span>
              <span className="text-gold">◆</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE HOUSE ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-5">
              <SectionLabel number="01" label="The House" />
              <Reveal>
                <h2 className="display-2 mt-6 text-4xl text-ink sm:text-5xl md:mt-8 md:text-6xl lg:text-7xl">
                  A textile
                  <br />
                  destination
                  <br />
                  <span className="italic text-brand">of Solapur.</span>
                </h2>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.2}>
                <p className="font-sub text-lg leading-relaxed text-ink sm:text-xl md:text-2xl">
                  In a city the world once turned to for its textile, our family began with one
                  small shop and a single promise — that textile reaches every household with
                  happiness and trust.
                </p>
                <p className="mt-6 font-sub leading-relaxed text-ink-soft md:mt-8">
                  Five and a half decades later, that promise has clothed temples, homes, weddings,
                  and gifting houses across India. We are now opening our store to a generation
                  that asks for honesty, provenance, and the craftsmanship of Indian textiles.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-x-6 gap-y-6 md:mt-10">
                  {[
                    { n: '55+', l: 'Years of Legacy'  },
                    { n: '8',   l: 'Textile Chapters' },
                    { n: '3',   l: 'Generations'      },
                  ].map((s) => (
                    <div key={s.l}>
                      <p className="font-heading text-4xl italic text-brand sm:text-5xl">{s.n}</p>
                      <p className="eyebrow mt-1 text-[10px]">{s.l}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES (live from Odoo) ───────────────────────────────────── */}
      <section data-testid="categories-section" className="bg-paper-2 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="mb-12 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between md:gap-8">
            <div>
              <SectionLabel number="02" label="The Collections" />
              <h2 className="display-2 mt-5 text-4xl text-ink sm:text-5xl md:mt-6 md:text-6xl">
                Eight chapters of <span className="italic text-brand">Textiles.</span>
              </h2>
            </div>
            <Link href="/categories" data-testid="all-categories-link" className="eyebrow link-underline self-start md:self-end">
              View all collections →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-x-8 md:gap-y-12">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={(i % 4) * 0.08}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  data-testid={`category-tile-${c.slug}`}
                  className="group block img-zoom-host"
                >
                  <div
                    className={`relative overflow-hidden bg-bg-tertiary ${
                      i % 2 === 0 ? 'aspect-[4/5] md:aspect-[3/4]' : 'aspect-[4/5] md:aspect-square md:mt-12'
                    }`}
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      className="img-zoom h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGES[i % 3];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                      <p className="mb-1 font-accent text-sm text-gold-muted md:text-base">{c.marathi}</p>
                      <p className="font-heading text-2xl italic text-bg-primary md:text-3xl">{c.name}</p>
                    </div>
                  </div>
                  <p className="mt-3 font-sub text-sm text-ink-soft md:mt-4">{c.tagline}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS (live from Odoo) ───────────────────────────── */}
      <section data-testid="featured-section" className="py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="mb-12 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between md:gap-8">
            <div>
              <SectionLabel number="03" label="Curated for You" />
              <h2 className="display-2 mt-5 text-4xl text-ink sm:text-5xl md:mt-6 md:text-6xl">
                The Textile <span className="italic text-brand">Story.</span>
              </h2>
              <p className="mt-4 max-w-xl font-sub text-ink-soft">
                Eight of our best pieces — handpicked by our store for you this season.
              </p>
            </div>
            <Link href="/shop" data-testid="shop-all-link" className="eyebrow link-underline self-start md:self-end">
              Shop all →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-y-12 lg:grid-cols-4 lg:gap-y-16">
            {products.slice(0, 8).map((p, i) => (
              <ProductCard key={p.slug ?? i} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HERITAGE CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink text-bg-primary">
        <img src={macro} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.22 }} />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(10,8,6,0.97) 0%, rgba(10,8,6,0.88) 45%, rgba(10,8,6,0.30) 100%)' }}
        />
        <div className="relative mx-auto grid max-w-[1600px] gap-10 px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-32 lg:grid-cols-2 lg:gap-16 lg:px-24 lg:py-44">
          <div>
            <SectionLabel number="04" label="The Heritage" />
            <h2 className="display-2 mt-5 text-4xl sm:text-5xl md:mt-6 md:text-6xl lg:text-7xl">
              Solapur weaves for{' '}
              <span className="italic" style={{ color: 'rgba(212,175,90,1)' }}>India.</span>
              <br />
              We weave for{' '}
              <span className="italic" style={{ color: 'rgba(212,175,90,1)' }}>trust.</span>
            </h2>
            <p
              className="font-sub mt-6 max-w-xl text-base leading-relaxed sm:text-lg md:mt-10"
              style={{ color: 'rgba(255,255,255,0.68)' }}
            >
              From a wholesale shop in Chattigalli, Solapur in 1970, to homes and gifting houses
              across the country — this is the longer story of a family, a city, and a craft that
              built its legacy on trust.
            </p>
            <Link
              href="/heritage"
              data-testid="heritage-cta"
              className="mt-8 inline-flex items-center gap-3 font-sub text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-70 md:mt-12"
              style={{ color: 'rgba(212,175,90,0.9)' }}
            >
              Read the full story <ArrowRight size={13} />
            </Link>
          </div>
          <div className="hidden lg:block">
            <img src={editorial} alt="Heritage textiles flat lay" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── VALUE PILLARS ────────────────────────────────────────────────── */}
      <section className="bg-paper py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
          <SectionLabel number="05" label="Why Marda" />
          <h2 className="display-2 mt-5 max-w-3xl text-4xl text-ink sm:text-5xl md:mt-6 md:text-6xl">
            The reasons three generations
            <br />
            have kept coming back.
          </h2>

          <div className="mt-12 grid gap-8 sm:mt-14 md:mt-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {[
              { Icon: Hand,  label: 'Handloom-First',    text: 'Sourced from Solapuri master weavers — never machine-finished pretenders.'   },
              { Icon: Leaf,  label: 'Pure Cotton',        text: 'Combed cotton, breathable, and softens with every wash like family.'          },
              { Icon: Award, label: 'Fair Pricing',       text: 'Wholesale roots mean retail prices that feel almost too fair.'                 },
              { Icon: Truck, label: 'Pan-India Delivery', text: 'From a single bath towel to a thousand-piece retailer order — we deliver.'    },
            ].map((p, i) => (
              <Reveal key={p.label} delay={i * 0.08}>
                <div className="border-t border-line pt-6 md:pt-8">
                  <p.Icon size={26} strokeWidth={1.25} className="text-brand" />
                  <h3 className="mt-5 font-heading text-2xl italic text-ink md:mt-6">{p.label}</h3>
                  <p className="mt-3 font-sub leading-relaxed text-ink-soft">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────────────────── */}
      <section className="bg-paper-2 py-16 sm:py-20 md:py-32">
        <div className="mx-auto max-w-[1200px] px-4 text-center sm:px-6 md:px-12">
          <Sparkles className="mx-auto text-gold" size={22} />
          <p className="font-accent mt-8 text-2xl leading-snug text-brand sm:text-3xl md:mt-10 md:text-4xl">
            &quot;आजोबांच्या काळापासून आम्ही फक्त Marda कडूनच घेतो.&quot;
          </p>
          <p className="mt-5 font-heading text-2xl italic leading-snug text-ink sm:text-3xl md:mt-6 md:text-4xl">
            &quot;We have bought our family&apos;s bedsheets only from Marda — since my grandfather&apos;s time.&quot;
          </p>
          <p className="eyebrow mt-6 md:mt-8">— Apte family, Pune · customers since 1988</p>
        </div>
      </section>

      {/* ── WHOLESALE / RETAIL SPLIT ─────────────────────────────────────── */}
      <section className="overflow-hidden bg-paper">
        <div className="grid items-stretch md:grid-cols-2">
          <div className="relative overflow-hidden bg-brand px-4 py-16 text-bg-primary sm:px-6 md:px-12 md:py-24 lg:px-16 lg:py-32">
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -right-4 font-accent leading-none opacity-10 md:-bottom-10 md:-right-10"
              style={{ fontSize: 'clamp(6rem, 18vw, 14rem)' }}
            >
              घाऊक
            </span>
            <SectionLabel number="06" label="Wholesale" />
            <h3 className="display-2 mt-6 text-4xl italic sm:text-5xl md:mt-8 md:text-6xl">
              For bulk buyers and trade orders.
            </h3>
            <p className="font-sub mt-5 max-w-md leading-relaxed text-bg-primary/85 md:mt-6">
              Retailers, gifting houses, wedding planners, and exporters — our wholesale arm has
              fulfilled orders from a hundred pieces to a hundred thousand, with the same
              loom-level honesty.
            </p>
            <Link href="/wholesale" data-testid="wholesale-cta-home" className="eyebrow link-underline mt-8 inline-flex items-center gap-3 md:mt-12">
              Be our wholesale partner <ArrowRight size={14} />
            </Link>
          </div>

          <div className="relative overflow-hidden bg-paper-3 px-4 py-16 text-ink sm:px-6 md:px-12 md:py-24 lg:px-16 lg:py-32">
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -right-4 font-accent leading-none opacity-10 md:-bottom-10 md:-right-10"
              style={{ fontSize: 'clamp(6rem, 18vw, 14rem)' }}
            >
              किरकोळ
            </span>
            <SectionLabel number="07" label="Retail" />
            <h3 className="display-2 mt-6 text-4xl italic text-brand sm:text-5xl md:mt-8 md:text-6xl">
              For homes and families.
            </h3>
            <p className="font-sub mt-5 max-w-md leading-relaxed text-ink-soft md:mt-6">
              From your first bath towel to your daughter&apos;s wedding trousseau — shop the same
              heritage our wholesale partners receive, now beautifully retailed.
            </p>
            <Link href="/shop" data-testid="retail-cta-home" className="eyebrow link-underline mt-8 inline-flex items-center gap-3 text-brand md:mt-12">
              Shop the collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── VISIT US ─────────────────────────────────────────────────────── */}
      <section className="bg-paper py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <SectionLabel number="08" label="Visit Us" />
              <h2 className="display-2 mt-5 text-4xl text-ink sm:text-5xl md:mt-6 md:text-6xl">
                The store in{' '}
                <span className="italic text-brand">Chattigalli.</span>
              </h2>
              <p className="font-sub mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg md:mt-6">
                The kind of shop where time slows down — where weavers, brides, and innkeepers all
                know our name. Come visit us in Mangalwar Peth, Solapur.
              </p>

              <dl className="mt-8 space-y-4 font-sub text-sm text-ink-soft md:mt-10 md:text-base">
                <div className="flex gap-4">
                  <dt className="eyebrow w-20 shrink-0 pt-0.5 text-[10px]">Address</dt>
                  <dd className="text-ink">430, Chattigalli, Mangalwar Peth, Solapur — 413 002</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="eyebrow w-20 shrink-0 pt-0.5 text-[10px]">Hours</dt>
                  <dd className="text-ink">Mon – Sat, 9 am – 8 pm</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="eyebrow w-20 shrink-0 pt-0.5 text-[10px]">WhatsApp</dt>
                  <dd>
                    <a
                      href={whatsappLink('Hello, I would like to know more about your products.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      Chat with us →
                    </a>
                  </dd>
                </div>
              </dl>

              <a
                href={MAPS_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-directions"
                className="mt-8 inline-flex items-center gap-3 font-sub text-[11px] uppercase tracking-[0.2em] text-brand transition-opacity hover:opacity-70 md:mt-10"
              >
                Open in Google Maps <ArrowRight size={13} />
              </a>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden bg-bg-tertiary">
              <img src={editorial} alt="Marda & Sons store, Solapur" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
