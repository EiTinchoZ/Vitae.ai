import type { Metadata, Viewport } from 'next';
import { redirect } from 'next/navigation';
import { IS_DEMO } from '@/lib/app-config';
import { Landing } from '@/components/landing/Landing';
import '../../landing.css';

export const metadata: Metadata = {
  title: 'Martín Bundy · Industrial engineering and applied AI',
  description: 'Martín Bundy, Panama. Industrial engineering and applied AI: agents, automation and processes.',
  alternates: { canonical: '/en', languages: { es: '/', en: '/en' } },
};

export const viewport: Viewport = {
  themeColor: '#09090A',
};

export default function HomeEn() {
  if (IS_DEMO) {
    redirect('/demo');
  }

  return <Landing lang="en" />;
}
