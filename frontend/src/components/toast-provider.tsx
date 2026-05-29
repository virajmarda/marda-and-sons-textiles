'use client';
import { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';

// Defined at module scope so the same identity is used across renders.
const TOAST_STYLE = {
  background: '#2A1D1A',
  color: '#FDFBF7',
  borderRadius: 0,
  border: '1px solid #C5A059',
  fontFamily: 'var(--font-jost), Jost, sans-serif',
  fontSize: '13px',
  letterSpacing: '0.08em',
  padding: '14px 22px',
} as const;

export function ToastProvider() {
  const toastOptions = useMemo(
    () => ({
      duration: 2600,
      style: TOAST_STYLE,
    }),
    [],
  );

  return <Toaster position="bottom-center" toastOptions={toastOptions} />;
}
