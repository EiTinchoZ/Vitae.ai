# Portfolio CV Interactivo

<p align="center">
  <strong>CV Digital Interactivo con Inteligencia Artificial</strong>
</p>

Plataforma web que centraliza toda mi informacion profesional en un solo lugar: trayectoria academica, experiencia laboral, certificaciones, proyectos destacados y habilidades tecnicas. Disenado para ofrecer una experiencia interactiva y moderna que va mas alla del CV tradicional en PDF.

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06b6d4?style=flat-square&logo=tailwindcss)
![Framer](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=flat-square&logo=framer)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

**Demo en vivo:** [portfolio-jet-sigma-66.vercel.app](https://portfolio-jet-sigma-66.vercel.app)

---

## Tabla de contenidos

1. [Que ofrece](#que-ofrece)
2. [Stack tecnologico](#stack-tecnologico)
3. [Arquitectura](#arquitectura)
4. [Secciones](#secciones)
5. [Instalacion local](#instalacion-local)
6. [Deployment](#deployment)
7. [Autor](#autor)
8. [Licencia](#licencia)

---

## Que ofrece

- **Hero interactivo** — Presentacion profesional con acceso directo a redes sociales y descarga de CV en PDF.
- **Perfil dinamico** — Resumen ejecutivo con especialidades y areas de enfoque destacadas.
- **Skills con filtros** — Visualizacion interactiva de habilidades tecnicas organizadas por categoria: IA, Programacion, Ingenieria Industrial y Tecnologia.
- **Timeline de educacion** — Trayectoria academica con indicadores de progreso para carreras en curso.
- **Sistema de certificaciones** — Grid de certificados con modal de visualizacion detallada y opcion de descarga.
- **Proyectos destacados** — Showcase del proyecto ganador de Hackathon MUPA 2024 con integracion dinamica a repositorios de GitHub.
- **Experiencia laboral** — Timeline visual de pasantias con responsabilidades y tecnologias aplicadas.
- **Contacto directo** — Multiples canales de comunicacion con CTAs para descarga de CV y contacto por email.
- **Modo oscuro/claro** — Toggle de tema con persistencia entre sesiones.
- **Responsive design** — Optimizado para desktop, tablet y mobile.

---

## Stack tecnologico

| Capa | Tecnologia |
|------|------------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript 5.3 |
| Estilos | Tailwind CSS 3.4 |
| Componentes | shadcn/ui + Radix UI |
| Animaciones | Framer Motion 11 |
| Iconos | Lucide React |
| Tema | next-themes |
| API | GitHub REST API v3 |
| Deploy | Vercel |

---

## Arquitectura

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Layout principal con providers
│   ├── page.tsx            # Pagina principal
│   └── globals.css         # Estilos globales y variables CSS
├── components/
│   ├── sections/           # 8 secciones del portfolio
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Education.tsx
│   │   ├── Certificates.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   └── Contact.tsx
│   ├── shared/             # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx
│   ├── ui/                 # Componentes base (shadcn/ui)
│   └── providers/          # Context providers
├── data/                   # Datos estructurados del CV
├── lib/                    # Utilidades y servicios (GitHub API)
├── types/                  # Definiciones TypeScript
└── hooks/                  # Custom hooks
```

---

## Secciones

| Seccion | Descripcion |
|---------|-------------|
| **Hero** | Presentacion con foto, titulo profesional, links sociales y CTA de descarga de CV |
| **About** | Perfil profesional completo con highlights y especialidades en formato de pills |
| **Skills** | Grid interactivo con filtros por categoria y contadores por area |
| **Education** | Timeline vertical con 3 niveles educativos y barras de progreso |
| **Certificates** | Grid de 6 certificaciones con modal detallado y navegacion prev/next |
| **Projects** | Card destacada de Conecta Panama + grid de repos de GitHub con stats |
| **Experience** | Timeline de 2 pasantias con responsabilidades y tags de skills |
| **Contact** | Informacion de contacto, links sociales y doble CTA |

---

## Instalacion local

```bash
# Clonar repositorio
git clone https://github.com/EiTinchoZ/Portafolio-CV-Interactivo.git

# Entrar al directorio
cd Portafolio-CV-Interactivo

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir `http://localhost:3000` en el navegador.

---

## Deployment

El proyecto esta desplegado en Vercel con deployment automatico en cada push a `main`.

**URL de produccion:** [portfolio-jet-sigma-66.vercel.app](https://portfolio-jet-sigma-66.vercel.app)

---

## Autor

**Martin Alejandro Bundy Munoz**

Estudiante de Ingenieria Industrial y Tecnico Superior en Inteligencia Artificial. Especializado en Machine Learning, Deep Learning, IA Generativa y desarrollo de soluciones tecnologicas innovadoras. Ganador del Hackathon MUPA 2024 con el proyecto Conecta Panama.

| Contacto | Link |
|----------|------|
| GitHub | [@EiTinchoZ](https://github.com/EiTinchoZ) |
| LinkedIn | [martinbundy15](https://linkedin.com/in/martinbundy15) |
| Email | mbundy15@gmail.com |

---

## Licencia

MIT License - Este proyecto es de codigo abierto y puede ser utilizado como referencia o template.
