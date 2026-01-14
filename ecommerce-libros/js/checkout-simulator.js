class CheckoutSimulator {
  constructor() {
    this.cart = [];
    this.currentStep = 1;
    this.shippingInfo = {};
    this.paymentInfo = {};
  }

  init(cart) {
    this.cart = cart;
    this.currentStep = 1;
    this.renderCheckout();
  }

  renderCheckout() {
    const checkoutSection = document.getElementById('checkout');
    checkoutSection.innerHTML = `
      <div class="container">
        <div class="checkout-progress">
          <div class="step ${this.currentStep >= 1 ? 'active' : ''}">1. Envío</div>
          <div class="step ${this.currentStep >= 2 ? 'active' : ''}">2. Método de Envío</div>
          <div class="step ${this.currentStep >= 3 ? 'active' : ''}">3. Pago</div>
          <div class="step ${this.currentStep >= 4 ? 'active' : ''}">4. Confirmación</div>
        </div>

        <div class="checkout-content">
          ${this.renderStep()}
        </div>

        <div class="checkout-summary">
          <h3>Resumen del Pedido</h3>
          ${this.cart.map(item => `
            <div class="summary-item">
              <span>${item.title} x${item.quantity}</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="summary-total">
            <strong>Total: $${cartManager.getGrandTotal().toFixed(2)}</strong>
          </div>
        </div>
      </div>
    `;

    this.setupStepEventListeners();
  }

  renderStep() {
    switch (this.currentStep) {
      case 1:
        return this.renderShippingStep();
      case 2:
        return this.renderShippingMethodStep();
      case 3:
        return this.renderPaymentStep();
      case 4:
        return this.renderConfirmationStep();
      default:
        return '';
    }
  }

  renderShippingStep() {
    return `
      <div class="checkout-step active">
        <h2>Información de Envío</h2>
        <form id="shipping-form">
          <div class="form-group">
            <label for="first-name">Nombre</label>
            <input type="text" id="first-name" required>
          </div>
          <div class="form-group">
            <label for="last-name">Apellido</label>
            <input type="text" id="last-name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="phone">Teléfono</label>
            <input type="tel" id="phone" required>
          </div>
          <div class="form-group">
            <label for="address">Dirección</label>
            <input type="text" id="address" required>
          </div>
          <div class="form-group">
            <label for="city">Ciudad</label>
            <input type="text" id="city" required>
          </div>
          <div class="form-group">
            <label for="zip">Código Postal</label>
            <input type="text" id="zip" required>
          </div>
          <div class="form-group">
            <label for="country">País</label>
            <select id="country" required>
              <option value="ES">España</option>
              <option value="MX">México</option>
              <option value="AR">Argentina</option>
            </select>
          </div>
          <button type="submit" class="cta-button">Continuar</button>
        </form>
      </div>
    `;
  }

  renderShippingMethodStep() {
    return `
      <div class="checkout-step active">
        <h2>Método de Envío</h2>
        <div class="shipping-options">
          <label class="shipping-option">
            <input type="radio" name="shipping" value="standard" checked>
            <span>Envío Estándar (3-5 días) - $5.99</span>
          </label>
          <label class="shipping-option">
            <input type="radio" name="shipping" value="express">
            <span>Envío Express (1-2 días) - $12.99</span>
          </label>
          <label class="shipping-option">
            <input type="radio" name="shipping" value="overnight">
            <span>Envío Nocturno - $24.99</span>
          </label>
        </div>
        <button id="back-step2" class="btn-secondary">Atrás</button>
        <button id="next-step2" class="cta-button">Continuar</button>
      </div>
    `;
  }

  renderPaymentStep() {
    return `
      <div class="checkout-step active">
        <h2>Información de Pago</h2>
        <form id="payment-form">
          <div class="form-group">
            <label for="card-number">Número de Tarjeta</label>
            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
          </div>
          <div class="form-group">
            <label for="expiry">Fecha de Expiración</label>
            <input type="text" id="expiry" placeholder="MM/YY" required>
          </div>
          <div class="form-group">
            <label for="cvv">CVV</label>
            <input type="text" id="cvv" placeholder="123" required>
          </div>
          <div class="form-group">
            <label for="card-name">Nombre en la Tarjeta</label>
            <input type="text" id="card-name" required>
          </div>
          <button type="submit" class="cta-button">Pagar Ahora</button>
        </form>
        <button id="back-step3" class="btn-secondary">Atrás</button>
      </div>
    `;
  }

  renderConfirmationStep() {
    const orderNumber = 'ORD-' + Date.now();
    return `
      <div class="checkout-step active">
        <h2>¡Pedido Confirmado!</h2>
        <div class="confirmation-details">
          <p>Gracias por tu compra. Tu pedido ha sido procesado exitosamente.</p>
          <p><strong>Número de Pedido:</strong> ${orderNumber}</p>
          <p>Recibirás un email de confirmación en breve.</p>
          <button onclick="app.showSection('catalog')" class="cta-button">Continuar Comprando</button>
        </div>
      </div>
    `;
  }

  setupStepEventListeners() {
    if (this.currentStep === 1) {
      document.getElementById('shipping-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.collectShippingInfo();
        this.currentStep = 2;
        this.renderCheckout();
      });
    } else if (this.currentStep === 2) {
      document.getElementById('next-step2').addEventListener('click', () => {
        this.currentStep = 3;
        this.renderCheckout();
      });
      document.getElementById('back-step2').addEventListener('click', () => {
        this.currentStep = 1;
        this.renderCheckout();
      });
    } else if (this.currentStep === 3) {
      document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.processPayment();
      });
      document.getElementById('back-step3').addEventListener('click', () => {
        this.currentStep = 2;
        this.renderCheckout();
      });
    }
  }

  collectShippingInfo() {
    this.shippingInfo = {
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      zip: document.getElementById('zip').value,
      country: document.getElementById('country').value
    };
  }

  processPayment() {
    // Simulate payment processing
    app.showToast('Procesando pago...');
    setTimeout(() => {
      this.currentStep = 4;
      this.renderCheckout();
      this.saveOrder();
    }, 2000);
  }

  saveOrder() {
    const order = {
      id: 'ORD-' + Date.now(),
      date: new Date().toISOString(),
      items: this.cart,
      shipping: this.shippingInfo,
      total: cartManager.getGrandTotal()
    };

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    cartManager.cart = [];
    cartManager.save();
    cartManager.updateCartCount();
  }
}

const checkoutSimulator = new CheckoutSimulator();