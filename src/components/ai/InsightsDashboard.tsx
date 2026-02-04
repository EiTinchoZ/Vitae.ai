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
  DollarSign,
  Compass,
  RefreshCw,
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

interface Insights {
  careerScore: number;
  strengths: string[];
  uniqueValue: string;
  marketFit: string;
  recommendations: string[];
  skillsRadar: {
    ai: number;
    programming: number;
    industrial: number;
    softSkills: number;
    languages: number;
  };
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  careerPaths: string[];
}

export function InsightsDashboard() {
  const { t, language } = useTranslation();
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const numberFormat = new Intl.NumberFormat(language);

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      });

      if (!response.ok) throw new Error('Failed to fetch insights');

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
      setError(t('insights.error'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const radarData = insights
    ? [
        { skill: t('insights.radar.ai'), value: insights.skillsRadar.ai, fullMark: 100 },
        { skill: t('insights.radar.programming'), value: insights.skillsRadar.programming, fullMark: 100 },
        { skill: t('insights.radar.industrial'), value: insights.skillsRadar.industrial, fullMark: 100 },
        { skill: t('insights.radar.softSkills'), value: insights.skillsRadar.softSkills, fullMark: 100 },
        { skill: t('insights.radar.languages'), value: insights.skillsRadar.languages, fullMark: 100 },
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
                {/* Career Score */}
                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      {t('insights.careerScore')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
                            strokeDasharray={`${(insights.careerScore / 100) * 220} 220`}
                            className="text-primary"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                          {insights.careerScore}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          {insights.careerScore >= 80
                            ? t('insights.scoreNote.excellent')
                            : insights.careerScore >= 60
                            ? t('insights.scoreNote.good')
                            : t('insights.scoreNote.improve')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Salary Range */}
                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      {t('insights.salaryRange')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">
                        ${numberFormat.format(insights.salaryRange.min)} - ${numberFormat.format(insights.salaryRange.max)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {insights.salaryRange.currency} / {t('insights.salaryPeriod')}
                      </p>
                    </div>
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

                {/* Strengths */}
                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      {t('insights.strengths')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {insights.strengths.map((strength, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-primary" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Career Paths */}
                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Compass className="h-4 w-4 text-indigo-500" />
                      {t('insights.careerPaths')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {insights.careerPaths.map((path, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {path}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="col-span-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-500" />
                      {t('insights.recommendations')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {insights.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-muted/30 text-sm flex items-start gap-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs flex-shrink-0">
                            {i + 1}
                          </span>
                          {rec}
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
