# Contributing

Thanks for your interest in contributing to **Vitae.ai**.

## Quick Start

1. Fork the repo and create a branch:
   - `feature/<name>`
   - `fix/<name>`
   - `docs/<name>`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the project:
   ```bash
   npm run dev
   ```

## Development Guidelines

- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui + Radix UI
- **Animations:** Framer Motion
- **i18n:** Add translations under `src/i18n/locales/*`

## Commit Convention

Use conventional commits:

```
feat: add certificates modal
fix: handle github api error
docs: update README
style: polish mobile layout
refactor: extract github api client
```

## Code Quality

- `npm run lint`
- `npm run build`

## AI Collaboration Transparency

This project includes contributions from AI collaborators (Claude Code and Codex).  
Please document significant AI-assisted changes in the PR description.

## Code of Conduct

By participating, you agree to follow `CODE_OF_CONDUCT.md`.
