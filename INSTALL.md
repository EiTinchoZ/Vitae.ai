# Vitae.ai Installation Guide

This guide explains how to install and run Vitae.ai in two ways:

- Simple setup (no terminal required)
- Developer setup (fastest for technical users)

## Prerequisites

- GitHub account
- Vercel account
- Groq API key (for AI features)

Useful links:
- [GitHub](https://github.com/)
- [Vercel](https://vercel.com/)
- [Groq Console](https://console.groq.com/)
- [GitHub Desktop](https://desktop.github.com/) (optional)

## About Groq

Groq powers the AI features used in Vitae.ai. The Groq API key enables insights, Q&A, and CV analysis.

Steps to get a Groq API key:

1. Create a Groq account
2. Open the Groq console
3. Generate a new API key
4. Copy it for the environment variables section below

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
git clone https://github.com/EiTinchoZ/Vitae.ai.git
cd Vitae.ai
npm install
cp .env.example .env.local
cp src/data/cv-data.example.ts src/data/cv-data.ts
npm run dev
```

Edit `src/data/cv-data.ts` with your data and refresh the site.

## Environment Variables

These variables control the AI features and deployment mode.

| Variable | Required | Purpose |
| --- | --- | --- |
| GROQ_API_KEY | Yes | Enables AI features (insights, Q&A, CV analysis). |
| NEXT_PUBLIC_GITHUB_USERNAME | Yes | Shows your GitHub profile and repositories. |
| NEXT_PUBLIC_APP_MODE | Yes | `personal` shows your real CV; `demo` enables the public demo flow. |
| NEXT_PUBLIC_DEMO_URL | Recommended | Public demo URL used in navigation and CTA links. |
| NEXT_PUBLIC_PERSONAL_URL | Recommended | Personal CV URL used in navigation and CTA links. |

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
