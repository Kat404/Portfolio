// ! Los datos de los proyectos destacados (S12): la única fuente de sus páginas de
// ! detalle. El copy no se reescribe aquí: el papel de cada tarjeta y de cada hecho
// ! sigue siendo el del `index.html`, que es donde el autor lo edita.
// ? Cada texto lleva los dos idiomas del sitio en el mismo objeto, igual que el
// ? `index.html` lleva el español en el markup y el inglés en `data-i18n-en`: la
// ? página derivada sirve cada idioma desde la misma fuente.

// ? Un texto en los dos idiomas del sitio.
export type TextoBilingue = { es: string; en: string };

export type Proyecto = {
  // ? Identificador de la URL: `/proyectos/<slug>/`.
  slug: string;
  // ? El nombre del proyecto, como aparece en la tarjeta.
  titulo: string;
  // ? El resumen de una línea: es la descripción de la tarjeta y la meta description.
  rol: TextoBilingue;
  // ? El párrafo de la ficha: qué es el proyecto y por qué existe. Es lo que le da
  // ? vida al caso; los hechos de abajo son la evidencia.
  descripcion: TextoBilingue;
  // ? El estado: en producción con ingresos, proyecto estudiantil, proyecto personal.
  etiqueta: TextoBilingue;
  // ? La escala del proyecto, separada del stack: lo que se cuenta, no con qué.
  escala: TextoBilingue;
  // ? Las tecnologías, en la forma en que las nombra la tarjeta.
  stack: string[];
  // ? Las notas de calidad y de alcance.
  notas: TextoBilingue[];
  // ? El sitio en vivo.
  url: string;
  // ? El repositorio, solo si es público: enlazar un repo privado es un 404 para
  // ? quien no tiene la cuenta.
  repo?: string;
  // ? La captura de la tarjeta, en `public/images/proyectos/`.
  captura: string;
  // ? El problema que resolvía: lo escribe el autor. Vacío hasta entonces, y la
  // ? página no muestra nada mientras lo esté.
  problema: TextoBilingue | null;
  // ? Las métricas: las escribe el autor. Vacío hasta entonces.
  metricas: TextoBilingue[];
};

// ? Los cuatro proyectos de `#proyectos`. El orden es el de las tarjetas.
export const proyectos: Proyecto[] = [
  {
    slug: "casa-noria",
    titulo: "Casa Noria",
    rol: {
      es: "Sitio oficial de un hotel real en Acapulco: habitaciones, SEO local y reserva con pago en línea.",
      en: "Official site of a real hotel in Acapulco: rooms, local SEO and online booking with payment.",
    },
    descripcion: {
      es: "Un hotel necesita que cada habitación se encuentre y se reserve: por eso hay una página por habitación, con su SEO local, y un motor de reservas que cobra con Stripe. Es el sistema que trae los ingresos, no un trabajo de portafolio.",
      en: "A hotel needs every room to be found and booked: that is why there is a page per room, with its local SEO, and a booking engine that takes payment through Stripe. This is the system that brings in the revenue, not a portfolio piece.",
    },
    etiqueta: {
      es: "En producción · con ingresos",
      en: "In production · with revenue",
    },
    escala: { es: "22 páginas · 232 commits", en: "22 pages · 232 commits" },
    stack: ["Astro 7.4", "Svelte 5.57", "Stripe 23", "Cloudflare Workers"],
    notas: [
      {
        es: "Mobile-first, accesible y con E2E potenciado por agentes de IA",
        en: "Mobile-first, accessible and covered by agent-driven E2E tests",
      },
    ],
    url: "https://hotelcasanoria.com.mx",
    // ? El repositorio es privado: la tarjeta no lo enlaza y la página tampoco.
    captura: "/images/proyectos/casa-noria.webp",
    problema: null,
    metricas: [],
  },
  {
    slug: "tranxfers",
    titulo: "Tranxfers",
    rol: {
      es: "Traslados privados cotizados de Viajes RumboX: el visitante arma su cotización en tres pasos y puede retomarla después.",
      en: "Quoted private transfers by Viajes RumboX: the visitor builds their quote in three steps and can pick it up later.",
    },
    descripcion: {
      es: "Traslados privados de una agencia de viajes: el visitante arma su cotización en tres pasos y puede retomarla al día siguiente. El autosave en el navegador es lo que evita que una cotización a medias se pierda por el camino.",
      en: "Private transfers from a travel agency: the visitor builds their quote in three steps and can pick it up the next day. Autosave in the browser is what keeps a half-finished quote from getting lost on the way.",
    },
    etiqueta: {
      es: "En producción · con ingresos",
      en: "In production · with revenue",
    },
    escala: { es: "7 páginas · 97 commits", en: "7 pages · 97 commits" },
    stack: ["Astro 7.4 SSR", "Svelte 5.57", "Vitest 5", "Cloudflare Workers"],
    notas: [
      {
        es: "Cotizador con autosave en <code>localStorage</code>",
        en: "Quote builder with autosave in <code>localStorage</code>",
      },
    ],
    url: "https://tranxfers.com.mx",
    // ? El repositorio es privado: la tarjeta no lo enlaza y la página tampoco.
    captura: "/images/proyectos/tranxfers.webp",
    problema: null,
    metricas: [],
  },
  {
    slug: "talleragentes",
    titulo: "TallerAgentes",
    rol: {
      es: 'Plataforma del curso "Agentes de IA y Automatización" que doy en IEEE Computer Society ITM: inscripción, credenciales, asistencia y publicación de contenido.',
      en: 'Platform for the "AI and Automation Agents" course I teach at IEEE Computer Society ITM: enrollment, credentials, attendance and content publishing.',
    },
    descripcion: {
      es: "La plataforma del curso de Agentes de IA y Automatización que doy en el IEEE Computer Society ITM: inscripción, credenciales, asistencia y publicación de contenido. Es la infraestructura de un curso completo, no una demo.",
      en: "The platform for the AI and Automation Agents course I teach at IEEE Computer Society ITM: enrollment, credentials, attendance and content publishing. It is the infrastructure of a whole course, not a demo.",
    },
    etiqueta: {
      es: "Proyecto estudiantil · en uso del curso",
      en: "Student project · in use by the course",
    },
    escala: { es: "325 commits", en: "325 commits" },
    stack: [
      "Astro 7",
      "Tailwind",
      "MDX",
      "Cloudflare Workers",
      "D1",
      "Durable Objects",
      "Vitest",
      "Playwright",
      "axe-core",
    ],
    notas: [
      {
        es: "Todo el curso corre sobre el free tier de Cloudflare Workers",
        en: "The whole course runs on Cloudflare Workers' free tier",
      },
    ],
    url: "https://talleragentes.jose-luis-rs.workers.dev/",
    // ? El repositorio es privado: la tarjeta no lo enlaza y la página tampoco.
    captura: "/images/proyectos/talleragentes.webp",
    problema: null,
    metricas: [],
  },
  {
    slug: "opensim",
    titulo: "OpenSIM",
    rol: {
      es: "Rediseño FOSS del sistema académico del TecNM Morelia, construido como demo funcional: horario, retícula, kardex, reinscripción, trámites y temario. Lo que el original no publica se declara pendiente en vez de inventarse.",
      en: "FOSS redesign of the TecNM Morelia academic system, built as a working demo: schedule, curriculum, transcript, re-enrolment, paperwork and syllabus. What the original does not publish is declared pending instead of invented.",
    },
    descripcion: {
      es: "Rediseño libre del sistema académico del TecNM Morelia, construido como demo funcional: horario, retícula, kardex, reinscripción, trámites y temario. Lo que el sistema original no publica se declara pendiente en vez de inventarse, que es justo lo que lo hace abierto y utilizable.",
      en: "Free redesign of the TecNM Morelia academic system, built as a working demo: schedule, curriculum, transcript, re-enrolment, paperwork and syllabus. What the original does not publish is declared pending instead of invented, which is exactly what makes it open and usable.",
    },
    etiqueta: {
      es: "Proyecto personal · demo pública en Workers",
      en: "Personal project · public demo on Workers",
    },
    escala: { es: "248 commits", en: "248 commits" },
    stack: [
      "SvelteKit 3.1",
      "Svelte 5.57",
      "Drizzle ORM",
      "Valibot",
      "pdf-lib",
      "Playwright",
      "axe-core",
    ],
    notas: [
      {
        es: "E2E con agentes de IA + Playwright y axe-core para accesibilidad",
        en: "Agent-driven E2E + Playwright and axe-core for accessibility",
      },
    ],
    url: "https://opensim.jose-luis-rs.workers.dev",
    // ? Este sí es público: por eso la tarjeta lo enlaza y la página también.
    repo: "https://github.com/Kat404/OpenSIM",
    captura: "/images/proyectos/opensim.webp",
    problema: null,
    metricas: [],
  },
];
