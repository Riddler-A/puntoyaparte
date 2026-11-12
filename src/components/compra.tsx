"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  boletos,
  contacto,
  edicion,
  maximoPorCompra,
  ponentes,
  regimenesFiscales,
  venta,
  type Boleto,
} from "@/lib/evento";

// Prototipo de compra: el pago es simulado hasta conectar el proveedor (Stripe).
// Decisiones de persuasión: ancla de precio (fase siguiente), prueba social, escasez real,
// pago fraccionado (MSI) y lenguaje de pertenencia ("tus lugares").

type Paso = "boletos" | "datos" | "pago" | "listo";
type Cantidades = Record<string, number>;
type Datos = Record<string, string>;
type Metodo = "tarjeta" | "oxxo" | "spei";

const pasos: { id: Paso; nombre: string }[] = [
  { id: "boletos", nombre: "Boletos" },
  { id: "datos", nombre: "Tus datos" },
  { id: "pago", nombre: "Pago" },
  { id: "listo", nombre: "Listo" },
];

const apartadoSegundos = 10 * 60;

const pesos = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

function totalDe(cantidades: Cantidades) {
  return boletos.reduce((suma, b) => suma + b.precio * (cantidades[b.id] ?? 0), 0);
}

function lugaresDe(cantidades: Cantidades) {
  return boletos.reduce((suma, b) => suma + b.lugares * (cantidades[b.id] ?? 0), 0);
}

// Lo que se ahorra frente al precio de la siguiente fase.
function ahorroDe(cantidades: Cantidades) {
  return boletos.reduce(
    (suma, b) => suma + ((b.precioSiguiente ?? b.precio) - b.precio) * (cantidades[b.id] ?? 0),
    0,
  );
}

// Tiempo restante hasta una fecha; null hasta montar en el cliente.
function useFaltan(fecha: string) {
  const [faltan, setFaltan] = useState<{ dias: number; horas: number } | null>(null);
  useEffect(() => {
    const calcular = () => {
      const ms = Math.max(0, new Date(fecha).getTime() - Date.now());
      setFaltan({ dias: Math.floor(ms / 86_400_000), horas: Math.floor((ms % 86_400_000) / 3_600_000) });
    };
    const inicio = setTimeout(calcular, 0);
    const reloj = setInterval(calcular, 60_000);
    return () => {
      clearTimeout(inicio);
      clearInterval(reloj);
    };
  }, [fecha]);
  return faltan;
}

export function Compra() {
  const [paso, setPaso] = useState<Paso>("boletos");
  const [cantidades, setCantidades] = useState<Cantidades>({});
  const [datos, setDatos] = useState<Datos>({});
  const [limite, setLimite] = useState(0);
  const [restante, setRestante] = useState(apartadoSegundos);
  const [expirado, setExpirado] = useState(false);
  const [folio, setFolio] = useState("");

  const total = totalDe(cantidades);
  const lugares = lugaresDe(cantidades);
  const ahorro = ahorroDe(cantidades);
  const apartado = paso === "datos" || paso === "pago";

  useEffect(() => {
    if (!apartado) return;
    const reloj = setInterval(() => {
      const segundos = Math.max(0, Math.round((limite - Date.now()) / 1000));
      setRestante(segundos);
      if (segundos === 0) {
        setExpirado(true);
        setPaso("boletos");
      }
    }, 1000);
    return () => clearInterval(reloj);
  }, [apartado, limite]);

  function irA(destino: Paso) {
    if (destino === "datos" && paso === "boletos") {
      setLimite(Date.now() + apartadoSegundos * 1000);
      setRestante(apartadoSegundos);
      setExpirado(false);
    }
    setPaso(destino);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cambiar(boleto: Boleto, delta: number) {
    setCantidades((actual) => {
      const nueva = Math.max(0, (actual[boleto.id] ?? 0) + delta);
      if (delta > 0 && lugaresDe(actual) + boleto.lugares > maximoPorCompra) return actual;
      if (boleto.quedan !== undefined && nueva > boleto.quedan) return actual;
      return { ...actual, [boleto.id]: nueva };
    });
  }

  function pagado() {
    setFolio(`PYA-${edicion.anio.slice(2)}-${Math.floor(1000 + Math.random() * 9000)}`);
    irA("listo");
  }

  return (
    <div className="contenedor py-8 sm:py-12">
      {paso === "boletos" && <EncabezadoEvento />}
      <Pasos actual={paso} />

      {apartado && (
        <p role="timer" className="mt-6 rounded-xl bg-trazo/15 px-4 py-3 text-sm">
          Tus lugares están apartados por{" "}
          <strong className="tabular-nums">
            {Math.floor(restante / 60)}:{String(restante % 60).padStart(2, "0")}
          </strong>
          . Después se liberan para alguien más.
        </p>
      )}
      {expirado && paso === "boletos" && (
        <p role="alert" className="mt-6 rounded-xl bg-punto/10 px-4 py-3 text-sm text-punto-oscuro">
          Se acabó el tiempo y liberamos tus boletos. Puedes volver a elegirlos.
        </p>
      )}

      {paso === "listo" ? (
        <Confirmacion folio={folio} cantidades={cantidades} datos={datos} />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div>
            {paso === "boletos" && <SeleccionBoletos cantidades={cantidades} lugares={lugares} cambiar={cambiar} />}
            {paso === "datos" && (
              <FormularioDatos
                datos={datos}
                guardar={(d) => {
                  setDatos(d);
                  irA("pago");
                }}
                volver={() => irA("boletos")}
              />
            )}
            {paso === "pago" && <Pago total={total} pagar={pagado} volver={() => irA("datos")} />}
          </div>
          <Resumen
            cantidades={cantidades}
            total={total}
            ahorro={ahorro}
            accion={
              paso === "boletos" ? (
                <button
                  type="button"
                  disabled={lugares === 0}
                  onClick={() => irA("datos")}
                  className="boton-primario w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Asegurar mis lugares →
                </button>
              ) : null
            }
          />
        </div>
      )}

      {/* Barra fija en móvil mientras se eligen boletos */}
      {paso === "boletos" && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-tinta/10 bg-papel/95 backdrop-blur lg:hidden">
          <div className="contenedor flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-xs text-gris">
                {lugares === 0 ? "Elige tus boletos" : `${lugares} ${lugares === 1 ? "lugar" : "lugares"} en tu orden`}
              </p>
              <p className="font-display text-xl font-bold tabular-nums">{pesos(total)}</p>
              {ahorro > 0 && <p className="text-xs font-semibold text-punto">Ahorras {pesos(ahorro)}</p>}
            </div>
            <button
              type="button"
              disabled={lugares === 0}
              onClick={() => irA("datos")}
              className="boton-primario disabled:cursor-not-allowed disabled:opacity-40"
            >
              Asegurar lugares →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Pasos({ actual }: { actual: Paso }) {
  const indice = pasos.findIndex((p) => p.id === actual);
  return (
    <ol className="flex items-center gap-2 text-sm sm:gap-3">
      {pasos.map((p, i) => (
        <li key={p.id} className="flex items-center gap-2 sm:gap-3">
          <span
            aria-current={i === indice ? "step" : undefined}
            className={`flex items-center gap-2 ${i <= indice ? "text-tinta" : "text-gris/60"}`}
          >
            <span
              className={`grid size-6 place-items-center rounded-full text-xs font-semibold ${
                i < indice ? "bg-tinta text-papel" : i === indice ? "bg-punto text-papel" : "ring-1 ring-tinta/20"
              }`}
            >
              {i < indice ? "✓" : i + 1}
            </span>
            <span className={i === indice ? "font-semibold" : "hidden sm:inline"}>{p.nombre}</span>
          </span>
          {i < pasos.length - 1 && <span aria-hidden className="h-px w-4 bg-tinta/15 sm:w-8" />}
        </li>
      ))}
    </ol>
  );
}

function EncabezadoEvento() {
  const faltan = useFaltan(venta.finFase);
  return (
    <section className="relative mb-10 overflow-hidden rounded-3xl bg-tinta p-6 text-papel sm:p-10">
      <span
        aria-hidden
        className="absolute -top-20 -right-20 size-36 rounded-full bg-punto sm:-top-24 sm:-right-24 sm:size-80"
      />
      <div className="relative">
        <p className="eyebrow text-trazo">
          {edicion.fechasLargas} · {edicion.ciudad}
        </p>
        <h1 className="mt-4 max-w-xl font-display text-3xl leading-tight font-bold sm:text-5xl">
          Haz tu pausa en Punto y Aparte {edicion.anio}
          <span className="text-punto">.</span>
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex -space-x-3">
            {ponentes.map((p) => (
              <Image
                key={p.nombre}
                src={p.foto}
                alt={p.nombre}
                className="size-11 rounded-full object-cover ring-2 ring-tinta"
                sizes="44px"
              />
            ))}
          </div>
          <p className="text-sm text-papel/70">
            <strong className="text-papel">3 voces</strong> sobre empresa, prosperidad y humanidad
          </p>
        </div>

        <div className="mt-8 grid gap-6 border-t border-papel/15 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-sm">
              <strong className="font-display text-2xl">{venta.confirmados}</strong>{" "}
              <span className="text-papel/70">dueños y directivos ya tienen su lugar</span>
            </p>
          </div>
          <div>
            <div className="flex justify-between text-xs text-papel/70">
              <span>
                {venta.fase} · {venta.porcentajeVendido}% vendido
              </span>
              <span className="tabular-nums" aria-live="off">
                {faltan ? `Termina en ${faltan.dias} d ${faltan.horas} h` : `Hasta el ${venta.finFaseTexto}`}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-papel/15">
              <div className="h-full rounded-full bg-punto" style={{ width: `${venta.porcentajeVendido}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const confianza = [
  { titulo: "Pago seguro", texto: "Procesado por el proveedor; nunca vemos tu tarjeta." },
  { titulo: "Factura CFDI", texto: "Deducible para tu empresa, a tu correo." },
  { titulo: "Meses sin intereses", texto: "Hasta 6 MSI con tarjetas participantes." },
  { titulo: "Transferible", texto: "¿No puedes ir? Cambia el nombre del pase." },
];

function SeleccionBoletos({
  cantidades,
  lugares,
  cambiar,
}: {
  cantidades: Cantidades;
  lugares: number;
  cambiar: (b: Boleto, delta: number) => void;
}) {
  return (
    <section aria-labelledby="titulo-boletos">
      <h2 id="titulo-boletos" className="font-display text-3xl font-bold">
        Elige tus lugares
      </h2>
      <p className="mt-2 text-sm text-gris">
        Precios en pesos mexicanos, con IVA y cargo por servicio incluidos. Máximo {maximoPorCompra} lugares por compra.
      </p>
      <ul className="mt-6 space-y-4">
        {boletos.map((b) => {
          const cantidad = cantidades[b.id] ?? 0;
          const lleno = lugares + b.lugares > maximoPorCompra || (b.quedan !== undefined && cantidad >= b.quedan);
          return (
            <li
              key={b.id}
              className={`relative rounded-3xl p-6 transition-colors ${
                b.agotado
                  ? "bg-arena/40 ring-1 ring-tinta/5"
                  : cantidad > 0 || b.destacado
                    ? "bg-papel ring-2 ring-punto"
                    : "bg-papel ring-1 ring-tinta/10"
              } ${b.destacado ? "mt-7 shadow-lg shadow-punto/10" : ""}`}
            >
              {b.destacado && (
                <span className="absolute -top-3 left-6 rounded-full bg-punto px-3 py-1 text-xs font-semibold text-papel">
                  {b.destacado}
                </span>
              )}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className={b.agotado ? "opacity-50" : undefined}>
                  <p className="text-xs font-semibold tracking-[0.14em] text-gris uppercase">{b.descripcion}</p>
                  <h3 className="mt-1 font-display text-2xl font-bold">{b.nombre}</h3>
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                    <span className={`font-display text-xl font-semibold tabular-nums ${b.agotado ? "line-through" : ""}`}>
                      {pesos(b.precio)}
                    </span>
                    {b.precioSiguiente && !b.agotado && (
                      <span className="text-sm text-gris">
                        sube a <span className="tabular-nums line-through">{pesos(b.precioSiguiente)}</span> el{" "}
                        {venta.finFaseTexto}
                      </span>
                    )}
                  </p>
                  {!b.agotado && b.precio >= 1000 && (
                    <p className="mt-1 text-xs text-gris">o 3 MSI de {pesos(Math.ceil(b.precio / 3))}</p>
                  )}
                </div>
                {b.agotado ? (
                  <span className="rounded-full bg-tinta/10 px-3 py-1 text-xs font-semibold text-gris">Agotado</span>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Quitar un boleto ${b.nombre}`}
                      disabled={cantidad === 0}
                      onClick={() => cambiar(b, -1)}
                      className="grid size-10 place-items-center rounded-full text-xl ring-1 ring-tinta/20 transition hover:ring-tinta disabled:opacity-30"
                    >
                      −
                    </button>
                    <span aria-live="polite" className="w-6 text-center font-display text-xl font-bold tabular-nums">
                      {cantidad}
                    </span>
                    <button
                      type="button"
                      aria-label={`Agregar un boleto ${b.nombre}`}
                      disabled={lleno}
                      onClick={() => cambiar(b, 1)}
                      className="grid size-10 place-items-center rounded-full bg-punto text-xl text-papel transition hover:bg-punto-oscuro disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
              <ul className={`mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gris ${b.agotado ? "opacity-50" : ""}`}>
                {b.incluye.map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span aria-hidden className="size-1.5 rounded-full bg-punto" />
                    {x}
                  </li>
                ))}
              </ul>
              {(b.nota || (b.quedan !== undefined && !b.agotado)) && (
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {b.quedan !== undefined && !b.agotado && (
                    <span className="font-semibold text-punto">Solo quedan {b.quedan}</span>
                  )}
                  {b.nota && <span className={b.agotado ? "text-gris" : "font-medium text-tinta"}>{b.nota}</span>}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {confianza.map((c) => (
          <li key={c.titulo} className="flex gap-3">
            <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-tinta text-[10px] text-papel">
              ✓
            </span>
            <span className="text-sm">
              <strong className="block">{c.titulo}</strong>
              <span className="text-gris">{c.texto}</span>
            </span>
          </li>
        ))}
      </ul>

      <figure className="mt-10 rounded-3xl bg-arena/50 p-6 sm:p-8">
        <blockquote className="font-display text-xl leading-snug font-medium sm:text-2xl">
          “{venta.testimonio.texto}”
        </blockquote>
        <figcaption className="mt-4 text-sm text-gris">
          <strong className="text-tinta">{venta.testimonio.autor}</strong> · {venta.testimonio.cargo}
        </figcaption>
      </figure>

      <p className="mt-6 text-sm text-gris">
        El Día 2 (cata de café) es por invitación.{" "}
        <Link href="/2027#solicitud" className="font-semibold text-tinta underline underline-offset-4">
          Solicita tu lugar
        </Link>
      </p>
      {/* Espacio para que la barra fija móvil no tape el contenido */}
      <div aria-hidden className="h-20 lg:hidden" />
    </section>
  );
}

function Resumen({
  cantidades,
  total,
  ahorro,
  accion,
}: {
  cantidades: Cantidades;
  total: number;
  ahorro: number;
  accion: ReactNode;
}) {
  const elegidos = boletos.filter((b) => (cantidades[b.id] ?? 0) > 0);
  return (
    <aside className={`rounded-3xl bg-tinta p-6 text-papel lg:sticky lg:top-24 ${accion ? "hidden lg:block" : ""}`}>
      <p className="eyebrow">Tus lugares</p>
      <p className="mt-3 font-display text-lg font-bold">Punto y Aparte {edicion.anio}</p>
      <p className="text-sm text-papel/60">
        {edicion.fechasLargas} · {edicion.ciudad}
      </p>
      <ul className="mt-6 space-y-3 border-t border-papel/15 pt-5 text-sm">
        {elegidos.length === 0 && <li className="text-papel/50">Aún no eliges boletos.</li>}
        {elegidos.map((b) => (
          <li key={b.id} className="flex justify-between gap-4">
            <span>
              {cantidades[b.id]} × {b.nombre}
            </span>
            <span className="tabular-nums">{pesos(b.precio * cantidades[b.id])}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-baseline justify-between border-t border-papel/15 pt-5">
        <span className="text-sm text-papel/70">Total</span>
        <span className="font-display text-3xl font-bold tabular-nums">{pesos(total)}</span>
      </div>
      <p className="mt-1 text-right text-xs text-papel/50">IVA y cargo por servicio incluidos</p>
      {ahorro > 0 && (
        <p className="mt-4 rounded-xl bg-punto/20 px-4 py-2.5 text-sm">
          Ahorras <strong className="tabular-nums">{pesos(ahorro)}</strong> frente al precio después del{" "}
          {venta.finFaseTexto}.
        </p>
      )}
      {total >= 1000 && (
        <p className="mt-3 text-sm text-papel/70">
          o hasta 6 MSI de <strong className="text-papel tabular-nums">{pesos(Math.ceil(total / 6))}</strong>
        </p>
      )}
      {accion && <div className="mt-6">{accion}</div>}
      {accion && (
        <p className="mt-3 text-center text-xs text-papel/50">Tus lugares quedan apartados 10 minutos al continuar.</p>
      )}
    </aside>
  );
}

function FormularioDatos({
  datos,
  guardar,
  volver,
}: {
  datos: Datos;
  guardar: (d: Datos) => void;
  volver: () => void;
}) {
  const [factura, setFactura] = useState(datos.factura === "on");
  const [errores, setErrores] = useState<Record<string, string>>({});

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valores = Object.fromEntries(new FormData(e.currentTarget)) as Datos;
    const nuevos: Record<string, string> = {};
    for (const campo of ["nombre", "apellido", "email", "telefono"]) {
      if (!valores[campo]?.trim()) nuevos[campo] = "Este dato es necesario.";
    }
    if (valores.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email)) nuevos.email = "Revisa tu correo.";
    if (factura) {
      if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/i.test(valores.rfc ?? "")) nuevos.rfc = "Revisa tu RFC (12 o 13 caracteres).";
      if (!valores.razon_social?.trim()) nuevos.razon_social = "Escribe la razón social como aparece en tu constancia.";
      if (!/^\d{5}$/.test(valores.cp_fiscal ?? "")) nuevos.cp_fiscal = "Código postal de 5 dígitos.";
      if (!valores.regimen) nuevos.regimen = "Elige tu régimen fiscal.";
    }
    if (!valores.acepta) nuevos.acepta = "Acepta los términos para continuar.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length === 0) guardar(valores);
  }

  const campo = (nombre: string, etiqueta: string, entrada: ReactNode, className = "") => (
    <div className={className}>
      <label htmlFor={`compra-${nombre}`} className="mb-1.5 block text-sm font-medium">
        {etiqueta}
      </label>
      {entrada}
      {errores[nombre] && <p className="mt-1.5 text-sm text-punto-oscuro">{errores[nombre]}</p>}
    </div>
  );

  const props = (nombre: string) => ({
    id: `compra-${nombre}`,
    name: nombre,
    defaultValue: datos[nombre],
    "aria-invalid": errores[nombre] ? true : undefined,
    className: "campo",
  });

  return (
    <form onSubmit={enviar} noValidate>
      <h2 className="font-display text-3xl font-bold">Tus datos</h2>
      <p className="mt-2 text-sm text-gris">Te enviaremos los boletos a este correo. Podrás asignar nombres desde tu cuenta.</p>
      <div className="mt-6 grid gap-5 rounded-3xl bg-papel p-6 ring-1 ring-tinta/10 sm:grid-cols-2 sm:p-8">
        {campo("nombre", "Nombre", <input {...props("nombre")} autoComplete="given-name" />)}
        {campo("apellido", "Apellido", <input {...props("apellido")} autoComplete="family-name" />)}
        {campo("email", "Correo", <input {...props("email")} type="email" autoComplete="email" placeholder="nombre@empresa.com" />)}
        {campo("telefono", "Teléfono (WhatsApp)", <input {...props("telefono")} type="tel" autoComplete="tel" placeholder="33 1234 5678" />)}
        {campo("empresa", "Empresa (opcional)", <input {...props("empresa")} autoComplete="organization" />, "sm:col-span-2")}

        <label className="flex items-center gap-3 border-t border-tinta/10 pt-5 text-sm font-medium sm:col-span-2">
          <input
            type="checkbox"
            name="factura"
            checked={factura}
            onChange={(e) => setFactura(e.target.checked)}
            className="size-4 accent-punto"
          />
          Necesito factura (CFDI)
        </label>
        {factura && (
          <>
            {campo("rfc", "RFC", <input {...props("rfc")} className="campo uppercase" maxLength={13} />)}
            {campo("cp_fiscal", "Código postal fiscal", <input {...props("cp_fiscal")} inputMode="numeric" maxLength={5} />)}
            {campo("razon_social", "Razón social", <input {...props("razon_social")} />, "sm:col-span-2")}
            {campo(
              "regimen",
              "Régimen fiscal",
              <select {...props("regimen")}>
                <option value="">Elige una opción</option>
                {regimenesFiscales.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>,
              "sm:col-span-2",
            )}
            <p className="text-sm text-gris sm:col-span-2">
              Uso de CFDI: G03 Gastos en general. La factura llega a tu correo al confirmar el pago.
            </p>
          </>
        )}

        <div className="border-t border-tinta/10 pt-5 sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-gris">
            <input type="checkbox" name="acepta" defaultChecked={datos.acepta === "on"} className="mt-0.5 size-4 accent-punto" />
            <span>
              Acepto los términos de compra, la política de reembolsos y el{" "}
              <Link href="/privacidad" className="underline underline-offset-2 hover:text-tinta">
                aviso de privacidad
              </Link>
              .
            </span>
          </label>
          {errores.acepta && <p className="mt-1.5 text-sm text-punto-oscuro">{errores.acepta}</p>}
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={volver} className="boton-secundario">
          ← Cambiar boletos
        </button>
        <button type="submit" className="boton-primario">
          Continuar al pago →
        </button>
      </div>
    </form>
  );
}

const metodos: { id: Metodo; nombre: string; detalle: string }[] = [
  { id: "tarjeta", nombre: "Tarjeta", detalle: "Crédito o débito · meses sin intereses" },
  { id: "oxxo", nombre: "OXXO", detalle: "Pago en efectivo · 3 días para pagar" },
  { id: "spei", nombre: "Transferencia", detalle: "SPEI desde tu banca" },
];

function Pago({ total, pagar, volver }: { total: number; pagar: () => void; volver: () => void }) {
  const [metodo, setMetodo] = useState<Metodo>("tarjeta");
  const [meses, setMeses] = useState("1");
  const [procesando, setProcesando] = useState(false);

  function confirmar() {
    setProcesando(true);
    setTimeout(pagar, 1200);
  }

  return (
    <section aria-labelledby="titulo-pago">
      <h2 id="titulo-pago" className="font-display text-3xl font-bold">
        Pago
      </h2>
      <p className="mt-2 text-sm text-gris">Pago seguro. Punto y Aparte nunca ve ni guarda los datos de tu tarjeta.</p>

      <fieldset className="mt-6 grid gap-3 sm:grid-cols-3">
        <legend className="sr-only">Método de pago</legend>
        {metodos.map((m) => (
          <label
            key={m.id}
            className={`cursor-pointer rounded-2xl p-4 ring-1 transition ${
              metodo === m.id ? "bg-papel ring-2 ring-punto" : "bg-papel/60 ring-tinta/10 hover:ring-tinta/30"
            }`}
          >
            <input
              type="radio"
              name="metodo"
              value={m.id}
              checked={metodo === m.id}
              onChange={() => setMetodo(m.id)}
              className="sr-only"
            />
            <span className="block font-semibold">{m.nombre}</span>
            <span className="mt-1 block text-xs text-gris">{m.detalle}</span>
          </label>
        ))}
      </fieldset>

      <div className="mt-5 rounded-3xl bg-papel p-6 ring-1 ring-tinta/10 sm:p-8">
        {metodo === "tarjeta" && (
          <>
            <div className="grid min-h-40 place-items-center rounded-2xl border-2 border-dashed border-tinta/15 p-6 text-center text-sm text-gris">
              <p>
                <strong className="block text-tinta">Formulario seguro del proveedor de pagos</strong>
                Aquí aparecerán los campos de tarjeta de Stripe al conectarlo.
              </p>
            </div>
            <label htmlFor="meses" className="mt-5 mb-1.5 block text-sm font-medium">
              Plazo
            </label>
            <select id="meses" value={meses} onChange={(e) => setMeses(e.target.value)} className="campo">
              <option value="1">Una sola exhibición · {pesos(total)}</option>
              <option value="3">3 meses sin intereses · {pesos(Math.ceil(total / 3))} al mes</option>
              <option value="6">6 meses sin intereses · {pesos(Math.ceil(total / 6))} al mes</option>
            </select>
          </>
        )}
        {metodo === "oxxo" && (
          <p className="text-sm text-gris">
            Al confirmar, generamos una ficha con código de barras para pagar en cualquier OXXO. Tus boletos quedan
            apartados 3 días y te llegan por correo cuando se acredite el pago.
          </p>
        )}
        {metodo === "spei" && (
          <p className="text-sm text-gris">
            Al confirmar, te damos una CLABE única para esta compra. El pago se acredita en minutos y te enviamos tus
            boletos por correo.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={volver} disabled={procesando} className="boton-secundario">
          ← Volver
        </button>
        <button type="button" onClick={confirmar} disabled={procesando} className="boton-primario disabled:opacity-60">
          {procesando
            ? "Procesando…"
            : metodo === "tarjeta"
              ? `Confirmar mis lugares · ${pesos(total)}`
              : "Generar referencia de pago"}
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-gris sm:text-right">
        ¿Dudas antes de pagar? Escríbenos por{" "}
        <a href={contacto.whatsapp} className="font-semibold text-tinta underline underline-offset-2">
          WhatsApp
        </a>
        .
      </p>
      <p className="mt-4 text-xs text-gris">Prototipo: el pago es simulado y no se hace ningún cargo.</p>
    </section>
  );
}

function Confirmacion({ folio, cantidades, datos }: { folio: string; cantidades: Cantidades; datos: Datos }) {
  const pases = boletos.flatMap((b) =>
    Array.from({ length: (cantidades[b.id] ?? 0) * b.lugares }, (_, i) => ({ boleto: b, numero: i + 1 })),
  );
  return (
    <section role="status" className="mt-8">
      <div className="rounded-3xl bg-tinta p-8 text-papel sm:p-12">
        <span aria-hidden className="block size-14 rounded-full bg-punto" />
        <h2 className="mt-6 font-display text-4xl font-bold">
          ¡Nos vemos en febrero, {datos.nombre}
          <span className="text-punto">!</span>
        </h2>
        <p className="mt-3 max-w-xl text-papel/70">
          Enviamos tus boletos a <strong className="text-papel">{datos.email}</strong>
          {datos.factura === "on" && " junto con tu factura"}. También los encuentras en tu cuenta.
        </p>
        <p className="mt-4 max-w-xl text-papel/70">
          Ya eres parte de los {venta.confirmados + pases.length} dueños y directivos que harán su pausa este año.
        </p>
        <p className="mt-6 text-sm text-papel/50">
          Folio <span className="font-semibold text-papel tabular-nums">{folio}</span>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={enlaceCalendario} target="_blank" rel="noreferrer" className="boton-primario">
            Agregar a mi calendario
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Voy a Punto y Aparte ${edicion.anio} (${edicion.fechasLargas}, ${edicion.ciudad}). ¿Te animas? https://puntoy-aparte.netlify.app/2027`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="boton border border-papel/30 text-papel hover:border-papel"
          >
            Invita a un colega
          </a>
        </div>
      </div>

      <h3 className="mt-12 font-display text-2xl font-bold">Tus pases ({pases.length})</h3>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pases.map(({ boleto, numero }) => (
          <li key={`${boleto.id}-${numero}`} className="flex gap-5 rounded-3xl bg-papel p-5 ring-1 ring-tinta/10">
            <QrMuestra semilla={`${folio}-${boleto.id}-${numero}`} />
            <div className="min-w-0">
              <p className="eyebrow">{boleto.nombre}</p>
              <p className="mt-2 font-display text-lg font-bold">Pase {numero}</p>
              <p className="text-sm text-gris">{boleto.descripcion}</p>
              <p className="mt-2 text-xs text-gris">Asigna un nombre desde tu cuenta</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/2027" className="boton-secundario">
          Volver a la edición {edicion.anio}
        </Link>
      </div>
    </section>
  );
}

// TODO: horario provisional (9:00 a 18:00, hora de Guadalajara).
const enlaceCalendario = `https://calendar.google.com/calendar/render?${new URLSearchParams({
  action: "TEMPLATE",
  text: `Punto y Aparte ${edicion.anio}`,
  dates: "20270217T150000Z/20270218T000000Z",
  location: edicion.ciudad,
})}`;

// Cuadrícula decorativa con forma de QR; el código real se genera al emitir el boleto.
function QrMuestra({ semilla }: { semilla: string }) {
  let h = 2166136261;
  for (const c of semilla) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const n = 21;
  const esquina = (x: number, y: number) =>
    [
      [0, 0],
      [n - 7, 0],
      [0, n - 7],
    ].some(([ex, ey]) => x >= ex && x < ex + 7 && y >= ey && y < ey + 7);
  const celdas: [number, number][] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (esquina(x, y)) continue;
      h = Math.imul(h ^ (h >>> 15), 2246822507);
      if ((h >>> 0) % 2) celdas.push([x, y]);
    }
  }
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} role="img" aria-label="Código QR de muestra" className="size-24 shrink-0 rounded-lg bg-white">
      {celdas.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#1e1c1c" />
      ))}
      {[
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x + 0.5} y={y + 0.5} width={6} height={6} fill="none" stroke="#1e1c1c" />
          <rect x={x + 2} y={y + 2} width={3} height={3} fill="#f94441" />
        </g>
      ))}
    </svg>
  );
}
