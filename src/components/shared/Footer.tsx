'use client';

import { Github, Linkedin, Mail } from 'lucide-react';
import { useCvData } from '@/lib/cv-data-context';
import { IS_DEMO } from '@/lib/app-config';
import { useTranslation } from '@/i18n';

export function Footer() {
  const { t } = useTranslation();
  const { cvData } = useCvData();
  const currentYear = new Date().getFullYear();
  const utilityLinks = [
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.skills'), href: '#skills' },
    { label: t('nav.projects'), href: '#projects' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  const socialLinks = IS_DEMO
    ? []
    : [
        {
          name: 'GitHub',
          href: cvData.personal.github,
          icon: Github,
        },
        {
          name: 'LinkedIn',
          href: cvData.personal.linkedin,
          icon: Linkedin,
        },
        {
          name: 'Email',
          href: `mailto:${cvData.personal.email}`,
          icon: Mail,
        },
      ];

  return (
    <footer
      className="rounded-t-[3rem] border-t border-[rgba(242,240,233,0.10)]"
      style={{ backgroundColor: 'oklch(0.127 0 0)' }}
    >
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left">
          <div className="space-y-4">
            <span className="inline-block font-semibold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Vitae.ai
            </span>
            <p className="text-sm text-[rgba(242,240,233,0.70)]">
              {t('footer.madeWith')}
            </p>
            <p className="text-sm text-[rgba(242,240,233,0.70)]">
              &copy; {currentYear} {IS_DEMO ? 'Vitae.ai Demo' : cvData.personal.name}. {t('footer.rights')}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[rgba(242,240,233,0.70)]">
              {t('footer.navigation')}
            </h3>
            <nav className="flex flex-col gap-2">
              {utilityLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[rgba(242,240,233,0.70)] hover:text-[rgba(242,240,233,0.95)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[rgba(242,240,233,0.70)]">
              {t('footer.connect')}
            </h3>
            <div className="flex flex-col gap-2 items-center md:items-start">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[rgba(242,240,233,0.70)] hover:text-[rgba(242,240,233,0.95)] transition-colors"
                  aria-label={link.name}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  color: 'rgba(242,240,233,0.45)',
                }}
              >
                System Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
