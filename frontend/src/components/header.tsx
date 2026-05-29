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
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  // ALWAYS solid cream with dark text — guarantees nav is legible on every page,
  // over every hero, at every scroll position.
  // The only thing that changes on scroll is elevation (shadow + line darkness).
  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-[box-shadow,border-color] duration-300
        bg-[#FDFBF7]/[0.97] backdrop-blur-xl border-b
        ${scrolled
          ? 'border-line/70 shadow-[0_4px_28px_-12px_rgba(42,29,26,0.22)]'
          : 'border-line/40'
        }`}
    >
      {/* Top gold thread — subtle but constant across all pages */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="max-w-[1600px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="grid grid-cols-3 items-center py-4 md:py-5">
          {/* Left: Est. */}
          <div className="flex items-center gap-3">
            <button
              data-testid="mobile-menu-toggle"
              className="md:hidden text-ink"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex flex-col leading-none">
              <span className="eyebrow text-[10px] text-ink">Est. {ESTABLISHED}</span>
              <span className="text-[11px] tracking-[0.3em] mt-1 text-ink-soft">SOLAPUR · INDIA</span>
            </div>
          </div>

          {/* Center: Brand */}
          <Link
            href="/"
            data-testid="brand-logo"
            className="flex flex-col items-center justify-center text-center group"
          >
            <BrandName variant="micro" className="text-ink" />
            <span className="font-accent text-[10px] md:text-[11px] mt-1 tracking-wider text-brand">
              विश्वास की परंपरा
            </span>
          </Link>

          {/* Right: actions */}
          <div className="flex items-center justify-end gap-4 md:gap-6 text-ink">
            <Link
              href="/shop"
              data-testid="header-search-link"
              aria-label="Search"
              className="hidden md:inline-flex hover:text-brand transition-colors"
            >
              <Search size={18} strokeWidth={1.4} />
            </Link>
            <Link
              href="/wishlist"
              data-testid="header-wishlist-link"
              className="relative hover:text-brand transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.4} />
              {mounted && wishlist.length > 0 && (
                <span
                  data-testid="wishlist-count"
                  className="absolute -top-2 -right-2 bg-brand text-bg-primary text-[9px] w-4 h-4 flex items-center justify-center font-medium rounded-full"
                >
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              data-testid="header-cart-link"
              className="relative hover:text-brand transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.4} />
              {mounted && count > 0 && (
                <span
                  data-testid="cart-count"
                  className="absolute -top-2 -right-2 bg-brand text-bg-primary text-[9px] w-4 h-4 flex items-center justify-center font-medium rounded-full"
                >
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Bottom nav row — always ink text, brand color on active */}
        <nav className="hidden md:flex items-center justify-center gap-12 pb-4 pt-3 border-t border-line/40">
          {NAV.map((n) => {
            const active = path === n.href || (n.href !== '/' && path?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                data-testid={`nav-${n.label.toLowerCase()}`}
                className={`eyebrow text-[11px] link-underline transition-colors ${
                  active ? 'text-brand font-medium' : 'text-ink hover:text-brand'
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
            {NAV.map((n) => {
              const active = path === n.href || (n.href !== '/' && path?.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                  className={`font-sub text-2xl tracking-tight ${active ? 'text-brand' : 'text-ink'}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
