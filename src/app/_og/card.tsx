import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

// Tarjeta de 1200 x 630 que se ve al compartir el link. Se genera en el build, una por idioma.
// Satori no lee WOFF2 ni fuentes variables: van instancias WOFF estáticas en esta carpeta.
export const size = { width: 1200, height: 630 };

const C = { bk: '#09090A', paper: '#FFF2DE', soft: '#FFC98F', or: '#FF5A14', hz: '#FFD23F' };

const copy = {
  es: {
    loc: 'PANAMÁ · 8.98° N, 79.52° O',
    line: 'Ingeniería industrial e IA aplicada',
    sub: 'Agentes de IA · automatización · procesos',
    stk: ['1.ER LUGAR · 91 EQUIPOS', 'AI Hackathon Philips LATAM 2026'],
  },
  en: {
    loc: 'PANAMA · 8.98° N, 79.52° W',
    line: 'Industrial engineering and applied AI',
    sub: 'AI agents · automation · processes',
    stk: ['1ST PLACE · 91 TEAMS', 'Philips LATAM AI Hackathon 2026'],
  },
} as const;

export const alt = {
  es: 'Martín Bundy, ingeniería industrial e IA aplicada',
  en: 'Martín Bundy, industrial engineering and applied AI',
} as const;

const here = (f: string) => join(process.cwd(), 'src/app/_og', f);

export async function ogCard(lang: 'es' | 'en') {
  const t = copy[lang];
  const [wide, body, mono, photo] = await Promise.all([
    readFile(here('archivo-900-125.woff')),
    readFile(here('archivo-500-100.woff')),
    readFile(here('plexmono-500.woff')),
    sharp(join(process.cwd(), 'public/img/martin-hero.webp')).resize({ width: 440 }).png().toBuffer(),
  ]);
  const src = `data:image/png;base64,${photo.toString('base64')}`;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: C.bk, position: 'relative' }}>
        {/* Disco del hero detrás de la foto */}
        <div
          style={{
            position: 'absolute',
            left: 718,
            top: 92,
            width: 440,
            height: 440,
            borderRadius: 999,
            background: C.or,
          }}
        />
        {/* Satori pinta <img>; next/image no aplica dentro de ImageResponse */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={440} height={661} style={{ position: 'absolute', left: 718, top: 40 }} />

        <div
          style={{
            position: 'absolute',
            left: 72,
            top: 64,
            display: 'flex',
            flexDirection: 'column',
            width: 620,
          }}
        >
          <div style={{ fontFamily: 'Plex', fontSize: 20, letterSpacing: 2.4, color: C.hz }}>{t.loc}</div>
          <div
            style={{
              fontFamily: 'Wide',
              fontSize: 118,
              lineHeight: 0.84,
              letterSpacing: -3,
              color: C.paper,
              marginTop: 34,
            }}
          >
            MARTÍN
          </div>
          <div
            style={{
              fontFamily: 'Wide',
              fontSize: 118,
              lineHeight: 0.84,
              letterSpacing: -3,
              color: C.bk,
              WebkitTextStroke: `5px ${C.or}`,
              marginTop: 6,
            }}
          >
            BUNDY
          </div>
          <div style={{ fontFamily: 'Body', fontSize: 34, color: C.paper, marginTop: 40, lineHeight: 1.15 }}>
            {t.line}
          </div>
          <div style={{ fontFamily: 'Body', fontSize: 26, color: C.soft, marginTop: 12 }}>{t.sub}</div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 72,
            bottom: 52,
            fontFamily: 'Plex',
            fontSize: 20,
            letterSpacing: 1,
            color: C.soft,
          }}
        >
          portfolio-eitinchos-projects.vercel.app
        </div>

        {/* Sello del hero: bloque sólido, sin halo */}
        <div
          style={{
            position: 'absolute',
            left: 690,
            top: 470,
            display: 'flex',
            flexDirection: 'column',
            background: C.hz,
            color: C.bk,
            padding: '14px 22px',
            borderRadius: 12,
            transform: 'rotate(-3deg)',
          }}
        >
          <div style={{ fontFamily: 'Plex', fontSize: 18, letterSpacing: 1.6 }}>{t.stk[0]}</div>
          <div style={{ fontFamily: 'Body', fontSize: 24, marginTop: 4, wordSpacing: -2 }}>{t.stk[1]}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Wide', data: wide, weight: 900, style: 'normal' },
        { name: 'Body', data: body, weight: 500, style: 'normal' },
        { name: 'Plex', data: mono, weight: 500, style: 'normal' },
      ],
    },
  );
}
