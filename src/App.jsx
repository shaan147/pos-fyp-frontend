import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { ThemeProvider } from '@context/ThemeContext';

// Layouts
import DashboardLayout from '@layouts/dashboard/DashboardLayout';
import AuthLayout from '@layouts/auth/AuthLayout';

// Lazy-loaded pages for better performance
const Login = lazy(() => import('@pages/auth/Login'));
const Register = lazy(() => import('@pages/auth/Register'));
const Dashboard = lazy(() => import('@pages/dashboard/Dashboard'));
const Products = lazy(() => import('@pages/inventory/Products'));
const ProductDetail = lazy(() => import('@pages/inventory/ProductDetail'));
const AddProduct = lazy(() => import('@pages/inventory/AddProduct'));
const POS = lazy(() => import('@pages/pos/POS'));
const Orders = lazy(() => import('@pages/orders/Orders'));
const OrderDetail = lazy(() => import('@pages/orders/OrderDetail'));
const Suppliers = lazy(() => import('@pages/suppliers/Suppliers'));
const SupplierDetail = lazy(() => import('@pages/suppliers/SupplierDetail'));
const AddSupplier = lazy(() => import('@pages/suppliers/AddSupplier'));
const Reports = lazy(() => import('@pages/reports/Reports')); 
const Settings = lazy(() => import('@pages/settings/Settings'));
const NotFound = lazy(() => import('@pages/NotFound'));

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Handle the initial loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <LoadingSpinner size="large" />
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route
            path="login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
          />
        </Route>

        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route path="dashboard" element={<Dashboard />} />

          {/* Inventory Management */}
          <Route path="products">
            <Route index element={<Products />} />
            <Route path="add" element={<AddProduct />} />
            <Route path=":id" element={<ProductDetail />} />
          </Route>

          {/* POS */}
          <Route path="pos" element={<POS />} />

          {/* Orders */}
          <Route path="orders">
            <Route index element={<Orders />} />
            <Route path=":id" element={<OrderDetail />} />
          </Route>

          {/* Suppliers */}
          {
            <Route path="suppliers">
              <Route index element={<Suppliers />} />
              <Route path="add" element={<AddSupplier />} />
              <Route path=":id" element={<SupplierDetail />} />
            </Route>
          }

          {/* Reports */}
          <Route path="reports" element={<Reports />} />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
