'use client';

import { useEffect } from 'react';
import { steps, ui } from '@/content/es/hoy';
import { mount } from './hoy-steps';

// Monta los hitos de Philips sobre el marcado estático de #hoy (servidor). No pinta nada.
export function HoySteps() {
  useEffect(() => {
    const sec = document.getElementById('hoy');
    return sec ? mount(sec, { steps, ui }) : undefined;
  }, []);
  return null;
}
