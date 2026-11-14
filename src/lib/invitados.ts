// Invitaciones personales. Cada invitado tiene su dirección /i/<slug>, pensada para un QR.
// TODO: mover a la base de datos cuando haya más invitados que editar a mano.

export type Invitado = {
  slug: string;
  nombre: string;
  nombreCompleto: string;
  invitaPor: string;
};

export const invitados: Invitado[] = [
  {
    slug: "oscar-zuniga",
    nombre: "Oscar",
    nombreCompleto: "Oscar Zúñiga",
    invitaPor: "Víctor Hernández",
  },
];

export function invitadoPorSlug(slug: string) {
  return invitados.find((i) => i.slug === slug);
}
