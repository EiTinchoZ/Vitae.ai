// Marcado estático de la sección, tal cual la maqueta. Las piezas se montan sobre él.
const html = "  <div class=\"wrap\">\n    <div class=\"head\">\n      <h2 class=\"dec\">My day to day at <em>Philips</em>.</h2>\n      <div class=\"who\"><img class=\"ph-shield\" src=\"/img/logos/philips-shield.png\" alt=\"Philips\" width=\"472\" height=\"600\"><span class=\"mono\">Operational Procurement Intern · Panama · since Apr 21, 2026</span></div>\n    </div>\n    <div class=\"tools\"><span class=\"mono\">What I work with</span><ul aria-label=\"Tools I use every day\"><li style=\"--c:#0FAAFF\"><img src=\"/img/logos/sap.svg\" alt=\"\" height=\"18\">SAP</li><li style=\"--c:#1FA8B8\"><img src=\"/img/logos/sharepoint.svg\" alt=\"\" height=\"18\">SharePoint</li><li style=\"--c:#7B6CFF\"><img src=\"/img/logos/copilot-color.svg\" alt=\"\" height=\"18\">Microsoft Copilot</li><li style=\"--c:#7B83EB\"><img src=\"/img/logos/teams.svg\" alt=\"\" height=\"18\">Teams</li><li style=\"--c:#2A8BE6\"><img src=\"/img/logos/outlook.svg\" alt=\"\" height=\"18\">Outlook</li><li style=\"--c:#21A366\"><img src=\"/img/logos/excel.svg\" alt=\"\" height=\"18\">Excel</li><li style=\"--c:#F2C811\"><img src=\"/img/logos/powerbi-color.svg\" alt=\"\" height=\"18\">Power BI</li></ul></div>\n    <div class=\"grid\">\n      <div class=\"line\" id=\"line\" role=\"tablist\" aria-label=\"Milestones at Philips\"></div>\n      <div class=\"det\" id=\"det\" role=\"tabpanel\" aria-live=\"polite\"></div>\n    </div>\n    <div class=\"po-in\">\n      <div class=\"po-copy\"><img class=\"po-logo\" src=\"/img/po-guru-cierre.jpg\" alt=\"PO Guru logo\" width=\"1160\" height=\"370\"><span class=\"mono\">PO Guru · inside</span><h3 class=\"dec\">Check. Flag. <em>Stamp.</em></h3><p>The agent does the legwork. People make the calls.</p><ol class=\"po-steps\" id=\"poSteps\"><li><span class=\"ic\"><img src=\"/img/logos/teams.svg\" alt=\"Microsoft Teams\" width=\"26\" height=\"26\"></span><b><i>1</i>You upload your quote</b><small>in a Teams chat</small></li><li><span class=\"ic\"><img src=\"/img/logos/copilot-color.svg\" alt=\"Copilot Studio\" width=\"26\" height=\"26\"></span><b><i>2</i>The agent checks 10 points</b><small>built in Copilot Studio</small></li><li><span class=\"ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"8\" r=\"4\" fill=\"#FFD23F\"/><path d=\"M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7\" fill=\"#FFD23F\"/></svg></span><b><i>3</i>If something is missing, it asks you</b><small>you decide</small></li><li><span class=\"ic\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9 3h6v6l-1 3h5a2 2 0 0 1 2 2v3H3v-3a2 2 0 0 1 2-2h5L9 9z\" fill=\"#FF5A14\"/><rect x=\"3\" y=\"19\" width=\"18\" height=\"2.5\" rx=\"1\" fill=\"#FF5A14\"/></svg></span><b><i>4</i>Stamp: ready for review</b><small>it never approves on its own</small></li><li><span class=\"ic\"><img src=\"/img/logos/teams.svg\" alt=\"Microsoft Teams\" width=\"26\" height=\"26\"></span><b><i>5</i>Brief to the buyer</b><small>the 10 points and what to look at</small></li><li><span class=\"ic\"><img src=\"/img/logos/outlook.svg\" alt=\"Microsoft Outlook\" width=\"26\" height=\"26\"></span><b><i>6</i>Chases the approval</b><small>one reminder per business day</small></li><li><span class=\"ic\"><img src=\"/img/logos/excel.svg\" alt=\"Microsoft Excel\" width=\"26\" height=\"26\"></span><b><i>7</i>The order goes to the supplier</b><small>everything stays in the shared list</small></li></ol></div>\n      <div class=\"iso\" data-theme=\"dark\"><!--fig:poguru--></div>\n    </div>\n  </div>";

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
  { w: '21.04.2026', t: 'I join the procurement team', s: 'Done', p: 'Operational Procurement at Philips Panama: the team that runs purchasing end to end.', k: [['Apr 21', 'first day']] },
  { w: 'Apr to today', t: 'Every purchase, measured', s: 'Done', p: 'I follow each request through to the purchase order, against four KPIs. I built a no-code dashboard and the manual reports went away.', k: [] },
  { w: 'In testing', t: 'The whole process in one place', s: 'In testing', p: 'I led the platform that brings the SOP, work instructions and harmonized work instructions together, so the team finds everything in one spot.', k: [] },
  { w: 'Oct 2026', t: 'An agent that answers in seconds', s: 'Done', p: 'I built it in Microsoft Copilot: it guides buyers and requesters and cites the exact source.', k: [] },
  { w: 'Oct 2026', t: 'We win the LATAM AI Hackathon', s: 'Done', p: 'We drew Procurement as our challenge. I led the team and built all of the AI in PO Guru in 24 hours. A 4-minute pitch and 2 minutes of questions: 1st in Panama. A week later, 1st in LATAM out of 12 finalists.', k: [['24 h', 'to build the MVP'], ['1st', 'of ~30 in Panama'], ['1st', 'of 12 in LATAM']], img: ['/img/hackathon-challenge.jpg', 'Challenge accepted · Panama semifinal'] },
];

// Textos de la pieza: el estado que cuenta como hecho y el hito que se abre al entrar.
export const ui = {
  done: 'Done',
  first: 3,
};
