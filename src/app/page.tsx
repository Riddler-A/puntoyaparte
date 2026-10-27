import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/marca/logo-punto-y-aparte.png";
import { Pilares, TituloSeccion } from "@/components/secciones";
import { edicion, preguntaCentral } from "@/lib/evento";

export default function Inicio() {
  return (
    <>
      <section className="contenedor grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">Una pausa para replantear la forma de hacer negocios</p>
          <h1 className="mt-6 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
            {preguntaCentral}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gris">Ese es el diálogo que proponemos en Punto y Aparte.</p>
        </div>
        <Image src={logo} alt="Punto y Aparte" priority className="mx-auto w-full max-w-md" />
      </section>

      <section className="contenedor grid gap-6 pb-24 md:grid-cols-2">
        <Link
          href={`/${edicion.anio}`}
          className="group relative overflow-hidden rounded-3xl bg-punto p-8 text-papel transition-colors hover:bg-punto-oscuro sm:p-12"
        >
          <p className="text-xs font-semibold tracking-[0.18em] uppercase opacity-80">Para dueños y directivos</p>
          <h2 className="mt-6 font-display text-4xl font-bold">Edición {edicion.anio}</h2>
          <p className="mt-3 max-w-sm text-lg opacity-90">
            {edicion.fechasLargas} · {edicion.ciudad}. Voces y cata de café.
          </p>
          <span className="mt-10 inline-flex items-center gap-2 font-semibold">
            Solicita tu lugar <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
        <Link
          href="/patrocina"
          className="group relative overflow-hidden rounded-3xl bg-tinta p-8 text-papel transition-colors hover:bg-black sm:p-12"
        >
          <p className="eyebrow">Para marcas</p>
          <h2 className="mt-6 font-display text-4xl font-bold">Patrocina</h2>
          <p className="mt-3 max-w-sm text-lg text-papel/70">
            Tu marca frente a 100 decisores, en una conversación con propósito.
          </p>
          <span className="mt-10 inline-flex items-center gap-2 font-semibold">
            Conoce los paquetes <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </section>

      <section className="bg-papel">
        <div className="contenedor py-24">
          <TituloSeccion eyebrow="Cuatro pilares de diálogo" titulo="Hagamos que el éxito signifique algo más." />
          <Pilares />
        </div>
      </section>
    </>
  );
}
