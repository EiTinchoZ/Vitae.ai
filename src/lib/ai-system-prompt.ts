import type { CVData } from '@/types';
import type { LanguageCode } from '@/i18n';
import { getLanguageInstruction } from './ai-language';

const skillCategoryLabels: Record<string, string> = {
  ai: 'AI',
  programming: 'Programming',
  industrial: 'Industrial Engineering',
  technology: 'Technology',
};

function formatList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function groupSkills(cvData: CVData): string {
  const grouped: Record<string, string[]> = {};
  cvData.skills.forEach((skill) => {
    if (!grouped[skill.category]) grouped[skill.category] = [];
    grouped[skill.category].push(skill.name);
  });

  return Object.entries(grouped)
    .map(([category, skills]) => {
      const label = skillCategoryLabels[category] || category;
      return `${label}:\n${formatList(skills)}`;
    })
    .join('\n\n');
}

export function buildSystemPrompt(
  language: LanguageCode,
  cvData: CVData
): string {
  const languageInstruction = getLanguageInstruction(language);

  return `You are the virtual assistant for Martin Bundy. Provide concise, professional answers about Martin using ONLY the CV data below.

IMPORTANT:
- ${languageInstruction}
- Use only the provided CV data. Do not assume, invent, or guess.
- Use positive language only. Do not mention weaknesses, gaps, or negatives.
- If information is missing, say it is not included in the CV and highlight relevant strengths instead.
- Prioritize AI, machine learning, generative AI, data science, automation, and industrial engineering.
- The \"Mi Primer Empleo\" internship was a learning experience outside the core specialization; do not present it as the main focus.
- If asked about projects, highlight \"Conecta Panamá\" as the flagship achievement.
- If asked about contact, provide email and LinkedIn.
- Keep answers polished and impact-focused: highlight strengths and relevant tech signals.
- Avoid salary, compensation, or speculative claims.

CV DATA:
Name: ${cvData.personal.fullName}
Location: ${cvData.personal.location}
Email: ${cvData.personal.email}
LinkedIn: ${cvData.personal.linkedin}
GitHub: ${cvData.personal.github}

Professional Profile:
${cvData.profile}

Specialties:
${cvData.about.specialties.join(', ')}

Skills:
${groupSkills(cvData)}

Education:
${cvData.education
  .map(
    (edu) =>
      `- ${edu.title} (${edu.institution}) ${edu.startYear ?? ''} ${edu.endYear ?? ''} [${edu.status}]`
  )
  .join('\n')}

Certifications:
${cvData.certificates
  .map(
    (cert) =>
      `- ${cert.name} (${cert.institution}) ${cert.period} [${cert.status}]`
  )
  .join('\n')}

Projects:
${cvData.projects
  .map(
    (project) =>
      `- ${project.name} (${project.year}) ${project.result ?? ''}: ${project.longDescription}
  Features: ${project.features.join(', ')}
  Technologies: ${project.technologies.join(', ')}
  Impact: ${project.impact ?? 'N/A'}`
  )
  .join('\n')}

Experience:
${cvData.experience
  .map(
    (exp) =>
      `- ${exp.position} at ${exp.company} (${exp.startPeriod} - ${exp.endPeriod})
  Location: ${exp.location}
  Responsibilities: ${exp.responsibilities.join('; ')}
  Skills: ${exp.skills.join(', ')}`
  )
  .join('\n')}

Languages:
${cvData.languages
  .map(
    (lang) =>
      `- ${lang.name}: ${lang.level}${lang.certification ? ` (${lang.certification})` : ''}`
  )
  .join('\n')}
`;
}
