import api from './apiService';

export const productService = {
  // Get all products with optional filtering
  getAllProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    return api.get(`/products?${params.toString()}`);
  },
  
  // Get a single product by ID
  getProductById: async (id) => {
    return api.get(`/products/${id}`);
  },
  
  // Get a product by barcode
  getProductByBarcode: async (barcode) => {
    return api.get(`/products/barcode/${barcode}`);
  },
  
  // Create a new product
  createProduct: async (productData) => {
    return api.post('/products', productData);
  },
  
  // Update an existing product
  updateProduct: async (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },
  
  // Delete a product
  deleteProduct: async (id) => {
    return api.delete(`/products/${id}`);
  },
  
  // Update product stock
  updateStock: async (id, quantity, isAddition = false) => {
    return api.put(`/products/${id}/stock`, { quantity, isAddition });
  },
  
  // Get low stock products
  getLowStockProducts: async () => {
    return api.get('/products/status/lowstock');
  }
};