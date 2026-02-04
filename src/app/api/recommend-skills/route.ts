import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { getCvData } from '@/data/cv-data';
import { getLanguageInstruction } from '@/lib/ai-language';

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

    const { language = 'es' } = await request.json();
    const cvData = getCvData(language);

    const currentSkills = cvData.skills.map((s) => s.name).join(', ');

    const prompt = `You are a career development and technology expert. Recommend complementary skills for this profile.

${getLanguageInstruction(language)}
Use only the CV data provided. Do not assume or invent.
Prioritize AI, ML, generative AI, data science, automation, and industrial engineering.

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
    return new Response(
      JSON.stringify({ error: 'Failed to generate recommendations' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
