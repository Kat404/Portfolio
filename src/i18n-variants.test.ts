import { Window } from "happy-dom";
import { describe, expect, it } from "vite-plus/test";
import html from "../index.html?raw";
import { variantes } from "./i18n-variants.ts";

// ! T27 (S11): las dos páginas del sitio salen del mismo `index.html`.
// ! El español vive en el markup y el inglés en los atributos `data-i18n-en`; el
// ! build aplica el inglés y reparte el resultado en `/` y `/en/`.

const { es, en } = variantes(html);

// ? Cada variante se carga en una ventana propia para poder consultarla como lo
// ? haría el navegador. Una ventana por variante: reutilizar el documento global
// ? dejaría los atributos de `<html>` de la variante anterior pegados.
function cargar(markup: string) {
  const ventana = new Window();
  const documento = ventana.document;

  documento.documentElement.innerHTML = markup;

  return documento;
}

describe("variante española (S11)", () => {
  it("no deja ningún atributo de traducción en el DOM", () => {
    // ? El inglés ya no viaja en la página española: pesa lo que pesa y no confunde
    // ? a nadie que la lea.
    const doc = cargar(es);

    expect(doc.querySelectorAll("[data-i18n-en]")).toHaveLength(0);
    expect(doc.querySelectorAll("[data-i18n-en-aria]")).toHaveLength(0);
    expect(es).not.toContain("data-i18n-en");
  });

  it("conserva el texto en español", () => {
    const doc = cargar(es);

    expect(doc.documentElement.lang).toBe("es");
    expect(doc.title).toBe("José Luis Ramírez Sánchez — Desarrollador web y de sistemas");
    expect(doc.querySelector("#proyectos h2")?.textContent?.trim()).toBe("Mis Proyectos");
    expect(doc.querySelector("footer .copyright")?.textContent).toContain(
      "Todos los derechos reservados",
    );
  });

  it("anuncia su canonical y sus alternates recíprocos", () => {
    const doc = cargar(es);

    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      "https://portfolio.jose-luis-rs.workers.dev/",
    );

    const alternates = [...doc.querySelectorAll('link[rel="alternate"][hreflang]')].map((link) => [
      link.getAttribute("hreflang"),
      link.getAttribute("href"),
    ]);

    expect(alternates).toEqual([
      ["es", "https://portfolio.jose-luis-rs.workers.dev/"],
      ["en", "https://portfolio.jose-luis-rs.workers.dev/en/"],
      ["x-default", "https://portfolio.jose-luis-rs.workers.dev/"],
    ]);
  });
});

describe("variante inglesa (S11)", () => {
  it("es un documento en inglés, no una página en español con un atributo", () => {
    const doc = cargar(en);

    expect(doc.documentElement.lang).toBe("en");
    expect(doc.title).toBe("José Luis Ramírez Sánchez — Web and Systems Developer");
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toContain(
      "Two production websites earning revenue",
    );
    expect(doc.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe(
      "José Luis Ramírez Sánchez — Web and Systems Developer",
    );
    expect(doc.querySelector('meta[property="og:locale"]')?.getAttribute("content")).toBe("en_US");
  });

  it("anuncia su canonical y deja los hreflang recíprocos", () => {
    const doc = cargar(en);

    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      "https://portfolio.jose-luis-rs.workers.dev/en/",
    );
    expect(doc.querySelector('meta[property="og:url"]')?.getAttribute("content")).toBe(
      "https://portfolio.jose-luis-rs.workers.dev/en/",
    );

    const alternates = [...doc.querySelectorAll('link[rel="alternate"][hreflang]')].map((link) => [
      link.getAttribute("hreflang"),
      link.getAttribute("href"),
    ]);

    expect(alternates).toEqual([
      ["es", "https://portfolio.jose-luis-rs.workers.dev/"],
      ["en", "https://portfolio.jose-luis-rs.workers.dev/en/"],
      ["x-default", "https://portfolio.jose-luis-rs.workers.dev/"],
    ]);
  });

  it("el alt de la imagen está en inglés", () => {
    // ? El bug que destapó el test de drift: una imagen no tiene hijos, así que el
    // ? texto tiene que llegar al `alt`.
    const doc = cargar(en);
    const imagen = doc.querySelector("img.yo-shot")!;

    expect(imagen.getAttribute("alt")).toBe(
      "Arch Linux desktop on GNOME: the activities overview with the open windows, a terminal listing files, terminal-generated art and neofetch with the distribution logo",
    );
    expect(imagen.getAttribute("alt")).not.toContain("Escritorio");
  });

  it("el copy de las secciones está en inglés", () => {
    const doc = cargar(en);

    expect(doc.querySelector("#proyectos h2")?.textContent?.trim()).toBe("My Projects");
    expect(doc.querySelector("#servicios h2")?.textContent?.trim()).toBe("What I do");
    expect(doc.querySelector("#stack .descripcion")?.textContent).toContain(
      "Static where JavaScript is not needed",
    );
    expect(doc.querySelector("footer .copyright")?.textContent).toContain("All rights reserved");
  });

  it("el año del copyright sigue siendo un span vacío, no el año literal", () => {
    // ? Si la traducción llevara "© 2026", la página en inglés se quedaría vieja en
    // ? 2027: el año lo rellena el runtime en las dos variantes.
    const doc = cargar(en);
    const year = doc.querySelector("#copyright-year")!;

    expect(year.tagName).toBe("SPAN");
    expect(year.textContent).toBe("");
    expect(doc.querySelector("footer .copyright")?.textContent).not.toMatch(/\b20\d\d\b/);
  });

  it("el selector de idioma apunta a la otra variante", () => {
    const doc = cargar(en);
    const enlaces = [...doc.querySelectorAll("#selector-idioma a.idioma-btn")];

    expect(enlaces.map((e) => e.getAttribute("href"))).toEqual(["/", "/en/"]);
    expect(enlaces[1].classList.contains("is-active")).toBe(true);
    expect(enlaces[0].classList.contains("is-active")).toBe(false);
  });
});
