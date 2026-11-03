// Marcado estático de la sección, tal cual la maqueta. Las piezas se montan sobre él.
const html = "  <canvas id=\"cHero\" aria-hidden=\"true\"></canvas>\n  <div class=\"name\">\n    <div class=\"loc\" id=\"loc\">\n      <button class=\"flag\" id=\"flag\" type=\"button\" aria-label=\"Bandera de Panamá: tócala\"><span class=\"pole\" aria-hidden=\"true\"></span><span class=\"fl\" id=\"fl\" aria-hidden=\"true\"></span></button>\n      <span class=\"lt\"><b>Panamá</b><span class=\"mono\"><span id=\"clk\">--:--</span> en Panamá · 8.98° N, 79.52° O</span></span>\n    </div>\n    <h1 id=\"h\" aria-label=\"Martín Bundy\"><span class=\"w\">Martín</span><span class=\"w w2\">Bundy</span></h1>\n    <div class=\"carr\">\n      <a class=\"cr ind\" href=\"#formacion\"><span class=\"ic\"><svg viewBox=\"-12 -12 24 24\" aria-hidden=\"true\"><g class=\"gear\"><path d=\"M-1.6-11h3.2l.6 3a8 8 0 0 1 2.4 1l2.6-1.7 2.3 2.3-1.7 2.6a8 8 0 0 1 1 2.4l3 .6v3.2l-3 .6a8 8 0 0 1-1 2.4l1.7 2.6-2.3 2.3-2.6-1.7a8 8 0 0 1-2.4 1l-.6 3h-3.2l-.6-3a8 8 0 0 1-2.4-1l-2.6 1.7-2.3-2.3 1.7-2.6a8 8 0 0 1-1-2.4l-3-.6v-3.2l3-.6a8 8 0 0 1 1-2.4L-8.1-6.1-5.8-8.4-3.2-6.7a8 8 0 0 1 2.4-1z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"/><circle r=\"3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\"/></g></svg></span><span class=\"tx\"><small>ADEN · 90 % hecho</small>Ingeniería Industrial</span></a>\n      <a class=\"cr ia\" href=\"#formacion\"><span class=\"ic\"><svg class=\"nn\" viewBox=\"-12 -12 24 24\" aria-hidden=\"true\"><g stroke=\"currentColor\" stroke-width=\"1.1\" opacity=\".55\"><path d=\"M-8-5L0-8M-8-5L0 0M-8-5L0 8M-8 5L0-8M-8 5L0 0M-8 5L0 8M0-8L8-4M0 0L8-4M0 8L8-4M0-8L8 4M0 0L8 4M0 8L8 4\"/></g><g fill=\"currentColor\"><circle cx=\"-8\" cy=\"-5\" r=\"2.2\"/><circle cx=\"-8\" cy=\"5\" r=\"2.2\"/><circle cx=\"0\" cy=\"-8\" r=\"2.2\"/><circle cx=\"0\" cy=\"0\" r=\"2.2\"/><circle cx=\"0\" cy=\"8\" r=\"2.2\"/><circle cx=\"8\" cy=\"-4\" r=\"2.2\"/><circle cx=\"8\" cy=\"4\" r=\"2.2\"/></g></svg></span><span class=\"tx\"><small>ITSE · cierra abr 2027</small>Inteligencia Artificial</span></a>\n    </div>\n  </div>\n  <div class=\"core\" id=\"core\">\n    <svg class=\"ring\" viewBox=\"0 0 200 200\" aria-hidden=\"true\"><defs><path id=\"cp\" d=\"M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0\"/></defs>\n      <text><textPath href=\"#cp\">AGENTES DE IA · PROCESOS · AUTOMATIZACIÓN · </textPath></text></svg>\n    <div class=\"disc\" id=\"disc\"></div><div class=\"cut\" id=\"ph\"><img src=\"/img/martin-hero.webp\" alt=\"Martín Bundy\"></div>\n    <button class=\"stk\" id=\"stk\" aria-live=\"polite\" aria-label=\"Logros: toca para ver el siguiente\"><small>AI Hackathon Philips LATAM 2026</small><span>1.er lugar · 91 equipos</span><i class=\"dots\" aria-hidden=\"true\"></i></button>\n  </div>\n  <div class=\"foot\">\n    <p>Me apasionan la tecnología, la innovación digital y los videojuegos. <b>Hoy armo agentes de IA.</b></p>\n    <div class=\"chips\"><span class=\"chip\"><svg class=\"ci\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\"><rect x=\"4\" y=\"8\" width=\"16\" height=\"12\" rx=\"4\"/><path d=\"M12 4v4M9 13v1M15 13v1M9.5 17h5\"/></svg>Agentes de IA</span><span class=\"chip\"><img class=\"lgi\" src=\"/img/logos/copilot-color.svg\" alt=\"\">Copilot Studio</span><span class=\"chip\"><i class=\"lg\" style=\"--u:url(/img/logos/claude.svg);--c:#D97757\"></i>Claude Code</span><span class=\"chip\"><i class=\"lg\" style=\"--u:url(/img/logos/openai.svg);--c:#FFFFFF\"></i>ChatGPT</span><span class=\"chip\"><img class=\"lgi\" src=\"/img/logos/codex-mark.png\" alt=\"\">Codex</span><span class=\"chip\"><svg class=\"ci\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M13 2L4 14h6l-1 8 9-12h-6z\"/></svg>Automatización</span><span class=\"chip\"><svg class=\"ci\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2\" y=\"9\" width=\"6\" height=\"6\" rx=\"1.5\"/><rect x=\"16\" y=\"3\" width=\"6\" height=\"6\" rx=\"1.5\"/><rect x=\"16\" y=\"15\" width=\"6\" height=\"6\" rx=\"1.5\"/><path d=\"M8 12h4M12 6v12M12 6h4M12 18h4\"/></svg>Procesos</span><span class=\"chip\"><i class=\"lg\" style=\"--u:url(/img/logos/python.svg);--c:#FFD43B\"></i>Python</span></div>\n    <div class=\"acts\">\n      <a class=\"play\" id=\"play\" href=\"#pelicula\"><span class=\"pv\" aria-hidden=\"true\"><span class=\"ph\"></span><span class=\"perf\"></span><span class=\"perf b\"></span><b></b></span><span class=\"pt\"><small>Película · 2 min</small>Ver mi historia</span></a>\n      <a class=\"cvdl\" href=\"/cv/CV_Martin_Bundy_2026_ES.pdf\" target=\"_blank\" rel=\"noopener\"><span class=\"doc\" aria-hidden=\"true\"><i></i><i></i><i></i><u></u></span><span class=\"ct\"><b>Descargar CV</b><small>PDF · Español</small></span></a>\n    </div>\n  </div>";

export default html;

// Sello de logros que rota sobre la foto: [título, detalle].
export const wins: [string, string][] = [
  ['AI Hackathon Philips LATAM 2026', '1.º de ~91 equipos'],
  ['Ingeniería Industrial · ADEN', 'Operaciones, calidad y KPIs'],
  ['Investigación de operaciones', 'Optimizar con datos'],
  ['Hackathon ITSE x Municipio de Panamá 2025', '1.er lugar · Conecta Panamá'],
  ['Técnico Superior en IA · ITSE', 'Machine learning, NLP y visión'],
  ['Agente de IA en compras', 'responde en segundos con la fuente'],
  ['Master en IA · Daxus Latam', 'Agentes, RAG y n8n'],
  ['Semifinal Philips Panamá 2026', '1.º entre ~30 equipos'],
  ['Anthropic Academy · 2026', 'Claude Code in Action'],
  ['Deep learning · ITSE', 'Redes neuronales y PDI'],
  ['Expo Logística Panamá 2026', 'Demo en vivo · 100+ empresas'],
  ['IA aplicada a los negocios', 'ADEN Business School'],
  ['TYR · modelo BERT', '98,93 % de precisión'],
  ['Inglés C2 · FSU', 'Aprendido por mi cuenta'],
];

// Etiqueta del tooltip de cada tecla 3D.
export const keyTips = {
  social: 'MI CANAL · @TINCHO.IA',
  cert: 'CERTIFICADO · ANTHROPIC',
  daily: 'LO USO A DIARIO',
};

// Hora de Panamá junto a la bandera.
export const clockLocale = 'es-PA';
