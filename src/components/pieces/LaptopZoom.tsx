'use client';

import { useEffect } from 'react';
import { zoom } from '@/content/es/laptop';
import { mount } from './laptop-zoom';

// Monta la vista de cerca sobre el marcado estático de #laptop (servidor). No pinta nada.
export function LaptopZoom() {
  useEffect(() => {
    const sec = document.getElementById('laptop');
    return sec ? mount(sec, zoom) : undefined;
  }, []);
  return null;
}
