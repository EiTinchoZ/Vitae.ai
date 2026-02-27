'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Github, Linkedin, Mail, Download, ArrowRight } from 'lucide-react';
import { useCvData } from '@/lib/cv-data-context';
import { useTranslation } from '@/i18n';
import { IS_DEMO, PERSONAL_URL } from '@/lib/app-config';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.25,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 56 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export function Hero() {
  const { t } = useTranslation();
  const { cvData } = useCvData();

  const primaryCta = IS_DEMO
    ? { href: '/demo', label: t('hero.demoCta') }
    : { href: '/cv/CV_Martin_Bundy_2026.pdf', label: t('hero.downloadCV'), download: true };

  const secondaryCtaHref = IS_DEMO ? PERSONAL_URL : null;

  const socialLinks = [
    { name: 'GitHub', href: cvData.personal.github, icon: Github },
    { name: 'LinkedIn', href: cvData.personal.linkedin, icon: Linkedin },
    { name: 'Email', href: `mailto:${cvData.personal.email}`, icon: Mail },
  ].filter((link) => link.href && link.href !== 'mailto:');

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const fullName = cvData.personal.fullName || cvData.personal.name || 'Martin Bundy';
  const nameParts = fullName.trim().split(/\s+/);
  const givenName = nameParts[0];
  const familyName = nameParts.length >= 3 ? nameParts[2] : nameParts[1] || 'Bundy';

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] w-full flex items-end overflow-hidden"
    >
      <Image
        src="/hero-forest.jpeg"
        alt="Hero background moody forest"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(46,64,54,0.97) 0%, rgba(46,64,54,0.80) 30%, rgba(26,26,26,0.60) 58%, rgba(0,0,0,0.18) 100%)',
        }}
      />

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-20 md:pb-28">
        <motion.div
          className="max-w-3xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="flex items-center gap-3 mb-6">
            <span
              className="text-xs tracking-[0.3em] uppercase font-semibold"
              style={{ color: 'oklch(0.565 0.158 37)' }}
            >
              Vitae.ai
            </span>
            <div
              className="h-px w-12 flex-shrink-0"
              style={{ backgroundColor: 'oklch(0.565 0.158 37)' }}
            />
            <span
              className="text-xs tracking-[0.2em] uppercase font-medium"
              style={{ color: 'rgba(242,240,233,0.58)' }}
            >
              {t('hero.slogan')}
            </span>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0"
              style={{ boxShadow: '0 0 0 2px rgba(242,240,233,0.20)' }}
            >
              <Image
                src="/martin-profile.webp"
                alt={cvData.personal.fullName || cvData.personal.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span
              className="text-sm font-light tracking-wide"
              style={{ color: 'rgba(242,240,233,0.62)' }}
            >
              {cvData.personal.location}
            </span>
          </motion.div>

          <motion.h1 variants={item} className="mb-5 leading-none">
            <span
              className="block font-bold text-white"
              style={{
                fontFamily: 'var(--font-jakarta), sans-serif',
                fontSize: 'clamp(2.8rem, 7.5vw, 5.5rem)',
                letterSpacing: '-0.01em',
              }}
            >
              {givenName}
            </span>
            <span
              className="block italic"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(4.8rem, 14vw, 9.5rem)',
                color: 'oklch(0.962 0.007 83)',
                letterSpacing: '-0.025em',
                lineHeight: '0.9',
              }}
            >
              {familyName}.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base md:text-lg font-light max-w-lg mb-8 leading-relaxed"
            style={{ color: 'rgba(242,240,233,0.68)' }}
          >
            {t('hero.title')}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 mr-1">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{
                    background: 'rgba(242,240,233,0.10)',
                    color: 'rgba(242,240,233,0.82)',
                    border: '1px solid rgba(242,240,233,0.18)',
                  }}
                  aria-label={link.name}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <a
              href={primaryCta.href}
              {...(primaryCta.download ? { download: true } : {})}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 hover:brightness-110 active:scale-95"
              style={{
                background: 'oklch(0.565 0.158 37)',
                color: 'oklch(0.962 0.007 83)',
              }}
            >
              {!IS_DEMO && <Download className="h-4 w-4" />}
              {primaryCta.label}
            </a>

            {secondaryCtaHref && (
              <a
                href={secondaryCtaHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
                style={{
                  color: 'rgba(242,240,233,0.88)',
                  border: '1px solid rgba(242,240,233,0.25)',
                }}
              >
                {t('hero.personalPreview')}
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-col gap-4 absolute right-8 xl:right-14 bottom-24 z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="rounded-[1.4rem] p-5 w-[280px]"
          style={{
            backgroundColor: 'rgba(242,240,233,0.1)',
            border: '1px solid rgba(242,240,233,0.22)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 22px 40px rgba(0,0,0,0.24)',
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.2em] mb-2"
            style={{ color: 'rgba(242,240,233,0.62)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            Career Signal
          </p>
          <div className="relative h-16 mb-2">
            <svg viewBox="0 0 280 64" className="w-full h-full">
              <motion.path
                d="M0 44 C24 44, 30 24, 56 24 C82 24, 92 49, 120 49 C148 49, 160 18, 190 18 C220 18, 230 36, 280 36"
                fill="none"
                stroke="rgba(204,88,51,0.95)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.1, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="190"
                cy="18"
                r="4"
                fill="oklch(0.565 0.158 37)"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
              />
            </svg>
          </div>
          <div
            className="flex justify-between text-[10px]"
            style={{ color: 'rgba(242,240,233,0.45)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            <span>Impact</span>
            <span>Performance</span>
            <span>Growth</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="rounded-[1.4rem] p-5 w-[280px]"
          style={{
            backgroundColor: 'rgba(26,26,26,0.45)',
            border: '1px solid rgba(242,240,233,0.18)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 22px 40px rgba(0,0,0,0.24)',
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.2em] mb-2"
            style={{ color: 'rgba(242,240,233,0.55)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            Active Stack
          </p>
          <div className="space-y-2.5">
            {['AI/ML', 'Industrial Eng.', 'Automation'].map((tag, i) => (
              <div key={tag} className="flex items-center justify-between gap-3">
                <span className="text-xs" style={{ color: 'rgba(242,240,233,0.82)' }}>{tag}</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: 'oklch(0.565 0.158 37)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${88 - i * 14}%` }}
                    transition={{ duration: 1.1, delay: 1.3 + i * 0.12 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 right-6 md:right-10 z-10 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span
          className="text-xs tracking-[0.22em] uppercase"
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            color: 'rgba(242,240,233,0.42)',
          }}
        >
          Available for hire
        </span>
      </motion.div>

      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity hover:opacity-60"
        style={{ color: 'rgba(242,240,233,0.38)' }}
        aria-label="Scroll to about section"
      >
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}
