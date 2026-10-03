import type { Metadata, Viewport } from 'next';
import { Archivo, Bodoni_Moda } from 'next/font/google';
import { GoogleAnalytics } from './ga';
import { getSettings } from '@/lib/data';
import { siteUrl } from '@/lib/utils';
import './globals.css';

const serif = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-sans', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = `${s.name} — ${s.roles.replace(/\s*•\s*/g, ', ')}`;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s — ${s.name}` },
    description: s.tagline + ' ' + s.bio.slice(0, 120),
    openGraph: {
      title,
      description: s.tagline,
      url: siteUrl(),
      siteName: s.name,
      type: 'profile',
      images: s.portrait?.kind === 'image' ? [{ url: s.portrait.url.replace('/upload/', '/upload/c_fill,w_1200,h_630,g_face/') }] : [],
    },
  };
}

export const viewport: Viewport = { themeColor: '#080808', viewportFit: 'cover' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: s.name,
    jobTitle: s.roles.split('•').map((r) => r.trim()),
    url: siteUrl(),
    sameAs: [s.instagram, s.youtube].filter(Boolean),
  };
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics id={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
