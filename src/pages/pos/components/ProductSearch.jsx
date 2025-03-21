import React, { useState } from 'react';
import { Search, Barcode } from 'lucide-react';

const ProductSearch = ({ onSearch, barcodeInput, setBarcodeInput, onBarcodeSubmit }) => {
  const [searchInput, setSearchInput] = useState('');
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // If search is cleared, pass empty string to trigger refresh
    if (value === '') {
      onSearch('');
    }
  };

  const toggleBarcodeInput = () => {
    setShowBarcodeInput(!showBarcodeInput);
  };

  return (
    <div className="space-y-2">
      {!showBarcodeInput ? (
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10 w-full"
            placeholder="Search products by name..."
            value={searchInput}
            onChange={handleSearchChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={toggleBarcodeInput}
            title="Scan Barcode"
          >
            <Barcode className="h-5 w-5" />
          </button>
        </form>
      ) : (
        <form onSubmit={onBarcodeSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Barcode className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10 w-full bg-primary-50 border-primary-200"
            placeholder="Scan or enter barcode..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={toggleBarcodeInput}
            title="Search by Name"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductSearch;