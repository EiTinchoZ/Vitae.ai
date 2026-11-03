// Exporta /cv/print a PDF en A4, ES y EN. Necesita el sitio corriendo (npm run build && npm start).
//   npm run cv:pdf                      -> public/cv/CV_Martin_Bundy_2026_{ES,EN}.pdf (sin teléfono)
//   CV_PHONE="+507 ..." npm run cv:pdf -- --private   -> private/CV_Martin_Bundy_2026_{ES,EN}_tel.pdf
// Opciones: --url=http://localhost:3100  --out=<carpeta>. El teléfono nunca entra al repo ni a la ruta.
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=').slice(1).join('=');
const priv = process.argv.includes('--private');
const base = (arg('url') ?? 'http://localhost:3000').replace(/\/$/, '');
const out = arg('out') ?? join(root, priv ? 'private' : 'public/cv');
const phone = process.env.CV_PHONE?.trim();

if (priv && !phone) {
  console.error('--private necesita CV_PHONE con el número.');
  process.exit(1);
}
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: process.env.CV_BROWSER ?? 'msedge' });
try {
  const page = await browser.newPage();
  for (const lang of ['es', 'en']) {
    const res = await page.goto(`${base}/cv/print?lang=${lang}`, { waitUntil: 'networkidle' });
    if (!res?.ok()) throw new Error(`/cv/print?lang=${lang}: ${res?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    if (priv) {
      await page.evaluate((n) => {
        const s = document.querySelector('[data-phone]');
        s.textContent = n;
        s.hidden = false;
      }, phone);
    }
    const file = join(out, `CV_Martin_Bundy_2026_${lang.toUpperCase()}${priv ? '_tel' : ''}.pdf`);
    await page.pdf({ path: file, format: 'A4', preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
    console.log(file);
  }
} finally {
  await browser.close();
}
