const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/api/products', (req, res) => {
  const products = [
    { id: 1, name: 'Laptop', price: 999, description: 'High-performance laptop', category: 'Electronics' },
    { id: 2, name: 'Phone', price: 599, description: 'Latest smartphone', category: 'Electronics' },
    { id: 3, name: 'Headphones', price: 199, description: 'Noise-cancelling headphones', category: 'Electronics' },
    { id: 4, name: 'Tablet', price: 399, description: '10-inch tablet', category: 'Electronics' },
    { id: 5, name: 'Smartwatch', price: 299, description: 'Fitness smartwatch', category: 'Electronics' },
    { id: 6, name: 'T-Shirt', price: 29, description: 'Cotton t-shirt', category: 'Clothing' },
    { id: 7, name: 'Jeans', price: 79, description: 'Denim jeans', category: 'Clothing' },
    { id: 8, name: 'Jacket', price: 129, description: 'Leather jacket', category: 'Clothing' },
    { id: 9, name: 'Sneakers', price: 89, description: 'Running sneakers', category: 'Clothing' },
    { id: 10, name: 'Hat', price: 19, description: 'Baseball cap', category: 'Clothing' },
    { id: 11, name: 'Book', price: 19, description: 'Bestseller novel', category: 'Books' },
    { id: 12, name: 'Cookbook', price: 25, description: 'Italian recipes', category: 'Books' },
    { id: 13, name: 'Biography', price: 22, description: 'Famous author biography', category: 'Books' },
    { id: 14, name: 'Textbook', price: 49, description: 'Computer science textbook', category: 'Books' },
    { id: 15, name: 'Comic', price: 15, description: 'Superhero comic book', category: 'Books' }
  ];
  res.json(products);
});

app.listen(3000, () => {
  console.log('E-commerce server running on http://localhost:3000');
});