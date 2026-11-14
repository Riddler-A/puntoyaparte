"use client";

import { useActionState } from "react";
import { crearClave, entrar, type EstadoAcceso } from "@/app/admin/acciones";

const inicial: EstadoAcceso = {};

function ErrorAcceso({ estado }: { estado: EstadoAcceso }) {
  if (!estado.error) return null;
  return (
    <p role="alert" className="rounded-xl bg-punto/10 px-4 py-3 text-sm text-punto-oscuro">
      {estado.error}
    </p>
  );
}

export function FormularioEntrar() {
  const [estado, accion, enviando] = useActionState(entrar, inicial);
  return (
    <form action={accion} className="space-y-5">
      <ErrorAcceso estado={estado} />
      <div>
        <label htmlFor="admin-clave" className="mb-1.5 block text-sm font-medium">
          Contraseña
        </label>
        <input id="admin-clave" name="clave" type="password" autoComplete="current-password" required className="campo" />
      </div>
      <button type="submit" disabled={enviando} className="boton-primario w-full disabled:opacity-60">
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export function FormularioClave({ token, minimo }: { token: string; minimo: number }) {
  const [estado, accion, enviando] = useActionState(crearClave, inicial);
  return (
    <form action={accion} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <ErrorAcceso estado={estado} />
      <div>
        <label htmlFor="admin-clave-nueva" className="mb-1.5 block text-sm font-medium">
          Contraseña nueva
        </label>
        <input
          id="admin-clave-nueva"
          name="clave"
          type="password"
          autoComplete="new-password"
          minLength={minimo}
          required
          className="campo"
        />
        <p className="mt-1.5 text-sm text-gris">Al menos {minimo} caracteres. Guárdala en un lugar seguro.</p>
      </div>
      <div>
        <label htmlFor="admin-clave-repetir" className="mb-1.5 block text-sm font-medium">
          Repite la contraseña
        </label>
        <input
          id="admin-clave-repetir"
          name="repetir"
          type="password"
          autoComplete="new-password"
          minLength={minimo}
          required
          className="campo"
        />
      </div>
      <button type="submit" disabled={enviando} className="boton-primario w-full disabled:opacity-60">
        {enviando ? "Guardando…" : "Crear contraseña y entrar"}
      </button>
    </form>
  );
}
