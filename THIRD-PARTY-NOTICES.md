# Third-party notices

Este repositorio **vendoriza** material de terceros: no los instala desde npm
en tiempo de ejecución, sino que copia sus archivos al repo. Por eso los
avisos de licencia y la procedencia viven aquí y no en `node_modules`.

Regla de la casa: si algo de terceros entra al repo, su aviso de licencia entra
con él, aunque el archivo valga dos kilobytes.

---

## Solar Icons

| Campo       | Valor                                     |
| :---------- | :---------------------------------------- |
| Paquete     | `@solar-icons/static@2.3.3`               |
| Estilo      | `Linear`                                  |
| Autoría     | Hakim Saoudi — <https://hakimsaoudi.dev>  |
| Repositorio | <https://github.com/saoudi-h/solar-icons> |
| Licencia    | MIT                                       |

**Qué se vendoriza**: los 16 iconos de utilidad de `index.html` (traducción,
flechas, casa, usuario, cuaderno, apretón de manos, carpeta, cohete, monitor,
gato, ramas de git, bifurcación de git, tarjeta de usuario, carta y chat). El
path data va **inline** dentro del `<svg>`, no como archivo aparte.

**Por qué inline y no como dependencia**: `@solar-icons/static` son 26 210
archivos y 75 MB descomprimidos, y su forma de uso documentada
(`import url from "@solar-icons/static/bold/home.svg"`) solo resuelve dentro de
un módulo JS que procese un bundler. Este sitio es un `index.html` escrito a
mano sin framework, y Vite no puede inyectar markup `<svg>` en el HTML plano.
Además, un `<img src="…svg">` no hereda `currentColor`: el icono quedaría con
un color fijo y se romperían el tema y los estados hover. Un sprite externo
(`<use href="…#id">`) sí conservaría `currentColor`, pero costaría los mismos
bytes más una petición extra. El paquete `@solar-icons/js` queda descartado:
inyecta en runtime y rompe el presupuesto de 1.1 kB de JS gzipped.

**Cómo se obtuvieron**: con el CLI efímero, sin añadir nada a `package.json`:

```bash
pnpm dlx @solar-icons/cli get <icono> --style linear --out ./<icono>.svg
```

Mapeo aplicado (Lucide → Solar Linear): `languages→translation`,
`chevron-right→arrow-right`, `chevron-left→arrow-left`, `house→home`,
`user→user`, `notebook-pen→notebook`, `heart-handshake→hand-shake`,
`folder-code→folder`, `rocket→rocket`, `monitor→monitor`, `cat→cat`,
`git-branch→git-branch`, `folder-git-2→git-fork`, `user-round-search→user-id`,
`mail-plus→letter`, `message-square-lock→chat-round`.

**Licencia**:

```
MIT License

Copyright (c) 2024 Hakim Saoudi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Maple Mono (fuentes)

| Campo     | Valor                                                                         |
| :-------- | :---------------------------------------------------------------------------- |
| Paquete   | `Maple Mono` — Maple Mono v7.9, sin parche de Nerd Fonts                      |
| Ubicación | `public/fonts/MapleMono-{Regular,Italic,Bold,BoldItalic}.ttf.woff2`           |
| Autoría   | The Maple Mono Project Authors — <https://github.com/subframe7536/maple-font> |
| Licencia  | SIL Open Font License 1.1 (OFL-1.1)                                           |

**Copyright**:

```
Copyright 2022 The Maple Mono Project Authors (https://github.com/subframe7536/maple-font)
```

Estas cuatro `.woff2` son **153 744 B** y son el mayor peso del sitio. La licencia OFL
pide que el aviso viaje con la fuente; aquí vive en este archivo, y ese es el motivo
de que exista esta sección y no solo la de los iconos.

> **Corrección (L19)**: el aviso anterior acreditaba un parche de Nerd Fonts (Ryan L
> McIntyre) sobre estas fuentes. **No lo tienen.** La `name` table de los cuatro
> archivos dice family `Maple Mono`, versión 7.900, sin una sola mención de Nerd Fonts,
> y sus únicos codepoints de uso privado son los powerline del propio Maple Mono
> (`U+E0A0`–`E0B7`, `EE00`–`EE0B`): el `MapleMono-TTF.zip` de upstream v7.9 tiene los
> mismos 1 935 glifos. La atribución y el `font-family` del CSS se corrigieron para
> decir lo que los archivos son.

**Recorte**: las cuatro caras se subconjuntan al juego de caracteres del sitio (Latin-1
completo más los signos que el copy puede usar) porque cada una traía 1 935–2 060
glifos para 95 caracteres en uso: **323 044 B → 153 744 B** (−52 %). La OFL-1.1 de
Maple Mono **no declara Reserved Font Name**, así que el recorte es lícito siempre que
este aviso viaje con la fuente. Se regeneran con `bash scripts/subset-fonts.sh`: los
archivos recortados están commiteados y ni el build ni el CI necesitan fonttools.

Texto completo de la OFL-1.1: <https://scripts.sil.org/OFL>.

---

## Pendiente de identificar

- `public/icons/linux_maletin.png` — favicon. Procedencia no documentada: hay que
  confirmar de dónde salió y con qué licencia antes de dar el sitio por cerrado.
- `public/images/proyectos/*.webp` y `public/images/showcase.webp` — capturas de
  los sitios del autor y de su escritorio. Material propio, no de terceros.
