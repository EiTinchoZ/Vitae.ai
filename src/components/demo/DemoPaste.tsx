'use client';

import { useState } from 'react';
import { Clipboard, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import type { CVData } from '@/types';

interface DemoPasteProps {
  onCvGenerated: (data: Partial<CVData>) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export function DemoPaste({ onCvGenerated, isProcessing, setIsProcessing }: DemoPasteProps) {
  const { t, language } = useTranslation();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resolveServerError = (code?: string, fallback?: string) => {
    const errorMap: Record<string, string> = {
      api_key_missing: t('demo.errors.apiKeyMissing'),
      invalid_file: t('demo.errors.invalidFile'),
      unsupported_format: t('demo.errors.unsupportedFormat'),
      empty_text: t('demo.errors.emptyText'),
      invalid_model_response: t('demo.errors.invalidResponse'),
      processing_failed: t('demo.errors.processingFailed'),
    };

    if (code && errorMap[code]) {
      return errorMap[code];
    }

    if (language === 'es' && fallback) {
      return fallback;
    }

    return t('demo.errors.processingFailed');
  };

  const handleProcess = async () => {
    if (!text.trim()) {
      setError(t('demo.paste.errorEmpty'));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/demo/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        errorCode?: string;
      } & Partial<CVData>;

      if (!response.ok) {
        throw new Error(resolveServerError(data.errorCode, data.error));
      }

      onCvGenerated(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('demo.errors.unknown');
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">{t('demo.paste.label')}</label>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={10}
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder={t('demo.paste.placeholder')}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="button"
        className="w-full gap-2"
        onClick={handleProcess}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('demo.paste.processing')}
          </>
        ) : (
          <>
            <Clipboard className="h-4 w-4" />
            {t('demo.paste.cta')}
          </>
        )}
      </Button>
    </div>
  );
}
