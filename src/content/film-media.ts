// Para reemplazar la película, cambia estas rutas y añade los nuevos archivos a public/film.
// Las MP4 son la versión web (CRF 24, +faststart); los masters viven en video/pelicula/v9/renders/.
type FilmTrack = { src: string; srclang: 'es' | 'en'; label: string; default?: boolean };

export const filmMedia = {
  src: '/film/martin-bundy-v9-1080p60.mp4',
  poster: '/film/martin-bundy-v9.jpg',
  duration: '3:10',
  tracks: [
    { src: '/film/martin-bundy-v9.es.vtt', srclang: 'es', label: 'Español', default: true },
    { src: '/film/martin-bundy-v9.en.vtt', srclang: 'en', label: 'English' },
  ] as FilmTrack[],
};

export const filmMediaEn = {
  src: '/film/martin-bundy-v9-en-1080p60.mp4',
  poster: '/film/martin-bundy-v9-en.jpg',
  duration: '3:10',
  tracks: [
    { src: '/film/martin-bundy-v9-en.en.vtt', srclang: 'en', label: 'English', default: true },
  ] as FilmTrack[],
};

export function filmSectionHtml(lang: 'es' | 'en') {
  const en = lang === 'en';
  const media = en ? filmMediaEn : filmMedia;
  const heading = en ? 'Who is <em>Martín Bundy?</em>' : '¿Quién es <em>Martín Bundy?</em>';
  const lead = en ? 'How I learn, build with AI and contribute to a team.' : 'Cómo aprendo, construyo con IA y aporto a un equipo.';
  const play = en ? 'Play the film' : 'Reproducir la película';
  const chapters = en
    ? ['01 · 24 hours', '02 · Who I am', '03 · How I think', '04 · What I built', '05 · How I work', '06 · What comes next']
    : ['01 · 24 horas', '02 · Quién soy', '03 · Cómo pienso', '04 · Lo que construí', '05 · Cómo trabajo', '06 · Lo que sigue'];
  const tracks = media.tracks
    .map((t) => `<track kind="subtitles" src="${t.src}" srclang="${t.srclang}" label="${t.label}"${t.default ? ' default' : ''}>`)
    .join('');
  return `
  <div class="top ink-safe"><h2 class="dec">${heading}</h2><p>${lead}</p></div>
  <div class="screen film-player" id="screen">
    <video id="film-video" playsinline preload="none" poster="${media.poster}" data-src="${media.src}" aria-label="${play}">${tracks}</video>
    <button class="film-start" id="film-start" type="button" aria-label="${play}">
      <span class="pbtn" aria-hidden="true"></span><span class="film-start-label">${play}</span>
    </button>
  </div>
  <div class="film-details ink-safe">
    <span class="mono">${media.duration} · 1080p · ${en ? 'English audio · English subtitles' : 'Audio en español · Subtítulos en español e inglés'}</span>
    <a href="${media.src}" target="_blank" rel="noopener">${en ? 'Open the video' : 'Abrir el video'}</a>
  </div>
  <p id="film-status" class="film-status ink-safe" role="status" aria-live="polite"></p>
  <div class="chap ink-safe">${chapters.map((s) => `<span>${s}</span>`).join('')}</div>`;
}
