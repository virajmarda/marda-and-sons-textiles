'use client';

import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

type ProductErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ProductError({
  reset,
}: ProductErrorProps) {
  return (
    <section
      aria-labelledby="product-error-heading"
      className="mx-auto min-h-[65vh] max-w-3xl px-6 pb-20 pt-36 md:px-12"
    >
      <p className="eyebrow text-ink-soft">
        Temporary connection problem
      </p>

      <h1
        id="product-error-heading"
        className="mt-4 font-heading text-3xl leading-tight text-ink md:text-4xl"
      >
        We could not load this product.
      </h1>

      <p className="mt-5 font-sub text-base leading-relaxed text-ink-soft">
        Product information is temporarily unavailable.
        Please try again or contact the store for assistance.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          data-testid="product-error-retry"
          className="btn-primary min-h-[44px]"
        >
          <RefreshCw
            size={16}
            aria-hidden="true"
          />
          Try again
        </button>

        <Link
          href="/contact"
          className="btn-ghost min-h-[44px]"
        >
          Contact the store
        </Link>
      </div>

      <Link
        href="/shop"
        className="mt-6 inline-flex min-h-[44px] items-center font-sub text-sm text-ink underline underline-offset-4"
      >
        Back to shop
      </Link>
    </section>
  );
}
