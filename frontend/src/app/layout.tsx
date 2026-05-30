import type { Metadata, Viewport } from 'next';
import {
  Bodoni_Moda,
  Marcellus,
  Jost,
  Yatra_One,
  Tiro_Devanagari_Marathi,
} from 'next/font/google';
import '@/app/globals.css';
import { CartProvider } from '@/lib/cart-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppFab } from '@/components/whatsapp-fab';
import { ToastProvider } from '@/components/toast-provider';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
  display: 'swap',
});

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-marcellus',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
});

const yatra = Yatra_One({
  subsets: ['latin', 'devanagari'],
  weight: ['400'],
  variable: '--font-yatra',
  display: 'swap',
});

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
    'विश्वास की परंपरा, वर्षों का साथ. Heritage Solapuri textiles since 1970 — towels, bedsheets, shawls, phetas, woolen blankets and more. Retail & wholesale from the heart of Solapur.',
  keywords: [
    'Marda and Sons',
    'मर्दा ॲन्ड सन्स',
    'Solapur',
    'Solapuri textiles',
    'handloom bedsheets',
    'wholesale textiles',
    'premium towels India',
    'ghongdi',
    'pheta',
    'woolen blankets',
  ],
  applicationName: 'Marda & Sons',
  authors: [{ name: 'Marda & Sons' }],
  creator: 'Marda & Sons',
  publisher: 'Marda & Sons',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'मर्दा ॲन्ड सन्स — Solapuri Textiles Since 1970',
    description:
      'A heritage textile house from Solapur. Handloom bedsheets, shawls, woolen blankets, phetas & ceremonial textiles.',
    url: 'https://marda-and-sons-textiles.vercel.app',
    siteName: 'Marda & Sons',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'मर्दा ॲन्ड सन्स — Solapuri Textiles Since 1970',
    description:
      'A heritage textile house from Solapur. Handloom bedsheets, shawls, woolen blankets, phetas & ceremonial textiles.',
  },
  category: 'shopping',
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
      suppressHydrationWarning
      className={`${bodoni.variable} ${marcellus.variable} ${jost.variable} ${yatra.variable} ${tiro.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink antialiased">
        <ToastProvider />
        <CartProvider>
          <div className="relative flex min-h-screen flex-col overflow-x-clip">
            <Header />
            <main className="relative z-[2] flex-1">{children}</main>
            <Footer />
            <WhatsAppFab />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
