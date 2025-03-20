# POS & Inventory System Frontend

This is the frontend for the Point of Sale and Auto Inventory Management System, built with React and Vite.

## Features

- **Dashboard** with sales analytics and inventory stats
- **POS Interface** for processing sales
- **Inventory Management** for tracking products and stock
- **Order Management** to view and process orders
- **Supplier Management** for tracking and notifying suppliers
- **User Authentication** with role-based access control

## Tech Stack

- **React** - Frontend library
- **Vite** - Build tool
- **React Router** - Page routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Recharts** - Charts and data visualization
- **React Hook Form** - Form validation
- **Zod** - Schema validation
- **Axios** - API requests

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pos-frontend.git
   cd pos-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── assets/        # Static assets
├── components/    # Reusable components
│   ├── common/    # Common UI components
│   ├── forms/     # Form components
│   ├── tables/    # Table components
│   ├── charts/    # Chart components
│   ├── ui/        # UI elements
│   └── modals/    # Modal dialogs
├── context/       # React context
├── features/      # Feature-specific components
├── hooks/         # Custom hooks
├── layouts/       # Page layouts
├── pages/         # Page components
├── services/      # API services
├── utils/         # Utility functions
├── constants/     # Constants and config
├── App.jsx        # Main app component
└── main.jsx       # Entry point
```

## Pages

- **Dashboard** - Overview of sales, inventory, and business metrics
- **Login/Register** - User authentication
- **Products** - Inventory management
- **POS** - Point of sale interface
- **Orders** - Order management
- **Suppliers** - Supplier management
- **Reports** - Sales and inventory reports
- **Settings** - Application settings

## Integration with Backend

This frontend is designed to work with a Node.js/Express/MongoDB backend. The API endpoints are proxied through Vite during development.

## License

This project is licensed under the MIT License - see the LICENSE file for details.