import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/api';
import { Reveal, SectionLabel } from '@/components/reveal';
import { ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function CategoriesPage() {
  const cats = await getCategories().catch(() => []);
  const productsAll = await getProducts({}).catch(() => []);

  const countFor = (slug: string) => productsAll.filter((p) => p.category === slug).length;

  return (
    <div data-testid="categories-page" className="bg-paper">
      {/* Hero */}
      <section className="pt-40 pb-20 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <p className="eyebrow">The Collections · संग्रह</p>
        <h1 className="display-1 text-6xl md:text-8xl lg:text-9xl text-ink mt-6">
          Eight chapters.<br />
          <span className="italic text-brand">One Solapur.</span>
        </h1>
        <p className="font-sub text-ink-soft text-lg mt-8 max-w-2xl">
          A complete map of our atelier — from the chaddars that made Solapur famous, to the phetas that crown
          our weddings, to the chatais that quiet our floors.
        </p>
      </section>

      <section className="pb-32">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 space-y-24">
          {cats.map((c, i) => {
            const flipped = i % 2 === 1;
            return (
              <Reveal key={c.slug}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  data-testid={`category-row-${c.slug}`}
                  className={`grid md:grid-cols-12 gap-10 items-center group img-zoom-host ${flipped ? 'md:[direction:rtl]' : ''}`}
                >
                  <div className={`md:col-span-7 [direction:ltr]`}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-bg-secondary">
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover img-zoom" />
                      <div className="absolute top-5 left-5 bg-bg-primary/90 backdrop-blur px-3 py-1 eyebrow text-ink">
                        {String(i + 1).padStart(2, '0')} / {String(cats.length).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-5 [direction:ltr]">
                    <p className="font-accent text-brand text-2xl md:text-3xl">{c.marathi}</p>
                    <h2 className="display-2 text-5xl md:text-6xl text-ink mt-2">{c.name}</h2>
                    <p className="font-sub text-ink-soft text-lg italic mt-4">{c.tagline}</p>
                    <div className="flex items-center gap-6 mt-8">
                      <span className="num-block">{countFor(c.slug)} pieces</span>
                      <span className="w-16 h-px bg-gold" />
                      <span className="inline-flex items-center gap-2 text-ink eyebrow link-underline">
                        Explore <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-bg-primary py-24 text-center">
        <div className="max-w-[1100px] mx-auto px-6">
          <SectionLabel number="09" label="Atelier Service" />
          <h2 className="display-2 text-4xl md:text-6xl mt-6">
            Can't find what you're imagining?
          </h2>
          <p className="font-sub text-bg-primary/80 mt-6 max-w-2xl mx-auto">
            We custom-loom bedsheet sets, hotel linens, wedding bundles, and corporate gifting at scale. Tell us
            your dream, and we'll weave it.
          </p>
          <Link href="/wholesale" data-testid="categories-cta" className="inline-flex items-center gap-3 mt-10 text-gold border-b border-gold pb-1 eyebrow">
            Begin a custom enquiry <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
