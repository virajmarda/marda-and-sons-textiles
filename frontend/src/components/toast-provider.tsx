'use client';
import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 2600,
        style: {
          background: '#2A1D1A',
          color: '#FDFBF7',
          borderRadius: 0,
          border: '1px solid #C5A059',
          fontFamily: 'var(--font-jost), Jost, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.08em',
          padding: '14px 22px',
        },
      }}
    />
  );
}
