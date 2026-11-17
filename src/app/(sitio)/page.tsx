import Image from "next/image";
import Link from "next/link";
import { Pilares, Punto, TituloSeccion } from "@/components/secciones";
import { donativo, edicion, lecturaPrevia, lema, preguntaCentral } from "@/lib/evento";

export default function Inicio() {
  return (
    <>
      <section className="relative overflow-hidden">
        {/* El logo ya está en el encabezado; aquí solo queda el punto de la marca */}
        <Punto className="top-1/2 -right-40 hidden size-[22rem] -translate-y-1/2 lg:block xl:-right-16 xl:size-[30rem]" />
        <div className="contenedor relative pt-12 pb-16 sm:py-24">
          <p className="eyebrow">{lema}</p>
          <h1 className="mt-5 max-w-3xl font-display text-[1.75rem] leading-[1.18] tracking-[-0.01em] text-pretty sm:mt-6 sm:text-5xl sm:leading-[1.12] sm:tracking-tight lg:text-[3.5rem]">
            <span className="font-medium text-gris">{preguntaCentral.planteamiento}</span>{" "}
            <span className="font-bold sm:block">
              {preguntaCentral.remate}
              <span className="text-punto">?</span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-gris sm:mt-8 sm:text-lg">
            Punto y Aparte reúne a dueños y directivos de Jalisco para conversar sobre empresas que prosperan y
            también dejan algo valioso a su paso.
          </p>
        </div>
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
            Conoce la edición <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
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

      <section className="contenedor py-24">
        <div className="grid gap-8 rounded-3xl bg-crema p-8 ring-1 ring-tinta/10 sm:p-12 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="relative mx-auto aspect-[758/1200] w-40 overflow-hidden rounded-xl ring-1 ring-tinta/10 lg:mx-0 lg:w-32">
            <Image src="/lectura/libro.webp" alt="Portada de Capitalismo consciente" fill sizes="160px" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow">{lecturaPrevia.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-bold sm:text-4xl">{lecturaPrevia.titulo}</h2>
            <p className="mt-4 text-gris">{lecturaPrevia.texto}</p>
            <p className="mt-6 font-display text-xl font-bold">{lecturaPrevia.libro}</p>
            <p className="text-sm text-gris">{lecturaPrevia.autores}</p>
          </div>
          <div className="grid gap-3 justify-self-start lg:justify-self-end">
            <a
              href={lecturaPrevia.enlace}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="boton-primario"
            >
              Comprar en Mercado Libre →
            </a>
            <Link href="/lectura" className="text-sm font-semibold underline underline-offset-4 hover:text-punto">
              Leer el resumen y por qué este libro →
            </Link>
            <p className="max-w-xs text-xs text-gris">{lecturaPrevia.aviso}</p>
          </div>
        </div>
      </section>

      <section className="contenedor pb-24">
        <div className="grid gap-8 rounded-3xl bg-tinta p-8 text-papel sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Lo que se aporta, se queda</p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-bold sm:text-4xl">{donativo.titulo}</h2>
            <p className="mt-4 text-papel/70">{donativo.texto}</p>
          </div>
          <Link href={`/${edicion.anio}#donativo`} className="boton-primario justify-self-start">
            Cómo funciona →
          </Link>
        </div>
      </section>
    </>
  );
}
