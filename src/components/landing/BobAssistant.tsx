'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Lang } from '@/content/lang';
import { bobCopy } from '@/content/bob';
import './bob-assistant.css';

type Message = { role: 'user' | 'assistant'; content: string };
const styles = ['toon', 'voxel', 'dibujo', 'pixel'] as const;
const styleNames = ['3D', 'Vox', 'Cartoon', 'Pixel'];

export function BobAssistant({ lang }: { lang: Lang }) {
  const c = bobCopy[lang];
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState<number | null>(null);
  const [free, setFree] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [style, setStyle] = useState<(typeof styles)[number]>('toon');
  const selectedStyle = useRef<(typeof styles)[number]>('toon');
  const panel = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const avatar = useRef<HTMLIFrameElement>(null);
  const guidedTitle = useRef<HTMLHeadingElement>(null);
  const returnToQuestions = useRef(false);
  const log = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);

  const sendAvatar = (type: string, value: string) => avatar.current?.contentWindow?.postMessage({ type, value }, location.origin);
  const stop = () => { request.current?.abort(); request.current = null; setBusy(false); };
  const close = () => { stop(); setOpen(false); panel.current?.close(); launcher.current?.focus({ preventScroll: true }); };
  const go = (section: string) => {
    close();
    const target = document.getElementById(section);
    target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    const heading = target?.querySelector<HTMLElement>('h2');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  };

  // The launcher tucks away while the visitor scrolls down reading, so it never sits on top of text,
  // and comes back on the first scroll up, at the top and at the end of the page.
  useEffect(() => {
    let last = scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const btn = launcher.current;
      const y = scrollY;
      if (!btn || Math.abs(y - last) < 8) return;
      const end = y + innerHeight >= document.documentElement.scrollHeight - 120;
      btn.toggleAttribute('data-tucked', y > last && y > 240 && !end && document.activeElement !== btn);
      last = y;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!open || !panel.current) return;
    const dialog = panel.current;
    const mobile = matchMedia('(max-width: 700px)');
    const show = () => {
      // Native modal focus containment on phones; a nonmodal side panel on desktop.
      if (dialog.open) dialog.close();
      if (mobile.matches) dialog.showModal(); else dialog.show();
    };
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); request.current?.abort(); request.current = null; setBusy(false); setOpen(false); dialog.close(); launcher.current?.focus({ preventScroll: true }); } };
    const ready = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.source !== avatar.current?.contentWindow) return;
      if (e.data?.type === 'bob-close') escape(new KeyboardEvent('keydown', { key: 'Escape' }));
      if (e.data?.type === 'bob-ready') {
        avatar.current?.contentWindow?.postMessage({ type: 'bob-style', value: selectedStyle.current }, location.origin);
      }
    };
    show();
    mobile.addEventListener('change', show);
    window.addEventListener('keydown', escape);
    window.addEventListener('message', ready);
    return () => { mobile.removeEventListener('change', show); window.removeEventListener('keydown', escape); window.removeEventListener('message', ready); if (dialog.open) dialog.close(); };
  }, [open]);

  useEffect(() => () => { request.current?.abort(); }, []);
  useEffect(() => {
    if (!open) return;
    if (question !== null) guidedTitle.current?.focus({ preventScroll: true });
    else if (returnToQuestions.current) {
      returnToQuestions.current = false;
      panel.current?.querySelector<HTMLButtonElement>('[data-bob-question]')?.focus({ preventScroll: true });
    }
  }, [open, question]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy, question]);

  async function ask(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const history = [...messages.filter(m => m.content.trim()).slice(-10).map(m => ({ ...m, content: m.content.slice(0, 1000) })), { role: 'user' as const, content: text }];
    setMessages(history); setInput(''); setError(''); setAnnouncement(''); setBusy(true); sendAvatar('bob-state', 'signal');
    const controller = new AbortController(); request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history, language: lang }), signal: controller.signal });
      if (!response.ok) { setError(response.status === 429 ? c.limited : c.unavailable); return; }
      if (!response.body) throw new Error('Missing stream');
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = '';
      setMessages([...history, { role: 'assistant', content: '' }]);
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          setMessages([...history, { role: 'assistant', content: answer }]);
        }
        answer += decoder.decode();
        if (!answer.trim()) throw new Error('Empty stream');
        setMessages([...history, { role: 'assistant', content: answer }]);
        setAnnouncement(c.ai + ': ' + answer);
      } finally { reader.releaseLock(); }
      sendAvatar('bob-state', 'ok');
    } catch {
      if (request.current === controller) setError(c.unavailable);
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) { request.current = null; setBusy(false); sendAvatar('bob-state', 'idle'); }
    }
  }

  return <div className="bob-assistant" lang={lang}>
    <button ref={launcher} className="bob-launcher" data-bob-launcher aria-controls="bob-panel" aria-expanded={open} onClick={() => open ? close() : setOpen(true)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/bob/bob.webp" width="64" height="64" alt="" /><span><b>BoB</b><small>{c.open}</small></span>
    </button>
    <dialog ref={panel} id="bob-panel" className="bob-panel" aria-labelledby="bob-title" onCancel={e => { e.preventDefault(); close(); }}>
      <div className="bob-sr" data-bob-announcement aria-live="polite" aria-atomic="true">{announcement}</div>
      {open && <>
        <header className="bob-header"><div><b>BoB<span> · {c.subtitle}</span></b></div><button className="bob-close" aria-label={c.close} onClick={close}><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" /></svg></button></header>
        <div className="bob-intro"><div><h2 id="bob-title">{c.title}</h2><p>{c.intro}</p></div><iframe ref={avatar} src="/bob/avatar.html" title="BoB" tabIndex={-1} aria-hidden="true" /></div>
        <div className="bob-styles" role="group" aria-label={c.style}>{styles.map((s, i) => <button key={s} aria-pressed={style === s} onClick={() => { selectedStyle.current = s; setStyle(s); sendAvatar('bob-style', s); }}>{styleNames[i]}</button>)}</div>
        <div className="bob-scroll" ref={log}>
          {question === null ? <div className="bob-questions">{c.questions.map((q, i) => <button key={q.section + i} data-bob-question onClick={() => { setQuestion(i); sendAvatar('bob-state', 'ok'); }}><span>{q.question}</span><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg></button>)}</div> : <article className="bob-answer" data-bob-answer><small>{c.guided}</small><h3 ref={guidedTitle} tabIndex={-1}>{c.questions[question].question}</h3><p>{c.questions[question].answer}</p><button className="bob-go" onClick={() => go(c.questions[question!].section)}>{c.see}<span>{c.questions[question].evidence}</span></button><button className="bob-back" onClick={() => { returnToQuestions.current = true; setQuestion(null); }}>{c.back}</button></article>}
          {free && <div className="bob-conversation" aria-label={c.free}>{messages.map((m, i) => <div className={'bob-message ' + m.role} key={i}><small>{m.role === 'user' ? (lang === 'es' ? 'Tú' : 'You') : c.ai}</small><p>{m.content}</p></div>)}{busy && <p role="status">{c.thinking}</p>}{error && <p className="bob-error" role="alert">{error}</p>}</div>}
        </div>
        <footer className="bob-footer">{!free ? <button className="bob-free" onClick={() => setFree(true)}>{c.free}</button> : <form onSubmit={ask}><label className="bob-input-label" htmlFor="bob-input">{c.free}</label><div className="bob-compose"><textarea id="bob-input" rows={2} maxLength={1000} placeholder={c.placeholder} value={input} onChange={e => setInput(e.target.value)} /><button type={busy ? 'button' : 'submit'} disabled={!busy && !input.trim()} onClick={busy ? stop : undefined}>{busy ? c.stop : c.send}</button></div></form>}<p>{c.disclosure}</p></footer>
      </>}
    </dialog>
  </div>;
}
