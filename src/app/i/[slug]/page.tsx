import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartaInvitacion } from "@/components/carta-invitacion";
import { edicion } from "@/lib/evento";
import { invitadoPorSlug, invitados } from "@/lib/invitados";

export function generateStaticParams() {
  return invitados.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/i/[slug]">): Promise<Metadata> {
  const invitado = invitadoPorSlug((await params).slug);
  return {
    title: invitado ? `Invitación para ${invitado.nombre}` : "Invitación",
    description: `Una invitación personal a Punto y Aparte ${edicion.anio}.`,
    // Las invitaciones son personales: no deben aparecer en buscadores.
    robots: { index: false, follow: false },
  };
}

export default async function Invitacion({ params }: PageProps<"/i/[slug]">) {
  const invitado = invitadoPorSlug((await params).slug);
  if (!invitado) notFound();
  return <CartaInvitacion invitado={invitado} />;
}
