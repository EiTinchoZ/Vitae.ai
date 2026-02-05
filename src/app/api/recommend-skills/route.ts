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

    const prompt = `You are a recruiter-focused career strategist. Recommend complementary skills that would strengthen this candidate's profile for recruiters.

${getLanguageInstruction(language)}
Use only the CV data provided. Do not assume or invent.
Use positive language only. Do not mention weaknesses or gaps.
Frame recommendations as value amplifiers and complementary strengths.
Prioritize AI, ML, generative AI, data science, automation, and industrial engineering.
Avoid salary or compensation discussions.

CURRENT SKILLS:
${currentSkills}

PROFILE SUMMARY:
${cvData.profile}

INSTRUCTIONS:
Respond ONLY with valid JSON (no markdown, no backticks) using this structure.
Use "easy|medium|hard" as difficulty values (do not translate those tokens).
{
  "recommendedSkills": [
    {
      "name": "skill name",
      "reason": "why it's complementary",
      "difficulty": "easy|medium|hard",
      "timeToLearn": "estimated time",
      "resources": ["resource1", "resource2"]
    }
  ],
  "marketTrends": ["trend1", "trend2", "trend3"],
  "careerAdvice": "general career advice"
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
