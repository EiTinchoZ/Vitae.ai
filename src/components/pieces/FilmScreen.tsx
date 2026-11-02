'use client';

import { useEffect } from 'react';
import { mount } from './film-screen';

// Monta la pantalla de la película sobre el marcado estático de #pelicula (servidor). No pinta nada.
export function FilmScreen() {
  useEffect(() => {
    const sec = document.getElementById('pelicula');
    return sec ? mount(sec) : undefined;
  }, []);
  return null;
}
