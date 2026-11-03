// Textos visibles y accesibles de PO Guru; la estructura y el movimiento viven en el generador.
const es = {
  // Campos de ejemplo; runtime: nombres de los datos faltantes.
  fields: ["Solicitante", "Descripción", "Proveedor", "Cantidad", "Precio", "Moneda", "Lugar de entrega", "Fecha de entrega", "Cotización", "Motivo"],
  // SVG: descripción accesible de toda la línea.
  label: "Una línea de producción en seis estaciones. Una tolva suelta los diez campos de una solicitud en el carro del agente. Diez palpadores revisan cada campo y un reloj cuenta los que faltan; si falta alguno, el carro vuelve y el solicitante lo agrega. Un sello la marca lista para revisión, una cápsula sube por un tubo con el aviso al comprador, y una compuerta espera la aprobación mientras una campana suena cada día hábil. Al final la orden sale al proveedor. Seis luces al frente muestran el estado.",
  // Cabecera: número de figura.
  fig: "Fig 2",
  // Cabecera: título.
  title: "PO Guru, de punta a punta",
  // Cabecera: indicación.
  hint: "Tú decides en 3 y en 6",
  // Readout inicial y runtime: llena.
  enter: "entra la cotización",
  // Runtime: a-rev, baja.
  check: "revisa 10 puntos",
  // Runtime: lee, sube; {fields} es la lista de campos.
  missing: "falta {fields}",
  // Runtime: separador de campos faltantes.
  join: " y ",
  // Runtime: lee, sube sin faltantes.
  complete: "10 de 10 · completa",
  // Runtime: pregunta.
  ask: "te pregunta: falta {fields}",
  // Runtime: vuelve, agrega.
  add: "el solicitante agrega {fields}",
  // Runtime: a-sello, sella.
  ready: "lista para revisión",
  // Runtime: a-brief, brief.
  brief: "brief al buyer en Teams",
  // Runtime: a-puerta.
  wait: "espera la aprobación",
  // Runtime: espera, primer día hábil.
  firstDay: "día hábil 1 · espera al aprobador",
  // Runtime: espera, un recordatorio.
  oneReminder: "día hábil {day} · {count} recordatorio",
  // Runtime: espera, varios recordatorios.
  reminders: "día hábil {day} · {count} recordatorios",
  // Runtime: abre.
  approved: "aprobada por una persona",
  // Runtime: sale, entrega, regresa.
  out: "la orden sale al proveedor",
  // Runtime: anuncio aria-live en pregunta.
  announceAdd: "Falta un dato. Te toca: agrégalo.",
  // Runtime: anuncio aria-live en espera.
  announceWait: "Espera tu aprobación.",
  // Leyenda: luz verde.
  legend: "Verde: el agente trabajando o un paso cumplido",
  // Pie de figura.
  caption: "Demo con datos de ejemplo.",
  // Controles: aria-label del grupo.
  controls: "Tus decisiones en la demo",
  // Botón de agregar: rol.
  requester: "3 · Solicitante",
  // Botón de agregar: acción.
  addButton: "Agregar el dato",
  // Botón de aprobar: rol.
  approver: "6 · Aprobador",
  // Botón de aprobar: acción.
  approveButton: "Aprobar",
  // Checkbox: etiqueta.
  missingToggle: "Que le falte un dato",
};

// EN: traducido por Claude (2026-11-02). Mismas claves y comentarios que ES.
const en = {
  fields: ["Requester", "Description", "Supplier", "Quantity", "Price", "Currency", "Delivery location", "Delivery date", "Quote", "Reason"],
  label: "A production line with six stations. A hopper drops the ten fields of a request into the agent's cart. Ten probes check each field and a gauge counts the missing ones; if any is missing, the cart goes back and the requester adds it. A stamp marks it ready for review, a capsule rides up a tube with the notice for the buyer, and a gate waits for approval while a bell rings every business day. At the end the order goes out to the supplier. Six lights on the front show the status.",
  fig: "Fig 2",
  title: "PO Guru, end to end",
  hint: "You decide at 3 and 6",
  enter: "the quote comes in",
  check: "checks 10 points",
  missing: "missing {fields}",
  join: " and ",
  complete: "10 of 10 · complete",
  ask: "asks you: missing {fields}",
  add: "the requester adds {fields}",
  ready: "ready for review",
  brief: "brief to the buyer in Teams",
  wait: "waiting for approval",
  firstDay: "business day 1 · waiting for the approver",
  oneReminder: "business day {day} · {count} reminder",
  reminders: "business day {day} · {count} reminders",
  approved: "approved by a person",
  out: "the order goes to the supplier",
  announceAdd: "A field is missing. Your turn: add it.",
  announceWait: "Waiting for your approval.",
  legend: "Green: the agent working or a step done",
  caption: "Demo with sample data.",
  controls: "Your decisions in the demo",
  requester: "3 · Requester",
  addButton: "Add the field",
  approver: "6 · Approver",
  approveButton: "Approve",
  missingToggle: "Leave a field missing",
};

const strings = { es, en };
export default strings;
