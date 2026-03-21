<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
window.SITE_CONFIG = window.SITE_CONFIG || {};

// Netlify Forms endpoint (same-origin root path). Quote forms include data-netlify metadata in HTML.
window.SITE_CONFIG.FORM_ACTION_URL = '/';

// Public browser key for Google Maps JavaScript API (restrict this key by referrer + API scope in Google Cloud).
window.SITE_CONFIG.GOOGLE_MAPS_JS_API_KEY = 'AIzaSyAjSnKQCXOtu4O7OqH23Yd500r6SrBreWs';
=======
=======
>>>>>>> theirs
(function () {
  const forms = document.querySelectorAll('[data-quote-form]');
  forms.forEach((form) => {
    const sourceField = form.querySelector('input[name="source_page"]');
    if (sourceField && !sourceField.value) sourceField.value = location.pathname.split('/').pop() || 'index.html';

    const serviceField = form.querySelector('input[name="service_page"]');
    if (serviceField && form.dataset.defaultJob) serviceField.value = form.dataset.defaultJob;

    const methodSelect = form.querySelector('[data-contact-method]');
    const valueLabel = form.querySelector('[data-contact-value-text]');
    const valueInput = form.querySelector('[data-contact-value]');
    const valueHelp = form.querySelector('[data-contact-value-help]');

    const config = {
      phone: { label: 'Phone number', type: 'tel', inputmode: 'tel', autocomplete: 'tel', placeholder: '07...', help: 'UK mobile or landline is fine.' },
      email: { label: 'Email address', type: 'email', inputmode: 'email', autocomplete: 'email', placeholder: 'name@example.com', help: 'We will reply by email.' },
      whatsapp: { label: 'WhatsApp number', type: 'tel', inputmode: 'tel', autocomplete: 'tel', placeholder: '07...', help: 'Use the best number for WhatsApp replies.' }
    };

    function applyMethod() {
      if (!methodSelect || !valueInput) return;
      const selected = config[methodSelect.value] || config.phone;
      if (valueLabel) valueLabel.textContent = selected.label;
      valueInput.type = selected.type;
      valueInput.setAttribute('inputmode', selected.inputmode);
      valueInput.setAttribute('autocomplete', selected.autocomplete);
      valueInput.placeholder = selected.placeholder;
      if (valueHelp) valueHelp.textContent = selected.help;
    }

    if (methodSelect) {
      applyMethod();
      methodSelect.addEventListener('change', applyMethod);
    }
  });
})();
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
window.SITE_CONFIG = window.SITE_CONFIG || {};
window.SITE_CONFIG.FORM_ACTION_URL = window.SITE_CONFIG.FORM_ACTION_URL || '';
>>>>>>> theirs
