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

const SITE_URL = 'https://amash.tech';
const TITLE = 'Ayabulela Mahlathini — Software Engineer';
const YEARS_EXPERIENCE = Math.floor(
  (Date.now() - new Date(2021, 0, 4).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
);
const DESCRIPTION =
  `Software engineer with ${YEARS_EXPERIENCE}+ years of full-stack ownership across enterprise platforms. Specializing in scalable React ecosystems, design systems, and developer experience.`;

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
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Aya Mahlathini',
    images: [
      {
        url: `${SITE_URL}/avatar.png`,
        width: 800,
        height: 800,
        alt: 'Ayabulela Mahlathini — Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/avatar.png`],
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ayabulela Mahlathini',
  alternateName: 'Aya',
  url: SITE_URL,
  jobTitle: 'Software Engineer',
  description: DESCRIPTION,
  sameAs: [
    'https://github.com/aya-mash',
    'https://www.linkedin.com/in/ayabulela-mahlathini',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
