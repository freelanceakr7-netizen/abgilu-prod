import React from 'react';
import { X, Printer, Download } from 'lucide-react';

export const InvoiceView = ({ order, onClose }) => {
  if (!order) return null;

  const {
    id,
    invoiceNumber,
    invoiceDate,
    createdAt,
    items,
    shippingAddress,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    status
  } = order;

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-printable-area').innerHTML;
    
    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    // Grab all current stylesheets (Tailwind + custom)
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(node => node.outerHTML)
      .join('');

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <title>Invoice - ${actualInvoiceNumber}</title>
          ${styles}
          <style>
            @page { 
              size: A4 portrait; 
              margin: 0; 
            }
            body { 
              margin: 0; 
              padding: 0;
              background: white; 
              -webkit-print-color-adjust: exact; 
              color-adjust: exact;
            }
            .print-container {
              padding: 15mm !important;
              width: 210mm !important;
              height: 297mm !important;
              max-height: 297mm !important;
              box-sizing: border-box;
              overflow: hidden !important;
            }
            /* Ensure everything scales to fit if necessary */
            body {
              width: 210mm;
              height: 297mm;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for resources to load in iframe before printing
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      // Cleanup after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };

  const actualInvoiceNumber = invoiceNumber || `INV-${id.substring(0, 8).toUpperCase()}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-8 animate-in fade-in transition-all duration-300">
      <div className="bg-white w-full max-w-[210mm] mx-auto h-full max-h-[90vh] rounded-none overflow-hidden flex flex-col shadow-2xl">
        {/* Toolbar */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0 gap-4 no-print">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <h2 className="text-sm sm:text-lg font-bold uppercase shrink-0">Invoice Preview</h2>
            <span className="text-[10px] sm:text-xs opacity-60 truncate">Order: {id}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={handlePrint}
              className="p-2 hover:bg-white/10 rounded-none transition-colors flex items-center gap-2 text-sm"
              title="Print Invoice"
            >
              <Printer size={18} />
              <span className="hidden sm:inline">Print / Download PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-none transition-colors"
              title="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div id="invoice-printable-area">
            <div className="max-w-[210mm] mx-auto h-[297mm] max-h-[297mm] overflow-hidden bg-white p-[15mm] sm:p-[20mm] flex flex-col font-sans text-black relative box-border print-container">
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div className="mt-4">
                <h1 className="text-[42px] font-bold tracking-tight uppercase mb-4 text-[#0f172a] leading-none">INVOICE</h1>
                <p className="text-sm text-gray-800 mb-1">Invoice Number: {actualInvoiceNumber}</p>
                <p className="text-sm text-gray-800">Invoice Date: {formatDate(invoiceDate || createdAt)}</p>
              </div>
              <div className="relative w-40 h-12 overflow-hidden select-none mt-2">
                <img 
                  src="/header-logo.jpg" 
                  alt="ANGILU Logo" 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] max-w-none" 
                />
              </div>
            </div>

            {/* Addresses */}
            <div className="flex justify-between items-start mb-12 text-sm text-gray-800">
              <div className="max-w-[45%]">
                <h3 className="font-bold text-sm mb-2 uppercase text-black">ANGILU</h3>
                <p className="text-sm">Sri Bhavani Enterprises</p>
                <p className="text-sm">Shamshabad, Hyderabad.</p>
                <p className="text-sm">501218, India</p>
                <p className="text-sm mt-1">+91 99664 86864</p>
                <p className="text-sm">Support@angilu.com</p>
              </div>
              <div className="max-w-[45%]">
                <h3 className="font-bold text-sm mb-2 uppercase text-black">BILL TO</h3>
                <p className="text-sm">{shippingAddress?.fullName}</p>
                <p className="text-sm">{shippingAddress?.address}</p>
                <p className="text-sm">{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.pincode}</p>
                <p className="text-sm mt-1">{shippingAddress?.phone}</p>
                {shippingAddress?.email && <p className="text-sm">{shippingAddress?.email}</p>}
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm mb-12 border-collapse border border-black">
              <thead>
                <tr className="border-b border-black">
                  <th className="py-3 px-4 text-left font-bold text-black border-r border-black w-[50%]">Item & Description</th>
                  <th className="py-3 px-4 text-center font-bold text-black border-r border-black w-[20%]">Unit Price</th>
                  <th className="py-3 px-4 text-center font-bold text-black border-r border-black w-[10%]">Qty</th>
                  <th className="py-3 px-4 text-center font-bold text-black w-[20%]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, index) => (
                  <tr key={index} className="border-b border-black">
                    <td className="py-4 px-4 border-r border-black">
                      <p className="text-black">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Size: {typeof item.selectedSize === 'object' ? item.selectedSize.size : item.selectedSize} | Color: {item.selectedColor}</p>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-800 border-r border-black">₹{item.price.toLocaleString()}</td>
                    <td className="py-4 px-4 text-center text-gray-800 border-r border-black">{item.quantity}</td>
                    <td className="py-4 px-4 text-center text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Middle Section: Notes & Summary */}
            <div className="flex justify-between items-start mb-12">
              <div className="w-[45%] pr-4">
                <h4 className="font-bold text-sm mb-3 uppercase text-black">NOTES / TERMS:</h4>
                <p className="text-sm text-gray-800 leading-relaxed">
                  Payment is due upon receipt of this invoice. Goods once sold cannot be returned unless a manufacturing defect is found. Notify us within 24 hours of delivery in case of defects.
                </p>
              </div>
              <div className="w-[45%]">
                <table className="w-full text-sm border-collapse border border-black">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="py-3 px-4 border-r border-black text-black w-1/2">Sub-Total</td>
                      <td className="py-3 px-4 text-right text-black w-1/2">₹{subtotal?.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="py-3 px-4 border-r border-black text-black">Shipping</td>
                      <td className="py-3 px-4 text-right text-black">
                        {shipping === 0 ? 'FREE' : `₹${shipping?.toLocaleString()}`}
                      </td>
                    </tr>
                    {discount > 0 && (
                      <tr className="border-b border-black">
                        <td className="py-3 px-4 border-r border-black text-red-600">Discount</td>
                        <td className="py-3 px-4 text-right text-red-600">-₹{discount?.toLocaleString()}</td>
                      </tr>
                    )}
                    <tr className="border-b border-black">
                      <td className="py-3 px-4 border-r border-black text-black">Tax</td>
                      <td className="py-3 px-4 text-right text-black">₹{tax?.toLocaleString() || '0.00'}</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="py-4 px-4 border-r border-black text-base text-black">Total</td>
                      <td className="py-4 px-4 text-right text-base text-black">₹{total?.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom spacer to push footer to bottom */}
            <div className="flex-grow"></div>

            {/* Footer Information */}
            <div className="flex justify-between items-start text-sm text-gray-800 pb-12">
              <div>
                <h4 className="font-bold uppercase mb-2 text-black">PAYMENT METHOD</h4>
                <p>Bank: Borcelle Bank</p>
                <p>Account Name: ANGILU</p>
                <p>Account Number: 1234567890</p>
              </div>
              <div className="text-left">
                <h4 className="font-bold uppercase mb-2 text-black">PREPARED BY</h4>
                <p>ANGILU Sales Team</p>
                <p>Order ID: {id}</p>
              </div>
            </div>

            {/* Decorative Bottom Bar */}
            <div className="absolute bottom-0 left-0 w-full flex flex-col">
              <div className="w-full h-[4px] bg-[#81b214]"></div>
              <div className="w-full h-[16px] bg-[#4c0e0e]"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
export default InvoiceView;
