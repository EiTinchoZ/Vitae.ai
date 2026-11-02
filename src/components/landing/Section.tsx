type SectionProps = {
  id: string;
  className: string;
  tone: string;
  html: string;
};

// Sección de la landing: React pone el contenedor y el tono; el interior es el marcado
// estático de src/content, sobre el que se montan las piezas vanilla de cada paso.
export function Section({ id, className, tone, html }: SectionProps) {
  return <section id={id} className={className} data-tone={tone} dangerouslySetInnerHTML={{ __html: html }} />;
}
