import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft, FileText } from 'lucide-react';
import { useAdmin } from '../src/contexts/AdminContext';
import { useRealtimeOrders } from '../src/hooks/useRealtimeOrders';
import InvoiceView from '../components/InvoiceView';
import { cancelOrder, updateOrderStatus } from '../src/firebase/services/orderService';

const OrdersPage = ({ navigateTo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useAdmin();
  
  // Use real-time orders hook
  const { orders, loading, getOrdersByStatus } = useRealtimeOrders({ 
    userId: user?.uid,
    orderByField: 'createdAt',
    orderDirection: 'desc'
  });

  // Format orders data to ensure proper date formatting
  const formattedOrders = orders.map(order => ({
    ...order,
    date: order.createdAt?.toDate?.()?.toLocaleDateString('en-CA') ||
          new Date(order.createdAt?.seconds * 1000).toLocaleDateString('en-CA') ||
          order.date || 'N/A'
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
      case 'return_requested':
        return <Clock size={16} className="text-purple-500" />;
      case 'returned':
        return <ArrowLeft size={16} className="text-purple-700" />;
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
      case 'return_requested':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'returned':
        return 'bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const filteredOrders = formattedOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.items && order.items.some(item => item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const [tableActionLoading, setTableActionLoading] = useState(false);
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      setTableActionLoading(true);
      try {
        await cancelOrder(orderId, 'Cancelled by user');
        alert('Order cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Error: ' + error.message);
      } finally {
        setTableActionLoading(false);
      }
    }
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    const [showInvoice, setShowInvoice] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    if (!order) return null;

    const handleCancel = async () => {
      if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
        setActionLoading(true);
        try {
          await cancelOrder(order.id, 'Cancelled by user');
          alert('Order cancelled successfully!');
          onClose();
        } catch (error) {
          console.error('Error cancelling order:', error);
          alert('Error: ' + error.message);
        } finally {
          setActionLoading(false);
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4 pt-[70px]">
        <div className="bg-kora border border-indigo/10 rounded-none max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-indigo">Order Details</h2>
              <button
                onClick={onClose}
                className="text-indigo/40 hover:text-terracotta transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            {/* Order Info */}
            <div className="bg-kora-light border border-indigo/10 rounded-none p-4 mb-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-indigo/60 uppercase tracking-wider">Order ID</span>
                <span className="font-semibold text-indigo text-sm">{order.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-indigo/60 uppercase tracking-wider">Order Date</span>
                <span className="text-indigo text-sm">{order.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-indigo/60 uppercase tracking-wider">Status</span>
                <span className={`px-3 py-1 rounded-none text-[10px] tracking-[0.2em] uppercase flex items-center gap-1 ${getStatusBadgeClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-indigo/60 uppercase tracking-wider">Tracking No.</span>
                  <span className="text-indigo text-sm">{order.trackingNumber}</span>
                </div>
              )}
            </div>

            {/* Invoice Button for Customer in OrdersPage */}
            {order.invoiceGenerated && (
              <div className="mb-6 p-4 bg-indigo/5 border border-indigo/20 rounded-none flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo" size={24} />
                  <div>
                    <p className="text-sm font-bold text-indigo">Official Invoice</p>
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

            {/* Items */}
            <div className="mb-4">
              <h3 className="font-serif text-lg text-indigo mb-4 pb-2 border-b border-indigo/10">Items</h3>
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-2 bg-kora-light border border-indigo/5 rounded-none">
                    <img
                      src={item.images && item.images[0] ? item.images[0] : item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-none flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-indigo mb-1">{item.name}</h4>
                      <p className="text-sm text-indigo/60">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-indigo">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-indigo/50 mt-1">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-4">
              <h3 className="font-serif text-lg text-indigo mb-4 pb-2 border-b border-indigo/10">Shipping Address</h3>
              <p className="text-indigo/80 text-sm leading-relaxed">
                {typeof order.shippingAddress === 'object'
                  ? `${order.shippingAddress.fullName}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}, ${order.shippingAddress.country}`
                  : order.shippingAddress
                }
              </p>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <h3 className="font-serif text-lg text-indigo mb-4 pb-2 border-b border-indigo/10">Payment Method</h3>
              <p className="text-indigo/80 text-sm">{order.paymentMethod}</p>
            </div>

            {/* Total */}
            <div className="bg-indigo/5 border border-indigo/10 rounded-none p-5 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-indigo">Total</span>
                <span className="text-xl font-bold text-terracotta">₹{order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions for User (Cancel / Return) */}
            <div className="mt-6 space-y-3">
              {order.status === 'processing' && (
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="w-full py-3 bg-[#4C0E0E] text-white hover:bg-terracotta transition-all text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 rounded-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {actionLoading ? 'Processing...' : 'Cancel Order'}
                </button>
              )}

              {order.status === 'delivered' && (
                <div className="w-full py-3 bg-indigo/5 border border-indigo/10 text-center text-[10px] uppercase tracking-widest font-black text-indigo/40 rounded-none">
                  Completed & Delivered
                </div>
              )}
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

  if (loading) {
    return (
      <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-indigo"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-2 text-indigo hover:underline font-bold text-xs uppercase tracking-wider"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
        </div>
        <h1 className="text-3xl font-bold font-serif mb-2 text-indigo">My Orders</h1>
        <p className="text-indigo/60">Track and manage your orders</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-kora-light rounded-none shadow-sm p-8 mb-6 border border-gold/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-indigo/20 rounded-none bg-kora text-indigo focus:outline-none focus:border-terracotta transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-indigo/20 rounded-none bg-kora text-indigo focus:outline-none focus:border-terracotta transition-all"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-kora-light rounded-none shadow-md overflow-hidden border border-gold/20">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-kora border-b border-gold/20">
                <tr>
                  <th className="text-left py-3 px-4 text-indigo/60">Order ID</th>
                  <th className="text-left py-3 px-4 text-indigo/60">Date</th>
                  <th className="text-left py-3 px-4 text-indigo/60">Items</th>
                  <th className="text-left py-3 px-4 text-indigo/60">Total</th>
                  <th className="text-left py-3 px-4 text-indigo/60">Status</th>
                  <th className="text-left py-3 px-4 text-indigo/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-indigo/10 hover:bg-kora transition-colors">
                    <td className="py-3 px-4 text-indigo font-bold">{order.id}</td>
                    <td className="py-3 px-4 text-indigo/80">{order.date}</td>
                    <td className="py-3 px-4 text-indigo/80">{order.items.length} items</td>
                    <td className="py-3 px-4 text-indigo font-black">₹{order.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-none text-xs flex items-center gap-1 w-fit ${getStatusBadgeClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 text-indigo hover:text-terracotta transition-colors font-bold text-xs uppercase tracking-wider"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      {(order.status === 'processing' || order.status === 'pending') && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={tableActionLoading}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors font-bold text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Package size={48} className="mx-auto text-indigo/30 mb-4" />
            <h3 className="text-xl font-serif text-indigo mb-2">No orders found</h3>
            <p className="text-indigo/60">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'You haven\'t placed any orders yet'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button 
                onClick={() => navigateTo('shop')}
                className="mt-4 px-6 py-2 bg-indigo text-kora rounded-none hover:bg-terracotta transition-colors text-xs uppercase tracking-widest font-bold"
              >
                Start Shopping
              </button>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
};

export default OrdersPage;





