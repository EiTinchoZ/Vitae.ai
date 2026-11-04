// Para reemplazar la película, cambia estas rutas y añade los nuevos archivos a public/film.
// El MP4 conserva el master aprobado; no se recodifica para el reproductor web.
export const filmMedia = {
  src: '/film/martin-bundy-v8-1080p60.mp4',
  poster: '/film/martin-bundy-v8.jpg',
  duration: '3:00',
} as const;

export const filmMediaEn = {
  src: '/film/martin-bundy-v8-en-1080p60.mp4',
  poster: '/film/martin-bundy-v8-en.jpg',
  duration: '3:00',
} as const;

export function filmSectionHtml(lang: 'es' | 'en') {
  const en = lang === 'en';
  const media = en ? filmMediaEn : filmMedia;
  const heading = en ? 'Who is <em>Martín Bundy?</em>' : '¿Quién es <em>Martín Bundy?</em>';
  const lead = en ? 'How I learn, build with AI and contribute to a team.' : 'Cómo aprendo, construyo con IA y aporto a un equipo.';
  const play = en ? 'Play the film' : 'Reproducir la película';
  const chapters = en
    ? ['01 · Who I am', '02 · Learning on my own', '03 · Industrial Engineering', '04 · Experience and challenges', '05 · AI and what comes next']
    : ['01 · Quién soy', '02 · Aprender por mi cuenta', '03 · Ingeniería Industrial', '04 · Experiencia y retos', '05 · IA y lo que viene'];
  return `
  <div class="top ink-safe"><h2 class="dec">${heading}</h2><p>${lead}</p></div>
  <div class="screen film-player" id="screen">
    <video id="film-video" playsinline preload="none" poster="${media.poster}" data-src="${media.src}" aria-label="${play}"></video>
    <button class="film-start" id="film-start" type="button" aria-label="${play}">
      <span class="pbtn" aria-hidden="true"></span><span class="film-start-label">${play}</span>
    </button>
  </div>
  <div class="film-details ink-safe">
    <span class="mono">${media.duration} · 1080p · ${en ? 'English audio · English subtitles' : 'Audio en español · Subtítulos integrados'}</span>
    <a href="${media.src}" target="_blank" rel="noopener">${en ? 'Open the video' : 'Abrir el video'}</a>
  </div>
  <p id="film-status" class="film-status ink-safe" role="status" aria-live="polite"></p>
  <div class="chap ink-safe">${chapters.map((s) => `<span>${s}</span>`).join('')}</div>`;
}
