'use client';

import { useEffect } from 'react';
import { mount } from './sfx';

// Arma window.SFX sobre el botón #snd del Nav. No pinta nada: el botón vive en el Nav (servidor) y las piezas
// vanilla y las figuras llaman a window.SFX directo.
export function SoundProvider() {
  useEffect(() => {
    const btn = document.getElementById('snd');
    return btn instanceof HTMLButtonElement ? mount(btn) : undefined;
  }, []);
  return null;
}
