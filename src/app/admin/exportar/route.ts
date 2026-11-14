import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { cookieSesion, sesionValida } from "@/lib/admin";
import { esTabla, etiquetaColumna, fechaLocal, filas, tablas } from "@/lib/datos";

// Descarga una tabla como CSV que Excel abre directo (UTF-8 con BOM).

function celda(valor: string | number | null) {
  let texto = valor === null ? "" : String(valor);
  // Evita que Excel interprete como fórmula lo que escribió un visitante.
  if (/^[=+\-@\t\r]/.test(texto)) texto = `'${texto}`;
  return `"${texto.replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  const galletas = await cookies();
  if (!sesionValida(galletas.get(cookieSesion)?.value)) return new Response("No autorizado", { status: 401 });

  const tabla = request.nextUrl.searchParams.get("tabla") ?? "";
  if (!esTabla(tabla)) return new Response("Tabla desconocida", { status: 404 });

  const columnas = tablas[tabla].columnas;
  const lineas = [
    columnas.map((c) => celda(etiquetaColumna(c))).join(","),
    ...filas(tabla).map((fila) =>
      columnas.map((c) => celda(c === "creado_en" ? fechaLocal(String(fila[c])) : fila[c])).join(","),
    ),
  ];
  const fecha = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Mexico_City" });

  return new Response(`﻿${lineas.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${tabla}-${fecha}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
