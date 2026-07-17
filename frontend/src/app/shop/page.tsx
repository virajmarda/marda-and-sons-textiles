import { Suspense } from 'react';
import { ShopClient } from './shop-client';
import { type Product, type Category } from '@/lib/api';

export const revalidate = 60; // ISR: rebuild shop data every 60 seconds

// ─── Odoo JSON-RPC helpers (same pattern as homepage) ───────────────────────
async function odooCall(method: string, model: string, args: unknown[], kwargs: Record<string, unknown> = {}) {
  const url = process.env.ODOO_URL;
  const db = process.env.ODOO_DB;
  if (!url || !db) return null;
  try {
    const res = await fetch(`${url}/web/dataset/call_kw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', method: 'call', id: 1,
        params: { model, method, args, kwargs },
      }),
      cache: 'no-store',
    });
    const json = await res.json();
    return json?.result ?? null;
  } catch {
    return null;
  }
}

async function odooUid(): Promise<number | null> {
  const url = process.env.ODOO_URL;
  const db = process.env.ODOO_DB;
  const user = process.env.ODOO_USERNAME;
  const pass = process.env.ODOO_PASSWORD;
  if (!url || !db || !user || !pass) return null;
  try {
    const res = await fetch(`${url}/web/session/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { db, login: user, password: pass } }),
      cache: 'no-store',
    });
    const json = await res.json();
    return json?.result?.uid ?? null;
  } catch {
    return null;
  }
}

// ─── Fallback data (shown when Odoo is unreachable) ─────────────────────────
const FALLBACK_PRODUCTS: Product[] = [
  { slug: 'solapuri-chaddar-white', name: 'Solapuri Chaddar — Classic White', category: 'Bedsheets', description: 'Heritage-grade double bed chaddar woven on power looms in Solapur. Pure cotton.', price_retail: 799, price_wholesale: 620, moq_wholesale: 50, images: [], badges: ['Bestseller'], in_stock: true, featured: true },
  { slug: 'solapuri-terry-towel', name: 'Solapuri Terry Towel — Bath', category: 'Towels', description: '550 GSM terry loop cotton bath towel. High absorbency, zero chemical finish.', price_retail: 349, price_wholesale: 260, moq_wholesale: 100, images: [], badges: [], in_stock: true, featured: true },
  { slug: 'solapuri-pheta', name: 'Solapuri Pheta — Ceremonial', category: 'Phetas', description: 'Traditional ceremonial turban cloth used at weddings and cultural events.', price_retail: 550, price_wholesale: 420, moq_wholesale: 50, images: [], badges: ['Heritage'], in_stock: true, featured: false },
  { slug: 'solapuri-woolen-blanket', name: 'Solapuri Woolen Blanket', category: 'Blankets', description: 'Classic winter blanket in Solapuri weave. Wool-cotton blend. Since 1970.', price_retail: 1299, price_wholesale: 980, moq_wholesale: 25, images: [], badges: [], in_stock: true, featured: true },
  { slug: 'solapuri-shawl-cotton', name: 'Solapuri Shawl — Cotton Checks', category: 'Shawls', description: 'Lightweight cotton checks shawl. Suitable for all seasons.', price_retail: 449, price_wholesale: 340, moq_wholesale: 50, images: [], badges: [], in_stock: true, featured: false },
  { slug: 'solapuri-gift-set-towels', name: 'Solapuri Towel Gift Set — 3 Piece', category: 'Gifting', description: 'Bath + hand + face towel curated set. Ideal for corporate gifting and weddings.', price_retail: 899, price_wholesale: 700, moq_wholesale: 25, images: [], badges: ['New'], in_stock: true, featured: true },
];

const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: 'Bedsheets', slug: 'bedsheets', image: null },
  { id: 2, name: 'Towels', slug: 'towels', image: null },
  { id: 3, name: 'Phetas', slug: 'phetas', image: null },
  { id: 4, name: 'Blankets', slug: 'blankets', image: null },
  { id: 5, name: 'Shawls', slug: 'shawls', image: null },
  { id: 6, name: 'Gifting', slug: 'gifting', image: null },
];

// ─── Server-side data fetch ──────────────────────────────────────────────────
async function fetchShopData(): Promise<{ products: Product[]; categories: Category[] }> {
  try {
    const uid = await odooUid();
    if (!uid) throw new Error('Odoo auth failed');

    const [rawProducts, rawCategories] = await Promise.all([
      odooCall('search_read', 'product.template', [[
        ['website_published', '=', true],
        ['sale_ok', '=', true],
      ]], {
        fields: ['name', 'description_sale', 'list_price', 'categ_id', 'image_1920', 'website_slug', 'x_badges'],
        limit: 200,
        uid,
      }),
      odooCall('search_read', 'product.public.category', [[]], {
        fields: ['name', 'website_slug', 'image_1920'],
        uid,
      }),
    ]);

    const products: Product[] = (rawProducts ?? []).map((p: Record<string, unknown>) => ({
      slug: String(p.website_slug ?? p.id),
      name: String(p.name),
      category: Array.isArray(p.categ_id) ? String(p.categ_id[1]) : 'Uncategorised',
      description: String(p.description_sale ?? ''),
      price_retail: Number(p.list_price ?? 0),
      price_wholesale: null,
      moq_wholesale: null,
      images: p.image_1920 ? [`data:image/jpeg;base64,${p.image_1920}`] : [],
      badges: [],
      in_stock: true,
      featured: false,
    }));

    const categories: Category[] = (rawCategories ?? []).map((c: Record<string, unknown>) => ({
      id: Number(c.id),
      name: String(c.name),
      slug: String(c.website_slug ?? c.name).toLowerCase().replace(/\s+/g, '-'),
      image: c.image_1920 ? `data:image/jpeg;base64,${c.image_1920}` : null,
    }));

    if (products.length > 0) return { products, categories };
    throw new Error('No Odoo products returned');
  } catch {
    // Graceful fallback when Odoo is unreachable
    return { products: FALLBACK_PRODUCTS, categories: FALLBACK_CATEGORIES };
  }
}

// ─── Loading skeleton (same as before) ──────────────────────────────────────
function ShopPageFallback() {
  return (
    <div className="min-h-screen bg-paper pt-28 sm:pt-32 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 bg-line/50" />
          <div className="h-12 w-64 bg-line/50 sm:h-14 sm:w-80" />
          <div className="h-5 w-full max-w-xl bg-line/40" />
          <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-line/40" />
                <div className="h-4 w-3/4 bg-line/40" />
                <div className="h-4 w-1/2 bg-line/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function ShopPage() {
  const { products, categories } = await fetchShopData();
  return (
    <Suspense fallback={<ShopPageFallback />}>
      <ShopClient initialProducts={products} initialCategories={categories} />
    </Suspense>
  );
}
