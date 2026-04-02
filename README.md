# Portafolio Personal — José Luis

Frontend Developer JR | Estudiante de Ingeniería en Sistemas Computacionales.

## 📋 Descripción

Este proyecto es un portafolio personal minimalista construido con **Astro**. Su objetivo es servir como base de aprendizaje en desarrollo web modular, manteniendo un enfoque en HTML semántico y CSS puro.

## 🛠️ Tecnologías Usadas

- **Astro 6.1.3** — Framework web para optimizar el rendimiento.
- **HTML5** — Estructura semántica avanzada.
- **CSS3** — Diseño visual.
- **Bun** — Runtime y gestor de paquetes.
- **Wrangler** - Plataforma de Desarrollo para Cloudflare

## 🗂️ Estructura del Proyecto

```text
Portfolio/
├── public/              # Recursos estáticos (imágenes, iconos)
│   ├── fonts/           # Fuentes tipográficas web (WOFF2)
│   ├── images/          # Imágenes
│   └── icons/           # Íconos & Logos
├── src/
│   ├── components/      # Fragmentos de UI (Header, Footer)
│   ├── layouts/         # Plantillas Base (BaseLayout)
│   ├── pages/           # Página Web Base y Contenidos (index.astro)
│   └── styles/          # Hojas de estilo globales (CSS)
├── README.md            # Documentación general
└── NOTES.md             # Apuntes y retroalimentación
```

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun dev
```

---

## 🗺️ Roadmap & Estado del Proyecto

Análisis de accesibilidad, semántica y SEO.
Última gran revisión: **30/03/2026**.

### 🌟 Mejoras Implementadas

| Categoría | Mejora Realizada | Impacto |
| :--- | :--- | :--- |
| **Arquitectura** | Modularización en Layouts y Componentes | Mantenibilidad |
| **Semántica** | Corrección de jerarquía de encabezados (H1-H2) | SEO / Accesibilidad |
| **Accesibilidad** | Uso de `aria-labelledby` y `aria-hidden` | Lectores de pantalla |
| **SEO** | Metaetiquetas Open Graph y Twitter Cards | Presencia en redes |
| **Buenas Prácticas** | Limpieza de atributos de presentación y lógica dinámica | Código limpio |

---

### ⏳ Pendientes & Futuras Mejoras

- [ ] **Diseño Responsivo & Layout Base** — Limitar el ancho de lectura (max-width), centrar el contenido y asegurar espaciados (paddings/margins) consistentes.
- [x] **Sistema de Tipografía Mejorado** — Ajustar alturas de línea (line-height), jerarquía visual de tamaños (clamp/rem) e interlineado para legibilidad en fuentes monospace. (Implementado vía `@font-face` y WOFF2).
- [ ] **Navegación (Header & Nav)** — Convertir el menú de navegación en una barra flexible (Flexbox), horizontal y fija (sticky) para facilitar el recorrido.
- [ ] **Tarjetas de Proyectos (Cards)** — Transformar las listas de proyectos en tarjetas interactivas con efectos de hover (elevación/transición).
- [ ] **Micro-interacciones y Animaciones** — Scroll suave (smooth scrolling), transiciones sutiles en botones/enlaces, y personalización de los acordeones (`<details>`).
- [ ] **Internacionalización** — Activar la versión en Inglés (`hreflang`).
- [ ] **Optimización de Assets** — Asegurar que `/public/images/` contenga todas las assets locales.

---

### 📜 Historial de Versiones

- **v1.5.0 (01/04/26):** Modularización revertida, añadición de íconos Lucide, ajustes al CSS.
- **v1.4.0 (30/03/26):** Refactor CSS integral (variables `:root`, colores `oklch`, arquitectura Modular) y optimización de fuentes auto-alojadas.
- **v1.3.1 (30/03/26):** Correción mínima dentro del README.md.
- **v1.3.0 (30/03/26):** Implementación básica de CSS (con colores tipo Catppucin y fuente NF).
- **v1.2.0 (29/03/26):** Implementación de metadatos sociales (Twitter Cards/OG) y corrección de accesibilidad en emojis.
- **v1.1.0 (29/03/26):** Reestructuración semántica global. Se aplicó `aria-labelledby` y se corrigió la jerarquía de títulos.
- **v1.0.0 (28/03/26):** Migración exitosa de HTML puro a estructura modular en Astro con Layouts.

---
*Para detalles técnicos sobre por qué se hicieron estos cambios, consulta el archivo [NOTES.md](./NOTES.md).*
