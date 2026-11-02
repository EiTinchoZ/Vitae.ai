import html from '@/content/es/proyectos';
import { ProjectBelt } from '@/components/pieces/ProjectBelt';
import { Section } from './Section';

export function Proyectos() {
  return (
    <>
      <Section id="proyectos" className="prj" tone="#FF5A14" html={html} />
      <ProjectBelt />
    </>
  );
}
