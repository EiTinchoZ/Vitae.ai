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
    layout?.density === 'compact' ? 'py-10 md:py-16' : 'py-16 md:py-24';
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        densityClass,
        fullHeight && 'min-h-screen flex items-center',
        className
      )}
    >
      <div
        className={cn(
          containerWidth ? 'mx-auto w-full px-4' : 'container mx-auto px-4',
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
}: {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn('text-center mb-12', className)}>
      <div className="flex items-center justify-center gap-4 mb-4">
        <h2 className="text-3xl md:text-4xl font-bold">{children}</h2>
        {action}
      </div>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
