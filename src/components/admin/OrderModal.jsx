import React, { useState } from 'react';
import { XCircle, CheckCircle, Clock, Truck, Package, Printer, FileText, Eye } from 'lucide-react';
import InvoiceView from '../../../components/InvoiceView';

const OrderModal = ({ isOpen, onClose, order }) => {
  const [showInvoice, setShowInvoice] = useState(false);
  
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'processing':
        return <Clock size={16} className="text-yellow-500" />;
      case 'shipped':
        return <Truck size={16} className="text-indigo" />;
      case 'cancelled':
        return <Package size={16} className="text-red-500" />;
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
      default:
        return 'bg-indigo/5 text-indigo/40 border border-indigo/10';
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed.inset-0 > div:last-child,
          .fixed.inset-0 > div:last-child * {
            visibility: visible;
          }
          .fixed.inset-0 {
            position: absolute;
            left: 0;
            top: 0;
            background: white;
          }
          .fixed.inset-0 > div:last-child {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            max-width: 100%;
            max-height: none;
            overflow: visible;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in transition-all">
        <div className="bg-kora border border-indigo/20 rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-indigo/10 pb-6">
            <h2 className="font-serif text-3xl text-indigo uppercase tracking-widest">Order Details</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrint}
                className="text-indigo/60 hover:text-indigo transition-colors p-2 hover:bg-indigo/5 rounded-none"
                title="Print Order Details"
              >
                <Printer size={20} />
              </button>
              <button
                onClick={onClose}
                className="text-indigo/40 hover:text-terracotta transition-colors p-2 hover:bg-indigo/5 rounded-none"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>
          
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-kora-light p-6 border border-indigo/5 rounded-none">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Order ID</span>
                <span className="font-bold text-indigo text-xs tracking-wider">{order.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Date</span>
                <span className="text-indigo font-medium">
                  {order.createdAt?.toDate?.()?.toLocaleDateString('en-CA') ||
                   new Date(order.createdAt?.seconds * 1000).toLocaleDateString('en-CA') ||
                   'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Status</span>
                <span className={`px-3 py-1 rounded-none text-[10px] tracking-[0.2em] uppercase font-bold flex items-center gap-1 ${getStatusBadgeClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Customer</span>
                <span className="text-indigo font-bold">{order.customerName || order.shippingAddress?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Email</span>
                <span className="text-indigo text-sm">{order.customerEmail || 'N/A'}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Tracking</span>
                  <span className="text-indigo font-bold text-xs tracking-widest">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-8 p-6 bg-indigo/5 border-l-4 border-indigo rounded-none">
            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-indigo/40 mb-3">Shipping Address</h3>
            <p className="text-indigo text-sm leading-relaxed font-medium">
              {order.shippingAddress ? (
                typeof order.shippingAddress === 'object'
                  ? `${order.shippingAddress.fullName || order.customerName || order.shippingAddress.name}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode || order.shippingAddress.postcode}, ${order.shippingAddress.country || ''}${order.shippingAddress.phone ? ` (Phone: ${order.shippingAddress.phone})` : ''}`
                  : order.shippingAddress
              ) : 'No shipping address available'}
            </p>
          </div>

          {/* Invoice Button */}
          {order.invoiceGenerated && (
            <div className="mb-8 p-6 bg-terracotta/5 border border-terracotta/10 rounded-none flex items-center justify-between animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-4">
                <div className="bg-terracotta/10 p-3 rounded-none">
                  <FileText className="text-terracotta" size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo uppercase tracking-widest">Digital Invoice</p>
                  <p className="text-[10px] font-black tracking-[0.2em] text-terracotta mt-1">{order.invoiceNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setShowInvoice(true)}
                className="text-[10px] uppercase tracking-[0.3em] font-black bg-indigo text-white px-6 py-3 rounded-none hover:bg-terracotta transition-all flex items-center gap-2 shadow-lg shadow-indigo/10"
              >
                <Eye size={14} />
                Access Invoice
              </button>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-indigo/40 mb-4 pb-2 border-b border-indigo/5">Order Content</h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-6 p-4 bg-kora-light/50 border border-indigo/5 rounded-none hover:border-indigo/20 transition-all">
                  <div className="relative group">
                    <img
                      src={item.images && item.images[0] ? item.images[0] : item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-none border border-indigo/10 shadow-sm"
                    />
                    <div className="absolute top-1 right-1 bg-indigo text-white text-[10px] font-bold px-1.5 py-0.5 rounded-none shadow-sm">
                      x{item.quantity}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-indigo uppercase tracking-wide text-sm">{item.name}</h4>
                    <div className="flex gap-4 mt-2">
                      {(item.size || item.selectedSize) && (
                        <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Size: <span className="text-indigo">{typeof (item.size || item.selectedSize) === 'object' ? (item.size || item.selectedSize).size : (item.size || item.selectedSize)}</span></span>
                      )}
                      {(item.color || item.selectedColor) && (
                        <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40 flex items-center gap-1.5">
                          Color: 
                          <span className="w-2.5 h-2.5 rounded-none border border-indigo/20" style={{ backgroundColor: (item.color || item.selectedColor).toLowerCase() }}></span>
                          <span className="text-indigo">{item.color || item.selectedColor}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-indigo">₹{((item.discountedPrice || item.price) * item.quantity).toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-indigo/40 mt-1">₹{(item.discountedPrice || item.price).toFixed(2)} / UNIT</p>
                  </div>
                </div>
              )) || (
                <p className="text-indigo/60 italic text-center py-4">No content found</p>
              )}
            </div>
          </div>

          <div className="border-t-2 border-indigo pt-6 bg-indigo/5 -mx-8 -mb-8 p-8 rounded-b-sm">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-indigo/40 block mb-1">Total Transaction</span>
                <span className="text-3xl font-black text-indigo tracking-tight">₹{order.total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40 block mb-1">Calculated Status</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-none uppercase tracking-widest border border-green-100 italic">Verified Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {showInvoice && (
      <InvoiceView 
        order={order} 
        onClose={() => setShowInvoice(false)} 
      />
    )}
    </>
  );
};

export default OrderModal;

