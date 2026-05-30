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
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === '/') return path === '/';
    return path === href || path?.startsWith(href);
  };

  return (
    <>
      <header
        data-testid="site-header"
        className={`fixed left-0 right-0 top-0 z-50 border-b bg-[#FDFBF7]/95 backdrop-blur-xl transition-[box-shadow,border-color,background-color] duration-300 ${
          scrolled
            ? 'border-line/70 shadow-[0_4px_28px_-12px_rgba(42,29,26,0.22)]'
            : 'border-line/40'
        }`}
      >
        <div
          aria-hidden
          className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
        />

        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="grid min-h-[72px] grid-cols-[auto_1fr_auto] items-center gap-3 py-3 sm:min-h-[76px] sm:py-4 md:grid-cols-3 md:py-5">
            {/* Left */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                data-testid="mobile-menu-toggle"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 active:scale-[0.98] md:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-navigation"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="hidden md:flex flex-col leading-none">
                <span className="eyebrow text-[10px] text-ink">Est. {ESTABLISHED}</span>
                <span className="mt-1 text-[11px] tracking-[0.3em] text-ink-soft">SOLAPUR · INDIA</span>
              </div>
            </div>

            {/* Center */}
            <Link
              href="/"
              data-testid="brand-logo"
              className="group flex min-w-0 flex-col items-center justify-center text-center"
              aria-label="Marda and Sons home"
            >
              <BrandName variant="micro" className="text-ink" />
              <span className="mt-1 truncate font-accent text-[10px] tracking-wider text-brand sm:text-[11px]">
                विश्वास की परंपरा
              </span>
            </Link>

            {/* Right */}
            <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-3 lg:gap-4 text-ink">
              <Link
                href="/shop"
                data-testid="header-search-link-mobile"
                aria-label="Search products"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5 hover:text-brand active:scale-[0.98] md:hidden"
              >
                <Search size={18} strokeWidth={1.4} />
              </Link>

              <Link
                href="/shop"
                data-testid="header-search-link"
                aria-label="Search"
                className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ink/5 hover:text-brand"
              >
                <Search size={18} strokeWidth={1.4} />
              </Link>

              <Link
                href="/wishlist"
                data-testid="header-wishlist-link"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5 hover:text-brand active:scale-[0.98] md:h-10 md:w-10"
                aria-label="Wishlist"
              >
                <Heart size={18} strokeWidth={1.4} />
                {mounted && wishlist.length > 0 && (
                  <span
                    data-testid="wishlist-count"
                    className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-medium leading-none text-bg-primary md:right-0.5 md:top-0.5"
                  >
                    {wishlist.length > 99 ? '99+' : wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                data-testid="header-cart-link"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5 hover:text-brand active:scale-[0.98] md:h-10 md:w-10"
                aria-label="Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.4} />
                {mounted && count > 0 && (
                  <span
                    data-testid="cart-count"
                    className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-medium leading-none text-bg-primary md:right-0.5 md:top-0.5"
                  >
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center justify-center gap-8 border-t border-line/40 pb-4 pt-3 lg:gap-10 md:flex">
            {NAV.map((n) => {
              const active = isActive(n.href);

              return (
                <Link
                  key={n.href}
                  href={n.href}
                  data-testid={`nav-${n.label.toLowerCase()}`}
                  className={`eyebrow link-underline text-[11px] transition-colors ${
                    active ? 'font-medium text-brand' : 'text-ink hover:text-brand'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px] transition-all duration-300 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        id="mobile-navigation"
        className={`fixed left-0 right-0 top-[72px] z-50 max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line/60 bg-[#FDFBF7] shadow-2xl transition-all duration-300 md:hidden ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <div className="px-6 pb-8 pt-6">
          <div className="mb-6 border-b border-line/50 pb-5">
            <p className="eyebrow text-[10px] text-ink">Est. {ESTABLISHED}</p>
            <p className="mt-2 text-[11px] tracking-[0.28em] text-ink-soft">SOLAPUR · INDIA</p>
          </div>

          <nav className="flex flex-col" aria-label="Mobile navigation">
            {NAV.map((n) => {
              const active = isActive(n.href);

              return (
                <Link
                  key={n.href}
                  href={n.href}
                  data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                  className={`flex items-center justify-between border-b border-line/35 py-4 font-sub text-[1.65rem] tracking-tight transition-colors ${
                    active ? 'text-brand' : 'text-ink'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{n.label}</span>
                  <span className="text-sm text-ink-soft">↗</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center border border-line bg-paper px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Explore Shop
            </Link>
            <Link
              href="/wholesale"
              className="inline-flex items-center justify-center bg-brand px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-bg-primary transition-opacity hover:opacity-90"
            >
              Wholesale
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
