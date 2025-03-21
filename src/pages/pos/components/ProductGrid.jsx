import React from 'react';
import { Package, Plus } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const stockStatusClass = 
    product.stockQuantity <= 0 ? 'bg-danger-100 text-danger-800' : 
    product.stockQuantity <= product.minStockLevel ? 'bg-warning-100 text-warning-800' : 
    'bg-success-100 text-success-800';

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-4 flex-1">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900 truncate" title={product.name}>
            {product.name}
          </h3>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${stockStatusClass}`}>
            {product.stockQuantity}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500 truncate" title={product.category}>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900">
            ₨{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">
            {product.unit}
          </span>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t">
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stockQuantity <= 0}
          className={`w-full flex items-center justify-center py-1.5 rounded-md text-sm font-medium ${
            product.stockQuantity <= 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const ProductGrid = ({ products, onAddToCart }) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white border rounded-lg p-8">
        <Package className="h-12 w-12 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="text-gray-500 text-center mt-1">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          onAddToCart={onAddToCart} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;