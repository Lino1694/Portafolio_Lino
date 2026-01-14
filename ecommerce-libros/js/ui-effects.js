class UIEffects {
  constructor() {
    this.init();
  }

  init() {
    this.addScrollEffects();
    this.addHoverEffects();
  }

  addScrollEffects() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.book-card, .hero-content, .catalog-section').forEach(el => {
      observer.observe(el);
    });
  }

  addHoverEffects() {
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.book-card')) {
        e.target.closest('.book-card').classList.add('hover-lift');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('.book-card')) {
        e.target.closest('.book-card').classList.remove('hover-lift');
      }
    });
  }

  addToCartAnimation(bookElement) {
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;

    const bookRect = bookElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingBook = document.createElement('div');
    flyingBook.className = 'flying-book';
    flyingBook.style.cssText = `
      position: fixed;
      top: ${bookRect.top}px;
      left: ${bookRect.left}px;
      width: ${bookRect.width}px;
      height: ${bookRect.height}px;
      background: url(${bookElement.querySelector('img').src}) center/cover;
      z-index: 1000;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      border-radius: var(--border-radius);
    `;

    document.body.appendChild(flyingBook);

    setTimeout(() => {
      flyingBook.style.top = `${cartRect.top}px`;
      flyingBook.style.left = `${cartRect.left}px`;
      flyingBook.style.width = '20px';
      flyingBook.style.height = '30px';
      flyingBook.style.transform = 'scale(0.5)';
    }, 10);

    setTimeout(() => {
      document.body.removeChild(flyingBook);
      cartIcon.classList.add('pulse');
      setTimeout(() => cartIcon.classList.remove('pulse'), 500);
    }, 800);
  }

  showModal(content, title = '') {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content zoom-in">
        ${title ? `<h2>${title}</h2>` : ''}
        ${content}
        <button class="close-modal">&times;</button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close-modal').addEventListener('click', () => {
      this.closeModal(modal);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });

    return modal;
  }

  closeModal(modal) {
    modal.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} slide-in-right`;
    notification.textContent = message;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'var(--color-leather)' : 'var(--color-terracotta)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius);
      z-index: 1000;
      box-shadow: var(--shadow-medium);
      max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  loadingSpinner() {
    return `
      <div class="spinner" style="
        width: 40px;
        height: 40px;
        border: 4px solid var(--color-gray-light);
        border-top: 4px solid var(--color-leather);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      "></div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }
}

const uiEffects = new UIEffects();