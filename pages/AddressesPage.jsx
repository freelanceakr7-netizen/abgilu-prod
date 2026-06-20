import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, MapPin, Check, X, Home, Briefcase, Star, ArrowLeft } from 'lucide-react';
import { useAdmin } from '../src/contexts/AdminContext';
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress
} from '../src/firebase/services/addressService';

const AddressesPage = ({ navigateTo }) => {
  const { user } = useAdmin();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postcode: '',
    country: 'United States',
    phone: '',
    email: '',
    type: 'home',
    isDefault: false
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      if (user) {
        try {
          const userAddresses = await getUserAddresses(user.uid);
          setAddresses(userAddresses);
        } catch (error) {
          console.error('Error fetching addresses:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const resetForm = () => {
    setFormData({
      name: user?.displayName || '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: user?.phoneNumber || '',
      email: user?.email || '',
      type: 'home',
      isDefault: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    try {
      if (editingAddress) {
        // Update existing address
        await updateUserAddress(user.uid, editingAddress.id, formData);
        setAddresses(prev => prev.map(addr => 
          addr.id === editingAddress.id 
            ? { ...formData, id: editingAddress.id }
            : formData.isDefault && addr.id !== editingAddress.id 
              ? { ...addr, isDefault: false } // Remove default from other addresses
              : addr
        ));
        setEditingAddress(null);
      } else {
        // Add new address
        const newAddress = await addUserAddress(user.uid, formData);
        
        // If new address is default, remove default from other addresses
        if (formData.isDefault) {
          setAddresses(prev => [
            ...prev.map(addr => ({ ...addr, isDefault: false })),
            newAddress
          ]);
        } else {
          setAddresses(prev => [...prev, newAddress]);
        }
      }
      
      resetForm();
      setIsAddingAddress(false);
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingAddress(address);
    setIsAddingAddress(true);
  };

  const handleDelete = async (id) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteUserAddress(user.uid, id);
        setAddresses(prev => prev.filter(addr => addr.id !== id));
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address. Please try again.');
      }
    }
  };

  const handleSetDefault = async (id) => {
    if (!user) return;
    
    try {
      await setDefaultAddress(user.uid, id);
      setAddresses(prev => prev.map(addr => 
        addr.id === id 
          ? { ...addr, isDefault: true }
          : { ...addr, isDefault: false }
      ));
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address. Please try again.');
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home':
        return <Home size={18} className="text-indigo" />;
      case 'work':
        return <Briefcase size={18} className="text-gray-500" />;
      case 'other':
        return <Star size={18} className="text-gold" />;
      default:
        return <MapPin size={18} className="text-gray-500" />;
    }
  };



  if (loading) {
    return (
      <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-indigo"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-serif mb-4 text-indigo">Please Login</h1>
          <p className="text-indigo/60 mb-4">You need to be logged in to manage your addresses.</p>
          <button
            onClick={() => navigateTo('login')}
            className="px-6 py-2 bg-indigo text-kora rounded-none hover:bg-indigo/90 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-2 text-indigo hover:text-terracotta transition-colors group"
          >
            <div className="p-1.5 rounded-none border border-indigo/10 group-hover:border-terracotta/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Back to Dashboard</span>
          </button>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-indigo mb-2">My Addresses</h1>
        <p className="text-indigo/60">Manage your shipping and billing addresses</p>
      </div>

      {/* Add Address Button */}
      {!isAddingAddress && (
        <button
          onClick={() => setIsAddingAddress(true)}
          className="mb-6 px-8 py-3 bg-indigo text-kora rounded-none hover:bg-indigo/90 transition-all duration-500 flex items-center gap-3 uppercase text-[11px] font-bold tracking-[0.3em] shadow-lg shadow-indigo/10"
        >
          <Plus size={18} />
          Add New Address
        </button>
      )}

      {/* Address Form */}
      {isAddingAddress && (
        <div className="bg-kora-light rounded-none shadow-sm p-8 mb-6 border border-gold/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif font-semibold text-indigo">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              onClick={() => {
                setIsAddingAddress(false);
                setEditingAddress(null);
                resetForm();
              }}
              className="text-indigo/45 hover:text-terracotta transition-all"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium uppercase tracking-[0.2em] mb-1 text-indigo/80">Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium uppercase tracking-[0.2em] mb-1 text-indigo/80">Company</label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium uppercase tracking-[0.2em] mb-1 text-indigo/80">Address *</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                />
              </div>
              
              <div>
                <label htmlFor="apartment" className="block text-sm font-medium uppercase tracking-[0.2em] mb-1 text-indigo/80">Apartment, suite, etc.</label>
                <input
                  id="apartment"
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium uppercase tracking-[0.2em] mb-1 text-indigo/80">City *</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium uppercase tracking-[0.2em] mb-1 text-indigo/80">State/Province *</label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                />
              </div>
              
              <div>
                <label htmlFor="zip" className="block text-sm font-medium uppercase tracking-[0.2em] mb-1 text-indigo/80">ZIP/Postal Code *</label>
                <input
                  id="zip"
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium uppercase tracking-[0.2em] mb-1 text-indigo/80">Country *</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium uppercase tracking-[0.2em] mb-1 text-indigo/80">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium uppercase tracking-[0.2em] mb-1 text-indigo/80">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium uppercase tracking-[0.2em] mb-1 text-indigo/80">Address Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="isDefault" className="flex items-center cursor-pointer">
                  <input
                    id="isDefault"
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="mr-2 accent-indigo"
                  />
                  <span className="text-sm text-indigo/80 font-medium">Set as default address</span>
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-indigo text-kora rounded-none hover:bg-indigo/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-[10px] font-bold tracking-[0.2em]"
              >
                {submitting ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingAddress(false);
                  setEditingAddress(null);
                  resetForm();
                }}
                disabled={submitting}
                className="px-6 py-2 border border-indigo/25 text-indigo rounded-none hover:bg-indigo/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-[10px] font-bold tracking-[0.2em]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-kora-light rounded-none shadow-md p-6 relative border border-gold/20">
              {address.isDefault && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-xs px-2 py-1 rounded-none flex items-center gap-1">
                  <Check size={12} />
                  Default
                </div>
              )}
              
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-kora rounded-none">
                  {getAddressIcon(address.type)}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-indigo font-serif">{address.name}</h3>
                  {address.company && <p className="text-indigo/60">{address.company}</p>}
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-indigo/70 mb-4 font-semibold">
                <p>{address.address}</p>
                {address.apartment && <p>{address.apartment}</p>}
                <p>{address.city}, {address.state} {address.zip}</p>
                <p>{address.country}</p>
                <p>{address.phone}</p>
                <p>{address.email}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider border border-indigo/20 rounded-none hover:bg-indigo/5 transition-colors text-indigo"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider border border-red-300 text-red-600 rounded-none hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex items-center gap-1 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] border border-indigo/20 text-indigo rounded-none hover:bg-indigo/5 transition-all duration-300"
                  >
                    <Check size={14} />
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-kora-light rounded-none shadow-md p-8 text-center border border-gold/20">
          <MapPin size={48} className="mx-auto text-indigo/30 mb-4" />
          <h3 className="text-lg font-medium font-serif text-indigo mb-2">No addresses saved</h3>
          <p className="text-indigo/60 mb-4">
            Add your first address to make checkout faster
          </p>
          <button
            onClick={() => setIsAddingAddress(true)}
            className="px-6 py-2 border border-indigo/25 text-indigo rounded-none hover:bg-indigo/5 transition-all duration-300 uppercase text-[10px] font-bold tracking-[0.2em] flex items-center gap-2 mx-auto"
          >
            <Plus size={18} />
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;



