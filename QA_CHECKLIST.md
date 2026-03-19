# QA Checklist

Date: 2026-02-27

## 1) Security
Status: PASS

Result:
- `grep -R "AIza" dist --exclude-dir=.git | wc -l` -> `0`
- `grep -R "AIza" . --exclude-dir=.git | wc -l` -> `0`

Commands run:
```bash
grep -R "AIza" dist --exclude-dir=.git | wc -l
grep -R "AIza" . --exclude-dir=.git | wc -l
```

## 2) Consistency
Status: PASS (site/deploy content)

Result:
- No `Mon-Sat 8-6` in website source files (`*.html`, `SiteHeader.tsx`)
- No legacy `Weekdays 08:00-15:00`, `Weekdays 08:00-17:00`, `Mon-Sat 8-17` in website source files

Commands run:
```bash
rg -n -g '*.html' -g 'SiteHeader.tsx' "Mon-Sat 8-6" . || true
rg -n -g '*.html' -g 'SiteHeader.tsx' "Weekdays 08:00-15:00|Weekdays 08:00-17:00|Mon-Sat 8-17" . || true
```

## 3) Links
Status: PASS (nav + footer local links)

Result:
- Source pages: `checked_links=327 errors=0`
- Deploy pages: `checked_links=327 errors=0`

Commands run:
```bash
python3 - <<'PY'
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

SCHEMES_SKIP = {'http','https','mailto','tel','sms','javascript','data'}

class NavFooterParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack=[]
        self.links=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        self.stack.append(tag)
        if tag=='a' and any(t in ('nav','footer') for t in self.stack):
            href=attrs.get('href')
            if href is not None:
                self.links.append((self.getpos()[0], href))
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i]==tag:
                del self.stack[i]
                break

def check_folder(folder: Path):
    html_files=sorted(folder.glob('*.html'))
    errors=[]
    total=0
    for file in html_files:
        p=NavFooterParser()
        text=file.read_text(encoding='utf-8')
        p.feed(text)
        for line, href in p.links:
            total += 1
            href=href.strip()
            parsed=urlsplit(href)
            if parsed.scheme.lower() in SCHEMES_SKIP:
                continue
            if parsed.scheme.lower() == 'file':
                errors.append(f"{file}:{line} FILE_URI {href}")
                continue
            path = parsed.path
            frag = parsed.fragment
            if path in ('', None):
                target=file
            else:
                if path.startswith('/'):
                    target=folder / path.lstrip('/')
                else:
                    target=(folder / path).resolve()
            if not target.exists():
                errors.append(f"{file}:{line} MISSING_FILE {href}")
                continue
            if frag:
                t=target.read_text(encoding='utf-8')
                if f'id="{frag}"' not in t and f"id='{frag}'" not in t and f'name="{frag}"' not in t and f"name='{frag}'" not in t:
                    errors.append(f"{file}:{line} MISSING_FRAGMENT {href}")
    return total, errors

for folder in [Path('.'), Path('dist')]:
    total, errors = check_folder(folder)
    print(f"[{folder}] checked_links={total} errors={len(errors)}")
    for e in errors:
        print(e)
PY
```

## 4) Images
Status: PASS

Result:
- `<picture>` source files and fallback `<img>` files exist in source and `dist`
- Source pages: `picture_blocks=13 errors=0`
- Deploy pages: `picture_blocks=13 errors=0`

Commands run:
```bash
python3 - <<'PY'
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

SCHEMES_SKIP = {'http','https','mailto','tel','sms','javascript','data','file'}

class PictureParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_picture = False
        self.current = None
        self.pictures = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'picture':
            self.in_picture = True
            self.current = {'line': self.getpos()[0], 'sources': [], 'img': None}
        elif self.in_picture and tag == 'source':
            srcset = attrs.get('srcset', '').strip()
            if srcset:
                urls = []
                for part in srcset.split(','):
                    u = part.strip().split()[0]
                    if u:
                        urls.append(u)
                self.current['sources'].extend(urls)
        elif self.in_picture and tag == 'img':
            src = attrs.get('src', '').strip()
            if src:
                self.current['img'] = src
    def handle_endtag(self, tag):
        if tag == 'picture' and self.in_picture:
            self.pictures.append(self.current)
            self.current = None
            self.in_picture = False

def exists_local(base: Path, ref: str):
    p = urlsplit(ref)
    if p.scheme.lower() in SCHEMES_SKIP:
        return True
    path = p.path
    if path.startswith('/'):
        target = base / path.lstrip('/')
    else:
        target = (base / path).resolve()
    return target.exists()

for folder in [Path('.'), Path('dist')]:
    errors=[]
    count=0
    for file in sorted(folder.glob('*.html')):
        parser=PictureParser()
        parser.feed(file.read_text(encoding='utf-8'))
        for pic in parser.pictures:
            count += 1
            for s in pic['sources']:
                if not exists_local(folder, s):
                    errors.append(f"{file}:{pic['line']} missing source {s}")
            if not pic['img']:
                errors.append(f"{file}:{pic['line']} missing fallback img")
            elif not exists_local(folder, pic['img']):
                errors.append(f"{file}:{pic['line']} missing fallback file {pic['img']}")
    print(f"[{folder}] picture_blocks={count} errors={len(errors)}")
    for e in errors:
        print(e)
PY
```

## 5) Performance Quick Wins
Status: PASS

Result:
- Review widgets are lazy-initialized by `IntersectionObserver`
- Root margin is set to `300px 0px`
- Widget init occurs on intersection (`initGoogleReviewsWidget(entry.target)`)
- Fallback path exists for non-IntersectionObserver browsers

Commands run:
```bash
rg -n "var reviewWidgets|IntersectionObserver|rootMargin: '300px 0px'|initGoogleReviewsWidget\\(entry.target\\)|initAllReviewWidgets\\(|document.addEventListener\\('DOMContentLoaded', initAllReviewWidgets\\)" assets/script.js
```

## 6) Deployment
Status: PASS

Result:
- No internal docs/source artifacts found in `dist` (`.docx`, `.tsx`, `.md`, `.ai`, `.eps`, etc.)
- No `Media` or `Logo - ...` directories in `dist`
- `dist` file inventory contains only website/deploy artifacts

Commands run:
```bash
find dist -type f | rg -n '\\.(doc|docx|ppt|pptx|xls|xlsx|tsx|ts|ai|eps|psd|md)$|willesden-smart-homes|SiteHeader\\.tsx' || true
find dist -maxdepth 3 -type d | rg -n 'Media|Logo - ' || true
find dist -type f | sort
```

## Remaining Known Issues
- `AUDIT_REPORT.md` still contains historical text values such as `Mon-Sat 8-6` from the earlier audit snapshot. This does not affect deploy output.
