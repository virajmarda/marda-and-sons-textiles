'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, MessageCircle, Hash } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { inr, whatsappLink, submitCartEnquiry, generateOrderRef, siteOrigin } from '@/lib/api';
import { Reveal, SectionLabel } from '@/components/reveal';

const REF_KEY = 'marda_order_ref_v1';

export default function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart();
  const empty = items.length === 0;

  // -- Order reference: stable for the session, regenerated when bag is cleared --
  const [orderRef, setOrderRef] = useState<string>('');
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(REF_KEY);
      if (stored) {
        setOrderRef(stored);
      } else {
        const fresh = generateOrderRef();
        sessionStorage.setItem(REF_KEY, fresh);
        setOrderRef(fresh);
      }
    } catch (error) {
      console.error('[cart] orderRef sessionStorage failed:', error);
      setOrderRef(generateOrderRef());
    }
  }, []);

  // Reset ref when bag becomes empty (next enquiry will get a fresh reference)
  useEffect(() => {
    if (empty && orderRef) {
      try {
        sessionStorage.removeItem(REF_KEY);
      } catch (error) {
        console.error('[cart] orderRef reset failed:', error);
      }
      setOrderRef('');
    }
  }, [empty, orderRef]);

  // -- WhatsApp message (now with greeting, product URLs, order ref) --
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const waMsg = useMemo(() => {
    const origin = siteOrigin();
    const greeting = name.trim()
      ? `Hello मर्दा ॲन्ड सन्स, this is ${name.trim()}.`
      : `Hello मर्दा ॲन्ड सन्स,`;
    const lines = items.map((i, idx) =>
      `${idx + 1}. ${i.name} (${i.mode}) × ${i.qty} — ${inr(i.price * i.qty)}\n   ${origin}/product/${i.slug}`,
    ).join('\n');
    const ref = orderRef ? `\nRef: ${orderRef}` : '';
    return (
      `${greeting}\nI'd like to confirm this order:${ref}\n\n` +
      `${lines}\n\nSubtotal: ${inr(subtotal)}\n\nPlease confirm availability & next steps.`
    );
  }, [items, subtotal, name, orderRef]);

  const phoneValid = /^[+\d][\d\s\-]{8,15}$/.test(phone.trim());
  const nameValid = name.trim().length >= 2;
  const canSend = !empty && nameValid && phoneValid && !sending;

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!canSend) return;

    // Pre-open the WhatsApp tab synchronously while we're still inside the user gesture.
    // (Safari / Firefox / mobile WebKit will block window.open() once we 'await' below.)
    const waTab = window.open('about:blank', '_blank', 'noopener,noreferrer');

    setSending(true);
    try {
      await submitCartEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        order_ref: orderRef,
        subtotal,
        items: items.map((i) => ({
          slug: i.slug, name: i.name, mode: i.mode, qty: i.qty, price: i.price,
        })),
      });
      setSent(true);
    } catch (error) {
      // Even if the lead-save fails, still let them message — don't block the customer.
      console.error('[cart] cart-enquiry save failed:', error);
    } finally {
      setSending(false);
    }

    const url = whatsappLink(waMsg);
    if (waTab) {
      waTab.location.href = url;
    } else {
      // Popup was blocked — fall back to same-tab navigation
      window.location.href = url;
    }
  }

  return (
    <div data-testid="cart-page" className="bg-paper min-h-[80vh] relative overflow-hidden pb-24 md:pb-0">
      <div aria-hidden className="absolute top-32 -right-40 w-[600px] h-[600px] rounded-full bg-brand/[0.05] blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full bg-gold/[0.07] blur-3xl pointer-events-none" />

      <section className="relative pt-40 pb-12 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <p className="eyebrow">Your Bag · पिशवी</p>
        <h1 className="display-1 text-5xl md:text-7xl lg:text-8xl text-ink mt-6 leading-[0.95]">
          {empty
            ? <>Your bag is <span className="italic text-brand">unwoven.</span></>
            : <>The bag, <span className="italic text-brand">curated.</span></>}
        </h1>
        <p className="font-accent text-brand mt-6 text-xl md:text-2xl">
          {empty ? 'अजून रिकामी' : `${items.length} ${items.length === 1 ? 'वस्तू' : 'वस्तू'} निवडल्या आहेत`}
        </p>
        {!empty && orderRef && (
          <p data-testid="order-ref" className="eyebrow text-ink-soft mt-6 inline-flex items-center gap-2">
            <Hash size={12} /> Reference {orderRef}
          </p>
        )}
      </section>

      {empty && (
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
      )}

      {!empty && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pb-32 grid lg:grid-cols-[1.5fr_1fr] gap-16">
          {/* Items */}
          <div data-testid="cart-items" className="space-y-8">
            <SectionLabel number="01" label={`${items.length} item${items.length > 1 ? 's' : ''}`} />
            {items.map((item) => (
              <article key={`${item.slug}-${item.mode}`} className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr_auto] gap-6 border-b border-line pb-8 items-start">
                <Link href={`/product/${item.slug}`} className="aspect-[4/5] bg-bg-secondary overflow-hidden block">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div>
                  <p className="eyebrow text-gold-dark">{item.mode}</p>
                  <Link href={`/product/${item.slug}`} className="font-heading italic text-2xl text-ink mt-1 inline-block hover:text-brand">
                    {item.name}
                  </Link>
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

            {/* Contact capture */}
            <form data-testid="cart-enquiry-form" onSubmit={handleSend} className="mt-8 space-y-3">
              <label className="block">
                <span className="eyebrow text-ink-soft">Your name</span>
                <input
                  data-testid="cart-enquiry-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aparna Apte"
                  className="mt-2 w-full bg-paper border border-line px-3 py-2.5 font-sub text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="block">
                <span className="eyebrow text-ink-soft">WhatsApp number</span>
                <input
                  data-testid="cart-enquiry-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9XXXX XXXXX"
                  className="mt-2 w-full bg-paper border border-line px-3 py-2.5 font-sub text-ink outline-none focus:border-brand"
                />
              </label>
              {sent && (
                <p data-testid="cart-enquiry-sent" className="text-[11px] uppercase tracking-[0.22em] text-brand">
                  ✓ Saved · ref {orderRef}
                </p>
              )}
              <button
                type="submit"
                disabled={!canSend}
                data-testid="cart-checkout-whatsapp"
                className="btn-primary w-full justify-center mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MessageCircle size={14} />
                {sending ? 'Saving…' : 'Continue on WhatsApp'} <ArrowRight size={14} />
              </button>
              {!nameValid && name && (
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft">Name needs 2+ characters</p>
              )}
              {!phoneValid && phone && (
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft">Enter a valid phone number</p>
              )}
            </form>

            <Link href="/contact" data-testid="cart-checkout-form" className="btn-ghost w-full justify-center mt-3">
              Or send via Contact Form
            </Link>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ink-soft mt-6 leading-relaxed">
              मर्दा ॲन्ड सन्स confirms every order personally — no automated checkout, no surprises.
            </p>
          </aside>
        </section>
      )}

      {/* Mobile sticky bottom bar */}
      {!empty && (
        <div
          data-testid="cart-mobile-bar"
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FDFBF7]/95 backdrop-blur border-t border-line px-4 py-3 flex items-center gap-3 shadow-[0_-4px_24px_-12px_rgba(42,29,26,0.18)]"
        >
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-ink-soft truncate">Subtotal</p>
            <p className="font-heading italic text-xl text-brand leading-none">{inr(subtotal)}</p>
          </div>
          <button
            data-testid="cart-mobile-whatsapp"
            onClick={() => handleSend()}
            disabled={!canSend}
            className="btn-primary text-[10px] px-5 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MessageCircle size={14} /> WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
