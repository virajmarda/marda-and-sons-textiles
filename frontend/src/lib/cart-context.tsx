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

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      const w = JSON.parse(localStorage.getItem(WISH_KEY) || '[]');
      if (Array.isArray(c)) setItems(c);
      if (Array.isArray(w)) setWishlist(w);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
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

  return (
    <Ctx.Provider
      value={{ items, wishlist, count, subtotal, add, remove, setQty, clear, toggleWishlist, isWished }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
