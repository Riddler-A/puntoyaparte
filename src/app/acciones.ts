"use server";

import { z } from "zod";
import { edicion } from "@/lib/evento";
import { supabaseServidor } from "@/lib/supabase";

export type EstadoFormulario = {
  ok: boolean;
  mensaje: string;
  errores?: Record<string, string[] | undefined>;
  valores?: Record<string, string>;
};

const texto = (min: number, mensaje: string) => z.string().trim().min(min, mensaje).max(200);
const opcional = z.string().trim().max(1000).optional().transform((v) => v || null);
const aceptaPrivacidad = z.literal("on", { error: "Necesitamos tu autorización para continuar." });

const esquemaLugar = z.object({
  nombre: texto(2, "Escribe tu nombre."),
  apellido: texto(2, "Escribe tu apellido."),
  email: z.email("Escribe un correo válido."),
  telefono: z.string().trim().regex(/^[\d\s+()-]{10,20}$/, "Escribe un teléfono de 10 dígitos."),
  empresa: texto(2, "Escribe el nombre de tu empresa."),
  puesto: texto(2, "Elige tu puesto."),
  giro: texto(2, "Escribe el giro de tu empresa."),
  tamano_empresa: texto(2, "Elige el tamaño de tu empresa."),
  pilar_interes: texto(2, "Elige el pilar que más te interesa."),
  como_se_entero: opcional,
  motivo: opcional,
  acepta_privacidad: aceptaPrivacidad,
});

const esquemaPatrocinio = z.object({
  nombre: texto(2, "Escribe tu nombre."),
  email: z.email("Escribe un correo válido."),
  telefono: z.string().trim().regex(/^[\d\s+()-]{10,20}$/, "Escribe un teléfono de 10 dígitos."),
  empresa: texto(2, "Escribe el nombre de tu empresa."),
  puesto: texto(2, "Escribe tu puesto."),
  paquete: z.enum(["encuadre", "palindroma", "capicua", "sin-definir"], { error: "Elige un paquete." }),
  mensaje: opcional,
  acepta_privacidad: aceptaPrivacidad,
});

function valoresDe(formData: FormData) {
  const valores: Record<string, string> = {};
  formData.forEach((v, k) => {
    if (typeof v === "string" && !k.startsWith("$ACTION")) valores[k] = v;
  });
  return valores;
}

async function guardar(tabla: string, fila: Record<string, unknown>) {
  const supabase = supabaseServidor();
  if (!supabase) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[sin Supabase] ${tabla}:`, fila);
      return { error: null };
    }
    return { error: { code: "sin-configuracion", message: "Supabase no está configurado." } };
  }
  return supabase.from(tabla).insert(fila);
}

export async function solicitarLugar(_previo: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const valores = valoresDe(formData);
  const resultado = esquemaLugar.safeParse(valores);
  if (!resultado.success) {
    return {
      ok: false,
      mensaje: "Revisa los campos marcados.",
      errores: z.flattenError(resultado.error).fieldErrors,
      valores,
    };
  }

  const { acepta_privacidad: _acepta, ...datos } = resultado.data;
  const { error } = await guardar("solicitudes_asistente", {
    ...datos,
    email: datos.email.toLowerCase(),
    edicion: edicion.anio,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        mensaje: "Ya recibimos una solicitud con este correo para esta edición. Te escribiremos pronto.",
        valores,
      };
    }
    console.error("solicitarLugar", error);
    return { ok: false, mensaje: "No pudimos enviar tu solicitud. Intenta de nuevo en unos minutos.", valores };
  }

  return {
    ok: true,
    mensaje: `Gracias, ${datos.nombre}. Revisaremos tu perfil y te escribiremos a ${datos.email} para confirmar tu lugar.`,
  };
}

export async function solicitarPropuesta(_previo: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const valores = valoresDe(formData);
  const resultado = esquemaPatrocinio.safeParse(valores);
  if (!resultado.success) {
    return {
      ok: false,
      mensaje: "Revisa los campos marcados.",
      errores: z.flattenError(resultado.error).fieldErrors,
      valores,
    };
  }

  const { acepta_privacidad: _acepta, ...datos } = resultado.data;
  const { error } = await guardar("solicitudes_patrocinio", {
    ...datos,
    email: datos.email.toLowerCase(),
    edicion: edicion.anio,
  });

  if (error) {
    console.error("solicitarPropuesta", error);
    return { ok: false, mensaje: "No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.", valores };
  }

  return {
    ok: true,
    mensaje: `Gracias, ${datos.nombre}. Te enviaremos la propuesta completa a ${datos.email} y te contactaremos para platicar.`,
  };
}
