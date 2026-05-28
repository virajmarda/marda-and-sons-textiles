'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({ children, delay = 0, y = 32 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
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
