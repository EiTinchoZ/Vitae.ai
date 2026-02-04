import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { cvData } from '@/data/cv-data';

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

    const currentSkills = cvData.skills.map((s) => s.name).join(', ');

    const prompt = language === 'es'
      ? `Eres un experto en desarrollo de carrera y tecnologia. Analiza las habilidades actuales de este profesional y recomienda habilidades complementarias para mejorar su perfil.

HABILIDADES ACTUALES:
${currentSkills}

PERFIL:
- Estudiante de Ingenieria Industrial
- Tecnico Superior en IA
- Especializado en Machine Learning y IA Generativa

INSTRUCCIONES:
Responde SOLO con un JSON valido (sin markdown, sin backticks) con esta estructura:
{
  "recommendedSkills": [
    {
      "name": "nombre de la habilidad",
      "reason": "por que es complementaria",
      "difficulty": "facil|medio|dificil",
      "timeToLearn": "tiempo estimado",
      "resources": ["recurso1", "recurso2"]
    }
  ],
  "marketTrends": ["tendencia1", "tendencia2", "tendencia3"],
  "careerAdvice": "consejo general de carrera"
}`
      : `You are a career development and technology expert. Analyze this professional's current skills and recommend complementary skills to improve their profile.

CURRENT SKILLS:
${currentSkills}

PROFILE:
- Industrial Engineering Student
- AI Senior Technician
- Specialized in Machine Learning and Generative AI

INSTRUCTIONS:
Respond ONLY with valid JSON (no markdown, no backticks) with this structure:
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
