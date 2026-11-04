'use client';

import { useEffect } from 'react';
import { mount } from './film-screen';

// Activa el reproductor sobre el marcado estático de #pelicula (servidor).
export function FilmScreen() {
  useEffect(() => {
    const sec = document.getElementById('pelicula');
    return sec ? mount(sec) : undefined;
  }, []);
  return null;
}
