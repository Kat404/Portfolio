#!/usr/bin/env bash
# ? Regenera las cuatro caras de Maple Mono recortadas al juego de caracteres del sitio.
# ? Los subsets se commitean: el build y el CI de Cloudflare no necesitan fonttools.
# ? Uso: bash scripts/subset-fonts.sh
set -euo pipefail

cd "$(dirname "$0")/.."
FUENTES=(MapleMono-Regular MapleMono-Italic MapleMono-Bold MapleMono-BoldItalic)

if ! command -v woff2_decompress >/dev/null; then
  echo "falta woff2_decompress (paquete woff2)" >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# ? Latin-1 completo + los signos que el copy puede usar (guiones, comillas, flechas).
# ? Es deliberadamente más ancho que los caracteres actuales: el copy futuro no debe
# ? salir con tofu por usar un signo que la fuente recortada ya no trae.
python3 - "$TMP/charset.txt" <<'PY'
import sys
with open(sys.argv[1], "w", encoding="utf-8") as f:
    f.write("".join(chr(i) for i in range(0x20, 0x100)) + "—–’‘“”•→←↑↓€£¥§¶†‡«»¡¿…")
PY

total_antes=0
total_despues=0

for cara in "${FUENTES[@]}"; do
  origen="public/fonts/${cara}.ttf.woff2"

  cp "$origen" "$TMP/${cara}.in.woff2"
  woff2_decompress "$TMP/${cara}.in.woff2" >/dev/null
  # ? woff2_decompress cambia la extension: .in.woff2 -> .in.ttf
  mv "$TMP/${cara}.in.ttf" "$TMP/${cara}.ttf"

  uvx --from "fonttools[woff]" pyftsubset "$TMP/${cara}.ttf" \
    --text-file="$TMP/charset.txt" \
    --flavor=woff2 \
    --output-file="$TMP/${cara}.woff2" \
    --layout-features='*' \
    --no-hinting \
    --desubroutinize

  antes="$(stat -c%s "$origen")"
  despues="$(stat -c%s "$TMP/${cara}.woff2")"
  total_antes=$((total_antes + antes))
  total_despues=$((total_despues + despues))

  cp "$TMP/${cara}.woff2" "$origen"
  printf '%-26s %8s -> %8s B\n' "$cara" "$antes" "$despues"
done

printf '\ntotal %24s -> %8s B\n' "$total_antes" "$total_despues"
