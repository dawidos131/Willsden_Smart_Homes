#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${AUDIT_BASE_URL:-https://4f832c8c2c1563.lhr.life}"
AUDIT_DIR=".audit"
URLS_FILE="${AUDIT_DIR}/urls.json"
HEADERS_DIR="${AUDIT_DIR}/headers"

mkdir -p "${HEADERS_DIR}"

read_urls() {
  if [[ -f "${URLS_FILE}" ]]; then
    node -e '
      const fs = require("node:fs");
      const data = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
      if (Array.isArray(data.urls) && data.urls.length > 0) {
        for (const url of data.urls) {
          if (typeof url === "string") {
            console.log(url);
          }
        }
      }
    ' "${URLS_FILE}"
  fi
}

URLS="$(read_urls || true)"
if [[ -z "${URLS}" ]]; then
  URLS="${BASE_URL}"
fi

while IFS= read -r url; do
  [[ -z "${url}" ]] && continue

  filename="$(printf '%s' "${url}" | sed -E 's#https?://##; s#[^A-Za-z0-9]+#-#g; s#^-+|-+$##g' | cut -c1-140)"
  [[ -z "${filename}" ]] && filename="page"

  output_file="${HEADERS_DIR}/${filename}.txt"

  {
    echo "# URL: ${url}"
    echo "# CapturedAt: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    echo
    curl -sS -L -I --connect-timeout 15 --max-time 45 "${url}" || true
  } > "${output_file}"
done <<< "${URLS}"

echo "Header inspection complete: $(find "${HEADERS_DIR}" -type f | wc -l) files written to ${HEADERS_DIR}."
