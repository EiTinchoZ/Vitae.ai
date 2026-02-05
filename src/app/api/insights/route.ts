import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { getCvData } from '@/data/cv-data';
import { getLanguageInstruction } from '@/lib/ai-language';
import { validateLanguage, createErrorResponse } from '@/lib/api-validation';
import { enforceRateLimit } from '@/lib/api-rate-limit';

export async function POST(req: Request) {
  try {
    const rateLimitResponse = enforceRateLimit(req, {
      windowMs: 60_000,
      max: 15,
      keyPrefix: 'insights',
    });
    if (rateLimitResponse) return rateLimitResponse;

    if (!process.env.GROQ_API_KEY) {
      return createErrorResponse('API key not configured', 500, 'api_key_missing');
    }

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const body = await req.json();
    const language = validateLanguage(body.language);
    const cvData = getCvData(language);

    const cvSummary = `
Name: ${cvData.personal.name}
Location: ${cvData.personal.location}

Profile:
${cvData.profile}

Skills:
${cvData.skills.map((s) => s.name).join(', ')}

Education:
${cvData.education
  .map((e) => `- ${e.title} (${e.institution}) [${e.status}]`)
  .join('\n')}

Certifications:
${cvData.certificates
  .map((c) => `- ${c.name} (${c.institution}) [${c.status}]`)
  .join('\n')}

Experience:
${cvData.experience
  .map((e) => `- ${e.position} at ${e.company} (${e.startPeriod} - ${e.endPeriod})`)
  .join('\n')}

Projects:
${cvData.projects.map((p) => `- ${p.name} (${p.year})`).join('\n')}
`.trim();

    const insightsPrompt = `You are an expert recruiter and HR consultant. Analyze this CV and provide insights that help a recruiter evaluate this candidate quickly and effectively.

${getLanguageInstruction(language)}
Use only the CV data provided. Do not assume or invent.
Focus on AI, ML, generative AI, data science, automation, and industrial engineering expertise.
The electrical distribution internship was a learning experience, not a core specialization.
Avoid salary or compensation discussions.

CV SUMMARY:
${cvSummary}

INSTRUCTIONS:
Provide insights FROM A RECRUITER'S PERSPECTIVE. Help recruiters understand why this candidate stands out.
Respond ONLY with valid JSON (no markdown, no backticks) using this exact structure:
{
  "profileScore": <number 0-100 representing overall profile strength>,
  "keyStrengths": ["strength1", "strength2", "strength3"],
  "uniqueValue": "<compelling one-sentence value proposition for recruiters>",
  "idealRoles": ["role1", "role2", "role3"],
  "standoutFactors": ["what makes this candidate unique 1", "factor 2", "factor 3"],
  "skillsRadar": {
    "ai": <0-100>,
    "programming": <0-100>,
    "industrial": <0-100>,
    "softSkills": <0-100>,
    "languages": <0-100>
  },
  "experienceTimeline": [
    {"period": "year-year", "highlight": "key achievement or role"}
  ],
  "techStack": ["tech1", "tech2", "tech3", "tech4", "tech5"],
  "recruiterSummary": "<2-3 sentence executive summary for busy recruiters>"
}`;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: insightsPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Insights API error:', error);
    return createErrorResponse('Failed to generate insights', 500, 'processing_failed');
  }
}
