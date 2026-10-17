<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# AGENTS.md — Bitácora de Ejecución

## Contexto

Portafolio personal estático: **HTML semántico, CSS puro y TypeScript nativo** sobre
Vite+ y Cloudflare Workers. Sin framework de UI, sin animación de scroll, sin
dependencia que no se justifique. El budget es **1.19 kB de JavaScript**: es una
decisión de diseño, no un dato que relajar. Un mantenedor; los agentes no deben
adivinar el tooling.

**La voz es lo más importante del proyecto.** Los comentarios explicativos en
español del código y el copy de la página son la identidad del repo, no relleno
(S7 de `odd/tasks/portfolio-repositioning.md`). Todo artefacto versionado —código,
comentarios, commits, docs, tests— va en español neutro, sin jerga ni persona.

**Stack:** Vite+ (Vite, Rolldown, Vitest, Oxlint, Oxfmt) · TypeScript nativo ·
happy-dom · wrangler · pnpm · Codegraph.

### Qué es dato y qué es invención

Al reportar o proponer, no mezcles las dos categorías. Cuando afieces un hecho
del portfolio (commits, páginas, métricas, versiones), cítalo de donde viene: el
repositorio, `package.json`, `git rev-list`, o un `curl`. Si no lo sabes,
pregunta; no rellenes para que la pantalla se vea completa.

## Patrones y Guía de Ejecución

### Búsqueda e Indexado de Código

- **Al empezar la sesión, corre `codegraph status` y lee el aviso de versión.** Si dice `⚠ Index was built by vX.Y.Z; re-index to pick up this engine's improvements`, el índice se construyó con un Codegraph viejo aunque diga "Index is up to date". Pídele al mantenedor autorización para reindexar (`codegraph index`, reconstrucción completa, o `codegraph sync` si el propio aviso lo sugiere) y espera su respuesta. La indexación es suya: no la corras por tu cuenta, y no sigas usando el índice viejo como si estuviera al día.
- Siempre que requieras y quieras buscar cualquier fragmento de código haz de _Codegraph_ tú método principal y favorito. Codegraph permite indexar y buscar de manera semántica y natural porciones de código grande.
- Para búsqueda menos extensa y con un alcance más específico haz uso de _ripgrep_ (mediante 'rg') como una mejora exponencial de rendimiento de _grep_.
- Como último recurso haz uso de _grep_.
- `.codegraph/` ya se autoexcluye de git: su `.gitignore` ignora todo menos él mismo, así que la base nunca se sube. El `.gitignore` sí se versiona.

### Datos & Privacidad

- Siempre que vayas a tratar con datos personales pregunta al usuario mantenedor qué se deberían hacer con dichos datos, debido a que sería un riesgo grave a la privacidad subirlos en remoto.
- Cumple el requisito anterior aún si los datos no parecen ser completamente personales o que involucren a primeras o terceras personas.
- `~/Trabajo` contiene repos de cliente que pagan. **Capturar o publicar material suyo requiere autorización explícita del mantenedor cada vez**, no solo del hecho de que el sitio sea público.

### Comandos: usa los que existen

| Comando          | Qué hace                                                                              |
| ---------------- | ------------------------------------------------------------------------------------- |
| `vp check`       | Formato, lint y tipos en un solo gate. **El default antes de cerrar cualquier cosa.** |
| `vp check --fix` | Lo anterior, escribiendo los cambios.                                                 |
| `vp test`        | Vitest con `happy-dom`. 15 tests que fijan el copy y la estructura del `index.html`.  |
| `vp build`       | Bundle de producción. Confirma que el JS sigue en 1.19 kB.                            |
| `vp dev`         | Servidor de desarrollo.                                                               |
| `vp install`     | Tras traer cambios remotos, y antes de empezar.                                       |

`vp` es el CLI único: `vp dev` y `vp run dev` **pueden no ser lo mismo**. Los
scripts de `package.json` (`build`, `preview`, `deploy`) existen y no se
sobrescriben. Una receta que no aparece ahí no existe y no la debes inventar en
un reporte.

### Prohibido lo remoto

`pnpm deploy` y `wrangler deploy` despliegan a producción. Requieren autorización
explícita del mantenedor **cada vez**, sin excepción. Una autorización de una
corrida anterior no autoriza la siguiente, y "el plan lo pedía" tampoco.

Igual de remoto, aunque no destruya nada: `git push`. Piden autorización en los
mismos términos. El resto del trabajo es local.

### Capturas: no instales nada

El Chromium de Playwright **ya está en la máquina** (`~/.cache/ms-playwright/`,
lo dejaron los repos de Hotel-Casa-Noria y OpenSIM). El repo no tiene
Playwright como dependencia y no debe añadirla. Capturas con:

```bash
CHROME=~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome
"$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --virtual-time-budget=4000 --screenshot=out.png --window-size=1280,800 URL
```

**Trampa:** ese modo no dispara `IntersectionObserver`, así que las secciones con
`.hidden` salen en blanco. Para ver más abajo del pliegue hace falta Playwright
con scroll programático.

### Actualización & Seguimiento

- **Toda task de este repo pasa por ODD.** Lee [`odd/README.md`](odd/README.md) antes de escribir código: los 7 pasos, el criterio small/large, el formato del documento de feature, la política RED→GREEN y la línea `Risk:` obligatoria. Un request de análisis o plan es **read-only** salvo que el autor pida implementación.
- Cualquier cambio de código pasa por `vp check` y `vp test`, más `vp build` si toca el bundle. **El bundle debe seguir en 1.19 kB** (S10): una dependencia nueva se justifica contra ese baseline o no entra.
- Al avanzar en tareas o planeaciones, actualiza `odd/` si hay un plan ODD para lo que ya ejecutaste.
- Guarda y/o actualiza en memoria Engram lo anterior. Este paso es _obligatorio_ se tenga o no una planeación ODD.

## Disclaimer

Ver `README.md` para el propósito del proyecto.
