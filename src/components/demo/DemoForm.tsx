'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import type { CVData, Skill } from '@/types';

interface DemoFormProps {
  onCvGenerated: (data: Partial<CVData>) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const inputClass =
  'mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

export function DemoForm({ onCvGenerated, isProcessing }: DemoFormProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    location: '',
    email: '',
    linkedin: '',
    github: '',
    profile: '',
    skills: '',
    experienceRole: '',
    experienceCompany: '',
    experiencePeriod: '',
    experienceHighlights: '',
    educationTitle: '',
    educationInstitution: '',
    educationPeriod: '',
  });

  const steps = [
    {
      title: t('demo.form.steps.personalTitle'),
      description: t('demo.form.steps.personalDescription'),
    },
    {
      title: t('demo.form.steps.profileTitle'),
      description: t('demo.form.steps.profileDescription'),
    },
    {
      title: t('demo.form.steps.experienceTitle'),
      description: t('demo.form.steps.experienceDescription'),
    },
  ];

  const canContinue = useMemo(() => {
    if (step === 0) {
      return formData.fullName.trim() && formData.email.trim();
    }
    if (step === 1) {
      return formData.profile.trim() && formData.skills.trim();
    }
    return true;
  }, [formData, step]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    const defaultCity = t('demo.form.defaults.city');
    const defaultLinkedin = t('demo.form.defaults.linkedin');
    const defaultGithub = t('demo.form.defaults.github');
    const defaultLanguages = t('demo.form.defaults.languages');
    const defaultCompany = t('demo.form.defaults.company');
    const defaultRemote = t('demo.form.defaults.remote');
    const defaultCurrent = t('demo.form.defaults.current');
    const defaultEducation = t('demo.form.defaults.educationTitle');
    const defaultSpecialization = t('demo.form.defaults.specialization');
    const defaultInstitution = t('demo.form.defaults.institution');
    const defaultTrainingDescription = t('demo.form.defaults.trainingDescription');

    const skills: Skill[] = formData.skills
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8)
      .map((name) => ({ name, category: 'programming' }));

    const data: Partial<CVData> = {
      personal: {
        name: formData.fullName.split(' ')[0] || formData.fullName,
        fullName: formData.fullName,
        location: formData.location || defaultCity,
        phone: '',
        email: formData.email,
        linkedin: formData.linkedin || defaultLinkedin,
        github: formData.github || defaultGithub,
      },
      profile: formData.profile,
      skills,
      about: {
        quote: formData.profile,
        specialties: skills.map((skill) => skill.name),
        highlights: {
          educationValue: formData.educationTitle || defaultEducation,
          specializationValue: formData.title || defaultSpecialization,
          locationValue: formData.location || defaultCity,
          languagesValue: defaultLanguages,
        },
      },
      experience: formData.experienceRole
        ? [
            {
              id: 'demo-exp-1',
              company: formData.experienceCompany || defaultCompany,
              position: formData.experienceRole,
              location: formData.location || defaultRemote,
              startPeriod: formData.experiencePeriod || '2023',
              endPeriod: defaultCurrent,
              responsibilities: formData.experienceHighlights
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 3),
              skills: skills.map((skill) => skill.name).slice(0, 4),
            },
          ]
        : [],
      education: formData.educationTitle
        ? [
            {
              id: 'demo-edu-1',
              title: formData.educationTitle,
              institution: formData.educationInstitution || defaultInstitution,
              startYear: null,
              endYear: formData.educationPeriod || '2026',
              status: 'in_progress',
              description: defaultTrainingDescription,
            },
          ]
        : [],
      projects: [],
      certificates: [],
      languages: [],
    };

    onCvGenerated(data);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">
              {t('demo.form.stepLabel')
                .replace('{current}', String(step + 1))
                .replace('{total}', String(steps.length))}
            </p>
            <p className="text-xs text-muted-foreground">{steps[step].description}</p>
          </div>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-muted">
          <div
            className="h-1.5 rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="demo-fullName" className="text-sm font-medium">
              {t('demo.form.fields.fullName')}
            </label>
            <input
              id="demo-fullName"
              className={inputClass}
              value={formData.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              placeholder={t('demo.form.placeholders.fullName')}
            />
          </div>
          <div>
            <label htmlFor="demo-title" className="text-sm font-medium">
              {t('demo.form.fields.title')}
            </label>
            <input
              id="demo-title"
              className={inputClass}
              value={formData.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder={t('demo.form.placeholders.title')}
            />
          </div>
          <div>
            <label htmlFor="demo-location" className="text-sm font-medium">
              {t('demo.form.fields.location')}
            </label>
            <input
              id="demo-location"
              className={inputClass}
              value={formData.location}
              onChange={(event) => updateField('location', event.target.value)}
              placeholder={t('demo.form.placeholders.location')}
            />
          </div>
          <div>
            <label htmlFor="demo-email" className="text-sm font-medium">
              {t('demo.form.fields.email')}
            </label>
            <input
              id="demo-email"
              className={inputClass}
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder={t('demo.form.placeholders.email')}
            />
          </div>
          <div>
            <label htmlFor="demo-linkedin" className="text-sm font-medium">
              {t('demo.form.fields.linkedin')}
            </label>
            <input
              id="demo-linkedin"
              className={inputClass}
              value={formData.linkedin}
              onChange={(event) => updateField('linkedin', event.target.value)}
              placeholder={t('demo.form.placeholders.linkedin')}
            />
          </div>
          <div>
            <label htmlFor="demo-github" className="text-sm font-medium">
              {t('demo.form.fields.github')}
            </label>
            <input
              id="demo-github"
              className={inputClass}
              value={formData.github}
              onChange={(event) => updateField('github', event.target.value)}
              placeholder={t('demo.form.placeholders.github')}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="demo-profile" className="text-sm font-medium">
              {t('demo.form.fields.profile')}
            </label>
            <textarea
              id="demo-profile"
              rows={4}
              className={inputClass}
              value={formData.profile}
              onChange={(event) => updateField('profile', event.target.value)}
              placeholder={t('demo.form.placeholders.profile')}
            />
          </div>
          <div>
            <label htmlFor="demo-skills" className="text-sm font-medium">
              {t('demo.form.fields.skills')}
            </label>
            <input
              id="demo-skills"
              className={inputClass}
              value={formData.skills}
              onChange={(event) => updateField('skills', event.target.value)}
              placeholder={t('demo.form.placeholders.skills')}
            />
            <p className="text-xs text-muted-foreground mt-1">{t('demo.form.helperSkills')}</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="demo-experienceRole" className="text-sm font-medium">
              {t('demo.form.fields.experienceRole')}
            </label>
            <input
              id="demo-experienceRole"
              className={inputClass}
              value={formData.experienceRole}
              onChange={(event) => updateField('experienceRole', event.target.value)}
              placeholder={t('demo.form.placeholders.experienceRole')}
            />
          </div>
          <div>
            <label htmlFor="demo-experienceCompany" className="text-sm font-medium">
              {t('demo.form.fields.experienceCompany')}
            </label>
            <input
              id="demo-experienceCompany"
              className={inputClass}
              value={formData.experienceCompany}
              onChange={(event) => updateField('experienceCompany', event.target.value)}
              placeholder={t('demo.form.placeholders.experienceCompany')}
            />
          </div>
          <div>
            <label htmlFor="demo-experiencePeriod" className="text-sm font-medium">
              {t('demo.form.fields.experiencePeriod')}
            </label>
            <input
              id="demo-experiencePeriod"
              className={inputClass}
              value={formData.experiencePeriod}
              onChange={(event) => updateField('experiencePeriod', event.target.value)}
              placeholder={t('demo.form.placeholders.experiencePeriod')}
            />
          </div>
          <div>
            <label htmlFor="demo-educationTitle" className="text-sm font-medium">
              {t('demo.form.fields.educationTitle')}
            </label>
            <input
              id="demo-educationTitle"
              className={inputClass}
              value={formData.educationTitle}
              onChange={(event) => updateField('educationTitle', event.target.value)}
              placeholder={t('demo.form.placeholders.educationTitle')}
            />
          </div>
          <div>
            <label htmlFor="demo-educationInstitution" className="text-sm font-medium">
              {t('demo.form.fields.educationInstitution')}
            </label>
            <input
              id="demo-educationInstitution"
              className={inputClass}
              value={formData.educationInstitution}
              onChange={(event) => updateField('educationInstitution', event.target.value)}
              placeholder={t('demo.form.placeholders.educationInstitution')}
            />
          </div>
          <div>
            <label htmlFor="demo-educationPeriod" className="text-sm font-medium">
              {t('demo.form.fields.educationPeriod')}
            </label>
            <input
              id="demo-educationPeriod"
              className={inputClass}
              value={formData.educationPeriod}
              onChange={(event) => updateField('educationPeriod', event.target.value)}
              placeholder={t('demo.form.placeholders.educationPeriod')}
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="demo-experienceHighlights" className="text-sm font-medium">
              {t('demo.form.fields.experienceHighlights')}
            </label>
            <textarea
              id="demo-experienceHighlights"
              rows={3}
              className={inputClass}
              value={formData.experienceHighlights}
              onChange={(event) => updateField('experienceHighlights', event.target.value)}
              placeholder={t('demo.form.placeholders.experienceHighlights')}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          disabled={step === 0 || isProcessing}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('demo.form.buttons.prev')}
        </Button>
        {step < steps.length - 1 ? (
          <Button
            type="button"
            onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}
            disabled={!canContinue || isProcessing}
            className="gap-2"
          >
            {t('demo.form.buttons.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={handleGenerate} disabled={isProcessing}>
            {t('demo.form.buttons.generate')}
          </Button>
        )}
      </div>
    </div>
  );
}
