import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { getCvData } from '@/data/cv-data';
import { getLanguageInstruction } from '@/lib/ai-language';
import { validateLanguage } from '@/lib/api-validation';

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
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

    const prompt = `You are an HR and recruitment expert. Analyze this CV and provide a detailed assessment.

${getLanguageInstruction(language)}
Use only the CV data provided. Do not assume or invent.
Prioritize AI, ML, generative AI, data science, automation, and industrial engineering.
The electrical distribution internship was a learning experience and is not the main focus.

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
  "gaps": ["gap1", "gap2"],
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "atsCompatibility": <0-100>,
  "overallFeedback": "overall feedback"
}`;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Analyze resume API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze resume' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
