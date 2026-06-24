'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Heart, Minus, Plus, ShoppingBag, Star, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { inr, whatsappLink, type Product } from '@/lib/api';
import { LoginPromptDialog, type LoginPromptTrigger } from '@/components/login-prompt-dialog';

// Replace with real auth check once auth is wired up
const useIsLoggedIn = () => false;

export function ProductDetail({ product }: { product: Product }) {
  const { add, toggleWishlist, isWished } = useCart();
  const isLoggedIn = useIsLoggedIn();

  const [mode, setMode] = useState<'retail' | 'wholesale'>('retail');
  const [qty, setQty] = useState<number>(1);
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(product.colors?.[0] ?? '');
  const [dialog, setDialog] = useState<LoginPromptTrigger | null>(null);

  // Normalise nullable fields to safe numbers
  const priceRetail: number = product.price_retail ?? 0;
  const priceWholesale: number = product.price_wholesale ?? 0;
  const moqWholesale: number = product.moq_wholesale ?? 1;

  const price: number = mode === 'retail' ? priceRetail : priceWholesale;
  const minQty: number = mode === 'wholesale' ? moqWholesale : 1;
  const safeQty: number = qty ?? 1;
  const actualQty: number = mode === 'wholesale' ? Math.max(safeQty, minQty) : safeQty;

  const wished = isWished(product.slug);

  function handleAdd() {
    if (!isLoggedIn) {
      setDialog('bag');
      return;
    }

    add({
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price,       // plain number
      qty: actualQty,
      mode,
    });

    toast.success(`${product.name} · added to bag`);
  }

  function handleWishlist() {
    if (!isLoggedIn) {
      setDialog('wishlist');
      return;
    }
    toggleWishlist(product.slug);
    toast.success(wished ? 'Removed from wishlist' : 'Saved to wishlist');
  }

  function handleWhatsApp() {
    const msg = `Hello मर्दा अँड सन्स,\nI am interested in:\n• ${product.name}\n• Mode: ${mode}\n• Quantity: ${actualQty}\n• Colour: ${color || '—'}\nPlease share more details.`;
    window.open(whatsappLink(msg), '_blank');
  }

  return (
    <>
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
                <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 md:order-2">
            <img
              src={product.images[active]}
              alt={product.name}
              data-testid="main-image"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>

        {/* Detail */}
        <div className="flex flex-col">
          {product.badges && product.badges.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {product.badges.map((b) => (
                <span key={b} className="eyebrow border border-line px-3 py-1 text-[9.5px] text-ink-soft">
                  {b}
                </span>
              ))}
            </div>
          )}

          <p className="eyebrow text-ink-soft">{product.category}</p>
          <h1 className="mt-2 font-heading text-3xl text-ink md:text-4xl">{product.name}</h1>

          {product.subtitle && (
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-ink-soft">{product.subtitle}</p>
          )}

          <div className="mt-4 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} className="fill-gold-dark text-gold-dark" />
              ))}
            </div>
            <span className="text-xs text-ink-soft">Loved by 1,200+ families</span>
          </div>

          {/* Pricing toggle */}
          <div className="mt-8 flex gap-0">
            <button
              type="button"
              onClick={() => { setMode('retail'); setQty(1); }}
              className={`eyebrow px-4 py-2 border ${
                mode === 'retail' ? 'border-ink bg-ink text-bg-primary' : 'border-line text-ink'
              }`}
            >
              Retail
            </button>
            <button
              type="button"
              onClick={() => { setMode('wholesale'); setQty(moqWholesale); }}
              className={`eyebrow px-4 py-2 border ${
                mode === 'wholesale' ? 'border-ink bg-ink text-bg-primary' : 'border-line text-ink'
              }`}
            >
              Wholesale (MOQ {moqWholesale})
            </button>
          </div>

          <div className="mt-4">
            <p className="font-heading text-3xl text-ink">{inr(price)}</p>
            <p className="mt-1 text-xs text-ink-soft">
              {mode === 'wholesale'
                ? `Per piece · minimum ${moqWholesale} units`
                : 'Inclusive of all taxes · Free shipping above ₹999'}
            </p>
          </div>

          {/* Story */}
          <p className="mt-6 text-sm leading-relaxed text-ink-soft">{product.description}</p>
          {product.story && (
            <blockquote className="mt-4 border-l-2 border-gold-dark pl-4 text-sm italic text-ink-soft">
              "{product.story}"
            </blockquote>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-ink-soft">Colourway</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`border px-4 py-2 text-sm font-sub ${
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
          <div className="mt-6">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-ink-soft">Quantity</p>
            <div className="inline-flex items-center border border-line">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(minQty, q - 1))}
                className="flex h-11 w-11 items-center justify-center hover:bg-bg-secondary"
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={minQty}
                data-testid="qty-input"
                value={actualQty}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10);
                  setQty(isNaN(parsed) ? minQty : Math.max(minQty, parsed));
                }}
                className="h-11 w-16 border-x border-line bg-transparent text-center outline-none font-sub"
              />
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center hover:bg-bg-secondary"
              >
                <Plus size={14} />
              </button>
            </div>
            {mode === 'wholesale' && (
              <p className="mt-2 text-[11px] text-ink-soft">
                Minimum order: {minQty} units
              </p>
            )}
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
              onClick={handleWishlist}
              className="btn-ghost justify-center"
            >
              <Heart size={14} className={wished ? 'fill-brand text-brand' : ''} />
              {wished ? 'Saved' : 'Save for Later'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="mt-3 flex w-full items-center justify-center gap-2 border border-line py-3 text-xs uppercase tracking-[0.18em] text-ink-soft hover:border-ink hover:text-ink transition"
          >
            <MessageCircle size={14} /> Ask on WhatsApp
          </button>

          {/* Specs */}
          <div className="mt-10 space-y-3 border-t border-line pt-8">
            {product.materials && product.materials.length > 0 && (
              <Spec label="Material" value={product.materials.join(', ')} />
            )}
            {product.dimensions && <Spec label="Dimensions" value={product.dimensions} />}
            {product.care && <Spec label="Care" value={product.care} />}
          </div>
        </div>
      </section>

      {dialog && (
        <LoginPromptDialog
          open={!!dialog}
          trigger={dialog}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 text-sm">
      <span className="w-24 shrink-0 text-ink-soft">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
