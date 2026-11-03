import { createErrorResponse } from '@/lib/api-validation';

type RateLimitEntry = { count: number; resetAt: number };
const rateLimitStore = new Map<string, RateLimitEntry>();
const DAY_MS = 86_400_000;

function consume(key: string, max: number, resetAt: number, now: number) {
  if (rateLimitStore.size > 5_000) {
    for (const [storedKey, entry] of rateLimitStore) {
      if (entry.resetAt <= now) rateLimitStore.delete(storedKey);
    }
  }
  const entry = rateLimitStore.get(key);
  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

export function enforceRateLimit(
  request: Request,
  options: { windowMs: number; max: number; dailyMax?: number; keyPrefix?: string }
) {
  const ip = request.headers.get('x-real-ip')?.trim()
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const prefix = options.keyPrefix ?? 'global';
  const now = Date.now();
  const dayEnd = (Math.floor(now / DAY_MS) + 1) * DAY_MS;
  const dailyMax = options.dailyMax ?? (prefix === 'chat' ? 100 : prefix === 'contact' ? 5 : 30);
  if (!consume(`${prefix}:minute:${ip}`, options.max, now + options.windowMs, now)
    || !consume(`${prefix}:day:${ip}`, dailyMax, dayEnd, now)) {
    return createErrorResponse('Too many requests', 429, 'rate_limited');
  }
  return null;
}

// Instance-local, UTC calendar day; reserve before awaiting the mail provider.
export function enforceGlobalDailyLimit(key: string, max: number, errorCode: string) {
  const now = Date.now();
  return consume(`global:day:${key}`, max, (Math.floor(now / DAY_MS) + 1) * DAY_MS, now)
    ? null : createErrorResponse('Daily limit reached', 429, errorCode);
}
