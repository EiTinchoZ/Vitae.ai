'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from '@/i18n';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function splitWords(text: string, splitKey: string) {
  return text.split(' ').map((word, idx) => (
    <span key={`${splitKey}-${word}-${idx}`} className="inline-block overflow-hidden mr-[0.34em] align-top">
      <span data-split={splitKey} className="split-word inline-block">
        {word}
      </span>
    </span>
  ));
}

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  const manifestoStats = [
    { value: '2025', label: t('manifesto.stats.hackathonLabel') },
    { value: 'C2', label: t('manifesto.stats.bilingualLabel') },
    { value: '2 Degrees', label: t('manifesto.stats.degreesLabel') },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftWords = gsap.utils.toArray<HTMLElement>('[data-split="left"]');
      const rightTopWords = gsap.utils.toArray<HTMLElement>('[data-split="right-top"]');
      const rightBigWords = gsap.utils.toArray<HTMLElement>('[data-split="right-big"]');

      gsap.set([...leftWords, ...rightTopWords, ...rightBigWords], {
        yPercent: 115,
        opacity: 0,
      });

      gsap.from('[data-manifesto-eyebrow]', {
        y: 18,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      });

      gsap.to(leftWords, {
        yPercent: 0,
        opacity: 1,
        duration: 0.78,
        stagger: 0.045,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
        },
      });

      gsap.to(rightTopWords, {
        yPercent: 0,
        opacity: 1,
        duration: 0.74,
        stagger: 0.045,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      gsap.to(rightBigWords, {
        yPercent: 0,
        opacity: 1,
        duration: 0.78,
        stagger: 0.055,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 66%',
        },
      });

      gsap.from('[data-manifesto-copy]', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 62%',
        },
      });

      gsap.from('.manifesto-stat', {
        y: 26,
        opacity: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.manifesto-stats-grid',
          start: 'top 78%',
        },
      });

      gsap.to('[data-manifesto-bg]', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ backgroundColor: 'oklch(0.127 0 0)' }}
    >
      <div data-manifesto-bg className="absolute inset-0">
        <Image
          src="/images/backgrounds/education-nura-bg.jpeg"
          alt=""
          aria-hidden
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(26,26,26,0.82) 0%, rgba(26,26,26,0.76) 44%, rgba(26,26,26,0.88) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 14% 18%, rgba(204,88,51,0.22) 0%, rgba(204,88,51,0) 46%), radial-gradient(circle at 86% 78%, rgba(46,64,54,0.22) 0%, rgba(46,64,54,0) 44%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
        <span
          data-manifesto-eyebrow
          className="inline-block text-xs tracking-[0.3em] uppercase font-semibold text-accent"
        >
          {t('manifesto.eyebrow')}
        </span>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-end">
          <p
            className="text-3xl md:text-4xl italic leading-tight"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              color: 'rgba(242,240,233,0.78)',
            }}
          >
            {splitWords(t('manifesto.leftQuote'), 'left')}
          </p>

          <div className="space-y-4">
            <p
              className="font-bold text-3xl md:text-4xl"
              style={{
                fontFamily: 'var(--font-jakarta), sans-serif',
                color: 'rgba(242,240,233,0.98)',
              }}
            >
              {splitWords(t('manifesto.rightTop'), 'right-top')}
            </p>

            <p
              className="italic text-6xl md:text-8xl leading-[0.95]"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                color: 'oklch(0.962 0.007 83)',
              }}
            >
              {splitWords(t('manifesto.rightBig'), 'right-big')}
            </p>

            <p
              data-manifesto-copy
              className="text-base md:text-lg"
              style={{
                fontFamily: 'var(--font-jakarta), sans-serif',
                color: 'rgba(242,240,233,0.78)',
              }}
            >
              {t('manifesto.copy')}
            </p>
          </div>
        </div>

        <div className="manifesto-stats-grid mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {manifestoStats.map((item) => (
            <div
              key={item.value}
              className="manifesto-stat rounded-[1.5rem] border border-[rgba(242,240,233,0.22)] bg-[rgba(242,240,233,0.08)] p-6"
            >
              <p
                className="text-lg uppercase tracking-[0.2em]"
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  color: 'rgba(242,240,233,0.92)',
                }}
              >
                {item.value}
              </p>
              <p
                className="mt-2 text-xs uppercase tracking-[0.16em]"
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  color: 'rgba(242,240,233,0.58)',
                }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
