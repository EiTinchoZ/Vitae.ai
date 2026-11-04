// Carga el master únicamente al reproducir; conserva controles nativos y fullscreen.
export function mount(sec: HTMLElement): () => void {
  const video = sec.querySelector<HTMLVideoElement>('#film-video');
  const start = sec.querySelector<HTMLButtonElement>('#film-start');
  const status = sec.querySelector<HTMLElement>('#film-status');
  if (!video || !start || !status) return () => {};
  const errorText = document.documentElement.lang === 'en'
    ? 'The video could not start. Try again or use “Open the video”.'
    : 'No se pudo iniciar el video. Intenta otra vez o usa «Abrir el video».';
  let disposed = false;
  const onPlay = () => {
    start.hidden = true;
    start.disabled = false;
    status.textContent = '';
  };
  const onError = () => {
    if (disposed) return;
    start.hidden = false;
    start.disabled = false;
    status.textContent = errorText;
  };
  const play = async () => {
    const restoreFocus = document.activeElement === start;
    start.disabled = true;
    status.textContent = '';
    if (!video.getAttribute('src')) video.src = video.dataset.src!;
    video.controls = true;
    if (video.error) video.load();
    try {
      await video.play();
      if (!disposed && restoreFocus) video.focus();
    } catch {
      onError();
    }
  };
  video.addEventListener('play', onPlay);
  video.addEventListener('error', onError);
  start.addEventListener('click', play);
  return () => {
    disposed = true;
    start.removeEventListener('click', play);
    video.removeEventListener('play', onPlay);
    video.removeEventListener('error', onError);
    video.pause();
  };
}
