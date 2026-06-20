import Link from 'next/link';
import { ArrowRight, Award, Hand, Leaf, Sparkles, Truck } from 'lucide-react';
import { Reveal, SectionLabel } from '@/components/reveal';
import { ProductCard } from '@/components/product-card';
import {
  getCategories,
  getProducts,
  MAPS_DIRECTIONS,
  STORE_ADDRESS,
  STORE_HOURS,
  whatsappLink,
} from '@/lib/api';

export const revalidate = 0;

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getProducts({ featured: true }).catch(() => []),
    getCategories().catch(() => []),
  ]);

  const hero =
    'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/bfd7c66015eb89044445dbab3149d88f192cba8791da7bac01a5df9b37c95428.png';
  const macro =
    'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/85fde45f54ca0616d6a74571cd3f6b4b0497577453850b7019bdb09ade3190b3.png';
  const editorial =
    'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/6ee061934d03a5fc78962a067d6eb5b00c915d6aee9992d61cd1ff9b93f6da20.png';

  return (
    <div data-testid="home-page" className="bg-paper">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        data-testid="hero-section"
        className="relative flex min-h-[100svh] items-end overflow-hidden"
      >
        {/* Background */}
        <img
          src={hero}
          alt="Solapur handloom textiles"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ transform: 'scale(1.04)', transformOrigin: 'center' }}
        />

        {/* Layered overlays for depth + legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,8,6,0.97) 0%, rgba(10,8,6,0.80) 32%, rgba(10,8,6,0.42) 60%, rgba(10,8,6,0.18) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(10,8,6,0.82) 0%, rgba(10,8,6,0.30) 55%, transparent 100%)',
          }}
        />

        {/* Top gold rule */}
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        {/* Vertical side label */}
        <div
          aria-hidden
          className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
          style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.4)' }}
        >
          <span className="font-sub text-[10px] uppercase tracking-[0.2em]">Est. 1970</span>
          <span
            className="h-16 w-px"
            style={{ background: 'rgba(212,175,90,0.4)', writingMode: 'horizontal-tb' }}
          />
          <span className="font-sub text-[10px] uppercase tracking-[0.2em]">Solapur · India</span>
        </div>

        {/* Hero content */}
        <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-12 pt-28 sm:px-6 sm:pb-20 sm:pt-40 md:px-12 md:pb-28 md:pt-48 lg:px-24 lg:pb-32 lg:pt-56">
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">

            {/* Left: headline block */}
            <div className="lg:col-span-8">
              {/* Chapter marker */}
              <Reveal delay={0.05}>
                <div className="mb-6 flex items-center gap-3 sm:gap-4 md:mb-8">
                  <span
                    className="font-heading text-4xl italic leading-none sm:text-5xl md:text-6xl"
                    style={{ color: 'rgba(212,175,90,0.9)' }}
                  >
                    01
                  </span>
                  <span
                    className="h-px w-10 sm:w-14"
                    style={{ background: 'rgba(212,175,90,0.6)' }}
                  />
                  <span
                    className="font-sub text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    Chapter
                  </span>
                </div>
              </Reveal>

              {/* Brand name in Devanagari */}
              <Reveal delay={0.12}>
                <p
                  className="font-accent mb-4 text-base uppercase tracking-[0.18em] sm:text-lg md:mb-5"
                  style={{ color: 'rgba(212,175,90,0.75)' }}
                >
                  मर्दा ॲन्ड सन्स
                </p>
              </Reveal>

              {/* Main headline */}
              <Reveal delay={0.18}>
                <h1
                  className="font-heading font-normal leading-[0.92] text-white"
                  style={{ fontSize: 'clamp(2.4rem, 8.5vw, 7.5rem)' }}
                >
                  All-in-one
                  <br />
                  Textile{' '}
                  <em
                    className="not-italic"
                    style={{ color: 'rgba(212,175,90,1)' }}
                  >
                    Destination.
                  </em>
                </h1>
              </Reveal>

              {/* Marathi tagline */}
              <Reveal delay={0.32}>
                <p
                  className="font-accent mt-5 text-base tracking-wide sm:mt-6 sm:text-lg md:text-xl"
                  style={{ color: 'rgba(212,175,90,0.8)' }}
                >
                  विश्वास की परंपरा, वर्षों का साथ
                </p>
              </Reveal>

              {/* Lede */}
              <Reveal delay={0.44}>
                <p
                  className="font-sub mt-5 max-w-xl text-base leading-relaxed sm:max-w-2xl sm:text-lg md:mt-6 md:text-xl"
                  style={{ color: 'rgba(255,255,255,0.72)' }}
                >
                  For fifty-five years, the looms of Solapur have woven for one family that listens.
                  Today,{' '}
                  <span
                    className="font-brand not-italic"
                    style={{ color: 'rgba(212,175,90,0.9)' }}
                  >
                    मर्दा ॲन्ड सन्स
                  </span>{' '}
                  brings that craft and care into your home — and into the world.
                </p>
              </Reveal>

              {/* CTAs */}
              <Reveal delay={0.58}>
                <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4 md:mt-12">
                  <Link
                    href="/shop"
                    data-testid="hero-shop-cta"
                    className="btn-primary w-full justify-center sm:w-auto"
                  >
                    Explore the Collection <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/wholesale"
                    data-testid="hero-wholesale-cta"
                    className="flex w-full items-center justify-center border px-6 py-4 text-[11px] uppercase tracking-[0.22em] transition-colors sm:w-auto sm:px-7"
                    style={{
                      borderColor: 'rgba(255,255,255,0.45)',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    }}
                  >
                    For Wholesale Partners
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right: visiting card */}
            <div className="lg:col-span-4">
              <Reveal delay={0.68}>
                <div
                  className="p-7 sm:p-8 backdrop-blur-sm"
                  style={{
                    border: '1px solid rgba(212,175,90,0.35)',
                    background: 'rgba(10,8,6,0.52)',
                  }}
                >
                  <p
                    className="font-sub mb-1 text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: 'rgba(212,175,90,0.7)' }}
                  >
                    Visiting Solapur?
                  </p>
                  <p
                    className="font-sub mt-3 text-sm leading-relaxed sm:text-base"
                    style={{ color: 'rgba(255,255,255,0.82)' }}
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
                    style={{ color: 'rgba(212,175,90,0.9)' }}
                  >
                    Get Directions <ArrowRight size={12} />
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Divider ornament */}
          <div className="relative mt-14 sm:mt-16 md:mt-20" aria-hidden>
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-xs"
              style={{ color: 'rgba(212,175,90,0.6)' }}
            >
              ◆
            </span>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="scroll-cue hidden md:block"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <section
        aria-hidden
        className="overflow-hidden border-y border-gold/20 bg-ink py-4 text-bg-primary sm:py-5 md:py-6"
      >
        <div className="marquee-track whitespace-nowrap gap-8 px-4 sm:gap-10 md:gap-12">
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
                    { n: '55+', l: 'Years of Legacy' },
                    { n: '8',   l: 'Textile Chapters' },
                    { n: '3',   l: 'Generations' },
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

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section data-testid="categories-section" className="bg-paper-2 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="mb-12 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between md:gap-8">
            <div>
              <SectionLabel number="02" label="The Collections" />
              <h2 className="display-2 mt-5 text-4xl text-ink sm:text-5xl md:mt-6 md:text-6xl">
                Eight chapters of <span className="italic text-brand">Textiles.</span>
              </h2>
            </div>
            <Link
              href="/categories"
              data-testid="all-categories-link"
              className="eyebrow link-underline self-start md:self-end"
            >
              View all collections →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-x-8 md:gap-y-12">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 4) * 0.08}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  data-testid={`category-tile-${c.slug}`}
                  className="group block img-zoom-host"
                >
                  <div
                    className={`relative overflow-hidden bg-bg-tertiary ${
                      i % 2 === 0
                        ? 'aspect-[4/5] md:aspect-[3/4]'
                        : 'aspect-[4/5] md:aspect-square md:mt-12'
                    }`}
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      className="img-zoom h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                      <p className="mb-1 font-accent text-sm text-gold-muted md:text-base">
                        {c.marathi}
                      </p>
                      <p className="font-heading text-2xl italic text-bg-primary md:text-3xl">
                        {c.name}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 font-sub text-sm text-ink-soft md:mt-4">{c.tagline}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
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
            <Link
              href="/shop"
              data-testid="shop-all-link"
              className="eyebrow link-underline self-start md:self-end"
            >
              Shop all →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-y-12 lg:grid-cols-4 lg:gap-y-16">
            {featured.slice(0, 8).map((p, i) => (
              <ProductCard key={p.slug} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HERITAGE STORY CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink text-bg-primary">
        <img
          src={macro}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.22 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(10,8,6,0.97) 0%, rgba(10,8,6,0.88) 45%, rgba(10,8,6,0.30) 100%)',
          }}
        />
        <div className="relative mx-auto grid max-w-[1600px] gap-10 px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-32 lg:grid-cols-2 lg:gap-16 lg:px-24 lg:py-44">
          <div>
            <SectionLabel number="04" label="The Heritage" />
            <h2 className="display-2 mt-5 text-4xl sm:text-5xl md:mt-6 md:text-6xl lg:text-7xl">
              Solapur weaves for{' '}
              <span className="italic" style={{ color: 'rgba(212,175,90,1)' }}>
                India.
              </span>
              <br />
              We weave for{' '}
              <span className="italic" style={{ color: 'rgba(212,175,90,1)' }}>
                trust.
              </span>
            </h2>
            <p
              className="font-sub mt-6 max-w-xl text-base leading-relaxed sm:text-lg md:mt-10"
              style={{ color: 'rgba(255,255,255,0.68)' }}
            >
              From a wholesale shop in Chattigalli, Solapur in 1970, to homes and gifting houses
              across the country — this is the longer story of a family, a city, and a craft that
              built its legacy.
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
            <img
              src={editorial}
              alt="Pheta and shawls flat lay"
              className="h-full w-full object-cover"
            />
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
              {
                Icon: Hand,
                label: 'Handloom-First',
                text: 'Sourced from Solapuri master weavers — never machine-finished pretenders.',
              },
              {
                Icon: Leaf,
                label: 'Pure Cotton',
                text: 'Combed cotton, breathable, and softens with every wash like family.',
              },
              {
                Icon: Award,
                label: 'Fair Pricing',
                text: 'Wholesale roots mean retail prices that feel almost too fair.',
              },
              {
                Icon: Truck,
                label: 'Pan-India Delivery',
                text: 'From a single bath towel to a thousand-piece retailer order.',
              },
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
            "आजोबांच्या काळापासून आम्ही फक्त Marda कडूनच घेतो."
          </p>
          <p className="mt-5 font-heading text-2xl italic leading-snug text-ink sm:text-3xl md:mt-6 md:text-4xl">
            "We have bought our family's bedsheets only from Marda — since my grandfather's time."
          </p>
          <p className="eyebrow mt-6 md:mt-8">— Apte family, Pune · customers since 1988</p>
        </div>
      </section>

      {/* ── WHOLESALE / RETAIL SPLIT ─────────────────────────────────────── */}
      <section className="overflow-hidden bg-paper">
        <div className="grid items-stretch md:grid-cols-2">
          {/* Wholesale */}
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
            <Link
              href="/wholesale"
              data-testid="wholesale-cta-home"
              className="eyebrow link-underline mt-8 inline-flex items-center gap-3 md:mt-12"
            >
              Be our wholesale partner <ArrowRight size={14} />
            </Link>
          </div>

          {/* Retail */}
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
              From your first bath towel to your daughter's wedding trousseau — shop the same
              heritage our wholesale partners receive, now beautifully retailed.
            </p>
            <Link
              href="/shop"
              data-testid="retail-cta-home"
              className="eyebrow link-underline mt-8 inline-flex items-center gap-3 text-brand md:mt-12"
            >
              Shop the collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── VISIT US ─────────────────────────────────────────────────────── */}
      <section className="bg-paper py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-16">
            <div className="lg:flex lg:flex-col lg:justify-center">
              <SectionLabel number="08" label="Visit Us" />
              <h2 className="display-2 mt-5 text-4xl text-ink sm:text-5xl md:mt-6 md:text-6xl">
                The store in{' '}
                <span className="italic text-brand">Chattigalli.</span>
              </h2>
              <p className="font-sub mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg md:mt-6">
                The kind of shop where time slows down — where weavers, brides, and innkeepers all
                sit on the same takhat with chai.
              </p>

              <ul className="mt-8 space-y-4 font-sub text-ink md:mt-10">
                <li className="flex gap-3">
                  <span className="num-block w-8 shrink-0">01</span>
                  {STORE_ADDRESS}
                </li>
                <li className="flex gap-3">
                  <span className="num-block w-8 shrink-0">02</span>
                  {STORE_HOURS}
                </li>
                <li className="flex gap-3">
                  <span className="num-block w-8 shrink-0">03</span>
                  +91 94224 60420 · WhatsApp friendly
                </li>
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-12 md:gap-4">
                <a
                  href={MAPS_DIRECTIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="home-directions"
                  className="btn-primary w-full justify-center sm:w-auto"
                >
                  Get Directions
                </a>
                <a
                  href={whatsappLink(
                    'Hello मर्दा ॲन्ड सन्स, I would like to visit your store.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="home-whatsapp"
                  className="btn-ghost w-full justify-center sm:w-auto"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="relative mt-10 aspect-[4/5] min-h-[320px] overflow-hidden rounded-2xl shadow-lg sm:mt-14 sm:aspect-[16/9] lg:mt-0 lg:aspect-auto lg:h-full">
              <iframe
                title="Marda & Sons map"
                src="https://www.google.com/maps?q=Marda+%26+Sons+Chattigalli+Mangalwar+Peth+Solapur&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
                data-testid="home-map-embed"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
