'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Heart, Minus, Plus, ShoppingBag, Star, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { inr, whatsappLink, type Product } from '@/lib/api';

export function ProductDetail({ product }: { product: Product }) {
  const { add, toggleWishlist, isWished } = useCart();
  const [mode, setMode] = useState<'retail' | 'wholesale'>('retail');
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(product.colors?.[0] || '');

  const price = mode === 'retail' ? product.price_retail : product.price_wholesale;
  const minQty = mode === 'wholesale' ? product.moq_wholesale : 1;
  const actualQty = mode === 'wholesale' ? Math.max(qty, minQty) : qty;
  const wished = isWished(product.slug);

  function handleAdd() {
    add({
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price,
      qty: actualQty,
      mode,
    });
    toast.success(`${product.name} · added to bag`);
  }

  function handleWhatsApp() {
    const msg = `Hello मर्दा ॲन्ड सन्स,\nI am interested in:\n• ${product.name}\n• Mode: ${mode}\n• Quantity: ${actualQty}\n• Colour: ${color || '—'}\nPlease share more details.`;
    window.open(whatsappLink(msg), '_blank');
  }

  return (
    <section className="mx-auto grid max-w-[1600px] gap-10 px-4 py-8 sm:px-6 sm:py-10 md:px-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-24">
      {/* Gallery */}
      <div data-testid="product-gallery" className="grid gap-4 md:grid-cols-[80px_1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 md:order-1 md:flex-col md:overflow-visible">
          {product.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              data-testid={`thumb-${i}`}
              className={`h-24 w-20 shrink-0 overflow-hidden border transition md:h-auto md:w-auto md:aspect-[4/5] ${
                active === i ? 'border-brand' : 'border-line'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="order-1 aspect-[4/5] overflow-hidden bg-bg-secondary md:order-2">
          <img src={product.images[active]} alt={product.name} className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Detail */}
      <div className="self-start lg:sticky lg:top-32">
        {product.badges && product.badges.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <span key={b} className="eyebrow border-b border-gold pb-0.5 text-brand">
                {b}
              </span>
            ))}
          </div>
        )}

        <p className="mb-2 text-sm capitalize tracking-wide text-gold-dark font-accent">
          {product.category}
        </p>

        <h1 className="display-2 text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
          {product.name}
        </h1>

        {product.subtitle && (
          <p className="mt-3 text-base italic text-ink-soft font-sub sm:text-lg">
            {product.subtitle}
          </p>
        )}

        <div className="mt-6 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={14} className="fill-gold text-gold" strokeWidth={0} />
          ))}
          <span className="ml-2 text-[11px] text-ink-soft eyebrow sm:text-xs">
            Loved by 1,200+ families
          </span>
        </div>

        {/* Pricing toggle */}
        <div className="mt-8 border-y border-line py-6 sm:mt-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              data-testid="mode-retail"
              onClick={() => setMode('retail')}
              className={`eyebrow px-4 py-2 border ${
                mode === 'retail'
                  ? 'border-ink bg-ink text-bg-primary'
                  : 'border-line text-ink'
              }`}
            >
              Retail
            </button>

            <button
              type="button"
              data-testid="mode-wholesale"
              onClick={() => setMode('wholesale')}
              className={`eyebrow px-4 py-2 border ${
                mode === 'wholesale'
                  ? 'border-ink bg-ink text-bg-primary'
                  : 'border-line text-ink'
              }`}
            >
              Wholesale (MOQ {product.moq_wholesale})
            </button>
          </div>

          <p className="text-4xl italic text-brand font-heading sm:text-5xl">{inr(price)}</p>

          <p className="mt-2 text-sm text-ink-soft font-sub">
            {mode === 'wholesale'
              ? `Per piece · minimum ${product.moq_wholesale} units`
              : 'Inclusive of all taxes · Free shipping above ₹999'}
          </p>
        </div>

        {/* Story */}
        <p className="mt-8 text-base leading-relaxed text-ink font-sub sm:text-lg">
          {product.description}
        </p>

        {product.story && (
          <p className="mt-4 italic text-brand font-accent">"{product.story}"</p>
        )}

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 eyebrow">Colourway</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  data-testid={`color-${c}`}
                  onClick={() => setColor(c)}
                  className={`border px-4 py-2 text-sm font-sub ${
                    color === c
                      ? 'border-ink bg-ink text-bg-primary'
                      : 'border-line text-ink hover:border-ink'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Qty */}
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
          <p className="eyebrow">Quantity</p>

          <div className="flex items-center border border-line">
            <button
              type="button"
              data-testid="qty-decrease"
              data-testid-alias="qty-dec"
              onClick={() => setQty((q) => Math.max(mode === 'wholesale' ? minQty : 1, q - 1))}
              className="flex h-11 w-11 items-center justify-center hover:bg-bg-secondary"
            >
              <Minus size={14} />
            </button>

            <input
              type="number"
              inputMode="numeric"
              min={mode === 'wholesale' ? minQty : 1}
              data-testid="qty-input"
              value={actualQty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
              className="h-11 w-16 border-x border-line bg-transparent text-center outline-none font-sub"
            />

            <button
              type="button"
              data-testid="qty-increase"
              data-testid-alias="qty-inc"
              onClick={() => setQty((q) => q + 1)}
              className="flex h-11 w-11 items-center justify-center hover:bg-bg-secondary"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            data-testid="add-to-bag"
            onClick={handleAdd}
            className="btn-primary justify-center"
          >
            <ShoppingBag size={14} /> Add to Bag
          </button>

          <button
            type="button"
            data-testid="wishlist-toggle"
            onClick={() => {
              toggleWishlist(product.slug);
              toast.success(wished ? 'Removed from wishlist' : 'Saved to wishlist');
            }}
            className="btn-ghost justify-center"
          >
            <Heart size={14} className={wished ? 'fill-brand text-brand' : ''} />
            {wished ? 'Saved' : 'Save for Later'}
          </button>
        </div>

        <button
          type="button"
          data-testid="product-whatsapp"
          onClick={handleWhatsApp}
          className="mt-4 flex w-full items-center justify-center gap-2 border border-gold py-4 text-[11px] uppercase tracking-[0.22em] text-brand transition hover:bg-gold/10"
        >
          <MessageCircle size={14} /> Ask on WhatsApp
        </button>

        {/* Specs */}
        <div className="mt-12 space-y-4 border-t border-line pt-8">
          {product.materials && product.materials.length > 0 && (
            <Spec label="Materials" value={product.materials.join(' · ')} />
          )}
          {product.dimensions && <Spec label="Dimensions" value={product.dimensions} />}
          {product.care && <Spec label="Care" value={product.care} />}
          <Spec label="Origin" value="Solapur, Maharashtra · India" />
          <Spec label="Lead time" value={mode === 'wholesale' ? '7–14 days' : '2–4 business days'} />
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:gap-6">
      <p className="eyebrow">{label}</p>
      <p className="text-ink font-sub">{value}</p>
    </div>
  );
}
