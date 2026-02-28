'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSectionLayout } from '@/lib/section-layout-context';

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  fullHeight?: boolean;
}

export function SectionWrapper({
  children,
  id,
  className,
  fullHeight = false,
}: SectionWrapperProps) {
  const layout = useSectionLayout();
  const densityClass =
    layout?.density === 'compact' ? 'py-12 md:py-16' : 'py-20 md:py-28';
  const containerWidth =
    layout?.containerWidth === '6xl'
      ? 'max-w-6xl'
      : layout?.containerWidth === '5xl'
        ? 'max-w-5xl'
        : layout?.containerWidth === '4xl'
          ? 'max-w-4xl'
          : null;

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        '[--background:oklch(0.962_0.007_83)]',
        '[--card:oklch(1_0_0)]',
        '[--popover:oklch(1_0_0)]',
        '[--foreground:oklch(0.16_0.006_83)]',
        '[--card-foreground:oklch(0.16_0.006_83)]',
        '[--popover-foreground:oklch(0.16_0.006_83)]',
        '[--secondary:oklch(0.93_0.006_83)]',
        '[--secondary-foreground:oklch(0.25_0.02_152)]',
        '[--muted:oklch(0.93_0.006_83)]',
        '[--muted-foreground:oklch(0.34_0.012_152)]',
        '[--border:oklch(0.875_0.008_83)]',
        '[--input:oklch(0.875_0.008_83)]',
        'text-foreground',
        densityClass,
        fullHeight && 'min-h-[100dvh] flex items-center',
        className
      )}
    >
      <div
        className={cn(
          containerWidth ? 'mx-auto w-full px-6 md:px-10 lg:px-14' : 'max-w-7xl mx-auto px-6 md:px-10 lg:px-14',
          containerWidth
        )}
      >
        {children}
      </div>
    </motion.section>
  );
}

export function SectionTitle({
  children,
  subtitle,
  className,
  action,
  eyebrow = 'Vitae.ai',
}: {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn('text-center mb-14', className)}
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <span
          className="text-xs tracking-[0.3em] uppercase font-semibold"
          style={{
            color: 'oklch(0.565 0.158 37)',
            fontFamily: 'var(--font-geist-mono), monospace',
          }}
        >
          {eyebrow}
        </span>
        <div className="h-px w-10" style={{ backgroundColor: 'oklch(0.565 0.158 37)' }} />
      </div>
      <div className="flex items-center justify-center gap-4 mb-4">
        <h2
          className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
        >
          {children}
        </h2>
        {action}
      </div>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
