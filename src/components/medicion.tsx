import Script from "next/script";
import { googleTagId } from "@/lib/medicion";

// Etiqueta de Google (GA4), tal como la entrega Google. Solo en producción, para no ensuciar los datos
// con pruebas locales. Va en las páginas públicas; /admin no se mide.
export function Medicion() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtm.js?id=${googleTagId}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());`}
      </Script>
    </>
  );
}
