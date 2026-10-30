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
      expect(proyecto.descripcion.es.length).toBeGreaterThan(0);
      expect(proyecto.descripcion.en.length).toBeGreaterThan(0);
      expect(proyecto.escala.es.length).toBeGreaterThan(0);
      expect(proyecto.escala.en.length).toBeGreaterThan(0);
      expect(proyecto.notas.length).toBeGreaterThan(0);
      expect(proyecto.stack.length).toBeGreaterThan(0);
      expect(proyecto.url).toMatch(/^https:\/\//);
      expect(proyecto.captura).toMatch(/^\/images\/proyectos\//);
    }
  });

  it("el rol y la etiqueta son los de la tarjeta, en los dos idiomas", () => {
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
    }
  });

  it("la escala y el stack de la ficha son los que nombra la tarjeta", () => {
    const documentoEs = cargar(es);
    const documentoEn = cargar(en);

    for (const proyecto of proyectos) {
      const hechosEs = plano(
        [...tarjetaDe(proyecto, documentoEs).querySelectorAll(".project-facts li")]
          .map((li) => li.textContent)
          .join(" "),
      );
      const hechosEn = plano(
        [...tarjetaDe(proyecto, documentoEn).querySelectorAll(".project-facts li")]
          .map((li) => li.textContent)
          .join(" "),
      );

      // ? La tarjeta junta la escala y el stack en una línea; la ficha los separa.
      // ? Lo que tiene que coincidir es el contenido, no la frase.
      expect(hechosEs).toContain(proyecto.escala.es);
      expect(hechosEn).toContain(proyecto.escala.en);

      // ? El stack se comprueba contra la tarjeta en español: la versión en inglés
      // ? del autor es más corta y no nombra todas las tecnologías.
      for (const tecnologia of proyecto.stack) {
        expect(hechosEs).toContain(tecnologia);
      }
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

  it("la ficha tiene su propia vuelta al inicio, con el icono de casa", () => {
    const documentoEs = cargar(paginaProyecto(es, proyectos[0], "es"));
    const volver = documentoEs.querySelector("#proyecto .volver");

    expect(volver?.getAttribute("href")).toBe("/");
    expect(volver?.querySelector("svg.solar-home-linear")).not.toBeNull();
    expect(plano(volver?.textContent)).toBe("Volver al inicio");

    const documentoEn = cargar(paginaProyecto(en, proyectos[0], "en"));
    const volverEn = documentoEn.querySelector("#proyecto .volver");

    expect(volverEn?.getAttribute("href")).toBe("/en/");
    expect(plano(volverEn?.textContent)).toBe("Back home");
  });

  it("el stack va una sola vez: la ficha no repite la lista de la tarjeta", () => {
    for (const proyecto of proyectos) {
      const documento = cargar(paginaProyecto(es, proyecto, "es"));

      // ? No hay un bloque con su propio encabezado: el stack vive en la línea de
      // ? evidencia, junto al estado y la escala.
      expect(documento.querySelector("#proyecto h3")).toBeNull();
      expect(documento.querySelectorAll("#proyecto .proyecto-stack")).toHaveLength(1);
      expect(plano(documento.querySelector("#proyecto .proyecto-stack")?.textContent)).toBe(
        proyecto.stack.join(" · "),
      );
    }
  });

  it("los enlaces de la ficha llevan su icono, como los de las tarjetas", () => {
    for (const proyecto of proyectos) {
      const documento = cargar(paginaProyecto(es, proyecto, "es"));
      const enlaces = [...documento.querySelectorAll("#proyecto .project-links a")];

      expect(enlaces.length).toBeGreaterThan(0);

      for (const enlace of enlaces) {
        expect(enlace.querySelector("svg[class^='solar solar-']")).not.toBeNull();
      }
    }
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
    expect(plano(documentoEs.querySelector("#proyecto .proyecto-lead")?.textContent)).toBe(
      proyecto.descripcion.es,
    );

    const documentoEn = cargar(paginaProyecto(en, proyecto, "en"));
    expect(plano(documentoEn.querySelector("#proyecto .proyecto-lead")?.textContent)).toBe(
      proyecto.descripcion.en,
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

      // ? Sin contenido no hay bloque: ni el problema ni las métricas se inventan.
      expect(documento.querySelectorAll("#proyecto .proyecto-subtitulo")).toHaveLength(0);
      expect(documento.querySelectorAll("#proyecto .proyecto-metricas")).toHaveLength(0);
      expect(plano(documento.querySelector("#proyecto")?.textContent)).not.toContain("El problema");
      expect(plano(documento.querySelector("#proyecto")?.textContent)).not.toContain("Métricas");
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
