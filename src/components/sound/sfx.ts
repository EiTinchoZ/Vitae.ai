// Sonido de la página (maqueta, sfx.js): todo sintetizado con WebAudio, sin archivos. Apagado por defecto; el botón
// del menú lo prende y la preferencia queda guardada. Las piezas y los runtimes de las figuras llaman a
// window.SFX.play(nombre) y la laptop a window.SFX.hum(nivel, rpm); si el sonido está apagado no hacen nada.
// mount() devuelve la limpieza: listeners fuera, contexto cerrado, window.SFX borrado.

export type SoundName = 'tick' | 'key' | 'hover' | 'click' | 'probe' | 'stamp' | 'reject' | 'prompt';

declare global {
  interface Window {
    SFX?: { play(name: SoundName): void; hum(level: number, rpm?: number): void };
    webkitAudioContext?: typeof AudioContext;
  }
}

const KEY = 'vitae-sfx';

export function mount(btn: HTMLButtonElement): () => void {
  let ctx: AudioContext | null = null;
  let master: GainNode, noise: AudioBuffer, humGain: GainNode, humBand: BiquadFilterNode, blade: OscillatorNode, bladeGain: GainNode;
  let on = false;
  const last: Partial<Record<SoundName, number>> = {};

  function init() {
    ctx = new (window.AudioContext || window.webkitAudioContext!)();
    master = ctx.createGain(); master.gain.value = 0.55;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // zumbido de ventilador: ruido filtrado más el tono de paso de aspas
    const src = ctx.createBufferSource(); src.buffer = noise; src.loop = true;
    humBand = ctx.createBiquadFilter(); humBand.type = 'bandpass'; humBand.frequency.value = 160; humBand.Q.value = 0.7;
    humGain = ctx.createGain(); humGain.gain.value = 0;
    src.connect(humBand).connect(humGain).connect(master); src.start();
    blade = ctx.createOscillator(); blade.type = 'triangle'; blade.frequency.value = 90;
    bladeGain = ctx.createGain(); bladeGain.gain.value = 0;
    blade.connect(bladeGain).connect(master); blade.start();
  }

  const env = (g: GainNode, t: number, peak: number, dur: number) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  };
  function tone(f: number, type: OscillatorType, peak: number, dur: number, { to, delay = 0 }: { to?: number; delay?: number } = {}) {
    const t = ctx!.currentTime + delay, o = ctx!.createOscillator(), g = ctx!.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    env(g, t, peak, dur); o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  function hiss(peak: number, dur: number, freq: number, q = 1, delay = 0) {
    const t = ctx!.currentTime + delay, s = ctx!.createBufferSource(), f = ctx!.createBiquadFilter(), g = ctx!.createGain();
    s.buffer = noise; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    env(g, t, peak, dur); s.connect(f).connect(g).connect(master); s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }

  const SOUNDS: Record<SoundName, () => void> = {
    tick: () => hiss(0.22, 0.025, 3400, 5),
    key: () => { hiss(0.18, 0.03, 2600, 3); tone(1900, 'sine', 0.04, 0.04); },
    hover: () => hiss(0.1, 0.02, 5200, 6),
    click: () => { hiss(0.25, 0.035, 2200, 2); tone(170, 'sine', 0.14, 0.06); },
    probe: () => tone(1320, 'sine', 0.07, 0.07),
    stamp: () => { tone(110, 'sine', 0.7, 0.2, { to: 42 }); hiss(0.35, 0.09, 800, 0.8); },
    reject: () => { tone(330, 'square', 0.05, 0.09); tone(247, 'square', 0.05, 0.13, { delay: 0.11 }); },
    prompt: () => tone(392, 'sine', 0.12, 0.24, { to: 784 }),
  };

  function setOn(next: boolean) {
    on = next;
    if (on && !ctx) init();
    if (ctx) void (on ? ctx.resume() : ctx.suspend());
    btn.setAttribute('aria-pressed', String(on));
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch {}
  }

  window.SFX = {
    play(name) {
      if (!on || !ctx || ctx.state !== 'running' || !SOUNDS[name]) return;
      const now = performance.now();
      if (now - (last[name] || 0) < 40) return; // sin metralla
      last[name] = now; SOUNDS[name]();
    },
    hum(level, rpm = 600) {
      if (!ctx) return;
      const t = ctx.currentTime, v = on ? level : 0;
      humGain.gain.setTargetAtTime(v * 0.05, t, 0.3);
      humBand.frequency.setTargetAtTime(110 + rpm * 0.09, t, 0.3);
      bladeGain.gain.setTargetAtTime(v * 0.008, t, 0.3);
      blade.frequency.setTargetAtTime((rpm / 60) * 7 * 0.5, t, 0.3);
    },
  };

  const onClick = () => { setOn(btn.getAttribute('aria-pressed') !== 'true'); if (on) SOUNDS.click(); };
  btn.addEventListener('click', onClick);

  // el navegador solo deja sonar después de un gesto: si estaba prendido, se arma en el primer toque
  const arm = (e: Event) => {
    disarm();
    if ((e.target as Element | null)?.closest?.('#snd')) return; // el botón decide solo
    if (btn.getAttribute('aria-pressed') === 'true' && !on) setOn(true);
  };
  const disarm = () => {
    removeEventListener('pointerdown', arm, true);
    removeEventListener('keydown', arm, true);
  };
  let saved = '0';
  try { saved = localStorage.getItem(KEY) || '0'; } catch {}
  if (saved === '1') {
    btn.setAttribute('aria-pressed', 'true');
    addEventListener('pointerdown', arm, true);
    addEventListener('keydown', arm, true);
  }

  return () => {
    btn.removeEventListener('click', onClick);
    disarm();
    delete window.SFX;
    ctx?.close();
    btn.setAttribute('aria-pressed', 'false');
  };
}
