/**
 * Spixi Download Page
 * Platform detection and dynamic button configuration
 */

class DownloadPage {
  constructor() {
    this.platform = this.detectPlatform();
    this.init();
  }

  /**
   * Detect user's operating system
   * @returns {string} Platform identifier
   */
  detectPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    // iOS detection (iPhone, iPad, iPod)
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    }
    
    // Android detection
    if (/android/.test(userAgent)) {
      return 'android';
    }
    
    // macOS detection
    if (/mac/.test(platform)) {
      return 'macos';
    }
    
    // Windows detection
    if (/win/.test(platform)) {
      return 'windows';
    }
    
    // Linux detection
    if (/linux/.test(platform) && !/android/.test(userAgent)) {
      return 'linux';
    }
    
    // Default fallback
    return 'windows';
  }

  /**
   * Initialize page functionality
   */
  init() {
    this.updatePrimaryButton();
    this.setupSmoothScroll();
    console.log('Detected platform:', this.platform);
  }

  /**
   * Update primary download button based on detected platform
   */
  updatePrimaryButton() {
    const button = document.getElementById('primary-download-btn');
    const buttonText = document.getElementById('primary-btn-text');
    const buttonIcon = document.getElementById('primary-btn-icon');
    const versionInfo = document.getElementById('version-info');

    if (!button || !buttonText || !buttonIcon) return;

    const config = this.getButtonConfig();
    
    // Update button text
    buttonText.textContent = config.text;
    
    // Update button link
    button.href = config.url;
    
    // Update icon
    buttonIcon.innerHTML = config.icon;
    
    // Show/hide version info (hide for store links)
    if (config.hideVersion && versionInfo) {
      versionInfo.classList.add('hidden');
    } else if (versionInfo) {
      versionInfo.classList.remove('hidden');
    }

    // Add target="_blank" for store links
    if (config.isStoreLink) {
      button.setAttribute('target', '_blank');
      button.setAttribute('rel', 'noopener noreferrer');
    }

    // Adjust button styling for store badges
    if (config.isStoreBadge) {
      button.classList.remove('btn-primary');
      button.classList.add('btn-store');
      // Replace button content with store badge image (css controls height)
      button.innerHTML = `<img src="${config.badgeImage}" alt="${config.text}">`;
    }
  }

  /**
   * Get button configuration for detected platform
   * @returns {Object} Button configuration
   */
  getButtonConfig() {
    const configs = {
      windows: {
        text: 'Download for Windows',
        url: 'https://github.com/ixian-platform/Spixi/releases/download/v0.9.14/Spixi-v0.9.14-Win.zip',
        icon: this.getDownloadIcon(),
        hideVersion: false,
        isStoreLink: false,
        isStoreBadge: false
      },
      macos: {
        text: 'Download on App Store',
        url: 'https://apps.apple.com/us/app/spixi-private-chat-wallet/id6667121792',
        icon: '',
        hideVersion: true,
        isStoreLink: true,
        isStoreBadge: true,
        badgeImage: 'assets/images/app-store-badge.png'
      },
      linux: {
        text: 'Download for Linux',
        url: 'https://github.com/ixian-platform/Spixi/releases/latest/download/spixi-linux.AppImage',
        icon: this.getDownloadIcon(),
        hideVersion: false,
        isStoreLink: false,
        isStoreBadge: false
      },
      ios: {
        text: 'Download on App Store',
        url: 'https://apps.apple.com/us/app/spixi-private-chat-wallet/id6667121792',
        icon: '',
        hideVersion: true,
        isStoreLink: true,
        isStoreBadge: true,
        badgeImage: 'assets/images/app-store-badge.png'
      },
      android: {
        text: 'Get it on Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.ixilabs.spixi',
        icon: '',
        hideVersion: true,
        isStoreLink: true,
        isStoreBadge: true,
        badgeImage: 'assets/images/google-play-badge.png'
      }
    };

    return configs[this.platform] || configs.windows;
  }

  /**
   * Get download icon SVG
   * @returns {string} SVG path
   */
  getDownloadIcon() {
    return `<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new DownloadPage();
});
