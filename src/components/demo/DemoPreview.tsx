'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Linkedin,
  Github,
  Lock,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n';
import { REPO_URL } from '@/lib/app-config';
import type { CVData } from '@/types';

interface DemoPreviewProps {
  cvData: Partial<CVData>;
  onReset: () => void;
}

export function DemoPreview({ cvData, onReset }: DemoPreviewProps) {
  const { t } = useTranslation();

  const personal = cvData.personal;
  const skills = cvData.skills?.slice(0, 6) || [];
  const experience = cvData.experience?.[0];
  const education = cvData.education?.[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Watermark Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-primary font-medium">
          <Sparkles className="h-4 w-4" />
          <span>{t('demo.preview.badge')}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t('demo.preview.locked.label')}
        </p>
      </motion.div>

      {/* Preview Content */}
      <div className="relative">
        {/* Watermark Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-5">
          <span className="text-8xl font-bold text-primary rotate-[-30deg] select-none">
            VITAE.AI DEMO
          </span>
        </div>

        {/* Hero Section (Visible) */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{personal?.fullName || personal?.name || 'Your Name'}</h1>
                {cvData.profile && (
                  <p className="text-muted-foreground mt-2 line-clamp-2">{cvData.profile}</p>
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

            {/* Links */}
            {(personal?.linkedin || personal?.github) && (
              <div className="flex gap-3 mt-4">
                {personal.linkedin && (
                  <Badge variant="outline" className="gap-1">
                    <Linkedin className="h-3 w-3" />
                    {t('demo.preview.links.linkedin')}
                  </Badge>
                )}
                {personal.github && (
                  <Badge variant="outline" className="gap-1">
                    <Github className="h-3 w-3" />
                    {t('demo.preview.links.github')}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Section (Partial - 60%) */}
        {skills.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{t('skills.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
                {(cvData.skills?.length || 0) > skills.length && (
                  <Badge variant="outline" className="opacity-50 gap-1">
                    <Lock className="h-3 w-3" />
                    +{(cvData.skills?.length || 0) - skills.length} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Experience (Partial) */}
        {experience && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{t('experience.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-l-2 border-primary/30 pl-4">
                <h3 className="font-semibold">{experience.position}</h3>
                <p className="text-sm text-muted-foreground">{experience.company}</p>
                {experience.responsibilities?.slice(0, 2).map((resp, i) => (
                  <p key={i} className="text-sm mt-2">• {resp}</p>
                ))}
                {(experience.responsibilities?.length || 0) > 2 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2 opacity-50">
                    <Lock className="h-3 w-3" />
                    <span>{t('demo.preview.locked.label')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education (Partial) */}
        {education && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{t('education.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-l-2 border-primary/30 pl-4">
                <h3 className="font-semibold">{education.title}</h3>
                {education.institution && (
                  <p className="text-sm text-muted-foreground">{education.institution}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Locked Sections */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-6 text-center">
              <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="font-medium">{t('projects.title')}</p>
              <p className="text-sm text-muted-foreground">{t('demo.preview.locked.label')}</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-6 text-center">
              <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="font-medium">{t('insights.title')}</p>
              <p className="text-sm text-muted-foreground">{t('demo.preview.locked.label')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">{t('demo.preview.cta.title')}</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('demo.preview.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
