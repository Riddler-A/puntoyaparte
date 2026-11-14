-- Respuestas a las invitaciones personales (/i/<slug>).

create table public.invitaciones_aceptadas (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  edicion text not null,
  invitado_slug text not null,
  invita_por text not null,
  nombre text not null,
  email text not null,
  telefono text not null,
  giro text not null,
  unique (edicion, email)
);

alter table public.invitaciones_aceptadas enable row level security;

-- El sitio solo puede registrar respuestas; leerlas se hace desde el panel de Supabase.
create policy "El sitio registra invitaciones aceptadas"
  on public.invitaciones_aceptadas
  for insert
  to anon
  with check (true);
