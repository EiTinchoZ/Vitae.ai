'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { SectionQA } from '@/components/ai/SectionQA';
import { Badge } from '@/components/ui/badge';
import { getCvData } from '@/data/cv-data';
import { useTranslation } from '@/i18n';

export function Education() {
  const { t, tArray, language } = useTranslation();
  const cvData = getCvData(language);

  const suggestedQuestions = tArray('qa.suggestions.education');

  return (
    <SectionWrapper id="education">
      <SectionTitle
        subtitle={t('education.subtitle')}
        action={<SectionQA section="education" suggestedQuestions={suggestedQuestions} />}
      >
        {t('education.title')}
      </SectionTitle>

      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          {/* Education items */}
          {cvData.education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-20 pb-12 last:pb-0"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-6 w-5 h-5 rounded-full border-4 border-background ${
                  edu.status === 'completed'
                    ? 'bg-green-500'
                    : 'bg-primary animate-pulse'
                }`}
              />

              {/* Content card */}
              <div className="bg-muted/30 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{edu.title}</h3>
                  </div>
                  <Badge
                    variant={edu.status === 'completed' ? 'default' : 'secondary'}
                    className="gap-1"
                  >
                    {edu.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        {t('education.completed')}
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" />
                        {t('education.inProgress')}
                      </>
                    )}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-2">{edu.institution}</p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {edu.startYear ? `${edu.startYear} - ` : ''}
                  {typeof edu.endYear === 'number'
                    ? edu.endYear
                    : `${t('education.completionLabel')}: ${edu.endYear}`}
                </div>

                {edu.description && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {edu.description}
                  </p>
                )}

                {/* Progress bar for in-progress education */}
                {edu.status === 'in_progress' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{t('education.estimatedProgress')}</span>
                      <span>
                        {edu.id === 'edu-2' ? '15%' : '10%'}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: edu.id === 'edu-2' ? '15%' : '10%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
