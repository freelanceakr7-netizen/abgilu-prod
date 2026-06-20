import React, { useState, useEffect } from 'react';
import { Search, Eye, CreditCard, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import PaymentModal from './PaymentModal';
import RefundModal from './RefundModal';

const PaymentsManagement = ({ 
  payments, 
  searchTerm, 
  paymentFilterStatus, 
  setSearchTerm, 
  setPaymentFilterStatus, 
  onViewPayment,
  onPaymentStatusUpdate,
  onProcessRefund,
  updatingPaymentId 
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, paymentFilterStatus]);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchTerm === '' ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.paymentId && payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = paymentFilterStatus === 'all' || payment.status === paymentFilterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-700 border border-green-500/20';
      case 'pending':
        return 'bg-indigo/5 text-indigo/60 border border-indigo/10';
      case 'failed':
        return 'bg-terracotta/10 text-terracotta border border-terracotta/20';
      case 'refunded':
        return 'bg-indigo text-kora';
      default:
        return 'bg-indigo/5 text-indigo/40 border border-indigo/10';
    }
  };

  const handleViewPayment = async (paymentId) => {
    const paymentDetails = await onViewPayment(paymentId);
    setSelectedPayment(paymentDetails);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPayment(null);
  };

  const handleRefundClick = (payment) => {
    setSelectedPayment(payment);
    setIsRefundModalOpen(true);
  };

  const handleCloseRefundModal = () => {
    setIsRefundModalOpen(false);
    setSelectedPayment(null);
  };

  const handleProcessRefund = (refundAmount, refundReason) => {
    onProcessRefund(selectedPayment.id, refundAmount, refundReason);
    handleCloseRefundModal();
    handleClosePaymentModal();
  };

  return (
    <>
      <div className="bg-kora border border-indigo/10 rounded-none shadow-md overflow-hidden">
        <div className="p-6 border-b border-indigo/10 bg-kora-light">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-grow relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo/40" size={20} />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
              />
            </div>
            <select
              value={paymentFilterStatus}
              onChange={(e) => setPaymentFilterStatus(e.target.value)}
              className="w-full md:w-auto px-6 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#4C0E0E] text-white">
              <tr>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Transaction</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Order</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Date</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Customer</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Amount</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Method</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Status</th>
                <th className="text-right py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo/10">
              {paginatedPayments.map((payment, index) => (
                <tr key={`payment-${payment.id || 'no-id'}-${index}`} className="hover:bg-kora-light transition-colors group">
                  <td className="py-4 px-6 text-indigo">
                    <div className="flex items-center gap-3">
                      <CreditCard size={14} className="text-indigo/40" />
                      <span className="text-[10px] font-bold tracking-wider">{payment.paymentId?.substring(0, 15) || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-indigo font-bold text-xs uppercase tracking-tight">{payment.orderId?.substring(0, 12)}</td>
                  <td className="py-4 px-6 text-indigo/60 text-sm">
                    {payment.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-indigo font-bold text-sm tracking-tight">{payment.customerName}</p>
                      <p className="text-[10px] text-indigo/40 uppercase font-bold tracking-widest">{payment.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-indigo font-black">₹{payment.amount?.toFixed(2) || '0.00'}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-indigo/5 text-indigo/60 border border-indigo/10 rounded-none text-[10px] uppercase font-bold tracking-wider">
                      {payment.method}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {updatingPaymentId === payment.id ? (
                      <div className="animate-spin rounded-none h-4 w-4 border-b-2 border-indigo mx-auto"></div>
                    ) : (
                      <span className={`inline-flex px-3 py-1 rounded-none text-[10px] uppercase font-bold tracking-widest ${getStatusClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <button
                        onClick={() => handleViewPayment(payment.id)}
                        className="p-2 border border-indigo/20 text-indigo hover:bg-indigo hover:text-kora rounded-none transition-colors"
                        title="View Receipt"
                      >
                        <Eye size={16} />
                      </button>
                      {payment.status === 'paid' && (
                        <button
                          onClick={() => handleRefundClick(payment)}
                          className="p-2 border border-terracotta/20 text-terracotta hover:bg-terracotta hover:text-white rounded-none transition-colors"
                          title="Process Refund"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length > 0 && (
          <div className="bg-kora-light px-8 py-6 flex items-center justify-between border-t border-indigo/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-6 py-2.5 rounded-none border border-indigo/20 bg-kora text-indigo text-[10px] uppercase font-bold tracking-widest hover:bg-indigo hover:text-kora disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
                Prev
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-6 py-2.5 rounded-none border border-indigo/20 bg-kora text-indigo text-[10px] uppercase font-bold tracking-widest hover:bg-indigo hover:text-kora disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">
                  Page {currentPage} of {totalPages}
                </span>
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo/20">
                  {filteredPayments.length} Transactions
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {(() => {
                  let startPage = Math.max(1, currentPage - 2);
                  let endPage = Math.min(totalPages, startPage + 4);
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
                      className={`w-10 h-10 rounded-none text-[10px] font-bold transition-all border ${
                        currentPage === pageNum
                          ? 'bg-indigo text-kora border-indigo shadow-lg'
                          : 'bg-kora text-indigo/40 border-indigo/10 hover:border-indigo'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        payment={selectedPayment}
        onRefundClick={handleRefundClick}
      />

      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={handleCloseRefundModal}
        payment={selectedPayment}
        onProcessRefund={handleProcessRefund}
      />
    </>
  );
};

export default PaymentsManagement;

