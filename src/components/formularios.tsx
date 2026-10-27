"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { solicitarLugar, solicitarPropuesta, type EstadoFormulario } from "@/app/acciones";
import {
  opcionesComoSeEntero,
  opcionesPuesto,
  opcionesTamanoEmpresa,
  paquetes,
  pilares,
} from "@/lib/evento";

const inicial: EstadoFormulario = { ok: false, mensaje: "" };

type PropsCampo = {
  nombre: string;
  etiqueta: string;
  estado: EstadoFormulario;
  opcional?: boolean;
  className?: string;
  children: (props: { id: string; name: string; defaultValue?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => ReactNode;
};

function Campo({ nombre, etiqueta, estado, opcional, className, children }: PropsCampo) {
  const error = estado.errores?.[nombre]?.[0];
  const id = `campo-${nombre}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {etiqueta}
        {opcional && <span className="font-normal text-gris"> (opcional)</span>}
      </label>
      {children({
        id,
        name: nombre,
        defaultValue: estado.valores?.[nombre],
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? `${id}-error` : undefined,
      })}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-punto-oscuro">
          {error}
        </p>
      )}
    </div>
  );
}

function Opciones({ opciones, placeholder }: { opciones: { valor: string; texto: string }[]; placeholder: string }) {
  return (
    <>
      <option value="">{placeholder}</option>
      {opciones.map((o) => (
        <option key={o.valor} value={o.valor}>
          {o.texto}
        </option>
      ))}
    </>
  );
}

const lista = (valores: string[]) => valores.map((v) => ({ valor: v, texto: v }));

function Privacidad({ estado }: { estado: EstadoFormulario }) {
  const error = estado.errores?.acepta_privacidad?.[0];
  return (
    <div className="sm:col-span-2">
      <label className="flex items-start gap-3 text-sm text-gris">
        <input
          type="checkbox"
          name="acepta_privacidad"
          defaultChecked={estado.valores?.acepta_privacidad === "on"}
          className="mt-0.5 size-4 accent-punto"
        />
        <span>
          Acepto el{" "}
          <Link href="/privacidad" className="underline underline-offset-2 hover:text-tinta">
            aviso de privacidad
          </Link>{" "}
          y que Punto y Aparte me contacte sobre esta solicitud.
        </span>
      </label>
      {error && <p className="mt-1.5 text-sm text-punto-oscuro">{error}</p>}
    </div>
  );
}

function Resultado({ estado, titulo }: { estado: EstadoFormulario; titulo: string }) {
  return (
    <div role="status" className="rounded-3xl bg-papel p-8 text-center ring-1 ring-tinta/10 sm:p-12">
      <span aria-hidden className="mx-auto mb-6 block size-14 rounded-full bg-punto" />
      <h3 className="font-display text-3xl font-bold">{titulo}</h3>
      <p className="mx-auto mt-3 max-w-md text-gris">{estado.mensaje}</p>
    </div>
  );
}

function Aviso({ estado }: { estado: EstadoFormulario }) {
  if (!estado.mensaje || estado.ok) return null;
  return (
    <p role="alert" className="rounded-xl bg-punto/10 px-4 py-3 text-sm text-punto-oscuro sm:col-span-2">
      {estado.mensaje}
    </p>
  );
}

export function FormularioLugar() {
  const [estado, accion, enviando] = useActionState(solicitarLugar, inicial);

  if (estado.ok) return <Resultado estado={estado} titulo="Solicitud recibida" />;

  return (
    <form action={accion} noValidate className="grid gap-5 rounded-3xl bg-papel p-6 ring-1 ring-tinta/10 sm:grid-cols-2 sm:p-10">
      <Aviso estado={estado} />
      <Campo nombre="nombre" etiqueta="Nombre" estado={estado}>
        {(p) => <input {...p} className="campo" autoComplete="given-name" />}
      </Campo>
      <Campo nombre="apellido" etiqueta="Apellido" estado={estado}>
        {(p) => <input {...p} className="campo" autoComplete="family-name" />}
      </Campo>
      <Campo nombre="email" etiqueta="Correo" estado={estado}>
        {(p) => <input {...p} type="email" className="campo" autoComplete="email" placeholder="nombre@empresa.com" />}
      </Campo>
      <Campo nombre="telefono" etiqueta="Teléfono (WhatsApp)" estado={estado}>
        {(p) => <input {...p} type="tel" className="campo" autoComplete="tel" placeholder="33 1234 5678" />}
      </Campo>
      <Campo nombre="empresa" etiqueta="Empresa" estado={estado}>
        {(p) => <input {...p} className="campo" autoComplete="organization" />}
      </Campo>
      <Campo nombre="puesto" etiqueta="Puesto" estado={estado}>
        {(p) => (
          <select {...p} className="campo">
            <Opciones opciones={lista(opcionesPuesto)} placeholder="Elige una opción" />
          </select>
        )}
      </Campo>
      <Campo nombre="giro" etiqueta="Giro de la empresa" estado={estado}>
        {(p) => <input {...p} className="campo" placeholder="Manufactura, servicios, comercio…" />}
      </Campo>
      <Campo nombre="tamano_empresa" etiqueta="Tamaño de la empresa" estado={estado}>
        {(p) => (
          <select {...p} className="campo">
            <Opciones opciones={lista(opcionesTamanoEmpresa)} placeholder="Elige una opción" />
          </select>
        )}
      </Campo>
      <Campo nombre="pilar_interes" etiqueta="¿Qué pilar te mueve más hoy?" estado={estado}>
        {(p) => (
          <select {...p} className="campo">
            <Opciones opciones={lista(pilares.map((x) => x.nombre))} placeholder="Elige un pilar" />
          </select>
        )}
      </Campo>
      <Campo nombre="como_se_entero" etiqueta="¿Cómo te enteraste?" estado={estado} opcional>
        {(p) => (
          <select {...p} className="campo">
            <Opciones opciones={lista(opcionesComoSeEntero)} placeholder="Elige una opción" />
          </select>
        )}
      </Campo>
      <Campo nombre="motivo" etiqueta="¿Qué te gustaría llevarte de Punto y Aparte?" estado={estado} opcional className="sm:col-span-2">
        {(p) => <textarea {...p} rows={3} className="campo resize-y" />}
      </Campo>
      <Privacidad estado={estado} />
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gris">Cupo limitado. Revisamos cada solicitud y te confirmamos por correo.</p>
        <button type="submit" disabled={enviando} className="boton-primario disabled:opacity-60">
          {enviando ? "Enviando…" : "Enviar solicitud"}
        </button>
      </div>
    </form>
  );
}

export function FormularioPropuesta() {
  const [estado, accion, enviando] = useActionState(solicitarPropuesta, inicial);

  if (estado.ok) return <Resultado estado={estado} titulo="Gracias por tu interés" />;

  return (
    <form action={accion} noValidate className="grid gap-5 rounded-3xl bg-papel p-6 text-tinta ring-1 ring-tinta/10 sm:grid-cols-2 sm:p-10">
      <Aviso estado={estado} />
      <Campo nombre="nombre" etiqueta="Nombre completo" estado={estado}>
        {(p) => <input {...p} className="campo" autoComplete="name" />}
      </Campo>
      <Campo nombre="empresa" etiqueta="Empresa o marca" estado={estado}>
        {(p) => <input {...p} className="campo" autoComplete="organization" />}
      </Campo>
      <Campo nombre="email" etiqueta="Correo" estado={estado}>
        {(p) => <input {...p} type="email" className="campo" autoComplete="email" placeholder="nombre@empresa.com" />}
      </Campo>
      <Campo nombre="telefono" etiqueta="Teléfono (WhatsApp)" estado={estado}>
        {(p) => <input {...p} type="tel" className="campo" autoComplete="tel" placeholder="33 1234 5678" />}
      </Campo>
      <Campo nombre="puesto" etiqueta="Puesto" estado={estado}>
        {(p) => <input {...p} className="campo" autoComplete="organization-title" />}
      </Campo>
      <Campo nombre="paquete" etiqueta="Paquete de interés" estado={estado}>
        {(p) => (
          <select {...p} className="campo">
            <Opciones
              opciones={[
                ...paquetes.map((x) => ({ valor: x.id, texto: x.nombre })),
                { valor: "sin-definir", texto: "Aún no lo sé" },
              ]}
              placeholder="Elige un paquete"
            />
          </select>
        )}
      </Campo>
      <Campo nombre="mensaje" etiqueta="¿Qué te gustaría lograr con tu patrocinio?" estado={estado} opcional className="sm:col-span-2">
        {(p) => <textarea {...p} rows={3} className="campo resize-y" />}
      </Campo>
      <Privacidad estado={estado} />
      <div className="flex justify-end sm:col-span-2">
        <button type="submit" disabled={enviando} className="boton-primario disabled:opacity-60">
          {enviando ? "Enviando…" : "Solicitar propuesta"}
        </button>
      </div>
    </form>
  );
}
