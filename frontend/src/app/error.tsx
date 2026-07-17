'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center">
      {/* Chapter label */}
      <p className="eyebrow text-ink-soft mb-6 tracking-widest text-xs">
        00 &mdash; SOMETHING BROKE
      </p>

      {/* Large editorial heading */}
      <h1 className="font-heading text-[clamp(4rem,14vw,12rem)] leading-none tracking-tighter text-ink mb-2">
        A snag
      </h1>
      <h2 className="font-heading italic text-[clamp(2rem,7vw,6rem)] leading-none tracking-tighter text-brand mb-10">
        in the loom.
      </h2>

      {/* Marathi subtitle */}
      <p className="font-accent text-brand text-xl mb-8 opacity-80">
        मशीनीत अडथळा आला
      </p>

      {/* Description */}
      <p className="font-body text-ink-soft text-base max-w-md mb-10 leading-relaxed">
        Something went wrong on our end. Our weavers are on it.
        Try again in a moment, or return to the atelier.
      </p>

      {/* Gold divider */}
      <div className="gold-rule w-24 h-px mb-10" />

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="btn-primary px-8 py-3 text-xs tracking-widest uppercase"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="btn-ghost px-8 py-3 text-xs tracking-widest uppercase"
        >
          Return Home
        </Link>
      </div>

      {/* Subtle error digest for debugging */}
      {error.digest && (
        <p className="mt-10 font-body text-xs text-ink-soft opacity-40">
          Error ref: {error.digest}
        </p>
      )}

      {/* Watermark */}
      <p className="watermark-hindi absolute bottom-12 right-8 select-none pointer-events-none text-6xl opacity-5 font-accent text-ink">
        मर्दा
      </p>
    </main>
  );
}
