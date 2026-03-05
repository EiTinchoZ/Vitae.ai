'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Brain, Code2, Factory, Cpu, MousePointer2, Check } from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { useCvData } from '@/lib/cv-data-context';
import { useTranslation } from '@/i18n';

const SectionQA = dynamic(
  () => import('@/components/ai/SectionQA').then((m) => m.SectionQA),
  { ssr: false }
);
const SkillRecommender = dynamic(
  () => import('@/components/ai/SkillRecommender').then((m) => m.SkillRecommender),
  { ssr: false }
);

function DiagnosticShufflerCard({ label, skills }: { label: string; skills: string[] }) {
  const initialStack = skills.slice(0, 3).map((skill, i) => {
    const values = ['Expert', 'Advanced', 'Proficient'];
    const notes = ['Production pipelines', 'Core expertise', 'Applied projects'];
    return { title: skill, value: values[i] ?? 'Proficient', note: notes[i] ?? 'Applied' };
  });
  const [stack, setStack] = useState(
    initialStack.length
      ? initialStack
      : [
          { title: 'Machine Learning', value: 'Expert', note: 'Production pipelines' },
          { title: 'Deep Learning', value: 'Advanced', note: 'Neural network design' },
          { title: 'LLM Integration', value: 'Proficient', note: 'Applied projects' },
        ]
  );

  useEffect(() => {
    const id = setInterval(() => {
      setStack((prev) => {
        const next = [...prev];
        const last = next.pop();
        if (last) next.unshift(last);
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-[2rem] p-6 flex flex-col h-full min-h-[300px] border"
      style={{
        backgroundColor: 'oklch(0.962 0.007 83)',
        borderColor: 'oklch(0.282 0.038 152 / 0.16)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Brain className="h-4 w-4 text-primary" />
        <span className="text-xs tracking-[0.28em] uppercase font-semibold text-accent">{label}</span>
      </div>
      <p
        className="text-3xl font-medium italic mb-5 text-primary leading-tight"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        diagnostic shuffle.
      </p>

      <div className="relative h-[170px] mb-4">
        {stack.map((card, idx) => (
          <motion.div
            key={card.title}
            layout
            transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute inset-x-0 rounded-[1.2rem] border p-4"
            style={{
              top: `${idx * 16}px`,
              zIndex: 40 - idx,
              scale: 1 - idx * 0.06,
              opacity: 1 - idx * 0.18,
              backgroundColor: idx === 0 ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.86)',
              borderColor: 'oklch(0.282 0.038 152 / 0.16)',
              boxShadow: idx === 0 ? '0 14px 24px -16px rgba(26,26,26,0.45)' : 'none',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className="text-[0.62rem] uppercase tracking-[0.18em]"
                  style={{ color: 'oklch(0.40 0.012 152)', fontFamily: 'var(--font-geist-mono), monospace' }}
                >
                  AI Skill
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">{card.title}</p>
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: 'oklch(0.565 0.158 37)', fontFamily: 'var(--font-geist-mono), monospace' }}
              >
                {card.value}
              </span>
            </div>
            <p className="text-xs mt-2" style={{ color: 'oklch(0.40 0.012 152)' }}>
              {card.note}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {skills.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full text-xs"
            style={{
              backgroundColor: 'oklch(0.282 0.038 152 / 0.08)',
              border: '1px solid oklch(0.282 0.038 152 / 0.16)',
              color: 'oklch(0.282 0.038 152)',
              fontFamily: 'var(--font-geist-mono), monospace',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function TelemetryTypewriterCard({ label, skills }: { label: string; skills: string[] }) {
  const messages = useMemo(() => {
    const dynamicSkills = skills.slice(0, 3).map((s) => `Mapping ${s} proficiency...`);
    return [
      'Parsing model architecture...',
      'Configuring training pipeline...',
      'Optimizing inference latency...',
      ...dynamicSkills,
    ];
  }, [skills]);

  const [msgIdx, setMsgIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!messages.length) return;
    const current = messages[msgIdx];

    if (!deleting && displayed === current) {
      const hold = setTimeout(() => setDeleting(true), 1300);
      return () => clearTimeout(hold);
    }

    const t = setTimeout(() => {
      if (deleting && displayed === '') {
        setDeleting(false);
        setMsgIdx((i) => (i + 1) % messages.length);
        return;
      }
      setDisplayed((prev) =>
        deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
      );
    }, deleting ? 34 : 52);

    return () => clearTimeout(t);
  }, [messages, msgIdx, displayed, deleting]);

  return (
    <div
      className="rounded-[2rem] p-6 flex flex-col h-full min-h-[300px] border"
      style={{
        backgroundColor: 'oklch(0.155 0.012 152)',
        borderColor: 'rgba(242,240,233,0.10)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4" style={{ color: 'oklch(0.565 0.158 37)' }} />
          <span
            className="text-xs tracking-[0.28em] uppercase font-semibold"
            style={{ color: 'rgba(242,240,233,0.62)' }}
          >
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span
            className="text-[0.62rem] uppercase tracking-[0.18em]"
            style={{ color: 'rgba(242,240,233,0.48)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            Live Feed
          </span>
        </div>
      </div>

      <div
        className="flex-1 rounded-[1.2rem] border p-4 md:p-5"
        style={{
          backgroundColor: 'rgba(242,240,233,0.04)',
          borderColor: 'rgba(242,240,233,0.09)',
        }}
      >
        <p
          className="text-xs mb-4"
          style={{ color: 'rgba(242,240,233,0.52)', fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          $ telemetry.stream --mode=adaptive
        </p>

        <div className="flex items-start gap-2 min-h-12">
          <span
            className="text-sm font-bold mt-0.5"
            style={{ color: 'oklch(0.565 0.158 37)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            {'>'}
          </span>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(242,240,233,0.92)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            {displayed}
            <span
              className="inline-block w-1.5 h-4 ml-0.5 align-middle animate-pulse"
              style={{ backgroundColor: 'oklch(0.565 0.158 37)' }}
            />
          </p>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1.5">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(242,240,233,0.16)' }}
              animate={{ opacity: [0.25, i === msgIdx % 7 ? 1 : 0.3, 0.25] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SchedulerCard({ label, skills }: { label: string; skills: string[] }) {
  const week = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayPositions = [
    { x: 8, y: 34 },
    { x: 21, y: 34 },
    { x: 34, y: 34 },
    { x: 47, y: 34 },
    { x: 60, y: 34 },
    { x: 73, y: 34 },
    { x: 86, y: 34 },
  ];

  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((prev) => (prev + 1) % 9);
    }, 1150);
    return () => clearInterval(id);
  }, []);

  const activeDay = step < 7 ? step : null;
  const saveActive = step === 7;
  const cursorVisible = step !== 8;
  const cursorPos = step < 7 ? dayPositions[step] : { x: 82, y: 79 };

  return (
    <div
      className="rounded-[2rem] p-6 flex flex-col h-full min-h-[300px] border"
      style={{
        backgroundColor: 'oklch(0.962 0.007 83)',
        borderColor: 'oklch(0.282 0.038 152 / 0.16)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Factory className="h-4 w-4 text-primary" />
        <span className="text-xs tracking-[0.28em] uppercase font-semibold text-accent">{label}</span>
      </div>
      <p
        className="text-3xl font-medium italic mb-5 text-primary leading-tight"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        protocol scheduler.
      </p>

      <div
        className="relative rounded-[1.2rem] border p-4 mb-4"
        style={{
          backgroundColor: 'rgba(255,255,255,0.82)',
          borderColor: 'oklch(0.282 0.038 152 / 0.16)',
        }}
      >
        <div className="grid grid-cols-7 gap-1.5 mb-5">
          {week.map((d, i) => (
            <div
              key={`${d}-${i}`}
              className="h-9 rounded-lg flex items-center justify-center text-xs font-semibold border"
              style={{
                backgroundColor: activeDay === i ? 'oklch(0.282 0.038 152)' : 'rgba(255,255,255,0.88)',
                color: activeDay === i ? 'oklch(0.962 0.007 83)' : 'oklch(0.282 0.038 152)',
                borderColor: activeDay === i ? 'oklch(0.282 0.038 152)' : 'oklch(0.282 0.038 152 / 0.22)',
                transition: 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <motion.button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            animate={{ scale: saveActive ? [1, 0.96, 1] : 1 }}
            transition={{ duration: 0.35 }}
            style={{
              backgroundColor: saveActive ? 'oklch(0.565 0.158 37)' : 'oklch(0.282 0.038 152)',
              color: 'oklch(0.962 0.007 83)',
            }}
          >
            {saveActive && <Check className="h-3 w-3" />}
            Save
          </motion.button>
        </div>

        <motion.div
          className="absolute pointer-events-none"
          animate={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
            opacity: cursorVisible ? 1 : 0,
            scale: saveActive ? [1, 0.92, 1] : 1,
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ translateX: '-50%', translateY: '-50%' }}
        >
          <div className="h-7 w-7 rounded-full border flex items-center justify-center bg-white/95 shadow-sm">
            <MousePointer2 className="h-3.5 w-3.5" style={{ color: 'oklch(0.565 0.158 37)' }} />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-full text-xs"
            style={{
              backgroundColor: 'oklch(0.282 0.038 152 / 0.08)',
              border: '1px solid oklch(0.282 0.038 152 / 0.16)',
              color: 'oklch(0.282 0.038 152)',
              fontFamily: 'var(--font-geist-mono), monospace',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function TechDashboardCard({ skills, label }: { skills: string[]; label: string }) {
  return (
    <div className="rounded-[2rem] p-6 flex flex-col h-full min-h-[300px] bg-card border border-border">
      <div className="flex items-center gap-2 mb-1">
        <Cpu className="h-4 w-4 text-primary" />
        <span className="text-xs tracking-[0.28em] uppercase font-semibold text-accent">{label}</span>
      </div>
      <p
        className="text-3xl font-medium italic mb-5 text-primary/80 leading-tight"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        tools and tech.
      </p>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            <span className="text-xs font-medium text-foreground/75 leading-tight">{skill}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export function Skills() {
  const { t, tArray } = useTranslation();
  const { cvData } = useCvData();

  const byCategory = {
    ai: cvData.skills.filter((s) => s.category === 'ai').map((s) => s.name),
    programming: cvData.skills.filter((s) => s.category === 'programming').map((s) => s.name),
    industrial: cvData.skills.filter((s) => s.category === 'industrial').map((s) => s.name),
    technology: cvData.skills.filter((s) => s.category === 'technology').map((s) => s.name),
  };

  const suggestedQuestions = tArray('qa.suggestions.skills');

  return (
    <SectionWrapper id="skills" className="bg-[oklch(0.986_0.003_83)]">
      <div
        className="relative overflow-hidden rounded-[2.7rem] border px-5 py-10 md:px-9 md:py-12 lg:px-12 lg:py-14"
        style={{
          backgroundColor: 'oklch(1 0 0)',
          borderColor: 'oklch(0.875 0.008 83 / 0.9)',
          boxShadow: '0 28px 62px -42px rgba(26,26,26,0.42)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 12% 15%, rgba(46,64,54,0.10) 0%, rgba(46,64,54,0) 42%), radial-gradient(circle at 86% 88%, rgba(204,88,51,0.10) 0%, rgba(204,88,51,0) 40%)',
          }}
        />

        <div className="relative z-10">
          <SectionTitle
            subtitle={t('skills.subtitle')}
            action={<SectionQA section="skills" suggestedQuestions={suggestedQuestions} />}
          >
            {t('skills.title')}
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="h-full"
            >
              <DiagnosticShufflerCard label={t('skills.categories.ai')} skills={byCategory.ai} />
            </motion.div>

            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="h-full"
            >
              <TelemetryTypewriterCard
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
              <SchedulerCard skills={byCategory.industrial} label={t('skills.categories.industrial')} />
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

          <div className="mt-10 md:mt-12">
            <SkillRecommender />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
