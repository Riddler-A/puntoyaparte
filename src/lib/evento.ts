import type { StaticImageData } from "next/image";
import ponente1 from "@/assets/ponentes/ponente-1.png";
import ponente2 from "@/assets/ponentes/ponente-2.png";
import ponente3 from "@/assets/ponentes/ponente-3.png";

// Contenido de la edición actual. Fuente: "Punto y Aparte — Patrocinios 2027".

export const edicion = {
  anio: "2027",
  ciudad: "Guadalajara",
  sede: "Sede por anunciar",
  inicio: "2027-02-17T09:00:00-06:00",
  fechasLargas: "17 y 18 de febrero de 2027",
  fechasCortas: "17–18 feb 2027",
};

export const contacto = {
  nombre: "Víctor Hernández",
  cargo: "Comercialización",
  telefono: "33 1738 0678",
  whatsapp: "https://wa.me/523317380678",
  email: "comercializacion.vh@gmail.com",
  instagram: "https://www.instagram.com/___puntoyaparte",
  instagramUsuario: "@___Puntoyaparte",
};

export const preguntaCentral =
  "¿Estamos construyendo una empresa que solo genera riqueza, o una que también deja algo valioso a su paso?";

export const pilares = [
  {
    numero: "01",
    nombre: "Rentabilidad",
    texto: "Empresas financieramente sólidas, capaces de innovar, competir y crecer a largo plazo.",
  },
  {
    numero: "02",
    nombre: "Personas",
    texto: "Liderazgos que desarrollan talento y saben que el bienestar del equipo llega a sus familias.",
  },
  {
    numero: "03",
    nombre: "Ética",
    texto: "Decisiones coherentes y transparentes, sin cambiar principios por resultados inmediatos.",
  },
  {
    numero: "04",
    nombre: "Trascendencia",
    texto: "Organizaciones que dejan huella en su comunidad y usan sus recursos con responsabilidad.",
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
      { nombre: "Pitch de patrocinadores", duracion: "7 min" },
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
      { nombre: "Cerca de 30 invitados perfilados", duracion: "" },
      { nombre: "Networking director a director", duracion: "" },
      { nombre: "Conversación directa con patrocinadores Capicúa", duracion: "" },
    ],
  },
];

export const cifras = [
  { valor: "100", etiqueta: "Dueños y directivos perfilados" },
  { valor: "2", etiqueta: "Días: Voces y cata de café" },
  { valor: "3", etiqueta: "Ponentes, 40 minutos cada uno" },
];

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
