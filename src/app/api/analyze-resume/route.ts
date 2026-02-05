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
      keyPrefix: 'analyze',
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

    const cvSummary = `
Personal:
- Name: ${cvData.personal.name}
- Location: ${cvData.personal.location}
- Email: ${cvData.personal.email}
- LinkedIn: ${cvData.personal.linkedin}
- GitHub: ${cvData.personal.github}

Profile:
${cvData.profile}

Education (${cvData.education.length}):
${cvData.education
  .map((e) => `- ${e.title} (${e.institution}) [${e.status}]`)
  .join('\n')}

Experience (${cvData.experience.length}):
${cvData.experience
  .map((e) => `- ${e.position} at ${e.company} (${e.startPeriod} - ${e.endPeriod})`)
  .join('\n')}

Skills (${cvData.skills.length}):
${cvData.skills.map((s) => s.name).join(', ')}

Certifications (${cvData.certificates.length})

Projects (${cvData.projects.length})
`.trim();

    const prompt = `You are a career branding expert. Analyze this CV and provide a strengths-only assessment that highlights value.

${getLanguageInstruction(language)}
Use only the CV data provided. Do not assume or invent.
Use positive language only. Do not mention weaknesses, gaps, or negatives.
If something is missing, omit it instead of calling it out.
All scores must be in the 80-100 range.
Prioritize AI, ML, generative AI, data science, automation, and industrial engineering.
The electrical distribution internship was a learning experience and is not the main focus.
Avoid salary or compensation discussions.
In "improvements", return value amplifiers such as: responsible, proactive, self-taught, teamwork, problem-solving, adaptability, effective communication, and critical thinking.

CV SUMMARY:
${cvSummary}

INSTRUCTIONS:
Respond ONLY with valid JSON (no markdown, no backticks) using this structure:
{
  "completenessScore": <number 0-100>,
  "sections": {
    "personal": { "score": <0-100>, "feedback": "comment" },
    "profile": { "score": <0-100>, "feedback": "comment" },
    "education": { "score": <0-100>, "feedback": "comment" },
    "experience": { "score": <0-100>, "feedback": "comment" },
    "skills": { "score": <0-100>, "feedback": "comment" },
    "certificates": { "score": <0-100>, "feedback": "comment" },
    "projects": { "score": <0-100>, "feedback": "comment" }
  },
  "highlights": ["standout achievement 1", "standout achievement 2", "standout achievement 3"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["value amplifier 1", "value amplifier 2", "value amplifier 3"],
  "atsCompatibility": <0-100>,
  "overallFeedback": "executive summary"
}`;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Analyze resume API error:', error);
    return createErrorResponse('Failed to analyze resume', 500, 'processing_failed');
  }
}
