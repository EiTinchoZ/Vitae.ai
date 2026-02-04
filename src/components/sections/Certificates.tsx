'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getCvData } from '@/data/cv-data';
import { useTranslation } from '@/i18n';
import type { Certificate } from '@/types';
import { cn } from '@/lib/utils';

const categoryIcons = {
  master: GraduationCap,
  specialization: Award,
  technical: Cpu,
  languages: Languages,
  programming: Code,
};

const categoryKeys = ['master', 'specialization', 'technical', 'languages', 'programming'] as const;

export function Certificates() {
  const { t, language } = useTranslation();
  const cvData = getCvData(language);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');

  const filteredCerts =
    activeCategory === 'all'
      ? cvData.certificates
      : cvData.certificates.filter((cert) => cert.category === activeCategory);

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
    <SectionWrapper id="certificates">
      <SectionTitle subtitle={t('certificates.subtitle')}>
        {t('certificates.title')}
      </SectionTitle>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveCategory('all')}
        >
          {t('certificates.all')} ({cvData.certificates.length})
        </Button>
        {categoryKeys.map((cat) => {
          const Icon = categoryIcons[cat];
          const count = cvData.certificates.filter((c) => c.category === cat).length;
          if (count === 0) return null;

          return (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {t(`certificates.categories.${cat}`)} ({count})
            </Button>
          );
        })}
      </div>

      {/* Certificates grid */}
      <motion.div
        layout
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredCerts.map((cert, index) => {
            const Icon = categoryIcons[cert.category];

            return (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => setSelectedCert(cert)}
                className={cn(
                  'group relative p-6 rounded-xl border bg-background cursor-pointer',
                  'hover:border-primary/50 hover:shadow-lg transition-all'
                )}
              >
                {/* Category badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge
                    variant={cert.status === 'completed' ? 'default' : 'secondary'}
                    className="gap-1"
                  >
                    {cert.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        {t('certificates.completed')}
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" />
                        {t('certificates.inProgress')}
                      </>
                    )}
                  </Badge>
                </div>

                {/* Content */}
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {cert.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {cert.institution}
                </p>
                <p className="text-xs text-muted-foreground">{cert.period}</p>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Certificate Modal */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-2xl">
          {selectedCert && (
            <div className="relative">
              {/* Close button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
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

              {/* Details */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
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

                {/* Placeholder for certificate preview */}
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    {t('certificates.preview')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('certificates.pdfComingSoon')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    {t('certificates.downloadPDF')}
                  </Button>
                </div>
              </div>

              {/* Navigation */}
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
    </SectionWrapper>
  );
}
