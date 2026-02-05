import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { getCvData } from '@/data/cv-data';
import { getLanguageInstruction } from '@/lib/ai-language';
import { validateLanguage, createErrorResponse } from '@/lib/api-validation';
import { enforceRateLimit } from '@/lib/api-rate-limit';

export async function POST(request: Request) {
  try {
    const rateLimitResponse = enforceRateLimit(request, {
      windowMs: 60_000,
      max: 12,
      keyPrefix: 'recommend',
    });
    if (rateLimitResponse) return rateLimitResponse;

    if (!process.env.GROQ_API_KEY) {
      return createErrorResponse('API key not configured', 500, 'api_key_missing');
    }

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const body = await request.json();
    const language = validateLanguage(body.language);
    const cvData = getCvData(language);

    const currentSkills = cvData.skills.map((s) => s.name).join(', ');

    const prompt = `You are a career coach highlighting personal values and soft skills that make this candidate stand out.

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

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Recommend skills API error:', error);
    return createErrorResponse('Failed to generate recommendations', 500, 'processing_failed');
  }
}
