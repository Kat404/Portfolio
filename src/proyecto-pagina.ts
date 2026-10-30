// ! La página de detalle de cada proyecto (S12): una función pura que toma el HTML
// ! del sitio y el proyecto, y devuelve la página del proyecto.
// ? El patrón es el de `i18n-variants.ts`: el `index.html` sigue siendo la única
// ? fuente, y el build deriva de él las ocho páginas (cuatro proyectos, dos idiomas).
// ? Así el header, el nav, el pie, el CSS y el JS son los mismos y no pueden quedar
// ? desincronizados.

import {
  SITIO,
  aplicar,
  editarAtributo,
  emparejar,
  escanearEtiquetas,
  valorDe,
  type Edicion,
  type Etiqueta,
} from "./i18n-variants.ts";
import type { Proyecto } from "./proyectos.ts";

export type Idioma = "es" | "en";

// ? Las cuatro anclas del nav: en la página del proyecto no existen, así que pasan a
// ? ser absolutas.
const ANCLAS_NAV = ["#proyectos", "#stack", "#entorno", "#sobre-mi"];

// ? Los rótulos de los dos bloques que el autor aún no ha escrito. Solo aparecen si
// ? hay contenido: mientras estén vacíos, la página no los muestra.
const ROTULO_PROBLEMA: Record<Idioma, string> = {
  es: "El problema",
  en: "The problem",
};
const ROTULO_METRICAS: Record<Idioma, string> = { es: "Métricas", en: "Metrics" };

// ? La URL pública de la página de un proyecto.
export function rutaProyecto(proyecto: Proyecto, idioma: Idioma): string {
  return idioma === "en" ? `/en/proyectos/${proyecto.slug}/` : `/proyectos/${proyecto.slug}/`;
}

// ? Los datos que la tarjeta ya trae y el módulo de datos no: el `alt` de la captura,
// ? sus dimensiones y el rótulo de cada enlace.
type DatosTarjeta = {
  alt: string;
  ancho: string;
  alto: string;
  // ? El rótulo del enlace al sitio en vivo ("Ver sitio en vivo" / "Ver demo").
  enlace: string;
  // ? El rótulo del enlace al código, si la tarjeta lo tiene.
  codigo: string | null;
};

// ? El texto plano de un fragmento de markup.
function textoPlano(markup: string): string {
  return markup
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ? El texto de un elemento, sin sus etiquetas.
function textoDeElemento(
  html: string,
  etiquetas: Etiqueta[],
  pares: Map<number, number>,
  indice: number,
): string {
  const cierre = pares.get(indice);

  if (cierre === undefined) return "";

  return textoPlano(html.slice(etiquetas[indice].fin, etiquetas[cierre].inicio));
}

// ? Los datos de la tarjeta del proyecto: se leen del propio HTML, así que el `alt`
// ? y los rótulos de los enlaces no pueden desviarse de lo que dice la tarjeta.
function datosDeTarjeta(
  html: string,
  etiquetas: Etiqueta[],
  pares: Map<number, number>,
  proyecto: Proyecto,
): DatosTarjeta {
  const vacio: DatosTarjeta = { alt: "", ancho: "720", alto: "450", enlace: "", codigo: null };

  for (let indice = 0; indice < etiquetas.length; indice++) {
    const etiqueta = etiquetas[indice];

    if (etiqueta.cierre || etiqueta.nombre !== "article") continue;
    if (!(valorDe(etiqueta, "class") ?? "").split(/\s+/).includes("project-card")) continue;

    const cierre = pares.get(indice);
    if (cierre === undefined) continue;

    const desde = etiqueta.inicio;
    const hasta = etiquetas[cierre].fin;

    // ? La imagen de la tarjeta: su `alt` y sus dimensiones son los de la captura.
    const imagen = etiquetas.find(
      (otra) =>
        otra.nombre === "img" &&
        !otra.cierre &&
        otra.inicio >= desde &&
        otra.fin <= hasta &&
        valorDe(otra, "src") === proyecto.captura,
    );

    if (!imagen) continue;

    const textoEnlace = (url: string | undefined) => {
      if (!url) return "";

      const indiceEnlace = etiquetas.findIndex(
        (otra) =>
          otra.nombre === "a" &&
          !otra.cierre &&
          otra.inicio >= desde &&
          otra.fin <= hasta &&
          valorDe(otra, "href") === url,
      );

      if (indiceEnlace === -1) return "";

      const cierreEnlace = pares.get(indiceEnlace);
      if (cierreEnlace === undefined) return "";

      const finEnlace = etiquetas[cierreEnlace].inicio;

      // ? El rótulo vive en el `span` del enlace; el icono no lleva texto.
      const indiceSpan = etiquetas.findIndex(
        (otra) =>
          otra.nombre === "span" &&
          !otra.cierre &&
          otra.inicio > etiquetas[indiceEnlace].fin &&
          otra.inicio < finEnlace,
      );

      return indiceSpan === -1 ? "" : textoDeElemento(html, etiquetas, pares, indiceSpan);
    };

    return {
      alt: valorDe(imagen, "alt") ?? "",
      ancho: valorDe(imagen, "width") ?? vacio.ancho,
      alto: valorDe(imagen, "height") ?? vacio.alto,
      enlace: textoEnlace(proyecto.url),
      codigo: proyecto.repo ? textoEnlace(proyecto.repo) : null,
    };
  }

  return vacio;
}

// ? El `<main>` de la página del proyecto: el caso, con más aire que la tarjeta.
function contenidoProyecto(proyecto: Proyecto, idioma: Idioma, tarjeta: DatosTarjeta): string {
  const partes: string[] = [];

  partes.push(`<section id="proyecto" class="hidden">`);
  partes.push(`<article class="project-card">`);
  partes.push(
    `<img class="project-shot" src="${proyecto.captura}" alt="${escapar(tarjeta.alt)}" width="${tarjeta.ancho}" height="${tarjeta.alto}" loading="lazy" decoding="async" />`,
  );
  partes.push(`<h2 class="project-title">${proyecto.titulo}</h2>`);
  partes.push(`<p class="project-role">${proyecto.rol[idioma]}</p>`);
  partes.push(`<ul class="project-facts">`);
  partes.push(`<li><strong>${proyecto.etiqueta[idioma]}</strong></li>`);
  for (const hecho of proyecto.hechos) partes.push(`<li>${hecho[idioma]}</li>`);
  partes.push(`</ul>`);
  partes.push(`<h3>Stack</h3>`);
  partes.push(`<ul class="project-facts">`);
  for (const tecnologia of proyecto.stack) partes.push(`<li>${tecnologia}</li>`);
  partes.push(`</ul>`);

  // ? El problema y las métricas los escribe el autor: la página solo los muestra
  // ? cuando tienen contenido.
  if (proyecto.problema) {
    partes.push(`<h3>${ROTULO_PROBLEMA[idioma]}</h3>`);
    partes.push(`<p class="project-role">${proyecto.problema[idioma]}</p>`);
  }

  if (proyecto.metricas.length > 0) {
    partes.push(`<h3>${ROTULO_METRICAS[idioma]}</h3>`);
    partes.push(`<ul class="project-facts">`);
    for (const metrica of proyecto.metricas) partes.push(`<li>${metrica[idioma]}</li>`);
    partes.push(`</ul>`);
  }

  partes.push(`<p class="project-links">`);
  partes.push(
    `<a href="${proyecto.url}" target="_blank" rel="noopener noreferrer">${tarjeta.enlace}</a>`,
  );
  if (proyecto.repo && tarjeta.codigo) {
    partes.push(
      `<a href="${proyecto.repo}" target="_blank" rel="noopener noreferrer">${tarjeta.codigo}</a>`,
    );
  }
  partes.push(`</p>`);
  partes.push(`</article>`);
  partes.push(`</section>`);

  return partes.join("\n");
}

// ? Escapa lo que rompería el valor de un atributo.
function escapar(valor: string): string {
  return valor.replace(/&(?![a-zA-Z]+;|#\d+;|#x[0-9a-fA-F]+;)/g, "&amp;").replace(/"/g, "&quot;");
}

// ? La página de un proyecto, derivada de una variante del documento.
export function paginaProyecto(html: string, proyecto: Proyecto, idioma: Idioma): string {
  const etiquetas = escanearEtiquetas(html);
  const pares = emparejar(etiquetas);
  const ediciones: Edicion[] = [];

  const ruta = rutaProyecto(proyecto, idioma);
  const rutaEs = rutaProyecto(proyecto, "es");
  const rutaEn = rutaProyecto(proyecto, "en");
  // ? La raíz del sitio en el idioma de la variante: de ahí salen las anclas absolutas.
  const raiz = idioma === "en" ? "/en/" : "/";

  const titulo = `${proyecto.titulo} — José Luis Ramírez Sánchez`;
  const descripcion = proyecto.rol[idioma];
  const tarjeta = datosDeTarjeta(html, etiquetas, pares, proyecto);

  etiquetas.forEach((etiqueta, indice) => {
    if (etiqueta.cierre) return;

    // ? El `<main>` se sustituye entero: la página del proyecto es el caso, no la
    // ? portada con un caso pegado debajo.
    if (etiqueta.nombre === "main") {
      const cierre = pares.get(indice);

      if (cierre !== undefined) {
        ediciones.push({
          inicio: etiqueta.fin,
          fin: etiquetas[cierre].inicio,
          texto: contenidoProyecto(proyecto, idioma, tarjeta),
        });
      }
      return;
    }

    if (etiqueta.nombre === "title") {
      const cierre = pares.get(indice);

      if (cierre !== undefined) {
        ediciones.push({ inicio: etiqueta.fin, fin: etiquetas[cierre].inicio, texto: titulo });
      }
      return;
    }

    if (etiqueta.nombre === "meta") {
      const propiedad = valorDe(etiqueta, "property");
      const nombre = valorDe(etiqueta, "name");

      if (nombre === "description") editarAtributo(ediciones, etiqueta, "content", descripcion);
      if (nombre === "twitter:title") editarAtributo(ediciones, etiqueta, "content", titulo);
      if (nombre === "twitter:description")
        editarAtributo(ediciones, etiqueta, "content", descripcion);
      if (propiedad === "og:title") editarAtributo(ediciones, etiqueta, "content", titulo);
      if (propiedad === "og:description")
        editarAtributo(ediciones, etiqueta, "content", descripcion);
      if (propiedad === "og:url") editarAtributo(ediciones, etiqueta, "content", SITIO + ruta);
      if (propiedad === "og:locale") {
        editarAtributo(ediciones, etiqueta, "content", idioma === "en" ? "en_US" : "es_MX");
      }
      return;
    }

    if (etiqueta.nombre === "link") {
      const rel = valorDe(etiqueta, "rel");

      if (rel === "canonical") {
        editarAtributo(ediciones, etiqueta, "href", SITIO + ruta);
        return;
      }

      if (rel === "alternate") {
        const hreflang = valorDe(etiqueta, "hreflang");

        // ? El par ES/EN del proyecto es recíproco, y el `x-default` es el español.
        if (hreflang === "es") editarAtributo(ediciones, etiqueta, "href", SITIO + rutaEs);
        else if (hreflang === "en") editarAtributo(ediciones, etiqueta, "href", SITIO + rutaEn);
        else if (hreflang === "x-default")
          editarAtributo(ediciones, etiqueta, "href", SITIO + rutaEs);
      }
      return;
    }

    if (etiqueta.nombre === "a") {
      const href = valorDe(etiqueta, "href");

      // ? Las anclas del nav no existen en la página del proyecto: pasan a ser
      // ? absolutas y apuntan a la portada de su idioma.
      if (href && ANCLAS_NAV.includes(href)) {
        editarAtributo(ediciones, etiqueta, "href", `${raiz}${href}`);
        return;
      }

      // ? El selector de idioma lleva a la página equivalente del otro idioma.
      const clases = (valorDe(etiqueta, "class") ?? "").split(/\s+/);

      if (clases.includes("idioma-btn")) {
        const idiomaDelEnlace = valorDe(etiqueta, "hreflang") === "en" ? "en" : "es";
        const activo = idiomaDelEnlace === idioma;
        const nuevas = activo
          ? [...new Set([...clases, "is-active"])]
          : clases.filter((clase) => clase !== "is-active");

        editarAtributo(ediciones, etiqueta, "href", idiomaDelEnlace === "en" ? rutaEn : rutaEs);
        editarAtributo(ediciones, etiqueta, "class", nuevas.join(" "));
        editarAtributo(ediciones, etiqueta, "aria-current", activo ? "true" : "false");
      }
    }
  });

  return aplicar(html, ediciones);
}

// ? Los enlaces de las tarjetas a su página: en la variante inglesa apuntan a la
// ? página inglesa del proyecto, no a la española.
export function enlacesDeCaso(html: string, idioma: Idioma): string {
  const etiquetas = escanearEtiquetas(html);
  const ediciones: Edicion[] = [];

  etiquetas.forEach((etiqueta) => {
    if (etiqueta.cierre || etiqueta.nombre !== "a") return;

    const href = valorDe(etiqueta, "href");

    if (href?.startsWith("/proyectos/")) {
      editarAtributo(ediciones, etiqueta, "href", idioma === "en" ? `/en${href}` : href);
    }
  });

  return aplicar(html, ediciones);
}
