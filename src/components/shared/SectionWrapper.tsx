'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'py-16 md:py-24',
        fullHeight && 'min-h-screen flex items-center',
        className
      )}
    >
      <div className="container mx-auto px-4">{children}</div>
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
