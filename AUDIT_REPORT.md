# Audit Report

## 1) Google API key pattern occurrences (`[REDACTED_PREFIX]`)

- `reviews.html:194` — `data-api-key="[REDACTED_KEY]"`
- `index.html:369` — `data-api-key="[REDACTED_KEY]"`

## 2) Opening-hours string occurrences

- `faq.html:84` — `Mon-Sat 8-6`
- `faq.html:321` — `Weekdays 08:00-15:00`
- `SiteHeader.tsx:232` — `Mon-Sat 8-6`
- `smart-home.html:47` — `Mon-Sat 8-6`
- `smart-home.html:339` — `Weekdays 08:00-15:00`
- `reviews.html:28` — `Mon-Sat 8-6`
- `reviews.html:287` — `Weekdays 08:00-15:00`
- `areas.html:28` — `Mon-Sat 8-6`
- `areas.html:292` — `Weekdays 08:00-15:00`
- `about.html:50` — `Mon-Sat 8-6`
- `services.html:46` — `Mon-Sat 8-6`
- `services.html:379` — `Weekdays 08:00-15:00`
- `contact.html:36` — `Mon-Sat 8-6`
- `contact.html:215` — `Weekdays 08:00-15:00`
- `contact.html:216` — `Limited evenings/weekends by prior arrangement.`
- `contact.html:292` — `Weekdays 08:00-15:00`
- `pricing-booking.html:28` — `Mon-Sat 8-6`
- `pricing-booking.html:219` — `Availability: Weekdays 08:00-15:00. Limited evening/weekend slots may be possible with advance booking.`
- `pricing-booking.html:286` — `Weekdays 08:00-15:00`
- `automation.html:46` — `Mon-Sat 8-6`
- `automation.html:318` — `Weekdays 08:00-15:00`
- `index.html:73` — `Mon-Sat 8-6`
- `index.html:239` — `Availability: Weekdays 08:00-15:00 (limited evenings/weekends)`

## 3) Top 10 largest assets

| Bytes | Human size | File |
| ---: | ---: | --- |
| 2325577 | 2.3MB | `./thermostat-backplate.jpg` |
| 1142345 | 1.1MB | `./Media/user-PxzprgQOH9FFojsUw0Djw7nv_gen_01kjdt68z6emxbs4mg2ayyyjdf_md.mp4` |
| 744966 | 728KB | `./assets/city-guilds-level3-square.jpg` |
| 744966 | 728KB | `./Logo - Qualified Level 3 Print Colour/Logo - Qualified Level 3 Print Colour/C&G_Level 3 Qualified_CMYK_300dpi.jpg` |
| 109236 | 107KB | `./insurance-certificate.pdf` |
| 80806 | 79KB | `./Logo - Qualified Level 3 Digital/Logo - Qualified Level 3 Digital/Colour/cg_cover_1156x650.png` |
| 71793 | 71KB | `./insurance-thumb.png` |
| 64211 | 63KB | `./assets/city-guilds-level3-qualified.jpg` |
| 64211 | 63KB | `./Logo - Qualified Level 3 Digital/Logo - Qualified Level 3 Digital/Colour/C&G_Level 3 Qualified_RGB_150dpi.jpg` |
| 56988 | 56KB | `./Logo - Qualified Level 3 Digital/Logo - Qualified Level 3 Digital/Monochrome/Black/C&G_Level 3 Qualified_RGB_Black_150dpi.jpg` |

## 4) Files that should NOT be publicly deployed

- `./willesden-smart-homes-website-copy.docx` (source/internal doc)
- `./willesden-smart-homes-sora-prompt-pack.docx` (prompt/internal doc)
- `./SiteHeader.tsx` (source component, not deploy artifact)
- `./Logo - Qualified Level 3 Digital/Logo - Qualified Level 3 Digital/Colour/C&G_Level 3 Qualified_RGB.ai` (raw design source)
- `./Logo - Qualified Level 3 Digital/Logo - Qualified Level 3 Digital/Colour/C&G_Level 3 Qualified_RGB.eps` (raw design source)
- `./Logo - Qualified Level 3 Digital/Logo - Qualified Level 3 Digital/Monochrome/Black/C&G_Level 3 Qualified_RGB_Black.ai` (raw design source)
- `./Logo - Qualified Level 3 Digital/Logo - Qualified Level 3 Digital/Monochrome/White/C&G_Level 3 Qualified_RGB_White.ai` (raw design source)
- `./Logo - Qualified Level 3 Digital/Logo - Qualified Level 3 Digital/Monochrome/White/C&G_Level 3 Qualified_RGB_White.eps` (raw design source)
- `./Logo - Qualified Level 3 Print Colour/Logo - Qualified Level 3 Print Colour/C&G_Level 3 Qualified_CMYK.ai` (raw design source)
- `./Logo - Qualified Level 3 Print Colour/Logo - Qualified Level 3 Print Colour/C&G_Level 3 Qualified_CMYK.eps` (raw design source)

## Commands run

```bash
rg -n --hidden --glob '!.git' "[REDACTED_PREFIX]" .
rg -n --hidden --glob '!.git' -e '(?i)limited evenings/weekends' -e '(?i)weekdays?\s*[0-9]{1,2}(:[0-9]{2})?\s*[-–]\s*[0-9]{1,2}(:[0-9]{2})?' -e '(?i)(mon|tue|wed|thu|fri|sat|sun)[a-z]*\s*[-–]\s*(mon|tue|wed|thu|fri|sat|sun)[a-z]*\s*[0-9]{1,2}(:[0-9]{2})?\s*[-–]\s*[0-9]{1,2}(:[0-9]{2})?' -e '(?i)(mon|tue|wed|thu|fri|sat|sun)[a-z]*\s*[-–]\s*(mon|tue|wed|thu|fri|sat|sun)[a-z]*\s*[0-9]{1,2}\s*[-–]\s*[0-9]{1,2}' .
rg --files -uu
find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.gif' -o -iname '*.webp' -o -iname '*.svg' -o -iname '*.avif' -o -iname '*.bmp' -o -iname '*.tif' -o -iname '*.tiff' -o -iname '*.ico' -o -iname '*.pdf' -o -iname '*.mp4' -o -iname '*.webm' -o -iname '*.mov' -o -iname '*.m4v' -o -iname '*.mp3' -o -iname '*.wav' -o -iname '*.ogg' \) -print0 | xargs -0 -I{} stat -c '%s\t%n' "{}" | sort -nr | head -n 10 | awk -F '\t' '{ cmd = "numfmt --to=iec --suffix=B " $1; cmd | getline h; close(cmd); printf "%s\t%s\t%s\n", $1, h, $2 }'
find . -type f \( -iname '*.doc' -o -iname '*.docx' -o -iname '*.ppt' -o -iname '*.pptx' -o -iname '*.xls' -o -iname '*.xlsx' -o -iname '*.tsx' -o -iname '*.ts' -o -iname '*.psd' -o -iname '*.ai' -o -iname '*.eps' -o -iname '*.sketch' -o -iname '*.fig' -o -iname '*.xcf' -o -iname '*.zip' -o -iname '*.7z' -o -iname '*.rar' \) | sort
find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.gif' -o -iname '*.webp' -o -iname '*.svg' -o -iname '*.avif' -o -iname '*.bmp' -o -iname '*.tif' -o -iname '*.tiff' -o -iname '*.ico' -o -iname '*.pdf' -o -iname '*.mp4' -o -iname '*.webm' -o -iname '*.mov' -o -iname '*.m4v' -o -iname '*.mp3' -o -iname '*.wav' -o -iname '*.ogg' \) -print0 | xargs -0 stat -c '%s %n' | sort -nr | head -n 10 | while IFS= read -r line; do size=${line%% *}; path=${line#* }; human=$(numfmt --to=iec --suffix=B "$size"); printf '%s\t%s\t%s\n' "$size" "$human" "$path"; done
rg -n --hidden --glob '!.git' -e 'Mon-Sat 8-6' -e 'Weekdays 08:00-15:00' -e '(?i)Limited evenings?/weekends?' -e '(?i)Limited evening/weekend' .
```
