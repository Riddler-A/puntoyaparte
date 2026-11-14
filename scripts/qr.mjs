// Genera el QR de una invitación (SVG y PNG) sin dependencias externas.
// Uso: node scripts/qr.mjs <url> <archivo-sin-extension>
// Codificación en modo byte, corrección de errores M, versiones 1 a 6.

import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const [url, salida] = process.argv.slice(2);
if (!url || !salida) {
  console.error("Uso: node scripts/qr.mjs <url> <archivo-sin-extension>");
  process.exit(1);
}

// Nivel M por versión: [codewords de corrección por bloque, tamaños de bloque de datos]
const tablaM = {
  1: [10, [16]],
  2: [16, [28]],
  3: [26, [44]],
  4: [18, [32, 32]],
  5: [24, [43, 43]],
  6: [16, [27, 27, 27, 27]],
};
const alineacion = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34] };

const bytes = [...Buffer.from(url, "utf8")];
const version = Object.keys(tablaM)
  .map(Number)
  .find((v) => tablaM[v][1].reduce((a, b) => a + b) >= bytes.length + 2);
if (!version) throw new Error("La URL es demasiado larga para este generador.");
const [ecPorBloque, bloquesDatos] = tablaM[version];
const capacidad = bloquesDatos.reduce((a, b) => a + b);
const tam = version * 4 + 17;

// 1. Flujo de bits: modo byte, longitud, datos, terminador y relleno.
const bits = [];
const poner = (valor, n) => {
  for (let i = n - 1; i >= 0; i--) bits.push((valor >>> i) & 1);
};
poner(0b0100, 4);
poner(bytes.length, 8);
bytes.forEach((b) => poner(b, 8));
poner(0, Math.min(4, capacidad * 8 - bits.length));
while (bits.length % 8) bits.push(0);
const datos = [];
for (let i = 0; i < bits.length; i += 8) datos.push(parseInt(bits.slice(i, i + 8).join(""), 2));
for (let relleno = 0xec; datos.length < capacidad; relleno ^= 0xec ^ 0x11) datos.push(relleno);

// 2. Reed-Solomon sobre GF(256).
const mult = (x, y) => {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
};
const divisor = (grado) => {
  const r = Array(grado).fill(0);
  r[grado - 1] = 1;
  let raiz = 1;
  for (let i = 0; i < grado; i++) {
    for (let j = 0; j < grado; j++) {
      r[j] = mult(r[j], raiz);
      if (j + 1 < grado) r[j] ^= r[j + 1];
    }
    raiz = mult(raiz, 0x02);
  }
  return r;
};
const residuo = (datosBloque, div) => {
  const r = Array(div.length).fill(0);
  for (const b of datosBloque) {
    const factor = b ^ r.shift();
    r.push(0);
    div.forEach((d, i) => (r[i] ^= mult(d, factor)));
  }
  return r;
};

const div = divisor(ecPorBloque);
const bloques = [];
let pos = 0;
for (const n of bloquesDatos) {
  const d = datos.slice(pos, pos + n);
  pos += n;
  bloques.push({ d, ec: residuo(d, div) });
}
const codewords = [];
for (let i = 0; i < Math.max(...bloquesDatos); i++) bloques.forEach((b) => i < b.d.length && codewords.push(b.d[i]));
for (let i = 0; i < ecPorBloque; i++) bloques.forEach((b) => codewords.push(b.ec[i]));

// 3. Matriz con patrones fijos.
const modulos = Array.from({ length: tam }, () => Array(tam).fill(false));
const fijo = Array.from({ length: tam }, () => Array(tam).fill(false));
const fijar = (x, y, oscuro) => {
  modulos[y][x] = oscuro;
  fijo[y][x] = true;
};
for (let i = 0; i < tam; i++) {
  fijar(6, i, i % 2 === 0);
  fijar(i, 6, i % 2 === 0);
}
for (const [cx, cy] of [
  [3, 3],
  [tam - 4, 3],
  [3, tam - 4],
]) {
  for (let dy = -4; dy <= 4; dy++)
    for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx;
      const y = cy + dy;
      const d = Math.max(Math.abs(dx), Math.abs(dy));
      if (x >= 0 && x < tam && y >= 0 && y < tam) fijar(x, y, d !== 2 && d !== 4);
    }
}
const ap = alineacion[version];
ap.forEach((ay, i) =>
  ap.forEach((ax, j) => {
    const ultimo = ap.length - 1;
    if ((i === 0 && j === 0) || (i === 0 && j === ultimo) || (i === ultimo && j === 0)) return;
    for (let dy = -2; dy <= 2; dy++)
      for (let dx = -2; dx <= 2; dx++) fijar(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }),
);

const formato = (mascara) => {
  const d = (0b00 << 3) | mascara; // 00 = nivel M
  let r = d;
  for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
  const b = ((d << 10) | r) ^ 0x5412;
  const bit = (i) => ((b >>> i) & 1) === 1;
  for (let i = 0; i <= 5; i++) fijar(8, i, bit(i));
  fijar(8, 7, bit(6));
  fijar(8, 8, bit(7));
  fijar(7, 8, bit(8));
  for (let i = 9; i < 15; i++) fijar(14 - i, 8, bit(i));
  for (let i = 0; i < 8; i++) fijar(tam - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i++) fijar(8, tam - 15 + i, bit(i));
  fijar(8, tam - 8, true);
};
formato(0);

// 4. Datos en zigzag.
let k = 0;
for (let derecha = tam - 1; derecha >= 1; derecha -= 2) {
  if (derecha === 6) derecha = 5;
  for (let v = 0; v < tam; v++)
    for (let j = 0; j < 2; j++) {
      const x = derecha - j;
      const y = ((derecha + 1) & 2) === 0 ? tam - 1 - v : v;
      if (!fijo[y][x] && k < codewords.length * 8) {
        modulos[y][x] = ((codewords[k >>> 3] >>> (7 - (k & 7))) & 1) === 1;
        k++;
      }
    }
}

// 5. Máscara con menor penalización.
const mascaras = [
  (x, y) => (x + y) % 2 === 0,
  (x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];
const aplicar = (m) => {
  for (let y = 0; y < tam; y++) for (let x = 0; x < tam; x++) if (!fijo[y][x] && mascaras[m](x, y)) modulos[y][x] = !modulos[y][x];
};
const penalizacion = () => {
  let p = 0;
  const lineas = [];
  for (let i = 0; i < tam; i++) {
    lineas.push(modulos[i]);
    lineas.push(modulos.map((fila) => fila[i]));
  }
  for (const l of lineas) {
    let corrida = 1;
    for (let i = 1; i <= tam; i++) {
      if (i < tam && l[i] === l[i - 1]) corrida++;
      else {
        if (corrida >= 5) p += corrida - 2;
        corrida = 1;
      }
    }
    const s = l.map((m) => (m ? 1 : 0)).join("");
    p += 40 * ((s.match(/(?=10111010000)/g) || []).length + (s.match(/(?=00001011101)/g) || []).length);
  }
  for (let y = 0; y < tam - 1; y++)
    for (let x = 0; x < tam - 1; x++) {
      const c = modulos[y][x];
      if (c === modulos[y][x + 1] && c === modulos[y + 1][x] && c === modulos[y + 1][x + 1]) p += 3;
    }
  const oscuros = modulos.flat().filter(Boolean).length;
  p += Math.floor(Math.abs(oscuros * 20 - tam * tam * 10) / (tam * tam)) * 10;
  return p;
};
let mejor = 0;
let menor = Infinity;
for (let m = 0; m < 8; m++) {
  aplicar(m);
  formato(m);
  const p = penalizacion();
  if (p < menor) [menor, mejor] = [p, m];
  aplicar(m);
}
aplicar(mejor);
formato(mejor);

// 6. Salidas: SVG para imprenta y PNG para compartir.
const margen = 4;
const total = tam + margen * 2;
const tinta = "#1E1C1C";
const papel = "#FFFDFA";
let ruta = "";
for (let y = 0; y < tam; y++) for (let x = 0; x < tam; x++) if (modulos[y][x]) ruta += `M${x + margen} ${y + margen}h1v1h-1z`;
writeFileSync(
  `${salida}.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges"><rect width="${total}" height="${total}" fill="${papel}"/><path d="${ruta}" fill="${tinta}"/></svg>\n`,
);

const escala = 24;
const lado = total * escala;
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const [ct, cp] = [rgb(tinta), rgb(papel)];
const filas = Buffer.alloc((lado * 3 + 1) * lado);
for (let py = 0; py < lado; py++) {
  const base = py * (lado * 3 + 1);
  filas[base] = 0;
  for (let px = 0; px < lado; px++) {
    const x = Math.floor(px / escala) - margen;
    const y = Math.floor(py / escala) - margen;
    const oscuro = x >= 0 && y >= 0 && x < tam && y < tam && modulos[y][x];
    (oscuro ? ct : cp).forEach((c, i) => (filas[base + 1 + px * 3 + i] = c));
  }
}
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
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(lado, 0);
ihdr.writeUInt32BE(lado, 4);
ihdr[8] = 8;
ihdr[9] = 2;
writeFileSync(
  `${salida}.png`,
  Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloque("IHDR", ihdr),
    bloque("IDAT", deflateSync(filas)),
    bloque("IEND", Buffer.alloc(0)),
  ]),
);

console.log(`QR versión ${version}-M, máscara ${mejor}, ${tam}×${tam} módulos → ${salida}.svg / .png`);
