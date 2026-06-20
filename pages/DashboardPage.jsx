import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, MapPin, Heart, LogOut, Settings, Eye, XCircle, Package, Truck, CheckCircle, Clock, FileText } from 'lucide-react';
import { useAdmin } from '../src/contexts/AdminContext';
import { getOrdersByUserId, cancelOrder } from '../src/firebase/services/orderService';
import { getUserAddresses } from '../src/firebase/services/addressService';
import { useStore } from '../src/contexts/StoreContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../src/firebase/config';
import InvoiceView from '../components/InvoiceView';

const DashboardPage = ({ navigateTo }) => {
  const { user, userData } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { getWishlistItemCount } = useStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    savedAddresses: 0
  });

  useEffect(() => {
    // Real-time stats listener
    let unsubscribeAddresses = () => {};
    let unsubscribeOrders = () => {};

    if (user) {
      // Listen for addresses
      const addressRef = doc(db, 'addresses', user.uid);
      unsubscribeAddresses = onSnapshot(addressRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStats(prev => ({ ...prev, savedAddresses: data.addresses?.length || 0 }));
        } else {
          setStats(prev => ({ ...prev, savedAddresses: 0 }));
        }
      });

      // Fetch initial orders (we'll keep orders as a one-time fetch for now, or add listener if needed)
      const fetchOrders = async () => {
        try {
          console.log('Fetching orders for user:', user.uid);
          const ordersData = await getOrdersByUserId(user.uid);
          console.log('Orders fetched:', ordersData.length, ordersData);
          const formattedOrders = ordersData.map(order => ({
            ...order,
            date: order.createdAt?.toDate?.()?.toLocaleDateString('en-IN') ||
                  (order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN') : null) ||
                  order.date || 'N/A'
          }));
          setOrders(formattedOrders);
          setStats(prev => ({ ...prev, totalOrders: ordersData.length }));
          setOrdersError(null);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setOrdersError(error.message || 'Failed to load orders');
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrders();
    } else {
      setLoading(false);
    }

    return () => {
      unsubscribeAddresses();
      unsubscribeOrders();
    };
  }, [user]);

  // Get recent orders from the fetched orders
  const recentOrders = orders.slice(0, 3).map(order => ({
    id: order.id,
    date: order.date, // Using the already formatted date
    status: order.status,
    total: order.total || 0,
    items: order.items?.length || 0,
    fullOrder: order // Store the full order object for the modal
  }));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'processing':
        return <Clock size={16} className="text-yellow-500" />;
      case 'shipped':
        return <Truck size={16} className="text-indigo" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'shipped':
        return 'bg-indigo/10 text-indigo dark:bg-indigo/30 dark:text-indigo/80';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      setActionLoading(true);
      try {
        await cancelOrder(orderId, 'Cancelled by user');
        alert('Order cancelled successfully!');
        // Update local state
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: 'cancelled' }));
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Error: ' + error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    const [showInvoice, setShowInvoice] = useState(false);
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-indigo/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
        <div className="bg-kora-light rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gold/30 shadow-2xl text-indigo">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-indigo">Order Details</h2>
              <button
                onClick={onClose}
                className="text-indigo/50 hover:text-indigo transition-all"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-indigo/60">Order ID:</span>
                <span className="font-semibold text-indigo">{order.id}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-indigo/60">Order Date:</span>
                <span className="text-indigo">{order.date}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-indigo/60">Status:</span>
                <span className={`px-2 py-1 rounded-none text-[10px] tracking-[0.2em] uppercase flex items-center gap-1 ${getStatusBadgeClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-indigo/60">Tracking Number:</span>
                  <span className="text-indigo">{order.trackingNumber}</span>
                </div>
              )}
            </div>

            {/* Invoice Button for Customer */}
            {order.invoiceGenerated && (
              <div className="mb-6 p-4 bg-indigo/5 border border-indigo/20 rounded-none flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo" size={24} />
                  <div>
                    <p className="text-sm font-bold text-indigo">Invoice Available</p>
                    <p className="text-[10px] uppercase tracking-wider text-indigo/60">{order.invoiceNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInvoice(true)}
                  className="text-xs uppercase tracking-[0.2em] font-bold bg-indigo text-white px-4 py-2 rounded-none hover:bg-indigo/90 transition-all flex items-center gap-2"
                >
                  <Eye size={14} />
                  View Invoice
                </button>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-serif font-semibold mb-3 text-indigo">Items</h3>
              <div className="space-y-3">
                {order.items && order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 pb-3 border-b border-indigo/10">
                    <img
                      src={item.images && item.images[0] ? item.images[0] : item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-none"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-indigo">{item.name}</h4>
                      <p className="text-sm text-indigo/60">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-indigo">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-indigo/60">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.shippingAddress && (
              <div className="mb-6">
                <h3 className="text-lg font-serif font-semibold mb-3 text-indigo">Shipping Address</h3>
                <p className="text-indigo/80">
                  {typeof order.shippingAddress === 'object'
                    ? `${order.shippingAddress.fullName}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}, ${order.shippingAddress.country}`
                    : order.shippingAddress
                  }
                </p>
              </div>
            )}

            {order.paymentMethod && (
              <div className="mb-6">
                <h3 className="text-lg font-serif font-semibold mb-3 text-indigo">Payment Method</h3>
                <p className="text-indigo/80">{order.paymentMethod}</p>
              </div>
            )}

            <div className="border-t border-indigo/20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-indigo">Total:</span>
                <span className="text-lg font-bold text-indigo">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        {showInvoice && (
          <InvoiceView 
            order={order} 
            onClose={() => setShowInvoice(false)} 
          />
        )}
      </div>
    );
  };

  const menuItems = [
    { icon: <User size={20} />, label: 'Account Details', page: 'account-details' },
    { icon: <ShoppingBag size={20} />, label: 'Orders', page: 'orders' },
    { icon: <MapPin size={20} />, label: 'Addresses', page: 'addresses' },
    { icon: <Heart size={20} />, label: 'Wishlist', page: 'wishlist' },
    
    { icon: <LogOut size={20} />, label: 'Logout', page: 'logout' }
  ];

  if (loading) {
    return (
      <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-indigo"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4 text-indigo">Please Login</h1>
          <p className="text-indigo/60 mb-4">You need to be logged in to view your dashboard.</p>
          <button
            onClick={() => navigateTo('login')}
            className="text-xs uppercase tracking-[0.3em] font-semibold bg-indigo text-kora px-6 py-2 rounded-none hover:bg-indigo/90 transition-all"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4">
          <div className="bg-kora-light rounded-none shadow-sm p-8 border border-gold/20">
            <div className="flex flex-col items-center mb-6">
              <img
                src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100.jpg`}
                alt={userData?.displayName || user.email}
                className="w-20 h-20 rounded-none mb-3"
              />
              <h2 className="text-xl font-serif font-semibold text-indigo">{userData?.displayName ? (userData.displayName.charAt(0).toUpperCase() + userData.displayName.slice(1)) : 'User'}</h2>
              <p className="text-indigo/60 text-sm">{userData?.displayName ? user.email : ''}</p>
              <p className="text-indigo/40 text-[8px] mt-1 uppercase tracking-[0.2em]">Member since {userData?.memberSince || 'N/A'}</p>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigateTo(item.page)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-none text-indigo hover:bg-kora hover:text-indigo transition-all"
                >
                  {item.icon}
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <h1 className="text-3xl font-serif font-bold mb-12 text-indigo">
            Welcome back, {userData?.displayName ? (userData.displayName.charAt(0).toUpperCase() + userData.displayName.slice(1)) : 'User'}
          </h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-kora-light rounded-none shadow-sm p-8 border border-gold/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-indigo/60">Total Orders</p>
                  <p className="text-2xl font-bold text-indigo">{stats.totalOrders}</p>
                </div>
                <ShoppingBag className="text-indigo" size={24} />
              </div>
            </div>
            
            <div className="bg-kora-light rounded-none shadow-sm p-8 border border-gold/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-indigo/60">Wishlist Items</p>
                  <p className="text-2xl font-bold text-indigo">{getWishlistItemCount()}</p>
                </div>
                <Heart className="text-indigo/80 fill-indigo/10" size={24} />
              </div>
            </div>
            
            <div className="bg-kora-light rounded-none shadow-sm p-8 border border-gold/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-indigo/60">Saved Addresses</p>
                  <p className="text-2xl font-bold text-indigo">{stats.savedAddresses}</p>
                </div>
                <MapPin className="text-indigo/80" size={24} />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-kora-light rounded-none shadow-sm p-8 border border-gold/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-semibold text-indigo">Recent Orders</h2>
              <button
                onClick={() => navigateTo('orders')}
                className="text-[10px] uppercase tracking-[0.3em] font-bold text-indigo hover:text-indigo/70 transition-all"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-indigo/10">
                    <th className="text-left py-3 px-2 text-indigo/60">Order ID</th>
                    <th className="text-left py-3 px-2 text-indigo/60">Date</th>
                    <th className="text-left py-3 px-2 text-indigo/60">Items</th>
                    <th className="text-left py-3 px-2 text-indigo/60">Total</th>
                    <th className="text-left py-3 px-2 text-indigo/60">Status</th>
                    <th className="text-left py-3 px-2 text-indigo/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersError ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-red-500 text-sm">
                        Error loading orders: {ordersError}
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-10 text-center">
                        <ShoppingBag size={32} className="mx-auto text-indigo/20 mb-3" />
                        <p className="text-[11px] uppercase tracking-[0.3em] text-indigo/40">No orders yet</p>
                        <p className="text-xs text-indigo/30 mt-1">Your orders will appear here once you make a purchase.</p>
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-indigo/5 hover:bg-kora transition-all">
                        <td className="py-3 px-2 text-indigo text-xs font-mono">{order.id?.slice(0, 10)}...</td>
                        <td className="py-3 px-2 text-indigo text-xs">{order.date}</td>
                        <td className="py-3 px-2 text-indigo text-xs">{order.items}</td>
                        <td className="py-3 px-2 text-indigo font-bold text-xs">₹{Number(order.total || 0).toFixed(2)}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-none text-[10px] tracking-[0.2em] uppercase flex items-center gap-1 w-fit ${getStatusBadgeClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-2 flex items-center gap-3">
                          <button
                            onClick={() => setSelectedOrder(order.fullOrder)}
                            className="flex items-center gap-1 text-indigo hover:text-terracotta transition-all"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          {(order.status === 'processing' || order.status === 'pending') && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={actionLoading}
                              className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <XCircle size={14} />
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default DashboardPage;



