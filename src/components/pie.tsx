import Link from "next/link";
import { contacto, edicion } from "@/lib/evento";

export function Pie() {
  return (
    <footer className="bg-tinta text-papel">
      <div className="contenedor grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">
            punto y aparte<span className="text-punto">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-papel/70">
            Conversaciones sobre empresa, prosperidad y humanidad.
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Explora</p>
          <ul className="space-y-2 text-papel/80">
            <li><Link href={`/${edicion.anio}`} className="hover:text-papel">Edición {edicion.anio}</Link></li>
            <li><Link href="/patrocina" className="hover:text-papel">Patrocina</Link></li>
            <li><Link href="/privacidad" className="hover:text-papel">Aviso de privacidad</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Contacto</p>
          <ul className="space-y-2 text-papel/80">
            <li>{contacto.nombre} · {contacto.cargo}</li>
            <li><a href={contacto.whatsapp} className="hover:text-papel">{contacto.telefono}</a></li>
            <li><a href={`mailto:${contacto.email}`} className="break-all hover:text-papel">{contacto.email}</a></li>
            <li><a href={contacto.instagram} className="hover:text-papel">{contacto.instagramUsuario}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-papel/10">
        <p className="contenedor py-5 text-xs text-papel/50">
          © Punto y Aparte · {edicion.ciudad}
        </p>
      </div>
    </footer>
  );
}
