'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { getProducts, type Product } from '@/lib/api';
import { ProductCard } from '@/components/product-card';

export default function WishlistPage() {
  const { wishlist } = useCart();
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({})
      .then((p) => setAll(p))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = all.filter((p) => wishlist.includes(p.slug));

  return (
    <div data-testid="wishlist-page" className="bg-paper min-h-[80vh] relative overflow-hidden">
      <div aria-hidden className="absolute top-32 -left-40 w-[600px] h-[600px] rounded-full bg-brand/[0.05] blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-20 -right-40 w-[500px] h-[500px] rounded-full bg-gold/[0.07] blur-3xl pointer-events-none" />

      <section className="relative pt-40 pb-12 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <p className="eyebrow">Your Wishlist · आवडते</p>
        <h1 className="display-1 text-5xl md:text-7xl lg:text-8xl text-ink mt-6 leading-[0.95]">
          {items.length === 0 ? (
            <>Nothing saved <span className="italic text-brand">yet.</span></>
          ) : (
            <>{items.length} {items.length === 1 ? 'piece' : 'pieces'} <span className="italic text-brand">saved.</span></>
          )}
        </h1>
        <p className="font-accent text-brand mt-6 text-xl md:text-2xl">
          {items.length === 0 ? 'काही जोडलं नाही' : 'तुमचे आवडते विणकाम'}
        </p>
      </section>

      {!loading && items.length === 0 && (
        <section className="max-w-[800px] mx-auto px-6 pb-32 text-center">
          <Heart size={26} className="text-brand mx-auto mb-6" strokeWidth={1.2} />
          <p className="font-sub text-ink-soft text-lg">
            Save your favourite weaves to come back to them later.
          </p>
          <Link href="/shop" data-testid="wishlist-shop" className="btn-primary mt-10">
            Browse the collection
          </Link>
        </section>
      )}
      {!loading && items.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {items.map((p, i) => (
              <ProductCard key={p.slug} p={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
