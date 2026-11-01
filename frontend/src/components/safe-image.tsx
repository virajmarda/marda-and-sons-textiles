'use client';

import {
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
} from 'react';

type SafeImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'srcSet' | 'alt'
> & {
  src: string;
  alt: string;
  fallbacks?: string[];
  fallbackClassName?: string;
  fill?: boolean;
};

export function SafeImage(props: SafeImageProps) {
  const sourceKey = JSON.stringify([
    props.src,
    ...(props.fallbacks ?? []),
  ]);

  return (
    <ImageAttempt
      key={sourceKey}
      {...props}
    />
  );
}

function ImageAttempt({
  src,
  alt,
  fallbacks = [],
  className,
  fallbackClassName,
  fill = false,
  style,
  width,
  height,
  loading,
  decoding = 'async',
  onError,
  ...imageProps
}: SafeImageProps) {
  const [sourceIndex, setSourceIndex] = useState(0);

  const sources = Array.from(
    new Set(
      [src, ...fallbacks].filter(
        (source) => source.trim().length > 0,
      ),
    ),
  );

  const currentSource = sources[sourceIndex];

  const fillStyle: CSSProperties = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }
    : {};

  const imageStyle: CSSProperties = {
    ...fillStyle,
    ...style,
  };

  if (!currentSource) {
    const placeholderStyle: CSSProperties = {
      ...(!fill && width != null ? { width } : {}),
      ...(!fill && height != null ? { height } : {}),
      ...imageStyle,
    };

    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={
          alt
            ? `${alt} — image unavailable`
            : undefined
        }
        aria-hidden={alt ? undefined : true}
        className={
          fallbackClassName ??
          className ??
          'bg-bg-secondary'
        }
        style={placeholderStyle}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...imageProps}
      src={currentSource}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      style={imageStyle}
      onError={(event) => {
        try {
          onError?.(event);
        } finally {
          setSourceIndex((current) => current + 1);
        }
      }}
    />
  );
}
