'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Heart,
  RefreshCcw,
} from 'lucide-react';

import { useCart } from '@/lib/cart-context';
import {
  getProducts,
  type Product,
} from '@/lib/api';

import { ProductCard } from '@/components/product-card';
import { PageHero } from '@/components/page-hero';

type LoadStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export default function WishlistPage() {
  const { wishlist, mounted } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const savedSlugs = useMemo(
    () => Array.from(new Set(wishlist)),
    [wishlist],
  );

  const savedCount = savedSlugs.length;
  const hasSavedItems = savedCount > 0;

  useEffect(() => {
    if (!mounted) return;

    if (!hasSavedItems) {
      setProducts([]);
      setError('');
      setStatus('idle');
      return;
    }

    let active = true;

    async function loadProducts() {
      setStatus('loading');
      setError('');

      try {
        const result = await getProducts({
          limit: 200,
        });

        if (!active) return;

        setProducts(result);
        setStatus('success');
      } catch (requestError) {
        if (!active) return;

        setProducts([]);

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'We could not load the catalogue. Please try again.',
        );

        setStatus('error');
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, [mounted, hasSavedItems, retryCount]);

  const savedProducts = useMemo(() => {
    const productsBySlug = new Map(
      products.map((product) => [
        product.slug,
        product,
      ]),
    );

    return savedSlugs
      .map((slug) => productsBySlug.get(slug))
      .filter(
        (product): product is Product =>
          product !== undefined,
      );
  }, [products, savedSlugs]);

  const unresolvedCount =
    savedCount - savedProducts.length;

  const loading =
    !mounted ||
    (
      hasSavedItems &&
      (status === 'idle' || status === 'loading')
    );

  const empty = mounted && !hasSavedItems;

  const showError =
    mounted &&
    hasSavedItems &&
    status === 'error';

  const showResults =
    mounted &&
    hasSavedItems &&
    status === 'success';

  return (
    <div
      data-testid="wishlist-page"
      className="min-h-[80vh] bg-paper"
    >
      <PageHero
        chapter="07"
        eyebrow="Your Wishlist · आवडते"
        marathi={
          empty
            ? 'काही जोडलं नाही'
            : 'तुमचे आवडते विणकाम'
        }
        headline={
          empty ? (
            <>
              Nothing saved{' '}
              <span className="italic text-brand">
                yet.
              </span>
            </>
          ) : (
            <>
              Your favourite{' '}
              <span className="italic text-brand">
                pieces.
              </span>
            </>
          )
        }
        height="md"
      />

      {loading && (
        <section
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="mx-auto max-w-[1600px] px-6 pb-24 md:px-12 md:pb-32 lg:px-24"
        >
          <p className="mb-8 font-sub text-sm text-ink-soft">
            Loading your wishlist…
          </p>

          <div
            aria-hidden="true"
            className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[0, 1, 2, 3].map((index) => (
              <div key={index}>
                <div className="aspect-[4/5] bg-bg-secondary" />

                <div className="mt-5 h-4 w-3/4 bg-bg-secondary" />

                <div className="mt-3 h-3 w-1/2 bg-bg-secondary" />
              </div>
            ))}
          </div>
        </section>
      )}

      {empty && (
        <section className="mx-auto max-w-[800px] px-6 pb-24 text-center md:pb-32">
          <Heart
            size={28}
            strokeWidth={1.3}
            aria-hidden="true"
            className="mx-auto mb-6 text-brand"
          />

          <p className="font-sub text-base leading-relaxed text-ink-soft sm:text-lg">
            Save your favourite pieces using the heart
            on a product card, then return here to
            explore them again.
          </p>

          <Link
            href="/shop"
            data-testid="wishlist-shop"
            className="btn-primary mt-8 justify-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            Browse the collection
            <ArrowRight
              size={15}
              aria-hidden="true"
            />
          </Link>
        </section>
      )}

      {showError && (
        <section className="mx-auto max-w-2xl px-6 pb-24 md:pb-32">
          <div className="border border-line bg-paper-2 p-6 sm:p-8">
            <h2 className="font-heading text-2xl text-ink">
              Your saved selections are still here.
            </h2>

            <p className="mt-4 font-sub text-base leading-relaxed text-ink-soft">
              We could not load their product details.
              The catalogue may be temporarily unavailable
              or not yet connected.
            </p>

            <p
              role="alert"
              data-testid="wishlist-error"
              className="mt-3 font-sub text-sm leading-relaxed text-ink-soft"
            >
              {error}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                data-testid="wishlist-retry"
                onClick={() =>
                  setRetryCount((current) => current + 1)
                }
                className="btn-primary justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                <RefreshCcw
                  size={15}
                  aria-hidden="true"
                />
                Try again
              </button>

              <Link
                href="/contact"
                className="btn-ghost justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Contact the store
              </Link>
            </div>
          </div>
        </section>
      )}

      {showResults && (
        <section className="mx-auto max-w-[1600px] px-6 pb-24 md:px-12 md:pb-32 lg:px-24">
          <p className="mb-8 font-sub text-sm text-ink-soft">
            {savedCount}{' '}
            {savedCount === 1
              ? 'selection saved'
              : 'selections saved'}
          </p>

          {unresolvedCount > 0 && (
            <div
              role="status"
              data-testid="wishlist-unresolved"
              className="mb-10 border border-line bg-paper-2 p-5 sm:p-6"
            >
              <p className="font-sub text-sm leading-relaxed text-ink-soft">
                {unresolvedCount}{' '}
                {unresolvedCount === 1
                  ? 'saved selection could'
                  : 'saved selections could'}{' '}
                not be matched to the catalogue returned
                by the service. Your saved references
                have not been removed.
              </p>

              <Link
                href="/contact"
                className="mt-3 inline-flex min-h-[44px] items-center font-sub text-sm text-ink underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Ask the store about availability
              </Link>
            </div>
          )}

          {savedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {savedProducts.map((product, index) => (
                <ProductCard
                  key={product.slug}
                  p={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl">
              <h2 className="font-heading text-2xl text-ink">
                No matching product details are available.
              </h2>

              <p className="mt-4 font-sub text-base leading-relaxed text-ink-soft">
                You can continue browsing or contact
                the store for current availability.
              </p>

              <Link
                href="/shop"
                data-testid="wishlist-shop"
                className="btn-primary mt-6 justify-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Browse the collection
                <ArrowRight
                  size={15}
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
