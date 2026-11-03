import { guardedStream } from '@/lib/ai-guard';
import { getCvData } from '@/data/cv-data';
import { getLanguageInstruction } from '@/lib/ai-language';
import { readJsonObject, validateCvDataSize, validateLanguage, createErrorResponse } from '@/lib/api-validation';
import { enforceRateLimit } from '@/lib/api-rate-limit';
import { IS_DEMO } from '@/lib/app-config';
import { EMPTY_CV_DATA, mergeCvData } from '@/lib/cv-data-utils';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const rateLimitResponse = enforceRateLimit(request, {
      windowMs: 60_000,
      max: 12,
      keyPrefix: 'recommend',
    });
    if (rateLimitResponse) return rateLimitResponse;

    const body = await readJsonObject(request);
    if (!body || !validateCvDataSize(body.cvData)) {
      return createErrorResponse('Invalid request', 400, 'invalid_request');
    }
    const language = validateLanguage(body.language);
    const override = IS_DEMO && body?.cvData && typeof body.cvData === 'object' ? body.cvData : null;
    const cvData = override ? mergeCvData(EMPTY_CV_DATA, override as Partial<import('@/types').CVData>) : getCvData(language);
    const candidateName = cvData.personal.fullName || cvData.personal.name || 'the candidate';

    const currentSkills = cvData.skills.map((s) => s.name).join(', ');

    const prompt = `You are a career coach highlighting personal values and soft skills that make ${candidateName} stand out.

${getLanguageInstruction(language)}
Use only the CV data provided to find evidence of these values.
Use positive language only. Focus on character strengths and professional values.
Analyze the CV to identify evidence of these personal values:
- Responsable (Responsible)
- Proactivo (Proactive)
- Autodidacta (Self-taught/Self-learner)
- Trabajo en equipo (Teamwork)
- Resolución de problemas (Problem-solving)
- Adaptabilidad (Adaptability)
- Comunicación efectiva (Effective communication)
- Pensamiento crítico (Critical thinking)

CURRENT SKILLS AND EXPERIENCE:
${currentSkills}

PROFILE SUMMARY:
${cvData.profile}

INSTRUCTIONS:
Respond ONLY with valid JSON (no markdown, no backticks) using this structure.
Select 4 personal values/strengths from the list above that are most evident in the CV.
Use "easy|medium|hard" to represent how strongly this value is demonstrated (easy=evident, medium=strong, hard=exceptional).
Use "timeToLearn" to show concrete evidence from the CV (projects, experiences, achievements).
{
  "recommendedSkills": [
    {
      "name": "personal value name",
      "reason": "how this value is demonstrated in the CV",
      "difficulty": "easy|medium|hard",
      "timeToLearn": "concrete evidence from CV",
      "resources": ["specific example 1", "specific example 2"]
    }
  ],
  "marketTrends": ["why value 1 matters", "why value 2 matters", "why value 3 matters"],
  "careerAdvice": "summary of how these values make the candidate unique"
}`;

    return await guardedStream({
      prompt,
    });

  } catch (error) {
    console.error('Recommend skills API error:', error);
    return createErrorResponse('Failed to generate recommendations', 500, 'processing_failed');
  }
}
