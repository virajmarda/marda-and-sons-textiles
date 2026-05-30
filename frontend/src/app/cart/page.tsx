'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Hash,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import {
  inr,
  whatsappLink,
  submitCartEnquiry,
  generateOrderRef,
  siteOrigin,
} from '@/lib/api';
import { Reveal, SectionLabel } from '@/components/reveal';
import { PageHero } from '@/components/page-hero';

export default function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart();
  const empty = items.length === 0;

  const [orderRef, setOrderRef] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!empty && !orderRef) {
      setOrderRef(generateOrderRef());
    }

    if (empty && orderRef) {
      setOrderRef('');
      setSent(false);
    }
  }, [empty, orderRef]);

  const waMsg = useMemo(() => {
    const origin = siteOrigin();

    const greeting = name.trim()
      ? `Hello मर्दा ॲन्ड सन्स, this is ${name.trim()}.`
      : `Hello मर्दा ॲन्ड सन्स,`;

    const lines = items
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.name} (${i.mode}) × ${i.qty} — ${inr(i.price * i.qty)}\n   ${origin}/product/${i.slug}`
      )
      .join('\n');

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

    const waTab = window.open('about:blank', '_blank', 'noopener,noreferrer');

    setSending(true);

    try {
      await submitCartEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        order_ref: orderRef,
        subtotal,
        items: items.map((i) => ({
          slug: i.slug,
          name: i.name,
          mode: i.mode,
          qty: i.qty,
          price: i.price,
        })),
      });

      setSent(true);
    } catch (error) {
      console.error('[cart] cart-enquiry save failed:', error);
    } finally {
      setSending(false);
    }

    const url = whatsappLink(waMsg);

    if (waTab) {
      waTab.location.href = url;
    } else {
      window.location.href = url;
    }
  }

  return (
    <div data-testid="cart-page" className="relative min-h-[80vh] bg-paper pb-24 md:pb-0">
      <PageHero
        chapter="08"
        eyebrow="Your Bag · पिशवी"
        marathi={empty ? 'अजून रिकामी' : `${items.length} वस्तू निवडल्या आहेत`}
        headline={
          empty ? (
            <>
              Your bag is <span className="italic text-brand">unwoven.</span>
            </>
          ) : (
            <>
              The bag, <span className="italic text-brand">curated.</span>
            </>
          )
        }
        lede={
          !empty && orderRef ? (
            <span
              data-testid="order-ref"
              className="eyebrow inline-flex items-center gap-2 text-ink"
            >
              <Hash size={12} /> Reference {orderRef}
            </span>
          ) : undefined
        }
        height="md"
      />

      {empty && (
        <section className="mx-auto max-w-[800px] px-4 pb-24 text-center sm:px-6 md:pb-32">
          <Reveal>
            <p className="text-base text-ink-soft font-sub sm:text-lg">
              Nothing here yet. Begin with our most-loved weaves.
            </p>
            <Link
              href="/shop"
              data-testid="cart-empty-shop"
              className="btn-primary mt-8 sm:mt-10"
            >
              <ShoppingBag size={14} /> Discover the collection
            </Link>
          </Reveal>
        </section>
      )}

      {!empty && (
        <section className="mx-auto grid max-w-[1600px] gap-10 px-4 pb-28 sm:px-6 md:gap-12 md:px-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16 lg:px-24 lg:pb-32">
          <div data-testid="cart-items" className="space-y-8">
            <SectionLabel
              number="01"
              label={`${items.length} item${items.length > 1 ? 's' : ''}`}
            />

            {items.map((item) => (
              <article
                key={`${item.slug}-${item.mode}`}
                className="grid grid-cols-[96px_1fr] gap-4 border-b border-line pb-6 sm:grid-cols-[120px_1fr] sm:gap-6 sm:pb-8 md:grid-cols-[160px_1fr_auto] md:items-start"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="block aspect-[4/5] overflow-hidden bg-bg-secondary"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </Link>

                <div className="min-w-0">
                  <p className="eyebrow text-gold-dark">{item.mode}</p>

                  <Link
                    href={`/product/${item.slug}`}
                    className="mt-1 inline-block text-xl text-ink hover:text-brand font-heading italic sm:text-2xl"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-2 text-ink-soft font-sub">
                    {inr(item.price)} <span className="text-ink-soft/60">/ piece</span>
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <div className="flex items-center border border-line">
                      <button
                        data-testid={`cart-dec-${item.slug}`}
                        onClick={() => setQty(item.slug, item.mode, item.qty - 1)}
                        className="flex h-10 w-10 items-center justify-center hover:bg-bg-secondary"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={13} />
                      </button>

                      <span className="w-10 text-center font-sub">{item.qty}</span>

                      <button
                        data-testid={`cart-inc-${item.slug}`}
                        onClick={() => setQty(item.slug, item.mode, item.qty + 1)}
                        className="flex h-10 w-10 items-center justify-center hover:bg-bg-secondary"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      data-testid={`cart-remove-${item.slug}`}
                      onClick={() => remove(item.slug, item.mode)}
                      className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-brand"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                  <p className="mt-4 text-lg text-brand font-heading italic md:hidden">
                    {inr(item.qty * item.price)}
                  </p>
                </div>

                <p className="hidden whitespace-nowrap text-2xl text-brand font-heading md:block md:text-right">
                  {inr(item.qty * item.price)}
                </p>
              </article>
            ))}

            <button
              data-testid="cart-clear"
              onClick={clear}
              className="eyebrow link-underline text-ink-soft hover:text-brand"
            >
              Clear bag
            </button>
          </div>

          <aside
            data-testid="cart-summary"
            className="self-start border border-line bg-paper-2 p-5 sm:p-6 lg:sticky lg:top-32 lg:p-8"
          >
            <SectionLabel number="02" label="Order Summary" />

            <div className="mt-6 space-y-3 text-ink font-sub sm:mt-8">
              <div className="flex justify-between gap-4">
                <span>Subtotal</span>
                <span>{inr(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4 text-ink-soft">
                <span>Shipping</span>
                <span className="text-right">Calculated on enquiry</span>
              </div>
              <div className="flex justify-between gap-4 text-ink-soft">
                <span>Taxes</span>
                <span>Inclusive</span>
              </div>
              <div className="my-4 border-t border-line" />
              <div className="flex justify-between text-2xl text-brand font-heading italic">
                <span>Total</span>
                <span>{inr(subtotal)}</span>
              </div>
            </div>

            <form
              data-testid="cart-enquiry-form"
              onSubmit={handleSend}
              className="mt-8 space-y-3"
            >
              <label className="block">
                <span className="eyebrow text-ink-soft">Your name</span>
                <input
                  data-testid="cart-enquiry-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aparna Apte"
                  className="mt-2 w-full border border-line bg-paper px-3 py-3 text-ink font-sub outline-none focus:border-brand"
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
                  className="mt-2 w-full border border-line bg-paper px-3 py-3 text-ink font-sub outline-none focus:border-brand"
                />
              </label>

              {sent && (
                <p
                  data-testid="cart-enquiry-sent"
                  className="text-[11px] uppercase tracking-[0.22em] text-brand"
                >
                  ✓ Saved · ref {orderRef}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSend}
                data-testid="cart-checkout-whatsapp"
                className="btn-primary mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MessageCircle size={14} />
                {sending ? 'Saving…' : 'Continue on WhatsApp'} <ArrowRight size={14} />
              </button>

              {!nameValid && name && (
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                  Name needs 2+ characters
                </p>
              )}

              {!phoneValid && phone && (
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                  Enter a valid phone number
                </p>
              )}
            </form>

            <Link
              href="/contact"
              data-testid="cart-checkout-form"
              className="btn-ghost mt-3 w-full justify-center"
            >
              Or send via Contact Form
            </Link>

            <p className="mt-6 text-[11px] uppercase leading-relaxed tracking-[0.22em] text-ink-soft">
              मर्दा ॲन्ड सन्स confirms every order personally — no automated checkout, no surprises.
            </p>
          </aside>
        </section>
      )}

      {!empty && (
        <div
          data-testid="cart-mobile-bar"
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 border-t border-line bg-[#FDFBF7]/95 px-4 py-3 shadow-[0_-4px_24px_-12px_rgba(42,29,26,0.18)] backdrop-blur md:hidden"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-ink-soft eyebrow">Subtotal</p>
            <p className="text-xl text-brand font-heading italic leading-none">{inr(subtotal)}</p>
          </div>

          <button
            data-testid="cart-mobile-whatsapp"
            onClick={() => handleSend()}
            disabled={!canSend}
            className="btn-primary px-5 py-3 text-[10px] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MessageCircle size={14} /> WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
