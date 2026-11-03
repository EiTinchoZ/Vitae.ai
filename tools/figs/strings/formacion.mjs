// Textos de la figura Formación; geometría y datos de progreso viven en el generador.
const es = {
  // Capas del chip: número de cuatrimestre y descripción del plan oficial ITSE.
  quads: [["I", "matemáticas, redes, ciberseguridad"], ["II", "bases de datos, programación, intro a la IA"], ["III", "lenguajes para IA, sistemas inteligentes"], ["IV", "NLP y aprendizaje automatizado"], ["V", "ciencia de datos, visión, minería de datos"], ["VI", "deep learning, IoT, robótica"], ["VII", "práctica profesional"]],
  // Descripción accesible completa del SVG.
  label: "Un banco con dos objetos. A la izquierda, Ingeniería Industrial en ADEN: un estante con 60 cajas, una por materia; 54 están puestas y 6 huecos esperan de enero a abril de 2027. A la derecha, el Técnico Superior en Inteligencia Artificial del ITSE: un chip de 7 capas, una por cuatrimestre; cinco encendidas y la sexta en curso. Una cinta lleva cajas del estante al chip.",
  // Alt del logo de la chapa Industrial.
  aden: "ADEN University",
  // Alt del logo de la chapa IA.
  itse: "ITSE",
  // Título de la chapa bajo el estante.
  industrial: "Ingeniería Industrial",
  // Detalle de la chapa Industrial.
  progress: "90 % · 54 de 60 materias",
  // Título de la chapa bajo el chip.
  ai: "Técnico Superior en IA",
  // Detalle de la chapa IA.
  quarter: "cuatrimestre VI de VII",
  // Readout inicial y de reposo del runtime.
  rest: "Industrial 90 % · IA: VI de VII",
  // Readout runtime al recorrer una capa del chip.
  chip: "ITSE · {n} · {what} · {state}",
  // Estado runtime de una capa terminada.
  passed: "aprobado",
  // Estado runtime del cuatrimestre actual.
  current: "en curso",
  // Estado runtime de una capa futura.
  pending: "falta",
  // Readout runtime de las cajas terminadas.
  rack: "ADEN · {done} de {total} materias aprobadas",
  // Readout runtime de los huecos del estante.
  missing: "ADEN · faltan 6 · ene a abr 2027",
  // Readout runtime de la cinta entre las carreras.
  cross: "el cruce · Industrial mide, IA cambia",
  // Número visible de la figura en la placa.
  figure: "Fig 1",
  // Título de la placa.
  title: "Dos carreras, un banco",
  // Hint de interacción de la placa.
  hint: "Toca cajas y capas",
  // Caption vacío de la placa, conservado.
  caption: "",
  // aria-roledescription de la escena.
  role: "figura",
  // aria-label de navegación de la escena.
  navigation: "Formación: con las flechas recorres las capas del chip, el estante y la cinta",
};

const strings = {
  es,
  // EN: traducido por Claude (2026-11-02). Mismas claves que ES.
  en: {
    quads: [["I", "math, networking, cybersecurity"], ["II", "databases, programming, intro to AI"], ["III", "languages for AI, intelligent systems"], ["IV", "NLP and machine learning"], ["V", "data science, vision, data mining"], ["VI", "deep learning, IoT, robotics"], ["VII", "professional internship"]],
    label: "A workbench with two objects. On the left, Industrial Engineering at ADEN: a shelf with 60 boxes, one per course; 54 are in place and 6 gaps wait for January to April 2027. On the right, the Higher Technical Degree in Artificial Intelligence at ITSE: a chip with 7 layers, one per term; five are lit and the sixth is in progress. A belt carries boxes from the shelf to the chip.",
    aden: "ADEN University",
    itse: "ITSE",
    industrial: "Industrial Engineering",
    progress: "90% · 54 of 60 courses",
    ai: "Higher Technical Degree in AI",
    quarter: "term VI of VII",
    rest: "Industrial 90% · AI: VI of VII",
    chip: "ITSE · {n} · {what} · {state}",
    passed: "passed",
    current: "in progress",
    pending: "to go",
    rack: "ADEN · {done} of {total} courses passed",
    missing: "ADEN · 6 to go · Jan to Apr 2027",
    cross: "where they meet · Industrial measures, AI changes",
    figure: "Fig 1",
    title: "Two degrees, one workbench",
    hint: "Tap boxes and layers",
    caption: "",
    role: "figure",
    navigation: "Education: use the arrow keys to move through the chip layers, the shelf and the belt",
  },
};

export default strings;
