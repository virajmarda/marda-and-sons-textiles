import Link from 'next/link';
import { ArrowRight, Award, Hand, Leaf, Sparkles, Truck } from 'lucide-react';
import { Reveal, SectionLabel } from '@/components/reveal';
import { ProductCard } from '@/components/product-card';
import { getCategories, getProducts, inr, MAPS_DIRECTIONS, STORE_ADDRESS, STORE_HOURS, whatsappLink, ESTABLISHED } from '@/lib/api';

export const revalidate = 0;

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getProducts({ featured: true }).catch(() => []),
    getCategories().catch(() => []),
  ]);

  const hero = 'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/bfd7c66015eb89044445dbab3149d88f192cba8791da7bac01a5df9b37c95428.png';
  const macro = 'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/85fde45f54ca0616d6a74571cd3f6b4b0497577453850b7019bdb09ade3190b3.png';
  const editorial = 'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/6ee061934d03a5fc78962a067d6eb5b00c915d6aee9992d61cd1ff9b93f6da20.png';

  return (
    <div data-testid="home-page" className="bg-paper">
      {/* HERO */}
      <section data-testid="hero-section" className="relative min-h-[100vh] flex items-end overflow-hidden">
        <img src={hero} alt="Heritage textile boutique" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/30" />

        {/* top thread */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gold/40" />

        <div className="relative w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <Reveal>
                <p className="eyebrow text-gold-muted">Est. {ESTABLISHED} · Solapur, Maharashtra</p>
              </Reveal>
              <Reveal delay={0.15}>
                <h1 className="display-1 text-bg-primary text-[15vw] md:text-[10vw] lg:text-[8vw] mt-6">
                  Where loom<br />
                  meets <span className="text-gold not-italic font-heading italic">legacy.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.35}>
                <p className="font-accent text-gold mt-8 text-lg md:text-2xl tracking-wide">
                  विश्वास की परंपरा, वर्षों का साथ
                </p>
              </Reveal>
              <Reveal delay={0.5}>
                <p className="font-sub text-bg-primary/85 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed">
                  For fifty-five years, the looms of Solapur have woven for one family that listens. Today,
                  Marda & Sons brings that quiet mastery to your home — and to the world.
                </p>
              </Reveal>
              <Reveal delay={0.65}>
                <div className="flex flex-wrap gap-4 mt-12">
                  <Link href="/shop" data-testid="hero-shop-cta" className="btn-primary">
                    Explore the Collection <ArrowRight size={14} />
                  </Link>
                  <Link href="/wholesale" data-testid="hero-wholesale-cta" className="border border-bg-primary text-bg-primary px-7 py-4 uppercase tracking-[0.22em] text-[11px] hover:bg-bg-primary hover:text-ink transition-colors">
                    For Wholesale & Hotels
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-4 hidden lg:block">
              <Reveal delay={0.7}>
                <div className="border border-gold/40 p-8 bg-ink/40 backdrop-blur-sm">
                  <p className="eyebrow text-gold mb-4">Visiting Solapur?</p>
                  <p className="font-sub text-bg-primary/90 leading-relaxed">
                    Our atelier at <span className="italic">430, Chattigalli, Mangalwar Peth</span> has welcomed
                    three generations of patrons.
                  </p>
                  <a
                    href={MAPS_DIRECTIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="hero-directions"
                    className="inline-flex items-center gap-2 mt-6 text-gold eyebrow link-underline"
                  >
                    Get Directions <ArrowRight size={12} />
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="scroll-cue text-bg-primary/70 hidden md:block">
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* MARQUEE */}
      <section aria-hidden className="bg-ink text-bg-primary py-6 overflow-hidden border-y border-gold/20">
        <div className="marquee-track gap-12 px-4 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 shrink-0 font-heading italic text-2xl md:text-3xl">
              <span>Solapuri Chaddar</span><span className="text-gold">◆</span>
              <span className="font-accent text-gold">सोलापूरची शान</span><span className="text-gold">◆</span>
              <span>Handloom Bedsheets</span><span className="text-gold">◆</span>
              <span>Royal Phetas</span><span className="text-gold">◆</span>
              <span className="font-accent text-gold">परंपरा</span><span className="text-gold">◆</span>
              <span>Wedding Trousseau</span><span className="text-gold">◆</span>
              <span>Hotel Linens</span><span className="text-gold">◆</span>
            </div>
          ))}
        </div>
      </section>

      {/* THE HOUSE / Intro */}
      <section className="py-32 md:py-40">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-12 gap-16 items-end">
            <div className="lg:col-span-5">
              <SectionLabel number="01" label="The House" />
              <Reveal>
                <h2 className="display-2 text-5xl md:text-6xl lg:text-7xl text-ink mt-8">
                  A textile<br />house<br />
                  <span className="italic text-brand">of Solapur.</span>
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.2}>
                <p className="font-sub text-xl md:text-2xl text-ink leading-relaxed">
                  In a city that the world once dressed beds with, our family began with a single loom and a
                  single promise — that every weave would outlive its weaver.
                </p>
                <p className="text-ink-soft mt-8 leading-relaxed">
                  Five and a half decades later, that promise has clothed temples, hotels, weddings, and homes
                  across India. We are now opening our atelier to a generation that asks for honesty,
                  provenance, and the slow craft of Indian textile.
                </p>
                <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
                  <div>
                    <p className="font-heading italic text-5xl text-brand">55+</p>
                    <p className="eyebrow mt-1">Years of weaving</p>
                  </div>
                  <div>
                    <p className="font-heading italic text-5xl text-brand">8</p>
                    <p className="eyebrow mt-1">Heritage categories</p>
                  </div>
                  <div>
                    <p className="font-heading italic text-5xl text-brand">3</p>
                    <p className="eyebrow mt-1">Generations of trust</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES — editorial alternating grid */}
      <section data-testid="categories-section" className="bg-paper-2 py-32 md:py-40">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
            <div>
              <SectionLabel number="02" label="The Collections" />
              <h2 className="display-2 text-5xl md:text-6xl text-ink mt-6">
                Eight chapters of <span className="italic text-brand">Solapur.</span>
              </h2>
            </div>
            <Link href="/categories" data-testid="all-categories-link" className="eyebrow link-underline self-start md:self-end">View all collections →</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 4) * 0.08}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  data-testid={`category-tile-${c.slug}`}
                  className="group block img-zoom-host"
                >
                  <div className={`relative overflow-hidden bg-bg-tertiary ${i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square mt-0 md:mt-12'}`}>
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover img-zoom" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="font-accent text-gold-muted text-sm md:text-base mb-1">{c.marathi}</p>
                      <p className="font-heading italic text-bg-primary text-2xl md:text-3xl">{c.name}</p>
                    </div>
                  </div>
                  <p className="font-sub text-ink-soft text-sm mt-4">{c.tagline}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section data-testid="featured-section" className="py-32 md:py-40">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
            <div>
              <SectionLabel number="03" label="Curated for You" />
              <h2 className="display-2 text-5xl md:text-6xl text-ink mt-6">
                The Marda <span className="italic text-brand">Edit.</span>
              </h2>
              <p className="font-sub text-ink-soft mt-4 max-w-xl">Eight quietly extraordinary pieces — handpicked by our atelier this season.</p>
            </div>
            <Link href="/shop" data-testid="shop-all-link" className="eyebrow link-underline self-start md:self-end">Shop all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {featured.slice(0, 8).map((p, i) => (
              <ProductCard key={p.slug} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* HERITAGE STORY CTA — split with macro texture */}
      <section className="relative bg-ink text-bg-primary overflow-hidden">
        <img src={macro} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-transparent" />
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-32 md:py-44 grid lg:grid-cols-2 gap-16">
          <div>
            <SectionLabel number="04" label="The Heritage" />
            <h2 className="display-2 text-5xl md:text-6xl lg:text-7xl mt-6">
              Solapur built India's <span className="italic text-gold">beds.</span><br />
              We built its <span className="italic text-gold">trust.</span>
            </h2>
            <p className="font-sub text-bg-primary/80 text-lg mt-10 leading-relaxed max-w-xl">
              From a wholesale loom in Mangalwar Peth in 1970, to homes and hotels across the country —
              this is the longer story of a family, a city, and a craft that refused to disappear.
            </p>
            <Link href="/heritage" data-testid="heritage-cta" className="inline-flex items-center gap-3 mt-12 text-gold eyebrow link-underline">
              Read the full story <ArrowRight size={14} />
            </Link>
          </div>
          <div className="hidden lg:block">
            <img src={editorial} alt="Pheta and shawls flat lay" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* VALUE PILLARS */}
      <section className="py-32 md:py-40 bg-paper">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <SectionLabel number="05" label="Why Marda" />
          <h2 className="display-2 text-5xl md:text-6xl text-ink mt-6 max-w-3xl">
            The reasons three generations<br />have kept coming back.
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-20">
            {[
              { icon: Hand,    label: 'Handloom-First', text: 'Sourced from Solapuri master weavers — never machine-finished pretenders.' },
              { icon: Leaf,    label: 'Pure Cotton',    text: 'Combed cotton, breathable, and softens with every wash like family.' },
              { icon: Award,   label: 'Heritage Pricing', text: 'Wholesale roots mean retail prices that feel almost too fair.' },
              { icon: Truck,   label: 'Pan-India Delivery', text: 'From a single bath towel to a thousand-piece hotel order.' },
            ].map((p, i) => (
              <Reveal key={p.label} delay={i * 0.08}>
                <div className="border-t border-line pt-8">
                  <p.icon size={28} strokeWidth={1.2} className="text-brand" />
                  <h3 className="font-heading italic text-2xl text-ink mt-6">{p.label}</h3>
                  <p className="font-sub text-ink-soft mt-3 leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL EDITORIAL */}
      <section className="py-32 bg-paper-2">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center">
          <Sparkles className="text-gold mx-auto" size={22} />
          <p className="font-accent text-brand text-3xl md:text-4xl mt-10 leading-snug">
            “आजोबांच्या काळापासून आम्ही फक्त Marda कडूनच घेतो.”
          </p>
          <p className="font-heading italic text-3xl md:text-4xl text-ink mt-6 leading-snug">
            "We have bought our family's bedsheets only from Marda — since my grandfather's time."
          </p>
          <p className="eyebrow mt-8">— Apte family, Pune · patrons since 1988</p>
        </div>
      </section>

      {/* WHOLESALE / RETAIL SPLIT */}
      <section className="bg-paper">
        <div className="grid md:grid-cols-2">
          <div className="bg-brand text-bg-primary px-6 md:px-16 py-24 md:py-32 relative overflow-hidden">
            <span className="absolute -bottom-10 -right-10 font-accent text-[18vw] md:text-[10vw] opacity-10 leading-none">घाऊक</span>
            <SectionLabel number="06" label="Wholesale" />
            <h3 className="display-2 text-5xl md:text-6xl mt-8 italic">For partners of scale.</h3>
            <p className="font-sub text-bg-primary/85 mt-6 max-w-md leading-relaxed">
              Hotels, homestays, gifting houses, and exporters — our wholesale arm has fulfilled orders from
              a hundred pieces to a hundred thousand, with the same loom-level honesty.
            </p>
            <Link href="/wholesale" data-testid="wholesale-cta-home" className="inline-flex items-center gap-3 mt-12 eyebrow link-underline">
              Become a partner <ArrowRight size={14} />
            </Link>
          </div>
          <div className="bg-paper-3 text-ink px-6 md:px-16 py-24 md:py-32 relative overflow-hidden">
            <span className="absolute -bottom-10 -right-10 font-accent text-[18vw] md:text-[10vw] opacity-10 leading-none">किरकोळ</span>
            <SectionLabel number="07" label="Retail" />
            <h3 className="display-2 text-5xl md:text-6xl mt-8 italic text-brand">For homes that listen.</h3>
            <p className="font-sub text-ink-soft mt-6 max-w-md leading-relaxed">
              From your first bath towel to your daughter's wedding trousseau — shop the same heritage our
              wholesale partners receive, now beautifully retailed.
            </p>
            <Link href="/shop" data-testid="retail-cta-home" className="inline-flex items-center gap-3 mt-12 eyebrow link-underline text-brand">
              Shop the collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* VISIT US */}
      <section className="py-32 md:py-40 bg-paper">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel number="08" label="Visit Us" />
              <h2 className="display-2 text-5xl md:text-6xl text-ink mt-6">
                The atelier in <span className="italic text-brand">Chattigalli.</span>
              </h2>
              <p className="font-sub text-ink-soft mt-6 leading-relaxed text-lg max-w-xl">
                The kind of shop where time slows down — where weavers, brides, and innkeepers all sit on
                the same takhat with chai.
              </p>
              <ul className="mt-10 space-y-4 font-sub text-ink">
                <li className="flex gap-3"><span className="num-block w-8 shrink-0">01</span>{STORE_ADDRESS}</li>
                <li className="flex gap-3"><span className="num-block w-8 shrink-0">02</span>{STORE_HOURS}</li>
                <li className="flex gap-3"><span className="num-block w-8 shrink-0">03</span>+91 94224 60420 · WhatsApp friendly</li>
              </ul>
              <div className="flex gap-4 flex-wrap mt-12">
                <a href={MAPS_DIRECTIONS} target="_blank" rel="noopener noreferrer" data-testid="home-directions" className="btn-primary">Get Directions</a>
                <a href={whatsappLink('Hello Marda & Sons, I would like to visit your store.')} target="_blank" rel="noopener noreferrer" data-testid="home-whatsapp" className="btn-ghost">Chat on WhatsApp</a>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <iframe
                title="Marda & Sons map"
                src="https://www.google.com/maps?q=Marda+%26+Sons+Chattigalli+Mangalwar+Peth+Solapur&output=embed"
                width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
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
