class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
  }

  addItem(book, quantity = 1) {
    const existing = this.cart.find(item => item.id === book.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ ...book, quantity });
    }
    this.save();
    this.updateCartCount();
  }

  removeItem(bookId) {
    this.cart = this.cart.filter(item => item.id !== bookId);
    this.save();
    this.updateCartCount();
  }

  updateQuantity(bookId, quantity) {
    const item = this.cart.find(item => item.id === bookId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeItem(bookId);
      } else {
        this.save();
      }
    }
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingCost() {
    const subtotal = this.getTotal();
    return subtotal > 35 ? 0 : 5.99;
  }

  getTax() {
    return this.getTotal() * 0.08; // 8% tax
  }

  getGrandTotal() {
    return this.getTotal() + this.getShippingCost() + this.getTax();
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  updateCartCount() {
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
      cartCountEl.textContent = count;
    }
  }

  renderCart() {
    const cartSection = document.getElementById('cart');
    if (!cartSection) return;

    cartSection.innerHTML = `
      <div class="container">
        <h2>Tu Carrito</h2>
        ${this.cart.length === 0 ? '<p>Tu carrito está vacío</p>' : `
          <div class="cart-items">
            ${this.cart.map(item => `
              <div class="cart-item">
                <img src="assets/images/${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                  <h3>${item.title}</h3>
                  <p>${item.author}</p>
                  <p>$${item.price}</p>
                  <div class="quantity-controls">
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                  </div>
                  <button class="remove-btn" data-id="${item.id}">Eliminar</button>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="cart-summary">
            <p>Subtotal: $${this.getTotal().toFixed(2)}</p>
            <p>Envío: $${this.getShippingCost().toFixed(2)}</p>
            <p>Impuestos: $${this.getTax().toFixed(2)}</p>
            <p><strong>Total: $${this.getGrandTotal().toFixed(2)}</strong></p>
            <button id="checkout-btn" class="cta-button">Proceder al Checkout</button>
          </div>
        `}
      </div>
    `;

    this.setupCartEventListeners();
  }

  setupCartEventListeners() {
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const bookId = e.target.dataset.id;
        const item = this.cart.find(item => item.id === bookId);
        if (action === 'increase') {
          this.updateQuantity(bookId, item.quantity + 1);
        } else if (action === 'decrease') {
          this.updateQuantity(bookId, item.quantity - 1);
        }
        this.renderCart();
      });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.removeItem(e.target.dataset.id);
        this.renderCart();
      });
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        app.showSection('checkout');
        checkoutSimulator.init(this.cart);
      });
    }
  }
}

const cartManager = new CartManager();