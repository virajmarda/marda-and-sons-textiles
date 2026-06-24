'use client';

import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  fallbacks?: string[];
  className?: string;
  /** Applied as a placeholder div when all image sources have failed */
  fallbackClassName?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  style?: React.CSSProperties;
}

export function SafeImage({
  src,
  alt,
  fallbacks = [],
  className,
  fallbackClassName,
  width,
  height,
  fill,
  style,
}: SafeImageProps) {
  const [idx, setIdx] = useState(0);
  const [errored, setErrored] = useState(false);
  const srcs = [src, ...fallbacks];
  const current = srcs[idx] ?? src;

  function handleError() {
    if (idx < srcs.length - 1) {
      setIdx((i) => i + 1);
    } else {
      setErrored(true);
    }
  }

  const fillStyle: React.CSSProperties = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
    : {};

  if (errored && fallbackClassName) {
    return <div className={fallbackClassName} style={fillStyle} aria-label={alt} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      width={width}
      height={height}
      style={{ ...fillStyle, ...style }}
      onError={handleError}
    />
  );
}
