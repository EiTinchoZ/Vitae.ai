'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, GraduationCap, Briefcase, Languages } from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { InsightsDashboard } from '@/components/ai/InsightsDashboard';
import { ResumeAnalyzer } from '@/components/ai/ResumeAnalyzer';
import { getCvData } from '@/data/cv-data';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';

export function About() {
  const { t, language } = useTranslation();
  const cvData = getCvData(language);

  const highlights = [
    {
      icon: GraduationCap,
      label: t('about.highlights.education'),
      value: cvData.about.highlights.educationValue,
    },
    {
      icon: Briefcase,
      label: t('about.highlights.specialization'),
      value: cvData.about.highlights.specializationValue,
    },
    {
      icon: MapPin,
      label: t('about.highlights.location'),
      value: cvData.about.highlights.locationValue,
    },
    {
      icon: Languages,
      label: t('about.highlights.languages'),
      value: cvData.about.highlights.languagesValue,
    },
  ];

  return (
    <SectionWrapper id="about">
      <SectionTitle subtitle={t('about.subtitle')}>
        {t('about.title')}
      </SectionTitle>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Profile text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground leading-relaxed mb-6">
            {cvData.profile}
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Specialties */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-muted/30 rounded-2xl p-6"
        >
          {cvData.about.image && (
            <div className="mb-6">
              <div
                className={cn(
                  'grid gap-4',
                  cvData.about.imageSecondary ? 'sm:grid-cols-2' : 'grid-cols-1'
                )}
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-background">
                    <Image
                      src={cvData.about.image}
                      alt={cvData.about.imageAlt ?? 'Martin Bundy'}
                      fill
                      className={cn('object-cover')}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  {cvData.about.imageAlt && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {cvData.about.imageAlt}
                    </p>
                  )}
                </div>

                {cvData.about.imageSecondary && (
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-background">
                      <Image
                        src={cvData.about.imageSecondary}
                        alt={cvData.about.imageSecondaryAlt ?? 'Martin Bundy'}
                        fill
                        className={cn('object-cover')}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {cvData.about.imageSecondaryAlt && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {cvData.about.imageSecondaryAlt}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <h3 className="text-lg font-semibold mb-4">{t('about.specialtiesTitle')}</h3>
          <div className="flex flex-wrap gap-2">
            {cvData.about.specialties.map((specialty, index) => (
              <motion.span
                key={specialty}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-4 py-2 bg-background rounded-full text-sm font-medium border hover:border-primary/50 transition-colors cursor-default"
              >
                {specialty}
              </motion.span>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground italic">
              &ldquo;{cvData.about.quote}&rdquo;
            </p>
          </div>
        </motion.div>
      </div>

      {/* AI Insights Dashboard */}
      <InsightsDashboard />

      {/* Resume Analyzer */}
      <ResumeAnalyzer />
    </SectionWrapper>
  );
}
