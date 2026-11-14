import type { Metadata } from "next";
import { FormularioPropuesta } from "@/components/formularios";
import { Punto, TituloSeccion, Voces } from "@/components/secciones";
import { beneficios, contacto, edicion, paquetes, perfilAsistente } from "@/lib/evento";

export const metadata: Metadata = {
  title: "Patrocina",
  description: `Tu marca frente a 100 dueños y directivos, en una conversación con propósito. Punto y Aparte ${edicion.anio}, ${edicion.ciudad}.`,
};

const razones = [
  {
    titulo: "Visibilidad ante decisores",
    texto: "100 dueños y directivos perfilados según tu target, antes, durante y después del evento.",
  },
  {
    titulo: "Conversación directa",
    texto: "Pitch de 7 minutos en el escenario y encuentros 1 a 1 durante el cierre.",
  },
  {
    titulo: "Una marca con propósito",
    texto: "El 50% de tu aportación impulsa la filantropía a través de AFP.",
  },
];

const momentos = [
  { momento: "Antes", texto: "Logo en registro, 8 mailings a +4,000 contactos, artes, pauta con alcance de +90,000 y tráiler." },
  { momento: "Durante", texto: "Cintillos por conferencia, fondo de prensa, menciones en escenario y pitch como patrocinador oficial." },
  { momento: "Después", texto: "Posteo de cierre, reporte final y descuento para la próxima edición." },
];

function Celda({ valor }: { valor: string | boolean }) {
  if (valor === true) return <span aria-label="Incluido" className="mx-auto block size-3 rounded-full bg-punto" />;
  if (valor === false) return <span aria-label="No incluido" className="text-tinta/25">—</span>;
  return <span className="font-semibold tabular-nums">{valor}</span>;
}

export default function Patrocina() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-tinta text-papel">
        <Punto className="-top-36 -right-40 size-64 sm:top-auto sm:-right-24 sm:-bottom-32 sm:size-[32rem]" />
        <div className="contenedor relative py-20 sm:py-28">
          <p className="eyebrow">Patrocinios {edicion.anio} · {edicion.fechasCortas} · {edicion.ciudad}</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.98] font-bold tracking-tight text-balance sm:text-7xl">
            Tu marca frente a quienes deciden<span className="text-punto">.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-papel/70 sm:text-xl">
            En una conversación con propósito: empresa, prosperidad y humanidad.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#propuesta" className="boton-primario px-8 py-4 text-base">
              Solicita la propuesta
            </a>
            <a href={contacto.whatsapp} className="boton border border-papel/30 px-8 py-4 text-base text-papel hover:border-papel">
              Escríbenos por WhatsApp
            </a>
          </div>
          <dl className="mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { valor: "100", etiqueta: "dueños y directivos" },
              { valor: "+4,000", etiqueta: "contactos por correo" },
              { valor: "+90,000", etiqueta: "alcance en pauta" },
              { valor: "2", etiqueta: "días de evento" },
            ].map((c) => (
              <div key={c.etiqueta}>
                <dt className="font-display text-4xl font-bold">{c.valor}</dt>
                <dd className="mt-1 text-sm text-papel/60">{c.etiqueta}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Por qué */}
      <section className="contenedor py-24">
        <TituloSeccion eyebrow="Por qué patrocinar" titulo="Más que un logo: una conversación." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {razones.map((r, i) => (
            <article key={r.titulo} className="rounded-3xl bg-papel p-8 ring-1 ring-tinta/10">
              <p className="font-display text-sm font-bold text-punto">0{i + 1}</p>
              <h3 className="mt-8 font-display text-2xl font-bold">{r.titulo}</h3>
              <p className="mt-3 text-gris">{r.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Quién asiste */}
      <section className="bg-papel">
        <div className="contenedor grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
          <TituloSeccion eyebrow="Quién asiste" titulo="Dueños y directivos de medianas empresas.">
            Perfilamos a cada invitado según el target de los patrocinadores, para que cada conversación pueda
            convertirse en negocio. Intereses: su giro, inversión, altruismo, artes y tendencias.
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

      {/* Antes, durante, después */}
      <section className="contenedor py-24">
        <TituloSeccion eyebrow="Qué gana tu marca" titulo="Presencia antes, durante y después." />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-tinta/10 ring-1 ring-tinta/10 md:grid-cols-3">
          {momentos.map((m) => (
            <li key={m.momento} className="bg-papel p-8">
              <p className="font-display text-3xl font-bold">
                {m.momento}
                <span className="text-punto">.</span>
              </p>
              <p className="mt-4 text-gris">{m.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Paquetes */}
      <section id="paquetes" className="bg-arena/50">
        <div className="contenedor py-24">
          <TituloSeccion eyebrow="Paquetes" titulo="Tres formas de ser parte." />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {paquetes.map((p) => (
              <article
                key={p.id}
                className={`relative flex flex-col rounded-3xl p-8 ${p.oficial ? "bg-tinta text-papel ring-2 ring-punto" : "bg-papel ring-1 ring-tinta/10"}`}
              >
                {p.oficial && (
                  <span className="absolute -top-3 left-8 rounded-full bg-punto px-3 py-1 text-xs font-semibold text-papel">
                    Patrocinador oficial
                  </span>
                )}
                <h3 className="font-display text-3xl font-bold">{p.nombre}</h3>
                <p className={`mt-2 ${p.oficial ? "text-papel/70" : "text-gris"}`}>{p.resumen}</p>
                <ul className="mt-8 flex-1 space-y-3">
                  {p.destacados.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-punto" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                {p.disponibles && <p className="mt-6 text-sm font-semibold text-punto">{p.disponibles}</p>}
                <a
                  href="#propuesta"
                  className={`mt-8 ${p.oficial ? "boton-primario" : "boton-secundario"}`}
                >
                  Quiero {p.nombre}
                </a>
              </article>
            ))}
          </div>

          {/* Comparador */}
          <div className="mt-16 overflow-x-auto rounded-3xl bg-papel ring-1 ring-tinta/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Comparación de beneficios por paquete</caption>
              <thead>
                <tr className="border-b border-tinta/10">
                  <th scope="col" className="p-5 font-display text-base">Beneficio</th>
                  {paquetes.map((p) => (
                    <th key={p.id} scope="col" className="w-28 p-5 text-center font-display text-base">
                      {p.nombre}
                    </th>
                  ))}
                </tr>
              </thead>
              {beneficios.map((g) => (
                <tbody key={g.grupo}>
                  <tr>
                    <th colSpan={4} scope="colgroup" className="bg-crema px-5 py-3 text-xs font-semibold tracking-[0.18em] text-punto uppercase">
                      {g.grupo}
                    </th>
                  </tr>
                  {g.filas.map((f) => (
                    <tr key={f.beneficio} className="border-t border-tinta/5">
                      <th scope="row" className="p-5 font-normal">{f.beneficio}</th>
                      {f.valores.map((v, i) => (
                        <td key={i} className="p-5 text-center">
                          <Celda valor={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <p className="mt-4 text-sm text-gris">
            Souvenirs de marca sugeridos: portavasos, banner de piso y tent cards en coctelería.
          </p>
        </div>
      </section>

      {/* Impacto */}
      <section id="impacto" className="relative overflow-hidden">
        <div className="contenedor grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <TituloSeccion eyebrow="Tu inversión deja huella" titulo="El 50% de cada patrocinio impulsa una causa.">
              Se destina a AFP (Association of Fundraising Professionals), que profesionaliza la procuración de fondos
              para que más causas sociales consigan recursos. Cada patrocinador recibe un reporte final después del
              evento.
            </TituloSeccion>
          </div>
          <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
            <span aria-hidden className="absolute inset-0 rounded-full bg-punto" />
            <p className="relative text-center text-papel">
              <span className="block font-display text-8xl font-bold">50%</span>
              <span className="text-lg">para la causa</span>
            </p>
          </div>
        </div>
      </section>

      {/* Voces */}
      <section className="bg-papel">
        <div className="contenedor py-24">
          <TituloSeccion eyebrow="Las voces de esta edición" titulo="Tu marca junto a estas conversaciones." />
          <Voces />
        </div>
      </section>

      {/* Propuesta */}
      <section id="propuesta" className="scroll-mt-16 bg-tinta text-papel">
        <div className="contenedor grid gap-12 py-24 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="eyebrow mb-4">Solicita la propuesta</p>
            <h2 className="titulo">Hagamos que el éxito signifique algo más.</h2>
            <p className="mt-5 text-lg text-papel/70">
              Déjanos tus datos y te enviamos la propuesta completa con montos y disponibilidad.
            </p>
            <div className="mt-10 space-y-1 text-sm text-papel/70">
              <p className="font-semibold text-papel">{contacto.nombre} · {contacto.cargo}</p>
              <p><a href={contacto.whatsapp} className="hover:text-papel">{contacto.telefono}</a></p>
              <p><a href={`mailto:${contacto.email}`} className="break-all hover:text-papel">{contacto.email}</a></p>
            </div>
          </div>
          <FormularioPropuesta />
        </div>
      </section>
    </>
  );
}
