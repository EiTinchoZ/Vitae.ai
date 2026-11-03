// Marcado estático de la sección, tal cual la maqueta. Las piezas se montan sobre él.
const html = "  <canvas id=\"cMap\" aria-label=\"Mapa en 3D de la trayectoria de Martín\"></canvas>\n  <div class=\"txt ink-safe\">\n    <span class=\"mono\">2017 → 2027</span>\n    <h2 class=\"dec\">Todo lo que probé terminó <em>sumando</em>.</h2>\n    <p class=\"sub\">Cinco líneas, una sola estación.</p>\n    <div class=\"legend\" id=\"leg\"></div>\n  </div>\n  <div class=\"mcard ink-safe\" id=\"mcard\" aria-live=\"polite\"></div>\n  <span class=\"hint mono ink-safe\"><span class=\"hm\">Arrastra para girar · pasa sobre una estación</span><span class=\"ht\">Toca una estación · arrastra para girar</span></span>";

export default html;

// Mapa de metro: [línea, fecha, título, detalle, x, z]. x y z son la posición de la estación en el piso del mapa.
export type Station = [string, string, string, string, number, number];

export const metro = {
  lines: { base: 'Colegio', edu: 'Formación', ia: 'Inteligencia artificial', pro: 'Procesos y compras', prj: 'Proyectos y premios' } as Record<string, string>,
  future: 'Lo que viene',
  hub: ['HOY', 'IA aplicada a procesos reales'],
  stations: [
    ['base', '2017', 'Bachiller', 'Colegio San Agustín de Panamá', -12, -7],
    ['edu', '2025', 'Ingeniería Industrial', 'ADEN University · materias hasta abr 2027', -4.5, -4.6],
    ['edu', '2025', 'Técnico Superior en IA', 'ITSE · termina abr 2027', -1.6, -3.2],
    ['edu', '2026', 'Inglés C2', 'Florida State University · aprendido por mi cuenta', 1.6, -2.4],
    ['ia', '2025', 'TYR', 'Asistente con BERT · 98,93 % de precisión', -7.5, 1.2],
    ['ia', '2026', 'Master en IA', 'Daxus Latam · más certificados de Anthropic', -4.4, 1.9],
    ['ia', '2026', 'tincho.ia', 'Mi proyecto para enseñar IA desde cero', -1.4, 1.7],
    ['ia', '2026', 'Agente de IA', 'Responde en segundos y cita la fuente', 1.4, 0.9],
    ['prj', '2025', '1.er lugar ITSE x Municipio', 'Conecta Panamá · reunión con el alcalde', -6.5, 4.8],
    ['prj', '2026', 'Expo Logística', 'Demo en vivo ante 100+ empresas', -2.2, 4.4],
    ['prj', '2026', '1.er lugar LATAM', 'AI Hackathon Philips · 12 finalistas', 2, 3.3],
    ['pro', '2025', 'Data Science', 'Pasantía en DETA · nov 2025 a ene 2026', -8.5, -1.6],
    ['pro', '2026', 'Philips', 'Operational Procurement Intern · desde el 21.04', -1.4, -0.7],
  ] as Station[],
  // estaciones fantasma de la vía en construcción
  ghosts: [
    ['fut', 'Abr 2027', 'Cierro las dos carreras', 'Técnico Superior en IA en el ITSE y las últimas materias de Ingeniería Industrial en ADEN.', 4.3, -5.5],
    ['fut', 'Después', 'Más aventuras', 'La vía queda abierta. Lo que venga lo voy a construir con todo lo que ya sumé.', 3.4, -9.5],
  ] as Station[],
  logos: { 'Bachiller': '/img/logos/san-agustin.webp' } as Record<string, string>,
};
