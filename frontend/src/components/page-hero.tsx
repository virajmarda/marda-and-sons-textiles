'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ESTABLISHED } from '@/lib/api';

type Props = {
  chapter?: string;
  eyebrow: string;
  marathi?: string;
  headline: ReactNode;
  lede?: ReactNode;
  bgImage?: string;
  tone?: 'light' | 'dark';
  layout?: 'single' | 'split';
  sidebar?: ReactNode;
  height?: 'md' | 'lg' | 'xl';
};

const heights = {
  md: 'pt-28 pb-12 sm:pt-32 sm:pb-14 md:pt-40 md:pb-20',
  lg: 'pt-32 pb-16 sm:pt-36 sm:pb-18 md:pt-48 md:pb-28',
  xl: 'pt-36 pb-20 sm:pt-40 sm:pb-24 md:pt-52 md:pb-40',
} as const;

export function PageHero({
  chapter,
  eyebrow,
  marathi,
  headline,
  lede,
  bgImage,
  tone = 'light',
  layout = 'single',
  sidebar,
  height = 'lg',
}: Props) {
  const isDark = tone === 'dark';

  const textColor = isDark ? 'text-bg-primary' : 'text-ink';
  const lightText = isDark ? 'text-bg-primary/82' : 'text-ink/82';
  const accent = isDark ? 'text-gold' : 'text-brand';
  const lineColor = isDark ? 'bg-bg-primary/20' : 'bg-line';
  const ornamentColor = isDark ? 'text-gold/70' : 'text-brand/70';

  return (
    <section
      data-testid="page-hero"
      className={`relative overflow-hidden ${heights[height]} ${isDark ? 'bg-ink' : 'bg-paper'}`}
    >
      {/* Background image */}
      {bgImage && (
        <motion.div
          aria-hidden
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 18, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={bgImage}
            alt=""
            className={`h-full w-full object-cover object-center ${
              isDark
                ? 'opacity-80'
                : 'opacity-100 brightness-[0.98] contrast-[1.08] saturate-[1.04]'
            }`}
          />
        </motion.div>
      )}

      {/* Readability layers */}
      {bgImage && (
        <>
          {isDark ? (
            <>
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-b from-ink/82 via-ink/52 to-ink/90"
              />
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-ink/40 via-ink/12 to-transparent md:w-[52%] md:bg-none md:bg-ink/20"
              />
            </>
          ) : (
            <>
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,241,232,0.82)_0%,rgba(245,241,232,0.48)_30%,rgba(245,241,232,0.16)_58%,rgba(245,241,232,0.00)_100%)] md:bg-[linear-gradient(to_right,rgba(245,241,232,0.68)_0%,rgba(245,241,232,0.34)_28%,rgba(245,241,232,0.10)_54%,rgba(245,241,232,0.00)_100%)]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(245,241,232,0.34)_0%,rgba(245,241,232,0.14)_30%,rgba(245,241,232,0.00)_60%,rgba(245,241,232,0.00)_100%)] md:bg-[linear-gradient(to_top,rgba(245,241,232,0.28)_0%,rgba(245,241,232,0.10)_28%,rgba(245,241,232,0.00)_58%,rgba(245,241,232,0.00)_100%)]"
              />
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 w-full bg-white/10 md:w-[54%] md:bg-white/8"
              />
              <div aria-hidden className="absolute inset-0 bg-black/[0.04]" />
            </>
          )}
        </>
      )}

      {/* Ambient circles when no bgImage */}
      {!bgImage && !isDark && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-brand/[0.05] blur-3xl sm:h-[480px] sm:w-[480px] md:-right-32 md:-top-32 md:h-[640px] md:w-[640px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 h-[320px] w-[320px] rounded-full bg-gold/[0.07] blur-3xl sm:h-[420px] sm:w-[420px] md:-bottom-32 md:-left-32 md:h-[560px] md:w-[560px]"
          />
        </>
      )}

      {/* Top gold thread */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-[72px] h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent md:top-[110px]"
      />

      {/* Top-right ornament */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className={`pointer-events-none absolute right-4 top-16 w-24 sm:w-28 md:right-12 md:top-8 md:w-44 ${
          isDark ? 'text-gold/15' : 'text-brand/10'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      >
        <path d="M100 30 C 60 30, 30 60, 30 100 C 30 140, 60 170, 100 170 C 130 170, 150 140, 150 110 C 150 80, 130 70, 110 70 C 95 70, 85 80, 85 95 C 85 105, 95 110, 105 110" />
        <circle cx="100" cy="100" r="60" />
        <circle cx="100" cy="100" r="30" />
        <path d="M40 100 L 160 100 M 100 40 L 100 160" strokeDasharray="2 4" />
      </svg>

      {/* Vertical rail */}
      <div
        aria-hidden
        className={`absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex ${lightText}`}
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="eyebrow text-[10px]">Est. {ESTABLISHED}</span>
        <span
          className={`h-16 w-px ${isDark ? 'bg-gold/40' : 'bg-gold/50'}`}
          style={{ writingMode: 'horizontal-tb' }}
        />
        <span className="eyebrow text-[10px]">Solapur · India</span>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24">
        <div
          className={
            layout === 'split'
              ? 'grid gap-10 md:gap-12 lg:grid-cols-12 lg:items-end'
              : ''
          }
        >
          <div className={layout === 'split' ? 'lg:col-span-8' : ''}>
            {chapter && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 flex items-center gap-3 sm:mb-7 sm:gap-4 md:mb-8"
              >
                <span
                  className={`font-heading text-4xl italic leading-none sm:text-5xl md:text-6xl ${accent}`}
                >
                  {chapter}
                </span>
                <span className={`h-px w-10 sm:w-12 ${isDark ? 'bg-gold/60' : 'bg-gold'}`} />
                <span className={`eyebrow text-[10px] ${lightText}`}>Chapter</span>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className={`eyebrow ${isDark ? 'text-gold-muted' : 'text-ink'}`}
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`display-1 mt-5 text-[2.9rem] leading-[0.92] sm:mt-6 sm:text-[4.1rem] md:text-8xl lg:text-[9.5rem] ${textColor} ${
                isDark ? 'drop-shadow-[0_2px_10px_rgba(255,248,240,0.16)]' : ''
              }`}
            >
              {headline}
            </motion.h1>

            {marathi && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className={`font-accent mt-6 text-lg tracking-wide sm:mt-7 sm:text-xl md:mt-8 md:text-3xl ${accent}`}
              >
                {marathi}
              </motion.p>
            )}

            {lede && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className={`font-sub mt-5 max-w-2xl text-base leading-relaxed sm:mt-6 sm:text-lg ${lightText}`}
              >
                {lede}
              </motion.div>
            )}
          </div>

          {layout === 'split' && sidebar && (
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:col-span-4 lg:pl-4"
            >
              {sidebar}
            </motion.aside>
          )}
        </div>

        <div className="relative mt-12 sm:mt-14 md:mt-20" aria-hidden>
          <div className={`h-px ${lineColor}`} />
          <span
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-xs ${ornamentColor}`}
          >
            ◆
          </span>
        </div>
      </div>
    </section>
  );
}
