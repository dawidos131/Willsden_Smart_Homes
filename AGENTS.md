This repo is a static HTML/CSS site.

Primary source files:
- root *.html
- assets/styles.css

Rules:
- style only
- preserve business details, contact info, metadata, JSON-LD/schema, forms, link targets, tracking/data attributes, and JS behavior
- do not edit dist manually
- rebuild with: bash scripts/build-dist.sh
- prefer shared CSS modifiers and reusable layout classes over page-specific hacks
- keep the homepage strong; focus most design changes on inner pages
