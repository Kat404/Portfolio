import { readdirSync } from "node:fs";
import { Window } from "happy-dom";
import { describe, expect, it } from "vite-plus/test";
import html from "../index.html?raw";
import { SITIO, variantes } from "./i18n-variants.ts";
import { enlacesDeCaso, paginaProyecto, rutaProyecto } from "./proyecto-pagina.ts";
import { proyectos } from "./proyectos.ts";

// ! T10 (S12): las páginas de detalle de los proyectos.
// ! Los datos de `src/proyectos.ts` tienen que decir lo mismo que las tarjetas del
// ! `index.html`, y la página derivada tiene queservir el caso con su propia URL.

const { es, en } = variantes(html);

// ? Cada documento se carga en una ventana propia, como lo haría el navegador.
function cargar(markup: string) {
  const ventana = new Window();
  const documento = ventana.document;

  documento.documentElement.innerHTML = markup;

  return documento;
}

// ? El documento de happy-dom: su tipo no es el `Document` del DOM de TypeScript.
type Documento = ReturnType<typeof cargar>;

// ? El texto de un nodo, sin el salto de línea del markup.
const plano = (texto: string | null | undefined) => (texto ?? "").replace(/\s+/g, " ").trim();

function tarjetaDe(proyecto: (typeof proyectos)[number], documento: Documento) {
  const tarjeta = [...documento.querySelectorAll("#proyectos .project-card")].find(
    (otra) => plano(otra.querySelector(".project-title")?.textContent) === proyecto.titulo,
  );

  expect(tarjeta, `no hay tarjeta para ${proyecto.titulo}`).toBeDefined();

  return tarjeta!;
}

describe("datos de los proyectos (T10, S12)", () => {
  it("son los cuatro proyectos de las tarjetas, con sus datos completos", () => {
    expect(proyectos.map((p) => p.slug)).toEqual([
      "casa-noria",
      "tranxfers",
      "talleragentes",
      "opensim",
    ]);

    for (const proyecto of proyectos) {
      expect(proyecto.titulo.length).toBeGreaterThan(0);
      expect(proyecto.rol.es.length).toBeGreaterThan(0);
      expect(proyecto.rol.en.length).toBeGreaterThan(0);
      expect(proyecto.etiqueta.es.length).toBeGreaterThan(0);
      expect(proyecto.etiqueta.en.length).toBeGreaterThan(0);
      expect(proyecto.hechos.length).toBeGreaterThan(0);
      expect(proyecto.stack.length).toBeGreaterThan(0);
      expect(proyecto.url).toMatch(/^https:\/\//);
      expect(proyecto.captura).toMatch(/^\/images\/proyectos\//);
    }
  });

  it("el rol, la etiqueta y los hechos son los de la tarjeta, en los dos idiomas", () => {
    const documentoEs = cargar(es);
    const documentoEn = cargar(en);

    for (const proyecto of proyectos) {
      const tarjetaEs = tarjetaDe(proyecto, documentoEs);
      const tarjetaEn = tarjetaDe(proyecto, documentoEn);

      expect(plano(tarjetaEs.querySelector(".project-role")?.textContent)).toBe(proyecto.rol.es);
      expect(plano(tarjetaEn.querySelector(".project-role")?.textContent)).toBe(proyecto.rol.en);

      const hechosEs = [...tarjetaEs.querySelectorAll(".project-facts li")];
      const hechosEn = [...tarjetaEn.querySelectorAll(".project-facts li")];

      // ? El primer hecho de la tarjeta es la etiqueta; los demás son los hechos.
      expect(plano(hechosEs[0]?.textContent)).toBe(proyecto.etiqueta.es);
      expect(plano(hechosEn[0]?.textContent)).toBe(proyecto.etiqueta.en);

      expect(hechosEs.slice(1).map((li) => plano(li.innerHTML))).toEqual(
        proyecto.hechos.map((hecho) => hecho.es),
      );
      expect(hechosEn.slice(1).map((li) => plano(li.innerHTML))).toEqual(
        proyecto.hechos.map((hecho) => hecho.en),
      );
    }
  });

  it("los enlaces son los de la tarjeta, y el código solo si el repositorio es público", () => {
    const documento = cargar(es);

    for (const proyecto of proyectos) {
      const tarjeta = tarjetaDe(proyecto, documento);
      const enlaces = [...tarjeta.querySelectorAll("a[href^='https://']")].map((a) =>
        a.getAttribute("href"),
      );

      expect(enlaces).toContain(proyecto.url);

      const codigo = enlaces.filter((href) => href?.includes("github.com"));

      // ? Casa Noria, Tranxfers y TallerAgentes son repos privados: enlazarlos sería
      // ? un 404 para cualquier visitante.
      if (proyecto.repo) expect(codigo).toEqual([proyecto.repo]);
      else expect(codigo).toEqual([]);
    }
  });

  it("el slug de cada proyecto es el nombre de su captura", () => {
    const capturas = readdirSync("public/images/proyectos");

    for (const proyecto of proyectos) {
      expect(capturas).toContain(`${proyecto.slug}.webp`);
      expect(proyecto.captura).toBe(`/images/proyectos/${proyecto.slug}.webp`);
    }
  });

  it("el problema y las métricas siguen vacíos: no se inventan", () => {
    // ? Los escribe el autor. Mientras estén vacíos, la página no los muestra.
    for (const proyecto of proyectos) {
      expect(proyecto.problema).toBeNull();
      expect(proyecto.metricas).toEqual([]);
    }
  });
});

describe("página de detalle (T10, S12)", () => {
  it("tiene canonical propio y hreflang recíprocos, en los dos idiomas", () => {
    for (const proyecto of proyectos) {
      for (const idioma of ["es", "en"] as const) {
        const documento = cargar(paginaProyecto(idioma === "es" ? es : en, proyecto, idioma));

        expect(documento.documentElement.lang).toBe(idioma);
        expect(documento.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
          SITIO + rutaProyecto(proyecto, idioma),
        );
        expect(documento.querySelector('meta[property="og:url"]')?.getAttribute("content")).toBe(
          SITIO + rutaProyecto(proyecto, idioma),
        );

        const alternates = [...documento.querySelectorAll('link[rel="alternate"][hreflang]')].map(
          (link) => [link.getAttribute("hreflang"), link.getAttribute("href")],
        );

        expect(alternates).toEqual([
          ["es", SITIO + rutaProyecto(proyecto, "es")],
          ["en", SITIO + rutaProyecto(proyecto, "en")],
          ["x-default", SITIO + rutaProyecto(proyecto, "es")],
        ]);
      }
    }
  });

  it("el nav usa enlaces absolutos: sus anclas no existen en la página del proyecto", () => {
    const documentoEs = cargar(paginaProyecto(es, proyectos[0], "es"));
    const documentoEn = cargar(paginaProyecto(en, proyectos[0], "en"));

    expect(
      [...documentoEs.querySelectorAll("#indice a")].map((a) => a.getAttribute("href")),
    ).toEqual(["/#proyectos", "/#stack", "/#entorno", "/#sobre-mi"]);
    expect(
      [...documentoEn.querySelectorAll("#indice a")].map((a) => a.getAttribute("href")),
    ).toEqual(["/en/#proyectos", "/en/#stack", "/en/#entorno", "/en/#sobre-mi"]);
  });

  it("el selector de idioma lleva a la página equivalente del otro idioma", () => {
    for (const proyecto of proyectos) {
      const documentoEs = cargar(paginaProyecto(es, proyecto, "es"));
      const enlacesEs = [...documentoEs.querySelectorAll("#selector-idioma a.idioma-btn")];

      expect(enlacesEs.map((a) => a.getAttribute("href"))).toEqual([
        rutaProyecto(proyecto, "es"),
        rutaProyecto(proyecto, "en"),
      ]);
      expect(enlacesEs[0].classList.contains("is-active")).toBe(true);

      const documentoEn = cargar(paginaProyecto(en, proyecto, "en"));
      const enlacesEn = [...documentoEn.querySelectorAll("#selector-idioma a.idioma-btn")];

      expect(enlacesEn.map((a) => a.getAttribute("href"))).toEqual([
        rutaProyecto(proyecto, "es"),
        rutaProyecto(proyecto, "en"),
      ]);
      expect(enlacesEn[1].classList.contains("is-active")).toBe(true);
    }
  });

  it("el caso se sirve en el idioma de la variante, con el copy de la tarjeta", () => {
    const proyecto = proyectos[3];

    const documentoEs = cargar(paginaProyecto(es, proyecto, "es"));
    expect(documentoEs.querySelector("#proyecto h2")?.textContent).toBe("OpenSIM");
    expect(plano(documentoEs.querySelector("#proyecto .project-role")?.textContent)).toBe(
      proyecto.rol.es,
    );

    const documentoEn = cargar(paginaProyecto(en, proyecto, "en"));
    expect(plano(documentoEn.querySelector("#proyecto .project-role")?.textContent)).toBe(
      proyecto.rol.en,
    );
    // ? El `alt` de la captura es el de la tarjeta: sale de ella, no se reescribe.
    const tarjetaEn = tarjetaDe(proyecto, cargar(en));

    expect(plano(documentoEn.querySelector("#proyecto img")?.getAttribute("alt"))).toBe(
      plano(tarjetaEn.querySelector("img")?.getAttribute("alt")),
    );
  });

  it("la página enlaza el sitio en vivo y el código solo si el repositorio es público", () => {
    for (const proyecto of proyectos) {
      const documento = cargar(paginaProyecto(es, proyecto, "es"));
      const enlaces = [...documento.querySelectorAll("#proyecto .project-links a")].map((a) =>
        a.getAttribute("href"),
      );

      expect(enlaces).toContain(proyecto.url);

      if (proyecto.repo) expect(enlaces).toContain(proyecto.repo);
      else expect(enlaces.some((href) => href?.includes("github.com"))).toBe(false);
    }
  });

  it("mientras el problema y las métricas estén vacíos, la página no los muestra", () => {
    for (const proyecto of proyectos) {
      const documento = cargar(paginaProyecto(es, proyecto, "es"));

      // ? Solo el heading del stack: los otros dos bloques no se inventan.
      expect(documento.querySelectorAll("#proyecto h3")).toHaveLength(1);
      expect(plano(documento.querySelector("#proyecto h3")?.textContent)).toBe("Stack");
    }
  });
});

describe("tarjetas y enlaces al caso (T10, S12)", () => {
  it("cada tarjeta enlaza su página con su propio texto", () => {
    // ? El atributo de traducción solo vive en el `index.html`: las variantes ya lo
    // ? aplicaron.
    const documento = cargar(html);

    for (const proyecto of proyectos) {
      const tarjeta = tarjetaDe(proyecto, documento);
      const enlace = tarjeta.querySelector(`a[href="${rutaProyecto(proyecto, "es")}"]`);

      expect(enlace, `${proyecto.titulo} no enlaza su página`).not.toBeNull();
      expect(plano(enlace?.textContent)).toBe("Ver más detalles");
      // ? La traducción va en el `span` del texto, no en el enlace: el icono del
      // ? enlace es un hijo más y se quedaría sin él si el atributo estuviera arriba.
      expect(enlace?.querySelector("[data-i18n-en]")?.getAttribute("data-i18n-en")).toBe(
        "See more details",
      );
    }
  });

  it("en la variante inglesa el enlace lleva a la página inglesa del proyecto", () => {
    const documento = cargar(enlacesDeCaso(en, "en"));

    for (const proyecto of proyectos) {
      expect(
        documento.querySelector(`a[href="${rutaProyecto(proyecto, "en")}"]`),
        `${proyecto.titulo} no enlaza su página inglesa`,
      ).not.toBeNull();
    }
  });
});
