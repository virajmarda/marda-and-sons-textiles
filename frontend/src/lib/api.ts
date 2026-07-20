export const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');

export const WHATSAPP_NUMBER  = '919422460420';
export const WHATSAPP_DISPLAY = '+91 94224 60420';
export const STORE_ADDRESS    =
  'Marda & Sons, 430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra';
export const STORE_HOURS  = 'Mon - Sat · 10:00 AM – 8:30 PM';
export const ESTABLISHED  = '1970';
export const STORE_CITY   = 'Solapur';

export const MAPS_EMBED_SRC =
  'https://www.google.com/maps?q=Marda+%26+Sons+Chattigalli+Mangalwar+Peth+Solapur&output=embed';
export const MAPS_DIRECTIONS =
  'https://www.google.com/maps/dir/?api=1&destination=Marda+%26+Sons+Chattigalli+Mangalwar+Peth+Solapur';

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ---------- Domain types ----------

export type Product = {
  _id?: string;
  slug: string;
  name: string;
  category: string;
  subtitle?: string;
  description: string;
  story?: string;
  price_retail: number;
  price_wholesale: number | null;
  moq_wholesale: number | null;
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
  id?: number;
  slug: string;
  name: string;
  marathi?: string;
  tagline?: string;
  image: string | null;
};

export type CartEnquiryItem = {
  slug: string;
  name: string;
  qty: number;
  price?: number;
  mode?: 'retail' | 'wholesale';
};

/** Full cart-enquiry payload sent to /api/cart-enquiry. */
export type CartEnquiryPayload = {
  name: string;
  phone: string;
  order_ref?: string;
  subtotal?: number;
  items: CartEnquiryItem[];
};

export type AdminLead = {
  id: string;
  _id?: string;
  type: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  company?: string;
  city?: string;
  order_ref?: string;
  subtotal?: number | null;
  items?: CartEnquiryItem[];
  contacted: boolean;
  contacted_at?: string | null;
  created_at: string;
};

/** Backend returns { total, uncontacted } plus optional per-type counts. */
export type AdminCounts = {
  total?: number;
  uncontacted?: number;
  all?: number;
  cart_enquiry?: number;
  contact?: number;
  wholesale?: number;
  newsletter?: number;
  [key: string]: number | undefined;
};

// ---------- URL builder ----------

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_URL}${path}`;
}

// ---------- Generic fetch helper ----------

export async function fetchJSON<T>(
  path: string,
  opts?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(buildUrl(path), opts);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ---------- Public API ----------

export async function getProducts(
  params: {
    category?: string;
    featured?: boolean;
    q?: string;
    limit?: number;
  } = {},
) {
  const sp = new URLSearchParams();
  if (params.category) sp.set('category', params.category);
  if (params.featured !== undefined) sp.set('featured', String(params.featured));
  if (params.q) sp.set('q', params.q);
  if (params.limit) sp.set('limit', String(params.limit));
  const query = sp.toString() ? `?${sp.toString()}` : '';
  const data = await fetchJSON<{ products: Product[]; count: number }>(
    `/api/products${query}`,
    { next: { revalidate: 60 } },
  );
  return data?.products ?? [];
}

export async function getProduct(slug: string) {
  return fetchJSON<Product>(`/api/products/${slug}`, {
    next: { revalidate: 60 },
  });
}

export async function getCategories() {
  const data = await fetchJSON<{ categories: string[] }>('/api/categories', {
    next: { revalidate: 300 },
  });
  return data?.categories ?? [];
}

/**
 * Submit a cart enquiry to the backend.
 * Sends name + phone + items (and optional order_ref / subtotal).
 */
export async function submitCartEnquiry(payload: CartEnquiryPayload) {
  return fetchJSON<{ ok: boolean }>('/api/cart-enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** Save a contact-form lead to the backend. Never throws. */
export async function submitContact(payload: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  return fetchJSON<{ ok: boolean }>('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** Save a wholesale enquiry lead to the backend. Never throws. */
export async function submitWholesale(payload: {
  name: string;
  company?: string;
  email: string;
  phone: string;
  city?: string;
  quantity_estimate?: string;
  interests?: string[];
  message?: string;
}) {
  return fetchJSON<{ ok: boolean }>('/api/wholesale', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// ---------- Admin API ----------

export async function getAdminLeads(
  token: string,
  params: { type?: string; contacted?: boolean } = {},
) {
  const sp = new URLSearchParams();
  if (params.type) sp.set('lead_type', params.type);
  if (params.contacted !== undefined) sp.set('contacted', String(params.contacted));
  const query = sp.toString() ? `?${sp.toString()}` : '';

  const raw = await fetchJSON<{
    leads: Record<string, unknown>[];
    stats: AdminCounts;
  }>(`/api/admin/leads${query}`, {
    headers: { 'x-admin-token': token },
    cache: 'no-store',
  });

  if (!raw) return null;

  // Normalise _id -> id and items/cart so the frontend uses lead.id + lead.items everywhere.
  const leads: AdminLead[] = raw.leads.map((l) => {
    const items =
      Array.isArray(l['items'])
        ? (l['items'] as CartEnquiryItem[])
        : Array.isArray(l['cart'])
        ? (l['cart'] as CartEnquiryItem[])
        : undefined;
    return { ...l, id: String(l['_id'] ?? l['id'] ?? ''), items } as AdminLead;
  });

  return { leads, stats: raw.stats ?? {} as AdminCounts };
}

export async function markLeadContacted(
  token: string,
  leadId: string,
  contacted: boolean,
) {
  return fetchJSON(`/api/admin/leads/${leadId}?contacted=${contacted}`, {
    method: 'PATCH',
    headers: { 'x-admin-token': token },
  });
}

// ---------- Formatting helpers ----------

export function inr(value: number | null | undefined): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateOrderRef(): string {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MS-${ts}-${rand}`;
}

export function siteOrigin(): string {
  if (typeof window !== 'undefined') return window.location.origin;
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://marda-and-sons-textiles.vercel.app'
  );
}
