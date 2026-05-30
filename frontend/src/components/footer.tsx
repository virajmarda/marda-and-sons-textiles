'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import {
  ESTABLISHED,
  STORE_ADDRESS,
  STORE_HOURS,
  WHATSAPP_DISPLAY,
  fetchJSON,
  whatsappLink,
} from '@/lib/api';

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await fetchJSON('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      });
      toast.success('Welcome to the Marda Atelier · आपका स्वागत है');
      setEmail('');
    } catch {
      toast.error('Could not subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer
      data-testid="site-footer"
      className="relative mt-20 overflow-hidden bg-ink text-bg-primary sm:mt-24 md:mt-32"
    >
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-16 md:px-12 md:pt-20 lg:px-24 lg:pt-24">
        {/* Newsletter */}
        <div className="grid gap-10 border-b border-bg-primary/15 pb-12 sm:pb-14 md:gap-12 md:pb-16 lg:grid-cols-2 lg:items-end lg:pb-20">
          <div>
            <p className="eyebrow text-gold-muted">The Atelier Letter</p>
            <h3 className="mt-4 font-heading text-3xl italic leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
              Heritage notes, new weaves
              <br className="hidden sm:block" /> and quiet invitations.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-bg-primary/70 sm:mt-5 sm:text-base font-sub">
              A monthly letter from Solapur — featuring new collections, loom stories, and members-only retail
              previews. No noise.
            </p>
          </div>

          <form
            onSubmit={submit}
            data-testid="newsletter-form"
            className="flex flex-col gap-4 md:gap-6"
          >
            <div className="border-b border-bg-primary/30 pb-3 transition-colors focus-within:border-gold">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL"
                  data-testid="newsletter-email-input"
                  className="min-w-0 flex-1 bg-transparent py-3 text-base text-bg-primary outline-none placeholder:text-[11px] placeholder:uppercase placeholder:tracking-[0.22em] placeholder:text-bg-primary/40 sm:text-lg"
                />
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="newsletter-submit"
                  className="eyebrow inline-flex min-h-[44px] items-center justify-start text-gold transition-colors hover:text-bg-primary disabled:opacity-50 sm:justify-end"
                >
                  {loading ? 'Submitting…' : 'Subscribe →'}
                </button>
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-[0.22em] text-bg-primary/40 sm:text-[11px]">
              By subscribing, you join 12,000+ patrons of Solapuri textile.
            </p>
          </form>
        </div>

        {/* Columns */}
        <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-14 sm:grid-cols-2 sm:gap-12 lg:mt-20 lg:grid-cols-4">
          <div>
            <p className="mb-5 eyebrow text-gold-muted sm:mb-6">Retail</p>
            <ul className="space-y-3 text-bg-primary/85 font-sub">
              <li>
                <Link href="/shop" className="link-underline">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="link-underline">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/shop?category=blankets" className="link-underline">
                  Woolen Blankets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=phetas" className="link-underline">
                  Wedding Phetas
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="link-underline">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 eyebrow text-gold-muted sm:mb-6">Wholesale</p>
            <ul className="space-y-3 text-bg-primary/85 font-sub">
              <li>
                <Link href="/wholesale" className="link-underline">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link href="/wholesale#gifting" className="link-underline">
                  Corporate Gifting
                </Link>
              </li>
              <li>
                <Link href="/wholesale#retailers" className="link-underline">
                  Retailers & Resellers
                </Link>
              </li>
              <li>
                <Link href="/wholesale#export" className="link-underline">
                  Export Enquiries
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 eyebrow text-gold-muted sm:mb-6">House</p>
            <ul className="space-y-3 text-bg-primary/85 font-sub">
              <li>
                <Link href="/heritage" className="link-underline">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/heritage#looms" className="link-underline">
                  The Solapur Looms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="link-underline">
                  Visit the Store
                </Link>
              </li>
              <li>
                <a
                  href={whatsappLink('Hello मर्दा ॲन्ड सन्स — I would like to enquire.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 eyebrow text-gold-muted sm:mb-6">Visit</p>
            <ul className="space-y-4 text-sm text-bg-primary/85 font-sub">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-1 shrink-0 text-gold" />
                <span className="leading-relaxed">{STORE_ADDRESS}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={14} className="mt-1 shrink-0 text-gold" />
                <a
                  href={whatsappLink('Hello मर्दा ॲन्ड सन्स')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all hover:text-gold transition-colors"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="mt-1 shrink-0 text-gold" />
                <a
                  href="mailto:hello@mardaandsons.in"
                  className="break-all hover:text-gold transition-colors"
                >
                  hello@mardaandsons.in
                </a>
              </li>
              <li className="pt-1 text-xs leading-relaxed text-bg-primary/60">{STORE_HOURS}</li>
            </ul>
          </div>
        </div>

        {/* Big brand wordmark */}
        <div className="mt-14 border-t border-bg-primary/15 pt-10 text-center sm:mt-16 md:mt-20 md:pt-12 lg:mt-24">
          <p
            className="font-brand text-[18vw] leading-[0.9] tracking-[-0.01em] text-bg-primary/95 sm:text-[14vw] md:text-[12vw]"
            lang="mr"
          >
            मर्दा ॲन्ड सन्स
          </p>
          <p className="mt-4 text-xs tracking-wider text-gold-muted sm:mt-6 sm:text-sm font-accent">
            विश्वास की परंपरा, वर्षों का साथ
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-bg-primary/10 pt-6 text-[10px] uppercase tracking-[0.2em] text-bg-primary/50 sm:mt-12 sm:text-[11px] md:flex-row md:items-center md:justify-between">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} मर्दा ॲन्ड सन्स · Solapur · Est. {ESTABLISHED}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 md:justify-end">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center gap-2 transition-colors hover:text-gold"
            >
              <Instagram size={13} /> Instagram
            </a>
            <Link
              href="/contact"
              className="flex min-h-[44px] items-center transition-colors hover:text-gold"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
