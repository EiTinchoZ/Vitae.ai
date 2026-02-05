'use client';

import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/i18n';
import type { CVData } from '@/types';

interface DemoPasteProps {
  onCvGenerated: (data: Partial<CVData>) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export function DemoPaste({ onCvGenerated, isProcessing, setIsProcessing }: DemoPasteProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError(t('demo.paste.errorEmpty'));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await fetch('/api/demo/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('demo.errors.processingFailed'));
      }

      const data = await res.json();
      onCvGenerated(data.cvData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('demo.errors.unknown'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cv-text">{t('demo.paste.label')}</Label>
        <Textarea
          id="cv-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('demo.paste.placeholder')}
          rows={12}
          className="resize-none font-mono text-sm"
          disabled={isProcessing}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!text.trim() || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('demo.paste.processing')}
          </>
        ) : (
          t('demo.paste.cta')
        )}
      </Button>
    </div>
  );
}
