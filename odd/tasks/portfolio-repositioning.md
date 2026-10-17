# ODD Tracker — `portfolio-repositioning`

> **Cycle**: 2026-10-16 · **Branch**: `main` (direct)
> **Route**: ODD-direct (inline) · **Status**: 📋 PLANNING ONLY — zero implementation
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
- Budget actual de JS: **1.19 KB** (`dist/assets/index-*.js`).

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
contra el baseline actual de 1.19 KB.

---

## Tasks

| #   | Tarea                                                                         | Specs    | Ruta   | Estado    |
| :-- | :---------------------------------------------------------------------------- | :------- | :----- | :-------- |
| T0  | Inventario por proyecto: rol, métrica, URL en vivo, repo, stack con versiones | S1,S2,S5 | inline | pendiente |
| T1  | Capturas de Casa Noria, Tranxfers, TallerAgentes, OpenSIM → WebP              | S3       | inline | pendiente |
| T2  | Reordenar secciones: narrativa → trabajo → stack →关于 mí                     | S1,S6    | inline | pendiente |
| T3  | Proyectos como tarjetas con enlace a demo y a código                          | S2       | inline | pendiente |
| T4  | Sustituir autodescalamiento por hechos                                        | S4       | inline | pendiente |
| T5  | Declarar stack real con versiones                                             | S5       | inline | pendiente |
| T6  | Resolver `class="hidden"` sin JS                                              | S8       | inline | pendiente |
| T7  | Recortar `@font-face` a los pesos usados y medir delta                        | S9       | inline | pendiente |
| T8  | Medición antes/después: Lighthouse y peso de bundle                           | S10      | inline | pendiente |
| T9  | Responsive real — hoy no existe ningún `@media`                               | todos    | inline | pendiente |
| T10 | Páginas de detalle por proyecto (`/proyectos/casa-noria`)                     | S2       | inline | pendiente |

Todas las tareas van **inline**: son de un solo archivo comprensible
(`index.html`, `src/styles/*.css`) y ninguna toca lógica con rama o riesgo.

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

**Orden recomendado**: T0 → T3 → T1 → T2 → T9. El mayor retorno es contenido y
evidencia con **cero dependencias**.

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
