import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

// Base de datos del sitio: un archivo SQLite en el propio servidor, fuera de la carpeta del código
// para que no se pierda al publicar una versión nueva.
export const carpetaDatos =
  process.env.DATOS_DIR ??
  (process.env.NODE_ENV === "production" ? join(homedir(), "datos-puntoyaparte") : join(process.cwd(), ".datos"));

const esquema = `
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;

  CREATE TABLE IF NOT EXISTS invitaciones_aceptadas (
    id INTEGER PRIMARY KEY,
    creado_en TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    edicion TEXT NOT NULL,
    invitado_slug TEXT NOT NULL,
    invita_por TEXT NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    giro TEXT NOT NULL,
    UNIQUE (edicion, email)
  );

  CREATE TABLE IF NOT EXISTS solicitudes_patrocinio (
    id INTEGER PRIMARY KEY,
    creado_en TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    edicion TEXT NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    empresa TEXT NOT NULL,
    puesto TEXT NOT NULL,
    paquete TEXT NOT NULL,
    mensaje TEXT
  );

  CREATE TABLE IF NOT EXISTS solicitudes_asistente (
    id INTEGER PRIMARY KEY,
    creado_en TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    edicion TEXT NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    empresa TEXT NOT NULL,
    puesto TEXT NOT NULL,
    giro TEXT NOT NULL,
    tamano_empresa TEXT NOT NULL,
    pilar_interes TEXT NOT NULL,
    como_se_entero TEXT,
    motivo TEXT,
    UNIQUE (edicion, email)
  );

  CREATE TABLE IF NOT EXISTS ajustes (clave TEXT PRIMARY KEY, valor TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS sesiones (token_hash TEXT PRIMARY KEY, expira INTEGER NOT NULL);
`;

// Tablas con respuestas del público: las que se guardan desde los formularios y se ven en /admin.
export const tablas = {
  invitaciones_aceptadas: {
    titulo: "Invitaciones aceptadas",
    columnas: ["creado_en", "nombre", "email", "telefono", "giro", "invitado_slug", "invita_por", "edicion"],
  },
  solicitudes_patrocinio: {
    titulo: "Solicitudes de patrocinio",
    columnas: ["creado_en", "nombre", "empresa", "puesto", "email", "telefono", "paquete", "mensaje", "edicion"],
  },
  solicitudes_asistente: {
    titulo: "Solicitudes de lugar",
    columnas: [
      "creado_en",
      "nombre",
      "apellido",
      "email",
      "telefono",
      "empresa",
      "puesto",
      "giro",
      "tamano_empresa",
      "pilar_interes",
      "como_se_entero",
      "motivo",
      "edicion",
    ],
  },
} as const;

export type Tabla = keyof typeof tablas;
export type Fila = Record<string, string | number | null>;

export const esTabla = (valor: string): valor is Tabla => Object.hasOwn(tablas, valor);

// Una sola conexión por proceso (también entre recargas del servidor de desarrollo).
const global = globalThis as { bdPuntoYAparte?: DatabaseSync };

export function baseDeDatos() {
  if (!global.bdPuntoYAparte) {
    mkdirSync(carpetaDatos, { recursive: true, mode: 0o700 });
    const bd = new DatabaseSync(join(carpetaDatos, "puntoyaparte.db"));
    bd.exec(esquema);
    global.bdPuntoYAparte = bd;
  }
  return global.bdPuntoYAparte;
}

export function guardar(tabla: Tabla, fila: Record<string, unknown>): { error: null | { code: string; message: string } } {
  const permitidas: readonly string[] = tablas[tabla].columnas;
  const columnas = Object.keys(fila).filter((c) => c !== "creado_en" && permitidas.includes(c));
  const valores = columnas.map((c) => {
    const v = fila[c];
    return v === undefined || v === null ? null : String(v);
  });
  try {
    baseDeDatos()
      .prepare(`INSERT INTO ${tabla} (${columnas.join(", ")}) VALUES (${columnas.map(() => "?").join(", ")})`)
      .run(...valores);
    return { error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: { code: message.includes("UNIQUE constraint failed") ? "duplicado" : "bd", message } };
  }
}

export function filas(tabla: Tabla, limite = 100_000) {
  return baseDeDatos()
    .prepare(`SELECT ${tablas[tabla].columnas.join(", ")} FROM ${tabla} ORDER BY id DESC LIMIT ?`)
    .all(limite) as Fila[];
}

export function contar(tabla: Tabla) {
  return (baseDeDatos().prepare(`SELECT COUNT(*) AS n FROM ${tabla}`).get() as { n: number }).n;
}

// Las fechas se guardan en UTC; se muestran en hora del centro de México.
export function fechaLocal(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
    dateStyle: "short",
    timeStyle: "short",
  });
}

export const etiquetaColumna = (columna: string) =>
  columna === "creado_en" ? "Fecha" : columna.charAt(0).toUpperCase() + columna.slice(1).replaceAll("_", " ");
