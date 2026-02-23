import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-muted border border-border">
          <span className="text-4xl font-bold text-muted-foreground">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Pagina no encontrada
          </h1>
          <p className="text-muted-foreground">
            La pagina que buscas no existe o fue movida.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
