const db = require('../db');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  const { name, price, description, imageUrl } = req.body;
  
  if (!name || !price || !description) {
    return res.status(400).json({ error: 'Name, price, and description are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO products (name, price, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, description, imageUrl]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search products
const searchProducts = async (req, res) => {
  const { term } = req.query;
  
  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    // Case-insensitive search on name and description
    const result = await db.query(
      `SELECT * FROM products 
       WHERE name ILIKE $1 OR description ILIKE $1 
       ORDER BY created_at DESC`,
      [`%${term}%`]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  searchProducts
}; 