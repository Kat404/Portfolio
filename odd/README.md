# ODD — Organic Driven Development

> Bitácora de ejecución y protocolo de trabajo para cualquier agente que toque este
> repositorio (OpenCode, Claude Code, Pi, Gemini, Codex, subagentes). Fuente de verdad
> **local al repo**: un subagente arranca sin memoria, y este archivo es lo que lee.
> Si contradice al prompt del sistema, manda el prompt del sistema; si no lo contradice,
> este archivo manda sobre la intuición.
>
> **Lee este archivo entero antes de escribir código.**
>
> - `odd/README.md` — este protocolo, siempre vigente.
> - `odd/tasks/<feature>.md` — un documento por feature en curso o cerrada.

## Contexto del proyecto

Portafolio personal estático: HTML semántico, CSS puro y TypeScript nativo sobre
Vite+ y Cloudflare Workers. Sin framework de UI, sin animación de scroll, sin
dependencia que no se justifique contra el budget de **1.1 kB de JavaScript
comprimido**.

**La voz es lo más importante del proyecto.** Los comentarios explicativos en
español del código y el copy de la página son la identidad del repo, no relleno
(S7). Al reportar o proponer, distingue siempre entre lo que está verificado en
disco y lo que es interpretación. No inventes un dato para que una pantalla se vea
completa: si no lo sabes, se dice en la página.

**Stack:** Vite+ (Vite, Rolldown, Vitest, Oxlint, Oxfmt) · TypeScript nativo ·
happy-dom · wrangler · pnpm · Codegraph.

## Contrato mínimo

- **Idioma**: conversación con el usuario en español neutro (sin voseo, sin
  muletillas). Artefactos técnicos —código, comentarios, commits, docs, tests—
  también en español neutro: es la identidad del repo (S7 de
  [`tasks/portfolio-repositioning.md`](tasks/portfolio-repositioning.md)). Nunca
  jerga ni persona en un artefacto versionado.
- **Herramientas**: `fd`/`rg`/`bat`/`eza`, nunca `find`/`grep`/`cat`/`ls` a pelo.
  Target shell del usuario: **Nushell**.
- **Runner del repo**: `vp check` (formato, lint, tipos) y `vp test`. `vp build`
  cuando el cambio toque el bundle.
- **Nada se autoriza solo**: un request de análisis, crítica, comparación o
  planificación es **read-only**. No escribas archivos, no delegues escritura,
  no commitees, aunque "suene" a que falta un detalle. Implementa solo si el
  usuario pidió el cambio.
- **YAGNI**: no escribas funciones, opciones, abstracciones ni "para más
  adelante" que nadie pidió. Borrar > agregar. Reutiliza lo que ya existe en el
  repo (helpers, componentes, convenciones) antes de inventar.

## Protocolo — 7 pasos, en este orden, en cada request

1. **Autorizar.** ¿El request autoriza mutar? Si no: read-only, responde y
   termina. Si la intención es ambigua o condicional, pregunta **una** vez y
   quédate read-only.
2. **Explorar.** Lee el código y los requisitos reales primero, en proporción al
   request. Explora solo para mapear lo que necesitas decidir; si vas a leer un
   archivo para escribir en él, léelo directo, no lo "explores".
3. **Resolver incertidumbre.** Investiga solo una incertidumbre nombrada.
   Pregunta al usuario **una** vez, solo por una decisión real de producto, y
   **espera**. Nunca asumas la respuesta.
4. **Clasificar** el tamaño de la task (sección 2). El tamaño decide tracking y
   topología; **nunca** decide leer o no leer, ni cuántos archivos toca.
5. **Registrar antes del primer write de código**, solo si la task es grande:
   crea `odd/tasks/<feature-name>.md` + su espejo en Engram. Sin pedir permiso.
   Dile al usuario en una línea qué documento creaste y cuántas tasks tiene.
6. **Implementar task por task.** Entrega por referencia, no por paráfrasis:
   nombra documento, task y specs (`Spec: odd/tasks/x.md, T2, S3-S4`). Cada task
   pasa su verificación antes de marcarse. Commitea **work units** (~400 líneas
   authored) con tests y docs pegados al comportamiento, mensaje Conventional
   Commit. Un work unit que nombra un item high-risk va en su propio commit.
7. **Cerrar.** Reporta el resultado verificado, **todos** los checks fallidos,
   omitidos o pendientes, y el siguiente paso. Toda task cerrada incluye su
   línea `Risk:` (§5). Hedgear no es parar: si el usuario dice "puedes parar",
   deja notas y commits separados.

## Tamaño de la task

**Small** — las tres deben cumplirse:

1. _Entendida_: el outcome está especificado, se sabe qué y dónde cambiar, no hay
   decisión de producto abierta, y se prueba en un batch acotado de lectura.
2. _Riesgo contenido_: no toca ningún item high-risk (§5).
3. _Resumible desde el diff_: si la sesión muere aquí, alguien termina el
   trabajo con el request original + `git diff`.

→ Small: **inline**. Sin documento de feature, sin espejo, sin commits, sin
delegación. El foco del test y la suite corren inline, una vez cada uno.

**Large** — solo cuando el test de reanudación falla: varias sesiones, espera
algo externo, o entregables separados que el usuario quiere aparte. → tracking
completo (§3) y commits por work unit.

El conteo de archivos, líneas, comandos, tests o fixes **nunca** decide el
tamaño. ~400 líneas authored (additions + deletions) por work unit es una
**heurística de planeación**, no un tope: si la solución correcta la excede,
explica por qué y sigue. Nunca recortes espacios, comentarios o tests para
caber.

## Documento de feature — `odd/tasks/<feature-name>.md`

Orden fijo. Contenido estable primero, log al final.

```markdown
# ODD Tracker — `<feature-name>`

> **Cycle**: <fecha> · **Branch**: <branch> · **Route**: ODD-direct (inline|delegated)
> **Status**: <estado> · **Runner**: `vp check` · `vp test` · `vp build`

## Objective (2-3 líneas: el outcome, no el plan)

## Specs

**S1 — <título>.** <requisito, alcance, criterio de aceptación, check aplicable>

## Tasks

| #   | Tarea | Specs | Ruta   | Estado    | Commit |
| :-- | :---- | :---- | :----- | :-------- | :----- |
| T0  | ...   | S1,S2 | inline | pendiente | —      |

## Log

### L1 — <fecha> · Solicitud original (verbatim)

> <pega exacta del request del usuario>
```

Reglas del contrato:

- **`S#` cita literal** los strings, comandos, mensajes de error y ejemplos del
  usuario, en su idioma. Nunca resumiendo, nunca reescribiendo. **Nunca añadas
  requisitos que el usuario no pidió**; si asumes algo, márcalo como supuesto.
- **`## Tasks`**: una línea por task con sus `S#`, ruta (inline/delegated),
  estado y commit. Registra **por qué** no hubo delegación (trigger y evidencia),
  para que la omisión sea observable.
- **`## Log`**: `L1` es el request original **verbatim**. Cada corrección del
  usuario se pega verbatim con su fecha. Después: análisis, evidencia de
  verificación, avance y siguiente paso. Breve, no un diario de decisiones.
- Un cambio de requisito: agrega su entrada verbatim al Log, reescribe **solo**
  el `S#` afectado y reabre **solo** su task. Los checkboxes no aprueban nada.
- **Espejo Engram**: topic `odd/<feature-name>/tasks`, proyecto `portfolio`, con
  el documento completo + su locator. Lee de vuelta ambas escrituras; no son
  atómicas. Si Engram no está, marca el espejo pendiente y sigue.
- **Resumir una feature**: `mem_context` → `mem_search` acotado al proyecto y la
  feature → `mem_get_observation` → el archivo. No infieras trabajo activo del
  evento más reciente de memoria global.

### Cómo lo consume un subagente

Un subagente no tiene memoria. El prompt que lo lanza debe darle: **el locator
del documento, el ID de task, los `S#`**, y la instrucción de leer el documento
completo y detenerse en `## Log` antes de editar. Al volver debe reportar **qué
`S#` cubrió**. Los helpers compartidos y sus invariantes (orden, unicidad,
validación, normalización) van **en el prompt**: dos unidades en paralelo no se
ven entre sí.

## Política de tests

Aplica a cambios de comportamiento, no a documentación.

- **RED antes que GREEN**: cuando exista un test determinista corrible y un
  resultado esperado claro, observa RED, implementa GREEN, y refactoriza con los
  tests en verde. **Un test RED por regla pedida.** Cada test afirma _todos_ los
  efectos observables de la regla (output, exit code, datos persistidos) y pasa
  por la interfaz pública.
- **Regresión de lo tocado**: por cada comando u opción existente que comparta
  código con tu cambio, un test que pruebe que su comportamiento anterior sigue.
  Ningún otro caso.
- **Chequeo diferencial** antes de cerrar: para cada comando existente que
  comparte el código cambiado, ejecútalo con la entrada nueva contra el código
  viejo (copia del commit base en un `mktemp -d`, **nunca commiteada**) y contra
  tu cambio; compara stdout, stderr y exit code. Una diferencia no pedida es
  regresión: se arregla y se pinea con un test.
- **Scratch fuera del worktree**: `mktemp -d` en `/tmp`. Nada de caches de tools
  o rutas temporales dentro del cambio.
- **Excepción**: documentación pasiva, runners ausentes o RED no significativo →
  explica la excepción y haz un check estructural o funcional proporcional.
  Nunca inventes evidencia RED/GREEN.
- Un commit de ODD a veces **añade** un test a un runner inexistente. Si ese test
  no lo ejecuta `vp test` o CI, no cuenta como cobertura: está, pero no corre.
- **No borres tests para hacer verde.** Un test rojo heredado del base se
  documenta como fallo conocido, no se "arregla" de paso.

## Riesgo — los 6 items high-risk

Si el cambio toca uno, es high-risk:

1. **Datos o efectos irreversibles**: migraciones, cambiar/borrar datos
   almacenados, formato persistido (no guardar registros nuevos).
2. **Seguridad**: auth, permisos, credenciales, secretos, guards, sandbox.
3. **Contratos que otros consumen**: cambiar/eliminar API pública, flags de CLI,
   formatos de config, exports publicados, prompts o contratos ya espejados
   (_agregar_ un flag u opción no es high-risk).
4. **Concurrencia**: locks, races, orden asíncrono.
5. **Entrega o entorno**: installers, release, CI, deploy, dependencias.
6. **Nada detectaría una regresión** en lo que cambia.

Cuenta como _"unclear"_ (y por tanto high-risk) cuando un vistazo acotado no
puede decir si aplica (1)-(5).

**Línea de riesgo obligatoria** al cerrar cada cambio de código:

```
Risk: item 3 (cambia el shape del config que el sitio lee)
```

…o `Risk: none`. Antes de escribir `Risk: none`, comprueba si el diff toca
código que otro comportamiento no mencionado también usa (opciones compartidas,
parsers, helpers): si lo hace, es item 3.

## Triggers de delegación

Solo cuando la condición **de verdad** se cumple; ninguno aplica por defecto.
Si dudas, inline.

| Trigger         | Condición                                                                                                      | Acción                                                      |
| :-------------- | :------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| **Mapeo**       | Entender excede un batch inline (~5 búsquedas)                                                                 | 1 explorador read-only, handoff ≤ 2k tokens con `path:line` |
| **Writer**      | (a) 2+ unidades independientes con superficies disjuntas, cada una de varios minutos; (b) backstop de contexto | 1 writer acotado por unidad                                 |
| **Verificador** | La línea `Risk:` nombra un item high-risk                                                                      | 1 verificador independiente, tras los checks del cambio     |
| **Preparación** | Cuando el writer trigger delega la escritura                                                                   | Delega con ella la lectura que la prepara                   |

Nunca por tamaño, cantidad de archivos, ni relación de precio. Varias changes
pequeñas e independientes corren inline, una tras otra. Unidades de ≤100 líneas
corren inline: escribir cuesta menos que arrancar un worker.

**Work unit = una pieza independiente de comportamiento con su código, sus tests
y sus docs juntos.** Nunca lo partas en "writer de tests" + "writer de código";
una entrega que depende de otra no es independiente.

## Verificación

- **Inline**: el focused test de lo que cambió + la suite, una vez cada uno.
- **Delegado**: el writer corre los comandos autorizados en `## Verification` en
  foreground y reporta `<comando>: <resultado observado>`. El padre hace un
  **spot check** de un comando reportado antes de entregar.
- Un **blocker** del verificador recibe **un** batch de corrección y **un**
  recheck acotado a esos blockers. Si un segundo recheck muestra el mismo blocker
  abierto, se escala a **"Necesita tu decisión"** — nunca a un loop de
  re-verificación.
- Una tarea tracked solo queda _pendiente_ con el stop explícito del usuario o un
  **"Necesita tu decisión"** único que nombre los blockers. Proof parcial,
  bloqueado o agotado se colapsa en ese único resultado.

## Entrega — qué NO haces

- **Push, PR y merge son decisiones del usuario.** Los work-unit commits de una
  implementación ODD autorizada sí son parte del protocolo.
- Nunca commitees como efecto colateral de una exploración.
- Nunca inventes evidencia: ni RED/GREEN, ni un runner, ni un check que no
  corriste.
- Nunca amplíes alcance porque encontraste algo mejor. Lo anotas y lo preguntas.
- No borres ni reformatees archivos fuera del alcance del cambio.

---

## Notas del proyecto

Trampas ya pisadas en este repo. No las repitas:

- **`chromium --headless --screenshot` no dispara `IntersectionObserver`.** Las
  secciones con `.hidden` salen en blanco porque la opacidad la pone
  `IntersectionObserver` en `src/main.ts`. Sirve para el tope de la página; para
  ver más abajo hace falta Playwright con scroll programático.
- **El Chromium de Playwright no es dependencia del repo.** Vive en
  `~/.cache/ms-playwright/`, lo dejaron `Hotel-Casa-Noria` y `OpenSIM`. No
  instales nada para capturar.
- **`hotelcasanoria.com.mx` responde 403** con `cf-mitigated: challenge` al
  headless: Cloudflare bloquea el bot. Para esa captura hay que servir el repo
  local.
- **Los pesos de fuente estaban los 5 en uso** (`a`=500, `.quote`=600,
  `.copyright`=300, `h1-h4`=700, `.titulo-principal`=800). Borrar los
  `@font-face` sin normalizar primero rompe el render. Hoy solo se declaran 400 y
  700: si agregas un peso, decláralo **y úsalo**, o borra su archivo.
- **La salida de `rg` puede venir sustituida** en este entorno (`js-enabled` se
  mostró como `n`). Confirma con `grep` antes de citar evidencia.
