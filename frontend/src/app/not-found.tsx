import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center">
      {/* Chapter label */}
      <p className="eyebrow text-ink-soft mb-6 tracking-widest text-xs">
        04 &mdash; NOT FOUND
      </p>

      {/* Large editorial heading */}
      <h1 className="font-heading text-[clamp(4rem,14vw,12rem)] leading-none tracking-tighter text-ink mb-2">
        Lost
      </h1>
      <h2 className="font-heading italic text-[clamp(3rem,10vw,9rem)] leading-none tracking-tighter text-brand mb-10">
        thread.
      </h2>

      {/* Hindi subtitle */}
      <p className="font-accent text-brand text-xl mb-8 opacity-80">
        हा धागा सापडला नाही
      </p>

      {/* Description */}
      <p className="font-body text-ink-soft text-base max-w-md mb-10 leading-relaxed">
        The page you are looking for has been moved, renamed, or never woven into existence.
        Let us guide you back to the atelier.
      </p>

      {/* Gold divider */}
      <div className="gold-rule w-24 h-px mb-10" />

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="btn-primary px-8 py-3 text-xs tracking-widest uppercase"
        >
          Return Home
        </Link>
        <Link
          href="/shop"
          className="btn-ghost px-8 py-3 text-xs tracking-widest uppercase"
        >
          Browse Shop
        </Link>
      </div>

      {/* Watermark */}
      <p className="watermark-hindi absolute bottom-12 right-8 select-none pointer-events-none text-6xl opacity-5 font-accent text-ink">
        मर्दा
      </p>
    </main>
  );
}
