import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, checkIsAdmin } from '../firebase/services/authService';
import { isAdminEmail } from '../utils/adminUtils';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async ({ user: authUser, userData: authUserData }) => {
      console.log('Auth state changed:', { user: authUser?.email, userData: authUserData });
      setUser(authUser);
      setUserData(authUserData);
      
      if (authUser) {
        try {
          // Special case for admin emails - always grant admin access
          const adminEmails = ['admin@angilu.com', 'saiswaroop.mukkanti1999@gmail.com', 'manikantas0180@gmail.com'];
          if (isAdminEmail(authUser.email)) {
            console.log('Admin email detected, granting admin access');
            setIsAdmin(true);
          } else {
            // For other users, check admin status
            let adminStatus = false;
            if (authUserData && authUserData.isAdmin !== undefined) {
              adminStatus = authUserData.isAdmin;
            } else {
              adminStatus = await checkIsAdmin(authUser);
            }
            console.log('Admin status for', authUser.email, ':', adminStatus);
            setIsAdmin(adminStatus);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          // For admin emails, still grant access even if there's an error
          if (isAdminEmail(authUser.email)) {
            console.log('Error occurred but admin email detected, granting admin access');
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to manually set user (for login modal callback)
  const manualSetUser = (authUser) => {
    setUser(authUser);
  };

  const value = {
    isAdmin,
    isLoading,
    user,
    userData,
    setIsAdmin,
    setUser: manualSetUser
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};