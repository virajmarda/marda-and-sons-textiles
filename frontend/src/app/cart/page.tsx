'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { inr, whatsappLink } from '@/lib/api';
import { Reveal, SectionLabel } from '@/components/reveal';

export default function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart();
  const empty = items.length === 0;

  const summary = items.map(
    (i, idx) => `${idx + 1}. ${i.name} (${i.mode}) × ${i.qty} — ${inr(i.price * i.qty)}`,
  ).join('\n');
  const waMsg = `Hello मर्दा ॲन्ड सन्स, I'd like to confirm this order:\n\n${summary}\n\nSubtotal: ${inr(subtotal)}\n\nPlease confirm availability & next steps.`;

  return (
    <div data-testid="cart-page" className="bg-paper min-h-[80vh] relative overflow-hidden">
      {/* ornamental backdrop */}
      <div aria-hidden className="absolute top-32 -right-40 w-[600px] h-[600px] rounded-full bg-brand/[0.05] blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full bg-gold/[0.07] blur-3xl pointer-events-none" />

      <section className="relative pt-40 pb-12 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <p className="eyebrow">Your Bag · पिशवी</p>
        <h1 className="display-1 text-5xl md:text-7xl lg:text-8xl text-ink mt-6 leading-[0.95]">
          {empty ? <>Your bag is <span className="italic text-brand">unwoven.</span></> : <>The bag, <span className="italic text-brand">curated.</span></>}
        </h1>
        <p className="font-accent text-brand mt-6 text-xl md:text-2xl">
          {empty ? 'अजून रिकामी' : `${items.length} ${items.length === 1 ? 'वस्तू' : 'वस्तू'} निवडल्या आहेत`}
        </p>
      </section>

      {empty ? (
        <section className="max-w-[800px] mx-auto px-6 pb-32 text-center">
          <Reveal>
            <p className="font-sub text-ink-soft text-lg">
              Nothing here yet. Begin with our most-loved weaves.
            </p>
            <Link href="/shop" data-testid="cart-empty-shop" className="btn-primary mt-10">
              <ShoppingBag size={14} /> Discover the collection
            </Link>
          </Reveal>
        </section>
      ) : (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pb-32 grid lg:grid-cols-[1.5fr_1fr] gap-16">
          {/* Items */}
          <div data-testid="cart-items" className="space-y-8">
            <SectionLabel number="01" label={`${items.length} item${items.length > 1 ? 's' : ''}`} />
            {items.map((item) => (
              <article key={`${item.slug}-${item.mode}`} className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr_auto] gap-6 border-b border-line pb-8 items-start">
                <div className="aspect-[4/5] bg-bg-secondary overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="eyebrow text-gold-dark">{item.mode}</p>
                  <h3 className="font-heading italic text-2xl text-ink mt-1">{item.name}</h3>
                  <p className="font-sub text-ink-soft mt-2">{inr(item.price)} <span className="text-ink-soft/60">/ piece</span></p>

                  <div className="flex items-center gap-4 mt-5">
                    <div className="flex items-center border border-line">
                      <button data-testid={`cart-dec-${item.slug}`} onClick={() => setQty(item.slug, item.qty - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-bg-secondary"><Minus size={13} /></button>
                      <span className="w-10 text-center font-sub">{item.qty}</span>
                      <button data-testid={`cart-inc-${item.slug}`} onClick={() => setQty(item.slug, item.qty + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-bg-secondary"><Plus size={13} /></button>
                    </div>
                    <button data-testid={`cart-remove-${item.slug}`} onClick={() => remove(item.slug)} className="text-ink-soft hover:text-brand inline-flex items-center gap-2 text-sm">
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
                <p className="font-heading text-2xl text-brand whitespace-nowrap md:text-right hidden md:block">
                  {inr(item.qty * item.price)}
                </p>
              </article>
            ))}

            <button data-testid="cart-clear" onClick={clear} className="eyebrow text-ink-soft hover:text-brand link-underline">
              Clear bag
            </button>
          </div>

          {/* Summary */}
          <aside data-testid="cart-summary" className="lg:sticky lg:top-32 self-start border border-line p-8 bg-paper-2">
            <SectionLabel number="02" label="Order Summary" />
            <div className="mt-8 space-y-3 font-sub text-ink">
              <div className="flex justify-between"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
              <div className="flex justify-between text-ink-soft"><span>Shipping</span><span>Calculated on enquiry</span></div>
              <div className="flex justify-between text-ink-soft"><span>Taxes</span><span>Inclusive</span></div>
              <div className="border-t border-line my-4" />
              <div className="flex justify-between font-heading italic text-2xl text-brand"><span>Total</span><span>{inr(subtotal)}</span></div>
            </div>

            <a
              href={whatsappLink(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="cart-checkout-whatsapp"
              className="btn-primary w-full justify-center mt-8"
            >
              Confirm via WhatsApp <ArrowRight size={14} />
            </a>
            <Link href="/contact" data-testid="cart-checkout-form" className="btn-ghost w-full justify-center mt-3">
              Or send via Contact Form
            </Link>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ink-soft mt-6 leading-relaxed">
              मर्दा ॲन्ड सन्स confirms every order personally — no automated checkout, no surprises.
            </p>
          </aside>
        </section>
      )}
    </div>
  );
}
