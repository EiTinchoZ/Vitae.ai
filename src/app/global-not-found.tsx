import type { Metadata } from 'next';
import NotFound from './(es)/not-found';
import './tokens.css';

export const metadata: Metadata = { title: '404 · Martín Bundy' };

// Con dos layouts raíz, Next pinta esta página para las URLs que no existen.
export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body>
        <NotFound />
      </body>
    </html>
  );
}
