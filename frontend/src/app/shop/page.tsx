import { Suspense } from 'react';
import { ShopClient } from './shop-client';

export const revalidate = 0;

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ShopClient />
    </Suspense>
  );
}
