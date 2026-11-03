'use client';

import { useEffect } from 'react';
import { SystemStyle } from '../SystemStyle';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // El detalle va a la consola, no a la pantalla: el mensaje puede traer datos internos.
  useEffect(() => console.error(error), [error]);

  return (
    <main className="sys">
      <SystemStyle />
      <small>Error{error.digest ? ` · ${error.digest}` : ''}</small>
      <h1>
        Algo <em>falló</em>.
      </h1>
      <button type="button" onClick={reset}>
        Intentar de nuevo
      </button>
    </main>
  );
}
