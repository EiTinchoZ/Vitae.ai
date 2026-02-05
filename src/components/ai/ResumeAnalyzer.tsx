'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSearch,
  Loader2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  FolderKanban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { resolveAiError } from '@/lib/ai-errors';

interface SectionAnalysis {
  score: number;
  feedback: string;
}

interface Analysis {
  completenessScore: number;
  sections: {
    personal: SectionAnalysis;
    profile: SectionAnalysis;
    education: SectionAnalysis;
    experience: SectionAnalysis;
    skills: SectionAnalysis;
    certificates: SectionAnalysis;
    projects: SectionAnalysis;
  };
  highlights: string[];
  strengths: string[];
  improvements: string[];
  atsCompatibility: number;
  overallFeedback: string;
}

const sectionIcons = {
  personal: User,
  profile: FileText,
  education: GraduationCap,
  experience: Briefcase,
  skills: Code,
  certificates: Award,
  projects: FolderKanban,
};

export function ResumeAnalyzer() {
  const { t, language } = useTranslation();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeResume = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(resolveAiError(t, data?.errorCode, data?.error));
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let fullText = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setAnalysis(parsed);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('resumeAnalyzer.error');
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const normalizeScore = (score: number) =>
    Math.max(80, Math.min(100, Math.round(score)));


  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <FileSearch className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t('resumeAnalyzer.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('resumeAnalyzer.subtitle')}</p>
            </div>
          </div>

          <Button
            onClick={() => {
              if (!isOpen) {
                setIsOpen(true);
                if (!analysis) analyzeResume();
              } else if (analysis) {
                analyzeResume();
              }
            }}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('resumeAnalyzer.loading')}
              </>
            ) : analysis ? (
              <>
                <RefreshCw className="h-4 w-4" />
                {t('resumeAnalyzer.reanalyze')}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {t('resumeAnalyzer.analyze')}
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error && (
              <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                {error}
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Score Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Completeness Score */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">{t('resumeAnalyzer.completeness')}</span>
                        <span className={cn('text-2xl font-bold', getScoreColor(normalizeScore(analysis.completenessScore)))}>
                          {normalizeScore(analysis.completenessScore)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${normalizeScore(analysis.completenessScore)}%` }}
                          transition={{ duration: 1 }}
                          className={cn('h-full rounded-full', getScoreBg(normalizeScore(analysis.completenessScore)))}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* ATS Compatibility */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">{t('resumeAnalyzer.atsScore')}</span>
                        <span className={cn('text-2xl font-bold', getScoreColor(normalizeScore(analysis.atsCompatibility)))}>
                          {normalizeScore(analysis.atsCompatibility)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${normalizeScore(analysis.atsCompatibility)}%` }}
                          transition={{ duration: 1 }}
                          className={cn('h-full rounded-full', getScoreBg(normalizeScore(analysis.atsCompatibility)))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Section Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t('resumeAnalyzer.sections')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {Object.entries(analysis.sections).map(([key, section]) => {
                        const Icon = sectionIcons[key as keyof typeof sectionIcons];
                        const sectionName = t(`resumeAnalyzer.sectionNames.${key}`);
                        const displayScore = normalizeScore(section.score);
                        return (
                          <div
                            key={key}
                            className="p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{sectionName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn('text-lg font-bold', getScoreColor(displayScore))}>
                                {displayScore}
                              </span>
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={cn('h-full rounded-full', getScoreBg(displayScore))}
                                  style={{ width: `${displayScore}%` }}
                                />
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {section.feedback}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths & Gaps */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        {t('resumeAnalyzer.strengths')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.strengths.map((strength, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        {t('resumeAnalyzer.gaps')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.highlights && analysis.highlights.length > 0 ? (
                          analysis.highlights.map((highlight, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <span>{highlight}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            {t('resumeAnalyzer.noHighlights')}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Improvements */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t('resumeAnalyzer.improvements')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {analysis.improvements.map((improvement, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm"
                        >
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-medium mr-2">
                            {i + 1}
                          </span>
                          {improvement}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Overall Feedback */}
                <Card className="bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t('resumeAnalyzer.overall')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{analysis.overallFeedback}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {isLoading && !analysis && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">{t('resumeAnalyzer.loading')}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
