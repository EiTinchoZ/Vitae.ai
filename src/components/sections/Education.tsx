'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { GraduationCap, Calendar, CheckCircle2, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { useCvData } from '@/lib/cv-data-context';
import { useTranslation } from '@/i18n';
import { IS_DEMO } from '@/lib/app-config';

const SectionQA = dynamic(
  () => import('@/components/ai/SectionQA').then(m => m.SectionQA),
  { ssr: false }
);

export function Education() {
  const { t, tArray } = useTranslation();
  const { cvData } = useCvData();

  const suggestedQuestions = tArray('qa.suggestions.education');
  const timelineById: Record<string, { startDate: string; endDate: string }> = {
    'edu-2': { startDate: '2025-01-01', endDate: '2026-12-31' },
    'edu-3': { startDate: '2025-01-01', endDate: '2027-04-30' },
  };
  const minProgressById: Record<string, number> = {
    'edu-2': 65,
    'edu-3': 55,
  };

  const [now] = useState(Date.now);
  const computeProgress = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
    const elapsed = Math.min(Math.max(now - start, 0), end - start);
    return Math.round((elapsed / (end - start)) * 100);
  };

  const educationCards = (
    <div className="space-y-5">
      {cvData.education.map((edu, index) => (
        <motion.article
          key={edu.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
          className="rounded-[2rem] border bg-card/80 p-6 md:p-8 nura-hover-card"
          style={{ borderColor: 'oklch(0.282 0.038 152 / 0.18)' }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p
                className="text-xs uppercase tracking-[0.22em]"
                style={{
                  color: 'oklch(0.282 0.038 152 / 0.75)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                }}
              >
                {edu.institution}
              </p>
              <h3
                className="font-bold leading-tight text-xl md:text-2xl"
                style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
              >
                {edu.title}
              </h3>
            </div>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-[0.12em] uppercase"
              style={
                edu.status === 'completed'
                  ? {
                      backgroundColor: 'rgba(52,211,153,0.14)',
                      border: '1px solid rgba(52,211,153,0.36)',
                      color: 'rgb(5,150,105)',
                      fontFamily: 'var(--font-geist-mono), monospace',
                    }
                  : {
                      backgroundColor: 'rgba(204,88,51,0.14)',
                      border: '1px solid rgba(204,88,51,0.36)',
                      color: 'oklch(0.565 0.158 37)',
                      fontFamily: 'var(--font-geist-mono), monospace',
                    }
              }
            >
              {edu.status === 'completed' ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Clock className="h-3.5 w-3.5" />
              )}
              {edu.status === 'completed' ? t('education.completed') : t('education.inProgress')}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              {edu.institution}
            </span>
            <span
              className="opacity-40"
              style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
            >
              -
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {edu.startYear ? `${edu.startYear} - ` : ''}
              {typeof edu.endYear === 'number'
                ? edu.endYear
                : `${t('education.completionLabel')}: ${edu.endYear}`}
            </span>
          </div>

          {edu.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{edu.description}</p>
          )}

          {edu.status === 'in_progress' && (
            <div className="mt-5">
              {(() => {
                const timeline = timelineById[edu.id];
                const computed = computeProgress(
                  edu.startDate ?? timeline?.startDate,
                  edu.endDate ?? timeline?.endDate
                );
                const progress = Math.min(
                  100,
                  Math.max(computed ?? 0, minProgressById[edu.id] ?? 0)
                );
                return (
                  <>
                    <div
                      className="flex items-center justify-between mb-2 text-xs uppercase tracking-[0.14em]"
                      style={{
                        color: 'oklch(0.565 0.158 37 / 0.85)',
                        fontFamily: 'var(--font-geist-mono), monospace',
                      }}
                    >
                      <span>{t('education.estimatedProgress')}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: 'oklch(0.565 0.158 37)' }}
                      />
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </motion.article>
      ))}
    </div>
  );

  if (IS_DEMO) {
    return (
      <SectionWrapper id="education" className="bg-muted/20">
        <div
          className="relative overflow-hidden rounded-[2.6rem] border px-5 py-10 md:px-8 md:py-12"
          style={{
            borderColor: 'oklch(0.282 0.038 152 / 0.16)',
            boxShadow: '0 28px 58px -42px rgba(26,26,26,0.36)',
          }}
        >
          <Image
            src="/images/backgrounds/education-nura-bg.jpeg"
            alt=""
            aria-hidden
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(242,240,233,0.95) 0%, rgba(242,240,233,0.90) 42%, rgba(242,240,233,0.96) 100%)',
            }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              background:
                'radial-gradient(circle at 10% 16%, rgba(46,64,54,0.12) 0%, rgba(46,64,54,0) 38%), radial-gradient(circle at 86% 84%, rgba(204,88,51,0.10) 0%, rgba(204,88,51,0) 40%)',
            }}
          />

          <div className="relative z-10">
            <SectionTitle
              subtitle={t('education.subtitle')}
              action={<SectionQA section="education" suggestedQuestions={suggestedQuestions} />}
            >
              {t('education.title')}
            </SectionTitle>
            <div className="max-w-3xl mx-auto">{educationCards}</div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="education" className="bg-muted/20">
      <div
        className="relative overflow-hidden rounded-[2.8rem] border px-5 py-10 md:px-8 md:py-12 lg:px-10 lg:py-14"
        style={{
          borderColor: 'oklch(0.282 0.038 152 / 0.16)',
          boxShadow: '0 30px 64px -44px rgba(26,26,26,0.38)',
        }}
      >
        <Image
          src="/images/backgrounds/education-nura-bg.jpeg"
          alt=""
          aria-hidden
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(242,240,233,0.95) 0%, rgba(242,240,233,0.90) 42%, rgba(242,240,233,0.96) 100%)',
          }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
          style={{
            background:
              'radial-gradient(circle at 12% 14%, rgba(46,64,54,0.14) 0%, rgba(46,64,54,0) 39%), radial-gradient(circle at 88% 86%, rgba(204,88,51,0.11) 0%, rgba(204,88,51,0) 42%)',
          }}
        />

        <div className="relative z-10">
          <SectionTitle
            subtitle={t('education.subtitle')}
            action={<SectionQA section="education" suggestedQuestions={suggestedQuestions} />}
          >
            {t('education.title')}
          </SectionTitle>

          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="space-y-5"
            >
              <div className="relative overflow-hidden rounded-[2rem] border bg-muted/20">
                <Image
                  src="/education-highlight.jpg"
                  alt="Martin Bundy en un evento academico"
                  width={1400}
                  height={900}
                  className="h-56 sm:h-72 md:h-[360px] lg:h-[440px] w-full object-cover object-top"
                  priority
                />
              </div>
              <div
                className="rounded-[1.5rem] p-6 border"
                style={{
                  backgroundColor: 'oklch(0.282 0.038 152 / 0.06)',
                  borderColor: 'oklch(0.282 0.038 152 / 0.14)',
                }}
              >
                <p
                  className="text-3xl md:text-4xl italic leading-tight text-primary"
                  style={{ fontFamily: 'var(--font-cormorant), serif' }}
                >
                  {t('education.quote')}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('education.quoteDescription')}
                </p>
              </div>
            </motion.div>
            <div>{educationCards}</div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
