# Generadores de figuras

Requieren la skill `anatomy` instalada en `~/.claude/skills/anatomy`, con
`kit/iso-kit.mjs` y `scripts/inline-kit.mjs`. No descargan dependencias.

Desde la raíz de `portfolio/`:

```sh
node tools/figs/poguru.mjs
node tools/figs/laptop.mjs
node tools/figs/formacion.mjs
```

Cada comando genera **los dos idiomas**: fragmentos `<nombre>.es.html` y
`<nombre>.en.html`, runtimes `<nombre>.es.js` y `<nombre>.en.js`, y los estilos
compartidos `iso.css` en `public/fig/`. También mantiene `<nombre>.js` como
copia del runtime ES para compatibilidad. `IsoFigure` carga el runtime de su idioma.
Los fragmentos no incluyen una página envolvente. El runtime exporta
`mount()`, que devuelve la limpieza (`as-module.mjs`); la página lo importa
una vez y lo monta cada vez que pone el fragmento (`IsoFigure`). Los logos se leen de
`public/img/logos/`. Los generadores no leen ni modifican la maqueta.

Los textos estáticos, accesibles y de runtime están en
`strings/{poguru,laptop,formacion}.mjs`, con la tabla `{ es, en }` por figura.
**EN es por ahora una copia exacta de ES; lo traduce Claude.** Editar esas tablas
y volver a ejecutar los tres comandos regenera todos los archivos. No editar a mano
`public/fig/`. La extracción conserva los fragmentos ES originales byte a byte;
geometría, colores, tiempos, ids, clases y API `mount()` no dependen del idioma.
Al traducir, conservar los placeholders (`{fields}`, `{day}`, `{count}`, etc.),
las rutas/comandos del ejemplo y las leyendas del teclado físico indicadas en comentarios.
