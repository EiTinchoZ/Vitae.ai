'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  GraduationCap,
  Code,
  Languages,
  Cpu,
  CheckCircle2,
  Clock,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCvData } from '@/lib/cv-data-context';
import { useTranslation } from '@/i18n';
import type { Certificate } from '@/types';
import { cn } from '@/lib/utils';

const categoryIcons = {
  master: GraduationCap,
  specialization: Award,
  technical: Cpu,
  languages: Languages,
  programming: Code,
  anthropic: Sparkles,
};

const categoryKeys = ['master', 'specialization', 'technical', 'languages', 'programming', 'anthropic'] as const;

export function Certificates() {
  const { t } = useTranslation();
  const { cvData } = useCvData();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const firstNonEmpty =
    categoryKeys.find((k) => cvData.certificates.some((c) => c.category === k)) ?? 'master';
  const [openCategory, setOpenCategory] = useState<string>(firstNonEmpty);

  const currentIndex = selectedCert
    ? cvData.certificates.findIndex((c) => c.id === selectedCert.id)
    : -1;

  const goToPrev = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : cvData.certificates.length - 1;
    setSelectedCert(cvData.certificates[prevIndex]);
  };

  const goToNext = () => {
    const nextIndex = currentIndex < cvData.certificates.length - 1 ? currentIndex + 1 : 0;
    setSelectedCert(cvData.certificates[nextIndex]);
  };

  return (
    <SectionWrapper id="certificates" className="bg-muted/20">
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
          <SectionTitle subtitle={t('certificates.subtitle')}>
            {t('certificates.title')}
          </SectionTitle>

          {/* Accordion by category */}
          <div className="max-w-3xl mx-auto space-y-3">
            {categoryKeys.map((cat) => {
              const certs = cvData.certificates.filter((c) => c.category === cat);
              if (!certs.length) return null;
              const Icon = categoryIcons[cat];
              const isOpen = openCategory === cat;

              return (
                <div
                  key={cat}
                  className="rounded-[1.5rem] border bg-background/70 backdrop-blur-sm overflow-hidden"
                  style={{ borderColor: 'oklch(0.282 0.038 152 / 0.14)' }}
                >
                  {/* Category header */}
                  <button
                    onClick={() => setOpenCategory(isOpen ? '' : cat)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-foreground/[0.03] transition-colors"
                  >
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: 'oklch(0.565 0.158 37 / 0.12)' }}
                    >
                      <Icon className="h-4 w-4" style={{ color: 'oklch(0.565 0.158 37)' }} />
                    </div>
                    <span className="flex-1 font-semibold text-sm">
                      {t(`certificates.categories.${cat}`)}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full mr-2"
                      style={{
                        backgroundColor: 'oklch(0.282 0.038 152 / 0.08)',
                        color: 'oklch(0.282 0.038 152)',
                        fontFamily: 'var(--font-geist-mono), monospace',
                      }}
                    >
                      {certs.length}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-muted-foreground transition-transform duration-300',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Cert list */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-4 pb-4 pt-2 space-y-1 border-t"
                          style={{ borderColor: 'oklch(0.282 0.038 152 / 0.08)' }}
                        >
                          {certs.map((cert) => (
                            <button
                              key={cert.id}
                              onClick={() => setSelectedCert(cert)}
                              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left hover:bg-foreground/[0.04] active:scale-[0.99] transition-all group"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                                  {cert.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {cert.institution} - {cert.period}
                                </p>
                              </div>
                              {cert.status === 'completed' ? (
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                              ) : (
                                <Clock className="h-4 w-4 flex-shrink-0 text-amber-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Certificate Modal */}
          <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
            <DialogContent className="max-w-2xl">
              <DialogTitle className="sr-only">
                {selectedCert
                  ? `${selectedCert.name} - ${selectedCert.institution}`
                  : t('certificates.title')}
              </DialogTitle>
              {selectedCert && (
                <div className="relative">
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      {(() => {
                        const Icon = categoryIcons[selectedCert.category];
                        return <Icon className="h-8 w-8" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-1">{selectedCert.name}</h2>
                      <p className="text-primary font-medium">{selectedCert.institution}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-accent border-accent/30">
                        {t(`certificates.categories.${selectedCert.category}`)}
                      </Badge>
                      <Badge variant="outline">{selectedCert.period}</Badge>
                      <Badge
                        variant={selectedCert.status === 'completed' ? 'default' : 'secondary'}
                      >
                        {selectedCert.status === 'completed'
                          ? t('certificates.completed')
                          : t('certificates.inProgress')}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">{t('certificates.descriptionLabel')}</h3>
                      <p className="text-muted-foreground">{selectedCert.description}</p>
                    </div>

                    {selectedCert.file ? (
                      <div className="bg-muted/30 rounded-xl overflow-hidden border">
                        <iframe
                          src={`${selectedCert.file}#page=1&view=FitH&zoom=page-width&toolbar=0&navpanes=0&scrollbar=0`}
                          title={selectedCert.name}
                          className="w-full h-[600px] -mt-12 pointer-events-none"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="bg-muted/30 rounded-xl p-8 text-center">
                        <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-muted-foreground">{t('certificates.preview')}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('certificates.pdfComingSoon')}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1"
                        disabled={!selectedCert.file}
                      >
                        <a href={selectedCert.file || '#'} download>
                          <Download className="h-4 w-4 mr-2" />
                          {t('certificates.downloadPDF')}
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6 pt-4 border-t">
                    <Button variant="ghost" size="sm" onClick={goToPrev}>
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      {t('certificates.previous')}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentIndex + 1} / {cvData.certificates.length}
                    </span>
                    <Button variant="ghost" size="sm" onClick={goToNext}>
                      {t('certificates.next')}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SectionWrapper>
  );
}
