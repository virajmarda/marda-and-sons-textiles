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
  const queryFromUrl = sp.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(queryFromUrl);
  const [sort, setSort] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setQ(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showFilters]);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    Promise.all([
      getProducts({
        category: activeCat === 'all' ? undefined : activeCat,
        q: queryFromUrl || undefined,
      }),
      getCategories(),
    ])
      .then(([p, c]) => {
        if (!alive) return;
        setProducts(p);
        setCats(c);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [activeCat, queryFromUrl]);

  const sorted = useMemo(() => {
    const list = [...products];

    if (sort === 'price-asc') list.sort((a, b) => a.price_retail - b.price_retail);
    else if (sort === 'price-desc') list.sort((a, b) => b.price_retail - a.price_retail);
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => Number(b.featured) - Number(a.featured));

    return list;
  }, [products, sort]);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(sp.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : '/shop');
  };

  const setCategory = (slug: string) => {
    updateParams({
      category: slug === 'all' ? null : slug,
    });
    setShowFilters(false);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({
      q: q.trim() || null,
    });
  };

  const clearSearch = () => {
    setQ('');
    updateParams({ q: null });
  };

  const activeCategoryObj = cats.find((c) => c.slug === activeCat);

  return (
    <div data-testid="shop-page" className="bg-paper">
      <PageHero
        chapter="02"
        eyebrow="The Atelier · Shop"
        marathi={activeCategoryObj ? activeCategoryObj.marathi : 'प्रत्येक धागा, एक कथा'}
        headline={
          activeCategoryObj ? (
            <>{activeCategoryObj.name}</>
          ) : (
            <>
              Every weave,
              <br />
              <span className="italic text-brand">in one place.</span>
            </>
          )
        }
        lede={activeCategoryObj ? <>{activeCategoryObj.tagline}</> : undefined}
        bgImage={activeCategoryObj?.image}
      />

      {/* Toolbar */}
      <div className="sticky top-[72px] z-30 border-y border-line/60 bg-paper/90 backdrop-blur md:top-[110px]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 md:px-12 lg:px-24">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              data-testid="filters-toggle"
              onClick={() => setShowFilters(true)}
              className="inline-flex min-h-[44px] items-center gap-2 self-start text-ink transition-colors hover:text-brand"
            >
              <SlidersHorizontal size={14} />
              <span className="eyebrow">Filters</span>
            </button>

            <form
              onSubmit={submitSearch}
              className="flex min-w-0 flex-1 items-center gap-2 border-b border-line sm:ml-2"
            >
              <Search size={14} className="shrink-0 text-ink-soft" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="SEARCH BY NAME OR FABRIC"
                data-testid="shop-search"
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none placeholder:text-[10px] placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-ink-soft/60"
              />
              {q && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="inline-flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:text-brand"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className="eyebrow whitespace-nowrap py-2 text-ink transition-colors hover:text-brand"
              >
                Search
              </button>
            </form>

            <div className="flex items-center justify-between gap-4 sm:ml-auto">
              <p className="eyebrow text-ink-soft">{sorted.length} pieces</p>

              <select
                data-testid="shop-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="min-h-[44px] border-b border-line bg-transparent py-2 text-[11px] uppercase tracking-[0.18em] text-ink outline-none focus:border-brand"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeCat !== 'all' || queryFromUrl ? (
            <div className="flex flex-wrap items-center gap-2">
              {activeCat !== 'all' && activeCategoryObj && (
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  {activeCategoryObj.name}
                  <X size={12} />
                </button>
              )}

              {queryFromUrl && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  “{queryFromUrl}”
                  <X size={12} />
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile filter overlay */}
      <div
        className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px] transition-all duration-300 lg:hidden ${
          showFilters ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setShowFilters(false)}
        aria-hidden="true"
      />

      {/* Body */}
      <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-10 sm:px-6 sm:py-12 md:px-12 lg:grid-cols-[260px_1fr] lg:gap-12 lg:px-24 lg:py-16">
        {/* Filters */}
        <aside
          data-testid="filters-panel"
          className={`fixed left-0 top-0 z-50 h-[100dvh] w-[88vw] max-w-[360px] overflow-y-auto bg-paper px-5 py-6 shadow-2xl transition-transform duration-300 lg:static lg:h-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none ${
            showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <p className="eyebrow">Filter by</p>
            <button
              onClick={() => setShowFilters(false)}
              className="inline-flex h-10 w-10 items-center justify-center text-ink"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mb-5 hidden lg:block eyebrow">Categories</p>

          <ul className="flex flex-col gap-1 lg:gap-0">
            <li>
              <button
                data-testid="cat-filter-all"
                onClick={() => setCategory('all')}
                className={`w-full py-3 text-left font-sub transition-colors lg:border-b lg:border-line/60 lg:py-2 ${
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
                  className={`w-full py-3 text-left font-sub transition-colors lg:border-b lg:border-line/60 lg:py-2 ${
                    activeCat === c.slug ? 'text-brand' : 'text-ink hover:text-brand'
                  }`}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span>{c.name}</span>
                    {activeCat === c.slug && <span className="text-gold">◆</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-line pt-6 lg:mt-10 lg:pt-8">
            <p className="mb-3 eyebrow">Help & Service</p>
            <p className="font-sub text-sm leading-relaxed text-ink-soft">
              Need a custom weave, bulk order, or wedding curation?
            </p>
            <Link
              href="/wholesale"
              onClick={() => setShowFilters(false)}
              className="eyebrow link-underline mt-4 inline-block text-brand"
            >
              Speak to an atelier →
            </Link>
          </div>
        </aside>

        {/* Grid */}
        <div data-testid="shop-grid">
          {loading && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-y-12 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="animate-pulse">
                  <div className="aspect-[4/5] bg-bg-secondary" />
                  <div className="mt-4 h-4 w-2/3 bg-bg-secondary" />
                  <div className="mt-2 h-3 w-1/3 bg-bg-secondary" />
                </div>
              ))}
            </div>
          )}

          {!loading && sorted.length === 0 && (
            <div className="py-20 text-center sm:py-24">
              <p className="font-heading text-2xl italic text-ink sm:text-3xl">Nothing here yet.</p>
              <p className="mt-4 text-ink-soft font-sub">
                Try a different category or clear your search.
              </p>
            </div>
          )}

          {!loading && sorted.length > 0 && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-y-12 lg:grid-cols-3 lg:gap-y-16">
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
