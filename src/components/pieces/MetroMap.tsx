'use client';

import { useEffect } from 'react';
import { metro as metroEs } from '@/content/es/trayectoria';
import { metro as metroEn } from '@/content/en/trayectoria';
import type { Lang } from '@/content/lang';
import { mount } from './metro-map';

// Monta el mapa de metro sobre el marcado estático de #trayectoria (servidor). No pinta nada.
export function MetroMap({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  const metro = en ? metroEn : metroEs;
  useEffect(() => {
    const sec = document.getElementById('trayectoria');
    return sec ? mount(sec, metro) : undefined;
  }, [metro]);
  return null;
}
