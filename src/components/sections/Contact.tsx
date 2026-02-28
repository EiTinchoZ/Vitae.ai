'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Download,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { useCvData } from '@/lib/cv-data-context';
import { useTranslation } from '@/i18n';
import { IS_DEMO } from '@/lib/app-config';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function Contact() {
  const { t } = useTranslation();
  const { cvData } = useCvData();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: formName, email: formEmail, message: formMessage }),
      });
      if (!res.ok) throw new Error('server error');
      setFormStatus('success');
      setFormName('');
      setFormEmail('');
      setFormMessage('');
    } catch {
      setFormStatus('error');
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t('contact.info.email'),
      value: cvData.personal.email,
      href: `mailto:${cvData.personal.email}`,
    },
    {
      icon: Phone,
      label: t('contact.info.phone'),
      value: t('contact.info.phoneViaEmail'),
      href: `mailto:${cvData.personal.email}?subject=${encodeURIComponent(t('contact.info.phoneRequestSubject'))}`,
    },
    {
      icon: MapPin,
      label: t('contact.info.location'),
      value: cvData.personal.location,
      href: null,
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: t('contact.social.github'),
      value: '@EiTinchoZ',
      href: cvData.personal.github,
    },
  ];

  const inputClass =
    'w-full rounded-xl border px-4 py-2.5 text-sm transition-colors placeholder:text-[rgba(242,240,233,0.45)] focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <SectionWrapper id="contact" className="bg-muted/20">
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
              'linear-gradient(to bottom, rgba(242,240,233,0.95) 0%, rgba(242,240,233,0.90) 42%, rgba(242,240,233,0.96) 100%)',
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
          <SectionTitle subtitle={t('contact.subtitle')}>
            {t('contact.title')}
          </SectionTitle>

          <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <p
                className="text-xs tracking-[0.26em] uppercase mb-3"
                style={{
                  color: 'oklch(0.565 0.158 37)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                }}
              >
                Vitae.ai
              </p>
              <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                {t('contact.letsConnect')}
              </h3>
              <p
                className="text-3xl md:text-4xl italic text-primary/85 mb-4"
                style={{ fontFamily: 'var(--font-cormorant), serif' }}
              >
                {t('contact.tagline')}
              </p>
              <p className="text-muted-foreground">
                {t('contact.description')}
              </p>
            </div>

            {!IS_DEMO && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative overflow-hidden rounded-[2rem] border bg-muted/20">
                  <Image
                    src="/contact-photo.webp"
                    alt="Martin Bundy en un evento"
                    width={1400}
                    height={900}
                    className="h-56 sm:h-64 md:h-72 w-full object-cover object-center"
                    priority
                  />
                </div>
              </motion.div>
            )}

            {/* LinkedIn highlight */}
            <a
              href={cvData.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-[1.5rem] border p-5 transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: 'oklch(0.282 0.038 152 / 0.08)',
                borderColor: 'oklch(0.282 0.038 152 / 0.22)',
              }}
            >
              <div
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: 'oklch(0.565 0.158 37)',
                  color: 'oklch(0.962 0.007 83)',
                }}
              >
                <Linkedin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.14em]">
                  {t('contact.linkedinLabel')}
                </p>
                <p className="font-semibold text-base">{t('contact.linkedinTitle')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('contact.linkedinDescription')}
                </p>
              </div>
            </a>

            {/* Contact cards */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-4 p-4 rounded-[1.25rem] border hover:-translate-y-0.5 transition-all group nura-hover-card"
                      style={{
                        backgroundColor: 'oklch(0.282 0.038 152 / 0.05)',
                        borderColor: 'oklch(0.282 0.038 152 / 0.16)',
                      }}
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary transition-colors">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-[0.12em]">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div
                      className="flex items-center gap-4 p-4 rounded-[1.25rem] border nura-hover-card"
                      style={{
                        backgroundColor: 'oklch(0.282 0.038 152 / 0.05)',
                        borderColor: 'oklch(0.282 0.038 152 / 0.16)',
                      }}
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-[0.12em]">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3 pt-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 rounded-full border hover:-translate-y-0.5 active:scale-[0.97] transition-all text-base font-semibold nura-hover-card"
                  style={{
                    backgroundColor: 'oklch(0.282 0.038 152 / 0.05)',
                    borderColor: 'oklch(0.282 0.038 152 / 0.20)',
                  }}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.value}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="h-full rounded-[2rem] border p-7 md:p-8 flex flex-col nura-hover-card"
              style={{
                backgroundColor: 'oklch(0.127 0 0)',
                borderColor: 'rgba(242,240,233,0.14)',
              }}
            >
              <div className="mb-6">
                <h3
                  className="text-2xl font-semibold mb-1"
                  style={{ color: 'rgba(242,240,233,0.95)' }}
                >
                  {t('contact.cta.title')}
                </h3>
                <p
                  className="text-3xl italic leading-tight mb-2"
                  style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    color: 'oklch(0.565 0.158 37)',
                  }}
                >
                  {t('contact.formTagline')}
                </p>
                <p className="text-sm" style={{ color: 'rgba(242,240,233,0.65)' }}>
                  {t('contact.cta.description')}
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="flex-1 flex flex-col gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-name"
                    className="text-xs uppercase tracking-[0.14em]"
                    style={{
                      color: 'rgba(242,240,233,0.72)',
                      fontFamily: 'var(--font-geist-mono), monospace',
                    }}
                  >
                    {t('contact.form.namePlaceholder')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder={t('contact.form.namePlaceholder')}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    disabled={formStatus === 'loading' || formStatus === 'success'}
                    required
                    className={inputClass}
                    style={{
                      backgroundColor: 'rgba(242,240,233,0.06)',
                      borderColor: 'rgba(242,240,233,0.16)',
                      color: 'rgba(242,240,233,0.95)',
                      boxShadow: 'none',
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-email"
                    className="text-xs uppercase tracking-[0.14em]"
                    style={{
                      color: 'rgba(242,240,233,0.72)',
                      fontFamily: 'var(--font-geist-mono), monospace',
                    }}
                  >
                    {t('contact.info.email')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder={t('contact.form.emailPlaceholder')}
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    disabled={formStatus === 'loading' || formStatus === 'success'}
                    required
                    className={inputClass}
                    style={{
                      backgroundColor: 'rgba(242,240,233,0.06)',
                      borderColor: 'rgba(242,240,233,0.16)',
                      color: 'rgba(242,240,233,0.95)',
                      boxShadow: 'none',
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-xs uppercase tracking-[0.14em]"
                    style={{
                      color: 'rgba(242,240,233,0.72)',
                      fontFamily: 'var(--font-geist-mono), monospace',
                    }}
                  >
                    {t('contact.form.messagePlaceholder')}
                  </label>
                  <textarea
                    id="contact-message"
                    placeholder={t('contact.form.messagePlaceholder')}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    disabled={formStatus === 'loading' || formStatus === 'success'}
                    required
                    rows={4}
                    className={`${inputClass} resize-none`}
                    style={{
                      backgroundColor: 'rgba(242,240,233,0.06)',
                      borderColor: 'rgba(242,240,233,0.16)',
                      color: 'rgba(242,240,233,0.95)',
                      boxShadow: 'none',
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={formStatus === 'loading' || formStatus === 'success'}
                  className="w-full gap-2 mt-1 border-0 hover:brightness-110"
                  style={{
                    backgroundColor: 'oklch(0.565 0.158 37)',
                    color: 'oklch(0.962 0.007 83)',
                  }}
                >
                  {formStatus === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('contact.form.sending')}
                    </>
                  ) : formStatus === 'success' ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      {t('contact.form.success')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t('contact.form.send')}
                    </>
                  )}
                </Button>

                {formStatus === 'error' && (
                  <p
                    className="text-xs text-center flex items-center justify-center gap-1.5"
                    style={{ color: '#f87171' }}
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {t('contact.form.error')}
                  </p>
                )}
              </form>

              <div className="mt-6 pt-5 border-t space-y-5" style={{ borderColor: 'rgba(242,240,233,0.14)' }}>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  style={{
                    borderColor: 'rgba(242,240,233,0.22)',
                    color: 'rgba(242,240,233,0.88)',
                    backgroundColor: 'transparent',
                  }}
                >
                  <a href="/cv/CV_Martin_Bundy_2026.pdf" download>
                    <Download className="h-3.5 w-3.5" />
                    {t('contact.cta.downloadCV')}
                  </a>
                </Button>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p
                      className="text-3xl italic leading-none"
                      style={{
                        fontFamily: 'var(--font-cormorant), serif',
                        color: 'oklch(0.565 0.158 37)',
                      }}
                    >
                      2+
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(242,240,233,0.70)' }}>
                      {t('contact.stats.careers')}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className="text-3xl italic leading-none"
                      style={{
                        fontFamily: 'var(--font-cormorant), serif',
                        color: 'oklch(0.565 0.158 37)',
                      }}
                    >
                      {cvData.certificates.length}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(242,240,233,0.70)' }}>
                      {t('contact.stats.certifications')}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className="text-3xl italic leading-none"
                      style={{
                        fontFamily: 'var(--font-cormorant), serif',
                        color: 'oklch(0.565 0.158 37)',
                      }}
                    >
                      C2
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(242,240,233,0.70)' }}>
                      {t('contact.stats.english')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
