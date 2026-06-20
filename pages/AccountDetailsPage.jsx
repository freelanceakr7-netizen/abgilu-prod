import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, Check, X, ArrowLeft } from 'lucide-react';
import { useAdmin } from '../src/contexts/AdminContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebase/config';
// Password update removed as per new OTP-only flow


const AccountDetailsPage = ({ navigateTo }) => {
  const { user, userData } = useAdmin();
  const [activeTab, setActiveTab] = useState('personal');

  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Personal information form state
  const [personalInfo, setPersonalInfo] = useState({
    username: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: ''
  });

  useEffect(() => {
    if (userData) {
      setPersonalInfo({
        username: userData.displayName || '',
        email: user?.email || '',
        phone: userData.phone || '',
        birthDate: userData.birthDate || '',
        gender: userData.gender || ''
      });
      
      // Load preferences if they exist
      if (userData.preferences) {
        setPreferences(prev => ({
          ...prev,
          ...userData.preferences
        }));
      }
    } else if (user) {
      setPersonalInfo(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [userData, user]);

  // Preferences form state
  const [preferences, setPreferences] = useState({
    newsletter: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    language: 'english',
    timezone: 'EST'
  });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // Update Firebase Auth profile
      const displayName = personalInfo.username.trim();
      await updateProfile(user, { displayName });
      
      // Update Firestore user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        phone: personalInfo.phone,
        birthDate: personalInfo.birthDate,
        gender: personalInfo.gender,
        updatedAt: new Date()
      });
      
      setSuccessMessage('User profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating personal info:', error);
      setSuccessMessage('Error updating information. Please try again.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // handlePasswordSubmit removed


  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // Update Firestore user document with preferences
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        preferences: preferences,
        updatedAt: new Date()
      });
      
      setSuccessMessage('Preferences updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating preferences:', error);
      setSuccessMessage('Error updating preferences. Please try again.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-indigo/60 hover:text-terracotta transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <h1 className="font-serif text-4xl md:text-5xl text-indigo mb-12">Account Details</h1>
      <p className="text-indigo/60 mb-8">Manage your account information and preferences</p>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-none flex items-center gap-2">
          <Check size={20} />
          {successMessage}
        </div>
      )}

      <div className="bg-kora border border-indigo/10 rounded-none shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-indigo/10">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'personal'
                  ? 'border-b-2 border-terracotta text-terracotta'
                  : 'text-indigo/60 hover:text-indigo'
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'preferences'
                  ? 'border-b-2 border-terracotta text-terracotta'
                  : 'text-indigo/60 hover:text-indigo'
              }`}
            >
              Preferences
            </button>

          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <form onSubmit={handlePersonalInfoSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium uppercase tracking-[0.2em] mb-2 text-indigo/80">User Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo/40" size={18} />
                    <input
                      type="text"
                      name="username"
                      value={personalInfo.username}
                      onChange={handlePersonalInfoChange}
                      placeholder="Choose your username"
                      className="w-full pl-10 pr-4 py-2 border border-indigo/20 rounded-none bg-kora-light text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium uppercase tracking-[0.2em] mb-2 text-indigo/80">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo/40" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      className="w-full pl-10 pr-4 py-2 border border-indigo/20 rounded-none bg-kora-light text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium uppercase tracking-[0.2em] mb-2 text-indigo/80">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo/40" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      className="w-full pl-10 pr-4 py-2 border border-indigo/20 rounded-none bg-kora-light text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium uppercase tracking-[0.2em] mb-2 text-indigo/80">Date of Birth</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={personalInfo.birthDate}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 border border-indigo/20 rounded-none bg-kora-light text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium uppercase tracking-[0.2em] mb-2 text-indigo/80">Gender</label>
                  <select
                    name="gender"
                    value={personalInfo.gender}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 border border-indigo/20 rounded-none bg-kora-light text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-slide relative overflow-hidden px-8 py-4 text-sm uppercase tracking-[0.2em] font-semibold bg-indigo text-kora hover:bg-indigo/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-none w-full md:w-auto"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Change Password content removed */}


          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <form onSubmit={handlePreferencesSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-bold mb-4 text-indigo">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={preferences.newsletter}
                        onChange={handlePreferencesChange}
                        className="mr-3 accent-indigo"
                      />
                      <span className="text-indigo/80 font-medium text-sm">Subscribe to newsletter</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="orderUpdates"
                        checked={preferences.orderUpdates}
                        onChange={handlePreferencesChange}
                        className="mr-3 accent-indigo"
                      />
                      <span className="text-indigo/80 font-medium text-sm">Order status updates</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="promotions"
                        checked={preferences.promotions}
                        onChange={handlePreferencesChange}
                        className="mr-3 accent-indigo"
                      />
                      <span className="text-indigo/80 font-medium text-sm">Special promotions and discounts</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="newProducts"
                        checked={preferences.newProducts}
                        onChange={handlePreferencesChange}
                        className="mr-3 accent-indigo"
                      />
                      <span className="text-indigo/80 font-medium text-sm">New product announcements</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-serif font-bold mb-4 text-indigo">SMS Notifications</h3>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={preferences.smsNotifications}
                      onChange={handlePreferencesChange}
                      className="mr-3 accent-indigo"
                    />
                    <span className="text-indigo/80 font-medium text-sm">Receive SMS notifications for order updates</span>
                  </label>
                </div>
                
                <div>
                  <h3 className="text-lg font-serif font-bold mb-4 text-indigo">Regional Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium uppercase tracking-[0.2em] mb-2 text-indigo/85">Language</label>
                      <select
                        name="language"
                        value={preferences.language}
                        onChange={handlePreferencesChange}
                        className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium uppercase tracking-[0.2em] mb-2 text-indigo/85">Timezone</label>
                      <select
                        name="timezone"
                        value={preferences.timezone}
                        onChange={handlePreferencesChange}
                        className="w-full px-4 py-3 bg-kora-light border border-indigo/10 rounded-none text-indigo focus:outline-none focus:border-terracotta transition-all font-semibold"
                      >
                        <option value="EST">Eastern Time (EST)</option>
                        <option value="CST">Central Time (CST)</option>
                        <option value="MST">Mountain Time (MST)</option>
                        <option value="PST">Pacific Time (PST)</option>
                        <option value="GMT">Greenwich Mean Time (GMT)</option>
                        <option value="CET">Central European Time (CET)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-slide relative overflow-hidden px-8 py-4 text-sm uppercase tracking-[0.2em] font-semibold bg-indigo text-kora hover:bg-indigo/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-none w-full md:w-auto"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsPage;



