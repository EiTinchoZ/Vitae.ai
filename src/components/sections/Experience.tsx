'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { useCvData } from '@/lib/cv-data-context';
import { useTranslation } from '@/i18n';
import { IS_DEMO } from '@/lib/app-config';

const SectionQA = dynamic(
  () => import('@/components/ai/SectionQA').then(m => m.SectionQA),
  { ssr: false }
);

// ── Visual theme per card position ─────────────────────────────────
const THEMES = [
  {
    // dark warm earth + gold — Solar/oldest (appears first, slides to back)
    bg:        'oklch(0.195 0.030 52)',
    accent:    'oklch(0.720 0.110 77)',
    text:      'rgba(242,240,233,0.95)',
    textMuted: 'rgba(242,240,233,0.50)',
    border:    'rgba(212,168,75,0.14)',
    tagBg:     'rgba(212,168,75,0.09)',
    tagBorder: 'rgba(212,168,75,0.22)',
    numColor:  'rgba(212,168,75,0.13)',
    divider:   'rgba(212,168,75,0.18)',
  },
  {
    // mid moss + cream — Industrial
    bg:        'oklch(0.245 0.033 152)',
    accent:    'rgba(242,240,233,0.90)',
    text:      'rgba(242,240,233,0.95)',
    textMuted: 'rgba(242,240,233,0.48)',
    border:    'rgba(242,240,233,0.09)',
    tagBg:     'rgba(242,240,233,0.08)',
    tagBorder: 'rgba(242,240,233,0.17)',
    numColor:  'rgba(242,240,233,0.09)',
    divider:   'rgba(242,240,233,0.10)',
  },
  {
    // deep charcoal + clay — Data Science/AI (most recent, stays on top)
    bg:        'oklch(0.118 0.012 155)',
    accent:    'oklch(0.565 0.158 37)',
    text:      'rgba(242,240,233,0.95)',
    textMuted: 'rgba(242,240,233,0.48)',
    border:    'rgba(204,88,51,0.14)',
    tagBg:     'rgba(204,88,51,0.11)',
    tagBorder: 'rgba(204,88,51,0.24)',
    numColor:  'rgba(204,88,51,0.14)',
    divider:   'rgba(204,88,51,0.16)',
  },
];

// ── Local type matching cv-data shape ──────────────────────────────
interface ExpItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startPeriod: string;
  endPeriod: string;
  duration?: string;
  responsibilities: string[];
  skills: string[];
}

// ── Single sticky card ─────────────────────────────────────────────
function ExperienceCard({
  exp,
  index,
  total,
  progress,
}: {
  exp: ExpItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const theme = THEMES[index % THEMES.length];
  const isLast = index === total - 1;

  const exitStart = (index + 0.72) / total;
  const exitEnd   = Math.min((index + 1.02) / total, 0.995);

  const scale   = useTransform(progress, isLast ? [0, 1] : [exitStart, exitEnd], isLast ? [1, 1] : [1, 0.91]);
  const opacity = useTransform(progress, isLast ? [0, 1] : [exitStart, exitEnd], isLast ? [1, 1] : [1, 0.46]);

  const periodStr =
    exp.startPeriod === exp.endPeriod
      ? exp.startPeriod
      : `${exp.startPeriod} → ${exp.endPeriod}`;

  return (
    <motion.div style={{ scale, opacity, transformOrigin: 'top center' }}>
      <div
        className="rounded-[2.5rem] p-6 sm:p-8 md:p-10 border"
        style={{ backgroundColor: theme.bg, borderColor: theme.border }}
      >

        {/* ── Header row: company / title / big number ── */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <p
              className="text-xs tracking-[0.28em] uppercase font-semibold mb-2"
              style={{ color: theme.accent }}
            >
              {exp.company}
            </p>
            <h3
              className="font-bold leading-tight"
              style={{
                color: theme.text,
                fontFamily: 'var(--font-jakarta), sans-serif',
                fontSize: 'clamp(1.1rem, 2.6vw, 1.65rem)',
              }}
            >
              {exp.position}
            </h3>
          </div>
          <span
            className="leading-none select-none flex-shrink-0 font-medium italic"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(3.8rem, 9vw, 6.2rem)',
              color: theme.numColor,
              marginTop: '-0.12em',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* ── Meta: location + period ── */}
        <div className="flex flex-wrap gap-4 mb-5">
          {[
            { Icon: MapPin,   text: exp.location },
            { Icon: Calendar, text: exp.duration ? `${periodStr} · ${exp.duration}` : periodStr },
          ].map(({ Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-1.5"
              style={{
                color: theme.textMuted,
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.06em',
              }}
            >
              <Icon className="h-3 w-3 flex-shrink-0" />
              {text}
            </span>
          ))}
        </div>

        {/* ── Gradient divider ── */}
        <div
          className="mb-5 h-px"
          style={{ background: `linear-gradient(to right, ${theme.divider}, transparent)` }}
        />

        {/* ── Responsibilities ── */}
        <ul className="space-y-2.5 mb-6">
          {exp.responsibilities.slice(0, 4).map((resp, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                style={{ backgroundColor: theme.accent }}
              />
              <span
                className="text-sm leading-relaxed"
                style={{ color: theme.textMuted }}
              >
                {resp}
              </span>
            </li>
          ))}
        </ul>

        {/* ── Skill tags ── */}
        <div className="flex flex-wrap gap-2">
          {exp.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: theme.tagBg,
                border: `1px solid ${theme.tagBorder}`,
                color: theme.accent,
                fontFamily: 'var(--font-geist-mono), monospace',
              }}
            >
              {skill}
            </span>
          ))}
        </div>

      </div>
    </motion.div>
  );
}

// ── Full scroll-stack section (non-demo) ───────────────────────────
function ExperienceStack({
  items,
  t,
  suggestedQuestions,
}: {
  items: ExpItem[];
  t: (key: string) => string;
  suggestedQuestions: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const total = items.length;

  return (
    <section
      id="experience"
      className="relative"
      style={{ backgroundColor: 'oklch(0.127 0 0)' }}
    >
      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="container mx-auto px-4 pt-16 md:pt-24 pb-8 md:pb-10"
      >
        <div className="text-center">
          {/* Label */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span
              className="text-xs tracking-[0.3em] uppercase font-semibold"
              style={{ color: 'oklch(0.565 0.158 37)' }}
            >
              Vitae.ai
            </span>
            <div className="h-px w-10 flex-shrink-0" style={{ backgroundColor: 'oklch(0.565 0.158 37)' }} />
            <span
              className="text-xs tracking-[0.2em] uppercase font-medium"
              style={{ color: 'rgba(242,240,233,0.38)' }}
            >
              {t('experience.title')}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: 'rgba(242,240,233,0.95)' }}
            >
              {t('experience.title')}
            </h2>
            <SectionQA section="experience" suggestedQuestions={suggestedQuestions} />
          </div>

          <p
            className="max-w-xl mx-auto text-sm leading-relaxed"
            style={{ color: 'rgba(242,240,233,0.36)' }}
          >
            {t('experience.subtitle')}
          </p>
        </div>
      </motion.div>

      {/* ── Sticky card stack ── */}
      <div
        ref={containerRef}
        className="relative mx-auto px-4 md:px-8 max-w-4xl"
        style={{ height: `calc(${(total - 1) * 44}vh + 580px)` }}
      >
        {items.map((exp, i) => (
          <div
            key={exp.id}
            className="sticky"
            style={{
              top: `${90 + i * 22}px`,
              zIndex: 10 + i * 10,
            }}
          >
            <ExperienceCard
              exp={exp}
              index={i}
              total={total}
              progress={scrollYProgress}
            />
          </div>
        ))}
      </div>

      {/* Bottom spacing */}
      <div className="pb-16 md:pb-24" />
    </section>
  );
}

// ── Main export ────────────────────────────────────────────────────
export function Experience() {
  const { t, tArray } = useTranslation();
  const { cvData } = useCvData();

  const suggestedQuestions = tArray('qa.suggestions.experience');
  const preferredOrder = ['exp-2', 'exp-1', 'exp-deta'];
  const experienceItems = [...cvData.experience].sort((a, b) => {
    const indexA = preferredOrder.indexOf(a.id);
    const indexB = preferredOrder.indexOf(b.id);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  }) as ExpItem[];

  if (IS_DEMO) {
    return (
      <SectionWrapper id="experience" className="bg-muted/20">
        <SectionTitle
          subtitle={t('experience.subtitle')}
          action={<SectionQA section="experience" suggestedQuestions={suggestedQuestions} />}
        >
          {t('experience.title')}
        </SectionTitle>
        <div className="space-y-4 max-w-3xl mx-auto">
          {experienceItems.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-[2rem] p-6 border bg-card"
            >
              <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-1">
                {exp.company}
              </p>
              <h3 className="font-bold text-lg mb-1">{exp.position}</h3>
              <p className="text-sm text-muted-foreground">
                {exp.startPeriod} – {exp.endPeriod}
              </p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    );
  }

  return (
    <ExperienceStack
      items={experienceItems}
      t={t}
      suggestedQuestions={suggestedQuestions}
    />
  );
}
