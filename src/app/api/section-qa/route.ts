import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { getCvData } from '@/data/cv-data';
import { getLanguageInstruction } from '@/lib/ai-language';
import { validateLanguage, validateSection, validateQuestion, createErrorResponse } from '@/lib/api-validation';
import { enforceRateLimit } from '@/lib/api-rate-limit';
import type { CVData } from '@/types';

const educationNarratives: Record<string, string> = {
  es: `Notas personales para responder sobre educación:
- Bachiller en Ciencias y Letras: Estudié en el Colegio San Agustín de Panamá desde pre-kínder hasta 12° grado. Fue una etapa retadora que fortaleció mi disciplina, responsabilidad y bases sólidas en matemática y gramática. Me formó como alguien perseverante y orientado a objetivos.
- Técnico Superior en IA: Desde pequeño siempre tuve tecnología cerca y desarrollé pasión por los videojuegos y la innovación. Elegí esta carrera porque la IA es el presente y abre posibilidades infinitas. He confirmado que es mi vocación: disfruto aprender, investigar y construir soluciones con IA y datos. He fortalecido resiliencia, confianza y el hábito autodidacta, trabajando en proyectos personales para aplicar la IA en problemas reales.
- Ingeniería Industrial: Fue mi carrera soñada desde la escuela. Me atrae la visión sistémica, la gestión de procesos y proyectos, y la capacidad de adaptarse a diferentes industrias. Combinada con IA, me permite aportar soluciones técnicas y estratégicas con alto impacto.`,
  en: `Personal education notes:
- High School: I studied at Colegio San Agustín in Panama from pre-k to 12th grade. It was challenging and built strong foundations in math and language, plus discipline, responsibility, and perseverance.
- AI Technical Degree: I grew up around technology and chose AI because it is the present, not the future. I’ve confirmed it’s my passion: I enjoy learning, researching, and building AI/data solutions. I strengthened resilience, confidence, and self-learning through personal projects.
- Industrial Engineering: It was my dream career. I value its systems view, process optimization, and project management across industries. Combined with AI, it creates a strong, differentiated professional profile.`,
  pt: `Notas pessoais sobre educação:
- Ensino médio: Estudei no Colegio San Agustín (Panamá) do pré-k até o 12º ano. Foi desafiador e fortaleceu minhas bases em matemática e linguagem, além de disciplina e perseverança.
- Técnico em IA: Cresci com tecnologia e escolhi IA porque é o presente. Confirmei que é minha paixão; gosto de aprender, pesquisar e construir soluções com dados. Fortaleci resiliência, confiança e o hábito autodidata.
- Engenharia Industrial: Era minha carreira dos sonhos. Gosto da visão sistêmica, da otimização de processos e da gestão de projetos. Combinada com IA, gera um perfil profissional diferenciado.`,
  de: `Persönliche Hinweise zur Ausbildung:
- Abitur: Besuchte das Colegio San Agustín in Panama von Vorschule bis 12. Klasse. Herausfordernd, mit starken Grundlagen in Mathematik und Sprache sowie Disziplin und Durchhaltevermögen.
- KI-Studium: Ich bin mit Technologie aufgewachsen; KI ist die Gegenwart. Es ist meine Leidenschaft: Lernen, Forschung und Aufbau von KI-/Datenlösungen. Resilienz und Selbstlernen wurden stark gefördert.
- Industrial Engineering: Meine Traumkarriere. Systemdenken, Prozessoptimierung und Projektmanagement über Branchen hinweg. Mit KI kombiniert entsteht ein starkes, differenziertes Profil.`,
  fr: `Notes personnelles sur la formation:
- Lycée: Scolarité au Colegio San Agustín (Panama) de la maternelle au 12e. Exigeant, avec bases solides en maths et langue, discipline et persévérance.
- Technicien IA: Passion précoce pour la technologie; l’IA est le présent. J’aime apprendre, chercher et construire des solutions IA/données. Résilience et autonomie renforcées.
- Génie industriel: Ma carrière rêvée. Vision systémique, optimisation des processus, gestion de projets. Combiné à l’IA, cela crée un profil différenciant.`,
  zh: `教育补充说明：
- 高中：在巴拿马 Colegio San Agustín 从学前到 12 年级，阶段具有挑战性，打下扎实的数学与语言基础，培养纪律性与坚持。
- AI 技术：从小热爱科技与创新，选择 AI 因为它是现在。热衷学习、研究并构建 AI/数据方案，提升了韧性与自学能力。
- 工业工程：梦想专业，强调系统思维、流程优化与项目管理。与 AI 结合形成更有竞争力的专业组合。`,
  ja: `学歴の補足：
- 高校：パナマのColegio San Agustínで幼児期から12年生まで在籍。挑戦的な環境で数学・語学の基礎、規律、粘り強さを培いました。
- AI専攻：幼少期からテクノロジーに親しみ、AIは“未来”ではなく“現在”だと考え選択。学習・研究・実装が好きで、自学力とレジリエンスが高まりました。
- 工業工学：夢の進路。システム視点、プロセス最適化、プロジェクト管理を学び、AIと組み合わせることで差別化された強みになります。`,
  ar: `ملاحظات تعليمية إضافية:
- الثانوية: درست في Colegio San Agustín في بنما من التمهيدي حتى الصف 12. تجربة صعبة بنت أساسًا قويًا في الرياضيات واللغة والانضباط.
- دبلوم الذكاء الاصطناعي: نشأت مع التكنولوجيا واخترت الذكاء الاصطناعي لأنه حاضر اليوم. أحب التعلم والبحث وبناء حلول بالبيانات، ما عزّز الاعتماد على الذات والمرونة.
- الهندسة الصناعية: كانت حلمي منذ المدرسة. أحب الرؤية الشمولية وتحسين العمليات وإدارة المشاريع، ومع الذكاء الاصطناعي يتشكل ملف مهني مميز.`,
  hi: `शैक्षिक जानकारी:
- स्कूल: Colegio San Agustín (Panama) में प्री‑के से 12वीं तक पढ़ाई की। यह चुनौतीपूर्ण था और गणित/भाषा की मजबूत नींव, अनुशासन और दृढ़ता विकसित हुई।
- AI तकनीकी: बचपन से टेक में रुचि थी; AI वर्तमान है। सीखना, शोध करना और AI/डेटा समाधान बनाना पसंद है; इससे आत्मविश्वास और स्व-अध्ययन की आदत बढ़ी।
- इंडस्ट्रियल इंजीनियरिंग: मेरी ड्रीम करियर। सिस्टम सोच, प्रोसेस ऑप्टिमाइजेशन और प्रोजेक्ट मैनेजमेंट पसंद है। AI के साथ मिलकर यह प्रोफ़ाइल बहुत मजबूत बनती है।`,
  ko: `?? ?? ??:
- ????: ??? Colegio San Agust?n?? ???~12???? ??. ???? ???? ??/?? ??? ??, ??? ?????.
- AI ??: ?? ??? ??? ??? ??? AI? ???? ??? ??????. ????????? ??? ????? ?????? ???????.
- ????: ?? ??. ??? ??, ???? ???, ???? ??? ????? AI? ??? ???? ??? ????.`,
};

function buildSectionContext(section: string, cvData: CVData, language: string): string {
  switch (section) {
    case 'skills':
      return `Skills:
${cvData.skills.map((s) => `- ${s.name} (${s.category})`).join('\n')}

Use this to explain what each skill is for, how it adds value in industrial engineering, digital innovation, and AI, and where it has been applied.`;
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

${educationNarratives[language] ? `\n${educationNarratives[language]}` : ''}\n\nUse this to answer questions about academic focus, motivations, and personal growth.`;
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

    const cvData = getCvData(language);
    const context = buildSectionContext(section, cvData, language);

    const systemPrompt = `You answer questions about a specific CV section for Martin Bundy, focused on presenting strengths and impact.

${context}

INSTRUCTIONS:
- ${getLanguageInstruction(language)}
- Use only the CV information above. Do not assume or invent.
- Use positive language only. Do not mention weaknesses, gaps, or negatives.
- If details are missing, say they are not included in the CV and highlight relevant strengths instead.
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
    return createErrorResponse('Failed to process question', 500, 'processing_failed');
  }
}
