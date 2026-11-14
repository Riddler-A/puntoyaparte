import type { Metadata } from "next";
import Link from "next/link";
import { CuentaRegresiva } from "@/components/cuenta-regresiva";
import { FormularioLugar } from "@/components/formularios";
import { TituloSeccion, Pilares, Punto, Voces } from "@/components/secciones";
import { agenda, edicion, perfilAsistente } from "@/lib/evento";

export const metadata: Metadata = {
  title: `Edición ${edicion.anio}`,
  description: `Voces y cata de café para dueños y directivos de empresa. ${edicion.fechasLargas}, ${edicion.ciudad}. Solicita tu lugar.`,
};

const preguntasFrecuentes = [
  {
    pregunta: "¿Por qué hay que solicitar un lugar?",
    respuesta:
      "Punto y Aparte reúne a cerca de 100 dueños y directivos. Revisamos cada perfil para que las conversaciones sean entre personas que toman decisiones y puedan aportarse algo.",
  },
  {
    pregunta: "¿Qué pasa después de enviar mi solicitud?",
    respuesta:
      "Revisamos tu perfil y te escribimos por correo para confirmar tu lugar, ponerte en lista de espera o contarte de futuras ediciones.",
  },
  {
    pregunta: "¿Dónde será?",
    respuesta: `En ${edicion.ciudad}. Compartiremos la sede y los horarios exactos con las personas confirmadas.`,
  },
  {
    pregunta: "¿Qué es la cata de café?",
    respuesta:
      "El segundo día es un encuentro íntimo de cerca de 30 invitados perfilados con nuestros patrocinadores oficiales: conversación director a director, sin escenario.",
  },
  {
    pregunta: "¿Puedo invitar a alguien de mi equipo o a otro empresario?",
    respuesta: "Sí. Pídele que envíe su propia solicitud; cada lugar se revisa de forma individual.",
  },
];

export default function Edicion2027() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Punto className="-top-32 -right-32 size-64 opacity-95 sm:-top-24 sm:-right-16 sm:size-[28rem] lg:top-10 lg:right-0" />
        <div className="contenedor relative py-20 sm:py-28">
          <p className="eyebrow">Edición {edicion.anio} · {edicion.ciudad}</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.98] font-bold tracking-tight text-balance sm:text-7xl lg:text-8xl">
            ¿Solo riqueza, o algo que deja huella<span className="text-punto">?</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-gris sm:text-xl">
            Dos días para dueños y directivos que quieren replantear la forma de hacer negocios: conversaciones sobre
            empresa, prosperidad y humanidad.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#solicitud" className="boton-primario px-8 py-4 text-base">
              Solicita tu lugar
            </a>
            <a href="#agenda" className="boton-secundario px-8 py-4 text-base">
              Ver la agenda
            </a>
          </div>
          <div className="mt-14 flex flex-wrap items-end gap-x-10 gap-y-6">
            <div>
              <p className="text-sm text-gris">Fechas</p>
              <p className="font-display text-2xl font-bold">{edicion.fechasLargas}</p>
            </div>
            <CuentaRegresiva fecha={edicion.inicio} />
          </div>
        </div>
      </section>

      {/* Imagina esto */}
      <section className="bg-tinta text-papel">
        <div className="contenedor grid gap-10 py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <p className="eyebrow">Imagina esto</p>
          <div className="space-y-6 font-display text-2xl leading-snug sm:text-3xl">
            <p>Llegas a tu oficina por la mañana y pasas por dos cafés: uno para ti y otro para un colaborador.</p>
            <p className="text-papel/60">
              No porque te lo pidieron. Porque recuerdas cómo le gusta, o porque ayer lo notaste preocupado.
            </p>
            <p>
              Es un gesto pequeño. Pero detrás hay algo que ninguna estrategia sustituye:{" "}
              <span className="text-punto">reconocer al otro como persona.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="contenedor py-24">
        <TituloSeccion eyebrow="Cuatro pilares de diálogo" titulo="Una empresa que prospera y deja algo a su paso.">
          Cada conversación de Punto y Aparte parte de estas cuatro preguntas sobre cómo hacemos negocios.
        </TituloSeccion>
        <Pilares />
      </section>

      {/* Voces */}
      <section className="bg-arena/50">
        <div className="contenedor py-24">
          <TituloSeccion eyebrow="Las voces de esta edición" titulo="Tres conversaciones, 40 minutos cada una." />
          <Voces />
        </div>
      </section>

      {/* Agenda */}
      <section id="agenda" className="contenedor scroll-mt-20 py-24">
        <TituloSeccion eyebrow="La experiencia" titulo="Dos días, dos formas de conversar." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {agenda.map((d, i) => (
            <article
              key={d.dia}
              className={`rounded-3xl p-8 sm:p-10 ${i === 0 ? "bg-papel ring-1 ring-tinta/10" : "bg-tinta text-papel"}`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="eyebrow">{d.dia} · {d.fecha}</p>
                <p className={`text-sm ${i === 0 ? "text-gris" : "text-papel/60"}`}>{d.descripcion}</p>
              </div>
              <h3 className="mt-6 font-display text-4xl font-bold">{d.nombre}</h3>
              <ol className="mt-8 space-y-4">
                {d.bloques.map((b) => (
                  <li
                    key={b.nombre}
                    className={`flex items-baseline justify-between gap-4 border-t pt-4 ${i === 0 ? "border-tinta/10" : "border-papel/15"}`}
                  >
                    <span>{b.nombre}</span>
                    {b.duracion && (
                      <span className={`shrink-0 text-sm tabular-nums ${i === 0 ? "text-gris" : "text-papel/60"}`}>
                        {b.duracion}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      {/* Para quién */}
      <section className="bg-papel">
        <div className="contenedor grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
          <TituloSeccion eyebrow="Para quién es" titulo="Dueños y directivos que toman decisiones.">
            Perfilamos a cada invitado para que la sala reúna a personas que pueden convertir una buena conversación en
            una mejor empresa.
          </TituloSeccion>
          <dl className="grid grid-cols-2 gap-4">
            {perfilAsistente.map((p) => (
              <div key={p.etiqueta} className="rounded-3xl bg-crema p-6">
                <dt className="font-display text-3xl font-bold">{p.valor}</dt>
                <dd className="mt-1 text-sm text-gris">{p.etiqueta}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Solicitud */}
      <section id="solicitud" className="relative scroll-mt-16 overflow-hidden">
        <Punto className="-bottom-40 -left-40 size-96 opacity-90" />
        <div className="contenedor relative grid gap-12 py-24 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <TituloSeccion eyebrow="Solicita tu lugar" titulo="Haz tu pausa.">
              Cuéntanos de ti y de tu empresa. Revisamos cada solicitud y te confirmamos por correo.
            </TituloSeccion>
            <p className="mt-8 text-sm text-gris">
              ¿Representas a una marca?{" "}
              <Link href="/patrocina" className="font-semibold text-tinta underline underline-offset-4">
                Conoce cómo patrocinar
              </Link>
            </p>
          </div>
          <FormularioLugar />
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="contenedor pb-24">
        <h2 className="font-display text-3xl font-bold">Preguntas frecuentes</h2>
        <div className="mt-8 divide-y divide-tinta/10 border-y border-tinta/10">
          {preguntasFrecuentes.map((f) => (
            <details key={f.pregunta} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                {f.pregunta}
                <span aria-hidden className="size-3 shrink-0 rounded-full bg-punto transition-transform group-open:scale-150" />
              </summary>
              <p className="mt-3 max-w-3xl text-gris">{f.respuesta}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
