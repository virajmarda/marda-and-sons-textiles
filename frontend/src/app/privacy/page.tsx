import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Marda & Sons Textiles, Solapur.',
};

const LAST_UPDATED = 'July 17, 2026';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-paper">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
        <p className="eyebrow text-ink-soft text-xs tracking-widest mb-6">LEGAL &middot; গोपनीयता</p>
        <h1 className="font-heading text-[clamp(3rem,8vw,7rem)] leading-none tracking-tighter text-ink mb-4">
          Privacy
        </h1>
        <h2 className="font-heading italic text-[clamp(2rem,5vw,5rem)] leading-none tracking-tighter text-brand mb-8">
          Policy.
        </h2>
        <p className="font-body text-ink-soft text-sm">Last updated: {LAST_UPDATED}</p>
        <div className="gold-rule w-24 h-px mt-8" />
      </section>

      {/* Content */}
      <section className="px-6 md:px-12 lg:px-24 max-w-[860px] mx-auto pb-32 space-y-10 font-body text-ink leading-relaxed">

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">1. Who We Are</h3>
          <p>Marda &amp; Sons (“we”, “us”, “our”) is a family-owned textile business established in 1970, headquartered at 430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra 413 001, India. We operate the website <strong>marda-and-sons-textiles.vercel.app</strong> (the “Site”).</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">2. Information We Collect</h3>
          <ul className="list-disc pl-6 space-y-2 text-ink-soft">
            <li><strong>Contact information</strong> — name, phone number, email address, and city when you fill our contact or wholesale enquiry forms.</li>
            <li><strong>Order enquiry data</strong> — product names, quantities, and preferred mode (retail / wholesale) when you submit a cart enquiry.</li>
            <li><strong>Newsletter subscription</strong> — email address when you subscribe to our newsletter.</li>
            <li><strong>Usage data</strong> — pages visited, time spent, and referral source via standard server logs. We do not use third-party analytics trackers.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">3. How We Use Your Information</h3>
          <ul className="list-disc pl-6 space-y-2 text-ink-soft">
            <li>To respond to your enquiries via WhatsApp or email within 24 hours.</li>
            <li>To send product price lists, fabric swatches, or order confirmations.</li>
            <li>To send our monthly heritage newsletter (only if you subscribed).</li>
            <li>To improve our website and product offerings.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">4. Data Sharing</h3>
          <p className="text-ink-soft">We do not sell, rent, or share your personal data with third parties for marketing purposes. We may share data only with service providers strictly necessary to operate our business (e.g., hosting, email delivery), all bound by confidentiality agreements.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">5. Data Retention</h3>
          <p className="text-ink-soft">Enquiry and lead data is retained for up to 2 years to support follow-up and order history. Newsletter subscriptions are retained until you unsubscribe. You may request deletion at any time by contacting us.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">6. Cookies</h3>
          <p className="text-ink-soft">We use only functional cookies essential for cart and wishlist persistence (stored in your browser's localStorage). We do not use advertising or tracking cookies.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">7. Your Rights</h3>
          <p className="text-ink-soft">Under the Information Technology Act 2000 and the Digital Personal Data Protection Act 2023 (India), you have the right to access, correct, or request deletion of your personal data. Contact us at <a href="mailto:mardaandsons@gmail.com" className="link-underline text-brand">mardaandsons@gmail.com</a>.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">8. Contact</h3>
          <p className="text-ink-soft">Marda &amp; Sons &mdash; 430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra 413 001<br />Phone: +91 94224 60420<br />Email: mardaandsons@gmail.com</p>
        </div>

      </section>
    </main>
  );
}
