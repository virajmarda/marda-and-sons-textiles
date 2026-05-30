export const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');

export const WHATSAPP_NUMBER = '919422460420';
export const WHATSAPP_DISPLAY = '+91 94224 60420';
export const STORE_ADDRESS =
  'Marda & Sons, 430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra';
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

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_URL}${path}`;
}

export async function fetchJSON<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(buildUrl(path), {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export async function getProducts(params: {
  category?: string;
  featured?: boolean;
  q?: string;
} = {}) {
  const sp = new URLSearchParams();

  if (params.category) sp.set('category', params.category);
  if (params.featured) sp.set('featured', 'true');
  if (params.q) sp.set('q', params.q);

  const data = await fetchJSON<{ products: Product[]; count: number }>(
    `/api/products${sp.toString() ? `?${sp.toString()}` : ''}`
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

export type CartEnquiryItem = {
  slug: string;
  name: string;
  mode: 'retail' | 'wholesale';
  qty: number;
  price: number;
};

export async function submitCartEnquiry(payload: {
  name: string;
  phone: string;
  order_ref: string;
  subtotal: number;
  items: CartEnquiryItem[];
}) {
  return fetchJSON<{ ok: boolean; id: string; order_ref: string }>(
    '/api/cart-enquiry',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}

export function generateOrderRef() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let chunk = '';

  for (let i = 0; i < 4; i += 1) {
    chunk += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');

  return `MS-${chunk}-${dd}${mm}`;
}

export function siteOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return BACKEND_URL || '';
}

export type AdminLead = {
  id: string;
  type: 'contact' | 'wholesale' | 'newsletter' | 'cart_enquiry';
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  city?: string;
  message?: string;
  interested_in?: string[];
  quantity_estimate?: string;
  order_ref?: string;
  subtotal?: number;
  items?: Array<{
    slug: string;
    name: string;
    mode: string;
    qty: number;
    price: number;
  }>;
  contacted_at?: string | null;
  created_at: string;
};

export type AdminCounts = {
  all: number;
  contact: number;
  wholesale: number;
  newsletter: number;
  cart_enquiry: number;
  uncontacted: number;
};

async function adminFetch<T>(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(buildUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': token,
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });

  if (res.status === 401) {
    throw new Error('Invalid admin token');
  }

  if (!res.ok) {
    throw new Error(`Admin request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export async function getAdminLeads(
  token: string,
  params: { type?: string; contacted?: boolean } = {}
) {
  const search = new URLSearchParams();

  if (params.type) search.set('type', params.type);
  if (typeof params.contacted === 'boolean') {
    search.set('contacted', String(params.contacted));
  }

  const qs = search.toString() ? `?${search.toString()}` : '';

  return adminFetch<{ ok: boolean; leads: AdminLead[]; counts: AdminCounts }>(
    `/api/admin/leads${qs}`,
    token
  );
}

export async function markLeadContacted(
  token: string,
  leadId: string,
  contacted: boolean
) {
  return adminFetch<{ ok: boolean; contacted_at: string | null }>(
    `/api/admin/leads/${leadId}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify({ contacted }),
    }
  );
}

export function inr(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}
