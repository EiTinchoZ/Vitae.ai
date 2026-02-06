'use client';

import { createContext, useContext } from 'react';

export type SectionDensity = 'compact' | 'comfortable';
export type SectionWidth = '4xl' | '5xl' | '6xl';

export interface SectionLayoutConfig {
  density?: SectionDensity;
  containerWidth?: SectionWidth;
}

const SectionLayoutContext = createContext<SectionLayoutConfig | null>(null);

export function SectionLayoutProvider({
  value,
  children,
}: {
  value: SectionLayoutConfig;
  children: React.ReactNode;
}) {
  return (
    <SectionLayoutContext.Provider value={value}>
      {children}
    </SectionLayoutContext.Provider>
  );
}

export function useSectionLayout() {
  return useContext(SectionLayoutContext);
}

