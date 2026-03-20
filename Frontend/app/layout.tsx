import type { Metadata, Viewport } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { LayoutShell } from '@/components/layout-shell';
import { ScrollLockFix } from '@/components/scroll-lock-fix';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'MME Hotels | Scandinavian Luxury Across Sweden',
  description:
    'Experience Nordic elegance at MME Hotels. Luxury accommodations across Sweden with world-class dining and spa facilities.',
};

export const viewport: Viewport = {
  themeColor: '#1a1714',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}
      >
        <ScrollLockFix />
        <LayoutShell>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  );
}
