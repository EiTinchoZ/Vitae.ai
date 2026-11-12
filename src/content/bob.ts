import type { Lang } from './lang';

export type BobQuestion = { question: string; answer: string; section: string; evidence: string };
export const bobCopy = {
  es: {
    open: 'Conoce a Martín con BoB', close: 'Cerrar BoB', subtitle: 'Tu guía por mi CV',
    title: '¿Qué quieres saber de Martín?', intro: 'Soy BoB, su pug y tu guía. Elige una pregunta y te llevo a la prueba.',
    guided: 'Respuestas preparadas con el CV', see: 'Llévame ahí', back: 'Ver otras preguntas',
    free: 'Pregúntale otra cosa a BoB', placeholder: '¿Qué experiencia tiene con agentes de IA?',
    send: 'Preguntar', stop: 'Detener', thinking: 'BoB está consultando el CV…',
    disclosure: 'La IA responde con los datos del CV. Confirma los detalles directamente con Martín.',
    unavailable: 'Ahora no puedo completar esa respuesta. Puedes usar las preguntas guiadas o contactar a Martín.',
    limited: 'Llegamos al límite de preguntas por ahora. Las respuestas guiadas siguen disponibles.',
    style: 'Elige el estilo de BoB', ai: 'Respuesta con IA', contact: 'Contactar a Martín',
    questions: [
      {question:'¿Qué lo distingue para mi equipo?',answer:'Martín une ingeniería industrial e IA aplicada: primero entiende y mide el proceso, después construye el agente o el modelo que lo mejora. Lo ha probado en compras, logística, datos y atención, y lideró PO Guru, ganador del AI Hackathon Philips LATAM 2026. En Dónde aporto está cómo encaja en cada área.',section:'aporto',evidence:'Dónde aporto'},
      {question:'¿Qué hace hoy en Philips?',answer:'Es Operational Procurement Intern en Philips Panamá desde abril de 2026. Trabaja con el ciclo de compras en Ariba y SAP, seguimiento de KPIs, documentación de procesos y herramientas de IA para la operación.',section:'hoy',evidence:'Mi día a día en Philips'},
      {question:'¿Qué ha construido con IA?',answer:'PO Guru revisa solicitudes de compra antes de la aprobación humana. También construyó agentes en Copilot Studio, TYR como asistente universitario, Conecta Panamá y ALERTA-ED. Esta web permite explorar sus proyectos y probar sus demos.',section:'proyectos',evidence:'Proyectos y demostraciones'},
      {question:'¿Qué hay detrás del premio LATAM?',answer:'Como team lead de ProcureNation, Martín se encargó de la IA, la arquitectura y la construcción de PO Guru. El equipo creó el MVP en 24 horas, ganó la semifinal de Panamá y, una semana después, el primer lugar de la final regional del AI Hackathon Philips LATAM 2026.',section:'hoy',evidence:'PO Guru y el hackathon'},
      {question:'¿Cómo trabaja con IA?',answer:'Combina el conocimiento del proceso con la construcción de agentes, plataformas, dashboards y apps. Usa Claude Code y Codex para construir y verificar. La laptop interactiva de esta página muestra una simulación de ese flujo: planear, leer, editar, probar y revisar.',section:'laptop',evidence:'Explora su forma de construir'},
      {question:'¿Qué está estudiando?',answer:'Completó todas las materias de Ingeniería Industrial en ADEN University y cierra el Técnico Superior en IA del ITSE en abril de 2027. Tiene la especialización en IA aplicada a los negocios de ADEN, certificaciones de Anthropic y otras, es bilingüe con certificación C2 de Florida State University y aprende portugués. En marzo de 2027 empieza la maestría en IA en ADEN. Todo está en Quién soy.',section:'formacion',evidence:'Quién soy'},
      {question:'¿Podemos conversar sobre una oportunidad?',answer:'Sí: puedes escribirle a mbundy15@gmail.com o reservar una conversación de 20 minutos desde Contacto. Martín puede confirmar contigo disponibilidad, modalidad y los detalles de la oportunidad.',section:'contacto',evidence:'Correo y agenda'},
    ] satisfies BobQuestion[],
  },
  en: {
    open: 'Meet Martín with BoB', close: 'Close BoB', subtitle: 'Your guide to my CV',
    title: 'What would you like to know about Martín?', intro: 'I’m BoB, his pug and your guide. Pick a question and I’ll take you to the evidence.',
    guided: 'Prepared answers based on the CV', see: 'Take me there', back: 'Explore other questions',
    free: 'Ask BoB something else', placeholder: 'What experience does he have with AI agents?',
    send: 'Ask', stop: 'Stop', thinking: 'BoB is checking the CV…',
    disclosure: 'AI answers use the CV data. Confirm details directly with Martín.',
    unavailable: 'I can’t complete that answer right now. You can use the guided questions or contact Martín.',
    limited: 'We’ve reached the question limit for now. Guided answers are still available.',
    style: 'Choose BoB’s style', ai: 'AI answer', contact: 'Contact Martín',
    questions: [
      {question:'What makes him stand out for my team?',answer:'Martín combines industrial engineering and applied AI: first he understands and measures the process, then he builds the agent or model that improves it. He has applied it in procurement, logistics, data and service, and led PO Guru, winner of the Philips LATAM AI Hackathon 2026. Where I fit shows how he fits each area.',section:'aporto',evidence:'Where I fit'},
      {question:'What does he do at Philips today?',answer:'He has been an Operational Procurement Intern at Philips Panama since April 2026. His work covers the procurement cycle in Ariba and SAP, KPI tracking, process documentation and AI tools for operations.',section:'hoy',evidence:'His day-to-day work at Philips'},
      {question:'What has he built with AI?',answer:'PO Guru checks purchase requests before human approval. He has also built Copilot Studio agents, TYR as a university assistant, Conecta Panamá and ALERTA-ED. This website lets you explore his projects and try their demos.',section:'proyectos',evidence:'Projects and demonstrations'},
      {question:'What is behind the LATAM award?',answer:'As ProcureNation’s team lead, Martín handled the AI, architecture and development of PO Guru. The team built its MVP in 24 hours, won the Panama semifinal and, one week later, took first place in the Philips LATAM AI Hackathon 2026 regional final.',section:'hoy',evidence:'PO Guru and the hackathon'},
      {question:'How does he work with AI?',answer:'He combines process knowledge with building agents, platforms, dashboards and apps. He uses Claude Code and Codex to build and verify. The interactive laptop on this page simulates that workflow: plan, read, edit, test and review.',section:'laptop',evidence:'Explore how he builds'},
      {question:'What is he studying?',answer:'He has completed all Industrial Engineering courses at ADEN University and finishes the Higher Technical Degree in AI at ITSE in April 2027. He holds ADEN’s AI Applied to Business program, certifications from Anthropic and others, is bilingual with a C2 certification from Florida State University and is learning Portuguese. In March 2027 he starts a master’s in AI at ADEN. It’s all in About.',section:'formacion',evidence:'About'},
      {question:'Can we discuss an opportunity?',answer:'Yes: email him at mbundy15@gmail.com or book a 20-minute conversation through Contact. Martín can confirm his availability, working arrangements and the details of your opportunity directly with you.',section:'contacto',evidence:'Email and scheduling'},
    ] satisfies BobQuestion[],
  },
} satisfies Record<Lang, object>;
