"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  cerrarSesion,
  claveCorrecta,
  cookieSesion,
  crearSesion,
  definirClave,
  duracionSesion,
  largoMinimoClave,
} from "@/lib/admin";

export type EstadoAcceso = { error?: string };

// Freno a intentos de adivinar la contraseña: 8 fallos por IP cada 15 minutos.
const maximoFallos = 8;
const ventana = 15 * 60 * 1000;
const fallos = new Map<string, { n: number; desde: number }>();

async function ipCliente() {
  return (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida";
}

function bloqueada(ip: string) {
  const f = fallos.get(ip);
  if (f && Date.now() - f.desde > ventana) fallos.delete(ip);
  return (fallos.get(ip)?.n ?? 0) >= maximoFallos;
}

async function iniciarSesion() {
  (await cookies()).set(cookieSesion, crearSesion(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: duracionSesion,
  });
}

export async function entrar(_previo: EstadoAcceso, formData: FormData): Promise<EstadoAcceso> {
  const ip = await ipCliente();
  if (bloqueada(ip)) return { error: "Demasiados intentos. Espera 15 minutos." };

  if (!claveCorrecta(String(formData.get("clave") ?? ""))) {
    const f = fallos.get(ip) ?? { n: 0, desde: Date.now() };
    fallos.set(ip, { ...f, n: f.n + 1 });
    return { error: "Contraseña incorrecta." };
  }

  fallos.delete(ip);
  await iniciarSesion();
  redirect("/admin");
}

export async function crearClave(_previo: EstadoAcceso, formData: FormData): Promise<EstadoAcceso> {
  const clave = String(formData.get("clave") ?? "");
  if (clave.length < largoMinimoClave) return { error: `Usa al menos ${largoMinimoClave} caracteres.` };
  if (clave !== String(formData.get("repetir") ?? "")) return { error: "Las contraseñas no coinciden." };
  if (!definirClave(String(formData.get("token") ?? ""), clave)) {
    return { error: "Este enlace ya no es válido. Pide uno nuevo." };
  }

  await iniciarSesion();
  redirect("/admin");
}

export async function salir() {
  const galletas = await cookies();
  cerrarSesion(galletas.get(cookieSesion)?.value);
  galletas.set(cookieSesion, "", { path: "/admin", maxAge: 0 });
  redirect("/admin");
}
