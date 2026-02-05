'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Linkedin,
  Github,
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
import type { CVData } from '@/types';

type Accent = 'blue' | 'emerald' | 'amber' | 'violet';
type Density = 'compact' | 'comfortable';
type CardStyle = 'solid' | 'glass';
type SectionKey =
  | 'hero'
  | 'about'
  | 'skills'
  | 'experience'
  | 'education'
  | 'projects'
  | 'certificates'
  | 'languages';

interface DemoPreviewProps {
  cvData: Partial<CVData>;
  onReset: () => void;
}

export function DemoPreview({ cvData, onReset }: DemoPreviewProps) {
  const { t } = useTranslation();

  const personal = cvData.personal;
  const about = cvData.about;
  const skills = cvData.skills ?? [];
  const experience = cvData.experience ?? [];
  const education = cvData.education ?? [];
  const projects = cvData.projects ?? [];
  const certificates = cvData.certificates ?? [];
  const languages = cvData.languages ?? [];

  const [layout, setLayout] = useState<'4xl' | '5xl' | '6xl'>('4xl');
  const [density, setDensity] = useState<Density>('comfortable');
  const [cardStyle, setCardStyle] = useState<CardStyle>('solid');
  const [accent, setAccent] = useState<Accent>('blue');
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>([
    'hero',
    'about',
    'skills',
    'experience',
    'education',
    'projects',
    'certificates',
    'languages',
  ]);
  const [visibleSections, setVisibleSections] = useState<Record<SectionKey, boolean>>({
    hero: true,
    about: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
    certificates: true,
    languages: true,
  });

  const accentStyles = useMemo(
    () => ({
      blue: {
        text: 'text-blue-500',
        border: 'border-blue-500/30',
        bg: 'bg-blue-500/10',
        badge: 'border-blue-500/30 text-blue-500 bg-blue-500/10',
      },
      emerald: {
        text: 'text-emerald-500',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/10',
        badge: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10',
      },
      amber: {
        text: 'text-amber-500',
        border: 'border-amber-500/30',
        bg: 'bg-amber-500/10',
        badge: 'border-amber-500/30 text-amber-500 bg-amber-500/10',
      },
      violet: {
        text: 'text-violet-500',
        border: 'border-violet-500/30',
        bg: 'bg-violet-500/10',
        badge: 'border-violet-500/30 text-violet-500 bg-violet-500/10',
      },
    }),
    []
  );

  const containerClass =
    layout === '6xl' ? 'max-w-6xl' : layout === '5xl' ? 'max-w-5xl' : 'max-w-4xl';
  const sectionGap = density === 'compact' ? 'space-y-4' : 'space-y-8';
  const cardPadding = density === 'compact' ? 'p-4' : 'p-6';
  const cardClass = cn(
    'border rounded-xl transition-colors',
    cardStyle === 'glass'
      ? 'bg-background/60 backdrop-blur border-primary/10'
      : 'bg-muted/30'
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
    setLayout('4xl');
    setDensity('comfortable');
    setCardStyle('solid');
    setAccent('blue');
    setSectionOrder([
      'hero',
      'about',
      'skills',
      'experience',
      'education',
      'projects',
      'certificates',
      'languages',
    ]);
    setVisibleSections({
      hero: true,
      about: true,
      skills: true,
      experience: true,
      education: true,
      projects: true,
      certificates: true,
      languages: true,
    });
  };

  const sectionLabels: Record<SectionKey, string> = {
    hero: t('demo.customize.sections.hero'),
    about: t('demo.customize.sections.about'),
    skills: t('demo.customize.sections.skills'),
    experience: t('demo.customize.sections.experience'),
    education: t('demo.customize.sections.education'),
    projects: t('demo.customize.sections.projects'),
    certificates: t('demo.customize.sections.certificates'),
    languages: t('demo.customize.sections.languages'),
  };

  const sections: Record<SectionKey, React.ReactNode> = {
    hero: (
      <Card className={cardClass}>
        <CardContent className={cardPadding}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {personal?.fullName || personal?.name || t('demo.preview.fallbacks.fullName')}
              </h1>
              {cvData.profile && (
                <p className="text-muted-foreground mt-2">{cvData.profile}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              {personal?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{personal.email}</span>
                </div>
              )}
              {personal?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{personal.location}</span>
                </div>
              )}
            </div>
          </div>

          {(personal?.linkedin || personal?.github) && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {personal.linkedin && (
                <Badge variant="outline" className={cn('gap-1', accentStyles[accent].badge)}>
                  <Linkedin className="h-3 w-3" />
                  {t('demo.preview.links.linkedin')}
                </Badge>
              )}
              {personal.github && (
                <Badge variant="outline" className={cn('gap-1', accentStyles[accent].badge)}>
                  <Github className="h-3 w-3" />
                  {t('demo.preview.links.github')}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    ),
    about: (about?.quote || about?.specialties?.length) && (
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-lg">{t('about.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {about?.quote && (
            <p className="text-muted-foreground italic">“{about.quote}”</p>
          )}
          {about?.specialties?.length ? (
            <div className="flex flex-wrap gap-2">
              {about.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    ),
    skills: skills.length > 0 && (
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-lg">{t('skills.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <Badge key={`${skill.name}-${i}`} variant="secondary">
                {skill.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    ),
    experience: experience.length > 0 && (
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-lg">{t('experience.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className={cn('border-l-2 pl-4', accentStyles[accent].border)}>
              <h3 className="font-semibold">{exp.position}</h3>
              <p className="text-sm text-muted-foreground">
                {exp.company} · {exp.startPeriod} - {exp.endPeriod}
              </p>
              {exp.responsibilities?.length ? (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>• {resp}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    ),
    education: education.length > 0 && (
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-lg">{t('education.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className={cn('border-l-2 pl-4', accentStyles[accent].border)}>
              <h3 className="font-semibold">{edu.title}</h3>
              {edu.institution && (
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {edu.startYear ? `${edu.startYear} - ` : ''}
                {edu.endYear}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    ),
    projects: projects.length > 0 && (
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-lg">{t('projects.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className={cn('border-l-2 pl-4', accentStyles[accent].border)}>
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm text-muted-foreground">
                {project.event ? `${project.event} · ` : ''}{project.year}
              </p>
              {project.shortDescription && (
                <p className="text-sm text-muted-foreground mt-2">
                  {project.shortDescription}
                </p>
              )}
              {project.features?.length ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.features.map((feature, i) => (
                    <Badge key={`${project.id}-feature-${i}`} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    ),
    certificates: certificates.length > 0 && (
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-lg">{t('certificates.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-muted-foreground">{cert.institution}</p>
              </div>
              <Badge variant={cert.status === 'completed' ? 'default' : 'secondary'}>
                {cert.period}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    ),
    languages: languages.length > 0 && (
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-lg">{t('languages.title')}</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          {languages.map((lang) => (
            <div key={lang.id} className="p-3 rounded-lg bg-muted/30">
              <p className="font-medium">{lang.name}</p>
              <p className="text-sm text-muted-foreground">{lang.level}</p>
              {lang.description && (
                <p className="text-xs text-muted-foreground mt-1">{lang.description}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    ),
  };

  return (
    <div className={cn(containerClass, 'mx-auto space-y-8')}>
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
          {t('demo.preview.locked.label')}
        </p>
      </motion.div>

      <Card className={cn(cardClass, 'border-dashed')}>
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

      <div className="relative">
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-10">
          <span className="text-7xl md:text-8xl font-bold text-primary rotate-[-30deg] select-none">
            VITAE.AI DEMO
          </span>
        </div>

        <div className={cn('relative z-0', sectionGap)}>
          {sectionOrder.map((key) =>
            visibleSections[key] ? <div key={key}>{sections[key]}</div> : null
          )}
        </div>
      </div>

      <Card className={cn('bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20')}>
        <CardContent className={cardPadding}>
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
