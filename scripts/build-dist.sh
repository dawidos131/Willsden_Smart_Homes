#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
DIST_DIR="${ROOT_DIR}/dist"

# Start from a clean deployment directory.
rm -rf "${DIST_DIR}"
mkdir -p "${DIST_DIR}"

# Copy only HTML files from repo root.
shopt -s nullglob
for html_file in "${ROOT_DIR}"/*.html; do
  cp -a "${html_file}" "${DIST_DIR}/"
done
shopt -u nullglob

# Copy website assets directory.
if [[ -d "${ROOT_DIR}/assets" ]]; then
  cp -a "${ROOT_DIR}/assets" "${DIST_DIR}/assets"
fi

# Copy required static root files.
required_files=(
  "favicon.png"
  "og-preview.jpg"
  "logo-200x200.png"
  "robots.txt"
  "sitemap.xml"
  "insurance-certificate.pdf"
  "insurance-thumb.png"
)

for file in "${required_files[@]}"; do
  if [[ -f "${ROOT_DIR}/${file}" ]]; then
    cp -a "${ROOT_DIR}/${file}" "${DIST_DIR}/${file}"
  fi
done

# Copy any image files referenced by root HTML files.
shopt -s nullglob
root_html_files=("${ROOT_DIR}"/*.html)
shopt -u nullglob

if (( ${#root_html_files[@]} > 0 )); then
  mapfile -t referenced_images < <(
    {
      rg -No --no-filename \
        -e "(?:src|href|srcset)=[\"']([^\"' ,]+\\.(?:png|jpe?g|gif|webp|svg|avif|ico|bmp|tiff?)(?:\\?[^\"']*)?(?:#[^\"']*)?)(?: [^\"']*)?[\"']" \
        -r '$1' "${root_html_files[@]}" || true
    } \
    | sed -E 's/[?#].*$//' \
    | sort -u
  )
else
  referenced_images=()
fi

for ref in "${referenced_images[@]}"; do
  [[ -z "${ref}" ]] && continue

  case "${ref}" in
    http://*|https://*|//*|data:*|mailto:*|tel:*|javascript:*)
      continue
      ;;
  esac

  rel_path="${ref#./}"
  rel_path="${rel_path#/}"

  # Ignore suspicious upward paths.
  if [[ "${rel_path}" == *".."* ]]; then
    continue
  fi

  src_path="${ROOT_DIR}/${rel_path}"
  dst_path="${DIST_DIR}/${rel_path}"

  if [[ -f "${src_path}" ]]; then
    mkdir -p "$(dirname "${dst_path}")"
    cp -a "${src_path}" "${dst_path}"
  fi
done

# Safety cleanup: enforce exclusion rules in dist.
find "${DIST_DIR}" -type f \( -name '*.docx' -o -name '*.tsx' \) -delete
rm -rf "${DIST_DIR}/Media"
find "${DIST_DIR}" -mindepth 1 -maxdepth 1 -type d -name 'Logo - *' -exec rm -rf {} +

echo "Built clean deploy directory at ${DIST_DIR}"
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
DIST_DIR="$ROOT_DIR/dist"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

find "$ROOT_DIR" -maxdepth 1 -type f \( \
  -name '*.html' -o \
  -name '*.png' -o \
  -name '*.jpg' -o \
  -name '*.jpeg' -o \
  -name '*.webp' -o \
  -name '*.avif' -o \
  -name '*.svg' -o \
  -name '*.pdf' -o \
  -name '*.ico' -o \
  -name '*.txt' -o \
  -name '*.xml' -o \
  -name '*.webmanifest' -o \
  -name 'robots.txt' -o \
  -name 'sitemap.xml' -o \
  -name 'favicon.*' \
\) -exec cp {} "$DIST_DIR/" \;

if [ -d "$ROOT_DIR/assets" ]; then
  cp -R "$ROOT_DIR/assets" "$DIST_DIR/assets"
fi

printf 'Built dist at %s\n' "$DIST_DIR"
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
