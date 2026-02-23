# Vitae.ai

<img src="public/brand/vitae-logo.png" alt="Vitae.ai Logo" width="220" />

**Your career, powered by artificial intelligence.**

An open-source, AI-powered digital CV platform that turns a plain resume into an interactive, multilingual portfolio with built-in chatbot, resume analysis, and recruiter-ready design.

[![Next.js](https://img.shields.io/badge/Next.js-16-111827?style=for-the-badge)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-0ea5e9?style=for-the-badge)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-14b8a6?style=for-the-badge)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-f97316?style=for-the-badge)](https://www.framer.com/motion/)
[![i18n](https://img.shields.io/badge/i18n-10_Languages-22c55e?style=for-the-badge)](https://github.com/EiTinchoZ/Vitae.ai)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-111827?style=for-the-badge)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-Non--Commercial-94a3b8?style=for-the-badge)](./LICENSE)

---

## Why Vitae.ai?

Recruiters spend **6 seconds** on a resume. Vitae.ai makes those seconds count.

- **AI Chatbot** - Recruiters ask questions about you and get instant, accurate answers from your CV data
- **Resume Analyzer** - Upload any CV and get AI-powered scoring, highlights, and improvement suggestions
- **10 Languages** - Auto-detects and serves content in ES, EN, PT, FR, DE, ZH, JA, AR, HI, KO
- **Personal Values Engine** - AI identifies and showcases your soft skills with concrete evidence from your CV
- **Section Q&A** - Each section has an AI assistant that answers context-specific questions
- **Dark/Light Mode** - Full theme support with smooth transitions
- **Mobile-First** - Responsive design optimized for every screen size
- **Framer Motion** - Smooth scroll animations on every section

## Live Demos

| Mode | URL | Description |
|------|-----|-------------|
| Personal CV | [portfolio-eitinchos-projects.vercel.app](https://portfolio-eitinchos-projects.vercel.app) | Full personal CV with AI features |
| Public Demo | [vitae-demo.vercel.app](https://vitae-demo.vercel.app) | Try it with your own CV data |

## Quick Start

```bash
git clone https://github.com/EiTinchoZ/Vitae.ai.git
cd Vitae.ai
npm install
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local
npm run dev
```

Then edit `src/data/cv-data.ts` with your own data and refresh.

For a detailed setup guide (including a no-terminal path for non-developers), see [INSTALL.md](./INSTALL.md).

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | App Router, Server Components, API Routes |
| **React 19** | UI rendering with latest features |
| **TypeScript** | Full type safety across the codebase |
| **Tailwind CSS 4** | Utility-first styling with CSS variables |
| **Framer Motion** | Scroll animations, layout transitions |
| **Groq + Vercel AI SDK** | Fast LLM inference for all AI features |
| **Vercel** | Zero-config deployment |

## Architecture

```
src/
├── app/                    # Next.js routes and API endpoints
│   └── api/                # Chat, analyze, parse-cv, recommend-skills
├── components/
│   ├── ai/                 # SectionQA, ResumeAnalyzer, SkillRecommender
│   ├── chat/               # AI chatbot widget
│   ├── demo/               # Demo flow (form, upload, paste, preview)
│   ├── sections/           # Hero, About, Skills, Education, etc.
│   ├── shared/             # Navbar, Footer, SectionWrapper
│   └── ui/                 # Base components (Button, Card, Badge)
├── data/                   # CV data per language
├── i18n/                   # 10 locale files + translation hooks
├── lib/                    # Utilities, config, API helpers
└── types/                  # TypeScript interfaces
```

## Two Deployment Modes

Vitae.ai supports two modes via `NEXT_PUBLIC_APP_MODE`:

| Mode | What it does |
|------|-------------|
| `personal` | Shows your real CV with all AI features enabled |
| `demo` | Public demo where visitors upload/paste their own CV, preview includes watermark |

Deploy both as separate Vercel projects pointing to the same repo.

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `GROQ_API_KEY` | Yes | Powers all AI features (chat, analysis, Q&A) |
| `NEXT_PUBLIC_APP_MODE` | Yes | `personal` or `demo` |
| `NEXT_PUBLIC_GITHUB_USERNAME` | Yes | GitHub profile integration |
| `NEXT_PUBLIC_DEMO_URL` | Recommended | Links to your demo deployment |
| `NEXT_PUBLIC_PERSONAL_URL` | Recommended | Links to your personal CV deployment |

## AI Features

All AI features run through **Groq** for fast, cost-effective LLM inference:

- **Chatbot** (`/api/chat`) - Conversational assistant that answers questions about the CV owner
- **Resume Analyzer** (`/api/analyze-cv`) - Scores and provides feedback on uploaded CVs
- **CV Parser** (`/api/parse-cv`) - Extracts structured data from raw text or PDF uploads
- **Values Engine** (`/api/recommend-skills`) - Identifies personal values and strengths with evidence

Get a free Groq API key at [console.groq.com](https://console.groq.com).

## Customization

The demo mode includes a live customization panel:

- **Accent color** - Blue, Emerald, Amber, Violet
- **Layout width** - 4xl, 5xl, 6xl
- **Density** - Compact or Comfortable
- **Card style** - Solid or Glass
- **Section order** - Drag sections up/down
- **Section visibility** - Show/hide any section

## Privacy

- API keys are never committed or exposed to the client
- Real CV data stays in your personal deployment
- Demo mode uses ephemeral data that is not stored server-side

## License

Non-commercial license. See [LICENSE](./LICENSE) for details.

## Author

Created by **Martin Bundy** - Industrial Engineering student and AI specialist from Panama.

- [LinkedIn](https://linkedin.com/in/martinbundy15)
- [GitHub](https://github.com/EiTinchoZ)
