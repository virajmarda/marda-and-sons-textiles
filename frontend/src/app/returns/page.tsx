import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'Return and refund policy for Marda & Sons Textiles. Hassle-free returns within 7 days.',
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-paper">
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
        <p className="eyebrow text-ink-soft text-xs tracking-widest mb-6">LEGAL &middot; परतावा</p>
        <h1 className="font-heading text-[clamp(3rem,8vw,7rem)] leading-none tracking-tighter text-ink mb-4">
          Returns &amp;
        </h1>
        <h2 className="font-heading italic text-[clamp(2rem,5vw,5rem)] leading-none tracking-tighter text-brand mb-8">
          Refunds.
        </h2>
        <div className="gold-rule w-24 h-px mt-8" />
      </section>

      <section className="px-6 md:px-12 lg:px-24 max-w-[860px] mx-auto pb-32 space-y-10 font-body text-ink leading-relaxed">

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">1. Our Promise</h3>
          <p className="text-ink-soft">At Marda &amp; Sons, every textile leaves our store with pride. If for any reason your order does not meet your expectations, we are here to make it right. Your trust is worth more than any single sale.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">2. Return Window</h3>
          <p className="text-ink-soft">You may request a return within <strong>7 days of delivery</strong> for retail orders. For wholesale orders, returns must be raised within <strong>48 hours of receipt</strong> and are limited to manufacturing defects or incorrect items dispatched.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">3. Eligible Return Conditions</h3>
          <ul className="list-disc pl-6 space-y-2 text-ink-soft">
            <li>Item received is damaged, defective, or has a manufacturing fault (weave defect, torn seam, incorrect GSM).</li>
            <li>Wrong item or size was dispatched compared to your confirmed order.</li>
            <li>Item is significantly different from the product described on the website.</li>
          </ul>
          <p className="text-ink-soft mt-4"><strong>Not eligible for return:</strong> Items that have been washed, used, or altered; custom-woven or personalised orders; bulk wholesale orders beyond the 48-hour window.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">4. How to Initiate a Return</h3>
          <ol className="list-decimal pl-6 space-y-2 text-ink-soft">
            <li>WhatsApp us at <strong>+91 94224 60420</strong> with your order reference number and photos of the item clearly showing the issue.</li>
            <li>Our team will review and respond within <strong>24 hours</strong>.</li>
            <li>If approved, we will arrange a reverse pickup at no cost to you (for manufacturing defects).</li>
            <li>Replacement or refund will be processed within <strong>5–7 business days</strong> of receiving the returned item.</li>
          </ol>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">5. Refund Method</h3>
          <ul className="list-disc pl-6 space-y-2 text-ink-soft">
            <li><strong>UPI / Bank Transfer:</strong> Refunds processed within 3–5 business days to your provided UPI ID or bank account.</li>
            <li><strong>Store Credit:</strong> If preferred, we can issue store credit for your next order, valid for 12 months.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">6. Colour &amp; Texture Variations</h3>
          <p className="text-ink-soft">Solapuri handloom textiles are crafted on traditional looms with natural cotton and wool. Slight variations in colour (due to screen calibration), texture, and weave density are inherent to handcrafted fabrics and are <strong>not considered defects</strong>. We encourage you to reach out before purchase if you have specific requirements.</p>
        </div>

        <div>
          <h3 className="font-sub text-xl text-ink mb-3">7. Contact</h3>
          <p className="text-ink-soft">WhatsApp: <strong>+91 94224 60420</strong> (Mon–Sat, 10 AM–8:30 PM IST)<br />Email: mardaandsons@gmail.com<br />Address: 430, Chattigalli, Mangalwar Peth, Solapur, Maharashtra 413 001</p>
        </div>

      </section>
    </main>
  );
}
