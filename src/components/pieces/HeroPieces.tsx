'use client';

import { useEffect } from 'react';
import { keyTips, wins, clockLocale } from '@/content/es/hero';
import { mount as mountLive } from './hero-live';
import { mount as mountKeys } from './hero-keys';

// Monta lo vivo del hero sobre el marcado estático de #top (servidor). No pinta nada.
export function HeroPieces() {
  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) return;
    const offLive = mountLive(hero, { wins, clockLocale });
    const offKeys = mountKeys(hero, keyTips);
    return () => {
      offKeys();
      offLive();
    };
  }, []);
  return null;
}
