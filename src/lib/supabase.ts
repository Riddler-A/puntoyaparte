import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente con la llave pública (anon). Las tablas solo permiten INSERT a este rol (ver supabase/migrations).
export function supabaseServidor(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const llave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !llave) return null;
  return createClient(url, llave, { auth: { persistSession: false } });
}
