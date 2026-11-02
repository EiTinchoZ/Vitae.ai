import html from '@/content/es/contacto';
import { ContactoPieces } from '@/components/pieces/ContactoPieces';
import { Section } from './Section';

export function Contacto() {
  return (
    <>
      <Section id="contacto" className="contact" tone="#FF5A14" html={html} />
      <ContactoPieces />
    </>
  );
}
