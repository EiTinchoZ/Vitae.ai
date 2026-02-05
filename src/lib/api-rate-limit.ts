import { createErrorResponse } from '@/lib/api-validation';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export function enforceRateLimit(
  request: Request,
  options: { windowMs: number; max: number; keyPrefix?: string }
) {
  const ip = getClientIp(request);
  const key = `${options.keyPrefix ?? 'global'}:${ip}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  if (entry.count >= options.max) {
    return createErrorResponse(
      'Too many requests',
      429,
      'rate_limited'
    );
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);
  return null;
}
