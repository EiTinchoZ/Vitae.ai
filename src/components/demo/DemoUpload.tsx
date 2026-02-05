'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import type { CVData } from '@/types';

interface DemoUploadProps {
  onCvGenerated: (data: Partial<CVData>) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const MAX_FILE_SIZE_MB = 5;

export function DemoUpload({ onCvGenerated, isProcessing, setIsProcessing }: DemoUploadProps) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (f: File): string | null => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(f.type)) {
      return t('demo.upload.errorUnsupported');
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return t('demo.upload.errorTooLarge').replace('{max}', String(MAX_FILE_SIZE_MB));
    }
    return null;
  };

  const handleFile = (f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
    } else {
      setError(null);
      setFile(f);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError(t('demo.upload.errorNoFile'));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/demo/parse-cv', {
        method: 'POST',
        body: formData,
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
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
          ${file ? 'bg-primary/5 border-primary' : ''}
        `}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        {file ? (
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-12 w-12 text-primary" />
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <p className="font-medium">{t('demo.upload.dragTitle')}</p>
            <p className="text-sm text-muted-foreground">{t('demo.upload.dragSubtitle')}</p>
            <Button variant="outline" size="sm" className="mt-2" disabled={isProcessing}>
              {t('demo.upload.selectButton')}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {t('demo.upload.fileHint').replace('{max}', String(MAX_FILE_SIZE_MB))}
            </p>
          </div>
        )}
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
        disabled={!file || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('demo.upload.processing')}
          </>
        ) : (
          t('demo.upload.cta')
        )}
      </Button>
    </div>
  );
}
