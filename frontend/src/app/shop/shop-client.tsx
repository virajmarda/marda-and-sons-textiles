'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { PageHero } from '@/components/page-hero';
import { type Product, type Category } from '@/lib/api';

const SORT_OPTIONS = [
  { value: 'featured',    label: 'Curated' },
  { value: 'price-asc',  label: 'Price · Low to High' },
  { value: 'price-desc', label: 'Price · High to Low' },
  { value: 'name',       label: 'Alphabetical' },
];

interface ShopClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export function ShopClient({ initialProducts, initialCategories }: ShopClientProps) {
  const router = useRouter();
  const sp     = useSearchParams();

  const activeCat    = sp.get('category') || 'all';
  const queryFromUrl = sp.get('q') || '';

  // Keep the search input in sync with the URL (browser back/forward).
  const [q, setQ] = useState(queryFromUrl);
  useEffect(() => { setQ(queryFromUrl); }, [queryFromUrl]);

  const [sort, setSort]               = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const products = initialProducts;
  const cats     = initialCategories;

  function updateParams(params: Record<string, string | undefined>) {
    const current = new URLSearchParams(Array.from(sp.entries()));
    for (const [key, val] of Object.entries(params)) {
      if (val === undefined || val === '') current.delete(key);
      else current.set(key, val);
    }
    router.push(`/shop?${current.toString()}`);
  }

  // Filtering uses the committed URL query, not the live input state.
  // This prevents confusing partial-match flicker while the user types.
  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCat !== 'all') {
      list = list.filter(
        (p) => p.category?.toLowerCase() === activeCat.toLowerCase(),
      );
    }
    if (queryFromUrl.trim()) {
      const qLower = queryFromUrl.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(qLower) ||
          p.category?.toLowerCase().includes(qLower) ||
          p.subtitle?.toLowerCase().includes(qLower),
      );
    }
    if (sort === 'price-asc')       list.sort((a, b) => a.price_retail - b.price_retail);
    else if (sort === 'price-desc') list.sort((a, b) => b.price_retail - a.price_retail);
    else if (sort === 'name')       list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [products, activeCat, queryFromUrl, sort]);

  return (
    <div data-testid="shop-client">
      <PageHero
        eyebrow="The Collection"
        marathi="संग्रह"
        headline={
          <>
            Woven in Solapur,{' '}
            <span className="italic text-brand">loved everywhere.</span>
          </>
        }
        lede="Heritage textiles — bedsheets, towels, phetas, shawls and more — crafted on Solapur’s finest power looms since 1970."
        height="md"
      />

      {/* Toolbar */}
      <div className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 md:px-12 lg:px-24">

          {/* Search */}
          <div className="relative flex min-w-[160px] flex-1 items-center sm:max-w-xs">
            <Search size={13} className="absolute left-0 text-ink-soft" aria-hidden="true" />
            <input
              aria-label="Search by name or fabric"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') updateParams({ q: q.trim() || undefined });
                if (e.key === 'Escape') { setQ(''); updateParams({ q: undefined }); }
              }}
              placeholder="SEARCH"
              className="input-line w-full pl-5 font-body text-xs uppercase tracking-widest"
            />
            {q && (
              <button
                onClick={() => { setQ(''); updateParams({ q: undefined }); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-line font-body text-xs uppercase tracking-widest cursor-pointer"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((f) => !f)}
            className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-ink-soft hover:text-ink transition-colors"
            aria-expanded={showFilters}
            aria-label="Toggle category filters"
          >
            <SlidersHorizontal size={13} />
            {activeCat !== 'all' ? '1 FILTER' : 'FILTER'}
          </button>

          {/* Count */}
          <span className="ml-auto font-body text-[10px] uppercase tracking-widest text-ink-soft">
            {filtered.length} PIECES
          </span>
        </div>

        {/* Category pills */}
        {showFilters && (
          <div className="mx-auto flex max-w-[1600px] flex-wrap gap-2 px-4 pb-3 sm:px-6 md:px-12 lg:px-24">
            <button
              onClick={() => updateParams({ category: undefined })}
              className={`px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors ${
                activeCat === 'all'
                  ? 'border-brand bg-brand text-white'
                  : 'border-line text-ink-soft hover:border-ink'
              }`}
            >
              All Collections
            </button>
            {cats.map((c) => (
              <button
                key={c.slug || c.name}
                onClick={() => updateParams({ category: c.name })}
                className={`px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors ${
                  activeCat.toLowerCase() === c.name.toLowerCase()
                    ? 'border-brand bg-brand text-white'
                    : 'border-line text-ink-soft hover:border-ink'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 md:px-12 lg:px-24">
        {filtered.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <p className="font-heading text-4xl text-ink mb-4">Nothing here yet.</p>
            <p className="font-accent text-brand text-lg opacity-70 mb-6">अजून काही नाही</p>
            <p className="font-body text-ink-soft text-sm max-w-sm">
              Try a different category or clear your search.
            </p>
            {(activeCat !== 'all' || queryFromUrl) && (
              <button
                onClick={() => updateParams({ category: undefined, q: undefined })}
                className="btn-ghost mt-8 px-6 py-2 text-xs tracking-widest uppercase"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.slug} p={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
