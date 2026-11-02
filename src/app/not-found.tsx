import Link from 'next/link';
import { SystemStyle } from './SystemStyle';

export default function NotFound() {
  return (
    <main className="sys">
      <SystemStyle />
      <small>404</small>
      <h1>
        Esta página <em>no existe</em>.
      </h1>
      <Link href="/">Volver al inicio</Link>
    </main>
  );
}
