import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { cvData } from '@/data/cv-data';

function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    es: 'espanol',
    en: 'ingles',
    pt: 'portugues',
    de: 'aleman',
    fr: 'frances',
    zh: 'chino',
    ja: 'japones',
    ar: 'arabe',
    hi: 'hindi',
    ko: 'coreano',
  };
  return names[code] || 'espanol';
}

const sectionContexts: Record<string, string> = {
  skills: `
Habilidades tecnicas de Martin Bundy:
${cvData.skills.map((s) => `- ${s.name} (${s.category})`).join('\n')}

Responde preguntas especificas sobre estas habilidades, por que las eligio, como las aplica, proyectos donde las uso, etc.
  `,
  projects: `
Proyectos de Martin Bundy:
${cvData.projects
  .map(
    (p) => `
- ${p.name}: ${p.longDescription}
  Tecnologias: ${p.technologies.join(', ')}
  Impacto: ${p.impact}
  Caracteristicas: ${p.features.join(', ')}
`
  )
  .join('\n')}

Responde preguntas sobre desafios, decisiones tecnicas, aprendizajes, impacto, etc.
  `,
  experience: `
Experiencia laboral de Martin Bundy:
${cvData.experience
  .map(
    (e) => `
- ${e.position} en ${e.company} (${e.location})
  Periodo: ${e.startPeriod} - ${e.endPeriod}
  Responsabilidades: ${e.responsibilities.join('; ')}
  Habilidades: ${e.skills.join(', ')}
`
  )
  .join('\n')}

Responde preguntas sobre logros, retos, aprendizajes, ambiente de trabajo, etc.
  `,
  education: `
Educacion de Martin Bundy:
${cvData.education
  .map(
    (e) => `
- ${e.title} en ${e.institution}
  Estado: ${e.status}
  Descripcion: ${e.description || 'N/A'}
`
  )
  .join('\n')}

Responde preguntas sobre motivacion, materias favoritas, proyectos academicos, etc.
  `,
};

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

    const { section, question, language } = await req.json();

    const context = sectionContexts[section] || '';

    const systemPrompt = `Eres un asistente que responde preguntas especificas sobre una seccion del CV de Martin Bundy.

${context}

INSTRUCCIONES:
- Responde de forma concisa y profesional
- Si no tienes informacion, di que no tienes esos detalles
- Responde en el idioma: ${getLanguageName(language)}
- Maximo 2-3 oraciones`;

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
