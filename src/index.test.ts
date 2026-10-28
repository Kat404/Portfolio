import { describe, expect, it } from "vite-plus/test";
import html from "../index.html?raw";

// ! Contrato de la sección de proyectos (S2) y del copy (S4) sobre el index.html real.
// ! Se parsea el archivo tal cual se sirve: estos tests fijan contenido y markup, no el
// ! comportamiento de `main.ts` (que ya cubre `main.test.ts`).

document.documentElement.innerHTML = html;

describe("oferta y honestidad del copy (T12, S1)", () => {
  it("la página dice qué hace antes de hablar de su vida", () => {
    const secciones = [...document.querySelectorAll("main > section")].map((s) => s.id);

    expect(secciones.indexOf("servicios")).toBe(0);
    expect(secciones.indexOf("servicios")).toBeLessThan(secciones.indexOf("mi-vida"));
    expect(secciones.indexOf("mis-proyectos")).toBeLessThan(secciones.indexOf("curiosidades"));
  });

  it("cada elemento traducible tiene inglés, y el español no sobrevive en inglés", () => {
    const traducibles = [...document.querySelectorAll("[data-i18n-en]")];

    expect(traducibles.length).toBeGreaterThan(40);

    // ? Palabras que delatan una traducción no hecha. Los nombres propios de proyecto,
    // ? las technologies y las cifras son iguales en ambos idiomas: no se comprueban.
    const SOLO_ESPANOL =
      /\b(de|del|que|para|con|una|uno|unos|las|los|sitio|sitios|cobrar|producción|ingresos|plataforma|docente|rediseño|abierto|código|páginas|sección|sobre|mío|mía|esto|hago|construyo|trabajo|escribeme|vive|vivo|donde|también|como|pero|desde|hasta|ya|tengo|quiero|sabes|puedes)\b/i;

    for (const nodo of traducibles) {
      const en = nodo.getAttribute("data-i18n-en")!.trim();

      expect(en.length, `${nodo.tagName} sin traducción`).toBeGreaterThan(0);
      expect(SOLO_ESPANOL.test(en), `queda español en: "${en}"`).toBe(false);
    }
  });

  it("ningún nodo traducible por contenido es un contenedor con hijos", () => {
    // ? Es lo que rompió la primera versión: sustituir el contenido de un <nav>
    // ? traducible borraba los enlaces del índice
    for (const nodo of document.querySelectorAll("[data-i18n-en]")) {
      const tieneHijosUtiles = [...nodo.children].some(
        (hijo) => !["STRONG", "EM", "CODE", "SPAN"].includes(hijo.tagName),
      );
      expect(tieneHijosUtiles, `${nodo.tagName} traducible con hijos reales`).toBe(false);
    }
  });

  it("los metadatos y el hreflang no prometen un /en que no existe", () => {
    for (const meta of document.querySelectorAll("meta[data-i18n-en]")) {
      expect(meta.getAttribute("data-i18n-en")!.trim().length).toBeGreaterThan(10);
    }

    const hreflang = [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) =>
      l.getAttribute("hreflang"),
    );
    // ? Debe existir el alterno en inglés porque la traducción ya está en el documento
    expect(hreflang).toContain("en");
    expect(hreflang).toContain("x-default");
  });

  it("el selector de idioma ofrece ES y EN, con ES activo", () => {
    const botones = document.querySelectorAll("#selector-idioma .idioma-btn");

    expect(botones).toHaveLength(2);
    expect([...botones].map((b) => b.getAttribute("data-lang"))).toEqual(["es", "en"]);
    expect(botones[0].classList.contains("is-active")).toBe(true);
    expect(botones[0].getAttribute("aria-current")).toBe("true");
    expect(botones[1].getAttribute("aria-current")).toBe("false");
  });

  it("la sección de lo personal es la última y va tras un divisor", () => {
    const secciones = [...document.querySelectorAll("main > section")].map((s) => s.id);

    // ? El autor reordenó la página en L13: lo personal cierra el documento y el
    // ? divisor sigue separando la parte de trabajo de la parte personal.
    expect(secciones.at(-1)).toBe("mi-vida");
    expect(document.querySelectorAll("main > .divisor")).toHaveLength(1);
  });

  it("cada enlace del índice apunta a una sección que existe", () => {
    const secciones = new Set(
      [...document.querySelectorAll("main > section")]
        .map((s) => s.id)
        .concat(["aficiones", "mis-gustos"]),
    );

    for (const enlace of document.querySelectorAll('#indice a[href^="#"]')) {
      const destino = enlace.getAttribute("href")!.slice(1);
      expect(secciones.has(destino), `#${destino} no existe`).toBe(true);
    }
  });

  it("el copy no promete ni se disculpa por su nivel", () => {
    for (const frase of [
      "Aprendizaje Temprano",
      "me quiero enfocar",
      "con ganas de maximizar",
      "futuros proyectos",
    ]) {
      expect(html).not.toContain(frase);
    }
  });

  it("cada sección tiene título", () => {
    for (const seccion of document.querySelectorAll("main > section")) {
      expect(seccion.querySelector("h2")?.textContent?.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("capturas de proyecto (S3)", () => {
  it("toda imagen del documento lleva dimensiones, carga diferida y texto alternativo", () => {
    const imagenes = document.querySelectorAll("main img");

    expect(imagenes.length).toBeGreaterThan(0);
    for (const imagen of imagenes) {
      expect(imagen.getAttribute("loading")).toBe("lazy");
      expect(Number(imagen.getAttribute("width"))).toBeGreaterThan(0);
      expect(Number(imagen.getAttribute("height"))).toBeGreaterThan(0);
      expect(imagen.getAttribute("alt")?.trim().length).toBeGreaterThan(10);
      expect(imagen.getAttribute("src")).toMatch(/\.webp$/);
    }
  });
});

describe("proyectos destacados (S2)", () => {
  it("cada tarjeta declara su rol y sus enlaces", () => {
    const tarjetas = document.querySelectorAll("#mis-proyectos .project-card");

    expect(tarjetas.length).toBeGreaterThan(0);
    for (const tarjeta of tarjetas) {
      expect(tarjeta.querySelector(".project-role")?.textContent?.trim()).toBeTruthy();
      expect(tarjeta.querySelectorAll("a[href^='https://']").length).toBeGreaterThan(0);
    }
  });

  it("los sistemas en producción enlazan su sitio en vivo", () => {
    for (const url of ["https://hotelcasanoria.com.mx", "https://tranxfers.com.mx"]) {
      const tarjeta = [...document.querySelectorAll(".project-card")].find((c) =>
        c.querySelector(`a[href="${url}"]`),
      );

      expect(tarjeta, `ninguna tarjeta enlaza ${url}`).toBeDefined();
    }
  });

  it("nadie enlaza el código de un repositorio privado: sería un 404", () => {
    // ? Casa Noria y Tranxfers son repos privados. Enlazar su código no filtra nada
    // ? (el auth de GitHub manda) pero deja un enlace roto en la tarjeta.
    for (const privado of ["Hotel-Casa-Noria", "Tranxfers"]) {
      const tarjeta = [...document.querySelectorAll(".project-card")].find((c) =>
        c.querySelector(`a[href*="${privado}"]`),
      );

      expect(tarjeta, `ninguna tarjeta enlaza ${privado}`).toBeUndefined();
    }
  });

  it("OpenSIM sí enlaza su repositorio, que es público", () => {
    const tarjeta = [...document.querySelectorAll(".project-card")].find((c) =>
      c.querySelector('a[href="https://opensim.jose-luis-rs.workers.dev"]'),
    );

    expect(tarjeta?.querySelector("a[href*='github.com/Kat404/OpenSIM']")).not.toBeNull();
  });
});

describe("stack declarado y toolchain (S5)", () => {
  it("no menciona OpenSpec: el ciclo de desarrollo ya no es ese", () => {
    expect(html).not.toContain("OpenSpec");
    expect(html).not.toContain("openspec");
  });

  it("declara el E2E real, el de agentes de IA", () => {
    // ? El enlace al repo de tester-army/e2e salió del Stack por decisión del autor:
    // ? el contrato queda en la mención del E2E, no en la URL.
    const tarjetas = [...document.querySelectorAll(".project-card")].map(
      (c) => c.textContent ?? "",
    );

    expect(tarjetas.some((t) => t.includes("E2E") && t.includes("agentes de IA"))).toBe(true);
  });

  it("declara Vite+ y pnpm como toolchain y package manager", () => {
    expect(html).toContain("Vite+");
    expect(html).toContain("pnpm");
  });

  it("la tarjeta de OpenSIM declara SvelteKit y sus módulos reales", () => {
    const tarjeta = [...document.querySelectorAll(".project-card")].find(
      (c) => c.querySelector(".project-title")?.textContent?.trim() === "OpenSIM",
    );
    const texto = tarjeta?.textContent ?? "";

    expect(texto).toContain("SvelteKit");
    for (const modulo of [
      "horario",
      "retícula",
      "kardex",
      "reinscripción",
      "trámites",
      "temario",
    ]) {
      expect(texto.toLowerCase(), `falta el módulo ${modulo}`).toContain(modulo);
    }
  });
});

describe("iconografía (T17)", () => {
  it("todos los iconos son Solar Icons en línea y ninguno es de Lucide", () => {
    expect(html).not.toContain("lucide");

    const iconos = [...document.querySelectorAll("svg")];
    expect(iconos.length).toBeGreaterThan(0);
    for (const icono of iconos) {
      expect(icono.getAttribute("class")).toMatch(/^solar solar-[a-z0-9-]+-linear$/);
      expect(icono.getAttribute("aria-hidden")).toBe("true");
      expect(icono.getAttribute("stroke")).toBe("currentColor");
    }
  });
});

describe("accesibilidad y peso (T8)", () => {
  it("el nombre accesible de cada enlace contiene su texto visible", () => {
    // ? WCAG 2.5.3: el texto visible tiene que estar dentro del nombre accesible.
    for (const enlace of document.querySelectorAll("a[aria-label]")) {
      const visible = (enlace.textContent ?? "").trim();
      const nombre = (enlace.getAttribute("aria-label") ?? "").trim();

      // ? Un enlace solo con icono no tiene etiqueta visible: la regla no aplica.
      if (visible.length === 0) continue;

      expect(nombre.toLowerCase(), `aria-label de "${visible}"`).toContain(visible.toLowerCase());
    }
  });
});

describe("copy sin autodescalamiento (S4)", () => {
  it("no declara intenciones ni iosidad de proyecto improvisado", () => {
    for (const frase of [
      "Primer proyecto real en un ámbito formal",
      "me encanta el hecho de poder modular",
      "me gusta la idea de poner implementar",
    ]) {
      expect(html).not.toContain(frase);
    }
  });
});

describe("metadatos del documento (T11)", () => {
  const contenido = (selector: string) =>
    document.querySelector(selector)?.getAttribute("content") ?? "";

  it("ningún metadato anuncia perfil junior ni aprendizaje temprano", () => {
    const metadatos = [
      document.title,
      contenido('meta[name="description"]'),
      contenido('meta[property="og:title"]'),
      contenido('meta[property="og:description"]'),
      contenido('meta[name="twitter:title"]'),
      contenido('meta[name="twitter:description"]'),
    ];

    for (const valor of metadatos) {
      expect(valor).not.toMatch(/\bJR\b|estudiante|interés temprano/i);
    }
  });

  it("las descripciones de Open Graph y Twitter coinciden con la del documento", () => {
    const descripcion = contenido('meta[name="description"]');

    expect(descripcion.length).toBeGreaterThan(0);
    expect(contenido('meta[property="og:description"]')).toBe(descripcion);
    expect(contenido('meta[name="twitter:description"]')).toBe(descripcion);
  });
});
