'use client';

import { useState } from 'react';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/i18n';
import type { CVData } from '@/types';

interface DemoFormProps {
  onCvGenerated: (data: Partial<CVData>) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

interface FormData {
  fullName: string;
  title: string;
  email: string;
  location: string;
  linkedin: string;
  github: string;
  profile: string;
  skills: string;
  experience: string;
  education: string;
}

const initialFormData: FormData = {
  fullName: '',
  title: '',
  email: '',
  location: '',
  linkedin: '',
  github: '',
  profile: '',
  skills: '',
  experience: '',
  education: '',
};

const TOTAL_STEPS = 3;

export function DemoForm({ onCvGenerated, isProcessing, setIsProcessing }: DemoFormProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = (): boolean => {
    if (step === 1) return !!formData.fullName.trim();
    if (step === 2) return !!formData.profile.trim();
    return true;
  };

  const handleSubmit = async () => {
    if (!formData.fullName.trim()) {
      setError(t('demo.form.fields.fullName') + ' is required');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cvData: Partial<CVData> = {
        personal: {
          name: formData.fullName.split(' ')[0] || formData.fullName,
          fullName: formData.fullName,
          email: formData.email,
          location: formData.location,
          linkedin: formData.linkedin,
          github: formData.github,
          phone: '',
        },
        profile: formData.profile,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((name) => ({ name, category: 'programming' as const })),
        experience: formData.experience
          ? [
              {
                id: 'exp-1',
                company: 'Company',
                position: formData.title || 'Professional',
                location: formData.location,
                startPeriod: '',
                endPeriod: 'Present',
                responsibilities: formData.experience.split('\n').filter(Boolean),
                skills: [],
              },
            ]
          : [],
        education: formData.education
          ? [
              {
                id: 'edu-1',
                title: formData.education,
                institution: '',
                startYear: null,
                endYear: '',
                status: 'completed' as const,
              },
            ]
          : [],
      };

      onCvGenerated(cvData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('demo.errors.unknown'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>
          {t('demo.form.stepLabel')
            .replace('{current}', String(step))
            .replace('{total}', String(TOTAL_STEPS))}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-colors ${
                i + 1 <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">{t('demo.form.steps.personalTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('demo.form.steps.personalDescription')}</p>
          </div>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="fullName">{t('demo.form.fields.fullName')}</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="title">{t('demo.form.fields.title')}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Software Developer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">{t('demo.form.fields.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="location">{t('demo.form.fields.location')}</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="New York, USA"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">{t('demo.form.fields.linkedin')}</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <Label htmlFor="github">{t('demo.form.fields.github')}</Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => updateField('github', e.target.value)}
                  placeholder="github.com/johndoe"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Profile & Skills */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">{t('demo.form.steps.profileTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('demo.form.steps.profileDescription')}</p>
          </div>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="profile">{t('demo.form.fields.profile')}</Label>
              <Textarea
                id="profile"
                value={formData.profile}
                onChange={(e) => updateField('profile', e.target.value)}
                placeholder={t('demo.form.placeholders.profile')}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="skills">{t('demo.form.fields.skills')}</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => updateField('skills', e.target.value)}
                placeholder={t('demo.form.placeholders.skills')}
              />
              <p className="text-xs text-muted-foreground mt-1">{t('demo.form.helperSkills')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Experience & Education */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">{t('demo.form.steps.experienceTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('demo.form.steps.experienceDescription')}</p>
          </div>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="experience">{t('demo.form.fields.experienceHighlights')}</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => updateField('experience', e.target.value)}
                placeholder={t('demo.form.placeholders.experienceHighlights')}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="education">{t('demo.form.fields.educationTitle')}</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => updateField('education', e.target.value)}
                placeholder={t('demo.form.placeholders.educationTitle')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={isProcessing}
            className="flex-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('demo.form.buttons.prev')}
          </Button>
        )}
        {step < TOTAL_STEPS ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed() || isProcessing}
            className="flex-1"
          >
            {t('demo.form.buttons.next')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.loading')}
              </>
            ) : (
              t('demo.form.buttons.generate')
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
