// Port literal de Formación; todos los recursos pertenecen a este montaje.
import type { formacionUI } from '@/content/es/formacion';
export function mount(sec: HTMLElement, data: typeof formacionUI): () => void {
/* ---------- formación: medidores con la fecha de hoy ---------- */
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const original = [...sec.querySelectorAll<HTMLElement>('.deg .pct,.deg .left,#rdx,#rdx *')].map(el => ({el, attrs: [...el.attributes].map(a => [a.name, a.value] as const), text: el.matches('.pct,.left,#rdxN') ? el.innerHTML : null}));
const controller = new AbortController(), signal = controller.signal;
const intervals = new Set<ReturnType<typeof setInterval>>(), timers = new Set<ReturnType<typeof setTimeout>>();
const observers: IntersectionObserver[] = [];
const later = (fn: () => void, ms: number) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
const now=new Date();
function meters(){sec.querySelectorAll<HTMLElement>('.deg').forEach(d=>{const p=d.querySelector<HTMLElement>('.pct')!,a=new Date(p.dataset.from!),b=new Date(p.dataset.to!),v=p.dataset.v?+p.dataset.v:Math.min(100,Math.max(0,(+now-+a)/(+b-+a)*100));
  d.querySelector<HTMLElement>('.left')!.textContent=data.daysLeft(Math.max(0,Math.ceil((+b-+now)/864e5)));
  let n=0;const t=setInterval(()=>{n=Math.min(Math.round(v),n+2);p.innerHTML=n+data.percent;if(n>=Math.round(v)){clearInterval(t);intervals.delete(t)}},RM?0:22);intervals.add(t)})}
const meterObserver = new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){meters();o.disconnect()}}),{threshold:.3});
observers.push(meterObserver);meterObserver.observe(sec);

/* ---------- certificados: inclinación hacia el cursor ---------- */
sec.querySelectorAll<HTMLElement>('.tk').forEach(t=>{t.addEventListener('pointerenter',()=>window.SFX?.play('hover'),{signal});t.addEventListener('pointermove',e=>{const r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;t.style.setProperty('--ry',(x-.5)*14+'deg');t.style.setProperty('--rx',(.5-y)*10+'deg');t.style.setProperty('--mx',x*100+'%');t.style.setProperty('--my',y*100+'%')},{signal});t.addEventListener('pointerleave',()=>{t.style.setProperty('--rx','0deg');t.style.setProperty('--ry','0deg')},{signal})});

/* ---------- certificados: fichero giratorio ---------- */
let stopDeck = () => {};
{
  const rdx=sec.querySelector<HTMLElement>('#rdx')!,st=sec.querySelector<HTMLElement>('#rdxStage')!,cards=[...rdx.querySelectorAll<HTMLAnchorElement>('.tk')],N=cards.length,out=sec.querySelector<HTMLElement>('#rdxN')!,kn=rdx.querySelectorAll<HTMLElement>('.kn');
  rdx.classList.add('rdx-on');
  let p=0,goal=0,raf=0,hov=-1,drag: {x:number;y:number;g:number;id:number;on:boolean}|null=null,last=0;
  const wrap=(d:number)=>((d%N)+N*1.5)%N-N/2,front=()=>((Math.round(goal)%N)+N)%N,pad=(n:number)=>String(n).padStart(2,'0');
  function pose(){
    cards.forEach((c,i)=>{
      const d=wrap(i-p);let r,ty=0,o=1,b=1,z;
      if(d>=0){r=d*9;ty=-d*34-(i===hov&&d>.5?16:0);b=1-Math.min(d,3)*.14;o=d>3?Math.max(0,4-d):1;z=50-Math.round(d*10)}
      else{const a=-d;r=-(a<1?a*80:80+(a-1)*4);b=1-Math.min(a,1)*.3-Math.max(0,a-1)*.08;o=a>2?Math.max(0,3-a):1;z=60-Math.round(a*10)}
      c.style.setProperty('--pose',`translateY(${ty.toFixed(1)}px) rotateX(${r.toFixed(2)}deg)`);
      c.style.opacity=o.toFixed(3);c.style.filter=b<.999?`brightness(${b.toFixed(3)})`:'';c.style.zIndex=String(z);c.classList.toggle("dn",d<-.3);c.style.visibility=o<.02?'hidden':'';
    });
    kn.forEach(k=>k.style.transform=`rotate(${(p*-48).toFixed(1)}deg)`);
  }
  function label(){
    const i=front(),c=cards[i];
    cards.forEach((x,j)=>x.classList.toggle('front',j===i));
    out.innerHTML=`<b>${pad(i+1)} / ${pad(N)}</b>${c.querySelector('b')!.textContent} · ${(c.querySelector('img')?.alt||c.querySelector('[aria-label]')?.getAttribute('aria-label')||'').replace(/^./,m=>m.toUpperCase())}`;
  }
  function tick(){
    p+=(goal-p)*(RM?1:drag?.35:.13);if(Math.abs(goal-p)<.002)p=goal;
    const r=Math.round(p);if(r!==last){last=r;window.SFX?.play('key')}
    pose();raf=(p!==goal||drag)?requestAnimationFrame(tick):0;
  }
  const go=()=>{if(!raf)raf=requestAnimationFrame(tick)};
  const set=(g:number)=>{goal=g;label();go()};
  const bring=(i:number)=>set(Math.round(goal)+wrap(i-Math.round(goal)));
  sec.querySelector<HTMLElement>('#rdxPrev')!.addEventListener('click',()=>set(Math.round(goal)-1),{signal});
  sec.querySelector<HTMLElement>('#rdxNext')!.addEventListener('click',()=>set(Math.round(goal)+1),{signal});
  st.addEventListener('keydown',e=>{
    if(e.target!==st)return;
    if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();set(Math.round(goal)+1)}
    else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();set(Math.round(goal)-1)}
    else if(e.key==='Enter'){const c=cards[front()];if(c.href)c.click()}
  },{signal});
  cards.forEach((c,i)=>{
    c.addEventListener('focus',()=>bring(i),{signal});
    c.addEventListener('pointerenter',()=>{hov=i;go()},{signal});
    c.addEventListener('pointerleave',()=>{if(hov===i){hov=-1;go()}},{signal});
    c.addEventListener('click',e=>{if(st.dataset.moved==='1'||i!==front()){e.preventDefault();if(st.dataset.moved!=='1')bring(i)}},{signal});
  });
  st.addEventListener('pointerdown',e=>{if(e.button)return;drag={x:e.clientX,y:e.clientY,g:goal,id:e.pointerId,on:false};st.dataset.moved='0'},{signal});
  st.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!drag.on){if(Math.hypot(dx,dy)<7)return;drag.on=true;st.dataset.moved='1';st.classList.add('drag');st.setPointerCapture(e.pointerId)}
    goal=drag.g+(Math.abs(dy)>Math.abs(dx)?dy/70:-dx/110);go();
  },{signal});
  const end=()=>{if(!drag)return;const was=drag.on;drag=null;st.classList.remove('drag');if(was)set(Math.round(goal));later(()=>{st.dataset.moved='0'},0)};
  st.addEventListener('pointerup',end,{signal});st.addEventListener('pointercancel',end,{signal});
  label();pose();
  if(!RM){p=-N;pose();const intro = new IntersectionObserver((en,ob)=>{if(en[0].isIntersecting){ob.disconnect();go()}},{threshold:.45});observers.push(intro);intro.observe(st)}
  stopDeck = () => { cancelAnimationFrame(raf); if(drag && st.hasPointerCapture(drag.id))st.releasePointerCapture(drag.id);drag=null; };
}


return () => {controller.abort();stopDeck();intervals.forEach(clearInterval);timers.forEach(clearTimeout);observers.forEach(o=>o.disconnect());original.forEach(({el,attrs,text})=>{for(const a of [...el.attributes])el.removeAttribute(a.name);attrs.forEach(([k,v])=>el.setAttribute(k,v));if(text!==null)el.innerHTML=text;});};
}
