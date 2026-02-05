'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCvData } from '@/data/cv-data';
import { useTranslation } from '@/i18n';
import { DEMO_URL, IS_DEMO, PERSONAL_URL } from '@/lib/app-config';

export function Hero() {
  const { t, language } = useTranslation();
  const cvData = getCvData(language);
  const primaryCta = IS_DEMO
    ? { href: '/demo', label: t('hero.demoCta') }
    : { href: '/cv/CV_Martin_Bundy_2026.pdf', label: t('hero.downloadCV'), download: true };
  const secondaryCtaHref = IS_DEMO ? PERSONAL_URL : null;
  const secondaryCtaLabel = t('hero.personalPreview');

  const socialLinks = [
    { name: 'GitHub', href: cvData.personal.github, icon: Github },
    { name: 'LinkedIn', href: cvData.personal.linkedin, icon: Linkedin },
    { name: 'Email', href: `mailto:${cvData.personal.email}`, icon: Mail },
  ];

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const specialties = cvData.about.specialties.slice(0, 4);

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full bg-secondary/5 blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Vitae.ai Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Vitae.ai
              </span>
              <span className="text-xs text-muted-foreground">
                {t('hero.slogan')}
              </span>
            </span>
          </motion.div>

          {/* Profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary p-1">
              <img
                src="/martin-profile.png"
                alt={cvData.personal.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            {cvData.personal.name}
          </motion.h1>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto"
          >
            {t('hero.title')}
          </motion.p>

          {/* Specialties */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {specialties.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
              >
                {skill}
              </span>
            ))}
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center gap-4 mb-8"
          >
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.name}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <a
                  href={primaryCta.href}
                  {...(primaryCta.download ? { download: true } : {})}
                  {...(IS_DEMO ? { target: '_self' } : {})}
                >
                  {!IS_DEMO && <Download className="h-4 w-4" />}
                  {primaryCta.label}
                </a>
              </Button>
              {secondaryCtaHref && (
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <a href={secondaryCtaHref} target="_blank" rel="noreferrer">
                    {secondaryCtaLabel}
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll to about section"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </motion.button>
    </section>
  );
}
