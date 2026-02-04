# Portfolio Digital - Martin Bundy

Portfolio profesional desarrollado con tecnologias modernas para mostrar mi trayectoria academica, experiencia laboral, certificaciones y proyectos destacados.

## Demo

**[Ver Portfolio en Vivo](https://portfolio-jet-sigma-66.vercel.app)**

## Stack Tecnologico

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | TailwindCSS |
| Componentes UI | shadcn/ui |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Tema | next-themes |

## Caracteristicas

- Diseno responsive optimizado para todos los dispositivos
- Modo claro/oscuro con persistencia en localStorage
- Navegacion fluida con scroll suave entre secciones
- Sistema de certificaciones con visualizacion modal
- Integracion dinamica con GitHub API
- Filtros interactivos en seccion de habilidades
- Timelines visuales para educacion y experiencia
- Optimizacion SEO con metadata dinamica
- Animaciones de entrada con Framer Motion

## Estructura

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── sections/           # Secciones del portfolio
│   ├── shared/             # Componentes reutilizables
│   ├── ui/                 # Componentes base (shadcn/ui)
│   └── providers/          # Context providers
├── data/                   # Datos estructurados
├── lib/                    # Utilidades y servicios
├── types/                  # Definiciones TypeScript
└── hooks/                  # Custom hooks
```

## Instalacion

```bash
git clone https://github.com/EiTinchoZ/Portafolio-CV-Interactivo.git
cd Portafolio-CV-Interactivo
npm install
```

## Configuracion

Crear archivo `.env.local` en la raiz del proyecto:

```env
NEXT_PUBLIC_GITHUB_USERNAME=EiTinchoZ
```

## Desarrollo

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Generar build de produccion
npm run start    # Iniciar servidor de produccion
npm run lint     # Ejecutar linter
```

## Deployment

Este proyecto esta configurado para deployment automatico en Vercel. Cada push a la rama `main` genera un nuevo deployment.

Para deployment manual:

1. Importar repositorio en [Vercel](https://vercel.com)
2. Configurar variable de entorno `NEXT_PUBLIC_GITHUB_USERNAME`
3. Deploy

## Autor

**Martin Alejandro Bundy Munoz**

Estudiante de Ingenieria Industrial y Tecnico Superior en Inteligencia Artificial.

- [GitHub](https://github.com/EiTinchoZ)
- [LinkedIn](https://linkedin.com/in/martinbundy15)
- [Email](mailto:mbundy15@gmail.com)

## Licencia

MIT License
