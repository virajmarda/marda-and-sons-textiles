'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { ESTABLISHED, STORE_ADDRESS, STORE_HOURS, WHATSAPP_DISPLAY, fetchJSON, whatsappLink } from '@/lib/api';

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetchJSON('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
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
      className="relative bg-ink text-bg-primary mt-32 overflow-hidden"
    >
      {/* gold pinstripe */}
      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-24 pb-12">
        {/* Newsletter */}
        <div className="grid lg:grid-cols-2 gap-12 pb-20 border-b border-bg-primary/15">
          <div>
            <p className="eyebrow text-gold-muted">The Atelier Letter</p>
            <h3 className="font-heading italic text-4xl md:text-5xl leading-[1.05] tracking-tight mt-4">
              Heritage notes, new weaves<br />and quiet invitations.
            </h3>
            <p className="font-sub text-bg-primary/70 mt-5 max-w-md">
              A monthly letter from Solapur — featuring new collections, loom stories, and members-only retail
              previews. No noise.
            </p>
          </div>
          <form onSubmit={submit} data-testid="newsletter-form" className="flex flex-col gap-6 justify-end">
            <div className="flex items-end gap-4 border-b border-bg-primary/30 focus-within:border-gold transition-colors pb-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL"
                data-testid="newsletter-email-input"
                className="flex-1 bg-transparent outline-none text-bg-primary placeholder:text-bg-primary/40 placeholder:uppercase placeholder:tracking-[0.22em] placeholder:text-[11px] py-3"
              />
              <button
                type="submit"
                disabled={loading}
                data-testid="newsletter-submit"
                className="eyebrow text-gold hover:text-bg-primary transition-colors disabled:opacity-50"
              >
                {loading ? '…' : 'Subscribe →'}
              </button>
            </div>
            <p className="text-[11px] text-bg-primary/40 tracking-wider uppercase">
              By subscribing, you join 12,000+ patrons of Solapuri textile.
            </p>
          </form>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-20">
          <div>
            <p className="eyebrow text-gold-muted mb-6">Retail</p>
            <ul className="space-y-3 font-sub text-bg-primary/85">
              <li><Link href="/shop" className="link-underline">All Products</Link></li>
              <li><Link href="/categories" className="link-underline">Collections</Link></li>
              <li><Link href="/shop?category=blankets" className="link-underline">Woolen Blankets</Link></li>
              <li><Link href="/shop?category=phetas" className="link-underline">Wedding Phetas</Link></li>
              <li><Link href="/wishlist" className="link-underline">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-gold-muted mb-6">Wholesale</p>
            <ul className="space-y-3 font-sub text-bg-primary/85">
              <li><Link href="/wholesale" className="link-underline">Become a Partner</Link></li>
              <li><Link href="/wholesale#gifting" className="link-underline">Corporate Gifting</Link></li>
              <li><Link href="/wholesale#retailers" className="link-underline">Retailers & Resellers</Link></li>
              <li><Link href="/wholesale#export" className="link-underline">Export Enquiries</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-gold-muted mb-6">House</p>
            <ul className="space-y-3 font-sub text-bg-primary/85">
              <li><Link href="/heritage" className="link-underline">Our Heritage</Link></li>
              <li><Link href="/heritage#looms" className="link-underline">The Solapur Looms</Link></li>
              <li><Link href="/contact" className="link-underline">Visit the Store</Link></li>
              <li>
                <a href={whatsappLink('Hello मर्दा अँड सन्स — I would like to enquire.')} target="_blank" rel="noopener noreferrer" className="link-underline">
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-gold-muted mb-6">Visit</p>
            <ul className="space-y-4 font-sub text-bg-primary/85 text-sm">
              <li className="flex gap-3"><MapPin size={14} className="text-gold mt-1 shrink-0" /><span>{STORE_ADDRESS}</span></li>
              <li className="flex gap-3"><Phone size={14} className="text-gold mt-1 shrink-0" /><a href={whatsappLink('Hello मर्दा अँड सन्स')}>{WHATSAPP_DISPLAY}</a></li>
              <li className="flex gap-3"><Mail size={14} className="text-gold mt-1 shrink-0" /><a href="mailto:hello@mardaandsons.in">hello@mardaandsons.in</a></li>
              <li className="text-xs text-bg-primary/60 mt-2">{STORE_HOURS}</li>
            </ul>
          </div>
        </div>

        {/* Big brand wordmark */}
        <div className="mt-24 pt-12 border-t border-bg-primary/15 text-center">
          <p className="font-brand text-[16vw] md:text-[12vw] leading-[0.9] text-bg-primary/95 tracking-[-0.01em]" lang="mr">
            मर्दा अँड सन्स
          </p>
          <p className="font-accent text-gold-muted mt-6 text-sm tracking-wider">
            विश्वास की परंपरा, वर्षों का साथ
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-16 text-[11px] uppercase tracking-[0.22em] text-bg-primary/50">
          <p>© {new Date().getFullYear()} मर्दा अँड सन्स · Solapur · Est. {ESTABLISHED}</p>
          <div className="flex gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold">
              <Instagram size={13} /> Instagram
            </a>
            <Link href="/contact" className="hover:text-gold">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
