'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

export function Reveal({ children, delay = 0, y = 32 }: { children: ReactNode; delay?: number; y?: number }) {
  // Memoize the framer-motion config objects so they keep stable identity
  // across re-renders.
  const initial = useMemo(() => ({ opacity: 0, y }), [y]);
  const whileInView = useMemo(() => ({ opacity: 1, y: 0 }), []);
  const viewport = useMemo(() => ({ once: true, margin: '-80px' }), []);
  const transition = useMemo(
    () => ({ duration: 1, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }),
    [delay],
  );

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="num-block">{number}</span>
      <span className="w-10 h-px bg-gold" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}
