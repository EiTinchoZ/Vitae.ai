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
} from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
};

const categoryKeys = ['master', 'specialization', 'technical', 'languages', 'programming'] as const;

export function Certificates() {
  const { t } = useTranslation();
  const { cvData } = useCvData();
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

  const renderPreview = (cert: Certificate) => {
    if (cert.thumbnail) {
      return (
        <Image
          src={cert.thumbnail}
          alt={cert.name}
          width={400}
          height={112}
          className="w-full h-28 object-cover rounded-lg border"
          loading="lazy"
        />
      );
    }

    if (cert.file) {
      const pdfUrl = `${cert.file}#page=1&view=FitH&zoom=page-width&toolbar=0&navpanes=0&scrollbar=0`;
      return (
        <div className="h-32 rounded-lg border overflow-hidden bg-muted/30">
          <iframe
            src={pdfUrl}
            title={cert.name}
            className="w-full h-[calc(100%+56px)] -mt-14 pointer-events-none"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div className="h-28 rounded-lg border bg-muted/30 flex items-center justify-center text-muted-foreground text-xs">
        {t('certificates.preview')}
      </div>
    );
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
          src="/images/backgrounds/education-nura-bg.jpeg"
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
                  'group relative p-6 rounded-[2rem] border bg-background cursor-pointer',
                  'hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg transition-all duration-300'
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

                <div className="mt-4">{renderPreview(cert)}</div>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-[2rem] bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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

                {/* Certificate preview */}
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
                    <p className="text-muted-foreground">
                      {t('certificates.preview')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('certificates.pdfComingSoon')}
                    </p>
                  </div>
                )}

                {/* Actions */}
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
        </div>
      </div>
    </SectionWrapper>
  );
}
