'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ESTABLISHED } from '@/lib/api';

type Props = {
  chapter?: string;         // "01" / "02" — small editorial chapter mark
  eyebrow: string;          // "The Atelier · Shop"
  marathi?: string;         // "प्रत्येक धागा, एक कथा"
  headline: ReactNode;      // h1 content — JSX with italic accent spans
  lede?: ReactNode;         // sub paragraph
  bgImage?: string;         // optional hero background image
  /** 'light' (cream paper) or 'dark' (inky w/ image) — controls text colour */
  tone?: 'light' | 'dark';
  /** layout — single column or split (copy left / sidebar right) */
  layout?: 'single' | 'split';
  sidebar?: ReactNode;      // right-side content when layout='split'
  height?: 'md' | 'lg' | 'xl';
};

const heights = {
  md: 'pt-36 pb-16 md:pt-44 md:pb-20',
  lg: 'pt-40 pb-24 md:pt-52 md:pb-28',
  xl: 'pt-44 pb-32 md:pt-56 md:pb-40',
};

/**
 * The masterpiece hero used across every page.
 *
 * Editorial vocabulary kept consistent: top gold thread, chapter mark, eyebrow,
 * marathi accent line, oversized display headline with italic span, lede,
 * decorative bottom hairline w/ centered diamond, vertical "Est. 1970 · Solapur"
 * rail on the right edge, optional Ken-Burns bg image, paisley ornament.
 */
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
  const lightText = isDark ? 'text-bg-primary/80' : 'text-ink-soft';
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
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 18, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img src={bgImage} alt="" className={`w-full h-full object-cover ${isDark ? 'opacity-50' : 'opacity-25'}`} />
        </motion.div>
      )}

      {/* Scrim — readability over image */}
      {bgImage && (
        <div
          aria-hidden
          className={
            isDark
              ? 'absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink'
              : 'absolute inset-0 bg-gradient-to-b from-paper/75 via-paper/85 to-paper'
          }
        />
      )}

      {/* Soft ambient circles when no bgImage */}
      {!bgImage && !isDark && (
        <>
          <div aria-hidden className="absolute -top-32 -right-32 w-[640px] h-[640px] rounded-full bg-brand/[0.05] blur-3xl pointer-events-none" />
          <div aria-hidden className="absolute -bottom-32 -left-32 w-[560px] h-[560px] rounded-full bg-gold/[0.07] blur-3xl pointer-events-none" />
        </>
      )}

      {/* Top gold thread */}
      <div aria-hidden className={`absolute left-0 right-0 top-[64px] md:top-[110px] h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent`} />

      {/* Top-right paisley ornament (very subtle) */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className={`absolute -top-4 right-6 md:right-12 w-32 md:w-44 ${isDark ? 'text-gold/15' : 'text-brand/10'} pointer-events-none`}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      >
        <path d="M100 30 C 60 30, 30 60, 30 100 C 30 140, 60 170, 100 170 C 130 170, 150 140, 150 110 C 150 80, 130 70, 110 70 C 95 70, 85 80, 85 95 C 85 105, 95 110, 105 110" />
        <circle cx="100" cy="100" r="60" />
        <circle cx="100" cy="100" r="30" />
        <path d="M40 100 L 160 100 M 100 40 L 100 160" strokeDasharray="2 4" />
      </svg>

      {/* Vertical "Est · Solapur" rail on the right edge */}
      <div
        aria-hidden
        className={`hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4 ${lightText}`}
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="eyebrow text-[10px]">Est. {ESTABLISHED}</span>
        <span className={`w-px h-16 ${isDark ? 'bg-gold/40' : 'bg-gold/50'}`} style={{ writingMode: 'horizontal-tb' }} />
        <span className="eyebrow text-[10px]">Solapur · India</span>
      </div>

      {/* Content */}
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <div className={layout === 'split' ? 'grid lg:grid-cols-12 gap-12 items-end' : ''}>
          <div className={layout === 'split' ? 'lg:col-span-8' : ''}>
            {/* Chapter mark */}
            {chapter && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4 mb-8"
              >
                <span
                  className={`font-heading italic text-5xl md:text-6xl leading-none ${accent}`}
                >
                  {chapter}
                </span>
                <span className={`w-12 h-px ${isDark ? 'bg-gold/60' : 'bg-gold'}`} />
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
              className={`display-1 text-6xl md:text-8xl lg:text-[9.5rem] ${textColor} mt-6 leading-[0.92]`}
            >
              {headline}
            </motion.h1>

            {/* Marathi accent */}
            {marathi && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className={`font-accent ${accent} mt-8 text-2xl md:text-3xl tracking-wide`}
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
                className={`font-sub ${lightText} text-lg mt-6 max-w-2xl leading-relaxed`}
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

        {/* Bottom decorative hairline with centered diamond */}
        <div className="relative mt-16 md:mt-20" aria-hidden>
          <div className={`h-px ${lineColor}`} />
          <span
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${ornamentColor} text-xs select-none`}
          >
            ◆
          </span>
        </div>
      </div>
    </section>
  );
}
