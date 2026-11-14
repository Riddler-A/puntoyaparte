import type { StaticImageData } from "next/image";
import ponente1 from "@/assets/ponentes/ponente-1.png";
import ponente2 from "@/assets/ponentes/ponente-2.png";
import ponente3 from "@/assets/ponentes/ponente-3.png";

// Contenido de la edición actual. Fuente: "Punto y Aparte — Patrocinios 2027".

// Dirección pública del sitio (servidor Hestia). Se usa en enlaces para compartir y en los QR.
export const sitioUrl = "https://punto-y-aparte.com";

export const edicion = {
  anio: "2027",
  ciudad: "Guadalajara",
  sede: "Sede por anunciar",
  inicio: "2027-02-17T09:00:00-06:00",
  fechasLargas: "17 y 18 de febrero de 2027",
  fechasCortas: "17–18 feb 2027",
};

// TODO: horario provisional (9:00 a 18:00, hora de Guadalajara).
export const enlaceCalendario = `https://calendar.google.com/calendar/render?${new URLSearchParams({
  action: "TEMPLATE",
  text: `Punto y Aparte ${edicion.anio}`,
  dates: "20270217T150000Z/20270218T000000Z",
  location: edicion.ciudad,
})}`;

export const contacto = {
  nombre: "Víctor Hernández",
  cargo: "Comercialización",
  telefono: "33 1738 0678",
  whatsapp: "https://wa.me/523317380678",
  email: "comercializacion.vh@gmail.com",
  instagram: "https://www.instagram.com/____puntoyaparte",
  instagramUsuario: "@____puntoyaparte",
};

// Partida en dos para dar peso tipográfico a la segunda mitad.
// Tono de legado: "solo riqueza" se leía como reproche para este público.
export const preguntaCentral = {
  planteamiento: "Ya construiste algo sólido.",
  remate: "¿Qué va a quedar cuando no estés en la oficina",
};

export const lema = "Una pausa para pensar qué empresa vas a heredar";

export const pilares = [
  {
    numero: "01",
    nombre: "Rentabilidad",
    texto: "Empresas financieramente sólidas, capaces de innovar, competir y crecer a largo plazo.",
    indicador: "Margen operativo y años de operación",
  },
  {
    numero: "02",
    nombre: "Personas",
    texto: "Liderazgos que desarrollan talento y saben que el bienestar del equipo llega a sus familias.",
    indicador: "Rotación voluntaria al año",
  },
  {
    numero: "03",
    nombre: "Ética",
    texto: "Decisiones que podrías explicarles a tus hijos, sin cambiar principios por resultados inmediatos.",
    indicador: "Compromisos públicos cumplidos",
  },
  {
    numero: "04",
    nombre: "Trascendencia",
    texto: "Organizaciones que dejan huella en su comunidad y usan sus recursos con responsabilidad.",
    indicador: "Voluntariado e inversión local",
  },
];

export type Ponente = {
  nombre: string;
  cargo: string;
  tema: string;
  pregunta: string;
  foto: StaticImageData;
};

// TODO: confirmar que cada foto corresponde al ponente (se asumió el orden de la diapositiva 7).
export const ponentes: Ponente[] = [
  {
    nombre: "Paulo César Preciado",
    cargo: "Executive Advisor Partner, Great Place To Work",
    tema: "La empresa y las personas",
    pregunta: "¿Cómo construir lugares de trabajo donde las personas crezcan y encuentren sentido?",
    foto: ponente1,
  },
  {
    nombre: "Daniel Ibarra",
    cargo: "Consultor financiero, fundador de Profit",
    tema: "El dinero y la prosperidad",
    pregunta: "¿Cómo generar riqueza con decisiones que sostengan una prosperidad duradera?",
    foto: ponente2,
  },
  {
    nombre: "Oscar Zúñiga",
    cargo: "Presidente de AFP",
    tema: "La comunidad y el impacto",
    pregunta: "¿Qué responsabilidad tenemos con las comunidades donde vivimos y hacemos negocios?",
    foto: ponente3,
  },
];

export const agenda = [
  {
    dia: "Día 1",
    fecha: "17 de febrero",
    nombre: "Voces",
    descripcion: "Conferencias",
    bloques: [
      { nombre: "Recepción y networking dirigido", duracion: "30 min" },
      { nombre: "Palabras de nuestros aliados", duracion: "7 min" },
      { nombre: "Charlas de los ponentes", duracion: "40 min c/u" },
      { nombre: "Cierre y encuentros 1 a 1", duracion: "2 h" },
    ],
  },
  {
    dia: "Día 2",
    fecha: "18 de febrero",
    nombre: "Cata de café",
    descripcion: "Por invitación",
    bloques: [
      { nombre: "Café de origen, contado por quien lo cultiva", duracion: "" },
      { nombre: "Conversaciones uno a uno, sin teléfonos", duracion: "" },
      { nombre: "Por la tarde, cerca de 30 participantes y nuestros aliados oficiales", duracion: "" },
    ],
  },
];

export const cifras = [
  { valor: "100", etiqueta: "Dueños y directivos perfilados" },
  { valor: "2", etiqueta: "Días: Voces y cata de café" },
  { valor: "3", etiqueta: "Ponentes, 40 minutos cada uno" },
];

// Cómo se describe la sala a quien asiste (sin lenguaje de segmentación).
export const perfilSala = [
  { valor: "Dueños", etiqueta: "y directivos que toman las decisiones" },
  { valor: "Jalisco", etiqueta: "empresas con años de operación" },
  { valor: "100", etiqueta: "lugares en la sala" },
  { valor: "1 día", etiqueta: "fuera de la operación" },
];

// Perfil para patrocinadores (/patrocina).
export const perfilAsistente = [
  { valor: "40–50", etiqueta: "años de edad" },
  { valor: "AB · C+", etiqueta: "nivel socioeconómico" },
  { valor: "70/30", etiqueta: "hombres / mujeres" },
  { valor: "Medianas", etiqueta: "empresas" },
];

export type Paquete = {
  id: "encuadre" | "palindroma" | "capicua";
  nombre: string;
  resumen: string;
  destacados: string[];
  oficial?: boolean;
  disponibles?: string;
};

export const paquetes: Paquete[] = [
  {
    id: "encuadre",
    nombre: "Encuadre",
    resumen: "Presencia digital y en el evento.",
    destacados: [
      "Logo en registro, mailings y tráiler",
      "2 artes promocionales y 1 publicación pautada",
      "Descuento en la próxima edición",
    ],
  },
  {
    id: "palindroma",
    nombre: "Palíndroma",
    resumen: "Más alcance y presencia en la grabación.",
    destacados: [
      "Todo lo de Encuadre",
      "5 artes promocionales y 3 publicaciones pautadas",
      "2 lugares en el día de grabación",
    ],
  },
  {
    id: "capicua",
    nombre: "Capicúa",
    resumen: "Patrocinador oficial: escenario y conversación directa.",
    destacados: [
      "Pitch de 7 minutos en el escenario",
      "Cata de café director a director",
      "Radio y menciones en cada conferencia",
    ],
    oficial: true,
    disponibles: "2 lugares disponibles",
  },
];

type ValorBeneficio = string | boolean;

export const beneficios: {
  grupo: string;
  filas: { beneficio: string; valores: [ValorBeneficio, ValorBeneficio, ValorBeneficio] }[];
}[] = [
  {
    grupo: "Presencia digital",
    filas: [
      { beneficio: "Logo en la página de registro", valores: [true, true, true] },
      { beneficio: "Logo en 8 mailings (+4,000 destinatarios)", valores: [true, true, true] },
      { beneficio: "Logo en el tráiler del evento", valores: [true, true, true] },
      { beneficio: "Apariciones en el video teaser", valores: ["1", "2", "4"] },
      { beneficio: "Presencia en artes promocionales", valores: ["2", "5", "10"] },
      { beneficio: "Publicaciones pautadas (alcance +90,000)", valores: ["1", "3", "5"] },
      { beneficio: "Menciones en transmisiones en vivo previas", valores: ["1", "2", "4"] },
      { beneficio: "Tamaño de logo en el posteo de cierre", valores: ["1x", "1x", "2x"] },
    ],
  },
  {
    grupo: "Presencia en el evento",
    filas: [
      { beneficio: "Cintillo de marca por conferencia", valores: ["1", "2", "4"] },
      { beneficio: "Fondo de prensa con logo", valores: ["1x", "1x", "2x"] },
      { beneficio: "Mención al inicio y cierre de cada conferencia", valores: [false, false, true] },
      { beneficio: "Lugares en el día de grabación", valores: [false, "2", "2"] },
      { beneficio: "Invitación a programa de radio", valores: [false, false, true] },
      { beneficio: "Pitch de 7 minutos como patrocinador oficial", valores: [false, false, true] },
      { beneficio: "Cata de café: networking director a director", valores: [false, false, true] },
      { beneficio: "Descuento en la próxima edición", valores: [true, true, true] },
    ],
  },
];

export type Boleto = {
  id: string;
  nombre: string;
  descripcion: string;
  incluye: string[];
  precio: number;
  // Lugares que ocupa cada unidad (una mesa empresarial cuenta como 4).
  lugares: number;
  agotado?: boolean;
  // Solo con el número real de lugares disponibles (Profeco): nunca una cifra de prueba.
  quedan?: number;
  // Precio de la siguiente fase: ancla el precio actual como oportunidad.
  precioSiguiente?: number;
  destacado?: string;
  nota?: string;
};

// TODO: nombres y precios provisionales para el prototipo de compra.
// Sin escasez ni prueba social de muestra: cualquier cifra de lugares o de ventas debe salir
// de las ventas reales (Profeco). La preventa para los "primeros 20" se maneja por invitación personal (/i/[slug]).
export const boletos: Boleto[] = [
  {
    id: "general",
    nombre: "General",
    descripcion: "Día 1 · Voces",
    incluye: ["Las tres conferencias", "Networking y cierre"],
    precio: 2450,
    precioSiguiente: 2950,
    lugares: 1,
  },
  {
    id: "preferente",
    nombre: "Preferente",
    descripcion: "Día 1 · Voces",
    incluye: ["Primeras filas", "Encuentros 1 a 1 con ponentes", "Kit de bienvenida"],
    precio: 3450,
    precioSiguiente: 3950,
    lugares: 1,
    destacado: "Incluye encuentro con ponentes",
  },
  {
    id: "mesa",
    nombre: "Mesa empresarial",
    descripcion: "4 lugares · Día 1",
    incluye: ["Mesa reservada para tu equipo directivo", "Mención en pantalla", "Una sola factura"],
    precio: 8800,
    precioSiguiente: 10800,
    lugares: 4,
    nota: "$2,200 por persona · ahorras $1,000 frente a 4 boletos General",
  },
];

// Fecha real del cambio de precio. Es la única fecha límite que se comunica.
export const venta = {
  finFase: "2027-01-15T23:59:00-06:00",
  finFaseTexto: "15 de enero",
};

// Un solo plazo en todo el sitio: tarjetas, resumen y pago.
export const mesesSinIntereses = 3;

// TODO: confirmar con el cliente y con el proveedor de pagos antes de publicar.
export const politicaReembolso = [
  {
    titulo: "Reembolso completo hasta el 17 de enero de 2027",
    texto:
      "Hasta 30 días antes del evento te devolvemos el 100% de tu compra al mismo medio de pago, en un máximo de 10 días hábiles.",
  },
  {
    titulo: "Después, tu lugar es transferible",
    texto:
      "Desde el 18 de enero ya no hay reembolsos, pero puedes cambiar el nombre del pase sin costo hasta 48 horas antes del evento.",
  },
  {
    titulo: "Si cambiamos fecha o cancelamos",
    texto: "Eliges entre conservar tu lugar para la nueva fecha o recibir el reembolso completo.",
  },
  {
    titulo: "Cómo solicitarlo",
    texto: "Escríbenos por correo o WhatsApp con tu folio de compra. Te respondemos en un máximo de 48 horas.",
  },
];

// El donativo, explicado para asistentes y patrocinadores.
// TODO: publicar el nombre de las organizaciones en cuanto estén confirmadas con AFP.
export const donativo = {
  titulo: "La mitad de lo que aportan nuestros aliados se queda en Jalisco.",
  texto:
    "El 50% de cada patrocinio se entrega a organizaciones sociales de Jalisco. Las elegimos con AFP Capítulo Occidente Pacífico, la asociación que profesionaliza la procuración de fondos para que más causas consigan recursos y los usen bien.",
  pasos: [
    { titulo: "Los aliados aportan", texto: "Cada marca patrocinadora define su aportación." },
    { titulo: "La mitad se aparta", texto: "El 50% se reserva desde el primer día; no paga la operación del evento." },
    { titulo: "AFP acompaña la elección", texto: "Organizaciones de Jalisco con buenas prácticas de transparencia." },
    { titulo: "Reporte público en abril", texto: "Cuánto se entregó, a quién y para qué. Con cifras, no con adjetivos." },
  ],
  boleto:
    "Tu boleto cubre la experiencia: sede, producción y ponentes. El donativo sale de las aportaciones de los aliados.",
};

// Máximo de lugares por compra (no de boletos: una mesa ocupa 4).
export const maximoPorCompra = 8;

export const regimenesFiscales = [
  "601 · General de Ley Personas Morales",
  "612 · Personas Físicas con Actividades Empresariales",
  "626 · Régimen Simplificado de Confianza",
  "605 · Sueldos y Salarios",
  "Otro",
];

export const opcionesTamanoEmpresa = [
  "1 a 10 colaboradores",
  "11 a 50 colaboradores",
  "51 a 250 colaboradores",
  "Más de 250 colaboradores",
];

export const opcionesPuesto = [
  "Dueño o socio",
  "Director general",
  "Director de área",
  "Gerente",
  "Otro",
];

export const opcionesComoSeEntero = [
  "Invitación personal",
  "Redes sociales",
  "Correo electrónico",
  "Un patrocinador",
  "Otro",
];
