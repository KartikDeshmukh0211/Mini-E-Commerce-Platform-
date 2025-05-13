const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./db');
const productRoutes = require('./routes/productRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/products', productRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running!!!');
});

// Health check endpoint for production to keep the server alive (as in render server goes to sleep after 15 minutes of inactivity)
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initDb();
    
    // Starting the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 