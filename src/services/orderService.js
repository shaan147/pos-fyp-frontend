import api from './apiService';

export const orderService = {
  // Get all orders with optional filtering
  getAllOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    return api.get(`/orders?${params.toString()}`);
  },
  
  // Get a single order by ID
  getOrderById: async (id) => {
    return api.get(`/orders/${id}`);
  },
  
  // Create a new order
  createOrder: async (orderData) => {
    return api.post('/orders', orderData);
  },
  
  // Update order status
  updateOrderStatus: async (id, statusData) => {
    return api.put(`/orders/${id}/status`, statusData);
  },
  
  // Cancel an order
  cancelOrder: async (id) => {
    return api.put(`/orders/${id}/cancel`);
  },
  
  // Get orders by customer
  getOrdersByCustomer: async (customerId) => {
    return api.get(`/orders/customer/${customerId}`);
  },
  
  // Get order analytics
  getOrderAnalytics: async (startDate, endDate) => {
    const params = new URLSearchParams();
    
    if (startDate) {
      params.append('startDate', startDate);
    }
    
    if (endDate) {
      params.append('endDate', endDate);
    }
    
    return api.get(`/orders/analytics/summary?${params.toString()}`);
  }
};