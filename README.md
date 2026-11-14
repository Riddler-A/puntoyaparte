# Punto y Aparte

Sitio web de Punto y Aparte: conversaciones sobre empresa, prosperidad y humanidad.

- [Concepto del sitio](docs/concepto.md): públicos, landings, funciones y pendientes
- Next.js 16 (App Router) + Tailwind 4 + SQLite en el servidor (Hestia, Node 24)

## Páginas

| Ruta | Para quién | Acción |
|---|---|---|
| `/` | Todos | Bifurca a asistentes o patrocinadores |
| `/2027` | Dueños y directivos | Información de la edición, donativo y CTA a boletos |
| `/2027/boletos` | Dueños y directivos | Compra de boletos (prototipo de pago) y política de reembolsos |
| `/patrocina` | Marcas | Solicitud de propuesta |
| `/privacidad` | Todos | Aviso de privacidad (en preparación) |
| `/i/<nombre>` | Invitados | Carta de invitación personal (lista en `src/lib/invitados.ts`) |
| `/admin` | Equipo | Respuestas del sitio con contraseña y descarga para Excel |

El contenido de la edición (fechas, ponentes, agenda, paquetes, beneficios, contacto) vive en
[`src/lib/evento.ts`](src/lib/evento.ts).

## Desarrollo

```bash
npm install
npm run dev
```

Necesita Node 24 (usa `node:sqlite`). En desarrollo la base de datos se crea sola en `.datos/`.

## Datos

Las respuestas de los formularios se guardan en un archivo SQLite **en el servidor**, fuera de la carpeta del
código: `~/datos-puntoyaparte/puntoyaparte.db` (se puede cambiar con la variable `DATOS_DIR`). Las tablas se crean
solas al primer uso; están definidas en [`src/lib/datos.ts`](src/lib/datos.ts).

- **Ver y descargar:** `/admin`, con contraseña. Cada tabla se descarga como CSV para Excel.
- **Crear o cambiar la contraseña:** en el servidor, `node scripts/alta-admin.mjs` imprime un enlace de un solo
  uso (48 horas) para escribirla en el navegador.
- **Respaldo:** `node scripts/respaldo.mjs` guarda una copia del día en `~/datos-puntoyaparte/respaldos` y conserva
  las últimas 30. Está programado con cron en el servidor.

## Publicar

El sitio corre con PM2 (`punto-y-aparte`, puerto 3003) detrás de nginx de Hestia.

```bash
git archive HEAD -- . ':!.claude' | ssh -i ~/.ssh/hestia_puntoyaparte puntoyaparte@185.137.122.204 \
  'cd ~/web/punto-y-aparte.com/nodeapp && tar -x && npm ci --no-audit --no-fund && npm run build && pm2 restart punto-y-aparte'
```
