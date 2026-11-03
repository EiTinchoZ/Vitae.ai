import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond, Geist_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
import '../../globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/i18n';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';

// El envoltorio del sitio anterior vive aquí desde el rediseño: la landing ya no lo usa
// y /demo (que despliega vitae-demo) tiene que seguir igual.
export const metadata: Metadata = {
  title: 'Vitae.ai · Demo',
  description: 'Sube tu CV y mira cómo se vería como portfolio interactivo con IA.',
  robots: { index: false, follow: false },
};

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

export default function DemoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} ${geistMono.variable} font-sans antialiased`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LanguageProvider>
          <Navbar />
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
          <ChatBot />
        </LanguageProvider>
      </ThemeProvider>
    </div>
  );
}
