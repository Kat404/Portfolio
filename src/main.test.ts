import { describe, expect, it, vi } from "vite-plus/test";

// ! Pruebas de humo del entry de la app: fijan los comportamientos que entregaba Astro

const FIXTURE = `
  <header class="header-site"></header>
  <nav class="idioma">
    <button type="button" class="idioma-btn is-active" data-lang="es" aria-current="true">ES</button>
    <button type="button" class="idioma-btn" data-lang="en" aria-current="false">EN</button>
    <span class="idioma-nota" role="status" hidden>Todavía no hay versión en inglés.</span>
  </nav>
  <main>
    <section id="bienvenido" class="hidden"><p>hola</p></section>
    <aside id="mis-gustos" class="hidden"></aside>
    <h1 class="titulo-principal hidden-item"></h1>
  </main>
  <footer><p class="copyright">© <span id="copyright-year"></span></p></footer>
`;

let observed: Element[] = [];
let onIntersect: IntersectionObserverCallback;
let frames: FrameRequestCallback[] = [];

class FakeIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    onIntersect = callback;
  }
  observe(element: Element) {
    observed.push(element);
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// ! El módulo se registra una sola vez sobre el DOM del fixture: sus listeners
// ! viven en `window`, así que reimportarlo en cada test los acumularía.
window.requestAnimationFrame = (cb: FrameRequestCallback) => {
  frames.push(cb);
  return frames.length;
};
document.body.innerHTML = FIXTURE;
// ! `innerHTML` no toca los atributos de `<html>`: el lang real viene del documento
document.documentElement.lang = "es";
vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
await import("./main.ts");

function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  window.dispatchEvent(new Event("scroll"));
  frames.shift()?.(0);
}

describe("revelado al hacer scroll", () => {
  it("observa cada elemento .hidden y .hidden-item", () => {
    expect(observed).toHaveLength(3);
  });

  it("añade 'reveal' solo a los elementos que intersectan", () => {
    const section = document.querySelector("#bienvenido")!;
    const aside = document.querySelector("#mis-gustos")!;

    onIntersect(
      [
        { target: section, isIntersecting: false },
        { target: aside, isIntersecting: true },
      ] as unknown as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );

    expect(aside.classList.contains("reveal")).toBe(true);
    expect(section.classList.contains("reveal")).toBe(false);
  });
});

describe("header con histéresis", () => {
  it("marca 'scrolled' al bajar de 50px y lo conserva hasta 30px", () => {
    const header = document.querySelector(".header-site")!;

    scrollTo(51);
    expect(header.classList.contains("scrolled")).toBe(true);

    scrollTo(40);
    expect(header.classList.contains("scrolled")).toBe(true);

    scrollTo(29);
    expect(header.classList.contains("scrolled")).toBe(false);
  });
});

describe("copyright", () => {
  it("muestra el año actual sin necesidad de rebuild", () => {
    expect(document.querySelector("#copyright-year")!.textContent).toBe(
      String(new Date().getFullYear()),
    );
  });
});

describe("selector de idioma", () => {
  const botones = () => document.querySelectorAll<HTMLButtonElement>(".idioma-btn");
  const nota = () => document.querySelector<HTMLElement>(".idioma-nota")!;

  it("arranca en español, con ES marcado como activo", () => {
    const [es, en] = botones();

    expect(document.documentElement.lang).toBe("es");
    expect(es.classList.contains("is-active")).toBe(true);
    expect(es.getAttribute("aria-current")).toBe("true");
    expect(en.classList.contains("is-active")).toBe(false);
  });

  it("avisa en pantalla cuando se pide inglés y no hay traducción", () => {
    botones()[1].click();

    expect(nota().hidden).toBe(false);
    // ! Sin traducción no se finge haber cambiado de idioma
    expect(document.documentElement.lang).toBe("es");
    expect(botones()[0].classList.contains("is-active")).toBe(true);
  });

  it("aplica la traducción y vuelve atrás cuando el DOM trae `data-i18n-en`", () => {
    const parrafo = document.querySelector<HTMLElement>("#bienvenido p")!;
    parrafo.dataset.i18nEn = "hello";
    parrafo.dataset.es = parrafo.textContent!;

    botones()[1].click();
    expect(parrafo.textContent).toBe("hello");
    expect(document.documentElement.lang).toBe("en");
    expect(nota().hidden).toBe(true);
    expect(botones()[1].classList.contains("is-active")).toBe(true);

    botones()[0].click();
    expect(parrafo.textContent).toBe("hola");
    expect(document.documentElement.lang).toBe("es");
  });
});
