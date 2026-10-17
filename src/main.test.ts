import { describe, expect, it, vi } from "vite-plus/test";

// ! Pruebas de humo del entry de la app: fijan los comportamientos que entregaba Astro

// ! Los nodos traducibles viven en el fixture y no se crean dentro de los tests: el
// ! módulo fotografía el español AL CARGAR, así que un nodo agregado después ya no
// ! tendría original contra el cual volver.
const FIXTURE = `
  <header class="header-site"></header>
  <nav class="idioma">
    <button type="button" class="idioma-btn is-active" data-lang="es" aria-current="true">ES</button>
    <button type="button" class="idioma-btn" data-lang="en" aria-current="false">EN</button>
  </nav>
  <main>
    <nav id="indice" aria-label="Índice" data-i18n-en-aria="Contents"><a href="#uno">Uno</a><a href="#dos">Dos</a></nav>
    <section id="bienvenido" class="hidden">
      <p data-i18n-en="Hi <strong>world</strong>">Hola <strong>mundo</strong></p>
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
document.head.innerHTML = `<title>Portafolio Personal</title>
  <meta name="description" content="descripción original" data-i18n-en="Two production sites with revenue." />`;
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

  it("arranca en español, con ES marcado como activo", () => {
    const [es, en] = botones();

    expect(document.documentElement.lang).toBe("es");
    expect(es.classList.contains("is-active")).toBe(true);
    expect(es.getAttribute("aria-current")).toBe("true");
    expect(en.classList.contains("is-active")).toBe(false);
  });

  it("traduce conservando el marcado interno y vuelve atrás exacto", () => {
    const parrafo = document.querySelector<HTMLElement>("#bienvenido p")!;

    botones()[1].click();
    expect(parrafo.innerHTML).toBe("Hi <strong>world</strong>");
    // ! El `<strong>` sobrevive: se cambia innerHTML, no textContent
    expect(parrafo.querySelector("strong")?.textContent).toBe("world");
    expect(document.documentElement.lang).toBe("en");
    expect(botones()[1].classList.contains("is-active")).toBe(true);

    botones()[0].click();
    expect(parrafo.innerHTML).toBe("Hola <strong>mundo</strong>");
    expect(document.documentElement.lang).toBe("es");
  });

  it("traduce también los metadatos y el título de la pestaña", () => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')!;

    botones()[1].click();
    expect(meta.content).toBe("Two production sites with revenue.");
    expect(document.title).toContain("Production websites");

    botones()[0].click();
    expect(meta.content).toBe("descripción original");
    expect(document.title).toBe("Portafolio Personal");
  });

  it("un nodo traducible que es contenedor conserva sus hijos", () => {
    // ! El caso que rompió la primera versión: `innerHTML` sobre un <nav> traducible
    // ! borraba los enlaces enteros y el índice quedaba vacío
    const nav = document.querySelector<HTMLElement>("#indice")!;

    botones()[1].click();
    expect(nav.getAttribute("aria-label")).toBe("Contents");
    // ! El contenido traducible vive en los hijos, no en el nav: nunca se sustituye
    expect(nav.querySelectorAll("a")).toHaveLength(2);

    botones()[0].click();
    expect(nav.getAttribute("aria-label")).toBe("Índice");
    expect(nav.querySelectorAll("a")).toHaveLength(2);
  });

  it("traduce cada nodo traducible y no toca los que no lo son", () => {
    const sinTraducir = document.querySelector<HTMLElement>("#mis-gustos")!;

    botones()[1].click();
    expect(sinTraducir.innerHTML).toBe("");
    expect(document.documentElement.lang).toBe("en");

    botones()[0].click();
    expect(document.documentElement.lang).toBe("es");
  });
});
