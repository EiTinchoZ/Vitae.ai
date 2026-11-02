'use client';

import { useEffect } from 'react';
import { card, lidText, projects } from '@/content/es/proyectos';
import { mount } from './project-belt';

// Monta la cinta de proyectos sobre el marcado estático de #proyectos (servidor). No pinta nada.
export function ProjectBelt() {
  useEffect(() => {
    const sec = document.getElementById('proyectos');
    return sec ? mount(sec, { projects, card, lidText }) : undefined;
  }, []);
  return null;
}
