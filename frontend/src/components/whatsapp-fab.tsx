'use client';

import { useEffect, useRef, useState } from 'react';
import { whatsappLink } from '@/lib/api';

export function WhatsAppFab() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const message = "नमस्कार मर्दा ॲन्ड सन्स — I'd like to know more about your collection.";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
      data-testid="whatsapp-fab-container"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {open && (
        <div
          data-testid="whatsapp-tooltip"
          className="max-w-[260px] border border-gold/40 bg-ink px-5 py-4 text-bg-primary shadow-2xl animate-fade-up"
          role="status"
          aria-live="polite"
        >
          <p className="mb-1 text-sm font-accent text-gold">नमस्कार 🙏</p>
          <p className="text-sm leading-snug font-sub">
            Chat with मर्दा ॲन्ड सन्स on WhatsApp — we usually reply within minutes.
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="whatsapp-fab"
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={() => setOpen(false)}
          className="group relative flex h-14 w-14 items-center justify-center bg-brand shadow-[0_12px_40px_-8px_rgba(106,26,42,0.55)] transition-all duration-500 hover:scale-105 hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:h-16 sm:w-16"
          aria-label="Chat on WhatsApp"
        >
          <span className="absolute inset-1 border border-gold/60" />
          <svg
            viewBox="0 0 32 32"
            className="h-6 w-6 fill-gold sm:h-7 sm:w-7"
            aria-hidden="true"
          >
            <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.945 2.722.945.345 0 2.15-.546 2.42-.876.34-.4.486-.847.486-1.36 0-.247-.06-.474-.158-.69-.13-.236-.32-.34-.7-.4-.388-.058-.97-.246-1.346-.4z" />
            <path d="M16.057 4C9.444 4 4.057 9.42 4.057 16.082c0 2.142.555 4.218 1.6 6.046L4 28l5.946-1.62a11.93 11.93 0 0 0 6.094 1.654h.017c6.62 0 12-5.43 12-12.085 0-3.22-1.247-6.245-3.51-8.518A11.957 11.957 0 0 0 16.057 4zm0 21.918a9.86 9.86 0 0 1-5.034-1.39l-.36-.213-3.74 1.02 1.014-3.624-.234-.376a9.94 9.94 0 0 1-1.5-5.253c0-5.51 4.418-9.954 9.866-9.954a9.74 9.74 0 0 1 6.97 2.92c1.866 1.866 2.89 4.36 2.89 6.992 0 5.51-4.418 9.876-9.876 9.876z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
