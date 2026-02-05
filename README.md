# Vita.ai

<!-- Logo will be added here once the final brand mark is ready -->

Vita.ai is an AI-powered, interactive CV platform that turns a traditional resume into a clean, visual, and structured digital profile. It is built to help students and professionals present their experience, education, and skills in a format that is easier to read, easier to update, and more memorable than a standard PDF.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-Non--Commercial-lightgrey)](./LICENSE)

## Vision

Most people still manage their CVs in scattered formats and update them manually. Vita.ai provides a single structured source of truth with an elegant, modern presentation so your professional story is always current and easy to share.

This project was created by a university student with the goal of helping young professionals and students stand out with a more modern and compelling CV experience.

## Origin

Vita.ai started as a personal CV project. The goal was to build a portfolio that felt modern and genuinely useful for real-world job applications. As the project grew, it became a template that other students and professionals could reuse to build their own digital CVs without losing the structure and design quality of the original.

## What It Includes

- Interactive CV layout with modern UI
- AI insights, section Q&A, and CV analysis
- Multi-language support (10 languages)
- Dark and light themes
- Public demo with full preview and watermark
- Two deployment modes (personal and demo)

## Live Previews

- Personal CV example: [View the live CV](https://portfolio-eitinchos-projects.vercel.app)
- Public demo (watermarked preview): [Try the demo](https://vitae-demo.vercel.app)

The demo lets anyone test the experience with their own data. The watermark stays in place unless the project is installed locally.

## How The Demo Works

1. Upload or paste a CV
2. The app builds a full preview with your content
3. A watermark remains visible in demo mode
4. Remove the watermark by installing the project locally

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Groq AI (LLM)
- Vercel (deployment)

## Getting Started

For a step-by-step guide (including a no-terminal path), read [INSTALL.md](./INSTALL.md).

### Option A: Simple Setup (No Terminal Required)

This path is for people who are not comfortable with command line tools.

1. Create a GitHub account.
2. Fork this repository to your account.
3. Create a Vercel project and import your fork.
4. Create a Groq API key.
5. Set the environment variables inside Vercel:
   - GROQ_API_KEY
   - NEXT_PUBLIC_GITHUB_USERNAME
   - NEXT_PUBLIC_APP_MODE (personal or demo)
   - NEXT_PUBLIC_DEMO_URL
   - NEXT_PUBLIC_PERSONAL_URL
6. Deploy.
7. Edit your CV data directly in GitHub by opening `src/data/cv-data.ts` and updating the values.

### Option B: Developer Setup (Fastest for technical users)

```bash
git clone https://github.com/EiTinchoZ/Vita.ai.git
cd Vita.ai
npm install
cp .env.example .env.local
cp src/data/cv-data.example.ts src/data/cv-data.ts
npm run dev
```

Then edit `src/data/cv-data.ts` and refresh your local site.

## Configuration

Environment variables:

```
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_GITHUB_USERNAME=your_github_username
NEXT_PUBLIC_APP_MODE=personal
NEXT_PUBLIC_DEMO_URL=https://your-demo.vercel.app
NEXT_PUBLIC_PERSONAL_URL=https://your-personal.vercel.app
```

## Project Structure

- `src/app` - Next.js routes and layout
- `src/components` - UI sections, shared components, AI widgets
- `src/data` - CV data and schema
- `public` - static assets (images, certificates, CV PDF)

## Deployment Notes

Deploy two separate Vercel projects:

- Personal CV: `NEXT_PUBLIC_APP_MODE=personal`
- Public Demo: `NEXT_PUBLIC_APP_MODE=demo`

This keeps your real data isolated from the public demo.

## Privacy and Security

- Never commit API keys
- Keep real CV data out of public templates
- Use `.env.local` and Vercel environment variables

## License

This project uses a non-commercial license. See `LICENSE` for details.

## Credits

Created and maintained by Martín Alejandro Bundy Muñoz.
