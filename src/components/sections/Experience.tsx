'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { SectionQA } from '@/components/ai/SectionQA';
import { Badge } from '@/components/ui/badge';
import { getCvData } from '@/data/cv-data';
import { useTranslation } from '@/i18n';
import { IS_DEMO } from '@/lib/app-config';

export function Experience() {
  const { t, tArray, language } = useTranslation();
  const cvData = getCvData(language);

  const suggestedQuestions = tArray('qa.suggestions.experience');
  const preferredOrder = ['exp-2', 'exp-1', 'exp-deta'];
  const experienceItems = [...cvData.experience].sort((a, b) => {
    const indexA = preferredOrder.indexOf(a.id);
    const indexB = preferredOrder.indexOf(b.id);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <SectionWrapper id="experience" className="bg-muted/20">
      <SectionTitle
        subtitle={t('experience.subtitle')}
        action={<SectionQA section="experience" suggestedQuestions={suggestedQuestions} />}
      >
        {t('experience.title')}
      </SectionTitle>

      {(() => {
        const Timeline = (
          <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          {/* Experience items */}
          {experienceItems.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-20 pb-12 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-6 w-5 h-5 rounded-full border-4 border-background bg-primary" />

              {/* Content card */}
              <div className="bg-background rounded-xl p-6 border hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                    </div>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  {exp.duration && (
                    <Badge variant="outline">{exp.duration}</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {exp.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {exp.startPeriod} - {exp.endPeriod}
                  </div>
                </div>

                {/* Responsibilities */}
                <ul className="space-y-2 mb-4">
                  {exp.responsibilities.map((resp, respIndex) => (
                    <motion.li
                      key={respIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: respIndex * 0.1 }}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {resp}
                    </motion.li>
                  ))}
                </ul>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        );

        if (IS_DEMO) {
          return (
            <div className="max-w-4xl mx-auto">
              {Timeline}
            </div>
          );
        }

        return (
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <div className="relative overflow-hidden rounded-2xl border bg-muted/20">
                  <Image
                    src="/certificates-highlight.jpg"
                    alt="Martin Bundy recibiendo un diploma"
                    width={1400}
                    height={900}
                    className="h-[520px] w-full object-cover object-[50%_25%]"
                    priority
                  />
                </div>
                <div className="mt-12 relative overflow-hidden rounded-2xl border bg-muted/20">
                  <Image
                    src="/experience-secondary.png"
                    alt="Martin Bundy en una actividad profesional"
                    width={1400}
                    height={900}
                    className="h-[420px] w-full object-contain bg-background"
                  />
                </div>
              </div>
            </motion.div>
            <div className="max-w-4xl">
              {Timeline}
            </div>
          </div>
        );
      })()}
    </SectionWrapper>
  );
}
