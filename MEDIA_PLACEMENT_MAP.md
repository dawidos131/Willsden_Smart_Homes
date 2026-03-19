# Page-by-page media placement map
This map assumes you have already unzipped `willesden-smart-homes-images.zip` into your website root so that `/assets/` exists.
## Global rules (use everywhere)
- **Hero images (16:9):** use `assets/photos/hero/*-1600x900.webp` with `width="1600" height="900"`.
- **Square images (cards/sidebars):** use `assets/photos/square/*-800.webp` with `width="800" height="800"`.
- **Gallery thumbnails:** use `assets/photos/thumb/*-400.webp` with `width="400" height="400"`, link to the matching `assets/photos/gallery/*-1600.webp`.
- **Decorative icons:** use `alt=""` and `aria-hidden="true"`.
- **Real photos:** always include meaningful `alt` text.
### Icon paths
- Outline icons: `assets/icons/outline/<icon>.svg`
- Animated icons: `assets/icons/animated/<anim>.svg`
### Open Graph images
- Home: `assets/photos/og/og-home.jpg`
- Services: `assets/photos/og/og-services.jpg`
- Smart home: `assets/photos/og/og-smart-home.jpg`
- Automation: `assets/photos/og/og-automation.jpg`
## Placement templates (copy/paste)
### Template A — Hero media (index hero grid)
```html
<figure class="hero-media reveal" aria-label="Work photo">
  <img
    class="photo-natural"
    src="REPLACE_SRC"
    alt="REPLACE_ALT"
    width="1600"
    height="900"
    loading="eager"
    decoding="async"
  >
</figure>
```
### Template B — Page media section (for pages with `page-hero`)
```html
<section class="section section-media">
  <div class="container">
    <figure class="photo-card reveal">
      <img
        class="photo-natural"
        src="REPLACE_SRC"
        alt="REPLACE_ALT"
        width="1600"
        height="900"
        loading="lazy"
        decoding="async"
      >
      <figcaption>REPLACE_CAPTION</figcaption>
    </figure>
  </div>
</section>
```
### Template C — Simple 6-tile gallery (thumbs -> full)
```html
<div class="grid grid-3">
  <a class="photo-tile" href="REPLACE_FULL" target="_blank" rel="noopener">
    <img src="REPLACE_THUMB" alt="REPLACE_ALT" width="400" height="400" loading="lazy" decoding="async">
  </a>
  <!-- repeat tiles -->
</div>
```
## Core pages
### `index.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-on-site-02-1600x900.webp`  
  Alt: “Electrician on site working on exterior cabling and hardware”
- **Suggested gallery set (base names):**
  - `david-installation-01` — Electrician working on a wall installation in a UK home
  - `david-on-site-01` — Electrician on site working in a narrow outdoor access area
  - `consumer-unit-01` — UK consumer unit (fuse board) with labelled circuits
  - `outdoor-light-01` — Outdoor LED security floodlight installation on brick wall
  - `testing-kit-01` — Insulation resistance tester and test leads in a carry case
  - `led-controller-01` — LED lighting controller module and cabling
- **Page icon(s):**
  - `assets/icons/outline/icon-wrench.svg`
  - `assets/icons/outline/icon-thermostat.svg`
  - `assets/icons/outline/icon-automation.svg`
  - `assets/icons/animated/anim-wifi-waves.svg`
  - `assets/icons/animated/anim-bolt-pulse.svg`

### `services.html`
- **OG image:** `assets/photos/og/og-services.jpg`
- **Hero photo:** `assets/photos/hero/david-installation-01-1600x900.webp`  
  Alt: “Electrician working on a wall installation in a UK home”
- **Suggested gallery set (base names):**
  - `david-installation-01` — Electrician working on a wall installation in a UK home
  - `david-on-site-02` — Electrician on site working on exterior cabling and hardware
  - `heater-install-01` — Wall-mounted heater installed and tested
  - `led-controller-01` — LED lighting controller module and cabling
  - `consumer-unit-01` — UK consumer unit (fuse board) with labelled circuits
  - `outdoor-light-01` — Outdoor LED security floodlight installation on brick wall
- **Icons for cards/sections:**
  - Lighting and Fittings → `assets/icons/outline/icon-lightbulb.svg`
  - Sockets, Switches and Accessories → `assets/icons/outline/icon-socket.svg`
  - Fans, Hoods and Minor Fault-Finding → `assets/icons/outline/icon-wrench.svg`
  - Safety Checks → `assets/icons/outline/icon-shield-check.svg`
  - Smart Heating (Nest / Hive) → `assets/icons/outline/icon-thermostat.svg`
  - Video Doorbells and Entry → `assets/icons/outline/icon-cctv.svg`
  - Smart Cameras and CCTV → `assets/icons/outline/icon-cctv.svg`
  - Smart Lighting and Reliability Fixes → `assets/icons/outline/icon-lightbulb.svg`
  - Typical Projects → `assets/icons/outline/icon-automation.svg`
  - Included in Delivery → `assets/icons/animated/anim-check-circle.svg`

### `about.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-on-site-01-1600x900.webp`  
  Alt: “Electrician on site working in a narrow outdoor access area”
- **Suggested gallery set (base names):**
  - `david-on-site-01` — Electrician on site working in a narrow outdoor access area
  - `david-installation-01` — Electrician working on a wall installation in a UK home
  - `testing-kit-01` — Insulation resistance tester and test leads in a carry case
- **Page icon(s):**
  - `assets/icons/outline/icon-shield-check.svg`
  - `assets/icons/animated/anim-check-circle.svg`

### `contact.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-on-site-02-1600x900.webp`  
  Alt: “Electrician on site working on exterior cabling and hardware”
- **Suggested gallery set (base names):**
  - `david-on-site-02` — Electrician on site working on exterior cabling and hardware
- **Page icon(s):**
  - `assets/icons/outline/icon-calendar-clock.svg`
  - `assets/icons/animated/anim-check-circle.svg`

### `pricing-booking.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-installation-01-1600x900.webp`  
  Alt: “Electrician working on a wall installation in a UK home”
- **Suggested gallery set (base names):**
  - `david-installation-01` — Electrician working on a wall installation in a UK home
- **Page icon(s):**
  - `assets/icons/outline/icon-calendar-clock.svg`
  - `assets/icons/outline/icon-shield-check.svg`

### `reviews.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-installation-01-1600x900.webp`  
  Alt: “Electrician working on a wall installation in a UK home”
- **Suggested gallery set (base names):**
  - `david-installation-01` — Electrician working on a wall installation in a UK home
- **Page icon(s):**
  - `assets/icons/outline/icon-quote.svg`
  - `assets/icons/animated/anim-check-circle.svg`

### `faq.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/testing-kit-01-1600x900.webp`  
  Alt: “Insulation resistance tester and test leads in a carry case”
- **Suggested gallery set (base names):**
  - `testing-kit-01` — Insulation resistance tester and test leads in a carry case
- **Page icon(s):**
  - `assets/icons/animated/anim-check-circle.svg`
  - `assets/icons/outline/icon-shield-check.svg`

### `areas.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-on-site-02-1600x900.webp`  
  Alt: “Electrician on site working on exterior cabling and hardware”
- **Suggested gallery set (base names):**
  - `david-on-site-02` — Electrician on site working on exterior cabling and hardware
  - `outdoor-light-01` — Outdoor LED security floodlight installation on brick wall
- **Page icon(s):**
  - `assets/icons/animated/anim-bolt-pulse.svg`

### `privacy.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** (keep text-only)
- **Suggested gallery set:** (none)
- **Page icon(s):**
  - `assets/icons/outline/icon-shield-check.svg`

## Service pages
### `electrical-repairs.html`
- **OG image:** `assets/photos/og/og-services.jpg`
- **Hero photo:** `assets/photos/hero/david-installation-01-1600x900.webp`  
  Alt: “Electrician working on a wall installation in a UK home”
- **Suggested gallery set (base names):**
  - `david-installation-01` — Electrician working on a wall installation in a UK home
  - `testing-kit-01` — Insulation resistance tester and test leads in a carry case
- **Page icon(s):**
  - `assets/icons/outline/icon-wrench.svg`
  - `assets/icons/outline/icon-shield-check.svg`

### `electrical-fault-finding.html`
- **OG image:** `assets/photos/og/og-services.jpg`
- **Hero photo:** `assets/photos/hero/testing-kit-01-1600x900.webp`  
  Alt: “Insulation resistance tester and test leads in a carry case”
- **Suggested gallery set (base names):**
  - `testing-kit-01` — Insulation resistance tester and test leads in a carry case
  - `david-installation-01` — Electrician working on a wall installation in a UK home
- **Page icon(s):**
  - `assets/icons/outline/icon-fault-finding.svg`
  - `assets/icons/outline/icon-shield-check.svg`

### `eicr.html`
- **OG image:** `assets/photos/og/og-services.jpg`
- **Hero photo:** `assets/photos/hero/testing-kit-01-1600x900.webp`  
  Alt: “Insulation resistance tester and test leads in a carry case”
- **Suggested gallery set (base names):**
  - `testing-kit-01` — Insulation resistance tester and test leads in a carry case
  - `consumer-unit-01` — UK consumer unit (fuse board) with labelled circuits
- **Page icon(s):**
  - `assets/icons/outline/icon-shield-check.svg`
  - `assets/icons/outline/icon-fault-finding.svg`

### `consumer-unit-replacement.html`
- **OG image:** `assets/photos/og/og-services.jpg`
- **Hero photo:** `assets/photos/hero/consumer-unit-01-1600x900.webp`  
  Alt: “UK consumer unit (fuse board) with labelled circuits”
- **Suggested gallery set (base names):**
  - `consumer-unit-01` — UK consumer unit (fuse board) with labelled circuits
  - `testing-kit-01` — Insulation resistance tester and test leads in a carry case
- **Page icon(s):**
  - `assets/icons/outline/icon-consumer-unit.svg`
  - `assets/icons/outline/icon-shield-check.svg`

### `lighting-installation.html`
- **OG image:** `assets/photos/og/og-services.jpg`
- **Hero photo:** `assets/photos/hero/david-installation-01-1600x900.webp`  
  Alt: “Electrician working on a wall installation in a UK home”
- **Suggested gallery set (base names):**
  - `david-installation-01` — Electrician working on a wall installation in a UK home
  - `led-controller-01` — LED lighting controller module and cabling
  - `outdoor-light-01` — Outdoor LED security floodlight installation on brick wall
- **Page icon(s):**
  - `assets/icons/outline/icon-lightbulb.svg`

### `sockets-and-switches.html`
- **OG image:** `assets/photos/og/og-services.jpg`
- **Hero photo:** `assets/photos/hero/david-installation-01-1600x900.webp`  
  Alt: “Electrician working on a wall installation in a UK home”
- **Suggested gallery set (base names):**
  - `david-installation-01` — Electrician working on a wall installation in a UK home
- **Page icon(s):**
  - `assets/icons/outline/icon-socket.svg`
  - `assets/icons/outline/icon-wrench.svg`

### `outdoor-lighting.html`
- **OG image:** `assets/photos/og/og-services.jpg`
- **Hero photo:** `assets/photos/hero/outdoor-light-01-1600x900.webp`  
  Alt: “Outdoor LED security floodlight installation on brick wall”
- **Suggested gallery set (base names):**
  - `outdoor-light-01` — Outdoor LED security floodlight installation on brick wall
  - `david-on-site-02` — Electrician on site working on exterior cabling and hardware
- **Page icon(s):**
  - `assets/icons/outline/icon-outdoor-light.svg`
  - `assets/icons/outline/icon-lightbulb.svg`

### `smart-thermostat-installation.html`
- **OG image:** `assets/photos/og/og-smart-home.jpg`
- **Hero photo:** `assets/photos/hero/heater-install-01-1600x900.webp`  
  Alt: “Wall-mounted heater installed and tested”
- **Suggested gallery set (base names):**
  - `heater-install-01` — Wall-mounted heater installed and tested
  - `david-installation-01` — Electrician working on a wall installation in a UK home
- **Page icon(s):**
  - `assets/icons/outline/icon-thermostat.svg`
  - `assets/icons/animated/anim-wifi-waves.svg`

### `cctv-installation.html`
- **OG image:** `assets/photos/og/og-services.jpg`
- **Hero photo:** `assets/photos/hero/david-on-site-02-1600x900.webp`  
  Alt: “Electrician on site working on exterior cabling and hardware”
- **Suggested gallery set (base names):**
  - `david-on-site-02` — Electrician on site working on exterior cabling and hardware
  - `control-panel-01` — Electrical control panel with relays and neatly routed cables
- **Page icon(s):**
  - `assets/icons/outline/icon-cctv.svg`
  - `assets/icons/outline/icon-shield-check.svg`

### `smart-home.html`
- **OG image:** `assets/photos/og/og-smart-home.jpg`
- **Hero photo:** `assets/photos/hero/david-installation-01-1600x900.webp`  
  Alt: “Electrician working on a wall installation in a UK home”
- **Suggested gallery set (base names):**
  - `heater-install-01` — Wall-mounted heater installed and tested
  - `led-controller-01` — LED lighting controller module and cabling
  - `testing-kit-01` — Insulation resistance tester and test leads in a carry case
- **Page icon(s):**
  - `assets/icons/outline/icon-thermostat.svg`
  - `assets/icons/outline/icon-cctv.svg`
  - `assets/icons/outline/icon-lightbulb.svg`
  - `assets/icons/animated/anim-wifi-waves.svg`

### `automation.html`
- **OG image:** `assets/photos/og/og-automation.jpg`
- **Hero photo:** `assets/photos/hero/siemens-logo-01-1600x900.webp`  
  Alt: “Siemens LOGO! controller with connected wiring”
- **Suggested gallery set (base names):**
  - `siemens-logo-01` — Siemens LOGO! controller with connected wiring
  - `control-panel-01` — Electrical control panel with relays and neatly routed cables
  - `led-controller-01` — LED lighting controller module and cabling
- **Page icon(s):**
  - `assets/icons/outline/icon-automation.svg`
  - `assets/icons/animated/anim-wifi-waves.svg`

## Local SEO pages
### `willesden-electrician.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-on-site-02-1600x900.webp`  
  Alt: “Electrician on site working on exterior cabling and hardware”
- **Suggested gallery set (base names):**
  - `david-on-site-02` — Electrician on site working on exterior cabling and hardware
- **Page icon(s):**
  - `assets/icons/animated/anim-bolt-pulse.svg`
  - `assets/icons/outline/icon-calendar-clock.svg`

### `harlesden-electrician.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-on-site-01-1600x900.webp`  
  Alt: “Electrician on site working in a narrow outdoor access area”
- **Suggested gallery set (base names):**
  - `david-on-site-01` — Electrician on site working in a narrow outdoor access area
- **Page icon(s):**
  - `assets/icons/animated/anim-bolt-pulse.svg`
  - `assets/icons/outline/icon-calendar-clock.svg`

### `brondesbury-electrician.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-installation-01-1600x900.webp`  
  Alt: “Electrician working on a wall installation in a UK home”
- **Suggested gallery set (base names):**
  - `david-installation-01` — Electrician working on a wall installation in a UK home
- **Page icon(s):**
  - `assets/icons/animated/anim-bolt-pulse.svg`
  - `assets/icons/outline/icon-calendar-clock.svg`

### `cricklewood-electrician.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-on-site-02-1600x900.webp`  
  Alt: “Electrician on site working on exterior cabling and hardware”
- **Suggested gallery set (base names):**
  - `david-on-site-02` — Electrician on site working on exterior cabling and hardware
- **Page icon(s):**
  - `assets/icons/animated/anim-bolt-pulse.svg`
  - `assets/icons/outline/icon-calendar-clock.svg`

### `kensal-green-electrician.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-on-site-01-1600x900.webp`  
  Alt: “Electrician on site working in a narrow outdoor access area”
- **Suggested gallery set (base names):**
  - `david-on-site-01` — Electrician on site working in a narrow outdoor access area
- **Page icon(s):**
  - `assets/icons/animated/anim-bolt-pulse.svg`
  - `assets/icons/outline/icon-calendar-clock.svg`

### `kilburn-electrician.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-installation-01-1600x900.webp`  
  Alt: “Electrician working on a wall installation in a UK home”
- **Suggested gallery set (base names):**
  - `david-installation-01` — Electrician working on a wall installation in a UK home
- **Page icon(s):**
  - `assets/icons/animated/anim-bolt-pulse.svg`
  - `assets/icons/outline/icon-calendar-clock.svg`

### `queens-park-electrician.html`
- **OG image:** `assets/photos/og/og-home.jpg`
- **Hero photo:** `assets/photos/hero/david-on-site-02-1600x900.webp`  
  Alt: “Electrician on site working on exterior cabling and hardware”
- **Suggested gallery set (base names):**
  - `david-on-site-02` — Electrician on site working on exterior cabling and hardware
- **Page icon(s):**
  - `assets/icons/animated/anim-bolt-pulse.svg`
  - `assets/icons/outline/icon-calendar-clock.svg`

