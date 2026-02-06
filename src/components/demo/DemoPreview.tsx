'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  ExternalLink,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Palette,
  Layout,
  SlidersHorizontal,
  Grid3X3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { REPO_URL } from '@/lib/app-config';
import { CvDataProvider } from '@/lib/cv-data-context';
import { SectionLayoutProvider } from '@/lib/section-layout-context';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Education } from '@/components/sections/Education';
import { Certificates } from '@/components/sections/Certificates';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';
import type { CVData } from '@/types';

type Accent = 'blue' | 'emerald' | 'amber' | 'violet';
type Density = 'compact' | 'comfortable';
type CardStyle = 'solid' | 'glass';
type SectionKey =
  | 'hero'
  | 'about'
  | 'skills'
  | 'education'
  | 'certificates'
  | 'projects'
  | 'experience'
  | 'contact';

interface DemoPreviewProps {
  cvData: Partial<CVData>;
  onReset: () => void;
}

export function DemoPreview({ cvData, onReset }: DemoPreviewProps) {
  const { t } = useTranslation();

  const [layout, setLayout] = useState<'4xl' | '5xl' | '6xl'>('5xl');
  const [density, setDensity] = useState<Density>('comfortable');
  const [cardStyle, setCardStyle] = useState<CardStyle>('solid');
  const [accent, setAccent] = useState<Accent>('blue');
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>([
    'hero',
    'about',
    'skills',
    'education',
    'certificates',
    'projects',
    'experience',
    'contact',
  ]);
  const [visibleSections, setVisibleSections] = useState<Record<SectionKey, boolean>>({
    hero: true,
    about: true,
    skills: true,
    education: true,
    certificates: true,
    projects: true,
    experience: true,
    contact: true,
  });

  const accentStyles = useMemo(
    () => ({
      blue: {
        text: 'text-blue-500',
        border: 'border-blue-500/30',
        bg: 'bg-blue-500/10',
        badge: 'border-blue-500/30 text-blue-500 bg-blue-500/10',
        primary: 'hsl(221 83% 53%)',
        primaryForeground: 'hsl(210 40% 98%)',
      },
      emerald: {
        text: 'text-emerald-500',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/10',
        badge: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10',
        primary: 'hsl(142 71% 45%)',
        primaryForeground: 'hsl(0 0% 100%)',
      },
      amber: {
        text: 'text-amber-500',
        border: 'border-amber-500/30',
        bg: 'bg-amber-500/10',
        badge: 'border-amber-500/30 text-amber-500 bg-amber-500/10',
        primary: 'hsl(38 92% 50%)',
        primaryForeground: 'hsl(0 0% 12%)',
      },
      violet: {
        text: 'text-violet-500',
        border: 'border-violet-500/30',
        bg: 'bg-violet-500/10',
        badge: 'border-violet-500/30 text-violet-500 bg-violet-500/10',
        primary: 'hsl(262 83% 58%)',
        primaryForeground: 'hsl(210 40% 98%)',
      },
    }),
    []
  );

  const moveSection = (key: SectionKey, direction: 'up' | 'down') => {
    setSectionOrder((prev) => {
      const index = prev.indexOf(key);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const toggleSection = (key: SectionKey) => {
    setVisibleSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetCustomization = () => {
    setLayout('5xl');
    setDensity('comfortable');
    setCardStyle('solid');
    setAccent('blue');
    setSectionOrder([
      'hero',
      'about',
      'skills',
      'education',
      'certificates',
      'projects',
      'experience',
      'contact',
    ]);
    setVisibleSections({
      hero: true,
      about: true,
      skills: true,
      education: true,
      certificates: true,
      projects: true,
      experience: true,
      contact: true,
    });
  };

  const sectionLabels: Record<SectionKey, string> = {
    hero: t('demo.customize.sections.hero'),
    about: t('demo.customize.sections.about'),
    skills: t('demo.customize.sections.skills'),
    education: t('demo.customize.sections.education'),
    certificates: t('demo.customize.sections.certificates'),
    projects: t('demo.customize.sections.projects'),
    experience: t('demo.customize.sections.experience'),
    contact: t('demo.customize.sections.contact'),
  };

  const sections: Record<SectionKey, React.ReactNode> = {
    hero: <Hero />,
    about: <About />,
    skills: <Skills />,
    education: <Education />,
    certificates: <Certificates />,
    projects: <Projects />,
    experience: <Experience />,
    contact: <Contact />,
  };

  const previewStyle = useMemo(
    () =>
      ({
        '--primary': accentStyles[accent].primary,
        '--primary-foreground': accentStyles[accent].primaryForeground,
        '--ring': accentStyles[accent].primary,
      }) as CSSProperties,
    [accent, accentStyles]
  );

  return (
    <div className={cn('mx-auto space-y-8')}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'border rounded-xl p-4 text-center',
          accentStyles[accent].border,
          accentStyles[accent].bg
        )}
      >
        <div className={cn('flex items-center justify-center gap-2 font-medium', accentStyles[accent].text)}>
          <Sparkles className="h-4 w-4" />
          <span>{t('demo.preview.badge')}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t('demo.preview.notice')}
        </p>
      </motion.div>

      <Card className={cn('border-dashed')}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {t('demo.customize.title')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t('demo.customize.subtitle')}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <Layout className="h-4 w-4" />
                {t('demo.customize.layout.label')}
              </p>
              <div className="flex flex-wrap gap-2">
                {(['4xl', '5xl', '6xl'] as const).map((size) => (
                  <Button
                    key={size}
                    size="sm"
                    variant={layout === size ? 'default' : 'outline'}
                    onClick={() => setLayout(size)}
                  >
                    {t(`demo.customize.layout.${size}`)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                {t('demo.customize.density.label')}
              </p>
              <div className="flex flex-wrap gap-2">
                {(['compact', 'comfortable'] as const).map((value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={density === value ? 'default' : 'outline'}
                    onClick={() => setDensity(value)}
                  >
                    {t(`demo.customize.density.${value}`)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                {t('demo.customize.cardStyle.label')}
              </p>
              <div className="flex flex-wrap gap-2">
                {(['solid', 'glass'] as const).map((value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={cardStyle === value ? 'default' : 'outline'}
                    onClick={() => setCardStyle(value)}
                  >
                    {t(`demo.customize.cardStyle.${value}`)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                {t('demo.customize.accent.label')}
              </p>
              <div className="flex flex-wrap gap-2">
                {(['blue', 'emerald', 'amber', 'violet'] as const).map((value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={accent === value ? 'default' : 'outline'}
                    onClick={() => setAccent(value)}
                    className="gap-2"
                  >
                    <span className={cn('h-2.5 w-2.5 rounded-full', accentStyles[value].bg)} />
                    {t(`demo.customize.accent.${value}`)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">{t('demo.customize.sections.label')}</p>
            <div className="space-y-2">
              {sectionOrder.map((key, index) => (
                <div
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border bg-background"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{sectionLabels[key]}</span>
                    <Badge variant="outline" className={cn(visibleSections[key] ? '' : 'opacity-60')}>
                      {visibleSections[key]
                        ? t('demo.customize.actions.visible')
                        : t('demo.customize.actions.hidden')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleSection(key)}
                    >
                      {visibleSections[key]
                        ? t('demo.customize.actions.hide')
                        : t('demo.customize.actions.show')}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => moveSection(key, 'up')}
                      disabled={index === 0}
                      aria-label={t('demo.customize.actions.moveUp')}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => moveSection(key, 'down')}
                      disabled={index === sectionOrder.length - 1}
                      aria-label={t('demo.customize.actions.moveDown')}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={resetCustomization}>
              {t('demo.customize.actions.reset')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <SectionLayoutProvider value={{ density, containerWidth: layout }}>
        <CvDataProvider override={cvData} mode="demo">
          <div className="relative">
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-10">
              <span className="text-7xl md:text-8xl font-bold text-primary rotate-[-30deg] select-none">
                VITAE.AI DEMO
              </span>
            </div>

            <div
              className={cn('demo-preview relative z-0')}
              data-card-style={cardStyle}
              style={previewStyle}
            >
              {sectionOrder.map((key) =>
                visibleSections[key] ? <div key={key}>{sections[key]}</div> : null
              )}
            </div>
          </div>
        </CvDataProvider>
      </SectionLayoutProvider>

      <Card className={cn('bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20')}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">{t('demo.preview.cta.title')}</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('demo.preview.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('demo.preview.cta.install')}
                </a>
              </Button>
              <Button variant="outline" size="lg" onClick={onReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('demo.preview.cta.guide')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
