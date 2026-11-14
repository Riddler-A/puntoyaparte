import type { ReactNode } from "react";
import { Encabezado } from "@/components/encabezado";
import { Pie } from "@/components/pie";

// Páginas públicas del sitio con encabezado y pie. Las invitaciones (/i) quedan fuera.
export default function LayoutSitio({ children }: { children: ReactNode }) {
  return (
    <>
      <Encabezado />
      <main className="flex-1">{children}</main>
      <Pie />
    </>
  );
}
