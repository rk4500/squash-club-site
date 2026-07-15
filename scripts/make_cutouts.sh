#!/usr/bin/env bash
# Removes backgrounds from committee photos and normalises to 800x1200 canvas
# Originals preserved in public/images/committee/*.jpeg
# Cutouts written to public/images/committee/cutouts/*.png

set -euo pipefail

SRC_DIR="$(dirname "$0")/../public/images/committee"
OUT_DIR="$SRC_DIR/cutouts"
mkdir -p "$OUT_DIR"

photos=("$SRC_DIR"/ec_*.jpeg "$SRC_DIR"/cc_*.jpeg)

for photo in "${photos[@]}"; do
  name=$(basename "$photo" .jpeg)
  out="$OUT_DIR/${name}.png"

  echo "▶ $name"

  uv run --python 3.9 \
    --with "rembg[cli]" \
    --with onnxruntime \
    rembg i "$photo" "$out"

  # Trim transparent border, bottom-align on 800x1200 canvas
  magick "$out" \
    -trim \
    -background none \
    -gravity South \
    -extent 800x1200 \
    "$out"

  echo "  ✓ $out"
done

echo ""
echo "Done. $(ls "$OUT_DIR"/*.png 2>/dev/null | wc -l) cutouts in $OUT_DIR"
