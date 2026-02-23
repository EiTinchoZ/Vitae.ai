import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/i18n';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import dynamic from 'next/dynamic';
import './globals.css';

const ChatBot = dynamic(() => import('@/components/chat/ChatBot').then(m => m.ChatBot));

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vitae.ai | Martín Bundy - CV Digital con IA',
    description:
      'Tu carrera, potenciada por inteligencia artificial. CV digital interactivo con análisis de IA.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
