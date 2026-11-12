import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/marca/logo-punto-y-aparte.png";
import { Pilares, TituloSeccion } from "@/components/secciones";
import { edicion, preguntaCentral } from "@/lib/evento";

export default function Inicio() {
  return (
    <>
      <section className="contenedor grid gap-12 pt-12 pb-16 sm:py-24 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">
            Una pausa para replantear<span className="hidden sm:inline"> la forma de hacer negocios</span>
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-[1.75rem] leading-[1.18] tracking-[-0.01em] text-pretty sm:mt-6 sm:text-5xl sm:leading-[1.12] sm:tracking-tight lg:text-[3.5rem]">
            <span className="font-medium text-gris">{preguntaCentral.planteamiento}</span>{" "}
            <span className="font-bold">
              {preguntaCentral.remate}
              <span className="text-punto">?</span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-gris sm:mt-8 sm:text-lg">
            Ese es el diálogo que proponemos en Punto y Aparte.
          </p>
        </div>
        {/* En móvil el encabezado ya muestra el logo */}
        <Image src={logo} alt="Punto y Aparte" priority className="mx-auto hidden w-full max-w-sm lg:block" />
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
