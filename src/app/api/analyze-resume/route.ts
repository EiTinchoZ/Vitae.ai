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

    const cvSummary = `
INFORMACION PERSONAL:
- Nombre: ${cvData.personal.name}
- Ubicacion: ${cvData.personal.location}
- Email: ${cvData.personal.email ? 'Presente' : 'Falta'}
- Telefono: ${cvData.personal.phone ? 'Presente' : 'Falta'}
- LinkedIn: ${cvData.personal.linkedin ? 'Presente' : 'Falta'}
- GitHub: ${cvData.personal.github ? 'Presente' : 'Falta'}

PERFIL:
${cvData.profile}

EDUCACION (${cvData.education.length} entradas):
${cvData.education.map((e) => `- ${e.title} en ${e.institution} (${e.status})`).join('\n')}

EXPERIENCIA (${cvData.experience.length} posiciones):
${cvData.experience.map((e) => `- ${e.position} en ${e.company} (${e.startPeriod} - ${e.endPeriod})`).join('\n')}

HABILIDADES (${cvData.skills.length} habilidades):
${cvData.skills.map((s) => s.name).join(', ')}

CERTIFICACIONES (${cvData.certificates.length} certificaciones)

PROYECTOS (${cvData.projects.length} proyectos destacados)
`;

    const prompt = language === 'es'
      ? `Eres un experto en recursos humanos y reclutamiento. Analiza este CV y proporciona un analisis detallado.

${cvSummary}

INSTRUCCIONES:
Responde SOLO con un JSON valido (sin markdown, sin backticks) con esta estructura:
{
  "completenessScore": <numero 0-100>,
  "sections": {
    "personal": { "score": <0-100>, "feedback": "comentario" },
    "profile": { "score": <0-100>, "feedback": "comentario" },
    "education": { "score": <0-100>, "feedback": "comentario" },
    "experience": { "score": <0-100>, "feedback": "comentario" },
    "skills": { "score": <0-100>, "feedback": "comentario" },
    "certificates": { "score": <0-100>, "feedback": "comentario" },
    "projects": { "score": <0-100>, "feedback": "comentario" }
  },
  "gaps": ["gap1", "gap2"],
  "strengths": ["fortaleza1", "fortaleza2"],
  "improvements": ["mejora1", "mejora2", "mejora3"],
  "atsCompatibility": <0-100>,
  "overallFeedback": "retroalimentacion general"
}`
      : `You are an HR and recruitment expert. Analyze this CV and provide a detailed analysis.

${cvSummary}

INSTRUCTIONS:
Respond ONLY with valid JSON (no markdown, no backticks) with this structure:
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
