// Proyectos: marcado estático de la sección, las cajas de la cinta y las cifras del ticker.
// La primera ficha y el ticker salen ya en el HTML; project-belt.ts cambia la ficha al pasar sobre una caja.
// Sin cifras internas de Philips (fuera "6 s contra 5 min" y "50/50 preguntas" de la maqueta).

export type Project = {
  n: string; // nombre (tapa de la caja y título de la ficha)
  l: string; // etiqueta mono
  s: string; // sello de la tapa
  p: string;
  k: [string, string]; // cifra y su leyenda
  logo?: string; // si hay, reemplaza el título en la ficha y en la tapa
  logoAlt?: string;
  org?: string; // nombre de la organización como logo (escudo + nombre), solo Philips
  img?: string;
  fp?: string; // encuadre de la foto
  u?: string; // enlace externo: la ficha pinta un botón
  t: string[];
};

export const projects: Project[] = [
  { n: 'PO Guru', l: 'AI Hackathon Philips LATAM 2026 · líder de equipo', s: '1.er lugar', p: 'Revisa una solicitud de compra contra las reglas, marca lo que falta y la deja lista para que una persona la apruebe. Vive en Teams y Outlook.', k: ['1.º', 'de 12 finalistas en LATAM'], org: '/img/logos/philips.png', logo: '/img/po-guru-cierre.jpg', logoAlt: 'Logo de PO Guru', img: '/img/hackathon-challenge.jpg', fp: '50% 30%', t: ['Copilot Studio', 'Teams', 'Outlook'] },
  { n: 'Conecta Panamá', l: 'Hackathon ITSE x Municipio de Panamá 2025 · interfaz y código', s: '1.er lugar', p: 'Super app ciudadana con IA, hecha en dos semanas. Ganamos y el Municipio quiso llevarla más lejos: nos sentamos con el alcalde a ver cómo implementarla.', k: ['1.º', 'lugar'], t: ['React', 'Node.js', 'IA'] },
  { n: 'TYR', l: 'ITSE · 2025', s: 'Demo', p: 'Asistente universitario con un modelo BERT ajustado. Responde las dudas que antes llegaban por correo.', k: ['98,93 %', 'de precisión'], t: ['Python', 'BERT', 'FastAPI'] },
  { n: 'TYR AI', l: 'Expo Logística Panamá 2026 · expositor', s: 'En vivo', p: 'Copiloto para operaciones logísticas con LLaMA 3.3 70B. Lo presenté en vivo a empresas de transporte, carga y 3PL.', k: ['100+', 'empresas'], img: '/img/expo.jpg', fp: '50% 4%', t: ['LLaMA 3.3', 'Groq', 'React'] },
  { n: 'tincho.ia', l: 'Proyecto propio · 2026', s: 'Arrancando', p: 'Enseño a usar Claude, Claude Code, Codex y agentes desde cero, en TikTok e Instagram.', k: ['Día 1', 'de un plan largo'], t: ['Claude', 'Claude Code', 'Codex'], u: 'https://tincho-ia.pages.dev' },
  { n: 'Vitae.ai', l: 'Esta web · 2026', s: 'Abierta', p: 'Mi hoja de vida en español e inglés, con un asistente que contesta preguntas sobre mí.', k: ['2', 'idiomas'], t: ['Next.js', 'TypeScript', 'Groq'] },
];

export const ticker: [string, string][] = [
  ['1.º', 'de 12 finalistas en LATAM'],
  ['98,93 %', 'de precisión'],
  ['100+', 'empresas en vivo'],
  ['2', 'hackathones ganados'],
  ['24 h', 'para un MVP'],
  ['2', 'idiomas'],
];

// Texto pintado en la tapa de cada caja.
export const lidText = { made: 'HECHO EN PANAMÁ' };

export const card = (d: Project) =>
  `<div class="swap">${d.logo ? `<img class="logo" src="${d.logo}" alt="${d.logoAlt}">` : ''}${d.org ? `<span class="org"><img src="/img/logos/philips-shield.png" alt=""><img src="${d.org}" alt="Philips"></span>` : ''}<span class="mono">${d.l}</span>${d.logo ? '' : `<h3>${d.n}</h3>`}<p>${d.p}</p><div class="row">${d.img ? `<img src="${d.img}" alt="" style="--fp:${d.fp}">` : ''}<div class="n"><b>${d.k[0]}</b><span>${d.k[1]}</span></div></div><div class="tags">${d.t.map((x) => `<span>${x}</span>`).join('')}</div>${d.u ? `<a class="go" href="${d.u}" target="_blank" rel="noopener">Ver tincho.ia<span aria-hidden="true">↗</span></a>` : ''}</div>`;

const tk = ticker.map((x) => `<span><b>${x[0]}</b>${x[1]}</span>`).join('').repeat(2);

const html = `  <canvas id="cPrj" aria-hidden="true"></canvas>
  <div class="panel">
    <h2>Lo que he construido</h2>
    <div class="pcard" id="pcard" aria-live="polite">${card(projects[0])}</div>
  </div>
  <span class="hint mono"><span class="hm">Pasa sobre una caja para abrirla<br>clic en la cinta para acelerarla</span><span class="ht">Toca una caja para abrirla · toca la cinta para acelerarla</span></span>
  <div class="ticker" aria-hidden="true"><div class="r" id="tk">${tk}</div></div>`;

export default html;
