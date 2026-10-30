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

// ? El icono de "volver al inicio": no está en el `index.html` (allí ya estás en
// ? casa), así que viaja con el generador. Mismo estilo que los del sitio: Solar
// ? Icons, lineal, 16 px, trazo de 2.
// ? Procedencia: @solar-icons/static 2.3.3 → icons/linear/home.svg
const ICONO_HOME = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  class="solar solar-home-linear"
>
  <path
    d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
  ></path>
  <path d="M15 18H9"></path>
</svg>`;

// ? La leyenda de "volver", en los dos idiomas.
const VOLVER: Record<Idioma, string> = {
  es: "Volver al inicio",
  en: "Back home",
};

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

// ? Un enlace de la tarjeta: su texto y el icono que lo acompaña. El icono se
// ? copia del propio `index.html`, así que la ficha muestra los mismos iconos que
// ? las tarjetas y no pueden desviarse.
type EnlaceTarjeta = { texto: string; icono: string };

// ? Los datos de la tarjeta del proyecto: se leen del propio HTML, así que el `alt`
// ? y los rótulos de los enlaces no pueden desviarse de lo que dice la tarjeta.
type DatosTarjeta = {
  alt: string;
  ancho: string;
  alto: string;
  // ? El enlace al sitio en vivo.
  sitio: EnlaceTarjeta;
  // ? El enlace al código, si la tarjeta lo tiene.
  codigo: EnlaceTarjeta | null;
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

// ? El icono de un enlace: el primer `svg` que hay dentro, con su cierre. El
// ? escáner solo guarda el rango de la etiqueta de apertura, así que el cierre se
// ? busca en el emparejado: sin él el `svg` saldría sin sus `path`.
function iconoDe(
  html: string,
  etiquetas: Etiqueta[],
  pares: Map<number, number>,
  desde: number,
  hasta: number,
): string {
  const indiceSvg = etiquetas.findIndex(
    (otra) => otra.nombre === "svg" && !otra.cierre && otra.inicio >= desde && otra.fin <= hasta,
  );

  if (indiceSvg === -1) return "";

  const cierre = pares.get(indiceSvg);

  return cierre === undefined ? "" : html.slice(etiquetas[indiceSvg].inicio, etiquetas[cierre].fin);
}

// ? Los datos de la tarjeta del proyecto: se leen del propio HTML, así que el `alt`
// ? y los rótulos de los enlaces no pueden desviarse de lo que dice la tarjeta.
function datosDeTarjeta(
  html: string,
  etiquetas: Etiqueta[],
  pares: Map<number, number>,
  proyecto: Proyecto,
): DatosTarjeta {
  const vacio: DatosTarjeta = {
    alt: "",
    ancho: "720",
    alto: "450",
    sitio: { texto: "", icono: "" },
    codigo: null,
  };

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

    const enlaceDe = (url: string | undefined): EnlaceTarjeta => {
      if (!url) return { texto: "", icono: "" };

      const indiceEnlace = etiquetas.findIndex(
        (otra) =>
          otra.nombre === "a" &&
          !otra.cierre &&
          otra.inicio >= desde &&
          otra.fin <= hasta &&
          valorDe(otra, "href") === url,
      );

      if (indiceEnlace === -1) return { texto: "", icono: "" };

      const cierreEnlace = pares.get(indiceEnlace);
      if (cierreEnlace === undefined) return { texto: "", icono: "" };

      const finEnlace = etiquetas[cierreEnlace].inicio;

      // ? El rótulo vive en el `span` del enlace; el icono no lleva texto.
      const indiceSpan = etiquetas.findIndex(
        (otra) =>
          otra.nombre === "span" &&
          !otra.cierre &&
          otra.inicio > etiquetas[indiceEnlace].fin &&
          otra.inicio < finEnlace,
      );

      return {
        texto: indiceSpan === -1 ? "" : textoDeElemento(html, etiquetas, pares, indiceSpan),
        icono: iconoDe(html, etiquetas, pares, etiquetas[indiceEnlace].fin, finEnlace),
      };
    };

    return {
      alt: valorDe(imagen, "alt") ?? "",
      ancho: valorDe(imagen, "width") ?? vacio.ancho,
      alto: valorDe(imagen, "height") ?? vacio.alto,
      sitio: enlaceDe(proyecto.url),
      codigo: proyecto.repo ? enlaceDe(proyecto.repo) : null,
    };
  }

  return vacio;
}

// ? El `<main>` de la página del proyecto: el caso, con más aire que la tarjeta.
// ? No es una tarjeta: es una página. El caso manda, la interfaz se aparta.
function contenidoProyecto(
  proyecto: Proyecto,
  idioma: Idioma,
  tarjeta: DatosTarjeta,
  raiz: string,
): string {
  const partes: string[] = [];

  partes.push(`<section id="proyecto" class="proyecto">`);

  // ? Volver al inicio: la ficha es una página aparte y sin esto no hay una salida
  // ? visible hacia la portada (las anclas del nav apuntan a la portada, no a esto).
  partes.push(`<a class="volver" href="${raiz}">${ICONO_HOME}<span>${VOLVER[idioma]}</span></a>`);

  // ? El h1 de la pagina es la marca del sitio (la cabecera); el proyecto es una
  // ? seccion de esa portada, asi que va en h2. Un solo h1 por pagina.
  partes.push(`<h2 class="proyecto-titulo">${proyecto.titulo}</h2>`);
  partes.push(`<p class="proyecto-lead">${proyecto.descripcion[idioma]}</p>`);

  partes.push(`<figure class="proyecto-captura">`);
  partes.push(
    `<img src="${proyecto.captura}" alt="${escapar(tarjeta.alt)}" width="${tarjeta.ancho}" height="${tarjeta.alto}" loading="lazy" decoding="async" />`,
  );
  partes.push(`</figure>`);

  // ? La evidencia, en una sola línea: el estado, la escala y el stack. El stack va
  // ? UNA vez: la tarjeta y la ficha no lo repiten.
  partes.push(`<p class="proyecto-meta">`);
  partes.push(`<span class="proyecto-estado">${proyecto.etiqueta[idioma]}</span>`);
  partes.push(`<span class="proyecto-escala">${proyecto.escala[idioma]}</span>`);
  partes.push(`<span class="proyecto-stack">${proyecto.stack.join(" · ")}</span>`);
  partes.push(`</p>`);

  for (const nota of proyecto.notas) {
    partes.push(`<p class="proyecto-nota">${nota[idioma]}</p>`);
  }

  // ? El problema y las métricas los escribe el autor: la página solo los muestra
  // ? cuando tienen contenido.
  if (proyecto.problema) {
    partes.push(`<h2 class="proyecto-subtitulo">${ROTULO_PROBLEMA[idioma]}</h2>`);
    partes.push(`<p class="proyecto-nota">${proyecto.problema[idioma]}</p>`);
  }

  if (proyecto.metricas.length > 0) {
    partes.push(`<h2 class="proyecto-subtitulo">${ROTULO_METRICAS[idioma]}</h2>`);
    partes.push(`<ul class="proyecto-metricas">`);
    for (const metrica of proyecto.metricas) partes.push(`<li>${metrica[idioma]}</li>`);
    partes.push(`</ul>`);
  }

  partes.push(`<p class="project-links">`);
  partes.push(
    `<a href="${proyecto.url}" target="_blank" rel="noopener noreferrer">${tarjeta.sitio.icono}<span>${tarjeta.sitio.texto}</span></a>`,
  );
  if (proyecto.repo && tarjeta.codigo) {
    partes.push(
      `<a href="${proyecto.repo}" target="_blank" rel="noopener noreferrer">${tarjeta.codigo.icono}<span>${tarjeta.codigo.texto}</span></a>`,
    );
  }
  partes.push(`</p>`);

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
  // ? La raíz del sitio en el idioma de la variante: de ahí salen las anclas absolutas
  // ? y el "volver al inicio".
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
          texto: contenidoProyecto(proyecto, idioma, tarjeta, raiz),
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
