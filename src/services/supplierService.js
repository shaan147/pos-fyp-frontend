import api from './apiService';

export const supplierService = {
  // Get all suppliers with optional filtering
  getAllSuppliers: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    return api.get(`/suppliers?${params.toString()}`);
  },
  
  // Get a single supplier by ID
  getSupplierById: async (id) => {
    return api.get(`/suppliers/${id}`);
  },
  
  // Create a new supplier
  createSupplier: async (supplierData) => {
    return api.post('/suppliers', supplierData);
  },
  
  // Update an existing supplier
  updateSupplier: async (id, supplierData) => {
    return api.put(`/suppliers/${id}`, supplierData);
  },
  
  // Delete a supplier
  deleteSupplier: async (id) => {
    return api.delete(`/suppliers/${id}`);
  },
  
  // Get suppliers by category
  getSuppliersByCategory: async (category) => {
    return api.get(`/suppliers/category/${category}`);
  },
  
  // Get products by supplier
  getProductsBySupplier: async (id) => {
    return api.get(`/suppliers/${id}/products`);
  },
  
  // Send notification to supplier
  notifySupplier: async (id, notificationData) => {
    return api.post(`/suppliers/${id}/notify`, notificationData);
  }
};