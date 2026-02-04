# Vitae.ai Installation Guide

Follow these steps to create your own AI-powered digital CV with Vitae.ai.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or higher
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Groq](https://console.groq.com/) account (free tier available)
- A [Vercel](https://vercel.com/) account (free tier available)
- A [GitHub](https://github.com/) account

## Step 1: Fork the Repository

1. Go to [github.com/EiTinchoZ/vitae-ai](https://github.com/EiTinchoZ/vitae-ai)
2. Click the **Fork** button in the top right
3. Select your account as the destination

## Step 2: Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/vitae-ai.git
cd vitae-ai
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   NEXT_PUBLIC_GITHUB_USERNAME=your_github_username
   ```

### Getting a Groq API Key

1. Go to [console.groq.com](https://console.groq.com/)
2. Create an account or sign in
3. Navigate to **API Keys**
4. Click **Create API Key**
5. Copy the key and paste it in `.env.local`

## Step 5: Add Your CV Data

1. Navigate to `src/data/`
2. Copy the example file:
   ```bash
   cp cv-data.example.ts cv-data.ts
   ```

3. Edit `cv-data.ts` with your information:
   - Update `personal` object with your name, email, etc.
   - Fill in your profile summary
   - Add your education, experience, projects, etc.

See [cv-schema.md](src/data/cv-schema.md) for detailed documentation on the data structure.

## Step 6: Test Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your CV.

## Step 7: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com/)
2. Click **Add New Project**
3. Import your forked repository
4. Configure environment variables:
   - Add `GROQ_API_KEY`
   - Add `NEXT_PUBLIC_GITHUB_USERNAME`
5. Click **Deploy**

### Option B: Via CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts and add environment variables when asked.

## Step 8: Custom Domain (Optional)

1. In your Vercel project dashboard, go to **Settings > Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions

## Troubleshooting

### Build Errors

Run `npm run build` locally to see detailed error messages:
```bash
npm run build
```

Common issues:
- Missing required fields in `cv-data.ts`
- TypeScript type mismatches
- Missing environment variables

### AI Features Not Working

1. Check that `GROQ_API_KEY` is set correctly
2. Verify your Groq account has available credits
3. Check the browser console for error messages

### GitHub Integration Not Working

1. Ensure `NEXT_PUBLIC_GITHUB_USERNAME` is set
2. Verify your GitHub profile is public
3. Check that you have public repositories

## Updating Your CV

After deployment, any changes you push to your repository will automatically trigger a new deployment on Vercel.

1. Edit your `cv-data.ts` locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update CV"
   git push
   ```
3. Vercel will automatically deploy the changes

## Support

- [GitHub Issues](https://github.com/EiTinchoZ/vitae-ai/issues) - Report bugs or request features
- [Documentation](https://github.com/EiTinchoZ/vitae-ai#readme) - Full documentation

---

Made with Vitae.ai - Your career, powered by AI
