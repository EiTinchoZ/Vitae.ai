// Textos visibles y accesibles de la figura de laptop.
const strings = {
 es: {
  // keyboard(): leyendas físicas del teclado español; conservar al traducir (ids, A-Z, F1-F12 y símbolos derivados no cambian)
  keyLabels: {" vol-":"−","vol+":"+","mic":"◉","rog":"R"," ":"","↵ ":"","⇧ ":"⇧","ctrl ":"ctrl","win":"⊞","alt gr":"alt gr","esc":"ESC","supr":"SUPR","bloq":"BLOQ","ctrl":"CTRL","fn":"FN","alt":"ALT"},
  // screen(): rutas del explorador; mantener identificadores sincronizados con las tareas
  files: ["agents.md","fig/","laptop.mjs","rig.mjs","sfx.js","index.html","styles.css","cv/","en.md","es.md","notas.md","README.md"],
  // live custom(): archivos leídos y editados, conservar como rutas
  noteFiles: ["agents.md", "notas.md"],
  noteFile: "notas.md",
  // live custom(): comando visible de verificación
  noteCommand: "node scripts/check.mjs",
  // screen(): título inicial de VS Code
  screenTitle: "laptop.mjs · vitae-cv · Visual Studio Code",
  // screen(): encabezado del explorador
  project: "VITAE-CV",
  // screen(): encabezado de la terminal
  terminal: "TERMINAL",
  // screen(): barra de estado izquierda
  status: "main  ✓ 0 ⚠ 0",
  // screen(): barra de estado derecha
  position: "Ln 42  UTF-8  JavaScript",
  // screen(): fases de trabajo de Claude Code
  steps: [
    "Plan",
    "Lee",
    "Edita",
    "Verifica",
    "Listo"
  ],
  // live TASKS: tareas de ejemplo; p, plan, ok y código ctx/add visibles; rutas y comandos conservan su función
  tasks: [
    {
      "p": "Arregla el menú en móvil",
      "read": [
        "index.html",
        "styles.css"
      ],
      "file": "styles.css",
      "line": 212,
      "ctx": [
        ".nav{display:flex;gap:28px}",
        ".nav a{white-space:nowrap}",
        "",
        "@media (max-width:1360px){",
        "  .snd span{display:none}",
        "}",
        "",
        ".hero{min-height:100svh}",
        ".hero h1{font:900 9vw/.85 Archivo}",
        ".hero .lead{max-width:34ch}",
        "",
        ".rig{padding:120px 40px}",
        ".rnums{display:grid;gap:4px}"
      ],
      "at": 6,
      "add": [
        "@media (max-width:860px){",
        "  .nav{overflow-x:auto}",
        "}"
      ],
      "del": 1,
      "plan": "1 archivo, 3 líneas",
      "cmd": "npx playwright test --project=movil",
      "ok": "menú en una línea a 390 px ✓"
    },
    {
      "p": "Que el RGB siga la carga",
      "read": [
        "laptop.mjs",
        "sfx.js"
      ],
      "file": "laptop.mjs",
      "line": 318,
      "ctx": [
        "function draw(tps) {",
        "  for (const l of leds) {",
        "    const h = hue(l.p);",
        "    l.g.style.color = h;",
        "  }",
        "  svg.style.setProperty(",
        "    \"--lap-on\", on);",
        "}",
        "",
        "function tick(now) {",
        "  const dt = (now - last) / 1000;",
        "  draw(step(dt));",
        "}"
      ],
      "at": 3,
      "add": [
        "    const light = 52 + 14 * load;",
        "    const h = hsl(l.p, light);"
      ],
      "del": 2,
      "plan": "lee el modelo de carga, 2 líneas",
      "cmd": "node fig/laptop.mjs",
      "ok": "line ends: 0 ✓"
    },
    {
      "p": "Pasa el CV a inglés",
      "read": [
        "cv/",
        "es.md",
        "en.md"
      ],
      "file": "en.md",
      "line": 12,
      "ctx": [
        "# Martín Bundy",
        "AI & Industrial Engineering · Panamá",
        "",
        "## Education",
        "- AI Technician · ITSE · 2026",
        "- Industrial Engineering · ADEN",
        "",
        "## Certificates",
        "- Claude Code in Action · Anthropic",
        "- AI Fluency · Anthropic",
        "",
        "## Languages",
        "- Spanish · English C2"
      ],
      "at": 7,
      "add": [
        "## Skills",
        "- Python · SQL · Power BI · Claude Code",
        ""
      ],
      "del": -1,
      "plan": "mismo orden que el CV en español",
      "cmd": "node scripts/ats-check.mjs en.md",
      "ok": "legible por ATS ✓"
    },
    {
      "p": "Que las fotos carguen después",
      "read": [
        "index.html"
      ],
      "file": "index.html",
      "line": 451,
      "ctx": [
        "<section class=\"hoy\" id=\"hoy\">",
        "  <div class=\"wrap\">",
        "    <figure class=\"shot\">",
        "      <img src=\"img/expo.jpg\" alt=\"\">",
        "    </figure>",
        "    <h2>Hoy</h2>",
        "  </div>",
        "</section>",
        "",
        "<section id=\"proyectos\">",
        "  <div class=\"wrap\">",
        "    <h2>Proyectos</h2>",
        "  </div>"
      ],
      "at": 4,
      "add": [
        "      <img src=\"img/expo.jpg\" alt=\"\"",
        "           loading=\"lazy\" decoding=\"async\">"
      ],
      "del": 3,
      "plan": "solo las fotos bajo el pliegue",
      "cmd": "npx playwright test --project=web",
      "ok": "carga diferida ✓"
    }
  ],
  // live SUBS: prefijo de archivos leídos
  readPrefix: "lee ",
  // live SUBS: detalle de verificación
  testStep: "corre las pruebas",
  // live SUBS: detalle final
  readyStep: "listo para revisar",
  // screen() y live start()/enter(): prompt de PowerShell
  prompt: "PS C:\\vitae-cv>",
  // live start(): sufijo de título
  titleSuffix: " · vitae-cv · Visual Studio Code",
  // live enter(): terminal al iniciar pruebas
  runningStart: "corriendo…",
  // live runPhase(): terminal con puntos animados
  running: "corriendo",
  // live custom(): contenido inicial de notas.md
  notes: [
    "# Notas de la sesión",
    "",
    "## Hoy",
    "- maqueta de la laptop",
    "- revisar en móvil",
    "",
    "## Después",
    "- MOTION.md",
    "- CV en PDF",
    "",
    "## Hecho",
    "- torre RGB",
    "- sonido"
  ],
  // live custom(): plan de tarea del visitante
  notePlan: "1 nota nueva, sin tocar código",
  // live custom(): resultado de verificación
  noteOk: "verificado ✓",
  // live draw(): separador de velocidad y temperatura
  tokenCpu: " tok/s · CPU ",
  // live draw(): separador de temperatura y ventilador
  temperatureFan: " °C · ",
  // live draw(): unidad de velocidad del ventilador
  rpm: " rpm",
  // figureSvg(): descripción accesible larga
  description: "Una laptop gamer abierta. En la pantalla, Visual Studio Code con Claude Code: una tarea pasa por plan, lectura, edición y verificación. Al verificar, la CPU se calienta y los ventiladores suben. El teclado y la barra de luz brillan en arcoíris o en el color que elijas.",
  // plateHtml(): número de figura
  figure: "Fig 3",
  // plateHtml(): título
  title: "Donde construyo",
  // plateHtml(): instrucciones
  hint: "Clic en la pantalla para entrar · o escribe y Enter",
  // plateHtml(): readout inicial
  readout: "0 tok/s · CPU 42 °C · 1800 rpm",
  // plateHtml(): leyenda RGB
  rgb: "RGB: arcoíris o tu color",
  // plateHtml(): aria-label del escenario interactivo
  aria: "Laptop: escribe una tarea para Claude Code y pulsa Enter, o haz clic para ver una",
 },
 // EN: traducido por Claude (2026-11-02). Rutas, comandos, código y leyendas físicas del teclado se conservan.
 en: {
   "keyLabels": {
     " vol-": "−",
     "vol+": "+",
     "mic": "◉",
     "rog": "R",
     " ": "",
     "↵ ": "",
     "⇧ ": "⇧",
     "ctrl ": "ctrl",
     "win": "⊞",
     "alt gr": "alt gr",
     "esc": "ESC",
     "supr": "SUPR",
     "bloq": "BLOQ",
     "ctrl": "CTRL",
     "fn": "FN",
     "alt": "ALT"
   },
   "files": [
     "agents.md",
     "fig/",
     "laptop.mjs",
     "rig.mjs",
     "sfx.js",
     "index.html",
     "styles.css",
     "cv/",
     "en.md",
     "es.md",
     "notas.md",
     "README.md"
   ],
   "noteFiles": [
     "agents.md",
     "notas.md"
   ],
   "noteFile": "notas.md",
   "noteCommand": "node scripts/check.mjs",
   "screenTitle": "laptop.mjs · vitae-cv · Visual Studio Code",
   "project": "VITAE-CV",
   "terminal": "TERMINAL",
   "status": "main  ✓ 0 ⚠ 0",
   "position": "Ln 42  UTF-8  JavaScript",
   "steps": [
     "Plan",
     "Read",
     "Edit",
     "Verify",
     "Done"
   ],
   "tasks": [
     {
       "p": "Fix the menu on mobile",
       "read": [
         "index.html",
         "styles.css"
       ],
       "file": "styles.css",
       "line": 212,
       "ctx": [
         ".nav{display:flex;gap:28px}",
         ".nav a{white-space:nowrap}",
         "",
         "@media (max-width:1360px){",
         "  .snd span{display:none}",
         "}",
         "",
         ".hero{min-height:100svh}",
         ".hero h1{font:900 9vw/.85 Archivo}",
         ".hero .lead{max-width:34ch}",
         "",
         ".rig{padding:120px 40px}",
         ".rnums{display:grid;gap:4px}"
       ],
       "at": 6,
       "add": [
         "@media (max-width:860px){",
         "  .nav{overflow-x:auto}",
         "}"
       ],
       "del": 1,
       "plan": "1 file, 3 lines",
       "cmd": "npx playwright test --project=mobile",
       "ok": "menu on one line at 390 px ✓"
     },
     {
       "p": "Make the RGB follow the load",
       "read": [
         "laptop.mjs",
         "sfx.js"
       ],
       "file": "laptop.mjs",
       "line": 318,
       "ctx": [
         "function draw(tps) {",
         "  for (const l of leds) {",
         "    const h = hue(l.p);",
         "    l.g.style.color = h;",
         "  }",
         "  svg.style.setProperty(",
         "    \"--lap-on\", on);",
         "}",
         "",
         "function tick(now) {",
         "  const dt = (now - last) / 1000;",
         "  draw(step(dt));",
         "}"
       ],
       "at": 3,
       "add": [
         "    const light = 52 + 14 * load;",
         "    const h = hsl(l.p, light);"
       ],
       "del": 2,
       "plan": "reads the load model, 2 lines",
       "cmd": "node fig/laptop.mjs",
       "ok": "line ends: 0 ✓"
     },
     {
       "p": "Translate the CV to English",
       "read": [
         "cv/",
         "es.md",
         "en.md"
       ],
       "file": "en.md",
       "line": 12,
       "ctx": [
         "# Martín Bundy",
         "AI & Industrial Engineering · Panamá",
         "",
         "## Education",
         "- AI Technician · ITSE · 2026",
         "- Industrial Engineering · ADEN",
         "",
         "## Certificates",
         "- Claude Code in Action · Anthropic",
         "- AI Fluency · Anthropic",
         "",
         "## Languages",
         "- Spanish · English C2"
       ],
       "at": 7,
       "add": [
         "## Skills",
         "- Python · SQL · Power BI · Claude Code",
         ""
       ],
       "del": -1,
       "plan": "same order as the Spanish CV",
       "cmd": "node scripts/ats-check.mjs en.md",
       "ok": "ATS-readable ✓"
     },
     {
       "p": "Lazy-load the photos",
       "read": [
         "index.html"
       ],
       "file": "index.html",
       "line": 451,
       "ctx": [
         "<section class=\"hoy\" id=\"hoy\">",
         "  <div class=\"wrap\">",
         "    <figure class=\"shot\">",
         "      <img src=\"img/expo.jpg\" alt=\"\">",
         "    </figure>",
         "    <h2>Hoy</h2>",
         "  </div>",
         "</section>",
         "",
         "<section id=\"proyectos\">",
         "  <div class=\"wrap\">",
         "    <h2>Proyectos</h2>",
         "  </div>"
       ],
       "at": 4,
       "add": [
         "      <img src=\"img/expo.jpg\" alt=\"\"",
         "           loading=\"lazy\" decoding=\"async\">"
       ],
       "del": 3,
       "plan": "only the photos below the fold",
       "cmd": "npx playwright test --project=web",
       "ok": "lazy loading ✓"
     }
   ],
   "readPrefix": "reads ",
   "testStep": "runs the tests",
   "readyStep": "ready for review",
   "prompt": "PS C:\\vitae-cv>",
   "titleSuffix": " · vitae-cv · Visual Studio Code",
   "runningStart": "running…",
   "running": "running",
   "notes": [
     "# Session notes",
     "",
     "## Today",
     "- laptop mockup",
     "- check on mobile",
     "",
     "## Next",
     "- MOTION.md",
     "- CV as PDF",
     "",
     "## Done",
     "- RGB tower",
     "- sound"
   ],
   "notePlan": "1 new note, no code touched",
   "noteOk": "verified ✓",
   "tokenCpu": " tok/s · CPU ",
   "temperatureFan": " °C · ",
   "rpm": " rpm",
   "description": "An open gaming laptop. On screen, Visual Studio Code with Claude Code: a task goes through plan, read, edit and verify. While it verifies, the CPU heats up and the fans spin faster. The keyboard and the light bar glow in rainbow or in the color you pick.",
   "figure": "Fig 3",
   "title": "Where I build",
   "hint": "Click the screen to go in · or type and press Enter",
   "readout": "0 tok/s · CPU 42 °C · 1800 rpm",
   "rgb": "RGB: rainbow or your color",
   "aria": "Laptop: type a task for Claude Code and press Enter, or click to watch one"
 },
};

export default strings;
