import type { Metadata, Viewport } from 'next';
import {
  Bodoni_Moda,
  Jost,
  Tiro_Devanagari_Marathi,
} from 'next/font/google';
import '@/app/globals.css';
import { CartProvider } from '@/lib/cart-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppFab } from '@/components/whatsapp-fab';
import { ToastProvider } from '@/components/toast-provider';

// ---------- Fonts (3 requests, down from 5) ----------
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
});

// Marathi script — essential for bilingual brand identity
const tiro = Tiro_Devanagari_Marathi({
  subsets: ['latin', 'devanagari'],
  weight: ['400'],
  variable: '--font-tiro',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://marda-and-sons-textiles.vercel.app'),
  title: {
    default: 'मर्दा ॲन्ड सन्स · Marda & Sons — Premium Solapuri Textiles · Est. 1970',
    template: '%s · Marda & Sons',
  },
  description:
    'विश्वास की परंपरा, वर्षों का साथ. Heritage Solapuri textiles since 1970 — handwoven bedsheets, towels, and home linen crafted in Maharashtra.',
  keywords: [
    'Solapuri chaddar',
    'Marda textiles',
    'handwoven bedsheets',
    'Solapur textiles',
    'cotton towels',
    'Maharashtra textiles',
    'wholesale textiles',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://marda-and-sons-textiles.vercel.app',
    siteName: 'Marda & Sons',
    title: 'Marda & Sons — Premium Solapuri Textiles',
    description: 'Heritage Solapuri textiles since 1970.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marda & Sons — Premium Solapuri Textiles',
    description: 'Heritage Solapuri textiles since 1970.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f6f0e5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${jost.variable} ${tiro.variable}`}
    >
      <body className="bg-stone-50 text-stone-900 antialiased">
        <CartProvider>
          <ToastProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppFab />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
