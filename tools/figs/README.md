# Generadores de figuras

Requieren la skill `anatomy` instalada en `~/.claude/skills/anatomy`, con
`kit/iso-kit.mjs` y `scripts/inline-kit.mjs`. No descargan dependencias.

Desde la raíz de `portfolio/`:

```sh
node tools/figs/poguru.mjs
node tools/figs/laptop.mjs
node tools/figs/formacion.mjs
```

Cada generador escribe su fragmento `<nombre>.es.html`, su runtime
`<nombre>.js` y los estilos compartidos `iso.css` en `public/fig/`.
Los fragmentos no incluyen una página envolvente. Los logos se leen de
`public/img/logos/`. Los generadores no leen ni modifican la maqueta.
