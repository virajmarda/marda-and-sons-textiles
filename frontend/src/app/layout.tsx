import type { Metadata } from 'next';
import { Bodoni_Moda, Marcellus, Jost, Yatra_One, Tiro_Devanagari_Marathi } from 'next/font/google';
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
  title: 'मर्दा ॲन्ड सन्स · Marda & Sons — Premium Solapuri Textiles · Est. 1970',
  description:
    'विश्वास की परंपरा, वर्षों का साथ. Heritage Solapuri textiles since 1970 — towels, bedsheets, shawls, phetas, woolen blankets and more. Retail & wholesale from the heart of Solapur.',
  keywords:
    'Marda and Sons, मर्दा ॲन्ड सन्स, Solapur, Solapuri textiles, handloom bedsheets, wholesale textiles, premium towels India, ghongdi, pheta, woolen blankets',
  openGraph: {
    title: 'मर्दा ॲन्ड सन्स — Solapuri Textiles Since 1970',
    description:
      'A heritage textile house from Solapur. Handloom bedsheets, shawls, woolen blankets, phetas & ceremonial textiles.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${marcellus.variable} ${jost.variable} ${yatra.variable} ${tiro.variable}`}
    >
      <body>
        <ToastProvider />
        <CartProvider>
          <Header />
          <main className="relative z-[2]">{children}</main>
          <Footer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
