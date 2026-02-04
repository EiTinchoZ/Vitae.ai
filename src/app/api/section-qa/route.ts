import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { getCvData } from '@/data/cv-data';
import { getLanguageInstruction } from '@/lib/ai-language';
import { validateLanguage, validateSection, validateQuestion, createErrorResponse } from '@/lib/api-validation';
import type { CVData } from '@/types';

function buildSectionContext(section: string, cvData: CVData): string {
  switch (section) {
    case 'skills':
      return `Skills:
${cvData.skills.map((s) => `- ${s.name} (${s.category})`).join('\n')}

Use this to answer questions about strengths, learning path, and how these skills are applied.`;
    case 'projects':
      return `Projects:
${cvData.projects
  .map(
    (p) => `- ${p.name}: ${p.longDescription}
  Technologies: ${p.technologies.join(', ')}
  Impact: ${p.impact ?? 'N/A'}
  Features: ${p.features.join(', ')}`
  )
  .join('\n')}

Use this to answer questions about challenges, technical decisions, and outcomes.`;
    case 'experience':
      return `Experience:
${cvData.experience
  .map(
    (e) => `- ${e.position} at ${e.company} (${e.location})
  Period: ${e.startPeriod} - ${e.endPeriod}
  Responsibilities: ${e.responsibilities.join('; ')}
  Skills: ${e.skills.join(', ')}`
  )
  .join('\n')}

Use this to answer questions about responsibilities, learnings, and collaboration.`;
    case 'education':
      return `Education:
${cvData.education
  .map(
    (e) => `- ${e.title} at ${e.institution}
  Status: ${e.status}
  Description: ${e.description || 'N/A'}`
  )
  .join('\n')}

Use this to answer questions about academic focus and goals.`;
    default:
      return '';
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const language = validateLanguage(body.language);
    const section = validateSection(body.section);
    const question = validateQuestion(body.question);

    if (!section) {
      return createErrorResponse('Invalid section');
    }
    if (!question) {
      return createErrorResponse('Invalid question');
    }

    const cvData = getCvData(language);
    const context = buildSectionContext(section, cvData);

    const systemPrompt = `You answer questions about a specific CV section for Martin Bundy.

${context}

INSTRUCTIONS:
- ${getLanguageInstruction(language)}
- Use only the CV information above. Do not assume or invent.
- If details are missing, say you don't have that information.
- Keep responses concise (2-3 sentences).
- Prioritize AI, ML, generative AI, data science, automation, and industrial engineering.
- The electrical distribution internship was a learning experience; do not present it as a core specialization.`;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: question,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Section QA API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process question' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
