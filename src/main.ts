// ! Portafolio: animaciones de revelado, header con scroll, año de copyright e idioma

// ? ↓ Lo que no cabe en un atributo del DOM: el título de la pestaña
const EN = {
  title: "Production websites with Astro and Svelte — José Luis Ramírez Sánchez",
} as const;

// ? ↓ Revelado progresivo de los elementos al entrar en el viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal");
      // ! Dejar de observar el elemento una vez que ya apareció para no gastar recursos
      observer.unobserve(entry.target);
    }
  });
});

const hiddenElements = document.querySelectorAll(".hidden, .hidden-item");
hiddenElements.forEach((el) => observer.observe(el));

// ? ↓ Marca el header como "scrolled" con histéresis para evitar el glitch de layout
const header = document.querySelector(".header-site");
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Histéresis: Activamos en 80px, desactivamos en 30px.
      // Esto evita el glitch de "TV antigua" al cambiar de tamaño el layout.
      if (window.scrollY > 50) {
        header?.classList.add("scrolled");
      } else if (window.scrollY < 30) {
        header?.classList.remove("scrolled");
      }
      ticking = false;
    });
    ticking = true;
  }
});

// ? ↓ El año del copyright siempre queda al día sin necesidad de rebuild
document.querySelector("#copyright-year")!.textContent = String(new Date().getFullYear());

// ? ↓ Selector de idioma. ES predeterminado. Cada nodo traducible lleva `data-i18n-en`;
// ? el original en español se fotografía AL CARGAR, no al volver atrás: si se tomara
// ? después de sobrescribir, "volver a español" devolvería el inglés.
const botonesIdioma = document.querySelectorAll<HTMLButtonElement>(".idioma-btn");
// ? `data-i18n-en` traduce CONTENIDO, `data-i18n-en-aria` traduce ETIQUETA ACCESIBLE.
// ? Nunca se mezclan: un `<nav>` es traducible por su aria-label, no por su contenido,
// ? porque su contenido son los enlaces del índice y borrarlos sería un bug.
const nodosTraducibles = [...document.querySelectorAll<HTMLElement>("[data-i18n-en]")];
const originales = new Map<HTMLElement, string>(nodosTraducibles.map((n) => [n, n.innerHTML]));
const metadatos = [...document.querySelectorAll<HTMLMetaElement>("[data-i18n-en]")];
const metaOriginales = new Map(metadatos.map((m) => [m, m.content]));
const tituloOriginal = document.title;
const etiquetas = [...document.querySelectorAll<HTMLElement>("[data-i18n-en-aria]")];
const ariaOriginales = new Map(etiquetas.map((e) => [e, e.getAttribute("aria-label") ?? ""]));

const aplicarIdioma = (lang: "es" | "en") => {
  const plantilla = document.createElement("template");

  for (const nodo of nodosTraducibles) {
    // ! Ni `innerHTML` ni `textContent`: el copy lleva <strong>, <code> y <em> adentro, y
    // ! algunos nodos traducibles son contenedores (<nav>) con hijos que NO son copy y
    // ! deben sobrevivir. Se sustituyen solo los hijos propios del nodo, nunca su
    // ? contenido entero.
    plantilla.innerHTML = lang === "en" ? nodo.dataset.i18nEn! : originales.get(nodo)!;
    nodo.replaceChildren(...plantilla.content.childNodes);
  }
  for (const meta of metadatos) {
    meta.content = lang === "en" ? meta.dataset.i18nEn! : metaOriginales.get(meta)!;
  }
  for (const etiqueta of etiquetas) {
    etiqueta.setAttribute(
      "aria-label",
      lang === "en" ? etiqueta.dataset.i18nEnAria! : ariaOriginales.get(etiqueta)!,
    );
  }

  document.documentElement.lang = lang;
  document.title = lang === "en" ? EN.title : tituloOriginal;

  for (const boton of botonesIdioma) {
    const activo = boton.dataset.lang === lang;
    boton.classList.toggle("is-active", activo);
    boton.setAttribute("aria-current", String(activo));
  }
};

for (const boton of botonesIdioma) {
  boton.addEventListener("click", () => {
    const lang = boton.dataset.lang === "en" ? "en" : "es";
    aplicarIdioma(lang);
    // ! El idioma va en la URL para que el enlace sea compartible y para que el hreflang
    // ! tenga a qué apuntar; replaceState y no push para no llenar el historial
    const url = new URL(window.location.href);
    if (lang === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    window.history.replaceState(null, "", url);
  });
}

// ? ↓ Un `?lang=en` compartido abre ya en inglés; sin parámetro, español
if (new URLSearchParams(window.location.search).get("lang") === "en") aplicarIdioma("en");
