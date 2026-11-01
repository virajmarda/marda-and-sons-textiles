export const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');

export const WHATSAPP_NUMBER = '919422460420';
export const WHATSAPP_DISPLAY = '+91 94224 60420';
export const STORE_ADDRESS =
  'Marda & Sons, 430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra';
export const STORE_HOURS = 'Mon - Sat · 10:00 AM – 8:30 PM';
export const ESTABLISHED = '1970';
export const STORE_CITY = 'Solapur';

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
  interested_in?: string[];
  quantity_estimate?: string;
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

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchJSON<T>(
  path: string,
  opts: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10_000);

  const forwardAbort = () => {
    controller.abort();
  };

  if (opts.signal?.aborted) {
    controller.abort();
  } else {
    opts.signal?.addEventListener('abort', forwardAbort, {
      once: true,
    });
  }

  try {
    const headers = new Headers(opts.headers);

    headers.set('Accept', 'application/json');

    if (
      typeof opts.body === 'string' &&
      !headers.has('Content-Type')
    ) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(buildUrl(path), {
      ...opts,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(
        `Request failed (${response.status}). Please try again.`,
        response.status,
      );
    }

    const contentType =
      response.headers.get('content-type')?.toLowerCase() ?? '';

    if (
      !contentType.includes('application/json') &&
      !contentType.includes('+json')
    ) {
      throw new ApiError(
        'The service returned an unexpected response.',
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (controller.signal.aborted) {
      throw new ApiError(
        'The request timed out or was cancelled. Please try again.',
      );
    }

    throw new ApiError(
      'The service is temporarily unavailable. Please try again.',
    );
  } finally {
    clearTimeout(timeout);

    opts.signal?.removeEventListener(
      'abort',
      forwardAbort,
    );
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
  if (params.featured !== undefined) {
    sp.set('featured', String(params.featured));
  }
  if (params.q) sp.set('q', params.q);
  if (params.limit) sp.set('limit', String(params.limit));

  const query = sp.toString() ? `?${sp.toString()}` : '';

  const data = await fetchJSON<{
    products: Product[];
    count: number;
  }>(`/api/products${query}`, {
    next: {
      revalidate: 60,
    },
  });

  if (!Array.isArray(data.products)) {
    throw new ApiError(
      'The product catalogue returned an unexpected response.',
    );
  }

  return data.products;
}

export async function getProduct(
  slug: string,
): Promise<Product | null> {
  try {
    return await fetchJSON<Product>(
      `/api/products/${encodeURIComponent(slug)}`,
      {
        next: {
          revalidate: 60,
        },
      },
    );
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 404
    ) {
      return null;
    }

    throw error;
  }
}

export async function getCategories() {
  const data = await fetchJSON<{
    categories: string[];
  }>('/api/categories', {
    next: {
      revalidate: 300,
    },
  });

  if (!Array.isArray(data.categories)) {
    throw new ApiError(
      'The category list returned an unexpected response.',
    );
  }

  return data.categories;
}

/**
 * Submit a cart enquiry to the backend.
 * Sends name + phone + items (and optional order_ref / subtotal).
 */
export async function submitCartEnquiry(
  payload: CartEnquiryPayload,
) {
  return fetchJSON<{
    ok?: boolean;
    message?: string;
  }>('/api/cart-enquiry', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Save a contact-form lead. Rejects if the request fails. */
export async function submitContact(payload: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  return fetchJSON<{
    ok?: boolean;
    message?: string;
  }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Save a wholesale enquiry lead. Rejects if the request fails. */
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
  return fetchJSON<{
    ok?: boolean;
    message?: string;
  }>('/api/wholesale', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---------- Admin API ----------

export async function getAdminLeads(
  token: string,
  params: {
    type?: string;
    contacted?: boolean;
  } = {},
) {
  const sp = new URLSearchParams();

  if (params.type) sp.set('lead_type', params.type);
  if (params.contacted !== undefined) {
    sp.set('contacted', String(params.contacted));
  }

  const query = sp.toString() ? `?${sp.toString()}` : '';

  const raw = await fetchJSON<{
    leads: Record<string, unknown>[];
    stats: AdminCounts;
  }>(`/api/admin/leads${query}`, {
    headers: {
      'x-admin-token': token,
    },
    cache: 'no-store',
  });

  if (!Array.isArray(raw.leads)) {
    throw new ApiError(
      'The admin lead list returned an unexpected response.',
    );
  }

  const leads: AdminLead[] = raw.leads.map((lead) => {
    const items = Array.isArray(lead['items'])
      ? (lead['items'] as CartEnquiryItem[])
      : Array.isArray(lead['cart'])
        ? (lead['cart'] as CartEnquiryItem[])
        : undefined;

    return {
      ...lead,
      id: String(lead['_id'] ?? lead['id'] ?? ''),
      items,
    } as AdminLead;
  });

  return {
    leads,
    stats: raw.stats ?? ({} as AdminCounts),
  };
}

export async function markLeadContacted(
  token: string,
  leadId: string,
  contacted: boolean,
) {
  return fetchJSON<{
    updated?: boolean;
  }>(
    `/api/admin/leads/${encodeURIComponent(
      leadId,
    )}?contacted=${contacted}`,
    {
      method: 'PATCH',
      headers: {
        'x-admin-token': token,
      },
    },
  );
}

// ---------- Formatting helpers ----------

export function inr(
  value: number | null | undefined,
): string {
  if (
    value == null ||
    !Number.isFinite(value)
  ) {
    return '—';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateOrderRef(): string {
  const timestamp = Date.now()
    .toString(36)
    .toUpperCase();

  const random = Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase();

  return `MS-${timestamp}-${random}`;
}

export function siteOrigin(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://marda-and-sons-textiles.vercel.app'
  );
}
