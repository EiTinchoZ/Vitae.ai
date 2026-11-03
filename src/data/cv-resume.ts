// Texto del CV en PDF (/cv/print), redacción ATS. Sale de docs/2026-11-01-cv-texto.md con los cambios de Tín del
// 2026-11-02: sin cifras internas de Philips, sin business case, perfil global, 1,5 a 2 páginas con toda su historia.
// Hackathon del Municipio con los hechos exactos de agents.md (no "MUPA", no "en colaboración con la Alcaldía").
// El contacto sale de cv-data.ts. El teléfono no vive aquí: lo pone scripts/cv-pdf.mjs solo en el PDF privado.

export type ResumeEntry = { title: string; org: string; date: string; bullets?: string[]; note?: string };
export type ResumeLine = { label: string; text: string };

export type Resume = {
  role: string;
  qr: string;
  heads: Record<'profile' | 'wins' | 'work' | 'projects' | 'skills' | 'education' | 'certs' | 'languages', string>;
  profile: string;
  core: string[];
  wins: ResumeLine[];
  work: ResumeEntry[];
  projects: ResumeLine[];
  skills: ResumeLine[];
  education: ResumeEntry[];
  certs: ResumeEntry[];
  languages: string;
};

export const site = 'portfolio-eitinchos-projects.vercel.app';

export const resume: Record<'es' | 'en', Resume> = {
  es: {
    role: 'Ingeniería Industrial e Inteligencia Artificial aplicada',
    qr: 'CV interactivo',
    heads: {
      profile: 'Perfil profesional',
      wins: 'Logros destacados',
      work: 'Experiencia laboral',
      projects: 'Proyectos',
      skills: 'Habilidades',
      education: 'Educación',
      certs: 'Certificaciones',
      languages: 'Idiomas',
    },
    profile:
      'Estudio Ingeniería Industrial e Inteligencia Artificial al mismo tiempo, y me apasiona juntar las dos para resolver problemas reales de operación. En Philips construí el agente de Copilot Studio que usa mi equipo de compras; con PO Guru gané el AI Hackathon Philips LATAM 2026 y con Conecta Panamá, el hackathon ITSE x Municipio de Panamá. Aprendí inglés hasta nivel C2 por mi cuenta, y así aprendo cada herramienta nueva. Cierro las dos carreras en abril de 2027; después viene una maestría en IA.',
    core: [
      'Agentes de IA',
      'Copilot Studio',
      'Automatización de procesos',
      'Procurement (SAP, Ariba)',
      'Mejora de procesos y KPIs',
      'Power BI',
      'Python',
      'Liderazgo de equipos',
    ],
    wins: [
      {
        label: '1.er lugar, AI Hackathon Philips LATAM 2026',
        text: '(91 equipos, más de 340 participantes, 8 países). Como team lead de ProcureNation me encargué de la IA, la arquitectura y la construcción de PO Guru: un asistente en Copilot Studio, Teams y Outlook que revisa una solicitud de compra contra las reglas y la deja lista para que una persona la apruebe. Hicimos el MVP en 24 h, ganamos la semifinal de Panamá y, una semana después, la final regional.',
      },
      {
        label: 'Agente de IA para el proceso de compras de Philips.',
        text: 'Lo construí en Copilot Studio y hoy lo usamos en el equipo: responde las preguntas de buyers, solicitantes y demás stakeholders sobre toda la operación, con la fuente exacta del procedimiento.',
      },
      {
        label: '1.er lugar, Hackathon ITSE x Municipio de Panamá 2025',
        text: 'con Conecta Panamá, una super app ciudadana con IA. Diseñé la interfaz y armé el código; el Municipio se interesó en implementarla.',
      },
    ],
    work: [
      {
        title: 'Operational Procurement Intern',
        org: 'Philips · Panamá',
        date: 'Abr 2026 - Presente',
        bullets: [
          'Gestiono el ciclo de compra de punta a punta, de la aprobación en Ariba a la orden de compra en SAP, medido con cuatro KPIs de tiempo y calidad.',
          'Lideré el workstream que unificó SOP, work instructions y harmonized work instructions en una plataforma central para los buyers y sus gerentes. Ya está en pruebas con el equipo.',
          'Diseñé un dashboard operativo sin código (solicitudes, aprobaciones y KPIs) que reemplazó los reportes manuales del seguimiento diario.',
        ],
      },
      {
        title: 'Expositor y líder técnico',
        org: 'Expo Logística Panamá 2026 (ITSE)',
        date: 'Mar 2026',
        bullets: [
          'Presenté en vivo ante más de 100 empresas de transporte, carga y 3PL a TYR AI, copiloto de operaciones logísticas con LLaMA 3.3 70B y una base de conocimiento del Canal de Panamá, la Zona Libre e Incoterms 2020.',
        ],
      },
      {
        title: 'Data Science Intern',
        org: 'DETA · Panamá',
        date: 'Nov 2025 - Ene 2026',
        bullets: [
          'Analicé el mercado laboral tech para proyectos internos de una startup de data science y automatización, con scraping, procesamiento de datos, LLMs y prompt engineering.',
        ],
      },
    ],
    projects: [
      {
        label: 'TYR · ITSE (2025).',
        text: 'Asistente universitario con BERT ajustado que responde las dudas que antes llegaban por correo: 98,93 % de precisión en consultas institucionales. PWA en React y backend en FastAPI.',
      },
      {
        label: 'ALERTA-ED (2025).',
        text: 'Dashboard offline-first que propone un sistema predictivo para detectar el riesgo de deserción escolar en Panamá, con visualizaciones pensadas para docentes sin formación técnica.',
      },
      {
        label: 'tincho.ia (2026 - Presente).',
        text: 'Enseño Claude, Claude Code, Codex y agentes desde cero en TikTok e Instagram.',
      },
      {
        label: 'Vitae.ai (2025 - Presente).',
        text: 'Mi CV interactivo, con 3D y un asistente de IA que responde sobre mi perfil. Este PDF sale de los mismos datos.',
      },
    ],
    skills: [
      { label: 'IA aplicada:', text: 'agentes de IA, Microsoft Copilot, Copilot Studio, LLMs, RAG, NLP, fine-tuning (BERT), prompt engineering, Claude Code, Codex.' },
      { label: 'Ingeniería industrial:', text: 'gestión e investigación de operaciones, calidad, estudio del trabajo, KPIs y cuadro de mando, evaluación de proyectos, gestión del cambio.' },
      { label: 'Procurement:', text: 'SAP, Ariba, ciclo PR a PO, KPIs de compras, SOP y documentación de procesos.' },
      { label: 'Datos y herramientas:', text: 'Power BI, Excel avanzado, SharePoint, dashboards, scraping, PowerShell.' },
      { label: 'Desarrollo:', text: 'Python, FastAPI, TypeScript, React, Next.js.' },
    ],
    education: [
      {
        title: 'Licenciatura en Ingeniería Industrial',
        org: 'ADEN University',
        date: '2025 - Abr 2027 (estimado)',
        note: 'Incluye materias convalidadas de mi formación previa en ingeniería eléctrica y electromecánica.',
      },
      {
        title: 'Técnico Superior en Inteligencia Artificial',
        org: 'ITSE',
        date: '2025 - Abr 2027 (estimado)',
        note: 'Machine learning, deep learning, NLP, visión por computadora, ciencia de datos y ética de la IA.',
      },
      {
        title: 'Formación en Ingeniería Eléctrica y Electromecánica',
        org: 'Universidad Tecnológica de Panamá y USMA',
        date: '2018 - 2024',
        note: 'Base técnica convalidada.',
      },
    ],
    certs: [
      {
        title: 'Master en Inteligencia Artificial',
        org: 'Daxus Latam',
        date: '2025 - 2026',
      },
      {
        title: 'Programa Especializado en IA Aplicada a los Negocios',
        org: 'ADEN Business School',
        date: '2025',
      },
      { title: 'Claude Code in Action, Claude 101 y AI Fluency for Students', org: 'Anthropic', date: 'Mar 2026' },
      { title: 'Master en Python y Python Avanzado', org: 'Daxus Latam y Codecademy', date: '2025' },
      { title: 'Introducción a la IA Moderna y Operating Systems Basics', org: 'Cisco', date: '2025' },
      { title: 'Formación esencial en Power BI', org: 'LinkedIn Learning', date: 'Sep 2026' },
    ],
    languages: 'Español nativo · Inglés C2, Bilingual Status de Florida State University (aprendido por mi cuenta) · Portugués básico',
  },
  en: {
    role: 'Industrial Engineering and Applied AI',
    qr: 'Interactive CV',
    heads: {
      profile: 'Professional Summary',
      wins: 'Key Achievements',
      work: 'Work Experience',
      projects: 'Projects',
      skills: 'Skills',
      education: 'Education',
      certs: 'Certifications',
      languages: 'Languages',
    },
    profile:
      "I study Industrial Engineering and Artificial Intelligence at the same time, and I love combining them to solve real operations problems. At Philips I built the Copilot Studio agent my procurement team uses; with PO Guru I won the Philips LATAM AI Hackathon 2026, and with Conecta Panamá, the ITSE x Panama City Municipality hackathon. I taught myself English to C2, and that is how I pick up every new tool. I finish both degrees in April 2027; next comes a master's in AI.",
    core: [
      'AI agents',
      'Copilot Studio',
      'Process automation',
      'Procurement (SAP, Ariba)',
      'Process improvement and KPIs',
      'Power BI',
      'Python',
      'Team leadership',
    ],
    wins: [
      {
        label: '1st place, Philips LATAM AI Hackathon 2026',
        text: '(91 teams, 340+ participants, 8 countries). As team lead of ProcureNation I owned the AI, architecture and build of PO Guru: an assistant in Copilot Studio, Teams and Outlook that checks a purchase request against the rules and hands it over ready for a person to approve. We built the MVP in 24 hours, won the Panama semifinal and, a week later, the regional final.',
      },
      {
        label: 'AI agent for the Philips procurement process.',
        text: 'I built it in Copilot Studio and the team uses it today: it answers questions from buyers, requesters and other stakeholders about the whole operation, citing the exact procedure.',
      },
      {
        label: '1st place, ITSE x Panama City Municipality Hackathon 2025',
        text: 'with Conecta Panamá, an AI civic super app. I designed the interface and built the code; the Municipality took an interest in implementing it.',
      },
    ],
    work: [
      {
        title: 'Operational Procurement Intern',
        org: 'Philips · Panama',
        date: 'Apr 2026 - Present',
        bullets: [
          'Run the purchasing cycle end to end, from approval in Ariba to purchase order in SAP, measured against four time and quality KPIs.',
          'Led the workstream that unified the SOP, work instructions and harmonized work instructions into one central platform for buyers and their managers. Now in testing with the team.',
          'Designed a no-code operations dashboard (requisitions, approvals and KPIs) that replaced manual reports in daily follow-up.',
        ],
      },
      {
        title: 'Speaker and Technical Lead',
        org: 'Expo Logística Panamá 2026 (ITSE)',
        date: 'Mar 2026',
        bullets: [
          'Demoed TYR AI live to more than 100 transport, freight and 3PL companies: a logistics operations copilot with LLaMA 3.3 70B and a knowledge base on the Panama Canal, the Colón Free Zone and Incoterms 2020.',
        ],
      },
      {
        title: 'Data Science Intern',
        org: 'DETA · Panama',
        date: 'Nov 2025 - Jan 2026',
        bullets: [
          'Analyzed the tech job market for internal projects at a data science and automation startup, using scraping, data processing, LLMs and prompt engineering.',
        ],
      },
    ],
    projects: [
      {
        label: 'TYR · ITSE (2025).',
        text: 'University assistant with a fine-tuned BERT model that answers the questions students used to send by email: 98.93% accuracy on institutional queries. React PWA and FastAPI backend.',
      },
      {
        label: 'ALERTA-ED (2025).',
        text: 'Offline-first dashboard proposing a predictive system to detect school dropout risk in Panama, with visualizations built for teachers without a technical background.',
      },
      {
        label: 'tincho.ia (2026 - Present).',
        text: 'I teach Claude, Claude Code, Codex and agents from scratch on TikTok and Instagram.',
      },
      {
        label: 'Vitae.ai (2025 - Present).',
        text: 'My interactive CV, with 3D and an AI assistant that answers questions about my profile. This PDF comes from the same data.',
      },
    ],
    skills: [
      { label: 'Applied AI:', text: 'AI agents, Microsoft Copilot, Copilot Studio, LLMs, RAG, NLP, fine-tuning (BERT), prompt engineering, Claude Code, Codex.' },
      { label: 'Industrial engineering:', text: 'operations management and research, quality, work study, KPIs and balanced scorecard, project evaluation, change management.' },
      { label: 'Procurement:', text: 'SAP, Ariba, PR-to-PO cycle, procurement KPIs, SOP and process documentation.' },
      { label: 'Data and tools:', text: 'Power BI, advanced Excel, SharePoint, dashboards, scraping, PowerShell.' },
      { label: 'Development:', text: 'Python, FastAPI, TypeScript, React, Next.js.' },
    ],
    education: [
      {
        title: 'BSc in Industrial Engineering',
        org: 'ADEN University',
        date: '2025 - Apr 2027 (expected)',
        note: 'Includes transfer credits from my previous electrical and electromechanical engineering studies.',
      },
      {
        title: 'Higher Technical Degree in Artificial Intelligence',
        org: 'ITSE',
        date: '2025 - Apr 2027 (expected)',
        note: 'Machine learning, deep learning, NLP, computer vision, data science and AI ethics.',
      },
      {
        title: 'Electrical and Electromechanical Engineering coursework',
        org: 'Universidad Tecnológica de Panamá and USMA',
        date: '2018 - 2024',
        note: 'Technical foundation, credits transferred.',
      },
    ],
    certs: [
      {
        title: 'Master in Artificial Intelligence',
        org: 'Daxus Latam',
        date: '2025 - 2026',
      },
      {
        title: 'Specialized Program in Applied AI for Business',
        org: 'ADEN Business School',
        date: '2025',
      },
      { title: 'Claude Code in Action, Claude 101 and AI Fluency for Students', org: 'Anthropic', date: 'Mar 2026' },
      { title: 'Python Master and Advanced Python', org: 'Daxus Latam and Codecademy', date: '2025' },
      { title: 'Introduction to Modern AI and Operating Systems Basics', org: 'Cisco', date: '2025' },
      { title: 'Power BI Essential Training', org: 'LinkedIn Learning', date: 'Sep 2026' },
    ],
    languages: 'Spanish (native) · English C2, Florida State University Bilingual Status (self-taught) · Portuguese (basic)',
  },
};
