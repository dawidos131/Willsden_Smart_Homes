import pathlib, re, sys

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://e2c8174890c245.lhr.life"

# Minimal per-page description map (extend as needed)
DESC = {
    "index.html": "Small electrical jobs and smart-home installation in Willesden (NW2), Harlesden (NW10) and nearby NW London. WhatsApp photo quotes. £50 call-out and £50/hour for small jobs.",
    "services.html": "Electrical services in Willesden and Harlesden: lighting, sockets, fault finding, smart thermostats, CCTV/doorbells, outdoor lighting, plus managed routes for EICR and consumer unit upgrades.",
    "pricing-booking.html": "Transparent electrician pricing in NW London: £50 call-out, £50/hour for small jobs. Photo-based quoting via WhatsApp, with compliant Part P options explained clearly.",
    "contact.html": "Request a quote for small electrical jobs and smart-home installs in NW10/NW2/NW6. Send photos via WhatsApp or use the online form for a fast response.",
}

def build_canonical(path):
    # file path -> URL
    if path.name == "index.html":
        return f"{BASE}/"
    return f"{BASE}/{path.name}"

def ensure_lang(html):
    # add lang="en-GB" to <html> if missing
    html = re.sub(r"<html(?![^>]*\blang=)([^>]*)>", r'<html\1 lang="en-GB">', html, flags=re.I)
    return html

def inject_head(html, canonical, desc, og_title):
    # Insert meta block after <title>...</title>
    meta_block = f'''
    <meta name="description" content="{desc}">
    <link rel="canonical" href="{canonical}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="{og_title}">
    <meta property="og:description" content="{desc}">
    <meta property="og:url" content="{canonical}">
    <meta property="og:image" content="{BASE}/logo-200x200.png">
    <meta name="twitter:card" content="summary_large_image">
    '''
    # Avoid double insertion
    if 'rel="canonical"' in html:
        return html
    m = re.search(r"(<title>.*?</title>)", html, flags=re.I|re.S)
    if not m:
        raise ValueError("No <title> found")
    return html.replace(m.group(1), m.group(1) + meta_block)

root = pathlib.Path(".")
html_files = [p for p in root.glob("*.html")] + [p for p in root.glob("*.htm")]

for path in html_files:
    raw = path.read_text(encoding="utf-8", errors="ignore")
    raw = ensure_lang(raw)

    # Extract title text
    mt = re.search(r"<title>(.*?)</title>", raw, flags=re.I|re.S)
    title_text = (mt.group(1).strip() if mt else path.stem)

    desc = DESC.get(path.name, f"{title_text}. Local electrician for small jobs and smart-home installs in NW London. WhatsApp photo quotes.")
    canonical = build_canonical(path)

    updated = inject_head(raw, canonical, desc, title_text)
    path.write_text(updated, encoding="utf-8")
    print(f"Updated {path.name}")

print("Done. Review output and spot-check a few pages in the browser.")
