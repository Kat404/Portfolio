import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, type Plugin } from "vite-plus";
import { variantes } from "./src/i18n-variants.ts";
import { enlacesDeCaso, paginaProyecto } from "./src/proyecto-pagina.ts";
import { proyectos } from "./src/proyectos.ts";

// ? Las páginas del sitio salen del mismo `index.html`: la española, que se sirve en
// ? `/`, la inglesa, que se sirve en `/en/`, y las ocho páginas de detalle de los
// ? proyectos. El plugin aplica el inglés al HTML y reparte el resultado; el
// ? `index.html` del repo sigue siendo la única fuente.
function paginasDelSitio(): Plugin {
  // ? El HTML ya traducido y con las URLs de los assets resueltas.
  let espanola = "";
  let inglesa = "";
  let comando: "build" | "serve" = "serve";
  let raiz = process.cwd();

  return {
    name: "portfolio:paginas",
    // ? En `post` para que las URLs de los assets ya reescritas viajen a las dos
    // ? variantes.
    enforce: "post",
    configResolved(config) {
      comando = config.command;
      raiz = config.root;
    },
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const { es, en } = variantes(html);

        // ? Las tarjetas enlazan su página de detalle: en la variante inglesa, a la
        // ? página inglesa del proyecto.
        espanola = enlacesDeCaso(es, "es");
        inglesa = enlacesDeCaso(en, "en");

        // ? En el build el HTML se vuelve a calcular en `generateBundle`, sobre el
        // ? documento ya con las URLs de los assets resueltas: así la variante
        // ? inglesa no queda con los marcadores de posición sin resolver.
        return comando === "build" ? html : espanola;
      },
    },
    generateBundle(_opciones, bundle) {
      const indice = Object.values(bundle).find(
        (salida) => salida.type === "asset" && salida.fileName === "index.html",
      );

      if (!indice || indice.type !== "asset") {
        // ? Sin este asset la española se emitiría con el inglés dentro: se avisa
        // ? en vez de dejar pasar una página que promete una cosa y sirve otra.
        this.warn("paginas: no se encontró el index.html del bundle");
        return;
      }

      const { es, en } = variantes(indice.source as string);
      const paginaEs = enlacesDeCaso(es, "es");
      const paginaEn = enlacesDeCaso(en, "en");

      // ? La española conserva su lugar y pierde los atributos de traducción; la
      // ? inglesa se emite como un asset más, con su propio canonical.
      indice.source = paginaEs;
      this.emitFile({ type: "asset", fileName: "en/index.html", source: paginaEn });

      // ? Las ocho páginas de detalle: cuatro proyectos, en español y en inglés.
      for (const proyecto of proyectos) {
        this.emitFile({
          type: "asset",
          fileName: `proyectos/${proyecto.slug}/index.html`,
          source: paginaProyecto(paginaEs, proyecto, "es"),
        });
        this.emitFile({
          type: "asset",
          fileName: `en/proyectos/${proyecto.slug}/index.html`,
          source: paginaProyecto(paginaEn, proyecto, "en"),
        });
      }
    },
    configureServer(server) {
      // ? En desarrollo `/en/` y las rutas de los proyectos se sirven con la misma
      // ? transformación: el autor no tiene que trabajar contra `vp preview`.
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url ?? "").split("?")[0];
        const detalle = /^\/(en\/)?proyectos\/([^/]+)\/?$/.exec(url);
        const esLaInglesa = /^\/en\/?$/.test(url);

        if (!detalle && !esLaInglesa) return next();

        try {
          await server.transformIndexHtml(
            "/index.html",
            readFileSync(join(raiz, "index.html"), "utf8"),
          );

          res.setHeader("Content-Type", "text/html");

          if (detalle) {
            const proyecto = proyectos.find((p) => p.slug === detalle[2]);

            if (!proyecto) return next();

            // ? El grupo 1 dice si la ruta es la inglesa: `/en/proyectos/<slug>/`.
            res.end(
              detalle[1]
                ? paginaProyecto(inglesa, proyecto, "en")
                : paginaProyecto(espanola, proyecto, "es"),
            );
            return;
          }

          res.end(inglesa);
        } catch (error) {
          next(error as Error);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [paginasDelSitio()],
  test: {
    environment: "happy-dom",
  },
  // ! .wrangler/ es caché local de Cloudflare y .atl/ es un registro generado; ninguno lleva código.
  fmt: {
    ignorePatterns: [".wrangler/**", ".atl/**"],
  },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: [".wrangler/**", ".atl/**"],
  },
});
