import React from 'react';
import { Plus, Minus, Trash, ShoppingCart, XCircle, CreditCard } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const incrementQuantity = () => {
    if (item.quantity < item.product.stockQuantity) {
      onUpdateQuantity(item.product._id, item.quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product._id, item.quantity - 1);
    } else {
      onRemoveItem(item.product._id);
    }
  };

  return (
    <div className="flex items-start py-3 border-b dark:border-gray-700">
      <div className="flex-1 pr-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">{item.product.name}</h3>
        <p className="text-xs text-gray-500 dark:text-dark-text-secondary">{item.product.productId}</p>
        <div className="mt-1 flex items-center">
          <span className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary">
            ₨{item.price.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500 dark:text-dark-text-secondary ml-2">
            per {item.product.unit}
          </span>
        </div>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={decrementQuantity}
          className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {item.quantity === 1 ? <Trash size={14} /> : <Minus size={14} />}
        </button>
        
        <input
          type="text"
          value={item.quantity}
          readOnly
          className="w-10 mx-1 py-1 text-center text-sm font-medium border-none bg-transparent dark:text-dark-text-primary"
        />
        
        <button
          onClick={incrementQuantity}
          disabled={item.quantity >= item.product.stockQuantity}
          className={`p-1 rounded-full ${
            item.quantity >= item.product.stockQuantity
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Plus size={14} />
        </button>
      </div>
      
      <div className="ml-4 text-right min-w-[70px]">
        <div className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary">
          ₨{item.subtotal.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
      <ShoppingCart className="h-8 w-8 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">Your cart is empty</h3>
    <p className="text-gray-500 dark:text-dark-text-secondary mt-1 max-w-xs">
      Add products by clicking on them from the product list on the left.
    </p>
  </div>
);

const Cart = ({ items, totals, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout }) => {
  const hasItems = items.length > 0;
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-card">
      <div className="px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
          Current Sale
        </h2>
        {hasItems && (
          <button
            onClick={onClearCart}
            className="text-sm text-danger-600 dark:text-danger-400 hover:text-danger-800 dark:hover:text-danger-300 flex items-center"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Clear
          </button>
        )}
      </div>
      
      {hasItems ? (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </div>
          </div>
          
          <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-dark-text-secondary">Subtotal</span>
                <span className="font-medium dark:text-dark-text-primary">₨{totals.subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-dark-text-secondary">Tax (17%)</span>
                <span className="font-medium dark:text-dark-text-primary">₨{totals.tax.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between pt-2 border-t dark:border-gray-700 text-base font-bold">
                <span className="dark:text-dark-text-primary">Total</span>
                <span className="dark:text-dark-text-primary">₨{totals.total.toLocaleString()}</span>
              </div>
            </div>
            
            <button
              onClick={onCheckout}
              className="btn btn-primary w-full py-3 h-auto text-base flex items-center justify-center"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Checkout ({totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'})
            </button>
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default Cart;