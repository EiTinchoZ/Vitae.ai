'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { mount } from './decode-title';

// <main> de la landing: los títulos .dec de las secciones que envuelve se arman al verse.
export function DecodeTitles({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => mount(ref.current!), []);
  return <main ref={ref}>{children}</main>;
}
