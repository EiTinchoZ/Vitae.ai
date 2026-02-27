import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/i18n';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import dynamic from 'next/dynamic';
import './globals.css';

const ChatBot = dynamic(() => import('@/components/chat/ChatBot').then(m => m.ChatBot));

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2F0E9' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vitae.lat';

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
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Navbar />
            <main id="main-content" className="min-h-screen">{children}</main>
            <Footer />
            <ChatBot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
