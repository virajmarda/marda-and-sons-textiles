'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowRight, Building2, Globe2, HeartHandshake } from 'lucide-react';
import { fetchJSON } from '@/lib/api';
import { Reveal, SectionLabel } from '@/components/reveal';
import { PageHero } from '@/components/page-hero';

const PRODUCT_OPTIONS = [
  'Towels',
  'Bedsheets',
  'Shawls',
  'Phetas',
  'Topis',
  'Lungi',
  'Woolen Blankets',
  'Chatais',
];

const QTY_RANGES = [
  '50 – 200 pieces',
  '200 – 1,000 pieces',
  '1,000 – 5,000 pieces',
  '5,000+ pieces / regular supply',
];

export default function WholesalePage() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    quantity_estimate: '',
    message: '',
  });

  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function toggle(item: string) {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      toast.error('Please share name, email and phone.');
      return;
    }

    setLoading(true);

    try {
      await fetchJSON('/api/wholesale', {
        method: 'POST',
        body: JSON.stringify({ ...form, interested_in: interests }),
      });
      toast.success('Your enquiry has reached the atelier. धन्यवाद.');
      setDone(true);
    } catch {
      toast.error('Something went wrong. Please try WhatsApp.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-testid="wholesale-page" className="bg-paper">
      <PageHero
        chapter="05"
        eyebrow="For partners · घाऊक"
        marathi="साथ पन्नास वर्षांचा"
        headline={
          <>
            Become a
            <br />
            <span className="italic text-brand">house partner.</span>
          </>
        }
        lede={
          <>
            Our wholesale roots run fifty-five years deep. Today, we extend the same loom-level honesty to
            retailers, gifting houses, exporters, and wedding curators across India and abroad.
          </>
        }
      />

      {/* Partner categories */}
      <section id="retailers" className="py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
          <SectionLabel number="01" label="Who we serve" />

          <div className="mt-12 grid gap-8 sm:mt-14 md:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {[
              {
                icon: Building2,
                t: 'Retailers & Resellers',
                d: 'Stockists, family stores, and online retailers — consistent supply, fair margins, and the trust of a 55-year house.',
                id: 'retailers',
              },
              {
                icon: HeartHandshake,
                t: 'Corporate Gifting',
                d: 'Wedding return-gift bundles, Diwali hampers, employee gifting — packaged with heritage.',
                id: 'gifting',
              },
              {
                icon: Globe2,
                t: 'Export Houses',
                d: 'GSM-certified weave, consistent supply, and documentation that clears every port.',
                id: 'export',
              },
            ].map((p, i) => (
              <Reveal key={p.t} delay={i * 0.1}>
                <div id={p.id} className="border-t border-line pt-6 md:pt-8">
                  <p.icon size={28} strokeWidth={1.2} className="text-brand" />
                  <h3 className="mt-5 font-heading text-2xl italic text-ink sm:text-[1.8rem] md:mt-6 md:text-3xl">
                    {p.t}
                  </h3>
                  <p className="mt-4 leading-relaxed text-ink-soft font-sub">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-paper-2 py-16 sm:py-20 md:py-24">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4 md:px-12 lg:px-24">
          {[
            { n: '55+', t: 'Years sourcing' },
            { n: '8', t: 'Categories' },
            { n: '12+', t: 'Cities served' },
            { n: '24h', t: 'Quote turnaround' },
          ].map((s) => (
            <div key={s.t}>
              <p className="font-heading text-4xl italic text-brand sm:text-5xl md:text-6xl lg:text-7xl">
                {s.n}
              </p>
              <p className="eyebrow mt-2 sm:mt-3">{s.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form split */}
      <section className="grid lg:grid-cols-2">
        <div className="relative overflow-hidden bg-brand px-4 py-16 text-bg-primary sm:px-6 sm:py-20 md:px-12 lg:px-16 lg:py-32">
          <span className="pointer-events-none absolute -bottom-6 -right-4 font-accent text-[22vw] leading-none opacity-10 md:-bottom-10 md:-right-10 md:text-[16vw]">
            घाऊक
          </span>

          <SectionLabel number="02" label="What you'll receive" />
          <h2 className="display-2 mt-6 text-3xl sm:text-4xl md:mt-8 md:text-5xl">
            A curated partnership.
          </h2>

          <ul className="mt-8 space-y-4 text-base text-bg-primary/85 font-sub sm:mt-10 sm:text-lg">
            <li className="diamond">Tailored price list within 24 hours</li>
            <li className="diamond">Free fabric swatches dispatched to your office</li>
            <li className="diamond">Dedicated wholesale relationship manager</li>
            <li className="diamond">Custom weaves, sizes, packaging on request</li>
            <li className="diamond">Pan-India dispatch · export documentation</li>
          </ul>

          <div className="mt-10 border-t border-bg-primary/20 pt-6 sm:mt-12 sm:pt-8">
            <p className="font-accent text-xl text-gold sm:text-2xl">"पाहिजे तितकंच, पण उत्तमच."</p>
            <p className="mt-3 text-bg-primary/80 font-sub">
              As much as you need — but only of the finest.
            </p>
          </div>
        </div>

        <div className="bg-paper px-4 py-16 sm:px-6 sm:py-20 md:px-12 lg:px-16 lg:py-32">
          <SectionLabel number="03" label="The enquiry" />

          {done ? (
            <div data-testid="wholesale-success" className="mt-12 md:mt-16">
              <p className="font-accent text-2xl text-brand sm:text-3xl">धन्यवाद 🙏</p>
              <h3 className="mt-4 font-heading text-3xl italic text-ink sm:text-4xl">
                Your enquiry has reached us.
              </h3>
              <p className="mt-4 max-w-md text-ink-soft font-sub">
                A member of the atelier will respond within one business day. Meanwhile, browse our retail
                catalog or chat with us on WhatsApp.
              </p>
              <Link
                href="/shop"
                data-testid="wholesale-back-shop"
                className="btn-primary mt-8 w-full justify-center sm:mt-10 sm:w-auto"
              >
                Back to Shop
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} data-testid="wholesale-form" className="mt-10 space-y-8 md:mt-12">
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                <input
                  className="input-line"
                  placeholder="FULL NAME *"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  data-testid="ws-name"
                />
                <input
                  className="input-line"
                  placeholder="COMPANY / STORE"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  data-testid="ws-company"
                />
                <input
                  type="email"
                  className="input-line"
                  placeholder="EMAIL *"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  data-testid="ws-email"
                />
                <input
                  className="input-line"
                  placeholder="PHONE *"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  data-testid="ws-phone"
                />
                <input
                  className="input-line sm:col-span-2"
                  placeholder="CITY / COUNTRY"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  data-testid="ws-city"
                />
              </div>

              <div>
                <p className="mb-4 eyebrow">Interested in</p>
                <div className="flex flex-wrap gap-2.5">
                  {PRODUCT_OPTIONS.map((opt) => {
                    const active = interests.includes(opt);

                    return (
                      <button
                        type="button"
                        key={opt}
                        data-testid={`ws-interest-${opt}`}
                        onClick={() => toggle(opt)}
                        className={`min-h-[44px] border px-4 py-2 text-sm transition-colors font-sub ${
                          active
                            ? 'border-ink bg-ink text-bg-primary'
                            : 'border-line text-ink hover:border-ink'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-4 eyebrow">Expected quantity</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {QTY_RANGES.map((r) => (
                    <label
                      key={r}
                      className="flex cursor-pointer items-start gap-3 rounded-sm border border-line/60 px-4 py-3 text-sm transition-colors hover:border-brand"
                    >
                      <input
                        type="radio"
                        name="qty"
                        value={r}
                        data-testid={`ws-qty-${r}`}
                        checked={form.quantity_estimate === r}
                        onChange={() => setForm({ ...form, quantity_estimate: r })}
                        className="mt-0.5 accent-brand"
                      />
                      <span className="leading-relaxed font-sub">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              <textarea
                className="input-line resize-none"
                placeholder="MESSAGE — Tell us about your needs, weave preferences, timeline…"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                data-testid="ws-message"
              />

              <button
                type="submit"
                data-testid="ws-submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Submit Enquiry'} <ArrowRight size={14} />
              </button>

              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft sm:text-[11px] sm:tracking-[0.22em]">
                We respond within 24 business hours · No spam, ever.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
