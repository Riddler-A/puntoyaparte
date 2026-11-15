"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { aceptarInvitacion, type EstadoFormulario } from "@/app/acciones";
import logo from "@/assets/marca/logo-punto-y-aparte.png";
import { contacto, edicion, enlaceCalendario } from "@/lib/evento";
import type { Invitado } from "@/lib/invitados";
import { evento } from "@/lib/medicion";

type Etapa = "carta" | "preguntas";
type Valores = Record<string, string>;

type Pregunta = {
  campo: string;
  pregunta: string;
  tipo: "text" | "email" | "tel";
  placeholder: string;
  autoComplete: string;
  nota?: string;
  validar: (v: string) => string | null;
};

const preguntas: Pregunta[] = [
  {
    campo: "nombre",
    pregunta: "¿Cómo te gusta que te llamen?",
    tipo: "text",
    placeholder: "Tu nombre",
    autoComplete: "name",
    validar: (v) => (v.trim().length >= 2 ? null : "Escribe tu nombre."),
  },
  {
    campo: "email",
    pregunta: "¿A qué correo te enviamos tu invitación?",
    tipo: "email",
    placeholder: "nombre@empresa.com",
    autoComplete: "email",
    validar: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Revisa tu correo."),
  },
  {
    campo: "telefono",
    pregunta: "¿A qué número te escribimos?",
    tipo: "tel",
    placeholder: "33 1234 5678",
    autoComplete: "tel",
    nota: "Solo para avisos importantes por WhatsApp.",
    validar: (v) => (v.replace(/\D/g, "").length >= 10 ? null : "Un número de 10 dígitos."),
  },
  {
    campo: "giro",
    pregunta: "¿A qué se dedica tu empresa?",
    tipo: "text",
    placeholder: "Manufactura, servicios, comercio…",
    autoComplete: "off",
    validar: (v) => (v.trim().length >= 2 ? null : "Cuéntanos a qué se dedica tu empresa."),
  },
];

const inicial: EstadoFormulario = { ok: false, mensaje: "" };

export function CartaInvitacion({ invitado }: { invitado: Invitado }) {
  const [etapa, setEtapa] = useState<Etapa>("carta");
  const [estado, accion, enviando] = useActionState(aceptarInvitacion, inicial);

  useEffect(() => {
    if (estado.ok) evento("generate_lead", { formulario: "invitacion", invitado: invitado.slug });
  }, [estado.ok, invitado.slug]);

  return (
    <div className="flex min-h-dvh flex-col items-center px-4 py-8 sm:py-14">
      <Image src={logo} alt="Punto y Aparte" priority className="w-28 sm:w-32" />
      <div className="mt-8 w-full max-w-xl flex-1">
        {estado.ok ? (
          <Confirmacion nombre={invitado.nombre} email={estado.mensaje} />
        ) : etapa === "carta" ? (
          <Carta invitado={invitado} aceptar={() => setEtapa("preguntas")} />
        ) : (
          <Preguntas invitado={invitado} estado={estado} accion={accion} enviando={enviando} />
        )}
      </div>
      <p className="mt-10 text-xs text-gris">
        Punto y Aparte · {edicion.ciudad} · {edicion.anio}
      </p>
    </div>
  );
}

function Carta({ invitado, aceptar }: { invitado: Invitado; aceptar: () => void }) {
  return (
    <article className="relative animate-entrada overflow-hidden rounded-3xl bg-papel p-7 shadow-xl shadow-tinta/5 ring-1 ring-tinta/10 sm:p-12">
      <span aria-hidden className="absolute -top-12 -right-12 size-24 rounded-full bg-punto sm:size-28" />
      <p className="eyebrow relative pr-14">
        Invitación personal
        <span className="block sm:inline"> · Edición {edicion.anio}</span>
      </p>
      <h1 className="relative mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
        Hola, {invitado.nombre}
        <span className="text-punto">.</span>
      </h1>

      <div className="mt-6 space-y-5 text-base leading-relaxed text-tinta/85 sm:text-lg">
        <p className="font-medium text-tinta">
          {invitado.invitaPor} te envía esta invitación antes de abrir la preventa, porque cree que tu voz hace falta
          en esta conversación.
        </p>
        <p>
          Punto y Aparte reúne a 100 dueños y directivos en {edicion.ciudad} alrededor de una pregunta:{" "}
          <em>¿qué va a quedar de nuestras empresas cuando ya no estemos en la oficina?</em>
        </p>
        <p>
          Hablamos de <strong className="text-tinta">capitalismo consciente</strong>: negocios rentables que cuidan a
          su gente, deciden con ética y dejan huella en su comunidad. No es filantropía. Es una mejor forma de hacer
          empresa.
        </p>
      </div>

      <p className="mt-8 rounded-2xl bg-crema px-5 py-4 font-display font-semibold">
        {edicion.fechasLargas} · {edicion.ciudad}
        <span className="block text-sm font-normal text-gris">Cupo limitado</span>
      </p>

      <p className="mt-8 text-gris">
        Si aceptas, te enviaremos tu invitación por correo y te avisaremos de todo lo que preparemos hasta el día del
        evento.
      </p>

      <button type="button" onClick={aceptar} className="boton-primario mt-8 w-full py-4 text-base sm:w-auto sm:px-10">
        Aceptar invitación
      </button>

      <footer className="mt-10 border-t border-tinta/10 pt-6">
        <p className="font-display text-xl font-semibold italic">— {invitado.invitaPor}</p>
        <p className="text-sm text-gris">
          {contacto.cargo}, Punto y Aparte
        </p>
        <p className="mt-4 text-sm text-gris">
          ¿Prefieres platicarlo antes?{" "}
          <a href={contacto.whatsapp} className="font-semibold text-tinta underline underline-offset-4">
            Escríbele por WhatsApp
          </a>
        </p>
      </footer>
    </article>
  );
}

function Preguntas({
  invitado,
  estado,
  accion,
  enviando,
}: {
  invitado: Invitado;
  estado: EstadoFormulario;
  accion: (formData: FormData) => void;
  enviando: boolean;
}) {
  const [paso, setPaso] = useState(0);
  const [valores, setValores] = useState<Valores>({ nombre: invitado.nombreCompleto, ...estado.valores });
  const [error, setError] = useState<string | null>(null);
  const [acepta, setAcepta] = useState(estado.valores?.acepta_privacidad === "on");
  const entrada = useRef<HTMLInputElement>(null);

  const actual = preguntas[paso];
  const ultimo = paso === preguntas.length - 1;
  const errorServidor = preguntas.findIndex((p) => estado.errores?.[p.campo]);

  // Si el servidor rechaza un dato, vuelve a la tarjeta de esa pregunta.
  useEffect(() => {
    if (errorServidor < 0) return;
    const t = setTimeout(() => {
      setPaso(errorServidor);
      setError(estado.errores?.[preguntas[errorServidor].campo]?.[0] ?? null);
    }, 0);
    return () => clearTimeout(t);
  }, [errorServidor, estado.errores]);

  useEffect(() => {
    entrada.current?.focus();
  }, [paso]);

  function avanzar(e: FormEvent<HTMLFormElement>) {
    const problema = actual.validar(valores[actual.campo] ?? "");
    if (problema) {
      e.preventDefault();
      setError(problema);
      return;
    }
    if (!ultimo) {
      e.preventDefault();
      setError(null);
      setPaso(paso + 1);
      return;
    }
    if (!acepta) {
      e.preventDefault();
      setError("Necesitamos tu autorización para continuar.");
    }
    // En la última tarjeta, el formulario se envía a la acción del servidor.
  }

  return (
    <form action={accion} onSubmit={avanzar} noValidate className="animate-entrada">
      <input type="hidden" name="invitado" value={invitado.slug} />
      {preguntas.map((p) => (
        <input key={p.campo} type="hidden" name={p.campo} value={valores[p.campo] ?? ""} />
      ))}
      {acepta && <input type="hidden" name="acepta_privacidad" value="on" />}

      <div className="flex items-center justify-between text-sm text-gris">
        <span>
          {paso + 1} de {preguntas.length}
        </span>
        {paso > 0 && (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setPaso(paso - 1);
            }}
            className="font-medium text-tinta hover:text-punto"
          >
            ← Atrás
          </button>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={preguntas.length}
        aria-valuenow={paso + 1}
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-tinta/10"
      >
        <div
          className="h-full rounded-full bg-punto transition-[width] duration-500"
          style={{ width: `${((paso + 1) / preguntas.length) * 100}%` }}
        />
      </div>

      <div key={actual.campo} className="mt-8 animate-entrada rounded-3xl bg-papel p-7 ring-1 ring-tinta/10 sm:p-10">
        <label htmlFor={`invitacion-${actual.campo}`} className="block font-display text-2xl font-bold sm:text-3xl">
          {actual.pregunta}
        </label>
        <input
          ref={entrada}
          id={`invitacion-${actual.campo}`}
          type={actual.tipo}
          autoComplete={actual.autoComplete}
          placeholder={actual.placeholder}
          value={valores[actual.campo] ?? ""}
          onChange={(e) => setValores({ ...valores, [actual.campo]: e.target.value })}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "invitacion-error" : undefined}
          className="campo mt-6 py-4 text-lg"
        />
        {actual.nota && <p className="mt-2 text-sm text-gris">{actual.nota}</p>}

        {ultimo && (
          <label className="mt-6 flex items-start gap-3 text-sm text-gris">
            <input
              type="checkbox"
              checked={acepta}
              onChange={(e) => setAcepta(e.target.checked)}
              className="mt-0.5 size-4 accent-punto"
            />
            <span>
              Acepto el{" "}
              <Link href="/privacidad" className="underline underline-offset-2 hover:text-tinta">
                aviso de privacidad
              </Link>
              .
            </span>
          </label>
        )}

        {error && (
          <p id="invitacion-error" role="alert" className="mt-3 text-sm text-punto-oscuro">
            {error}
          </p>
        )}
        {estado.mensaje && !estado.ok && errorServidor < 0 && (
          <p role="alert" className="mt-3 rounded-xl bg-punto/10 px-4 py-3 text-sm text-punto-oscuro">
            {estado.mensaje}
          </p>
        )}

        <button type="submit" disabled={enviando} className="boton-primario mt-8 w-full py-4 text-base disabled:opacity-60">
          {enviando ? "Enviando…" : ultimo ? "Confirmar mi asistencia" : "Siguiente →"}
        </button>
      </div>
    </form>
  );
}

function Confirmacion({ nombre, email }: { nombre: string; email: string }) {
  return (
    <section role="status" className="animate-entrada rounded-3xl bg-tinta p-8 text-center text-papel sm:p-12">
      <span aria-hidden className="mx-auto block size-14 rounded-full bg-punto" />
      <h1 className="mt-6 font-display text-4xl font-bold">
        Listo, {nombre}
        <span className="text-punto">.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-papel/75">
        Tu invitación va en camino a <strong className="break-all text-papel">{email}</strong>. Te avisaremos antes que a
        nadie cuando abra la preventa.
      </p>
      <a href={enlaceCalendario} target="_blank" rel="noreferrer" className="boton-primario mt-8">
        Agregar a mi calendario
      </a>
    </section>
  );
}
