import nodemailer from "nodemailer";
import { edicion, enlaceCalendario, sitioUrl } from "@/lib/evento";

// Correo saliente. La cuenta SMTP está en el servidor (.env.local), nunca en el código.
// Variables: SMTP_HOST, SMTP_PORT (587 o 465), SMTP_USER, SMTP_PASS,
// CORREO_REMITENTE (por ejemplo "Punto y Aparte <contacto@punto-y-aparte.com>") y
// CORREO_AVISOS (a quién llegan los avisos de cada respuesta).

const remitente = process.env.CORREO_REMITENTE ?? "Punto y Aparte <contacto@punto-y-aparte.com>";
const responderA = "contacto@punto-y-aparte.com";

let transporte: nodemailer.Transporter | null = null;

function smtp() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT ?? 587);
  transporte ??= nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
  return transporte;
}

type Mensaje = { para: string; asunto: string; texto: string; html?: string; responderA?: string };

// Escapa texto antes de meterlo en HTML.
const escapar = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Devuelve false si no se pudo enviar. Nunca lanza: una falla de correo no debe cancelar una respuesta ya guardada.
export async function enviar(mensaje: Mensaje): Promise<boolean> {
  const t = smtp();
  if (!t) {
    // Sin SMTP (desarrollo o antes de configurar) no se registra el contenido, porque incluye datos personales.
    console.warn(`[correo sin SMTP] "${mensaje.asunto}"`);
    return false;
  }
  try {
    await t.sendMail({
      from: remitente,
      to: mensaje.para,
      subject: mensaje.asunto,
      text: mensaje.texto,
      html: mensaje.html,
      replyTo: mensaje.responderA ?? responderA,
    });
    return true;
  } catch (e) {
    console.error("[correo] no se pudo enviar:", e instanceof Error ? e.message : e);
    return false;
  }
}

// Correo al invitado: su confirmación y la invitación formal.
export function correoInvitado(nombre: string, invitaPor: string, para: string): Mensaje {
  return {
    para,
    asunto: `Tu invitación a Punto y Aparte ${edicion.anio}`,
    texto: [
      `Hola ${nombre},`,
      "",
      `${invitaPor} te invita a Punto y Aparte ${edicion.anio}: ${edicion.fechasLargas}, ${edicion.ciudad}.`,
      "",
      "Punto y Aparte reúne a dueños y directivos para conversar sobre empresas que prosperan y también dejan algo valioso a su paso.",
      "",
      "Te avisaremos antes que a nadie cuando abra la preventa, y te escribiremos sobre lo que preparemos hasta el día del evento.",
      "",
      `Agrega el evento a tu calendario: ${enlaceCalendario}`,
      "",
      "Punto y Aparte",
      sitioUrl,
    ].join("\n"),
    html: [
      `<div style="font-family:Arial,Helvetica,sans-serif;color:#1e1c1c;font-size:16px;line-height:1.5;max-width:560px">`,
      `<p>Hola ${escapar(nombre)},</p>`,
      `<p>${escapar(invitaPor)} te invita a Punto y Aparte ${edicion.anio}: ${escapar(edicion.fechasLargas)}, ${escapar(edicion.ciudad)}.</p>`,
      `<p>Punto y Aparte reúne a dueños y directivos para conversar sobre empresas que prosperan y también dejan algo valioso a su paso.</p>`,
      `<p>Te avisaremos antes que a nadie cuando abra la preventa, y te escribiremos sobre lo que preparemos hasta el día del evento.</p>`,
      `<p>Agrega el evento a tu calendario: <a href="${enlaceCalendario}" style="color:#f94441">Guardar en mi calendario</a></p>`,
      `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid #e9e1d6;padding-top:16px"><tr>`,
      `<td style="padding-right:16px;vertical-align:middle"><a href="${sitioUrl}"><img src="${sitioUrl}/marca/logo-correo.png" width="120" height="120" alt="Punto y Aparte" style="display:block;border:0"></a></td>`,
      `<td style="vertical-align:middle;font-size:14px;color:#5a5552">`,
      `<strong style="color:#1e1c1c">Punto y Aparte</strong><br>`,
      `<a href="mailto:${responderA}" style="color:#f94441;text-decoration:none">${responderA}</a><br>`,
      `<a href="${sitioUrl}" style="color:#f94441;text-decoration:none">punto-y-aparte.com</a>`,
      `</td></tr></table>`,
      `</div>`,
    ].join(""),
  };
}

// Aviso interno: a quién llega cada respuesta nueva.
export function avisoInterno(titulo: string, datos: Record<string, string | undefined>): Mensaje | null {
  const para = process.env.CORREO_AVISOS;
  if (!para) return null;
  const lineas = Object.entries(datos)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);
  return {
    para,
    asunto: `${titulo}: ${datos.nombre ?? datos.Nombre ?? ""}`.trim(),
    texto: [...lineas, "", `Edición ${edicion.anio}`].join("\n"),
    responderA: datos.email,
  };
}
