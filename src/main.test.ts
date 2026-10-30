import { describe, expect, it, vi } from "vite-plus/test";

// ! Pruebas de humo del entry de la app: fijan los comportamientos que entregaba Astro.
// ! El idioma ya no pasa por aquí: cada página se sirve en su idioma desde el build
// ! (S11), así que de `main.ts` solo quedan el revelado, el header y el año.

// ! Los nodos observados viven en el fixture y no se crean dentro de los tests: el
// ! módulo los fotografía AL CARGAR.
const FIXTURE = `
  <header class="header-site"></header>
  <main>
    <section id="bienvenido" class="hidden">
      <p>Hola <strong>mundo</strong></p>
    </section>
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
document.head.innerHTML = `<title>Portafolio Personal</title>`;
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
