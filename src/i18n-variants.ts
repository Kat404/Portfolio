// ! Derivación de las dos variantes del documento a partir de un solo `index.html`.
// ! El español vive en el markup y el inglés en los atributos `data-i18n-en`; el build
// ! aplica el inglés y reparte el resultado en dos páginas: `/` y `/en/`.
// ? Es una función pura: no lee el DOM, no depende del navegador y siempre devuelve lo
// ? mismo para el mismo HTML de entrada.

// ? El sitio y sus dos rutas. Todo el `head` se deriva de aquí, para que las URLs
// ? públicas no vivan repetidas en el HTML.
export const SITIO = "https://portfolio.jose-luis-rs.workers.dev";
export const RUTA_ES = "/";
export const RUTA_EN = "/en/";

const ATRIBUTO_TRADUCIBLE = "data-i18n-en";
const ATRIBUTO_ARIA = "data-i18n-en-aria";

// ? Elementos que nunca tienen contenido: no se les puede meter texto dentro.
const SIN_CONTENIDO = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

type Atributo = {
  nombre: string;
  valor: string | null;
  // ? Posiciones en el HTML original, para poder reescribir sin volver a parsear.
  inicio: number;
  fin: number;
  valorInicio: number;
  valorFin: number;
};

type Etiqueta = {
  nombre: string;
  nombreFin: number;
  atributos: Atributo[];
  inicio: number;
  fin: number;
  cierre: boolean;
};

type Edicion = { inicio: number; fin: number; texto: string };

// ? Escáner de etiquetas: recorre el HTML recognizing los atributos con comillas de
// ? cualquiera de los dos tipos, porque el copy traducido trae etiquetas dentro del
// ? valor (`<strong>`, `<code>`) y comillas de los dos tipos.
function escanearEtiquetas(html: string): Etiqueta[] {
  const etiquetas: Etiqueta[] = [];
  let i = 0;

  while (i < html.length) {
    const menorQue = html.indexOf("<", i);

    if (menorQue === -1) break;

    // ? Comentario, doctype o instrucción de procesamiento: se salta entero.
    if (html.startsWith("<!--", menorQue)) {
      const fin = html.indexOf("-->", menorQue);
      i = fin === -1 ? html.length : fin + 3;
      continue;
    }
    if (html.startsWith("<!", menorQue) || html.startsWith("<?", menorQue)) {
      const fin = html.indexOf(">", menorQue);
      i = fin === -1 ? html.length : fin + 1;
      continue;
    }

    let j = menorQue + 1;
    let cierre = false;

    if (html[j] === "/") {
      cierre = true;
      j++;
    }

    const nombreInicio = j;
    while (j < html.length && !/[\s/>]/.test(html[j])) j++;
    const nombre = html.slice(nombreInicio, j).toLowerCase();
    const nombreFin = j;
    const atributos: Atributo[] = [];

    while (j < html.length) {
      while (j < html.length && /\s/.test(html[j])) j++;
      if (j >= html.length) break;
      if (html[j] === ">") {
        j++;
        break;
      }
      if (html[j] === "/" && html[j + 1] === ">") {
        j += 2;
        break;
      }

      const inicio = j;
      while (j < html.length && !/[\s=/>]/.test(html[j])) j++;
      const nombreAtributo = html.slice(inicio, j).toLowerCase();

      let k = j;
      while (k < html.length && /\s/.test(html[k])) k++;

      let valor: string | null = null;
      let valorInicio = j;
      let valorFin = j;
      let fin = j;

      if (html[k] === "=") {
        k++;
        while (k < html.length && /\s/.test(html[k])) k++;
        const comilla = html[k];

        if (comilla === '"' || comilla === "'") {
          const finComilla = html.indexOf(comilla, k + 1);
          valorInicio = k + 1;
          valorFin = finComilla === -1 ? html.length : finComilla;
          valor = html.slice(valorInicio, valorFin);
          fin = valorFin + 1;
          j = fin;
        } else {
          valorInicio = k;
          while (k < html.length && !/[\s>]/.test(html[k])) k++;
          valorFin = k;
          valor = html.slice(valorInicio, valorFin);
          fin = k;
          j = k;
        }
      }

      if (nombreAtributo) {
        atributos.push({ nombre: nombreAtributo, valor, inicio, fin, valorInicio, valorFin });
      }
    }

    etiquetas.push({ nombre, nombreFin, atributos, inicio: menorQue, fin: j, cierre });
    i = j;
  }

  return etiquetas;
}

// ? Empareja cada etiqueta de apertura con su cierre, para saber dónde acaba el
// ? contenido de cada elemento.
function emparejar(etiquetas: Etiqueta[]): Map<number, number> {
  const pila: number[] = [];
  const pares = new Map<number, number>();

  etiquetas.forEach((etiqueta, indice) => {
    if (etiqueta.cierre) {
      for (let j = pila.length - 1; j >= 0; j--) {
        if (etiquetas[pila[j]].nombre === etiqueta.nombre) {
          pares.set(pila[j], indice);
          pila.splice(j, 1);
          break;
        }
      }
    } else if (!SIN_CONTENIDO.has(etiqueta.nombre)) {
      pila.push(indice);
    }
  });

  return pares;
}

function valorDe(etiqueta: Etiqueta, nombre: string): string | null {
  return etiqueta.atributos.find((a) => a.nombre === nombre)?.valor ?? null;
}

// ? Reemplaza el valor de un atributo que ya existe. Si el atributo no existe, la
// ? operación falla: el HTML de origen tiene que traerlo, y callar ese error
// ? produciría una página con el copy a medias.
function editarAtributo(ediciones: Edicion[], etiqueta: Etiqueta, nombre: string, valor: string) {
  const atributo = etiqueta.atributos.find((a) => a.nombre === nombre);

  if (!atributo || atributo.valor === null) {
    throw new Error(`i18n-variants: falta el atributo ${nombre} en <${etiqueta.nombre}>`);
  }

  ediciones.push({
    inicio: atributo.valorInicio,
    fin: atributo.valorFin,
    texto: escaparValor(valor),
  });
}

// ? Quita un atributo junto con el espacio que lo precede.
function quitarAtributo(ediciones: Edicion[], etiqueta: Etiqueta, atributo: Atributo) {
  const indice = etiqueta.atributos.indexOf(atributo);
  const anterior = indice > 0 ? etiqueta.atributos[indice - 1].fin : etiqueta.nombreFin;

  ediciones.push({ inicio: anterior, fin: atributo.fin, texto: "" });
}

// ? Escapa solo lo que rompería el valor de un atributo. Una entidad ya escrita
// ? (`&amp;`) se respeta: escaparla otra vez la convertiría en `&amp;amp;`.
function escaparValor(valor: string): string {
  return valor.replace(/&(?![a-zA-Z]+;|#\d+;|#x[0-9a-fA-F]+;)/g, "&amp;").replace(/"/g, "&quot;");
}

// ? Aplica las ediciones sobre el HTML original, de atrás hacia adelante para que las
// ? posiciones no se muevan bajo los pies.
function aplicar(html: string, ediciones: Edicion[]): string {
  const ordenadas = [...ediciones].sort((a, b) => a.inicio - b.inicio);
  let salida = "";
  let cursor = 0;

  for (const edicion of ordenadas) {
    if (edicion.inicio < cursor) continue;
    salida += html.slice(cursor, edicion.inicio) + edicion.texto;
    cursor = edicion.fin;
  }

  return salida + html.slice(cursor);
}

// ? Genera una de las dos variantes del documento.
export function variante(html: string, idioma: "es" | "en"): string {
  const etiquetas = escanearEtiquetas(html);
  const pares = emparejar(etiquetas);
  const ediciones: Edicion[] = [];
  const ruta = idioma === "en" ? RUTA_EN : RUTA_ES;

  etiquetas.forEach((etiqueta, indice) => {
    if (etiqueta.cierre) return;

    const traducible = etiqueta.atributos.find((a) => a.nombre === ATRIBUTO_TRADUCIBLE);
    const accesible = etiqueta.atributos.find((a) => a.nombre === ATRIBUTO_ARIA);

    // ? El inglés deja de viajar en el DOM en las dos variantes: en la española no
    // ? hace falta y en la inglesa ya está aplicado.
    if (traducible) quitarAtributo(ediciones, etiqueta, traducible);
    if (accesible) quitarAtributo(ediciones, etiqueta, accesible);

    if (idioma === "en") {
      if (traducible?.valor) {
        if (etiqueta.nombre === "meta") {
          editarAtributo(ediciones, etiqueta, "content", traducible.valor);
        } else if (etiqueta.nombre === "img") {
          // ? Una imagen no tiene hijos: el texto va al `alt`.
          editarAtributo(ediciones, etiqueta, "alt", traducible.valor);
        } else {
          const cierre = pares.get(indice);

          if (cierre !== undefined) {
            ediciones.push({
              inicio: etiqueta.fin,
              fin: etiquetas[cierre].inicio,
              texto: traducible.valor,
            });
          }
        }
      }
      if (accesible?.valor) editarAtributo(ediciones, etiqueta, "aria-label", accesible.valor);
    }

    if (etiqueta.nombre === "html") {
      editarAtributo(ediciones, etiqueta, "lang", idioma);
    }

    // ? El `head` de cada variante: canonical, Open Graph y locale son distintos.
    if (etiqueta.nombre === "link" && valorDe(etiqueta, "rel") === "canonical") {
      editarAtributo(ediciones, etiqueta, "href", SITIO + ruta);
    }
    if (etiqueta.nombre === "meta" && valorDe(etiqueta, "property") === "og:url") {
      editarAtributo(ediciones, etiqueta, "content", SITIO + ruta);
    }
    if (etiqueta.nombre === "meta" && valorDe(etiqueta, "property") === "og:locale") {
      editarAtributo(ediciones, etiqueta, "content", idioma === "en" ? "en_US" : "es_MX");
    }

    // ? El selector de idioma es un enlace a la otra variante: el activo lo decide
    // ? la variante, no el documento.
    if (
      etiqueta.nombre === "a" &&
      (valorDe(etiqueta, "class") ?? "").split(/\s+/).includes("idioma-btn")
    ) {
      const destino = valorDe(etiqueta, "href");
      const activo = destino === ruta;
      const clases = (valorDe(etiqueta, "class") ?? "").split(/\s+/).filter(Boolean);
      const nuevas = activo
        ? [...new Set([...clases, "is-active"])]
        : clases.filter((clase) => clase !== "is-active");

      editarAtributo(ediciones, etiqueta, "class", nuevas.join(" "));
      editarAtributo(ediciones, etiqueta, "aria-current", activo ? "true" : "false");
    }
  });

  return aplicar(html, ediciones);
}

// ? Las dos páginas del sitio, derivadas del mismo `index.html`.
export function variantes(html: string): { es: string; en: string } {
  return { es: variante(html, "es"), en: variante(html, "en") };
}
