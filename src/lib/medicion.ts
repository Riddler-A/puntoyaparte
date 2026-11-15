// Medición con Google Tag Manager. GA4, el pixel de Meta y demás etiquetas se configuran dentro del contenedor.
export const gtmId = "GTM-NWQK8NKL";

// Eventos que el sitio manda al contenedor (nombres recomendados por GA4):
// - generate_lead: invitación aceptada o solicitud enviada (con `formulario`)
// - begin_checkout: empezó la compra de boletos (con `value` y `currency`)
export function evento(nombre: string, datos: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const ventana = window as Window & { dataLayer?: Record<string, unknown>[] };
  (ventana.dataLayer ??= []).push({ event: nombre, ...datos });
}
