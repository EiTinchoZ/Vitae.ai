'use client';

import { useEffect } from 'react';
import { steps as stepsEs, ui as uiEs } from '@/content/es/hoy';
import { steps as stepsEn, ui as uiEn } from '@/content/en/hoy';
import type { Lang } from '@/content/lang';
import { mount } from './hoy-steps';

// Monta los hitos de Philips sobre el marcado estático de #hoy (servidor). No pinta nada.
export function HoySteps({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  const steps = en ? stepsEn : stepsEs;
  const ui = en ? uiEn : uiEs;
  useEffect(() => {
    const sec = document.getElementById('hoy');
    return sec ? mount(sec, { steps, ui }) : undefined;
  }, [steps, ui]);
  return null;
}
