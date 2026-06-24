'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Bell, Shield, ShoppingBag, Heart, X } from 'lucide-react';

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
  const content = COPY[trigger];
  const Icon = content.icon;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[120] overflow-y-auto"
          aria-labelledby="login-prompt-title"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="fixed inset-0 h-full w-full bg-ink/55 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Shell */}
          <div className="relative flex min-h-[100svh] items-start justify-center px-3 py-4 sm:px-5 sm:py-8 md:items-center md:px-6 md:py-10">
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.965 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{
                duration: 0.34,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full max-w-[92vw] sm:max-w-[560px] md:max-w-[620px]"
            >
              <div className="overflow-hidden border border-line bg-paper shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                {/* Close */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-line/80 bg-paper/92 text-ink-soft backdrop-blur transition-all duration-200 hover:border-ink hover:text-ink sm:right-4 sm:top-4"
                >
                  <X size={16} />
                </button>

                {/* Top */}
                <div className="relative border-b border-line px-5 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8 md:px-8 md:pb-8 md:pt-9">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center bg-brand text-bg-primary shadow-sm sm:h-12 sm:w-12">
                    <Icon size={18} />
                  </div>

                  <h2
                    id="login-prompt-title"
                    className="max-w-[26rem] font-heading text-[2rem] leading-[1.02] text-ink sm:text-[2.35rem] md:text-[2.7rem]"
                  >
                    {content.title}
                  </h2>

                  <p className="mt-3 max-w-[32rem] font-sub text-sm leading-relaxed text-ink-soft sm:text-[15px] md:text-base">
                    {content.subtitle}
                  </p>
                </div>

                {/* Body */}
                <div className="max-h-[calc(100svh-10rem)] overflow-y-auto px-5 py-5 sm:max-h-[calc(100svh-12rem)] sm:px-7 sm:py-6 md:px-8 md:py-7">
                  <div className="space-y-5 sm:space-y-6">
                    {benefits.map((item, i) => {
                      const BenefitIcon = item.icon;
                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.28,
                            delay: 0.08 + i * 0.06,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="flex gap-3 sm:gap-4"
                        >
                          <div className="mt-0.5 shrink-0 text-gold-dark">
                            <BenefitIcon size={15} strokeWidth={1.6} />
                          </div>
                          <div>
                            <p className="font-sub text-[15px] font-medium leading-snug text-ink sm:text-base">
                              {item.title}
                            </p>
                            <p className="mt-1.5 max-w-[30rem] font-sub text-sm leading-relaxed text-ink-soft sm:text-[15px]">
                              {item.text}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="mt-7 space-y-3 border-t border-line pt-5 sm:mt-8 sm:pt-6">
                    <Link
                      href="/login"
                      className="flex h-12 w-full items-center justify-center bg-brand px-6 text-[11px] uppercase tracking-[0.24em] text-bg-primary transition-all duration-300 hover:brightness-95 active:scale-[0.995] sm:h-[54px]"
                    >
                      Sign in
                    </Link>

                    <Link
                      href="/register"
                      className="flex h-12 w-full items-center justify-center border border-ink/30 bg-transparent px-6 text-[11px] uppercase tracking-[0.24em] text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-bg-primary active:scale-[0.995] sm:h-[54px]"
                    >
                      Create an account
                    </Link>

                    <button
                      type="button"
                      onClick={onClose}
                      className="mx-auto flex min-h-[44px] items-center justify-center px-3 pt-1 text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
                    >
                      Continue browsing
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
