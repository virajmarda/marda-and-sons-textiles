import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Marda & Sons',
  description: 'Privacy Policy for Marda & Sons Textiles, Solapur.',
};

const LAST_UPDATED = 'September 3, 2026';
const CONTACT_EMAIL = 'mardaandsons@gmail.com';
const CONTACT_PHONE = '+91 94224 60420';
const BUSINESS_ADDRESS = '430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra 413 001, India';
const WEBSITE = 'mardaandsons.vercel.app';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-paper">
      <section className="mx-auto max-w-[1600px] px-6 pb-16 pt-32 md:px-12 lg:px-24">
        <p className="eyebrow mb-6 text-xs tracking-widest text-ink-soft">LEGAL · गोपनीयता</p>
        <h1 className="mb-4 font-heading text-[clamp(3rem,8vw,7rem)] leading-none tracking-tighter text-ink">Privacy</h1>
        <h2 className="mb-8 font-heading text-[clamp(2rem,5vw,5rem)] italic leading-none tracking-tighter text-brand">Policy.</h2>
        <p className="font-body text-sm text-ink-soft">Last updated: {LAST_UPDATED}</p>
        <div className="gold-rule mt-8 h-px w-24" />
      </section>

      <section className="mx-auto max-w-[860px] space-y-10 px-6 pb-32 font-body leading-relaxed text-ink md:px-12 lg:px-24">
        <PolicySection title="1. Who We Are">
          <p>Marda &amp; Sons ("we", "us", "our") is a family-owned textile business established in 1970, headquartered at {BUSINESS_ADDRESS}. We operate <strong>{WEBSITE}</strong> (the "Site").</p>
        </PolicySection>

        <PolicySection title="2. Information We Collect">
          <ul className="list-disc space-y-2 pl-6 text-ink-soft">
            <li><strong>Contact information:</strong> name, phone number, email address, and city.</li>
            <li><strong>Enquiry information:</strong> products, quantities, and retail or wholesale preferences.</li>
            <li><strong>Newsletter information:</strong> email address when you subscribe.</li>
            <li><strong>Technical information:</strong> pages visited, referral source, browser, and server-log information.</li>
          </ul>
        </PolicySection>

        <PolicySection title="3. How We Use Information">
          <ul className="list-disc space-y-2 pl-6 text-ink-soft">
            <li>To respond to enquiries and provide quotations, swatches, or product information.</li>
            <li>To process and support orders, including confirmations, delivery, returns, and refunds.</li>
            <li>To send newsletters only where you have subscribed, with an unsubscribe option.</li>
            <li>To secure, maintain, and improve the Site and comply with applicable law.</li>
          </ul>
        </PolicySection>

        <PolicySection title="4. Data Sharing">
          <p className="text-ink-soft">We do not sell personal data. We may disclose limited information to providers needed to operate the business, including hosting, email, payment, logistics, customer-support, accounting, and professional-service providers, or to authorities where legally required.</p>
        </PolicySection>

        <PolicySection title="5. Retention and Security">
          <p className="text-ink-soft">We retain information only for as long as reasonably necessary for enquiries, order history, customer support, fraud prevention, dispute resolution, tax, accounting, and legal obligations. Reasonable technical and organisational safeguards are used, although no internet transmission or storage system is completely secure.</p>
        </PolicySection>

        <PolicySection title="6. Cookies and Local Storage">
          <p className="text-ink-soft">The Site may use functional browser storage, including localStorage, for features such as cart or wishlist persistence. These are distinct from cookies. If analytics, advertising, payment, or other third-party technologies are added, this policy should be updated before they are activated.</p>
        </PolicySection>

        <PolicySection title="7. Your Requests">
          <p className="text-ink-soft">You may contact us to request access to, correction of, or deletion of personal information, or to withdraw a consent-based subscription. Requests are subject to applicable law, identity verification, and records that must be retained for legal or business purposes.</p>
        </PolicySection>

        <PolicySection title="8. Contact">
          <p className="text-ink-soft">Marda &amp; Sons<br />{BUSINESS_ADDRESS}<br />Phone: {CONTACT_PHONE}<br />Email: <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline text-brand">{CONTACT_EMAIL}</a></p>
        </PolicySection>
      </section>
    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 font-sub text-xl text-ink">{title}</h3>
      {children}
    </div>
  );
}
