import type { Metadata } from "next";
import Link from "next/link";
import { TituloSeccion } from "@/components/secciones";
import { edicion, lecturaPrevia, pilares } from "@/lib/evento";

export const metadata: Metadata = {
  title: "Lectura previa: Capitalismo consciente",
  description:
    "Resumen del libro Capitalismo consciente, la lectura de referencia de Punto y Aparte, y por qué la usamos para preparar la conversación.",
};

const principios = [
  {
    titulo: "Propósito superior",
    texto: "Una empresa existe para algo más que ganar dinero. El propósito orienta decisiones y da sentido al trabajo.",
  },
  {
    titulo: "Orientación a los grupos de interés",
    texto: "Clientes, equipo, proveedores, comunidad y medio ambiente importan. Crear valor para todos sostiene el negocio.",
  },
  {
    titulo: "Liderazgo consciente",
    texto: "Quien dirige cuida la visión, la cultura y a las personas, y es responsable de cómo se logran los resultados.",
  },
  {
    titulo: "Cultura consciente",
    texto: "Los valores se practican todos los días, en la contratación, la confianza y la forma de resolver conflictos.",
  },
];

const preguntas = [
  "¿Cuál es el propósito de tu empresa más allá de la utilidad?",
  "¿Quiénes son tus grupos de interés y cuál de ellos descuidas hoy?",
  "¿Qué decisión de este año tomarías distinto si el equipo fuera tu primer cliente?",
];

export default function Lectura() {
  return (
    <>
      <section className="contenedor pt-16 pb-12 sm:pt-24">
        <p className="eyebrow">Lectura previa</p>
        <h1 className="titulo mt-4 max-w-3xl">{lecturaPrevia.libro}.</h1>
        <p className="mt-6 max-w-2xl text-lg text-gris">
          {lecturaPrevia.autores}. Es la lectura de referencia de Punto y Aparte: la idea de que una empresa puede ser
          rentable y, al mismo tiempo, dejar algo valioso a su paso.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href={lecturaPrevia.enlace} target="_blank" rel="sponsored noopener noreferrer" className="boton-primario">
            Comprar en Mercado Libre →
          </a>
          <p className="max-w-sm text-xs text-gris">{lecturaPrevia.aviso}</p>
        </div>
      </section>

      <section className="bg-papel">
        <div className="contenedor py-20">
          <TituloSeccion eyebrow="Por qué este libro" titulo="La idea que sostiene los cuatro pilares.">
            Punto y Aparte pregunta si el éxito de una empresa significa algo más que sus cifras. Este libro lo plantea
            con un método: ordena la conversación en principios que cualquier dueño puede revisar en su propio negocio.
          </TituloSeccion>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {pilares.map((p) => (
              <p key={p.nombre} className="rounded-2xl bg-crema p-6 text-sm text-gris ring-1 ring-tinta/10">
                <span className="font-display font-bold text-tinta">
                  {p.numero} · {p.nombre}.
                </span>{" "}
                {p.texto}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="contenedor py-20">
        <TituloSeccion eyebrow="Resumen" titulo="Cuatro principios, dicho con nuestras palabras." />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-tinta/10 ring-1 ring-tinta/10 sm:grid-cols-2">
          {principios.map((p, i) => (
            <li key={p.titulo} className="bg-papel p-7">
              <p className="font-display text-sm font-bold text-punto">0{i + 1}</p>
              <h3 className="mt-6 font-display text-2xl font-bold">{p.titulo}</h3>
              <p className="mt-3 leading-relaxed text-gris">{p.texto}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-sm text-gris">
          Resumen propio de las ideas principales del libro, no una reproducción del texto. Para los matices, lee la obra.
          Edición original en inglés: Harvard Business Review Press.
        </p>
      </section>

      <section className="bg-tinta text-papel">
        <div className="contenedor py-20">
          <p className="eyebrow">Antes de llegar</p>
          <h2 className="titulo mt-4 max-w-3xl text-papel">Tres preguntas para llevar a Punto y Aparte.</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {preguntas.map((q, i) => (
              <li key={q} className="rounded-2xl bg-papel/5 p-6 ring-1 ring-papel/10">
                <p className="font-display text-sm font-bold text-punto">0{i + 1}</p>
                <p className="mt-4 text-lg">{q}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link href={`/${edicion.anio}`} className="boton-primario">
              Conoce la edición {edicion.anio} →
            </Link>
            <Link href="/" className="boton-secundario">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
