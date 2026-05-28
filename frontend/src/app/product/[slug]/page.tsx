import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProduct, getProducts } from '@/lib/api';
import { ProductDetail } from './product-detail';
import { ProductCard } from '@/components/product-card';

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product;
  try {
    product = await getProduct(params.slug);
  } catch {
    notFound();
  }
  const related = (await getProducts({ category: product.category }).catch(() => []))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div data-testid="product-page" className="bg-paper">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-36 pb-10">
        <nav className="eyebrow text-ink-soft flex gap-2 items-center">
          <Link href="/" className="link-underline">Home</Link>
          <span>/</span>
          <Link href="/shop" className="link-underline">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="link-underline">{product.category}</Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <ProductDetail product={product} />

      {/* Related */}
      {related.length > 0 && (
        <section className="py-24 md:py-32 bg-paper-2">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
              <h2 className="display-2 text-4xl md:text-5xl text-ink">From the same loom.</h2>
              <Link href={`/shop?category=${product.category}`} data-testid="related-link" className="eyebrow link-underline">View all {product.category} →</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {related.map((p, i) => (
                <ProductCard key={p.slug} p={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA strip */}
      <section className="bg-ink text-bg-primary py-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow text-gold-muted">Bulk Enquiry</p>
            <h3 className="font-heading italic text-3xl md:text-4xl mt-3">Need 50, 500, or 5000 pieces?</h3>
          </div>
          <Link href="/wholesale" data-testid="bulk-cta" className="inline-flex items-center gap-3 eyebrow text-gold border-b border-gold pb-1 w-fit md:justify-self-end">
            Talk to wholesale <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
