/**
 * CV Data Example File
 *
 * This is a template file with fictional data. To use Vitae.ai:
 * 1. Copy this file to cv-data.ts
 * 2. Replace all placeholder data with your real information
 * 3. Add translations for other languages as needed
 *
 * See cv-schema.md for detailed documentation on the data structure.
 */

import type { CVData } from '@/types';
import type { LanguageCode } from '@/i18n';

// ============================================
// PERSONAL INFORMATION
// Replace with your actual data
// ============================================
const personal = {
  name: 'John Doe',
  fullName: 'John Michael Doe',
  location: 'San Francisco, USA',
  phone: '', // Optional - leave empty for privacy
  email: 'john.doe@example.com',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
};

// ============================================
// CV DATA BY LANGUAGE
// Add your content in each language you want to support
// ============================================
const cvByLanguage: Record<LanguageCode, Omit<CVData, 'personal'>> = {
  // Spanish
  es: {
    profile:
      'Desarrollador de software con experiencia en tecnologias web modernas y aplicaciones de inteligencia artificial. Apasionado por crear soluciones innovadoras que generen impacto positivo.',
    about: {
      quote:
        'Transformando ideas en soluciones tecnologicas que hacen la diferencia.',
      specialties: [
        'React',
        'Node.js',
        'TypeScript',
        'Python',
        'Machine Learning',
        'Cloud Computing',
      ],
      highlights: {
        educationValue: 'Ingenieria en Software',
        specializationValue: 'Full Stack & IA',
        locationValue: 'San Francisco, USA',
        languagesValue: 'Espanol, Ingles',
      },
    },
    skills: [
      { name: 'React', category: 'programming' },
      { name: 'TypeScript', category: 'programming' },
      { name: 'Node.js', category: 'programming' },
      { name: 'Python', category: 'programming' },
      { name: 'Machine Learning', category: 'ai' },
      { name: 'TensorFlow', category: 'ai' },
      { name: 'AWS', category: 'technology' },
      { name: 'Docker', category: 'technology' },
      { name: 'Gestion de Proyectos', category: 'industrial' },
      { name: 'Metodologias Agiles', category: 'industrial' },
    ],
    education: [
      {
        id: 'edu-1',
        title: 'Licenciatura en Ingenieria de Software',
        institution: 'Universidad de California',
        startYear: 2018,
        endYear: 2022,
        status: 'completed',
        description: 'Especializacion en desarrollo web y sistemas distribuidos',
      },
      {
        id: 'edu-2',
        title: 'Master en Inteligencia Artificial',
        institution: 'Stanford University',
        startYear: 2023,
        endYear: 2025,
        status: 'in_progress',
        description: 'Enfoque en Machine Learning y NLP',
      },
    ],
    certificates: [
      {
        id: 'cert-1',
        name: 'AWS Solutions Architect',
        institution: 'Amazon Web Services',
        period: '2023',
        status: 'completed',
        description: 'Certificacion profesional en arquitectura cloud',
        category: 'technical',
      },
      {
        id: 'cert-2',
        name: 'Google Cloud Professional',
        institution: 'Google',
        period: '2024',
        status: 'completed',
        description: 'Certificacion en servicios de Google Cloud',
        category: 'technical',
      },
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'Tech Startup Inc.',
        position: 'Senior Full Stack Developer',
        location: 'San Francisco, USA',
        startPeriod: '2022',
        endPeriod: 'Presente',
        responsibilities: [
          'Desarrollo de aplicaciones web con React y Node.js',
          'Implementacion de microservicios en AWS',
          'Liderando equipo de 5 desarrolladores',
          'Integracion de modelos de IA en produccion',
        ],
        skills: ['React', 'Node.js', 'AWS', 'Python'],
      },
    ],
    projects: [
      {
        id: 'project-1',
        name: 'AI Task Manager',
        type: 'Personal Project',
        year: 2024,
        shortDescription: 'Gestor de tareas inteligente con IA integrada',
        longDescription:
          'Aplicacion de gestion de tareas que utiliza IA para priorizar y sugerir automaticamente. Implementado con React, Node.js y OpenAI API.',
        features: [
          'Priorizacion automatica con IA',
          'Integracion con calendario',
          'Notificaciones inteligentes',
        ],
        technologies: ['React', 'Node.js', 'OpenAI', 'PostgreSQL'],
        impact: 'Aumento de productividad del 40% en usuarios beta',
        isHighlighted: true,
      },
    ],
    languages: [
      {
        id: 'lang-1',
        name: 'Espanol',
        level: 'Nativo',
        description: 'Lengua materna',
      },
      {
        id: 'lang-2',
        name: 'Ingles',
        level: 'C1 Avanzado',
        description: 'Nivel profesional completo',
      },
    ],
  },

  // English
  en: {
    profile:
      'Software developer with experience in modern web technologies and artificial intelligence applications. Passionate about creating innovative solutions that make a positive impact.',
    about: {
      quote:
        'Transforming ideas into technology solutions that make a difference.',
      specialties: [
        'React',
        'Node.js',
        'TypeScript',
        'Python',
        'Machine Learning',
        'Cloud Computing',
      ],
      highlights: {
        educationValue: 'Software Engineering',
        specializationValue: 'Full Stack & AI',
        locationValue: 'San Francisco, USA',
        languagesValue: 'Spanish, English',
      },
    },
    skills: [
      { name: 'React', category: 'programming' },
      { name: 'TypeScript', category: 'programming' },
      { name: 'Node.js', category: 'programming' },
      { name: 'Python', category: 'programming' },
      { name: 'Machine Learning', category: 'ai' },
      { name: 'TensorFlow', category: 'ai' },
      { name: 'AWS', category: 'technology' },
      { name: 'Docker', category: 'technology' },
      { name: 'Project Management', category: 'industrial' },
      { name: 'Agile Methodologies', category: 'industrial' },
    ],
    education: [
      {
        id: 'edu-1',
        title: 'BSc in Software Engineering',
        institution: 'University of California',
        startYear: 2018,
        endYear: 2022,
        status: 'completed',
        description: 'Specialization in web development and distributed systems',
      },
      {
        id: 'edu-2',
        title: 'MSc in Artificial Intelligence',
        institution: 'Stanford University',
        startYear: 2023,
        endYear: 2025,
        status: 'in_progress',
        description: 'Focus on Machine Learning and NLP',
      },
    ],
    certificates: [
      {
        id: 'cert-1',
        name: 'AWS Solutions Architect',
        institution: 'Amazon Web Services',
        period: '2023',
        status: 'completed',
        description: 'Professional certification in cloud architecture',
        category: 'technical',
      },
      {
        id: 'cert-2',
        name: 'Google Cloud Professional',
        institution: 'Google',
        period: '2024',
        status: 'completed',
        description: 'Certification in Google Cloud services',
        category: 'technical',
      },
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'Tech Startup Inc.',
        position: 'Senior Full Stack Developer',
        location: 'San Francisco, USA',
        startPeriod: '2022',
        endPeriod: 'Present',
        responsibilities: [
          'Web application development with React and Node.js',
          'Microservices implementation on AWS',
          'Leading team of 5 developers',
          'AI model integration in production',
        ],
        skills: ['React', 'Node.js', 'AWS', 'Python'],
      },
    ],
    projects: [
      {
        id: 'project-1',
        name: 'AI Task Manager',
        type: 'Personal Project',
        year: 2024,
        shortDescription: 'Intelligent task manager with integrated AI',
        longDescription:
          'Task management application that uses AI to automatically prioritize and suggest tasks. Built with React, Node.js, and OpenAI API.',
        features: [
          'Automatic AI prioritization',
          'Calendar integration',
          'Smart notifications',
        ],
        technologies: ['React', 'Node.js', 'OpenAI', 'PostgreSQL'],
        impact: '40% productivity increase in beta users',
        isHighlighted: true,
      },
    ],
    languages: [
      {
        id: 'lang-1',
        name: 'Spanish',
        level: 'Native',
        description: 'Mother tongue',
      },
      {
        id: 'lang-2',
        name: 'English',
        level: 'C1 Advanced',
        description: 'Full professional proficiency',
      },
    ],
  },

  // Portuguese - Copy and translate from English/Spanish
  pt: {
    profile: 'Desenvolvedor de software com experiencia em tecnologias web modernas e aplicacoes de inteligencia artificial.',
    about: {
      quote: 'Transformando ideias em solucoes tecnologicas que fazem a diferenca.',
      specialties: ['React', 'Node.js', 'TypeScript', 'Python', 'Machine Learning', 'Cloud Computing'],
      highlights: {
        educationValue: 'Engenharia de Software',
        specializationValue: 'Full Stack & IA',
        locationValue: 'San Francisco, USA',
        languagesValue: 'Espanhol, Ingles',
      },
    },
    skills: [
      { name: 'React', category: 'programming' },
      { name: 'TypeScript', category: 'programming' },
      { name: 'Machine Learning', category: 'ai' },
    ],
    education: [],
    certificates: [],
    experience: [],
    projects: [],
    languages: [],
  },

  // German - Add your translations
  de: {
    profile: 'Softwareentwickler mit Erfahrung in modernen Webtechnologien und KI-Anwendungen.',
    about: {
      quote: 'Ideen in technologische Losungen verwandeln, die einen Unterschied machen.',
      specialties: ['React', 'Node.js', 'TypeScript', 'Python', 'Machine Learning', 'Cloud Computing'],
      highlights: {
        educationValue: 'Software Engineering',
        specializationValue: 'Full Stack & KI',
        locationValue: 'San Francisco, USA',
        languagesValue: 'Spanisch, Englisch',
      },
    },
    skills: [
      { name: 'React', category: 'programming' },
      { name: 'TypeScript', category: 'programming' },
      { name: 'Machine Learning', category: 'ai' },
    ],
    education: [],
    certificates: [],
    experience: [],
    projects: [],
    languages: [],
  },

  // French - Add your translations
  fr: {
    profile: 'Developpeur logiciel avec experience en technologies web modernes et applications d\'intelligence artificielle.',
    about: {
      quote: 'Transformer les idees en solutions technologiques qui font la difference.',
      specialties: ['React', 'Node.js', 'TypeScript', 'Python', 'Machine Learning', 'Cloud Computing'],
      highlights: {
        educationValue: 'Ingenierie Logicielle',
        specializationValue: 'Full Stack & IA',
        locationValue: 'San Francisco, USA',
        languagesValue: 'Espagnol, Anglais',
      },
    },
    skills: [
      { name: 'React', category: 'programming' },
      { name: 'TypeScript', category: 'programming' },
      { name: 'Machine Learning', category: 'ai' },
    ],
    education: [],
    certificates: [],
    experience: [],
    projects: [],
    languages: [],
  },

  // Chinese - Add your translations
  zh: {
    profile: '具有现代网络技术和人工智能应用经验的软件开发人员。',
    about: {
      quote: '将创意转化为有影响力的技术解决方案。',
      specialties: ['React', 'Node.js', 'TypeScript', 'Python', '机器学习', '云计算'],
      highlights: {
        educationValue: '软件工程',
        specializationValue: '全栈 & AI',
        locationValue: '美国旧金山',
        languagesValue: '西班牙语, 英语',
      },
    },
    skills: [
      { name: 'React', category: 'programming' },
      { name: 'TypeScript', category: 'programming' },
      { name: '机器学习', category: 'ai' },
    ],
    education: [],
    certificates: [],
    experience: [],
    projects: [],
    languages: [],
  },

  // Japanese - Add your translations
  ja: {
    profile: '最新のウェブ技術とAIアプリケーションの経験を持つソフトウェア開発者。',
    about: {
      quote: 'アイデアを影響力のある技術ソリューションに変換する。',
      specialties: ['React', 'Node.js', 'TypeScript', 'Python', '機械学習', 'クラウドコンピューティング'],
      highlights: {
        educationValue: 'ソフトウェア工学',
        specializationValue: 'フルスタック & AI',
        locationValue: 'サンフランシスコ, アメリカ',
        languagesValue: 'スペイン語, 英語',
      },
    },
    skills: [
      { name: 'React', category: 'programming' },
      { name: 'TypeScript', category: 'programming' },
      { name: '機械学習', category: 'ai' },
    ],
    education: [],
    certificates: [],
    experience: [],
    projects: [],
    languages: [],
  },

  // Arabic - Add your translations
  ar: {
    profile: 'مطور برمجيات ذو خبرة في تقنيات الويب الحديثة وتطبيقات الذكاء الاصطناعي.',
    about: {
      quote: 'تحويل الأفكار إلى حلول تقنية تصنع الفرق.',
      specialties: ['React', 'Node.js', 'TypeScript', 'Python', 'تعلم الآلة', 'الحوسبة السحابية'],
      highlights: {
        educationValue: 'هندسة البرمجيات',
        specializationValue: 'Full Stack & AI',
        locationValue: 'سان فرانسيسكو، الولايات المتحدة',
        languagesValue: 'الإسبانية، الإنجليزية',
      },
    },
    skills: [
      { name: 'React', category: 'programming' },
      { name: 'TypeScript', category: 'programming' },
      { name: 'تعلم الآلة', category: 'ai' },
    ],
    education: [],
    certificates: [],
    experience: [],
    projects: [],
    languages: [],
  },

  // Hindi - Add your translations
  hi: {
    profile: 'आधुनिक वेब तकनीकों और AI अनुप्रयोगों में अनुभवी सॉफ्टवेयर डेवलपर।',
    about: {
      quote: 'विचारों को प्रभावशाली तकनीकी समाधानों में बदलना।',
      specialties: ['React', 'Node.js', 'TypeScript', 'Python', 'मशीन लर्निंग', 'क्लाउड कंप्यूटिंग'],
      highlights: {
        educationValue: 'सॉफ्टवेयर इंजीनियरिंग',
        specializationValue: 'फुल स्टैक & AI',
        locationValue: 'सैन फ्रांसिस्को, यूएसए',
        languagesValue: 'स्पेनिश, अंग्रेजी',
      },
    },
    skills: [
      { name: 'React', category: 'programming' },
      { name: 'TypeScript', category: 'programming' },
      { name: 'मशीन लर्निंग', category: 'ai' },
    ],
    education: [],
    certificates: [],
    experience: [],
    projects: [],
    languages: [],
  },

  // Korean - Add your translations
  ko: {
    profile: '최신 웹 기술과 AI 애플리케이션 경험을 가진 소프트웨어 개발자.',
    about: {
      quote: '아이디어를 영향력 있는 기술 솔루션으로 전환.',
      specialties: ['React', 'Node.js', 'TypeScript', 'Python', '머신러닝', '클라우드 컴퓨팅'],
      highlights: {
        educationValue: '소프트웨어 공학',
        specializationValue: '풀스택 & AI',
        locationValue: '샌프란시스코, 미국',
        languagesValue: '스페인어, 영어',
      },
    },
    skills: [
      { name: 'React', category: 'programming' },
      { name: 'TypeScript', category: 'programming' },
      { name: '머신러닝', category: 'ai' },
    ],
    education: [],
    certificates: [],
    experience: [],
    projects: [],
    languages: [],
  },
};

// ============================================
// EXPORT FUNCTION - Do not modify
// ============================================
export function getCvData(language: LanguageCode = 'es'): CVData {
  const localized = cvByLanguage[language] ?? cvByLanguage.es;
  return {
    personal,
    ...localized,
  };
}

export const cvData: CVData = getCvData('es');

export type SkillCategory = 'ai' | 'programming' | 'industrial' | 'technology';
