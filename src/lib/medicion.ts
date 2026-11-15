// Medición con la etiqueta de Google (Google tag) de la propiedad de GA4.
// El ID empieza con GTM- pero no es un contenedor de Tag Manager: se administra desde GA4.
export const googleTagId = "GTM-NWQK8NKL";

// Eventos que el sitio manda a GA4 (nombres recomendados por GA4):
// - generate_lead: invitación aceptada o solicitud enviada (con `formulario`)
// - begin_checkout: empezó la compra de boletos (con `value` y `currency`)
export function evento(nombre: string, datos: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const ventana = window as Window & { dataLayer?: unknown[] };
  const capa = (ventana.dataLayer ??= []);
  // Igual que gtag(): la etiqueta de Google espera el objeto `arguments`, no un arreglo.
  (function (..._comando: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    capa.push(arguments);
  })("event", nombre, datos);
}
