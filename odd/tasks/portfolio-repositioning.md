# ODD Tracker — `portfolio-repositioning`

> **Cycle**: 2026-10-16 · **Branch**: `main` (direct)
> **Route**: ODD-direct (inline) · **Status**: 🛠 EN EJECUCIÓN — 9 de 13 tasks cerradas
> **Runner**: `vp check` · `vp test` · `vp build`

## Objective

Convertir el Portfolio de un blog personal en una demostración verificable de
trabajo real. Hoy el documento afirma perfil de junior mientras la evidencia
en disco dice otra cosa. El objetivo no es rediseñar: es dejar de subvender.

---

## Diagnóstico (evidencia medida, 2026-10-16)

| Señal ausente del documento | Evidencia real en disco                                                                                                                                                                                     |
| :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Casa Noria                  | Astro 7.3.5 + Svelte 5.56.8 + Cloudflare Workers, Stripe 22, `ai` SDK 7, `jspdf`, `chart.js`, `@noble/hashes`, E2E con `@e2e-dev/web`, Biome, SEO local, RBAC, ADRs. Sitio oficial de hotel real.           |
| Tranxfers                   | Astro 7.2.6 SSR + Svelte 5.56.10 (runes), wizard de cotización de 3 pasos con autosave en `localStorage`, Vitest 4.                                                                                         |
| TallerAgentes               | Monorepo Cloudflare Workers (D1, Durable Objects, SSG), contenido MDX, OpenSpec con TDD estricto, `Containerfile.ci`, `justfile`. Plataforma del curso de IEEE Computer Society ITM. 325 commits, 19 ramas. |
| Armadillos (Rust)           | `axum`, `tokio`, `maud`, `tower-http`, `serde`, `tracing`, `turso`. Logística militar: type-safety, ACID, RBAC, auditabilidad.                                                                              |
| OpenSIM                     | Rediseño FOSS de sistema académico TecNM. `drizzle-orm`, `valibot`, `pdf-lib`, Playwright + `@axe-core/playwright`, `@e2e-dev/web`. 201 commits.                                                            |

- La palabra `producción` no aparece en `index.html`.
- `index.html` contiene **0 elementos `<img>`**. `public/images/Showcase3.png`
  (236 KB) se usa únicamente como `og:image`.
- Enlaces externos actuales: solo GitHub, Codeberg, Reddit y SimpleX.
  Ninguna URL en vivo de los proyectos de producción.
- El documento se posiciona como "Framework Principal: Astro",
  "Librería Popular: React", y cataloga Quinta-Dalam como
  "Primer proyecto real en un ámbito formal".
- Todas las secciones usan `class="hidden"` y dependen de JS +
  `IntersectionObserver` para ser visibles.
- `public/fonts` pesa 980 KB en 12 archivos WOFF2 para 6 pesos declarados.
- Budget actual de JS: **1.19 KB sin comprimir** al inicio del plan. Hoy son
  **2.4 KB sin comprimir / 1.1 KB gzip** tras el selector de idioma (ver L9).

---

## Specs

**S1 — Narrativa invertida.** La apertura declara dos sistemas en producción con
ingresos, una plataforma docente y trabajo open source. Evidencia antes que
biografía.

**S2 — Los proyectos son el contenido principal.** De `<li class="list-project">`
a tarjetas con rol real, problema, métrica verificable, stack, y dos enlaces:
**demo en vivo** y código. Objetivo: llegar a "esto está en producción y cobra
dinero" en menos de 10 segundos.

**S3 — Capturas reales.** Mínimo una por proyecto destacado, en WebP, con
`loading="lazy"`, `width`/`height` declarados y `alt` descriptivo.

**S4 — Eliminar el autodescalamiento.** Se borran "me gusta la idea de poner
implementar" y "me encanta el hecho de poder modular". Se sustituye por hechos
verificables.

**S5 — Declarar el stack real con versiones.** Astro, Svelte, Vitest, Stripe,
Cloudflare, Rust. Es la prueba, no la aspiración.

**S6 — "Tecnologías de Interés" deja de ser sección de deseos** y pasa a stack y
práctica real, ordenada por dominio demostrado.

**S7 — Se conserva la voz del autor.** Los comentarios explicativos en español
del proyecto son su identidad. No se tocan.

**S8 — Resolver el hazard de contenido dependiente de JS.** Sin JS, el contenido
no debe ser invisible para un crawler.

**S9 — Presupuesto de fuentes.** Declarar solo los pesos realmente usados.

**S10 — El budget de JS se mantiene.** Cualquier dependencia nueva se justifica
contra el baseline. El original era 1.19 KB sin comprimir; desde L9 la referencia
es **1.1 KB gzip** (2.4 KB sin comprimir), porque el selector de idioma añadió
30 líneas de JS nativo y cero dependencias.

---

## Tasks

| #   | Tarea                                                                           | Specs    | Ruta   | Estado                         |
| :-- | :------------------------------------------------------------------------------ | :------- | :----- | :----------------------------- |
| T0  | Inventario por proyecto: rol, métrica, URL en vivo, repo, stack con versiones   | S1,S2,S5 | inline | parcial — URLs recibidas (L5)  |
| T1  | Capturas de Casa Noria, Tranxfers, TallerAgentes, OpenSIM → WebP                | S3       | inline | **hecha** — 4 de 4 (L8)        |
| T2  | Reordenar secciones: narrativa → trabajo → stack → acerca de mí                 | S1,S6    | inline | **hecha** (L8)                 |
| T3  | Proyectos como tarjetas con enlace a demo y a código                            | S2       | inline | **hecha** (L5)                 |
| T4  | Sustituir autodescalamiento por hechos                                          | S4       | inline | **hecha** (L5)                 |
| T5  | Declarar stack real con versiones                                               | S5       | inline | **hecha** (L8)                 |
| T6  | Resolver `class="hidden"` sin JS                                                | S8       | inline | **cerrada** — ya resuelta (L4) |
| T7  | Recortar `@font-face` a los pesos usados y medir delta                          | S9       | inline | **hecha** (L8)                 |
| T8  | Medición antes/después: Lighthouse y peso de bundle                             | S10      | inline | pendiente                      |
| T9  | Responsive real — hoy no existe ningún `@media`                                 | todos    | inline | **hecha** (L7)                 |
| T10 | Páginas de detalle por proyecto (`/proyectos/casa-noria`)                       | S2       | inline | pendiente                      |
| T11 | `<title>`, meta description, Open Graph y Twitter sin lenguaje de perfil junior | S1,S4    | inline | **hecha** (L6)                 |
| T12 | Declarar qué resuelvo y para quién: para qué me contratan                       | S1,S2    | inline | **hecha** (L8)                 |

Todas las tareas van **inline**: son de un solo archivo comprensible
(`index.html`, `src/styles/*.css`) y ninguna toca lógica con rama o riesgo.

---

## Inventario T0 — evidencia medida 2026-10-17

Cifras leídas de los repos (`git rev-list --count`, `package.json`, `src/pages/`),
no de documentación. `~/Trabajo` = proyectos de cliente; `~/Proyectos` = propio u
open source.

| Proyecto          | Rol                                                                           | Evidencia medible                                                                   | URL en vivo              | Repo                                 |
| :---------------- | :---------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- | :----------------------- | :----------------------------------- |
| **Casa Noria**    | Sitio oficial del Hotel Casa Noria (Acapulco). Reserva con pago.              | 22 páginas · 140 commits · 9 ramas · Astro 7.3.5 · Svelte 5.56.8 · Stripe 22        | ❌ no documentada        | `github.com/Kat404/Hotel-Casa-Noria` |
| **Tranxfers**     | Traslados privados cotizados (Viajes RumboX). Wizard de cotización de 3 pasos | 7 páginas · 55 commits · 3 ramas · Astro 7.2.6 SSR · Svelte 5.56.10 · Vitest 4      | ❌ no documentada        | `github.com/Kat404/Tranxfers`        |
| **TallerAgentes** | Plataforma del curso "Agentes de IA y Automatización", IEEE CS ITM            | 325 commits · 37 ramas · Workers free · D1 · Durable Objects · SSG · MDX · OpenSpec | n/a (plataforma interna) | `github.com/Kat404/TallerAgentes`    |
| **OpenSIM**       | Rediseño FOSS del sistema académico del TecNM Morelia, como demo funcional    | 201 commits · 5 ramas · drizzle-orm · valibot · pdf-lib · Playwright + a11y         | n/a (rediseño)           | `github.com/Kat404/OpenSIM`          |
| **Armadillos**    | Logística militar en Rust: ACID, RBAC, auditabilidad                          | 12 commits · 5 ramas · axum · tokio · maud · turso                                  | n/a                      | `github.com/Kat404/Armadillos`       |

Tres hechos que el plan debe respetar:

1. **La columna "URL en vivo" la entrega el autor, no los repos** (L5):
   `hotelcasanoria.com.mx` y `tranxfers.com.mx`. Ningún repo las declara —
   `wrangler.jsonc` solo trae `name: "hotel-casa-noria"` y no hay URLs de despliegue
   en los README. T3 depende de que se mantengan al día a mano.
2. **Armadillos es la evidencia más débil** del conjunto: 12 commits contra
   201-325 de los demás. No se destaca con la misma jerarquía, o no se destaca.
3. **Lo que sí genera ingresos vive en `~/Trabajo`.** El portfolio actual solo
   enlaza `github.com/Kat404` (dotfiles, FISH-Terminal, ZSH-Terminal,
   `linux_security.conf`) y un `Quinta-Dalam` bajo **otra** cuenta
   (`JoseAlbertRuiL`). No hay ni un enlace al trabajo que paga.

---

## Veredicto sobre Lenis y Motion

Solicitados por el usuario como opción. No bloquean, pero tampoco deben
influir en el alcance.

**Lenis — no recomendado.** Son ~3 KB, cero dependencias, respeta
`prefers-reduced-motion` por defecto y conserva `position: sticky` y anchors.
Pero es señal de gusto, no de oficio: hoy lo trae cualquier template.
Contradeciría el argumento central del proyecto, que es "HTML semántico y CSS
puro", y degrada el scroll de trackpad. Decisión: **posponer; probablemente
nunca.**

**Motion — condicionado a T10.** El bundle `mini` son 2.6 KB con `animate` y es
tree-shakeable por Vite. Su caso real son animaciones de salida y layout
(transiciones FLIP), que CSS no puede hacer. Si el Portfolio sigue siendo una
sola página, el 90% de lo que se animaría ya está resuelto en
`src/styles/animations.css`. Decisión: **solo si T10 entra en alcance.**

**Estado tras L8** — el orden acordado en L6 se ejecutó completo:
T11 → T9 → T1 → T12 → T2 → T5 → T7. Quedan cuatro:

- **T8** — medición antes/después. Los números ya existen: fuentes 980→324 KB,
  JS 1.1 kB gzip, CSS 5.7 kB, 4 capturas de 12-26 KB. Falta el Lighthouse formal.
- **T10** — páginas de detalle. Es el único trabajo estructural grande que queda,
  y el único que justificaría Lenis o Motion.
- **og:image** — `Showcase3.png` (236 KB) sigue siendo la imagen social. No es
  una task: es deuda que dejó T1, y sale editando una línea.
- **Lighthouse formal** (T8) y **páginas de detalle** (T10): lo que queda.
- ~~Inglés~~: **cerrado en L9**. La traducción vive en la misma página con
  `data-i18n-en`, no en una ruta `/en`.

> Nota: "T1 Tüür" en la línea anterior es un typo de redacción; es "T1 cerró con
> el `og:image` pendiente". Sin efecto en el alcance.

---

## Log

### L1 — 2026-10-16 · Solicitud original (verbatim)

> Me refería más a puntos de mejora para mi Portfolio tomando en cuenta los
> proyectos que tengo y qué realizado además de que tanto Hotel-Casa-Noria y
> Tranxfers son proyectos en producción que me generaron ingresos (por eso están
> en ~/Trabajo y no en ~/Proyectos), me gustaría mejorar más mi Portfolio para
> que sea más una demostración de lo que verdaderamente soy y dejar de ser tanto
> un blog personal.
>
> Analiza (y planea) de manera realista y crítica la mejora de mi portafolio,
> tomando en cuenta que siguremos usando Vite+, usando HTML, CSS y TS nativo.
>
> Puedes proveer de mejoras de cualquier tipo y alcance (sobre el Portfolio),
> desde su contenido, estructura, bibliotecas, decoración, colores, tipografía,
> transiciones, íconos y demás.
>
> Esto no es bloqueante (y tampoco debería influir en tu criticismo) pero podría
> ser buena idea usar Lenis (lenis.dev) y Motion (motion.dev) si quisiera una
> experiencia scroll-first para mi portafolio.
>
> TODO es plan ODD, nada de crear código, commitear ni modificar.

### L2 — 2026-10-16 · Autorización de persistencia (verbatim)

> Pon todo esta planeación ODD en disco, luego commitea todos los cambios
> asegurándote de que pase por vp check y luego push

### L3 — 2026-10-16 · Alcance de esta entrada

Este documento registra **planificación únicamente**. Ninguna tarea T0-T10 se ha
implementado. El commit que lo acompaña incluye además el trabajo de las
sesiones previas todavía sin commitear: `packageManager` pin de pnpm,
eliminación de `devEngines` que rompía el language server de Zed, eliminación
del bloque `observability` muerto, fusión del `.gitignore` con las reglas de
Wrangler, y recorte del `.zed/settings.json` de plantilla a 8 lenguajes.

### L4 — 2026-10-17 · T0 ejecutada (lectura) y T6 cerrada

El autor pregunta por dónde empezar. Se ejecuta **T0** completa salvo la columna
"URL en vivo", y se documenta en la sección `## Inventario T0`.

**T6 se cierra sin trabajo: el hazard de S8 no existe.** `index.html:103` ejecuta
un script inline que añade `js-enabled` a `<html>`, y todo el CSS de revelado está
acotado a ese selector (`.js-enabled .hidden > * { opacity: 0 }`,
`src/styles/animations.css:19`). Sin JS, la clase nunca se añade, la regla nunca
aplica y el contenido se ve. El diagnóstico original de 2026-10-16 leyó
`class="hidden"` sin ver el gate.

**Corrección menor**: la fila T2 traía un fragmento en chino (`→关于 mí`); ahora
`→ acerca de mí`. No altera el alcance de T2.

**Orden revisado**: T6 sale. T3 y T4 se ejecutan juntas —son el mismo trabajo
sobre `index.html` y el mismo criterio de honestidad: si T4 quita el
autodescalamiento pero T3 no pone producción con ingresos al frente, la sección
queda más corta e igual de débil. T5 baja después de T2 porque las versiones se
redactan mejor cuando la sección de stack ya tiene el orden final.

**Bloqueo de T3**: faltan las URLs públicas de Casa Noria y Tranxfers. Ningún
repo las declara y T3 las necesita para cumplir S2. Preguntado al autor; hasta
que responda, T3 se puede escribir con enlace a código pero sin "demo en vivo".

### L5 — 2026-10-17 · T3 y T4 ejecutadas (primera implementación)

El autor autoriza escribir en `index.html` y entrega las URLs que faltaban:
**`hotelcasanoria.com.mx`** (Casa Noria) y **`tranxfers.com.mx`** (Tranxfers).

**T3 — proyectos como tarjetas.** La `<ul>` de `<li class="list-project">` se
sustituye por un `.project-grid` con cuatro `<article class="project-card">`:
Casa Noria, Tranxfers, TallerAgentes y OpenSIM. Cada tarjeta lleva
`.project-role` (qué es y para quién), `.project-facts` (hechos medidos, no
adjetivos) y `.project-links` (demo en vivo + código; solo código para los dos
que no tienen sitio público). Los cinco proyectos pequeños quedan bajo un
`<h3>Otros proyectos</h3>` con la lista anterior intacta.

**T4 — copy sin autodescalamiento.** Fuera "Primer proyecto real en un ámbito
formal", "me encanta el hecho de poder modular" y "me gusta la idea de poner
implementar". En su lugar: qué se construyó y con qué. También se corrigió el
lead-in "me encanta estar aprendiendo acerca de" por "lo que uso en proyectos
que se entregan a clientes".

**Estilo**: 55 líneas nuevas en `src/styles/styles.css` (rejilla `auto-fit
minmax`, tarjeta con borde y fondo `base-darker`, enlaces al pie con
`margin-top: auto`). CSS puro, cero JS: **el bundle sigue en 1.19 kB**, S10
intacto en ese momento.

**Test-first (RED → GREEN)**: `src/index.test.ts` fija el contrato de S2 y S4
sobre el `index.html` real vía `import html from "../index.html?raw"`. RED
observado: 3 tests fallando (0 tarjetas, URLs ausentes, copy presente).
GREEN: 7/7 pasan, los 4 preexistentes de `main.test.ts` sin tocar.
`vp check` limpio y `vp build` correcto.

**No verificado**: el render visual de las tarjetas (no hay `e2e.config.ts` en el
repo; abrir un navegador para una captura puntual es más caro que el riesgo de un
`grid` estándar). Queda para T1, que sí necesita navegador.

**Fuera de alcance, detectado**: `Mi Vida` sigue diciendo "Desarrollo Web
(Aprendizaje Temprano)" y "me quiero enfocar en el desarrollo FrontEnd" — la
misma enfermedad que S4, pero en la sección que toca T2. No se tocó.

### L6 — 2026-10-17 · Grill de prioridades y T11 ejecutada

El autor pide "qué sigue" y somete el plan a grill. Cinco decisiones suyas, todas
registradas aquí:

1. **T11 (nueva) — meta y title, primera.** El `<title>` decía "Frontend
   Developer JR" y la meta description "un estudiante ... con un interés
   temprano". Es el mismo S4, pero en el `<head>`, y ninguna task lo cubría: es
   lo que ve el reclutador en Google y lo que WhatsApp/Slack muestran **antes**
   del clic.
2. **T9 sube a bloqueante.** `grep -c "@media"` → 0 en `styles.css`,
   `animations.css` e `index.html`. Un enlace de portfolio se abre desde el móvil.
3. **T1 desbloqueada**: hay autorización del cliente para capturar y publicar
   `hotelcasanoria.com.mx` y `tranxfers.com.mx`.
4. **T12 (nueva)** — declarar qué resuelvo y para quién. El plan mostraba
   proyectos brillantes sin decir nunca qué se me contrata para hacer.
5. **Orden**: capturas primero, performance después. T1 antes que T7/T8.

**T11 ejecutada.** `<title>`: "Sitios en producción con Astro y Svelte — José
Luis Ramírez Sánchez". Description, `og:title`, `og:description`,
`twitter:title` y `twitter:description` llevan el mismo texto: "Dos sitios en
producción con ingresos, una plataforma docente y un rediseño open source.
Astro, Svelte, Stripe y Cloudflare Workers." El `og:image` se mantiene
(`Showcase3.png`, 1200x630); T1 puede reemplazarlo por una captura real.

**Motivo de las 6 copias**: el mismo copy autodescalador estaba duplicado en
cinco metadatos y ninguno lo vigila. Por eso el test, no la buena voluntad.

**Test-first (RED → GREEN)**: dos tests nuevos en `src/index.test.ts`. RED:
`expected 'Portafolio Personal - José Luis - Fro…' not to match /\bJR\b|…/`.
GREEN: **9/9**, los 7 previos sin tocar. `vp check` limpio, bundle JS sigue en
**1.19 kB**.

**Desperdicio detectado, sin resolver**: `og:image` sigue siendo
`public/images/Showcase3.png` (236 KB) — la imagen de preview es la más pesada
del sitio y no es del portfolio actual. Se resuelve en T1.

### L7 — 2026-10-17 · T9 ejecutada y T1 parcial

**Herramienta: no se instaló nada.** El Chromium de Playwright ya existe en
`~/.cache/ms-playwright/chromium-1243/` (lo dejaron `Hotel-Casa-Noria` y
`OpenSIM` al instalar sus deps). Se usa directo con `--headless=new`. El repo no
gana una dependencia nueva.

**T9 — responsive real.** Dos hallazgos medidos con captura antes/después:

- **A 1440 px los párrafos medían 170 caracteres por línea.** Sin `max-width` en
  `main`, los bloques ocupaban la pantalla completa. Ahora `main` tiene
  `max-width: 60rem` y `margin-inline: auto`.
- **A 375 px el título se partía en 4 líneas** y el índice ocupaba 4 filas.
  Añadido `@media (max-width: 40rem)`: índice más compacto, título a 1.55rem,
  padding de tarjeta reducido.

**T1 — 2 de 4 capturas.** `public/images/proyectos/{casa-noria,tranxfers}.webp`,
720x450, **26 KB y 23 KB** (desde PNG de 1 MB), con `loading="lazy"`,
`width`/`height`, `alt` descriptivo y `aspect-ratio` en CSS. Test nuevo: toda
imagen de proyecto con dimensiones, lazy, alt de más de 10 caracteres y `.webp`.
10/10 verde.

**Por qué solo dos:**

- **Casa Noria**: `hotelcasanoria.com.mx` devuelve **HTTP 403 con
  `cf-mitigated: challenge`** — Cloudflare bloquea el headless, incluso con 25 s
  de budget. La captura se tomó del dev server local (`astro dev --port 4399`),
  que devuelve el mismo sitio. Es el mismo código, no una maqueta.
- **Tranxfers**: `tranxfers.com.mx` responde 200 y se capturó **en vivo**. Su
  `astro dev` local se muere al arrancar, pero no hizo falta.
- **TallerAgentes y OpenSIM**: no tienen sitio público y no se pueden levantar
  sin instalar dependencias. Sus tarjetas quedan sin captura — es preferible a
  inventar una imagen.

**Pendiente de T1**: las dos capturas que faltan, y reemplazar el `og:image`
de 236 KB por una imagen real del portfolio.

### L8 — 2026-10-17 · Second grill: T7, T12, T2, T5 y cierre de T1

Segundo round de grill. Decisiones del autor: commitear en rama, recortar
fuentes, T12 primero, y terminar T1. Execution completa:

**T1 — CERRADA, 4 de 4.** El autor entregó las URLs que faltaban:
`opensim.jose-luis-rs.workers.dev` y `talleragentes.jose-luis-rs.workers.dev`
(ambas respondieron 200). `talleragentes.webp` y `opensim.webp`, 13 KB cada
una. **El repo de TallerAgentes es privado**: su tarjeta NO lleva enlace a
código, solo al sitio en vivo. Enlazarlo sería un 404 para cualquier visitante.

**T7 — 980 KB → 324 KB.** Trampa: los cinco pesos **estaban en uso** en reglas
distintas (`a`=500, `.quote`=600, `.copyright`=300, `h1-h4`=700,
`.titulo-principal`=800). Borrar los `@font-face` sin normalizar primero rompe
el render. Orden correcto: normalizar las reglas a 400/700, **luego** borrar
los 8 archivos que nadie usa.

**T12 — sección "Qué hago".** Abre la página: qué construyo, tres razones
concretas y contacto. Es lo primero que ve el visitante.

**T2 — copy de "Sobre mí" sin autodescalamiento y secciones reordenadas.**
Fuera "Desarrollo Web (Aprendizaje Temprano)" y "me quiero enfocar en el
desarrollo FrontEnd" — la enfermedad de S4 que quedaba viva. Orden final:
Qué hago → Bienvenido → Sobre mí → Proyectos → Stack → Curiosidades.

**T5 — "Tecnologías de Interés" pasa a "Stack".** Con la versión real de cada
herramienta en producción, ordenada por dominio demostrado (S6).

**Tests: 14/14.** Cuatro describes nuevos fijan el orden de secciones, que todo
ancla del índice exista, que el copy no prometa ni se disculpe, y que cada
sección tenga título.

**Trampa de captura**: `chromium --headless --screenshot` **no dispara
`IntersectionObserver`**, así que las secciones con `.hidden` salen en blanco.
Sirve para el tope de la página, no para más abajo. Con scroll hace falta
Playwright (`playwright-core` de `OpenSIM`) y scroll programático.

**Entrega**: rama `feature/reposicionamiento`, 5 work units commiteados. El
push queda como decisión del autor.

**Pendiente conocido**: `og:image` sigue siendo `Showcase3.png` (236 KB).

### L9 — 2026-10-17 · Inglés traducido y datos de bundle corregidos

El autor pide tres cosas: quitar un término sin explicación, hacer la traducción
al inglés y corregir las cifras de bundle.

**`fsh` no era la shell.** Salió de leer el panel de neofetch de la captura del
escritorio. Es un alias a `fastfetch`:
`FISH-Terminal/conf.d/30_aliases.fish:56` → `alias fsh='fastfetch'`, y lo mismo
en `ZSH-Terminal/es/zshrc.d/aliases.zsh:384`. La shell del autor es **Nushell**.
Fuera de la sección "Esto es mío" y del `alt` de la captura.

**Inglés: cerrado.** La traducción vive en la misma página con `data-i18n-en`,
no en una ruta `/en`. **111 nodos** de contenido y **8 etiquetas accesibles**
traducidos. Se borra la nota "todavía no hay versión en inglés" y el `hreflang`
apunta a `?lang=en`, que ahora sí existe, con `es` y `x-default`.

**Dos atributos, nunca mezclados.** El primer intento usaba `data-i18n-en`
también en `<nav>` y en los `<a>` con icono, y rompía el sitio: sustituir el
contenido de un contenedor borra sus hijos, y el índice quedaba vacío. Ahora
`data-i18n-en` traduce contenido y `data-i18n-en-aria` traduce etiqueta
accesible. Un test prohíbe que un nodo traducible por contenido tenga hijos
reales.

**El original se fotografía al cargar**, no al volver atrás: si se tomara
después de sobrescribir, "volver a español" devolvería el inglés.

**Bundle corregido.** S10 decía 1.19 kB y el número llevaba tres sesiones de
mentira:

|                  | Antes   | Ahora                  |
| :--------------- | :------ | :--------------------- |
| JS sin comprimir | 1.19 kB | **2.42 kB**            |
| JS gzip          | 0.62 kB | **1.10 kB**            |
| CSS              | 4.66 kB | 5.67 kB                |
| `index.html`     | 35.6 kB | 50.0 kB (gzip 12.3 kB) |

La referencia de S10 pasa a **1.1 kB gzip**. El crecimiento es del selector de
idioma: ~30 líneas de JS nativo, cero dependencias. `index.html` creció porque
la traducción viaja en el DOM, no en un fetch: se pesan y se eligió lo primero
para que funcione sin red y para que los tests puedan fijarla.

**Tests: 24/24.** Los nuevos: que ninguna traducción deje español sin traducir,
que ningún nodo traducible sea un contenedor, que el `hreflang` apunte a algo
real, y que el selector sobreviva a ir y volver.

**Fuera de alcance**: T8 (Lighthouse formal) y T10 (páginas de detalle).
