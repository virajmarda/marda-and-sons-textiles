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
    const msg = `Hello Marda & Sons,\nI am interested in:\n• ${product.name}\n• Mode: ${mode}\n• Quantity: ${actualQty}\n• Colour: ${color || '—'}\nPlease share more details.`;
    window.open(whatsappLink(msg), '_blank');
  }

  return (
    <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-10 grid lg:grid-cols-[1.1fr_1fr] gap-16">
      {/* Gallery */}
      <div data-testid="product-gallery" className="grid grid-cols-[80px_1fr] gap-4">
        <div className="flex flex-col gap-3">
          {product.images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              data-testid={`thumb-${i}`}
              className={`aspect-[4/5] overflow-hidden border ${active === i ? 'border-brand' : 'border-line'} transition`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <div className="aspect-[4/5] bg-bg-secondary overflow-hidden">
          <img src={product.images[active]} alt={product.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Detail */}
      <div className="lg:sticky lg:top-32 self-start">
        {product.badges && product.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {product.badges.map((b) => (
              <span key={b} className="eyebrow text-brand border-b border-gold pb-0.5">{b}</span>
            ))}
          </div>
        )}
        <p className="font-accent text-gold-dark text-sm tracking-wide mb-2 capitalize">{product.category}</p>
        <h1 className="display-2 text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.05]">{product.name}</h1>
        {product.subtitle && <p className="font-sub text-ink-soft text-lg mt-3 italic">{product.subtitle}</p>}

        <div className="flex items-center gap-2 mt-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={14} className="fill-gold text-gold" strokeWidth={0} />
          ))}
          <span className="eyebrow text-ink-soft ml-2">Loved by 1,200+ families</span>
        </div>

        {/* Pricing toggle */}
        <div className="mt-10 border-y border-line py-6">
          <div className="flex gap-3 mb-4">
            <button
              data-testid="mode-retail"
              onClick={() => setMode('retail')}
              className={`eyebrow px-4 py-2 border ${mode === 'retail' ? 'bg-ink text-bg-primary border-ink' : 'border-line text-ink'}`}
            >
              Retail
            </button>
            <button
              data-testid="mode-wholesale"
              onClick={() => setMode('wholesale')}
              className={`eyebrow px-4 py-2 border ${mode === 'wholesale' ? 'bg-ink text-bg-primary border-ink' : 'border-line text-ink'}`}
            >
              Wholesale (MOQ {product.moq_wholesale})
            </button>
          </div>
          <p className="font-heading italic text-5xl text-brand">{inr(price)}</p>
          <p className="font-sub text-ink-soft text-sm mt-2">
            {mode === 'wholesale' ? `Per piece · minimum ${product.moq_wholesale} units` : 'Inclusive of all taxes · Free shipping above ₹999'}
          </p>
        </div>

        {/* Story */}
        <p className="font-sub text-ink text-lg leading-relaxed mt-8">{product.description}</p>
        {product.story && <p className="font-accent text-brand mt-4 italic">"{product.story}"</p>}

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-8">
            <p className="eyebrow mb-3">Colourway</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  data-testid={`color-${c}`}
                  onClick={() => setColor(c)}
                  className={`px-4 py-2 text-sm font-sub border ${
                    color === c ? 'border-ink bg-ink text-bg-primary' : 'border-line text-ink hover:border-ink'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Qty */}
        <div className="mt-8 flex items-center gap-6">
          <p className="eyebrow">Quantity</p>
          <div className="flex items-center border border-line">
            <button
              data-testid="qty-decrease"
              data-testid-alias="qty-dec"
              onClick={() => setQty((q) => Math.max(mode === 'wholesale' ? minQty : 1, q - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-bg-secondary"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              data-testid="qty-input"
              value={actualQty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1')))}
              className="w-16 h-10 text-center bg-transparent outline-none border-x border-line font-sub"
            />
            <button
              data-testid="qty-increase"
              data-testid-alias="qty-inc"
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-bg-secondary"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 grid sm:grid-cols-2 gap-3">
          <button data-testid="add-to-bag" onClick={handleAdd} className="btn-primary justify-center">
            <ShoppingBag size={14} /> Add to Bag
          </button>
          <button
            data-testid="wishlist-toggle"
            onClick={() => {
              toggleWishlist(product.slug);
              toast.success(wished ? 'Removed from wishlist' : 'Saved to wishlist');
            }}
            className="btn-ghost justify-center"
          >
            <Heart size={14} className={wished ? 'fill-brand text-brand' : ''} /> {wished ? 'Saved' : 'Save for Later'}
          </button>
        </div>

        <button data-testid="product-whatsapp" onClick={handleWhatsApp} className="mt-4 w-full border border-gold text-brand py-4 uppercase tracking-[0.22em] text-[11px] flex items-center justify-center gap-2 hover:bg-gold/10 transition">
          <MessageCircle size={14} /> Ask on WhatsApp
        </button>

        {/* Specs */}
        <div className="mt-12 border-t border-line pt-8 space-y-4">
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
    <div className="grid grid-cols-[140px_1fr] gap-6">
      <p className="eyebrow">{label}</p>
      <p className="font-sub text-ink">{value}</p>
    </div>
  );
}
