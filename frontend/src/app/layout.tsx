import type { Metadata } from 'next';
import '@/app/globals.css';
export const metadata: Metadata = {
  title: 'Marda & Sons – Premium Solapuri Textiles Since 1970',
  description: 'विश्वास की परंपरा, वर्षों का साथ – Premium Solapuri handloom textiles for home, weddings, hotels & gifting. Serving families since 1970 from the heart of Solapur.',
  keywords: 'Solapuri textiles, Solapur chaddar, handloom bedsheets, Solapuri towels, wholesale textiles Solapur, Marda Sons',
  openGraph: {
    title: 'Marda & Sons – Premium Solapuri Textiles',
    description: 'Heritage textiles from Solapur – towels, bedsheets, blankets, and gifting sets.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-cream text-indigo antialiased">{children}</body>
    </html>
  );
}
