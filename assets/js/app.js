/**
 * Spixi Mini Apps Directory
 * Main JavaScript file
 * 
 * Apps are loaded from data/apps.json
 * Community can submit apps via GitHub PRs
 */

// DOM Elements
const appGrid = document.getElementById('app-grid');
const searchInput = document.getElementById('search-input');
const categoryFilters = document.getElementById('category-filters');
const loadMoreBtn = document.getElementById('load-more-btn');

// State
let apps = [];
let categories = [];
let activeCategory = 'All';
let searchTerm = '';
let displayedCount = 9; // Initial number of apps to show
const appsPerPage = 6; // Number of apps to load on "load more"

/**
 * Fetch apps data from JSON file or global variable
 */
async function fetchApps() {
  try {
    let data;
    if (window.SPIXI_APPS) {
      data = window.SPIXI_APPS;
      console.log('Loaded apps from global SPIXI_APPS');
    } else {
      const response = await fetch('data/apps.json');
      data = await response.json();
    }

    apps = data.apps;
    categories = data.categories;
    renderApps();
    // renderFeaturedApps not needed if SSG injected, but harmless to call if empty
    // Actually if SSG injected, renderFeaturedApps() might re-render logic. 
    // If we pre-rendered it, we don't need to re-render it unless we want interactivty?
    // app.js renderFeaturedApps logic replaces innerHTML.
    // If it's already there, maybe we skip? 
    // But filters/state is separate.
    // Let's keep it consistent. If data is loaded, we can render featured apps again just to be sure JS state matches.
    // Or check if already populated.
    renderFeaturedApps();
    updateLoadMoreVisibility();
  } catch (error) {
    console.error('Error loading apps:', error);
    if (appGrid) {
      appGrid.innerHTML = '<p style="color: var(--color-text-02); padding: var(--spacing-xl); text-align: center;">Failed to load apps. Please try again later.</p>';
    }
  }
}

/**
 * Get filtered apps based on category and search
 */
function getFilteredApps() {
  let filtered = apps;

  // Filter by category
  if (activeCategory !== 'All') {
    filtered = filtered.filter(app => app.category === activeCategory);
  }

  // Filter by search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(app =>
      app.name.toLowerCase().includes(term) ||
      app.description.toLowerCase().includes(term) ||
      app.publisher.toLowerCase().includes(term)
    );
  }

  return filtered;
}

/**
 * Render app cards to the grid
 */
function renderApps() {
  if (!appGrid) return;

  const filteredApps = getFilteredApps();
  const appsToShow = filteredApps.slice(0, displayedCount);

  if (appsToShow.length === 0) {
    appGrid.innerHTML = `
      <div class="empty-state">
        <img src="assets/icons/SmileyMeh.svg" alt="" class="empty-state__icon">
        <h3 class="empty-state__title">No apps found</h3>
        <p class="empty-state__description">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    `;
    return;
  }

  appGrid.innerHTML = appsToShow.map(app => createAppCard(app)).join('');
  updateLoadMoreVisibility();
}

/**
 * Render featured apps carousel
 */
function renderFeaturedApps() {
  const featuredContainer = document.querySelector('.featured__carousel');
  if (!featuredContainer) return;

  // Optimize: Skip if SSG content exists and data is loaded (prevents flash)
  if (featuredContainer.children.length > 0 && window.SPIXI_APPS) {
    return;
  }

  const featuredApps = getFeaturedApps();

  if (featuredApps.length === 0) {
    // Hide featured section if no apps
    const featuredSection = document.querySelector('.featured');
    if (featuredSection) featuredSection.style.display = 'none';
    return;
  }

  featuredContainer.innerHTML = featuredApps.map(app => createAppCard(app)).join('');
}

/**
 * Create HTML for a single app card
 * @param {Object} app - App data object
 * @returns {string} - HTML string
 * 
 * ! IMPORTANT: This logic is duplicated in scripts/update_apps.js for SSG.
 * ! Any changes here MUST be mirrored in the build script.
 */
function createAppCard(app) {
  const githubLink = app.github
    ? `<a href="${app.github}" class="app-card__github" target="_blank" rel="noopener noreferrer" aria-label="View on GitHub">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="currentColor">
          <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H108A59.75,59.75,0,0,0,60,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,40,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,80,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40h8v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,200,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM184,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.55a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h16.36a8,8,0,0,0,6.71-3.97,43.88,43.88,0,0,1,32.32-20.06A43.81,43.81,0,0,1,176,73.55a8,8,0,0,0,1.1,7.97A41.74,41.74,0,0,1,184,104Z"/>
        </svg>
      </a>`
    : '';

  const webLink = app.website
    ? `<a href="${app.website}" class="app-card__github" target="_blank" rel="noopener noreferrer" aria-label="Visit Website">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="currentColor">
        <path d="M128,24h0A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm78.36,64H170.71a135.28,135.28,0,0,0-22.3-45.6A88.29,88.29,0,0,1,206.37,88ZM216,128a87.61,87.61,0,0,1-3.33,24H174.16a157.44,157.44,0,0,0,0-48h38.51A87.61,87.61,0,0,1,216,128ZM128,43a115.27,115.27,0,0,1,26,45H102A115.11,115.11,0,0,1,128,43ZM102,168H154a115.11,115.11,0,0,1-26,45A115.27,115.27,0,0,1,102,168Zm-3.9-16a140.84,140.84,0,0,1,0-48h59.88a140.84,140.84,0,0,1,0,48Zm50.35,61.6a135.28,135.28,0,0,0,22.3-45.6h35.66A88.29,88.29,0,0,1,148.41,213.6Z"/>
      </svg>
    </a>`
    : '';

  // Generate user capability icons
  let userCapabilityIcons = '';
  if (app.singleUser || app.multiUser) {
    userCapabilityIcons = '<div class="app-card__user-capabilities">';

    if (app.singleUser) {
      userCapabilityIcons += `
        <div class="app-card__user-icon" title="Single User">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
            <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
          </svg>
        </div>`;
    }

    if (app.multiUser) {
      userCapabilityIcons += `
        <div class="app-card__user-icon" title="Multi User">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
            <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/>
          </svg>
        </div>`;
    }

    userCapabilityIcons += '</div>';
  }

  // Determine the action URL (spixi deep link or file)
  const actionUrl = app.spixiUrl || (app.files && app.files.spixi) || '#';

  return `
    <article class="app-card">
      <div class="app-card__header">
        <img class="app-card__icon" src="${app.icon}" alt="${app.name}" onerror="this.src='assets/images/placeholder-app.png'">
        <div class="app-card__header-right">
          ${userCapabilityIcons}
          <span class="badge">${app.category}</span>
        </div>
      </div>
      <div class="app-card__content">
        <div class="app-card__details">
          <div class="app-card__meta">
            <h3 class="app-card__title">${app.name}</h3>
            <p class="app-card__publisher">${app.publisher}</p>
          </div>
          <p class="app-card__description">${app.description}</p>
          ${app.version ? `<span class="app-card__version">v${app.version}</span>` : ''}
        </div>
      </div>
      <div class="app-card__footer">
        <a href="${actionUrl}" class="btn btn-sm btn-outlined">
          <span class="btn__label">Try in Spixi</span>
          <span class="btn__icon btn__icon--trailing">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
              <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"/>
            </svg>
          </span>
        </a>
        <div class="app-card__actions">
          ${webLink}
          ${githubLink}
        </div>
      </div>
    </article>
  `;
}

/**
 * Filter apps by category
 * @param {string} category - Category to filter by
 */
function filterByCategory(category) {
  activeCategory = category;
  displayedCount = 9; // Reset to initial count
  renderApps();
  updateCategoryButtons();
}

/**
 * Update category filter button states
 */
function updateCategoryButtons() {
  const buttons = document.querySelectorAll('.chip');
  buttons.forEach(btn => {
    if (btn.dataset.category === activeCategory) {
      btn.classList.remove('chip--default');
      btn.classList.add('chip--selected');
    } else {
      btn.classList.remove('chip--selected');
      btn.classList.add('chip--default');
    }
  });
}

/**
 * Handle search input
 * @param {string} query - Search query
 */
function handleSearch(query) {
  searchTerm = query;
  displayedCount = 9; // Reset to initial count
  renderApps();
}

/**
 * Load more apps
 */
function loadMore() {
  displayedCount += appsPerPage;
  renderApps();
}

/**
 * Update load more button visibility
 */
function updateLoadMoreVisibility() {
  if (!loadMoreBtn) return;

  const filteredApps = getFilteredApps();
  if (displayedCount >= filteredApps.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'inline-flex';
  }
}

/**
 * Get featured apps
 * @returns {Array} - Array of featured apps
 */
function getFeaturedApps() {
  return apps.filter(app => app.featured);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  fetchApps();

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }

  // Category filter listeners
  if (categoryFilters) {
    categoryFilters.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (chip && chip.dataset.category) {
        filterByCategory(chip.dataset.category);
      }
    });
  }

  // Load more button listener
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMore);
  }

  // Modal functionality
  setupModal();
});

/**
 * Setup modal functionality
 */
function setupModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  const appModal = document.getElementById('app-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const copyBtn = document.getElementById('copy-url-btn');

  if (!modalOverlay || !appModal || !closeBtn) return;

  // Close modal function
  function closeModal() {
    modalOverlay.classList.add('modal-overlay--closing');
    setTimeout(() => {
      modalOverlay.style.display = 'none';
      modalOverlay.classList.remove('modal-overlay--closing');
      document.body.style.overflow = '';
    }, 200);
  }

  // Close button click
  closeBtn.addEventListener('click', closeModal);

  // Close on overlay click (outside modal)
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.style.display !== 'none') {
      closeModal();
    }
  });

  // Copy URL functionality - make entire container clickable
  const urlContainer = document.querySelector('.modal__url-container');
  if (urlContainer) {
    urlContainer.addEventListener('click', async () => {
      const urlText = document.getElementById('modal-app-url').textContent;
      try {
        await navigator.clipboard.writeText(urlText);
        showToast('Copied to clipboard');
      } catch (err) {
        console.error('Failed to copy URL:', err);
        showToast('Failed to copy URL');
      }
    });
  }

  // Delegate click events for "Try in Spixi" buttons
  document.addEventListener('click', (e) => {
    const tryBtn = e.target.closest('.app-card__footer .btn');
    if (tryBtn && tryBtn.textContent.includes('Try in Spixi')) {
      e.preventDefault();

      // Get app data from the card
      const appCard = tryBtn.closest('.app-card');
      if (!appCard) return;

      const appData = {
        icon: appCard.querySelector('.app-card__icon')?.src || '',
        title: appCard.querySelector('.app-card__title')?.textContent || 'App Title',
        category: appCard.querySelector('.badge')?.textContent || 'Category',
        publisher: appCard.querySelector('.app-card__publisher')?.textContent || 'Publisher',
        description: appCard.querySelector('.app-card__description')?.textContent || 'No description available.',
        url: tryBtn.href || window.location.origin + '/apps/sample-app'
      };

      // Populate modal with app data
      openModal(appData);
    }
  });
}

/**
 * Open modal with app data
 * @param {Object} appData - App information
 */
function openModal(appData) {
  const modalOverlay = document.getElementById('modal-overlay');

  // Populate modal fields
  document.getElementById('modal-app-icon').src = appData.icon;
  document.getElementById('modal-app-title').textContent = appData.title;
  document.getElementById('modal-app-category').textContent = appData.category;
  document.getElementById('modal-app-publisher').textContent = appData.publisher;
  document.getElementById('modal-app-description').textContent = appData.description;
  document.getElementById('modal-app-url').textContent = appData.url;

  document.getElementById('modal-app-url').textContent = appData.url;

  // Generate QR Code
  const qrTarget = document.getElementById('modal-qr-target');
  if (qrTarget) {
    qrTarget.innerHTML = ''; // Clear previous QR code
    try {
      new QRCode(qrTarget, {
        text: appData.url,
        width: 160,
        height: 160,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } catch (e) {
      console.warn('QRCode library not loaded or failed', e);
      qrTarget.innerHTML = '<p class="modal__qr-note">QR Code Unavailable</p>';
    }
  }

  // Show modal
  modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('toast--show');

  // Hide toast after 2 seconds
  setTimeout(() => {
    toast.classList.remove('toast--show');
  }, 2000);
}
