'use client';
import { useEffect } from 'react';
import { formacionUI } from '@/content/es/formacion';
import { mount } from './formacion';
export function FormacionPieces() {
  useEffect(() => {
    const sec = document.getElementById('formacion');
    return sec ? mount(sec, formacionUI) : undefined;
  }, []);
  return null;
}
