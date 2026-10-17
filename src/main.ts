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
