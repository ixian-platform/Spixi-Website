/**
 * Navigation Module
 * Handles navbar scroll behavior and mobile menu interactions
 *
 * This script was extracted from inline scripts that were duplicated
 * across all HTML pages for better maintainability.
 */
(function() {
  'use strict';

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

  let lastScrollTop = 0;
  const scrollThreshold = 50;

  // Guard clause if elements don't exist
  if (!navbar) return;

  /**
   * Handle scroll behavior - add/remove scrolled and hidden classes
   */
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add scrolled class when page is scrolled down
    if (scrollTop > scrollThreshold) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    // Hide navbar when scrolling down, show when scrolling up
    if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
      navbar.classList.add('navbar--hidden');
    } else {
      navbar.classList.remove('navbar--hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  /**
   * Open mobile menu
   */
  let trapKeydownHandler = null;
  let previousActiveElement = null;

  function trapFocus() {
    if (!mobileMenu) return;
    const focusable = mobileMenu.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const firstElem = focusable[0];
    const lastElem = focusable[focusable.length - 1];
    previousActiveElement = document.activeElement;
    if (firstElem) firstElem.focus();

    trapKeydownHandler = function(e) {
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
        closeMenu();
      }
    };
    document.addEventListener('keydown', trapKeydownHandler);
  }

  function releaseFocus() {
    if (trapKeydownHandler) {
      document.removeEventListener('keydown', trapKeydownHandler);
      trapKeydownHandler = null;
    }
    if (previousActiveElement && previousActiveElement.focus) previousActiveElement.focus();
    previousActiveElement = null;
  }

  function openMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.add('mobile-menu--open');
    document.body.classList.add('body--menu-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation');
    mobileMenu.setAttribute('aria-hidden', 'false');
    trapFocus();
  }

  /**
   * Close mobile menu
   */
  function closeMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.remove('mobile-menu--open');
    document.body.classList.remove('body--menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    mobileMenu.setAttribute('aria-hidden', 'true');
    releaseFocus();
  }

  // Event listeners
  window.addEventListener('scroll', handleScroll, false);

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      if (mobileMenu && mobileMenu.classList.contains('mobile-menu--open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }

  // Close menu when clicking a link
  mobileMenuLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside (on the overlay)
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function(e) {
      if (e.target === mobileMenu) {
        closeMenu();
      }
    });
  }

  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('mobile-menu--open')) {
      closeMenu();
    }
  });
})();

/* Image entrance animation using IntersectionObserver
   - Adds `.img-animate` to eligible images and toggles `.is-visible` when scrolled into view
   - Skips images that are explicitly opted out via `data-animate="false"`, decorative (aria-hidden),
     or internal UI icons/buttons (best-effort based on DOM position and class names)
*/
(function() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  function isEligible(img) {
    if (!img || img.nodeName !== 'IMG') return false;
    if (img.getAttribute('data-animate') === 'false') return false;
    if (img.getAttribute('aria-hidden') === 'true') return false;
    if (img.closest('button') || img.closest('a.btn') || img.closest('.btn')) return false;
    // Disable animation for any image inside hero sections
    if (img.closest('[class*="hero"]')) return false;
    var cn = img.className || '';
    var alt = img.getAttribute('alt') || '';
    // Heuristic: skip icons, logos, badges and common UI images
    var skipRe = /icon|logo|spinner|badge|social|github|toggle|menu|store-badge/i;
    if (skipRe.test(cn) || skipRe.test(alt)) return false;
    return true;
  }

  function initImageAnimations() {
    // Narrow selection: images inside hero/featured/cta/content containers only.
    // Exclude images inside cards (app-card, card-md, card-lg) as requested.
    var containerSelectors = [
      '.miniapps-hero',
      '.download-hero',
      '.hero',
      '.featured',
      '.featured__carousel',
      '.cta-band',
      '.resources-section',
      '.miniapps-hero__media',
      '.miniapps-hero__content',
      'main',
      'article',
      'section'
    ];

    var imgsSet = new Set();
    containerSelectors.forEach(function(sel) {
      var nodes = document.querySelectorAll(sel + ' img');
      nodes.forEach(function(i) {
        // explicitly skip images inside card components
        if (i.closest('.app-card, .card-md, .card-lg')) return;
        if (isEligible(i)) imgsSet.add(i);
      });
    });

    var imgs = Array.from(imgsSet);
    if (!imgs.length) return;

    imgs.forEach(function(img) {
      img.classList.add('img-animate');
    });

    // Trigger a bit later (image more in-view) so animation is visible and not too early
    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // Use double rAF to ensure the browser has applied the initial state
          // before we add the visible class so the transition animates smoothly
          requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              el.classList.add('is-visible');
              obs.unobserve(el);
            });
          });
        }
      });
    }, { root: null, rootMargin: '0px 0px -18% 0px', threshold: 0.18 });

    imgs.forEach(function(img) {
      observer.observe(img);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageAnimations);
  } else {
    initImageAnimations();
  }
})();
