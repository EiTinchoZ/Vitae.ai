'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Linkedin,
  Github,
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
  const about = cvData.about;
  const skills = cvData.skills ?? [];
  const experience = cvData.experience ?? [];
  const education = cvData.education ?? [];
  const projects = cvData.projects ?? [];
  const certificates = cvData.certificates ?? [];
  const languages = cvData.languages ?? [];

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
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-10">
          <span className="text-7xl md:text-8xl font-bold text-primary rotate-[-30deg] select-none">
            VITAE.AI DEMO
          </span>
        </div>

        <div className="relative z-0 space-y-6">
          {/* Hero Section */}
          <Card>
            <CardContent className="pt-6">
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

          {/* About / Quote */}
          {(about?.quote || about?.specialties?.length) && (
            <Card>
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
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <Card>
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
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('experience.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-primary/30 pl-4">
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
          )}

          {/* Education */}
          {education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('education.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-primary/30 pl-4">
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
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('projects.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border-l-2 border-primary/30 pl-4">
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
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <Card>
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
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <Card>
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
          )}
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
