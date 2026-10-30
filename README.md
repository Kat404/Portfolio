# Portafolio Personal — José Luis

Desarrollador web y de sistemas.

## 📋 Descripción

Portafolio personal estático: **HTML semántico, CSS puro y TypeScript nativo**, sin framework de UI, sin animación de scroll y sin dependencias de runtime. El español vive en el markup y el inglés en los atributos `data-i18n-en`; el build aplica el inglés y reparte el resultado en tres rutas: `/`, `/en/` y la ficha de cada proyecto. En producción lo sirve Cloudflare Workers Assets.

## 🛠️ Stack actual

| Pieza                  | Versión        | Para qué                                                               |
| :--------------------- | :------------- | :--------------------------------------------------------------------- |
| **Vite+**              | 1.4.0          | Toolchain unificado: runtime, dev server, build, lint, formato y tests |
| **Vite + Rolldown**    | 8.3.5 / 1.2.15 | Bundler y dev server                                                   |
| **TypeScript**         | 7.0.2          | Tipos y el único entry de cliente (`src/main.ts`)                      |
| **Vitest + happy-dom** | 5.0.5 / 21     | 68 tests sobre el `index.html` real                                    |
| **Oxlint + Oxfmt**     | 1.89.0 / 0.74  | Lint y formato (`vp check`)                                            |
| **HTML5 + CSS3**       | —              | Sin framework: un documento y dos hojas de estilo                      |
| **Solar Icons**        | 2.3.3          | Íconos SVG en línea dentro del `index.html`                            |
| **Maple Mono**         | 7.9            | Única tipografía, recortada a 4 pesos (153 744 B en WOFF2)             |
| **pnpm**               | 12.14.0        | Gestor de paquetes                                                     |
| **Wrangler**           | 4.154.0        | Despliegue estático en Cloudflare Workers Assets                       |
| **Codegraph**          | —              | Indexado local del código                                              |

**Presupuesto de JavaScript: 1.1 kB gzip.** El bundle actual mide **647 B**, y la página en español ocupa 11.6 kB gzip. El único JavaScript del sitio es `src/main.ts`: revelado por `IntersectionObserver`, header con histéresis y el año del copyright en runtime. El idioma no pasa por el navegador: cada página se sirve ya traducida desde el build.

## 🗂️ Estructura del proyecto

```text
Portfolio/
├── public/
│   ├── fonts/             # Maple Mono recortada: 4 pesos en WOFF2
│   ├── icons/             # Favicon
│   ├── images/            # Capturas en WebP (escritorio y proyectos)
│   └── _headers           # Política de caché de Cloudflare Assets
├── src/
│   ├── main.ts            # Entry de cliente: revelado, header y copyright
│   ├── i18n-variants.ts   # Deriva las dos variantes (ES/EN) del index.html
│   ├── proyectos.ts       # Datos de los cuatro proyectos
│   ├── proyecto-pagina.ts # Plantilla de la ficha de proyecto
│   ├── styles/            # styles.css + animations.css
│   └── *.test.ts          # 68 tests (Vitest + happy-dom)
├── index.html             # Documento único: de aquí salen ES, EN y las fichas
├── vite.config.ts         # Plugin de páginas + ajustes de lint, formato y test
├── wrangler.jsonc         # Cloudflare Workers Assets
├── scripts/               # Recorte de fuentes (subset-fonts.sh)
├── odd/                   # Tracker ODD: protocolo y plan del proyecto
├── AGENTS.md              # Contexto para los agentes que tocan el repo
├── NOTES.md               # Bitácora de decisiones técnicas
└── THIRD-PARTY-NOTICES.md # Licencias y procedencia de fuentes e iconos
```

## 🚀 Inicio rápido

```bash
vp install        # dependencias
vp dev            # servidor de desarrollo
vp check          # formato + lint + tipos
vp test           # 68 tests
vp build          # bundle de producción
vp run preview    # build + servidor de Wrangler
vp run deploy     # build + despliegue (requiere autorización del autor)
```

## 🗺️ Estado del proyecto

Última revisión: **30/10/2026**.

- [x] **Internacionalización** — `/en/` real con canonical y `hreflang` recíprocos, derivado del mismo `index.html`.
- [x] **Ficha por proyecto** — cuatro proyectos, cada uno con su página en los dos idiomas.
- [x] **Tarjetas de proyecto** — con rol, datos y capturas en WebP.
- [x] **Diseño responsivo** — ancho de lectura de 60rem y compactación a ≤ 40rem.
- [x] **Micro-interacciones** — scroll suave, transiciones en enlaces y revelado de secciones al entrar en pantalla.
- [x] **Tipografía** — Maple Mono recortada al juego de caracteres del sitio (323 KB → 154 KB).
- [x] **Assets** — capturas en WebP y caché de una semana para `/images/*`.
- [ ] **Personalización de los acordeones** — los `<details>` de "Curiosidades" conservan el marcador nativo del navegador.

### Accesibilidad y SEO

- Jerarquía de encabezados corregida: un `h1` y un `h2` por sección.
- `aria-hidden` en los iconos decorativos, `aria-label` en los enlaces con solo icono y `aria-current` en el selector de idioma.
- Metaetiquetas Open Graph y Twitter Cards, con imagen y dimensiones.

---

_Para el detalle de por qué se hicieron estos cambios, consulta [`NOTES.md`](./NOTES.md) y el tracker [`odd/`](./odd/README.md)._
