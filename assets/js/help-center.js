// ==========================================
// HELP CENTER - FAQ JAVASCRIPT
// ==========================================

class HelpCenter {
  constructor() {
    this.yamlData = null;
    this.currentCategory = null;
    this.searchInput = document.getElementById('helpSearch');
    this.categoryNav = document.getElementById('categoryNav');
    this.faqContainer = document.getElementById('faqContainer');
    
    this.init();
    // Setup delegated event listeners
    if (this.categoryNav) {
      this.categoryNav.addEventListener('click', (e) => {
        const btn = e.target.closest('.help-topics__category');
        if (btn) {
          this.setActiveCategory(btn.dataset.category);
        }
      });
    }

    if (this.faqContainer) {
      this.faqContainer.addEventListener('click', (e) => {
        const qButton = e.target.closest('.faq-item__question');
        if (qButton) {
          const faqItem = qButton.closest('.faq-item');
          if (faqItem) {
            const id = parseInt(faqItem.dataset.faqId, 10);
            if (!isNaN(id)) {
              this.toggleFAQ(id);
            }
          }
        }
      });
    }
  }

  async init() {
    try {
      await this.loadYAML();
      this.renderCategories();

      // Support deep links via hash params: #section=<id>&faq=<index>
      const params = this.parseHashParams();
      if (params.section && this.yamlData.sections.find(s => s.id === params.section)) {
        this.setActiveCategory(params.section);
      } else {
        this.setActiveCategory(this.yamlData.sections[0].id);
      }

      // If FAQ index provided, expand it after rendering
      // Note: deep-link expansion is handled inside renderFAQItems to avoid racing with auto-open

      this.setupSearch();

      // Update when the hash changes (support links that update hash)
      window.addEventListener('hashchange', () => {
        const p = this.parseHashParams();
        if (p.section && this.yamlData.sections.find(s => s.id === p.section)) {
          this.setActiveCategory(p.section);
        }
        if (p.faq !== undefined) {
          const ix = parseInt(p.faq, 10);
          if (!isNaN(ix)) setTimeout(() => this.openFAQ(ix), 150);
        }
      });
    } catch (error) {
      console.error('Failed to initialize Help Center:', error);
    }
  }

  // Parse simple hash parameters like "section=getting-started&faq=0"
  parseHashParams() {
    const hash = window.location.hash.slice(1);
    if (!hash) return {};
    const params = {};
    hash.split('&').forEach(pair => {
      const [k, v] = pair.split('=');
      if (k) params[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
    });
    return params;
  }

  async loadYAML() {
    try {
      const response = await fetch('docs/help-center.yml');
      const yamlText = await response.text();
      this.yamlData = jsyaml.load(yamlText);
    } catch (error) {
      console.error('Error loading YAML:', error);
      throw error;
    }
  }

  renderCategories() {
    if (!this.yamlData || !this.yamlData.sections) return;

    this.categoryNav.innerHTML = this.yamlData.sections
      .map(section => `
        <button 
          class="help-topics__category" 
          data-category="${section.id}"
        >
          ${section.title}
        </button>
      `)
      .join('');
  }

  setActiveCategory(categoryId) {
    this.currentCategory = categoryId;
    
    // Update active state on category buttons
    const categoryButtons = this.categoryNav.querySelectorAll('.help-topics__category');
    categoryButtons.forEach(btn => {
      if (btn.dataset.category === categoryId) {
        btn.classList.add('help-topics__category--active');
      } else {
        btn.classList.remove('help-topics__category--active');
      }
    });

    // Render FAQ items for this category
    this.renderFAQItems(categoryId);
  }

  renderFAQItems(categoryId) {
    const section = this.yamlData.sections.find(s => s.id === categoryId);
    if (!section || !section.items) return;

    this.faqContainer.innerHTML = section.items
      .map((item, index) => this.renderFAQItem(item, index, categoryId))
      .join('');
    
    // Auto-expand first item
    setTimeout(() => {
      const firstItem = this.faqContainer.querySelector('.faq-item');
      if (firstItem) {
        firstItem.classList.add('faq-item--expanded');
        const firstButton = firstItem.querySelector('.faq-item__question');
        if (firstButton) {
          firstButton.setAttribute('aria-expanded', 'true');
        }
      }
      // If the URL hash requested a specific FAQ, expand that instead
      try {
        const params = this.parseHashParams();
        if (params.faq !== undefined) {
          const idx = parseInt(params.faq, 10);
          if (!isNaN(idx)) {
            // Ensure the requested section matches the rendered one (or absent)
            if (!params.section || params.section === categoryId) {
              // Open the requested FAQ (explicitly expand it)
              this.openFAQ(idx);
              const el = this.faqContainer.querySelector(`#faq-${categoryId}-${idx}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      } catch (e) {
        // ignore hash parsing errors
      }
    }, 100);
  }

  renderFAQItem(item, index, categoryId) {
    const answer = this.parseAnswer(item.answer);
    
    return `
      <div class="faq-item" id="faq-${categoryId || this.currentCategory}-${index}" data-faq-id="${index}" data-section="${categoryId || this.currentCategory}">
        <button 
          class="faq-item__question" 
          aria-expanded="false"
        >
          <span>${item.question}</span>
          <svg class="faq-item__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="faq-item__answer">
          ${answer}
        </div>
      </div>
    `;
  }

  parseAnswer(answerText) {
    if (!answerText) return '';

    const lines = answerText.trim().split('\n');
    let html = '';
    let currentContent = [];
    let listType = null; // null, 'ordered', 'unordered'

    // Helper to check if a line starts a list
    const isListItem = (line) => {
      if (!line) return false;
      const trimmed = line.trim();
      return trimmed.match(/^\d+\./) || trimmed.startsWith('-');
    };

    // Helper to check if line is a subtitle (ends with colon, or short intro before list)
    const isSubtitle = (line, nextLine) => {
      if (!line) return false;
      const trimmed = line.trim();
      // Ends with colon (traditional subtitle)
      if (trimmed.match(/^[A-Z][^.!?]*:$/)) return true;
      // All caps
      if (trimmed === trimmed.toUpperCase() && trimmed.length > 2) return true;
      // Short line (under 60 chars, no period at end) followed by a list item
      if (trimmed.length < 60 && !trimmed.endsWith('.') && isListItem(nextLine)) return true;
      return false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      const nextLine = lines[i + 1];

      // Skip empty lines
      if (!trimmedLine) {
        if (currentContent.length > 0) {
          html += this.flushContent(currentContent, listType);
          currentContent = [];
          listType = null;
        }
        continue;
      }

      // Check if it's a subtitle
      if (isSubtitle(trimmedLine, nextLine)) {
        if (currentContent.length > 0) {
          html += this.flushContent(currentContent, listType);
          currentContent = [];
          listType = null;
        }
        html += `<div class="faq-item__content"><h4 class="faq-item__subtitle">${trimmedLine}</h4></div>`;
        continue;
      }

      // Check if it's a numbered list item
      if (trimmedLine.match(/^\d+\./)) {
        if (listType !== 'ordered') {
          if (currentContent.length > 0) {
            html += this.flushContent(currentContent, listType);
            currentContent = [];
          }
          listType = 'ordered';
        }
        currentContent.push(trimmedLine.replace(/^\d+\.\s*/, ''));
        continue;
      }

      // Check if it's a bullet list item
      if (trimmedLine.startsWith('-')) {
        if (listType !== 'unordered') {
          if (currentContent.length > 0) {
            html += this.flushContent(currentContent, listType);
            currentContent = [];
          }
          listType = 'unordered';
        }
        currentContent.push(trimmedLine.replace(/^-\s*/, ''));
        continue;
      }

      // Regular text
      if (listType) {
        html += this.flushContent(currentContent, listType);
        currentContent = [];
        listType = null;
      }
      currentContent.push(trimmedLine);
    }

    // Flush remaining content
    if (currentContent.length > 0) {
      html += this.flushContent(currentContent, listType);
    }

    return html;
  }

  flushContent(content, listType) {
    if (content.length === 0) return '';

    if (listType === 'ordered') {
      const items = content.map(item => `<li>${item}</li>`).join('');
      return `<div class="faq-item__content"><ol class="faq-item__list">${items}</ol></div>`;
    } else if (listType === 'unordered') {
      const items = content.map(item => `<li>${item}</li>`).join('');
      return `<div class="faq-item__content"><ul class="faq-item__list faq-item__list--unordered">${items}</ul></div>`;
    } else {
      const text = content.join(' ');
      return `<div class="faq-item__content"><p class="faq-item__text">${text}</p></div>`;
    }
  }

  toggleFAQ(index) {
    const faqItems = this.faqContainer.querySelectorAll('.faq-item');
    const clickedItem = faqItems[index];
    if (!clickedItem) return; // safety: index out of range
    const isExpanded = clickedItem.classList.contains('faq-item--expanded');

    // Close all items
    faqItems.forEach(item => {
      item.classList.remove('faq-item--expanded');
      const button = item.querySelector('.faq-item__question');
      button.setAttribute('aria-expanded', 'false');
    });

    // If the clicked item wasn't expanded, expand it
    if (!isExpanded) {
      clickedItem.classList.add('faq-item--expanded');
      const button = clickedItem.querySelector('.faq-item__question');
      button.setAttribute('aria-expanded', 'true');
    }
  }

  // Open a FAQ item by index (always expands the requested item)
  openFAQ(index) {
    const faqItems = this.faqContainer.querySelectorAll('.faq-item');
    const clickedItem = faqItems[index];
    if (!clickedItem) return; // out of range

    // Close all items first
    faqItems.forEach(item => {
      item.classList.remove('faq-item--expanded');
      const button = item.querySelector('.faq-item__question');
      if (button) button.setAttribute('aria-expanded', 'false');
    });

    // Open the requested one
    clickedItem.classList.add('faq-item--expanded');
    const btn = clickedItem.querySelector('.faq-item__question');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  setupSearch() {
    if (!this.searchInput) return;

    let searchTimeout;
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });
  }

  performSearch(query) {
    if (!query || query.length < 2) {
      // Show current category
      this.renderFAQItems(this.currentCategory);
      return;
    }

    const searchQuery = query.toLowerCase();
    const allItems = [];

    // Search through all sections
    this.yamlData.sections.forEach(section => {
      section.items.forEach(item => {
        const questionMatch = item.question.toLowerCase().includes(searchQuery);
        const answerMatch = item.answer && item.answer.toLowerCase().includes(searchQuery);
        
        if (questionMatch || answerMatch) {
          allItems.push(item);
        }
      });
    });

    // Render search results
    if (allItems.length === 0) {
      this.faqContainer.innerHTML = `
        <div class="faq-item">
          <div class="faq-item__question" style="cursor: default;">
            <span>No results found for "${query}"</span>
          </div>
        </div>
      `;
    } else {
      this.faqContainer.innerHTML = allItems
        .map((item, index) => this.renderFAQItem(item, index, this.currentCategory))
        .join('');
    }
  }
}

// Initialize when DOM is ready
let helpCenter;
document.addEventListener('DOMContentLoaded', () => {
  helpCenter = new HelpCenter();
});
