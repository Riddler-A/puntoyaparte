// Copia de seguridad diaria de la base de datos (se programa con cron en el servidor).
// Uso: node scripts/respaldo.mjs [carpeta-de-datos]
// Guarda una copia por día en <carpeta>/respaldos y conserva las últimas 30.

import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const carpeta = process.argv[2] ?? process.env.DATOS_DIR ?? join(homedir(), "datos-puntoyaparte");
const origen = join(carpeta, "puntoyaparte.db");
const respaldos = join(carpeta, "respaldos");
const conservar = 30;

if (!existsSync(origen)) {
  console.error(`No existe ${origen}`);
  process.exit(1);
}

mkdirSync(respaldos, { recursive: true, mode: 0o700 });
const destino = join(respaldos, `puntoyaparte-${new Date().toISOString().slice(0, 10)}.db`);
rmSync(destino, { force: true });

const bd = new DatabaseSync(origen);
bd.exec("PRAGMA busy_timeout = 5000;");
// VACUUM INTO hace una copia consistente aunque el sitio esté escribiendo.
bd.prepare("VACUUM INTO ?").run(destino);
bd.close();

const copias = readdirSync(respaldos)
  .filter((f) => /^puntoyaparte-\d{4}-\d{2}-\d{2}\.db$/.test(f))
  .sort();
copias.slice(0, Math.max(0, copias.length - conservar)).forEach((f) => rmSync(join(respaldos, f)));

console.log(`Respaldo guardado en ${destino}`);
