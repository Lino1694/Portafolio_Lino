class ProductDisplay {
  showBookDetail(bookId) {
    const book = app.books.find(b => b.id === bookId);
    if (!book) return;

    const detailSection = document.getElementById('book-detail');
    detailSection.innerHTML = `
      <div class="container">
        <button class="back-btn" onclick="app.showSection('catalog')">← Volver al Catálogo</button>
        <div class="book-detail-grid">
          <div class="book-image-container">
            <img src="https://picsum.photos/300/400?random=${book.id.slice(-2)}" alt="${book.title}" class="book-detail-image">
          </div>
          <div class="book-detail-info">
            <h2 class="book-title">${book.title}</h2>
            <p class="book-author">por ${book.author}</p>
            <div class="book-meta">
              <span class="rating">
                ${'★'.repeat(Math.floor(book.rating))}${'☆'.repeat(5 - Math.floor(book.rating))}
                ${book.rating} (${book.reviewsCount} reseñas)
              </span>
              <span class="format">${book.format}</span>
              <span class="pages">${book.pages} páginas</span>
            </div>
            <div class="book-price">
              ${book.discount ? `<span class="original">$${book.originalPrice}</span>` : ''}
              <span class="current">$${book.price}</span>
              ${book.discount ? `<span class="discount">${book.discount}% OFF</span>` : ''}
            </div>
            <p class="description">${book.description}</p>
            <div class="book-details">
              <h3>Detalles del Libro</h3>
              <ul>
                <li><strong>ISBN:</strong> ${book.isbn}</li>
                <li><strong>Editorial:</strong> ${book.publisher}</li>
                <li><strong>Año:</strong> ${book.publishDate}</li>
                <li><strong>Idioma:</strong> ${book.language}</li>
              </ul>
            </div>
            <div class="action-buttons">
              <button class="cta-button add-to-cart-btn" data-id="${book.id}">Añadir al Carrito</button>
              <button class="favorite-btn" data-id="${book.id}">❤️ Añadir a Favoritos</button>
            </div>
          </div>
        </div>
        <div class="related-books">
          <h3>Libros Relacionados</h3>
          <div class="related-grid">
            ${this.getRelatedBooks(book).map(related => `
              <div class="book-card" data-id="${related.id}">
                <img src="https://picsum.photos/200/300?random=${related.id.slice(-2)}" alt="${related.title}" class="book-image">
                <div class="book-info">
                  <h4 class="book-title">${related.title}</h4>
                  <p class="book-author">${related.author}</p>
                  <div class="book-price">$${related.price}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="reviews-section">
          <h3>Reseñas de Lectores</h3>
          ${this.renderReviews(book.id)}
        </div>
      </div>
    `;

    this.setupDetailEventListeners();
    app.showSection('book-detail');
  }

  getRelatedBooks(book) {
    return app.books
      .filter(b => b.id !== book.id && (b.author === book.author || b.category.some(cat => book.category.includes(cat))))
      .slice(0, 4);
  }

  renderReviews(bookId) {
    const bookReviews = app.reviews.filter(review => review.bookId === bookId);
    if (bookReviews.length === 0) {
      return '<p>No hay reseñas aún. ¡Sé el primero en opinar!</p>';
    }

    return `
      <div class="reviews-list">
        ${bookReviews.map(review => `
          <div class="review">
            <div class="review-header">
              <span class="reviewer">${review.user}</span>
              <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
              <span class="review-date">${review.date}</span>
            </div>
            <p class="review-text">${review.text}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  setupDetailEventListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bookId = e.target.dataset.id;
        const book = app.books.find(b => b.id === bookId);
        cartManager.addItem(book);
        app.showToast('Libro añadido al carrito');
      });
    });

    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bookId = e.target.dataset.id;
        this.toggleFavorite(bookId);
      });
    });

    document.querySelectorAll('.book-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('add-to-cart-btn')) {
          this.showBookDetail(card.dataset.id);
        }
      });
    });
  }

  toggleFavorite(bookId) {
    const index = app.favorites.indexOf(bookId);
    if (index > -1) {
      app.favorites.splice(index, 1);
      app.showToast('Removido de favoritos');
    } else {
      app.favorites.push(bookId);
      app.showToast('Añadido a favoritos');
    }
    localStorage.setItem('favorites', JSON.stringify(app.favorites));
  }
}

const productDisplay = new ProductDisplay();