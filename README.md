# Punto y Aparte

Sitio web de Punto y Aparte: conversaciones sobre empresa, prosperidad y humanidad.

- [Concepto del sitio](docs/concepto.md): públicos, landings, funciones y pendientes
- Next.js 16 (App Router) + Tailwind 4 + Supabase

## Páginas

| Ruta | Para quién | Acción |
|---|---|---|
| `/` | Todos | Bifurca a asistentes o patrocinadores |
| `/2027` | Dueños y directivos | Solicitud de lugar perfilada |
| `/patrocina` | Marcas | Solicitud de propuesta |
| `/privacidad` | Todos | Aviso de privacidad (en preparación) |

El contenido de la edición (fechas, ponentes, agenda, paquetes, beneficios, contacto) vive en
[`src/lib/evento.ts`](src/lib/evento.ts).

## Desarrollo

```bash
npm install
npm run dev
```

Sin variables de Supabase, en desarrollo los formularios funcionan y las solicitudes se imprimen en la consola.

## Conectar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el SQL Editor, ejecuta [`supabase/migrations/20261027000000_solicitudes.sql`](supabase/migrations/20261027000000_solicitudes.sql).
3. Copia `.env.example` como `.env.local` y llena la URL y la llave `anon` (Project Settings → API).
4. Reinicia `npm run dev`. Las solicitudes llegan a las tablas `solicitudes_asistente` y `solicitudes_patrocinio`.

El sitio solo puede insertar solicitudes; leerlas y aprobarlas se hace desde el panel de Supabase.
