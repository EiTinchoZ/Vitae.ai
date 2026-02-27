'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Brain, Code2, Factory, Cpu } from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { useCvData } from '@/lib/cv-data-context';
import { useTranslation } from '@/i18n';

const SectionQA = dynamic(
  () => import('@/components/ai/SectionQA').then(m => m.SectionQA),
  { ssr: false }
);
const SkillRecommender = dynamic(
  () => import('@/components/ai/SkillRecommender').then(m => m.SkillRecommender),
  { ssr: false }
);

// ─────────────────────────────────────────────────────────────────
// CARD 1 — AI / ML: Live Terminal Typewriter
// Dark charcoal card, monospace, streaming skill names
// ─────────────────────────────────────────────────────────────────
function AITerminalCard({ skills, label }: { skills: string[]; label: string }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!skills.length) return;
    const current = skills[currentIdx];

    if (!isDeleting && displayed === current) {
      const t = setTimeout(() => setIsDeleting(true), 1900);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      if (isDeleting && displayed === '') {
        setIsDeleting(false);
        setCurrentIdx(i => (i + 1) % skills.length);
        return;
      }
      setDisplayed(d =>
        isDeleting ? d.slice(0, -1) : current.slice(0, d.length + 1)
      );
    }, isDeleting ? 36 : 60);
    return () => clearTimeout(t);
  }, [displayed, isDeleting, currentIdx, skills]);

  return (
    <div
      className="rounded-[2rem] p-6 flex flex-col h-full min-h-[300px] border"
      style={{
        backgroundColor: 'oklch(0.155 0.012 152)',
        borderColor: 'rgba(242,240,233,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 flex-shrink-0" style={{ color: 'oklch(0.565 0.158 37)' }} />
          <span
            className="text-xs tracking-[0.28em] uppercase font-semibold"
            style={{ color: 'rgba(242,240,233,0.58)' }}
          >
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span
            className="text-xs tracking-[0.18em] uppercase"
            style={{ fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(242,240,233,0.32)' }}
          >
            live
          </span>
        </div>
      </div>

      {/* Terminal window */}
      <div
        className="flex-1 rounded-xl p-4 mb-4 flex flex-col justify-between"
        style={{
          backgroundColor: 'rgba(242,240,233,0.04)',
          border: '1px solid rgba(242,240,233,0.07)',
        }}
      >
        <p
          className="text-xs mb-4 select-none"
          style={{ fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(242,240,233,0.25)' }}
        >
          $ vitae stream --category=ai
        </p>

        <div className="flex items-start gap-2">
          <span
            className="text-sm font-bold mt-0.5 flex-shrink-0"
            style={{ color: 'oklch(0.565 0.158 37)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            ›
          </span>
          <p
            className="text-sm leading-relaxed text-white"
            style={{ fontFamily: 'var(--font-geist-mono), monospace', minHeight: '1.5rem' }}
          >
            {displayed}
            <span
              className="inline-block w-1.5 h-4 ml-0.5 align-middle animate-pulse"
              style={{ backgroundColor: 'oklch(0.565 0.158 37)' }}
            />
          </p>
        </div>

        <div className="mt-3 flex gap-1">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm"
              style={{ backgroundColor: 'rgba(242,240,233,0.12)', height: '3px' }}
              animate={{ opacity: [0.3, i === currentIdx % 8 ? 1 : 0.3, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>

      {/* Active skill tags */}
      <div className="flex flex-wrap gap-1.5">
        {skills.slice(0, 5).map((s, i) => (
          <span
            key={s}
            className="px-2.5 py-1 rounded-full text-xs transition-all duration-300"
            style={{
              backgroundColor: i === currentIdx % skills.length
                ? 'rgba(204,88,51,0.22)'
                : 'rgba(242,240,233,0.07)',
              color: i === currentIdx % skills.length
                ? 'oklch(0.565 0.158 37)'
                : 'rgba(242,240,233,0.42)',
              border: `1px solid ${i === currentIdx % skills.length ? 'rgba(204,88,51,0.38)' : 'rgba(242,240,233,0.09)'}`,
              fontFamily: 'var(--font-geist-mono), monospace',
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CARD 2 — Programming: Animated Skill Bars
// Cream/card bg, Cormorant italic header, clay+moss bars
// ─────────────────────────────────────────────────────────────────
function ProgrammingBarsCard({ skills, label }: { skills: string[]; label: string }) {
  const top = skills.slice(0, 7);
  // Levels: descending from 96% — visually implies priority order
  const levels = top.map((_, i) => Math.round(96 - (i / top.length) * 38));

  return (
    <div className="rounded-[2rem] p-6 flex flex-col h-full min-h-[300px] bg-card border border-border">
      <div className="flex items-center gap-2 mb-1">
        <Code2 className="h-4 w-4 text-primary" />
        <span className="text-xs tracking-[0.28em] uppercase font-semibold text-accent">
          {label}
        </span>
      </div>
      <p
        className="text-3xl font-medium italic mb-6 text-primary leading-tight"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        stack técnico.
      </p>

      <div className="flex-1 space-y-3.5">
        {top.map((skill, i) => (
          <div key={skill}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground/80">{skill}</span>
              <span
                className="text-xs tabular-nums"
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  color: 'oklch(0.565 0.158 37)',
                }}
              >
                {levels[i]}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    i === 0
                      ? 'oklch(0.565 0.158 37)'
                      : i < 3
                        ? 'oklch(0.282 0.038 152)'
                        : 'oklch(0.282 0.038 152 / 0.55)',
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${levels[i]}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.07, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CARD 3 — Industrial: Blueprint Schematic
// CSS grid background, moss nodes, Cormorant italic
// ─────────────────────────────────────────────────────────────────
function IndustrialBlueprintCard({ skills, label }: { skills: string[]; label: string }) {
  return (
    <div
      className="rounded-[2rem] p-6 flex flex-col h-full min-h-[300px] relative overflow-hidden border"
      style={{
        backgroundColor: 'oklch(0.962 0.007 83)',
        borderColor: 'oklch(0.282 0.038 152 / 0.18)',
      }}
    >
      {/* Blueprint grid lines */}
      <div
        className="absolute inset-0 opacity-[0.065] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(oklch(0.282 0.038 152) 1px, transparent 1px), linear-gradient(90deg, oklch(0.282 0.038 152) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* Corner crosshairs */}
      <div
        className="absolute top-5 right-5 w-6 h-6 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(oklch(0.282 0.038 152) 1px, transparent 1px), linear-gradient(90deg, oklch(0.282 0.038 152) 1px, transparent 1px)',
          backgroundSize: '50% 50%',
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-1">
          <Factory className="h-4 w-4 text-primary" />
          <span className="text-xs tracking-[0.28em] uppercase font-semibold text-accent">
            {label}
          </span>
        </div>
        <p
          className="text-3xl font-medium italic mb-5 text-primary leading-tight"
          style={{ fontFamily: 'var(--font-cormorant), serif' }}
        >
          ingeniería.
        </p>

        {/* Skill nodes */}
        <div className="flex-1 flex flex-wrap gap-2 content-start">
          {skills.slice(0, 9).map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.055, duration: 0.3, ease: 'easeOut' }}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor:
                  i === 0
                    ? 'oklch(0.282 0.038 152)'
                    : i < 3
                      ? 'oklch(0.282 0.038 152 / 0.14)'
                      : 'oklch(0.282 0.038 152 / 0.07)',
                color:
                  i === 0
                    ? 'oklch(0.962 0.007 83)'
                    : 'oklch(0.282 0.038 152)',
                border: '1px solid oklch(0.282 0.038 152 / 0.22)',
              }}
            >
              {skill}
            </motion.span>
          ))}
        </div>

        {/* Schematic label */}
        <div className="mt-4 flex items-center gap-2">
          <div
            className="h-px flex-1 opacity-20"
            style={{ backgroundColor: 'oklch(0.282 0.038 152)' }}
          />
          <span
            className="text-xs tracking-[0.25em] uppercase opacity-35"
            style={{ fontFamily: 'var(--font-geist-mono), monospace', color: 'oklch(0.282 0.038 152)' }}
          >
            ING-{skills.length.toString().padStart(2, '0')}
          </span>
          <div
            className="h-px flex-1 opacity-20"
            style={{ backgroundColor: 'oklch(0.282 0.038 152)' }}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CARD 4 — Technology: Metric Dashboard Tiles
// Card bg, icon dots, subtle grid layout
// ─────────────────────────────────────────────────────────────────
function TechDashboardCard({ skills, label }: { skills: string[]; label: string }) {
  return (
    <div className="rounded-[2rem] p-6 flex flex-col h-full min-h-[300px] bg-card border border-border">
      <div className="flex items-center gap-2 mb-1">
        <Cpu className="h-4 w-4 text-primary" />
        <span className="text-xs tracking-[0.28em] uppercase font-semibold text-accent">
          {label}
        </span>
      </div>
      <p
        className="text-3xl font-medium italic mb-5 text-primary/80 leading-tight"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        tools & tech.
      </p>

      <div className="flex-1 grid grid-cols-2 gap-2">
        {skills.slice(0, 8).map((skill, i) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{
              backgroundColor: 'oklch(0.962 0.007 83 / 0.5)',
              border: '1px solid oklch(0.875 0.008 83)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor:
                  i === 0
                    ? 'oklch(0.565 0.158 37)'
                    : i < 3
                      ? 'oklch(0.282 0.038 152)'
                      : 'oklch(0.282 0.038 152 / 0.35)',
              }}
            />
            <span className="text-xs font-medium text-foreground/75 truncate leading-tight">
              {skill}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export function Skills() {
  const { t, tArray } = useTranslation();
  const { cvData } = useCvData();

  const byCategory = {
    ai:          cvData.skills.filter(s => s.category === 'ai').map(s => s.name),
    programming: cvData.skills.filter(s => s.category === 'programming').map(s => s.name),
    industrial:  cvData.skills.filter(s => s.category === 'industrial').map(s => s.name),
    technology:  cvData.skills.filter(s => s.category === 'technology').map(s => s.name),
  };

  const suggestedQuestions = tArray('qa.suggestions.skills');

  return (
    <SectionWrapper id="skills" className="bg-muted/20">
      <SectionTitle
        subtitle={t('skills.subtitle')}
        action={<SectionQA section="skills" suggestedQuestions={suggestedQuestions} />}
      >
        {t('skills.title')}
      </SectionTitle>

      {/* 2×2 grid of functional artifact cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="h-full"
        >
          <AITerminalCard
            skills={byCategory.ai}
            label={t('skills.categories.ai')}
          />
        </motion.div>

        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="h-full"
        >
          <ProgrammingBarsCard
            skills={byCategory.programming}
            label={t('skills.categories.programming')}
          />
        </motion.div>

        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="h-full"
        >
          <IndustrialBlueprintCard
            skills={byCategory.industrial}
            label={t('skills.categories.industrial')}
          />
        </motion.div>

        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="h-full"
        >
          <TechDashboardCard
            skills={byCategory.technology}
            label={t('skills.categories.technology')}
          />
        </motion.div>

      </div>

      {/* AI Skill Recommender — preserved from original */}
      <SkillRecommender />
    </SectionWrapper>
  );
}
