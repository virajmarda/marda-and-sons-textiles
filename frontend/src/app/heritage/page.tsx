import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal, SectionLabel } from '@/components/reveal';
import { PageHero } from '@/components/page-hero';
import { ESTABLISHED } from '@/lib/api';

export default function HeritagePage() {
  const macro =
    'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/85fde45f54ca0616d6a74571cd3f6b4b0497577453850b7019bdb09ade3190b3.png';
  const editorial =
    'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/6ee061934d03a5fc78962a067d6eb5b00c915d6aee9992d61cd1ff9b93f6da20.png';
  const necklace =
    'https://images.unsplash.com/photo-1616756351484-798f37bdffa0?auto=format&fit=crop&w=1600&q=80';

  const timeline = [
    {
      y: '1970',
      t: 'The first loom',
      d: 'मर्दा ॲन्ड सन्स opens a single wholesale loom in Mangalwar Peth, Solapur — supplying handloom textiles to nearby cities.',
      img: macro,
    },
    {
      y: '1985',
      t: 'A name across Maharashtra',
      d: 'By the mid-eighties, the Marda weave reaches Mumbai, Pune, and Kolhapur. Retail traders begin to take notice.',
      img: necklace,
    },
    {
      y: '2002',
      t: 'Beyond linens',
      d: 'We expand to towels, shawls, phetas, woolen blankets, and ceremonial textiles — the looms of Solapur, in eight chapters.',
      img: editorial,
    },
    {
      y: '2018',
      t: 'Three generations',
      d: 'The third generation joins the house. The wholesale roots stay strong; a quiet retail arm begins to bloom.',
      img: macro,
    },
    {
      y: '2026',
      t: 'The atelier opens',
      d: 'Today, we open our doors to the world — retail and wholesale, in one heritage atelier.',
      img: editorial,
    },
  ];

  return (
    <div data-testid="heritage-page" className="bg-paper">
      <PageHero
        chapter="04"
        eyebrow={`The Heritage · since ${ESTABLISHED}`}
        marathi="विश्वास की परंपरा, वर्षों का साथ"
        headline={
          <>
            A family.
            <br />
            A city.
            <br />
            <span className="italic text-brand">A craft.</span>
          </>
        }
        lede={
          <>
            The story of <span className="font-brand not-italic text-ink">मर्दा ॲन्ड सन्स</span> is, in many
            ways, the story of how Solapur dressed the Indian household.
          </>
        }
        bgImage={macro}
        height="xl"
      />

      {/* Opening editorial */}
      <section className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:py-32">
        <SectionLabel number="01" label="A short history" />

        <Reveal>
          <p className="mt-8 font-heading text-2xl italic leading-[1.25] text-ink sm:text-3xl md:mt-10 md:text-4xl">
            "Long before the malls, before the brands, before the algorithms — the looms of Solapur were
            already weaving for the rest of India."
          </p>
        </Reveal>

        <p className="mt-8 text-base leading-relaxed text-ink-soft font-sub sm:mt-10 sm:text-lg">
          Solapur, a sun-bleached town in southern Maharashtra, became famous in the 19th and 20th centuries
          for one quiet thing: its textile. Cotton from the deccan plateau, water from the Bhima, and the
          patience of hundreds of weaver families — together they produced the Solapuri handloom that you
          might still find folded in your grandparents&apos; cupboard.
        </p>

        <p className="mt-5 text-base leading-relaxed text-ink-soft font-sub sm:mt-6 sm:text-lg">
          In 1970, the Marda family added their single loom to that long tradition. Three generations later,
          we are still here — quieter than the brands of Bombay, but spoken of with deeper affection.
        </p>
      </section>

      {/* Timeline */}
      <section id="looms" className="bg-paper-2 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12 lg:px-24">
          <SectionLabel number="02" label="A timeline" />
          <h2 className="display-2 mt-5 text-4xl text-ink sm:text-5xl md:mt-6 md:text-6xl">
            From a single loom <span className="italic text-brand">to an atelier.</span>
          </h2>

          <div className="mt-12 space-y-12 sm:mt-14 sm:space-y-14 md:mt-20 md:space-y-20 lg:space-y-24">
            {timeline.map((t, i) => (
              <Reveal key={t.y} delay={i * 0.05}>
                <article
                  data-testid={`timeline-${t.y}`}
                  className={`grid items-center gap-6 sm:gap-8 md:grid-cols-12 md:gap-10 ${
                    i % 2 ? 'md:[direction:rtl]' : ''
                  }`}
                >
                  <div className="md:col-span-6 [direction:ltr]">
                    <div className="relative aspect-[16/11] overflow-hidden bg-bg-tertiary img-zoom-host sm:aspect-[16/10]">
                      <img src={t.img} alt="" className="img-zoom h-full w-full object-cover" />
                    </div>
                  </div>

                  <div className="md:col-span-6 [direction:ltr]">
                    <p className="font-heading text-5xl italic text-brand sm:text-6xl md:text-7xl lg:text-8xl">
                      {t.y}
                    </p>
                    <h3 className="mt-3 font-heading text-2xl text-ink sm:text-3xl md:mt-4 md:text-4xl">
                      {t.t}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-ink-soft font-sub sm:mt-5 sm:text-lg">
                      {t.d}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12 lg:px-24">
          <SectionLabel number="03" label="Our principles" />
          <h2 className="display-2 mt-5 text-4xl text-ink sm:text-5xl md:mt-6 md:text-6xl">
            Three rules we have <span className="italic text-brand">never broken.</span>
          </h2>

          <div className="mt-12 grid gap-8 sm:mt-14 md:mt-16 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
            {[
              {
                t: 'Cotton speaks first',
                d: 'We never substitute man-made fibre to inflate margin. If it is Solapuri, it is honest.',
              },
              {
                t: 'The weaver matters',
                d: 'Every piece supports a Solapuri loom — we pay fair rates and resist machine-finish shortcuts.',
              },
              {
                t: 'Trust outlives transaction',
                d: 'A bedsheet should last twenty winters. A relationship, longer. We sell once, serve forever.',
              },
            ].map((p, i) => (
              <Reveal key={p.t} delay={i * 0.1}>
                <div className="border-t border-line pt-6 md:pt-8">
                  <p className="num-block">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-4 font-heading text-2xl italic text-ink sm:text-[1.8rem] md:text-3xl">
                    {p.t}
                  </h3>
                  <p className="mt-4 leading-relaxed text-ink-soft font-sub">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink px-4 py-16 text-center text-bg-primary sm:px-6 sm:py-20 md:py-24">
        <p className="font-accent text-2xl text-gold sm:text-3xl">सोलापूरची शान</p>
        <h2 className="display-2 mx-auto mt-5 max-w-3xl text-3xl sm:text-4xl md:mt-6 md:text-6xl">
          Come weave with us — as a home, a retailer, or a wedding party.
        </h2>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:mt-12">
          <Link
            href="/shop"
            data-testid="heritage-shop"
            className="btn-primary w-full justify-center sm:w-auto"
          >
            Shop the collection <ArrowRight size={14} />
          </Link>

          <Link
            href="/wholesale"
            data-testid="heritage-wholesale"
            className="flex w-full items-center justify-center border border-bg-primary px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-bg-primary transition-colors hover:bg-bg-primary hover:text-ink sm:w-auto"
          >
            Become a partner
          </Link>
        </div>
      </section>
    </div>
  );
}
