'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Github, Linkedin, Mail, Download, ArrowRight } from 'lucide-react';
import { QrCard } from '@/components/ui/QrCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCvData } from '@/lib/cv-data-context';
import { useTranslation } from '@/i18n';
import { IS_DEMO, PERSONAL_URL } from '@/lib/app-config';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t, language } = useTranslation();
  const { cvData } = useCvData();

  const cvFile = language === 'en' ? '/cv/CV_Martin_Bundy_2026_EN.pdf' : '/cv/CV_Martin_Bundy_2026_ES.pdf';
  const primaryCta = IS_DEMO
    ? { href: '/demo', label: t('hero.demoCta') }
    : { href: cvFile, label: t('hero.downloadCV'), download: true };

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

  useEffect(() => {
    const magneticCleanup: Array<() => void> = [];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.set('[data-hero-bg]', { scale: 1.08, opacity: 0.74 });
      gsap.set('[data-hero-overlay]', { opacity: 0 });
      gsap.set('[data-hero-reveal]', { opacity: 0, y: 56 });
      gsap.set('[data-hero-right-card]', { opacity: 0, y: 26 });
      gsap.set('[data-hero-status]', { opacity: 0 });
      gsap.set('[data-hero-scroll]', { opacity: 0 });
      gsap.set('[data-hero-profile-shell]', { opacity: 0, y: 22, scale: 0.9 });
      gsap.set('[data-hero-stack-bar]', { width: '0%' });

      if (prefersReducedMotion) {
        gsap.set('[data-hero-bg]', { scale: 1, opacity: 1, yPercent: 0 });
        gsap.set('[data-hero-overlay]', { opacity: 1 });
        gsap.set('[data-hero-reveal], [data-hero-right-card], [data-hero-status], [data-hero-scroll], [data-hero-profile-shell]', {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        gsap.set('[data-hero-stack-bar]', {
          width: (_i, el) => (el as HTMLElement).dataset.width ?? '62%',
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to('[data-hero-bg]', {
        scale: 1,
        opacity: 1,
        duration: 1.9,
        ease: 'power2.out',
      })
        .to(
          '[data-hero-overlay]',
          {
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
          },
          0.06
        )
        .to('[data-hero-reveal]', {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.13,
        delay: 0.16,
      })
        .to(
          '[data-hero-right-card]',
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
          '-=0.38'
        )
        .to('[data-hero-status]', { opacity: 1, duration: 0.6 }, '-=0.2')
        .to('[data-hero-scroll]', { opacity: 1, duration: 0.5 }, '-=0.24');

      gsap.to('[data-hero-profile-shell]', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.05,
        delay: 0.42,
        ease: 'power3.out',
      });

      gsap.to('[data-hero-profile-shell]', {
        y: -8,
        duration: 3.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const signalPath = sectionRef.current?.querySelector<SVGPathElement>('[data-hero-signal-path]');
      if (signalPath) {
        const length = signalPath.getTotalLength();
        gsap.set(signalPath, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
        gsap.to(signalPath, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 1.5,
          delay: 1.1,
          ease: 'power1.inOut',
        });
      }

      gsap.to('[data-hero-signal-dot]', {
        scale: 1.5,
        opacity: 0.6,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.3,
      });

      gsap.to('[data-hero-stack-bar]', {
        width: (_i, el) => (el as HTMLElement).dataset.width ?? '62%',
        duration: 1.1,
        stagger: 0.12,
        delay: 1.3,
        ease: 'power3.out',
      });

      gsap.to('[data-hero-scroll-icon]', {
        y: 7,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('[data-hero-bg]', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      const rightCards = gsap.utils.toArray<HTMLElement>('[data-hero-right-card]');
      rightCards.forEach((card, index) => {
        gsap.to(card, {
          y: index === 0 ? -6 : 5,
          duration: 3 + index * 0.45,
          repeat: -1,
          yoyo: true,
          delay: 1.7 + index * 0.12,
          ease: 'sine.inOut',
        });
      });

      const magneticTargets = gsap.utils.toArray<HTMLElement>('[data-magnetic]');
      magneticTargets.forEach((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

        const onMove = (event: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const relX = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
          const relY = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

          xTo(gsap.utils.clamp(-10, 10, relX * 24));
          yTo(gsap.utils.clamp(-8, 8, relY * 20));
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        magneticCleanup.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    }, sectionRef);

    return () => {
      magneticCleanup.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-[100dvh] w-full flex items-end overflow-hidden">
      <div data-hero-bg className="absolute inset-0">
        <Image
          src="/hero-forest.jpeg"
          alt="Hero background moody forest"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div
        data-hero-overlay
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(46,64,54,0.97) 0%, rgba(46,64,54,0.80) 30%, rgba(26,26,26,0.60) 58%, rgba(0,0,0,0.18) 100%)',
        }}
      />

      <div data-hero-profile-shell className="absolute inset-0 z-[8] pointer-events-none flex flex-col items-center justify-start sm:justify-center pt-32 sm:pt-0">
        <div className="relative w-[clamp(160px,42vw,420px)] aspect-square">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 20%, rgba(242,240,233,0.22) 0%, rgba(46,64,54,0.14) 58%, rgba(26,26,26,0.08) 100%)',
              border: '1px solid rgba(242,240,233,0.26)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.40), inset 0 0 0 1px rgba(242,240,233,0.10)',
            }}
          />
          <div className="absolute inset-[6%] rounded-full overflow-hidden" style={{ border: '1px solid rgba(242,240,233,0.26)' }}>
            <Image
              src="/martin-profile.webp"
              alt={cvData.personal.fullName || cvData.personal.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 72vw, (max-width: 1280px) 34vw, 420px"
              priority
            />
          </div>
        </div>
        {/* Badge: below the photo on both mobile and desktop */}
        <div
          data-hero-status
          className="mt-4 sm:mt-5 flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: 'rgba(26,26,26,0.45)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(242,240,233,0.14)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span
            className="text-xs tracking-[0.22em] uppercase"
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              color: 'rgba(242,240,233,0.88)',
            }}
          >
            {t('hero.availableForHire')}
          </span>
        </div>
      </div>

      {/* Mobile-only slogan: above the photo */}
      <div data-hero-reveal className="sm:hidden absolute top-24 left-0 right-0 z-10 flex items-center justify-center gap-3">
        <span className="text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: 'oklch(0.565 0.158 37)' }}>
          Vitae.ai
        </span>
        <div className="h-px w-12 flex-shrink-0" style={{ backgroundColor: 'oklch(0.565 0.158 37)' }} />
        <span className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: 'rgba(242,240,233,0.58)' }}>
          {t('hero.slogan')}
        </span>
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-20 md:pb-28">
        <div className="max-w-3xl">
          <div data-hero-reveal className="hidden sm:flex items-center gap-3 mb-6">
            <span className="text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: 'oklch(0.565 0.158 37)' }}>
              Vitae.ai
            </span>
            <div className="h-px w-12 flex-shrink-0" style={{ backgroundColor: 'oklch(0.565 0.158 37)' }} />
            <span className="hidden sm:inline text-xs tracking-[0.2em] uppercase font-medium" style={{ color: 'rgba(242,240,233,0.58)' }}>
              {t('hero.slogan')}
            </span>
          </div>

          <div data-hero-reveal className="mb-3">
            <span className="text-sm font-light tracking-wide" style={{ color: 'rgba(242,240,233,0.62)' }}>
              {cvData.personal.location}
            </span>
          </div>

          <h1 data-hero-reveal className="mb-5 leading-none">
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
          </h1>

          <p data-hero-reveal className="text-base md:text-lg font-light max-w-lg mb-8 leading-relaxed" style={{ color: 'rgba(242,240,233,0.68)' }}>
            {t('hero.title')}
          </p>

          <div data-hero-reveal className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 mr-1">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic
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
              data-magnetic
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
                data-magnetic
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
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col gap-4 absolute right-8 xl:right-14 bottom-24 z-10 pointer-events-none">
        <div
          data-hero-right-card
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
              <path
                data-hero-signal-path
                d="M0 44 C24 44, 30 24, 56 24 C82 24, 92 49, 120 49 C148 49, 160 18, 190 18 C220 18, 230 36, 280 36"
                fill="none"
                stroke="rgba(204,88,51,0.95)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle data-hero-signal-dot cx="190" cy="18" r="4" fill="oklch(0.565 0.158 37)" />
            </svg>
          </div>
          <div
            className="flex justify-between text-[10px]"
            style={{ color: 'rgba(242,240,233,0.60)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            <span>Impact</span>
            <span>Performance</span>
            <span>Growth</span>
          </div>
        </div>

        <div
          data-hero-right-card
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
                <span className="text-xs" style={{ color: 'rgba(242,240,233,0.82)' }}>
                  {tag}
                </span>
                <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    data-hero-stack-bar
                    data-width={`${88 - i * 14}%`}
                    className="h-full rounded-full"
                    style={{ backgroundColor: 'oklch(0.565 0.158 37)', width: '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Card — desktop only, top-right */}
      <div
        data-hero-reveal
        className="hidden lg:block absolute right-8 xl:right-14 top-24 z-10"
      >
        <QrCard
          url="https://portfolio-eitinchos-projects.vercel.app/"
          label="Escanear · Ver CV"
          size={88}
        />
      </div>

      <button
        data-hero-scroll
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity hover:opacity-60"
        style={{ color: 'rgba(242,240,233,0.38)' }}
        aria-label="Scroll to about section"
      >
        <div data-hero-scroll-icon>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
    </section>
  );
}
