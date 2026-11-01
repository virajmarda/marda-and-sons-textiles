'use client';

import {
  useState,
  type FormEvent,
} from 'react';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Building2,
  Globe2,
  HeartHandshake,
} from 'lucide-react';

import { whatsappLink } from '@/lib/api';

import { PageHero } from '@/components/page-hero';
import { Reveal, SectionLabel } from '@/components/reveal';

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

type WholesaleForm = {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  quantity_estimate: string;
  message: string;
};

export default function WholesalePage() {
  const [form, setForm] =
    useState<WholesaleForm>({
      name: '',
      company: '',
      email: '',
      phone: '',
      city: '',
      quantity_estimate: '',
      message: '',
    });

  const [interests, setInterests] =
    useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preparedUrl, setPreparedUrl] =
    useState('');

  function updateField(
    fieldName: keyof WholesaleForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [fieldName]: value,
    }));

    setError('');
    setPreparedUrl('');
  }

  function toggleInterest(value: string) {
    setInterests((current) =>
      current.includes(value)
        ? current.filter(
            (item) => item !== value,
          )
        : [...current, value],
    );

    setPreparedUrl('');
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setPreparedUrl('');

    if (form.name.trim().length < 2) {
      setError(
        'Please enter your name.',
      );
      return;
    }

    if (!form.email.trim()) {
      setError(
        'Please enter your email address.',
      );
      return;
    }

    const phoneDigits = form.phone.replace(
      /\D/g,
      '',
    );

    if (
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      setError(
        'Please enter a valid phone number, including country code where applicable.',
      );
      return;
    }

    if (!form.quantity_estimate) {
      setError(
        'Please select your expected quantity.',
      );
      return;
    }

    setLoading(true);

    try {
      const whatsappMessage = [
        'Hello मर्दा ॲन्ड सन्स,',
        '',
        'I would like to make a wholesale enquiry.',
        '',
        `Name: ${form.name.trim()}`,
        `Company / Store: ${
          form.company.trim() ||
          'Not provided'
        }`,
        `Email: ${form.email.trim()}`,
        `Phone: ${form.phone.trim()}`,
        `City / Country: ${
          form.city.trim() || 'Not provided'
        }`,
        `Expected Quantity: ${form.quantity_estimate}`,
        `Interested In: ${
          interests.length
            ? interests.join(', ')
            : 'Please advise'
        }`,
        '',
        'Message:',
        form.message.trim() ||
          'Please contact me to discuss requirements.',
        '',
        'Please confirm availability, pricing, taxes and delivery charges.',
      ].join('\n');

      const url = whatsappLink(
        whatsappMessage,
      );

      setPreparedUrl(url);

      window.open(
        url,
        '_blank',
        'noopener,noreferrer',
      );

      toast.success(
        'WhatsApp message prepared. Press Send in WhatsApp to complete your enquiry.',
      );
    } catch {
      setError(
        'Could not open WhatsApp. Please use the fallback link below.',
      );

      toast.error(
        'Could not open WhatsApp.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      data-testid="wholesale-page"
      className="bg-paper"
    >
      <PageHero
        chapter="05"
        eyebrow="For partners · घाऊक"
        marathi="साथ पन्नास वर्षांचा"
        headline={
          <>
            Become a
            <br />
            <span className="italic text-brand">
              house partner.
            </span>
          </>
        }
        lede={
          <>
            Our wholesale roots run fifty-five
            years deep. Today, we extend the same
            honest standards to retailers, gifting
            houses, exporters, and wedding planners
            across India and abroad.
          </>
        }
      />

      <section
        id="retailers"
        className="py-16 sm:py-20 md:py-24"
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
          <SectionLabel
            number="01"
            label="Who we serve"
          />

          <div className="mt-12 grid gap-8 sm:mt-14 md:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {[
              {
                icon: Building2,
                title:
                  'Retailers & Resellers',
                description:
                  'Stockists, family stores, and online retailers — share your product requirements and we will confirm availability and order options.',
                id: 'retailers',
              },
              {
                icon: HeartHandshake,
                title: 'Corporate Gifting',
                description:
                  'Wedding return-gift bundles, Diwali hampers, employee gifting — share your brief and we will confirm suitable options.',
                id: 'gifting',
              },
              {
                icon: Globe2,
                title: 'Export Enquiries',
                description:
                  'Share your destination and documentation requirements. We will confirm whether the order can be supported and which documents can be provided.',
                id: 'export',
              },
            ].map(
              (item, index) => (
                <Reveal
                  key={item.title}
                  delay={index * 0.1}
                >
                  <div
                    id={item.id}
                    className="border-t border-line pt-6 md:pt-8"
                  >
                    <item.icon
                      size={28}
                      strokeWidth={1.2}
                      className="text-brand"
                      aria-hidden
                    />

                    <h3 className="mt-5 font-heading text-2xl italic text-ink sm:text-[1.8rem] md:mt-6 md:text-3xl">
                      {item.title}
                    </h3>

                    <p className="mt-4 font-sub leading-relaxed text-ink-soft">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-paper-2 py-16 sm:py-20 md:py-24">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4 md:px-12 lg:px-24">
          {[
            {
              value: '55+',
              label: 'Years sourcing',
            },
            {
              value: '8',
              label: 'Categories',
            },
            {
              value: '12+',
              label: 'Cities served',
            },
            {
              value: '24h',
              label:
                'Typical quote turnaround',
            },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-4xl italic text-brand sm:text-5xl md:text-6xl lg:text-7xl">
                {stat.value}
              </p>

              <p className="eyebrow mt-2 sm:mt-3">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="relative overflow-hidden bg-brand px-4 py-16 text-bg-primary sm:px-6 sm:py-20 md:px-12 lg:px-16 lg:py-32">
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-6 -right-4 font-accent text-[22vw] leading-none opacity-10 md:-bottom-10 md:-right-10 md:text-[16vw]"
          >
            घाऊक
          </span>

          <SectionLabel
            number="02"
            label="What you'll receive"
          />

          <h2 className="display-2 mt-6 text-3xl sm:text-4xl md:mt-8 md:text-5xl">
            How it works.
          </h2>

          <ul className="mt-8 space-y-4 font-sub text-base text-bg-primary/85 sm:mt-10 sm:text-lg">
            <li className="diamond">
              Share your products, quantities and
              destination.
            </li>

            <li className="diamond">
              We confirm availability and provide a
              quotation.
            </li>

            <li className="diamond">
              Sample availability and any sample
              charges are confirmed before dispatch.
            </li>

            <li className="diamond">
              Custom weaves, sizes and packaging are
              discussed on request.
            </li>

            <li className="diamond">
              Delivery and export documentation
              options are confirmed for your
              requirements.
            </li>
          </ul>

          <div className="mt-10 border-t border-bg-primary/20 pt-6 sm:mt-12 sm:pt-8">
            <p className="font-accent text-xl text-gold sm:text-2xl">
              “पाहिजे तितकंच, पण उत्तमच.”
            </p>

            <p className="mt-3 font-sub text-bg-primary/80">
              As much as you need — but only of the
              finest.
            </p>
          </div>
        </div>

        <div className="bg-paper px-4 py-16 sm:px-6 sm:py-20 md:px-12 lg:px-16 lg:py-32">
          <SectionLabel
            number="03"
            label="The enquiry"
          />

          <form
            onSubmit={submit}
            data-testid="wholesale-form"
            className="mt-10 space-y-8 md:mt-12"
            aria-busy={loading}
          >
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <div>
                <label
                  htmlFor="ws-name"
                  className="mb-2 block font-sub text-sm text-ink"
                >
                  Full name *
                </label>

                <input
                  id="ws-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={120}
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      'name',
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Aparna Apte"
                  data-testid="ws-name"
                  className="input-line min-h-[44px] text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="ws-company"
                  className="mb-2 block font-sub text-sm text-ink"
                >
                  Company / store
                  <span className="text-ink-soft">
                    {' '}
                    (optional)
                  </span>
                </label>

                <input
                  id="ws-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  maxLength={160}
                  value={form.company}
                  onChange={(event) =>
                    updateField(
                      'company',
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Apte Textiles"
                  data-testid="ws-company"
                  className="input-line min-h-[44px] text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="ws-email"
                  className="mb-2 block font-sub text-sm text-ink"
                >
                  Email address *
                </label>

                <input
                  id="ws-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      'email',
                      event.target.value,
                    )
                  }
                  placeholder="you@example.com"
                  data-testid="ws-email"
                  className="input-line min-h-[44px] text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="ws-phone"
                  className="mb-2 block font-sub text-sm text-ink"
                >
                  Phone / WhatsApp *
                </label>

                <input
                  id="ws-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  maxLength={30}
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      'phone',
                      event.target.value,
                    )
                  }
                  placeholder="+91 9XXXX XXXXX"
                  data-testid="ws-phone"
                  className="input-line min-h-[44px] text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="ws-city"
                  className="mb-2 block font-sub text-sm text-ink"
                >
                  City / country
                  <span className="text-ink-soft">
                    {' '}
                    (optional)
                  </span>
                </label>

                <input
                  id="ws-city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  maxLength={160}
                  value={form.city}
                  onChange={(event) =>
                    updateField(
                      'city',
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Solapur, India"
                  data-testid="ws-city"
                  className="input-line min-h-[44px] text-base"
                />
              </div>
            </div>

            <fieldset>
              <legend className="mb-4 font-sub text-sm uppercase tracking-[0.22em] text-ink">
                Interested in
              </legend>

              <div className="flex flex-wrap gap-2.5">
                {PRODUCT_OPTIONS.map(
                  (option) => {
                    const isActive =
                      interests.includes(
                        option,
                      );

                    return (
                      <label
                        key={option}
                        className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 border px-4 py-2 font-sub text-sm transition-colors ${
                          isActive
                            ? 'border-ink bg-ink text-bg-primary'
                            : 'border-line text-ink hover:border-ink'
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="interests"
                          value={option}
                          checked={isActive}
                          onChange={() =>
                            toggleInterest(
                              option,
                            )
                          }
                          data-testid={`ws-interest-${option}`}
                          className="h-4 w-4 accent-brand"
                        />

                        {option}
                      </label>
                    );
                  },
                )}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-4 font-sub text-sm uppercase tracking-[0.22em] text-ink">
                Expected quantity *
              </legend>

              <div className="grid gap-3 sm:grid-cols-2">
                {QTY_RANGES.map((range) => (
                  <label
                    key={range}
                    className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-sm border border-line/60 px-4 py-3 font-sub text-sm transition-colors hover:border-brand"
                  >
                    <input
                      type="radio"
                      name="quantity_estimate"
                      value={range}
                      checked={
                        form.quantity_estimate ===
                        range
                      }
                      onChange={() =>
                        updateField(
                          'quantity_estimate',
                          range,
                        )
                      }
                      data-testid={`ws-qty-${range}`}
                      className="mt-0.5 h-4 w-4 accent-brand"
                    />

                    <span className="leading-relaxed">
                      {range}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="ws-message"
                className="mb-2 block font-sub text-sm text-ink"
              >
                Message
                <span className="text-ink-soft">
                  {' '}
                  (optional)
                </span>
              </label>

              <textarea
                id="ws-message"
                name="message"
                rows={4}
                maxLength={2000}
                value={form.message}
                onChange={(event) =>
                  updateField(
                    'message',
                    event.target.value,
                  )
                }
                placeholder="Tell us about your needs, weave preferences, timeline…"
                data-testid="ws-message"
                className="input-line resize-y text-base"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="font-sub text-sm text-ink"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              data-testid="ws-submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Preparing…'
                : 'Continue on WhatsApp'}

              <ArrowRight size={15} />
            </button>

            <p className="font-sub text-sm leading-relaxed text-ink-soft">
              This prepares a WhatsApp message. Your
              enquiry is not sent until you press
              Send in WhatsApp.
            </p>

            {preparedUrl && (
              <div
                role="status"
                className="space-y-2 font-sub text-sm text-ink-soft"
              >
                <p>
                  Your message is ready. Send it from
                  WhatsApp to complete your enquiry.
                </p>

                <a
                  href={preparedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center underline underline-offset-4"
                >
                  If WhatsApp did not open, open it
                  here →
                </a>
              </div>
            )}

            <p className="font-sub text-[10px] uppercase leading-relaxed tracking-[0.2em] text-ink-soft sm:text-[11px] sm:tracking-[0.22em]">
              We aim to respond within 24 business
              hours · No spam.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
