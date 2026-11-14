// Genera los íconos del sitio en src/app: icon.svg, favicon.ico y apple-icon.png.
// Dibujo en una cuadrícula de 64 unidades: el punto rojo y la estrella del logo.
// Uso: node scripts/iconos.mjs

import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const rojo = "#F94441";
const trazo = "#F5A524";
const crema = "#FAF6F0";

const punto = { cx: 41, cy: 41, r: 21 };
const grosor = 5;
// Trazos de la estrella: la barra vertical y los rayos que salen hacia la izquierda.
const rayos = [
  [22, 3, 22, 32],
  [19, 17, 4, 5],
  [19, 18, 3, 19],
  [19, 19, 6, 32],
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<circle cx="${punto.cx}" cy="${punto.cy}" r="${punto.r}" fill="${rojo}"/>
<g stroke="${trazo}" stroke-width="${grosor}" stroke-linecap="round">${rayos
  .map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`)
  .join("")}</g>
</svg>
`;

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const distanciaSegmento = (px, py, [x1, y1, x2, y2]) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
};

// Color de una muestra en coordenadas de 64 unidades (null = fondo).
const muestra = (u, v) => {
  if (rayos.some((r) => distanciaSegmento(u, v, r) <= grosor / 2)) return rgb(trazo);
  if (Math.hypot(u - punto.cx, v - punto.cy) <= punto.r) return rgb(rojo);
  return null;
};

const tablaCrc = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = tablaCrc[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const bloque = (tipo, contenido) => {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(contenido.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo), contenido]);
  const suma = Buffer.alloc(4);
  suma.writeUInt32BE(crc(cuerpo));
  return Buffer.concat([largo, cuerpo, suma]);
};

// PNG RGBA con suavizado (5×5 muestras por píxel). `margen` deja aire alrededor del dibujo.
function png(lado, { fondo = null, margen = 0 } = {}) {
  const n = 5;
  const escala = 64 / (lado * (1 - 2 * margen));
  const desplazamiento = lado * margen;
  const filas = Buffer.alloc((lado * 4 + 1) * lado);
  for (let y = 0; y < lado; y++) {
    const base = y * (lado * 4 + 1);
    for (let x = 0; x < lado; x++) {
      const acumulado = [0, 0, 0];
      let cubierto = 0;
      for (let sy = 0; sy < n; sy++)
        for (let sx = 0; sx < n; sx++) {
          const c = muestra((x + (sx + 0.5) / n - desplazamiento) * escala, (y + (sy + 0.5) / n - desplazamiento) * escala);
          if (c) {
            cubierto++;
            c.forEach((v, i) => (acumulado[i] += v));
          }
        }
      const o = base + 1 + x * 4;
      const a = cubierto / (n * n);
      for (let i = 0; i < 3; i++) {
        const color = cubierto ? acumulado[i] / cubierto : 0;
        filas[o + i] = fondo ? Math.round(color * a + fondo[i] * (1 - a)) : Math.round(color);
      }
      filas[o + 3] = fondo ? 255 : Math.round(a * 255);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(lado, 0);
  ihdr.writeUInt32BE(lado, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloque("IHDR", ihdr),
    bloque("IDAT", deflateSync(filas)),
    bloque("IEND", Buffer.alloc(0)),
  ]);
}

function ico(imagenes) {
  const cabecera = Buffer.alloc(6 + imagenes.length * 16);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(imagenes.length, 4);
  let desplazamiento = cabecera.length;
  imagenes.forEach(({ lado, datos }, i) => {
    const e = 6 + i * 16;
    cabecera[e] = lado;
    cabecera[e + 1] = lado;
    cabecera.writeUInt16LE(1, e + 4);
    cabecera.writeUInt16LE(32, e + 6);
    cabecera.writeUInt32LE(datos.length, e + 8);
    cabecera.writeUInt32LE(desplazamiento, e + 12);
    desplazamiento += datos.length;
  });
  return Buffer.concat([cabecera, ...imagenes.map((i) => i.datos)]);
}

const destino = new URL("../src/app/", import.meta.url);
writeFileSync(new URL("icon.svg", destino), svg);
writeFileSync(new URL("favicon.ico", destino), ico([16, 32, 48].map((lado) => ({ lado, datos: png(lado) }))));
writeFileSync(new URL("apple-icon.png", destino), png(180, { fondo: rgb(crema), margen: 0.16 }));
console.log("Íconos generados en src/app");
