# 📚 Notas de Aprendizaje y Retroalimentación Semántica

Este documento sirve como bitácora de los aprendizajes técnicos y las decisiones de diseño tomadas durante la modularización y optimización de mi portafolio.

---

## 🏗️ 1. Semántica y Estructura HTML5

### <div> vs Elementos Semánticos
- **El problema de los divs sueltos:** Evitamos envolver elementos como `<h1>` o `<nav>` en un `<div>` extra si no tiene una función de estilo o de agrupación real. Menos nodos en el DOM = mejor rendimiento y accesibilidad.
- **Jerarquía H1-H6:** Los encabezados construyen el índice lógico de la página. Un `h4` no debe aparecer al mismo nivel que un `h2` si no es su subsección.

### El uso de `<aside>`
- **Contexto:** Se utiliza para contenido tangencial o complementario. Si una sección de "Mis Gustos" está asociada exclusivamente a "Mi Vida", el `<aside>` debe vivir **dentro** de la `<section>` correspondiente.

---

## ♿ 2. Accesibilidad (A11y) con ARIA

### Atributo `aria-labelledby`
- **Importancia:** Permite que las etiquetas `<section>` sean reconocidas como *Puntos de Referencia* (Landmarks) por lectores de pantalla.
- **Relación:** Crea una conexión ID-Referencia: `<section aria-labelledby="id-del-titulo">`.

### Atributo `aria-hidden="true"`
- **Uso correcto:** Sirve para ocultar elementos **decorativos** (como emojis o iconos) de los dispositivos asistivos para evitar "ruido" en la lectura.
- **Cuidado:** No debe ponerse en el enlace (`<a>`) completo, sino solo en el elemento interior decorativo (ejm: `<span>`), para que el texto descriptivo del enlace siga siendo audible.

### Atributos `aria-label` en `<nav>`
- **Problemática:** Si tienes más de un `<nav>`, el navegador necesita saber para qué sirve cada uno. Por eso usamos `aria-label="Índice de Contenido"` y `aria-label="Redes Sociales"`.

---

## 🌐 3. Presencia en Redes y SEO

### Open Graph (OG)
- **Función:** Define cómo se ve tu sitio al compartirse en WhatsApp, Facebook o LinkedIn.
- **Puntos críticos:** `og:image`, `og:title` y `og:description` son los mínimos viables para un CTR (Click-Through Rate) exitoso.

### Twitter Cards
- **Diferenciación:** Aunque Twitter lee OG, tiene sus propios metadatos (`twitter:card`, `twitter:image`). Usar `summary_large_image` garantiza una previsualización visualmente atractiva en X/Twitter.

### URL Canónica
- **Importancia:** Evita el contenido duplicado en buscadores y asegura que el ranking se concentre en la URL principal (`kat404.github.io/Portfolio`).

---

## 🚀 4. Lógica Dinámica en Astro

### Inyectar lógica en el JS de Astro
- **getFullYear():** No escribimos el año del copyright a mano. Usamos `const year = new Date().getFullYear();` en el frontmatter (entre `---`) y lo inyectamos con `{year}`.
- **Ahorro de mantenimiento:** Esto previene que el sitio se vea "viejo" o desactualizado por falta de mantenimiento manual.

---

## 🧹 5. Limpieza de Malas Prácticas

- **Atributos de presentación:** Evitamos usar `<ol type="1">` o `<li value="2">`. El estilo es responsabilidad exclusiva del CSS.
- **Br as separator:** El `<br />` no debe usarse para separar secciones de diseño; para eso existen los márgenes y paddings en CSS.
- **`role` redundantes:** No es necesario poner `role="main"` en un `<main>` o `role="navigation"` en un `<nav>`, ya que son sus funciones nativas implícitas.

---
*En este proyecto, hemos priorizado la calidad del código y la accesibilidad por encima de lo visual en esta fase temprana.*
