import type { CVData } from '@/types';
import type { LanguageCode } from '@/i18n';

const personal = {
  "name": "Martín Alejandro Bundy Muñoz",
  "fullName": "Martín Alejandro Bundy Muñoz",
  "location": "Panamá",
  "phone": "",
  "email": "mbundy15@gmail.com",
  "linkedin": "https://linkedin.com/in/martinbundy15",
  "github": "https://github.com/EiTinchoZ"
};

const cvByLanguage: Record<'es' | 'en', Omit<CVData, 'personal'>> = {
  "es": {
    "profile": "Estudio Ingeniería Industrial e Inteligencia Artificial. Soy Operational Procurement Intern en Philips Panamá desde el 21 de abril de 2026. Trabajo con procesos, automatización y agentes de IA. Lideré ProcureNation y la construcción digital de PO Guru, 1.er lugar en el AI Hackathon Philips LATAM 2026.",
    "about": {
      "quote": "Me apasionan la tecnología, la innovación digital y los videojuegos. Hoy armo agentes de IA.",
      "specialties": [
        "Machine Learning",
        "Deep Learning",
        "IA Generativa",
        "RAG",
        "Prompt Engineering",
        "Agentes Inteligentes",
        "Python",
        "Automatización"
      ],
      "image": "/images/profile/martin-speaking.jpg",
      "imageAlt": "Martín Bundy hablando en un evento",
      "highlights": {
        "educationValue": "Ingeniería Industrial + IA",
        "specializationValue": "Machine Learning e IA Generativa",
        "locationValue": "Panamá",
        "languagesValue": "Español, Inglés, Portugués"
      }
    },
    "skills": [
      {
        "name": "Machine Learning",
        "category": "ai"
      },
      {
        "name": "Deep Learning",
        "category": "ai"
      },
      {
        "name": "IA Generativa",
        "category": "ai"
      },
      {
        "name": "ChatGPT / Custom GPT",
        "category": "ai"
      },
      {
        "name": "RAG (Generación Aumentada por Recuperación)",
        "category": "ai"
      },
      {
        "name": "Prompt Engineering",
        "category": "ai"
      },
      {
        "name": "Agentes Inteligentes",
        "category": "ai"
      },
      {
        "name": "Automatización con IA",
        "category": "ai"
      },
      {
        "name": "Python",
        "category": "programming"
      },
      {
        "name": "Desarrollo de Scripts",
        "category": "programming"
      },
      {
        "name": "Análisis de Datos",
        "category": "programming"
      },
      {
        "name": "Implementación de Modelos IA",
        "category": "programming"
      },
      {
        "name": "Optimización de Procesos",
        "category": "industrial"
      },
      {
        "name": "Gestión de Proyectos",
        "category": "industrial"
      },
      {
        "name": "Control de Calidad",
        "category": "industrial"
      },
      {
        "name": "Mejora Continua",
        "category": "industrial"
      },
      {
        "name": "Análisis de Eficiencia",
        "category": "industrial"
      },
      {
        "name": "Windows / Linux / Ubuntu",
        "category": "technology"
      },
      {
        "name": "Automatización",
        "category": "technology"
      },
      {
        "name": "Diseño de Chatbots",
        "category": "technology"
      },
      {
        "name": "Microsoft Office",
        "category": "technology"
      }
    ],
    "education": [
      {
        "id": "edu-1",
        "title": "Bachiller en Ciencias y Letras",
        "institution": "Colegio San Agustín de Panamá",
        "startYear": null,
        "endYear": 2017,
        "status": "completed"
      },
      {
        "id": "edu-2",
        "title": "Técnico Superior en Inteligencia Artificial",
        "institution": "ITSE",
        "startYear": 2025,
        "endYear": "Abril 2027",
        "status": "in_progress",
        "description": "Presencial · 126 créditos."
      },
      {
        "id": "edu-3",
        "title": "Licenciatura en Ingeniería Industrial",
        "institution": "ADEN University",
        "startYear": 2025,
        "endYear": "Abril 2027",
        "status": "in_progress",
        "description": "En línea · materias hasta abril de 2027. Base técnica de Ingeniería Eléctrica y Electromecánica en UTP y USMA (2018–2024), convalidada."
      }
    ],
    "certificates": [
      {
        "id": "cert-master-ia",
        "name": "Master en Inteligencia Artificial (26 h, 4 módulos)",
        "institution": "Daxus Latam",
        "period": "Marzo 2026",
        "status": "completed",
        "description": "Programa de Daxus Latam: primeros pasos, aplicaciones, automatización y agentes, agentes avanzados; agentes y RAG.",
        "file": "/certificates/master-ia/master-inteligencia-artificial.pdf",
        "category": "master",
        "group": "Master en IA"
      },
      {
        "id": "cert-master-ia-1",
        "name": "Primeros pasos en IA",
        "institution": "Daxus Latam",
        "period": "Módulo 1",
        "status": "completed",
        "description": "Certificado del módulo de fundamentos y primeros pasos en inteligencia artificial.",
        "category": "master",
        "group": "Master en IA",
        "module": "Módulo 1",
        "file": "/certificates/master-ia/modules/primeros-pasos-ia.pdf"
      },
      {
        "id": "cert-master-ia-2",
        "name": "Aplicaciones con Inteligencia Artificial",
        "institution": "Daxus Latam",
        "period": "Módulo 2",
        "status": "completed",
        "description": "Certificado del módulo de aplicaciones prácticas de IA.",
        "category": "master",
        "group": "Master en IA",
        "module": "Módulo 2",
        "file": "/certificates/master-ia/modules/aplicaciones-ia.pdf"
      },
      {
        "id": "cert-master-ia-3",
        "name": "Automatización y agentes",
        "institution": "Daxus Latam",
        "period": "Módulo 3",
        "status": "completed",
        "description": "Certificado del módulo de automatización y agentes de IA.",
        "category": "master",
        "group": "Master en IA",
        "module": "Módulo 3",
        "file": "/certificates/master-ia/modules/automatizacion-agentes.pdf"
      },
      {
        "id": "cert-master-ia-4",
        "name": "Agentes de IA avanzados",
        "institution": "Daxus Latam",
        "period": "Módulo 4",
        "status": "completed",
        "description": "Certificado del módulo de agentes avanzados y estrategias de IA.",
        "category": "master",
        "group": "Master en IA",
        "module": "Módulo 4",
        "file": "/certificates/master-ia/modules/agentes-avanzados.pdf"
      },
      {
        "id": "cert-aden-program",
        "name": "Programa Especializado en Inteligencia Artificial Aplicada a los Negocios",
        "institution": "Aden Business School",
        "period": "2025",
        "status": "completed",
        "description": "Certificado final del programa especializado en IA aplicada a los negocios.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/programa-especializado.pdf"
      },
      {
        "id": "cert-aden-1",
        "name": "Fundamentos de IA en los negocios",
        "institution": "Aden Business School",
        "period": "Módulo",
        "status": "completed",
        "description": "Fundamentos y casos de uso de IA en entornos de negocio.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/fundamentos-ia-negocios.pdf"
      },
      {
        "id": "cert-aden-2",
        "name": "Aplicaciones y Oportunidades de la IA",
        "institution": "Aden Business School",
        "period": "Módulo",
        "status": "completed",
        "description": "Aplicaciones reales y oportunidades estratégicas de la IA.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/aplicaciones-oportunidades-ia.pdf"
      },
      {
        "id": "cert-aden-3",
        "name": "Accionando herramientas de IA",
        "institution": "Aden Business School",
        "period": "Módulo",
        "status": "completed",
        "description": "Uso práctico de herramientas de IA para productividad y análisis.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/accionando-herramientas-ia.pdf"
      },
      {
        "id": "cert-aden-4",
        "name": "Inteligencia Artificial Generativa",
        "institution": "Aden Business School",
        "period": "Módulo",
        "status": "completed",
        "description": "Fundamentos y aplicaciones de IA generativa.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/ia-generativa.pdf"
      },
      {
        "id": "cert-aden-5",
        "name": "IA en Marketing",
        "institution": "Aden Business School",
        "period": "Módulo",
        "status": "completed",
        "description": "Estrategias y automatización de marketing con IA.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/ia-marketing.pdf"
      },
      {
        "id": "cert-aden-6",
        "name": "IA en Salud y Pharma",
        "institution": "Aden Business School",
        "period": "Módulo",
        "status": "completed",
        "description": "Aplicaciones de IA en salud, farmacéutica y análisis clínico.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/ia-salud-pharma.pdf"
      },
      {
        "id": "cert-aden-7",
        "name": "Taller de aprendizaje profundo (Deep Learning)",
        "institution": "Aden Business School",
        "period": "Módulo",
        "status": "completed",
        "description": "Taller práctico de deep learning y casos aplicados.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/taller-aprendizaje-profundo.pdf"
      },
      {
        "id": "cert-fsu",
        "name": "Bilingual Status C2 (Spanish/English)",
        "institution": "Florida State University",
        "period": "Enero 2026",
        "status": "completed",
        "description": "Certificación oficial de dominio completo del inglés (C2).",
        "category": "languages",
        "file": "/certificates/fsu/bilingual-status.pdf"
      },
      {
        "id": "cert-cisco-os",
        "name": "Operating Systems Basics",
        "institution": "Cisco",
        "period": "Mayo 2025",
        "status": "completed",
        "description": "Conceptos básicos de sistemas operativos para computadoras y dispositivos móviles.",
        "category": "technical",
        "file": "/certificates/cisco/operating-systems-basics.pdf"
      },
      {
        "id": "cert-cisco-ai",
        "name": "Introducción a la IA Moderna",
        "institution": "Cisco",
        "period": "Noviembre 2025",
        "status": "completed",
        "description": "Uso de IA en la vida diaria: prompts, visión por computadora y traducción automática.",
        "category": "technical",
        "file": "/certificates/cisco/introduccion-ia-moderna.pdf"
      },
      {
        "id": "cert-python-master",
        "name": "Master en Python y Python Avanzado",
        "institution": "Daxus Latam & Codecademy",
        "period": "2025",
        "status": "in_progress",
        "description": "Dominio avanzado de Python para soluciones de IA, automatización y análisis de datos.",
        "category": "programming"
      },
      {
        "id": "cert-anthropic-fluency",
        "name": "AI Fluency for Students",
        "institution": "Anthropic",
        "period": "Marzo 2026",
        "status": "completed",
        "description": "Programa oficial de Anthropic para universitarios sobre fluencia y uso responsable de IA.",
        "category": "anthropic",
        "file": "/certificates/anthropic/ai-fluency-students.pdf"
      },
      {
        "id": "cert-anthropic-101",
        "name": "Claude 101",
        "institution": "Anthropic",
        "period": "Marzo 2026",
        "status": "completed",
        "description": "Curso oficial de Anthropic sobre fundamentos, capacidades y uso profesional de Claude.",
        "category": "anthropic",
        "file": "/certificates/anthropic/claude-101.pdf"
      },
      {
        "id": "cert-anthropic-claude-code",
        "name": "Claude Code in Action",
        "institution": "Anthropic",
        "period": "2 Marzo, 2026",
        "status": "completed",
        "description": "Certificación oficial de Anthropic en uso avanzado de Claude Code para desarrollo de software asistido por IA.",
        "category": "anthropic",
        "file": "/certificates/anthropic/claude-code-in-action.pdf"
      },
      {
        "id": "cert-powerbi",
        "name": "Formación esencial en Power BI",
        "institution": "LinkedIn Learning",
        "period": "Septiembre 2026",
        "status": "completed",
        "description": "Power BI esencial.",
        "category": "technical"
      }
    ],
    "experience": [
      {
        "id": "exp-philips",
        "company": "Philips Panamá",
        "position": "Operational Procurement Intern",
        "location": "Panamá",
        "startPeriod": "21 de abril de 2026",
        "endPeriod": "Presente",
        "responsibilities": [
          "Sigo cada solicitud hasta la orden de compra, con cuatro KPIs. Armé un dashboard sin código y se acabaron los reportes a mano.",
          "Lideré la plataforma que junta SOP, work instructions y harmonized work instructions, para que el equipo encuentre todo en un solo sitio. Está en pruebas.",
          "Armé un agente en Microsoft Copilot que guía a compradores y solicitantes y cita la fuente exacta.",
          "Lideré ProcureNation y fui responsable de IA, arquitectura y construcción de PO Guru: 1.er lugar, AI Hackathon Philips LATAM 2026. Procurement por sorteo, MVP en 24 h, primer lugar en la semifinal de Panamá y, una semana después, primer lugar en la final regional. 91 equipos en el concurso."
        ],
        "skills": [
          "SAP",
          "SharePoint",
          "Microsoft Copilot",
          "Copilot Studio",
          "Teams",
          "Outlook",
          "Excel",
          "Power BI"
        ]
      },
      {
        "id": "exp-expologistica",
        "company": "Expo Logística Panamá 2026 — ITSE",
        "position": "Expositor & Líder Técnico · TYR AI",
        "location": "Ciudad de Panamá, Panamá",
        "startPeriod": "Marzo 2026",
        "endPeriod": "Marzo 2026",
        "duration": "3 días (10–12 marzo 2026)",
        "responsibilities": [
          "Representé al ITSE en Expo Logística Panamá 2026 — el evento más importante del sector logístico de Centroamérica — presentando TYR AI: copiloto de inteligencia operativa para la industria logística panameña.",
          "Desarrollé y desplegué TYR AI en producción: plataforma que combina LLaMA 3.3 70B (Groq), NER especializado en logística, dashboard Kanban con 40 envíos ficticios y base de conocimiento del Canal de Panamá, ZLC e Incoterms 2020.",
          "Demostré el sistema en vivo ante más de 100 empresas del sector — transporte multimodal, agentes de carga y operadores 3PL — validando la propuesta ante actores reales de la industria."
        ],
        "skills": [
          "React 19",
          "TypeScript",
          "Groq AI",
          "LLaMA 3.3",
          "NER",
          "FastAPI",
          "Python",
          "Logística",
          "Demo en Vivo"
        ]
      },
      {
        "id": "exp-tyr",
        "company": "TYR — ITSE",
        "position": "Desarrollador de IA / NLP · Asistente Virtual Universitario",
        "location": "Panamá",
        "startPeriod": "Junio 2025",
        "endPeriod": "Diciembre 2025",
        "duration": "6 meses",
        "responsibilities": [
          "Construí TYR, el primer asistente virtual inteligente del ITSE, logrando 98.93% de precisión con un modelo BERT fine-tuneado sobre datos reales de la institución.",
          "Diseñé la arquitectura completa: frontend React como PWA instalable + backend FastAPI con procesamiento NLP en tiempo real, sin necesidad de app store.",
          "Resolví un problema cotidiano real: estudiantes sin acceso rápido a información académica. Mi primera inmersión profunda en el ciclo completo de ML: datos propios → entrenamiento → evaluación → producción.",
          "Aprendí que los mejores proyectos de IA no nacen de datasets perfectos sino de frustraciones reales —y que 98.93% de precisión empieza por hacerse las preguntas correctas."
        ],
        "skills": [
          "Python",
          "BERT",
          "FastAPI",
          "React",
          "PWA",
          "NLP",
          "Machine Learning",
          "Fine-tuning"
        ]
      },
      {
        "id": "exp-sena",
        "company": "ALERTA-ED (SENA)",
        "position": "Desarrollador de IA · Prevención de Deserción Escolar",
        "location": "Remoto, Panamá",
        "startPeriod": "Agosto 2025",
        "endPeriod": "Noviembre 2025",
        "duration": "3 meses",
        "responsibilities": [
          "Construí ALERTA-ED, un dashboard interactivo para detectar y prevenir deserción escolar en Panamá con modelos predictivos de IA, abordando uno de los problemas sociales más urgentes de Latinoamérica.",
          "Diseñé funcionalidad completamente offline-first para garantizar acceso en zonas con conectividad limitada — un reto técnico que me enseñó a priorizar al usuario real sobre la demo perfecta.",
          "Desarrollé visualizaciones de datos accionables para educadores sin formación técnica: aprendí que la IA más valiosa no es la más compleja, sino la más comprensible y útil para quien la usa.",
          "Proyecto que solidificó mi convicción: la IA tiene más impacto cuando resuelve problemas de personas reales, no solo métricas de benchmark."
        ],
        "skills": [
          "Vite",
          "React 18",
          "TypeScript",
          "Framer Motion",
          "Visualización de Datos",
          "Offline-first",
          "Impacto Social"
        ]
      },
      {
        "id": "exp-tinio",
        "company": "Tin.io",
        "position": "AI Product Builder · Dashboard de Creación de Contenido",
        "location": "Remoto",
        "startPeriod": "Julio 2025",
        "endPeriod": "Febrero 2026",
        "duration": "~8 meses",
        "responsibilities": [
          "Exploré la intersección entre creatividad y automatización construyendo Tin.io: un dashboard para creación de contenido impulsado por IA, mi laboratorio personal para experimentar sin restricciones.",
          "Desarrollé pipelines de generación de contenido e iteré sobre UX orientada a productividad, descubriendo que las mejores interfaces de IA son las que desaparecen de la vista del usuario.",
          "Proyecto de exploración libre donde aprendí a construir rápido, fallar rápido y rediseñar sin miedo — el mindset de builder autodidacta que llevo a cada nuevo proyecto.",
          "Fue donde afilé mi stack completo (TypeScript, Tailwind, APIs de IA) y entendí la diferencia real entre un proyecto personal y un producto que otros querrían usar."
        ],
        "skills": [
          "TypeScript",
          "React",
          "Tailwind CSS",
          "AI APIs",
          "UX Design",
          "Automatización de Contenido"
        ]
      },
      {
        "id": "exp-deta",
        "company": "DETA",
        "position": "Pasantía en Data Science",
        "location": "Remoto",
        "startPeriod": "Noviembre 2025",
        "endPeriod": "Enero 2026",
        "duration": "3 meses",
        "responsibilities": [
          "Startup panameña especializada en Data Science y Automatización.",
          "Aprendizaje intensivo en LLM, IA, Data Science y Data Scraping.",
          "Desarrollo de habilidades en prompt engineering y análisis de datos.",
          "Análisis del mercado laboral tecnológico para proyectos internos.",
          "Mejora de habilidades de programación aplicadas a soluciones con IA."
        ],
        "skills": [
          "Data Science",
          "LLM",
          "Prompt Engineering",
          "Data Scraping",
          "Python"
        ]
      }
    ],
    "projects": [
      {
        "id": "project-poguru",
        "name": "PO Guru",
        "year": 2026,
        "type": "Proyecto",
        "shortDescription": "Revisa una solicitud de compra contra las reglas, marca lo que falta y la deja lista para que una persona la apruebe. Vive en Teams y Outlook. El agente hace el recorrido; las personas deciden. Equipo ProcureNation, con Martín como líder y responsable de IA, arquitectura y construcción.",
        "longDescription": "Revisa una solicitud de compra contra las reglas, marca lo que falta y la deja lista para que una persona la apruebe. Vive en Teams y Outlook. El agente hace el recorrido; las personas deciden. Equipo ProcureNation, con Martín como líder y responsable de IA, arquitectura y construcción.",
        "features": [
          "Cotización en un chat de Teams",
          "Revisa 10 puntos y pregunta si falta algo",
          "Sello: lista para revisión; no aprueba nada solo",
          "Resumen para compras con los puntos que hay que mirar",
          "Seguimiento de la aprobación y registro en una lista compartida"
        ],
        "technologies": [
          "Copilot Studio",
          "Teams",
          "Outlook",
          "Excel"
        ],
        "event": "AI Hackathon Philips LATAM 2026",
        "result": "1.er lugar regional y 1.er lugar en Panamá",
        "isHighlighted": true
      },
      {
        "id": "project-1",
        "name": "Conecta Panamá",
        "type": "Hackathon Winner",
        "event": "Hackathon ITSE x Municipio de Panamá 2025",
        "year": 2025,
        "result": "Primer Lugar",
        "shortDescription": "Super app ciudadana que conecta panameños digitalmente con información, educación, negocios y servicios esenciales",
        "longDescription": "Super app ciudadana con IA, hecha en dos semanas. 1.er lugar en la competencia del Municipio de Panamá, interna y presencial en ITSE. Me encargué del diseño de interfaz y el ensamble del código.",
        "features": [
          "Asistente de IA con recomendaciones personalizadas",
          "Búsqueda inteligente de cursos y eventos",
          "Micro-aprendizaje offline",
          "Comercio local geo-referenciado",
          "Acceso a contenido educativo verificado",
          "Directorio de farmacias y medicinas"
        ],
        "technologies": [
          "IA",
          "Machine Learning",
          "Geolocalización",
          "Recomendación personalizada",
          "React",
          "Node.js"
        ],
        "impact": "Democratiza acceso a educación e impulsa economía comunitaria en Panamá",
        "isHighlighted": false
      },
      {
        "id": "project-tyr",
        "name": "TYR",
        "year": 2025,
        "type": "Proyecto",
        "shortDescription": "Asistente universitario con un modelo BERT ajustado. Responde las dudas que antes llegaban por correo.",
        "longDescription": "Asistente universitario con un modelo BERT ajustado. Responde las dudas que antes llegaban por correo.",
        "features": [],
        "technologies": [
          "Python",
          "BERT",
          "FastAPI"
        ],
        "result": "98.93%"
      },
      {
        "id": "project-tyr-ai",
        "name": "TYR AI",
        "type": "Plataforma de IA Logística",
        "year": 2026,
        "shortDescription": "Copiloto de inteligencia operativa para la industria logística panameña — presentado en Expo Logística Panamá 2026.",
        "longDescription": "TYR AI transforma operaciones logísticas basadas en Excel y WhatsApp en un sistema conversacional inteligente. Combina LLaMA 3.3 70B (Groq) con NER especializado en logística, un dashboard Kanban para gestión de envíos, y una base de conocimiento del Canal de Panamá, Zona Libre de Colón, puertos, Incoterms 2020 y documentos aduanales. Presentado en Expo Logística Panamá 2026 ante más de 100 empresas del sector.",
        "features": [
          "Chat inteligente con NER logístico (extrae BL, puertos, incoterms, navieras)",
          "Dashboard Kanban con 6 etapas y 40 envíos de demo",
          "KPIs en tiempo real: OTD rate, envíos activos, retrasos, riesgo alto",
          "Base de conocimiento del Canal de Panamá, ZLC e Incoterms 2020",
          "Fallback offline con base de conocimiento local integrada",
          "Gemelo digital de la Vía Centenario incluido"
        ],
        "technologies": [
          "React 19",
          "TypeScript",
          "Groq AI",
          "LLaMA 3.3 70B",
          "FastAPI",
          "Python",
          "NER",
          "Zustand",
          "Recharts"
        ],
        "demoUrl": "https://tyr-logistics-os.vercel.app/",
        "images": [
          "/images/expologistica/martin-tyr-demo.jpg",
          "/images/expologistica/deltawaves-team.jpg",
          "/images/expologistica/martin-speaking-1.jpg"
        ],
        "isHighlighted": false
      },
      {
        "id": "project-tincho-ia",
        "name": "tincho.ia",
        "year": 2026,
        "type": "Proyecto",
        "shortDescription": "Proyecto propio de divulgación de IA en etapa temprana. Enseño a usar Claude, Claude Code, Codex y agentes desde cero, en TikTok e Instagram.",
        "longDescription": "Proyecto propio de divulgación de IA en etapa temprana. Enseño a usar Claude, Claude Code, Codex y agentes desde cero, en TikTok e Instagram.",
        "features": [],
        "technologies": [
          "Claude",
          "Claude Code",
          "Codex"
        ],
        "demoUrl": "https://tincho-ia.pages.dev"
      },
      {
        "id": "project-2",
        "name": "Vitae.ai",
        "type": "Plataforma de CV con IA",
        "year": 2026,
        "shortDescription": "Plataforma de CV digital con IA para presentar experiencia, educación y habilidades en un formato moderno y visual.",
        "longDescription": "Mi hoja de vida en español e inglés, con un asistente que contesta preguntas sobre mí.",
        "features": [
          "CV digital interactivo",
          "Español e inglés",
          "Asistente de IA"
        ],
        "technologies": [
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
          "Groq AI"
        ],
        "githubUrl": "https://github.com/EiTinchoZ/Vitae.ai",
        "images": [
          "/brand/vitae-logo.webp"
        ]
      },
      {
        "id": "project-sena",
        "name": "SENA",
        "type": "Interactive Dashboard",
        "year": 2025,
        "shortDescription": "An interactive dashboard built as an academic/professional pitch for ALERTA-ED: a proposed predictive system that detects school dropout risk before it becomes irreversible.",
        "longDescription": "An interactive dashboard built as an academic/professional pitch for ALERTA-ED: a proposed predictive system that detects school dropout risk before it becomes irreversible.\n\nThe experience emulates a real product: AI onboarding, data visualizations, business narrative, and an admin panel with local persistence.",
        "features": [
          "AI onboarding experience",
          "Real-time data visualizations",
          "Business narrative sections",
          "Admin panel with local persistence"
        ],
        "technologies": [
          "Vite",
          "React 18",
          "TypeScript",
          "Tailwind",
          "Framer Motion"
        ],
        "githubUrl": "https://github.com/EiTinchoZ/SENA",
        "images": [
          "/images/projects/cover-sena-alertaed.png"
        ]
      }
    ],
    "languages": [
      {
        "id": "lang-1",
        "name": "Español",
        "level": "Nativo",
        "description": "Lengua materna"
      },
      {
        "id": "lang-2",
        "name": "Inglés",
        "level": "C2 Completo",
        "certification": "Bilingual Status - Florida State University",
        "description": "Dominio completo en expresión oral, escrita, lectura y comprensión"
      },
      {
        "id": "lang-3",
        "name": "Portugués",
        "level": "Básico",
        "description": "Actualmente en aprendizaje con objetivo de alcanzar nivel B2"
      }
    ]
  },
  "en": {
    "profile": "I study Industrial Engineering and Artificial Intelligence. I have been an Operational Procurement Intern at Philips Panama since April 21, 2026. I work with processes, automation and AI agents. I led ProcureNation and the digital development of PO Guru, which won 1st place at the AI Hackathon Philips LATAM 2026.",
    "about": {
      "quote": "I am passionate about technology, digital innovation and video games. Today I build AI agents.",
      "specialties": [
        "Machine Learning",
        "Deep Learning",
        "Generative AI",
        "RAG",
        "Prompt Engineering",
        "Intelligent Agents",
        "Python",
        "Automation"
      ],
      "image": "/images/profile/martin-speaking.jpg",
      "imageAlt": "Martin Bundy speaking at an event",
      "highlights": {
        "educationValue": "Industrial Engineering + AI",
        "specializationValue": "Machine Learning & Generative AI",
        "locationValue": "Panama",
        "languagesValue": "Spanish, English, Portuguese"
      }
    },
    "skills": [
      {
        "name": "Machine Learning",
        "category": "ai"
      },
      {
        "name": "Deep Learning",
        "category": "ai"
      },
      {
        "name": "Generative AI",
        "category": "ai"
      },
      {
        "name": "ChatGPT / Custom GPT",
        "category": "ai"
      },
      {
        "name": "RAG (Retrieval-Augmented Generation)",
        "category": "ai"
      },
      {
        "name": "Prompt Engineering",
        "category": "ai"
      },
      {
        "name": "Intelligent Agents",
        "category": "ai"
      },
      {
        "name": "AI Automation",
        "category": "ai"
      },
      {
        "name": "Python",
        "category": "programming"
      },
      {
        "name": "Script Development",
        "category": "programming"
      },
      {
        "name": "Data Analysis",
        "category": "programming"
      },
      {
        "name": "AI Model Implementation",
        "category": "programming"
      },
      {
        "name": "Process Optimization",
        "category": "industrial"
      },
      {
        "name": "Project Management",
        "category": "industrial"
      },
      {
        "name": "Quality Control",
        "category": "industrial"
      },
      {
        "name": "Continuous Improvement",
        "category": "industrial"
      },
      {
        "name": "Efficiency Analysis",
        "category": "industrial"
      },
      {
        "name": "Windows / Linux / Ubuntu",
        "category": "technology"
      },
      {
        "name": "Automation",
        "category": "technology"
      },
      {
        "name": "Chatbot Design",
        "category": "technology"
      },
      {
        "name": "Microsoft Office",
        "category": "technology"
      }
    ],
    "education": [
      {
        "id": "edu-1",
        "title": "Bachiller en Ciencias y Letras",
        "institution": "Colegio San Agustín de Panamá",
        "startYear": null,
        "endYear": 2017,
        "status": "completed"
      },
      {
        "id": "edu-2",
        "title": "Técnico Superior en Inteligencia Artificial",
        "institution": "ITSE",
        "startYear": 2025,
        "endYear": "April 2027",
        "status": "in_progress",
        "description": "On campus · 126 credits."
      },
      {
        "id": "edu-3",
        "title": "Licenciatura en Ingeniería Industrial",
        "institution": "ADEN University",
        "startYear": 2025,
        "endYear": "April 2027",
        "status": "in_progress",
        "description": "Online · coursework through April 2027. Prior technical studies in Electrical and Electromechanical Engineering at UTP and USMA (2018–2024), with credits transferred."
      }
    ],
    "certificates": [
      {
        "id": "cert-master-ia",
        "name": "Master en Inteligencia Artificial (26 h, 4 módulos)",
        "institution": "Daxus Latam",
        "period": "March 2026",
        "status": "completed",
        "description": "Daxus Latam program: first steps, applications, automation and agents, advanced agents; agents and RAG.",
        "file": "/certificates/master-ia/master-inteligencia-artificial.pdf",
        "category": "master",
        "group": "Master en IA"
      },
      {
        "id": "cert-master-ia-1",
        "name": "Primeros pasos en IA",
        "institution": "Daxus Latam",
        "period": "Module 1",
        "status": "completed",
        "description": "Module certificate on AI fundamentals and first steps.",
        "category": "master",
        "group": "Master en IA",
        "module": "Module 1",
        "file": "/certificates/master-ia/modules/primeros-pasos-ia.pdf"
      },
      {
        "id": "cert-master-ia-2",
        "name": "Aplicaciones con Inteligencia Artificial",
        "institution": "Daxus Latam",
        "period": "Module 2",
        "status": "completed",
        "description": "Module certificate on practical AI applications.",
        "category": "master",
        "group": "Master en IA",
        "module": "Module 2",
        "file": "/certificates/master-ia/modules/aplicaciones-ia.pdf"
      },
      {
        "id": "cert-master-ia-3",
        "name": "Automatización y agentes",
        "institution": "Daxus Latam",
        "period": "Module 3",
        "status": "completed",
        "description": "Module certificate on automation and AI agents.",
        "category": "master",
        "group": "Master en IA",
        "module": "Module 3",
        "file": "/certificates/master-ia/modules/automatizacion-agentes.pdf"
      },
      {
        "id": "cert-master-ia-4",
        "name": "Agentes de IA avanzados",
        "institution": "Daxus Latam",
        "period": "Module 4",
        "status": "completed",
        "description": "Module certificate on advanced AI agents and strategies.",
        "category": "master",
        "group": "Master en IA",
        "module": "Module 4",
        "file": "/certificates/master-ia/modules/agentes-avanzados.pdf"
      },
      {
        "id": "cert-aden-program",
        "name": "Programa Especializado en Inteligencia Artificial Aplicada a los Negocios",
        "institution": "Aden Business School",
        "period": "2025",
        "status": "completed",
        "description": "Final certificate for the AI in Business specialization.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/programa-especializado.pdf"
      },
      {
        "id": "cert-aden-1",
        "name": "Fundamentos de IA en los negocios",
        "institution": "Aden Business School",
        "period": "Module",
        "status": "completed",
        "description": "Foundations and business use cases for AI.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/fundamentos-ia-negocios.pdf"
      },
      {
        "id": "cert-aden-2",
        "name": "Aplicaciones y Oportunidades de la IA",
        "institution": "Aden Business School",
        "period": "Module",
        "status": "completed",
        "description": "Real-world AI applications and strategic opportunities.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/aplicaciones-oportunidades-ia.pdf"
      },
      {
        "id": "cert-aden-3",
        "name": "Accionando herramientas de IA",
        "institution": "Aden Business School",
        "period": "Module",
        "status": "completed",
        "description": "Hands-on AI tools for productivity and analysis.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/accionando-herramientas-ia.pdf"
      },
      {
        "id": "cert-aden-4",
        "name": "Inteligencia Artificial Generativa",
        "institution": "Aden Business School",
        "period": "Module",
        "status": "completed",
        "description": "Foundations and applications of generative AI.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/ia-generativa.pdf"
      },
      {
        "id": "cert-aden-5",
        "name": "IA en Marketing",
        "institution": "Aden Business School",
        "period": "Module",
        "status": "completed",
        "description": "Marketing strategies and automation with AI.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/ia-marketing.pdf"
      },
      {
        "id": "cert-aden-6",
        "name": "IA en Salud y Pharma",
        "institution": "Aden Business School",
        "period": "Module",
        "status": "completed",
        "description": "AI applications in health and pharma.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/ia-salud-pharma.pdf"
      },
      {
        "id": "cert-aden-7",
        "name": "Taller de aprendizaje profundo (Deep Learning)",
        "institution": "Aden Business School",
        "period": "Module",
        "status": "completed",
        "description": "Deep learning workshop with applied cases.",
        "category": "specialization",
        "group": "IA aplicada a los negocios",
        "file": "/certificates/aden-ai-business/taller-aprendizaje-profundo.pdf"
      },
      {
        "id": "cert-fsu",
        "name": "Bilingual Status C2 (Spanish/English)",
        "institution": "Florida State University",
        "period": "Enero 2026",
        "status": "completed",
        "description": "Official certification of full English proficiency (C2).",
        "category": "languages",
        "file": "/certificates/fsu/bilingual-status.pdf"
      },
      {
        "id": "cert-cisco-os",
        "name": "Operating Systems Basics",
        "institution": "Cisco",
        "period": "Mayo 2025",
        "status": "completed",
        "description": "Operating systems fundamentals for computers and mobile devices.",
        "category": "technical",
        "file": "/certificates/cisco/operating-systems-basics.pdf"
      },
      {
        "id": "cert-cisco-ai",
        "name": "Introducción a la IA Moderna",
        "institution": "Cisco",
        "period": "Noviembre 2025",
        "status": "completed",
        "description": "Modern AI in everyday life: prompts, computer vision, and translation.",
        "category": "technical",
        "file": "/certificates/cisco/introduccion-ia-moderna.pdf"
      },
      {
        "id": "cert-python-master",
        "name": "Master en Python y Python Avanzado",
        "institution": "Daxus Latam & Codecademy",
        "period": "2025",
        "status": "in_progress",
        "description": "Advanced Python mastery for AI solutions, automation, and data analysis.",
        "category": "programming"
      },
      {
        "id": "cert-anthropic-fluency",
        "name": "AI Fluency for Students",
        "institution": "Anthropic",
        "period": "March 2026",
        "status": "completed",
        "description": "Official Anthropic program for university students on AI fluency and responsible use.",
        "category": "anthropic",
        "file": "/certificates/anthropic/ai-fluency-students.pdf"
      },
      {
        "id": "cert-anthropic-101",
        "name": "Claude 101",
        "institution": "Anthropic",
        "period": "March 2026",
        "status": "completed",
        "description": "Official Anthropic course on Claude fundamentals, capabilities, and professional use.",
        "category": "anthropic",
        "file": "/certificates/anthropic/claude-101.pdf"
      },
      {
        "id": "cert-anthropic-claude-code",
        "name": "Claude Code in Action",
        "institution": "Anthropic",
        "period": "March 2, 2026",
        "status": "completed",
        "description": "Official Anthropic certification in advanced use of Claude Code for AI-assisted software development.",
        "category": "anthropic",
        "file": "/certificates/anthropic/claude-code-in-action.pdf"
      },
      {
        "id": "cert-powerbi",
        "name": "Formación esencial en Power BI",
        "institution": "LinkedIn Learning",
        "period": "September 2026",
        "status": "completed",
        "description": "Power BI essentials.",
        "category": "technical"
      }
    ],
    "experience": [
      {
        "id": "exp-philips",
        "company": "Philips Panamá",
        "position": "Operational Procurement Intern",
        "location": "Panama",
        "startPeriod": "April 21, 2026",
        "endPeriod": "Present",
        "responsibilities": [
          "I follow each request through to the purchase order, using four KPIs. I built a no-code dashboard that replaced manual reports.",
          "I led the platform that brings together SOP, work instructions and harmonized work instructions so the team can find everything in one place. It is in testing.",
          "I built an agent in Microsoft Copilot that guides purchasing staff and requesters and cites the exact source.",
          "I led ProcureNation and was responsible for AI, architecture and development of PO Guru: 1st place, AI Hackathon Philips LATAM 2026. Procurement was randomly assigned, the MVP was built in 24 h, and we won the Panama semifinal and, one week later, the regional final. There were 91 teams in the competition."
        ],
        "skills": [
          "SAP",
          "SharePoint",
          "Microsoft Copilot",
          "Copilot Studio",
          "Teams",
          "Outlook",
          "Excel",
          "Power BI"
        ]
      },
      {
        "id": "exp-expologistica",
        "company": "Expo Logística Panamá 2026 — ITSE",
        "position": "Exhibitor & Technical Lead · TYR AI",
        "location": "Panama City, Panama",
        "startPeriod": "March 2026",
        "endPeriod": "March 2026",
        "duration": "3 days (March 10–12, 2026)",
        "responsibilities": [
          "Represented ITSE at Expo Logística Panamá 2026 — Central America's most important logistics sector event — showcasing TYR AI: an operational intelligence copilot for Panama's logistics industry.",
          "Developed and deployed TYR AI to production: combining LLaMA 3.3 70B (Groq), logistics-specialized NER, a Kanban dashboard tracking 40 demo shipments, and a knowledge base covering the Panama Canal, Colón Free Zone, and Incoterms 2020.",
          "Demonstrated the live system to 100+ companies across multimodal transport, freight forwarding, and 3PL operations — validating the value proposition with real industry players."
        ],
        "skills": [
          "React 19",
          "TypeScript",
          "Groq AI",
          "LLaMA 3.3",
          "NER",
          "FastAPI",
          "Python",
          "Logistics",
          "Live Demo"
        ]
      },
      {
        "id": "exp-tyr",
        "company": "TYR — ITSE",
        "position": "AI / NLP Developer · University Virtual Assistant",
        "location": "Panama",
        "startPeriod": "June 2025",
        "endPeriod": "December 2025",
        "duration": "6 months",
        "responsibilities": [
          "Built TYR, ITSE's first intelligent virtual assistant, achieving 98.93% accuracy using a fine-tuned BERT model trained on real institutional data.",
          "Designed the full architecture: installable React PWA (no app store needed) + FastAPI backend with real-time NLP processing for instant responses.",
          "Solved a concrete everyday problem: students lacking quick access to academic information. My first deep dive into the full ML cycle: custom data collection → training → evaluation → production deployment.",
          "Learned that the best AI projects are born from real frustrations — and that 98.93% accuracy starts with asking the right questions."
        ],
        "skills": [
          "Python",
          "BERT",
          "FastAPI",
          "React",
          "PWA",
          "NLP",
          "Machine Learning",
          "Fine-tuning"
        ]
      },
      {
        "id": "exp-sena",
        "company": "ALERTA-ED (SENA)",
        "position": "AI Developer · School Dropout Prevention",
        "location": "Remote, Panama",
        "startPeriod": "August 2025",
        "endPeriod": "November 2025",
        "duration": "3 months",
        "responsibilities": [
          "Built ALERTA-ED, an interactive dashboard to detect and prevent school dropout in Panama using predictive AI models, tackling one of Latin America's most urgent social problems.",
          "Designed fully offline-first functionality to ensure access in low-connectivity zones — a technical challenge that taught me to prioritize the real user over the perfect demo.",
          "Built actionable data visualizations for educators with no technical background: learned that the most valuable AI is not the most complex, but the most understandable and useful.",
          "Project that solidified my conviction: AI has more impact when it solves real people's real problems, not just benchmark metrics."
        ],
        "skills": [
          "Vite",
          "React 18",
          "TypeScript",
          "Framer Motion",
          "Data Visualization",
          "Offline-first",
          "Social Impact"
        ]
      },
      {
        "id": "exp-tinio",
        "company": "Tin.io",
        "position": "AI Product Builder · Content Creation Dashboard",
        "location": "Remote",
        "startPeriod": "July 2025",
        "endPeriod": "February 2026",
        "duration": "~8 months",
        "responsibilities": [
          "Explored the intersection of creativity and automation by building Tin.io: an AI-powered content creation dashboard — my personal lab for experimenting without constraints.",
          "Built content generation pipelines and iterated on productivity-focused UX, discovering that the best AI interfaces are the ones that get out of the user's way.",
          "A free exploration project that taught me to build fast, fail fast, and redesign fearlessly — the self-taught builder mindset I bring to every new project.",
          "Where I sharpened my full stack (TypeScript, Tailwind, AI APIs) and understood the real difference between a personal project and a product others would actually want to use."
        ],
        "skills": [
          "TypeScript",
          "React",
          "Tailwind CSS",
          "AI APIs",
          "UX Design",
          "Content Automation"
        ]
      },
      {
        "id": "exp-deta",
        "company": "DETA",
        "position": "Data Science Internship",
        "location": "Remote",
        "startPeriod": "November 2025",
        "endPeriod": "January 2026",
        "duration": "3 months",
        "responsibilities": [
          "Panamanian startup specialized in Data Science and Automation.",
          "Intensive learning in LLM, AI, Data Science, and Data Scraping.",
          "Developed skills in prompt engineering and data analysis.",
          "Analyzed the tech job market for internal projects.",
          "Enhanced programming skills applied to AI solutions."
        ],
        "skills": [
          "Data Science",
          "LLM",
          "Prompt Engineering",
          "Data Scraping",
          "Python"
        ]
      }
    ],
    "projects": [
      {
        "id": "project-poguru",
        "name": "PO Guru",
        "year": 2026,
        "type": "Project",
        "shortDescription": "Checks a purchase request against the rules, flags what is missing and prepares it for a person to approve. It runs in Teams and Outlook. The agent follows the process; people make the decisions. ProcureNation team, with Martín as lead and responsible for AI, architecture and development.",
        "longDescription": "Checks a purchase request against the rules, flags what is missing and prepares it for a person to approve. It runs in Teams and Outlook. The agent follows the process; people make the decisions. ProcureNation team, with Martín as lead and responsible for AI, architecture and development.",
        "features": [
          "Quotation submitted in a Teams chat",
          "Checks 10 points and asks about missing information",
          "Stamp: ready for review; never approves on its own",
          "Brief for purchasing staff with points to review",
          "Approval follow-up and a shared-list record"
        ],
        "technologies": [
          "Copilot Studio",
          "Teams",
          "Outlook",
          "Excel"
        ],
        "event": "AI Hackathon Philips LATAM 2026",
        "result": "1st place regionally and 1st place in Panama",
        "isHighlighted": true
      },
      {
        "id": "project-1",
        "name": "Conecta Panamá",
        "type": "Hackathon Winner",
        "event": "Hackathon ITSE x Municipio de Panamá 2025",
        "year": 2025,
        "result": "First Place",
        "shortDescription": "Citizen super app connecting Panamanians digitally with information, education, business, and essential services",
        "longDescription": "AI-powered citizen super app, built in two weeks. 1st place in the Municipality of Panama competition, held internally and in person at ITSE. I handled interface design and code assembly.",
        "features": [
          "AI assistant with personalized recommendations",
          "Intelligent search for courses and events",
          "Offline micro-learning",
          "Geo-referenced local commerce",
          "Access to verified educational content",
          "Pharmacy and medicine directory"
        ],
        "technologies": [
          "AI",
          "Machine Learning",
          "Geolocation",
          "Personalized recommendations",
          "React",
          "Node.js"
        ],
        "impact": "Democratizes access to education and boosts the community economy in Panama",
        "isHighlighted": false
      },
      {
        "id": "project-tyr",
        "name": "TYR",
        "year": 2025,
        "type": "Project",
        "shortDescription": "University assistant with a fine-tuned BERT model. Answers questions that previously arrived by email.",
        "longDescription": "University assistant with a fine-tuned BERT model. Answers questions that previously arrived by email.",
        "features": [],
        "technologies": [
          "Python",
          "BERT",
          "FastAPI"
        ],
        "result": "98.93%"
      },
      {
        "id": "project-tyr-ai",
        "name": "TYR AI",
        "type": "Logistics AI Platform",
        "year": 2026,
        "shortDescription": "Operational intelligence copilot for Panama's logistics industry — showcased at Expo Logística Panamá 2026.",
        "longDescription": "TYR AI transforms Excel and WhatsApp-based logistics operations into an intelligent conversational system. It combines LLaMA 3.3 70B (Groq) with logistics-specialized NER, a Kanban shipment dashboard, and a knowledge base covering the Panama Canal, Colón Free Zone, ports, Incoterms 2020, and customs documentation. Showcased at Expo Logística Panamá 2026 to 100+ industry companies.",
        "features": [
          "Intelligent chat with logistics NER (extracts BL, ports, incoterms, carriers)",
          "Kanban dashboard with six stages and 40 demo shipments",
          "Real-time KPIs: OTD rate, active shipments, delays, high risk",
          "Panama Canal, Colón Free Zone and Incoterms 2020 knowledge base",
          "Offline fallback with integrated local knowledge base",
          "Digital twin of the Vía Centenario included"
        ],
        "technologies": [
          "React 19",
          "TypeScript",
          "Groq AI",
          "LLaMA 3.3 70B",
          "FastAPI",
          "Python",
          "NER",
          "Zustand",
          "Recharts"
        ],
        "demoUrl": "https://tyr-logistics-os.vercel.app/",
        "images": [
          "/images/expologistica/martin-tyr-demo.jpg",
          "/images/expologistica/deltawaves-team.jpg",
          "/images/expologistica/martin-speaking-1.jpg"
        ],
        "isHighlighted": false
      },
      {
        "id": "project-tincho-ia",
        "name": "tincho.ia",
        "year": 2026,
        "type": "Project",
        "shortDescription": "Early-stage personal AI education project. I teach how to use Claude, Claude Code, Codex and agents from scratch on TikTok and Instagram.",
        "longDescription": "Early-stage personal AI education project. I teach how to use Claude, Claude Code, Codex and agents from scratch on TikTok and Instagram.",
        "features": [],
        "technologies": [
          "Claude",
          "Claude Code",
          "Codex"
        ],
        "demoUrl": "https://tincho-ia.pages.dev"
      },
      {
        "id": "project-2",
        "name": "Vitae.ai",
        "type": "AI CV Platform",
        "year": 2026,
        "shortDescription": "AI-powered digital CV platform to present experience, education, and skills in a modern visual format.",
        "longDescription": "My CV in Spanish and English, with an assistant that answers questions about me.",
        "features": [
          "Interactive digital CV",
          "Spanish and English",
          "AI assistant"
        ],
        "technologies": [
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
          "Groq AI"
        ],
        "githubUrl": "https://github.com/EiTinchoZ/Vitae.ai",
        "images": [
          "/brand/vitae-logo.webp"
        ]
      },
      {
        "id": "project-sena",
        "name": "SENA",
        "type": "Interactive Dashboard",
        "year": 2025,
        "shortDescription": "An interactive dashboard built as an academic/professional pitch for ALERTA-ED: a proposed predictive system that detects school dropout risk before it becomes irreversible.",
        "longDescription": "An interactive dashboard built as an academic/professional pitch for ALERTA-ED: a proposed predictive system that detects school dropout risk before it becomes irreversible.\n\nThe experience emulates a real product: AI onboarding, data visualizations, business narrative, and an admin panel with local persistence.",
        "features": [
          "AI onboarding experience",
          "Real-time data visualizations",
          "Business narrative sections",
          "Admin panel with local persistence"
        ],
        "technologies": [
          "Vite",
          "React 18",
          "TypeScript",
          "Tailwind",
          "Framer Motion"
        ],
        "githubUrl": "https://github.com/EiTinchoZ/SENA",
        "images": [
          "/images/projects/cover-sena-alertaed.png"
        ]
      }
    ],
    "languages": [
      {
        "id": "lang-1",
        "name": "Spanish",
        "level": "Native",
        "description": "Mother tongue"
      },
      {
        "id": "lang-2",
        "name": "English",
        "level": "C2 Full Proficiency",
        "certification": "Bilingual Status - Florida State University",
        "description": "Full proficiency in speaking, writing, reading, and comprehension"
      },
      {
        "id": "lang-3",
        "name": "Portuguese",
        "level": "Basic",
        "description": "Currently learning with the goal of reaching B2 level"
      }
    ]
  }
};

export function getCvData(language: LanguageCode = 'es'): CVData {
  return { personal, ...cvByLanguage[language === 'es' ? 'es' : 'en'] };
}

export const cvData: CVData = getCvData('es');

export type SkillCategory = 'ai' | 'programming' | 'industrial' | 'technology';
