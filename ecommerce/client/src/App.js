import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  useEffect(() => {
    let filtered = products;
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    if (priceFilter) {
      if (priceFilter === 'low') filtered = filtered.filter(p => p.price < 100);
      if (priceFilter === 'mid') filtered = filtered.filter(p => p.price >= 100 && p.price < 500);
      if (priceFilter === 'high') filtered = filtered.filter(p => p.price >= 500);
    }
    setFilteredProducts(filtered);
  }, [products, categoryFilter, priceFilter]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="App">
      <header>
        <h1>E-Commerce Store</h1>
        <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
          🛒 {cart.length}
        </div>
      </header>
      <div className="container">
        <aside className="filters">
          <h3>Filters</h3>
          <div>
            <label>Category:</label>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="">All</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
            </select>
          </div>
          <div>
            <label>Price:</label>
            <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
              <option value="">All</option>
              <option value="low">Under $100</option>
              <option value="mid">$100 - $499</option>
              <option value="high">$500+</option>
            </select>
          </div>
        </aside>
        <main>
          <div className="products">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </main>
        {showCart && (
          <aside className="cart">
            <div className="cart-header">
              <h3>Cart</h3>
              <button className="close-btn" onClick={() => setShowCart(false)}>×</button>
            </div>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <span>{item.name}</span>
                <input type="number" value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value))} />
                <span>${item.price * item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}
            <p>Total: ${total}</p>
            <button>Checkout</button>
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
