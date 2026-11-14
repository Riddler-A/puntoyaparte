// Genera un enlace de un solo uso para crear (o cambiar) la contraseña de /admin.
// Uso en el servidor: node scripts/alta-admin.mjs [carpeta-de-datos] [url-del-sitio]
// La contraseña la escribe la persona en el navegador; aquí nunca se ve.

import { createHash, randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const carpeta = process.argv[2] ?? process.env.DATOS_DIR ?? join(homedir(), "datos-puntoyaparte");
const sitio = process.argv[3] ?? "https://punto-y-aparte.com";
const horas = 48;

mkdirSync(carpeta, { recursive: true, mode: 0o700 });
const bd = new DatabaseSync(join(carpeta, "puntoyaparte.db"));
bd.exec("PRAGMA busy_timeout = 5000; CREATE TABLE IF NOT EXISTS ajustes (clave TEXT PRIMARY KEY, valor TEXT NOT NULL);");

const token = randomBytes(24).toString("base64url");
const hash = createHash("sha256").update(token).digest("hex");
bd.prepare(
  "INSERT INTO ajustes (clave, valor) VALUES ('alta_token', ?) ON CONFLICT (clave) DO UPDATE SET valor = excluded.valor",
).run(`${hash}:${Date.now() + horas * 3600 * 1000}`);
bd.close();

console.log(`Enlace válido por ${horas} horas y un solo uso:\n${sitio}/admin?alta=${token}`);
