import type { Metadata, Viewport } from 'next';
import { redirect } from 'next/navigation';
import { IS_DEMO } from '@/lib/app-config';
import { Nav } from '@/components/landing/Nav';
import { Hero } from '@/components/landing/Hero';
import { Pelicula } from '@/components/landing/Pelicula';
import { Trayectoria } from '@/components/landing/Trayectoria';
import { Hoy } from '@/components/landing/Hoy';
import { Proyectos } from '@/components/landing/Proyectos';
import { Laptop } from '@/components/landing/Laptop';
import { Formacion } from '@/components/landing/Formacion';
import { Contacto } from '@/components/landing/Contacto';
import { InkField } from '@/components/pieces/InkField';
import { DecodeTitles } from '@/components/pieces/DecodeTitles';
import { SoundProvider } from '@/components/sound/SoundProvider';
import footer from '@/content/es/footer';
import './landing.css';

export const metadata: Metadata = {
  title: 'Martín Bundy · Ingeniería industrial e IA aplicada',
  description: 'Martín Bundy, Panamá. Ingeniería industrial e IA aplicada: agentes, automatización y procesos.',
};

export const viewport: Viewport = {
  themeColor: '#09090A',
};

export default function Home() {
  if (IS_DEMO) {
    redirect('/demo');
  }

  return (
    <>
      <InkField />
      <Nav />
      <SoundProvider />
      <DecodeTitles>
        <Hero />
        <Pelicula />
        <Trayectoria />
        <Hoy />
        <Proyectos />
        <Laptop />
        <Formacion />
        <Contacto />
      </DecodeTitles>
      <footer dangerouslySetInnerHTML={{ __html: footer }} />
      <div className="tip" id="tip" />
    </>
  );
}
