import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds | Marda & Sons',
  description: 'Returns and Refunds Policy for Marda & Sons Textiles, Solapur.',
};

const LAST_UPDATED = 'September 3, 2026';
const CONTACT_EMAIL = 'mardaandsons@gmail.com';
const CONTACT_PHONE = '+91 94224 60420';
const BUSINESS_ADDRESS = '430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra 413 001, India';

export default function ReturnsRefundsPage() {
  return (
    <main className="min-h-screen bg-paper">
      <section className="mx-auto max-w-[1600px] px-6 pb-16 pt-32 md:px-12 lg:px-24">
        <p className="eyebrow mb-6 text-xs tracking-widest text-ink-soft">LEGAL · RETURNS</p>
        <h1 className="mb-4 font-heading text-[clamp(3rem,8vw,7rem)] leading-none tracking-tighter text-ink">Returns</h1>
        <h2 className="mb-8 font-heading text-[clamp(2rem,5vw,5rem)] italic leading-none tracking-tighter text-brand">&amp; Refunds.</h2>
        <p className="font-body text-sm text-ink-soft">Last updated: {LAST_UPDATED}</p>
        <div className="gold-rule mt-8 h-px w-24" />
      </section>

      <section className="mx-auto max-w-[860px] space-y-10 px-6 pb-32 font-body leading-relaxed text-ink md:px-12 lg:px-24">
        <PolicySection title="1. Our Commitment"><p>We aim to supply carefully checked textile products. If an item is damaged, defective, incorrect, or materially different from its description, contact us promptly so we can investigate and offer the appropriate remedy.</p></PolicySection>
        <PolicySection title="2. Reporting a Problem"><p>Contact <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline text-brand">{CONTACT_EMAIL}</a> or {CONTACT_PHONE} within <strong>48 hours of delivery</strong>. Include your order or enquiry reference, a description of the issue, and clear photographs or an unboxing video where available. Do not discard the packaging until the matter is resolved.</p></PolicySection>
        <PolicySection title="3. Eligibility"><p>Approved returns should be unused, unwashed, unaltered, and in the condition received, with packaging, labels, and accessories where applicable. Custom-cut, customised, clearance, sale, hygiene-sensitive, or specially sourced products may be non-returnable when clearly disclosed before purchase, except where applicable law requires otherwise.</p></PolicySection>
        <PolicySection title="4. Resolution"><p>After review, Marda &amp; Sons may arrange replacement, exchange, repair, store credit, or refund depending on the product, stock availability, and reason for return. Approval is not automatic merely because a return request is submitted.</p></PolicySection>
        <PolicySection title="5. Refunds"><p>For an approved refund, the amount will generally be returned to the original payment method after the product is received and inspected, where inspection is necessary. Bank, payment-gateway, and logistics processing times may vary. Any legally required refund will not be excluded by this policy.</p></PolicySection>
        <PolicySection title="6. Return Shipping"><p>Where the issue is our error, transit damage, or a verified defect, we will bear reasonable return shipping costs or arrange pickup where feasible. For discretionary returns, any applicable return shipping or restocking charge will be disclosed before approval.</p></PolicySection>
        <PolicySection title="7. Contact"><p>Marda &amp; Sons<br />{BUSINESS_ADDRESS}<br />Phone: {CONTACT_PHONE}<br />Email: <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline text-brand">{CONTACT_EMAIL}</a></p></PolicySection>
      </section>
    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h3 className="mb-3 font-sub text-xl text-ink">{title}</h3>{children}</div>;
}
