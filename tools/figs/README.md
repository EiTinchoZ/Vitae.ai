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
Los fragmentos no incluyen una página envolvente. El runtime exporta
`mount()`, que devuelve la limpieza (`as-module.mjs`); la página lo importa
una vez y lo monta cada vez que pone el fragmento (`IsoFigure`). Los logos se leen de
`public/img/logos/`. Los generadores no leen ni modifican la maqueta.
