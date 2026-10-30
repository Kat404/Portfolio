import { describe, expect, it } from "vite-plus/test";
import html from "../index.html?raw";

// ! Drift i18n (T28, S4). El contrato de `index.test.ts` es estructural: comprueba que
// ! la traducción exista, no rompa el markup y no deje español suelto. Eso no detecta el
// ! caso que mordió de verdad: el autor reescribió el español a mano y el inglés se
// ! quedó viejo. Aquí se comparan los dos lados nodo por nodo.

// ! El documento real es la fuente de verdad: el español es el contenido del nodo y el
// ! inglés viaja en el atributo `data-i18n-en`.
document.documentElement.innerHTML = html;

// ? Palabras que aparecen en los dos idiomas y NO son drift: nombres propios,
// ? tecnología y el vocabulario técnico que el copy español deja deliberadamente en
// ? inglés. Se derivó de forma empírica sobre el `index.html` real, no de memoria.
const LISTA_BLANCA = new Set([
  // ? Personas, organizaciones y lugares propios
  "josé",
  "luis",
  "ramírez",
  "sánchez",
  "ieee",
  "computer", // ? parte del nombre propio "IEEE Computer Society"
  "society",
  "acapulco",
  "morelia",
  "tecnm",
  "viajes",
  "rumbox",

  // ? Marcas, proyectos, tecnologías y comandos
  "astro",
  "svelte",
  "sveltekit",
  "cloudflare",
  "workers",
  "stripe",
  "drizzle",
  "valibot",
  "tailwind",
  "playwright",
  "vitest",
  "wrangler",
  "pnpm",
  "vite",
  "typescript",
  "javascript",
  "html",
  "github",
  "kitty",
  "helix",
  "nushell",
  "fish",
  "gnome",
  "firefox",
  "linux",
  "arch",
  "freebsd",
  "openbsd",
  "intel",
  "landlock",
  "seccomp",
  "localstorage",
  "dotfiles",
  "neofetch",
  "catppuccin",
  "simplex",
  "foss",

  // ? Vocabulario técnico que el copy español deja en inglés a propósito
  "autosave",
  "backend",
  "base",
  "checkout",
  "commits",
  "core",
  "demo",
  "durable",
  "editor",
  "first",
  "free",
  "frameworks",
  "harness",
  "hardening",
  "mobile",
  "modal",
  "objects",
  "open",
  "safe",
  "sandbox",
  "sandboxing",
  "shell",
  "software",
  "source",
  "stack",
  "suite",
  "terminal",
  "tests",
  "tier",
  "toolchain",
  "type",
  "awesome",

  // ? Palabras que el español y el inglés escriben igual: coinciden por vocabulario
  // ? común, no por un texto sin traducir
  "chocolate",
  "color",
  "hotel",
  "internet",
  "local",
  "logo",
  "mamey",
  "original",
  "personal",
  "real",
]);

// ? La banda de longitud solo se mide sobre textos con cuerpo: en un rótulo corto la
// ? longitud depende de la concisión del rótulo, no de la traducción.
const MINIMO_LONGITUD = 20;
// ? Razón de longitud admitida entre el texto inglés y el español
const BANDA = { min: 0.6, max: 2.0 };

type Nivel = "markup" | "longitud" | "palabras";
type Hallazgo = { nivel: Nivel; detalle: string };

// ? Descompone un fragmento de markup en las etiquetas que contiene y su texto plano.
// ? Los elementos con `id` se ignoran: son marcadores que `main.ts` rellena en runtime
// ? (el año del copyright) y no tienen por qué tener equivalente en la traducción.
function analizar(markup: string): { etiquetas: string[]; texto: string } {
  const div = document.createElement("div");

  div.innerHTML = markup;

  return {
    etiquetas: [...div.querySelectorAll("*")]
      .filter((elemento) => !elemento.hasAttribute("id"))
      .map((elemento) => elemento.tagName.toLowerCase()),
    texto: (div.textContent ?? "").replace(/\s+/g, " ").trim(),
  };
}

// ? Palabras de cuatro letras o más, solo letras y en minúsculas
function palabras(texto: string): string[] {
  return texto
    .toLowerCase()
    .split(/[^a-záéíóúüñ]+/)
    .filter((palabra) => palabra.length >= 4);
}

// ! El chequeo puro: recibe el markup de los dos idiomas y devuelve los drifts que
// ! encuentra. Sin DOM de por medio más allá del parser, sin estado y sin efectos.
export function detectarDrift(es: string, en: string): Hallazgo[] {
  const hallazgos: Hallazgo[] = [];
  const izquierdo = analizar(es);
  const derecho = analizar(en);

  // ? Nivel 1: la misma secuencia de etiquetas, en el mismo orden
  if (izquierdo.etiquetas.join(",") !== derecho.etiquetas.join(",")) {
    hallazgos.push({
      nivel: "markup",
      detalle: `español [${izquierdo.etiquetas.join(",")}] ≠ inglés [${derecho.etiquetas.join(",")}]`,
    });
  }

  // ? Nivel 2: el inglés dentro de la banda de longitud del español
  if (izquierdo.texto.length >= MINIMO_LONGITUD) {
    const razon = derecho.texto.length / izquierdo.texto.length;

    if (razon < BANDA.min || razon > BANDA.max) {
      hallazgos.push({
        nivel: "longitud",
        detalle: `inglés ${derecho.texto.length} contra español ${izquierdo.texto.length} (razón ${razon.toFixed(2)})`,
      });
    }
  }

  // ? Nivel 3: ninguna palabra significativa en los dos idiomas, salvo la lista blanca
  const palabrasEn = new Set(palabras(derecho.texto));

  for (const palabra of new Set(palabras(izquierdo.texto))) {
    if (palabrasEn.has(palabra) && !LISTA_BLANCA.has(palabra)) {
      hallazgos.push({ nivel: "palabras", detalle: `"${palabra}" está en los dos idiomas` });
    }
  }

  return hallazgos;
}

type Unidad = { etiqueta: string; es: string; en: string };

// ? Un nodo traducible puede ser una imagen: en ese caso lo que se traduce es el
// ? `alt`, no su contenido.
function fuenteEspanol(nodo: Element): string {
  return nodo.tagName === "IMG" ? (nodo.getAttribute("alt") ?? "") : nodo.innerHTML;
}

// ? Una frase puede estar repartida en varios nodos traducibles (para poder poner un
// ? `<code>` en medio). Esos fragmentos se comparan unidos: compararlos por separado
// ? daría ratios de longitud sin sentido.
function unidadesTraducibles(): Unidad[] {
  const nodos = [...document.querySelectorAll("[data-i18n-en]")].filter(
    (nodo) => nodo.tagName !== "META",
  );
  const grupos = new Map<Element, Element[]>();

  for (const nodo of nodos) {
    const clave = nodo.tagName === "IMG" ? nodo : (nodo.parentElement ?? nodo);
    const grupo = grupos.get(clave);

    if (grupo) grupo.push(nodo);
    else grupos.set(clave, [nodo]);
  }

  return [...grupos.entries()].map(([padre, grupo]) => ({
    etiqueta:
      padre.tagName === "IMG"
        ? "IMG"
        : `${padre.tagName.toLowerCase()}${padre.id ? `#${padre.id}` : ""}${
            padre.className ? `.${padre.className}` : ""
          }`,
    es: grupo.map(fuenteEspanol).join(" "),
    en: grupo.map((nodo) => nodo.getAttribute("data-i18n-en") ?? "").join(" "),
  }));
}

describe("drift i18n (T28, S4)", () => {
  it("ninguna unidad traducible tiene drift entre los dos idiomas", () => {
    const unidades = unidadesTraducibles();

    expect(unidades.length).toBeGreaterThan(40);

    for (const unidad of unidades) {
      const hallazgos = detectarDrift(unidad.es, unidad.en);

      expect(
        hallazgos.map((h) => `${h.nivel}: ${h.detalle}`),
        `drift en ${unidad.etiqueta}`,
      ).toEqual([]);
    }
  });

  it("el snapshot guarda los pares de español e inglés", () => {
    // ? El snapshot es el único nivel que ve el texto viejo de los dos lados: si el
    // ? autor cambia un solo idioma, el diff muestra el español viejo junto al inglés
    // ? viejo y hay que revisar el par.
    const pares = [...document.querySelectorAll("[data-i18n-en]")]
      .filter((nodo) => nodo.tagName !== "META")
      .map((nodo) => {
        const es = analizar(fuenteEspanol(nodo)).texto;
        const en = analizar(nodo.getAttribute("data-i18n-en") ?? "").texto;

        return `${es} :: ${en}`;
      });

    expect(pares.join("\n")).toMatchSnapshot();
  });

  it("el detector atrapa un par desfasado: español reescrito, inglés viejo", () => {
    // ? El caso real de L14: el autor reescribió el español a mano y el `data-i18n-en`
    // ? se quedó con la versión anterior, mucho más corta.
    const es =
      "El hotel recibe reservas en línea y el operador ve el estado de cada una en el panel; los pagos pasan por Stripe.";
    const en = "Booking system for the hotel: payments go through Stripe.";

    const hallazgos = detectarDrift(es, en);

    expect(hallazgos.length).toBeGreaterThan(0);
    expect(hallazgos.map((h) => h.nivel)).toContain("longitud");
  });

  it("el detector ve el markup desalineado entre los dos idiomas", () => {
    const es = "Un sitio con <strong>negrita</strong> y <code>código</code>.";
    const en = "A site with <code>code</code> and <strong>bold</strong>.";

    const hallazgos = detectarDrift(es, en);

    expect(hallazgos.map((h) => h.nivel)).toContain("markup");
  });

  it("el detector ve la palabra sin traducir que no está en la lista blanca", () => {
    const es = "El hotel recibe reservas en línea y el operador mira el dashboard cada mañana.";
    const en =
      "The hotel takes bookings online and the operator checks the dashboard every morning.";

    const hallazgos = detectarDrift(es, en);

    expect(hallazgos.map((h) => h.nivel)).toContain("palabras");
    expect(hallazgos.some((h) => h.detalle.includes("dashboard"))).toBe(true);
  });
});
