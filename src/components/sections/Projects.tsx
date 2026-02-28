'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Trophy,
  ExternalLink,
  Github,
  Star,
  GitFork,
  Zap,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { useCvData } from '@/lib/cv-data-context';
import { useTranslation } from '@/i18n';
import { getGitHubRepos, formatDate } from '@/lib/github-api';
import type { GitHubRepo } from '@/types';
import { cn } from '@/lib/utils';

const SectionQA = dynamic(
  () => import('@/components/ai/SectionQA').then(m => m.SectionQA),
  { ssr: false }
);

// ── Language dot colors — mapped to design palette ─────────────────
const languageColors: Record<string, string> = {
  TypeScript:  'oklch(0.565 0.158 37)',   // Clay
  JavaScript:  'oklch(0.720 0.110 77)',   // Amber/Gold
  Python:      'oklch(0.355 0.048 152)',  // Mid moss
  HTML:        'oklch(0.480 0.120 35)',   // Terra
  CSS:         'oklch(0.450 0.070 270)',  // Muted purple
  Rust:        'oklch(0.520 0.140 30)',   // Rust orange
  Go:          'oklch(0.560 0.100 200)',  // Teal
  default:     'oklch(0.500 0 0)',        // Neutral
};

const repoLogos: Record<string, { src: string; alt: string }> = {
  'tin.io':   { src: '/images/projects/tin-io-logo.jpg',         alt: 'Tin.io' },
  'tin-io':   { src: '/images/projects/tin-io-logo.jpg',         alt: 'Tin.io' },
  'tyr':      { src: '/images/projects/tyr-logo.webp',           alt: 'TYR' },
  'vitae.ai': { src: '/brand/vitae-logo.webp',                   alt: 'Vitae.ai' },
  'vitae-ai': { src: '/brand/vitae-logo.webp',                   alt: 'Vitae.ai' },
};

const featuredLogos: Record<string, { src: string; alt: string }> = {
  'project-1': { src: '/images/projects/conecta-panama-logo.jpg', alt: 'Conecta Panamá' },
};

export function Projects() {
  const { t, tArray, language } = useTranslation();
  const { cvData } = useCvData();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      const data = await getGitHubRepos();
      setRepos(data);
      setLoading(false);
    }
    fetchRepos();
  }, []);

  const featuredProject =
    cvData.projects.find((project) => project.isHighlighted) ?? cvData.projects[0];
  const featuredLogo = featuredProject ? featuredLogos[featuredProject.id] : null;
  const otherProjects = cvData.projects.filter((project) => !project.isHighlighted);

  if (!featuredProject) return null;

  const suggestedQuestions = tArray('qa.suggestions.projects');

  return (
    <SectionWrapper id="projects" className="bg-muted/20">
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
          <SectionTitle
            subtitle={t('projects.subtitle')}
            action={<SectionQA section="projects" suggestedQuestions={suggestedQuestions} />}
          >
            {t('projects.title')}
          </SectionTitle>

      {/* ── Featured Project — dark moss hero card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        className="mb-10"
      >
        <div
          className="rounded-[2.5rem] overflow-hidden border"
          style={{
            backgroundColor: 'oklch(0.230 0.030 152)',
            borderColor: 'rgba(242,240,233,0.09)',
          }}
        >
          <div className="p-7 md:p-10 lg:p-12">
            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(204,88,51,0.18)',
                  border: '1px solid rgba(204,88,51,0.32)',
                }}
              >
                <Trophy className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'oklch(0.565 0.158 37)' }} />
                <span
                  className="text-xs font-semibold tracking-[0.18em] uppercase"
                  style={{
                    color: 'oklch(0.565 0.158 37)',
                    fontFamily: 'var(--font-geist-mono), monospace',
                  }}
                >
                  {featuredProject.result}
                </span>
              </div>
              <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{
                  color: 'rgba(242,240,233,0.54)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                }}
              >
                {featuredProject.year}
              </span>
            </div>

            <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-14 items-start">
              {/* Left: text */}
              <div>
                <h3
                  className="font-bold leading-tight mb-2"
                  style={{
                    fontFamily: 'var(--font-jakarta), sans-serif',
                    fontSize: 'clamp(1.5rem, 4vw, 2.6rem)',
                    color: 'rgba(242,240,233,0.97)',
                  }}
                >
                  {featuredProject.name}
                </h3>
                <p
                  className="italic mb-6 leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
                    color: 'rgba(242,240,233,0.66)',
                  }}
                >
                  {featuredProject.event}
                </p>

                <p
                  className="text-sm leading-relaxed mb-7"
                  style={{ color: 'rgba(242,240,233,0.74)' }}
                >
                  {featuredProject.longDescription}
                </p>

                {/* Features */}
                <div className="grid sm:grid-cols-2 gap-2.5 mb-7">
                  {featuredProject.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + index * 0.055, duration: 0.35 }}
                      className="flex items-start gap-2.5"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{ backgroundColor: 'oklch(0.565 0.158 37)' }}
                      />
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: 'rgba(242,240,233,0.76)' }}
                      >
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-7">
                  {featuredProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: 'rgba(242,240,233,0.06)',
                        border: '1px solid rgba(242,240,233,0.12)',
                        color: 'rgba(242,240,233,0.65)',
                        fontFamily: 'var(--font-geist-mono), monospace',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Impact callout */}
                <div
                  className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{
                    backgroundColor: 'rgba(204,88,51,0.08)',
                    borderLeft: '3px solid oklch(0.565 0.158 37)',
                  }}
                >
                  <Zap
                    className="h-4 w-4 flex-shrink-0 mt-0.5"
                    style={{ color: 'oklch(0.565 0.158 37)' }}
                  />
                  <div>
                    <p
                      className="text-xs uppercase tracking-[0.18em] font-semibold mb-1"
                      style={{
                        color: 'oklch(0.565 0.158 37)',
                        fontFamily: 'var(--font-geist-mono), monospace',
                      }}
                    >
                      {t('projects.impact')}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'rgba(242,240,233,0.74)' }}
                    >
                      {featuredProject.impact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: logo */}
              {featuredLogo && (
                <div
                  className="hidden lg:flex items-center justify-center rounded-[1.5rem] p-7 flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(242,240,233,0.04)',
                    border: '1px solid rgba(242,240,233,0.07)',
                    minWidth: '190px',
                  }}
                >
                  <div className="relative h-28 w-36">
                    <Image
                      src={featuredLogo.src}
                      alt={featuredLogo.alt}
                      fill
                      className="object-contain"
                      sizes="144px"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Other Projects ── */}
      {otherProjects.length > 0 && (
        <div className="mb-10 grid gap-5 md:grid-cols-2">
          {otherProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-[2rem] overflow-hidden border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              style={{ borderColor: 'oklch(0.282 0.038 152 / 0.14)' }}
            >
              {project.images?.[0] && (
                <div
                  className="relative w-full h-40 overflow-hidden border-b bg-muted/20"
                  style={{ borderColor: 'oklch(0.282 0.038 152 / 0.10)' }}
                >
                  <Image
                    src={project.images[0]}
                    alt={project.name}
                    fill
                    className="object-contain p-5"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs tracking-[0.2em] uppercase font-medium"
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      color: 'oklch(0.565 0.158 37)',
                    }}
                  >
                    {project.year}
                  </span>
                  {project.type && (
                    <>
                      <span className="opacity-30">·</span>
                      <span
                        className="text-xs tracking-[0.12em] uppercase"
                        style={{
                          fontFamily: 'var(--font-geist-mono), monospace',
                          color: 'oklch(0.282 0.038 152 / 0.55)',
                        }}
                      >
                        {project.type}
                      </span>
                    </>
                  )}
                </div>
                <h4
                  className="font-bold text-lg mb-2 leading-tight"
                  style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                >
                  {project.name}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {project.shortDescription}
                </p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-full text-xs"
                        style={{
                          backgroundColor: 'oklch(0.282 0.038 152 / 0.07)',
                          border: '1px solid oklch(0.282 0.038 152 / 0.15)',
                          color: 'oklch(0.282 0.038 152)',
                          fontFamily: 'var(--font-geist-mono), monospace',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2.5">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95"
                      style={{
                        border: '1px solid oklch(0.282 0.038 152 / 0.24)',
                        color: 'oklch(0.282 0.038 152)',
                      }}
                    >
                      <Github className="h-3.5 w-3.5" />
                      GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 hover:brightness-110 active:scale-95"
                      style={{
                        backgroundColor: 'oklch(0.565 0.158 37)',
                        color: 'oklch(0.962 0.007 83)',
                      }}
                    >
                      Demo
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── GitHub Repos ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3
            className="font-semibold flex items-center gap-2 text-lg"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            <Github className="h-5 w-5 text-primary" />
            {t('projects.githubRepos')}
          </h3>
          <a
            href={cvData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              border: '1px solid oklch(0.282 0.038 152 / 0.22)',
              color: 'oklch(0.282 0.038 152)',
            }}
          >
            {t('projects.viewProfile')}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-[1.5rem] animate-pulse"
                style={{ backgroundColor: 'oklch(0.282 0.038 152 / 0.07)' }}
              />
            ))}
          </div>
        ) : repos.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo, index) => {
              const logo = repoLogos[repo.name.toLowerCase()];
              return (
                <motion.a
                  key={repo.id}
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.07 }}
                  className={cn(
                    'group block p-5 rounded-[1.5rem] border bg-card',
                    'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300'
                  )}
                  style={{ borderColor: 'oklch(0.282 0.038 152 / 0.12)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Github
                      className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"
                    />
                    <ExternalLink
                      className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  <h4
                    className="font-semibold mb-1 group-hover:text-primary transition-colors leading-tight"
                    style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                  >
                    {repo.name}
                  </h4>

                  {logo && (
                    <div
                      className="relative w-full h-44 rounded-xl overflow-hidden border bg-muted/20 mb-3"
                      style={{ borderColor: 'oklch(0.282 0.038 152 / 0.10)' }}
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}

                  <p
                    className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed"
                    style={{ fontSize: '0.78rem' }}
                  >
                    {repo.description || t('projects.noDescription')}
                  </p>

                  <div
                    className="flex items-center gap-4 text-muted-foreground"
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '0.70rem',
                    }}
                  >
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              languageColors[repo.language] ?? languageColors.default,
                          }}
                        />
                        {repo.language}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {repo.stargazersCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {repo.forksCount}
                    </div>
                  </div>

                  <p
                    className="text-muted-foreground mt-2.5"
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '0.68rem',
                    }}
                  >
                    {t('projects.updated')}: {formatDate(repo.updatedAt, language)}
                  </p>
                </motion.a>
              );
            })}
          </div>
        ) : (
          <div
            className="text-center py-16 rounded-[2rem]"
            style={{
              backgroundColor: 'oklch(0.282 0.038 152 / 0.05)',
              border: '1px solid oklch(0.282 0.038 152 / 0.10)',
            }}
          >
            <Github className="h-10 w-10 mx-auto mb-4 opacity-25 text-primary" />
            <p className="text-sm text-muted-foreground">{t('projects.loadError')}</p>
          </div>
        )}
      </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
