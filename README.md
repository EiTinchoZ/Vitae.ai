# Vitae.ai

An AI-powered, interactive CV and portfolio template built with Next.js. It turns a traditional CV into a modern, visual experience with insights, Q&A, and dynamic sections — fully customizable for your own data.

**Live Demos**
- Personal CV example: `https://portfolio-eitinchos-projects.vercel.app`
- Public demo (template preview): `https://vitae-demo.vercel.app`

**Why Vitae.ai**
- Interactive CV layout with clean, modern UI
- AI insights, section Q&A, and CV analysis
- 10-language localization
- Dark/light mode
- Public demo with full preview and watermark

**Two Modes (Keep Them Separate)**
- `personal` mode: your real CV data for your personal link
- `demo` mode: public template preview with watermark

Both modes are deployed as separate Vercel projects.

---

**Quick Start**
```bash
git clone https://github.com/EiTinchoZ/Portafolio-CV-Interactivo.git
cd Portafolio-CV-Interactivo
npm install
cp .env.example .env.local
```

Update `.env.local`:
```bash
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_GITHUB_USERNAME=your_github_username
NEXT_PUBLIC_APP_MODE=personal
NEXT_PUBLIC_DEMO_URL=https://your-demo.vercel.app
NEXT_PUBLIC_PERSONAL_URL=https://your-personal-cv.vercel.app
```

Create your CV data:
```bash
cp src/data/cv-data.example.ts src/data/cv-data.ts
```

Run locally:
```bash
npm run dev
```

---

**Demo Mode**
- `/demo` lets users upload or paste a CV to generate a full preview
- A watermark is always visible in demo mode
- To remove the watermark, install and configure Vitae.ai locally

---

**Deployment (Two Vercel Projects)**
- Personal CV: `NEXT_PUBLIC_APP_MODE=personal`
- Public demo: `NEXT_PUBLIC_APP_MODE=demo`

Keep these deployments separate to avoid mixing personal data with the public demo.

---

**CV Data Format**
See `src/data/cv-schema.md` for the exact structure required.

---

**Customization**
- Update data in `src/data/cv-data.ts`
- Edit sections in `src/components/sections`
- Adjust styles in `src/app/globals.css` and Tailwind config

---

**Security & Privacy**
- Never commit API keys
- Keep real CV data out of public templates
- Use `.env.local` and Vercel environment variables

---

**Contributing**
Read `CONTRIBUTING.md` before opening PRs.

---

**License**
MIT. See `LICENSE`.

---

**Credits**
- Martín Alejandro Bundy Muñoz — Owner
- Claude Code — AI collaborator
- Codex — AI collaborator
