import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'products', label: 'Products' },
    { id: 'categories', label: 'Categories' },
    { id: 'orders', label: 'Orders' },
    { id: 'payments', label: 'Payments' },
    { id: 'users', label: 'Users' },
    { id: 'coupons', label: 'Coupons' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'storefront', label: '🏠 Store' },
  ];

  return (
    <div className="bg-kora-light rounded-none shadow-sm mb-6 border border-indigo/10">
      <div className="border-b border-indigo/10 overflow-x-auto">
        <nav className="flex space-x-8 px-6 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-bold text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'border-indigo text-indigo'
                  : 'border-transparent text-indigo/40 hover:text-indigo'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;

