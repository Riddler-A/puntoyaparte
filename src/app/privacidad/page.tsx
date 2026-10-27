import type { Metadata } from "next";
import { contacto } from "@/lib/evento";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  robots: { index: false },
};

// TODO: reemplazar por el aviso de privacidad integral revisado legalmente (LFPDPPP).
export default function Privacidad() {
  return (
    <section className="contenedor max-w-3xl py-20">
      <p className="eyebrow">Aviso de privacidad</p>
      <h1 className="titulo mt-4">En preparación</h1>
      <div className="mt-8 space-y-4 text-lg text-gris">
        <p>
          Estamos preparando el aviso de privacidad integral de Punto y Aparte. Los datos que compartes en nuestros
          formularios se usan únicamente para revisar tu solicitud y contactarte sobre el evento.
        </p>
        <p>
          Si tienes dudas o quieres ejercer tus derechos sobre tus datos, escríbenos a{" "}
          <a href={`mailto:${contacto.email}`} className="text-tinta underline underline-offset-4">
            {contacto.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
