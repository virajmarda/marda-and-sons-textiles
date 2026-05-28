export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const WHATSAPP_NUMBER = '919422460420';
export const WHATSAPP_DISPLAY = '+91 94224 60420';
export const STORE_ADDRESS = 'Marda & Sons, 430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra';
export const STORE_HOURS = 'Mon – Sat · 10:00 AM – 8:30 PM';
export const ESTABLISHED = '1970';
export const STORE_CITY = 'Solapur';

export const MAPS_EMBED_SRC =
  'https://www.google.com/maps?q=Marda+%26+Sons+Chattigalli+Mangalwar+Peth+Solapur&output=embed';
export const MAPS_DIRECTIONS =
  'https://www.google.com/maps/dir/?api=1&destination=Marda+%26+Sons+Chattigalli+Mangalwar+Peth+Solapur';

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type Product = {
  _id?: string;
  slug: string;
  name: string;
  category: string;
  subtitle?: string;
  description: string;
  story?: string;
  price_retail: number;
  price_wholesale: number;
  moq_wholesale: number;
  images: string[];
  materials?: string[];
  dimensions?: string;
  care?: string;
  colors?: string[];
  badges?: string[];
  in_stock?: boolean;
  featured?: boolean;
};

export type Category = {
  slug: string;
  name: string;
  marathi: string;
  tagline: string;
  image: string;
};

export async function fetchJSON<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getProducts(params: { category?: string; featured?: boolean; q?: string } = {}) {
  const sp = new URLSearchParams();
  if (params.category) sp.set('category', params.category);
  if (params.featured) sp.set('featured', 'true');
  if (params.q) sp.set('q', params.q);
  const data = await fetchJSON<{ products: Product[]; count: number }>(
    `/api/products${sp.toString() ? `?${sp}` : ''}`,
  );
  return data.products;
}

export async function getProduct(slug: string) {
  return fetchJSON<Product>(`/api/products/${slug}`);
}

export async function getCategories() {
  const data = await fetchJSON<{ categories: Category[] }>('/api/categories');
  return data.categories;
}

export function inr(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}
