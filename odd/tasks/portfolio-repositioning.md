# ODD Tracker — `portfolio-repositioning`

> **Cycle**: 2026-10-16 → 2026-10-27 · **Branch**: `feature/reposicionamiento`
> **Route**: ODD-direct (inline) · **Status**: 🛠 EN EJECUCIÓN — 17 de 19 tasks cerradas
> **Runner**: `vp check` · `vp test` · `vp build` · Lighthouse vía `pnpm dlx` (efímero)

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
a tarjetas con rol real, problema, métrica verificable, stack, y el enlace a la
**demo en vivo**. El enlace a código solo se publica si el repositorio es
público: un enlace a un repo privado es un 404 para cualquier visitante.
Objetivo: llegar a "esto está en producción y cobra dinero" en menos de 10
segundos.

**S3 — Capturas reales.** Mínimo una por proyecto destacado, en WebP, con
`loading="lazy"`, `width`/`height` declarados y `alt` descriptivo.

**S4 — Eliminar el autodescalamiento.** Se borra "me gusta la idea de poner
implementar" y "me encanta el hecho de poder modular". Se sustituye por hechos
verificables.

**S5 — Declarar el stack real con versiones.** Astro 7.4, Svelte 5.57, SvelteKit
3.1, Vitest 5, Stripe 23, Cloudflare Workers, Rust. Es la prueba, no la
aspiración: la versión que se declara es la que corre hoy, no la que se usó la
primera vez.

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
30 líneas de JS nativo y cero dependencias. Medido por Lighthouse en L10:
**JS 1 125 B gzip · CSS 1 786 B gzip · HTML 12 278 B gzip**. El presupuesto
también cubre el peso total de la página: el favicon solo puede pesar kilobytes,
no cientos.

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
| T8  | Medición antes/después: Lighthouse y peso de bundle                             | S10      | inline | **hecha** (L10-L11)            |
| T9  | Responsive real — hoy no existe ningún `@media`                                 | todos    | inline | **hecha** (L7)                 |
| T10 | Páginas de detalle por proyecto (`/proyectos/casa-noria`)                       | S2       | inline | pendiente                      |
| T11 | `<title>`, meta description, Open Graph y Twitter sin lenguaje de perfil junior | S1,S4    | inline | **hecha** (L6)                 |
| T12 | Declarar qué resuelvo y para quién: para qué me contratan                       | S1,S2    | inline | **hecha** (L8)                 |
| T13 | Quitar el enlace a código de los repos privados (Casa Noria, Tranxfers)         | S2       | inline | **hecha** (L11)                |
| T14 | Tarjeta de OpenSIM con el stack y los módulos reales, y captura del producto    | S2,S3,S5 | inline | **hecha** (L11)                |
| T15 | Fuera OpenSpec; declarar el E2E real (`@e2e-dev/web` / `e2e`)                   | S5       | inline | **hecha** (L11)                |
| T16 | Declarar Vite+ y pnpm como toolchain y package manager                          | S5       | inline | **hecha** (L11)                |
| T17 | Solar Icons: evaluar e incluir el set estático (cero JS)                        | S10      | inline | **hecha** (L11)                |
| T18 | T8: medición Lighthouse antes/después y corrección de sus hallazgos             | S10      | inline | **hecha** (L10-L11)            |
| T19 | Licencia y procedencia de los iconos vendorizados (`THIRD-PARTY-NOTICES.md`)    | S10      | inline | **hecha** (L13)                |
| T20 | Nav de 8 a 4 anclas y cierre de la sección "Bienvenido"                         | S1,S2    | inline | **hecha** (L14)                |
| T21 | Protagonismo visual uniforme en las tarjetas de proyecto                        | S2       | inline | pendiente                      |
| T22 | `#tecnologias-de-interes` → `#stack`, agrupada en cinco pilares                 | S5,S6    | inline | pendiente                      |
| T23 | `#yo` → `#entorno`: el entorno como presentación de oficio                      | S7       | inline | pendiente                      |
| T24 | `#mi-vida` + `#aficiones` + `#mis-gustos` + `#curiosidades` → `#sobre-mi`       | S7       | inline | pendiente                      |
| T25 | Verificación de tests, formato y presupuesto de JS tras el refactor             | S10      | inline | pendiente                      |

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

**Work unit**: `f361966` — _feat(portfolio): iconografia Solar, copy verificado y
hallazgos de Lighthouse_ (5 archivos, +236/−111). T13 a T18 entran en ese commit.

### L12 — 2026-10-27 · Toolchain al día: Vite+ 1.4.0 y TypeScript 7.0.2

El `vp` del PATH estaba en 1.4.0 y el catálogo del repo en 1.3.0. Se suben las
dos entradas del catálogo (el core que se publica como `vite` y `vite-plus`) y la
lista `minimumReleaseAgeExclude`, que es por donde se declara la excepción de edad
para instalar una release recién salida. Commit `ac93c84`.

Después, **TypeScript 6.0.3 → 7.0.2**, que ya es el compilador nativo, con
`happy-dom` 21.0.4 y `wrangler` 4.154.0. `vp outdated` queda vacío. Commit
`91aee0e`.

El salto de versión mayor se **midió**, no se asumió:

| Comprobación                         | Resultado                                           |
| :----------------------------------- | :-------------------------------------------------- |
| `tsc` (nativo) sobre el proyecto     | 0.14 s, sin errores                                 |
| ¿Detecta un error de tipo de verdad? | Sí: TS2322 en una sonda con `const x: number = "…"` |
| `vp check` (reglas que miran tipos)  | limpio, 0 avisos                                    |
| `vp test`                            | 32/32                                               |
| `vp build`                           | **mismos hashes de assets y mismos pesos**          |

La salida del build no cambia un byte: JS en 2 427 B sin comprimir y 1 125 B
gzip, CSS en 5 695 B, `index.html` en 57 617 B. S10 intacto.

**Riesgo que queda abierto y es del autor**: las 324 KB de Maple Mono NF siguen
siendo el mayor peso del sitio. Ahora que la toolchain está al día, el lugar
natural para atacarlo es el _subsetting_ de la fuente (una variante sin los
glifos de Nerd Fonts), no el recorte de `@font-face`, que ya está hecho.

**Estado tras L11** — el plan ya está en 17 de 19. Queda **una sola task**:

- **T10** — páginas de detalle por proyecto. Es el único trabajo estructural
  grande que queda, y el único que justificaría Lenis o Motion.
- ~~T8~~: **cerrado en L10-L11** (Lighthouse medido antes/después y sus tres
  hallazgos corregidos).
- ~~og:image~~: **cerrado** — `Showcase3.png` (236 KB) se sustituyó por
  `public/images/showcase.webp` (52 KB) y el favicon de 301 KB por uno de 8 KB.
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

### L10 — 2026-10-27 · T8, auditoría de repos, Solar Icons y corrección de copy

Solicitud del autor (verbatim):

> Procede con:
>
> - T8 mediante pnpx (o pnpm dlx) para Lighthouse
> - Revisa la integridad, viabilidad e inclusión de Solar Icons al proyecto
>   (https://solar-icons.dev/). Tiene paquetes nativos tanto como SVG o JS: [Image 1]
> - [Image 2] Los links del código de los proyectos en producción está en privado por
>   lo que debe de ser descartado, no hace diferencia alguna a la privacidad o seguridad
>   del proyecto debido al auth de GitHub pero aún así es necesario corregirlo
> - [Image 3] La demo del OpenSIM está bien pero ya dentro del proyecto se ve así,
>   además de que no mencionas que está hecha con SvelteKit 3.1.x pero sí otras
>   funcionalidades
> - Sobre el punto anterior, puedes "viajar" entre todo mi ~/Proyectos para verificar
>   por tu propia cuenta toda la arquitectura de los proyectos que ya conoces
> - Ya no uso OpenSpec
> - He usado mucho https://github.com/tester-army/e2e para funcionalidad E2E potenciada
>   con agentes de IA
> - He estado usando Vite+ como toolchain unificada para potenciar de manera OOTB y
>   concisa mis proyectos web, pnpm como package manager predilecto para todo

**T8 — Lighthouse medido (sin dependencias nuevas).** `pnpm dlx lighthouse` contra el
build servido en `127.0.0.1`, con el Chromium de `~/.cache/ms-playwright` (no se
instaló nada). La base es `ea8e8f6` (main, pre-reposicionamiento), extraída con
`git archive` a un `mktemp -d` fuera del worktree.

| Métrica             | Base `ea8e8f6` | Rama actual   | Δ       |
| :------------------ | :------------- | :------------ | :------ |
| Performance         | 0.64           | **0.96**      | +0.32   |
| Accessibility       | 1.00           | 0.96          | −0.04   |
| Best practices      | 1.00           | 1.00          | =       |
| SEO                 | 1.00           | 1.00          | =       |
| FCP / LCP           | 5.0 s / 6.6 s  | 2.3 s / 2.3 s | −2.7 s  |
| CLS                 | 0.032          | 0.006         | −       |
| JS gzip             | 647 B          | 1 125 B       | +478 B  |
| CSS gzip            | 1 315 B        | 1 786 B       | +471 B  |
| `index.html` gzip   | 6 992 B        | 12 278 B      | +5.3 kB |
| Fuentes descargadas | 8 (980 KB)     | 4 (324 KB)    | −656 KB |

El salto de Performance viene de recortar las fuentes (T7), no del contenido. Pero
**Accessibility bajó de 1.00 a 0.96** y son dos defectos que introdujo esta rama:

- `label-content-name-mismatch`: el enlace de correo del pie tiene
  `aria-label="Enviar un correo electrónico a xocemyst@duck.com"` y su texto visible
  es "Envíame un correo". WCAG 2.5.3 exige que el texto visible esté contenido en
  el nombre accesible.
- `target-size`: los anclas del índice `#servicios` y `#mis-gustos` quedan por
  debajo de 24×24 px.

**Un hallazgo que T8 no pidió y que sí importa**: el favicon
`public/icons/linux_maletin.png` pesa **301 705 B**. Es el recurso más pesado del
sitio, por encima de las cuatro fuentes. Lighthouse lo marca en
`network-dependency-tree-insight`. Ninguna medición anterior lo había visto porque
nadie miró la pestaña Network.

**Auditoría de la arquitectura real (5 repos leídos, no de README).** Un explorador
read-only recorrió `~/Proyectos/OpenSIM`, `~/Proyectos/Taller-Agentes`,
`~/Proyectos/Armadillos`, `~/Trabajo/Hotel-Casa-Noria` y `~/Trabajo/Tranxfers`, y el
padre verificó los conteos con `git rev-list --count`:

| Proyecto      | Stack real (manifest)                                                                                                                              | Commits | Visibilidad |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------- | :------ | :---------- |
| Casa Noria    | Astro 7.4.2 · Svelte 5.57.3 · Stripe 23.0.1 · `e2e` 0.21.3 + `@e2e-dev/web` 0.14.0 · D1 · output server                                            | 232     | **privada** |
| Tranxfers     | Astro 7.4.2 SSR · Svelte 5.57.2 · Vitest 5.0.5 · Playwright 1.64.1 · jsdom 30.1.3                                                                  | 97      | **privada** |
| OpenSIM       | **SvelteKit 3.1.0** · Svelte 5.57.2 · Drizzle 0.45.4 + D1 · Valibot 1.5.0 · pdf-lib · `e2e` 0.21.2 + `@e2e-dev/web` 0.15.2 · Playwright + axe-core | 248     | pública     |
| TallerAgentes | Astro 7.3.3 SSG · MDX · Tailwind 4.3.3 + daisyUI · Alpine 3.17.2 · D1 + Durable Objects · Vitest 4.1.11 + Playwright + axe-core                    | 325     | privada     |
| Armadillos    | Rust edition 2024 · axum 0.8.9 · tokio · maud · turso 0.6.1 · argon2 · chacha20poly1305 · 37 tests inline                                          | 12      | pública     |

Cifras que el copy tenía desfasadas: **Stripe 22 → 23**, **201 → 248 commits** en
OpenSIM, `Astro 7.3.5 → 7.4.2`, `Vitest 4 → 5`, y las 37 ramas de TallerAgentes
eran `git branch -a` (19 locales). TallerAgentes **no usa Svelte** y **no usa
Playwright+axe-core**; Casa Noria **no usa Playwright**, usa `@e2e-dev/web`.

**OpenSpec.** Solo existe en `Taller-Agentes/openspec/`; OpenSIM, Casa Noria y
Tranxfers documentan su ciclo con ODD en `odd/`. El autor ya no lo usa: sale del
copy de la tarjeta y de la sección Stack.

**`tester-army/e2e` es la fuente real de los paquetes E2E**: `npm view @e2e-dev/web
repository.url` → `git+https://github.com/tester-army/e2e.git`, y `npm view e2e
repository.url` → el mismo repo. El E2E de OpenSIM y Casa Noria corre con
`e2e run`, no con Playwright: Playwright es la capa complementaria (y en Casa
Noria no está).

**Vite+ y pnpm.** pnpm es el package manager de los cuatro proyectos web (OpenSIM
12.13.0, TallerAgentes 11.26.0, Casa Noria y Tranxfers con workspace pnpm);
Armadillos es Cargo. `vite-plus` solo está en este Portfolio —el resto usa el Vite
de Astro o `vite 8.3.4`—, así que el copy dice **Vite+ para este sitio** y **pnpm
en todos los proyectos web**, sin atribuir Vite+ a repos que no lo usan.

**Solar Icons: integridad, viabilidad e inclusión.** Verificado contra el
registro, no contra el landing:

- `@solar-icons/static` 2.3.3 · MIT · 26 210 archivos · 75 MB descomprimido ·
  **cero dependencias de runtime**. El CLI 2.8.0 es MIT y su única dependencia
  propia es `@solar-icons/static`.
- El catálogo real son **1 451 iconos × 6 estilos = 8 706 variaciones** (CLI
  `overview --json`), no los 1 380 de la documentación.
- **El paquete JS queda descartado**: mete runtime en el bundle y S10 deja de
  cumplirse. El paquete de framework (React/Vue/Svelte) también: aquí no hay
  framework.
- **El paquete Static es viable y es el que entra**, pero con una aritmética que
  hay que hacer explícita: los 16 iconos actuales de Lucide ocupan 11 168 B
  inline; los equivalentes Solar en **Bold** serían 21 868 B (+10.7 kB de HTML) y
  en **Linear** 14 064 B (+2.9 kB). Entra **Linear**: conserva el lenguaje de
  línea que ya tiene el sitio y cuesta 6 veces menos que Bold.
- Los SVG se traen con `pnpm dlx @solar-icons/cli get <icono> --style linear` y se
  **vendorizan dentro del HTML**: ni dependencia en `package.json`, ni petición
  extra, ni JS. El plan de iconos es 16 utilidades; **Solar no trae logotipos**
  (GitHub, Codeberg, Reddit, SimpleX no se tocan).
- Mapeo: `languages→translation`, `chevron-right→arrow-right`,
  `chevron-left→arrow-left`, `house→home`, `user→user`, `notebook-pen→notebook`,
  `heart-handshake→hand-shake`, `folder-code→folder`, `rocket→rocket`,
  `monitor→monitor`, `cat→cat`, `git-branch→git-branch`, `folder-git-2→git-fork`,
  `user-round-search→user-id`, `mail-plus→letter`, `message-square-lock→chat-round`.

### L11 — 2026-10-27 · Ejecutado: T13 a T18

**T13 — enlaces a repos privados fuera.** Casa Noria y Tranxfers ya no enlazan su
código. OpenSIM y Armadillos, que son públicos, sí lo hacen. Un test lo fija: si
alguien vuelve a enlazar un repo privado, la suite cae.

**T14 — tarjeta de OpenSIM rehecha.** Rol con los módulos reales (horario,
retícula, kardex, reinscripción, trámites, temario), stack con **SvelteKit 3.1 +
Svelte 5.57**, 248 commits y el E2E de agentes. **Captura nueva**: la anterior era
el inventario de componentes, no el producto. La nueva es el panel del sistema
—menú lateral, tarjetas de promedio, créditos y avance— capturada de la
**instancia local** con la cuenta de prueba `99999999`, porque la contraseña de la
demo desplegada no está en el repositorio (a propósito: `db-set-password-remote`
es una operación manual del autor). 16 462 B en WebP, 720×450.

**T15 — fuera OpenSpec.** Desaparecen de la tarjeta de TallerAgentes y de la
sección Stack. Entra el E2E real: `e2e` + `@e2e-dev/web`, que es de
`tester-army/e2e` (confirmado con `npm view … repository.url`), con el enlace en
la sección Stack. Playwright y axe-core se quedan: son ciertos en OpenSIM y
TallerAgentes, y el copy no los atribuye a Casa Noria.

**T16 — Vite+ y pnpm declarados.** La línea "Base" de la sección Stack dice ahora
"Vite+ como toolchain unificada y pnpm en todos mis proyectos web". Se dejamos de
atribuir Vite+ a repos que no lo usan: solo este Portfolio lo tiene.

**T17 — Solar Icons en línea.** Los 16 iconos de Lucide son ahora Solar Linear.
Se mantienen el `viewBox` de 24, el tamaño en píxeles y el grosor de trazo de
cada icono, así que el peso visual no cambia; lo que cambia es el set. **Cero
dependencias**: los SVG se bajaron con `pnpm dlx @solar-icons/cli` y se
vendorizaron dentro del HTML. **Cero JS**: el paquete `@solar-icons/js` quedó
descartado por S10.

> Trampa del formato: el set de Solar entrega `<path … />`. Dentro de `<svg>` el
> parser HTML lo tolera por las reglas de contenido foráneo, pero el resto del
> sitio usa cierre explícito (`<path …></path>`) y un parser sin "breakout" se
> traga el documento. Se convirtió a cierre explícito, como estaba antes.

**T18 — los tres hallazgos de T8, corregidos.**

| Hallazgo                                   | Corrección                                                                | Resultado                                    |
| :----------------------------------------- | :------------------------------------------------------------------------ | :------------------------------------------- |
| Favicon de 301 705 B                       | PNG de 501×498 reescalado a 64×64                                         | 8 453 B (−97 %)                              |
| `label-content-name-mismatch` (WCAG 2.5.3) | El `aria-label` del correo pasa a "Envíame un correo a xocemyst@duck.com" | Accessibility 0.96 → **1.00**                |
| `target-size` (WCAG 2.5.8)                 | `.indice a { min-height: 24px }`                                          | Los 8 enlaces del índice miden 24 px de alto |

**Lighthouse después de los arreglos**: Performance **1.00** en la segunda corrida
(0.92 en la primera: varianza de laboratorio, LCP entre 1.2 s y 3.3 s),
Accessibility **1.00**, Best practices 1.00, SEO 1.00, TBT 0 ms, CLS 0.003.
Contra la base `ea8e8f6` (0.64 / 1.00 / 1.00 / 1.00), el Performance sube 0.36.

**Lo que T8 dejó abierto**: `network-dependency-tree-insight` sigue en rojo, y la
razón son las cuatro Maple Mono NF: **324 KB de fuentes** para una página que ya
pesa 1.10 kB de JS. La itálica y la bold italic (170 KB) son el precio de que
`Maple Mono NF` traiga los glifos de Nerd Fonts. Es una decisión de identidad, no
un defecto: bajarla es trabajo del autor, no de este plan.

**Coste de T17 en el HTML**: los 16 iconos ocupan 18 045 B raw y **+4 767 B gzip**
sobre el `index.html` (10 655 B → 15 422 B). Es el precio de vendorizar el set
completo; un sprite externo no lo abarata (mismos bytes, una petición más). El
`index.html` final queda en 57.6 kB raw / 15.6 kB gzip, con el JS intacto en
**1.10 kB gzip** (S10 ✓).

### L13 — 2026-10-27 · Plan de reestructuración de la arquitectura de información

El autor entrega un plan ODD completo para reestructurar el `index.html`
(verbatim, con su redacción):

> **Objetivo General**: Transformar la estructura actual de `index.html` para
> elevar al máximo la relación señal-ruido (_signal-to-noise ratio_), reducir la
> fricción de navegación de 8 a 4 puntos principales, consolidar las secciones
> personales evitando redundancias, y regularizar la atribución de licencia de las
> herramientas integradas.
>
> **Tarea 1: Regularización de Licencia y Procedencia de Íconos (Solar Icons)**.
> Acciones: (1) Crear un archivo `THIRD-PARTY-NOTICES.md` en la raíz del
> repositorio indicando la procedencia (`@solar-icons/static@2.3.3`, estilo
> _Linear_) y la licencia MIT completa correspondiente a Hakim Saoudi. (2) Incluir
> un comentario discreto en el `<head>` de `index.html` o al inicio de los SVG
> referenciando `THIRD-PARTY-NOTICES.md` para mantener trazabilidad limpia sin
> afectar el peso del build. Verificación: inspección de archivos y `vp check`.
>
> **Tarea 2: Rediseño del Header y Simplificación de Navegación**. Acciones:
> (1) Modificar `<nav id="indice">` para dejar solo 4 secciones: `Proyectos`
> (`#proyectos`), `Stack & Calidad` (`#stack`), `Entorno & Filosofía`
> (`#entorno`), `Sobre Mí` (`#sobre-mi`). (2) Eliminar el bloque `<section
> id="bienvenido">` (meta-explicación innecesaria) y consolidar la propuesta de
> valor directamente en `<section id="servicios">` (que pasará a ser el inicio
> del contenido principal). Verificación: los enlaces funcionales en responsive y
> accesibles con lectores de pantalla (`aria-label`).
>
> **Tarea 3: Consolidación y Optimización de la Sección "Proyectos"
> (`#proyectos`)**. Acciones: (1) Ajustar `<section id="mis-proyectos">` para que
> la arquitectura y métricas de cada proyecto (Astro 7.4, Svelte 5.57, Stripe 23,
> Cloudflare Workers, Vitest, Playwright, axe-core) tengan protagonismo visual
> uniforme. (2) Asegurar que los enlaces directos a sitios en vivos y repos
> públicos (como _OpenSIM_) mantengan `target="_blank" rel="noopener noreferrer"`.
> Verificación: renderización en rejilla (`grid`) y accesibilidad HTML.
>
> **Tarea 4: Reestructuración de "Stack & Calidad" (`#stack`)**. Acciones:
> (1) Reorganizar la sección `#tecnologias-de-interes` renombrándola
> semánticamente a `#stack`. (2) Agrupar la lista de tecnologías en pilares
> claros: **Frameworks & Edge**, **Pagos & Datos**, **Infraestructura**,
> **Calidad & Testing** y **Filosofía Base**. (3) Enfatizar las pruebas
> unitarias y E2E (Vitest, Playwright, axe-core) y la restricción estricta de
> rendimiento (< 1.2 kB de JS gzipped). Verificación: claridad sintáctica del
> marcado semántico (`<strong>`, `<span>`).
>
> **Tarea 5: Rebranding de la Sección Entorno de Trabajo (`#entorno`)**.
> Acciones: (1) Renombrar la sección `<section id="yo">` ("Esto es mío") por una
> presentación ingenieril del entorno de desarrollo (`#entorno`). (2) Mantener la
> captura de escritorio real (Arch Linux, GNOME, Nushell, Kitty, Helix, hardening
> en systemd) destacando el conocimiento de sistemas operativos, bajo nivel y
> FOSS. Verificación: los `alt` de la imagen mantienen una descripción técnica
> accesible.
>
> **Tarea 6: Unificación de Secciones Personales en `#sobre-mi`**. Acciones:
> (1) Fusionar toda la información personal en una única sección bien
> estructurada `<section id="sobre-mi">`. (2) Incluir al final un bloque
> discreto `<details>` con curiosidades o gustos sutiles. (3) Asegurar que los
> canales de contacto (Email, SimpleX, GitHub, Codeberg, Reddit) queden visibles
> y accesibles al cierre. Verificación: que no queden referencias descolgadas ni
> IDs duplicados en el DOM.
>
> **Tarea 7: Validación de Tests, Formato y Presupuesto de JS**. Acciones:
> (1) Actualizar las aserciones de los tests de Vitest si la eliminación de
> selectores o los cambios de texto afectan la suite. (2) `vp check`. (3)
> `vp test` en `happy-dom`. (4) `vp build` y verificar que el JS cliente
> (`dist/assets/*.js`) se mantenga cerca de los 1.1 kB gzipped. Verificación:
> `gzip -c dist/assets/*.js | wc -c`.
>
> **Riesgo**: la reestructuración de IDs (`#yo` → `#entorno`, `#servicios` →
> `#proyectos`) o cambios en textos traducidos pueden romper tests existentes o
> scripts que dependan de clases específicas. **Mitigación**: `vp test`
> incremental tras modificar el DOM.

**Cuatro correcciones al plan, antes de ejecutar:**

1. **El mapa de IDs del bloque de riesgos está mal y es destructivo.** Dice
   `#servicios` → `#proyectos`. `#servicios` es la sección "Qué hago" (la oferta
   de valor); si se renombra a `#proyectos` se destruye y además choca con
   `#mis-proyectos`, que es la que debe pasar a `#proyectos`. El mapa correcto es
   `mis-proyectos` → `proyectos`, `tecnologias-de-interes` → `stack`, `mi-vida` →
   `sobre-mi`, `yo` → `entorno`. **`servicios` conserva su id.**
2. **El archivo de tests es `src/index.test.ts`, no `src/main.test.ts`.** Los
   contratos del DOM real (orden de secciones, anclas del índice, i18n, copy,
   iconos) viven en `index.test.ts`; `main.test.ts` prueba `main.ts` contra un
   fixture propio y no se ve afectado por estos cambios.
3. **La suite tiene 32 tests, no 24.** Los 8 nuevos son los de T13-T18.
4. **`#bienvenido` contiene el párrafo de encuadre que el autor acaba de
   reescribir a mano** ("Este es mi portafolio. Debajo vas a encontrar en qué
   trabajo…"). Eliminar la sección lo borra; la alternativa es conservarlo
   fusionado dentro de `#servicios`. Queda a decisión del autor.

**Consecuencia no escrita en el plan**: `#entorno` ("Entorno & Filosofía de
Desarrollo") es trabajo, y hoy el `<hr class="divisor">` marca justo lo
contrario — "a partir de aquí el sitio deja de hablar de trabajo". Con el
rebranding, el divisor tiene que moverse o desaparecer, y el test
`la sección de lo personal es la última y va tras un divisor` hay que
reescribirlo.

### L14 — 2026-10-27 · T20 ejecutada: nav de 4 y cierre de "Bienvenido"

**T19 — licencia y procedencia** (`fd3e44c`). `THIRD-PARTY-NOTICES.md` en la raíz
con la procedencia de los 16 iconos (`@solar-icons/static@2.3.3`, estilo
`Linear`), el texto MIT completo de Hakim Saoudi, el porqué de vendorizar inline y
el comando del CLI que los trae. Se suma la sección de las fuentes **Maple Mono
NF**: son 324 KB de OFL-1.1 y tampoco tenían aviso. Dos comentarios en
`index.html` apuntan al archivo y cuestan **82 B gzip**.

> Lo que el plan no pedía y salió de la auditoría: el favicon
> (`public/icons/linux_maletin.png`) tiene **procedencia no documentada**. Queda
> anotado en el archivo como "pendiente de identificar" en vez de inventar una
> atribución.

**T20 — el nav pasa de 8 anclas a 4.** Se conservan los SVG que ya estaban (el
carpeta de proyectos, el cohete del stack, el monitor del entorno y el usuario
del "Sobre mí") y solo cambian destino y etiqueta:

| Antes                                                                                             | Ahora                                                        |
| :------------------------------------------------------------------------------------------------ | :----------------------------------------------------------- |
| Qué hago · Sobre mí · Aficiones · Mis Gustos · Mis Proyectos · Stack · Esto es mío · Curiosidades | Proyectos · Stack & Calidad · Entorno & Filosofía · Sobre Mí |

**IDs renombrados**: `mis-proyectos` → `proyectos`,
`tecnologias-de-interes` → `stack`, `mi-vida` → `sobre-mi`, `yo` → `entorno`.
**`servicios` conserva su id** (ver la corrección 1 de L13: el plan pedía
`#servicios` → `#proyectos`, que habría destruido la sección de la oferta).

**"Bienvenido" desaparece como sección.** Su párrafo de encuadre —el que el autor
acababa de reescribir a mano— no se tira: pasa a ser la primera prosa de
`#servicios`, que así abre el contenido. Se elimina la meta-explicación
("¡Bienvenido!") y una sección entera, no solo su texto.

**Verificado**: las cuatro anclas existen y llevan a su sección (comprobado
navegando con Playwright, no solo con el selector), 32/32 tests, `vp check`
limpio y el JS sigue en **1 125 B gzip**. El HTML baja de 15.40 a **13.77 kB
gzip**: quitar cuatro entradas del nav y una sección se paga parte del coste de
los iconos de T17.

**Deriva ES/EN pendiente del autor** (su reescritura manual dejó el
`data-i18n-en` viejo en seis sitios: el intro de la sección Stack, la etiqueta
"Frameworks:", las descripciones de Frameworks, de Pagos y Datos y de Calidad, y
el texto de la línea Base). El contrato de i18n de la suite es **estructural**
—traducción no vacía y sin español suelto—, no semántico: por eso no detecta
que el inglés ya no corresponde al español. Se anota aquí para que la
sincronización sea una decisión consciente.

**Lo que T20 deja abierto**: la sección `#curiosidades` sigue viva y separada
(la fusiona T24), el divisor sigue delante de `#entorno` (que T5 convierte en
"Entorno & Filosofía de Desarrollo", o sea trabajo: el divisor tendrá que
moverse) y la oferta de "Qué hago" ya no lista los tres motivos concretos que
tenía antes de la reescritura manual del autor.
