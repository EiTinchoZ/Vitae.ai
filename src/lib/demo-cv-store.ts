'use client';

import { useEffect, useState } from 'react';
import type { CVData } from '@/types';

const STORAGE_KEY = 'vitae-demo-cv';
const listeners = new Set<() => void>();

export function setDemoCvData(data: Partial<CVData> | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!data) {
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (error) {
    console.warn('Failed to persist demo CV data', error);
  }
  listeners.forEach((listener) => listener());
}

export function getDemoCvData(): Partial<CVData> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<CVData>;
  } catch (error) {
    console.warn('Failed to read demo CV data', error);
    return null;
  }
}

export function useDemoCvData() {
  const [data, setData] = useState<Partial<CVData> | null>(() => getDemoCvData());

  useEffect(() => {
    const handle = () => setData(getDemoCvData());
    listeners.add(handle);
    return () => {
      listeners.delete(handle);
    };
  }, []);

  return data;
}

