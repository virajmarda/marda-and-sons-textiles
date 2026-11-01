'use client';

import {
  useEffect,
  useMemo,
  useRef,
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
import { SafeImage } from '@/components/safe-image';

type EnquiryFeedback = {
  key: string;
  saved: boolean;
  error: string;
  whatsappUrl: string;
};

export default function CartPage() {
  const {
    items,
    subtotal,
    setQty,
    remove,
    clear,
    mounted,
  } = useCart();

  const empty = items.length === 0;

  const [orderRef, setOrderRef] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);

  const [feedback, setFeedback] =
    useState<EnquiryFeedback | null>(null);

  const requestInFlight = useRef(false);

  useEffect(() => {
    if (!mounted) return;

    if (!empty && !orderRef) {
      setOrderRef(generateOrderRef());
    }

    if (empty) {
      setOrderRef('');
      setFeedback(null);
    }
  }, [mounted, empty, orderRef]);

  const enquiryKey = useMemo(
    () =>
      JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        orderRef,
        subtotal,
        items,
      }),
    [name, phone, orderRef, subtotal, items],
  );

  const currentFeedback =
    feedback?.key === enquiryKey
      ? feedback
      : null;

  useEffect(() => {
    setFeedback(null);
  }, [enquiryKey]);

  const nameValid =
    name.trim().length >= 2 &&
    name.trim().length <= 120;

  const phoneDigits = phone.replace(/\D/g, '');

  const phoneValid =
    /^\+?[\d\s().-]+$/.test(phone.trim()) &&
    phoneDigits.length >= 7 &&
    phoneDigits.length <= 15;

  const itemsValid = items.every(
    (item) =>
      typeof item.slug === 'string' &&
      item.slug.length > 0 &&
      Number.isInteger(item.qty) &&
      item.qty > 0 &&
      Number.isFinite(item.price) &&
      item.price >= 0,
  );

  const canSend =
    mounted &&
    !empty &&
    Boolean(orderRef) &&
    nameValid &&
    phoneValid &&
    itemsValid &&
    Number.isFinite(subtotal) &&
    !sending;

  async function handleSend(
    event?: FormEvent<HTMLFormElement>,
  ) {
    event?.preventDefault();

    if (!canSend || requestInFlight.current) {
      return;
    }

    const submittedKey = enquiryKey;
    const submittedRef = orderRef;

    const message = [
      `Hello मर्दा ॲन्ड सन्स, this is ${name.trim()}.`,
      '',
      'I would like to enquire about these items:',
      `Reference: ${submittedRef}`,
      `Contact number: ${phone.trim()}`,
      '',
      ...items.map(
        (item, index) =>
          `${index + 1}. ${item.name} (${item.mode}) × ${
            item.qty
          } — ${inr(item.price * item.qty)}\n   ${
            siteOrigin()
          }/product/${encodeURIComponent(item.slug)}`,
      ),
      '',
      `Listed subtotal: ${inr(subtotal)}`,
      '',
      'Please confirm current prices, availability, applicable taxes, delivery charges and next steps.',
      'This is an enquiry, not a confirmed order.',
    ].join('\n');

    const url = whatsappLink(message);

    requestInFlight.current = true;
    setSending(true);

    setFeedback({
      key: submittedKey,
      saved: false,
      error: '',
      whatsappUrl: url,
    });

    try {
      const result = await submitCartEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        order_ref: submittedRef,
        subtotal,
        items: items.map((item) => ({
          slug: item.slug,
          name: item.name,
          mode: item.mode,
          qty: item.qty,
          price: item.price,
        })),
      });

      if (result?.ok !== true) {
        throw new Error(
          'The website did not explicitly confirm saving.',
        );
      }

      setFeedback({
        key: submittedKey,
        saved: true,
        error: '',
        whatsappUrl: url,
      });
    } catch (submissionError) {
      console.error(
        '[cart] Website save not confirmed:',
        submissionError,
      );

      setFeedback({
        key: submittedKey,
        saved: false,
        error:
          'Website saving was not confirmed. You can still send the prepared enquiry through WhatsApp. Retrying the website save may create a duplicate record.',
        whatsappUrl: url,
      });
    } finally {
      requestInFlight.current = false;
      setSending(false);
    }
  }

  if (!mounted) {
    return (
      <div
        data-testid="cart-loading"
        role="status"
        className="min-h-[60vh] bg-paper px-6 pb-24 pt-36"
      >
        <p className="mx-auto max-w-[1600px] font-sub text-base text-ink-soft">
          Loading your bag…
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="cart-page"
      className="relative min-h-[80vh] bg-paper pb-32 md:pb-0"
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
              className="inline-flex items-center gap-2 font-sub text-sm text-ink"
            >
              <Hash size={14} aria-hidden="true" />
              Reference {orderRef}
            </span>
          ) : undefined
        }
        height="md"
      />

      {empty && (
        <section className="mx-auto max-w-[800px] px-4 pb-24 text-center sm:px-6 md:pb-32">
          <Reveal>
            <p className="font-sub text-base text-ink-soft sm:text-lg">
              Nothing here yet. Explore the collection
              to find your next piece.
            </p>

            <Link
              href="/shop"
              data-testid="cart-empty-shop"
              className="btn-primary mt-8 justify-center gap-2 sm:mt-10"
            >
              <ShoppingBag
                size={15}
                aria-hidden="true"
              />
              Discover the collection
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
                items.length === 1 ? '' : 's'
              }`}
            />

            {items.map((item) => {
              const productHref =
                `/product/${encodeURIComponent(item.slug)}`;

              return (
                <article
                  key={`${item.slug}-${item.mode}`}
                  className="grid grid-cols-[96px_1fr] gap-4 border-b border-line pb-6 sm:grid-cols-[120px_1fr] sm:gap-6 sm:pb-8 md:grid-cols-[160px_1fr_auto] md:items-start"
                >
                  <Link
                    href={productHref}
                    className="block aspect-[4/5] overflow-hidden bg-bg-secondary"
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      width={160}
                      height={200}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      fallbackClassName="h-full w-full bg-bg-secondary"
                    />
                  </Link>

                  <div className="min-w-0">
                    <p className="font-sub text-xs uppercase tracking-wider text-ink-soft">
                      {item.mode}
                    </p>

                    <Link
                      href={productHref}
                      className="mt-1 inline-block font-heading text-xl italic text-ink transition-colors hover:text-brand sm:text-2xl"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-2 font-sub text-ink-soft">
                      {inr(item.price)}{' '}
                      <span className="text-sm">
                        / listed unit
                      </span>
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          data-testid={`cart-dec-${item.slug}`}
                          disabled={sending || item.qty <= 1}
                          onClick={() =>
                            setQty(
                              item.slug,
                              item.mode,
                              Math.max(1, item.qty - 1),
                            )
                          }
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus
                            size={14}
                            aria-hidden="true"
                          />
                        </button>

                        <span
                          aria-label={`Quantity: ${item.qty}`}
                          className="min-w-[40px] px-2 text-center font-sub"
                        >
                          {item.qty}
                        </span>

                        <button
                          type="button"
                          data-testid={`cart-inc-${item.slug}`}
                          disabled={sending}
                          onClick={() =>
                            setQty(
                              item.slug,
                              item.mode,
                              item.qty + 1,
                            )
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                          className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus
                            size={14}
                            aria-hidden="true"
                          />
                        </button>
                      </div>

                      <button
                        type="button"
                        data-testid={`cart-remove-${item.slug}`}
                        disabled={sending}
                        onClick={() =>
                          remove(item.slug, item.mode)
                        }
                        aria-label={`Remove ${item.name} from cart`}
                        className="inline-flex min-h-[44px] items-center gap-2 font-sub text-sm text-ink-soft transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2
                          size={15}
                          aria-hidden="true"
                        />
                        Remove
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
              );
            })}

            <button
              type="button"
              data-testid="cart-clear"
              disabled={sending}
              onClick={clear}
              className="inline-flex min-h-[44px] items-center font-sub text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
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
              label="Enquiry Summary"
            />

            <div className="mt-6 space-y-3 font-sub text-ink sm:mt-8">
              <div className="flex justify-between gap-4">
                <span>Listed subtotal</span>
                <span>{inr(subtotal)}</span>
              </div>

              <div className="flex justify-between gap-4 text-ink-soft">
                <span>Shipping</span>
                <span className="text-right">
                  Confirmed on enquiry
                </span>
              </div>

              <div className="flex justify-between gap-4 text-ink-soft">
                <span>Taxes</span>
                <span className="text-right">
                  Confirmed on enquiry
                </span>
              </div>
            </div>

            <p className="mt-5 font-sub text-sm leading-relaxed text-ink-soft">
              This is not a final payable total.
              Current pricing, quantities, taxes and
              delivery charges require confirmation.
            </p>

            {!itemsValid && (
              <p
                role="alert"
                className="mt-4 font-sub text-sm text-ink"
              >
                Some bag details are invalid. Remove the
                affected items or clear the bag before
                preparing an enquiry.
              </p>
            )}

            <form
              data-testid="cart-enquiry-form"
              onSubmit={handleSend}
              className="mt-8 space-y-4"
              aria-busy={sending}
              aria-describedby="cart-enquiry-help"
            >
              <div>
                <label
                  htmlFor="cart-enquiry-name"
                  className="block font-sub text-sm text-ink"
                >
                  Your name *
                </label>

                <input
                  id="cart-enquiry-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={120}
                  disabled={sending}
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="e.g. Aparna Apte"
                  data-testid="cart-enquiry-name"
                  aria-describedby="cart-name-help"
                  className="mt-2 min-h-[44px] w-full border border-line bg-paper px-3 py-3 font-sub text-base text-ink focus:border-brand disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="cart-enquiry-phone"
                  className="block font-sub text-sm text-ink"
                >
                  WhatsApp number *
                </label>

                <input
                  id="cart-enquiry-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  maxLength={30}
                  disabled={sending}
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+91 9XXXX XXXXX"
                  data-testid="cart-enquiry-phone"
                  aria-describedby="cart-phone-help"
                  className="mt-2 min-h-[44px] w-full border border-line bg-paper px-3 py-3 font-sub text-base text-ink focus:border-brand disabled:opacity-60"
                />
              </div>

              <p
                id="cart-name-help"
                className="font-sub text-sm text-ink-soft"
              >
                {!nameValid && name
                  ? 'Please enter a name between 2 and 120 characters.'
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

              {currentFeedback?.saved && (
                <p
                  data-testid="cart-enquiry-sent"
                  role="status"
                  className="font-sub text-sm leading-relaxed text-brand"
                >
                  Enquiry saved to the website ·
                  reference {orderRef}. This is not
                  an order confirmation.
                </p>
              )}

              {currentFeedback?.error && (
                <p
                  role="alert"
                  className="font-sub text-sm leading-relaxed text-ink"
                >
                  {currentFeedback.error}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSend}
                data-testid="cart-checkout-whatsapp"
                className="btn-primary mt-2 w-full justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MessageCircle
                  size={15}
                  aria-hidden="true"
                />

                {sending
                  ? 'Checking website save…'
                  : 'Prepare WhatsApp enquiry'}

                <ArrowRight
                  size={15}
                  aria-hidden="true"
                />
              </button>

              {currentFeedback?.whatsappUrl && (
                <div className="space-y-3 border-t border-line pt-4">
                  <p
                    role="status"
                    className="font-sub text-sm leading-relaxed text-ink-soft"
                  >
                    Your WhatsApp message is ready.
                    You can send it whether or not
                    website saving was confirmed.
                  </p>

                  <a
                    href={currentFeedback.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="cart-open-whatsapp"
                    className="btn-ghost w-full justify-center gap-2"
                  >
                    <MessageCircle
                      size={15}
                      aria-hidden="true"
                    />
                    Open WhatsApp
                  </a>
                </div>
              )}

              <p
                id="cart-enquiry-help"
                className="font-sub text-sm leading-relaxed text-ink-soft"
              >
                Press Send in WhatsApp to send your
                message. Preparing a message does not
                send it, and an enquiry does not
                confirm an order.
              </p>
            </form>

            <Link
              href="/contact"
              data-testid="cart-checkout-form"
              className="btn-ghost mt-3 w-full justify-center"
            >
              Contact the store instead
            </Link>

            <p className="mt-6 font-sub text-sm leading-relaxed text-ink-soft">
              मर्दा ॲन्ड सन्स confirms orders
              personally. No payment is collected
              on this page.
            </p>
          </aside>
        </section>
      )}

      {!empty && (
        <div
          data-testid="cart-mobile-bar"
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 border-t border-line bg-paper/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_24px_-12px_rgba(42,29,26,0.18)] backdrop-blur md:hidden"
        >
          <div className="min-w-0 flex-1">
            <p className="font-sub text-xs text-ink-soft">
              Listed subtotal
            </p>

            <p className="font-heading text-xl italic leading-tight text-brand">
              {inr(subtotal)}
            </p>
          </div>

          {currentFeedback?.whatsappUrl ? (
            <a
              href={currentFeedback.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="cart-mobile-whatsapp"
              className="btn-primary justify-center gap-2 px-4 py-3"
            >
              <MessageCircle
                size={15}
                aria-hidden="true"
              />
              Open WhatsApp
            </a>
          ) : (
            <button
              type="button"
              data-testid="cart-mobile-whatsapp"
              onClick={() => void handleSend()}
              disabled={!canSend}
              className="btn-primary justify-center gap-2 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MessageCircle
                size={15}
                aria-hidden="true"
              />

              {sending
                ? 'Checking…'
                : 'Prepare enquiry'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
