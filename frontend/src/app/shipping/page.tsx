import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Marda & Sons',
  description: 'Shipping Policy for Marda & Sons Textiles, Solapur.',
};

const LAST_UPDATED = 'September 3, 2026';
const CONTACT_EMAIL = 'mardaandsons@gmail.com';
const CONTACT_PHONE = '+91 94224 60420';
const BUSINESS_ADDRESS = '430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra 413 001, India';

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-paper">
      <section className="mx-auto max-w-[1600px] px-6 pb-16 pt-32 md:px-12 lg:px-24">
        <p className="eyebrow mb-6 text-xs tracking-widest text-ink-soft">LEGAL · SHIPPING</p>
        <h1 className="mb-4 font-heading text-[clamp(3rem,8vw,7rem)] leading-none tracking-tighter text-ink">Shipping</h1>
        <h2 className="mb-8 font-heading text-[clamp(2rem,5vw,5rem)] italic leading-none tracking-tighter text-brand">Policy.</h2>
        <p className="font-body text-sm text-ink-soft">Last updated: {LAST_UPDATED}</p>
        <div className="gold-rule mt-8 h-px w-24" />
      </section>

      <section className="mx-auto max-w-[860px] space-y-10 px-6 pb-32 font-body leading-relaxed text-ink md:px-12 lg:px-24">
        <PolicySection title="1. Processing"><p>Orders and confirmed enquiries are processed after verification, subject to product availability. Any processing estimate shown on a product page, quotation, or checkout is an estimate and may change for customised, wholesale, or made-to-order requirements.</p></PolicySection>
        <PolicySection title="2. Delivery Coverage"><p>We generally ship to serviceable pin codes within India through available courier or transport partners. Some products, destinations, remote areas, or bulk orders may require a separate freight quotation or may not be serviceable.</p></PolicySection>
        <PolicySection title="3. Charges and Timelines"><p>Shipping or freight charges and the estimated delivery timeline will be communicated before order confirmation where applicable. Delivery may be affected by destination, courier capacity, public holidays, weather, strikes, incorrect address details, or other events outside our reasonable control.</p></PolicySection>
        <PolicySection title="4. Tracking and Delivery"><p>Tracking details may be shared by email, phone, WhatsApp, or the order page after dispatch. Please provide an accurate address and active contact number. Failed delivery caused by incorrect details, refusal, or repeated unavailable delivery attempts may lead to re-shipping charges or cancellation where permitted.</p></PolicySection>
        <PolicySection title="5. Damaged or Incomplete Parcels"><p>Inspect the package at delivery where possible. If it is visibly damaged, tampered with, or incomplete, photograph it and notify us immediately at <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline text-brand">{CONTACT_EMAIL}</a>. Keep the product and packaging available while the courier investigation is conducted.</p></PolicySection>
        <PolicySection title="6. Contact"><p>Marda &amp; Sons<br />{BUSINESS_ADDRESS}<br />Phone: {CONTACT_PHONE}<br />Email: <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline text-brand">{CONTACT_EMAIL}</a></p></PolicySection>
      </section>
    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h3 className="mb-3 font-sub text-xl text-ink">{title}</h3>{children}</div>;
}
