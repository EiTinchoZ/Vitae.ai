import type { Metadata, Viewport } from 'next';
import './tokens.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2F0E9' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-eitinchos-projects.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Vitae.ai | Martín Bundy - CV Digital con IA',
  description:
    'Vitae.ai - Tu carrera, potenciada por inteligencia artificial. CV digital interactivo de Martín Bundy con análisis de IA, recomendaciones personalizadas y chat inteligente.',
  keywords: [
    'Vitae.ai',
    'CV Digital',
    'Martín Bundy',
    'Inteligencia Artificial',
    'Machine Learning',
    'Deep Learning',
    'Portfolio IA',
    'CV Interactivo',
    'Ingeniería Industrial',
    'Panamá',
  ],
  authors: [{ name: 'Martín Bundy' }],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Vitae.ai | Martín Bundy - CV Digital con IA',
    description:
      'Tu carrera, potenciada por inteligencia artificial. CV digital interactivo con análisis de IA y recomendaciones personalizadas.',
    type: 'website',
    locale: 'es_PA',
    siteName: 'Vitae.ai',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'Vitae.ai — Martín Bundy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vitae.ai | Martín Bundy - CV Digital con IA',
    description:
      'Tu carrera, potenciada por inteligencia artificial. CV digital interactivo con análisis de IA.',
    images: ['/og'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: 'Martín Alejandro Bundy Muñoz',
      jobTitle: 'Industrial Engineering Student & AI Technical Specialist',
      url: siteUrl,
      email: 'mbundy15@gmail.com',
      sameAs: [
        'https://linkedin.com/in/martinbundy15',
        'https://github.com/EiTinchoZ',
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'PA',
        addressLocality: 'Panamá',
      },
      knowsAbout: [
        'Machine Learning',
        'Deep Learning',
        'Generative AI',
        'RAG',
        'Industrial Engineering',
        'Python',
        'Process Optimization',
      ],
    },
    {
      '@type': 'WebSite',
      name: 'Vitae.ai — Martín Bundy',
      url: siteUrl,
      description:
        'CV digital interactivo con IA. Portfolio profesional de Martín Bundy.',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/archivo-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
