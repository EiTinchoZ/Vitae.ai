'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Lock,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n';
import type { CVData } from '@/types';

interface DemoPreviewProps {
  cvData: Partial<CVData>;
  onReset: () => void;
}

export function DemoPreview({ cvData, onReset }: DemoPreviewProps) {
  const { t, tArray } = useTranslation();
  const fallbackSkills = tArray('demo.preview.fallbacks.skills');

  const fullName =
    cvData.personal?.fullName ||
    cvData.personal?.name ||
    t('demo.preview.fallbacks.fullName');
  const location =
    cvData.personal?.location || t('demo.preview.fallbacks.location');
  const email = cvData.personal?.email || t('demo.preview.fallbacks.email');
  const linkedin = cvData.personal?.linkedin || t('demo.form.defaults.linkedin');
  const github = cvData.personal?.github || t('demo.form.defaults.github');
  const profile = cvData.profile || t('demo.preview.fallbacks.profile');

  const skills =
    cvData.skills && cvData.skills.length > 0
      ? cvData.skills.slice(0, 8).map((skill) => skill.name)
      : fallbackSkills.length > 0
        ? fallbackSkills
        : ['AI', 'Machine Learning', 'Python', 'Data', 'Automation', 'Analytics'];

  const experience = cvData.experience?.[0];
  const education = cvData.education?.[0];

  return (
    <section className="relative">
      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 rotate-[-20deg] text-[12rem] font-black text-primary/5">
          DEMO
        </div>
        <div className="absolute bottom-0 right-0 rotate-[-20deg] text-[10rem] font-black text-primary/5">
          VITAE
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Button variant="ghost" className="gap-2" onClick={onReset}>
            <ArrowLeft className="h-4 w-4" />
            {t('demo.preview.back')}
          </Button>
          <Badge className="gap-2" variant="secondary">
            <Sparkles className="h-4 w-4" />
            {t('demo.preview.badge')}
          </Badge>
        </div>

        {/* Hero */}
        <Card className="relative overflow-hidden border-border">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
          <CardContent className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{fullName}</h2>
                <p className="text-muted-foreground max-w-xl">{profile}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    {email}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <a href={linkedin} className="flex items-center gap-2 text-primary" target="_blank" rel="noreferrer">
                  <Linkedin className="h-4 w-4" />
                  {t('demo.preview.links.linkedin')}
                </a>
                <a href={github} className="flex items-center gap-2 text-primary" target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  {t('demo.preview.links.github')}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Sections */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('demo.preview.sections.summary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{profile}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('demo.preview.sections.skills')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('demo.preview.sections.experience')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {experience ? (
                <>
                  <p className="font-semibold">{experience.position}</p>
                  <p className="text-sm text-muted-foreground">
                    {experience.company} · {experience.startPeriod} - {experience.endPeriod}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {experience.responsibilities?.slice(0, 2).join(' · ') ||
                      t('demo.preview.fallbacks.achievements')}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t('demo.preview.empty.experience')}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('demo.preview.sections.education')}</CardTitle>
            </CardHeader>
            <CardContent>
              {education ? (
                <>
                  <p className="font-semibold">{education.title}</p>
                  <p className="text-sm text-muted-foreground">{education.institution}</p>
                  <p className="text-xs text-muted-foreground">{education.endYear}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t('demo.preview.empty.education')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Locked Sections */}
          <LockedCard title={t('demo.preview.locked.projects')} label={t('demo.preview.locked.label')} />
          <LockedCard title={t('demo.preview.locked.certificates')} label={t('demo.preview.locked.label')} />
          <LockedCard title={t('demo.preview.locked.insights')} label={t('demo.preview.locked.label')} />
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">{t('demo.preview.cta.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('demo.preview.cta.description')}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <a
                  href="https://github.com/EiTinchoZ/vitae-ai"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('demo.preview.cta.install')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a
                  href="https://github.com/EiTinchoZ/vitae-ai/blob/main/INSTALL.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('demo.preview.cta.guide')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function LockedCard({ title, label }: { title: string; label: string }) {
  return (
    <Card className="relative overflow-hidden border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 w-3/4 rounded-full bg-muted" />
          <div className="h-3 w-2/3 rounded-full bg-muted" />
          <div className="h-3 w-1/2 rounded-full bg-muted" />
        </div>
      </CardContent>
      <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
    </Card>
  );
}
