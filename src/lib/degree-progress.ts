// Course progress is content. It must not depend on the viewport or animation lifecycle.
export function degreeProgress(from: string | undefined, to: string | undefined, value?: string, now = Date.now()) {
  const start = Date.parse(from ?? ''), end = Date.parse(to ?? '');
  const fixed = value !== undefined && value.trim() !== '' ? Number(value) : null;
  const raw = fixed !== null && Number.isFinite(fixed) ? fixed
    : Number.isFinite(start) && Number.isFinite(end) && end > start ? (now - start) / (end - start) * 100 : null;
  return {
    percent: raw === null ? null : Math.round(Math.min(100, Math.max(0, raw))),
    daysLeft: Number.isFinite(end) ? Math.max(0, Math.ceil((end - now) / 864e5)) : null,
  };
}

// Put actual values in the server HTML as well as refreshing them when the client mounts.
export function withDegreeProgress(html: string, lang: 'es' | 'en') {
  return html.replace(/(<div class="pct"([^>]*)>)[\s\S]*?(<\/div>)/g, (_match, _open: string, attrs: string, close: string) => {
    const attr = (name: string) => new RegExp(`data-${name}="([^"]*)"`).exec(attrs)?.[1];
    const { percent } = degreeProgress(attr('from'), attr('to'), attr('v'));
    const label = attr('v') !== undefined
      ? lang === 'en' ? 'Course progress' : 'Avance de materias'
      : lang === 'en' ? 'Estimated progress based on study dates' : 'Avance estimado según las fechas de estudio';
    const semantics = percent === null ? '' : ` role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" aria-label="${label}" title="${label}"`;
    return `<div class="pct"${attrs}${semantics}>${percent === null ? '—' : `${percent}<sup>%</sup>`}${close}`;
  });
}
