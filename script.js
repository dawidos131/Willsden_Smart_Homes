(() => {
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const $ = (selector, root = document) => root.querySelector(selector);
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const siteConfig = window.SITE_CONFIG || {};

  const DEFAULT_FEED = {
    reviewSummary:
      'Customers often mention tidy finishes, clear explanations and reliable follow-up support.',
    reviews: [
      {
        title: 'Tidy finish',
        tag: 'Often mentioned',
        text: 'Clean cable routes, neat accessory replacement and careful protection of the workspace.'
      },
      {
        title: 'Clear explanations',
        tag: 'Frequently praised',
        text: 'Straightforward handover and practical advice for smart thermostats, apps and day-to-day use.'
      },
      {
        title: 'Reliable small-job help',
        tag: 'Homeowner feedback',
        text: 'Good fit for the jobs many homeowners struggle to get booked quickly in NW London.'
      },
      {
        title: 'Thoughtful diagnostics',
        tag: 'Service highlight',
        text: 'Fault finding focuses on isolating the real cause before parts are replaced.'
      },
      {
        title: 'Aftercare and support',
        tag: 'Common theme',
        text: 'Helpful follow-up for app pairing, router changes and small adjustments after installation.'
      }
    ],
    photos: [
      {
        src: 'thermostat-backplate.webp',
        alt: 'Neat thermostat backplate wiring ready for a smart heating installation',
        title: 'Smart thermostat preparation',
        caption: 'Careful preparation for a clean smart-heating installation and smooth commissioning.'
      },
      {
        src: 'irrigation-hmi.png',
        alt: 'Mini automation interface showing irrigation zone controls',
        title: 'Mini automation interface',
        caption: 'A compact Siemens LOGO! project with clear status information and timed control.'
      },
      {
        src: 'assets/city-guilds-level3-qualified.jpg',
        alt: 'City and Guilds qualified badge graphic',
        title: 'Verified qualifications',
        caption: 'City & Guilds Level 3 electrical training displayed as part of the trust section.'
      },
      {
        src: 'insurance-thumb.png',
        alt: 'Insurance certificate thumbnail',
        title: 'Fully insured',
        caption: 'Public liability cover is linked directly from the site for easy customer reassurance.'
      },
      {
        src: 'og-preview.jpg',
        alt: 'Willesden Smart Homes website preview image',
        title: 'Local NW London service',
        caption: 'Independent electrical and smart-home support focused on tidy, practical small jobs.'
      }
    ]
  };

  const feedCache = new Map();

  function trackEvent(name, payload = {}) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, payload);
      }
    } catch (_error) {
      // no-op
    }
  }

  function setCurrentYear() {
    const year = new Date().getFullYear();
    $$('[data-year]').forEach((el) => {
      el.textContent = String(year);
    });
  }

  function setActiveNavigation() {
    $$(`[data-page="${currentPage}"]`).forEach((el) => {
      el.classList.add('is-active');
      if (el.matches('[role="menuitem"]')) {
        el.setAttribute('aria-current', 'page');
      }
    });
  }

  function initTrackedLinks() {
    $$('[data-track-event]').forEach((el) => {
      el.addEventListener('click', () => {
        trackEvent(el.dataset.trackEvent || 'link_click', {
          href: el.getAttribute('href') || '',
          page: currentPage
        });
      });
    });
  }

  function initServicesDropdown() {
    const dropdown = $('[data-services-dropdown]');
    const trigger = $('[data-services-trigger]');
    if (!dropdown || !trigger) return;

    const close = () => {
      dropdown.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    };

    const open = () => {
      dropdown.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (dropdown.classList.contains('is-open')) {
        close();
      } else {
        open();
      }
    });

    dropdown.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        close();
        trigger.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) {
        close();
      }
    });
  }

  function trapFocus(event, container) {
    const focusable = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', container)
      .filter((el) => !el.hasAttribute('hidden'));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function initMobileDrawer() {
    const wrap = $('[data-mobile-drawer-wrap]');
    const drawer = $('[data-mobile-drawer]');
    const toggle = $('[data-mobile-toggle]');
    const backdrop = $('[data-mobile-backdrop]');
    const closeButton = $('[data-mobile-close]');
    const firstLink = $('[data-mobile-first-link]');
    if (!wrap || !drawer || !toggle) return;

    let lastFocused = null;

    const close = () => {
      wrap.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-scroll-locked');
      if (lastFocused instanceof HTMLElement) {
        lastFocused.focus();
      }
    };

    const open = () => {
      lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      wrap.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-scroll-locked');
      window.setTimeout(() => {
        firstLink?.focus();
      }, 40);
    };

    toggle.addEventListener('click', () => {
      if (wrap.classList.contains('is-open')) {
        close();
      } else {
        open();
      }
    });

    backdrop?.addEventListener('click', close);
    closeButton?.addEventListener('click', close);

    document.addEventListener('keydown', (event) => {
      if (!wrap.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        close();
      }
      if (event.key === 'Tab') {
        trapFocus(event, drawer);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1080 && wrap.classList.contains('is-open')) {
        close();
      }
    });
  }

  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      }
    );

    items.forEach((el) => observer.observe(el));
  }

  function makeCardsClickable() {
    $$('[data-card-href]').forEach((card) => {
      const href = card.dataset.cardHref;
      if (!href) return;
      card.tabIndex = 0;
      card.setAttribute('role', 'link');

      const go = () => {
        window.location.href = href;
      };

      card.addEventListener('click', (event) => {
        if (event.target.closest('a, button, input, select, textarea, summary')) return;
        go();
      });

      card.addEventListener('keydown', (event) => {
        if (event.target !== card) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          go();
        }
      });
    });
  }

  function initMaps() {
    const query = 'HA0 NW2 NW3 NW6 NW10 NW11 W8 W9 W10 W11 London UK';
    const openMapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    $$('[data-service-area-map]').forEach((slot) => {
      if (slot.dataset.ready === 'true') return;
      slot.dataset.ready = 'true';
      const zoom = Math.max(10, Math.min(13, Math.round(Number(slot.dataset.maxZoom || 11))));
      const wrapper = slot.closest('.map-embed');
      const title = wrapper?.getAttribute('aria-label') || 'Service area map';

      const iframe = document.createElement('iframe');
      iframe.title = title;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.src = `https://maps.google.com/maps?hl=en&q=${encodeURIComponent(query)}&ll=51.5450,-0.2310&z=${zoom}&t=m&output=embed`;
      iframe.addEventListener('error', () => {
        const fallback = document.createElement('div');
        fallback.className = 'map-fallback';
        const inner = document.createElement('div');
        inner.className = 'map-fallback-inner';
        const heading = document.createElement('h3');
        heading.textContent = 'Open the service area map';
        const text = document.createElement('p');
        text.textContent = 'View the combined coverage area in Google Maps.';
        const link = document.createElement('a');
        link.className = 'btn btn-primary';
        link.href = openMapHref;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Open map';
        inner.append(heading, text, link);
        fallback.append(inner);
        slot.replaceChildren(fallback);
      });

      slot.replaceChildren(iframe);
    });
  }

  function getFieldLabel(field) {
    if (field.labels && field.labels[0]) {
      const clone = field.labels[0].cloneNode(true);
      $$('input, select, textarea, p', clone).forEach((node) => node.remove());
      const text = clone.textContent.replace(/\s+/g, ' ').trim();
      if (text) return text;
    }
    return field.getAttribute('name') || 'This field';
  }

  function setFieldError(field, isInvalid) {
    if (isInvalid) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  }

  function buildQuoteSummary(form) {
    const data = new FormData(form);
    const file = data.get('photo');
    const lines = [];
    const jobType = (data.get('job_type') || form.dataset.defaultJob || 'Electrical work').toString();
    const subjectSuffix = (data.get('postcode') || '').toString().trim();
    const titleLine = subjectSuffix ? `${jobType} — ${subjectSuffix}` : jobType;

    lines.push(`Quote request: ${titleLine}`);
    lines.push(`Page: ${window.location.href}`);
    lines.push('');

    const entries = [
      ['name', 'Name'],
      ['postcode', 'Postcode'],
      ['preferred_contact_method', 'Preferred contact method'],
      ['contact_value', 'Contact details'],
      ['job_type', 'Job type'],
      ['urgency', 'Urgency'],
      ['certification_uncertainty', 'Part P / certification'],
      ['attendance_preference', 'Attendance preference'],
      ['job_details', 'Message / job details']
    ];

    entries.forEach(([key, label]) => {
      const value = data.get(key);
      if (value && String(value).trim()) {
        lines.push(`${label}: ${String(value).trim()}`);
      }
    });

    if (file && typeof file === 'object' && 'name' in file && file.name) {
      lines.push(`Photo attachment: ${file.name}`);
    }

    lines.push('');
    lines.push('Please reply with the next available slot and any questions.');
    return lines.join('\n');
  }

  function createMailtoHref(form, summary) {
    const data = new FormData(form);
    const jobType = (data.get('job_type') || form.dataset.defaultJob || 'Quote request').toString();
    const postcode = (data.get('postcode') || '').toString().trim();
    const subject = postcode ? `Quote request — ${jobType} (${postcode})` : `Quote request — ${jobType}`;
    return `mailto:davidkosciesza@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
  }

  function createWhatsappHref(summary) {
    return `https://wa.me/447407023280?text=${encodeURIComponent(summary)}`;
  }

  function showFormStatus(statusEl, message, tone) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.classList.remove('is-success', 'is-error');
    if (tone === 'success') statusEl.classList.add('is-success');
    if (tone === 'error') statusEl.classList.add('is-error');
  }

  function clearFormState(form) {
    $$('[aria-invalid="true"]', form).forEach((field) => setFieldError(field, false));
    const summary = $('[data-form-errors]', form);
    const status = $('[data-form-status]', form);
    const list = $('[data-form-errors-list]', form);
    if (summary) summary.hidden = true;
    if (list) list.replaceChildren();
    if (status) {
      status.hidden = true;
      status.textContent = '';
      status.classList.remove('is-success', 'is-error');
    }
  }

  function validateQuoteForm(form) {
    const errors = [];
    const requiredFields = $$('[required]', form).filter((field) => !field.disabled);

    requiredFields.forEach((field) => {
      const value = 'value' in field ? String(field.value).trim() : '';
      if (!value) {
        setFieldError(field, true);
        errors.push({ field, message: `${getFieldLabel(field)} is required.` });
      } else {
        setFieldError(field, false);
      }
    });

    const method = $('[data-contact-method]', form)?.value || 'phone';
    const contactValue = $('[data-contact-value]', form);
    if (contactValue && String(contactValue.value).trim()) {
      const value = String(contactValue.value).trim();
      if (method === 'email') {
        const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!looksLikeEmail) {
          setFieldError(contactValue, true);
          errors.push({ field: contactValue, message: 'Enter a valid email address.' });
        }
      } else {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 8) {
          setFieldError(contactValue, true);
          errors.push({ field: contactValue, message: 'Enter a valid phone or WhatsApp number.' });
        }
      }
    }

    return errors;
  }

  function showValidationSummary(form, errors) {
    const summary = $('[data-form-errors]', form);
    const list = $('[data-form-errors-list]', form);
    if (!summary || !list || !errors.length) return;

    list.replaceChildren();
    errors.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item.message;
      list.append(li);
    });
    summary.hidden = false;
    summary.focus();
    errors[0]?.field?.focus();
  }

  function updateContactField(form) {
    const method = $('[data-contact-method]', form);
    const input = $('[data-contact-value]', form);
    const text = $('[data-contact-value-text]', form);
    const help = $('[data-contact-value-help]', form);
    if (!method || !input || !text || !help) return;

    const mode = method.value;
    if (mode === 'email') {
      text.textContent = 'Email address';
      input.type = 'email';
      input.autocomplete = 'email';
      input.inputMode = 'email';
      input.placeholder = 'you@example.com';
      help.textContent = 'Use the address where you want the reply.';
    } else if (mode === 'whatsapp') {
      text.textContent = 'WhatsApp number';
      input.type = 'tel';
      input.autocomplete = 'tel';
      input.inputMode = 'tel';
      input.placeholder = '07...';
      help.textContent = 'Use the number connected to WhatsApp.';
    } else {
      text.textContent = 'Phone number';
      input.type = 'tel';
      input.autocomplete = 'tel';
      input.inputMode = 'tel';
      input.placeholder = '07...';
      help.textContent = 'UK mobile or landline is fine.';
    }
  }

  function refreshFallbackTools(form) {
    const fallback = $('[data-fallback-tools]', form);
    if (!fallback || fallback.hidden) return;
    const summary = buildQuoteSummary(form);
    const whatsapp = $('[data-fallback-whatsapp]', form);
    const email = $('[data-fallback-email]', form);
    if (whatsapp) whatsapp.href = createWhatsappHref(summary);
    if (email) email.href = createMailtoHref(form, summary);
  }

  function resetDefaultJob(form) {
    const defaultJob = form.dataset.defaultJob;
    if (!defaultJob) return;
    const jobType = form.querySelector('[name="job_type"]');
    if (jobType) {
      jobType.value = defaultJob;
    }
  }

  function initQuoteForms() {
    $$('[data-quote-form]').forEach((form) => {
      const status = $('[data-form-status]', form);
      const fallback = $('[data-fallback-tools]', form);
      const whatsapp = $('[data-fallback-whatsapp]', form);
      const email = $('[data-fallback-email]', form);
      const copyButton = $('[data-copy-details]', form);
      const sourcePage = form.querySelector('[name="source_page"]');
      const contactMethod = $('[data-contact-method]', form);

      if (sourcePage) {
        sourcePage.value = currentPage;
      }

      updateContactField(form);
      resetDefaultJob(form);

      contactMethod?.addEventListener('change', () => {
        updateContactField(form);
        refreshFallbackTools(form);
      });

      form.addEventListener('input', () => {
        refreshFallbackTools(form);
      });

      copyButton?.addEventListener('click', async () => {
        const summary = buildQuoteSummary(form);
        try {
          await navigator.clipboard.writeText(summary);
          showFormStatus(status, 'Details copied. You can now paste them into WhatsApp, SMS or email.', 'success');
        } catch (_error) {
          showFormStatus(status, 'Copy failed on this device. Select the details via the email or WhatsApp buttons instead.', 'error');
        }
      });

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearFormState(form);

        const errors = validateQuoteForm(form);
        if (errors.length) {
          showValidationSummary(form, errors);
          return;
        }

        const summary = buildQuoteSummary(form);
        if (fallback) fallback.hidden = false;
        if (whatsapp) whatsapp.href = createWhatsappHref(summary);
        if (email) email.href = createMailtoHref(form, summary);

        const endpoint = (siteConfig.FORM_ACTION_URL || '').trim() ||
          ((form.getAttribute('action') || '').trim() && form.getAttribute('action') !== '/' ? form.getAttribute('action').trim() : '');

        if (!endpoint) {
          showFormStatus(
            status,
            'This packaged site is ready to deploy, but direct form delivery is not configured yet. Use WhatsApp, email, or copy the details below.',
            'error'
          );
          return;
        }

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            body: new FormData(form),
            headers: {
              Accept: 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
          }

          showFormStatus(
            status,
            'Thanks — your request has been sent. Expect a reply by your chosen contact method.',
            'success'
          );
          trackEvent('form_submit_success', { page: currentPage, form_context: form.dataset.formContext || currentPage });
          form.reset();
          resetDefaultJob(form);
          updateContactField(form);
          if (fallback) fallback.hidden = true;
        } catch (_error) {
          showFormStatus(
            status,
            'Sending is not active on this build, but your details are ready to send using the WhatsApp or email options below.',
            'error'
          );
        }
      });
    });
  }

  function normalizeFeed(data) {
    const normalized = {
      reviewSummary: data?.reviewSummary || data?.ratingText || DEFAULT_FEED.reviewSummary,
      reviews: [],
      photos: []
    };

    if (Array.isArray(data?.reviews)) {
      normalized.reviews = data.reviews
        .map((item) => {
          if (!item) return null;
          return {
            title:
              item.title ||
              item.headline ||
              item.author_name ||
              item.author ||
              'Customer feedback',
            tag: item.tag || item.label || (item.rating ? `${item.rating}★ rating` : 'Feedback'),
            text:
              item.text ||
              item.summary ||
              item.comment ||
              item.content ||
              'Reliable, tidy service for small electrical work and smart-home upgrades.'
          };
        })
        .filter(Boolean);
    }

    if (Array.isArray(data?.photos)) {
      normalized.photos = data.photos
        .map((item) => {
          if (!item) return null;
          return {
            src: item.src || item.url || item.photoUrl || item.image || '',
            alt: item.alt || item.title || 'Project image',
            title: item.title || item.captionTitle || 'Project snapshot',
            caption: item.caption || item.description || 'Recent work and installation example.'
          };
        })
        .filter((item) => item && item.src);
    }

    if (!normalized.reviews.length) normalized.reviews = DEFAULT_FEED.reviews;
    if (!normalized.photos.length) normalized.photos = DEFAULT_FEED.photos;
    return normalized;
  }

  async function getFeed(endpoint) {
    const url = endpoint || 'api/reviews-feed.json';
    if (feedCache.has(url)) return feedCache.get(url);

    const promise = fetch(url, { headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) throw new Error(`Feed error: ${response.status}`);
        return response.json();
      })
      .then((data) => normalizeFeed(data))
      .catch(() => DEFAULT_FEED);

    feedCache.set(url, promise);
    return promise;
  }

  function clearNode(node) {
    node.replaceChildren();
  }

  function createDot(index, onSelect) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slider-dot';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => onSelect(index));
    return dot;
  }

  function initSlider({ items, track, prev, next, dots, renderItem }) {
    if (!track || !items.length) return;

    clearNode(track);
    dots?.replaceChildren();
    items.forEach((item) => track.append(renderItem(item)));

    let index = 0;
    const dotNodes = dots
      ? items.map((_item, itemIndex) => {
          const dot = createDot(itemIndex, setIndex);
          dots.append(dot);
          return dot;
        })
      : [];

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dotNodes.forEach((dot, dotIndex) => {
        dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
      });
      if (prev) prev.hidden = items.length <= 1;
      if (next) next.hidden = items.length <= 1;
      if (dots) dots.hidden = items.length <= 1;
    }

    function setIndex(newIndex) {
      index = (newIndex + items.length) % items.length;
      update();
    }

    prev?.addEventListener('click', () => setIndex(index - 1));
    next?.addEventListener('click', () => setIndex(index + 1));
    update();
  }

  function renderReviewCard(item) {
    const card = document.createElement('article');
    card.className = 'grw-card';

    const top = document.createElement('div');
    top.className = 'grw-card-top';
    const badge = document.createElement('span');
    badge.className = 'grw-badge';
    badge.textContent = item.tag;
    top.append(badge);

    const title = document.createElement('h3');
    title.textContent = item.title;
    const text = document.createElement('p');
    text.textContent = item.text;

    card.append(top, title, text);
    return card;
  }

  function renderPhotoSlide(item) {
    const slide = document.createElement('div');
    slide.className = 'gph-slide';

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    img.decoding = 'async';

    const figcaption = document.createElement('figcaption');
    const title = document.createElement('h3');
    title.textContent = item.title;
    const caption = document.createElement('p');
    caption.textContent = item.caption;

    figcaption.append(title, caption);
    figure.append(img, figcaption);
    slide.append(figure);
    return slide;
  }

  async function initReviewWidgets() {
    const widgets = $$('[data-google-reviews]');
    await Promise.all(
      widgets.map(async (widget) => {
        const feed = await getFeed(widget.dataset.reviewsEndpoint);
        const items = (feed.reviews || DEFAULT_FEED.reviews).slice(0, Number(widget.dataset.maxReviews || 6));
        const rating = $('[data-grw-rating]', widget);
        const status = $('[data-grw-status]', widget);
        const slider = $('[data-grw-slider]', widget);
        const track = $('[data-grw-track]', widget);
        const prev = $('[data-grw-prev]', widget);
        const next = $('[data-grw-next]', widget);
        const dots = $('[data-grw-dots]', widget);

        if (rating) {
          rating.textContent = feed.reviewSummary || DEFAULT_FEED.reviewSummary;
        }

        if (!items.length || !slider || !track) {
          if (status) {
            status.hidden = false;
            status.textContent = 'Open the Google profile link to read the latest published reviews.';
          }
          return;
        }

        if (status) {
          status.hidden = true;
        }
        slider.hidden = false;
        initSlider({ items, track, prev, next, dots, renderItem: renderReviewCard });
      })
    );
  }

  async function initPhotoWidgets() {
    const widgets = $$('[data-google-photos]');
    await Promise.all(
      widgets.map(async (widget) => {
        const feed = await getFeed(widget.dataset.reviewsEndpoint);
        const items = (feed.photos || DEFAULT_FEED.photos).slice(0, Number(widget.dataset.maxPhotos || 10));
        const status = $('[data-gph-status]', widget);
        const slider = $('[data-gph-slider]', widget);
        const track = $('[data-gph-track]', widget);
        const prev = $('[data-gph-prev]', widget);
        const next = $('[data-gph-next]', widget);
        const dots = $('[data-gph-dots]', widget);

        if (!items.length || !slider || !track) {
          if (status) {
            status.hidden = false;
            status.textContent = 'Open the Google profile link below to see more photos.';
          }
          return;
        }

        if (status) {
          status.hidden = true;
        }
        slider.hidden = false;
        initSlider({ items, track, prev, next, dots, renderItem: renderPhotoSlide });
      })
    );
  }

  setCurrentYear();
  setActiveNavigation();
  initTrackedLinks();
  initServicesDropdown();
  initMobileDrawer();
  initReveal();
  makeCardsClickable();
  initMaps();
  initQuoteForms();
  initReviewWidgets();
  initPhotoWidgets();
})();
