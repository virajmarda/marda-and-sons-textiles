'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, X, ShieldCheck, BookmarkCheck, Bell } from 'lucide-react';

export type LoginPromptTrigger = 'bag' | 'wishlist';

interface LoginPromptDialogProps {
  open: boolean;
  trigger: LoginPromptTrigger;
  onClose: () => void;
}

const CONTENT = {
  bag: {
    icon: ShoppingBag,
    title: "Sign in to add to your Bag",
    subtitle: "Don't lose what you love.",
  },
  wishlist: {
    icon: Heart,
    title: "Sign in to save to Wishlist",
    subtitle: "Keep your favourites in one place.",
  },
} as const;

const REASONS = [
  {
    Icon: BookmarkCheck,
    heading: "Your cart stays with you",
    body: "Items you add are saved to your account — pick up right where you left off on any device.",
  },
  {
    Icon: Bell,
    heading: "Never miss a restock",
    body: "We'll notify you when a wishlisted fabric is back in stock or goes on sale.",
  },
  {
    Icon: ShieldCheck,
    heading: "Faster, safer checkout",
    body: "Your details are saved securely so checkout takes seconds — not minutes.",
  },
];

export function LoginPromptDialog({ open, trigger, onClose }: LoginPromptDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { icon: TriggerIcon, title, subtitle } = CONTENT[trigger];

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-md bg-bg-primary mx-4 sm:mx-0 animate-slide-up">

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center text-ink-soft hover:text-ink transition"
          aria-label="Close dialog"
        >
          <X size={18} strokeWidth={1.4} />
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-6 border-b border-border">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center bg-ink text-bg-primary">
            <TriggerIcon size={20} strokeWidth={1.4} />
          </div>
          <h2 className="font-heading text-2xl text-ink leading-tight">{title}</h2>
          <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
        </div>

        {/* Reasons */}
        <div className="px-8 py-6 space-y-5">
          {REASONS.map(({ Icon, heading, body }) => (
            <div key={heading} className="flex gap-4">
              <div className="mt-0.5 shrink-0">
                <Icon size={16} strokeWidth={1.4} className="text-gold-dark" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{heading}</p>
                <p className="mt-0.5 text-xs text-ink-soft leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="px-8 pb-8 grid gap-3">
          <Link
            href="/login"
            className="btn-primary justify-center"
            onClick={onClose}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn-ghost justify-center"
            onClick={onClose}
          >
            Create an Account
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="text-center text-xs text-ink-soft underline-offset-2 hover:underline hover:text-ink transition pt-1"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
