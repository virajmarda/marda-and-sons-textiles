'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { ESTABLISHED } from '@/lib/api';
import { BrandName } from '@/components/brand-name';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/categories', label: 'Collections' },
  { href: '/heritage', label: 'Heritage' },
  { href: '/wholesale', label: 'Wholesale' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const path = usePathname();
  const { count, wishlist, mounted } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  // On hero / unscrolled state we use a light text + dark scrim so the navbar is always legible.
  const onHero = !scrolled;

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FDFBF7]/92 backdrop-blur-xl border-b border-line/60 shadow-[0_4px_24px_-12px_rgba(42,29,26,0.18)]'
          : 'bg-ink/55 backdrop-blur-md border-b border-bg-primary/10'
      }`}
    >
      {/* On hero: add an extra top gradient so curved bright spots in images can't drown the nav */}
      {onHero && (
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/40 to-ink/10 pointer-events-none" />
      )}

      <div className="max-w-[1600px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="grid grid-cols-3 items-center py-4 md:py-5">
          {/* Left: Est. */}
          <div className="flex items-center gap-3">
            <button
              data-testid="mobile-menu-toggle"
              className={`md:hidden ${onHero ? 'text-bg-primary' : 'text-ink'}`}
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex flex-col leading-none">
              <span className={`eyebrow text-[10px] ${onHero ? 'text-gold-muted' : ''}`}>Est. {ESTABLISHED}</span>
              <span className={`text-[11px] tracking-[0.3em] mt-1 ${onHero ? 'text-bg-primary/80' : 'text-ink-soft'}`}>SOLAPUR · INDIA</span>
            </div>
          </div>

          {/* Center: Brand */}
          <Link
            href="/"
            data-testid="brand-logo"
            className="flex flex-col items-center justify-center text-center group"
          >
            <BrandName
              variant="micro"
              className={onHero ? 'text-bg-primary' : 'text-ink'}
            />
            <span className={`font-accent text-[10px] md:text-[11px] mt-1 tracking-wider ${onHero ? 'text-gold-muted' : 'text-brand'}`}>
              विश्वास की परंपरा
            </span>
          </Link>

          {/* Right: actions */}
          <div className={`flex items-center justify-end gap-4 md:gap-6 ${onHero ? 'text-bg-primary' : 'text-ink'}`}>
            <Link
              href="/shop"
              data-testid="header-search-link"
              aria-label="Search"
              className="hidden md:inline-flex hover:text-gold transition-colors"
            >
              <Search size={18} strokeWidth={1.4} />
            </Link>
            <Link
              href="/wishlist"
              data-testid="header-wishlist-link"
              className="relative hover:text-gold transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.4} />
              {mounted && wishlist.length > 0 && (
                <span
                  data-testid="wishlist-count"
                  className="absolute -top-2 -right-2 bg-brand text-bg-primary text-[9px] w-4 h-4 flex items-center justify-center font-medium"
                >
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              data-testid="header-cart-link"
              className="relative hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.4} />
              {mounted && count > 0 && (
                <span
                  data-testid="cart-count"
                  className="absolute -top-2 -right-2 bg-brand text-bg-primary text-[9px] w-4 h-4 flex items-center justify-center font-medium"
                >
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Bottom nav row */}
        <nav className={`hidden md:flex items-center justify-center gap-12 pb-4 pt-3 border-t ${onHero ? 'border-bg-primary/15' : 'border-line/40'}`}>
          {NAV.map((n) => {
            const active = path === n.href || (n.href !== '/' && path?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                data-testid={`nav-${n.label.toLowerCase()}`}
                className={`eyebrow text-[10.5px] link-underline ${
                  active
                    ? onHero ? 'text-gold' : 'text-brand'
                    : onHero ? 'text-bg-primary' : 'text-ink'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#FDFBF7] border-t border-line/60">
          <div className="px-6 py-6 flex flex-col gap-5">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                className="font-sub text-2xl text-ink tracking-tight"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
