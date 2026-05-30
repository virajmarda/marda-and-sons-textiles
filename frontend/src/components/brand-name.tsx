import type { ElementType } from 'react';

type Variant = 'inline' | 'large' | 'huge' | 'micro';

const SIZES: Record<Variant, string> = {
  micro: 'text-[15px] leading-none md:text-[17px]',
  inline: 'text-xl leading-none md:text-2xl',
  large: 'text-4xl leading-[0.95] md:text-6xl',
  huge: 'text-[clamp(3.5rem,16vw,10rem)] leading-[0.9] md:text-[clamp(5rem,12vw,12rem)]',
};

/**
 * Brand wordmark in Devanagari (Tiro Devanagari Marathi).
 * Use everywhere instead of literal "Marda & Sons".
 */
export function BrandName<T extends ElementType = 'span'>({
  as,
  variant = 'inline',
  className = '',
}: {
  as?: T;
  variant?: Variant;
  className?: string;
}) {
  const Component = as || 'span';

  return (
    <Component
      className={`font-brand tracking-[-0.01em] ${SIZES[variant]} ${className}`}
      lang="mr"
    >
      मर्दा ॲन्ड सन्स
    </Component>
  );
}
