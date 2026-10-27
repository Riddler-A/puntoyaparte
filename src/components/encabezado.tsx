import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/marca/logo-punto-y-aparte.png";
import { edicion } from "@/lib/evento";

export function Encabezado() {
  return (
    <header className="sticky top-0 z-40 border-b border-tinta/10 bg-crema/90 backdrop-blur">
      <div className="contenedor flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Punto y Aparte, inicio" className="shrink-0">
          <Image src={logo} alt="Punto y Aparte" priority className="h-9 w-auto" />
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
          <Link href={`/${edicion.anio}`} className="hidden rounded-full px-3 py-2 hover:bg-arena/60 sm:block">
            Edición {edicion.anio}
          </Link>
          <Link href="/patrocina" className="hidden rounded-full px-3 py-2 hover:bg-arena/60 sm:block">
            Patrocina
          </Link>
          <Link href={`/${edicion.anio}#solicitud`} className="boton-primario px-4 py-2">
            Solicita tu lugar
          </Link>
        </nav>
      </div>
    </header>
  );
}
