'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Lock,
  LogOut,
  MessageCircle,
  RefreshCcw,
  Search,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
  ApiError,
  getAdminLeads,
  inr,
  markLeadContacted,
  type AdminCounts,
  type AdminLead,
} from '@/lib/api';

import { PageHero } from '@/components/page-hero';

const TOKEN_KEY = 'marda_admin_token_v1';

type TypeKey =
  | 'all'
  | 'cart_enquiry'
  | 'contact'
  | 'wholesale'
  | 'newsletter';

const TYPE_TABS: Array<{
  key: TypeKey;
  label: string;
}> = [
  {
    key: 'all',
    label: 'All',
  },
  {
    key: 'cart_enquiry',
    label: 'Cart enquiries',
  },
  {
    key: 'contact',
    label: 'Contact',
  },
  {
    key: 'wholesale',
    label: 'Wholesale',
  },
  {
    key: 'newsletter',
    label: 'Newsletter',
  },
];

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  return `https://wa.me/${digits}`;
}

export default function AdminLeadsPage() {
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] =
    useState('');

  const [authError, setAuthError] = useState('');
  const [leads, setLeads] = useState<AdminLead[]>(
    [],
  );
  const [stats, setStats] =
    useState<AdminCounts | null>(null);

  const [loading, setLoading] = useState(false);
  const [updatingLeadId, setUpdatingLeadId] =
    useState('');

  const [activeType, setActiveType] =
    useState<TypeKey>('all');

  const [
    showOnlyUncontacted,
    setShowOnlyUncontacted,
  ] = useState(false);

  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(
        TOKEN_KEY,
      );

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error(
        '[admin] token hydrate failed:',
        error,
      );
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setAuthError('');

    try {
      const data = await getAdminLeads(token, {
        type:
          activeType === 'all'
            ? undefined
            : activeType,
        contacted: showOnlyUncontacted
          ? false
          : undefined,
      });

      setLeads(data.leads);
      setStats(data.stats);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Could not load leads. Please try again.';

      setAuthError(message);

      if (
        error instanceof ApiError &&
        (error.status === 401 ||
          error.status === 403)
      ) {
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch (storageError) {
          console.error(
            '[admin] token removal failed:',
            storageError,
          );
        }

        setToken('');
        setLeads([]);
        setStats(null);
      }
    } finally {
      setLoading(false);
    }
  }, [
    token,
    activeType,
    showOnlyUncontacted,
  ]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  function handleSignIn(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const value = tokenInput.trim();

    if (!value) {
      return;
    }

    try {
      localStorage.setItem(TOKEN_KEY, value);
    } catch (error) {
      console.error(
        '[admin] token storage failed:',
        error,
      );
    }

    setToken(value);
    setTokenInput('');
    setAuthError('');
  }

  function handleSignOut() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error(
        '[admin] token removal failed:',
        error,
      );
    }

    setToken('');
    setTokenInput('');
    setLeads([]);
    setStats(null);
    setAuthError('');
  }

  async function toggleContacted(
    lead: AdminLead,
  ) {
    if (!token || updatingLeadId) {
      return;
    }

    const next = !lead.contacted_at;

    setUpdatingLeadId(lead.id);

    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              contacted_at: next
                ? new Date().toISOString()
                : null,
            }
          : item,
      ),
    );

    try {
      await markLeadContacted(
        token,
        lead.id,
        next,
      );

      toast.success(
        next
          ? 'Lead marked as contacted.'
          : 'Lead marked as not contacted.',
      );
    } catch (error) {
      console.error(
        '[admin] toggleContacted failed:',
        error,
      );

      setLeads((current) =>
        current.map((item) =>
          item.id === lead.id
            ? {
                ...item,
                contacted_at: lead.contacted_at,
              }
            : item,
        ),
      );

      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not update this lead.',
      );
    } finally {
      setUpdatingLeadId('');
    }
  }

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return leads;
    }

    return leads.filter((lead) =>
      [
        lead.name,
        lead.email,
        lead.phone,
        lead.message,
        lead.company,
        lead.city,
        lead.order_ref,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query),
        ),
    );
  }, [leads, search]);

  if (!token) {
    return (
      <div
        data-testid="admin-login"
        className="min-h-screen bg-paper"
      >
        <PageHero
          chapter="09"
          eyebrow="Atelier desk · प्रशासन"
          marathi="ग्राहकांच्या नोंदी"
          headline={
            <>
              The{' '}
              <span className="italic text-brand">
                ledger.
              </span>
            </>
          }
          lede={
            <>
              A private workspace for the shop.
              Read every cart enquiry, contact
              request, wholesale lead, and
              newsletter signup — and mark each
              one as you reach out.
            </>
          }
          height="md"
        />

        <section className="mx-auto max-w-md px-6 pb-32">
          <form
            onSubmit={handleSignIn}
            className="border border-line bg-paper-2 p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <Lock
                size={16}
                className="text-brand"
              />

              <p className="eyebrow text-ink">
                Admin access
              </p>
            </div>

            <div>
              <label
                htmlFor="admin-token"
                className="block"
              >
                <span className="eyebrow text-ink-soft">
                  Admin token
                </span>
              </label>

              <input
                id="admin-token"
                data-testid="admin-token-input"
                type="password"
                autoComplete="current-password"
                required
                value={tokenInput}
                onChange={(event) =>
                  setTokenInput(
                    event.target.value,
                  )
                }
                placeholder="Enter your admin token"
                className="mt-2 min-h-[44px] w-full border border-line bg-paper px-3 py-2.5 font-sub text-ink outline-none focus:border-brand"
              />
            </div>

            <button
              data-testid="admin-sign-in"
              type="submit"
              disabled={!tokenInput.trim()}
              className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShieldCheck size={15} /> Enter the
              ledger <ArrowRight size={15} />
            </button>

            {authError && (
              <p
                data-testid="admin-auth-error"
                role="alert"
                className="mt-4 font-sub text-sm text-brand"
              >
                {authError}
              </p>
            )}

            <p className="mt-6 font-sub text-[10px] uppercase leading-relaxed tracking-[0.22em] text-ink-soft">
              The token is configured on the server
              as{' '}
              <code className="font-mono normal-case tracking-normal">
                ADMIN_TOKEN
              </code>
              .
            </p>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div
      data-testid="admin-leads-page"
      className="min-h-screen bg-paper"
    >
      <PageHero
        chapter="09"
        eyebrow="Atelier desk · प्रशासन"
        marathi={
          stats
            ? `एकूण ${
                stats.all ?? 0
              } नोंदी · ${
                stats.uncontacted ?? 0
              } बाकी`
            : 'ग्राहकांच्या नोंदी'
        }
        headline={
          <>
            The{' '}
            <span className="italic text-brand">
              ledger.
            </span>
          </>
        }
        height="md"
      />

      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-16">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {TYPE_TABS.map((tab) => {
              const isActive =
                activeType === tab.key;

              const count = stats
                ? tab.key === 'all'
                  ? stats.all
                  : stats[
                      tab.key as keyof AdminCounts
                    ]
                : null;

              return (
                <button
                  key={tab.key}
                  type="button"
                  data-testid={`admin-tab-${tab.key}`}
                  onClick={() =>
                    setActiveType(tab.key)
                  }
                  aria-pressed={isActive}
                  className={`min-h-[44px] border px-4 py-2 font-sub text-[10px] uppercase tracking-[0.22em] transition-colors ${
                    isActive
                      ? 'border-brand bg-brand/[0.05] text-brand'
                      : 'border-line text-ink hover:border-brand'
                  }`}
                >
                  {tab.label}

                  {count != null && (
                    <span className="ml-2 text-ink-soft">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex min-h-[44px] cursor-pointer select-none items-center gap-2">
              <input
                data-testid="admin-only-uncontacted"
                type="checkbox"
                checked={showOnlyUncontacted}
                onChange={(event) =>
                  setShowOnlyUncontacted(
                    event.target.checked,
                  )
                }
                className="h-4 w-4 accent-brand"
              />

              <span className="font-sub text-[10px] uppercase tracking-[0.22em] text-ink">
                Only uncontacted
              </span>
            </label>

            <div className="relative">
              <label
                htmlFor="admin-search"
                className="sr-only"
              >
                Search leads
              </label>

              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
              />

              <input
                id="admin-search"
                data-testid="admin-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search name, phone, reference…"
                className="min-h-[44px] w-full border border-line bg-paper py-2 pl-9 pr-3 font-sub text-sm text-ink outline-none focus:border-brand sm:w-64"
              />
            </div>

            <button
              type="button"
              data-testid="admin-refresh"
              onClick={fetchLeads}
              disabled={loading}
              className="inline-flex min-h-[44px] items-center gap-2 border border-line px-3 py-2 font-sub text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:border-brand disabled:opacity-50"
            >
              <RefreshCcw size={13} /> Refresh
            </button>

            <button
              type="button"
              data-testid="admin-sign-out"
              onClick={handleSignOut}
              className="inline-flex min-h-[44px] items-center gap-2 border border-line px-3 py-2 font-sub text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:border-brand"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>

        {authError && (
          <p
            data-testid="admin-error"
            role="alert"
            className="mb-6 font-sub text-sm text-brand"
          >
            {authError}
          </p>
        )}

        <div className="overflow-x-auto border border-line bg-paper-2">
          <table
            data-testid="admin-leads-table"
            className="w-full font-sub text-sm"
          >
            <caption className="sr-only">
              Customer enquiries and newsletter
              signups
            </caption>

            <thead className="border-b border-line bg-paper">
              <tr className="text-left font-sub text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                <th
                  scope="col"
                  className="w-10 px-4 py-3"
                >
                  <span className="sr-only">
                    Expand row
                  </span>
                </th>

                <th scope="col" className="px-4 py-3">
                  Type
                </th>

                <th scope="col" className="px-4 py-3">
                  Name / email
                </th>

                <th scope="col" className="px-4 py-3">
                  Detail
                </th>

                <th scope="col" className="px-4 py-3">
                  Received
                </th>

                <th scope="col" className="px-4 py-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center font-sub text-[10px] uppercase tracking-[0.22em] text-ink-soft"
                  >
                    Loading…
                  </td>
                </tr>
              )}

              {!loading &&
                filteredLeads.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center font-sub text-[10px] uppercase tracking-[0.22em] text-ink-soft"
                    >
                      No leads match your filters.
                    </td>
                  </tr>
                )}

              {!loading &&
                filteredLeads.map((lead) => {
                  const isOpen = Boolean(
                    expanded[lead.id],
                  );

                  const isContacted = Boolean(
                    lead.contacted_at,
                  );

                  const expandable = [
                    'cart_enquiry',
                    'wholesale',
                    'contact',
                  ].includes(lead.type);

                  const isUpdating =
                    updatingLeadId === lead.id;

                  const phoneLink = lead.phone
                    ? whatsappHref(lead.phone)
                    : '';

                  return (
                    <Fragment key={lead.id}>
                      <tr
                        className={`align-top border-b border-line/60 ${
                          isContacted
                            ? 'opacity-60'
                            : ''
                        }`}
                      >
                        <td className="px-4 py-4">
                          {expandable ? (
                            <button
                              type="button"
                              data-testid={`admin-expand-${lead.id}`}
                              onClick={() =>
                                setExpanded(
                                  (current) => ({
                                    ...current,
                                    [lead.id]: !isOpen,
                                  }),
                                )
                              }
                              aria-expanded={isOpen}
                              aria-label={`${
                                isOpen
                                  ? 'Collapse'
                                  : 'Expand'
                              } details for ${
                                lead.name ??
                                lead.email ??
                                'this lead'
                              }`}
                              className="inline-flex h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-brand"
                            >
                              {isOpen ? (
                                <ChevronDown
                                  size={15}
                                />
                              ) : (
                                <ChevronRight
                                  size={15}
                                />
                              )}
                            </button>
                          ) : null}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-block border px-2 py-1 font-sub text-[10px] uppercase tracking-[0.22em] ${
                              lead.type ===
                              'cart_enquiry'
                                ? 'border-brand text-brand'
                                : lead.type ===
                                    'wholesale'
                                  ? 'border-gold-dark text-gold-dark'
                                  : lead.type ===
                                      'contact'
                                    ? 'border-ink text-ink'
                                    : 'border-line text-ink-soft'
                            }`}
                          >
                            {lead.type.replace(
                              '_',
                              ' ',
                            )}
                          </span>

                          {lead.order_ref && (
                            <p className="mt-2 font-sub text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                              {lead.order_ref}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-medium text-ink">
                            {lead.name ?? '—'}
                          </p>

                          {lead.email && (
                            <p className="mt-1 text-xs text-ink-soft">
                              {lead.email}
                            </p>
                          )}

                          {lead.phone && (
                            <p className="text-xs text-ink-soft">
                              {lead.phone}
                            </p>
                          )}

                          {lead.company && (
                            <p className="mt-1 text-xs italic text-ink-soft">
                              {lead.company}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-ink-soft">
                          {lead.type ===
                            'cart_enquiry' &&
                            lead.subtotal != null && (
                              <p className="font-heading italic text-brand">
                                {inr(
                                  lead.subtotal,
                                )}{' '}
                                ·{' '}
                                {lead.items
                                  ?.length ?? 0}{' '}
                                item
                                {(lead.items
                                  ?.length ?? 0) === 1
                                  ? ''
                                  : 's'}
                              </p>
                            )}

                          {lead.type ===
                            'newsletter' && (
                            <p>{lead.email}</p>
                          )}

                          {lead.type ===
                            'wholesale' &&
                            lead.city && (
                              <p>{lead.city}</p>
                            )}

                          {lead.type ===
                            'contact' &&
                            lead.message && (
                              <p className="line-clamp-2 max-w-md">
                                {lead.message}
                              </p>
                            )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-xs text-ink-soft">
                          {formatDate(
                            lead.created_at,
                          )}
                        </td>

                        <td className="px-4 py-4">
                          {lead.type !==
                          'newsletter' ? (
                            <button
                              type="button"
                              data-testid={`admin-toggle-contacted-${lead.id}`}
                              onClick={() =>
                                toggleContacted(lead)
                              }
                              disabled={isUpdating}
                              aria-pressed={
                                isContacted
                              }
                              className={`inline-flex min-h-[44px] items-center gap-2 border px-3 py-1.5 font-sub text-[10px] uppercase tracking-[0.22em] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                                isContacted
                                  ? 'border-brand bg-brand/[0.05] text-brand'
                                  : 'border-line text-ink hover:border-brand'
                              }`}
                            >
                              <Check size={12} />

                              {isContacted
                                ? 'Contacted'
                                : 'Mark contacted'}
                            </button>
                          ) : (
                            <span className="font-sub text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                              —
                            </span>
                          )}

                          {phoneLink && (
                            <a
                              href={phoneLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 font-sub text-[10px] uppercase tracking-[0.22em] text-ink-soft transition-colors hover:text-brand"
                            >
                              <MessageCircle
                                size={12}
                              />{' '}
                              WhatsApp
                            </a>
                          )}
                        </td>
                      </tr>

                      {expandable && isOpen && (
                        <tr
                          key={`${lead.id}-detail`}
                          className="border-b border-line/60 bg-paper"
                        >
                          <td
                            colSpan={6}
                            className="px-12 py-6"
                          >
                            {lead.type ===
                              'cart_enquiry' &&
                              lead.items && (
                                <div className="space-y-2">
                                  <p className="mb-3 font-sub text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                                    Bag
                                  </p>

                                  {lead.items.map(
                                    (item) => (
                                      <div
                                        key={`${lead.id}-${item.slug}-${item.mode}`}
                                        className="flex items-center justify-between border-b border-line/40 py-2 font-sub text-sm"
                                      >
                                        <span className="text-ink">
                                          {
                                            item.qty
                                          }{' '}
                                          ×{' '}
                                          <Link
                                            href={`/product/${encodeURIComponent(
                                              item.slug,
                                            )}`}
                                            className="transition-colors hover:text-brand"
                                          >
                                            {
                                              item.name
                                            }
                                          </Link>
                                          <span className="ml-2 text-xs uppercase tracking-wider text-ink-soft">
                                            {
                                              item.mode
                                            }
                                          </span>
                                        </span>

                                        <span className="text-ink">
                                          {inr(
                                            (item.price ??
                                              0) *
                                              item.qty,
                                          )}
                                        </span>
                                      </div>
                                    ),
                                  )}

                                  <div className="flex justify-between pt-3 font-heading text-lg italic text-brand">
                                    <span>
                                      Subtotal
                                    </span>

                                    <span>
                                      {inr(
                                        lead.subtotal ??
                                          0,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}

                            {lead.type ===
                              'wholesale' && (
                              <div className="space-y-2 font-sub text-sm text-ink">
                                {!!lead
                                  .interested_in
                                  ?.length && (
                                  <p>
                                    <span className="mr-2 font-sub text-[10px] uppercase tracking-[0.22em]
