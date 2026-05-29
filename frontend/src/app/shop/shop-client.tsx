'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { PageHero } from '@/components/page-hero';
import { getProducts, getCategories, type Product, type Category } from '@/lib/api';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Curated' },
  { value: 'price-asc', label: 'Price · Low to High' },
  { value: 'price-desc', label: 'Price · High to Low' },
  { value: 'name', label: 'Alphabetical' },
];

export function ShopClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const activeCat = sp.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(sp.get('q') || '');
  const [sort, setSort] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      getProducts({ category: activeCat === 'all' ? undefined : activeCat, q: q || undefined }),
      getCategories(),
    ])
      .then(([p, c]) => {
        if (!alive) return;
        setProducts(p);
        setCats(c);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [activeCat, q]);

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === 'price-asc') list.sort((a, b) => a.price_retail - b.price_retail);
    else if (sort === 'price-desc') list.sort((a, b) => b.price_retail - a.price_retail);
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [products, sort]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(sp.toString());
    if (slug === 'all') params.delete('category');
    else params.set('category', slug);
    router.push(`/shop?${params.toString()}`);
  };

  const activeCategoryObj = cats.find((c) => c.slug === activeCat);

  return (
    <div data-testid="shop-page" className="bg-paper">
      <PageHero
        chapter="02"
        eyebrow="The Atelier · Shop"
        marathi={activeCategoryObj ? activeCategoryObj.marathi : 'प्रत्येक धागा, एक कथा'}
        headline={activeCategoryObj ? (
          <>{activeCategoryObj.name}</>
        ) : (
          <>Every weave,<br /><span className="italic text-brand">in one place.</span></>
        )}
        lede={activeCategoryObj ? <>{activeCategoryObj.tagline}</> : undefined}
        bgImage={activeCategoryObj?.image}
      />

      {/* Toolbar */}
      <div className="sticky top-[72px] md:top-[110px] z-30 bg-paper/90 backdrop-blur border-y border-line/60">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-4 flex items-center gap-4 flex-wrap">
          <button
            data-testid="filters-toggle"
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-2 eyebrow text-ink hover:text-brand transition-colors"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <div className="hidden md:flex items-center gap-2 ml-4 border-b border-line">
            <Search size={14} className="text-ink-soft" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="SEARCH BY NAME OR FABRIC"
              data-testid="shop-search"
              className="bg-transparent outline-none py-2 px-2 text-sm w-72 placeholder:text-ink-soft/60 placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-[10px]"
            />
          </div>
          <div className="flex-1" />
          <p className="eyebrow text-ink-soft hidden sm:block">{sorted.length} pieces</p>
          <select
            data-testid="shop-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent border-b border-line eyebrow py-2 outline-none focus:border-brand"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 grid lg:grid-cols-[260px_1fr] gap-12 py-16">
        {/* Filters */}
        <aside
          data-testid="filters-panel"
          className={`${showFilters ? 'block' : 'hidden'} lg:block sticky top-[160px] self-start`}
        >
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <p className="eyebrow">Filter by</p>
            <button onClick={() => setShowFilters(false)} className="text-ink"><X size={18} /></button>
          </div>
          <p className="eyebrow mb-6 hidden lg:block">Categories</p>
          <ul className="flex lg:flex-col gap-3 lg:gap-0 flex-wrap">
            <li>
              <button
                data-testid="cat-filter-all"
                onClick={() => setCategory('all')}
                className={`text-left w-full font-sub py-2 lg:border-b lg:border-line/60 transition-colors ${
                  activeCat === 'all' ? 'text-brand' : 'text-ink hover:text-brand'
                }`}
              >
                <span className="flex items-center justify-between">
                  All Collections
                  {activeCat === 'all' && <span className="text-gold">◆</span>}
                </span>
              </button>
            </li>
            {cats.map((c) => (
              <li key={c.slug}>
                <button
                  data-testid={`cat-filter-${c.slug}`}
                  onClick={() => setCategory(c.slug)}
                  className={`text-left w-full font-sub py-2 lg:border-b lg:border-line/60 transition-colors ${
                    activeCat === c.slug ? 'text-brand' : 'text-ink hover:text-brand'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {c.name}
                    {activeCat === c.slug && <span className="text-gold">◆</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-10 hidden lg:block border-t border-line pt-8">
            <p className="eyebrow mb-3">Help & Service</p>
            <p className="text-sm font-sub text-ink-soft leading-relaxed">
              Need a custom weave, bulk order, or wedding curation?
            </p>
            <a href="/wholesale" className="eyebrow link-underline text-brand mt-4 inline-block">Speak to an atelier →</a>
          </div>
        </aside>

        {/* Grid */}
        <div data-testid="shop-grid">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="animate-pulse">
                  <div className="aspect-[4/5] bg-bg-secondary" />
                  <div className="h-4 bg-bg-secondary mt-4 w-2/3" />
                  <div className="h-3 bg-bg-secondary mt-2 w-1/3" />
                </div>
              ))}
            </div>
          )}
          {!loading && sorted.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-heading italic text-3xl text-ink">Nothing here yet.</p>
              <p className="font-sub text-ink-soft mt-4">Try a different category or clear your search.</p>
            </div>
          )}
          {!loading && sorted.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
              {sorted.map((p, i) => (
                <ProductCard key={p.slug} p={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
