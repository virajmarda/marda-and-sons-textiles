'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/lib/api';
import { inr } from '@/lib/api';

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const { add, toggleWishlist, isWished } = useCart();
  const wished = isWished(p.slug);
  const [hover, setHover] = useState(false);

  const img1 = p.images?.[0] || '/placeholder-product.jpg';
  const img2 = p.images?.[1] || img1;

  const handleWishlist = () => {
    toggleWishlist(p.slug);
    toast.success(wished ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const handleAdd = () => {
    add({
      slug: p.slug,
      name: p.name,
      image: img1,
      price: p.price_retail,
      qty: 1,
      mode: 'retail',
    });
    toast.success(`${p.name} · added to bag`);
  };

  return (
    <article
      data-testid={`product-card-${p.slug}`}
      className="group relative animate-fade-up"
      style={{ animationDelay: `${(index % 6) * 70}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative">
        <Link href={`/product/${p.slug}`} className="block img-zoom-host">
          <div className="relative aspect-[4/5] overflow-hidden bg-bg-secondary">
            <img
              src={hover ? img2 : img1}
              alt={p.name}
              className="img-zoom h-full w-full object-cover transition-opacity duration-700"
              loading="lazy"
            />

            {p.badges && p.badges.length > 0 && (
              <div className="absolute left-3 top-3 flex flex-col gap-2 sm:left-4 sm:top-4">
                {p.badges.slice(0, 2).map((b) => (
                  <span
                    key={b}
                    className="eyebrow bg-bg-primary/90 px-3 py-1 text-[9.5px] text-ink backdrop-blur"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-end p-3 sm:p-4">
          <button
            type="button"
            data-testid={`wishlist-btn-${p.slug}`}
            onClick={handleWishlist}
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center bg-bg-primary/90 backdrop-blur transition hover:bg-bg-primary"
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={15}
              strokeWidth={1.4}
              className={wished ? 'fill-brand text-brand' : 'text-ink'}
            />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <button
            type="button"
            data-testid={`quick-add-${p.slug}`}
            onClick={handleAdd}
            className={`flex min-h-[44px] w-full items-center justify-center gap-2 bg-ink px-4 py-3 text-[10.5px] uppercase tracking-[0.22em] text-bg-primary transition-all duration-500 ${
              hover
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-100 sm:pointer-events-none sm:translate-y-full sm:opacity-0'
            }`}
          >
            <ShoppingBag size={13} strokeWidth={1.4} />
            Add to Bag
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <Link href={`/product/${p.slug}`} className="min-w-0 flex-1">
          <h3 className="truncate text-base text-ink font-sub md:text-lg">{p.name}</h3>
          {p.subtitle && (
            <p className="mt-1 truncate text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              {p.subtitle}
            </p>
          )}
        </Link>

        <div className="shrink-0 text-right">
          <p className="text-base text-ink font-heading md:text-lg">{inr(p.price_retail)}</p>
          <p className="mt-1 text-[9.5px] text-gold-dark eyebrow">
            Wholesale {inr(p.price_wholesale)}
          </p>
        </div>
      </div>
    </article>
  );
}
