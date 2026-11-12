import type { Lang } from './lang';

// Dónde aporto: un edificio de empresa, un piso por área. Cada área dice qué haría y con qué lo pruebo.
// Abajo, cuatro rasgos con su prueba: sirven para cualquier área que no esté en el edificio.
export type Area = { n: string; does: string; proof: string; href: string };
export type Trait = { t: string; p: string };
type Aporto = { title: string; lead: string; floor: string; proofLabel: string; traitsLabel: string; aria: string; areas: Area[]; traits: Trait[] };

const es: Aporto = {
  title: 'Dónde encajo en tu <em>empresa</em>.',
  lead: 'Sea cual sea tu área, trabajo igual: entiendo cómo funciona, encuentro el paso que más tiempo se come y lo resuelvo, con IA o sin ella. <b>Elige un piso.</b>',
  floor: 'Piso',
  proofLabel: 'Prueba',
  traitsLabel: '¿Tu área no está en el edificio? Esto viaja conmigo',
  aria: 'Áreas de una empresa: elige un piso',
  areas: [
    { n: 'Marketing y brand digital', does: 'Sé qué hace que la gente se quede viendo: armé una comunidad de más de 80 mil seguidores en TikTok. Hoy hago contenido con IA, de la idea al video publicado, y miro los datos para repetir lo que funciona.', proof: '+80k en TikTok · tincho.ia · esta película', href: '#pelicula' },
    { n: 'Supply chain y compras', does: 'Un agente que revisa cada solicitud antes de que llegue al aprobador, y KPIs para ver dónde se atora cada orden.', proof: 'PO Guru · Philips', href: '#hoy' },
    { n: 'Logística', does: 'Un copiloto que lee documentos de embarque, entiende puertos e incoterms y ordena los envíos.', proof: 'TYR AI · Expo Logística 2026', href: '#proyectos' },
    { n: 'Operaciones y calidad', does: 'Dibujar el proceso como es de verdad, encontrar el cuello de botella y medir antes y después.', proof: 'PanaLogis · plataforma de procedimientos', href: '#proyectos' },
    { n: 'Finanzas', does: 'Costear y evaluar un proyecto antes de invertir, y reportes que se arman solos en lugar de a mano.', proof: 'Ingeniería económica · dashboard de KPIs', href: '#hoy' },
    { n: 'Análisis de datos', does: 'Datos sacados de la web y ordenados con LLMs, y modelos que se adelantan a lo que viene.', proof: 'DETA · Precogn.ia', href: '#proyectos' },
    { n: 'Tecnología e IT', does: 'Apps y agentes de punta a punta: datos, modelo, API, interfaz y despliegue.', proof: 'Conecta Panamá · esta web', href: '#proyectos' },
    { n: 'Atención y formación', does: 'Asistentes que responden con la fuente exacta, y equipos que aprenden a usar IA desde cero.', proof: 'Agente de compras · tincho.ia', href: '#proyectos' },
  ],
  traits: [
    { t: 'Aprendo rápido', p: 'Dos carreras a la vez e inglés certificado en C2.' },
    { t: 'Me gustan los retos', p: 'Un MVP de IA en 24 horas, y ganó.' },
    { t: 'Soy creativo', p: 'Más de 80 mil seguidores en TikTok, y dirigí esta web y su película.' },
    { t: 'Me adapto rápido', p: 'En el hackathon me tocó compras por sorteo. Ganamos LATAM.' },
  ],
};

const en: Aporto = {
  title: 'Where I fit in your <em>company</em>.',
  lead: 'Whatever your area, I work the same way: I learn how it runs, find the step that eats the most time and fix it, with AI or without it. <b>Pick a floor.</b>',
  floor: 'Floor',
  proofLabel: 'Proof',
  traitsLabel: 'Your area isn’t in the building? This comes with me',
  aria: 'Areas of a company: pick a floor',
  areas: [
    { n: 'Marketing and brand digital', does: 'I know what keeps people watching: I built a community of 80k+ followers on TikTok. Today I make content with AI, from the idea to the published video, and read the data to repeat what works.', proof: '80k+ on TikTok · tincho.ia · this film', href: '#pelicula' },
    { n: 'Supply chain and procurement', does: 'An agent that checks every request before it reaches the approver, and KPIs that show where each order gets stuck.', proof: 'PO Guru · Philips', href: '#hoy' },
    { n: 'Logistics', does: 'A copilot that reads shipping documents, understands ports and incoterms and keeps shipments in order.', proof: 'TYR AI · Expo Logística 2026', href: '#proyectos' },
    { n: 'Operations and quality', does: 'Map the process as it really is, find the bottleneck and measure before and after.', proof: 'PanaLogis · procedures platform', href: '#proyectos' },
    { n: 'Finance', does: 'Cost and evaluate a project before investing, and reports that build themselves instead of by hand.', proof: 'Engineering economics · KPI dashboard', href: '#hoy' },
    { n: 'Data analysis', does: 'Data pulled from the web and organized with LLMs, and models that see what’s coming.', proof: 'DETA · Precogn.ia', href: '#proyectos' },
    { n: 'Technology and IT', does: 'Apps and agents end to end: data, model, API, interface and deployment.', proof: 'Conecta Panamá · this site', href: '#proyectos' },
    { n: 'Service and training', does: 'Assistants that answer with the exact source, and teams that learn to use AI from scratch.', proof: 'Procurement agent · tincho.ia', href: '#proyectos' },
  ],
  traits: [
    { t: 'I learn fast', p: 'Two degrees at once and English certified at C2.' },
    { t: 'I like a challenge', p: 'An AI MVP in 24 hours, and it won.' },
    { t: 'I’m creative', p: '80k+ followers on TikTok, and I directed this site and its film.' },
    { t: 'I adapt fast', p: 'At the hackathon I drew procurement by lottery. We won LATAM.' },
  ],
};

export const aporto: Record<Lang, Aporto> = { es, en };
