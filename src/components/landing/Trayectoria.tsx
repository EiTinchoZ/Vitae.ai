import es from '@/content/es/trayectoria';
import en from '@/content/en/trayectoria';
import type { Lang } from '@/content/lang';
import { MetroMap } from '@/components/pieces/MetroMap';
import { Section } from './Section';

export function Trayectoria({ lang }: { lang: Lang }) {
  return (
    <>
      <Section id="trayectoria" className="map" tone="#F5B700" html={lang === 'en' ? en : es} />
      <MetroMap lang={lang} />
    </>
  );
}
