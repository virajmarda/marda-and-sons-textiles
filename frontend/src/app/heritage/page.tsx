import { Reveal, SectionLabel } from '@/components/reveal';
import { ESTABLISHED } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeritagePage() {
  const macro = 'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/85fde45f54ca0616d6a74571cd3f6b4b0497577453850b7019bdb09ade3190b3.png';
  const editorial = 'https://static.prod-images.emergentagent.com/jobs/bc89c642-8773-4d1c-aaf6-c53217394bb7/images/6ee061934d03a5fc78962a067d6eb5b00c915d6aee9992d61cd1ff9b93f6da20.png';
  const necklace = 'https://images.unsplash.com/photo-1616756351484-798f37bdffa0?auto=format&fit=crop&w=1600&q=80';

  const timeline = [
    { y: '1970', t: 'The first loom', d: 'मर्दा ॲन्ड सन्स opens a single wholesale loom in Mangalwar Peth, Solapur — supplying handloom textiles to nearby cities.', img: macro },
    { y: '1985', t: 'A name across Maharashtra', d: 'By the mid-eighties, the Marda weave reaches Mumbai, Pune, and Kolhapur. Retail traders begin to take notice.', img: necklace },
    { y: '2002', t: 'Beyond linens', d: 'We expand to towels, shawls, phetas, woolen blankets, and ceremonial textiles — the looms of Solapur, in eight chapters.', img: editorial },
    { y: '2018', t: 'Three generations', d: 'The third generation joins the house. The wholesale roots stay strong; a quiet retail arm begins to bloom.', img: macro },
    { y: '2026', t: 'The atelier opens', d: 'Today, we open our doors to the world — retail and wholesale, in one heritage atelier.', img: editorial },
  ];

  return (
    <div data-testid="heritage-page" className="bg-paper">
      {/* Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <img src={macro} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/80 to-paper" />
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <p className="eyebrow">The Heritage · since {ESTABLISHED}</p>
          <h1 className="display-1 text-6xl md:text-8xl lg:text-[10rem] text-ink mt-6 leading-[0.95]">
            A family.<br />
            A city.<br />
            <span className="italic text-brand">A craft.</span>
          </h1>
          <p className="font-accent text-brand mt-10 text-2xl md:text-3xl">विश्वास की परंपरा, वर्षों का साथ</p>
          <p className="font-sub text-ink-soft text-lg mt-6 max-w-2xl">
            The story of <span className="font-brand text-ink not-italic">मर्दा ॲन्ड सन्स</span> is, in many ways, the story of how Solapur dressed
            the Indian household.
          </p>
        </div>
      </section>

      {/* Opening editorial */}
      <section className="py-24 md:py-32 max-w-[1100px] mx-auto px-6">
        <SectionLabel number="01" label="A short history" />
        <Reveal>
          <p className="font-heading italic text-3xl md:text-4xl text-ink leading-[1.25] mt-10">
            "Long before the malls, before the brands, before the algorithms — the looms of Solapur were
            already weaving for the rest of India."
          </p>
        </Reveal>
        <p className="font-sub text-ink-soft text-lg mt-10 leading-relaxed">
          Solapur, a sun-bleached town in southern Maharashtra, became famous in the 19th and 20th centuries
          for one quiet thing: its textile. Cotton from the deccan plateau, water from the Bhima, and the
          patience of hundreds of weaver families — together they produced the Solapuri handloom that you
          might still find folded in your grandparents' cupboard.
        </p>
        <p className="font-sub text-ink-soft text-lg mt-6 leading-relaxed">
          In 1970, the Marda family added their single loom to that long tradition. Three generations
          later, we are still here — quieter than the brands of Bombay, but spoken of with deeper affection.
        </p>
      </section>

      {/* TIMELINE */}
      <section id="looms" className="bg-paper-2 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <SectionLabel number="02" label="A timeline" />
          <h2 className="display-2 text-5xl md:text-6xl text-ink mt-6">From a single loom <span className="italic text-brand">to an atelier.</span></h2>

          <div className="mt-20 space-y-16 md:space-y-24">
            {timeline.map((t, i) => (
              <Reveal key={t.y} delay={i * 0.05}>
                <article
                  data-testid={`timeline-${t.y}`}
                  className={`grid md:grid-cols-12 gap-10 items-center ${i % 2 ? 'md:[direction:rtl]' : ''}`}
                >
                  <div className="md:col-span-6 [direction:ltr]">
                    <div className="relative aspect-[16/10] overflow-hidden bg-bg-tertiary img-zoom-host">
                      <img src={t.img} alt="" className="w-full h-full object-cover img-zoom" />
                    </div>
                  </div>
                  <div className="md:col-span-6 [direction:ltr]">
                    <p className="font-heading italic text-7xl md:text-8xl text-brand">{t.y}</p>
                    <h3 className="font-heading text-3xl md:text-4xl text-ink mt-4">{t.t}</h3>
                    <p className="font-sub text-ink-soft mt-5 text-lg leading-relaxed">{t.d}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <SectionLabel number="03" label="Our principles" />
          <h2 className="display-2 text-5xl md:text-6xl text-ink mt-6">
            Three rules we have <span className="italic text-brand">never broken.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12 mt-16">
            {[
              { t: 'Cotton speaks first', d: 'We never substitute man-made fibre to inflate margin. If it is Solapuri, it is honest.' },
              { t: 'The weaver matters', d: 'Every piece supports a Solapuri loom — we pay fair rates and resist machine-finish shortcuts.' },
              { t: 'Trust outlives transaction', d: 'A bedsheet should last twenty winters. A relationship, longer. We sell once, serve forever.' },
            ].map((p, i) => (
              <Reveal key={p.t} delay={i * 0.1}>
                <div className="border-t border-line pt-8">
                  <p className="num-block">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="font-heading italic text-3xl text-ink mt-4">{p.t}</h3>
                  <p className="font-sub text-ink-soft mt-4 leading-relaxed">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-bg-primary py-24 text-center">
        <p className="font-accent text-gold text-3xl">सोलापूरची शान</p>
        <h2 className="display-2 text-4xl md:text-6xl mt-6 max-w-3xl mx-auto px-6">
          Come weave with us — as a home, a retailer, or a wedding party.
        </h2>
        <div className="mt-12 flex justify-center gap-4 flex-wrap px-6">
          <Link href="/shop" data-testid="heritage-shop" className="btn-primary">Shop the collection <ArrowRight size={14} /></Link>
          <Link href="/wholesale" data-testid="heritage-wholesale" className="border border-bg-primary text-bg-primary px-7 py-4 uppercase tracking-[0.22em] text-[11px] hover:bg-bg-primary hover:text-ink transition-colors">Become a partner</Link>
        </div>
      </section>
    </div>
  );
}
