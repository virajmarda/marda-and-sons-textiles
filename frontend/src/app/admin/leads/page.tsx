'use client';

import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';
import Link from 'next/link';
import {
  Check, ChevronDown, ChevronRight, LogOut, RefreshCcw, Search, ShieldCheck, Lock, MessageCircle, ArrowRight,
} from 'lucide-react';
import {
  getAdminLeads, markLeadContacted, type AdminLead, type AdminCounts, inr,
} from '@/lib/api';
import { PageHero } from '@/components/page-hero';

const TOKEN_KEY = 'marda_admin_token_v1';

type TypeKey = 'all' | 'cart_enquiry' | 'contact' | 'wholesale' | 'newsletter';

const TYPE_TABS: Array<{ key: TypeKey; label: string }> = [
  { key: 'all',          label: 'All' },
  { key: 'cart_enquiry', label: 'Cart enquiries' },
  { key: 'contact',      label: 'Contact' },
  { key: 'wholesale',    label: 'Wholesale' },
  { key: 'newsletter',   label: 'Newsletter' },
];

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminLeadsPage() {
  const [token, setToken] = useState<string>('');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [counts, setCounts] = useState<AdminCounts | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeType, setActiveType] = useState<TypeKey>('all');
  const [showOnlyUncontacted, setShowOnlyUncontacted] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // ---- Hydrate token from localStorage on mount ----
  useEffect(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      if (t) setToken(t);
    } catch (error) {
      console.error('[admin] token hydrate failed:', error);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setAuthError('');
    try {
      const data = await getAdminLeads(token, {
        type: activeType === 'all' ? undefined : activeType,
        contacted: showOnlyUncontacted ? false : undefined,
      });
      setLeads(data.leads);
      setCounts(data.counts);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Fetch failed';
      setAuthError(msg);
      if (msg.toLowerCase().includes('invalid')) {
        try { localStorage.removeItem(TOKEN_KEY); } catch (e) { console.error(e); }
        setToken('');
      }
    } finally {
      setLoading(false);
    }
  }, [token, activeType, showOnlyUncontacted]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const t = tokenInput.trim();
    if (!t) return;
    try { localStorage.setItem(TOKEN_KEY, t); } catch (error) { console.error(error); }
    setToken(t);
    setTokenInput('');
  }

  function handleSignOut() {
    try { localStorage.removeItem(TOKEN_KEY); } catch (error) { console.error(error); }
    setToken('');
    setLeads([]);
    setCounts(null);
  }

  async function toggleContacted(lead: AdminLead) {
    if (!token) return;
    const next = !lead.contacted_at;
    // optimistic
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, contacted_at: next ? new Date().toISOString() : null } : l));
    try {
      await markLeadContacted(token, lead.id, next);
    } catch (error) {
      console.error('[admin] toggleContacted failed:', error);
      // revert
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, contacted_at: lead.contacted_at } : l));
    }
  }

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return leads;
    return leads.filter((l) =>
      [l.name, l.email, l.phone, l.message, l.company, l.city, l.order_ref]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  }, [leads, search]);

  // ---- Login screen ----
  if (!token) {
    return (
      <div data-testid="admin-login" className="bg-paper min-h-screen">
        <PageHero
          chapter="09"
          eyebrow="Atelier desk · प्रशासन"
          marathi="ग्राहकांच्या नोंदी"
          headline={<>The <span className="italic text-brand">ledger.</span></>}
          lede={<>A private workspace for the shop. Read every cart enquiry, contact request, wholesale lead, and newsletter signup — and mark each one as you reach out.</>}
          height="md"
        />
        <section className="max-w-md mx-auto px-6 pb-32">
          <form onSubmit={handleSignIn} className="border border-line p-8 bg-paper-2">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={16} className="text-brand" />
              <p className="eyebrow text-ink">Admin access</p>
            </div>
            <label className="block">
              <span className="eyebrow text-ink-soft">Admin token</span>
              <input
                data-testid="admin-token-input"
                type="password"
                autoFocus
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="enter your admin token"
                className="mt-2 w-full bg-paper border border-line px-3 py-2.5 font-sub text-ink outline-none focus:border-brand"
              />
            </label>
            <button
              data-testid="admin-sign-in"
              type="submit"
              disabled={!tokenInput.trim()}
              className="btn-primary w-full justify-center mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShieldCheck size={14} /> Enter the ledger <ArrowRight size={14} />
            </button>
            {authError && (
              <p data-testid="admin-auth-error" className="text-[11px] uppercase tracking-[0.22em] text-brand mt-4">
                {authError}
              </p>
            )}
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft mt-6 leading-relaxed">
              The token lives on the server in <code className="font-mono normal-case tracking-normal">ADMIN_TOKEN</code>.
            </p>
          </form>
        </section>
      </div>
    );
  }

  // ---- Authenticated workspace ----
  return (
    <div data-testid="admin-leads-page" className="bg-paper min-h-screen">
      <PageHero
        chapter="09"
        eyebrow="Atelier desk · प्रशासन"
        marathi={counts ? `एकूण ${counts.all} नोंदी · ${counts.uncontacted} बाकी` : 'ग्राहकांच्या नोंदी'}
        headline={<>The <span className="italic text-brand">ledger.</span></>}
        height="md"
      />

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pb-32">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {TYPE_TABS.map((tab) => {
              const isActive = activeType === tab.key;
              const count = counts ? (tab.key === 'all' ? counts.all : counts[tab.key as keyof AdminCounts]) : null;
              return (
                <button
                  key={tab.key}
                  data-testid={`admin-tab-${tab.key}`}
                  onClick={() => setActiveType(tab.key)}
                  className={`px-4 py-2 eyebrow text-[10px] border transition-colors ${
                    isActive
                      ? 'border-brand text-brand bg-brand/[0.05]'
                      : 'border-line text-ink hover:border-brand'
                  }`}
                >
                  {tab.label}
                  {count != null && <span className="ml-2 text-ink-soft">{count}</span>}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                data-testid="admin-only-uncontacted"
                type="checkbox"
                checked={showOnlyUncontacted}
                onChange={(e) => setShowOnlyUncontacted(e.target.checked)}
                className="accent-brand"
              />
              <span className="eyebrow text-[10px] text-ink">Only uncontacted</span>
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none" />
              <input
                data-testid="admin-search"
                type="search"
                placeholder="Search name, phone, ref…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 border border-line bg-paper text-sm font-sub text-ink outline-none focus:border-brand"
              />
            </div>
            <button
              data-testid="admin-refresh"
              onClick={fetchLeads}
              className="inline-flex items-center gap-2 border border-line px-3 py-2 eyebrow text-[10px] text-ink hover:border-brand"
            >
              <RefreshCcw size={12} /> Refresh
            </button>
            <button
              data-testid="admin-sign-out"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 border border-line px-3 py-2 eyebrow text-[10px] text-ink hover:border-brand"
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>

        {authError && (
          <p data-testid="admin-error" className="text-sm text-brand font-sub mb-6">{authError}</p>
        )}

        {/* Table */}
        <div className="border border-line bg-paper-2 overflow-x-auto">
          <table data-testid="admin-leads-table" className="w-full text-sm font-sub">
            <thead className="bg-paper border-b border-line">
              <tr className="text-left text-ink-soft eyebrow text-[10px]">
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Name / Email</th>
                <th className="px-4 py-3">Detail</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-ink-soft eyebrow text-[10px]">Loading…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-ink-soft eyebrow text-[10px]">No leads match your filters.</td></tr>
              )}
              {!loading && filtered.map((lead) => {
                const isOpen = !!expanded[lead.id];
                const isContacted = !!lead.contacted_at;
                const expandable = lead.type === 'cart_enquiry' || lead.type === 'wholesale' || lead.type === 'contact';
                return (
                  <Fragment key={lead.id}>
                    <tr className={`border-b border-line/60 align-top ${isContacted ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-4">
                        {expandable ? (
                          <button
                            data-testid={`admin-expand-${lead.id}`}
                            onClick={() => setExpanded((s) => ({ ...s, [lead.id]: !isOpen }))}
                            className="text-ink-soft hover:text-brand"
                            aria-label="Expand"
                          >
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`eyebrow text-[10px] inline-block px-2 py-1 border ${
                          lead.type === 'cart_enquiry' ? 'border-brand text-brand' :
                          lead.type === 'wholesale'    ? 'border-gold-dark text-gold-dark' :
                          lead.type === 'contact'      ? 'border-ink text-ink' :
                                                         'border-line text-ink-soft'
                        }`}>
                          {lead.type.replace('_', ' ')}
                        </span>
                        {lead.order_ref && (
                          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                            {lead.order_ref}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-ink font-medium">{lead.name || '—'}</p>
                        {lead.email && <p className="text-ink-soft text-xs mt-1">{lead.email}</p>}
                        {lead.phone && <p className="text-ink-soft text-xs">{lead.phone}</p>}
                        {lead.company && <p className="text-ink-soft text-xs mt-1 italic">{lead.company}</p>}
                      </td>
                      <td className="px-4 py-4 text-ink-soft">
                        {lead.type === 'cart_enquiry' && lead.subtotal != null && (
                          <p className="text-brand font-heading italic">{inr(lead.subtotal)} · {lead.items?.length ?? 0} item{(lead.items?.length ?? 0) === 1 ? '' : 's'}</p>
                        )}
                        {lead.type === 'newsletter' && <p>{lead.email}</p>}
                        {lead.type === 'wholesale' && lead.city && <p>{lead.city}</p>}
                        {lead.type === 'contact' && lead.message && (
                          <p className="line-clamp-2 max-w-md">{lead.message}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-ink-soft text-xs whitespace-nowrap">{formatDate(lead.created_at)}</td>
                      <td className="px-4 py-4">
                        {lead.type !== 'newsletter' ? (
                          <button
                            data-testid={`admin-toggle-contacted-${lead.id}`}
                            onClick={() => toggleContacted(lead)}
                            className={`inline-flex items-center gap-2 eyebrow text-[10px] px-3 py-1.5 border transition-colors ${
                              isContacted
                                ? 'border-brand text-brand bg-brand/[0.05]'
                                : 'border-line text-ink hover:border-brand'
                            }`}
                          >
                            <Check size={11} /> {isContacted ? 'Contacted' : 'Mark contacted'}
                          </button>
                        ) : (
                          <span className="eyebrow text-[10px] text-ink-soft">—</span>
                        )}
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-ink-soft hover:text-brand"
                          >
                            <MessageCircle size={11} /> WhatsApp
                          </a>
                        )}
                      </td>
                    </tr>
                    {expandable && isOpen && (
                      <tr key={`${lead.id}-detail`} className="border-b border-line/60 bg-paper">
                        <td colSpan={6} className="px-12 py-6">
                          {lead.type === 'cart_enquiry' && lead.items && (
                            <div className="space-y-2">
                              <p className="eyebrow text-[10px] text-ink-soft mb-3">Bag</p>
                              {lead.items.map((it) => (
                                <div key={`${lead.id}-${it.slug}-${it.mode}`} className="flex justify-between items-center text-sm font-sub border-b border-line/40 py-2">
                                  <span className="text-ink">
                                    {it.qty} × <Link href={`/product/${it.slug}`} className="hover:text-brand">{it.name}</Link>
                                    <span className="text-ink-soft ml-2 text-xs uppercase tracking-wider">{it.mode}</span>
                                  </span>
                                  <span className="text-ink">{inr(it.price * it.qty)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between text-brand font-heading italic text-lg pt-3">
                                <span>Subtotal</span>
                                <span>{inr(lead.subtotal ?? 0)}</span>
                              </div>
                            </div>
                          )}
                          {lead.type === 'wholesale' && (
                            <div className="space-y-2 text-sm font-sub text-ink">
                              {lead.interested_in && lead.interested_in.length > 0 && (
                                <p><span className="eyebrow text-[10px] text-ink-soft mr-2">Interested in</span> {lead.interested_in.join(', ')}</p>
                              )}
                              {lead.quantity_estimate && (
                                <p><span className="eyebrow text-[10px] text-ink-soft mr-2">Volume</span> {lead.quantity_estimate}</p>
                              )}
                              {lead.message && <p className="mt-3 text-ink-soft italic">“{lead.message}”</p>}
                            </div>
                          )}
                          {lead.type === 'contact' && lead.message && (
                            <p className="text-ink font-sub whitespace-pre-line">{lead.message}</p>
                          )}
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
