'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import {
  fetchJSON, MAPS_DIRECTIONS, MAPS_EMBED_SRC, STORE_ADDRESS, STORE_HOURS, WHATSAPP_DISPLAY, whatsappLink,
} from '@/lib/api';
import { Reveal, SectionLabel } from '@/components/reveal';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please complete the required fields.');
      return;
    }
    setLoading(true);
    try {
      await fetchJSON('/api/contact', { method: 'POST', body: JSON.stringify(form) });
      toast.success('Message received · we will respond shortly.');
      setDone(true);
    } catch {
      toast.error('Could not send. Please try WhatsApp.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-testid="contact-page" className="bg-paper">
      {/* Hero */}
      <section className="pt-40 pb-20 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <p className="eyebrow">Visit · संपर्क</p>
        <h1 className="display-1 text-6xl md:text-8xl lg:text-9xl text-ink mt-6">
          Walk in.<br />
          <span className="italic text-brand">Or write to us.</span>
        </h1>
        <p className="font-sub text-ink-soft text-lg mt-8 max-w-2xl">
          The Marda atelier is a slow, generous shop. Come for chai, stay for the chaddars, leave with a story.
        </p>
      </section>

      {/* Quick contact */}
      <section className="bg-paper-2 py-16">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 grid md:grid-cols-3 gap-12">
          <Reveal>
            <div className="border-t border-line pt-8">
              <MapPin size={22} strokeWidth={1.2} className="text-brand" />
              <p className="eyebrow mt-6">The Atelier</p>
              <p className="font-sub text-ink text-lg mt-3 leading-relaxed">{STORE_ADDRESS}</p>
              <a href={MAPS_DIRECTIONS} target="_blank" rel="noopener noreferrer" data-testid="contact-directions" className="eyebrow text-brand link-underline inline-block mt-5">
                Get Directions →
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border-t border-line pt-8">
              <Phone size={22} strokeWidth={1.2} className="text-brand" />
              <p className="eyebrow mt-6">Call · WhatsApp</p>
              <p className="font-sub text-ink text-lg mt-3">{WHATSAPP_DISPLAY}</p>
              <a href={whatsappLink('Hello Marda & Sons, I would like to know more.')} target="_blank" rel="noopener noreferrer" data-testid="contact-whatsapp" className="eyebrow text-brand link-underline inline-block mt-5">
                Open WhatsApp →
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="border-t border-line pt-8">
              <Clock size={22} strokeWidth={1.2} className="text-brand" />
              <p className="eyebrow mt-6">Atelier Hours</p>
              <p className="font-sub text-ink text-lg mt-3">{STORE_HOURS}</p>
              <p className="font-sub text-ink-soft text-sm mt-2 italic">Sundays · by appointment</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 grid lg:grid-cols-2 gap-16">
          <div>
            <SectionLabel number="01" label="Write to us" />
            <h2 className="display-2 text-4xl md:text-5xl text-ink mt-6">
              A note from your<br />
              <span className="italic text-brand">side of the table.</span>
            </h2>
            {done ? (
              <div data-testid="contact-success" className="mt-12">
                <p className="font-accent text-brand text-3xl">धन्यवाद 🙏</p>
                <p className="font-sub text-ink text-lg mt-4 max-w-md">
                  Your message has reached the atelier. We will respond within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} data-testid="contact-form" className="mt-12 space-y-8">
                <input className="input-line" placeholder="YOUR NAME *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="contact-name" />
                <div className="grid sm:grid-cols-2 gap-6">
                  <input type="email" className="input-line" placeholder="EMAIL *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="contact-email" />
                  <input className="input-line" placeholder="PHONE" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="contact-phone" />
                </div>
                <textarea
                  className="input-line resize-none"
                  placeholder="YOUR MESSAGE *"
                  rows={6}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  data-testid="contact-message"
                />
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="contact-submit"
                  className="btn-primary w-full justify-center disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send Message'} <ArrowRight size={14} />
                </button>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                  We promise — no automated replies, only humans from Solapur.
                </p>
              </form>
            )}

            <div className="mt-16 border-t border-line pt-8">
              <p className="eyebrow mb-3">Other ways</p>
              <ul className="font-sub text-ink space-y-2">
                <li className="flex items-center gap-3"><Mail size={14} className="text-gold" /> hello@mardaandsons.in</li>
                <li className="flex items-center gap-3"><Phone size={14} className="text-gold" /> {WHATSAPP_DISPLAY}</li>
              </ul>
            </div>
          </div>

          <div>
            <SectionLabel number="02" label="Find us" />
            <h3 className="display-2 text-4xl md:text-5xl text-ink mt-6">Chattigalli, <span className="italic text-brand">Solapur.</span></h3>
            <div className="mt-8 aspect-[4/5] overflow-hidden border border-line">
              <iframe
                title="Marda & Sons Map"
                src={MAPS_EMBED_SRC}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
                data-testid="contact-map"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
