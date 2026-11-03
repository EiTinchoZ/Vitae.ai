'use client';

import { useEffect } from 'react';
import { card as cardEs, lidText as lidTextEs, projects as projectsEs } from '@/content/es/proyectos';
import { card as cardEn, lidText as lidTextEn, projects as projectsEn } from '@/content/en/proyectos';
import type { Lang } from '@/content/lang';
import { mount } from './project-belt';

// Monta la cinta de proyectos sobre el marcado estático de #proyectos (servidor). No pinta nada.
export function ProjectBelt({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  const card = en ? cardEn : cardEs;
  const lidText = en ? lidTextEn : lidTextEs;
  const projects = en ? projectsEn : projectsEs;
  useEffect(() => {
    const sec = document.getElementById('proyectos');
    return sec ? mount(sec, { projects, card, lidText }) : undefined;
  }, [card, lidText, projects]);
  return null;
}
