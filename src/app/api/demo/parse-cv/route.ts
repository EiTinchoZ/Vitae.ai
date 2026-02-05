import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { getLanguageInstruction } from '@/lib/ai-language';
import { validateLanguage } from '@/lib/api-validation';
import { enforceRateLimit } from '@/lib/api-rate-limit';
import type { LanguageCode } from '@/i18n';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_TEXT_LENGTH = 12000;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const DEMO_ERROR_MESSAGES: Record<string, string> = {
  api_key_missing: 'API key not configured',
  invalid_file: 'Invalid file upload',
  file_too_large: 'File too large',
  unsupported_format: 'Unsupported file format',
  empty_text: 'No text found in CV',
  invalid_model_response: 'Invalid model response',
  rate_limited: 'Too many requests',
  processing_failed: 'Failed to process CV',
};

function createDemoError(code: keyof typeof DEMO_ERROR_MESSAGES, status = 400) {
  return new Response(
    JSON.stringify({ errorCode: code, error: DEMO_ERROR_MESSAGES[code] }),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
}

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === 'application/pdf') {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    await parser.destroy();
    return parsed.text ?? '';
  }

  const mammothModule = await import('mammoth');
  const mammoth = mammothModule.default ?? mammothModule;
  const result = await mammoth.extractRawText({ buffer });
  return result.value ?? '';
}

function buildPrompt(language: LanguageCode, text: string) {
  return `You are an expert CV parser. Extract information from the CV text below and return valid JSON only.

${getLanguageInstruction(language)}
Use ONLY the information explicitly present. Do not invent or assume.
If a field is missing, return an empty string or empty array.
Limit each array to a maximum of 2 items.

Return JSON using this exact structure:
{
  "personal": {
    "name": "",
    "fullName": "",
    "location": "",
    "phone": "",
    "email": "",
    "linkedin": "",
    "github": ""
  },
  "profile": "",
  "about": {
    "quote": "",
    "specialties": [""],
    "highlights": {
      "educationValue": "",
      "specializationValue": "",
      "locationValue": "",
      "languagesValue": ""
    }
  },
  "skills": [{"name": "", "category": "programming"}],
  "education": [{"id": "demo-edu-1", "title": "", "institution": "", "startYear": null, "endYear": "", "status": "in_progress", "description": ""}],
  "certificates": [{"id": "demo-cert-1", "name": "", "institution": "", "period": "", "status": "completed", "description": "", "category": "technical"}],
  "experience": [{"id": "demo-exp-1", "company": "", "position": "", "location": "", "startPeriod": "", "endPeriod": "", "responsibilities": [""], "skills": [""]}],
  "projects": [{"id": "demo-project-1", "name": "", "type": "", "year": 2024, "shortDescription": "", "longDescription": "", "features": [""], "technologies": [""]}],
  "languages": [{"id": "demo-lang-1", "name": "", "level": "", "description": ""}]
}

CV TEXT:
${text}
`;
}

export async function POST(request: Request) {
  try {
    const rateLimitResponse = enforceRateLimit(request, {
      windowMs: 60_000,
      max: 8,
      keyPrefix: 'demo-parse',
    });
    if (rateLimitResponse) {
      return createDemoError('rate_limited', 429);
    }

    if (!process.env.GROQ_API_KEY) {
      return createDemoError('api_key_missing', 500);
    }

    const contentType = request.headers.get('content-type') ?? '';
    let language: LanguageCode = 'es';
    let cvText = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      language = validateLanguage(formData.get('language'));

      if (!(file instanceof File)) {
        return createDemoError('invalid_file');
      }

      if (file.size > MAX_FILE_SIZE) {
        return createDemoError('file_too_large', 413);
      }

      if (!ALLOWED_TYPES.has(file.type)) {
        return createDemoError('unsupported_format');
      }

      cvText = await extractTextFromFile(file);
    } else {
      const body = await request.json();
      language = validateLanguage(body.language);
      cvText = typeof body.text === 'string' ? body.text : '';
    }

    if (!cvText.trim()) {
      return createDemoError('empty_text');
    }

    if (cvText.length > MAX_TEXT_LENGTH) {
      cvText = cvText.slice(0, MAX_TEXT_LENGTH);
    }

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = buildPrompt(language, cvText);

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
      temperature: 0.2,
    });

    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return createDemoError('invalid_model_response', 500);
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return createDemoError('invalid_model_response', 500);
    }
    return new Response(JSON.stringify({ cvData: parsed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Demo parse CV error:', error);
    return createDemoError('processing_failed', 500);
  }
}
