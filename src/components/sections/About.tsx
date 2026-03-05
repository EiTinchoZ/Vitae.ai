'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { MapPin, GraduationCap, Briefcase, Languages } from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { useCvData } from '@/lib/cv-data-context';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';

const InsightsDashboard = dynamic(
  () => import('@/components/ai/InsightsDashboard').then(m => m.InsightsDashboard),
  { ssr: false }
);
const ResumeAnalyzer = dynamic(
  () => import('@/components/ai/ResumeAnalyzer').then(m => m.ResumeAnalyzer),
  { ssr: false }
);

export function About() {
  const { t } = useTranslation();
  const { cvData } = useCvData();

  const highlights = [
    {
      icon: GraduationCap,
      label: t('about.highlights.education'),
      value: cvData.about.highlights.educationValue,
    },
    {
      icon: Briefcase,
      label: t('about.highlights.specialization'),
      value: cvData.about.highlights.specializationValue,
    },
    {
      icon: MapPin,
      label: t('about.highlights.location'),
      value: cvData.about.highlights.locationValue,
    },
    {
      icon: Languages,
      label: t('about.highlights.languages'),
      value: cvData.about.highlights.languagesValue,
    },
  ];

  return (
    <SectionWrapper id="about" className="bg-muted/20">
      <div
        className="relative overflow-hidden rounded-[2.8rem] border px-5 py-10 md:px-8 md:py-12 lg:px-10 lg:py-14"
        style={{
          borderColor: 'oklch(0.282 0.038 152 / 0.16)',
          boxShadow: '0 30px 64px -44px rgba(26,26,26,0.38)',
        }}
      >
        <Image
          src="/images/backgrounds/section-bg.jpeg"
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
              'linear-gradient(to bottom, rgba(242,240,233,0.84) 0%, rgba(242,240,233,0.76) 42%, rgba(242,240,233,0.88) 100%)',
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
          <div className="text-center">
            <span className="inline-block text-xs tracking-[0.3em] uppercase font-semibold text-accent mb-2">
              {t('about.subtitle')}
            </span>
          </div>
          <SectionTitle>
            {t('about.title')}
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Profile text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="mb-6 rounded-[1.5rem] border p-5 md:p-6"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.72)',
                  borderColor: 'oklch(0.282 0.038 152 / 0.16)',
                }}
              >
                <p
                  className="leading-relaxed"
                  style={{ color: 'oklch(0.34 0.01 83)' }}
                >
                  {cvData.profile}
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 rounded-[1.5rem] border p-4 hover:scale-[1.02] transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.76)',
                      borderColor: 'oklch(0.282 0.038 152 / 0.16)',
                    }}
                  >
                    <div className="p-2 rounded-[1.5rem] bg-primary/10 text-primary">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p
                        className="text-xs"
                        style={{ color: 'oklch(0.40 0.012 152)' }}
                      >
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Specialties */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-6 border"
              style={{
                backgroundColor: 'rgba(255,255,255,0.72)',
                borderColor: 'oklch(0.282 0.038 152 / 0.14)',
              }}
            >
              {cvData.about.image && (
                <div className="mb-6">
                  <div
                    className={cn(
                      'grid gap-4',
                      cvData.about.imageSecondary ? 'sm:grid-cols-2' : 'grid-cols-1'
                    )}
                  >
                    <div>
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-background">
                        <Image
                          src={cvData.about.image}
                          alt={cvData.about.imageAlt ?? 'Martin Bundy'}
                          fill
                          className={cn('object-cover')}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      </div>
                      {cvData.about.imageAlt && (
                        <p className="mt-2 text-xs" style={{ color: 'oklch(0.40 0.012 152)' }}>
                          {cvData.about.imageAlt}
                        </p>
                      )}
                    </div>

                    {cvData.about.imageSecondary && (
                      <div>
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-background">
                          <Image
                            src={cvData.about.imageSecondary}
                            alt={cvData.about.imageSecondaryAlt ?? 'Martin Bundy'}
                            fill
                            className={cn('object-cover')}
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        {cvData.about.imageSecondaryAlt && (
                          <p className="mt-2 text-xs" style={{ color: 'oklch(0.40 0.012 152)' }}>
                            {cvData.about.imageSecondaryAlt}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <h3 className="text-lg font-semibold mb-4 text-foreground">{t('about.specialtiesTitle')}</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.about.specialties.map((specialty, index) => (
                  <motion.span
                    key={specialty}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="px-4 py-2 rounded-full text-sm font-medium border hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5 transition-all cursor-default"
                    style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
                  >
                    {specialty}
                  </motion.span>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-6 pt-6 border-t" style={{ borderColor: 'oklch(0.282 0.038 152 / 0.20)' }}>
                <blockquote
                  className="text-2xl md:text-3xl font-medium italic leading-relaxed mb-6"
                  style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    color: 'oklch(0.282 0.038 152)',
                  }}
                >
                  &quot;{cvData.about.quote}&quot;
                </blockquote>
              </div>
            </motion.div>
          </div>

          {/* AI Insights Dashboard */}
          <InsightsDashboard />

          {/* Resume Analyzer */}
          <ResumeAnalyzer />
        </div>
      </div>
    </SectionWrapper>
  );
}
