'use client';

import { useRef, useState, type DragEvent } from 'react';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import type { CVData } from '@/types';

interface DemoUploadProps {
  onCvGenerated: (data: Partial<CVData>) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const MAX_FILE_MB = 5;
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function DemoUpload({ onCvGenerated, isProcessing, setIsProcessing }: DemoUploadProps) {
  const { t, language } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fileHint = t('demo.upload.fileHint').replace('{max}', String(MAX_FILE_MB));

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

  const validateFile = (selected: File) => {
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError(t('demo.upload.errorUnsupported'));
      return false;
    }
    if (selected.size > MAX_FILE_MB * 1024 * 1024) {
      setError(t('demo.upload.errorTooLarge').replace('{max}', String(MAX_FILE_MB)));
      return false;
    }
    return true;
  };

  const handleFile = (selected: File) => {
    setError(null);
    if (!validateFile(selected)) return;
    setFile(selected);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const handleProcess = async () => {
    if (!file) {
      setError(t('demo.upload.errorNoFile'));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', language);

      const response = await fetch('/api/demo/parse-cv', {
        method: 'POST',
        body: formData,
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
      <div
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) handleFile(selected);
          }}
        />

          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
            <p className="font-semibold">{t('demo.upload.dragTitle')}</p>
            <p className="text-sm text-muted-foreground">{t('demo.upload.dragSubtitle')}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={isProcessing}
            >
            {t('demo.upload.selectButton')}
            </Button>
          <p className="text-xs text-muted-foreground">{fileHint}</p>
          </div>
      </div>

      {file && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        </div>
      )}

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
        disabled={!file || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('demo.upload.processing')}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            {t('demo.upload.cta')}
          </>
        )}
      </Button>
    </div>
  );
}
