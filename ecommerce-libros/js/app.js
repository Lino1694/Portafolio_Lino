class App {
  constructor() {
    this.currentSection = 'catalog';
    this.books = [];
    this.categories = [];
    this.reviews = [];
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    this.user = JSON.parse(localStorage.getItem('user')) || null;
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.renderHeader();
      this.renderHome();
      this.renderCatalog();
      this.renderAbout();
      this.renderContact();
      this.renderFooter();
      this.setupEventListeners();
      this.showSection('home');
      this.updateCartCount();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  async loadData() {
    const [booksRes, categoriesRes, reviewsRes] = await Promise.all([
      fetch('data/books.json'),
      fetch('data/categories.json'),
      fetch('data/reviews.json')
    ]);

    this.books = await booksRes.json();
    this.categories = await categoriesRes.json();
    this.reviews = await reviewsRes.json();
  }

  showSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    if (sections.length > 0) {
      sections.forEach(section => section.classList.add('hidden'));
    }
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }
    this.currentSection = sectionId;
    window.scrollTo(0, 0);
  }


  renderHome() {
    const home = document.getElementById('home');
    if (!home) {
      return;
    }
    home.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1>Descubre tu próxima lectura</h1>
            <p>Explora nuestra colección de libros literarios elegantes y sofisticados</p>
            <button class="cta-button" id="explore-btn">Explorar Catálogo</button>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="container">
          <h2>Categorías Principales</h2>
          <div class="categories-grid">
            ${this.categories.slice(0, 6).map(cat => `
              <div class="category-card" data-category="${cat.id}">
                <h3>${cat.name}</h3>
                <p>${cat.description || 'Descubre libros en esta categoría'}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="featured-section">
        <div class="container">
          <h2>Productos Destacados</h2>
          <div class="featured-grid">
            ${this.books.filter(book => book.bestseller).slice(0, 4).map(book => `
              <div class="book-card" data-id="${book.id}">
                <img src="https://picsum.photos/200/300?random=${book.id.slice(-2)}" alt="${book.title}" class="book-image">
                <div class="book-info">
                  <h3 class="book-title">${book.title}</h3>
                  <p class="book-author">${book.author}</p>
                  <div class="book-price">$${book.price}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Offers Section -->
      <section class="offers-section">
        <div class="container">
          <h2>Ofertas Especiales</h2>
          <div class="offers-grid">
            ${this.books.filter(book => book.discount > 0).slice(0, 3).map(book => `
              <div class="book-card" data-id="${book.id}">
                <div class="discount-badge">${book.discount}% OFF</div>
                <img src="https://picsum.photos/200/300?random=${book.id.slice(-2)}" alt="${book.title}" class="book-image">
                <div class="book-info">
                  <h3 class="book-title">${book.title}</h3>
                  <p class="book-author">${book.author}</p>
                  <div class="book-price">
                    <span class="original">$${book.originalPrice}</span>
                    $${book.price}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="benefits-section">
        <div class="container">
          <h2>¿Por qué elegirnos?</h2>
          <div class="benefits-grid">
            <div class="benefit">
              <h3>📚 Amplia Selección</h3>
              <p>Miles de títulos literarios cuidadosamente seleccionados</p>
            </div>
            <div class="benefit">
              <h3>🚚 Envío Rápido</h3>
              <p>Entrega en 24-48 horas en toda la ciudad</p>
            </div>
            <div class="benefit">
              <h3>🔒 Compra Segura</h3>
              <p>Pagos protegidos y devolución garantizada</p>
            </div>
            <div class="benefit">
              <h3>💝 Atención Personalizada</h3>
              <p>Recomendaciones literarias adaptadas a tus gustos</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials-section">
        <div class="container">
          <h2>Lo que dicen nuestros lectores</h2>
          <div class="testimonials-grid">
            ${this.reviews.slice(0, 3).map(review => {
              const book = this.books.find(b => b.id === review.bookId);
              return `
                <div class="testimonial">
                  <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                  <p>"${review.text}"</p>
                  <cite>- ${review.user}, sobre "${book ? book.title : 'un libro'}"</cite>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="newsletter-section">
        <div class="container">
          <h2>Únete a nuestra comunidad literaria</h2>
          <p>Recibe recomendaciones exclusivas y ofertas especiales</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Tu email" id="newsletter-email">
            <button id="newsletter-btn">Suscribirse</button>
          </div>
        </div>
      </section>
    `;
  }

  renderCatalog() {
    const catalog = document.getElementById('catalog');
    if (!catalog) {
      return;
    }
    catalog.innerHTML = `
      <div class="container">
        <h2>Nuestro Catálogo</h2>
        <div class="filters" id="filters">
          <!-- Filters will be rendered here -->
        </div>
        <div class="catalog-grid grid" id="catalog-grid">
          <!-- Books will be rendered here -->
        </div>
      </div>
    `;
    this.renderFilters();
    this.renderBooks();
  }

  renderAbout() {
    const about = document.getElementById('about');
    if (!about) {
      return;
    }
    about.innerHTML = `
      <div class="container">
        <h2>Sobre Nosotros</h2>
        <p>En Books & Chill, nos apasiona conectar a los lectores con historias extraordinarias. Nuestra librería virtual ofrece una cuidadosa selección de libros literarios que inspiran, educan y entretienen.</p>
        <p>Desde clásicos atemporales hasta las últimas novedades, estamos comprometidos con la promoción de la lectura y la cultura literaria.</p>
      </div>
    `;
  }

  renderContact() {
    const contact = document.getElementById('contact');
    if (!contact) {
      return;
    }
    contact.innerHTML = `
      <div class="container">
        <h2>Contacto</h2>
        <p>¿Tienes preguntas o comentarios? Nos encantaría escucharte.</p>
        <div class="contact-info">
          <p><strong>Email:</strong> info@booksandchill.com</p>
          <p><strong>Teléfono:</strong> +51 123 456 789</p>
          <p><strong>Dirección:</strong> Calle Literaria 123, Ciudad de los Libros</p>
        </div>
      </div>
    `;
  }

  renderHeader() {
    const header = document.getElementById('header');
    if (!header) {
      // Silently skip if header not found
      return;
    }
    header.innerHTML = `
      <!-- NIVEL 1: TOP BAR -->
      <div class="top-bar">
        <div class="container">
          <div class="top-bar-content">
            <div class="top-info">
              <span>🚚 Envío gratis +€25</span>
              <span>⏰ Entrega 24-48h</span>
              <span>📞 Atención al cliente: 900 123 456</span>
            </div>
            <div class="top-actions">
              <div class="language-selector">
                <button class="lang-btn" aria-label="Seleccionar idioma">
                  <span class="flag">🇪🇸</span>
                  <span class="lang-code">ES</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- NIVEL 2: HEADER PRINCIPAL -->
      <div class="header-main">
        <div class="container">
          <div class="header-content">
            <!-- LOGO -->
            <div class="logo-container">
              <a href="#" class="logo-link" data-section="home">
                <span class="logo-icon">📚</span>
                <span class="logo-text">
                  <span class="logo-main">Books</span>
                  <span class="logo-accent">& Chill</span>
                </span>
              </a>
            </div>

            <!-- BUSCADOR AVANZADO -->
            <div class="search-wrapper">
              <form id="book-search-form" role="search">
                <div class="search-input-group">
                  <input
                    type="search"
                    id="main-search"
                    placeholder="Busca por título, autor, ISBN..."
                    autocomplete="off"
                    aria-label="Búsqueda de libros"
                  >
                  <select id="search-filter" aria-label="Filtrar búsqueda por">
                    <option value="all">Todo</option>
                    <option value="title">Título</option>
                    <option value="author">Autor</option>
                    <option value="isbn">ISBN</option>
                  </select>
                  <button type="submit" class="search-submit">
                    <span class="search-icon">🔍</span>
                    <span class="search-text">Buscar</span>
                  </button>
                </div>
              </form>
              <div class="search-suggestions" id="search-suggestions"></div>
            </div>

            <!-- ACCIONES DE USUARIO -->
            <div class="user-actions">
              <!-- Hamburger Menu (Mobile) -->
              <button class="action-btn hamburger-btn" id="hamburger-btn">
                <span class="action-icon">☰</span>
                <span class="action-text">Menú</span>
              </button>

              <!-- Favoritos -->
              <a href="#" class="action-btn" id="favorites-btn">
                <span class="action-icon">❤️</span>
                <span class="action-text">Favoritos</span>
                <span class="action-counter" id="fav-count">0</span>
              </a>

              <!-- Carrito -->
              <div class="cart-wrapper">
                <button class="action-btn cart-btn" id="cart-btn">
                  <span class="action-icon">🛒</span>
                  <div class="cart-info">
                    <span class="action-text">Carrito</span>
                    <span class="cart-details">
                      <span class="cart-counter" id="cart-count">0</span>
                      <span class="cart-total" id="cart-total">€0.00</span>
                    </span>
                  </div>
                </button>
                <div class="mini-cart-dropdown" id="mini-cart">
                  <div class="mini-cart-header">
                    <h4>Tu carrito</h4>
                    <span id="mini-cart-count">0 items</span>
                  </div>
                  <div class="mini-cart-items" id="mini-cart-items">
                    <div class="empty-cart">Tu carrito está vacío</div>
                  </div>
                  <div class="mini-cart-footer">
                    <div class="cart-subtotal">
                      <span>Subtotal:</span>
                      <span id="mini-cart-total">€0.00</span>
                    </div>
                    <button class="btn-view-cart" data-section="cart">Ver carrito</button>
                  </div>
                </div>
              </div>

              <!-- Usuario -->
              <button class="action-btn" id="account-btn">
                <span class="action-icon">👤</span>
                <span class="action-text">Cuenta</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- NIVEL 3: MENÚ DE NAVEGACIÓN -->
      <nav class="main-navigation" aria-label="Navegación principal">
        <div class="container">
          <ul class="nav-menu">
            <li class="nav-item"><a href="#" data-section="home" class="nav-link">🏠 Inicio</a></li>
            <li class="nav-item dropdown" data-dropdown="categories">
              <a href="#" class="nav-link">
                📚 Categorías <span class="dropdown-arrow">▼</span>
              </a>
              <div class="mega-dropdown" id="categories-dropdown">
                <div class="dropdown-grid">
                  <div class="dropdown-column">
                    <h4>Géneros Literarios</h4>
                    <a href="#" data-category="ficcion">Ficción Literaria</a>
                    <a href="#" data-category="fantasia">Fantasía</a>
                    <a href="#" data-category="ciencia-ficcion">Ciencia Ficción</a>
                    <a href="#" data-category="misterio">Misterio & Thriller</a>
                    <a href="#" data-category="romance">Romance</a>
                    <a href="#" data-category="historica">Novela Histórica</a>
                    <a href="#" data-category="biografia">Biografías</a>
                    <a href="#" data-category="poesia">Poesía</a>
                  </div>
                  <div class="dropdown-column">
                    <h4>Formatos</h4>
                    <a href="#" data-format="tapa-dura">Tapa Dura</a>
                    <a href="#" data-format="tapa-blanda">Tapa Blanda</a>
                    <a href="#" data-format="ebook">eBooks</a>
                  </div>
                  <div class="dropdown-column">
                    <h4>Colecciones</h4>
                    <a href="#" data-collection="clasicos">Clásicos Universales</a>
                    <a href="#" data-collection="premios">Premios Literarios</a>
                    <a href="#" data-collection="recomendados">Recomendados del Mes</a>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item"><a href="#" data-section="about" class="nav-link">✍️ Sobre Nosotros</a></li>
            <li class="nav-item"><a href="#" data-section="contact" class="nav-link">📞 Contacto</a></li>
            <li class="nav-item"><a href="#" data-section="catalog" class="nav-link">📚 Catálogo</a></li>
          </ul>
        </div>
      </nav>

      <!-- NIVEL 4: BARRA DE PROMOCIONES -->
      <div class="promo-bar">
        <div class="container">
          <div class="promo-content">
            <span class="promo-text">🎉 OFERTA ESPECIAL: 3x2 en libros seleccionados</span>
            <span class="promo-separator">|</span>
            <span class="promo-text">📅 Club de Lectura: Próxima reunión 15 Nov</span>
          </div>
        </div>
      </div>

      <!-- MOBILE NAVIGATION MENU -->
      <nav class="mobile-nav" id="mobile-nav">
        <div class="mobile-nav-content">
          <div class="mobile-nav-header">
            <span class="mobile-nav-title">Menú</span>
            <button class="mobile-nav-close" id="mobile-nav-close">×</button>
          </div>
          <ul class="mobile-nav-menu">
            <li><a href="#" data-section="home">🏠 Inicio</a></li>
            <li><a href="#" data-section="catalog">📚 Catálogo</a></li>
            <li><a href="#" data-section="about">✍️ Sobre Nosotros</a></li>
            <li><a href="#" data-section="contact">📞 Contacto</a></li>
          </ul>
          <div class="mobile-nav-categories">
            <h4>Categorías</h4>
            <a href="#" data-category="ficcion">Ficción Literaria</a>
            <a href="#" data-category="fantasia">Fantasía</a>
            <a href="#" data-category="ciencia-ficcion">Ciencia Ficción</a>
            <a href="#" data-category="misterio">Misterio & Thriller</a>
            <a href="#" data-category="romance">Romance</a>
          </div>
        </div>
      </nav>
    `;
  }

  renderFooter() {
    const footer = document.getElementById('footer');
    if (!footer) {
      return;
    }
    footer.innerHTML = `
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>Books & Chill</h3>
            <p>Tu destino para libros literarios de calidad desde 2024.</p>
          </div>
          <div class="footer-links">
            <div class="footer-section">
              <h4>Enlaces Rápidos</h4>
              <a href="#" data-section="home">Inicio</a>
              <a href="#" data-section="catalog">Catálogo</a>
              <a href="#" data-section="about">Sobre Nosotros</a>
              <a href="#" data-section="contact">Contacto</a>
            </div>
            <div class="footer-section">
              <h4>Categorías</h4>
              <a href="#">Ficción</a>
              <a href="#">No Ficción</a>
              <a href="#">Clásicos</a>
              <a href="#">Infantil</a>
            </div>
            <div class="footer-section">
              <h4>Síguenos</h4>
              <div class="social-links">
                <a href="#" aria-label="Facebook">📘 Facebook</a>
                <a href="#" aria-label="Instagram">📷 Instagram</a>
                <a href="#" aria-label="Twitter">🐦 Twitter</a>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 Books & Chill. Todos los derechos reservados.</p>
          <div class="footer-bottom-links">
            <a href="#">Política de Privacidad</a>
            <a href="#">Términos de Servicio</a>
          </div>
        </div>
      </div>
    `;
  }

  renderFilters() {
    const filters = document.getElementById('filters');
    if (!filters) {
      return;
    }
    filters.innerHTML = `
      <div class="filter-group">
        <label for="category-filter">Categoría:</label>
        <select id="category-filter">
          <option value="">Todas</option>
          ${this.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
        </select>
      </div>
      <div class="filter-group">
        <label for="price-filter">Precio máximo:</label>
        <input type="range" id="price-filter" min="0" max="100" value="100">
        <span id="price-value">$100</span>
      </div>
      <div class="filter-group">
        <label for="rating-filter">Rating mínimo:</label>
        <select id="rating-filter">
          <option value="0">Todos</option>
          <option value="3">3+ estrellas</option>
          <option value="4">4+ estrellas</option>
          <option value="5">5 estrellas</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="sort-filter">Ordenar por:</label>
        <select id="sort-filter">
          <option value="title">Título</option>
          <option value="price-low">Precio: Menor a Mayor</option>
          <option value="price-high">Precio: Mayor a Menor</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    `;
  }

  renderBooks(books = this.books) {
    const grid = document.getElementById('catalog-grid');
    if (!grid) {
      return;
    }
    grid.innerHTML = books.map(book => `
      <div class="book-card" data-id="${book.id}">
        <img src="https://picsum.photos/200/300?random=${book.id.slice(-2)}" alt="${book.title}" class="book-image">
        <div class="book-info">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-author">${book.author}</p>
          <div class="book-price">
            ${book.discount ? `<span class="original">$${book.originalPrice}</span>` : ''}
            $${book.price}
          </div>
          <div class="rating">
            ${'★'.repeat(Math.floor(book.rating))}${'☆'.repeat(5 - Math.floor(book.rating))}
            (${book.reviewsCount})
          </div>
          <button class="add-to-cart-btn" data-id="${book.id}">Añadir al Carrito</button>
        </div>
      </div>
    `).join('');
  }


  setupEventListeners() {
    // Navigation
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-section]')) {
        e.preventDefault();
        this.showSection(e.target.dataset.section);
      }
    });

    // Filters (only if they exist - for catalog page)
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const sortFilter = document.getElementById('sort-filter');

    if (categoryFilter) categoryFilter.addEventListener('change', () => this.applyFilters());
    if (priceFilter) {
      priceFilter.addEventListener('input', (e) => {
        const priceValue = document.getElementById('price-value');
        if (priceValue) priceValue.textContent = `$${e.target.value}`;
        this.applyFilters();
      });
    }
    if (ratingFilter) ratingFilter.addEventListener('change', () => this.applyFilters());
    if (sortFilter) sortFilter.addEventListener('change', () => this.applyFilters());

    // Book cards
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        this.addToCart(e.target.dataset.id);
      } else if (e.target.closest('.book-card')) {
        const bookId = e.target.closest('.book-card').dataset.id;
        this.showBookDetail(bookId);
      }
    });

    // Header interactions
    this.setupHeaderInteractions();

    // Mobile navigation
    this.setupMobileNav();

    // Home page interactions
    document.addEventListener('click', (e) => {
      if (e.target.id === 'explore-btn') {
        this.showSection('catalog');
      }
      if (e.target.id === 'newsletter-btn') {
        const email = document.getElementById('newsletter-email').value;
        if (email) {
          this.showToast('¡Gracias por suscribirte! Recibirás nuestras novedades pronto.');
          document.getElementById('newsletter-email').value = '';
        } else {
          this.showToast('Por favor ingresa tu email');
        }
      }
      if (e.target.closest('.category-card')) {
        const categoryId = e.target.closest('.category-card').dataset.category;
        this.showSection('catalog');
        // Could set filter here, but for now just go to catalog
      }
    });
  }

  setupHeaderInteractions() {
    // Dropdown menus
    const dropdowns = document.querySelectorAll('[data-dropdown]');
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-link');
      const menu = dropdown.querySelector('.mega-dropdown');

      if (trigger && menu) {
        if (window.innerWidth > 768) {
          // Desktop: hover
          dropdown.addEventListener('mouseenter', () => {
            menu.style.display = 'block';
          });
          dropdown.addEventListener('mouseleave', () => {
            menu.style.display = 'none';
          });
        } else {
          // Mobile: click
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const isVisible = menu.style.display === 'block';
            // Hide all dropdowns first
            document.querySelectorAll('.mega-dropdown').forEach(m => m.style.display = 'none');
            // Show this one if it wasn't visible
            if (!isVisible) {
              menu.style.display = 'block';
            }
          });
        }
      }
    });

    // Cart dropdown
    const cartBtn = document.getElementById('cart-btn');
    const miniCart = document.getElementById('mini-cart');

    if (cartBtn && miniCart) {
      cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = miniCart.style.display === 'block';
        miniCart.style.display = isVisible ? 'none' : 'block';
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!cartBtn.contains(e.target) && !miniCart.contains(e.target)) {
          miniCart.style.display = 'none';
        }
      });

      // View cart button
      const viewCartBtn = miniCart.querySelector('.btn-view-cart');
      if (viewCartBtn) {
        viewCartBtn.addEventListener('click', () => {
          this.showSection('cart');
          miniCart.style.display = 'none';
        });
      }
    }

    // Search functionality
    const searchInput = document.getElementById('main-search');
    const searchForm = document.getElementById('book-search-form');
    const suggestions = document.getElementById('search-suggestions');

    if (searchInput && suggestions) {
      let debounceTimer;

      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
          suggestions.style.display = 'none';
          return;
        }

        debounceTimer = setTimeout(() => {
          this.showSearchSuggestions(query);
        }, 300);
      });

      // Hide suggestions when clicking outside
      document.addEventListener('click', (e) => {
        if (searchInput && suggestions && !searchInput.contains(e.target) && !suggestions.contains(e.target)) {
          suggestions.style.display = 'none';
        }
      });
    }

    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          this.performSearch(query);
        }
      });
    }
  }

  setupMobileNav() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavClose = document.getElementById('mobile-nav-close');

    if (hamburgerBtn && mobileNav) {
      hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNav.classList.add('active');
      });

      if (mobileNavClose) {
        mobileNavClose.addEventListener('click', () => {
          mobileNav.classList.remove('active');
        });
      }

      // Close when clicking outside
      mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) {
          mobileNav.classList.remove('active');
        }
      });

      // Close when clicking on navigation links
      mobileNav.addEventListener('click', (e) => {
        if (e.target.matches('[data-section], [data-category]')) {
          mobileNav.classList.remove('active');
        }
      });
    }
  }

  showSearchSuggestions(query) {
    const suggestions = document.getElementById('search-suggestions');
    const filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (filteredBooks.length === 0) {
      suggestions.style.display = 'none';
      return;
    }

    suggestions.innerHTML = `
      <div class="suggestion-category">
        <h4>Libros</h4>
        ${filteredBooks.map(book => `
          <div class="suggestion-item" data-id="${book.id}">
            <img src="https://picsum.photos/50/70?random=${book.id.slice(-2)}" alt="${book.title}">
            <div class="suggestion-info">
              <strong>${book.title}</strong>
              <span>${book.author}</span>
              <span class="price">€${book.price}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    suggestions.style.display = 'block';

    // Add click handlers for suggestions
    suggestions.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const bookId = item.dataset.id;
        this.showBookDetail(bookId);
        suggestions.style.display = 'none';
      });
    });
  }

  performSearch(query) {
    this.showSection('catalog');
    // Could implement search filtering here
    document.getElementById('search-input').value = query;
    this.handleSearch();
  }

  handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
    this.renderBooks(filteredBooks);
  }

  applyFilters() {
    let filtered = [...this.books];

    const category = document.getElementById('category-filter').value;
    if (category) {
      filtered = filtered.filter(book => book.category.includes(category));
    }

    const maxPrice = parseInt(document.getElementById('price-filter').value);
    filtered = filtered.filter(book => book.price <= maxPrice);

    const minRating = parseInt(document.getElementById('rating-filter').value);
    filtered = filtered.filter(book => book.rating >= minRating);

    const sortBy = document.getElementById('sort-filter').value;
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return a.title.localeCompare(b.title);
      }
    });

    this.renderBooks(filtered);
  }

  addToCart(bookId) {
    const book = this.books.find(b => b.id === bookId);
    const existing = this.cart.find(item => item.id === bookId);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ ...book, quantity: 1 });
    }
    this.saveCart();
    this.updateCartCount();
    this.showToast('Libro añadido al carrito');
  }

  updateCartCount() {
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

    // Update main cart count
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.textContent = count;

    // Update cart total
    const cartTotalEl = document.getElementById('cart-total');
    if (cartTotalEl) cartTotalEl.textContent = `€${total}`;

    // Update mini cart
    this.updateMiniCart(count, total);
  }

  updateMiniCart(count, total) {
    const miniCartCount = document.getElementById('mini-cart-count');
    const miniCartTotal = document.getElementById('mini-cart-total');
    const miniCartItems = document.getElementById('mini-cart-items');

    if (miniCartCount) miniCartCount.textContent = `${count} items`;
    if (miniCartTotal) miniCartTotal.textContent = `€${total}`;

    if (miniCartItems) {
      if (count === 0) {
        miniCartItems.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
      } else {
        miniCartItems.innerHTML = this.cart.map(item => `
          <div class="mini-cart-item">
            <img src="https://picsum.photos/60/80?random=${item.id.slice(-2)}" alt="${item.title}">
            <div class="mini-cart-item-info">
              <h5>${item.title}</h5>
              <span>${item.quantity} x €${item.price}</span>
            </div>
            <button class="remove-item" data-id="${item.id}">×</button>
          </div>
        `).join('');

        // Add remove handlers
        miniCartItems.querySelectorAll('.remove-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const bookId = e.target.dataset.id;
            this.removeFromCart(bookId);
          });
        });
      }
    }
  }

  removeFromCart(bookId) {
    const index = this.cart.findIndex(item => item.id === bookId);
    if (index > -1) {
      this.cart.splice(index, 1);
      this.saveCart();
      this.updateCartCount();
      this.showToast('Producto removido del carrito');
    }
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  showBookDetail(bookId) {
    // This will be implemented in product-display.js
    console.log('Show book detail for', bookId);
  }

  showToast(message) {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-leather);
      color: white;
      padding: 1rem;
      border-radius: var(--border-radius);
      z-index: 1000;
      animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }
}

// Wait for DOM to be ready and elements to exist
function waitForElements() {
  return new Promise((resolve) => {
    const checkElements = () => {
      const header = document.getElementById('header');
      const home = document.getElementById('home');
      const catalog = document.getElementById('catalog');
      const footer = document.getElementById('footer');

      if (header && home && catalog && footer) {
        resolve();
      } else {
        setTimeout(checkElements, 10);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkElements);
    } else {
      checkElements();
    }
  });
}

waitForElements().then(() => {
  const app = new App();
});