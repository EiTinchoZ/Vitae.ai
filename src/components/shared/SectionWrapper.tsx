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
      initial={{ opacity: 0, y: 52, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
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
          className="text-3xl md:text-5xl font-bold tracking-tight"
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
