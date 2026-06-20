import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';

const RefundModal = ({ isOpen, onClose, payment, onProcessRefund }) => {
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  React.useEffect(() => {
    if (payment && isOpen) {
      setRefundAmount(payment.amount.toString());
      setRefundReason('');
    }
  }, [payment, isOpen]);

  const handleSubmit = () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      alert('Please enter a valid refund amount');
      return;
    }

    if (parseFloat(refundAmount) > payment.amount) {
      alert('Refund amount cannot exceed payment amount');
      return;
    }

    onProcessRefund(parseFloat(refundAmount), refundReason);
  };

  const handleClose = () => {
    setRefundAmount('');
    setRefundReason('');
    onClose();
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in transition-all">
      <div className="bg-kora border border-indigo/20 rounded-none max-w-md w-full shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-indigo/10 pb-6">
            <h2 className="font-serif text-2xl text-indigo uppercase tracking-widest">Initiate Reversal</h2>
            <button onClick={handleClose} className="text-indigo/40 hover:text-terracotta transition-colors p-2 hover:bg-indigo/5 rounded-none">
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-8 p-6 bg-indigo/5 border-l-4 border-indigo rounded-none space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Audit Order</span>
              <span className="font-bold text-indigo text-xs tracking-wider">{payment.orderId?.substring(0, 15)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Original Settlement</span>
              <span className="font-black text-indigo">₹{payment.amount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">Reversal Quantities (₹)</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                max={payment.amount}
                step="0.01"
                className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo font-mono focus:outline-none focus:border-indigo transition-colors"
                placeholder="Enter amount..."
              />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">Justification / Reason</label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors resize-none font-medium"
                placeholder="Details of the reversal..."
              />
            </div>
          </div>
          
          <div className="mt-10 flex flex-col gap-3">
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-terracotta text-white rounded-none font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo transition-all flex items-center justify-center gap-2 shadow-lg shadow-maroon/10"
            >
              <RefreshCw size={14} />
              Confirm Reversal
            </button>
            <button
              onClick={handleClose}
              className="w-full py-4 border border-indigo/20 text-indigo rounded-none font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo/5 transition-all"
            >
              Abort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;

