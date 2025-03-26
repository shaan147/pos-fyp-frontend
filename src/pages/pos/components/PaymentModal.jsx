import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { orderService } from '@services/orderService';
import {
  X,
  CreditCard,
  DollarSign,
  Wallet,
  Building,
  Printer,
  Check,
  AlertCircle,
  User,
} from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

const PaymentModal = ({ cart, totals, onClose, onComplete, cashier }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    isGuest: true,
    name: '',
    email: '',
    phone: '',
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Payment method options
  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: <DollarSign size={20} /> },
    { id: 'card', name: 'Card', icon: <CreditCard size={20} /> },
    { id: 'mobile_wallet', name: 'Mobile Wallet', icon: <Wallet size={20} /> },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: <Building size={20} /> },
  ];

  // Calculate change
  const calculateChange = () => {
    if (!amountReceived || paymentMethod !== 'cash') return 0;
    const received = parseFloat(amountReceived);
    return received > totals.total ? received - totals.total : 0;
  };

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData) => orderService.createOrder(orderData),
    onSuccess: (data) => {
      setOrderCompleted(true);
      setOrderNumber(data.data.orderId);
      // After 2 seconds, complete the order
      setTimeout(() => {
        onComplete();
      }, 2000);
    },
  });

  // Handle submit payment
  const handleSubmitPayment = () => {
    // Prepare order items
    const orderItems = cart.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));

    // Create order data
    const orderData = {
      items: orderItems,
      customerId: customerInfo.isGuest ? null : null, // Replace with actual customer ID if implemented
      sessionId: customerInfo.isGuest ? `GUEST-${Date.now()}` : null,
      paymentMethod,
      notes: orderNotes,
      cashierId: cashier?._id,
    };

    // Submit order
    createOrderMutation.mutate(orderData);
  };

  // Handle amount received input
  const handleAmountReceivedChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmountReceived(value);
    }
  };

  // Quick amount buttons
  const quickAmounts = [
    totals.total,
    Math.ceil(totals.total / 100) * 100,
    Math.ceil(totals.total / 500) * 500,
    Math.ceil(totals.total / 1000) * 1000,
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            disabled={createOrderMutation.isPending}
          >
            <X size={24} />
          </button>
        </div>

        {/* Success message */}
        {orderCompleted && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="h-16 w-16 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">Payment Successful!</h3>
            <p className="text-gray-600 dark:text-dark-text-secondary mb-6">Order #{orderNumber} has been placed successfully.</p>
            <div className="flex space-x-4">
              <button onClick={() => onComplete()} className="btn btn-primary px-4 py-2">
                New Sale
              </button>
              <button
                onClick={() => window.print()}
                className="btn btn-outline px-4 py-2 flex items-center"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {createOrderMutation.isError && !orderCompleted && (
          <div className="bg-danger-50 dark:bg-danger-900/30 border-b border-danger-200 dark:border-danger-800 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-danger-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-danger-800 dark:text-danger-200">Error processing payment</h3>
                <div className="mt-2 text-sm text-danger-700 dark:text-danger-300">
                  <p>{createOrderMutation.error?.message || 'An unexpected error occurred'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Body - Only show if not completed */}
        {!orderCompleted && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-3 border dark:border-gray-700 rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800'
                          : 'bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                      />
                      <div className="ml-3 flex items-center">
                        <span className="h-8 w-8 flex items-center justify-center text-gray-600 dark:text-gray-400">
                          {method.icon}
                        </span>
                        <span className="ml-2 text-gray-700 dark:text-dark-text-primary">{method.name}</span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Cash payment details */}
                {paymentMethod === 'cash' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="amountReceived"
                        className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1"
                      >
                        Amount Received
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400">₨</span>
                        </div>
                        <input
                          id="amountReceived"
                          type="text"
                          className="input pl-8 w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
                          placeholder="Enter amount"
                          value={amountReceived}
                          onChange={handleAmountReceivedChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          className="btn btn-default px-2 py-1 text-sm"
                          onClick={() => setAmountReceived(amount.toString())}
                        >
                          ₨{amount.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border dark:border-gray-700">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-dark-text-secondary">Total</span>
                        <span className="font-medium dark:text-dark-text-primary">₨{totals.total.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between mt-2">
                        <span className="text-gray-600 dark:text-dark-text-secondary">Received</span>
                        <span className="font-medium dark:text-dark-text-primary">
                          {amountReceived ? `₨${parseFloat(amountReceived).toLocaleString()}` : '-'}
                        </span>
                      </div>

                      <div className="flex justify-between mt-2 pt-2 border-t dark:border-gray-700">
                        <span className="font-medium text-gray-700 dark:text-dark-text-primary">Change</span>
                        <span className="font-bold dark:text-dark-text-primary">₨{calculateChange().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Info & Order Summary */}
              <div>
                {/* Customer Information */}
                <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">Customer Information</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <input
                      id="isGuest"
                      type="checkbox"
                      checked={customerInfo.isGuest}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, isGuest: e.target.checked })
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="isGuest" className="ml-2 block text-sm text-gray-700 dark:text-dark-text-primary">
                      Guest Checkout
                    </label>
                  </div>

                  {!customerInfo.isGuest && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                        <div className="ml-3">
                          <input
                            type="text"
                            className="input w-full mb-2 dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
                            placeholder="Customer name"
                            value={customerInfo.name}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, name: e.target.value })
                            }
                          />
                          <input
                            type="email"
                            className="input w-full mb-2 dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
                            placeholder="Email"
                            value={customerInfo.email}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, email: e.target.value })
                            }
                          />
                          <input
                            type="tel"
                            className="input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
                            placeholder="Phone"
                            value={customerInfo.phone}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Notes */}
                <div className="mb-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
                    Order Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
                    placeholder="Add any special instructions or notes..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-dark-text-primary mb-2">Order Summary</h4>
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-dark-text-secondary">Items</span>
                      <span className="dark:text-dark-text-primary">{totals.itemCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-dark-text-secondary">Subtotal</span>
                      <span className="dark:text-dark-text-primary">₨{totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-dark-text-secondary">Tax (17%)</span>
                      <span className="dark:text-dark-text-primary">₨{totals.tax.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t dark:border-gray-700">
                    <div className="flex justify-between font-bold">
                      <span className="dark:text-dark-text-primary">Total</span>
                      <span className="dark:text-dark-text-primary">₨{totals.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!orderCompleted && (
          <div className="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="btn btn-default px-4 py-2"
              disabled={createOrderMutation.isPending}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitPayment}
              className="btn btn-primary px-6 py-2 flex items-center"
              disabled={
                createOrderMutation.isPending ||
                (paymentMethod === 'cash' &&
                  (!amountReceived || parseFloat(amountReceived) < totals.total))
              }
            >
              {createOrderMutation.isPending ? (
                <>
                  <LoadingSpinner size="small" /> <span className="ml-2">Processing...</span>
                </>
              ) : (
                <>Complete Sale</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
