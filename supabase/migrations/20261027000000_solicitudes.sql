-- Solicitudes de lugar (asistentes) y de propuesta (patrocinadores).
-- El sitio usa la llave anon: solo puede insertar. Leer y aprobar se hace desde el panel de Supabase
-- (y más adelante desde el panel de administración del sitio).

create table public.solicitudes_asistente (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  edicion text not null,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'aprobada', 'lista_espera', 'rechazada')),
  nombre text not null,
  apellido text not null,
  email text not null,
  telefono text not null,
  empresa text not null,
  puesto text not null,
  giro text not null,
  tamano_empresa text not null,
  pilar_interes text not null,
  como_se_entero text,
  motivo text,
  unique (edicion, email)
);

create table public.solicitudes_patrocinio (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  edicion text not null,
  estado text not null default 'nueva'
    check (estado in ('nueva', 'contactada', 'en_negociacion', 'cerrada', 'descartada')),
  nombre text not null,
  email text not null,
  telefono text not null,
  empresa text not null,
  puesto text not null,
  paquete text not null check (paquete in ('encuadre', 'palindroma', 'capicua', 'sin-definir')),
  mensaje text
);

alter table public.solicitudes_asistente enable row level security;
alter table public.solicitudes_patrocinio enable row level security;

-- El público solo puede crear solicitudes nuevas, nunca leerlas ni cambiar su estado.
create policy "Cualquiera puede solicitar lugar"
  on public.solicitudes_asistente for insert to anon
  with check (estado = 'pendiente');

create policy "Cualquiera puede solicitar propuesta"
  on public.solicitudes_patrocinio for insert to anon
  with check (estado = 'nueva');
