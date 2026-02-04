import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { cvData } from '@/data/cv-data';

export async function POST() {
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

    const insightsPrompt = `Eres un experto en carreras profesionales y analisis de CVs. Analiza el siguiente perfil y proporciona insights en formato JSON.

PERFIL:
Nombre: ${cvData.personal.name}
Ubicacion: ${cvData.personal.location}

Perfil: ${cvData.profile}

Habilidades: ${cvData.skills.map((s) => s.name).join(', ')}

Educacion:
${cvData.education.map((e) => `- ${e.title} en ${e.institution} (${e.status})`).join('\n')}

Certificaciones: ${cvData.certificates.length} certificaciones
Experiencia: ${cvData.experience.length} posiciones

INSTRUCCIONES:
Responde SOLO con un JSON valido (sin markdown, sin backticks) con esta estructura exacta:
{
  "careerScore": <numero 0-100>,
  "strengths": ["fortaleza1", "fortaleza2", "fortaleza3"],
  "uniqueValue": "<propuesta de valor unica en 1 oracion>",
  "marketFit": "<descripcion de como encaja en el mercado actual>",
  "recommendations": ["recomendacion1", "recomendacion2", "recomendacion3"],
  "skillsRadar": {
    "ai": <0-100>,
    "programming": <0-100>,
    "industrial": <0-100>,
    "softSkills": <0-100>,
    "languages": <0-100>
  },
  "salaryRange": {
    "min": <numero>,
    "max": <numero>,
    "currency": "USD"
  },
  "careerPaths": ["path1", "path2", "path3"]
}`;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: insightsPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Insights API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate insights' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
