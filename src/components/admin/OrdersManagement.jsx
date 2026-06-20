import React, { useState, useEffect } from 'react';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import OrderModal from './OrderModal';
import { getPaginatedOrders } from '../../firebase/services/orderService';

const OrdersManagement = ({ 
  searchTerm, 
  filterStatus, 
  setSearchTerm, 
  setFilterStatus, 
  onOrderStatusUpdate, 
  onViewOrder,
  updatingOrderId 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageHistory, setPageHistory] = useState({}); // Store firstDoc for each page (for backward navigation)
  const itemsPerPage = 10;

  // Fetch orders for a specific page
  const fetchOrders = async (page, startAfterDoc = null) => {
    setLoading(true);
    try {
      const filters = {
        searchTerm,
        statusFilter: filterStatus
      };
      
      const result = await getPaginatedOrders(itemsPerPage, startAfterDoc, filters);
      
      setOrders(result.orders);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
      
      // Store the firstDoc for this page (needed for backward navigation)
      // The first document in the result is the starting point for this page
      const firstDoc = result.orders.length > 0 ? result.orders[0] : null;
      setPageHistory(prev => ({
        ...prev,
        [page]: firstDoc
      }));
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch when filters change
  useEffect(() => {
    // Reset to page 1 when search term or filter changes
    setCurrentPage(1);
    setPageHistory({});
    fetchOrders(1, null);
  }, [searchTerm, filterStatus]);

  // Handle page change
  const handlePageChange = async (newPage) => {
    if (newPage === currentPage) return;
    
    setCurrentPage(newPage);
    
    if (newPage > currentPage) {
      // Going forward: use the current lastDoc
      fetchOrders(newPage, lastDoc);
    } else if (newPage < currentPage) {
      // Going backward: use the firstDoc from the target page in history
      // We stored the first document of each page in pageHistory
      const targetPageFirstDoc = pageHistory[newPage];
      if (targetPageFirstDoc) {
        fetchOrders(newPage, targetPageFirstDoc);
      } else {
        // If we don't have history for this page, reset to page 1
        // This is a fallback and shouldn't happen in normal use
        setCurrentPage(1);
        setPageHistory({});
        fetchOrders(1, null);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'processing':
        return <Clock size={16} className="text-yellow-500" />;
      case 'shipped':
        return <Truck size={16} className="text-[#4C0E0E]" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      case 'return_requested':
        return <Clock size={16} className="text-purple-500" />;
      case 'returned':
        return <ChevronLeft size={16} className="text-purple-700" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/10 text-green-700 border border-green-500/20';
      case 'processing':
        return 'bg-terracotta/10 text-terracotta border border-terracotta/20';
      case 'shipped':
        return 'bg-indigo/10 text-indigo border border-indigo/20';
      case 'cancelled':
        return 'bg-indigo text-kora';
      case 'return_requested':
        return 'bg-purple-500/10 text-purple-700 border border-purple-500/20';
      case 'returned':
        return 'bg-purple-700 text-white border border-purple-800';
      default:
        return 'bg-indigo/5 text-indigo/40 border border-indigo/10';
    }
  };

  const handleViewOrder = async (orderId) => {
    const orderDetails = await onViewOrder(orderId);
    setSelectedOrder(orderDetails);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      {/* Search and Filter */}
      <div className="bg-kora border border-indigo/10 rounded-none shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo/40" size={20} />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-kora-light border border-indigo/20 rounded-none text-indigo focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-kora-light border border-indigo/20 rounded-none text-indigo focus:outline-none focus:ring-1 focus:ring-terracotta"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="return_requested">Return Requested</option>
              <option value="returned">Returned</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-kora border border-indigo/10 rounded-none shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4C0E0E] mx-auto"></div>
            <p className="mt-4 text-indigo/60">Loading orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#4C0E0E] text-white">
                  <tr>
                    <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Order ID</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Date</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Customer</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Email</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Total</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Status</th>
                    <th className="text-right py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo/10">
                  {orders.map((order, index) => (
                    <tr key={`order-${order.id || 'no-id'}-${index}`} className="hover:bg-kora-light transition-colors">
                      <td className="py-4 px-6 font-bold text-indigo text-xs tracking-wider">{order.id?.substring(0, 12)}</td>
                      <td className="py-4 px-6 text-indigo text-sm">
                        {order.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-indigo text-sm font-medium">{order.customerName || order.shippingAddress?.name || 'N/A'}</td>
                      <td className="py-4 px-6 text-indigo/60 text-sm">{order.customerEmail || order.userId?.substring(0, 15) || 'N/A'}</td>
                      <td className="py-4 px-6 text-indigo font-bold">₹{order.total?.toFixed(2) || '0.00'}</td>
                      <td className="py-4 px-6">
                        {updatingOrderId === order.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-none h-4 w-4 border-b-2 border-indigo"></div>
                          </div>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => onOrderStatusUpdate(order.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-none text-[10px] uppercase font-bold tracking-wider ${getStatusBadgeClass(order.status)}`}
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="return_requested">Return Requested</option>
                            <option value="returned">Returned</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="inline-flex items-center gap-2 text-[10px] items-center bg-indigo text-white px-3 py-1.5 rounded-none uppercase font-bold tracking-widest hover:bg-terracotta transition-all"
                        >
                          <Eye size={14} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-kora-light px-6 py-4 flex items-center justify-between border-t border-indigo/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-none border border-indigo/20 bg-kora text-indigo text-[10px] uppercase font-bold tracking-widest hover:bg-indigo hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasMore}
                  className="flex items-center gap-2 px-4 py-2 rounded-none border border-indigo/20 bg-kora text-indigo text-[10px] uppercase font-bold tracking-widest hover:bg-indigo hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-indigo/40">
                  Page {currentPage}
                </span>
                
                <div className="flex items-center gap-1">
                  {(() => {
                    const maxPageToShow = hasMore ? currentPage + 1 : currentPage;
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(maxPageToShow, startPage + 4);
                    
                    if (endPage - startPage < 4 && startPage > 1) {
                      startPage = Math.max(1, endPage - 4);
                    }
                    
                    const pageNumbers = [];
                    for (let p = startPage; p <= endPage; p++) {
                      pageNumbers.push(p);
                    }
                    
                    return pageNumbers.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-none text-[10px] font-bold transition-all border ${
                          currentPage === pageNum
                            ? 'bg-indigo text-white border-indigo'
                            : 'bg-kora text-indigo/60 border-indigo/10 hover:border-indigo'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-indigo/20 mb-6" />
            <h3 className="text-xl font-serif text-indigo mb-2">No orders found</h3>
            <p className="text-indigo/60">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No orders available yet'}
            </p>
          </div>
        )}
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </>
  );
};

export default OrdersManagement;


