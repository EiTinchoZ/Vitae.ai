# Vita.ai Installation Guide

This guide explains how to install and run Vita.ai in two ways:

- Simple setup (no terminal required)
- Developer setup (fastest for technical users)

## Prerequisites

- GitHub account
- Vercel account
- Groq API key (for AI features)

Useful links:
- [GitHub](https://github.com/)
- [Vercel](https://vercel.com/)
- [Groq API](https://console.groq.com/)
- [GitHub Desktop](https://desktop.github.com/) (optional)

## Option A: Simple Setup (No Terminal Required)

1. Fork this repository in GitHub.
2. Create a Vercel project and import your fork.
3. In Vercel, open the project settings and add environment variables:
   - GROQ_API_KEY
   - NEXT_PUBLIC_GITHUB_USERNAME
   - NEXT_PUBLIC_APP_MODE (personal or demo)
   - NEXT_PUBLIC_DEMO_URL
   - NEXT_PUBLIC_PERSONAL_URL
4. Deploy the project.
5. Edit your CV data in GitHub:
   - Open `src/data/cv-data.ts`
   - Replace the example content with your own

## Option B: Developer Setup (Fastest)

```bash
git clone https://github.com/EiTinchoZ/Vita.ai.git
cd Vita.ai
npm install
cp .env.example .env.local
cp src/data/cv-data.example.ts src/data/cv-data.ts
npm run dev
```

Edit `src/data/cv-data.ts` with your data and refresh the site.

## Two Deployments (Recommended)

You should deploy two separate Vercel projects:

- Personal CV: `NEXT_PUBLIC_APP_MODE=personal`
- Public Demo: `NEXT_PUBLIC_APP_MODE=demo`

This keeps your real data isolated from the public demo.

## CV Data Format

The structure is documented in `src/data/cv-schema.md`.

## Troubleshooting

- AI not working: confirm `GROQ_API_KEY` is valid and active
- Build errors: run `npm run build` locally to inspect
