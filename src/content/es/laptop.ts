// Marcado estático de la sección, tal cual la maqueta. Las piezas se montan sobre él.
const html = "  <div class=\"wrap\">\n    <div class=\"iso\" data-theme=\"dark\"><!--fig:laptop--></div>\n    <div class=\"rig-copy\" data-rig>\n      <h2>Mi lado <em>RGB</em>.</h2>\n      <ol class=\"how\" aria-label=\"Cómo trabajo\">\n        <li><b>01</b><span>Entiendo el problema antes de tocar código.</span></li>\n        <li><b>02</b><span>Se lo encargo a Claude Code en VS Code.</span><i aria-hidden=\"true\"><span class=\"lg\" style=\"--u:url(/img/logos/claude.svg);--c:#D97757\"></span><span class=\"lg\" style=\"--u:url(/img/logos/visualstudiocode.svg);--c:#23A8F2\"></span></i></li>\n        <li><b>03</b><span>Lo pruebo y lo reviso antes de entregarlo.</span></li>\n      </ol>\n      <p class=\"lead2\">Aquí construyo con IA. Escríbele una tarea.</p>\n      <button type=\"button\" class=\"zoomin\" data-zoom-open><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5\"/></svg>Ver la pantalla de cerca</button>\n      <dl class=\"rnums\">\n        <div><dt>Claude Code</dt><dd><b data-rig-n=\"tps\">0</b><span>tok/s</span></dd></div>\n        <div><dt>CPU i9</dt><dd><b data-rig-n=\"temp\">42</b><span>°C</span></dd></div>\n        <div><dt>Industrial · lazo de control</dt><dd><b data-rig-n=\"rpm\">1800</b><span>rpm</span></dd></div>\n      </dl>\n      <div class=\"rgbpick\" role=\"group\" aria-label=\"Color del RGB\">\n        <span>Luz</span>\n        <button type=\"button\" class=\"sw sw-rain\" data-lap-rgb=\"rainbow\" aria-pressed=\"true\" aria-label=\"Arcoíris\"></button>\n        <button type=\"button\" class=\"sw\" data-lap-rgb=\"#FF0029\" aria-pressed=\"false\" aria-label=\"Rojo ROG\" style=\"--c:#FF0029\"></button>\n        <button type=\"button\" class=\"sw\" data-lap-rgb=\"#FF6A2A\" aria-pressed=\"false\" aria-label=\"Naranja\" style=\"--c:#FF6A2A\"></button>\n        <button type=\"button\" class=\"sw\" data-lap-rgb=\"#FFC21A\" aria-pressed=\"false\" aria-label=\"Ámbar\" style=\"--c:#FFC21A\"></button>\n        <button type=\"button\" class=\"sw\" data-lap-rgb=\"#39FF5A\" aria-pressed=\"false\" aria-label=\"Verde\" style=\"--c:#39FF5A\"></button>\n        <button type=\"button\" class=\"sw\" data-lap-rgb=\"#1E9BFF\" aria-pressed=\"false\" aria-label=\"Azul\" style=\"--c:#1E9BFF\"></button>\n        <button type=\"button\" class=\"sw\" data-lap-rgb=\"#A445FF\" aria-pressed=\"false\" aria-label=\"Violeta\" style=\"--c:#A445FF\"></button>\n        <label class=\"sw sw-any\" aria-label=\"Otro color\"><input type=\"color\" data-lap-rgb=\"custom\" value=\"#FF0029\"></label>\n      </div>\n    </div>\n    <div class=\"vsz\" id=\"vsz\" role=\"region\" aria-label=\"VS Code de cerca: Claude Code y Codex arman un mini-sitio\" tabindex=\"-1\" hidden>\n      <header class=\"vsz-bar\">\n        <span class=\"vsz-dots\" aria-hidden=\"true\"><i></i><i></i><i></i></span>\n        <i class=\"vsz-lg vsz-vsc\" aria-hidden=\"true\"></i>\n        <span class=\"vsz-title\" data-z-title>agents.md · mini-qr · Visual Studio Code</span>\n        <div class=\"vsz-ctl\">\n          <button type=\"button\" data-z-pause aria-pressed=\"false\">Pausa</button>\n          <button type=\"button\" data-z-next>Siguiente</button>\n          <button type=\"button\" class=\"vsz-x\" data-z-close>Salir <kbd>Esc</kbd></button>\n        </div>\n      </header>\n      <div class=\"vsz-body\">\n        <nav class=\"vsz-act\" aria-hidden=\"true\">\n          <svg viewBox=\"0 0 24 24\"><path d=\"M6 3h8l4 4v14H6zM14 3v4h4\"/></svg>\n          <svg viewBox=\"0 0 24 24\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6\"/><path d=\"M15 15l5 5\"/></svg>\n          <svg viewBox=\"0 0 24 24\"><circle cx=\"7\" cy=\"5\" r=\"2\"/><circle cx=\"7\" cy=\"19\" r=\"2\"/><circle cx=\"17\" cy=\"9\" r=\"2\"/><path d=\"M7 7v10M17 11c0 4-10 2-10 6\"/></svg>\n          <svg viewBox=\"0 0 24 24\"><path d=\"M4 4h7v7H4zM13 13h7v7h-7zM4 13h7v7H4zM15 3l5 5-5 5-5-5z\"/></svg>\n          <i class=\"vsz-lg vsz-cl\"></i>\n          <img src=\"/img/logos/codex-mark.png\" alt=\"\">\n        </nav>\n        <aside class=\"vsz-exp\">\n          <h3>Explorador</h3>\n          <p>mini-qr</p>\n          <ul>\n            <li data-file=\"agents.md\" data-ext=\"md\">agents.md</li>\n            <li data-file=\"CANAL.md\" data-ext=\"md\">CANAL.md</li>\n            <li data-file=\"index.html\" data-ext=\"html\">index.html</li>\n            <li data-file=\"styles.css\" data-ext=\"css\">styles.css</li>\n            <li data-file=\"qr.svg\" data-ext=\"svg\">qr.svg</li>\n            <li data-file=\"README.md\" data-ext=\"md\">README.md</li>\n          </ul>\n          <h3>Extensiones</h3>\n          <ul class=\"vsz-exts\">\n            <li><i class=\"vsz-lg vsz-cl\"></i>Claude Code</li>\n            <li><img src=\"/img/logos/codex-mark.png\" alt=\"\">Codex</li>\n          </ul>\n        </aside>\n        <section class=\"vsz-ed\" aria-label=\"Editor\">\n          <div class=\"vsz-tabs\" data-z-tabs></div>\n          <pre class=\"vsz-code\" data-z-code></pre>\n          <div class=\"vsz-term\"><span>Terminal</span><div data-z-term></div></div>\n        </section>\n        <section class=\"vsz-ai\" aria-label=\"Agentes\">\n          <div class=\"vsz-aitabs\" role=\"tablist\">\n            <button type=\"button\" role=\"tab\" data-agent=\"claude\" aria-selected=\"true\"><i class=\"vsz-lg vsz-cl\"></i>Claude Code</button>\n            <button type=\"button\" role=\"tab\" data-agent=\"codex\" aria-selected=\"false\" tabindex=\"-1\"><img src=\"/img/logos/codex-mark.png\" alt=\"\">Codex</button>\n          </div>\n          <div class=\"vsz-chat\" data-z-chat=\"claude\" aria-live=\"polite\"></div>\n          <div class=\"vsz-chat\" data-z-chat=\"codex\" aria-live=\"polite\" hidden></div>\n          <div class=\"vsz-chips\">\n            <button type=\"button\" data-z-chip>Agrega un botón de correo</button>\n            <button type=\"button\" data-z-chip>Pon mi foto</button>\n            <button type=\"button\" data-z-chip>Cámbialo a verde</button>\n          </div>\n          <form class=\"vsz-ask\" data-z-ask>\n            <input type=\"text\" maxlength=\"60\" placeholder=\"Pídele un cambio a Claude\" aria-label=\"Pídele un cambio a Claude\" autocomplete=\"off\">\n            <button type=\"submit\" aria-label=\"Enviar\">↵</button>\n          </form>\n        </section>\n        <section class=\"vsz-prev\" aria-label=\"Vista previa en un teléfono\">\n          <div class=\"vsz-url\">localhost:5173</div>\n          <div class=\"vsz-phone\">\n            <div class=\"mq\" data-z-site>\n              <div class=\"mq-card\">\n                <p class=\"mq-empty\">index.html vacío</p>\n                <img class=\"mq-ava\" data-piece=\"ava\" src=\"/img/martin-profile.webp\" alt=\"\">\n                <h4 data-piece=\"name\">Martín Bundy</h4>\n                <p data-piece=\"role\">IA · Ingeniería Industrial</p>\n                <nav data-piece=\"nav\"><a>CV</a><a>LinkedIn</a><a>GitHub</a><span data-z-extra></span></nav>\n                <img class=\"mq-qr\" data-piece=\"qr\" src=\"/img/qr-portafolio.svg\" alt=\"QR que abre el portafolio\">\n              </div>\n            </div>\n          </div>\n        </section>\n      </div>\n      <footer class=\"vsz-status\">\n        <span>main</span><span data-z-who>Claude Code</span><span data-z-step>1/6 · Plan</span>\n        <span class=\"vsz-sp\"></span><span data-z-ln>Ln 1 · Markdown</span><span data-z-hw>CPU 42 °C · 1800 rpm</span>\n      </footer>\n    </div>\n  </div>";

export default html;

// Vista de cerca (zoom): textos y guion que arma la pieza. Claude Code y Codex construyen el mini-sitio del QR.
// Cada acción del guion: ['agent', a] · ['user'|'say', a, texto] · ['load', carga, tok/s] · ['open', archivo] ·
// ['type', archivo, texto | (acento) => texto, { línea: pieza }] · ['term', texto, clase?] · ['wait', s].
export type Agent = 'claude' | 'codex';
export type Action =
  | ['agent', Agent]
  | ['user' | 'say', Agent, string]
  | ['load', number, number]
  | ['open', string]
  | ['type', string, string | ((acc: string) => string), Record<number, string>?]
  | ['term', string, string?]
  | ['wait', number]
  | ['rgb', string]
  | ['btn', string]
  | ['piece', string];
export type ScriptStep = { name: string; who: Agent; run: Action[] };

export const zoom = {
  names: { claude: 'Claude Code', codex: 'Codex' } as Record<Agent, string>,
  project: 'mini-qr',
  titleTail: ' · mini-qr · Visual Studio Code',
  prompt: 'PS C:\\mini-qr>',
  langs: { md: 'Markdown', html: 'HTML', css: 'CSS', svg: 'SVG' } as Record<string, string>,
  ui: { next: 'Siguiente', again: 'Otra vez', pause: 'Pausa', resume: 'Seguir', done: 'Listo · tu turno', yourStep: 'Tu cambio' },
  start: {
    'agents.md': '# mini-qr\nTarjeta que abre el QR del CV.\n',
    'CANAL.md': '# Canal\nTablero entre Claude Code y Codex.\n',
    'index.html': '',
    'styles.css': '',
    'qr.svg': '<svg viewBox="-3 -3 39 39">\n  <path d="M0 0h7v1h-7z…"/>\n</svg>\n',
    'README.md': '# mini-qr\nLa tarjeta que abre el QR del CV impreso.\n',
  } as Record<string, string>,
  script: [
    { name: 'Plan', who: 'claude', run: [
      ['agent', 'claude'], ['user', 'claude', 'Arma mi mini-sitio del QR: nombre, rol, tres enlaces y el QR.'],
      ['load', 0.16, 70], ['say', 'claude', 'Primero el plan, en agents.md.'],
      ['open', 'agents.md'],
      ['type', 'agents.md', '\n## Plan\n1. index.html: nombre, rol, 3 enlaces\n2. styles.css: negro, acento del RGB\n3. qr.svg: apunta al portafolio\n4. Prueba: carga en menos de 1 s a 390 px\n'],
    ] },
    { name: 'Encargo', who: 'claude', run: [
      ['say', 'claude', 'La parte mecánica va para Codex. Le dejo el encargo.'],
      ['open', 'CANAL.md'],
      ['type', 'CANAL.md', '\n## Encargo 01 · Codex\nHacer: index.html y styles.css según agents.md\nNo tocar: textos ni colores\nEntregar: pruebas en verde\n'],
      ['say', 'claude', 'Encargo 01 listo en CANAL.md.'],
    ] },
    { name: 'HTML', who: 'codex', run: [
      ['agent', 'codex'], ['load', 0.3, 60],
      ['say', 'codex', 'Leo CANAL.md y agents.md. Empiezo por index.html.'],
      ['open', 'index.html'],
      ['type', 'index.html', '<main class="card">\n  <h1>Martín Bundy</h1>\n  <p>IA · Ingeniería Industrial</p>\n  <nav>\n    <a href="/cv">CV</a>\n    <a href="/in">LinkedIn</a>\n    <a href="/gh">GitHub</a>\n  </nav>\n  <img src="qr.svg" alt="QR">\n</main>\n',
        { 2: 'name', 3: 'role', 8: 'nav', 9: 'qr' }],
    ] },
    { name: 'CSS', who: 'codex', run: [
      ['open', 'styles.css'], ['load', 0.34, 82],
      ['type', 'styles.css', (acc) => ':root{--acc:' + acc + '}\n.card{background:#0A0A0B;color:#F3EEE3}\nh1{font:900 34px Archivo}\nnav a{border:1px solid var(--acc)}\nimg{border-radius:12px}\n', { 2: 'styled' }],
      ['say', 'codex', 'Estilo listo. Corro las pruebas.'],
    ] },
    { name: 'Pruebas', who: 'codex', run: [
      ['load', 1, 0], ['term', 'PS C:\\mini-qr> npm test'], ['wait', 0.9],
      ['term', '✓ carga en 0,4 s a 390 px', 'ok'], ['wait', 0.6],
      ['term', '✓ 3 enlaces responden', 'ok'], ['wait', 0.6],
      ['term', '✓ el QR abre el portafolio', 'ok'], ['wait', 0.5],
      ['load', 0.12, 40], ['open', 'CANAL.md'], ['type', 'CANAL.md', 'Reporte 01 · Codex: 3 de 3 pruebas en verde\n'],
      ['say', 'codex', 'Pruebas en verde. Dejé el reporte en CANAL.md.'],
    ] },
    { name: 'Revisión', who: 'claude', run: [
      ['agent', 'claude'], ['load', 0.3, 44],
      ['say', 'claude', 'Reviso lo de Codex. Falta el foco visible en los enlaces.'],
      ['open', 'styles.css'], ['type', 'styles.css', 'a:focus-visible{outline:2px solid var(--acc)}\n', { 1: 'focus' }],
      ['load', 0.08, 0], ['say', 'claude', 'Revisado y listo. Ahora pídeme tú un cambio.'],
    ] },
  ] as ScriptStep[],
  // lo que pide el visitante: cómo se reconoce cada pedido y qué contesta Claude
  ask: {
    note: 'Lo anoto en agents.md.',
    line: (t: string) => '- Visitante: ' + t + '\n',
    later: 'Lo dejé anotado para la próxima vuelta.',
    colors: { rojo: '#FF0029', naranja: '#FF6A2A', amarillo: '#FFC21A', 'ámbar': '#FFC21A', verde: '#39FF5A', azul: '#1E9BFF', violeta: '#A445FF', morado: '#A445FF', 'arcoíris': 'rainbow', arcoiris: 'rainbow' } as Record<string, string>,
    colorName: { '#FF0029': 'rojo', '#FF6A2A': 'naranja', '#FFC21A': 'ámbar', '#39FF5A': 'verde', '#1E9BFF': 'azul', '#A445FF': 'violeta', rainbow: 'arcoíris' } as Record<string, string>,
    isColor: /\bcolor\b/,
    colorDone: (name: string) => 'Acento en ' + name + '. La luz de la laptop cambió con él.',
    isMail: /correo|e-?mail|\bmail\b/,
    mail: { code: '<a href="mailto:">Correo</a>\n', label: 'Correo', done: 'Botón de correo agregado. Míralo en el teléfono.' },
    social: /instagram|tiktok|whatsapp|youtube|portafolio|github|linkedin|behance|twitter/,
    isLink: /bot[oó]n|enlace|link/,
    link: { slug: 'enlace', label: 'Enlace', done: (label: string) => label + ' agregado. Míralo en el teléfono.' },
    isPhoto: /foto|avatar|imagen|cara|retrato/,
    photo: { code: '<img class="foto" src="martin.webp" alt="">\n', done: 'Foto arriba del nombre.' },
    isBig: /grande|tama[nñ]o|letra|nombre/,
    big: { code: 'h1{font-size:44px}\n', done: 'Nombre más grande.' },
  },
};
