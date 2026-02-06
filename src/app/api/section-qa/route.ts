import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { getCvData } from '@/data/cv-data';
import { getLanguageInstruction } from '@/lib/ai-language';
import { validateLanguage, validateSection, validateQuestion, createErrorResponse } from '@/lib/api-validation';
import { enforceRateLimit } from '@/lib/api-rate-limit';
import type { CVData } from '@/types';
import { IS_DEMO } from '@/lib/app-config';
import { EMPTY_CV_DATA, mergeCvData } from '@/lib/cv-data-utils';

const educationNarrative = `Notas personales para responder sobre educación:
- Bachiller en Ciencias y Letras: Estudié en el Colegio San Agustín de Panamá desde pre-kínder hasta 12° grado. Fue una etapa retadora que fortaleció mis bases en matemática y gramática, además de disciplina, responsabilidad y perseverancia.
- Técnico Superior en IA: Desde pequeño siempre tuve tecnología cerca y desarrollé pasión por los videojuegos y la innovación. Elegí esta carrera porque la IA es el presente. Disfruto aprender, investigar y construir soluciones con IA y datos. He fortalecido resiliencia, confianza y el hábito autodidacta, trabajando en proyectos personales para resolver problemas reales y aportar soluciones innovadoras.
- Ingeniería Industrial: Fue mi carrera soñada desde la escuela. Me atrae la visión sistémica, la optimización de procesos y la gestión de proyectos. Es una carrera muy adaptable y combinada con IA crea un perfil profesional diferenciado y de alto impacto.`;

function buildSectionContext(section: string, cvData: CVData, language: string): string {
  switch (section) {
    case 'skills':
      return `Skills:
${cvData.skills.map((s) => `- ${s.name} (${s.category})`).join('\n')}

Use this to explain what each skill is for, how it adds value in industrial engineering, digital innovation, and AI, and where it has been applied. Keep it simple and easy to understand, focusing on impact and real-world use.`;
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

${!IS_DEMO && educationNarrative ? `\n${educationNarrative}` : ''}\n\nUse this to answer questions about academic focus, motivations, and personal growth.`;
    default:
      return '';
  }
}

export async function POST(req: Request) {
  try {
    const rateLimitResponse = enforceRateLimit(req, {
      windowMs: 60_000,
      max: 20,
      keyPrefix: 'section-qa',
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
    const section = validateSection(body.section);
    const question = validateQuestion(body.question);

    if (!section) {
      return createErrorResponse('Invalid section', 400, 'invalid_section');
    }
    if (!question) {
      return createErrorResponse('Invalid question', 400, 'invalid_question');
    }

    const override = IS_DEMO && body?.cvData && typeof body.cvData === 'object' ? body.cvData : null;
    const cvData = override ? mergeCvData(EMPTY_CV_DATA, override) : getCvData(language);
    const candidateName = cvData.personal.fullName || cvData.personal.name || 'the candidate';
    const hasElectricInternship = cvData.experience.some(
      (exp) =>
        exp.company.toLowerCase().includes('primer empleo') ||
        exp.position.toLowerCase().includes('distribuci') ||
        exp.position.toLowerCase().includes('electric')
    );
    const context = buildSectionContext(section, cvData, language);

    const systemPrompt = `You answer questions about a specific CV section for ${candidateName}, focused on presenting strengths and impact.

${context}

INSTRUCTIONS:
- ${getLanguageInstruction(language)}
- Use only the CV information above. Do not assume or invent.
- Use positive language only. Do not mention weaknesses, gaps, or negatives.
- If details are missing, say they are not included in the CV and highlight relevant strengths instead.
- Keep responses concise (2-3 sentences).
- Prioritize AI, ML, generative AI, data science, automation, and industrial engineering.
${hasElectricInternship ? '- The electrical distribution internship was a learning experience; do not present it as a core specialization.' : ''}`;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: question,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Section QA API error:', error);
    return createErrorResponse('Failed to process question', 500, 'processing_failed');
  }
}
