import { Suspense } from 'react';
import { ShopClient } from './shop-client';

export const revalidate = 0;

function ShopPageFallback() {
  return (
    <div className="min-h-screen bg-paper pt-28 sm:pt-32 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 bg-line/50" />
          <div className="h-12 w-64 bg-line/50 sm:h-14 sm:w-80" />
          <div className="h-5 w-full max-w-xl bg-line/40" />
          <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-line/40" />
                <div className="h-4 w-3/4 bg-line/40" />
                <div className="h-4 w-1/2 bg-line/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageFallback />}>
      <ShopClient />
    </Suspense>
  );
}
