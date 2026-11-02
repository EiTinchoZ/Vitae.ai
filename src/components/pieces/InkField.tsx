'use client';

import { useEffect, useRef } from 'react';
import { mount } from './ink-field';

export function InkField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => mount(ref.current!), []);
  return <canvas id="field" ref={ref} aria-hidden="true" />;
}
