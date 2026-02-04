# Vitae.ai

### Tu carrera, potenciada por inteligencia artificial

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

**Vitae.ai** es una herramienta open-source para crear tu CV digital interactivo con IA integrada. Diseñado para profesionales que quieren destacar ante reclutadores.

## Demo en Vivo

| Demo | Descripcion |
|------|-------------|
| [**CV de Martin Bundy**](https://portfolio-eitinchos-projects.vercel.app) | Ejemplo completo y funcional |
| [**Template Customizable**](#instalacion) | Crea el tuyo siguiendo la guia |

---

## Caracteristicas

### Para Candidatos
- CV digital responsive y moderno
- 10 idiomas soportados (ES, EN, PT, DE, FR, ZH, JA, AR, HI, KO)
- Modo oscuro/claro con persistencia
- Integracion con GitHub para mostrar repositorios

### Para Reclutadores
- **Chat con IA** - Pregunta sobre el candidato
- **Insights Inteligentes** - Analisis ejecutivo del perfil
- **Q&A por Seccion** - Detalles especificos de cada area
- **Recomendador de Skills** - Sugerencias de crecimiento

---

## Capturas de Pantalla

<details>
<summary>Ver capturas</summary>

### Hero
![Hero Section](https://via.placeholder.com/800x400?text=Hero+Screenshot)

### Insights con IA
![AI Insights](https://via.placeholder.com/800x400?text=AI+Insights)

### Chat Asistente
![Chat Bot](https://via.placeholder.com/800x400?text=Chat+Assistant)

</details>

---

## Stack Tecnologico

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4 |
| UI | shadcn/ui + Radix UI |
| Animaciones | Framer Motion |
| IA | Groq + Vercel AI SDK |
| Hosting | Vercel |

---

## Instalacion

### Requisitos

- Node.js 20+
- Cuenta en [Groq](https://console.groq.com/) (gratis)
- Cuenta en [Vercel](https://vercel.com/) (gratis)

### Guia Rapida

```bash
# 1. Clona el repositorio
git clone https://github.com/EiTinchoZ/vitae-ai.git
cd vitae-ai

# 2. Instala dependencias
npm install

# 3. Configura variables de entorno
cp .env.example .env.local
# Edita .env.local con tu GROQ_API_KEY

# 4. Agrega tus datos
cp src/data/cv-data.example.ts src/data/cv-data.ts
# Edita cv-data.ts con tu informacion

# 5. Ejecuta en desarrollo
npm run dev
```

### Guia Completa

Para instrucciones detalladas paso a paso, consulta [INSTALL.md](INSTALL.md).

### Estructura de Datos del CV

Para entender como estructurar tu CV, consulta [src/data/cv-schema.md](src/data/cv-schema.md).

---

## Arquitectura

```
src/
├── app/
│   ├── api/                # Endpoints de IA
│   │   ├── chat/           # Chat conversacional
│   │   ├── insights/       # Analisis para reclutadores
│   │   ├── analyze-resume/ # Analizador de CV
│   │   ├── recommend-skills/ # Recomendador
│   │   └── section-qa/     # Q&A por seccion
│   ├── layout.tsx          # Layout raiz
│   └── page.tsx            # Pagina principal
├── components/
│   ├── ai/                 # Dashboards de IA
│   ├── chat/               # Chat flotante
│   ├── sections/           # Secciones del CV
│   ├── shared/             # Navbar, Footer
│   └── ui/                 # Componentes shadcn
├── data/
│   ├── cv-data.ts          # TUS datos (no incluido)
│   ├── cv-data.example.ts  # Ejemplo con datos ficticios
│   └── cv-schema.md        # Documentacion
├── i18n/                   # 10 idiomas
└── lib/                    # Utilidades
```

---

## Scripts

```bash
npm run dev      # Desarrollo local
npm run build    # Build de produccion
npm run start    # Servidor de produccion
npm run lint     # Verificar codigo
```

---

## Funcionalidades de IA

| Feature | Descripcion |
|---------|-------------|
| **Chat Asistente** | Conversacion natural sobre el CV |
| **Insights para Reclutadores** | Score del perfil, fortalezas, roles ideales |
| **Analizador de CV** | Feedback estructurado y compatibilidad ATS |
| **Recomendador de Skills** | Sugerencias de habilidades complementarias |
| **Q&A por Seccion** | Preguntas especificas sobre cada area |

---

## Idiomas Soportados

| Codigo | Idioma | Estado |
|--------|--------|--------|
| `es` | Espanol | Completo |
| `en` | Ingles | Completo |
| `pt` | Portugues | Completo |
| `de` | Aleman | Completo |
| `fr` | Frances | Completo |
| `zh` | Chino | Completo |
| `ja` | Japones | Completo |
| `ar` | Arabe (RTL) | Completo |
| `hi` | Hindi | Completo |
| `ko` | Coreano | Completo |

---

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Seguridad

Para reportar vulnerabilidades de seguridad, consulta [SECURITY.md](SECURITY.md).

---

## Colaboradores

Este proyecto es desarrollado por:

- **Martin Alejandro Bundy Munoz** - Creador y mantenedor
- **Claude Code** - Colaborador IA
- **Codex** - Colaborador IA

---

## Licencia

Distribuido bajo la Licencia MIT. Ver [LICENSE](LICENSE) para mas informacion.

---

<p align="center">
  <strong>Vitae.ai</strong> - Tu carrera, potenciada por inteligencia artificial
</p>
