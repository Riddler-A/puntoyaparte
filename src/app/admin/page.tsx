import type { Metadata } from "next";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import { salir } from "@/app/admin/acciones";
import { FormularioClave, FormularioEntrar } from "@/components/admin-acceso";
import { altaValida, cookieSesion, hayClave, largoMinimoClave, sesionValida } from "@/lib/admin";
import { contar, etiquetaColumna, fechaLocal, filas, tablas, type Tabla } from "@/lib/datos";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

const filasVisibles = 200;

export default function Admin({ searchParams }: PageProps<"/admin">) {
  return (
    <main className="contenedor flex-1 py-10 sm:py-14">
      <Suspense fallback={<p className="text-gris">Cargando…</p>}>
        <Contenido searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Contenido({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  // Todo lo de esta página depende de la visita (sesión, hora, base de datos): nada se prerrenderiza.
  await connection();
  const [galletas, parametros] = await Promise.all([cookies(), searchParams]);
  const alta = typeof parametros.alta === "string" ? parametros.alta : "";

  if (alta && altaValida(alta)) {
    return (
      <Tarjeta titulo="Crea tu contraseña" texto="Con ella entrarás a ver las respuestas del sitio.">
        <FormularioClave token={alta} minimo={largoMinimoClave} />
      </Tarjeta>
    );
  }
  if (!hayClave()) {
    return (
      <Tarjeta
        titulo="Aún no hay acceso"
        texto="Esta página se activa con un enlace de alta que se genera en el servidor. Si el tuyo venció, pide uno nuevo."
      />
    );
  }
  if (!sesionValida(galletas.get(cookieSesion)?.value)) {
    return (
      <Tarjeta titulo="Administración" texto="Respuestas de Punto y Aparte.">
        <FormularioEntrar />
      </Tarjeta>
    );
  }
  return <Panel />;
}

function Tarjeta({ titulo, texto, children }: { titulo: string; texto: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-md rounded-3xl bg-papel p-8 ring-1 ring-tinta/10 sm:p-10">
      <span aria-hidden className="block size-10 rounded-full bg-punto" />
      <h1 className="mt-6 font-display text-3xl font-bold">{titulo}</h1>
      <p className="mt-2 text-gris">{texto}</p>
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}

function Panel() {
  const ids = Object.keys(tablas) as Tabla[];
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Administración</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Respuestas del sitio</h1>
        </div>
        <form action={salir}>
          <button type="submit" className="boton-secundario">
            Cerrar sesión
          </button>
        </form>
      </header>

      {ids.map((id) => {
        const total = contar(id);
        const visibles = filas(id, filasVisibles);
        const columnas = tablas[id].columnas;
        return (
          <section key={id} className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold">
                {tablas[id].titulo} <span className="font-normal text-gris tabular-nums">({total})</span>
              </h2>
              {total > 0 && (
                <a href={`/admin/exportar?tabla=${id}`} className="boton-primario">
                  Descargar para Excel
                </a>
              )}
            </div>
            {total === 0 ? (
              <p className="mt-4 rounded-2xl bg-papel p-6 text-gris ring-1 ring-tinta/10">Todavía no hay respuestas.</p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl bg-papel ring-1 ring-tinta/10">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-tinta/10">
                      {columnas.map((c) => (
                        <th key={c} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                          {etiquetaColumna(c)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibles.map((fila, i) => (
                      <tr key={i} className="border-t border-tinta/5 align-top">
                        {columnas.map((c) => (
                          <td key={c} className={`px-4 py-3 ${c === "mensaje" || c === "motivo" ? "min-w-64" : "whitespace-nowrap"}`}>
                            {c === "creado_en" ? fechaLocal(String(fila[c])) : (fila[c] ?? "—")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {total > filasVisibles && (
              <p className="mt-3 text-sm text-gris">
                Se muestran las {filasVisibles} más recientes. La descarga incluye todas.
              </p>
            )}
          </section>
        );
      })}
    </>
  );
}
