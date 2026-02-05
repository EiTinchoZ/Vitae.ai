# Vitae.ai Installation Guide

Use this guide to set up your own AI-powered interactive CV.

## Prerequisites

- Node.js 20+
- npm
- Groq account (for API key)
- Vercel account
- GitHub account

## 1. Fork and Clone

```bash
git clone https://github.com/EiTinchoZ/Portafolio-CV-Interactivo.git
cd Portafolio-CV-Interactivo
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_GITHUB_USERNAME=your_github_username
NEXT_PUBLIC_APP_MODE=personal
NEXT_PUBLIC_DEMO_URL=https://your-demo.vercel.app
NEXT_PUBLIC_PERSONAL_URL=https://your-personal-cv.vercel.app
```

## 4. Add Your CV Data

```bash
cp src/data/cv-data.example.ts src/data/cv-data.ts
```

Edit `src/data/cv-data.ts` with your data. See `src/data/cv-schema.md` for the structure.

## 5. Run Locally

```bash
npm run dev
```

## 6. Deploy to Vercel (Recommended)

### Personal CV Project
- Deploy with `NEXT_PUBLIC_APP_MODE=personal`
- Use your real CV data

### Public Demo Project
- Deploy with `NEXT_PUBLIC_APP_MODE=demo`
- Uses sample data and `/demo` preview

> Keep these as two **separate** Vercel projects to avoid mixing personal data and demo data.

## Troubleshooting

- **AI not working:** ensure `GROQ_API_KEY` is set and active.
- **Build errors:** run `npm run build` locally to inspect errors.

---

Vitae.ai — Your career, powered by AI
