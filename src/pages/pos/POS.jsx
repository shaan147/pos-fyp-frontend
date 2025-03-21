import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@services/productService';
import { useAuth } from '@hooks/useAuth';
import { AlertCircle } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

// Components
import ProductSearch from './components/ProductSearch';
import ProductGrid from './components/ProductGrid';
import CategoryFilter from './components/CategoryFilter';
import Cart from './components/Cart';
import PaymentModal from './components/PaymentModal';

const POS = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');

  // Fetch products
  const { 
    data: products,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['pos-products', searchTerm, selectedCategory],
    queryFn: () => productService.getAllProducts({
      limit: 100, 
      name: searchTerm || undefined,
      category: selectedCategory || undefined,
      isActive: true
    }),
  });

  // Fetch product by barcode
  const { 
    data: barcodeProduct,
    refetch: refetchBarcode
  } = useQuery({
    queryKey: ['product-barcode', scannedBarcode],
    queryFn: () => productService.getProductByBarcode(scannedBarcode),
    enabled: !!scannedBarcode,
  });

  // Add product to cart when found by barcode
  useEffect(() => {
    if (barcodeProduct && barcodeProduct.data) {
      handleAddToCart(barcodeProduct.data);
      setScannedBarcode(''); // Reset after adding to cart
    }
  }, [barcodeProduct]);

  // Handle barcode scanning
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      setScannedBarcode(barcodeInput.trim());
      refetchBarcode();
      setBarcodeInput('');
    }
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      // Check if product is already in cart
      const existingItem = prevCart.find(item => item.product._id === product._id);
      
      if (existingItem) {
        // Increment quantity if already in cart
        return prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, {
          product,
          quantity: 1,
          price: product.price,
          subtotal: product.price
        }];
      }
    });
  };

  // Update cart item quantity
  const handleUpdateQuantity = (productId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.product._id === productId
          ? { 
              ...item, 
              quantity,
              subtotal: quantity * item.price
            }
          : item
      ).filter(item => item.quantity > 0) // Remove items with 0 quantity
    );
  };

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const taxRate = 0.17; // 17% GST
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    return {
      subtotal,
      tax,
      total,
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    // Reset state after successful payment
    setCart([]);
    setIsPaymentModalOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-danger-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-danger-800">Error loading products</h3>
            <div className="mt-2 text-sm text-danger-700">
              <p>{error.message || 'There was an error loading the products. Please try again.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex h-full">
        {/* Products Section (Left) */}
        <div className="w-2/3 h-full flex flex-col bg-gray-50 p-4">
          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <ProductSearch 
                onSearch={handleSearch} 
                barcodeInput={barcodeInput}
                setBarcodeInput={setBarcodeInput}
                onBarcodeSubmit={handleBarcodeSubmit}
              />
            </div>
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategoryFilter} 
          />
          
          <div className="flex-1 mt-4 overflow-y-auto">
            <ProductGrid 
              products={products?.data || []} 
              onAddToCart={handleAddToCart} 
            />
          </div>
        </div>
        
        {/* Cart Section (Right) */}
        <div className="w-1/3 h-full flex flex-col border-l">
          <Cart 
            items={cart}
            totals={calculateTotals()}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={() => setIsPaymentModalOpen(true)}
          />
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          cart={cart}
          totals={calculateTotals()}
          onClose={() => setIsPaymentModalOpen(false)}
          onComplete={handlePaymentComplete}
          cashier={user}
        />
      )}
    </div>
  );
};

export default POS;