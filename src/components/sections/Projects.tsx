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
  Sparkles,
  Zap,
} from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { SectionQA } from '@/components/ai/SectionQA';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCvData } from '@/lib/cv-data-context';
import { useTranslation } from '@/i18n';
import { getGitHubRepos, formatDate } from '@/lib/github-api';
import type { GitHubRepo } from '@/types';
import { cn } from '@/lib/utils';

const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  Python: 'bg-green-500',
  HTML: 'bg-orange-500',
  CSS: 'bg-purple-500',
  default: 'bg-gray-500',
};

const repoLogos: Record<string, { src: string; alt: string }> = {
  'tin.io': { src: '/images/projects/tin-io-logo.jpg', alt: 'Tin.io' },
  'tin-io': { src: '/images/projects/tin-io-logo.jpg', alt: 'Tin.io' },
  'tyr': { src: '/images/projects/tyr-logo.png', alt: 'TYR' },
  'vitae.ai': { src: '/brand/vitae-logo.png', alt: 'Vitae.ai' },
  'vitae-ai': { src: '/brand/vitae-logo.png', alt: 'Vitae.ai' },
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

  if (!featuredProject) {
    return null;
  }

  const suggestedQuestions = tArray('qa.suggestions.projects');

  return (
    <SectionWrapper id="projects" className="bg-muted/20">
      <SectionTitle
        subtitle={t('projects.subtitle')}
        action={<SectionQA section="projects" suggestedQuestions={suggestedQuestions} />}
      >
        {t('projects.title')}
      </SectionTitle>

      {/* Featured Project - Conecta Panama */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="gap-1 bg-amber-500 hover:bg-amber-600">
                    <Trophy className="h-3 w-3" />
                    {featuredProject.result}
                  </Badge>
                  <Badge variant="outline">{featuredProject.year}</Badge>
                </div>
                <CardTitle className="text-2xl md:text-3xl">
                  {featuredProject.name}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {featuredProject.event}
                </CardDescription>
                {featuredLogo && (
                  <div className="mt-4">
                    <div className="relative h-16 w-40 sm:h-20 sm:w-52 rounded-lg border bg-muted/20 p-2">
                      <Image
                        src={featuredLogo.src}
                        alt={featuredLogo.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 160px, 208px"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10">
                <Trophy className="h-10 w-10 text-amber-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {featuredProject.longDescription}
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {featuredProject.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                  {feature}
                </motion.div>
              ))}
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-6">
              {featuredProject.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>

            {/* Impact */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
              <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">{t('projects.impact')}</p>
                <p className="text-sm text-muted-foreground">
                  {featuredProject.impact}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {otherProjects.length > 0 && (
        <div className="mb-12 grid gap-4 md:grid-cols-2">
          {otherProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="h-full border border-border/60 bg-background/60">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline">{project.year}</Badge>
                    <Badge variant="secondary">{project.type}</Badge>
                  </div>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.images?.[0] && (
                    <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden border bg-muted/20">
                      <Image
                        src={project.images[0]}
                        alt={project.name}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {project.shortDescription}
                  </p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    )}
                    {project.demoUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Demo
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* GitHub Repos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Github className="h-5 w-5" />
            {t('projects.githubRepos')}
          </h3>
          <Button variant="outline" size="sm" asChild>
            <a
              href={cvData.personal.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('projects.viewProfile')}
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-xl bg-muted/50 animate-pulse"
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  'group block p-5 rounded-xl border bg-background',
                  'hover:border-primary/50 hover:shadow-lg transition-all'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {repo.name}
                </h4>
                {logo && (
                  <div className="relative w-full h-52 rounded-xl overflow-hidden border bg-muted/20 mb-3">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {repo.description || t('projects.noDescription')}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          languageColors[repo.language] || languageColors.default
                        )}
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

                <p className="text-xs text-muted-foreground mt-3">
                  {t('projects.updated')}: {formatDate(repo.updatedAt, language)}
                </p>
              </motion.a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Github className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('projects.loadError')}</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
