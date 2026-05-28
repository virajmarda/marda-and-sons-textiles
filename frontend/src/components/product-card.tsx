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

  const img1 = p.images?.[0] || '';
  const img2 = p.images?.[1] || img1;

  return (
    <article
      data-testid={`product-card-${p.slug}`}
      className="group img-zoom-host relative animate-fade-up"
      style={{ animationDelay: `${(index % 6) * 70}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-bg-secondary">
          {/* Image */}
          <img
            src={hover ? img2 : img1}
            alt={p.name}
            className="w-full h-full object-cover img-zoom transition-opacity duration-700"
          />

          {/* Badges */}
          {p.badges && p.badges.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {p.badges.slice(0, 2).map((b) => (
                <span
                  key={b}
                  className="bg-bg-primary/90 backdrop-blur text-ink eyebrow px-3 py-1 text-[9.5px]"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          {/* Wishlist */}
          <button
            data-testid={`wishlist-btn-${p.slug}`}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(p.slug);
              toast.success(wished ? 'Removed from wishlist' : 'Saved to wishlist');
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-bg-primary/90 backdrop-blur flex items-center justify-center hover:bg-bg-primary transition"
            aria-label="Wishlist"
          >
            <Heart size={15} strokeWidth={1.4} className={wished ? 'fill-brand text-brand' : 'text-ink'} />
          </button>

          {/* Quick add */}
          <button
            data-testid={`quick-add-${p.slug}`}
            onClick={(e) => {
              e.preventDefault();
              add({ slug: p.slug, name: p.name, image: img1, price: p.price_retail, qty: 1, mode: 'retail' });
              toast.success(`${p.name} · added to bag`);
            }}
            className={`absolute bottom-0 left-0 right-0 bg-ink text-bg-primary py-4 uppercase tracking-[0.22em] text-[10.5px] flex items-center justify-center gap-2 transition-transform duration-500 ${
              hover ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <ShoppingBag size={13} strokeWidth={1.4} /> Add to Bag
          </button>
        </div>

        <div className="flex justify-between items-baseline mt-5 gap-4">
          <div className="min-w-0">
            <h3 className="font-sub text-base md:text-lg text-ink truncate">{p.name}</h3>
            {p.subtitle && <p className="text-[11px] uppercase tracking-[0.22em] text-ink-soft mt-1 truncate">{p.subtitle}</p>}
          </div>
          <div className="text-right shrink-0">
            <p className="font-heading text-ink text-base md:text-lg">{inr(p.price_retail)}</p>
            <p className="eyebrow text-gold-dark mt-1 text-[9.5px]">Wholesale {inr(p.price_wholesale)}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
