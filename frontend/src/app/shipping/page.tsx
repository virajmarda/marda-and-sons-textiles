import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Shipping and delivery information for Marda & Sons Textiles orders across India.',
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-paper">
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
        <p className="eyebrow text-ink-soft text-xs tracking-widest mb-6">LEGAL &middot; डिलिव्हरी</p>
        <h1 className="font-heading text-[clamp(3rem,8vw,7rem)] leading-none tracking-tighter text-ink mb-4">
          Shipping
        </h1>
        <h2 className="font-heading italic text-[clamp(2rem,5vw,5rem)] leading-none tracking-tighter text-brand mb-8">
          Policy.
        </h2>
        <div className="gold-rule w-24 h-px mt-8" />
      </section>

      <section className="px-6 md:px-12 lg:px-24 max-w-[860px] mx-auto pb-32 space-y-10 font-body text-ink leading-relaxed">

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">1. Order Processing</h3>
          <p className="text-ink-soft">All orders placed via cart enquiry or WhatsApp are processed within <strong>1–2 business days</strong> after confirmation. Orders are dispatched from our warehouse at 430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">2. Shipping Coverage</h3>
          <p className="text-ink-soft">We deliver <strong>pan-India</strong> to all states and union territories. For international orders (Gulf, UK, USA, Australia), please contact us directly on WhatsApp at +91 94224 60420 for a custom quote including export documentation support.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">3. Estimated Delivery Times</h3>
          <ul className="list-disc pl-6 space-y-2 text-ink-soft">
            <li><strong>Solapur &amp; nearby districts:</strong> 1–2 business days</li>
            <li><strong>Maharashtra (other cities):</strong> 2–4 business days</li>
            <li><strong>Metro cities (Mumbai, Pune, Delhi, Bangalore, Chennai, Hyderabad):</strong> 3–5 business days</li>
            <li><strong>Rest of India:</strong> 5–8 business days</li>
            <li><strong>North-East &amp; remote areas:</strong> 7–12 business days</li>
          </ul>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">4. Shipping Charges</h3>
          <ul className="list-disc pl-6 space-y-2 text-ink-soft">
            <li><strong>Orders above ₹2,000:</strong> Free shipping across India.</li>
            <li><strong>Orders below ₹2,000:</strong> A flat shipping fee of ₹99 applies.</li>
            <li><strong>Wholesale orders (50+ pieces):</strong> Shipping negotiated as part of the bulk quote. Typically complimentary for orders above ₹20,000.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">5. Tracking</h3>
          <p className="text-ink-soft">Once your order is dispatched, you will receive a tracking number via WhatsApp or email. We partner with reputed courier services including DTDC, Blue Dart, and India Post for domestic delivery.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">6. Damaged or Lost Shipments</h3>
          <p className="text-ink-soft">If your order arrives damaged or does not arrive within the estimated delivery window, please contact us within <strong>48 hours of the expected delivery date</strong> at +91 94224 60420 or mardaandsons@gmail.com. We will arrange a replacement or refund as applicable.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">7. Contact</h3>
          <p className="text-ink-soft">For all shipping queries, reach us on WhatsApp at <strong>+91 94224 60420</strong> (Mon–Sat, 10 AM–8:30 PM IST) or email mardaandsons@gmail.com.</p>
        </div>

      </section>
    </main>
  );
}
