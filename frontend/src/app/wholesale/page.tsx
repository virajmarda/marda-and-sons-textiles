'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Building2, Globe2, HeartHandshake, ArrowRight } from 'lucide-react';
import { fetchJSON } from '@/lib/api';
import { Reveal, SectionLabel } from '@/components/reveal';

const PRODUCT_OPTIONS = [
  'Towels', 'Bedsheets', 'Shawls', 'Phetas', 'Topis', 'Lungi', 'Woolen Blankets', 'Chatais',
];

const QTY_RANGES = [
  '50 – 200 pieces',
  '200 – 1,000 pieces',
  '1,000 – 5,000 pieces',
  '5,000+ pieces / regular supply',
];

export default function WholesalePage() {
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', city: '',
    quantity_estimate: '', message: '',
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function toggle(item: string) {
    setInterests((p) => (p.includes(item) ? p.filter((x) => x !== item) : [...p, item]));
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
      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div aria-hidden className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-brand/[0.06] blur-3xl pointer-events-none" />
        <div aria-hidden className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-gold/[0.07] blur-3xl pointer-events-none" />
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <p className="eyebrow text-brand">For partners · घाऊक</p>
          <h1 className="display-1 text-6xl md:text-8xl lg:text-[9rem] text-ink mt-6 leading-[0.95]">
            Become a<br />
            <span className="italic text-brand">house partner.</span>
          </h1>
          <p className="font-accent text-brand mt-8 text-2xl md:text-3xl">साथ पन्नास वर्षांचा</p>
          <p className="font-sub text-ink-soft text-lg mt-6 max-w-2xl">
            Our wholesale roots run fifty-five years deep. Today, we extend the same loom-level honesty to
            retailers, gifting houses, exporters, and wedding curators across India and abroad.
          </p>
        </div>
      </section>

      {/* Partner categories */}
      <section id="retailers" className="py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <SectionLabel number="01" label="Who we serve" />
          <div className="grid md:grid-cols-3 gap-10 mt-16">
            {[
              { icon: Building2, t: 'Retailers & Resellers', d: 'Stockists, family stores, and online retailers — consistent supply, fair margins, and the trust of a 55-year house.', id: 'retailers' },
              { icon: HeartHandshake, t: 'Corporate Gifting', d: 'Wedding return-gift bundles, Diwali hampers, employee gifting — packaged with heritage.', id: 'gifting' },
              { icon: Globe2, t: 'Export Houses', d: 'GSM-certified weave, consistent supply, and documentation that clears every port.', id: 'export' },
            ].map((p, i) => (
              <Reveal key={p.t} delay={i * 0.1}>
                <div id={p.id} className="border-t border-line pt-8">
                  <p.icon size={28} strokeWidth={1.2} className="text-brand" />
                  <h3 className="font-heading italic text-3xl text-ink mt-6">{p.t}</h3>
                  <p className="font-sub text-ink-soft mt-4 leading-relaxed">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-paper-2 py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 grid md:grid-cols-4 gap-8">
          {[
            { n: '55+', t: 'Years sourcing' },
            { n: '8', t: 'Categories' },
            { n: '12+', t: 'Cities served' },
            { n: '24h', t: 'Quote turnaround' },
          ].map((s) => (
            <div key={s.t} className="text-center">
              <p className="font-heading italic text-6xl md:text-7xl text-brand">{s.n}</p>
              <p className="eyebrow mt-3">{s.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FORM (split) */}
      <section className="grid lg:grid-cols-2">
        <div className="bg-brand text-bg-primary px-6 md:px-16 py-24 lg:py-32 relative overflow-hidden">
          <span className="absolute -bottom-10 -right-10 font-accent text-[16vw] opacity-10 leading-none">घाऊक</span>
          <SectionLabel number="02" label="What you'll receive" />
          <h2 className="display-2 text-4xl md:text-5xl mt-8">A curated partnership.</h2>
          <ul className="font-sub text-bg-primary/85 mt-10 space-y-4 text-lg">
            <li className="diamond">Tailored price list within 24 hours</li>
            <li className="diamond">Free fabric swatches dispatched to your office</li>
            <li className="diamond">Dedicated wholesale relationship manager</li>
            <li className="diamond">Custom weaves, sizes, packaging on request</li>
            <li className="diamond">Pan-India dispatch · export documentation</li>
          </ul>
          <div className="mt-12 border-t border-bg-primary/20 pt-8">
            <p className="font-accent text-gold text-2xl">"पाहिजे तितकंच, पण उत्तमच."</p>
            <p className="font-sub text-bg-primary/80 mt-3">As much as you need — but only of the finest.</p>
          </div>
        </div>

        <div className="px-6 md:px-16 py-24 lg:py-32 bg-paper">
          <SectionLabel number="03" label="The enquiry" />
          {done ? (
            <div data-testid="wholesale-success" className="mt-16">
              <p className="font-accent text-brand text-3xl">धन्यवाद 🙏</p>
              <h3 className="font-heading italic text-4xl text-ink mt-4">Your enquiry has reached us.</h3>
              <p className="font-sub text-ink-soft mt-4 max-w-md">
                A member of the atelier will respond within one business day. Meanwhile, browse our retail
                catalog or chat with us on WhatsApp.
              </p>
              <Link href="/shop" data-testid="wholesale-back-shop" className="btn-primary mt-10">Back to Shop</Link>
            </div>
          ) : (
            <form onSubmit={submit} data-testid="wholesale-form" className="mt-12 space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <input className="input-line" placeholder="FULL NAME *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="ws-name" />
                <input className="input-line" placeholder="COMPANY / STORE" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} data-testid="ws-company" />
                <input type="email" className="input-line" placeholder="EMAIL *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="ws-email" />
                <input className="input-line" placeholder="PHONE *" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="ws-phone" />
                <input className="input-line sm:col-span-2" placeholder="CITY / COUNTRY" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} data-testid="ws-city" />
              </div>

              <div>
                <p className="eyebrow mb-4">Interested in</p>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      data-testid={`ws-interest-${opt}`}
                      onClick={() => toggle(opt)}
                      className={`px-4 py-2 text-sm font-sub border ${
                        interests.includes(opt) ? 'bg-ink text-bg-primary border-ink' : 'border-line text-ink hover:border-ink'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="eyebrow mb-4">Expected quantity</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {QTY_RANGES.map((r) => (
                    <label key={r} className="flex items-center gap-3 text-sm font-sub cursor-pointer">
                      <input
                        type="radio"
                        name="qty"
                        value={r}
                        data-testid={`ws-qty-${r}`}
                        checked={form.quantity_estimate === r}
                        onChange={() => setForm({ ...form, quantity_estimate: r })}
                        className="accent-brand"
                      />
                      <span>{r}</span>
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
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                We respond within 24 business hours · No spam, ever.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
