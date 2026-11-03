// Fondo vivo (WebGL), portado de la maqueta: tinta que fluye con el color del capítulo, el cursor la revuelve,
// el scroll la arrastra; encima, la rejilla de puntos se enciende donde pasa la tinta y hace ondas al hacer clic.
// mount() devuelve la limpieza: rAF, listeners, observer y recursos de GL.

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS = `precision mediump float;uniform vec2 R,M;uniform float T,D,S,A;uniform vec3 C;uniform vec3 W[4];
  uniform vec4 K[24];uniform int KN;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
  void main(){vec2 f=gl_FragCoord.xy,p=f;p.y+=S;
    float safe=1.;for(int i=0;i<24;i++){if(i>=KN)break;
      vec2 outside=max(max(K[i].xy-f,f-K[i].zw),vec2(0.));
      safe=min(safe,smoothstep(12.*D,24.*D,length(outside)));}
    vec2 m=M;m.y+=S;
    vec2 uv=p/R.y,mu=m/R.y,q=uv*1.5;float du=distance(uv,mu);
    vec2 w=vec2(fbm(q+vec2(T*.03,0.)),fbm(q+vec2(5.2,1.3)-T*.025));
    w+=(uv-mu)*smoothstep(.5,0.,du)*1.2*A;
    float raw=fbm(q+w*1.9),ink=smoothstep(.42,.86,raw);
    float vein=smoothstep(.035,0.,abs(raw-.6))*.8;
    float glow=smoothstep(.6,0.,du)*A;
    float tint=mix(.35,1.,safe);ink*=tint;vein*=tint;glow*=tint;
    vec3 col=vec3(.03,.03,.034)+C*(ink*.2+vein*.16+glow*.07);
    float cell=22.*D;vec2 g=floor(p/cell),c=(g+.5)*cell;
    float dm=distance(c,m),push=smoothstep(260.*D,0.,dm)*A;
    float wave=0.;for(int i=0;i<4;i++){float age=T-W[i].z;if(age>0.&&age<3.){float d=distance(c,vec2(W[i].x,W[i].y+S));wave+=exp(-pow((d-age*620.*D)/(50.*D),2.))*exp(-age*1.3);}}
    push*=safe;wave=min(wave,1.)*safe;
    c+=normalize(c-m+.001)*push*7.*D;
    float r=cell*(.05+.07*ink+.26*push+.3*wave);
    float a=smoothstep(r,r-1.2*D,length(p-c))*safe;
    col+=C*a*(.1+.55*ink+.6*push+.9*wave);
    vec2 v=f/R-.5;col*=1.-.55*dot(v,v);
    gl_FragColor=vec4(col,1.);}`;

const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);

export function mount(cv: HTMLCanvasElement): () => void {
  const gl = cv.getContext('webgl', { premultipliedAlpha: false, antialias: false });
  if (!gl) return () => {};
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sh = (t: number, s: string) => {
    const o = gl.createShader(t)!;
    gl.shaderSource(o, s);
    gl.compileShader(o);
    return o;
  };
  const vs = sh(gl.VERTEX_SHADER, VS);
  const fs = sh(gl.FRAGMENT_SHADER, FS);
  const pr = gl.createProgram()!;
  gl.attachShader(pr, vs);
  gl.attachShader(pr, fs);
  gl.linkProgram(pr);
  gl.useProgram(pr);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = (k: string) => gl.getUniformLocation(pr, k);
  const uR = U('R'), uM = U('M'), uT = U('T'), uD = U('D'), uS = U('S'), uC = U('C'), uW = U('W'), uA = U('A');
  const uK = U('K[0]'), uKN = U('KN');
  const safeBlocks = [...document.querySelectorAll<HTMLElement>('.ink-safe')];
  const rects = new Float32Array(24 * 4);
  let boundsDirty = true;
  let act = 0, last = -9;
  let dpr = 1, mx = -9999, my = -9999, tx = -9999, ty = -9999;
  const waves = new Float32Array(12).fill(-99);
  let wi = 0;
  let col = hex('#FF5A14'), tcol = col.slice();

  let raf = 0, dirty = true;
  const loop = () => {
    if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
  };

  const invalidateBounds = () => {
    boundsDirty = true;
    dirty = true;
    loop();
  };
  // Read layout only after scroll, resize or a block's content changes size, once per rAF.
  // Shader coordinates use the fixed canvas, not the grid's scroll-adjusted coordinates.
  const updateBounds = () => {
    let count = 0;
    for (const block of safeBlocks) {
      const r = block.getBoundingClientRect();
      if (!r.width || !r.height || r.bottom < -24 || r.top > innerHeight + 24 || r.right < -24 || r.left > innerWidth + 24) continue;
      rects.set([r.left * dpr, cv.height - r.bottom * dpr, r.right * dpr, cv.height - r.top * dpr], count * 4);
      if (++count === 24) break;
    }
    gl.uniform4fv(uK, rects);
    gl.uniform1i(uKN, count);
    boundsDirty = false;
  };
  const ro = new ResizeObserver(invalidateBounds);
  safeBlocks.forEach((block) => ro.observe(block));
  ro.observe(document.documentElement);

  function size() {
    dpr = Math.min(devicePixelRatio, 1.25);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    gl!.viewport(0, 0, cv.width, cv.height);
    boundsDirty = true;
    dirty = true;
    loop();
  }
  const onMove = (e: PointerEvent) => {
    tx = e.clientX * dpr;
    ty = (innerHeight - e.clientY) * dpr;
    last = performance.now();
  };
  const onDown = (e: PointerEvent) => {
    waves.set([e.clientX * dpr, (innerHeight - e.clientY) * dpr, performance.now() / 1000], wi * 3);
    wi = (wi + 1) % 4;
  };

  // cada sección declara su tono en data-tone; el fondo se mezcla hacia él. Solo secciones: las figuras isométricas usan
  // data-tone para su sombreado (faint, lo, mid...) y, observadas, dejaban el color en NaN y el fondo en negro
  // (bug de la maqueta).
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => {
      const tone = (e.target as HTMLElement).dataset.tone;
      if (e.isIntersecting && tone) {
        tcol = hex(tone);
        loop();
      }
    }),
    { rootMargin: '-45% 0px -45% 0px' },
  );
  document.querySelectorAll('section[data-tone]').forEach((s) => io.observe(s));

  // con la pestaña oculta no dibuja; con movimiento reducido dibuja solo mientras cambia de color o de tamaño (un cuadro quieto)
  function frame(ms: number) {
    raf = 0;
    const t = ms / 1000;
    if (mx < -9000) { mx = tx; my = ty; }
    mx += (tx - mx) * 0.12;
    my += (ty - my) * 0.12;
    const dc = col.reduce((s, v, i) => s + Math.abs(tcol[i] - v), 0);
    col = col.map((v, i) => v + (tcol[i] - v) * 0.04);
    act += ((performance.now() - last < 1400 ? 1 : 0) - act) * 0.05;
    gl!.uniform2f(uR, cv.width, cv.height);
    gl!.uniform2f(uM, RM ? -9999 : mx, RM ? -9999 : my);
    gl!.uniform1f(uT, RM ? 7 : t);
    gl!.uniform1f(uD, dpr);
    gl!.uniform1f(uA, RM ? 0 : act);
    gl!.uniform1f(uS, RM ? 0 : scrollY * dpr * 0.25);
    gl!.uniform3fv(uC, col);
    gl!.uniform3fv(uW, waves);
    if (boundsDirty) updateBounds();
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    if (RM) {
      if (dirty || dc > 0.004) {
        dirty = false;
        loop();
      }
      return;
    }
    loop();
  }

  size();
  addEventListener('resize', size);
  addEventListener('scroll', invalidateBounds, { passive: true, capture: true });
  addEventListener('pointermove', onMove);
  addEventListener('pointerdown', onDown);
  document.addEventListener('visibilitychange', loop);
  loop();

  return () => {
    cancelAnimationFrame(raf);
    raf = 0;
    io.disconnect();
    ro.disconnect();
    removeEventListener('resize', size);
    removeEventListener('scroll', invalidateBounds, true);
    removeEventListener('pointermove', onMove);
    removeEventListener('pointerdown', onDown);
    document.removeEventListener('visibilitychange', loop);
    // sin loseContext: el canvas es el mismo si React vuelve a montar (StrictMode) y el contexto perdido no vuelve
    gl.deleteBuffer(buf);
    gl.deleteProgram(pr);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };
}
