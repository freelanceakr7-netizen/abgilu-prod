import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Tag, Percent, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import CouponModal from './CouponModal';

const CouponsManagement = ({
  coupons,
  searchTerm,
  couponFilterStatus,
  setSearchTerm,
  setCouponFilterStatus,
  onEditCoupon,
  onDeleteCoupon,
  onToggleCouponStatus,
  updatingCouponId,
  deletingCouponId,
  onAddCoupon,
  isSubmitting,
  editingCoupon
}) => {
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = searchTerm === '' ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = couponFilterStatus === 'all' ||
      (couponFilterStatus === 'active' && coupon.isActive) ||
      (couponFilterStatus === 'inactive' && !coupon.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleAddCoupon = () => {
    onEditCoupon({});
  };

  const handleCloseModal = () => {
    onEditCoupon(null);
  };

  return (
    <>
      <div className="bg-kora border border-indigo/10 rounded-none shadow-md overflow-hidden">
        <div className="p-6 border-b border-indigo/10 bg-kora-light">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-grow items-center gap-4 w-full md:w-auto">
              <div className="relative flex-grow max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo/40" size={20} />
                <input
                  type="text"
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
                />
              </div>
              <select
                value={couponFilterStatus}
                onChange={(e) => setCouponFilterStatus(e.target.value)}
                className="px-6 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            <button
              onClick={handleAddCoupon}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#4C0E0E] text-white rounded-none hover:bg-terracotta transition-all text-[10px] uppercase font-bold tracking-[0.2em] shadow-lg shadow-maroon/10"
            >
              <Plus size={20} />
              Add Coupon
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#4C0E0E] text-white">
              <tr>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Code</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Description</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Discount</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Min. Spend</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Usage</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Expiry</th>
                <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Status</th>
                <th className="text-right py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo/10">
              {filteredCoupons.map((coupon, index) => (
                <tr key={`coupon-${coupon.id || 'no-id'}-${index}`} className="hover:bg-kora-light transition-colors group">
                  <td className="py-4 px-6 text-indigo">
                    <div className="flex items-center gap-3">
                      <Tag size={14} className="text-indigo/40" />
                      <span className="font-mono font-bold text-sm tracking-widest bg-indigo/5 px-2 py-0.5 border border-indigo/10 rounded-none">{coupon.code}</span>
                      {coupon.firstTimeOnly && (
                        <span className="text-[9px] bg-indigo text-white px-2 py-0.5 rounded-none uppercase font-bold tracking-widest">
                          First Order
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-indigo/60 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{coupon.description || '-'}</td>
                  <td className="py-4 px-6">
                    <span className="text-indigo font-black">
                      {coupon.discountType === 'percentage' ? (
                        <span className="flex items-center gap-1">
                          {coupon.discountValue}%
                          <Percent size={12} className="text-indigo/40" />
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          ₹{coupon.discountValue}
                          {/* <DollarSign size={12} className="text-indigo/40" /> */}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-indigo/60 font-bold tabular-nums text-sm">
                    {coupon.minimumAmount ? `₹${coupon.minimumAmount}` : '-'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs font-bold text-indigo tracking-tight">
                      <span>{coupon.usedCount || 0}</span>
                      {coupon.usageLimit && (
                        <span className="text-indigo/20"> / {coupon.usageLimit}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {coupon.expiryDate ? (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/60">
                        {new Date(coupon.expiryDate.toDate ? coupon.expiryDate.toDate() : coupon.expiryDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-indigo/20 text-[10px] uppercase font-bold tracking-widest">Lifetime</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {updatingCouponId === coupon.id ? (
                      <div className="animate-spin rounded-none h-4 w-4 border-b-2 border-indigo"></div>
                    ) : (
                      <button
                        onClick={() => onToggleCouponStatus(coupon.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-none text-[10px] uppercase font-bold tracking-widest transition-all ${
                          coupon.isActive
                            ? 'bg-green-500/10 text-green-700 border border-green-500/20'
                            : 'bg-terracotta/10 text-terracotta border border-terracotta/20'
                        }`}
                      >
                        {coupon.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <button
                        onClick={() => onEditCoupon(coupon)}
                        className="p-2 border border-indigo/20 text-indigo hover:bg-indigo hover:text-kora rounded-none transition-colors"
                        title="Edit Coupon"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteCoupon(coupon.id)}
                        disabled={deletingCouponId === coupon.id}
                        className="p-2 border border-terracotta/20 text-terracotta hover:bg-terracotta hover:text-white rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Coupon"
                      >
                        {deletingCouponId === coupon.id ? (
                          <div className="animate-spin rounded-none h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CouponModal
        isOpen={editingCoupon !== null}
        onClose={handleCloseModal}
        onSubmit={onAddCoupon}
        editingCoupon={editingCoupon}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default CouponsManagement;

