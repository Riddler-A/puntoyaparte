import type { Metadata } from "next";
import Link from "next/link";
import { CuentaRegresiva } from "@/components/cuenta-regresiva";
import { TituloSeccion, Pilares, Punto, Voces } from "@/components/secciones";
import {
  agenda,
  boletos,
  donativo,
  edicion,
  mesesSinIntereses,
  perfilSala,
  politicaReembolso,
  sitioUrl,
  venta,
} from "@/lib/evento";

export const metadata: Metadata = {
  title: `Edición ${edicion.anio}`,
  description: `Una pausa de un día para dueños y directivos de Jalisco, más una cata de café por invitación. ${edicion.fechasLargas}, ${edicion.ciudad}. Aparta tu lugar.`,
};

const pesos = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

const desde = Math.min(...boletos.map((b) => b.precio / b.lugares));

const mensajeNominacion = encodeURIComponent(
  `Pensé en ti para Punto y Aparte ${edicion.anio}: un día con dueños y directivos de Jalisco para hablar de empresas que también dejan huella. ${edicion.fechasLargas}. ${sitioUrl}/${edicion.anio}`,
);

const preguntasFrecuentes = [
  {
    pregunta: "¿Cuánto cuesta y qué incluye?",
    respuesta: `Hay boleto General, Preferente (con encuentro 1 a 1 con ponentes) y Mesa empresarial para 4 personas. Los precios incluyen IVA y suben el ${venta.finFaseTexto}. Puedes pagar con tarjeta a ${mesesSinIntereses} meses sin intereses, OXXO o transferencia, y pedir factura CFDI.`,
  },
  {
    pregunta: "¿Puedo pedir un reembolso?",
    respuesta: `${politicaReembolso[0].texto} ${politicaReembolso[1].texto}`,
  },
  {
    pregunta: "¿A dónde va el 50% que mencionan?",
    respuesta: `${donativo.texto} En abril publicamos el reporte completo. ${donativo.boleto}`,
  },
  {
    pregunta: "¿Dónde será?",
    respuesta: `En ${edicion.ciudad}. Compartimos la sede y los horarios exactos con quienes tienen boleto.`,
  },
  {
    pregunta: "¿Qué es la cata de café?",
    respuesta:
      "Es un encuentro el 23 de febrero, de 9 a 11 am, para cerca de 30 participantes con boleto y nuestros aliados oficiales: café de origen, conversaciones uno a uno y sin teléfonos. Es por invitación, que llega por correo.",
  },
  {
    pregunta: "¿Puedo ir con mi equipo directivo?",
    respuesta: "Sí. La Mesa empresarial reserva 4 lugares juntos con una sola factura.",
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
            Riqueza que también deja huella<span className="text-punto">.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-gris sm:text-xl">
            Una pausa para dueños y directivos de Jalisco que ya construyeron algo sólido y se preguntan qué va a quedar.
            Una conversación sobre capitalismo consciente, entre pares.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href={`/${edicion.anio}/boletos`} className="boton-primario px-8 py-4 text-base">
              Aparta tu lugar
            </Link>
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
            <p className="text-papel/60">
              Ese café tiene detrás a alguien que lo cultivó y a alguien que heredó ese oficio. Las empresas también se
              heredan: en decisiones, en la forma de tratar a la gente, en lo que se deja.
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

      {/* Por qué ahora */}
      <section className="bg-tinta text-papel">
        <div className="contenedor grid gap-10 py-20 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-20">
          <div>
            <p className="eyebrow">Por qué ahora</p>
            <p className="mt-6 font-display text-7xl font-bold sm:text-8xl">
              46<span className="text-punto"> h</span>
            </p>
            <p className="mt-2 text-papel/60">Jornada máxima desde el 1 de enero de 2027</p>
          </div>
          <div className="space-y-5 text-lg text-papel/80">
            <p className="font-display text-2xl leading-snug text-papel sm:text-3xl">
              Desde el 1 de enero tu semana tiene dos horas menos, con el mismo sueldo. En 2030 serán ocho.
            </p>
            <p>
              Hay dos maneras de resolverlo: pagar horas extra o tener un equipo que produce mejor y se queda. Esa
              segunda opción es de lo que vamos a hablar, siete semanas después del primer recorte.
            </p>
          </div>
        </div>
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
        <TituloSeccion eyebrow="La experiencia" titulo="Dos encuentros, dos formas de conversar." />
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
            Personas que ya hicieron crecer una empresa y quieren pensar con sus pares qué tipo de empresa van a dejar.
            Nadie viene a vender en la sala.
          </TituloSeccion>
          <dl className="grid grid-cols-2 gap-4">
            {perfilSala.map((p) => (
              <div key={p.etiqueta} className="rounded-3xl bg-crema p-6">
                <dt className="font-display text-3xl font-bold">{p.valor}</dt>
                <dd className="mt-1 text-sm text-gris">{p.etiqueta}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Donativo */}
      <section id="donativo" className="contenedor scroll-mt-20 py-24">
        <TituloSeccion eyebrow="Lo que se aporta, se queda" titulo={donativo.titulo}>
          {donativo.texto}
        </TituloSeccion>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-tinta/10 ring-1 ring-tinta/10 sm:grid-cols-2 lg:grid-cols-4">
          {donativo.pasos.map((p, i) => (
            <li key={p.titulo} className="bg-papel p-7">
              <p className="font-display text-sm font-bold text-punto">0{i + 1}</p>
              <h3 className="mt-6 font-display text-xl font-bold">{p.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gris">{p.texto}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-sm text-gris">{donativo.boleto}</p>
      </section>

      {/* Lugares */}
      <section id="lugares" className="relative scroll-mt-16 overflow-hidden">
        <Punto className="-bottom-40 -left-40 size-96 opacity-90" />
        <div className="contenedor relative grid gap-12 py-24 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <TituloSeccion eyebrow="Aparta tu lugar" titulo="Haz tu pausa.">
            Desde {pesos(desde)} por persona, con IVA incluido. El precio actual se mantiene hasta el{" "}
            {venta.finFaseTexto}. Factura CFDI y {mesesSinIntereses} meses sin intereses.
          </TituloSeccion>
          <div className="rounded-3xl bg-papel p-8 ring-1 ring-tinta/10 sm:p-10">
            <ul className="space-y-3 text-sm">
              {boletos.map((b) => (
                <li key={b.id} className="flex items-baseline justify-between gap-4 border-b border-tinta/10 pb-3">
                  <span>
                    <strong className="font-semibold">{b.nombre}</strong>{" "}
                    <span className="text-gris">· {b.descripcion}</span>
                  </span>
                  <span className="font-display font-semibold tabular-nums">{pesos(b.precio)}</span>
                </li>
              ))}
            </ul>
            <Link href={`/${edicion.anio}/boletos`} className="boton-primario mt-8 w-full py-4 text-base">
              Elegir mis lugares →
            </Link>
            <p className="mt-6 text-sm text-gris">
              ¿Conoces a alguien que debería estar en la sala?{" "}
              <a
                href={`https://wa.me/?text=${mensajeNominacion}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-tinta underline underline-offset-4"
              >
                Nomina a un colega por WhatsApp
              </a>
            </p>
            <p className="mt-3 text-sm text-gris">
              ¿Representas a una marca?{" "}
              <Link href="/patrocina" className="font-semibold text-tinta underline underline-offset-4">
                Conoce cómo ser aliado
              </Link>
            </p>
          </div>
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
