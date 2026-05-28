import type { Metadata } from 'next';
import { Bodoni_Moda, Marcellus, Jost, Yatra_One } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'Marda & Sons — Premium Solapuri Textiles · Est. 1970',
  description:
    'विश्वास की परंपरा, वर्षों का साथ. Heritage Solapuri textiles since 1970 — towels, bedsheets, chaddars, shawls, phetas, and more. Retail & wholesale from the heart of Solapur.',
  keywords:
    'Marda and Sons, Solapur, Solapuri chaddar, Solapuri textiles, handloom bedsheets, wholesale textiles, premium towels India, ghongdi, pheta',
  openGraph: {
    title: 'Marda & Sons — Solapuri Textiles Since 1970',
    description:
      'A heritage textile house from Solapur. Handloom chaddars, bedsheets, shawls & ceremonial textiles.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${marcellus.variable} ${jost.variable} ${yatra.variable}`}
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
