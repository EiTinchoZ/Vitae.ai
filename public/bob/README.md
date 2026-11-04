# BoB · CV assistant

Character artwork and runtime reused from `tincho-ia-web/maqueta/v3/bob.js`.
The plush launcher comes from that project's `web/public/assets/v9/bob-plush.webp`.
The four existing styles are toon (3D), voxel, dibujo (Cartoon), and pixel.

The single adaptation to the original runtime is the toon gradient texture:
RGB bytes were expanded to RGBA for compatibility with the installed Three r170.
No character geometry, colors or proportions were redesigned.

`three.module.js` is copied from the installed `three@0.170.0/build/three.module.js`.
Its MIT license is in `THREE-LICENSE.txt`. Keep this module aligned with package.json.
It loads only when opening the assistant, inside an iframe. Closing the assistant
destroys that document and its original animation loop, listeners and observers.
The frame accepts only known style/state messages from its same-origin parent.

Guided answer copy is in `src/content/bob.ts`; the React panel lives in
`src/components/landing/BobAssistant.tsx`. AI requests reuse `/api/chat` and its
existing guard. No new provider, account, dependency, or external request is added.
