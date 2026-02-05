'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Power } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { IS_DEMO } from '@/lib/app-config';

interface PersonalIntroGateProps {
  children: React.ReactNode;
}

export function PersonalIntroGate({ children }: PersonalIntroGateProps) {
  const { t } = useTranslation();
  const [isReady, setIsReady] = useState(IS_DEMO);
  const [isStarting, setIsStarting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (IS_DEMO) return;
    const cached = sessionStorage.getItem('vitae-intro-ready');
    if (cached === '1') {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isStarting) return;

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 6;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsReady(true);
          sessionStorage.setItem('vitae-intro-ready', '1');
        }, 300);
      }
      setProgress(current);
    }, 120);

    return () => clearInterval(interval);
  }, [isStarting]);

  if (IS_DEMO) {
    return <>{children}</>;
  }

  return (
    <>
      {!isReady && (
        <div className="fixed inset-0 z-[60] bg-background">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_45%)]" />
          </div>

          <div className="relative h-full flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl rounded-2xl border bg-background/80 backdrop-blur-xl p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Power className="h-7 w-7" />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {t('intro.title')}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {t('intro.subtitle')}
              </p>

              <div className="mt-8">
                {!isStarting ? (
                  <button
                    type="button"
                    onClick={() => setIsStarting(true)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium',
                      'bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                    {t('intro.cta')}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-primary">
                      {t('intro.loadingTitle')}
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('intro.progressLabel').replace('{progress}', String(progress))}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {isReady && children}
    </>
  );
}
