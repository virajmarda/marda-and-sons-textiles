'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  X,
} from 'lucide-react';

export type LoginPromptTrigger = 'bag' | 'wishlist';

type LoginPromptDialogProps = {
  open: boolean;
  trigger: LoginPromptTrigger;
  onClose: () => void;

  /**
   * Enable only after login, registration and the
   * server-verified customer session are operational.
   * This flag does not authenticate the customer.
   */
  authEnabled?: boolean;
};

const COPY = {
  bag: {
    icon: ShoppingBag,
    title: 'Sign in to add to your Bag',
    subtitle: "Don't lose what you love.",
    description:
      'Please sign in before adding this product to your bag.',
  },
  wishlist: {
    icon: Heart,
    title: 'Sign in to save your favourites',
    subtitle: 'Keep your favourites close.',
    description:
      'Please sign in before saving this product to your wishlist.',
  },
} as const;

export function LoginPromptDialog({
  open,
  trigger,
  onClose,
  authEnabled = false,
}: LoginPromptDialogProps) {
  const [mounted, setMounted] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const titleId = useId();
  const descriptionId = useId();

  const content = COPY[trigger];
  const Icon = content.icon;

  const returnPath =
    pathname?.startsWith('/') &&
    !pathname.startsWith('//')
      ? pathname
      : '/';

  const authQuery = new URLSearchParams({
    next: returnPath,
  }).toString();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!mounted || !open || !dialog) {
      return;
    }

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow =
      document.body.style.overflow;

    if (!dialog.open) {
      dialog.showModal();
    }

    document.body.style.overflow = 'hidden';

    closeRef.current?.focus({
      preventScroll: true,
    });

    return () => {
      if (dialog.open) {
        dialog.close();
      }

      document.body.style.overflow = previousOverflow;

      if (previousFocus?.isConnected) {
        previousFocus.focus({
          preventScroll: true,
        });
      }
    };
  }, [mounted, open]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-transparent p-0 text-ink backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div
          className="flex min-h-full items-end justify-center px-4 pb-4 sm:items-center"
          style={{
            paddingTop:
              'calc(var(--navbar-h, 110px) + 1rem)',
            paddingBottom:
              'max(1rem, env(safe-area-inset-bottom))',
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            key={trigger}
            initial={
              reducedMotion
                ? false
                : {
                    opacity: 0,
                    y: 16,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-full max-w-[420px] overflow-y-auto overscroll-contain rounded-sm bg-paper shadow-2xl"
            style={{
              maxHeight:
                'calc(100dvh - var(--navbar-h, 110px) - 2rem)',
            }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close sign-in prompt"
              className="absolute right-2 top-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <div className="border-b border-line px-5 pb-5 pt-6 sm:px-6">
              <Icon
                size={24}
                strokeWidth={1.5}
                aria-hidden="true"
                className="mb-4 text-brand"
              />

              <h2
                id={titleId}
                className="pr-10 font-heading text-2xl font-normal leading-tight tracking-tight text-ink"
              >
                {content.title}
              </h2>

              <p className="mt-2 font-sub text-base leading-relaxed text-ink">
                {content.subtitle}
              </p>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-6">
              <p
                id={descriptionId}
                className="font-sub text-sm leading-relaxed text-ink"
              >
                {content.description}
              </p>

              <p className="font-sub text-sm leading-relaxed text-ink">
                Items or favourites stored only in your browser
                may be lost if you clear browsing data. They do
                not automatically appear on another device.
              </p>

              {!authEnabled && (
                <div
                  role="note"
                  className="border border-line p-4"
                >
                  <p className="font-sub text-sm font-semibold text-ink">
                    Customer sign-in is coming soon.
                  </p>

                  <p className="mt-2 font-sub text-sm leading-relaxed text-ink">
                    Adding to your bag and wishlist is not
                    available yet. You can continue browsing
                    or contact the store about this product.
                  </p>
                </div>
              )}
            </div>

            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
              <div className="space-y-3 border-t border-line pt-5">
                {authEnabled ? (
                  <>
                    <Link
                      href={`/login?${authQuery}`}
                      onClick={onClose}
                      className="flex min-h-[44px] w-full items-center justify-center bg-brand px-4 py-3 font-sub text-sm font-medium text-bg-primary transition-colors hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      Sign in
                    </Link>

                    <Link
                      href={`/register?${authQuery}`}
                      onClick={onClose}
                      className="flex min-h-[44px] w-full items-center justify-center border border-ink px-4 py-3 font-sub text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      Create an account
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="flex min-h-[44px] w-full items-center justify-center bg-brand px-4 py-3 font-sub text-sm font-medium text-bg-primary transition-colors hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Contact the store
                  </Link>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="flex min-h-[44px] w-full items-center justify-center px-4 py-3 font-sub text-sm font-medium text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Continue browsing
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </dialog>,
    document.body,
  );
}
