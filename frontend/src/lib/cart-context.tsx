'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  mode: 'retail' | 'wholesale';
};

type CartCtx = {
  items: CartItem[];
  wishlist: string[];
  count: number;
  subtotal: number;
  mounted: boolean;
  add: (item: CartItem) => void;
  remove: (
    slug: string,
    mode: CartItem['mode'],
  ) => void;
  setQty: (
    slug: string,
    mode: CartItem['mode'],
    qty: number,
  ) => void;
  clear: () => void;
  toggleWishlist: (slug: string) => void;
  isWished: (slug: string) => boolean;
};

const Ctx = createContext<CartCtx | null>(null);

const CART_KEY = 'marda_cart_v1';
const WISH_KEY = 'marda_wish_v1';

// ---------- Validation ----------

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isValidSlug(
  value: unknown,
): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  );
}

function isValidCartItem(
  value: unknown,
): value is CartItem {
  if (!isRecord(value)) return false;

  return (
    isValidSlug(value.slug) &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    typeof value.image === 'string' &&
    typeof value.price === 'number' &&
    Number.isFinite(value.price) &&
    value.price >= 0 &&
    typeof value.qty === 'number' &&
    Number.isSafeInteger(value.qty) &&
    value.qty > 0 &&
    Number.isFinite(value.price * value.qty) &&
    (
      value.mode === 'retail' ||
      value.mode === 'wholesale'
    )
  );
}

function hasValidTotals(items: CartItem[]): boolean {
  const count = items.reduce(
    (sum, item) => sum + item.qty,
    0,
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  return (
    Number.isSafeInteger(count) &&
    count >= 0 &&
    Number.isFinite(subtotal) &&
    subtotal >= 0
  );
}

function parseCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  const result: CartItem[] = [];

  for (const entry of value) {
    if (!isValidCartItem(entry)) continue;

    const existingIndex = result.findIndex(
      (item) =>
        item.slug === entry.slug &&
        item.mode === entry.mode,
    );

    if (existingIndex === -1) {
      const item: CartItem = {
        slug: entry.slug,
        name: entry.name,
        image: entry.image,
        price: entry.price,
        qty: entry.qty,
        mode: entry.mode,
      };

      const next = [...result, item];

      if (hasValidTotals(next)) {
        result.push(item);
      }

      continue;
    }

    const existing = result[existingIndex];
    const combinedQty = existing.qty + entry.qty;

    if (!Number.isSafeInteger(combinedQty)) {
      continue;
    }

    const next = result.map((item, index) =>
      index === existingIndex
        ? {
            ...item,
            qty: combinedQty,
          }
        : item,
    );

    if (hasValidTotals(next)) {
      result[existingIndex] = {
        ...existing,
        qty: combinedQty,
      };
    }
  }

  return result;
}

function parseWishlist(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(value.filter(isValidSlug)),
  );
}

// ---------- Storage ----------

function readStoredValue(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);

    return raw === null
      ? null
      : JSON.parse(raw);
  } catch (error) {
    console.error(
      `[cart-context] Could not read ${key}:`,
      error,
    );

    return null;
  }
}

function writeStoredValue(
  key: string,
  value: unknown,
) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(value),
    );
  } catch (error) {
    console.error(
      `[cart-context] Could not persist ${key}:`,
      error,
    );
  }
}

// ---------- Provider ----------

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(
      parseCart(readStoredValue(CART_KEY)),
    );

    setWishlist(
      parseWishlist(readStoredValue(WISH_KEY)),
    );

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    writeStoredValue(CART_KEY, items);
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    writeStoredValue(WISH_KEY, wishlist);
  }, [wishlist, hydrated]);

  const add = useCallback((item: CartItem) => {
    if (!isValidCartItem(item)) {
      console.warn(
        '[cart-context] Ignored an invalid cart item.',
      );
      return;
    }

    setItems((current) => {
      const existingIndex = current.findIndex(
        (entry) =>
          entry.slug === item.slug &&
          entry.mode === item.mode,
      );

      let next: CartItem[];

      if (existingIndex === -1) {
        next = [
          ...current,
          { ...item },
        ];
      } else {
        const existing = current[existingIndex];
        const combinedQty = existing.qty + item.qty;

        if (
          !Number.isSafeInteger(combinedQty) ||
          !Number.isFinite(existing.price * combinedQty)
        ) {
          return current;
        }

        // Preserve the existing line's price and details.
        // Live price reconciliation belongs to the backend.
        next = current.map((entry, index) =>
          index === existingIndex
            ? {
                ...entry,
                qty: combinedQty,
              }
            : entry,
        );
      }

      return hasValidTotals(next)
        ? next
        : current;
    });
  }, []);

  const remove = useCallback(
    (
      slug: string,
      mode: CartItem['mode'],
    ) => {
      setItems((current) =>
        current.filter(
          (item) =>
            !(
              item.slug === slug &&
              item.mode === mode
            ),
        ),
      );
    },
    [],
  );

  const setQty = useCallback(
    (
      slug: string,
      mode: CartItem['mode'],
      qty: number,
    ) => {
      if (!Number.isSafeInteger(qty)) return;

      setItems((current) => {
        if (qty <= 0) {
          return current.filter(
            (item) =>
              !(
                item.slug === slug &&
                item.mode === mode
              ),
          );
        }

        const next = current.map((item) =>
          item.slug === slug && item.mode === mode
            ? {
                ...item,
                qty,
              }
            : item,
        );

        return hasValidTotals(next)
          ? next
          : current;
      });
    },
    [],
  );

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const toggleWishlist = useCallback(
    (slug: string) => {
      if (!isValidSlug(slug)) return;

      setWishlist((current) =>
        current.includes(slug)
          ? current.filter((item) => item !== slug)
          : [...current, slug],
      );
    },
    [],
  );

  const isWished = useCallback(
    (slug: string) => wishlist.includes(slug),
    [wishlist],
  );

  const count = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.qty,
        0,
      ),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
      ),
    [items],
  );

  const value = useMemo<CartCtx>(
    () => ({
      items,
      wishlist,
      count,
      subtotal,
      mounted: hydrated,
      add,
      remove,
      setQty,
      clear,
      toggleWishlist,
      isWished,
    }),
    [
      items,
      wishlist,
      count,
      subtotal,
      hydrated,
      add,
      remove,
      setQty,
      clear,
      toggleWishlist,
      isWished,
    ],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
}

// ---------- Consumer hook ----------

export function useCart() {
  const context = useContext(Ctx);

  if (!context) {
    throw new Error(
      'useCart must be used within CartProvider',
    );
  }

  return context;
}
