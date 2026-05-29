'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  toggleWishlist: (slug: string) => void;
  isWished: (slug: string) => boolean;
};

const Ctx = createContext<CartCtx | null>(null);

const CART_KEY = 'marda_cart_v1';
const WISH_KEY = 'marda_wish_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount.
  // Note: cart/wishlist are non-sensitive UI state (no PII, no auth tokens),
  // so localStorage is acceptable. Reads are defensive in case the value
  // was tampered with or corrupted by a browser extension.
  useEffect(() => {
    try {
      const rawCart = localStorage.getItem(CART_KEY);
      const rawWish = localStorage.getItem(WISH_KEY);
      const c = rawCart ? JSON.parse(rawCart) : [];
      const w = rawWish ? JSON.parse(rawWish) : [];
      if (Array.isArray(c)) setItems(c);
      if (Array.isArray(w)) setWishlist(w);
    } catch (error) {
      console.error('[cart-context] Failed to load cart/wishlist from localStorage:', error);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('[cart-context] Failed to persist cart:', error);
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error('[cart-context] Failed to persist wishlist:', error);
    }
  }, [wishlist, hydrated]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.slug === item.slug && p.mode === item.mode);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.slug === slug ? { ...p, qty: Math.max(1, qty) } : p))
        .filter((p) => p.qty > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const isWished = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const count = useMemo(() => items.reduce((a, b) => a + b.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((a, b) => a + b.qty * b.price, 0), [items]);

  // Memoize the context value so consumers don't re-render on every provider render.
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
    [items, wishlist, count, subtotal, hydrated, add, remove, setQty, clear, toggleWishlist, isWished],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
