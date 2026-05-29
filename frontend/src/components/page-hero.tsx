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
  md: 'pt-36 pb-16 md:pt-44 md:pb-20',
  lg: 'pt-40 pb-24 md:pt-52 md:pb-28',
  xl: 'pt-44 pb-32 md:pt-56 md:pb-40',
};

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
  const lightText = isDark ? 'text-bg-primary/80' : 'text-ink/78';
  const accent = isDark ? 'text-gold' : 'text-brand';
  const lineColor = isDark ? 'bg-bg-primary/20' : 'bg-line';
  const ornamentColor = isDark ? 'text-gold/70' : 'text-brand/70';

  return (
    <section
      data-testid="page-hero"
      className={`relative overflow-hidden ${heights[height]} ${isDark ? 'bg-ink' : 'bg-paper'}`}
    >
      {/* Background image (optional) with slow Ken-burns */}
      {bgImage && (
        <motion.div
          aria-hidden
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 18, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={bgImage}
            alt=""
            className={`h-full w-full object-cover object-center ${
              isDark ? 'opacity-72' : 'opacity-100'
            }`}
          />
        </motion.div>
      )}

      {/* Scrim — readability over image */}
      {bgImage && (
        <>
          {isDark ? (
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-ink/82 via-ink/52 to-ink/88"
            />
          ) : (
            <>
              <div
                aria-hidden
                className="absolute inset-0 bg-black/12"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,241,232,0.82)_0%,rgba(245,241,232,0.56)_34%,rgba(245,241,232,0.20)_60%,rgba(245,241,232,0.08)_100%)]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(245,241,232,0.50)_0%,rgba(245,241,232,0.18)_28%,rgba(245,241,232,0.06)_52%,rgba(245,241,232,0.00)_100%)]"
              />
            </>
          )}
        </>
      )}

      {/* Soft ambient circles when no bgImage */}
      {!bgImage && !isDark && (
        <>
          <div
            aria-hidden
            className="absolute -top-32 -right-32 h-[640px] w-[640px] rounded-full bg-brand/[0.05] blur-3xl pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-32 h-[560px] w-[560px] rounded-full bg-gold/[0.07] blur-3xl pointer-events-none"
          />
        </>
      )}

      {/* Top gold thread */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-[64px] h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent md:top-[110px]"
      />

      {/* Top-right paisley ornament */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className={`pointer-events-none absolute -top-4 right-6 w-32 md:right-12 md:w-44 ${
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
        className={`hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4 ${lightText}`}
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
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24">
        <div className={layout === 'split' ? 'grid items-end gap-12 lg:grid-cols-12' : ''}>
          <div className={layout === 'split' ? 'lg:col-span-8' : ''}>
            {/* Chapter mark */}
            {chapter && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 flex items-center gap-4"
              >
                <span className={`font-heading text-5xl italic leading-none md:text-6xl ${accent}`}>
                  {chapter}
                </span>
                <span className={`h-px w-12 ${isDark ? 'bg-gold/60' : 'bg-gold'}`} />
                <span className={`eyebrow text-[10px] ${lightText}`}>Chapter</span>
              </motion.div>
            )}

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className={`eyebrow ${isDark ? 'text-gold-muted' : 'text-ink'}`}
            >
              {eyebrow}
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`display-1 mt-6 text-6xl leading-[0.92] md:text-8xl lg:text-[9.5rem] ${textColor} drop-shadow-[0_1px_1px_rgba(255,255,255,0.14)]`}
            >
              {headline}
            </motion.h1>

            {/* Marathi accent */}
            {marathi && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className={`font-accent mt-8 text-2xl tracking-wide md:text-3xl ${accent}`}
              >
                {marathi}
              </motion.p>
            )}

            {/* Lede */}
            {lede && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className={`font-sub mt-6 max-w-2xl text-lg leading-relaxed ${lightText}`}
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
              className="lg:col-span-4"
            >
              {sidebar}
            </motion.aside>
          )}
        </div>

        {/* Bottom decorative hairline */}
        <div className="relative mt-16 md:mt-20" aria-hidden>
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
