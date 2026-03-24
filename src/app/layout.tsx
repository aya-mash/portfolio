import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const SITE_URL = 'https://ayamash.dev';
const TITLE = 'Ayabulela Mahlathini — Software Engineer';
const DESCRIPTION =
  'Software Engineer specializing in scalable React ecosystems, design systems, and developer experience. Explore my interactive desktop-themed portfolio.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: [
    'Software Engineer',
    'Frontend Engineer',
    'React',
    'TypeScript',
    'Next.js',
    'Design Systems',
    'Developer Experience',
    'Ayabulela Mahlathini',
    'Portfolio',
  ],
  authors: [{ name: 'Ayabulela Mahlathini', url: SITE_URL }],
  creator: 'Ayabulela Mahlathini',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Aya Mahlathini',
    images: [
      {
        url: '/avatar.png',
        width: 800,
        height: 800,
        alt: 'Ayabulela Mahlathini',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/avatar.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0f0a1e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
