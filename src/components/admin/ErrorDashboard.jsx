import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorDashboard Component
 * 
 * A comprehensive admin dashboard for viewing and managing error logs.
 * Provides filtering, search, error statistics, and error management capabilities.
 * 
 * @component
 * @example
 * return <ErrorDashboard />
 */
const ErrorDashboard = () => {
  // ==================== State Management ====================
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'all',
    level: 'all',
    dateRange: 'all',
    search: ''
  });
  const [selectedError, setSelectedError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // ==================== Mock Error Data ====================
  const mockErrors = [
    {
      id: 'ERR-001',
      timestamp: '2026-01-06T14:30:00Z',
      message: 'Failed to fetch product data from API',
      level: 'error',
      count: 5,
      status: 'open',
      stackTrace: 'Error: Failed to fetch product data\n    at ProductService.fetchProducts (productService.js:45)\n    at async ProductPage.loadData (ProductPage.jsx:23)\n    at async ProductPage.componentDidMount (ProductPage.jsx:15)',
      userContext: {
        userId: 'user_123',
        email: 'user@example.com',
        role: 'customer',
        browser: 'Chrome 120.0',
        os: 'Windows 10'
      },
      breadcrumbs: [
        { timestamp: '2026-01-06T14:29:55Z', action: 'Navigated to /products' },
        { timestamp: '2026-01-06T14:29:58Z', action: 'Applied filter: category=clothing' },
        { timestamp: '2026-01-06T14:30:00Z', action: 'Error occurred' }
      ]
    },
    {
      id: 'ERR-002',
      timestamp: '2026-01-06T13:15:00Z',
      message: 'Payment gateway timeout during checkout',
      level: 'error',
      count: 2,
      status: 'open',
      stackTrace: 'Error: Payment gateway timeout\n    at PaymentService.processPayment (paymentService.js:78)\n    at async CheckoutPage.handlePayment (CheckoutPage.jsx:156)',
      userContext: {
        userId: 'user_456',
        email: 'customer@test.com',
        role: 'customer',
        browser: 'Safari 17.2',
        os: 'macOS 14.2'
      },
      breadcrumbs: [
        { timestamp: '2026-01-06T13:10:00Z', action: 'Started checkout' },
        { timestamp: '2026-01-06T13:12:00Z', action: 'Added shipping address' },
        { timestamp: '2026-01-06T13:13:00Z', action: 'Selected payment method: card' },
        { timestamp: '2026-01-06T13:15:00Z', action: 'Payment timeout occurred' }
      ]
    },
    {
      id: 'ERR-003',
      timestamp: '2026-01-06T12:00:00Z',
      message: 'Invalid email format in registration form',
      level: 'warning',
      count: 12,
      status: 'resolved',
      stackTrace: 'Warning: Invalid email format\n    at ValidationService.validateEmail (validationService.js:23)\n    at RegistrationForm.handleSubmit (RegistrationForm.jsx:89)',
      userContext: {
        userId: 'guest',
        email: null,
        role: 'guest',
        browser: 'Firefox 121.0',
        os: 'Linux'
      },
      breadcrumbs: [
        { timestamp: '2026-01-06T11:58:00Z', action: 'Opened registration form' },
        { timestamp: '2026-01-06T12:00:00Z', action: 'Submitted invalid email' }
      ]
    },
    {
      id: 'ERR-004',
      timestamp: '2026-01-06T10:45:00Z',
      message: 'Authentication token expired',
      level: 'error',
      count: 8,
      status: 'open',
      stackTrace: 'Error: Authentication token expired\n    at AuthService.verifyToken (authService.js:67)\n    at async APIInterceptor.request (apiInterceptor.js:34)',
      userContext: {
        userId: 'user_789',
        email: 'user2@example.com',
        role: 'customer',
        browser: 'Chrome 120.0',
        os: 'Android 14'
      },
      breadcrumbs: [
        { timestamp: '2026-01-06T10:44:00Z', action: 'User logged in' },
        { timestamp: '2026-01-06T10:45:00Z', action: 'Token validation failed' }
      ]
    },
    {
      id: 'ERR-005',
      timestamp: '2026-01-06T09:30:00Z',
      message: 'Product image failed to load',
      level: 'warning',
      count: 15,
      status: 'resolved',
      stackTrace: 'Warning: Image load failed\n    at ImageComponent.onError (ImageComponent.jsx:45)\n    at HTMLImageElement.onerror',
      userContext: {
        userId: 'guest',
        email: null,
        role: 'guest',
        browser: 'Edge 120.0',
        os: 'Windows 11'
      },
      breadcrumbs: [
        { timestamp: '2026-01-06T09:29:00Z', action: 'Viewed product page' },
        { timestamp: '2026-01-06T09:30:00Z', action: 'Image load failed' }
      ]
    },
    {
      id: 'ERR-006',
      timestamp: '2026-01-06T08:15:00Z',
      message: 'Network request failed - CORS error',
      level: 'error',
      count: 3,
      status: 'open',
      stackTrace: 'Error: Network request failed\n    at fetch (native)\n    at APIHelper.request (apiHelper.js:23)\n    at async DataService.fetchData (dataService.js:45)',
      userContext: {
        userId: 'user_101',
        email: 'admin@example.com',
        role: 'admin',
        browser: 'Chrome 120.0',
        os: 'Windows 10'
      },
      breadcrumbs: [
        { timestamp: '2026-01-06T08:14:00Z', action: 'Admin accessed dashboard' },
        { timestamp: '2026-01-06T08:15:00Z', action: 'CORS error occurred' }
      ]
    },
    {
      id: 'ERR-007',
      timestamp: '2026-01-06T07:00:00Z',
      message: 'Database connection pool exhausted',
      level: 'error',
      count: 1,
      status: 'resolved',
      stackTrace: 'Error: Database connection pool exhausted\n    at DatabaseService.getConnection (databaseService.js:123)\n    at async QueryExecutor.execute (queryExecutor.js:56)',
      userContext: {
        userId: 'system',
        email: null,
        role: 'system',
        browser: null,
        os: 'Server'
      },
      breadcrumbs: [
        { timestamp: '2026-01-06T06:59:00Z', action: 'High traffic detected' },
        { timestamp: '2026-01-06T07:00:00Z', action: 'Connection pool exhausted' }
      ]
    },
    {
      id: 'ERR-008',
      timestamp: '2026-01-05T23:30:00Z',
      message: 'Coupon code validation failed',
      level: 'info',
      count: 25,
      status: 'resolved',
      stackTrace: 'Info: Coupon code validation failed\n    at CouponService.validate (couponService.js:89)\n    at CartPage.applyCoupon (CartPage.jsx:134)',
      userContext: {
        userId: 'user_202',
        email: 'shopper@example.com',
        role: 'customer',
        browser: 'Safari 17.1',
        os: 'iOS 17.2'
      },
      breadcrumbs: [
        { timestamp: '2026-01-05T23:28:00Z', action: 'Added items to cart' },
        { timestamp: '2026-01-05T23:29:00Z', action: 'Entered coupon code: INVALID20' },
        { timestamp: '2026-01-05T23:30:00Z', action: 'Coupon validation failed' }
      ]
    },
    {
      id: 'ERR-009',
      timestamp: '2026-01-05T22:00:00Z',
      message: 'Address validation failed - missing required fields',
      level: 'warning',
      count: 7,
      status: 'open',
      stackTrace: 'Warning: Address validation failed\n    at AddressService.validate (addressService.js:45)\n    at CheckoutPage.validateAddress (CheckoutPage.jsx:201)',
      userContext: {
        userId: 'user_303',
        email: 'newuser@example.com',
        role: 'customer',
        browser: 'Chrome 119.0',
        os: 'Windows 10'
      },
      breadcrumbs: [
        { timestamp: '2026-01-05T21:58:00Z', action: 'Started checkout' },
        { timestamp: '2026-01-05T21:59:00Z', action: 'Attempted to save address' },
        { timestamp: '2026-01-05T22:00:00Z', action: 'Address validation failed' }
      ]
    },
    {
      id: 'ERR-010',
      timestamp: '2026-01-05T20:00:00Z',
      message: 'Rate limit exceeded for API endpoint',
      level: 'error',
      count: 4,
      status: 'resolved',
      stackTrace: 'Error: Rate limit exceeded\n    at RateLimitService.checkLimit (rateLimitService.js:78)\n    at APIInterceptor.request (apiInterceptor.js:23)',
      userContext: {
        userId: 'user_404',
        email: 'bot@malicious.com',
        role: 'suspicious',
        browser: 'Unknown',
        os: 'Unknown'
      },
      breadcrumbs: [
        { timestamp: '2026-01-05T19:55:00Z', action: 'Multiple rapid requests detected' },
        { timestamp: '2026-01-05T20:00:00Z', action: 'Rate limit triggered' }
      ]
    }
  ];

  // ==================== Effects ====================
  useEffect(() => {
    // Simulate fetching errors from backend
    const fetchErrors = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setErrors(mockErrors);
      setLoading(false);
    };

    fetchErrors();
  }, []);

  // ==================== Computed Values ====================
  const filteredErrors = useMemo(() => {
    return errors.filter(error => {
      // Filter by status
      if (filter.status !== 'all' && error.status !== filter.status) {
        return false;
      }

      // Filter by level
      if (filter.level !== 'all' && error.level !== filter.level) {
        return false;
      }

      // Filter by date range
      if (filter.dateRange !== 'all') {
        const errorDate = new Date(error.timestamp);
        const now = new Date();
        const daysAgo = {
          '24h': 1,
          '7d': 7,
          '30d': 30
        }[filter.dateRange];

        if (daysAgo) {
          const cutoffDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
          if (errorDate < cutoffDate) {
            return false;
          }
        }
      }

      // Filter by search
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          error.message.toLowerCase().includes(searchLower) ||
          error.id.toLowerCase().includes(searchLower) ||
          error.userContext?.email?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [errors, filter]);

  const sortedErrors = useMemo(() => {
    const sorted = [...filteredErrors];
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [filteredErrors, sortConfig]);

  const errorStats = useMemo(() => {
    const total = errors.length;
    const open = errors.filter(e => e.status === 'open').length;
    const resolved = errors.filter(e => e.status === 'resolved').length;
    const errorRate = total > 0 ? ((open / total) * 100).toFixed(1) : 0;

    return { total, open, resolved, errorRate };
  }, [errors]);

  // ==================== Event Handlers ====================
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleViewError = (error) => {
    setSelectedError(error);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedError(null);
  };

  const handleMarkResolved = (errorId) => {
    setErrors(prev => prev.map(error =>
      error.id === errorId ? { ...error, status: 'resolved' } : error
    ));
    if (selectedError?.id === errorId) {
      setSelectedError(prev => ({ ...prev, status: 'resolved' }));
    }
  };

  const handleDeleteError = (errorId) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
    setShowDeleteConfirm(null);
    if (selectedError?.id === errorId) {
      handleCloseModal();
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Message', 'Level', 'Count', 'Status', 'User Email'];
    const rows = sortedErrors.map(error => [
      error.id,
      error.timestamp,
      error.message,
      error.level,
      error.count,
      error.status,
      error.userContext?.email || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `error_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLevelBadgeClass = (level) => {
    const classes = {
      error: 'bg-red-100 text-red-800 border-red-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return classes[level] || classes.info;
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      open: 'bg-orange-100 text-orange-800 border-orange-200',
      resolved: 'bg-green-100 text-green-800 border-green-200'
    };
    return classes[status] || classes.open;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ==================== Render ====================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Error Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor and manage application errors</p>
      </div>

      {/* Error Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-none shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Errors</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{errorStats.total}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-none">
              <svg className="w-6 h-6 text-[#4C0E0E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-none shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Errors</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{errorStats.open}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-none">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-none shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Errors</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{errorStats.resolved}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-none">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-none shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Error Rate</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{errorStats.errorRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-none">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-none shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-[#4C0E0E]"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              value={filter.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-[#4C0E0E]"
            >
              <option value="all">All Levels</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filter.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-[#4C0E0E]"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filter.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by message, ID, or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-[#4C0E0E]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#4C0E0E] text-white rounded-none hover:bg-[#6B0F10] transition-colors flex items-center font-bold tracking-widest text-xs"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Error Table */}
      <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-none h-12 w-12 border-b-2 border-[#4C0E0E]"></div>
            <p className="mt-4 text-gray-600">Loading errors...</p>
          </div>
        ) : sortedErrors.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No errors found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'timestamp', label: 'Timestamp' },
                    { key: 'message', label: 'Error Message' },
                    { key: 'level', label: 'Level' },
                    { key: 'count', label: 'Count' },
                    { key: 'status', label: 'Status' }
                  ].map(column => (
                    <th
                      key={column.key}
                      onClick={() => handleSort(column.key)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      <div className="flex items-center">
                        {column.label}
                        {sortConfig.key === column.key && (
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={sortConfig.direction === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedErrors.map((error) => (
                  <tr key={error.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(error.timestamp)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                      <button
                        onClick={() => handleViewError(error)}
                        className="text-[#4C0E0E] hover:text-[#6B0F10] hover:underline font-bold"
                      >
                        {error.message}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-none border ${getLevelBadgeClass(error.level)}`}>
                        {error.level.charAt(0).toUpperCase() + error.level.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {error.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-none border ${getStatusBadgeClass(error.status)}`}>
                        {error.status.charAt(0).toUpperCase() + error.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewError(error)}
                        className="text-[#4C0E0E] hover:text-[#6B0F10] mr-3 font-bold"
                      >
                        View
                      </button>
                      {error.status === 'open' && (
                        <button
                          onClick={() => handleMarkResolved(error.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => setShowDeleteConfirm(error.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Error Detail Modal */}
      {showModal && selectedError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Error Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Error Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Error ID</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedError.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedError.timestamp)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-none border ${getLevelBadgeClass(selectedError.level)}`}>
                    {selectedError.level.charAt(0).toUpperCase() + selectedError.level.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-none border ${getStatusBadgeClass(selectedError.status)}`}>
                    {selectedError.status.charAt(0).toUpperCase() + selectedError.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Count</label>
                  <p className="text-sm text-gray-900">{selectedError.count}</p>
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Error Message</label>
                <div className="bg-red-50 border border-red-200 rounded-none p-4">
                  <p className="text-sm text-red-900">{selectedError.message}</p>
                </div>
              </div>

              {/* Stack Trace */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Stack Trace</label>
                <div className="bg-gray-900 rounded-none p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                    {selectedError.stackTrace}
                  </pre>
                </div>
              </div>

              {/* User Context */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">User Context</label>
                <div className="bg-gray-50 border border-gray-200 rounded-none p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500">User ID:</span>
                      <p className="text-sm text-gray-900 font-mono">{selectedError.userContext?.userId || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Email:</span>
                      <p className="text-sm text-gray-900">{selectedError.userContext?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Role:</span>
                      <p className="text-sm text-gray-900">{selectedError.userContext?.role || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Browser:</span>
                      <p className="text-sm text-gray-900">{selectedError.userContext?.browser || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">OS:</span>
                      <p className="text-sm text-gray-900">{selectedError.userContext?.os || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breadcrumbs */}
              {selectedError.breadcrumbs && selectedError.breadcrumbs.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breadcrumbs</label>
                  <div className="bg-blue-50 border border-blue-200 rounded-none p-4">
                    <ul className="space-y-2">
                      {selectedError.breadcrumbs.map((crumb, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-xs text-[#4C0E0E] font-mono mr-2 mt-0.5">
                            {formatDate(crumb.timestamp)}
                          </span>
                          <span className="text-sm text-blue-900">{crumb.action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              {selectedError.status === 'open' && (
                <button
                  onClick={() => handleMarkResolved(selectedError.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-none hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(selectedError.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-none hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Delete Error
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-none hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Delete Error Log</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete this error log? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-none hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteError(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-none hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ErrorDashboard.propTypes = {
  // No props required for this component
};

export default ErrorDashboard;


