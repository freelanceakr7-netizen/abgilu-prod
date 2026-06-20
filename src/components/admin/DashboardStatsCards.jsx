import React from 'react';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  UserCheck,
  Tag,
  Folder
} from 'lucide-react';

const DashboardStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
      {[
        { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-indigo' },
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-indigo' },
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-indigo' },
        { label: 'Pending Orders', value: stats.pendingOrders, icon: Users, color: 'text-indigo' },
        { label: 'Total Users', value: stats.totalUsers, icon: UserCheck, color: 'text-indigo' },
        { label: 'Total Coupons', value: stats.totalCoupons, icon: Tag, color: 'text-indigo' },
        { label: 'Categories', value: stats.totalCategories, icon: Folder, color: 'text-indigo', subText: `${stats.activeCategories} active` }
      ].map((card, idx) => (
        <div key={idx} className="bg-kora-light rounded-none shadow-sm p-4 border border-indigo/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <p className="text-indigo/50 text-[10px] uppercase font-bold tracking-widest">{card.label}</p>
            <card.icon className={card.color} size={18} />
          </div>
          <div>
            <p className="text-xl font-black text-indigo">{card.value}</p>
            {card.subText && (
              <p className="text-[10px] text-indigo/40 mt-1 uppercase font-bold tracking-wider">{card.subText}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatsCards;

