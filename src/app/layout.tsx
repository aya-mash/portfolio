import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

export const metadata: Metadata = {
  title: 'Ayabulela Mahlathini – Frontend Engineer',
  description: 'Portfolio of Ayabulela (Aya) Mahlathini – Frontend engineer specializing in data-intensive React applications, schema-driven validation pipelines, and platformized UI systems.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
