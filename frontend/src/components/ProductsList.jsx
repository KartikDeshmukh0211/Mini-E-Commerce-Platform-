import { useState, useEffect } from 'react';
import axios from 'axios';

// Fallback image URL
const FALLBACK_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsBGOs2225fFqTfnl5EKlrEUBn5-drby1x3Q&s";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [originalProducts, setOriginalProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL : 'http://localhost:5000/products';
      const response = await axios.get(API_URL);
      setProducts(response.data);
      setOriginalProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to perform contextual search
  const performContextualSearch = (query) => {
    if (!query.trim()) {
      setProducts(originalProducts);
      return;
    }
    
    // Break the search query into keywords
    const keywords = query.toLowerCase().split(/\s+/);
    
    // Filter products based on keyword matching in name or description
    const results = originalProducts.filter(product => {
      const nameMatch = keywords.some(keyword => 
        product.name.toLowerCase().includes(keyword)
      );
      
      const descriptionMatch = keywords.some(keyword => 
        product.description.toLowerCase().includes(keyword)
      );
      
      // Additional contextual matching logic
      // Check if the search terms relate to common product attributes
      const contextMatch = checkContextMatch(keywords, product);
      
      return nameMatch || descriptionMatch || contextMatch;
    });
    
    setProducts(results);
  };

  // Helper function for contextual matching
  const checkContextMatch = (keywords, product) => {
    // Dictionary of contextual terms and their related product attributes
    const contextualMap = {
      // Seating related terms
      'sit': ['chair', 'sofa', 'couch', 'bench', 'stool', 'seating'],
      'seat': ['chair', 'sofa', 'couch', 'bench', 'stool', 'seating'],
      'comfortable': ['sofa', 'chair', 'couch', 'mattress', 'bed', 'pillow'],
      'relax': ['sofa', 'chair', 'couch', 'bed', 'lounge'],
      
      // Storage related terms
      'store': ['shelf', 'cabinet', 'drawer', 'storage', 'box'],
      'organize': ['shelf', 'cabinet', 'drawer', 'storage', 'organizer'],
      
      // Display related terms
      'display': ['tv', 'monitor', 'screen', 'shelf', 'stand'],
      'watch': ['tv', 'television', 'monitor', 'screen'],
      
      // Kitchen related terms
      'cook': ['stove', 'oven', 'cooker', 'pan', 'pot', 'kitchen'],
      'food': ['refrigerator', 'fridge', 'oven', 'kitchen'],
      
      // Work related terms
      'work': ['desk', 'table', 'chair', 'office', 'computer'],
      'study': ['desk', 'table', 'chair', 'book', 'lamp'],
      
      // Price related terms
      'cheap': ['affordable', 'budget', 'inexpensive', 'low-price'],
      'expensive': ['premium', 'luxury', 'high-end', 'quality'],
      
      // Color related terms
      'dark': ['black', 'brown', 'gray', 'navy'],
      'light': ['white', 'beige', 'cream', 'light'],
      
      // Material related terms
      'wooden': ['wood', 'timber', 'oak', 'pine', 'maple'],
      'metal': ['steel', 'aluminum', 'iron', 'metallic'],
      
      // Family related terms
      'family': ['sofa', 'dining', 'table', 'large', 'spacious', 'set']
    };
    
    // Check each keyword against our contextual map
    for (const keyword of keywords) {
      // If the keyword is in our contextual map
      if (contextualMap[keyword]) {
        // Check if any of the related terms appear in the product name or description
        const relatedTerms = contextualMap[keyword];
        const nameMatch = relatedTerms.some(term => 
          product.name.toLowerCase().includes(term)
        );
        const descriptionMatch = relatedTerms.some(term => 
          product.description.toLowerCase().includes(term)
        );
        
        if (nameMatch || descriptionMatch) {
          return true;
        }
      }
    }
    
    return false;
  };

  const handleSearch = () => {
    performContextualSearch(searchTerm);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setProducts(originalProducts);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const sortProducts = (products) => {
    switch (sortOption) {
      case 'newest':
        return [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return [...products].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'price-high':
        return [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'price-low':
        return [...products].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  };

  const sortedProducts = sortProducts(products);

  // Generate skeleton loaders
  const renderSkeletons = () => {
    return Array(6).fill().map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="w-full h-56 skeleton"></div>
        <div className="p-6">
          <div className="h-6 w-3/4 skeleton rounded mb-4"></div>
          <div className="h-4 w-1/4 skeleton rounded mb-4"></div>
          <div className="h-4 w-full skeleton rounded mb-2"></div>
          <div className="h-4 w-5/6 skeleton rounded"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="glassmorphism bg-white bg-opacity-90 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Search products (try: 'need something to sit' or 'store my clothes')"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <button
                    onClick={handleSearch}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white btn-fancy bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-4">
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 sr-only">Sort</label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="name">Name</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results summary */}
        {!loading && !error && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <span>
              {products.length === 0 
                ? 'No products found' 
                : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
            </span>
            {searchTerm && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setProducts(originalProducts);
                }}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
          {renderSkeletons()}
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md max-w-2xl mx-auto">
          <div className="flex">
            <svg className="h-6 w-6 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-gray-500">Start by adding some products on the submission page.</p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                setProducts(originalProducts);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product) => (
                <div key={product.id} className="glassmorphism bg-white bg-opacity-95 rounded-xl shadow-md overflow-hidden card-hover">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url || FALLBACK_IMAGE}
                      alt={product.name}
                      className="w-full h-56 object-cover object-center hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-3 py-1 rounded-full text-sm shadow-md">
                        ₹{parseFloat(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(product.created_at).toLocaleDateString()}
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedProducts.map((product) => (
                <div key={product.id} className="glassmorphism bg-white bg-opacity-95 rounded-xl shadow-md overflow-hidden card-hover">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 relative">
                      <img
                        src={product.image_url || FALLBACK_IMAGE}
                        alt={product.name}
                        className="w-full h-48 md:h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                    <div className="p-6 md:w-3/4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                          ₹{parseFloat(product.price).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-3">{product.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(product.created_at).toLocaleDateString()}
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductsList; 