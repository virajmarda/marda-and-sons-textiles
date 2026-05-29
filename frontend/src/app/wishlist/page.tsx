'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { getProducts, type Product } from '@/lib/api';
import { ProductCard } from '@/components/product-card';
import { PageHero } from '@/components/page-hero';

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
    <div data-testid="wishlist-page" className="bg-paper min-h-[80vh]">
      <PageHero
        chapter="07"
        eyebrow="Your Wishlist · आवडते"
        marathi={items.length === 0 ? 'काही जोडलं नाही' : 'तुमचे आवडते विणकाम'}
        headline={items.length === 0 ? (
          <>Nothing saved <span className="italic text-brand">yet.</span></>
        ) : (
          <>{items.length} {items.length === 1 ? 'piece' : 'pieces'} <span className="italic text-brand">saved.</span></>
        )}
        height="md"
      />

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
