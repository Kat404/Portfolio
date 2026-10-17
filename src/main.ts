// ! Portafolio: animaciones de revelado, header con scroll y año de copyright

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

// ? ↓ Selector de idioma. ES predeterminado; EN solo cambia el texto si la traducción
// ? está en el DOM (`data-i18n-en`). Mientras no exista, lo dice en pantalla en vez de
// ? dejar un botón que no hace nada.
const botonesIdioma = document.querySelectorAll<HTMLButtonElement>(".idioma-btn");
const notaIdioma = document.querySelector<HTMLElement>(".idioma-nota");

for (const boton of botonesIdioma) {
  boton.addEventListener("click", () => {
    const lang = boton.dataset.lang === "en" ? "en" : "es";
    const traducciones = document.querySelectorAll<HTMLElement>("[data-i18n-en]");

    if (lang === "en" && traducciones.length === 0) {
      if (notaIdioma) notaIdioma.hidden = false;
      return;
    }

    if (lang === "en") {
      for (const nodo of traducciones) nodo.textContent = nodo.dataset.i18nEn!;
    } else {
      // ! Cada nodo traducible guarda su original en `data-es` para poder volver atrás
      for (const nodo of document.querySelectorAll<HTMLElement>("[data-es]")) {
        nodo.textContent = nodo.dataset.es!;
      }
    }

    document.documentElement.lang = lang;
    for (const otro of botonesIdioma) {
      const activo = otro === boton;
      otro.classList.toggle("is-active", activo);
      otro.setAttribute("aria-current", String(activo));
    }
    if (notaIdioma) notaIdioma.hidden = true;
  });
}
