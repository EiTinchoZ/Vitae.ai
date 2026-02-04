# Vitae.ai 2.0 - Roadmap de Desarrollo

## Vision del Producto

**Vitae.ai** es una herramienta open-source que permite a cualquier persona crear su CV digital interactivo con IA integrada.

### Ecosistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      VITAE.AI ECOSYSTEM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. CV PERSONAL DE MARTIN (Produccion)                         │
│     URL: portfolio-eitinchos-projects.vercel.app               │
│     - CV completo y funcional                                  │
│     - Ejemplo de lo que se puede lograr                        │
│     - Sirve para aplicar a trabajos                            │
│                                                                 │
│  2. DEMO PUBLICA (Nuevo proyecto Vercel)                       │
│     URL: vitae-demo.vercel.app (sugerido)                      │
│     - Usuario sube su CV (PDF/DOCX/Form/Paste)                 │
│     - Preview al 60% con watermark                             │
│     - CTA: "Instala Vitae.ai para ver todo"                    │
│                                                                 │
│  3. REPOSITORIO GITHUB                                          │
│     - Codigo limpio sin datos personales                       │
│     - README profesional con guia paso a paso                  │
│     - cv-data.example.ts con datos ficticios                   │
│     - Documentacion del formato de CV requerido                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## FASE 2: Preparar Template (Siguiente)

### 2.1 Separar Datos Personales

**Estructura propuesta:**
```
src/data/
├── cv-data.ts           # TUS datos (añadir a .gitignore)
├── cv-data.example.ts   # Datos ficticios para template
└── cv-schema.md         # Documentacion del formato
```

**cv-data.example.ts:**
```typescript
const personal = {
  name: 'Tu Nombre',
  fullName: 'Tu Nombre Completo',
  location: 'Tu Ciudad, Pais',
  phone: '',  // Opcional
  email: 'tu@email.com',
  linkedin: 'https://linkedin.com/in/tu-perfil',
  github: 'https://github.com/tu-usuario',
};
```

### 2.2 Documentar Formato de CV

**cv-schema.md:**
- Estructura JSON requerida
- Campos obligatorios vs opcionales
- Ejemplos de cada seccion
- Tips para maximizar el impacto de la IA

### 2.3 Variables de Entorno

**.env.example:**
```bash
GROQ_API_KEY=tu_api_key_de_groq
NEXT_PUBLIC_GITHUB_USERNAME=tu_usuario_github
```

---

## FASE 3: Demo Publica

### 3.1 Nueva Pagina `/demo`

**Flujo del usuario:**
1. Llega a vitae-demo.vercel.app
2. Elige metodo de input:
   - Subir PDF/DOCX
   - Llenar formulario paso a paso
   - Pegar texto del CV
3. IA procesa y extrae datos
4. Ve preview al 60% con watermark
5. CTA para instalar el proyecto completo

### 3.2 Sistema de Input Multiple

**Opcion 1: Upload de archivo**
```
- Acepta PDF y DOCX
- Usa pdf-parse o similar para extraer texto
- IA estructura los datos segun cv-schema
```

**Opcion 2: Formulario paso a paso**
```
- Wizard con pasos:
  1. Info Personal
  2. Perfil/Resumen
  3. Educacion
  4. Experiencia
  5. Habilidades
  6. Proyectos
  7. Certificaciones
```

**Opcion 3: Pegar texto**
```
- Textarea grande
- IA extrae y estructura automaticamente
- Usuario revisa y corrige
```

### 3.3 Preview con Restricciones

**Que se muestra (60%):**
- Hero con nombre y foto placeholder
- Resumen del perfil
- Lista de habilidades (sin categorias)
- Nombres de secciones visibles

**Que se oculta (40%):**
- Features de IA (chat, insights, Q&A)
- Detalles de proyectos
- Experiencia completa
- Certificaciones detalladas

**Watermark:**
```css
.demo-watermark {
  position: fixed;
  opacity: 0.1;
  font-size: 5rem;
  transform: rotate(-45deg);
  pointer-events: none;
  z-index: 1000;
}
```

### 3.4 CTA de Conversion

**Despues del preview:**
```
┌──────────────────────────────────────────┐
│  Te gusto tu preview?                   │
│                                          │
│  Para obtener tu CV completo con todas  │
│  las funciones de IA:                   │
│                                          │
│  [Instalar Vitae.ai] [Ver documentacion]│
│                                          │
│  Es gratis y open-source               │
└──────────────────────────────────────────┘
```

---

## FASE 4: GitHub Profesional

### 4.1 README Mejorado

**Estructura:**
```markdown
# Vitae.ai - Tu CV Digital con IA

[Badge: Stars] [Badge: Forks] [Badge: License]

![Preview](./preview.gif)

## Demo en Vivo
- [Ver ejemplo completo](https://portfolio-eitinchos-projects.vercel.app)
- [Probar con tu CV](https://vitae-demo.vercel.app)

## Caracteristicas
- CV digital responsive
- 10 idiomas
- Chat con IA
- Analisis para reclutadores
- Dark/Light mode

## Instalacion Rapida
[Guia paso a paso...]

## Configuracion
[Como personalizar tu CV...]

## Stack Tecnologico
- Next.js 16
- TypeScript
- Tailwind CSS
- Groq AI

## Contribuir
[Como contribuir...]

## Licencia
MIT
```

### 4.2 Screenshots y GIFs

**Contenido visual:**
- GIF animado del hero
- Screenshot de cada seccion
- Video corto de las features de IA
- Comparacion dark/light mode

### 4.3 Guia de Instalacion Detallada

**INSTALL.md:**
1. Fork del repositorio
2. Clonar localmente
3. Instalar dependencias
4. Configurar variables de entorno
5. Editar cv-data.ts con tus datos
6. Probar localmente
7. Deploy a Vercel
8. Configurar dominio personalizado (opcional)

---

## Prioridades

| Fase | Prioridad | Estimacion |
|------|-----------|------------|
| FASE 1 (Insights sin salario) | ✅ COMPLETADA | - |
| FASE 2 (Template) | ALTA | 1 sesion |
| FASE 4 (GitHub README) | ALTA | 1 sesion |
| FASE 3 (Demo publica) | MEDIA | 2-3 sesiones |

---

## Notas Tecnicas

### Consideraciones de Seguridad
- cv-data.ts NUNCA debe estar en git del template
- API keys solo en variables de entorno
- Rate limiting en endpoints de IA

### Consideraciones de UX
- Demo debe ser rapida (< 3s para generar preview)
- Watermark visible pero no intrusivo
- Mobile-first para el formulario

---

*Ultima actualizacion: 2026-02-04*
