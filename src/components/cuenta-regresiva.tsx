"use client";

import { useEffect, useState } from "react";

type Restante = { dias: number; horas: number; minutos: number };

function calcular(objetivo: number): Restante | null {
  const ms = objetivo - Date.now();
  if (ms <= 0) return null;
  return {
    dias: Math.floor(ms / 86_400_000),
    horas: Math.floor((ms / 3_600_000) % 24),
    minutos: Math.floor((ms / 60_000) % 60),
  };
}

export function CuentaRegresiva({ fecha }: { fecha: string }) {
  const objetivo = new Date(fecha).getTime();
  // Se calcula solo en el cliente para no desfasar el HTML del servidor.
  const [restante, setRestante] = useState<Restante | null | undefined>(undefined);

  useEffect(() => {
    const actualizar = () => setRestante(calcular(objetivo));
    actualizar();
    const id = setInterval(actualizar, 30_000);
    return () => clearInterval(id);
  }, [objetivo]);

  if (restante === null) return null;

  const unidades = [
    { valor: restante?.dias, etiqueta: "días" },
    { valor: restante?.horas, etiqueta: "horas" },
    { valor: restante?.minutos, etiqueta: "min" },
  ];

  return (
    <div className="flex gap-3" aria-label="Tiempo para el evento">
      {unidades.map((u) => (
        <div key={u.etiqueta} className="min-w-16 rounded-2xl bg-papel px-3 py-2 text-center ring-1 ring-tinta/10">
          <p className="font-display text-2xl font-bold tabular-nums">{u.valor ?? "–"}</p>
          <p className="text-xs text-gris">{u.etiqueta}</p>
        </div>
      ))}
    </div>
  );
}
