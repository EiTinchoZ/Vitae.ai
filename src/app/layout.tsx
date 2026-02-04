import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
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
  title: 'Martín Bundy | Portfolio',
  description:
    'Portfolio de Martín Bundy - Estudiante de Ingeniería Industrial y Técnico Superior en Inteligencia Artificial. Especializado en Machine Learning, Deep Learning y soluciones de IA.',
  keywords: [
    'Martín Bundy',
    'Portfolio',
    'Inteligencia Artificial',
    'Machine Learning',
    'Deep Learning',
    'Python',
    'Ingeniería Industrial',
    'Panamá',
  ],
  authors: [{ name: 'Martín Bundy' }],
  openGraph: {
    title: 'Martín Bundy | Portfolio',
    description:
      'Estudiante de Ingeniería Industrial y Técnico Superior en IA especializado en Machine Learning y Deep Learning.',
    type: 'website',
    locale: 'es_PA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Martín Bundy | Portfolio',
    description:
      'Estudiante de Ingeniería Industrial y Técnico Superior en IA especializado en Machine Learning y Deep Learning.',
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
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
