/**
 * Cookie Consent Management
 * Handles cookie banner display and user consent preferences
 */
(function() {
  'use strict';

  const COOKIE_NAME = 'SpixiCookieConsent';
  const COOKIE_EXPIRY_DAYS = 365;

  // Cookie consent state
  let consentState = {
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false
  };

  /**
   * Get cookie value by name
   */
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  /**
   * Set cookie with expiry
   */
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  /**
   * Load consent from cookie
   */
  function loadConsent() {
    const stored = getCookie(COOKIE_NAME);
    if (stored) {
      try {
        const parsed = JSON.parse(decodeURIComponent(stored));
        consentState = { ...consentState, ...parsed };
        return true;
      } catch (e) {
        return false;
      }
    }
    // Fallback to localStorage if cookie isn't available
    try {
      const lsStored = localStorage.getItem(COOKIE_NAME);
      if (lsStored) {
        const parsed = JSON.parse(lsStored);
        consentState = { ...consentState, ...parsed };
        return true;
      }
    } catch (e) {
      // ignore
    }
    return false;
  }

  /**
   * Save consent to cookie
   */
  function saveConsent() {
    setCookie(COOKIE_NAME, encodeURIComponent(JSON.stringify(consentState)), COOKIE_EXPIRY_DAYS);
    try {
      localStorage.setItem(COOKIE_NAME, JSON.stringify(consentState));
    } catch (e) {
      // ignore localStorage errors
    }
  }

  /**
   * Apply consent settings (enable/disable tracking scripts)
   */
  function applyConsent() {
    // Handle Google Analytics based on analytics consent
    if (consentState.analytics && typeof gtag === 'function') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }

    // Dispatch event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
      detail: consentState
    }));
  }

  /**
   * Show cookie banner
   */
  function showBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
      banner.classList.add('cookie-banner--visible');
      document.body.classList.add('body--cookie-banner-open');
    }
  }

  /**
   * Hide cookie banner
   */
  function hideBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
      banner.classList.remove('cookie-banner--visible');
      document.body.classList.remove('body--cookie-banner-open');
    }
  }

  /**
   * Show cookie settings modal
   */
  function showSettings() {
    const modal = document.getElementById('cookieSettings');
    if (modal) {
      // Update checkboxes to reflect current state
      const analyticsCheckbox = document.getElementById('cookieAnalytics');
      const marketingCheckbox = document.getElementById('cookieMarketing');
      if (analyticsCheckbox) analyticsCheckbox.checked = consentState.analytics;
      if (marketingCheckbox) marketingCheckbox.checked = consentState.marketing;

      modal.classList.add('cookie-settings--visible');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('body--modal-open');
      trapModalFocus(modal);
    }
  }

  /**
   * Hide cookie settings modal
   */
  function hideSettings() {
    const modal = document.getElementById('cookieSettings');
    if (modal) {
      modal.classList.remove('cookie-settings--visible');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('body--modal-open');
      releaseModalFocus();
    }
  }

  /**
   * Accept all cookies
   */
  function acceptAll() {
    consentState.analytics = true;
    consentState.marketing = true;
    saveConsent();
    applyConsent();
    hideBanner();
    hideSettings();
  }

  /**
   * Reject non-essential cookies
   */
  function rejectAll() {
    consentState.analytics = false;
    consentState.marketing = false;
    saveConsent();
    applyConsent();
    hideBanner();
    hideSettings();
  }

  /**
   * Save custom preferences from settings modal
   */
  function savePreferences() {
    const analyticsCheckbox = document.getElementById('cookieAnalytics');
    const marketingCheckbox = document.getElementById('cookieMarketing');

    if (analyticsCheckbox) consentState.analytics = analyticsCheckbox.checked;
    if (marketingCheckbox) consentState.marketing = marketingCheckbox.checked;

    saveConsent();
    applyConsent();
    hideBanner();
    hideSettings();
  }

  /**
   * Initialize cookie consent
   */
  function init() {
    // Load existing consent
    const hasConsent = loadConsent();

    // Setup event listeners
    const acceptAllBtn = document.getElementById('cookieAcceptAll');
    const rejectAllBtn = document.getElementById('cookieRejectAll');
    const settingsBtn = document.getElementById('cookieSettingsBtn');
    const saveBtn = document.getElementById('cookieSavePrefs');
    const closeSettingsBtn = document.getElementById('cookieSettingsClose');
    const settingsModal = document.getElementById('cookieSettings');

    if (acceptAllBtn) acceptAllBtn.addEventListener('click', acceptAll);
    // Accept All in the cookie settings modal
    const settingsAcceptAllBtn = document.getElementById('cookieSettingsAcceptAll');
    if (settingsAcceptAllBtn) settingsAcceptAllBtn.addEventListener('click', acceptAll);
    if (rejectAllBtn) rejectAllBtn.addEventListener('click', rejectAll);
    if (settingsBtn) settingsBtn.addEventListener('click', showSettings);
    if (saveBtn) saveBtn.addEventListener('click', savePreferences);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', hideSettings);

    // Close modal on backdrop click
    if (settingsModal) {
      settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
          hideSettings();
        }
      });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const modal = document.getElementById('cookieSettings');
        if (modal && modal.classList.contains('cookie-settings--visible')) {
          hideSettings();
        }
      }
    });

    // Focus trap for cookie settings modal
    let modalTrapKeydown = null;
    let modalPreviousActive = null;

    function trapModalFocus(modal) {
      if (!modal) return;
      const focusable = modal.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      const firstElem = focusable[0];
      const lastElem = focusable[focusable.length - 1];
      modalPreviousActive = document.activeElement;
      if (firstElem) firstElem.focus();
      modalTrapKeydown = function(e) {
        if (e.key === 'Tab') {
          if (focusable.length === 0) {
            e.preventDefault();
            return;
          }
          if (e.shiftKey && document.activeElement === firstElem) {
            e.preventDefault();
            lastElem.focus();
          } else if (!e.shiftKey && document.activeElement === lastElem) {
            e.preventDefault();
            firstElem.focus();
          }
        } else if (e.key === 'Escape') {
          hideSettings();
        }
      };
      document.addEventListener('keydown', modalTrapKeydown);
    }

    function releaseModalFocus() {
      if (modalTrapKeydown) {
        document.removeEventListener('keydown', modalTrapKeydown);
        modalTrapKeydown = null;
      }
      if (modalPreviousActive && modalPreviousActive.focus) modalPreviousActive.focus();
      modalPreviousActive = null;
    }

    // Show banner if no consent stored
    if (!hasConsent) {
      // Delay showing banner slightly for better UX
      setTimeout(showBanner, 500);
    } else {
      // Apply existing consent
      applyConsent();
    }
  }

  // Expose functions globally for external access
  window.CookieConsent = {
    showSettings: showSettings,
    hideSettings: hideSettings,
    acceptAll: acceptAll,
    rejectAll: rejectAll,
    getConsent: function() { return { ...consentState }; }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
