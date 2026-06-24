'use client';

import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  fallbacks?: string[];
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

export function SafeImage({
  src,
  alt,
  fallbacks = [],
  className,
  width,
  height,
  fill,
}: SafeImageProps) {
  const [idx, setIdx] = useState(0);
  const srcs = [src, ...fallbacks];
  const current = srcs[idx] ?? src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      width={width}
      height={height}
      style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : undefined}
      onError={() => {
        if (idx < srcs.length - 1) setIdx((i) => i + 1);
      }}
    />
  );
}
