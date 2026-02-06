'use client';

import { createContext, useContext, useMemo } from 'react';
import { getCvData } from '@/data/cv-data';
import type { CVData } from '@/types';
import { useTranslation } from '@/i18n';
import { EMPTY_CV_DATA, mergeCvData } from '@/lib/cv-data-utils';
import { useDemoCvData } from '@/lib/demo-cv-store';
import { IS_DEMO } from '@/lib/app-config';

type CvDataMode = 'personal' | 'demo';

interface CvDataContextValue {
  override?: Partial<CVData> | null;
  mode?: CvDataMode;
}

const CvDataContext = createContext<CvDataContextValue | null>(null);

export function CvDataProvider({
  override,
  mode = 'demo',
  children,
}: {
  override?: Partial<CVData> | null;
  mode?: CvDataMode;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ override: override ?? null, mode }), [override, mode]);
  return <CvDataContext.Provider value={value}>{children}</CvDataContext.Provider>;
}

export function useCvData() {
  const { language } = useTranslation();
  const demoStored = useDemoCvData();
  const ctx = useContext(CvDataContext);

  const isDemoMode = ctx?.mode === 'demo' || IS_DEMO;
  const override = ctx?.override ?? (isDemoMode ? demoStored : null);
  const base = isDemoMode ? EMPTY_CV_DATA : getCvData(language);
  const cvData = useMemo(
    () => mergeCvData(base, override ?? undefined),
    [base, override]
  );

  return {
    cvData,
    mode: isDemoMode ? 'demo' : 'personal',
    override: override ?? null,
  };
}
