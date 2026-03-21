(function () {
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
  var siteHeader = document.querySelector('[data-site-header]');
  var servicesDropdown = document.querySelector('[data-services-dropdown]');
  var servicesTrigger = document.querySelector('[data-services-trigger]');
  var servicesMenu = document.querySelector('[data-services-menu]');
  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobileDrawerWrap = document.querySelector('[data-mobile-drawer-wrap]');
  var mobileDrawer = document.querySelector('[data-mobile-drawer]');
  var mobileBackdrop = document.querySelector('[data-mobile-backdrop]');
  var mobileFirstLink = document.querySelector('[data-mobile-first-link]');
  var mobileCloseButtons = document.querySelectorAll('[data-mobile-close]');
  var lastFocusedElement = null;
  var isHeaderScrolled = false;
  var isHeaderHidden = false;
  var lastScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);

  function showHeader() {
    if (!siteHeader || !isHeaderHidden) {
      return;
    }
    isHeaderHidden = false;
    siteHeader.classList.remove('is-hidden');
  }

  function hideHeader() {
    if (!siteHeader || isHeaderHidden) {
      return;
    }
    isHeaderHidden = true;
    siteHeader.classList.add('is-hidden');
  }

  function setScrolledState() {
    if (!siteHeader) {
      return;
    }
    var y = Math.max(0, window.scrollY || window.pageYOffset || 0);
    var delta = y - lastScrollY;

    if (!isHeaderScrolled && y > 24) {
      isHeaderScrolled = true;
      siteHeader.classList.add('is-scrolled');
    }

    if (isHeaderScrolled && y < 8) {
      isHeaderScrolled = false;
      siteHeader.classList.remove('is-scrolled');
    }

    if (isMobileOpen()) {
      showHeader();
      lastScrollY = y;
      siteHeader.classList.toggle('is-scrolled', isHeaderScrolled);
      return;
    }

    if (y < 24) {
      showHeader();
      lastScrollY = y;
      siteHeader.classList.toggle('is-scrolled', isHeaderScrolled);
      return;
    }

    if (Math.abs(delta) >= 2) {
      if (delta > 0 && y > 80) {
        hideHeader();
      } else if (delta < 0) {
        showHeader();
      }
    }

    lastScrollY = y;
    siteHeader.classList.toggle('is-scrolled', isHeaderScrolled);
  }

  function closeServicesMenu() {
    if (!servicesDropdown || !servicesTrigger) {
      return;
    }
    servicesDropdown.classList.remove('open');
    servicesTrigger.setAttribute('aria-expanded', 'false');
  }

  function openServicesMenu() {
    if (!servicesDropdown || !servicesTrigger) {
      return;
    }
    servicesDropdown.classList.add('open');
    servicesTrigger.setAttribute('aria-expanded', 'true');
  }

  function isMobileOpen() {
    return Boolean(siteHeader && siteHeader.classList.contains('mobile-open'));
  }

  function closeMobileDrawer(restoreFocus) {
    if (!siteHeader || !mobileToggle || !mobileDrawerWrap) {
      return;
    }
    showHeader();
    siteHeader.classList.remove('mobile-open');
    mobileDrawerWrap.classList.remove('is-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    if (restoreFocus && lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function openMobileDrawer() {
    if (!siteHeader || !mobileToggle || !mobileDrawerWrap) {
      return;
    }
    showHeader();
    lastFocusedElement = document.activeElement;
    siteHeader.classList.add('mobile-open');
    mobileDrawerWrap.classList.add('is-open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileToggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    if (mobileFirstLink) {
      window.setTimeout(function () {
        if (typeof mobileFirstLink.focus === 'function') {
          mobileFirstLink.focus();
        }
      }, 20);
    }
  }

  if (siteHeader) {
    setScrolledState();
    window.addEventListener('scroll', setScrolledState, { passive: true });
  }

  if (servicesTrigger && servicesDropdown && servicesMenu) {
    servicesTrigger.addEventListener('click', function () {
      if (servicesDropdown.classList.contains('open')) {
        closeServicesMenu();
      } else {
        openServicesMenu();
      }
    });

    servicesMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeServicesMenu();
      });
    });
  }

  if (mobileToggle && mobileDrawerWrap) {
    mobileToggle.addEventListener('click', function () {
      if (isMobileOpen()) {
        closeMobileDrawer(false);
      } else {
        openMobileDrawer();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', function () {
      closeMobileDrawer(false);
    });
  }

  mobileCloseButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      closeMobileDrawer(false);
    });
  });

  if (mobileDrawer) {
    mobileDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileDrawer(false);
      });
    });
  }

  document.addEventListener('click', function (event) {
    if (servicesDropdown && servicesDropdown.classList.contains('open') && !servicesDropdown.contains(event.target)) {
      closeServicesMenu();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeServicesMenu();
      if (isMobileOpen()) {
        closeMobileDrawer(true);
      }
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1280 && isMobileOpen()) {
      closeMobileDrawer(false);
    }
  });

  var yearNodes = document.querySelectorAll('[data-year]');
  yearNodes.forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  var reveals = document.querySelectorAll('.reveal');
  var prefersReducedMotion = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reveals.length > 0) {
    if (prefersReducedMotion) {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  }

  var path = window.location.pathname.split('/').pop() || 'index.html';
  if (path && path.indexOf('.') === -1) {
    path = path + '.html';
  }
  var navLinks = document.querySelectorAll('a[data-page]');
  navLinks.forEach(function (link) {
    if (link.dataset.page === path) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  if (servicesTrigger && path === 'services.html') {
    servicesTrigger.classList.add('active');
  }

  function isSelectionActive() {
    if (!window.getSelection) {
      return false;
    }
    var selected = String(window.getSelection() || '').trim();
    return selected.length > 0;
  }

  function initClickableCards() {
    var cards = document.querySelectorAll('main .card');
    cards.forEach(function (card) {
      if (card.dataset.cardLinkReady === 'true') {
        return;
      }
      card.dataset.cardLinkReady = 'true';

      if (
        card.classList.contains('quote-form') ||
        card.classList.contains('map-card') ||
        card.querySelector('form, input, select, textarea, button, details, summary, iframe, [data-quote-form], [data-google-reviews], [data-google-photos]')
      ) {
        return;
      }

      var explicitHref = String(card.getAttribute('data-card-href') || '').trim();
      var explicitTarget = String(card.getAttribute('data-card-target') || '').trim() || '_self';
      var explicitRel = String(card.getAttribute('data-card-rel') || '').trim();
      var navigate = null;
      var label = '';

      if (explicitHref && explicitHref.indexOf('javascript:') !== 0) {
        navigate = function () {
          var helper = document.createElement('a');
          helper.href = explicitHref;
          helper.target = explicitTarget;
          if (explicitTarget === '_blank') {
            helper.rel = explicitRel || 'noopener noreferrer';
          } else if (explicitRel) {
            helper.rel = explicitRel;
          }
          helper.style.display = 'none';
          document.body.appendChild(helper);
          helper.click();
          helper.remove();
        };
      } else {
        var links = Array.prototype.slice
          .call(card.querySelectorAll('a[href]'))
          .filter(function (link) {
            var href = String(link.getAttribute('href') || '').trim();
            if (!href || href === '#' || href.indexOf('javascript:') === 0) {
              return false;
            }
            return true;
          });

        if (links.length !== 1) {
          return;
        }

        var primaryLink = links[0];
        navigate = function () {
          primaryLink.click();
        };
        label = String(primaryLink.textContent || '').replace(/\s+/g, ' ').trim();
      }

      var explicitLabel = String(card.getAttribute('data-card-label') || '').trim();
      if (explicitLabel) {
        label = explicitLabel;
      }
      if (!label) {
        var heading = card.querySelector('h3, h2');
        if (heading) {
          label = String(heading.textContent || '').replace(/\s+/g, ' ').trim();
        }
      }
      if (!label) {
        label = 'Open linked page';
      }

      card.classList.add('card-is-clickable');
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', label);

      card.addEventListener('click', function (event) {
        var target = event.target;
        if (target && typeof target.closest === 'function' && target.closest('a, button, input, select, textarea, label, summary, [role="button"]')) {
          return;
        }
        if (isSelectionActive()) {
          return;
        }
        navigate();
      });

      card.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }
        event.preventDefault();
        navigate();
      });
    });
  }

  initClickableCards();

  function openHashDetailsTarget() {
    var hash = String(window.location.hash || '').trim();
    if (!hash || hash.charAt(0) !== '#') {
      return;
    }
    var rawId = hash.slice(1);
    var targetId = rawId;
    try {
      targetId = decodeURIComponent(rawId);
    } catch (error) {
      targetId = rawId;
    }
    if (!targetId) {
      return;
    }
    var target = document.getElementById(targetId);
    if (target && target.tagName && target.tagName.toLowerCase() === 'details') {
      target.open = true;
    }
  }

  openHashDetailsTarget();
  window.addEventListener('hashchange', openHashDetailsTarget);

  function safeTrackEvent(eventName, params) {
    if (typeof window.gtag !== 'function') {
      return;
    }
    try {
      window.gtag('event', eventName, params || {});
    } catch (error) {
      if (window.console && typeof window.console.warn === 'function') {
        window.console.warn(error);
      }
    }
  }

  function isWhatsAppHref(href) {
    var lowered = String(href || '').toLowerCase();
    return lowered.indexOf('wa.me/') !== -1 || lowered.indexOf('api.whatsapp.com') !== -1;
  }

  document.addEventListener('click', function (event) {
    var link = event.target && typeof event.target.closest === 'function' ? event.target.closest('a[href]') : null;
    if (!link) {
      return;
    }

    var href = (link.getAttribute('href') || '').trim();
    if (!href) {
      return;
    }

    var explicitEventName = (link.getAttribute('data-track-event') || '').trim();
    var eventName = explicitEventName;
    if (!eventName) {
      if (href.indexOf('tel:') === 0) {
        eventName = 'tel_click';
      } else if (href.indexOf('mailto:') === 0) {
        eventName = 'email_click';
      } else if (isWhatsAppHref(href)) {
        eventName = 'whatsapp_click';
      }
    }

    if (!eventName) {
      return;
    }

    safeTrackEvent(eventName, {
      page_path: window.location.pathname,
      link_url: link.href,
      link_text: String(link.textContent || '').replace(/\s+/g, ' ').trim()
    });
  });

  function getConfigValue(key) {
    var config = window.SITE_CONFIG && typeof window.SITE_CONFIG === 'object' ? window.SITE_CONFIG : {};
    var value = config[key];
    return typeof value === 'string' ? value.trim() : '';
  }

  function isLocalPreviewHost() {
    var hostname = String(window.location.hostname || '').toLowerCase();
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
  }

  function setContactFieldMode(form) {
    var methodField = form.querySelector('[data-contact-method]');
    var valueField = form.querySelector('[data-contact-value]');
    var labelText = form.querySelector('[data-contact-value-text]');
    var helperText = form.querySelector('[data-contact-value-help]');
    if (!methodField || !valueField || !labelText || !helperText) {
      return;
    }

    var method = methodField.value;
    if (method === 'email') {
      labelText.textContent = 'Email address';
      valueField.type = 'email';
      valueField.placeholder = 'name@example.com';
      valueField.autocomplete = 'email';
      valueField.setAttribute('inputmode', 'email');
      helperText.textContent = 'We will reply by email.';
    } else if (method === 'whatsapp') {
      labelText.textContent = 'WhatsApp number';
      valueField.type = 'tel';
      valueField.placeholder = '07...';
      valueField.autocomplete = 'tel';
      valueField.setAttribute('inputmode', 'tel');
      helperText.textContent = 'Include the number linked to your WhatsApp account.';
    } else {
      labelText.textContent = 'Phone number';
      valueField.type = 'tel';
      valueField.placeholder = '07...';
      valueField.autocomplete = 'tel';
      valueField.setAttribute('inputmode', 'tel');
      helperText.textContent = 'UK mobile or landline is fine.';
    }
  }

  function clearQuoteErrors(form) {
    var summary = form.querySelector('[data-form-errors]');
    var summaryList = form.querySelector('[data-form-errors-list]');
    if (summary && summaryList) {
      summary.hidden = true;
      summaryList.innerHTML = '';
    }
    form.querySelectorAll('.form-error-message').forEach(function (node) {
      node.remove();
    });
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    });
  }

  function ensureFieldErrorNode(field) {
    var fieldId = field.id;
    if (!fieldId) {
      fieldId = 'field-' + Math.random().toString(36).slice(2, 10);
      field.id = fieldId;
    }
    var errorId = fieldId + '-error';
    var errorNode = field.parentElement ? field.parentElement.querySelector('.form-error-message') : null;
    if (!errorNode) {
      errorNode = document.createElement('p');
      errorNode.className = 'form-error-message';
      errorNode.id = errorId;
      if (field.parentElement) {
        field.parentElement.appendChild(errorNode);
      }
    }
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
    return errorNode;
  }

  function collectQuoteErrors(form) {
    var errors = [];
    var nameField = form.querySelector('[name="name"]');
    var methodField = form.querySelector('[name="preferred_contact_method"]');
    var contactValueField = form.querySelector('[name="contact_value"]');
    var postcodeField = form.querySelector('[name="postcode"]');
    var jobTypeField = form.querySelector('[name="job_type"]');
    var urgencyField = form.querySelector('[name="urgency"]');
    var messageField = form.querySelector('[name="job_details"]');
    var photoField = form.querySelector('[name="photo"]');

    var nameValue = nameField ? String(nameField.value || '').trim() : '';
    var methodValue = methodField ? String(methodField.value || '').trim() : '';
    var contactValue = contactValueField ? String(contactValueField.value || '').trim() : '';
    var postcodeValue = postcodeField ? String(postcodeField.value || '').trim() : '';
    var jobTypeValue = jobTypeField ? String(jobTypeField.value || '').trim() : '';
    var urgencyValue = urgencyField ? String(urgencyField.value || '').trim() : '';
    var messageValue = messageField ? String(messageField.value || '').trim() : '';

    if (!nameValue) {
      errors.push({ field: nameField, message: 'Enter your name.' });
    }
    if (!methodValue) {
      errors.push({ field: methodField, message: 'Choose how you want to be contacted.' });
    }
    if (!contactValue) {
      errors.push({ field: contactValueField, message: 'Enter your contact details.' });
    } else if (methodValue === 'email') {
      var emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue);
      if (!emailLooksValid) {
        errors.push({ field: contactValueField, message: 'Enter a valid email address.' });
      }
    } else {
      var digitsOnly = contactValue.replace(/\D/g, '');
      if (digitsOnly.length < 8) {
        errors.push({ field: contactValueField, message: 'Enter a valid phone number.' });
      }
    }
    if (!postcodeValue) {
      errors.push({ field: postcodeField, message: 'Enter the job postcode.' });
    }
    if (!jobTypeValue) {
      errors.push({ field: jobTypeField, message: 'Select a job type.' });
    }
    if (!urgencyValue) {
      errors.push({ field: urgencyField, message: 'Please select urgency.' });
    }
    if (!messageValue) {
      errors.push({ field: messageField, message: 'Describe what you need done.' });
    }
    if (photoField && photoField.files && photoField.files.length > 0) {
      var firstFile = photoField.files[0];
      if (firstFile && firstFile.type && firstFile.type.indexOf('image/') !== 0) {
        errors.push({ field: photoField, message: 'Photo upload must be an image file.' });
      }
    }

    return errors;
  }

  function showQuoteErrors(form, errors) {
    if (!errors.length) {
      return;
    }
    var summary = form.querySelector('[data-form-errors]');
    var summaryList = form.querySelector('[data-form-errors-list]');
    if (summary && summaryList) {
      summaryList.innerHTML = '';
      errors.forEach(function (item) {
        if (!item.field) {
          return;
        }
        var line = document.createElement('li');
        line.textContent = item.message;
        summaryList.appendChild(line);
      });
      summary.hidden = false;
      if (typeof summary.focus === 'function') {
        summary.focus();
      }
    }
    errors.forEach(function (item) {
      if (!item.field) {
        return;
      }
      var node = ensureFieldErrorNode(item.field);
      node.textContent = item.message;
    });
  }

  function setQuoteStatus(form, type, message) {
    var status = form.querySelector('[data-form-status]');
    if (!status) {
      return;
    }
    status.hidden = false;
    status.classList.remove('is-success', 'is-error', 'is-info');
    status.classList.add(type === 'success' ? 'is-success' : type === 'error' ? 'is-error' : 'is-info');
    status.textContent = message;
  }

  function clearQuoteStatus(form) {
    var status = form.querySelector('[data-form-status]');
    if (!status) {
      return;
    }
    status.hidden = true;
    status.classList.remove('is-success', 'is-error', 'is-info');
    status.textContent = '';
  }

  function setFormBusy(form, busy) {
    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = busy;
      if (busy) {
        submitButton.dataset.originalLabel = submitButton.textContent;
        submitButton.textContent = 'Sending...';
      } else if (submitButton.dataset.originalLabel) {
        submitButton.textContent = submitButton.dataset.originalLabel;
      }
    }
  }

  function formatQuoteDetails(form) {
    var name = String((form.querySelector('[name="name"]') || {}).value || '').trim();
    var method = String((form.querySelector('[name="preferred_contact_method"]') || {}).value || '').trim();
    var contact = String((form.querySelector('[name="contact_value"]') || {}).value || '').trim();
    var postcode = String((form.querySelector('[name="postcode"]') || {}).value || '').trim();
    var urgency = String((form.querySelector('[name="urgency"]') || {}).value || '').trim();
    var certificationUncertainty = String((form.querySelector('[name="certification_uncertainty"]') || {}).value || '').trim();
    var attendancePreference = String((form.querySelector('[name="attendance_preference"]') || {}).value || '').trim();
    var jobType = String((form.querySelector('[name="job_type"]') || {}).value || '').trim();
    var details = String((form.querySelector('[name="job_details"]') || {}).value || '').trim();
    var serviceContext = String(form.getAttribute('data-form-context') || '').trim();
    var photoField = form.querySelector('[name="photo"]');
    var photoValue = photoField && photoField.files && photoField.files.length > 0 ? 'Yes' : 'No';
    var sourcePage = window.location.pathname;

    return [
      'Quote request - Willesden Smart Homes',
      '',
      'Name: ' + name,
      'Preferred contact method: ' + method,
      'Phone or email: ' + contact,
      'Postcode: ' + postcode,
      'Urgency: ' + urgency,
      'Part P / certification: ' + certificationUncertainty,
      'Attendance preference: ' + attendancePreference,
      'Job type: ' + jobType,
      'Details: ' + details,
      'Photo attached in form: ' + photoValue,
      serviceContext ? 'Service context: ' + serviceContext : '',
      'Page: ' + sourcePage
    ]
      .filter(Boolean)
      .join('\n');
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var helper = document.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', '');
      helper.style.position = 'absolute';
      helper.style.left = '-9999px';
      document.body.appendChild(helper);
      helper.select();
      try {
        var copied = document.execCommand('copy');
        document.body.removeChild(helper);
        if (copied) {
          resolve();
        } else {
          reject(new Error('Copy command failed'));
        }
      } catch (error) {
        document.body.removeChild(helper);
        reject(error);
      }
    });
  }

  function configureFallbackTools(form, quoteDetailsText) {
    var fallbackWrap = form.querySelector('[data-fallback-tools]');
    if (!fallbackWrap) {
      return;
    }
    var whatsappLink = fallbackWrap.querySelector('[data-fallback-whatsapp]');
    var emailLink = fallbackWrap.querySelector('[data-fallback-email]');
    var copyButton = fallbackWrap.querySelector('[data-copy-details]');
    var jobType = String((form.querySelector('[name="job_type"]') || {}).value || '').trim();
    var postcode = String((form.querySelector('[name="postcode"]') || {}).value || '').trim();
    var mailSubject = 'Quote request - ' + (jobType || 'small electrical job') + (postcode ? ' (' + postcode + ')' : '');

    if (whatsappLink) {
      whatsappLink.href = 'https://wa.me/447407023280?text=' + encodeURIComponent(quoteDetailsText);
      whatsappLink.hidden = false;
    }
    if (emailLink) {
      emailLink.href = 'mailto:davidkosciesza@gmail.com?subject=' + encodeURIComponent(mailSubject) + '&body=' + encodeURIComponent(quoteDetailsText);
      emailLink.hidden = false;
    }
    if (copyButton) {
      copyButton.onclick = function () {
        copyTextToClipboard(quoteDetailsText)
          .then(function () {
            setQuoteStatus(form, 'success', 'Details copied. Paste them into WhatsApp or email.');
          })
          .catch(function () {
            setQuoteStatus(form, 'error', 'Copy failed on this browser. Please copy manually from the message fields.');
          });
      };
    }
    fallbackWrap.hidden = false;
  }

  function initQuoteForm(form) {
    if (form.dataset.quoteReady === 'true') {
      return;
    }
    form.dataset.quoteReady = 'true';

    var configuredAction = getConfigValue('FORM_ACTION_URL');
    var endpoint = (form.getAttribute('data-form-action') || configuredAction || '').trim();
    var formName = String(form.getAttribute('name') || '').trim();
    var hiddenSourcePage = form.querySelector('[name="source_page"]');
    var fallbackWrap = form.querySelector('[data-fallback-tools]');
    if (hiddenSourcePage) {
      hiddenSourcePage.value = window.location.pathname;
    }
    if (endpoint) {
      form.action = endpoint;
    }
    if (form.getAttribute('enctype') !== 'multipart/form-data') {
      form.setAttribute('enctype', 'multipart/form-data');
    }
    if (fallbackWrap) {
      fallbackWrap.hidden = true;
    }

    var methodField = form.querySelector('[data-contact-method]');
    if (methodField) {
      methodField.addEventListener('change', function () {
        setContactFieldMode(form);
      });
    }
    setContactFieldMode(form);

    form.addEventListener('submit', function (event) {
      clearQuoteErrors(form);
      clearQuoteStatus(form);

      var errors = collectQuoteErrors(form);
      if (errors.length) {
        event.preventDefault();
        showQuoteErrors(form, errors);
        setQuoteStatus(form, 'error', 'Please fix the highlighted fields and try again.');
        return;
      }

      var quoteDetailsText = formatQuoteDetails(form);
      var formData = new FormData(form);
      if (formName && !formData.get('form-name')) {
        formData.set('form-name', formName);
      }
      formData.set('source_page', window.location.pathname);
      formData.set('quote_details_plain', quoteDetailsText);

      if (!endpoint) {
        event.preventDefault();
        configureFallbackTools(form, quoteDetailsText);
        setQuoteStatus(form, 'info', 'Form submission is temporarily unavailable. Use WhatsApp, email, or copy details below.');
        return;
      }

      if (typeof fetch !== 'function') {
        return;
      }

      event.preventDefault();
      setFormBusy(form, true);

      var successfulJobType = String((form.querySelector('[name="job_type"]') || {}).value || '').trim();
      var successfulContactMethod = String((form.querySelector('[name="preferred_contact_method"]') || {}).value || '').trim();

      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      })
        .then(function (response) {
          if (!response.ok) {
            var submitError = new Error('Quote form request failed');
            submitError.status = response.status;
            throw submitError;
          }
          form.reset();
          setContactFieldMode(form);
          if (fallbackWrap) {
            fallbackWrap.hidden = true;
          }
          setQuoteStatus(form, 'success', 'Thanks. Your quote request was sent successfully.');
          safeTrackEvent('form_submit_success', {
            page_path: window.location.pathname,
            job_type: successfulJobType,
            contact_method: successfulContactMethod
          });
        })
        .catch(function (error) {
          configureFallbackTools(form, quoteDetailsText);
          if (error && Number(error.status) === 405 && isLocalPreviewHost()) {
            setQuoteStatus(
              form,
              'error',
              'Local preview cannot receive Netlify form submissions. Deploy to Netlify to capture enquiries, or use WhatsApp/email below.'
            );
            return;
          }
          setQuoteStatus(form, 'error', 'The form could not be sent right now. Use WhatsApp or email below.');
        })
        .finally(function () {
          setFormBusy(form, false);
        });
    });
  }

  var quoteForms = document.querySelectorAll('[data-quote-form]');
  quoteForms.forEach(function (form) {
    initQuoteForm(form);
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toReviewText(text) {
    var clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (clean.length > 360) {
      return clean.slice(0, 357) + '...';
    }
    return clean;
  }

  function starsFromRating(rating) {
    var rounded = Math.round(Math.max(0, Math.min(5, Number(rating) || 0)));
    var stars = '';
    var i;
    for (i = 0; i < rounded; i += 1) {
      stars += '*';
    }
    while (stars.length < 5) {
      stars += '-';
    }
    return stars;
  }

  function buildReviewSlide(review) {
    var authorName = review.author_name || 'Google user';
    var safeAuthorName = escapeHtml(authorName);
    var safeAuthorInitial = escapeHtml(authorName.charAt(0).toUpperCase() || 'G');
    var safeText = escapeHtml(toReviewText(review.text || ''));
    var safeRelativeTime = escapeHtml(review.relative_time_description || 'Recent review');
    var ratingValue = Number(review.rating) || 0;
    var starLine = starsFromRating(ratingValue);
    var profilePhoto = review.profile_photo_url ? escapeHtml(review.profile_photo_url) : '';
    var authorUrl = review.author_url ? escapeHtml(review.author_url) : '';

    var avatarMarkup = profilePhoto
      ? '<img class="grw-avatar" src="' + profilePhoto + '" alt="' + safeAuthorName + ' profile photo" loading="lazy" referrerpolicy="no-referrer">'
      : '<span class="grw-avatar-fallback" aria-hidden="true">' + safeAuthorInitial + '</span>';

    var authorMarkup = authorUrl
      ? '<a class="grw-author-link" href="' + authorUrl + '" target="_blank" rel="noopener noreferrer">' + safeAuthorName + '</a>'
      : '<span class="grw-author-link">' + safeAuthorName + '</span>';

    return (
      '<article class="grw-slide">' +
      '<div class="grw-card">' +
      '<div class="grw-top">' +
      '<div class="grw-user">' + avatarMarkup + '<div><strong>' + authorMarkup + '</strong><p class="grw-meta">' + safeRelativeTime + '</p></div></div>' +
      '<p class="grw-stars" aria-label="Rating ' + escapeHtml(ratingValue) + ' out of 5">' + escapeHtml(starLine) + '</p>' +
      '</div>' +
      '<p class="grw-text">' + safeText + '</p>' +
      '</div>' +
      '</article>'
    );
  }

  var reviewsUnavailableMessage = "Live Google reviews aren't available right now. Use the Google profile link to read all reviews.";

  function setReviewsFallback(widget, statusNode, ratingNode, sliderNode, trackNode, message) {
    var prevButton = widget.querySelector('[data-grw-prev]');
    var nextButton = widget.querySelector('[data-grw-next]');
    var dotsNode = widget.querySelector('[data-grw-dots]');

    if (widget) {
      widget.classList.remove('is-loading', 'is-ready');
      widget.classList.add('is-fallback');
    }

    if (trackNode) {
      trackNode.innerHTML = '';
    }
    if (sliderNode) {
      sliderNode.hidden = true;
    }
    if (statusNode) {
      statusNode.hidden = false;
      statusNode.textContent = message || reviewsUnavailableMessage;
    }
    if (ratingNode) {
      ratingNode.textContent = 'Google rating is unavailable on this page.';
    }
    if (prevButton) {
      prevButton.hidden = true;
    }
    if (nextButton) {
      nextButton.hidden = true;
    }
    if (dotsNode) {
      dotsNode.innerHTML = '';
      dotsNode.hidden = true;
    }
  }

  function fetchProxyPlaceData(endpoint, placeId, options) {
    var settings = options && typeof options === 'object' ? options : {};
    var maxReviews = Number(settings.maxReviews);
    var minRating = Number(settings.minRating);
    var maxPhotos = Number(settings.maxPhotos);
    var photoMaxWidth = Number(settings.photoMaxWidth);

    if (!isFinite(maxReviews)) {
      maxReviews = 6;
    }
    if (!isFinite(minRating)) {
      minRating = 0;
    }

    var separator = endpoint.indexOf('?') === -1 ? '?' : '&';
    var params = [
      ['placeId', String(placeId || '')],
      ['max', String(maxReviews)],
      ['minRating', String(minRating)]
    ];

    if (isFinite(maxPhotos) && maxPhotos >= 0) {
      params.push(['maxPhotos', String(maxPhotos)]);
    }
    if (isFinite(photoMaxWidth) && photoMaxWidth > 0) {
      params.push(['photoMaxWidth', String(photoMaxWidth)]);
    }

    var requestUrl =
      endpoint +
      separator +
      params
        .map(function (pair) {
          return encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]);
        })
        .join('&');

    return fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Reviews endpoint failed with HTTP ' + String(response.status));
      }
      return response.json();
    });
  }

  function fetchProxyReviews(endpoint, placeId, maxReviews, minRating) {
    return fetchProxyPlaceData(endpoint, placeId, {
      maxReviews: maxReviews,
      minRating: minRating
    });
  }

  function toUnixSeconds(value) {
    var numeric = Number(value);
    if (isFinite(numeric) && numeric > 0) {
      return Math.floor(numeric);
    }
    var parsed = Date.parse(String(value || ''));
    if (isFinite(parsed) && parsed > 0) {
      return Math.floor(parsed / 1000);
    }
    return 0;
  }

  function normalizeBrowserReview(review) {
    var item = review && typeof review === 'object' ? review : {};
    var attribution = item.authorAttribution && typeof item.authorAttribution === 'object' ? item.authorAttribution : {};
    return {
      author_name: item.author_name || item.authorName || attribution.displayName || 'Google user',
      rating: Number(item.rating) || 0,
      text: String(item.text || '').trim(),
      relative_time_description: item.relative_time_description || item.relativePublishTimeDescription || '',
      time: toUnixSeconds(item.time || item.publishTime),
      profile_photo_url: item.profile_photo_url || item.profilePhotoUrl || attribution.photoURI || '',
      author_url: item.author_url || item.authorUrl || attribution.uri || ''
    };
  }

  function normalizeBrowserPhoto(photo, photoMaxWidth) {
    var item = photo && typeof photo === 'object' ? photo : {};
    var url = '';
    if (typeof item.getUrl === 'function') {
      try {
        url = item.getUrl({ maxWidth: photoMaxWidth });
      } catch (error) {
        url = '';
      }
    } else if (typeof item.url === 'string') {
      url = item.url;
    }

    return {
      url: String(url || '').trim(),
      width: Number(item.width) || null,
      height: Number(item.height) || null,
      html_attributions: Array.isArray(item.html_attributions) ? item.html_attributions : []
    };
  }

  function fetchBrowserPlaceData(placeId, options) {
    var settings = options && typeof options === 'object' ? options : {};
    var maxReviews = Number(settings.maxReviews);
    var minRating = Number(settings.minRating);
    var maxPhotos = Number(settings.maxPhotos);
    var photoMaxWidth = Number(settings.photoMaxWidth);
    var mapsApiKey = getConfigValue('GOOGLE_MAPS_JS_API_KEY');

    if (!isFinite(maxReviews)) {
      maxReviews = 6;
    }
    if (!isFinite(minRating)) {
      minRating = 0;
    }
    if (!isFinite(maxPhotos)) {
      maxPhotos = 30;
    }
    if (!isFinite(photoMaxWidth)) {
      photoMaxWidth = 1200;
    }

    if (!mapsApiKey) {
      return Promise.reject(new Error('Browser fallback is missing GOOGLE_MAPS_JS_API_KEY.'));
    }

    return loadGoogleMapsApi(mapsApiKey).then(function () {
      if (!window.google || !window.google.maps || !window.google.maps.places || typeof window.google.maps.places.PlacesService !== 'function') {
        throw new Error('Google Maps Places library is unavailable in browser fallback.');
      }

      return new Promise(function (resolve, reject) {
        var service = new window.google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails(
          {
            placeId: String(placeId || ''),
            fields: ['name', 'rating', 'user_ratings_total', 'url', 'reviews', 'photos']
          },
          function (place, status) {
            var statusEnum = window.google && window.google.maps && window.google.maps.places && window.google.maps.places.PlacesServiceStatus;
            var okStatus = statusEnum ? statusEnum.OK : 'OK';
            if (status !== okStatus || !place) {
              reject(new Error('Google Places browser request failed with status ' + String(status || 'UNKNOWN')));
              return;
            }

            var rawReviews = Array.isArray(place.reviews) ? place.reviews.slice() : [];
            var reviews = rawReviews
              .filter(function (review) {
                return (Number(review && review.rating) || 0) >= minRating;
              })
              .sort(function (a, b) {
                return toUnixSeconds(b && (b.time || b.publishTime)) - toUnixSeconds(a && (a.time || a.publishTime));
              })
              .slice(0, maxReviews)
              .map(normalizeBrowserReview);

            var photos = [];
            if (maxPhotos > 0 && Array.isArray(place.photos)) {
              photos = place.photos
                .slice(0, maxPhotos)
                .map(function (photo) {
                  return normalizeBrowserPhoto(photo, photoMaxWidth);
                })
                .filter(function (photo) {
                  return Boolean(photo.url);
                });
            }

            resolve({
              name: place.name || '',
              rating: typeof place.rating === 'number' ? place.rating : Number(place.rating) || null,
              user_ratings_total: Number(place.user_ratings_total) || 0,
              url: place.url || '',
              reviews: reviews,
              photos: photos
            });
          }
        );
      });
    });
  }

  function setupReviewSlider(widget, slideCount) {
    var track = widget.querySelector('[data-grw-track]');
    var dots = widget.querySelector('[data-grw-dots]');
    var prev = widget.querySelector('[data-grw-prev]');
    var next = widget.querySelector('[data-grw-next]');

    if (!track || !dots || !prev || !next || slideCount < 1) {
      return;
    }

    var activeIndex = 0;
    var autoTimer = null;

    function render() {
      track.style.transform = 'translateX(-' + String(activeIndex * 100) + '%)';
      dots.querySelectorAll('button').forEach(function (dot, index) {
        var isActive = index === activeIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    function go(step) {
      activeIndex = (activeIndex + step + slideCount) % slideCount;
      render();
    }

    function goTo(index) {
      activeIndex = index;
      render();
    }

    function stopAuto() {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAuto() {
      stopAuto();
      if (slideCount > 1) {
        autoTimer = window.setInterval(function () {
          go(1);
        }, 6500);
      }
    }

    dots.innerHTML = '';
    var i;
    for (i = 0; i < slideCount; i += 1) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'grw-dot';
      dot.setAttribute('aria-label', 'Go to review ' + String(i + 1));
      dot.addEventListener('click', (function (dotIndex) {
        return function () {
          goTo(dotIndex);
          startAuto();
        };
      })(i));
      dots.appendChild(dot);
    }

    prev.addEventListener('click', function () {
      go(-1);
      startAuto();
    });

    next.addEventListener('click', function () {
      go(1);
      startAuto();
    });

    widget.addEventListener('mouseenter', stopAuto);
    widget.addEventListener('mouseleave', startAuto);
    widget.addEventListener('focusin', stopAuto);
    widget.addEventListener('focusout', startAuto);

    if (slideCount <= 1) {
      prev.hidden = true;
      next.hidden = true;
      dots.hidden = true;
    } else {
      prev.hidden = false;
      next.hidden = false;
      dots.hidden = false;
    }

    render();
    startAuto();
  }

  function initGoogleReviewsWidget(widget) {
    if (widget.dataset.grwReady === 'true') {
      return;
    }
    widget.dataset.grwReady = 'true';

    var endpoint = (widget.getAttribute('data-reviews-endpoint') || '').trim();
    var placeId = widget.getAttribute('data-place-id') || '';
    var profileUrl = widget.getAttribute('data-profile-url') || '';
    var parsedMaxReviews = parseInt(widget.getAttribute('data-max-reviews') || '6', 10);
    var parsedMinRating = parseFloat(widget.getAttribute('data-min-rating') || '0');
    var maxReviews = isFinite(parsedMaxReviews) ? Math.min(10, Math.max(1, parsedMaxReviews)) : 6;
    var minRating = isFinite(parsedMinRating) ? Math.max(0, Math.min(5, parsedMinRating)) : 0;

    var statusNode = widget.querySelector('[data-grw-status]');
    var ratingNode = widget.querySelector('[data-grw-rating]');
    var sliderNode = widget.querySelector('[data-grw-slider]');
    var trackNode = widget.querySelector('[data-grw-track]');

    widget.querySelectorAll('[data-grw-profile-link]').forEach(function (link) {
      if (profileUrl) {
        link.setAttribute('href', profileUrl);
      }
    });

    if (!statusNode || !sliderNode || !trackNode) {
      return;
    }

    if (!placeId) {
      setReviewsFallback(widget, statusNode, ratingNode, sliderNode, trackNode, reviewsUnavailableMessage);
      return;
    }

    widget.classList.remove('is-fallback', 'is-ready');
    widget.classList.add('is-loading');
    statusNode.textContent = 'Loading latest Google reviews';
    statusNode.hidden = false;
    if (ratingNode) {
      ratingNode.textContent = 'Checking Google rating...';
    }

    var placeDataPromise;
    if (endpoint && typeof fetch === 'function') {
      placeDataPromise = fetchProxyReviews(endpoint, placeId, maxReviews, minRating).catch(function (proxyError) {
        if (window.console && typeof window.console.warn === 'function') {
          window.console.warn('Reviews proxy unavailable, falling back to browser Places API.', proxyError);
        }
        return fetchBrowserPlaceData(placeId, {
          maxReviews: maxReviews,
          minRating: minRating,
          maxPhotos: 0
        });
      });
    } else {
      placeDataPromise = fetchBrowserPlaceData(placeId, {
        maxReviews: maxReviews,
        minRating: minRating,
        maxPhotos: 0
      });
    }

    placeDataPromise
      .then(function (place) {
        var placeData = place && typeof place === 'object' ? place : {};
        var reviews = Array.isArray(placeData.reviews) ? placeData.reviews.slice() : [];
        reviews = reviews
          .filter(function (review) {
            return (Number(review.rating) || 0) >= minRating;
          })
          .sort(function (a, b) {
            return (Number(b.time) || 0) - (Number(a.time) || 0);
          })
          .slice(0, maxReviews);

        var liveProfileUrl = profileUrl || placeData.url || '';
        widget.querySelectorAll('[data-grw-profile-link]').forEach(function (link) {
          if (liveProfileUrl) {
            link.setAttribute('href', liveProfileUrl);
          }
        });

        if (ratingNode) {
          var numericRating = Number(placeData.rating);
          var aggregateRating = isFinite(numericRating) && numericRating > 0 ? numericRating.toFixed(1) : 'N/A';
          var totalReviews = Number(placeData.user_ratings_total);
          if (!isFinite(totalReviews) || totalReviews < 0) {
            totalReviews = reviews.length || 0;
          }
          ratingNode.textContent =
            'Google rating: ' +
            aggregateRating +
            '/5 from ' +
            String(totalReviews) +
            ' review' +
            (totalReviews === 1 ? '' : 's');
        }

        if (!reviews.length) {
          setReviewsFallback(
            widget,
            statusNode,
            ratingNode,
            sliderNode,
            trackNode,
            'No matching reviews were returned. Use the Google profile link to read all reviews.'
          );
          return;
        }

        trackNode.innerHTML = reviews.map(buildReviewSlide).join('');
        sliderNode.hidden = false;
        statusNode.hidden = true;
        widget.classList.remove('is-loading', 'is-fallback');
        widget.classList.add('is-ready');

        setupReviewSlider(widget, reviews.length);
      })
      .catch(function (error) {
        setReviewsFallback(widget, statusNode, ratingNode, sliderNode, trackNode, reviewsUnavailableMessage);
        if (window.console && typeof window.console.error === 'function') {
          window.console.error(error);
        }
      });
  }

  var reviewWidgets = document.querySelectorAll('[data-google-reviews]');

  function initAllReviewWidgets() {
    reviewWidgets.forEach(function (widget) {
      initGoogleReviewsWidget(widget);
    });
  }

  if (reviewWidgets.length > 0) {
    if ('IntersectionObserver' in window) {
      var reviewObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }
            observer.unobserve(entry.target);
            initGoogleReviewsWidget(entry.target);
          });
        },
        {
          rootMargin: '300px 0px',
          threshold: 0
        }
      );

      reviewWidgets.forEach(function (widget) {
        reviewObserver.observe(widget);
      });
    } else if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAllReviewWidgets);
    } else {
      initAllReviewWidgets();
    }
  }

  var photosUnavailableMessage = "Live Google profile photos aren't available right now. Open the Google profile to view all photos.";

  function setPhotosFallback(widget, statusNode, sliderNode, trackNode, dotsNode, message) {
    var prevButton = widget.querySelector('[data-gph-prev]');
    var nextButton = widget.querySelector('[data-gph-next]');
    if (widget) {
      widget.classList.remove('is-loading', 'is-ready');
      widget.classList.add('is-fallback');
    }
    if (trackNode) {
      trackNode.innerHTML = '';
    }
    if (sliderNode) {
      sliderNode.hidden = true;
    }
    if (dotsNode) {
      dotsNode.innerHTML = '';
      dotsNode.hidden = true;
    }
    if (prevButton) {
      prevButton.hidden = true;
    }
    if (nextButton) {
      nextButton.hidden = true;
    }
    if (statusNode) {
      statusNode.hidden = false;
      statusNode.textContent = message || photosUnavailableMessage;
    }
  }

  function buildPhotoSlide(photo, profileUrl, index) {
    var photoUrl = photo && photo.url ? escapeHtml(photo.url) : '';
    if (!photoUrl) {
      return '';
    }

    var widthValue = Number(photo.width);
    var heightValue = Number(photo.height);
    var widthAttr = isFinite(widthValue) && widthValue > 0 ? ' width="' + String(Math.round(widthValue)) + '"' : '';
    var heightAttr = isFinite(heightValue) && heightValue > 0 ? ' height="' + String(Math.round(heightValue)) + '"' : '';
    var safeProfileUrl = profileUrl ? escapeHtml(profileUrl) : '';
    var linkUrl = safeProfileUrl || photoUrl;

    return (
      '<article class="gph-slide">' +
      '<figure class="gph-card">' +
      '<a class="gph-link" href="' +
      linkUrl +
      '" target="_blank" rel="noopener noreferrer">' +
      '<img class="gph-image" src="' +
      photoUrl +
      '" alt="Recent electrical job photo from Google profile (' +
      String(index + 1) +
      ')" loading="lazy" decoding="async"' +
      widthAttr +
      heightAttr +
      '>' +
      '</a>' +
      '<figcaption class="gph-caption">Recent Google profile photo ' +
      String(index + 1) +
      '</figcaption>' +
      '</figure>' +
      '</article>'
    );
  }

  function setupPhotoSlider(widget, slideCount) {
    var track = widget.querySelector('[data-gph-track]');
    var dots = widget.querySelector('[data-gph-dots]');
    var prev = widget.querySelector('[data-gph-prev]');
    var next = widget.querySelector('[data-gph-next]');

    if (!track || !dots || !prev || !next || slideCount < 1) {
      return;
    }

    var activeIndex = 0;
    var autoTimer = null;

    function render() {
      track.style.transform = 'translateX(-' + String(activeIndex * 100) + '%)';
      dots.querySelectorAll('button').forEach(function (dot, index) {
        var isActive = index === activeIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    function go(step) {
      activeIndex = (activeIndex + step + slideCount) % slideCount;
      render();
    }

    function goTo(index) {
      activeIndex = index;
      render();
    }

    function stopAuto() {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAuto() {
      stopAuto();
      if (slideCount > 1) {
        autoTimer = window.setInterval(function () {
          go(1);
        }, 6000);
      }
    }

    dots.innerHTML = '';
    var i;
    for (i = 0; i < slideCount; i += 1) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'gph-dot';
      dot.setAttribute('aria-label', 'Go to photo ' + String(i + 1));
      dot.addEventListener('click', (function (dotIndex) {
        return function () {
          goTo(dotIndex);
          startAuto();
        };
      })(i));
      dots.appendChild(dot);
    }

    prev.addEventListener('click', function () {
      go(-1);
      startAuto();
    });

    next.addEventListener('click', function () {
      go(1);
      startAuto();
    });

    widget.addEventListener('mouseenter', stopAuto);
    widget.addEventListener('mouseleave', startAuto);
    widget.addEventListener('focusin', stopAuto);
    widget.addEventListener('focusout', startAuto);

    if (slideCount <= 1) {
      prev.hidden = true;
      next.hidden = true;
      dots.hidden = true;
    } else {
      prev.hidden = false;
      next.hidden = false;
      dots.hidden = false;
    }

    render();
    startAuto();
  }

  function initGooglePhotosWidget(widget) {
    if (widget.dataset.gphReady === 'true') {
      return;
    }
    widget.dataset.gphReady = 'true';

    var endpoint = (widget.getAttribute('data-reviews-endpoint') || '').trim();
    var placeId = widget.getAttribute('data-place-id') || '';
    var profileUrl = widget.getAttribute('data-profile-url') || '';
    var parsedMaxPhotos = parseInt(widget.getAttribute('data-max-photos') || '30', 10);
    var parsedPhotoWidth = parseInt(widget.getAttribute('data-photo-width') || '1600', 10);
    var maxPhotos = isFinite(parsedMaxPhotos) ? Math.min(50, Math.max(1, parsedMaxPhotos)) : 30;
    var photoMaxWidth = isFinite(parsedPhotoWidth) ? Math.min(1600, Math.max(320, parsedPhotoWidth)) : 1600;
    var statusNode = widget.querySelector('[data-gph-status]');
    var sliderNode = widget.querySelector('[data-gph-slider]');
    var trackNode = widget.querySelector('[data-gph-track]');
    var dotsNode = widget.querySelector('[data-gph-dots]');

    widget.querySelectorAll('[data-gph-profile-link]').forEach(function (link) {
      if (profileUrl) {
        link.setAttribute('href', profileUrl);
      }
    });

    if (!statusNode || !sliderNode || !trackNode || !dotsNode) {
      return;
    }

    if (!placeId) {
      setPhotosFallback(widget, statusNode, sliderNode, trackNode, dotsNode, photosUnavailableMessage);
      return;
    }

    widget.classList.remove('is-fallback', 'is-ready');
    widget.classList.add('is-loading');
    statusNode.hidden = false;
    statusNode.textContent = 'Loading recent project photos';

    var photoDataPromise;
    if (endpoint && typeof fetch === 'function') {
      photoDataPromise = fetchProxyPlaceData(endpoint, placeId, {
        maxReviews: 1,
        minRating: 0,
        maxPhotos: maxPhotos,
        photoMaxWidth: photoMaxWidth
      }).catch(function (proxyError) {
        if (window.console && typeof window.console.warn === 'function') {
          window.console.warn('Photos proxy unavailable, falling back to browser Places API.', proxyError);
        }
        return fetchBrowserPlaceData(placeId, {
          maxReviews: 1,
          minRating: 0,
          maxPhotos: maxPhotos,
          photoMaxWidth: photoMaxWidth
        });
      });
    } else {
      photoDataPromise = fetchBrowserPlaceData(placeId, {
        maxReviews: 1,
        minRating: 0,
        maxPhotos: maxPhotos,
        photoMaxWidth: photoMaxWidth
      });
    }

    photoDataPromise
      .then(function (place) {
        var placeData = place && typeof place === 'object' ? place : {};
        var photos = Array.isArray(placeData.photos) ? placeData.photos.slice(0, maxPhotos) : [];
        photos = photos.filter(function (photo) {
          return photo && typeof photo.url === 'string' && photo.url.trim() !== '';
        });

        var liveProfileUrl = profileUrl || placeData.url || '';
        widget.querySelectorAll('[data-gph-profile-link]').forEach(function (link) {
          if (liveProfileUrl) {
            link.setAttribute('href', liveProfileUrl);
          }
        });

        if (!photos.length) {
          setPhotosFallback(
            widget,
            statusNode,
            sliderNode,
            trackNode,
            dotsNode,
            'No photos were returned from Google profile right now.'
          );
          return;
        }

        trackNode.innerHTML = photos
          .map(function (photo, index) {
            return buildPhotoSlide(photo, liveProfileUrl, index);
          })
          .join('');
        sliderNode.hidden = false;
        statusNode.hidden = true;
        widget.classList.remove('is-loading', 'is-fallback');
        widget.classList.add('is-ready');
        setupPhotoSlider(widget, photos.length);
      })
      .catch(function (error) {
        setPhotosFallback(widget, statusNode, sliderNode, trackNode, dotsNode, photosUnavailableMessage);
        if (window.console && typeof window.console.error === 'function') {
          window.console.error(error);
        }
      });
  }

  var photoWidgets = document.querySelectorAll('[data-google-photos]');

  function initAllPhotoWidgets() {
    photoWidgets.forEach(function (widget) {
      initGooglePhotosWidget(widget);
    });
  }

  if (photoWidgets.length > 0) {
    if ('IntersectionObserver' in window) {
      var photoObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }
            observer.unobserve(entry.target);
            initGooglePhotosWidget(entry.target);
          });
        },
        {
          rootMargin: '300px 0px',
          threshold: 0
        }
      );

      photoWidgets.forEach(function (widget) {
        photoObserver.observe(widget);
      });
    } else if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAllPhotoWidgets);
    } else {
      initAllPhotoWidgets();
    }
  }

  function showServiceAreaMapFallback(node) {
    if (!node) {
      return;
    }

    node.classList.remove('is-loading');
    node.classList.remove('is-ready');
    node.classList.add('is-fallback');
    node.innerHTML = '';

    var panel = document.createElement('div');
    panel.className = 'service-area-map-fallback';
    panel.innerHTML =
      '<strong>Coverage across NW London</strong>' +
      '<p>The live map is unavailable right now. Use the coverage page or open the Google profile map for the latest reference.</p>' +
      '<div class="service-area-map-fallback-chips" aria-hidden="true">' +
      '<span class="service-area-map-fallback-chip">NW10</span>' +
      '<span class="service-area-map-fallback-chip">NW2</span>' +
      '<span class="service-area-map-fallback-chip">NW6</span>' +
      '<span class="service-area-map-fallback-chip">W9</span>' +
      '<span class="service-area-map-fallback-chip">W10</span>' +
      '<span class="service-area-map-fallback-chip">W11</span>' +
      '</div>' +
      '<div class="service-area-map-fallback-links">' +
      '<a class="btn btn-secondary" href="areas.html">See areas covered</a>' +
      '<a class="btn btn-tertiary" href="https://www.google.com/maps/place/David+Smart-Home+Electrician/@51.5444585,-0.2330144,628m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2919882737e86193:0x4ef5de05e70472b9!8m2!3d51.5444585!4d-0.2330144!16s%2Fg%2F11ydnn76vp!5m1!1e1?hl=en&entry=ttu&g_ep=EgoyMDI2MDIyMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">Open Google Maps</a>' +
      '</div>';
    node.appendChild(panel);
  }

  function extractGeometryRings(geometry) {
    var rings = [];
    if (!geometry || !geometry.type || !Array.isArray(geometry.coordinates)) {
      return rings;
    }

    if (geometry.type === 'Polygon') {
      geometry.coordinates.forEach(function (ring) {
        if (Array.isArray(ring) && ring.length > 2) {
          rings.push(ring);
        }
      });
      return rings;
    }

    if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach(function (polygon) {
        if (!Array.isArray(polygon)) {
          return;
        }
        polygon.forEach(function (ring) {
          if (Array.isArray(ring) && ring.length > 2) {
            rings.push(ring);
          }
        });
      });
    }

    return rings;
  }

  function ringToLatLngPath(ring) {
    var path = [];
    ring.forEach(function (point) {
      if (!Array.isArray(point) || point.length < 2) {
        return;
      }
      var lng = Number(point[0]);
      var lat = Number(point[1]);
      if (!isFinite(lat) || !isFinite(lng)) {
        return;
      }
      path.push({ lat: lat, lng: lng });
    });

    if (path.length > 1) {
      var first = path[0];
      var last = path[path.length - 1];
      if (first.lat !== last.lat || first.lng !== last.lng) {
        path.push({ lat: first.lat, lng: first.lng });
      }
    }

    return path;
  }

  var googleMapsLoaderPromise = null;

  function hasGoogleMapsFeatures(requirePlacesLibrary) {
    return Boolean(
      window.google &&
        window.google.maps &&
        typeof window.google.maps.Map === 'function' &&
        (!requirePlacesLibrary || (window.google.maps.places && typeof window.google.maps.places.PlacesService === 'function'))
    );
  }

  function waitForGoogleMapsFeatures(requirePlacesLibrary) {
    return new Promise(function (resolve, reject) {
      var attempts = 0;

      function check() {
        if (hasGoogleMapsFeatures(requirePlacesLibrary)) {
          resolve(window.google.maps);
          return;
        }

        attempts += 1;
        if (attempts >= 80) {
          reject(new Error('Google Maps loaded without required constructors'));
          return;
        }

        window.setTimeout(check, 50);
      }

      check();
    });
  }

  function loadGoogleMapsApi(apiKey, options) {
    var settings = options && typeof options === 'object' ? options : {};
    var requirePlacesLibrary = settings.requirePlacesLibrary !== false;

    if (hasGoogleMapsFeatures(requirePlacesLibrary)) {
      return Promise.resolve(window.google.maps);
    }
    if (googleMapsLoaderPromise) {
      return googleMapsLoaderPromise.then(function () {
        return waitForGoogleMapsFeatures(requirePlacesLibrary);
      });
    }

    googleMapsLoaderPromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-google-maps-js]');
      if (existing) {
        existing.addEventListener('load', function () {
          waitForGoogleMapsFeatures(true).then(resolve).catch(reject);
        });
        existing.addEventListener('error', function () {
          reject(new Error('Failed to load Google Maps JavaScript API'));
        });
        return;
      }

      var script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        encodeURIComponent(apiKey) +
        '&v=weekly&libraries=places';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-google-maps-js', 'true');
      script.onload = function () {
        waitForGoogleMapsFeatures(true).then(resolve).catch(reject);
      };
      script.onerror = function () {
        reject(new Error('Failed to load Google Maps JavaScript API'));
      };
      document.head.appendChild(script);
    });

    return googleMapsLoaderPromise.then(function () {
      return waitForGoogleMapsFeatures(requirePlacesLibrary);
    });
  }

  var leafletLoaderPromise = null;

  function loadLeafletApi() {
    if (window.L && typeof window.L.map === 'function') {
      return Promise.resolve(window.L);
    }
    if (leafletLoaderPromise) {
      return leafletLoaderPromise;
    }

    leafletLoaderPromise = new Promise(function (resolve, reject) {
      var existingCss = document.querySelector('link[data-leaflet-css]');
      if (!existingCss) {
        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        css.setAttribute('data-leaflet-css', 'true');
        document.head.appendChild(css);
      }

      var existingScript = document.querySelector('script[data-leaflet-js]');
      if (existingScript) {
        existingScript.addEventListener('load', function () {
          if (window.L && typeof window.L.map === 'function') {
            resolve(window.L);
          } else {
            reject(new Error('Leaflet loaded without map namespace'));
          }
        });
        existingScript.addEventListener('error', function () {
          reject(new Error('Failed to load Leaflet JavaScript'));
        });
        return;
      }

      var script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.defer = true;
      script.setAttribute('data-leaflet-js', 'true');
      script.onload = function () {
        if (window.L && typeof window.L.map === 'function') {
          resolve(window.L);
        } else {
          reject(new Error('Leaflet loaded without map namespace'));
        }
      };
      script.onerror = function () {
        reject(new Error('Failed to load Leaflet JavaScript'));
      };
      document.head.appendChild(script);
    });

    return leafletLoaderPromise;
  }

  var serviceAreaGeometryPromise = null;

  function fetchServiceAreaGeometry() {
    if (serviceAreaGeometryPromise) {
      return serviceAreaGeometryPromise;
    }

    serviceAreaGeometryPromise = fetch('assets/service-area-postcodes.geojson', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Service area geometry request failed with HTTP ' + String(response.status));
      }
      return response.json();
    });

    return serviceAreaGeometryPromise;
  }

  function renderServiceAreaLeafletMap(node, featureCollection) {
    if (!node || !window.L || typeof window.L.map !== 'function') {
      return false;
    }

    var features = featureCollection && Array.isArray(featureCollection.features) ? featureCollection.features : [];
    if (!features.length) {
      return false;
    }

    node.innerHTML = '';
    var isCompact = Boolean(node.closest && node.closest('.quick-map'));
    var map = window.L.map(node, {
      zoomControl: !isCompact,
      scrollWheelZoom: false,
      attributionControl: false,
      preferCanvas: true
    });

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    var allPoints = [];
    features.forEach(function (feature) {
      var geometry = feature && feature.geometry ? feature.geometry : null;
      var rings = extractGeometryRings(geometry);
      if (!rings.length) {
        return;
      }

      rings.forEach(function (ring) {
        var path = ringToLatLngPath(ring);
        if (path.length < 3) {
          return;
        }

        var latLngPath = path.map(function (point) {
          return [point.lat, point.lng];
        });

        window.L.polygon(latLngPath, {
          color: '#dd5b48',
          weight: 2,
          opacity: 0.95,
          dashArray: '6 6',
          fillColor: '#dd5b48',
          fillOpacity: 0.08,
          interactive: false
        }).addTo(map);

        latLngPath.forEach(function (point) {
          allPoints.push(point);
        });
      });
    });

    if (!allPoints.length) {
      map.remove();
      return false;
    }

    var maxZoomAttr = parseFloat(node.getAttribute('data-max-zoom') || '');
    var maxZoom = isFinite(maxZoomAttr) ? maxZoomAttr : isCompact ? 11.6 : 11.2;
    map.fitBounds(allPoints, {
      padding: isCompact ? [14, 14] : [34, 34],
      maxZoom: maxZoom
    });

    window.setTimeout(function () {
      if (map && typeof map.invalidateSize === 'function') {
        map.invalidateSize();
      }
    }, 0);

    node.classList.remove('is-loading');
    node.classList.remove('is-fallback');
    node.classList.add('is-ready');
    return true;
  }

  function renderServiceAreaMap(node, featureCollection) {
    if (!node || !window.google || !window.google.maps) {
      showServiceAreaMapFallback(node);
      return;
    }

    var features = featureCollection && Array.isArray(featureCollection.features) ? featureCollection.features : [];
    if (!features.length) {
      showServiceAreaMapFallback(node);
      return;
    }

    var isCompact = Boolean(node.closest && node.closest('.quick-map'));
    var map = new window.google.maps.Map(node, {
      center: { lat: 51.545, lng: -0.231 },
      zoom: isCompact ? 11 : 10.8,
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: !isCompact,
      clickableIcons: false,
      gestureHandling: 'cooperative'
    });

    var bounds = new window.google.maps.LatLngBounds();
    var dashSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      strokeColor: '#dd5b48',
      scale: 3
    };

    features.forEach(function (feature) {
      var geometry = feature && feature.geometry ? feature.geometry : null;
      var rings = extractGeometryRings(geometry);
      if (!rings.length) {
        return;
      }

      rings.forEach(function (ring) {
        var path = ringToLatLngPath(ring);
        if (path.length < 3) {
          return;
        }

        path.forEach(function (point) {
          bounds.extend(point);
        });

        new window.google.maps.Polygon({
          map: map,
          paths: path,
          strokeOpacity: 0,
          strokeWeight: 0,
          fillColor: '#dd5b48',
          fillOpacity: 0.08,
          clickable: false,
          zIndex: 1
        });

        new window.google.maps.Polyline({
          map: map,
          path: path,
          strokeOpacity: 0,
          clickable: false,
          zIndex: 2,
          icons: [
            {
              icon: dashSymbol,
              offset: '0',
              repeat: '10px'
            }
          ]
        });
      });

    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, isCompact ? 14 : 36);
    }

    var maxZoomAttr = parseFloat(node.getAttribute('data-max-zoom') || '');
    var maxZoom = isFinite(maxZoomAttr) ? maxZoomAttr : isCompact ? 11.6 : 11.2;
    if (isFinite(maxZoom) && maxZoom > 0) {
      window.google.maps.event.addListenerOnce(map, 'idle', function () {
        if (typeof map.getZoom === 'function' && map.getZoom() > maxZoom) {
          map.setZoom(maxZoom);
        }
      });
    }

    node.classList.remove('is-loading');
    node.classList.remove('is-fallback');
    node.classList.add('is-ready');
  }

  var serviceAreaMapNodes = document.querySelectorAll('[data-service-area-map]');
  if (serviceAreaMapNodes.length > 0) {
    serviceAreaMapNodes.forEach(function (node) {
      node.classList.remove('is-ready', 'is-fallback');
      node.classList.add('is-loading');
    });

    function renderLeafletFallback() {
      return Promise.all([loadLeafletApi(), fetchServiceAreaGeometry()])
        .then(function (result) {
          var featureCollection = result[1];
          serviceAreaMapNodes.forEach(function (node) {
            var rendered = renderServiceAreaLeafletMap(node, featureCollection);
            if (!rendered) {
              showServiceAreaMapFallback(node);
            }
          });
        })
        .catch(function () {
          serviceAreaMapNodes.forEach(function (node) {
            showServiceAreaMapFallback(node);
          });
        });
    }

    renderLeafletFallback();
  }
=======
=======
>>>>>>> theirs
  const yearNodes = document.querySelectorAll('[data-year]');
  const year = new Date().getFullYear();
  yearNodes.forEach((node) => { node.textContent = year; });

  const currentPage = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('[data-page]').forEach((link) => {
    if (link.getAttribute('data-page') === currentPage) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('is-active');
    }
  });

  document.querySelectorAll('[data-card-href]').forEach((card) => {
    const href = card.getAttribute('data-card-href');
    if (!href) return;
    card.tabIndex = 0;
    card.style.cursor = 'pointer';
    const openCard = (event) => {
      if (event.target.closest('a, button, input, select, textarea, summary')) return;
      window.location.href = href;
    };
    card.addEventListener('click', openCard);
    card.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('a, button, input, select, textarea, summary')) {
        event.preventDefault();
        window.location.href = href;
      }
    });
  });

  const drawerWrap = document.querySelector('[data-mobile-drawer-wrap]');
  const drawer = document.querySelector('[data-mobile-drawer]');
  const toggle = document.querySelector('[data-mobile-toggle]');
  const closeBtn = document.querySelector('[data-mobile-close]');
  const backdrop = document.querySelector('[data-mobile-backdrop]');
  const firstLink = document.querySelector('[data-mobile-first-link]');

  function setDrawer(open) {
    if (!drawerWrap || !drawer || !toggle) return;
    drawerWrap.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('menu-open', open);
    if (open && firstLink) firstLink.focus();
  }

  if (toggle) toggle.addEventListener('click', () => setDrawer(!drawerWrap.classList.contains('is-open')));
  if (closeBtn) closeBtn.addEventListener('click', () => setDrawer(false));
  if (backdrop) backdrop.addEventListener('click', () => setDrawer(false));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setDrawer(false); });

  const dropdown = document.querySelector('[data-services-dropdown]');
  const dropdownBtn = document.querySelector('[data-services-trigger]');
  if (dropdown && dropdownBtn) {
    dropdownBtn.addEventListener('click', () => {
      const open = dropdown.classList.toggle('is-open');
      dropdownBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('is-open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    document.querySelectorAll('[data-year]').forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });

    const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('[data-page]').forEach((node) => {
      const target = (node.getAttribute('data-page') || '').toLowerCase();
      if (target && target === currentFile) {
        node.setAttribute('aria-current', 'page');
      }
    });

    document.querySelectorAll('[data-card-href]').forEach((card) => {
      const href = card.getAttribute('data-card-href');
      if (!href) return;
      card.tabIndex = 0;
      card.style.cursor = 'pointer';
      const activate = () => window.location.href = href;
      card.addEventListener('click', (event) => {
        if (event.target.closest('a, button, input, select, textarea, label')) return;
        activate();
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      });
    });

    const drawerWrap = document.querySelector('[data-mobile-drawer-wrap]');
    const drawer = document.querySelector('[data-mobile-drawer]');
    const toggle = document.querySelector('[data-mobile-toggle]');
    const closeButton = document.querySelector('[data-mobile-close]');
    const backdrop = document.querySelector('[data-mobile-backdrop]');

    const setDrawer = (open) => {
      if (!drawerWrap || !drawer || !toggle) return;
      drawerWrap.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    };

    if (toggle) {
      toggle.addEventListener('click', () => {
        const open = !document.body.classList.contains('menu-open');
        setDrawer(open);
      });
    }
    [closeButton, backdrop].forEach((node) => {
      if (node) node.addEventListener('click', () => setDrawer(false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setDrawer(false);
    });

    const servicesDropdown = document.querySelector('[data-services-dropdown]');
    const servicesTrigger = document.querySelector('[data-services-trigger]');
    if (servicesDropdown && servicesTrigger) {
      const setOpen = (open) => {
        servicesDropdown.classList.toggle('is-open', open);
        servicesTrigger.setAttribute('aria-expanded', String(open));
      };
      servicesTrigger.addEventListener('click', () => {
        const isOpen = servicesDropdown.classList.contains('is-open');
        setOpen(!isOpen);
      });
      document.addEventListener('click', (event) => {
        if (!servicesDropdown.contains(event.target)) setOpen(false);
      });
    }

    document.querySelectorAll('[data-quote-form]').forEach((form) => {
      const sourcePage = form.querySelector('input[name="source_page"]');
      if (sourcePage && !sourcePage.value) sourcePage.value = window.location.pathname.split('/').pop() || 'index.html';

      const servicePage = form.querySelector('input[name="service_page"]');
      const defaultJob = form.getAttribute('data-default-job');
      if (servicePage && defaultJob && !servicePage.value) servicePage.value = defaultJob;

      const contactMethod = form.querySelector('[data-contact-method]');
      const contactValue = form.querySelector('[data-contact-value]');
      const contactValueText = form.querySelector('[data-contact-value-text]');
      const contactValueHelp = form.querySelector('[data-contact-value-help]');

      const updateContactField = () => {
        if (!contactMethod || !contactValue) return;
        const value = contactMethod.value;
        const meta = {
          phone: ['Phone number', 'tel', '07...', 'UK mobile or landline is fine.'],
          whatsapp: ['WhatsApp number', 'tel', '07...', 'Use the mobile number linked to WhatsApp if possible.'],
          email: ['Email address', 'email', 'name@example.com', 'We will reply by email using this address.']
        }[value] || ['Phone number', 'tel', '07...', 'UK mobile or landline is fine.'];
        if (contactValueText) contactValueText.textContent = meta[0];
        contactValue.type = meta[1];
        contactValue.placeholder = meta[2];
        contactValue.setAttribute('inputmode', meta[1] === 'email' ? 'email' : 'tel');
        if (contactValueHelp) contactValueHelp.textContent = meta[3];
      };
      if (contactMethod) {
        updateContactField();
        contactMethod.addEventListener('change', updateContactField);
      }

      const copyButton = form.querySelector('[data-copy-details]');
      if (copyButton) {
        copyButton.addEventListener('click', async () => {
          const data = new FormData(form);
          const lines = [];
          for (const [key, value] of data.entries()) {
            if (typeof value === 'string' && value.trim()) lines.push(`${key}: ${value.trim()}`);
          }
          if (!lines.length || !navigator.clipboard) return;
          await navigator.clipboard.writeText(lines.join('\n'));
          copyButton.textContent = 'Copied';
          setTimeout(() => { copyButton.textContent = 'Copy details'; }, 2000);
        });
      }
    });
  });
>>>>>>> theirs
})();
