'use client';

import { useEffect } from 'react';
import { zoom as zoomEs } from '@/content/es/laptop';
import { zoom as zoomEn } from '@/content/en/laptop';
import type { Lang } from '@/content/lang';
import { mount } from './laptop-zoom';

// Monta la vista de cerca sobre el marcado estático de #laptop (servidor). No pinta nada.
export function LaptopZoom({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  const zoom = en ? zoomEn : zoomEs;
  useEffect(() => {
    const sec = document.getElementById('laptop');
    return sec ? mount(sec, zoom) : undefined;
  }, [zoom]);
  return null;
}
