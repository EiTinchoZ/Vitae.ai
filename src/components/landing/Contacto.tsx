import es from '@/content/es/contacto';
import en from '@/content/en/contacto';
import type { Lang } from '@/content/lang';
import { ContactoPieces } from '@/components/pieces/ContactoPieces';
import { Section } from './Section';

export function Contacto({ lang }: { lang: Lang }) {
  return (
    <>
      <Section id="contacto" className="contact" tone="#FF5A14" html={lang === 'en' ? en : es} />
      <ContactoPieces lang={lang} />
    </>
  );
}
