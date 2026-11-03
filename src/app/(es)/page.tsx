import type { Metadata, Viewport } from 'next';
import { redirect } from 'next/navigation';
import { IS_DEMO } from '@/lib/app-config';
import { Landing } from '@/components/landing/Landing';
import '../landing.css';

export const metadata: Metadata = {
  title: 'Martín Bundy · Ingeniería industrial e IA aplicada',
  description: 'Martín Bundy, Panamá. Ingeniería industrial e IA aplicada: agentes, automatización y procesos.',
  alternates: { canonical: '/', languages: { es: '/', en: '/en' } },
};

export const viewport: Viewport = {
  themeColor: '#09090A',
};

export default function Home() {
  if (IS_DEMO) {
    redirect('/demo');
  }

  return <Landing lang="es" />;
}
