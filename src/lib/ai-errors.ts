type TranslateFn = (key: string) => string;

export function resolveAiError(
  t: TranslateFn,
  errorCode?: string,
  fallback?: string
) {
  const map: Record<string, string> = {
    ai_busy: t('aiErrors.aiBusy'),
    mail_limit: t('aiErrors.mailLimit'),
    api_key_missing: t('aiErrors.apiKeyMissing'),
    rate_limited: t('aiErrors.rateLimited'),
    invalid_request: t('aiErrors.invalidRequest'),
    invalid_messages: t('aiErrors.invalidRequest'),
    invalid_question: t('aiErrors.invalidRequest'),
    invalid_section: t('aiErrors.invalidRequest'),
    processing_failed: t('aiErrors.processingFailed'),
  };

  if (errorCode && map[errorCode]) {
    return map[errorCode];
  }

  if (fallback) {
    return fallback;
  }

  return t('aiErrors.unknown');
}
