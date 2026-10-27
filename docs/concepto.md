# Punto y Aparte · Concepto del sitio web

> Documento vivo de la fase conceptual. Fuente: *Punto y Aparte — Patrocinios 2027.pptx*.

## Idea central

**"Una pausa para cambiar de párrafo."** Punto y Aparte organiza eventos sobre capitalismo consciente: empresas que generan riqueza y también dejan algo valioso a su paso.

El punto rojo del logo es el hilo visual del sitio: marca el avance, separa secciones y "cierra" cada página en su llamado a la acción.

Pregunta rectora: *¿Estamos construyendo una empresa que solo genera riqueza, o una que también deja algo valioso a su paso?*

## Identidad visual (tomada de la presentación)

| Elemento | Valor |
|---|---|
| Rojo (punto) | `#F94441` · hover/oscuro `#C9302A` |
| Acento | naranja del trazo del logo |
| Fondo crema | `#FAF6F0` · `#FFFDFA` |
| Arena | `#E9E1D6` |
| Texto | `#1E1C1C` · secundario `#5A5552` |
| Tipografía | Inter Tight (títulos) · Inter (texto) |

Activos en [`src/assets/`](../src/assets): logo, punto rojo y fotos de ponentes.

## Arquitectura: dos landings + cuenta de asistente

```
/               Inicio (marca + edición actual, bifurca a los dos públicos)
/2027           Landing de asistentes → solicitud de lugar
/patrocina      Landing de patrocinadores → solicitud de propuesta
/mi-cuenta      Área privada del asistente (pase, agenda, encuentros…)
/impacto        Transparencia: 50% a AFP, distribución, reporte
/bitacora       Fase 2: radio, grabaciones, notas por edición
```

Todo se organiza por **ediciones** (2027, 2028…): Punto y Aparte es la empresa, no un solo evento.

### Landing de patrocinadores — `/patrocina`

Meta: convertir una visita en una conversación con comercialización.

1. Hero: "Tu marca frente a quienes deciden" · fechas · [Solicita la propuesta] [WhatsApp]
2. Cifras: 100 directivos · perfil AB/C+ · +4,000 contactos · +90,000 de alcance
3. Quién asiste: edad, NSE, medianas empresas, intereses
4. Qué gana tu marca: antes (digital), durante (escenario, 1 a 1), después (posteo, reporte)
5. Paquetes: Encuadre · Palíndroma · **Capicúa** (2 lugares) + comparador de beneficios
6. Tu inversión deja huella: 50% a AFP y transparencia
7. Voces de la edición · FAQ
8. Formulario: nombre, empresa, puesto, paquete de interés → envía el deck PDF y avisa a comercialización

### Landing de asistentes — `/2027`

Meta: solicitar lugar y crear su cuenta.

1. Hero: la pregunta · cuenta regresiva · cupo limitado · [Solicita tu lugar]
2. "Imagina esto": la escena de los dos cafés
3. Los 4 pilares + mini diagnóstico de tu empresa
4. Las voces: 3 ponentes y la pregunta de cada uno
5. Agenda: Día 1 Voces · Día 2 Cata de café
6. Tu experiencia: lo que obtienes con tu cuenta
7. Sede, cómo llegar, FAQ
8. Solicitud perfilada → aprobación → acceso a la cuenta

## Funciones para asistentes

**Fase 1** = indispensable para el evento de febrero 2027.

| Momento | Función | Fase |
|---|---|---|
| Antes | Solicitud de lugar con perfil (empresa, puesto, giro, tamaño) y aprobación | 1 |
| Antes | Mi cuenta: estado de solicitud y pase digital con QR | 1 |
| Antes | Agregar a calendario, recordatorios por correo/WhatsApp | 1 |
| Antes | Diagnóstico de los 4 pilares (autoevaluación de la empresa) | 2 |
| Antes | Preguntas para los ponentes, con votos | 2 |
| Antes | Elegir con quién quiero conversar (matchmaking por perfil e intereses) | 2 |
| Antes | Invita a un colega (referidos, sujeto a aprobación) | 2 |
| Durante | Check-in con QR | 1 |
| Durante | Agenda en vivo desde el celular | 1 |
| Durante | Mis encuentros 1 a 1 con hora y mesa | 2 |
| Durante | Intercambio de contacto escaneando el QR de otro asistente | 2 |
| Durante | Preguntas en vivo a los ponentes | 2 |
| Durante | "Invita un café": tarjeta de reconocimiento para otro asistente | 3 |
| Después | Encuesta y constancia de asistencia | 1 |
| Después | Mis contactos del evento | 2 |
| Después | Grabaciones y resumen por pilar | 2 |
| Después | Mi compromiso: tu "punto y aparte" y seguimiento a 90 días | 3 |
| Después | Beneficios exclusivos de patrocinadores | 3 |
| Después | Prioridad para la próxima edición | 3 |

Complemento para patrocinadores (fase 2–3): portal con sus encuentros 1 a 1, contactos que aceptaron compartir datos y reporte final del evento.

## Implicación técnica

Las funciones de cuenta (registro, aprobación, QR, agenda, matchmaking) requieren backend: autenticación, base de datos y panel de administración para aprobar solicitudes. Un sitio estático no basta.

Propuesta: Next.js + Supabase (auth, base de datos, almacenamiento) + envío de correos transaccionales. Hosting en Vercel o en el servidor propio.

## Pendientes antes de publicar

- [ ] Trayectoria: eventos anteriores, fotos y testimonios reales (hoy son marcadores en la presentación)
- [ ] Precios: ¿se publican montos o solo beneficios? ¿+ IVA?
- [ ] AFP: deducibilidad, proyecto beneficiado en Jalisco, distribución real de recursos
- [ ] Asistentes: ¿boleto de pago o por invitación?
- [ ] Sede y horarios exactos
- [ ] Confirmar a qué ponente corresponde cada foto en `assets/ponentes/`
- [ ] Dominio y hosting
- [ ] Aviso de privacidad (se recaban datos personales y de perfil)
