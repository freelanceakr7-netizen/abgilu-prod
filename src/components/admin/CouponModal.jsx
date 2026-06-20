import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const initialCouponState = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  minimumAmount: '',
  maxDiscount: '',
  usageLimit: '',
  expiryDate: '',
  emailSpecific: false,
  email: '',
  firstTimeOnly: false
};

const CouponModal = ({ isOpen, onClose, onSubmit, editingCoupon, isSubmitting }) => {
  const [couponFormData, setCouponFormData] = useState(initialCouponState);

  React.useEffect(() => {
    if (editingCoupon && editingCoupon.id) {
      // Editing existing coupon
      setCouponFormData({
        code: editingCoupon.code,
        description: editingCoupon.description || '',
        discountType: editingCoupon.discountType || 'percentage',
        discountValue: editingCoupon.discountValue?.toString() || '',
        minimumAmount: editingCoupon.minimumAmount?.toString() || '',
        maxDiscount: editingCoupon.maxDiscount?.toString() || '',
        usageLimit: editingCoupon.usageLimit?.toString() || '',
        expiryDate: editingCoupon.expiryDate ? new Date(editingCoupon.expiryDate.toDate ? editingCoupon.expiryDate.toDate() : editingCoupon.expiryDate).toISOString().split('T')[0] : '',
        emailSpecific: editingCoupon.emailSpecific || false,
        email: editingCoupon.email || '',
        firstTimeOnly: editingCoupon.firstTimeOnly || false
      });
    } else {
      // Adding new coupon
      setCouponFormData(initialCouponState);
    }
  }, [editingCoupon, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataToSubmit = {
      ...couponFormData,
      discountValue: parseFloat(couponFormData.discountValue),
      minimumAmount: couponFormData.minimumAmount ? parseFloat(couponFormData.minimumAmount) : null,
      maxDiscount: couponFormData.maxDiscount ? parseFloat(couponFormData.maxDiscount) : null,
      usageLimit: couponFormData.usageLimit ? parseInt(couponFormData.usageLimit) : null,
      expiryDate: couponFormData.expiryDate ? new Date(couponFormData.expiryDate) : null
    };
    
    onSubmit(formDataToSubmit, editingCoupon?.id);
  };

  const handleClose = () => {
    setCouponFormData(initialCouponState);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in transition-all">
      <div className="bg-kora border border-indigo/20 rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-indigo/10 pb-6">
            <h2 className="font-serif text-3xl text-indigo uppercase tracking-widest">
              {editingCoupon && editingCoupon.id ? 'Edit Incentive' : 'New Incentive'}
            </h2>
            <button onClick={handleClose} className="text-indigo/40 hover:text-terracotta transition-colors p-2 hover:bg-indigo/5 rounded-none">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">Incentive Code</label>
                <input
                  type="text"
                  required
                  value={couponFormData.code}
                  onChange={(e) => setCouponFormData({...couponFormData, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo font-mono focus:outline-none focus:border-indigo transition-colors"
                  placeholder="SAVE10"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">Narrative / Description</label>
                <input
                  type="text"
                  value={couponFormData.description}
                  onChange={(e) => setCouponFormData({...couponFormData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
                  placeholder="10% off on all items"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">Discount Logic</label>
                <select
                  value={couponFormData.discountType}
                  onChange={(e) => setCouponFormData({...couponFormData, discountType: e.target.value})}
                  className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo appearance-none transition-colors"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Val (₹)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">
                  Incentive Value ({couponFormData.discountType === 'percentage' ? '%' : '₹'})
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step={couponFormData.discountType === 'percentage' ? '0.01' : '1'}
                  value={couponFormData.discountValue}
                  onChange={(e) => setCouponFormData({...couponFormData, discountValue: e.target.value})}
                  className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo font-bold focus:outline-none focus:border-indigo transition-colors"
                  placeholder={couponFormData.discountType === 'percentage' ? '10' : '100'}
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">Minimum Threshold (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={couponFormData.minimumAmount}
                  onChange={(e) => setCouponFormData({...couponFormData, minimumAmount: e.target.value.replace(/[^0-9.]/g, '')})}
                  className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
                  placeholder="500"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">Ceiling Discount (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={couponFormData.maxDiscount}
                  onChange={(e) => setCouponFormData({...couponFormData, maxDiscount: e.target.value.replace(/[^0-9.]/g, '')})}
                  className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
                  placeholder="1000"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">Usage Quota</label>
                <input
                  type="number"
                  min="1"
                  value={couponFormData.usageLimit}
                  onChange={(e) => setCouponFormData({...couponFormData, usageLimit: e.target.value})}
                  className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">Expiration Chronology</label>
                <input
                  type="date"
                  value={couponFormData.expiryDate}
                  onChange={(e) => setCouponFormData({...couponFormData, expiryDate: e.target.value})}
                  className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-indigo/10 flex flex-col md:flex-row gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={couponFormData.emailSpecific}
                    onChange={(e) => setCouponFormData({...couponFormData, emailSpecific: e.target.checked})}
                    className="sr-only"
                  />
                  <div className={`w-10 h-5 rounded-none transition-colors ${couponFormData.emailSpecific ? 'bg-indigo' : 'bg-indigo/20'}`}></div>
                  <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-kora rounded-none transition-transform ${couponFormData.emailSpecific ? 'translate-x-5' : ''}`}></div>
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo/60">Restrict to Selective Identity</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={couponFormData.firstTimeOnly}
                    onChange={(e) => setCouponFormData({...couponFormData, firstTimeOnly: e.target.checked})}
                    className="sr-only"
                  />
                  <div className={`w-10 h-5 rounded-none transition-colors ${couponFormData.firstTimeOnly ? 'bg-indigo' : 'bg-indigo/20'}`}></div>
                  <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-kora rounded-none transition-transform ${couponFormData.firstTimeOnly ? 'translate-x-5' : ''}`}></div>
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo/60">First-Time Customers Only</span>
              </label>
            </div>
            
            {couponFormData.emailSpecific && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">Identity Access (Email)</label>
                <input
                  type="email"
                  required={couponFormData.emailSpecific}
                  value={couponFormData.email}
                  onChange={(e) => setCouponFormData({...couponFormData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
                  placeholder="user@example.com"
                />
              </div>
            )}
            
            <div className="mt-10 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-indigo text-kora rounded-none font-black text-[10px] uppercase tracking-[0.2em] hover:bg-terracotta transition-all flex items-center justify-center gap-3 shadow-lg shadow-maroon/10"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-none h-4 w-4 border-b-2 border-white"></div>
                    Executing...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingCoupon && editingCoupon.id ? 'Synchronize Record' : 'Establish Record'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-4 border border-indigo/20 text-indigo rounded-none font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo/5 transition-all"
              >
                Abort
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;

