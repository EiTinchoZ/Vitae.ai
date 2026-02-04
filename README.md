# Vitae.ai — AI-Powered Digital CV

Vitae.ai is a professional, interactive CV and portfolio that showcases my education, experience, certifications, projects, and AI-focused skill set in a modern, recruiter-ready format. It includes multilingual support and AI-powered features (career insights, skill recommendations, section Q&A, and a smart chat assistant).

**Live Preview:** https://portfolio-eitinchos-projects.vercel.app

---

## Highlights

- Fully responsive portfolio with a clean, professional aesthetic
- Multilingual UI (10 languages)
- AI features: chat assistant, CV analyzer, career insights, skill recommender, section Q&A
- GitHub integration for live repository previews
- Dark/Light mode with persistent preference

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI:** shadcn/ui + Radix UI
- **Animations:** Framer Motion
- **Icons:** Lucide
- **AI/LLM:** Groq + Vercel AI SDK
- **Hosting:** Vercel

---

## Architecture

```
src/
├── app/                   # Next.js App Router
│   ├── api/               # AI endpoints (chat, insights, analysis, etc.)
│   ├── layout.tsx         # Root layout + providers
│   ├── page.tsx           # Main landing page
│   └── globals.css        # Global styles
├── components/
│   ├── ai/                # AI widgets and dashboards
│   ├── chat/              # Floating chat assistant
│   ├── sections/          # Hero, About, Skills, etc.
│   ├── shared/            # Navbar, Footer, wrappers
│   └── ui/                # shadcn/ui components
├── data/                  # CV data source
├── i18n/                  # Localization (10 languages)
└── lib/                   # Utilities and GitHub API
```

---

## Getting Started

### Requirements

- Node.js 20+
- npm

### Install

```bash
git clone https://github.com/EiTinchoZ/Portafolio-CV-Interactivo.git
cd Portafolio-CV-Interactivo
npm install
```

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_GITHUB_USERNAME=EiTinchoZ
GROQ_API_KEY=your_groq_key_here
```

### Development

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## AI Features

- **Chat Assistant:** Conversational CV overview
- **Resume Analyzer:** Structured feedback and ATS compatibility
- **Career Insights:** AI-generated career score and recommendations
- **Skill Recommender:** Personalized growth suggestions
- **Section Q&A:** Ask about skills, education, projects, and experience

---

## Collaboration

This project is developed by:

- **Martín Alejandro Bundy Muñoz** (Owner)
- **Claude Code** (AI collaborator)
- **Codex** (AI collaborator)

See `CONTRIBUTORS.md` for details.

---

## Security

Security reporting guidelines are available in `SECURITY.md`.

---

## License

Licensed under the MIT License. See `LICENSE` for details.
