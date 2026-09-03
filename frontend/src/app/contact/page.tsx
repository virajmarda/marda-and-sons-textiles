'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import {
  MAPS_DIRECTIONS,
  MAPS_EMBED_SRC,
  STORE_ADDRESS,
  STORE_HOURS,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from '@/lib/api';
import { Reveal, SectionLabel } from '@/components/reveal';
import { PageHero } from '@/components/page-hero';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please complete the required fields.');
      return;
    }

    setLoading(true);

    try {
      const whatsappMessage = [
        'Hello मर्दा ॲन्ड सन्स,',
        '',
        'I would like to contact you.',
        '',
        `Name: ${form.name.trim()}`,
        `Email: ${form.email.trim()}`,
        `Phone: ${form.phone.trim() || '—'}`,
        '',
        'Message:',
        form.message.trim(),
      ].join('\n');

      const url = whatsappLink(whatsappMessage);

      window.open(url, '_blank', 'noopener,noreferrer');

      toast.success('Opening WhatsApp...');
    } catch {
      toast.error('Could not open WhatsApp.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-testid="contact-page" className="bg-paper">
      <PageHero
        chapter="06"
        eyebrow="Visit · संपर्क"
        marathi="आपलं स्वागत आहे"
        headline={
          <>
            Walk in.
            <br />
            <span className="italic text-brand">Or write to us.</span>
          </>
        }
        lede={
          <p className="max-w-2xl leading-relaxed">
            The{' '}
            <span className="font-brand text-brand">
              मर्दा ॲन्ड सन्स
            </span>{' '}
            atelier is a slow, generous shop. Come for chai, stay for the
            weaves, leave with a story.
          </p>
        }
        layout="split"
        height="lg"
        sidebar={
          <div className="w-full max-w-xl lg:ml-auto">
            <div className="overflow-hidden border border-line/80 bg-paper/60">
              <div className="grid gap-0 sm:grid-cols-2">
                <div className="border-b border-line/80 p-6 sm:border-b-0 sm:border-r sm:p-7">
                  <p className="eyebrow mb-4 text-[10px] tracking-[0.26em] text-ink-soft">
                    Find us
                  </p>

                  <p className="font-sub text-sm leading-7 text-ink sm:text-base">
                    {STORE_ADDRESS}
                  </p>
                </div>

                <div className="border-b border-line/80 p-6 sm:border-b-0 sm:p-7">
                  <p className="eyebrow mb-4 text-[10px] tracking-[0.26em] text-ink-soft">
                    Speak with us
                  </p>

                  <a
                    href={whatsappLink(
                      'Hello मर्दा ॲन्ड सन्स, I would like to know more.',
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sub text-sm leading-7 text-ink transition-colors hover:text-brand sm:text-base"
                  >
                    {WHATSAPP_DISPLAY}
                  </a>

                  <p className="mt-2 font-sub text-sm text-ink-soft">
                    WhatsApp preferred
                  </p>
                </div>
              </div>

              <div className="grid gap-0 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="border-t border-line/80 p-6 sm:p-7">
                  <p className="eyebrow mb-4 text-[10px] tracking-[0.26em] text-ink-soft">
                    Opening hours
                  </p>

                  <p className="font-sub text-sm leading-7 text-ink sm:text-base">
                    {STORE_HOURS}
                  </p>

                  <p className="mt-2 font-sub text-sm italic text-ink-soft">
                    Sundays · by appointment
                  </p>
                </div>

                <div className="flex items-start justify-end border-t border-line/80 p-6 sm:border-l sm:p-7">
                  <Clock
                    size={18}
                    strokeWidth={1.3}
                    className="mt-1 text-brand"
                    aria-hidden
                  />
                </div>
              </div>

              <div className="border-t border-gold/30 bg-paper-2/50 px-6 py-5 sm:px-7">
                <a
                  href={MAPS_DIRECTIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow link-underline inline-flex items-center gap-2 text-brand"
                >
                  Plan your visit
                  <ArrowRight size={13} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        }
      />

      <section className="bg-paper-2 py-16 sm:py-20 md:py-24">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 sm:px-6 md:grid-cols-2 md:gap-12 md:px-12 lg:grid-cols-3 lg:gap-14 lg:px-24">
          <Reveal>
            <div className="border-t border-line pt-8 md:pt-10">
              <MapPin
                size={22}
                strokeWidth={1.2}
                className="text-brand"
                aria-hidden
              />

              <p className="mt-6 eyebrow md:mt-7">The Atelier</p>

              <p className="mt-3 font-sub text-base leading-relaxed text-ink sm:text-lg">
                {STORE_ADDRESS}
              </p>

              <a
                href={MAPS_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contact-directions"
                className="eyebrow link-underline mt-6 inline-block text-brand"
              >
                Get Directions →
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-t border-line pt-8 md:pt-10">
              <Phone
                size={22}
                strokeWidth={1.2}
                className="text-brand"
                aria-hidden
              />

              <p className="mt-6 eyebrow md:mt-7">Call · WhatsApp</p>

              <p className="mt-3 break-words font-sub text-base text-ink sm:text-lg">
                {WHATSAPP_DISPLAY}
              </p>

              <a
                href={whatsappLink(
                  'Hello मर्दा ॲन्ड सन्स, I would like to know more.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contact-whatsapp"
                className="eyebrow link-underline mt-6 inline-block text-brand"
              >
                Open WhatsApp →
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="border-t border-line pt-8 md:pt-10">
              <Clock
                size={22}
                strokeWidth={1.2}
                className="text-brand"
                aria-hidden
              />

              <p className="mt-6 eyebrow md:mt-7">Atelier Hours</p>

              <p className="mt-3 font-sub text-base text-ink sm:text-lg">
                {STORE_HOURS}
              </p>

              <p className="mt-2 font-sub text-sm italic text-ink-soft">
                Sundays · by appointment
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24 md:py-28">
        <div className="mx-auto grid max-w-[1600px] gap-14 px-5 sm:px-6 md:px-12 lg:grid-cols-2 lg:gap-20 lg:px-24">
          <div>
            <SectionLabel number="01" label="Write to us" />

            <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl md:mt-7 md:text-5xl">
              A note from your
              <br />
              <span className="italic text-brand">side of the table.</span>
            </h2>

            <form
              onSubmit={submit}
              data-testid="contact-form"
              className="mt-12 space-y-8 md:mt-14 md:space-y-10"
            >
              <input
                className="input-line"
                placeholder="YOUR NAME *"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                data-testid="contact-name"
              />

              <div className="grid gap-6 sm:grid-cols-2 sm:gap-7">
                <input
                  type="email"
                  className="input-line"
                  placeholder="EMAIL *"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  data-testid="contact-email"
                />

                <input
                  className="input-line"
                  placeholder="PHONE"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  data-testid="contact-phone"
                />
              </div>

              <textarea
                className="input-line resize-none"
                placeholder="YOUR MESSAGE *"
                rows={6}
                required
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                data-testid="contact-message"
              />

              <button
                type="submit"
                disabled={loading}
                data-testid="contact-submit"
                className="btn-primary inline-flex items-center gap-3"
              >
                {loading ? 'Opening…' : 'Open WhatsApp'}
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </form>
          </div>

          <div>
            <SectionLabel number="02" label="Visit the atelier" />

            <div className="mt-8 aspect-[4/5] overflow-hidden border border-line sm:mt-10 sm:aspect-[4/4] lg:aspect-[4/5]">
              <iframe
                title="Marda & Sons map"
                src={MAPS_EMBED_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-start gap-6 border-t border-line pt-6 sm:mt-8 sm:gap-8 sm:pt-8">
              <div className="flex items-start gap-3">
                <Mail size={18} strokeWidth={1.4} className="mt-1 text-brand" />
                <div>
                  <p className="eyebrow text-ink-soft">Message us</p>
                  <p className="mt-2 font-sub text-base text-ink">
                    WhatsApp preferred for quick responses
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} strokeWidth={1.4} className="mt-1 text-brand" />
                <div>
                  <p className="eyebrow text-ink-soft">Address</p>
                  <p className="mt-2 font-sub text-base text-ink">
                    {STORE_ADDRESS}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
