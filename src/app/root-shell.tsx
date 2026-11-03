import type { Metadata, Viewport } from 'next';
import './tokens.css';
import type { ReactNode } from 'react';
import { siteUrl } from '@/lib/site';

type Lang = 'es' | 'en';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2F0E9' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },
  ],
};

// Mismos textos que el title y la description de cada página: lo que se ve al compartir el link.
const copy = {
  es: {
    title: 'Martín Bundy · Ingeniería industrial e IA aplicada',
    description: 'Martín Bundy, Panamá. Ingeniería industrial e IA aplicada: agentes, automatización y procesos.',
    locale: 'es_PA',
    altLocale: 'en_US',
    url: '/',
  },
  en: {
    title: 'Martín Bundy · Industrial engineering and applied AI',
    description: 'Martín Bundy, Panama. Industrial engineering and applied AI: agents, automation and processes.',
    locale: 'en_US',
    altLocale: 'es_PA',
    url: '/en',
  },
} as const;

// La imagen de OG la pone el opengraph-image de cada idioma; Twitter cae en og:image.
export function rootMetadata(lang: Lang): Metadata {
  const c = copy[lang];
  return {
    metadataBase: new URL(siteUrl),
    title: c.title,
    description: c.description,
    authors: [{ name: 'Martín Bundy', url: siteUrl }],
    robots: { index: true, follow: true },
    openGraph: {
      title: c.title,
      description: c.description,
      url: c.url,
      type: 'profile',
      firstName: 'Martín',
      lastName: 'Bundy',
      locale: c.locale,
      alternateLocale: [c.altLocale],
      siteName: 'Martín Bundy',
    },
    twitter: {
      card: 'summary_large_image',
      title: c.title,
      description: c.description,
    },
  };
}

// Cargo público aprobado; nada interno de Philips.
function jsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: 'Martín Alejandro Bundy Muñoz',
        jobTitle: 'Operational Procurement Intern',
        worksFor: { '@type': 'Organization', name: 'Philips' },
        url: siteUrl,
        image: `${siteUrl}/img/martin-hero.webp`,
        email: 'mbundy15@gmail.com',
        sameAs: ['https://linkedin.com/in/martinbundy15', 'https://github.com/EiTinchoZ'],
        address: { '@type': 'PostalAddress', addressCountry: 'PA', addressLocality: 'Panamá' },
        knowsAbout: [
          'AI agents',
          'Copilot Studio',
          'Process automation',
          'Industrial engineering',
          'Machine learning',
          'Python',
        ],
      },
      {
        '@type': 'WebSite',
        name: 'Martín Bundy',
        url: siteUrl,
        inLanguage: lang,
        description: copy[lang].description,
      },
    ],
  };
}

// Layout raíz compartido: (es) y (en) son dos layouts raíz para que cada idioma salga estático con su <html lang>.
export function RootShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
