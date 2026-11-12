'use client';
import { useState } from 'react';
import type { Lang } from '@/content/lang';
import { aporto } from '@/content/aporto';

// Edificio de empresa: el piso de arriba es el último del array, como en un edificio real se cuenta desde abajo.
export function DondeAporto({ lang }: { lang: Lang }) {
  const t = aporto[lang];
  const [on, setOn] = useState(0);
  const a = t.areas[on];
  const pad = (n: number) => String(n).padStart(2, '0');
  const pick = (i: number) => { if (i !== on) { setOn(i); window.SFX?.play('hover'); } };
  return (
    <section id="aporto" className="aporto" data-tone="#FF6A2A">
      <div className="wrap">
        <div className="ehead ink-safe">
          <h2 className="dec" dangerouslySetInnerHTML={{ __html: t.title }} />
          <p className="lead2" dangerouslySetInnerHTML={{ __html: t.lead }} />
        </div>
        <div className="ap-grid">
          <div className="tower" role="group" aria-label={t.aria}>
            <span className="roof" aria-hidden="true"><i /></span>
            {t.areas.map((x, i) => ({ x, i })).reverse().map(({ x, i }) => (
              <button key={x.n} type="button" className={'ap-fl' + (i === on ? ' on' : '')} aria-pressed={i === on}
                onClick={() => pick(i)} onMouseEnter={() => pick(i)} onFocus={() => pick(i)}>
                <span className="mono fn">{t.floor} {pad(i + 1)}</span>
                <span className="fa">{x.n}</span>
                <span className="win" aria-hidden="true">{Array.from({ length: 6 }, (_, k) => <i key={k} style={{ ['--k' as string]: k }} />)}</span>
              </button>
            ))}
            <span className="base" aria-hidden="true" />
          </div>
          <div className="ap-card ink-safe" aria-live="polite">
            <span className="mono ap-n">{pad(on + 1)} / {pad(t.areas.length)}</span>
            <h3>{a.n}</h3>
            <p>{a.does}</p>
            <a className="ap-proof" href={a.href}><span className="mono">{t.proofLabel}</span>{a.proof} <b aria-hidden="true">↓</b></a>
          </div>
        </div>
        <div className="ap-traits ink-safe">
          <span className="mono">{t.traitsLabel}</span>
          <ul>{t.traits.map((x) => <li key={x.t}><b>{x.t}</b><span>{x.p}</span></li>)}</ul>
        </div>
      </div>
    </section>
  );
}
