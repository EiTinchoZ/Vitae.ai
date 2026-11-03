// Marcado estático de la sección, tal cual la maqueta. Las piezas se montan sobre él.
const html = "  <canvas id=\"cMap\" aria-label=\"3D map of Martín's path\"></canvas>\n  <div class=\"txt\">\n    <span class=\"mono\">2017 → 2027</span>\n    <h2 class=\"dec\">Everything I tried ended up <em>adding up</em>.</h2>\n    <p class=\"sub\">Five lines, one station.</p>\n    <div class=\"legend\" id=\"leg\"></div>\n  </div>\n  <div class=\"mcard\" id=\"mcard\" aria-live=\"polite\"></div>\n  <span class=\"hint mono\"><span class=\"hm\">Drag to rotate · hover a station</span><span class=\"ht\">Tap a station · drag to rotate</span></span>";

export default html;

// Mapa de metro: [línea, fecha, título, detalle, x, z]. x y z son la posición de la estación en el piso del mapa.
export type Station = [string, string, string, string, number, number];

export const metro = {
  lines: { base: 'Technical groundwork', edu: 'Education', ia: 'Artificial intelligence', pro: 'Processes and procurement', prj: 'Projects and awards' } as Record<string, string>,
  future: 'What comes next',
  hub: ['TODAY', 'AI applied to real processes'],
  stations: [
    ['base', '2017', 'High school', 'Colegio San Agustín de Panamá', -12, -7],
    ['base', '2018-2024', 'Technical groundwork', 'Electrical and electromechanical engineering · UTP and USMA', -9.5, -8],
    ['base', '2024', 'The decision', 'I pick Industrial Engineering, the degree that ties it all together, and transfer my credits', -7, -6.6],
    ['edu', '2025', 'Industrial Engineering', 'ADEN University · courses through Apr 2027', -4.5, -4.6],
    ['edu', '2025', 'Higher Technical Degree in AI', 'ITSE · ends Apr 2027', -1.6, -3.2],
    ['edu', '2026', 'English C2', 'Florida State University · self-taught', 1.6, -2.4],
    ['ia', '2025', 'TYR', 'BERT assistant · 98.93% accuracy', -7.5, 1.2],
    ['ia', '2026', 'Master in AI', 'Daxus Latam · plus Anthropic certificates', -4.4, 1.9],
    ['ia', '2026', 'tincho.ia', 'My project to teach AI from scratch', -1.4, 1.7],
    ['ia', '2026', 'AI agent', 'Answers in seconds and cites the source', 1.4, 0.9],
    ['prj', '2025', '1st place ITSE x Municipality', 'Conecta Panamá · meeting with the mayor', -6.5, 4.8],
    ['prj', '2026', 'Expo Logística', 'Live demo for 100+ companies', -2.2, 4.4],
    ['prj', '2026', '1st place LATAM', 'Philips AI Hackathon · 12 finalists', 2, 3.3],
    ['pro', '2025', 'Data Science', 'Internship at DETA · Nov 2025 to Jan 2026', -8.5, -1.6],
    ['pro', '2026', 'Philips', 'Operational Procurement Intern · since Apr 21', -1.4, -0.7],
  ] as Station[],
  // estaciones fantasma de la vía en construcción
  ghosts: [
    ['fut', 'Apr 2027', 'I finish both degrees', 'The Higher Technical Degree in AI at ITSE and the last Industrial Engineering courses at ADEN.', 4.3, -5.5],
    ['fut', 'After that', 'More adventures', 'The track stays open. Whatever comes next, I will build it with everything I have added up so far.', 3.4, -9.5],
  ] as Station[],
};
