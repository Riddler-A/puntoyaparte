import Image from "next/image";
import type { ReactNode } from "react";
import { pilares, ponentes } from "@/lib/evento";

export function TituloSeccion({ eyebrow, titulo, children }: { eyebrow: string; titulo: ReactNode; children?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="titulo">{titulo}</h2>
      {children && <div className="mt-5 text-lg text-gris">{children}</div>}
    </div>
  );
}

export function Pilares() {
  return (
    <div className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-tinta/10 ring-1 ring-tinta/10 sm:grid-cols-2 lg:grid-cols-4">
      {pilares.map((p) => (
        <article key={p.nombre} className="group bg-papel p-7 transition-colors hover:bg-crema">
          <p className="font-display text-sm font-bold text-punto">{p.numero}</p>
          <h3 className="mt-8 font-display text-2xl font-bold">{p.nombre}</h3>
          <p className="mt-3 text-sm leading-relaxed text-gris">{p.texto}</p>
        </article>
      ))}
    </div>
  );
}

export function Voces() {
  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {ponentes.map((p) => (
        <article key={p.nombre} className="flex flex-col overflow-hidden rounded-3xl bg-papel ring-1 ring-tinta/10">
          <div className="relative aspect-[4/3] bg-arena">
            <Image
              src={p.foto}
              alt={p.nombre}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover object-top"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-tinta px-3 py-1 text-xs font-semibold text-papel">
              {p.tema}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-display text-xl font-bold">{p.nombre}</h3>
            <p className="mt-1 text-sm text-gris">{p.cargo}</p>
            <p className="mt-5 border-l-2 border-punto pl-4 text-base leading-relaxed">{p.pregunta}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function Punto({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`pointer-events-none absolute rounded-full bg-punto ${className}`} />;
}
