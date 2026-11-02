// 404 y error: mismo negro, crema y naranja que la landing, sin Tailwind.
// Va como <style> de React 19 y no como import: un .css importado desde error.tsx de la raíz se precarga
// en todas las rutas y Chrome avisa en consola que no se usó.
const css = `body{margin:0;background:var(--color-bk)}\n.sys{min-height:100svh;display:grid;place-content:center;justify-items:start;gap:18px;padding:40px;background:var(--color-bk);color:var(--color-paper);font:400 17px/1.5 var(--font-display)}\n.sys small{font:500 12.5px var(--font-data);letter-spacing:.12em;text-transform:uppercase;color:var(--color-hz)}\n.sys h1{margin:0;font-weight:850;font-size:clamp(36px,5vw,76px);line-height:.93;letter-spacing:-.025em;font-variation-settings:"wdth" 115;max-width:16ch}\n.sys h1 em{font-style:normal;color:var(--color-or)}\n.sys a,.sys button{display:inline-flex;align-items:center;height:44px;padding:0 20px;border:0;border-radius:999px;background:var(--color-or);color:var(--color-bk);font:600 13px var(--font-data);letter-spacing:.1em;text-transform:uppercase;text-decoration:none;cursor:pointer;transition:transform .25s var(--ease-spring)}\n.sys a:hover,.sys button:hover{transform:translateY(-2px)}\n.sys a:focus-visible,.sys button:focus-visible{outline:3px solid var(--color-or);outline-offset:3px}`;

export function SystemStyle() {
  return (
    <style href="vitae-sys" precedence="default">
      {css}
    </style>
  );
}
