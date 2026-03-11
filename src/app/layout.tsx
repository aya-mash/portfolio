import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

const siteUrl = 'https://amash.tech';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ayabulela Mahlathini – Frontend Engineer',
  description: 'Portfolio of Ayabulela (Aya) Mahlathini – Frontend engineer specializing in data-intensive React applications, schema-driven validation pipelines, and platformized UI systems.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  openGraph: {
    title: 'Ayabulela Mahlathini – Frontend Engineer',
    description: 'Senior Frontend Platform Engineer specializing in scalable React ecosystems, performance engineering, and enterprise design systems.',
    url: siteUrl,
    siteName: 'Aya Mash Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Ayabulela Mahlathini – Frontend Engineer',
    description: 'Senior Frontend Platform Engineer specializing in scalable React ecosystems, performance engineering, and enterprise design systems.',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Ayabulela Mahlathini',
              alternateName: 'Aya Mash',
              url: siteUrl,
              jobTitle: 'Senior Frontend Platform Engineer',
              sameAs: ['https://github.com/aya-mash'],
              knowsAbout: [
                'React', 'TypeScript', 'Frontend Architecture',
                'Design Systems', 'Performance Engineering', 'GraphQL',
              ],
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const ls = localStorage.getItem('theme-pref'); const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches; const theme = ls || (prefersLight ? 'light' : 'dark'); if(theme==='dark'){document.documentElement.classList.add('dark');} else {document.documentElement.classList.remove('dark');} } catch(e) {} })();`
          }}
        />
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}
