'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const initial = useMemo(
    () => (reduceMotion ? { opacity: 0 } : { opacity: 0, y }),
    [reduceMotion, y]
  );

  const whileInView = useMemo(
    () => (reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }),
    [reduceMotion]
  );

  const viewport = useMemo(
    () => ({
      once: true,
      margin: '-48px 0px',
      amount: 0.2,
    }),
    []
  );

  const transition = useMemo(
    () => ({
      duration: reduceMotion ? 0.35 : 0.9,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    }),
    [delay, reduceMotion]
  );

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({
  number,
  label,
  className,
}: {
  number: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className ?? ''}`}>
      <span className="num-block">{number}</span>
      <span className="h-px w-8 bg-gold sm:w-10" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}
