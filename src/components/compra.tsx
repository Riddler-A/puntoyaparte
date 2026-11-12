"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { boletos, edicion, maximoPorCompra, regimenesFiscales, type Boleto } from "@/lib/evento";

// Prototipo de compra: el pago es simulado hasta conectar el proveedor (Stripe).

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
    <div className="contenedor py-10 sm:py-14">
      <Pasos actual={paso} />

      {apartado && (
        <p role="timer" className="mt-6 rounded-xl bg-trazo/15 px-4 py-3 text-sm">
          Apartamos tus boletos por{" "}
          <strong className="tabular-nums">
            {Math.floor(restante / 60)}:{String(restante % 60).padStart(2, "0")}
          </strong>
          . Termina tu compra antes de que se liberen.
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
            accion={
              paso === "boletos" ? (
                <button
                  type="button"
                  disabled={lugares === 0}
                  onClick={() => irA("datos")}
                  className="boton-primario w-full disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continuar
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
            </div>
            <button
              type="button"
              disabled={lugares === 0}
              onClick={() => irA("datos")}
              className="boton-primario disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuar
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
        Elige tus boletos
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
              className={`rounded-3xl p-6 ring-1 transition-colors ${
                b.agotado ? "bg-arena/40 ring-tinta/5" : cantidad > 0 ? "bg-papel ring-2 ring-punto" : "bg-papel ring-tinta/10"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className={b.agotado ? "opacity-50" : undefined}>
                  <p className="text-xs font-semibold tracking-[0.14em] text-gris uppercase">{b.descripcion}</p>
                  <h3 className="mt-1 font-display text-2xl font-bold">{b.nombre}</h3>
                  <p className="mt-1 font-display text-xl font-semibold tabular-nums">{pesos(b.precio)}</p>
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
              {b.quedan !== undefined && !b.agotado && (
                <p className="mt-3 text-sm font-semibold text-punto">Quedan {b.quedan}</p>
              )}
            </li>
          );
        })}
      </ul>
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

function Resumen({ cantidades, total, accion }: { cantidades: Cantidades; total: number; accion: ReactNode }) {
  const elegidos = boletos.filter((b) => (cantidades[b.id] ?? 0) > 0);
  return (
    <aside className={`rounded-3xl bg-tinta p-6 text-papel lg:sticky lg:top-24 ${accion ? "hidden lg:block" : ""}`}>
      <p className="eyebrow">Tu orden</p>
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
      {accion && <div className="mt-6">{accion}</div>}
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
          Continuar al pago
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
          {procesando ? "Procesando…" : metodo === "tarjeta" ? `Pagar ${pesos(total)}` : "Generar referencia de pago"}
        </button>
      </div>
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
        <p className="mt-6 text-sm text-papel/50">
          Folio <span className="font-semibold text-papel tabular-nums">{folio}</span>
        </p>
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
