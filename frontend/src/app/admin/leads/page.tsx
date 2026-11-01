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

const TYPE_TABS: Array<{ key: TypeKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'cart_enquiry', label: 'Cart enquiries' },
  { key: 'contact', label: 'Contact' },
  { key: 'wholesale', label: 'Wholesale' },
  { key: 'newsletter', label: 'Newsletter' },
];

function formatDate(value?: string | null): string {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function isContacted(lead: AdminLead): boolean {
  return lead.contacted === true || Boolean(lead.contacted_at);
}

function isCartLead(lead: AdminLead): boolean {
  return lead.type === 'cart_enquiry' || lead.type === 'cart';
}

function removeStoredToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('[admin] Could not remove stored token:', error);
  }
}

function LeadDetails({ lead }: { lead: AdminLead }) {
  const items = lead.items ?? [];

  return (
    <div className="space-y-4 font-sub text-sm text-ink">
      {isCartLead(lead) && (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            Bag contents
          </p>

          {items.length === 0 && (
            <p className="text-ink-soft">
              No item details were provided.
            </p>
          )}

          {items.map((item, index) => {
            const lineTotal =
              typeof item.price === 'number'
                ? item.price * item.qty
                : null;

            return (
              <div
                key={`${item.slug}-${item.mode ?? 'retail'}-${index}`}
                className="flex flex-wrap justify-between gap-3 border-b border-line py-2"
              >
                <div>
                  <span>{item.qty} × </span>
                  <Link
                    href={`/product/${encodeURIComponent(item.slug)}`}
                    className="underline underline-offset-4 hover:text-brand"
                  >
                    {item.name}
                  </Link>
                  {item.mode && (
                    <span className="ml-2 text-xs text-ink-soft">
                      {item.mode}
                    </span>
                  )}
                </div>

                <span>{inr(lineTotal)}</span>
              </div>
            );
          })}

          <div className="flex justify-between pt-2 font-heading text-lg text-brand">
            <span>Recorded subtotal</span>
            <span>{inr(lead.subtotal)}</span>
          </div>
        </div>
      )}

      {lead.type === 'wholesale' && (
        <div className="space-y-2">
          {Boolean(lead.interested_in?.length) && (
            <p>
              <span className="text-ink-soft">Interested in: </span>
              {(lead.interested_in ?? []).join(', ')}
            </p>
          )}

          {lead.quantity_estimate && (
            <p>
              <span className="text-ink-soft">Quantity: </span>
              {lead.quantity_estimate}
            </p>
          )}

          {lead.city && (
            <p>
              <span className="text-ink-soft">Location: </span>
              {lead.city}
            </p>
          )}
        </div>
      )}

      {lead.message && (
        <p className="whitespace-pre-wrap break-words">
          {lead.message}
        </p>
      )}
    </div>
  );
}

export default function AdminLeadsPage() {
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState('');
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [stats, setStats] = useState<AdminCounts | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingLeadId, setUpdatingLeadId] = useState('');
  const [activeType, setActiveType] = useState<TypeKey>('all');
  const [onlyUncontacted, setOnlyUncontacted] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) setToken(storedToken);
    } catch (storageError) {
      console.error('[admin] Could not read stored token:', storageError);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const data = await getAdminLeads(token, {
        type: activeType === 'all' ? undefined : activeType,
        contacted: onlyUncontacted ? false : undefined,
      });

      if (!data) {
        throw new Error('Could not load leads. Please try again.');
      }

      setLeads(data.leads);
      setStats(data.stats);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not load leads. Please try again.',
      );

      const unauthorized =
        requestError instanceof ApiError &&
        (requestError.status === 401 || requestError.status === 403);

      if (unauthorized) {
        removeStoredToken();
        setToken('');
        setLeads([]);
        setStats(null);
      }
    } finally {
      setLoading(false);
    }
  }, [token, activeType, onlyUncontacted]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = tokenInput.trim();
    if (!value) return;

    try {
      localStorage.setItem(TOKEN_KEY, value);
    } catch (storageError) {
      console.error('[admin] Could not store token:', storageError);
    }

    setError('');
    setToken(value);
    setTokenInput('');
  }

  function handleSignOut() {
    removeStoredToken();
    setToken('');
    setTokenInput('');
    setLeads([]);
    setStats(null);
    setExpanded({});
    setError('');
  }

  async function toggleContacted(lead: AdminLead) {
    if (!token || updatingLeadId || loading) return;

    const next = !isContacted(lead);
    setUpdatingLeadId(lead.id);

    try {
      const result = await markLeadContacted(token, lead.id, next);

      if (result?.updated !== true) {
        throw new Error('The status update could not be confirmed.');
      }

      setLeads((current) =>
        current
          .map((item) =>
            item.id === lead.id
              ? {
                  ...item,
                  contacted: next,
                  contacted_at: next ? new Date().toISOString() : null,
                }
              : item,
          )
          .filter((item) => !onlyUncontacted || !isContacted(item)),
      );

      setStats((current) => {
        if (!current || current.uncontacted == null) return current;

        return {
          ...current,
          uncontacted: Math.max(
            0,
            current.uncontacted + (next ? -1 : 1),
          ),
        };
      });

      toast.success(
        next ? 'Lead marked as contacted.' : 'Lead marked as uncontacted.',
      );
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : 'Could not update this lead.',
      );
    } finally {
      setUpdatingLeadId('');
    }
  }

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return leads;

    return leads.filter((lead) =>
      [
        lead.name,
        lead.email,
        lead.phone,
        lead.message,
        lead.company,
        lead.city,
        lead.order_ref,
      ].some((value) => String(value ?? '').toLowerCase().includes(query)),
    );
  }, [leads, search]);

  const total = stats?.total ?? stats?.all;
  const uncontacted = stats?.uncontacted;

  const headline = (
    <>
      The <span className="italic text-brand">ledger.</span>
    </>
  );

  const buttonClass =
    'inline-flex min-h-[44px] items-center justify-center gap-2 border border-line px-3 py-2 font-sub text-sm text-ink transition-colors hover:border-brand disabled:cursor-not-allowed disabled:opacity-50';

  if (!token) {
    return (
      <div data-testid="admin-login" className="min-h-screen bg-paper">
        <PageHero
          chapter="09"
          eyebrow="Atelier desk · प्रशासन"
          marathi="ग्राहकांच्या नोंदी"
          headline={headline}
          lede="A private workspace for customer enquiries and newsletter signups."
          height="md"
        />

        <section className="mx-auto max-w-md px-6 pb-32">
          <form
            onSubmit={handleSignIn}
            className="border border-line bg-paper-2 p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <Lock size={16} aria-hidden="true" />
              <p className="font-sub text-sm text-ink">Admin access</p>
            </div>

            <label htmlFor="admin-token" className="block font-sub text-sm">
              Admin token
            </label>

            <input
              id="admin-token"
              data-testid="admin-token-input"
              type="password"
              autoComplete="current-password"
              required
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              className="mt-2 min-h-[44px] w-full border border-line bg-paper px-3 py-3 font-sub text-base text-ink"
            />

            <button
              data-testid="admin-sign-in"
              type="submit"
              disabled={!tokenInput.trim()}
              className="btn-primary mt-6 w-full justify-center disabled:opacity-40"
            >
              <ShieldCheck size={15} aria-hidden="true" />
              Enter the ledger
              <ArrowRight size={15} aria-hidden="true" />
            </button>

            {error && (
              <p
                data-testid="admin-auth-error"
                role="alert"
                className="mt-4 font-sub text-sm text-brand"
              >
                {error}
              </p>
            )}

            <p className="mt-6 font-sub text-xs leading-relaxed text-ink-soft">
              Use the admin token configured for your backend.
              Sign out when using a shared device.
            </p>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div data-testid="admin-leads-page" className="min-h-screen bg-paper">
      <PageHero
        chapter="09"
        eyebrow="Atelier desk · प्रशासन"
        marathi="ग्राहकांच्या नोंदी"
        headline={headline}
        height="md"
      />

      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-16">
        <p className="mb-6 font-sub text-sm text-ink-soft">
          Total: {total ?? '—'} · Uncontacted: {uncontacted ?? '—'}
        </p>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Filter by enquiry type"
            className="flex flex-wrap gap-2"
          >
            {TYPE_TABS.map((tab) => {
              const active = activeType === tab.key;
              const count =
                tab.key === 'all' ? total : stats?.[tab.key];

              return (
                <button
                  key={tab.key}
                  type="button"
                  data-testid={`admin-tab-${tab.key}`}
                  aria-pressed={active}
                  disabled={Boolean(updatingLeadId)}
                  onClick={() => setActiveType(tab.key)}
                  className={`${buttonClass} ${active ? 'border-brand text-brand' : ''}`}
                >
                  {tab.label}
                  {count != null && <span>({count})</span>}
                </button>
              );
            })}
          </div>

          <label className="inline-flex min-h-[44px] items-center gap-2 font-sub text-sm">
            <input
              data-testid="admin-only-uncontacted"
              type="checkbox"
              checked={onlyUncontacted}
              disabled={Boolean(updatingLeadId)}
              onChange={(event) => setOnlyUncontacted(event.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            Only uncontacted
          </label>

          <div className="relative">
            <label htmlFor="admin-search" className="sr-only">
              Search leads
            </label>
            <Search
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              id="admin-search"
              data-testid="admin-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, phone, reference…"
              className="min-h-[44px] w-full border border-line bg-paper py-2 pl-9 pr-3 font-sub text-base text-ink sm:w-64"
            />
          </div>

          <button
            type="button"
            data-testid="admin-refresh"
            onClick={() => void fetchLeads()}
            disabled={loading || Boolean(updatingLeadId)}
            className={buttonClass}
          >
            <RefreshCcw size={14} aria-hidden="true" />
            Refresh
          </button>

          <button
            type="button"
            data-testid="admin-sign-out"
            onClick={handleSignOut}
            disabled={loading || Boolean(updatingLeadId)}
            className={buttonClass}
          >
            <LogOut size={14} aria-hidden="true" />
            Sign out
          </button>
        </div>

        {error && (
          <p
            data-testid="admin-error"
            role="alert"
            className="mb-6 font-sub text-sm text-brand"
          >
            {error}
          </p>
        )}

        <div className="overflow-x-auto border border-line bg-paper-2">
          <table
            data-testid="admin-leads-table"
            aria-busy={loading}
            className="w-full text-left font-sub text-sm"
          >
            <caption className="sr-only">
              Customer enquiries and newsletter signups
            </caption>

            <thead className="border-b border-line bg-paper">
              <tr>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Details</span>
                </th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Customer</th>
                <th scope="col" className="px-4 py-3">Detail</th>
                <th scope="col" className="px-4 py-3">Received</th>
                <th scope="col" className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    Loading leads…
                  </td>
                </tr>
              )}

              {!loading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    {error
                      ? 'Leads could not be loaded. Try Refresh.'
                      : 'No leads match your filters.'}
                  </td>
                </tr>
              )}

              {!loading && filteredLeads.map((lead) => {
                const open = Boolean(expanded[lead.id]);
                const contacted = isContacted(lead);
                const expandable = lead.type !== 'newsletter';
                const phoneDigits = (lead.phone ?? '').replace(/\D/g, '');
                const itemCount = lead.items?.length ?? 0;

                return (
                  <Fragment key={lead.id}>
                    <tr className="border-b border-line align-top">
                      <td className="px-4 py-4">
                        {expandable && (
                          <button
                            type="button"
                            data-testid={`admin-expand-${lead.id}`}
                            aria-expanded={open}
                            aria-label={`${open ? 'Collapse' : 'Expand'} lead details`}
                            onClick={() =>
                              setExpanded((current) => ({
                                ...current,
                                [lead.id]: !current[lead.id],
                              }))
                            }
                            className="inline-flex h-11 w-11 items-center justify-center"
                          >
                            {open
                              ? <ChevronDown size={16} />
                              : <ChevronRight size={16} />}
                          </button>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <p className="capitalize">
                          {lead.type.replace(/_/g, ' ')}
                        </p>
                        {lead.order_ref && (
                          <p className="mt-2 text-xs text-ink-soft">
                            {lead.order_ref}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium">{lead.name || '—'}</p>
                        {lead.email && <p className="mt-1">{lead.email}</p>}
                        {lead.phone && <p className="mt-1">{lead.phone}</p>}
                        {lead.company && (
                          <p className="mt-1 text-ink-soft">{lead.company}</p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-ink-soft">
                        {isCartLead(lead) && (
                          <p>
                            {inr(lead.subtotal)} · {itemCount} items
                          </p>
                        )}
                        {lead.type === 'newsletter' && <p>{lead.email}</p>}
                        {lead.type === 'wholesale' && <p>{lead.city || '—'}</p>}
                        {lead.type === 'contact' && (
                          <p className="line-clamp-2 max-w-md">{lead.message}</p>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs">
                        {formatDate(lead.created_at)}
                      </td>

                      <td className="px-4 py-4">
                        {lead.type !== 'newsletter' && (
                          <button
                            type="button"
                            data-testid={`admin-toggle-contacted-${lead.id}`}
                            aria-pressed={contacted}
                            disabled={Boolean(updatingLeadId)}
                            onClick={() => void toggleContacted(lead)}
                            className={buttonClass}
                          >
                            <Check size={14} aria-hidden="true" />
                            {updatingLeadId === lead.id
                              ? 'Updating…'
                              : contacted
                                ? 'Contacted'
                                : 'Mark contacted'}
                          </button>
                        )}

                        {phoneDigits && (
                          <a
                            href={`https://wa.me/${phoneDigits}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 flex min-h-[44px] items-center gap-2 text-ink-soft hover:text-brand"
                          >
                            <MessageCircle size={14} aria-hidden="true" />
                            WhatsApp
                          </a>
                        )}
                      </td>
                    </tr>

                    {expandable && open && (
                      <tr className="border-b border-line bg-paper">
                        <td colSpan={6} className="px-6 py-6 md:px-12">
                          <LeadDetails lead={lead} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
