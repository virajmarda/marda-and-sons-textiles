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
          className="fixed inset-0 z-[120]"
          aria-labelledby="login-prompt-title"
          aria-modal="true"
          role="dialog"
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute inset-0 h-full w-full bg-ink/50 backdrop-blur-[5px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="absolute inset-x-0 top-[118px] bottom-0 flex items-start justify-center px-4 pb-6 pt-3 sm:top-[124px] sm:px-5 md:top-[130px] md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.975 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.985 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[640px]"
            >
              <div className="overflow-hidden border border-line bg-paper shadow-[0_22px_70px_rgba(0,0,0,0.18)]">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-line/80 bg-paper/92 text-ink-soft backdrop-blur transition-all duration-200 hover:border-ink hover:text-ink"
                >
                  <X size={15} />
                </button>

                <div className="border-b border-line px-6 pb-4 pt-6 sm:px-8 sm:pb-5 sm:pt-7">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center bg-brand text-bg-primary shadow-sm">
                    <Icon size={16} />
                  </div>

                  <h2
                    id="login-prompt-title"
                    className="max-w-[20rem] font-heading text-[3rem] leading-[0.92] tracking-[-0.03em] text-ink sm:max-w-[22rem] sm:text-[3.25rem]"
                  >
                    {content.title}
                  </h2>

                  <p className="mt-2 font-sub text-[15px] leading-relaxed text-ink-soft">
                    {content.subtitle}
                  </p>
                </div>

                <div className="px-6 py-5 sm:px-8 sm:py-6">
                  <div className="space-y-4">
                    {benefits.map((item, i) => {
                      const BenefitIcon = item.icon;
                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.24,
                            delay: 0.05 + i * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="flex gap-3"
                        >
                          <div className="mt-1 shrink-0 text-gold-dark">
                            <BenefitIcon size={14} strokeWidth={1.55} />
                          </div>

                          <div>
                            <p className="font-sub text-[15px] font-medium leading-snug text-ink">
                              {item.title}
                            </p>
                            <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                              {item.text}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-6 border-t border-line pt-5">
                    <div className="space-y-3">
                      <Link
                        href="/login"
                        className="flex h-[50px] w-full items-center justify-center bg-brand px-6 text-[11px] uppercase tracking-[0.24em] text-bg-primary transition-all duration-300 hover:brightness-95 active:scale-[0.995]"
                      >
                        Sign in
                      </Link>

                      <Link
                        href="/register"
                        className="flex h-[50px] w-full items-center justify-center border border-ink/30 bg-transparent px-6 text-[11px] uppercase tracking-[0.24em] text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-bg-primary active:scale-[0.995]"
                      >
                        Create an account
                      </Link>

                      <button
                        type="button"
                        onClick={onClose}
                        className="mx-auto flex h-9 items-center justify-center px-3 text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
                      >
                        Continue browsing
                      </button>
                    </div>
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
