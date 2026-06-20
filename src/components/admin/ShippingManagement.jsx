import React, { useState } from 'react';
import { Truck, X, Plus, Shield, MapPin, Package, Edit } from 'lucide-react';
import CreateShipmentModal from './CreateShipmentModal';
import AddPickupLocationModal from './AddPickupLocationModal';
import EditAddressModal from './EditAddressModal';

const ShippingManagement = ({ 
  shiprocketData,
  orders,
  onShiprocketAuth,
  onShiprocketLogout,
  onFetchShiprocketOrders,
  onCreateShipment,
  onAddPickupLocation
}) => {
  const [isCreateShipmentModalOpen, setIsCreateShipmentModalOpen] = useState(false);
  const [isAddPickupLocationModalOpen, setIsAddPickupLocationModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [selectedEcommerceOrder, setSelectedEcommerceOrder] = useState(null);
  const [editedAddress, setEditedAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const {
    shiprocketAuthenticated,
    shiprocketOrders,
    isAuthenticating,
    pickupLocations
  } = shiprocketData;

  const getStatusClass = (status) => {
    return status === 'delivered' ? 'bg-green-500/10 text-green-700 border border-green-500/20' :
           status === 'shipped' ? 'bg-[#4C0E0E]/10 text-blue-700 border border-blue-500/20' :
           status === 'processing' ? 'bg-yellow-500/10 text-yellow-700 border border-yellow-500/20' :
           'bg-indigo/10 text-indigo/60 border border-indigo/20';
  };

  const handleCreateShipment = () => {
    setIsCreateShipmentModalOpen(true);
  };

  const handleCloseCreateShipmentModal = () => {
    setIsCreateShipmentModalOpen(false);
    setSelectedEcommerceOrder(null);
  };

  const handleAddPickupLocation = () => {
    setIsAddPickupLocationModalOpen(true);
  };

  const handleCloseAddPickupLocationModal = () => {
    setIsAddPickupLocationModalOpen(false);
  };

  const handleEditAddress = (order) => {
    setSelectedEcommerceOrder(order);
    setEditedAddress({
      name: order.customerName || order.shippingAddress?.fullName || order.shippingAddress?.name || '',
      address: order.shippingAddress?.address || '',
      city: order.shippingAddress?.city || '',
      state: order.shippingAddress?.state || '',
      pincode: order.shippingAddress?.pincode || '',
      phone: order.shippingAddress?.phone || ''
    });
    setIsEditAddressModalOpen(true);
  };

  const handleCloseEditAddressModal = () => {
    setIsEditAddressModalOpen(false);
    setEditedAddress({
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: ''
    });
  };

  const handleSaveEditedAddress = (address) => {
    setSelectedEcommerceOrder({
      ...selectedEcommerceOrder,
      shippingAddress: {
        ...selectedEcommerceOrder.shippingAddress,
        ...address
      },
      customerName: address.name
    });
    setIsEditAddressModalOpen(false);
  };

  const handleShipmentCreated = (shipmentData) => {
    handleCloseCreateShipmentModal();
  };

  if (!shiprocketAuthenticated) {
    return (
      <div className="bg-kora border border-indigo/10 rounded-none shadow-md overflow-hidden">
        <div className="p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-indigo/5 rounded-none flex items-center justify-center mx-auto mb-6">
                <Truck className="text-indigo" size={40} />
              </div>
              <h2 className="text-2xl font-black text-indigo mb-3 tracking-tight">Shiprocket Connect</h2>
              <p className="text-indigo/60 text-sm font-medium">
                Please authenticate with your Shiprocket account to access shipping and logistics controls.
              </p>
            </div>
            
            <ShiprocketAuthForm onAuth={onShiprocketAuth} isAuthenticating={isAuthenticating} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-kora border border-indigo/10 rounded-none shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h2 className="text-2xl font-black text-indigo tracking-tight">Shipping Center</h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-indigo/40 mt-1">Manage logistics and fulfillments</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={handleCreateShipment}
                className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-8 py-3 bg-[#4C0E0E] text-white rounded-none hover:bg-terracotta transition-all text-[10px] uppercase font-bold tracking-[0.2em] shadow-lg shadow-maroon/10"
              >
                <Plus size={20} />
                Create Shipment
              </button>
              <button
                onClick={onShiprocketLogout}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-terracotta/20 text-terracotta hover:bg-terracotta hover:text-white rounded-none transition-all text-[10px] uppercase font-bold tracking-widest"
              >
                <X size={18} />
                Disconnect
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-kora-light border border-indigo/5 rounded-none p-8">
              <h3 className="text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-6 flex items-center gap-3">
                <div className="w-1 h-3 bg-indigo/20 rounded-none" />
                Live Shiprocket Orders
              </h3>
              <div className="space-y-4">
                {shiprocketOrders.length > 0 ? (
                  shiprocketOrders.slice(0, 5).map((order, index) => (
                    <div key={`shiprocket-order-${order.id || 'no-id'}-${index}`} className="flex justify-between items-center p-4 bg-kora border border-indigo/10 rounded-none hover:border-indigo/30 transition-colors">
                      <div>
                        <p className="font-bold text-indigo text-sm tracking-tight">#{order.id}</p>
                        <p className="text-[10px] uppercase font-bold text-indigo/40 mt-0.5">{order.customer_name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-none text-[10px] uppercase font-bold tracking-widest ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Package size={40} className="mx-auto text-indigo/10 mb-4" />
                    <p className="text-indigo/40 text-xs font-bold uppercase tracking-widest">No active orders</p>
                  </div>
                )}
              </div>
              <button
                onClick={onFetchShiprocketOrders}
                className="mt-8 w-full px-6 py-3 border border-indigo/20 text-indigo hover:bg-indigo hover:text-kora rounded-none transition-all text-[10px] uppercase font-bold tracking-widest"
              >
                Refresh Log
              </button>
            </div>
            
            <div className="bg-kora-light border border-indigo/5 rounded-none p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] uppercase font-black tracking-widest text-indigo/40 flex items-center gap-3">
                  <div className="w-1 h-3 bg-indigo/20 rounded-none" />
                  Pickup Locations
                </h3>
                <button
                  onClick={handleAddPickupLocation}
                  className="px-4 py-1.5 border border-indigo/20 text-indigo hover:bg-indigo hover:text-kora rounded-none text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-2"
                >
                  <Plus size={14} />
                  Add New
                </button>
              </div>
              <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                {pickupLocations.length > 0 ? (
                  pickupLocations.map((location, index) => (
                    <div key={`pickup-location-${location.pickup_code || 'no-code'}-${index}`} className="p-4 bg-kora border border-indigo/10 rounded-none hover:border-indigo/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-indigo/40 mt-0.5" />
                        <div>
                          <p className="font-bold text-indigo text-sm tracking-tight">{location.pickup_code}</p>
                          <p className="text-[10px] font-bold text-indigo/60 leading-relaxed mt-1">{location.address}</p>
                          <p className="text-[10px] uppercase font-black text-indigo/30 mt-1 tracking-widest">{location.city}, {location.state}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <MapPin size={40} className="mx-auto text-indigo/10 mb-4" />
                    <p className="text-indigo/40 text-xs font-bold uppercase tracking-widest">Setup pickup points</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateShipmentModal
        isOpen={isCreateShipmentModalOpen}
        onClose={handleCloseCreateShipmentModal}
        orders={orders}
        pickupLocations={pickupLocations}
        onCreateShipment={onCreateShipment}
        onEditAddress={handleEditAddress}
        onShipmentCreated={handleShipmentCreated}
        calculateShippingRates={shiprocketData.calculateShippingRates}
      />

      <AddPickupLocationModal
        isOpen={isAddPickupLocationModalOpen}
        onClose={handleCloseAddPickupLocationModal}
        onAddPickupLocation={onAddPickupLocation}
      />

      <EditAddressModal
        isOpen={isEditAddressModalOpen}
        onClose={handleCloseEditAddressModal}
        address={editedAddress}
        onSaveAddress={handleSaveEditedAddress}
      />
    </>
  );
};

const ShiprocketAuthForm = ({ onAuth, isAuthenticating }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(credentials.email, credentials.password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-black tracking-widest text-indigo/40 ml-1">Account Email</label>
        <div className="relative">
          <input
            type="email"
            required
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            className="w-full px-4 py-4 bg-kora-light border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
            placeholder="name@company.com"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-black tracking-widest text-indigo/40 ml-1">API Password</label>
        <div className="relative">
          <input
            type="password"
            required
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            className="w-full px-4 py-4 bg-kora-light border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
            placeholder="••••••••••••"
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isAuthenticating}
        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#4C0E0E] text-white rounded-none hover:bg-terracotta transition-all text-[10px] uppercase font-bold tracking-[0.2em] shadow-lg shadow-maroon/10 disabled:opacity-50"
      >
        {isAuthenticating ? (
          <div className="animate-spin rounded-none h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <Shield size={18} />
            Secure Authenticate
          </>
        )}
      </button>
    </form>
  );
};

export default ShippingManagement;

