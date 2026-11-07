'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

import { inr, type Product } from '@/lib/api';

import {
  LoginPromptDialog,
  type LoginPromptTrigger,
} from '@/components/login-prompt-dialog';

type ProductCardProps = {
  p: Product;
  index?: number;
};

type ProductImageProps = {
  primarySrc: string;
  secondarySrc: string;
  showSecondary: boolean;
  alt: string;
};

function ProductImage({
  primarySrc,
  secondarySrc,
  showSecondary,
  alt,
}: ProductImageProps) {
  const [failedSources, setFailedSources] = useState<string[]>([]);

  const requestedSrc = showSecondary
    ? secondarySrc || primarySrc
    : primarySrc;

  const requestedAvailable =
    Boolean(requestedSrc) &&
    !failedSources.includes(requestedSrc);

  const primaryAvailable =
    Boolean(primarySrc) &&
    !failedSources.includes(primarySrc);

  const source = requestedAvailable
    ? requestedSrc
    : primaryAvailable
      ? primarySrc
      : '';

  function handleImageError() {
    if (!source) {
      return;
    }

    setFailedSources((current) =>
      current.includes(source)
        ? current
        : [...current, source],
    );
  }

  if (!source) {
    return (
      <div
        role="img"
        aria-label={`${alt} — photograph unavailable`}
        className="flex h-full w-full items-center justify-center bg-bg-secondary px-6 text-center"
      >
        <span className="font-sub text-sm text-ink-soft">
          Product photograph unavailable
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source}
      alt={alt}
      width={640}
      height={800}
      loading="lazy"
      decoding="async"
      onError={handleImageError}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
    />
  );
}

export function ProductCard({
  p,
  index = 0,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  const [loginPrompt, setLoginPrompt] =
    useState<LoginPromptTrigger | null>(null);

  const productHref =
    `/product/${encodeURIComponent(p.slug)}`;

  const primaryImage = p.images?.[0] ?? '';
  const secondaryImage = p.images?.[1] ?? '';

  const retailPrice = p.price_retail;
  const wholesalePrice = p.price_wholesale;
  const wholesaleMinimum = p.moq_wholesale;

  const unavailable = p.in_stock === false;

  const hasRetailPrice =
    typeof retailPrice === 'number' &&
    Number.isFinite(retailPrice) &&
    retailPrice > 0;

  const hasWholesalePrice =
    typeof wholesalePrice === 'number' &&
    Number.isFinite(wholesalePrice) &&
    wholesalePrice > 0 &&
    typeof wholesaleMinimum === 'number' &&
    Number.isInteger(wholesaleMinimum) &&
    wholesaleMinimum > 0;

  const quickFacts = [
    p.materials?.length
      ? p.materials.join(', ')
      : '',
    p.dimensions ?? '',
  ].filter(Boolean);

  const badges = Array.from(
    new Set(p.badges ?? []),
  ).slice(0, 2);

  function handleWishlist() {
    setLoginPrompt('wishlist');
  }

  function handleAddToBag() {
    if (unavailable || !hasRetailPrice) {
      return;
    }

    setLoginPrompt('bag');
  }

  function closeLoginPrompt() {
    setLoginPrompt(null);
  }

  return (
    <article
      data-testid={`product-card-${p.slug}`}
      className="group relative animate-fade-up motion-reduce:animate-none"
      style={{
        animationDelay: `${(index % 6) * 70}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-bg-secondary">
        <Link
          href={productHref}
          aria-label={`View ${p.name}`}
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <ProductImage
              key={`${primaryImage}|${secondaryImage}`}
              primarySrc={primaryImage}
              secondarySrc={secondaryImage}
              showSecondary={hovered}
              alt={p.name}
            />

            {badges.length > 0 && (
              <div className="absolute left-3 top-3 flex max-w-[65%] flex-col items-start gap-2 sm:left-4 sm:top-4">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="bg-bg-primary/95 px-3 py-1 font-sub text-xs text-ink"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>

        <button
          type="button"
          data-testid={`wishlist-btn-${p.slug}`}
          onClick={handleWishlist}
          aria-haspopup="dialog"
          aria-label={`Sign in to save ${p.name} to your wishlist`}
          className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center bg-bg-primary/95 text-ink transition-colors hover:bg-bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:right-4 sm:top-4"
        >
          <Heart
            size={17}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          {unavailable ? (
            <button
              type="button"
              disabled
              data-testid={`quick-add-${p.slug}`}
              className="inline-flex min-h-[44px] w-full cursor-not-allowed items-center justify-center gap-2 bg-ink px-4 py-3 font-sub text-sm text-bg-primary opacity-60"
            >
              <ShoppingBag
                size={15}
                aria-hidden="true"
              />

              Currently unavailable
            </button>
          ) : hasRetailPrice ? (
            <button
              type="button"
              onClick={handleAddToBag}
              data-testid={`quick-add-${p.slug}`}
              aria-haspopup="dialog"
              aria-label={`Sign in to add ${p.name} to your bag`}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-ink px-4 py-3 font-sub text-sm text-bg-primary transition-colors hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <ShoppingBag
                size={15}
                aria-hidden="true"
              />

              Add to Bag
            </button>
          ) : (
            <Link
              href={productHref}
              data-testid={`quick-add-${p.slug}`}
              aria-label={`View details and enquiry options for ${p.name}`}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-ink px-4 py-3 font-sub text-sm text-bg-primary transition-colors hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <ShoppingBag
                size={15}
                aria-hidden="true"
              />

              View details &amp; enquire
            </Link>
          )}
        </div>
      </div>

      <div className="mt-5">
        <Link
          href={productHref}
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <h3 className="font-sub text-base text-ink md:text-lg">
            {p.name}
          </h3>

          {p.subtitle && (
            <p className="mt-1 font-sub text-sm text-ink-soft">
              {p.subtitle}
            </p>
          )}

          {quickFacts.length > 0 && (
            <p className="mt-2 font-sub text-sm text-ink-soft">
              {quickFacts.join(' · ')}
            </p>
          )}

          {p.care && (
            <p className="mt-1 font-sub text-xs leading-relaxed text-ink-soft">
              Care: {p.care}
            </p>
          )}
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-heading text-lg text-ink">
              {hasRetailPrice
                ? inr(retailPrice)
                : 'Price on enquiry'}
            </p>

            {unavailable && (
              <p className="mt-1 font-sub text-xs text-ink-soft">
                Currently unavailable
              </p>
            )}
          </div>

          <div className="text-right">
            {hasWholesalePrice ? (
              <p className="font-sub text-xs leading-relaxed text-ink-soft">
                Wholesale {inr(wholesalePrice)}
                <br />
                Minimum {wholesaleMinimum} units
              </p>
            ) : (
              <Link
                href="/wholesale"
                className="inline-flex min-h-[44px] items-center font-sub text-xs text-ink-soft underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Request bulk pricing
              </Link>
            )}
          </div>
        </div>
      </div>

      <LoginPromptDialog
        open={loginPrompt !== null}
        trigger={loginPrompt ?? 'bag'}
        onClose={closeLoginPrompt}
      />
    </article>
  );
}
