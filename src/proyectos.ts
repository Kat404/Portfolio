// ! Los datos de los proyectos destacados (S12): la única fuente de sus páginas de
// ! detalle. El copy no se reescribe aquí: se copia de las tarjetas de `#proyectos`
// ! del `index.html`, que es donde el autor lo edita.
// ? Cada texto lleva los dos idiomas en el mismo objeto, igual que el `index.html`
// ? lleva el español en el markup y el inglés en `data-i18n-en`: la página derivada
// ? sirve cada idioma desde la misma fuente.

// ? Un texto en los dos idiomas del sitio.
export type TextoBilingue = { es: string; en: string };

export type Proyecto = {
  // ? Identificador de la URL: `/proyectos/<slug>/`.
  slug: string;
  // ? El nombre del proyecto, como aparece en la tarjeta.
  titulo: string;
  // ? Qué es y para quién: el rol de la tarjeta.
  rol: TextoBilingue;
  // ? La etiqueta de la tarjeta ("En producción · con ingresos").
  etiqueta: TextoBilingue;
  // ? Los hechos verificables de la tarjeta, en el orden en que aparecen.
  hechos: TextoBilingue[];
  // ? Las tecnologías que usa, tal como las nombra la tarjeta.
  stack: string[];
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
    etiqueta: {
      es: "En producción · con ingresos",
      en: "In production · with revenue",
    },
    hechos: [
      {
        es: "22 páginas · 232 commits · Astro 7.4 + Svelte 5.57 + Stripe 23 sobre Cloudflare Workers",
        en: "22 pages · 232 commits · Astro 7.4 + Svelte 5.57 + Stripe 23 on Cloudflare Workers",
      },
      {
        es: "Mobile-first, accesible y con E2E potenciado por agentes de IA",
        en: "Mobile-first, accessible and covered by agent-driven E2E tests",
      },
    ],
    stack: ["Astro 7.4", "Svelte 5.57", "Stripe 23", "Cloudflare Workers"],
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
    etiqueta: {
      es: "En producción · con ingresos",
      en: "In production · with revenue",
    },
    hechos: [
      {
        es: "7 páginas · 97 commits · Astro 7.4 SSR + Svelte 5.57 + Vitest 5 sobre Cloudflare Workers",
        en: "7 pages · 97 commits · Astro 7.4 SSR + Svelte 5.57 + Vitest 5",
      },
      {
        es: "Cotizador con autosave en <code>localStorage</code>",
        en: "Quote builder with autosave in <code>localStorage</code>",
      },
    ],
    stack: ["Astro 7.4 SSR", "Svelte 5.57", "Vitest 5", "Cloudflare Workers"],
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
    etiqueta: {
      es: "Plataforma propia · en uso del curso",
      en: "Own platform · in use by the course",
    },
    hechos: [
      { es: "325 commits", en: "325 commits" },
      {
        es: "Cloudflare Workers en free tier + D1 + Durable Objects",
        en: "Cloudflare Workers on the free tier + D1 + Durable Objects",
      },
      {
        es: "Astro 7 + Tailwind, contenido en MDX y suite con Vitest, Playwright y axe-core",
        en: "Astro 7 + Tailwind, content in MDX and a suite with Vitest, Playwright and axe-core",
      },
    ],
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
    etiqueta: {
      es: "Demo pública · desplegada en Workers",
      en: "Public demo · deployed on Workers",
    },
    hechos: [
      { es: "248 commits", en: "248 commits" },
      {
        es: "SvelteKit 3.1 + Svelte 5.57 · Drizzle ORM + Valibot + pdf-lib",
        en: "SvelteKit 3.1 + Svelte 5.57 · Drizzle ORM + Valibot + pdf-lib",
      },
      {
        es: "E2E con agentes de IA + Playwright y axe-core para accesibilidad",
        en: "Agent-driven E2E + Playwright and axe-core for accessibility",
      },
    ],
    stack: [
      "SvelteKit 3.1",
      "Svelte 5.57",
      "Drizzle ORM",
      "Valibot",
      "pdf-lib",
      "Playwright",
      "axe-core",
    ],
    url: "https://opensim.jose-luis-rs.workers.dev",
    // ? Este sí es público: por eso la tarjeta lo enlaza y la página también.
    repo: "https://github.com/Kat404/OpenSIM",
    captura: "/images/proyectos/opensim.webp",
    problema: null,
    metricas: [],
  },
];
