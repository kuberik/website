#!/bin/bash
# Add rounded corners, border, and shadows to feature card images
# Requires ImageMagick: apt install imagemagick or brew install imagemagick

set -e

IMAGES_DIR="$(dirname "$0")/../static/images"

# Images used on the front page feature cards (light and dark versions)
IMAGES=(
  "rollouts_overview.png"
  "deployment_gates.png"
  "health_verification.png"
  "canary_strategies.png"
  "rollouts_overview_dark.png"
  "deployment_gates_dark.png"
  "health_verification_dark.png"
  "canary_strategies_dark.png"
)

# Corner radius in pixels
RADIUS=12

# Border color (subtle gray)
BORDER_COLOR="#e5e7eb"

for img in "${IMAGES[@]}"; do
  src="$IMAGES_DIR/$img"
  base="${img%.png}"
  dst="$IMAGES_DIR/${base}-shadow.png"

  if [[ -f "$src" ]]; then
    echo "Processing $img -> ${base}-shadow.png..."

    # Get image dimensions
    width=$(identify -format "%w" "$src")
    height=$(identify -format "%h" "$src")
    wm1=$((width-1))
    hm1=$((height-1))

    # Step 1: Create rounded rectangle mask
    convert -size ${width}x${height} xc:none \
      -fill white -draw "roundrectangle 0,0,$wm1,$hm1,$RADIUS,$RADIUS" \
      /tmp/mask_$$.png

    # Step 2: Apply mask to source image (creates rounded corners with transparency)
    convert "$src" /tmp/mask_$$.png \
      -alpha off -compose CopyOpacity -composite \
      /tmp/rounded_$$.png

    # Step 3: Add a subtle border stroke around the rounded rectangle
    convert /tmp/rounded_$$.png \
      \( -size ${width}x${height} xc:none \
         -fill none -stroke "$BORDER_COLOR" -strokewidth 1 \
         -draw "roundrectangle 0,0,$wm1,$hm1,$RADIUS,$RADIUS" \) \
      -compose Over -composite \
      /tmp/bordered_$$.png

    # Step 4: Add padding and shadow
    convert /tmp/bordered_$$.png \
      -bordercolor none -border 30x30 \
      \( +clone -background 'rgba(0,0,0,0.15)' -shadow 40x20+8+8 \) \
      +swap -background none -layers merge +repage \
      "$dst"

    # Cleanup
    rm -f /tmp/mask_$$.png /tmp/rounded_$$.png /tmp/bordered_$$.png

    echo "Done: ${base}-shadow.png"
  else
    echo "Skipping $img (not found)"
  fi
done

echo "All images processed."
