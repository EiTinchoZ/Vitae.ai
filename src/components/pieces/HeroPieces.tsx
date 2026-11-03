'use client';

import { useEffect } from 'react';
import { keyTips as keyTipsEs, wins as winsEs, clockLocale as clockLocaleEs } from '@/content/es/hero';
import { keyTips as keyTipsEn, wins as winsEn, clockLocale as clockLocaleEn } from '@/content/en/hero';
import type { Lang } from '@/content/lang';
import { mount as mountLive } from './hero-live';
import { mount as mountKeys } from './hero-keys';

// Monta lo vivo del hero sobre el marcado estático de #top (servidor). No pinta nada.
export function HeroPieces({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  const keyTips = en ? keyTipsEn : keyTipsEs;
  const wins = en ? winsEn : winsEs;
  const clockLocale = en ? clockLocaleEn : clockLocaleEs;
  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) return;
    const offLive = mountLive(hero, { wins, clockLocale });
    const offKeys = mountKeys(hero, keyTips);
    return () => {
      offKeys();
      offLive();
    };
  }, [keyTips, wins, clockLocale]);
  return null;
}
