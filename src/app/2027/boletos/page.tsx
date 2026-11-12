import type { Metadata } from "next";
import { Compra } from "@/components/compra";
import { edicion } from "@/lib/evento";

export const metadata: Metadata = {
  title: `Boletos ${edicion.anio}`,
  description: `Compra tus boletos para Punto y Aparte ${edicion.anio}, ${edicion.fechasLargas}, ${edicion.ciudad}.`,
  // Prototipo: no indexar hasta definir precios y conectar el pago.
  robots: { index: false },
};

export default function Boletos() {
  return (
    <>
      <p className="bg-trazo px-5 py-2 text-center text-xs font-semibold text-tinta">
        Prototipo · nombres, precios y pago provisionales
      </p>
      <Compra />
    </>
  );
}
