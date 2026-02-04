import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/i18n';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { ChatBot } from '@/components/chat/ChatBot';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <ChatBot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
