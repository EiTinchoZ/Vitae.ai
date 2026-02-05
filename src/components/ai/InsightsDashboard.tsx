'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  Target,
  Sparkles,
  ChevronRight,
  Loader2,
  BarChart3,
  Briefcase,
  Code,
  Star,
  RefreshCw,
  FileText,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n';
import { resolveAiError } from '@/lib/ai-errors';

interface Insights {
  profileScore: number;
  keyStrengths: string[];
  uniqueValue: string;
  idealRoles: string[];
  standoutFactors: string[];
  skillsRadar: {
    ai: number;
    programming: number;
    industrial: number;
    softSkills: number;
    languages: number;
  };
  experienceTimeline: Array<{
    period: string;
    highlight: string;
  }>;
  techStack: string[];
  executiveSummary: string;
}

export function InsightsDashboard() {
  const { t, language } = useTranslation();
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeScore = (score: number, min = 80) =>
    Math.max(min, Math.min(100, Math.round(score)));

  const displayProfileScore = insights ? normalizeScore(insights.profileScore) : 0;

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/insights', {
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
        setInsights(parsed);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('insights.error');
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const radarData = insights
    ? [
        { skill: t('insights.radar.ai'), value: normalizeScore(insights.skillsRadar.ai, 70), fullMark: 100 },
        { skill: t('insights.radar.programming'), value: normalizeScore(insights.skillsRadar.programming, 70), fullMark: 100 },
        { skill: t('insights.radar.industrial'), value: normalizeScore(insights.skillsRadar.industrial, 70), fullMark: 100 },
        { skill: t('insights.radar.softSkills'), value: normalizeScore(insights.skillsRadar.softSkills, 70), fullMark: 100 },
        { skill: t('insights.radar.languages'), value: normalizeScore(insights.skillsRadar.languages, 70), fullMark: 100 },
      ]
    : [];

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
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <Brain className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t('insights.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('insights.subtitle')}</p>
            </div>
          </div>

          <Button
            onClick={() => {
              if (!isOpen) {
                setIsOpen(true);
                if (!insights) generateInsights();
              } else if (insights) {
                generateInsights();
              }
            }}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('insights.loading')}
              </>
            ) : insights ? (
              <>
                <RefreshCw className="h-4 w-4" />
                {t('insights.regenerate')}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {t('insights.generate')}
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

            {insights && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Recruiter Summary - Full Width */}
                <Card className="col-span-full bg-gradient-to-br from-primary/5 to-secondary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {t('insights.executiveSummary')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed">
                      {insights.executiveSummary}
                    </p>
                  </CardContent>
                </Card>

                {/* Profile Score */}
                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      {t('insights.profileScore')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {insights && (
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20">
                          <svg className="w-20 h-20 -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="none"
                              className="text-muted/20"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${(displayProfileScore / 100) * 220} 220`}
                              className="text-primary"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                            {displayProfileScore}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {displayProfileScore >= 90
                              ? t('insights.scoreNote.excellent')
                              : t('insights.scoreNote.good')}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Unique Value */}
                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      {t('insights.uniqueValue')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {insights.uniqueValue}
                    </p>
                  </CardContent>
                </Card>

                {/* Ideal Roles */}
                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-indigo-500" />
                      {t('insights.idealRoles')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {insights.idealRoles.map((role, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Radar */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                      {t('insights.skillsRadar')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
                          <PolarAngleAxis
                            dataKey="skill"
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                          />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                          <Radar
                            name="Skills"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Strengths */}
                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      {t('insights.keyStrengths')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {insights.keyStrengths.map((strength, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-primary" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tech Stack */}
                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Code className="h-4 w-4 text-cyan-500" />
                      {t('insights.techStack')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {insights.techStack.map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Standout Factors */}
                <Card className="col-span-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {t('insights.standoutFactors')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {insights.standoutFactors.map((factor, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-muted/30 text-sm flex items-start gap-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs flex-shrink-0">
                            {i + 1}
                          </span>
                          {factor}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {isLoading && !insights && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">{t('insights.loading')}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
