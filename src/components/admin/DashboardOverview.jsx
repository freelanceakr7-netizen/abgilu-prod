import React from 'react';

const DashboardOverview = ({ orders, products, payments, coupons }) => {
  const getStatusClass = (status, type) => {
    const statusClasses = {
      order: {
        delivered: 'bg-green-100/50 text-green-800',
        processing: 'bg-yellow-100/50 text-yellow-800',
        shipped: 'bg-indigo/10 text-indigo',
        cancelled: 'bg-red-100/50 text-red-800'
      },
      payment: {
        paid: 'bg-green-100/50 text-green-800',
        pending: 'bg-yellow-100/50 text-yellow-800',
        failed: 'bg-red-100/50 text-red-800',
        refunded: 'bg-indigo/10 text-indigo'
      },
      coupon: {
        active: 'bg-green-100/50 text-green-800',
        inactive: 'bg-red-100/50 text-red-800'
      }
    };
    
    return statusClasses[type]?.[status] || 'bg-indigo/5 text-indigo/60';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="bg-kora border border-indigo/10 rounded-none shadow-sm p-6">
        <h2 className="text-xl font-serif text-indigo mb-4 uppercase tracking-widest">Recent Orders</h2>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order, index) => (
            <div key={`order-${order.id || 'no-id'}-${index}`} className="flex justify-between items-center p-3 bg-kora-light border border-indigo/5 rounded-none">
              <div>
                <p className="font-bold text-indigo text-xs tracking-wider">{order.id?.substring(0, 8)}</p>
                <p className="text-sm text-indigo/60">₹{order.total?.toFixed(2) || '0.00'}</p>
              </div>
              <span className={`px-2 py-1 rounded-none text-[10px] uppercase font-bold tracking-wider ${getStatusClass(order.status, 'order')}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-kora border border-indigo/10 rounded-none shadow-sm p-6">
        <h2 className="text-xl font-serif text-indigo mb-4 uppercase tracking-widest">Recent Products</h2>
        <div className="space-y-3">
          {products.slice(0, 5).map((product, index) => (
            <div key={`product-${product.id || 'no-id'}-${index}`} className="flex justify-between items-center p-3 bg-kora-light border border-indigo/5 rounded-none">
              <div>
                <p className="font-bold text-indigo text-sm">{product.name}</p>
                <p className="text-sm text-indigo/60">₹{product.price}</p>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo/40">{product.category}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-kora border border-indigo/10 rounded-none shadow-sm p-6">
        <h2 className="text-xl font-serif text-indigo mb-4 uppercase tracking-widest">Recent Payments</h2>
        <div className="space-y-3">
          {payments.slice(0, 5).map((payment, index) => (
            <div key={`payment-${payment.id || 'no-id'}-${index}`} className="flex justify-between items-center p-3 bg-kora-light border border-indigo/5 rounded-none">
              <div>
                <p className="font-bold text-indigo text-xs tracking-wider">{payment.orderId?.substring(0, 8)}</p>
                <p className="text-sm text-indigo/60">₹{payment.amount?.toFixed(2) || '0.00'}</p>
              </div>
              <span className={`px-2 py-1 rounded-none text-[10px] uppercase font-bold tracking-wider ${getStatusClass(payment.status, 'payment')}`}>
                {payment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-kora border border-indigo/10 rounded-none shadow-sm p-6">
        <h2 className="text-xl font-serif text-indigo mb-4 uppercase tracking-widest">Recent Coupons</h2>
        <div className="space-y-3">
          {coupons.slice(0, 5).map((coupon, index) => (
            <div key={`coupon-${coupon.id || 'no-id'}-${index}`} className="flex justify-between items-center p-3 bg-kora-light border border-indigo/5 rounded-none">
              <div>
                <p className="font-bold text-indigo text-sm">{coupon.code}</p>
                <p className="text-sm text-indigo/60">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-none text-[10px] uppercase font-bold tracking-wider ${getStatusClass(coupon.isActive ? 'active' : 'inactive', 'coupon')}`}>
                {coupon.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

