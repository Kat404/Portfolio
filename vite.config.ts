import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, type Plugin } from "vite-plus";
import { variantes } from "./src/i18n-variants.ts";

// ? Las dos páginas del sitio salen del mismo `index.html`: la española, que se sirve
// ? en `/`, y la inglesa, que se sirve en `/en/`. El plugin aplica el inglés al HTML
// ? y reparte el resultado; el `index.html` del repo sigue siendo la única fuente.
function paginasDeIdioma(): Plugin {
  // ? El HTML ya traducido y con las URLs de los assets resueltas.
  let inglesa = "";
  let comando: "build" | "serve" = "serve";
  let raiz = process.cwd();

  return {
    name: "portfolio:i18n-variants",
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

        inglesa = en;

        // ? En el build el HTML se vuelve a calcular en `generateBundle`, sobre el
        // ? documento ya con las URLs de los assets resueltas: así la variante
        // ? inglesa no queda con los marcadores de posición sin resolver.
        return comando === "build" ? html : es;
      },
    },
    generateBundle(_opciones, bundle) {
      const indice = Object.values(bundle).find(
        (salida) => salida.type === "asset" && salida.fileName === "index.html",
      );

      if (!indice || indice.type !== "asset") {
        // ? Sin este asset la española se emitiría con el inglés dentro: se avisa
        // ? en vez de dejar pasar una página que promete una cosa y sirve otra.
        this.warn("i18n-variants: no se encontró el index.html del bundle");
        return;
      }

      const { es, en } = variantes(indice.source as string);

      // ? La española conserva su lugar y pierde los atributos de traducción; la
      // ? inglesa se emite como un asset más, con su propio canonical.
      indice.source = es;
      this.emitFile({ type: "asset", fileName: "en/index.html", source: en });
    },
    configureServer(server) {
      // ? En desarrollo `/en/` se sirve con la misma transformación: el autor no
      // ? tiene que trabajar contra `vp preview`.
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !/^\/en\/?$/.test(req.url)) return next();

        try {
          await server.transformIndexHtml(
            "/index.html",
            readFileSync(join(raiz, "index.html"), "utf8"),
          );
          res.setHeader("Content-Type", "text/html");
          res.end(inglesa);
        } catch (error) {
          next(error as Error);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [paginasDeIdioma()],
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
