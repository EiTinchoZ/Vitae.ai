import es from '@/content/es/proyectos';
import en from '@/content/en/proyectos';
import type { Lang } from '@/content/lang';
import { ProjectBelt } from '@/components/pieces/ProjectBelt';
import { Section } from './Section';

export function Proyectos({ lang }: { lang: Lang }) {
  return (
    <>
      <Section id="proyectos" className="prj" tone="#FF5A14" html={lang === 'en' ? en : es} />
      <ProjectBelt lang={lang} />
    </>
  );
}
