import html from '@/content/es/trayectoria';
import { MetroMap } from '@/components/pieces/MetroMap';
import { Section } from './Section';

export function Trayectoria() {
  return (
    <>
      <Section id="trayectoria" className="map" tone="#F5B700" html={html} />
      <MetroMap />
    </>
  );
}
