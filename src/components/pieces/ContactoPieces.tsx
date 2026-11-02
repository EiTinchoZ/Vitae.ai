'use client';
import { useEffect } from 'react';
import { contactoUI } from '@/content/es/contacto';
import { mount } from './contacto';
export function ContactoPieces() {
  useEffect(() => {
    const sec = document.getElementById('contacto');
    return sec ? mount(sec, contactoUI) : undefined;
  }, []);
  return null;
}
