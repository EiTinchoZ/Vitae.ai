'use client';

import { useEffect } from 'react';
import { mount } from './iso-figure';

type Props = { section: string; name: string; lang?: 'es' | 'en' };

// Trae la figura <name> donde el marcado estático de #<section> deja <!--fig:name-->. No pinta nada.
export function IsoFigure({ section, name, lang = 'es' }: Props) {
  useEffect(() => {
    const sec = document.getElementById(section);
    return sec ? mount(sec, name, lang) : undefined;
  }, [section, name, lang]);
  return null;
}
