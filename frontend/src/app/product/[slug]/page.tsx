import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getProduct, getProducts } from '@/lib/api';
import { ProductCard } from '@/components/product-card';
import { ProductDetail } from './product-detail';

export const revalidate = 0;

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  // A missing product returns null.
  // Service failures must throw and reach error.tsx.
  const product = await getProduct(params.slug);

  if (product === null) {
    notFound();
  }

  // Defensive check: an invalid API result is not a product 404.
  if (!product) {
    throw new Error('The product service returned an invalid response.');
  }

  const categoryHref =
    `/shop?${new URLSearchParams({
      category: product.category,
    }).toString()}`;

  // Recommendations are optional. Their failure must not
  // prevent customers from viewing the main product.
  const relatedProducts = await getProducts({
    category: product.category,
  }).catch(() => []);

  const related = relatedProducts
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  return (
    <div
      data-testid="product-page"
      className="bg-paper"
    >
      <div className="mx-auto max-w-[1600px] px-6 pb-10 pt-36 md:px-12 lg:px-24">
        <nav aria-label="Breadcrumb">
          <ol className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-3 text-ink-soft">
            <li>
              <Link
                href="/"
                className="link-underline"
              >
                Home
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li>
              <Link
                href="/shop"
                className="link-underline"
              >
                Shop
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li>
              <Link
                href={categoryHref}
                className="link-underline"
              >
                {product.category}
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li
              aria-current="page"
              className="break-words text-ink"
            >
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section
          aria-labelledby="related-products-heading"
          className="bg-paper-2 py-24 md:py-32"
        >
          <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24">
            <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
              <h2
                id="related-products-heading"
                className="display-2 text-4xl text-ink md:text-5xl"
              >
                More to explore.
              </h2>

              <Link
                href={categoryHref}
                data-testid="related-link"
                className="eyebrow link-underline"
              >
                View all {product.category}
                <span aria-hidden="true"> →</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, index) => (
                <ProductCard
                  key={item.slug}
                  p={item}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        aria-labelledby="product-bulk-heading"
        className="bg-ink py-20 text-bg-primary"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 md:grid-cols-2 md:px-12">
          <div>
            <p className="eyebrow text-gold-muted">
              Bulk Enquiry
            </p>

            <h2
              id="product-bulk-heading"
              className="mt-3 font-heading text-3xl italic md:text-4xl"
            >
              Planning a bulk order?
            </h2>
          </div>

          <Link
            href="/wholesale"
            data-testid="bulk-cta"
            className="eyebrow inline-flex min-h-[44px] w-fit items-center gap-3 border-b border-gold pb-1 text-gold md:justify-self-end"
          >
            Talk to wholesale
            <ArrowRight
              size={14}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
