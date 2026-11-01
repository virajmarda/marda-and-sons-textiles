import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <section
      data-testid="not-found-page"
      aria-labelledby="not-found-heading"
      className="relative isolate overflow-hidden bg-paper px-5 pb-16 pt-36 sm:px-8 sm:pb-20 sm:pt-40 md:pb-24 md:pt-44"
    >
      <div className="relative mx-auto flex min-h-[55svh] max-w-5xl items-center justify-center">
        <div className="w-full max-w-2xl text-center">
          <p className="font-sub text-xs uppercase tracking-[0.24em] text-ink-soft sm:text-sm">
            404 · Page not found
          </p>

          <h1
            id="not-found-heading"
            className="mt-7 font-heading text-6xl font-normal leading-[1.05] tracking-tight text-ink sm:text-7xl md:text-8xl"
          >
            Lost{' '}
            <span className="italic text-brand">
              thread.
            </span>
          </h1>

          <p
            lang="mr"
            className="mt-6 font-accent text-lg leading-relaxed text-brand sm:text-xl"
          >
            हा धागा सापडला नाही
          </p>

          <div
            aria-hidden="true"
            className="mx-auto my-7 h-px w-16 bg-gold/60 sm:my-8"
          />

          <p className="mx-auto max-w-md font-sub text-base leading-relaxed text-ink-soft sm:text-lg">
            We couldn’t find the page you’re looking for.
            It may have moved, or the link may no longer
            be available.
          </p>

          <p className="mt-3 font-sub text-sm leading-relaxed text-ink-soft">
            Let’s guide you back to the collection.
          </p>

          <div className="mx-auto mt-8 flex max-w-sm flex-col justify-center gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:gap-4">
            <Link
              href="/shop"
              data-testid="not-found-shop"
              className="btn-primary min-h-[48px] justify-center gap-3 px-6 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              Browse the collection
              <ArrowRight
                size={16}
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/"
              data-testid="not-found-home"
              className="btn-ghost min-h-[48px] justify-center gap-3 px-6 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              <ArrowLeft
                size={16}
                aria-hidden="true"
              />
              Return home
            </Link>
          </div>

          <p className="mt-8 font-sub text-sm leading-relaxed text-ink-soft">
            Looking for something specific?{' '}
            <Link
              href="/contact"
              data-testid="not-found-contact"
              className="inline-block py-2 text-ink underline underline-offset-4 transition-colors hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              Contact the store
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
