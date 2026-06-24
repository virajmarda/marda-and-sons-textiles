'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Bookmark, Heart, Shield, ShoppingBag, X } from 'lucide-react';

export type LoginPromptTrigger = 'bag' | 'wishlist';

type LoginPromptDialogProps = {
  open: boolean;
  trigger: LoginPromptTrigger;
  onClose: () => void;
};

const COPY = {
  bag: {
    icon: ShoppingBag,
    title: 'Sign in to add to your Bag',
    subtitle: "Don't lose what you love.",
  },
  wishlist: {
    icon: Heart,
    title: 'Sign in to save to Wishlist',
    subtitle: 'Keep your favourites close.',
  },
};

const benefits = [
  {
    icon: Bookmark,
    title: 'Your cart stays with you',
    text: 'Items you add are saved to your account — pick up right where you left off on any device.',
  },
  {
    icon: Bell,
    title: 'Never miss a restock',
    text: "We'll notify you when a wishlisted fabric is back in stock or goes on sale.",
  },
  {
    icon: Shield,
    title: 'Faster, safer checkout',
    text: 'Your details are saved securely so checkout takes seconds — not minutes.',
  },
];

export function LoginPromptDialog({
  open,
  trigger,
  onClose,
}: LoginPromptDialogProps) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const content = COPY[trigger];
  const Icon = content.icon;

  useEffect(() => setMounted(true), []);

  // lock body scroll + focus close on open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop — starts BELOW navbar ─────────────────────── */}
          <motion.div
            key="backdrop"
            className="fixed inset-x-0 bottom-0 z-[110] bg-ink/55 backdrop-blur-[6px]"
            style={{ top: 'var(--navbar-h, 110px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            aria-hidden="true"
            onClick={onClose}
          />

          {/* ── Dialog shell — constrained to below-navbar area ─────── */}
          <div
            className="fixed inset-x-0 bottom-0 z-[111] flex items-end justify-center sm:items-center sm:p-6"
            style={{ top: 'var(--navbar-h, 110px)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lp-title"
          >
            <motion.div
              key="dialog"
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className={[
                /* Mobile: full-width bottom sheet */
                'relative w-full bg-paper border-t border-line shadow-[0_-8px_60px_rgba(0,0,0,0.16)]',
                /* Desktop: centred card */
                'sm:w-full sm:max-w-[540px] sm:border sm:shadow-[0_28px_80px_rgba(0,0,0,0.20)]',
                'sm:[animation:none]',
              ].join(' ')}
              style={{
                /* Remaining height after navbar, minus breathing room */
                maxHeight: 'calc(100dvh - var(--navbar-h, 110px) - 2rem)',
                overflowY: 'auto',
              }}
            >
              {/* ── Desktop animation override ───────────────────── */}
              <motion.div
                className="hidden sm:contents"
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Close */}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line/70 bg-paper text-ink-soft transition hover:border-ink/50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
              >
                <X size={15} />
              </button>

              {/* ── Header ─────────────────────────────────────────── */}
              <div className="border-b border-line px-6 pb-5 pt-6 sm:px-8 sm:pt-8 sm:pb-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center bg-brand text-bg-primary shadow-sm">
                  <Icon size={16} />
                </div>

                <h2
                  id="lp-title"
                  className="font-heading text-[2rem] leading-[0.95] tracking-[-0.02em] text-ink sm:text-[2.4rem]"
                >
                  {content.title}
                </h2>

                <p className="mt-2.5 font-sub text-[15px] leading-relaxed text-ink-soft">
                  {content.subtitle}
                </p>
              </div>

              {/* ── Body ───────────────────────────────────────────── */}
              <div className="px-6 pt-5 pb-6 sm:px-8 sm:pt-6 sm:pb-8">
                <ul className="space-y-5" role="list">
                  {benefits.map((item, i) => {
                    const BIcon = item.icon;
                    return (
                      <motion.li
                        key={item.title}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.22,
                          delay: 0.06 + i * 0.055,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="flex gap-3.5"
                      >
                        <BIcon
                          size={14}
                          strokeWidth={1.6}
                          className="mt-1 shrink-0 text-gold-dark"
                        />
                        <div>
                          <p className="font-sub text-[15px] font-semibold leading-snug text-ink">
                            {item.title}
                          </p>
                          <p className="mt-1 font-sub text-[14px] leading-relaxed text-ink-soft">
                            {item.text}
                          </p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Actions */}
                <div className="mt-7 space-y-3 border-t border-line pt-6">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex h-12 w-full items-center justify-center bg-brand text-[11px] uppercase tracking-[0.22em] text-bg-primary transition-all duration-200 hover:brightness-90 active:scale-[0.997] sm:h-[52px]"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={onClose}
                    className="flex h-12 w-full items-center justify-center border border-ink/25 text-[11px] uppercase tracking-[0.22em] text-ink transition-all duration-200 hover:border-ink hover:bg-ink hover:text-bg-primary active:scale-[0.997] sm:h-[52px]"
                  >
                    Create an account
                  </Link>

                  <button
                    type="button"
                    onClick={onClose}
                    className="mx-auto flex h-10 w-full items-center justify-center text-[13px] text-ink-soft transition-colors hover:text-ink"
                  >
                    Continue browsing
                  </button>
                </div>

                {/* Safe area pad for mobile home bar */}
                <div className="pb-[env(safe-area-inset-bottom)] sm:pb-0" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
