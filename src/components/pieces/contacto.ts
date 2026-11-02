// Port de Contacto: mensajes, canales, tarjeta y vCard. Datos públicos en content/es.
import type { contactoUI } from '@/content/es/contacto';
export function mount(sec: HTMLElement, data: typeof contactoUI): () => void {
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(pointer:fine)').matches;
const controller=new AbortController(),signal=controller.signal;
const original=[...sec.querySelectorAll<HTMLElement>('#sSub,#sBody,#bMail,#bCal,#idc,#chan .kc,#vcf')].map(el=>({el,attrs:[...el.attributes].map(a=>[a.name,a.value] as const),text:el.matches('#sSub,#sBody')?el.innerHTML:null}));
const timers=new Set<ReturnType<typeof setTimeout>>();
const later=(fn:()=>void,ms:number)=>{const id=setTimeout(()=>{timers.delete(id);fn()},ms);timers.add(id)};
let objectURL: string | null=null;
/* ---------- contacto: arma el mensaje y lo manda por correo o agenda llamada ---------- */
const BOOK=data.booking;
const fName=sec.querySelector<HTMLInputElement>('#fName')!,fCo=sec.querySelector<HTMLInputElement>('#fCo')!,fMsg=sec.querySelector<HTMLTextAreaElement>('#fMsg')!,bMail=sec.querySelector<HTMLAnchorElement>('#bMail')!,bCal=sec.querySelector<HTMLAnchorElement>('#bCal')!;
function compose(){const n=fName.value.trim(),c=fCo.value.trim(),w=sec.querySelector<HTMLInputElement>('.why input:checked')!.value,m=fMsg.value.trim();
  const sub=data.subject(w,c,n);
  const body=data.body(n,c,m);
  sec.querySelector<HTMLElement>('#sSub')!.textContent=sub;sec.querySelector<HTMLElement>('#sBody')!.textContent=body;
  bMail.href=`mailto:${data.email}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;bMail.classList.toggle('off',!n);bCal.href=BOOK}
sec.querySelector<HTMLElement>('#cform')!.addEventListener('input',compose,{signal});compose();

// la cara visible sale del ángulo real del giro (cos < 0 = reverso), no de backface-visibility
const idc=sec.querySelector<HTMLElement>('#idc')!,idIn=idc.querySelector<HTMLElement>('.in')!;let idT=0;
const idSide=()=>{const s=getComputedStyle(idIn).transform;idc.classList.toggle('bk',s!=='none'&&new DOMMatrix(s).m11<0)};
const flip=()=>{idc.classList.toggle('flip');const t0=performance.now();cancelAnimationFrame(idT);
  const tick=()=>{idSide();if(performance.now()-t0<1100)idT=requestAnimationFrame(tick)};tick()};
idc.addEventListener('click',e=>{if(!(e.target as Element).closest('a'))flip()},{signal});idc.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}},{signal});

/* ---------- teclado de canales: luz de fondo que sigue al cursor, la tecla de abajo se inclina, se hunde al tocarla ---------- */
{const chan=sec.querySelector<HTMLElement>('#chan')!,kcs=[...chan.querySelectorAll<HTMLElement>('.kc')];
  if(FINE&&!RM){chan.addEventListener('pointermove',e=>{kcs.forEach(k=>{const r=k.getBoundingClientRect(),lx=e.clientX-r.left,ly=e.clientY-r.top,
      d=Math.hypot(Math.max(r.left-e.clientX,0,e.clientX-r.right),Math.max(r.top-e.clientY,0,e.clientY-r.bottom)),inside=d===0;
      k.style.setProperty('--lx',lx+'px');k.style.setProperty('--ly',ly+'px');k.style.setProperty('--lo',Math.max(0,1-d/220).toFixed(2));
      k.style.setProperty('--rx',inside?((.5-ly/r.height)*8).toFixed(1)+'deg':'0deg');k.style.setProperty('--ry',inside?((lx/r.width-.5)*8).toFixed(1)+'deg':'0deg')})},{signal});
    chan.addEventListener('pointerleave',()=>kcs.forEach(k=>{k.style.setProperty('--lo','0');k.style.setProperty('--rx','0deg');k.style.setProperty('--ry','0deg')}),{signal})}
  kcs.forEach(k=>{k.addEventListener('pointerenter',()=>window.SFX?.play('key'),{signal});k.addEventListener('pointerdown',()=>{window.SFX?.play('click');k.classList.add('down');later(()=>k.classList.remove('down'),160)},{signal})})}

/* ---------- tarjeta: se inclina con el cursor (máx. 6°) y el brillo holográfico lo sigue ---------- */
if(FINE&&!RM){idc.addEventListener('pointermove',e=>{const r=idc.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    idc.style.setProperty('--tx',((.5-y)*12).toFixed(2)+'deg');idc.style.setProperty('--ty',((x-.5)*12).toFixed(2)+'deg');
    idc.style.setProperty('--sx',(x*100).toFixed(1)+'%');idc.style.setProperty('--sy',(y*100).toFixed(1)+'%');idc.style.setProperty('--sa',(x*240).toFixed(0)+'deg');idc.style.setProperty('--so','0.8')},{signal});
  idc.addEventListener('pointerleave',()=>{['--tx','--ty','--sx','--sy','--sa','--so'].forEach(p=>idc.style.removeProperty(p))},{signal})}

/* ---------- guardar contacto: vCard armada en el navegador ---------- */
sec.querySelector<HTMLElement>('#vcf')!.addEventListener('click',e=>{e.stopPropagation();const v=data.vcard.join('\r\n');
  if(objectURL)URL.revokeObjectURL(objectURL);objectURL=URL.createObjectURL(new Blob([v],{type:'text/vcard'}));(e.currentTarget as HTMLAnchorElement).href=objectURL},{signal});

return ()=>{controller.abort();cancelAnimationFrame(idT);timers.forEach(clearTimeout);if(objectURL)URL.revokeObjectURL(objectURL);original.forEach(({el,attrs,text})=>{for(const a of [...el.attributes])el.removeAttribute(a.name);attrs.forEach(([k,v])=>el.setAttribute(k,v));if(text!==null)el.innerHTML=text;});};
}
