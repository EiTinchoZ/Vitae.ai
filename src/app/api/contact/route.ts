import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { enforceGlobalDailyLimit, enforceRateLimit } from '@/lib/api-rate-limit';

export const runtime = 'nodejs';

const recentMessages = new Map<string, { expiresAt: number; result: Promise<Response> }>();

function validatePayload(
  body: unknown,
): { name: string; email: string; message: string } | null {
  if (!body || typeof body !== 'object') return null;
  const { name, email, message } = body as Record<string, unknown>;
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100) return null;
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (
    typeof message !== 'string' ||
    message.trim().length < 5 ||
    message.length > 2000
  )
    return null;
  return { name: name.trim(), email: email.trim(), message: message.trim() };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

export async function POST(request: Request) {

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const payload = validatePayload(body);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { name, email, message } = payload;

  const now = Date.now();
  for (const [key, entry] of recentMessages) {
    if (entry.expiresAt <= now) recentMessages.delete(key);
  }
  const hash = createHash('sha256').update(JSON.stringify([email.toLowerCase(), message])).digest('hex');
  const duplicate = recentMessages.get(hash);
  if (duplicate) {
    console.log('[contact] Duplicate suppressed');
    return (await duplicate.result).clone();
  }
  const rateLimitResponse = enforceRateLimit(request, {
    windowMs: 60_000,
    max: 3,
    keyPrefix: 'contact',
  });
  if (rateLimitResponse) return rateLimitResponse;

  const globalLimit = enforceGlobalDailyLimit('contact', 50, 'mail_limit');
  if (globalLimit) return globalLimit;

  // Install the reservation synchronously; concurrent requests await the same result.
  const result = sendContact(name, email, message);
  recentMessages.set(hash, { expiresAt: now + 600_000, result });
  const response = await result;
  if (!response.ok) recentMessages.delete(hash);
  return response.clone();
}

async function sendContact(name: string, email: string, message: string): Promise<Response> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const from =
        process.env.RESEND_FROM ?? 'Vitae.ai <onboarding@resend.dev>';
      const to = process.env.CONTACT_EMAIL ?? 'mbundy15@gmail.com';

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `Nuevo mensaje de ${name} - Vitae.ai`,
          html: `
            <p><strong>De:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">
            <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
          `,
          reply_to: email,
        }),
      });

      if (!res.ok) {
        console.error('[contact] Resend error:', res.status);
        return NextResponse.json({ error: 'Mail unavailable', errorCode: res.status === 429 ? 'mail_limit' : 'processing_failed' }, { status: 503 });
      }
    } catch (err) {
      console.error('[contact] Resend fetch error:', err);
      return NextResponse.json({ error: 'Mail unavailable', errorCode: 'processing_failed' }, { status: 503 });
    }
  } else {
    // No Resend key - log submission for development
    console.log('[contact] New message (RESEND_API_KEY not set):', {
      name,
      email,
      preview: message.slice(0, 80),
    });
  }

  return NextResponse.json({ ok: true });
}

