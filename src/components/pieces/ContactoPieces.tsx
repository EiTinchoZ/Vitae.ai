'use client';
import { useEffect } from 'react';
import { contactoUI as contactoUIEs } from '@/content/es/contacto';
import { contactoUI as contactoUIEn } from '@/content/en/contacto';
import type { Lang } from '@/content/lang';
import { mount } from './contacto';
export function ContactoPieces({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  const contactoUI = en ? contactoUIEn : contactoUIEs;
  useEffect(() => {
    const sec = document.getElementById('contacto');
    return sec ? mount(sec, contactoUI) : undefined;
  }, [contactoUI]);
  return null;
}
