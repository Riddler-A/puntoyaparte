import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { baseDeDatos } from "@/lib/datos";

// Acceso a /admin: una sola contraseña (guardada con scrypt) y sesiones por cookie.

export const cookieSesion = "pya_admin";
export const duracionSesion = 7 * 24 * 60 * 60;
export const largoMinimoClave = 10;

const sha = (texto: string) => createHash("sha256").update(texto).digest("hex");
const iguales = (a: string, b: string) => {
  const [x, y] = [Buffer.from(a), Buffer.from(b)];
  return x.length === y.length && timingSafeEqual(x, y);
};

function ajuste(clave: string) {
  const fila = baseDeDatos().prepare("SELECT valor FROM ajustes WHERE clave = ?").get(clave) as
    | { valor: string }
    | undefined;
  return fila?.valor;
}

export const hayClave = () => Boolean(ajuste("clave"));

// El enlace de alta lo genera scripts/alta-admin.mjs en el servidor; sirve una sola vez.
export function altaValida(token: string) {
  const [hash, expira] = (ajuste("alta_token") ?? "").split(":");
  return Boolean(hash) && Number(expira) > Date.now() && iguales(hash, sha(token));
}

export function definirClave(token: string, clave: string) {
  if (!altaValida(token)) return false;
  const sal = randomBytes(16);
  const hash = scryptSync(clave, sal, 64);
  const bd = baseDeDatos();
  bd.prepare(
    "INSERT INTO ajustes (clave, valor) VALUES ('clave', ?) ON CONFLICT (clave) DO UPDATE SET valor = excluded.valor",
  ).run(`${sal.toString("hex")}:${hash.toString("hex")}`);
  bd.exec("DELETE FROM ajustes WHERE clave = 'alta_token'; DELETE FROM sesiones;");
  return true;
}

export function claveCorrecta(clave: string) {
  const [sal, hash] = (ajuste("clave") ?? "").split(":");
  if (!sal || !hash) return false;
  return iguales(scryptSync(clave, Buffer.from(sal, "hex"), 64).toString("hex"), hash);
}

export function crearSesion() {
  const token = randomBytes(32).toString("base64url");
  const bd = baseDeDatos();
  bd.prepare("DELETE FROM sesiones WHERE expira < ?").run(Date.now());
  bd.prepare("INSERT INTO sesiones (token_hash, expira) VALUES (?, ?)").run(sha(token), Date.now() + duracionSesion * 1000);
  return token;
}

export function sesionValida(token: string | undefined) {
  if (!token) return false;
  const fila = baseDeDatos().prepare("SELECT expira FROM sesiones WHERE token_hash = ?").get(sha(token)) as
    | { expira: number }
    | undefined;
  return Boolean(fila) && fila!.expira > Date.now();
}

export function cerrarSesion(token: string | undefined) {
  if (token) baseDeDatos().prepare("DELETE FROM sesiones WHERE token_hash = ?").run(sha(token));
}
