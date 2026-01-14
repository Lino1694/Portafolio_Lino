// Filters functionality is integrated in app.js
// This file can be used for advanced filtering logic if needed

class Filters {
  constructor() {
    this.filters = {
      category: '',
      priceRange: [0, 100],
      rating: 0,
      format: '',
      language: ''
    };
  }

  setFilter(key, value) {
    this.filters[key] = value;
  }

  applyFilters(books) {
    return books.filter(book => {
      if (this.filters.category && !book.category.includes(this.filters.category)) return false;
      if (book.price < this.filters.priceRange[0] || book.price > this.filters.priceRange[1]) return false;
      if (book.rating < this.filters.rating) return false;
      if (this.filters.format && book.format !== this.filters.format) return false;
      if (this.filters.language && book.language !== this.filters.language) return false;
      return true;
    });
  }

  sortBooks(books, sortBy) {
    return [...books].sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'newest': return new Date(b.publishDate) - new Date(a.publishDate);
        default: return 0;
      }
    });
  }
}

const filters = new Filters();