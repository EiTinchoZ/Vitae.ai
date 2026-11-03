'use client';
import { useEffect } from 'react';
import { formacionUI as formacionUIEs } from '@/content/es/formacion';
import { formacionUI as formacionUIEn } from '@/content/en/formacion';
import type { Lang } from '@/content/lang';
import { mount } from './formacion';
export function FormacionPieces({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  const formacionUI = en ? formacionUIEn : formacionUIEs;
  useEffect(() => {
    const sec = document.getElementById('formacion');
    return sec ? mount(sec, formacionUI) : undefined;
  }, [formacionUI]);
  return null;
}
