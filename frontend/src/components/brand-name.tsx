type Variant = 'inline' | 'large' | 'huge' | 'micro';

const SIZES: Record<Variant, string> = {
  micro: 'text-[15px] md:text-[17px]',
  inline: 'text-xl md:text-2xl',
  large: 'text-4xl md:text-6xl',
  huge: 'text-[16vw] md:text-[12vw] leading-[0.9]',
};

/**
 * Brand wordmark in Devanagari (Tiro Devanagari Marathi).
 * Use everywhere instead of literal "Marda & Sons".
 */
export function BrandName({
  variant = 'inline',
  className = '',
}: { variant?: Variant; className?: string }) {
  return (
    <span
      className={`font-brand tracking-[-0.01em] ${SIZES[variant]} ${className}`}
      lang="mr"
    >
      मर्दा ॲन्ड सन्स
    </span>
  );
}
