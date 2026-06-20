import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config';

const ADDRESSES_COLLECTION = 'addresses';

// Get user's addresses
export const getUserAddresses = async (userId) => {
  try {
    const addressesRef = doc(db, ADDRESSES_COLLECTION, userId);
    const addressesDoc = await getDoc(addressesRef);
    
    if (addressesDoc.exists()) {
      return addressesDoc.data().addresses || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    throw error;
  }
};

// Save user's addresses
export const saveUserAddresses = async (userId, addresses) => {
  try {
    const addressesRef = doc(db, ADDRESSES_COLLECTION, userId);
    await setDoc(addressesRef, {
      userId,
      addresses,
      updatedAt: new Date()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving user addresses:', error);
    throw error;
  }
};

// Add new address
export const addUserAddress = async (userId, address) => {
  try {
    const addressesRef = doc(db, ADDRESSES_COLLECTION, userId);
    const addressesDoc = await getDoc(addressesRef);
    
    let addresses = [];
    if (addressesDoc.exists()) {
      addresses = addressesDoc.data().addresses || [];
    }
    
    // If new address is default, remove default from other addresses
    if (address.isDefault) {
      addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
    }
    
    // Add new address with ID
    const newAddress = {
      ...address,
      id: Date.now().toString()
    };
    
    addresses.push(newAddress);
    
    await setDoc(addressesRef, {
      userId,
      addresses,
      updatedAt: new Date()
    }, { merge: true });
    
    return newAddress;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

// Update existing address
export const updateUserAddress = async (userId, addressId, updatedAddress) => {
  try {
    const addressesRef = doc(db, ADDRESSES_COLLECTION, userId);
    const addressesDoc = await getDoc(addressesRef);
    
    if (!addressesDoc.exists()) {
      throw new Error('Addresses not found');
    }
    
    let addresses = addressesDoc.data().addresses || [];
    
    // If updated address is default, remove default from other addresses
    if (updatedAddress.isDefault) {
      addresses = addresses.map(addr => 
        addr.id === addressId 
          ? { ...updatedAddress, id: addressId }
          : { ...addr, isDefault: false }
      );
    } else {
      addresses = addresses.map(addr => 
        addr.id === addressId 
          ? { ...updatedAddress, id: addressId }
          : addr
      );
    }
    
    await updateDoc(addressesRef, {
      addresses,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Delete address
export const deleteUserAddress = async (userId, addressId) => {
  try {
    const addressesRef = doc(db, ADDRESSES_COLLECTION, userId);
    const addressesDoc = await getDoc(addressesRef);
    
    if (!addressesDoc.exists()) {
      throw new Error('Addresses not found');
    }
    
    const addresses = addressesDoc.data().addresses || [];
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    
    await updateDoc(addressesRef, {
      addresses: updatedAddresses,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// Set default address
export const setDefaultAddress = async (userId, addressId) => {
  try {
    const addressesRef = doc(db, ADDRESSES_COLLECTION, userId);
    const addressesDoc = await getDoc(addressesRef);
    
    if (!addressesDoc.exists()) {
      throw new Error('Addresses not found');
    }
    
    const addresses = addressesDoc.data().addresses || [];
    const updatedAddresses = addresses.map(addr => 
      addr.id === addressId 
        ? { ...addr, isDefault: true }
        : { ...addr, isDefault: false }
    );
    
    await updateDoc(addressesRef, {
      addresses: updatedAddresses,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};