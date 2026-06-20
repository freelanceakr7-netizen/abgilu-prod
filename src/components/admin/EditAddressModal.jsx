import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const EditAddressModal = ({ isOpen, onClose, address, onSaveAddress }) => {
  const [editedAddress, setEditedAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  React.useEffect(() => {
    if (address && isOpen) {
      setEditedAddress({
        name: address.name || '',
        address: address.address || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        phone: address.phone || ''
      });
    }
  }, [address, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveAddress(editedAddress);
    handleClose();
  };

  const handleClose = () => {
    setEditedAddress({
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 dark:border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-white">Edit Shipping Address</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editedAddress.name}
                  onChange={(e) => setEditedAddress({...editedAddress, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 dark:text-white">Address</label>
                <input
                  type="text"
                  required
                  value={editedAddress.address}
                  onChange={(e) => setEditedAddress({...editedAddress, address: e.target.value})}
                  className="w-full px-3 py-2 border rounded-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main Street"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">City</label>
                <input
                  type="text"
                  required
                  value={editedAddress.city}
                  onChange={(e) => setEditedAddress({...editedAddress, city: e.target.value})}
                  className="w-full px-3 py-2 border rounded-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mumbai"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">State</label>
                <input
                  type="text"
                  required
                  value={editedAddress.state}
                  onChange={(e) => setEditedAddress({...editedAddress, state: e.target.value})}
                  className="w-full px-3 py-2 border rounded-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Maharashtra"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">PIN Code</label>
                <input
                  type="text"
                  required
                  value={editedAddress.pincode}
                  onChange={(e) => setEditedAddress({...editedAddress, pincode: e.target.value})}
                  className="w-full px-3 py-2 border rounded-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="400001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Phone</label>
                <input
                  type="tel"
                  required
                  value={editedAddress.phone}
                  onChange={(e) => setEditedAddress({...editedAddress, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-none hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#4C0E0E] text-white rounded-none hover:bg-[#6B0F10] transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAddressModal;

