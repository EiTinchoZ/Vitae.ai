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
  { n: 'PO Guru', l: 'Philips LATAM AI Hackathon 2026 · team lead', s: '1st place', p: 'Checks a purchase request against the rules, flags what is missing and hands it over ready for a person to approve. Lives in Teams and Outlook.', k: ['1st', 'of 12 finalists in LATAM'], org: '/img/logos/philips.png', logo: '/img/po-guru-cierre.jpg', logoAlt: 'PO Guru logo', img: '/img/hackathon-challenge.jpg', fp: '50% 30%', t: ['Copilot Studio', 'Teams', 'Outlook'] },
  { n: 'Conecta Panamá', l: 'ITSE x Panama City Municipality Hackathon 2025 · interface and code', s: '1st place', p: 'An AI civic super app, built in two weeks. We won and the Municipality wanted to take it further: we sat down with the mayor to plan how to implement it.', k: ['1st', 'place'], t: ['React', 'Node.js', 'AI'] },
  { n: 'TYR', l: 'ITSE · 2025', s: 'Demo', p: 'A university assistant with a fine-tuned BERT model. It answers the questions students used to send by email.', k: ['98.93%', 'accuracy'], t: ['Python', 'BERT', 'FastAPI'] },
  { n: 'TYR AI', l: 'Expo Logística Panamá 2026 · speaker', s: 'Live', p: 'A copilot for logistics operations on LLaMA 3.3 70B. I demoed it live to transport, freight and 3PL companies.', k: ['100+', 'companies'], img: '/img/expo.jpg', fp: '50% 4%', t: ['LLaMA 3.3', 'Groq', 'React'] },
  { n: 'tincho.ia', l: 'Side project · 2026', s: 'Starting up', p: 'I teach Claude, Claude Code, Codex and agents from scratch on TikTok and Instagram.', k: ['Day 1', 'of a long plan'], t: ['Claude', 'Claude Code', 'Codex'], u: 'https://tincho-ia.pages.dev' },
  { n: 'This site', l: 'Interactive CV · designed and built with AI', s: 'Live', p: 'My resume in English and Spanish, with 3D figures and sound. I directed it and built it with Claude Code and Codex.', k: ['2', 'languages'], t: ['Next.js', 'Three.js', 'Claude Code'] },
];

export const ticker: [string, string][] = [
  ['1st', 'of 12 finalists in LATAM'],
  ['98.93%', 'accuracy'],
  ['100+', 'companies, live'],
  ['2', 'hackathons won'],
  ['24 h', 'to an MVP'],
  ['2', 'languages'],
];

// Texto pintado en la tapa de cada caja.
export const lidText = { made: 'MADE IN PANAMA' };

export const card = (d: Project) =>
  `<div class="swap">${d.logo ? `<img class="logo" src="${d.logo}" alt="${d.logoAlt}">` : ''}${d.org ? `<span class="org"><img src="/img/logos/philips-shield.png" alt=""><img src="${d.org}" alt="Philips"></span>` : ''}<span class="mono">${d.l}</span>${d.logo ? '' : `<h3>${d.n}</h3>`}<p>${d.p}</p><div class="row">${d.img ? `<img src="${d.img}" alt="" style="--fp:${d.fp}">` : ''}<div class="n"><b>${d.k[0]}</b><span>${d.k[1]}</span></div></div><div class="tags">${d.t.map((x) => `<span>${x}</span>`).join('')}</div>${d.u ? `<a class="go" href="${d.u}" target="_blank" rel="noopener">Visit tincho.ia<span aria-hidden="true">↗</span></a>` : ''}</div>`;

const tk = ticker.map((x) => `<span><b>${x[0]}</b>${x[1]}</span>`).join('').repeat(2);

const html = `  <canvas id="cPrj" aria-hidden="true"></canvas>
  <div class="panel">
    <h2 class="ink-safe">What I have built</h2>
    <label class="project-picker ink-safe">View project<select id="project-choice">${projects.map((p,i)=>`<option value="${i}">${p.n}</option>`).join('')}</select></label>
    <div class="pcard ink-safe" id="pcard" aria-live="polite">${card(projects[0])}</div>
  </div>
  <span class="hint mono ink-safe"><span class="hm">Hover a box to open it<br>click the belt to speed it up</span><span class="ht">Tap a box to open it · tap the belt to speed it up</span></span>
  <div class="ticker" aria-hidden="true"><div class="r" id="tk">${tk}</div></div>`;

export default html;
