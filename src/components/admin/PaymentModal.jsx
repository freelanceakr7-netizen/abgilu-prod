import React from 'react';
import { X, RefreshCw } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, payment, onRefundClick }) => {
  if (!isOpen || !payment) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-700 border border-green-500/20';
      case 'pending':
        return 'bg-terracotta/10 text-terracotta border border-terracotta/20';
      case 'failed':
        return 'bg-indigo text-kora';
      case 'refunded':
        return 'bg-indigo/20 text-indigo border border-indigo/30';
      default:
        return 'bg-indigo/5 text-indigo/40 border border-indigo/10';
    }
  };

  const handleRefundClick = () => {
    onRefundClick(payment);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in transition-all">
      <div className="bg-kora border border-indigo/20 rounded-none max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-indigo/10 pb-6">
            <h2 className="font-serif text-3xl text-indigo uppercase tracking-widest">Transaction Details</h2>
            <button onClick={onClose} className="text-indigo/40 hover:text-terracotta transition-colors p-2 hover:bg-indigo/5 rounded-none">
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-kora-light p-6 border border-indigo/5 rounded-none">
              <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-indigo/40 mb-4 pb-2 border-b border-indigo/5">Financial Insight</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Transaction ID</span>
                  <span className="font-mono text-[11px] font-bold text-indigo">{payment.paymentId || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Reference Order</span>
                  <span className="font-bold text-indigo text-xs tracking-wider">{payment.orderId?.substring(0, 12)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Creation Epoch</span>
                  <span className="text-indigo font-medium">
                    {payment.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Settlement Date</span>
                  <span className="text-indigo font-medium">
                    {payment.paidAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Payment Gateway</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo bg-indigo/5 px-2 py-0.5 rounded-none">{payment.method}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-indigo/5 mt-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-indigo/40">Gross Amount</span>
                  <span className="text-xl font-black text-indigo">₹{payment.amount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Verification Status</span>
                  <span className={`px-3 py-1 rounded-none text-[10px] uppercase font-bold tracking-widest ${getStatusClass(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                {payment.refundId && (
                  <div className="flex justify-between items-center pt-2 border-t border-indigo/5 mt-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta/60">Refund Audit ID</span>
                    <span className="font-mono text-[10px] font-bold text-terracotta">{payment.refundId}</span>
                  </div>
                )}
                {payment.refundAmount && (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta/60">Reversed Funds</span>
                    <span className="text-indigo font-bold">₹{payment.refundAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-indigo/5 p-6 border-l-4 border-indigo rounded-none">
              <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-indigo/40 mb-4 pb-2 border-b border-indigo/5">Customer Dossier</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Identity</span>
                  <span className="text-indigo font-black text-sm">{payment.customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Contact Channel</span>
                  <span className="text-indigo text-xs font-medium">{payment.customerEmail}</span>
                </div>
              </div>
            </div>
          </div>
          
          {payment.items && payment.items.length > 0 && (
            <div className="mb-10">
              <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-indigo/40 mb-4 pb-2 border-b border-indigo/5">Manifest Content</h3>
              <div className="overflow-x-auto rounded-none border border-indigo/10">
                <table className="w-full">
                  <thead className="bg-[#4C0E0E] text-white">
                    <tr>
                      <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Asset</th>
                      <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Specs</th>
                      <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Qty</th>
                      <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Unit Val</th>
                      <th className="text-right py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Total Val</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo/10">
                    {payment.items.map((item, index) => (
                      <tr key={index} className="hover:bg-kora-light transition-colors">
                        <td className="py-4 px-6 text-indigo font-bold text-xs uppercase tracking-tight">{item.name}</td>
                        <td className="py-4 px-6">
                           <div className="flex flex-col gap-1">
                             <span className="text-[9px] uppercase font-bold tracking-tight text-indigo/40">Size: <span className="text-indigo">{item.size || item.selectedSize || 'N/A'}</span></span>
                             <span className="text-[9px] uppercase font-bold tracking-tight text-indigo/40">Tone: <span className="text-indigo">{item.color || item.selectedColor || 'N/A'}</span></span>
                           </div>
                        </td>
                        <td className="py-4 px-6 text-indigo text-xs font-bold">{item.quantity}</td>
                        <td className="py-4 px-6 text-indigo/60 text-xs">₹{item.price?.toFixed(2) || '0.00'}</td>
                        <td className="py-4 px-6 text-right text-indigo font-bold">₹{(item.price * item.quantity)?.toFixed(2) || '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-6 border-t border-indigo/10">
            {payment.status === 'paid' && (
              <button
                onClick={handleRefundClick}
                className="px-8 py-3 bg-terracotta text-white rounded-none font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo transition-all flex items-center gap-2 shadow-lg shadow-maroon/10"
              >
                <RefreshCw size={14} />
                Initiate Reversal
              </button>
            )}
            <button
              onClick={onClose}
              className="px-8 py-3 border border-indigo/20 text-indigo rounded-none font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo/5 transition-all"
            >
              Close Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

