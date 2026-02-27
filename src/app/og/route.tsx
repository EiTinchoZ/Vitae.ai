import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') ?? 'es';

  const title =
    lang === 'en'
      ? 'Industrial Engineering & AI Technical Specialist'
      : 'Ing. Industrial & Tecnico Superior en IA';

  const slogan =
    lang === 'en' ? 'Your career, powered by AI' : 'Tu carrera, potenciada por IA';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2E4036 45%, #1A1A1A 100%)',
          padding: '60px 80px',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(204,88,51,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(204,88,51,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(204,88,51,0.14)',
            border: '1px solid rgba(204,88,51,0.30)',
            borderRadius: '999px',
            padding: '10px 26px',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: '#CC5833', fontSize: 20, fontWeight: 700 }}>Vitae.ai</span>
          <span style={{ color: '#755248', fontSize: 20 }}>|</span>
          <span style={{ color: '#B2AFA4', fontSize: 20 }}>{slogan}</span>
        </div>

        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2E4036 0%, #CC5833 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            fontSize: 38,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-1px',
          }}
        >
          MB
        </div>

        <div
          style={{
            fontSize: 66,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-1.5px',
            textAlign: 'center',
            lineHeight: 1.05,
          }}
        >
          Martin Bundy
        </div>

        <div
          style={{
            fontSize: 24,
            color: '#D0CDC3',
            marginTop: 14,
            textAlign: 'center',
            maxWidth: 620,
            lineHeight: 1.4,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 36,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {['Machine Learning', 'Deep Learning', 'Gen AI', 'Hackathon Winner 2024'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(204,88,51,0.16)',
                border: '1px solid rgba(204,88,51,0.30)',
                borderRadius: 24,
                padding: '8px 18px',
                color: '#F2F0E9',
                fontSize: 17,
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            color: '#AEA99A',
            fontSize: 17,
          }}
        >
          <span style={{ color: '#C4C0B4' }}>Panama</span>
          <span>|</span>
          <span style={{ color: '#C4C0B4' }}>ES / EN (C2)</span>
          <span>|</span>
          <span style={{ color: '#CC5833', fontWeight: 600 }}>vitae.lat</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
