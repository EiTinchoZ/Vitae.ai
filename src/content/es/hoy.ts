// Marcado estático de la sección, tal cual la maqueta. Las piezas se montan sobre él.
const html = "  <div class=\"wrap\">\n    <div class=\"head ink-safe\">\n      <h2 class=\"dec\">Mi día a día en <em>Philips</em>.</h2>\n      <div class=\"who\"><img class=\"ph-shield\" src=\"/img/logos/philips-shield.png\" alt=\"Philips\" width=\"472\" height=\"600\"><span class=\"mono\">Operational Procurement Intern · Panamá · desde el 21.04.2026</span></div>\n    </div>\n    <div class=\"tools ink-safe\"><span class=\"mono\">Con qué trabajo</span><ul aria-label=\"Herramientas que uso a diario\"><li style=\"--c:#0FAAFF\"><img src=\"/img/logos/sap.svg\" alt=\"\" height=\"18\">SAP</li><li style=\"--c:#1FA8B8\"><img src=\"/img/logos/sharepoint.svg\" alt=\"\" height=\"18\">SharePoint</li><li style=\"--c:#7B6CFF\"><img src=\"/img/logos/copilot-color.svg\" alt=\"\" height=\"18\">Microsoft Copilot</li><li style=\"--c:#7B83EB\"><img src=\"/img/logos/teams.svg\" alt=\"\" height=\"18\">Teams</li><li style=\"--c:#2A8BE6\"><img src=\"/img/logos/outlook.svg\" alt=\"\" height=\"18\">Outlook</li><li style=\"--c:#21A366\"><img src=\"/img/logos/excel.svg\" alt=\"\" height=\"18\">Excel</li><li style=\"--c:#F2C811\"><img src=\"/img/logos/powerbi-color.svg\" alt=\"\" height=\"18\">Power BI</li></ul></div>\n    <div class=\"grid\">\n      <div class=\"line ink-safe\" id=\"line\" role=\"tablist\" aria-label=\"Hitos en Philips\"></div>\n      <div class=\"det ink-safe\" id=\"det\" role=\"tabpanel\" aria-live=\"polite\"></div>\n    </div>\n    <div class=\"po-in\">\n      <div class=\"po-copy ink-safe\"><img class=\"po-logo\" src=\"/img/po-guru-cierre.jpg\" alt=\"Logo de PO Guru\" width=\"1160\" height=\"370\"><span class=\"mono\">PO Guru · por dentro</span><h3 class=\"dec\">Revisa. Marca. <em>Sella.</em></h3><p>El agente hace el recorrido. Las personas deciden.</p><ol class=\"po-steps\" id=\"poSteps\"><li><span class=\"ic\"><img src=\"/img/logos/teams.svg\" alt=\"Microsoft Teams\" width=\"26\" height=\"26\"></span><b><i>1</i>Subes tu cotización</b><small>en un chat de Teams</small></li><li><span class=\"ic\"><img src=\"/img/logos/copilot-color.svg\" alt=\"Copilot Studio\" width=\"26\" height=\"26\"></span><b><i>2</i>El agente revisa 10 puntos</b><small>hecho en Copilot Studio</small></li><li><span class=\"ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"8\" r=\"4\" fill=\"#FFD23F\"/><path d=\"M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7\" fill=\"#FFD23F\"/></svg></span><b><i>3</i>Si falta algo, te pregunta</b><small>tú decides</small></li><li><span class=\"ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9 3h6v6l-1 3h5a2 2 0 0 1 2 2v3H3v-3a2 2 0 0 1 2-2h5L9 9z\" fill=\"#FF5A14\"/><rect x=\"3\" y=\"19\" width=\"18\" height=\"2.5\" rx=\"1\" fill=\"#FF5A14\"/></svg></span><b><i>4</i>Sello: lista para revisión</b><small>no aprueba nada solo</small></li><li><span class=\"ic\"><img src=\"/img/logos/teams.svg\" alt=\"Microsoft Teams\" width=\"26\" height=\"26\"></span><b><i>5</i>Brief al buyer</b><small>los 10 puntos y lo que hay que mirar</small></li><li><span class=\"ic\"><img src=\"/img/logos/outlook.svg\" alt=\"Microsoft Outlook\" width=\"26\" height=\"26\"></span><b><i>6</i>Persigue la aprobación</b><small>un recordatorio por día hábil</small></li><li><span class=\"ic\"><img src=\"/img/logos/excel.svg\" alt=\"Microsoft Excel\" width=\"26\" height=\"26\"></span><b><i>7</i>La orden sale al proveedor</b><small>todo queda en la lista compartida</small></li></ol></div>\n      <div class=\"iso\" data-theme=\"dark\"><!--fig:poguru--></div>\n    </div>\n  </div>";

export default html;

// Hitos en Philips, con su estado real. El estado igual a ui.done pinta el punto lleno; cualquier otro, pendiente.
export type Step = {
  w: string;
  t: string;
  s: string;
  p: string;
  k: [string, string][];
  img?: [src: string, caption: string, cls?: string];
};

// Sin cifras internas de Philips: nada de tiempos del proceso, tamaño del equipo ni mediciones del trabajo a mano
// (Tín, 2026-11-02). La lógica y los nombres se quedan si cumplen la política de confidencialidad. El hackathon es público.
export const steps: Step[] = [
  { w: '21.04.2026', t: 'Entro al equipo de compras', s: 'Aprobado', p: 'Operational Procurement en Philips Panamá: el equipo que mueve las compras de punta a punta.', k: [['21.04', 'primer día']] },
  { w: 'Abr a hoy', t: 'Cada compra, medida', s: 'Aprobado', p: 'Sigo cada solicitud hasta la orden de compra, con cuatro KPIs. Armé un dashboard sin código y se acabaron los reportes a mano.', k: [] },
  { w: 'En pruebas', t: 'Todo el proceso en un solo lugar', s: 'En pruebas', p: 'Lideré la plataforma que junta SOP, work instructions y harmonized work instructions, para que el equipo encuentre todo en un solo sitio.', k: [] },
  { w: 'Oct 2026', t: 'Un agente que responde en segundos', s: 'Aprobado', p: 'Lo armé en Microsoft Copilot: guía a buyers y solicitantes y cita la fuente exacta.', k: [] },
  { w: 'Oct 2026', t: 'Ganamos el AI Hackathon LATAM', s: 'Aprobado', p: 'Nos tocó Procurement por sorteo. Lideré al equipo y construí toda la parte de IA de PO Guru en 24 horas. Pitch de 4 minutos y 2 de preguntas: 1.º de Panamá. Una semana después, 1.º de LATAM entre 12 finalistas.', k: [['24 h', 'para el MVP'], ['1.º', 'de ~30 en Panamá'], ['1.º', 'de 12 en LATAM']], img: ['/img/hackathon-challenge.jpg', 'Reto aceptado · semifinal Panamá'] },
];

// Textos de la pieza: el estado que cuenta como hecho y el hito que se abre al entrar.
export const ui = {
  done: 'Aprobado',
  first: 3,
};
