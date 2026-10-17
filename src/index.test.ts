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

    expect(secciones.at(-1)).toBe("yo");
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

  it("los sistemas en producción enlazan su sitio en vivo y su código", () => {
    for (const url of ["https://hotelcasanoria.com.mx", "https://tranxfers.com.mx"]) {
      const tarjeta = [...document.querySelectorAll(".project-card")].find((c) =>
        c.querySelector(`a[href="${url}"]`),
      );

      expect(tarjeta, `ninguna tarjeta enlaza ${url}`).toBeDefined();
      expect(tarjeta?.querySelector("a[href*='github.com']")).not.toBeNull();
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
