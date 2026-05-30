import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCategories, getProducts } from '@/lib/api';
import { Reveal, SectionLabel } from '@/components/reveal';
import { PageHero } from '@/components/page-hero';

export const revalidate = 0;

export default async function CategoriesPage() {
  const cats = await getCategories().catch(() => []);
  const productsAll = await getProducts({}).catch(() => []);

  const countFor = (slug: string) => productsAll.filter((p) => p.category === slug).length;

  return (
    <div data-testid="categories-page" className="bg-paper">
      <PageHero
        chapter="03"
        eyebrow="The Collections · संग्रह"
        marathi="आठ अध्याय, एक परंपरा"
        headline={
          <>
            Eight chapters.
            <br />
            <span className="italic text-brand">One Solapur.</span>
          </>
        }
        lede={
          <>
            A complete map of our atelier — from the woolen blankets and bedsheets that made Solapur famous,
            to the phetas that crown our weddings, to the chatais that quiet our floors.
          </>
        }
      />

      <section className="pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="mx-auto max-w-[1600px] space-y-12 px-4 sm:space-y-14 sm:px-6 md:space-y-18 md:px-12 lg:space-y-24 lg:px-24">
          {cats.map((c, i) => {
            const flipped = i % 2 === 1;

            return (
              <Reveal key={c.slug}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  data-testid={`category-row-${c.slug}`}
                  className={`group grid items-center gap-6 img-zoom-host sm:gap-8 md:grid-cols-12 md:gap-10 ${
                    flipped ? 'md:[direction:rtl]' : ''
                  }`}
                >
                  <div className="md:col-span-7 [direction:ltr]">
                    <div className="relative aspect-[16/11] overflow-hidden bg-bg-secondary sm:aspect-[16/10]">
                      <img src={c.image} alt={c.name} className="img-zoom h-full w-full object-cover" />
                      <div className="eyebrow absolute left-4 top-4 bg-bg-primary/90 px-3 py-1 text-ink backdrop-blur sm:left-5 sm:top-5">
                        {String(i + 1).padStart(2, '0')} / {String(cats.length).padStart(2, '0')}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 [direction:ltr]">
                    <p className="font-accent text-xl text-brand sm:text-2xl md:text-3xl">{c.marathi}</p>
                    <h2 className="display-2 mt-2 text-4xl text-ink sm:text-5xl md:text-6xl">{c.name}</h2>
                    <p className="mt-3 text-base italic text-ink-soft font-sub sm:mt-4 sm:text-lg">
                      {c.tagline}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8 sm:gap-6">
                      <span className="num-block">{countFor(c.slug)} pieces</span>
                      <span className="h-px w-12 bg-gold sm:w-16" />
                      <span className="eyebrow link-underline inline-flex items-center gap-2 text-ink">
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
      <section className="bg-ink px-4 py-16 text-center text-bg-primary sm:px-6 sm:py-20 md:py-24">
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel number="09" label="Atelier Service" />
          <h2 className="display-2 mt-5 text-3xl sm:text-4xl md:mt-6 md:text-6xl">
            Can&apos;t find what you&apos;re imagining?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-bg-primary/80 font-sub sm:mt-6 sm:text-lg">
            We custom-loom bedsheet sets, woolen blanket bundles, wedding curations, and corporate gifting
            at scale. Tell us your dream, and we&apos;ll weave it.
          </p>
          <Link
            href="/wholesale"
            data-testid="categories-cta"
            className="eyebrow mt-8 inline-flex items-center gap-3 border-b border-gold pb-1 text-gold sm:mt-10"
          >
            Begin a custom enquiry <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
