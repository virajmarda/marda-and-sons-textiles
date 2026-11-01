'use client';

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Hash,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
  generateOrderRef,
  inr,
  siteOrigin,
  submitCartEnquiry,
  whatsappLink,
} from '@/lib/api';

import { useCart } from '@/lib/cart-context';
import { PageHero } from '@/components/page-hero';
import { Reveal, SectionLabel } from '@/components/reveal';

export default function CartPage() {
  const {
    items,
    subtotal,
    setQty,
    remove,
    clear,
  } = useCart();

  const empty = items.length === 0;

  const [orderRef, setOrderRef] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!empty && !orderRef) {
      setOrderRef(generateOrderRef());
    }

    if (empty && orderRef) {
      setOrderRef('');
      setSaved(false);
      setError('');
    }
  }, [empty, orderRef]);

  const whatsappMessage = useMemo(() => {
    const origin = siteOrigin();

    const greeting = name.trim()
      ? `Hello मर्दा ॲन्ड सन्स, this is ${name.trim()}.`
      : 'Hello मर्दा ॲन्ड सन्स,';

    const productLines = items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} (${item.mode}) × ${
            item.qty
          } — ${inr(item.price * item.qty)}\n   ${origin}/product/${encodeURIComponent(
            item.slug,
          )}`,
      )
      .join('\n');

    const reference = orderRef
      ? `\nRef: ${orderRef}`
      : '';

    return [
      greeting,
      'I would like to confirm this order:',
      reference,
      '',
      productLines,
      '',
      `Subtotal: ${inr(subtotal)}`,
      '',
      'Please confirm current availability, applicable taxes, delivery charges and next steps.',
    ].join('\n');
  }, [items, subtotal, name, orderRef]);

  const phoneValid =
    /^[+\d][\d\s-]{8,15}$/.test(phone.trim());

  const nameValid = name.trim().length >= 2;

  const canSend =
    !empty &&
    nameValid &&
    phoneValid &&
    !sending;

  async function handleSend(
    event?: FormEvent<HTMLFormElement>,
  ) {
    event?.preventDefault();

    if (!canSend) {
      return;
    }

    setError('');
    setSaved(false);

    const whatsappTab = window.open(
      'about:blank',
      '_blank',
      'noopener,noreferrer',
    );

    setSending(true);

    try {
      const result = await submitCartEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        order_ref: orderRef,
        subtotal,
        items: items.map((item) => ({
          slug: item.slug,
          name: item.name,
          mode: item.mode,
          qty: item.qty,
          price: item.price,
        })),
      });

      if (result?.ok === false) {
        throw new Error(
          'Your enquiry could not be saved.',
        );
      }

      setSaved(true);

      toast.success(
        'Your enquiry has been saved.',
      );
    } catch (submissionError) {
      console.error(
        '[cart] cart-enquiry save failed:',
        submissionError,
      );

      const message =
        submissionError instanceof Error
          ? submissionError.message
          : 'Could not save your enquiry. Please try again.';

      setError(message);

      toast.error(message);
    } finally {
      setSending(false);
    }

    const url = whatsappLink(whatsappMessage);

    if (whatsappTab) {
      whatsappTab.location.href = url;
    } else {
      window.location.href = url;
    }
  }

  return (
    <div
      data-testid="cart-page"
      className="relative min-h-[80vh] bg-paper pb-24 md:pb-0"
    >
      <PageHero
        chapter="08"
        eyebrow="Your Bag · पिशवी"
        marathi={
          empty
            ? 'अजून रिकामी'
            : `${items.length} वस्तू निवडल्या आहेत`
        }
        headline={
          empty ? (
            <>
              Your bag is{' '}
              <span className="italic text-brand">
                unwoven.
              </span>
            </>
          ) : (
            <>
              The bag,{' '}
              <span className="italic text-brand">
                curated.
              </span>
            </>
          )
        }
        lede={
          !empty && orderRef ? (
            <span
              data-testid="order-ref"
              className="eyebrow inline-flex items-center gap-2 text-ink"
            >
              <Hash size={12} /> Reference{' '}
              {orderRef}
            </span>
          ) : undefined
        }
        height="md"
      />

      {empty && (
        <section className="mx-auto max-w-[800px] px-4 pb-24 text-center sm:px-6 md:pb-32">
          <Reveal>
            <p className="font-sub text-base text-ink-soft sm:text-lg">
              Nothing here yet. Begin with our
              most-loved weaves.
            </p>

            <Link
              href="/shop"
              data-testid="cart-empty-shop"
              className="btn-primary mt-8 sm:mt-10"
            >
              <ShoppingBag size={14} /> Discover
              the collection
            </Link>
          </Reveal>
        </section>
      )}

      {!empty && (
        <section className="mx-auto grid max-w-[1600px] gap-10 px-4 pb-28 sm:px-6 md:gap-12 md:px-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16 lg:px-24 lg:pb-32">
          <div
            data-testid="cart-items"
            className="space-y-8"
          >
            <SectionLabel
              number="01"
              label={`${items.length} item${
                items.length > 1 ? 's' : ''
              }`}
            />

            {items.map((item) => (
              <article
                key={`${item.slug}-${item.mode}`}
                className="grid grid-cols-[96px_1fr] gap-4 border-b border-line pb-6 sm:grid-cols-[120px_1fr] sm:gap-6 sm:pb-8 md:grid-cols-[160px_1fr_auto] md:items-start"
              >
                <Link
                  href={`/product/${encodeURIComponent(
                    item.slug,
                  )}`}
                  className="block aspect-[4/5] overflow-hidden bg-bg-secondary"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    width={160}
                    height={200}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="min-w-0">
                  <p className="eyebrow text-gold-dark">
                    {item.mode}
                  </p>

                  <Link
                    href={`/product/${encodeURIComponent(
                      item.slug,
                    )}`}
                    className="mt-1 inline-block font-heading text-xl italic text-ink transition-colors hover:text-brand sm:text-2xl"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-2 font-sub text-ink-soft">
                    {inr(item.price)}{' '}
                    <span className="text-ink-soft/60">
                      / piece
                    </span>
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <div className="flex items-center border border-line">
                      <button
                        type="button"
                        data-testid={`cart-dec-${item.slug}`}
                        onClick={() =>
                          setQty(
                            item.slug,
                            item.mode,
                            item.qty - 1,
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-bg-secondary"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-10 text-center font-sub">
                        {item.qty}
                      </span>

                      <button
                        type="button"
                        data-testid={`cart-inc-${item.slug}`}
                        onClick={() =>
                          setQty(
                            item.slug,
                            item.mode,
                            item.qty + 1,
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-bg-secondary"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      data-testid={`cart-remove-${item.slug}`}
                      onClick={() =>
                        remove(item.slug, item.mode)
                      }
                      className="inline-flex min-h-[44px] items-center gap-2 font-sub text-sm text-ink-soft transition-colors hover:text-brand"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>

                  <p className="mt-4 font-heading text-lg italic text-brand md:hidden">
                    {inr(item.qty * item.price)}
                  </p>
                </div>

                <p className="hidden whitespace-nowrap font-heading text-2xl text-brand md:block md:text-right">
                  {inr(item.qty * item.price)}
                </p>
              </article>
            ))}

            <button
              type="button"
              data-testid="cart-clear"
              onClick={clear}
              className="eyebrow link-underline text-ink-soft transition-colors hover:text-brand"
            >
              Clear bag
            </button>
          </div>

          <aside
            data-testid="cart-summary"
            className="self-start border border-line bg-paper-2 p-5 sm:p-6 lg:sticky lg:top-32 lg:p-8"
          >
            <SectionLabel
              number="02"
              label="Order Summary"
            />

            <div className="mt-6 space-y-3 font-sub text-ink sm:mt-8">
              <div className="flex justify-between gap-4">
                <span>Subtotal</span>
                <span>{inr(subtotal)}</span>
              </div>

              <div className="flex justify-between gap-4 text-ink-soft">
                <span>Shipping</span>
                <span className="text-right">
                  Calculated on enquiry
                </span>
              </div>

              <div className="flex justify-between gap-4 text-ink-soft">
                <span>Taxes</span>
                <span className="text-right">
                  Confirmed on enquiry
                </span>
              </div>

              <div className="my-4 border-t border-line" />

              <div className="flex justify-between font-heading text-2xl italic text-brand">
                <span>Estimated total</span>
                <span>{inr(subtotal)}</span>
              </div>
            </div>

            <form
              data-testid="cart-enquiry-form"
              onSubmit={handleSend}
              className="mt-8 space-y-4"
              aria-busy={sending}
            >
              <div>
                <label
                  htmlFor="cart-enquiry-name"
                  className="block"
                >
                  <span className="eyebrow text-ink-soft">
                    Your name
                  </span>
                </label>

                <input
                  id="cart-enquiry-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={120}
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="e.g. Aparna Apte"
                  data-testid="cart-enquiry-name"
                  aria-describedby="cart-name-help"
                  className="mt-2 min-h-[44px] w-full border border-line bg-paper px-3 py-3 font-sub text-ink outline-none focus:border-brand"
                />
              </div>

              <div>
                <label
                  htmlFor="cart-enquiry-phone"
                  className="block"
                >
                  <span className="eyebrow text-ink-soft">
                    WhatsApp number
                  </span>
                </label>

                <input
                  id="cart-enquiry-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+91 9XXXX XXXXX"
                  data-testid="cart-enquiry-phone"
                  aria-describedby="cart-phone-help"
                  className="mt-2 min-h-[44px] w-full border border-line bg-paper px-3 py-3 font-sub text-ink outline-none focus:border-brand"
                />
              </div>

              <p
                id="cart-name-help"
                className="font-sub text-sm text-ink-soft"
              >
                {!nameValid && name
                  ? 'Name needs at least 2 characters.'
                  : ''}
              </p>

              <p
                id="cart-phone-help"
                className="font-sub text-sm text-ink-soft"
              >
                {!phoneValid && phone
                  ? 'Enter a valid phone number, including country code where applicable.'
                  : ''}
              </p>

              {saved && (
                <p
                  data-testid="cart-enquiry-sent"
                  role="status"
                  className="font-sub text-sm text-brand"
                >
                  ✓ Enquiry saved · reference{' '}
                  {orderRef}
                </p>
              )}

              {error && (
                <p
                  role="alert"
                  className="font-sub text-sm text-ink"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSend}
                data-testid="cart-checkout-whatsapp"
                className="btn-primary mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MessageCircle size={15} />

                {sending
                  ? 'Saving…'
                  : 'Continue on WhatsApp'}

                <ArrowRight size={15} />
              </button>

              <p className="font-sub text-sm leading-relaxed text-ink-soft">
                This prepares a WhatsApp message.
                Your enquiry is not sent until you
                press Send in WhatsApp.
              </p>
            </form>

            <Link
              href="/contact"
              data-testid="cart-checkout-form"
              className="btn-ghost mt-3 w-full justify-center"
            >
              Or send via Contact Form
            </Link>

            <p className="mt-6 font-sub text-[11px] uppercase leading-relaxed tracking-[0.22em] text-ink-soft">
              मर्दा ॲन्ड सन्स confirms every order
              personally — no automated checkout.
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
            <p className="eyebrow truncate text-ink-soft">
              Estimated total
            </p>

            <p className="font-heading text-xl italic leading-none text-brand">
              {inr(subtotal)}
            </p>
          </div>

          <button
            type="button"
            data-testid="cart-mobile-whatsapp"
            onClick={() => handleSend()}
            disabled={!canSend}
            className="btn-primary px-5 py-3 text-[10px] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MessageCircle size={15} /> WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
