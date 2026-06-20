import React, { useState } from 'react';
import { useAdmin } from '../src/contexts/AdminContext';
import '../src/components/admin/AdminDashboard.css';
import { createProduct, updateProduct, deleteProduct } from '../src/firebase/services/productService';
import { updateOrderStatus, getOrderById, cancelOrder } from '../src/firebase/services/orderService';
import { updateUserRole, deleteUser, getUserStatistics } from '../src/firebase/services/userService';
import { updatePaymentStatus, processRefund, getPaymentById } from '../src/firebase/services/adminPaymentService';
import { createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } from '../src/firebase/services/couponService';
import { createCategory, updateCategory, deleteCategory, toggleCategoryStatus } from '../src/firebase/services/categoryService';

// Import custom hooks
import { useAdminData } from '../src/hooks/admin/useAdminData';
import { useCategoryContext } from '../src/contexts/CategoryContext';
import { useProductContext } from '../src/contexts/ProductContext';
import { useFilters } from '../src/hooks/admin/useFilters';
import { useShiprocket } from '../src/hooks/admin/useShiprocket';

// Import components
import DashboardStatsCards from '../src/components/admin/DashboardStatsCards';
import TabNavigation from '../src/components/admin/TabNavigation';
import DashboardOverview from '../src/components/admin/DashboardOverview';
import ProductsManagement from '../src/components/admin/ProductsManagement';
import ProductModal from '../src/components/admin/ProductModal';
import OrdersManagement from '../src/components/admin/OrdersManagement';
import PaymentsManagement from '../src/components/admin/PaymentsManagement';
import UsersManagement from '../src/components/admin/UsersManagement';
import CouponsManagement from '../src/components/admin/CouponsManagement';
import CategoriesManagement from '../src/components/admin/CategoriesManagement';
import ShippingManagement from '../src/components/admin/ShippingManagement';
import StorefrontManagement from '../src/components/admin/StorefrontManagement';

const AdminDashboardPage = () => {
  const { isAdmin, isLoading } = useAdmin();
  const { refreshAllCategories } = useCategoryContext();
  const { refreshProducts } = useProductContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Use custom hooks
  const adminData = useAdminData(activeTab);
  const filters = useFilters();
  const shiprocketData = useShiprocket();
  
  // Local state for modals and editing
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isProductSubmitting, setIsProductSubmitting] = useState(false);
  const [isCouponSubmitting, setIsCouponSubmitting] = useState(false);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [deletingCouponId, setDeletingCouponId] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [updatingCouponId, setUpdatingCouponId] = useState(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);
  const [refreshUsersKey, setRefreshUsersKey] = useState(0);

  // Product handlers
  const handleProductSubmit = async (formData, imageFiles, productId) => {
    // Prevent multiple submissions
    if (isProductSubmitting) {
      return;
    }
    
    setIsProductSubmitting(true);
    try {
      console.log('Submitting product form:', { productId, editingProduct });
      
      if (editingProduct) {
        console.log('Updating existing product...');
        await updateProduct(productId, formData, imageFiles);
        alert('Product updated successfully!');
      } else {
        console.log('Creating new product...');
        await createProduct(formData, imageFiles);
        alert('Product created successfully!');
      }
      
      setEditingProduct(null);
      setIsProductModalOpen(false);
      console.log('Refreshing products only...');
      await adminData.refreshProductsOnly();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + error.message);
    } finally {
      setIsProductSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      console.error('Product ID is required for deletion');
      alert('Error: Product ID is missing');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setDeletingProductId(productId);
      try {
        console.log('Starting product deletion for ID:', productId);
        await deleteProduct(String(productId));
        console.log('Product deleted successfully, refreshing products...');
        await adminData.refreshProductsOnly();
        
        // Global storefront refresh
        if (refreshProducts) {
          await refreshProducts({ all: true });
        }
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
      } finally {
        setDeletingProductId(null);
      }
    }
  };

  // Coupon handlers
  const handleCouponSubmit = async (formData, couponId) => {
    setIsCouponSubmitting(true);
    try {
      if (couponId) {
        await updateCoupon(couponId, formData);
        alert('Coupon updated successfully!');
      } else {
        await createCoupon(formData);
        alert('Coupon created successfully!');
      }
      
      setEditingCoupon(null);
      adminData.refreshCouponsOnly();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Error saving coupon: ' + error.message);
    } finally {
      setIsCouponSubmitting(false);
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setDeletingCouponId(couponId);
      try {
        await deleteCoupon(couponId);
        adminData.refreshCouponsOnly();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      } finally {
        setDeletingCouponId(null);
      }
    }
  };

  const handleToggleCouponStatus = async (couponId) => {
    setUpdatingCouponId(couponId);
    try {
      await toggleCouponStatus(couponId);
      adminData.refreshCouponsOnly();
    } catch (error) {
      console.error('Error toggling coupon status:', error);
    } finally {
      setUpdatingCouponId(null);
    }
  };

  // Category handlers
  const handleCategorySubmit = async (formData, imageFile, categoryId) => {
    setIsCategorySubmitting(true);
    try {
      if (categoryId) {
        await updateCategory(categoryId, formData, imageFile);
        alert('Category updated successfully!');
      } else {
        await createCategory(formData, imageFile);
        alert('Category created successfully!');
      }
      
      setEditingCategory(null);
      await refreshAllCategories();
      await adminData.refreshCategoriesOnly();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category: ' + error.message);
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? If it has subcategories, you need to delete them first.')) {
      setDeletingCategoryId(categoryId);
      try {
        await deleteCategory(categoryId);
        await refreshAllCategories();
        await adminData.refreshCategoriesOnly();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category: ' + error.message);
      } finally {
        setDeletingCategoryId(null);
      }
    }
  };

  const handleToggleCategoryStatus = async (categoryId) => {
    setUpdatingCategoryId(categoryId);
    try {
      await toggleCategoryStatus(categoryId);
      await refreshAllCategories();
      await adminData.refreshCategoriesOnly();
    } catch (error) {
      console.error('Error toggling category status:', error);
    } finally {
      setUpdatingCategoryId(null);
    }
  };

  // Order handlers
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      if (newStatus === 'cancelled') {
        await cancelOrder(orderId, 'Cancelled by administrator');
      } else {
        await updateOrderStatus(orderId, newStatus);
      }
      adminData.refreshOrdersOnly();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status: ' + error.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const orderDetails = await getOrderById(orderId);
      return orderDetails;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  };

  // User handlers
  const handleUserRoleUpdate = async (userId, isAdminRole) => {
    setUpdatingUserId(userId);
    try {
      await updateUserRole(userId, isAdminRole);
      adminData.refreshUsersOnly();
      setRefreshUsersKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        adminData.refreshUsersOnly();
        setRefreshUsersKey(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const { updateUserStatus } = await import('../src/firebase/services/userService');
      await updateUserStatus(userId, !currentStatus);
      adminData.refreshUsersOnly();
      setRefreshUsersKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Payment handlers
  const handleViewPayment = async (paymentId) => {
    try {
      const paymentDetails = await getPaymentById(paymentId);
      return paymentDetails;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      return null;
    }
  };

  const handlePaymentStatusUpdate = async (paymentId, newStatus) => {
    setUpdatingPaymentId(paymentId);
    try {
      await updatePaymentStatus(paymentId, newStatus);
      adminData.refreshPaymentsOnly();
    } catch (error) {
      console.error('Error updating payment status:', error);
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const handleProcessRefund = async (paymentId, refundAmount, refundReason) => {
    try {
      await processRefund(paymentId, refundAmount, refundReason);
      adminData.refreshPaymentsOnly();
      alert('Refund processed successfully');
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Error processing refund: ' + error.message);
    }
  };

  // Shiprocket handlers
  const handleShiprocketAuth = async (email, password) => {
    const result = await shiprocketData.handleShiprocketAuth(email, password);
    if (result.success) {
      alert('Successfully authenticated with Shiprocket!');
    } else {
      alert('Authentication failed: ' + result.error);
    }
  };

  const handleShipmentCreated = (shipmentData) => {
    // Update the order status in our database to 'shipped'
    if (shipmentData.orderResponse) {
      // Find the order ID from the shipment data
      const orderId = shipmentData.orderResponse.order_id?.replace('ECOM_', '').split('_')[0];
      if (orderId) {
        updateOrderStatus(orderId, 'shipped');
        adminData.refreshOrdersOnly();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-kora">
        <div className="animate-spin rounded-none h-32 w-32 border-b-2 border-indigo"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-kora">
        <div className="text-center p-8 bg-kora-light border border-indigo/10 rounded-none shadow-sm">
          <h1 className="text-2xl font-bold text-terracotta mb-4 uppercase tracking-widest">Access Denied</h1>
          <p className="text-indigo/60">You don't have permission to access this page.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-6 px-8 py-3 bg-indigo text-kora rounded-none hover:bg-terracotta transition-colors uppercase tracking-widest text-xs font-bold"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kora text-indigo px-4 py-8 admin-dashboard-container">
      <h1 className="text-3xl font-black mb-8 uppercase tracking-tight">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <DashboardStatsCards stats={adminData.stats} />
      
      {/* Tabs */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <DashboardOverview 
          orders={adminData.orders}
          products={adminData.products}
          payments={adminData.payments}
          coupons={adminData.coupons}
        />
      )}

      {activeTab === 'products' && (
        <>
          <ProductsManagement
            products={adminData.products}
            searchTerm={filters.searchTerm}
            setSearchTerm={filters.setSearchTerm}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            deletingProductId={deletingProductId}
            onAddProduct={handleAddProduct}
            isSubmitting={isProductSubmitting}
            editingProduct={editingProduct}
          />
          <ProductModal
            isOpen={isProductModalOpen}
            onClose={handleCloseProductModal}
            onSubmit={handleProductSubmit}
            editingProduct={editingProduct}
            isSubmitting={isProductSubmitting}
          />
        </>
      )}

      {activeTab === 'categories' && (
        <CategoriesManagement
          categories={adminData.categories}
          searchTerm={filters.searchTerm}
          setSearchTerm={filters.setSearchTerm}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onToggleCategoryStatus={handleToggleCategoryStatus}
          deletingCategoryId={deletingCategoryId}
          updatingCategoryId={updatingCategoryId}
          onAddCategory={handleCategorySubmit}
          isSubmitting={isCategorySubmitting}
          editingCategory={editingCategory}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersManagement
          searchTerm={filters.searchTerm}
          filterStatus={filters.filterStatus}
          setSearchTerm={filters.setSearchTerm}
          setFilterStatus={filters.setFilterStatus}
          onOrderStatusUpdate={handleOrderStatusUpdate}
          onViewOrder={handleViewOrder}
          updatingOrderId={updatingOrderId}
        />
      )}

      {activeTab === 'payments' && (
        <PaymentsManagement
          payments={adminData.payments}
          searchTerm={filters.searchTerm}
          paymentFilterStatus={filters.paymentFilterStatus}
          setSearchTerm={filters.setSearchTerm}
          setPaymentFilterStatus={filters.setPaymentFilterStatus}
          onViewPayment={handleViewPayment}
          onPaymentStatusUpdate={handlePaymentStatusUpdate}
          onProcessRefund={handleProcessRefund}
          updatingPaymentId={updatingPaymentId}
        />
      )}

      {activeTab === 'users' && (
        <UsersManagement
          key={refreshUsersKey}
          searchTerm={filters.searchTerm}
          setSearchTerm={filters.setSearchTerm}
          onUserRoleUpdate={handleUserRoleUpdate}
          onDeleteUser={handleDeleteUser}
          onToggleUserStatus={handleToggleUserStatus}
          updatingUserId={updatingUserId}
          refreshUsers={refreshUsersKey}
        />
      )}

      {activeTab === 'coupons' && (
        <CouponsManagement
          coupons={adminData.coupons}
          searchTerm={filters.searchTerm}
          couponFilterStatus={filters.couponFilterStatus}
          setSearchTerm={filters.setSearchTerm}
          setCouponFilterStatus={filters.setCouponFilterStatus}
          onEditCoupon={handleEditCoupon}
          onDeleteCoupon={handleDeleteCoupon}
          onToggleCouponStatus={handleToggleCouponStatus}
          updatingCouponId={updatingCouponId}
          deletingCouponId={deletingCouponId}
          onAddCoupon={handleCouponSubmit}
          isSubmitting={isCouponSubmitting}
          editingCoupon={editingCoupon}
        />
      )}

      {activeTab === 'shipping' && (
        <ShippingManagement
          shiprocketData={shiprocketData}
          orders={adminData.orders}
          onShiprocketAuth={handleShiprocketAuth}
          onShiprocketLogout={shiprocketData.handleShiprocketLogout}
          onFetchShiprocketOrders={shiprocketData.fetchShiprocketOrders}
          onCreateShipment={shiprocketData.handleCreateShipment}
          onAddPickupLocation={shiprocketData.addPickupLocation}
          onShipmentCreated={handleShipmentCreated}
        />
      )}

      {activeTab === 'storefront' && (
        <StorefrontManagement />
      )}
    </div>
  );
};

export default AdminDashboardPage;



