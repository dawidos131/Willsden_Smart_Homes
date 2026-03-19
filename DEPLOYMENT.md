# Deployment

## Build deploy folder

Run:

```bash
bash scripts/build-dist.sh
```

This rebuilds `./dist` from scratch and copies only deployable website files.

## Upload target

Deploy by uploading only the contents of `dist/` (or the `dist/` folder, depending on your host setup).
Do not upload repo root or source/reference files.

## Quick verification checklist

1. Confirm no `.docx` or `.tsx` files in `dist`:

```bash
find dist -type f | rg -n '\.docx$|\.tsx$'
```

Expected: no output.

2. Confirm no client-side API key attributes or Maps key script URLs in `dist`:

```bash
rg -n 'data-api-key=|maps.googleapis.com/maps/api/js\\?key=' dist
```

Expected: no output.

3. Optional sanity check of deploy tree:

```bash
tree dist
```

## Google Reviews (Secure Setup)

This repo includes a serverless proxy at `netlify/functions/google-reviews.js` and a redirect in `netlify.toml` so the public endpoint is:

`/api/google-reviews`

### Configure environment variable

Set this in your hosting platform (Netlify Site Settings -> Environment Variables):

- `GOOGLE_MAPS_API_KEY` = your Google Maps Places API key

Do not place this key in HTML, JS, or any client-side config.

### Deploy flow

1. Keep widget attributes as:
   - `data-place-id="..."`
   - `data-reviews-endpoint="/api/google-reviews"`
2. For static-only hosting, upload only `dist/` (reviews will show the fallback message if no API endpoint exists).
3. For live proxied reviews, deploy on Netlify from this repo so both `dist/` and `netlify/functions/` are published.
4. Verify endpoint response:

```bash
curl "/api/google-reviews?placeId=YOUR_PLACE_ID&max=6&minRating=0"
```

### Google Cloud key restrictions

In Google Cloud Console, restrict the server key used by `GOOGLE_MAPS_API_KEY`:

1. API restrictions: allow only Places API.
2. Application restrictions: lock down by server environment/IPs where possible.
3. Rotate keys if a leak is suspected.

## Performance Notes (Images)

- Added modern image variants:
  - `thermostat-backplate.avif`
  - `thermostat-backplate.webp`
  - `assets/city-guilds-level3-square.webp`
- Original JPEG files are kept and used as fallback sources in `<picture>` markup.
- Thermostat image now serves AVIF/WebP first with JPG fallback on:
  - `index.html`
  - `about.html`
  - `smart-home.html`
- Header trust badge now serves WebP first with JPG fallback across pages using the shared header markup.
