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
    text: 'Saved to your account — pick up where you left off on any device.',
  },
  {
    icon: Bell,
    title: 'Never miss a restock',
    text: 'Get notified when a wishlisted fabric is back in stock or on sale.',
  },
  {
    icon: Shield,
    title: 'Faster, safer checkout',
    text: 'Details saved securely — checkout takes seconds, not minutes.',
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
          {/* ── Backdrop — starts below navbar ───────────────────────── */}
          <motion.div
            key="backdrop"
            className="fixed inset-x-0 bottom-0 z-[110] bg-ink/60 backdrop-blur-[4px]"
            style={{ top: 'var(--navbar-h, 110px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            aria-hidden="true"
            onClick={onClose}
          />

          {/* ── Positioner ───────────────────────────────────────────── */}
          <div
            className="fixed inset-x-0 bottom-0 z-[111] flex items-end justify-center sm:items-center sm:px-4"
            style={{ top: 'var(--navbar-h, 110px)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lp-title"
          >
            {/* ── Card ─────────────────────────────────────────────────── */}
            <motion.div
              key="dialog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full bg-paper sm:max-w-[420px] sm:rounded-sm"
              style={{
                maxHeight: 'calc(100dvh - var(--navbar-h, 110px) - 1.5rem)',
                overflowY: 'auto',
                boxShadow: '0 24px 64px rgba(0,0,0,0.22), 0 1px 0 rgba(0,0,0,0.06)',
              }}
            >
              {/* Close */}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line/60 bg-paper text-ink-soft transition hover:border-ink/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              >
                <X size={13} />
              </button>

              {/* ── Header ─────────────────────────────────────────────── */}
              <div className="border-b border-line px-5 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center bg-brand text-bg-primary">
                  <Icon size={15} />
                </div>

                {/* Title — larger, heavier, full ink colour */}
                <h2
                  id="lp-title"
                  className="font-heading text-[1.55rem] font-normal leading-[1.1] tracking-[-0.02em] text-ink sm:text-[1.7rem]"
                >
                  {content.title}
                </h2>

                {/* Subtitle — uses text-ink not text-ink-soft for legibility */}
                <p className="mt-2 font-sub text-[14px] leading-relaxed text-ink">
                  {content.subtitle}
                </p>
              </div>

              {/* ── Benefits ───────────────────────────────────────────── */}
              <div className="px-5 pt-4 pb-2 sm:px-6 sm:pt-5">
                <ul className="space-y-4" role="list">
                  {benefits.map((item, i) => {
                    const BIcon = item.icon;
                    return (
                      <motion.li
                        key={item.title}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.18,
                          delay: 0.05 + i * 0.045,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="flex gap-3"
                      >
                        {/* Icon — slightly larger, stronger colour */}
                        <BIcon
                          size={15}
                          strokeWidth={1.7}
                          className="mt-0.5 shrink-0 text-brand"
                        />
                        <div>
                          {/* Benefit title — semibold + full ink */}
                          <p className="font-sub text-[14px] font-semibold leading-snug text-ink">
                            {item.title}
                          </p>
                          {/* Benefit body — 13px but text-ink not text-ink-soft */}
                          <p className="mt-1 font-sub text-[13px] leading-relaxed text-ink/75">
                            {item.text}
                          </p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>

              {/* ── Actions ────────────────────────────────────────────── */}
              <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                <div className="space-y-2 border-t border-line pt-4">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex h-11 w-full items-center justify-center bg-brand text-[11px] font-medium uppercase tracking-[0.22em] text-bg-primary transition-all duration-200 hover:brightness-90 active:scale-[0.998]"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={onClose}
                    className="flex h-11 w-full items-center justify-center border border-ink/30 text-[11px] font-medium uppercase tracking-[0.22em] text-ink transition-all duration-200 hover:border-ink hover:bg-ink hover:text-bg-primary active:scale-[0.998]"
                  >
                    Create an account
                  </Link>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-full items-center justify-center font-sub text-[13px] font-medium text-ink/60 transition-colors hover:text-ink"
                  >
                    Continue browsing
                  </button>
                </div>

                {/* Mobile home-bar safe area */}
                <div className="pb-[env(safe-area-inset-bottom)] sm:pb-0" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
