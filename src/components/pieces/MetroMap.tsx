'use client';

import { useEffect } from 'react';
import { metro } from '@/content/es/trayectoria';
import { mount } from './metro-map';

// Monta el mapa de metro sobre el marcado estático de #trayectoria (servidor). No pinta nada.
export function MetroMap() {
  useEffect(() => {
    const sec = document.getElementById('trayectoria');
    return sec ? mount(sec, metro) : undefined;
  }, []);
  return null;
}
