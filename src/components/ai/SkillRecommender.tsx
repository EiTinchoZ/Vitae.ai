'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Loader2,
  RefreshCw,
  TrendingUp,
  Clock,
  BookOpen,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { resolveAiError } from '@/lib/ai-errors';

interface RecommendedSkill {
  name: string;
  reason: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'facil' | 'medio' | 'dificil';
  timeToLearn: string;
  resources: string[];
}

interface Recommendations {
  recommendedSkills: RecommendedSkill[];
  marketTrends: string[];
  careerAdvice: string;
}

export function SkillRecommender() {
  const { t, language } = useTranslation();
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommend-skills', {
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
        setRecommendations(parsed);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('skillRecommender.error');
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeDifficulty = (difficulty: string) => {
    const normalized = difficulty.toLowerCase();
    if (['easy', 'facil', 'fácil'].includes(normalized)) return 'easy';
    if (['medium', 'medio'].includes(normalized)) return 'medium';
    if (['hard', 'dificil', 'difícil'].includes(normalized)) return 'hard';
    return normalized;
  };

  const getDifficultyColor = (difficulty: string) => {
    const normalized = normalizeDifficulty(difficulty);
    if (normalized === 'easy') return 'bg-green-500/10 text-green-500';
    if (normalized === 'medium') return 'bg-amber-500/10 text-amber-500';
    return 'bg-red-500/10 text-red-500';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const normalized = normalizeDifficulty(difficulty);
    if (normalized === 'easy') return t('skillRecommender.difficultyLabels.easy');
    if (normalized === 'medium') return t('skillRecommender.difficultyLabels.medium');
    if (normalized === 'hard') return t('skillRecommender.difficultyLabels.hard');
    return difficulty;
  };


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
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
              <Lightbulb className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t('skillRecommender.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('skillRecommender.subtitle')}</p>
            </div>
          </div>

          <Button
            onClick={() => {
              if (!isOpen) {
                setIsOpen(true);
                if (!recommendations) generateRecommendations();
              } else if (recommendations) {
                generateRecommendations();
              }
            }}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('skillRecommender.loading')}
              </>
            ) : recommendations ? (
              <>
                <RefreshCw className="h-4 w-4" />
                {t('skillRecommender.regenerate')}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {t('skillRecommender.generate')}
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

            {recommendations && (
              <div className="space-y-6">
                {/* Recommended Skills */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    {t('skillRecommender.recommended')}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendations.recommendedSkills.map((skill, i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center justify-between">
                            {skill.name}
                            <Badge className={cn('text-xs', getDifficultyColor(skill.difficulty))}>
                              {getDifficultyLabel(skill.difficulty)}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">{skill.reason}</p>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{t('skillRecommender.time')}: {skill.timeToLearn}</span>
                          </div>

                          {skill.resources && skill.resources.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">{t('skillRecommender.resources')}:</p>
                              <div className="flex flex-wrap gap-1">
                                {skill.resources.slice(0, 2).map((resource, j) => (
                                  <Badge key={j} variant="outline" className="text-xs gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    {resource}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Market Trends */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      {t('skillRecommender.trends')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {recommendations.marketTrends.map((trend, i) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          <ChevronRight className="h-3 w-3" />
                          {trend}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Career Advice */}
                <Card className="bg-gradient-to-br from-primary/5 to-background">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm mb-1">{t('skillRecommender.advice')}</p>
                        <p className="text-sm text-muted-foreground">
                          {recommendations.careerAdvice}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {isLoading && !recommendations && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">{t('skillRecommender.loading')}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
