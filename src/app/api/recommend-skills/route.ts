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

    const prompt = `You are a recruiter-focused career strategist. Highlight and amplify the candidate's EXISTING strengths for recruiters.

${getLanguageInstruction(language)}
Use only the CV data provided. Do not assume or invent.
Use positive language only. Do not mention weaknesses or gaps.
Do NOT recommend new skills. Only reference skills already present in the CV.
Frame the output as strength highlights and recruiter-ready advantages.
Prioritize AI, ML, generative AI, data science, automation, and industrial engineering.
Avoid salary or compensation discussions.

CURRENT SKILLS:
${currentSkills}

PROFILE SUMMARY:
${cvData.profile}

INSTRUCTIONS:
Respond ONLY with valid JSON (no markdown, no backticks) using this structure.
Use "easy|medium|hard" as difficulty values (do not translate those tokens).
Use "difficulty" to represent depth (easy=core, medium=advanced, hard=expert).
Use "timeToLearn" as proof of experience (e.g., "Demonstrated in Conecta Panamá").
{
  "recommendedSkills": [
    {
      "name": "skill name",
      "reason": "why recruiters value this strength",
      "difficulty": "easy|medium|hard",
      "timeToLearn": "evidence or proof",
      "resources": ["proof point 1", "proof point 2"]
    }
  ],
  "marketTrends": ["market signal 1", "market signal 2", "market signal 3"],
  "careerAdvice": "concise positioning statement for recruiters"
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
