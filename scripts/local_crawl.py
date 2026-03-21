import os, re, sys, json
from urllib.parse import urlparse

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
BASE = sys.argv[2] if len(sys.argv) > 2 else "https://e2c8174890c245.lhr.life"

html_files = []
for dirpath, _, filenames in os.walk(ROOT):
    for fn in filenames:
        if fn.lower().endswith((".html", ".htm")):
            html_files.append(os.path.join(dirpath, fn))

href_re = re.compile(r'href=["\']([^"\']+)["\']', re.I)
src_re = re.compile(r'src=["\']([^"\']+)["\']', re.I)

def norm_path(path):
    path = path.split("#", 1)[0].split("?", 1)[0].strip()
    if not path or path.startswith(("mailto:", "tel:", "javascript:")):
        return None
    return path

broken = []
assets_missing = []
graph = {}

for fp in html_files:
    rel = os.path.relpath(fp, ROOT)
    with open(fp, "r", encoding="utf-8", errors="ignore") as f:
        s = f.read()

    links = []
    for m in href_re.finditer(s):
        href = norm_path(m.group(1))
        if not href:
            continue
        links.append(href)

    assets = []
    for m in src_re.finditer(s):
        src = norm_path(m.group(1))
        if not src:
            continue
        assets.append(src)

    graph[rel] = {"href": links, "src": assets}

    # Validate internal .html
    for href in links:
        if href.startswith(("http://", "https://")):
            continue
        if href.startswith("/"):
            target = href.lstrip("/")
        else:
            target = os.path.normpath(os.path.join(os.path.dirname(rel), href))
        # only check local pages if they look like files
        if target.endswith((".html", ".htm")):
            if not os.path.exists(os.path.join(ROOT, target)):
                broken.append({"from": rel, "to": href, "resolved": target})

    # Validate local assets
    for src in assets:
        if src.startswith(("http://", "https://")):
            continue
        if src.startswith("/"):
            target = src.lstrip("/")
        else:
            target = os.path.normpath(os.path.join(os.path.dirname(rel), src))
        if not os.path.exists(os.path.join(ROOT, target)):
            assets_missing.append({"from": rel, "asset": src, "resolved": target})

out = {
    "base": BASE,
    "html_count": len(html_files),
    "broken_internal_pages": broken,
    "missing_assets": assets_missing,
    "graph": graph,
}

os.makedirs("reports", exist_ok=True)
with open("reports/local_crawl.json", "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2)

print(f"HTML files: {len(html_files)}")
print(f"Broken internal page links: {len(broken)}")
print(f"Missing local assets: {len(assets_missing)}")
print("Wrote reports/local_crawl.json")
