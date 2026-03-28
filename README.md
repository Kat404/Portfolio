# Portafolio Personal — José Luis

Frontend Developer JR | Estudiante de Ingeniería en Sistemas Computacionales.

## 📋 Descripción
Este proyecto es un portafolio personal minimalista construido con **Astro**. Su objetivo es servir como base de aprendizaje en desarrollo web modular, manteniendo un enfoque en HTML semántico y CSS puro.

## 🗂️ Estructura del Proyecto
- `src/components/` — Fragmentos de UI reutilizables (Header, Footer).
- `src/layouts/` — Estructura base de las páginas.
- `src/pages/` — Rutas y contenido principal.
- `public/` — Recursos estáticos como imágenes y media.

## 🚀 Inicio Rápido
```bash
bun install
bun dev
```

---

## 🗺️ Roadmap

Análisis semántico y de buenas prácticas del estado actual del HTML. Prioridades: accesibilidad, semántica, SEO y organización. Sin cambios aplicados aún; solo observaciones para futuras iteraciones.

---

### 🔴 Crítico — Semántica y Estructura

#### 1. Jerarquía de encabezados rota (`index.astro`)
La jerarquía `h2 → h2 → h3 → h2 → h3 → h4` no es lineal ni coherente. La regla de oro es que los encabezados deben descender de nivel sin saltar (un `h4` no debe aparecer al mismo nivel que un `h2` anterior si no es su subsección directa). Concretamente:
- "Sobre Mí" → `h2`
- "Mi Vida" → `h2`
- "Mis Gustos" (`<aside>`) → `h3` ✓ (está bien como sección lateral)
- "Mis Proyectos" → `h2` ✓
- "Tecnologías de Interés" → `h3` — debería ser `h2` si es una sección de igual peso
- "Curiosidades sobre Mí" → `h4` — debería ser `h2`, ya que es una sección principal de la página, no una subsección de nada

Los motores de búsqueda y lectores de pantalla usan esta jerarquía para construir el índice de contenido de la página. Una jerarquía rota penaliza el SEO y dificulta la navegación con tecnologías asistivas.

#### 2. `<aside>` fuera de contexto semántico (`index.astro`, línea 52)
El `<aside>` de "Mis Gustos" está flotando entre "Mi Vida" y "Mis Proyectos", siendo semánticamente contenido complementario a "Mi Vida". Debería estar **dentro** de la `<section>` de "Mi Vida" o justificarse por qué está separado. Un `<aside>` al nivel del `<main>` implica que es complementario a *toda* la página, no solo a una sección.

#### 3. `<section>` sin etiqueta `aria-label` o `aria-labelledby`
Según la especificación ARIA, los elementos `<section>` solo son reconocidos como landmarks (puntos de navegación para lectores de pantalla) si tienen un nombre accesible mediante `aria-label` o `aria-labelledby`. Sin esto, los lectores de pantalla los tratan como `<div>` genéricos. Cada `<section>` debería tener su `h2` referenciado: `<section aria-labelledby="sobre-mi">`.

---

### 🟠 Importante — Accesibilidad

#### 4. Links externos sin `rel="noopener"` (`Header.astro`)
Los enlaces a GitHub y Reddit usan `rel="noreferrer"`, lo cual es correcto (ya que `noreferrer` implica `noopener`). Sin embargo, este patrón no está documentado explícitamente. La observación es formal: `rel="noopener noreferrer"` explícito es más legible y la intención queda más clara para futuros mantenedores.

#### 5. `<nav>` mezcla dos tipos de navegación sin distinción (`Header.astro`)
El `<nav>` contiene tanto enlaces de ancla internos (a secciones del mismo page) como enlaces a redes sociales externas. Semánticamente, estos son dos grupos distintos de navegación. Lo ideal sería:
- Un `<nav aria-label="Índice de contenido">` para las secciones internas.
- Un `<nav aria-label="Redes Sociales">` o simplemente un `<ul>` fuera del nav principal para los links externos.

Usar un solo `<nav>` para ambos tipos confunde a los lectores de pantalla, que anunciarán el bloque completo como "navegación" sin distinción.

#### 6. `<p>` dentro de `<nav>` (`Header.astro`, línea 18)
El texto "Redes Sociales:" está envuelto en un `<p><small>`, dentro del `<nav>`. Los `<p>` no son hijos válidos de `<nav>` en el contexto semántico esperado y pueden causar comportamientos inesperados en el parsing del DOM. Lo correcto sería usar un elemento no-flow como `<span>`, o mejor aún, separar los links de redes en su propio bloque con un encabezado apropiado.

#### 7. `<br />` como separador de contenido (`Header.astro`, línea 17)
El `<br>` se usa para crear separación visual entre los links de navegación y los de redes sociales. `<br>` es semánticamente para saltos de línea dentro de un bloque de texto (poesía, direcciones postales), no para separar bloques de contenido. Para esto se deben usar márgenes CSS o estructuras HTML separadas.

#### 8. `id="aficiones"` en un `<p>` que no encabeza nada (`index.astro`, línea 35)
El nav del header enlaza `#aficiones`, pero ese id está puesto en el `<p>` introductorio de la lista de aficiones. Los ids de ancla para navegación deberían estar en el encabezado semántico de la sección de destino o en la `<section>` misma, no en un párrafo interior. Esto puede hacer que el scroll-to lleve al usuario al lugar incorrecto visualmente.

#### 9. Falta `<address>` para la información de contacto (`Footer.astro`)
El `<footer>` contiene un email, un teléfono y un WhatsApp que son datos de contacto del autor. HTML5 tiene la etiqueta `<address>` específicamente para esto, que además tiene implicaciones semánticas para los motores de búsqueda (Schema.org compatible). Envolver ese bloque `<p>` en `<address>` sería semánticamente correcto.

#### 10. Emojis en links sin texto alternativo (`Footer.astro`)
Los enlaces de contacto usan emojis (📬, 📲, 💬) como complemento visual al texto. Aunque hay texto visible, los emojis por sí solos no tienen `aria-label` alternativo. Si en el futuro el texto desapareciera y solo quedara el emoji como contenido del link, sería completamente inaccesible para lectores de pantalla. Se recomienda marcar los emojis con `aria-hidden="true"` y asegurarse de que el texto del link sea siempre descriptivo por sí mismo.

---

### 🟡 Mejorable — SEO y Metadatos

#### 11. URL canónica desactualizada (`BaseLayout.astro`, línea 39)
La URL canónica apunta a `https://kat404.github.io/FrontEnd-Aprendizaje`, que parece ser el repositorio de aprendizaje anterior, no el portafolio actual. Debería apuntar a la URL final de despliegue del portafolio.

#### 12. `og:image` comentada (`BaseLayout.astro`, línea 62)
La etiqueta Open Graph de imagen está comentada. Sin imagen OG, al compartir el link en redes sociales no se generará una preview visual, lo que reduce significativamente el CTR (Click Through Rate) desde redes sociales. Debería existir una imagen 1200×630px representativa del portafolio.

#### 13. Falta `og:site_name` y metadatos de Twitter Card
Para una cobertura OG completa se recomienda añadir:
- `og:site_name` — nombre del sitio
- `twitter:card`, `twitter:title`, `twitter:description` — para previews en X/Twitter

#### 14. `<link rel="alternate">` para versión en inglés sin página existente (`BaseLayout.astro`, línea 35)
Se declara un `hreflang="en"` apuntando a `https://kat404.github.io/en`, pero al parecer no existe una versión en inglés del sitio. Declarar alternates que no existen puede confundir a los motores de búsqueda. Debería eliminarse hasta que la versión en inglés esté lista.

#### 15. `<title>` duplica información innecesaria
El título actual es `"Portafolio Personal - José Luis - Frontend Developer JR"`. El año del copyright en el footer es 2025, pero el proyecto fue actualizado en 2026. Los títulos deberían revisarse en conjunto cuando se itere en el contenido.

---

### 🟢 Observaciones de Organización y Buenas Prácticas

#### 16. `role="main"` redundante en `<main>` (`index.astro`, línea 7)
El atributo `role="main"` es redundante en `<main>`, ya que el elemento `<main>` ya tiene ese rol implícito por especificación. Si bien no rompe nada, añade ruido innecesario al markup y puede confundir a futuros lectores del código.

#### 17. `role="navigation"` redundante en `<nav>` (`Header.astro`, línea 8)
Idéntico al punto anterior: `<nav>` ya tiene `role="navigation"` de forma implícita.

#### 18. `<div>` envolventes sin propósito semántico en `Header.astro`
El `<h1>` está envuelto en un `<div>` (línea 3) y el `<nav>` en otro `<div>` (línea 7), sin que aporten estructura semántica. Cuando llegue el momento de aplicar CSS, estos wrappers podrían necesitar clases específicas que justifiquen su existencia o simplemente eliminarse si el layout puede lograrse sin ellos.

#### 19. `<footer>` dentro de `<section>` para una cita (`index.astro`, línea 114)
El `<footer>` usado dentro de la sección "Tecnologías de Interés" para envolver la cita motivacional es un uso válido de `<footer>` (HTML5 permite `<footer>` dentro de secciones). Sin embargo, semánticamente una cita debería usar `<blockquote>` con `<cite>` si tiene autoría, o simplemente `<p>` con estilos si es un comentario personal. Usar `<footer>` para esto crea ambigüedad sobre qué rol juega ese texto.

#### 20. `<ol type="1">` con atributo `type` deprecado en HTML5
El atributo `type="1"` en `<ol>` es heredado de HTML4. En HTML5, el estilo de las listas (numeración, viñetas, formato) es responsabilidad del CSS mediante `list-style-type`. Si bien funciona en todos los navegadores, va en contra de la separación de responsabilidades entre HTML (estructura) y CSS (presentación).

#### 21. `<li value="2">` en una lista cuyos elementos ya están en orden (`index.astro`, línea 110)
Se fuerza `value="2"` en el segundo `<li>` de una lista que ya numeraría 1, 2, 3 de forma natural. No añade ningún valor y es código redundante.

#### 22. Copyright con año estático
El año `© 2025` en el footer está hardcodeado. En Astro se puede usar JavaScript puro en el frontmatter para generarlo dinámicamente: `const year = new Date().getFullYear()`.

---

*Roadmap generado el 28/03/2026. Para ser revisado antes de iniciar el ciclo de estilos CSS.*
