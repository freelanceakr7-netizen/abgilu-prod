# HaathSaga Ecommerce Platform - Functionality Analysis

## Overview

**Project Name:** HaathSaga Ecommerce Platform

**Description:** A comprehensive, full-featured ecommerce platform built with React and Firebase, designed for selling fashion and lifestyle products. The platform includes user authentication, product management, shopping cart, wishlist, order management, payment integration, shipping logistics, and a complete admin dashboard.

**Technology Stack Summary:**
- **Frontend:** React 19, Vite, Tailwind CSS, React Router DOM, Lucide React
- **Backend:** Firebase (Firestore, Authentication, Storage, Cloud Functions), Firebase Admin SDK
- **Payment:** Razorpay
- **Shipping:** Shiprocket API
- **Email:** Nodemailer with Hostinger SMTP
- **Build Tool:** Vite

---

## Table of Contents

1. [Frontend Pages](#section-1-frontend-pages)
2. [Components](#section-2-components)
3. [Services & Firebase Integration](#section-3-services--firebase-integration)
4. [Backend Functions](#section-4-backend-functions)
5. [State Management](#section-5-state-management)
6. [Key Features Implemented](#section-6-key-features-implemented)
7. [Technology Stack](#section-7-technology-stack)
8. [Data Structures](#section-8-data-structures)

---

## Section 1: Frontend Pages

### Public Pages

| Page | File | Description |
|------|------|-------------|
| Home Page | [`pages/HomePage.jsx`](pages/HomePage.jsx:1) | Main landing page with hero carousel, featured products, brand story, testimonials, and collection sections |
| Shop Page | [`pages/ShopPage.jsx`](pages/ShopPage.jsx:1) | Product catalog with filtering, sorting, and category navigation |
| Product Detail Page | [`pages/ProductDetailPage.jsx`](pages/ProductDetailPage.jsx:1) | Individual product page with images, descriptions, reviews, size/color selection, and add to cart |
| About Page | [`pages/AboutPage.jsx`](pages/AboutPage.jsx:1) | Company information and brand story |
| Contact Page | [`pages/ContactPage.jsx`](pages/ContactPage.jsx:1) | Contact form and company contact information |
| Custom Fit Page | [`pages/CustomFitPage.jsx`](pages/CustomFitPage.jsx:1) | Custom fit request form for personalized products |

### User Account Pages

| Page | File | Description |
|------|------|-------------|
| Login Page | [`pages/LoginPage.jsx`](pages/LoginPage.jsx:1) | User authentication with email/password and OTP verification |
| Dashboard Page | [`pages/DashboardPage.jsx`](pages/DashboardPage.jsx:1) | User dashboard with order history, account overview, and quick actions |
| Orders Page | [`pages/OrdersPage.jsx`](pages/OrdersPage.jsx:1) | Order history with status tracking and details |
| Addresses Page | [`pages/AddressesPage.jsx`](pages/AddressesPage.jsx:1) | Address management (add, edit, delete, set default) |
| Account Details Page | [`pages/AccountDetailsPage.jsx`](pages/AccountDetailsPage.jsx:1) | User profile management and password update |
| Wishlist Page | [`pages/WishlistPage.jsx`](pages/WishlistPage.jsx:1) | Saved/wishlisted products management |
| Downloads Page | [`pages/DownloadsPage.jsx`](pages/DownloadsPage.jsx:1) | Downloadable content and invoices |

### Checkout & Cart

| Page | File | Description |
|------|------|-------------|
| Checkout Page | [`pages/CheckoutPage.jsx`](pages/CheckoutPage.jsx:1) | Complete checkout flow with address selection, payment, and order confirmation |

### Policy Pages

| Page | File | Description |
|------|------|-------------|
| Privacy Policy | [`pages/PrivacyPolicyPage.jsx`](pages/PrivacyPolicyPage.jsx:1) | Privacy policy and data handling information |
| Terms & Conditions | [`pages/TermsConditionsPage.jsx`](pages/TermsConditionsPage.jsx:1) | Terms and conditions of use |
| Returns Policy | [`pages/ReturnsPolicyPage.jsx`](pages/ReturnsPolicyPage.jsx:1) | Return and refund policy |
| Shipping Policy | [`pages/ShippingPolicyPage.jsx`](pages/ShippingPolicyPage.jsx:1) | Shipping and delivery policy |

### Admin Pages

| Page | File | Description |
|------|------|-------------|
| Admin Dashboard | [`pages/AdminDashboardPage.jsx`](pages/AdminDashboardPage.jsx:1) | Complete admin interface for managing products, orders, users, coupons, and shipping |

---

## Section 2: Components

### Main Components

| Component | File | Description |
|-----------|------|-------------|
| Header | [`components/Header.jsx`](components/Header.jsx:1) | Navigation bar with logo, menu, cart, wishlist, and user authentication |
| Footer | [`components/Footer.jsx`](components/Footer.jsx:1) | Site footer with links, social media, and copyright |
| Hero Carousel | [`components/HeroCarousel.jsx`](components/HeroCarousel.jsx:1) | Featured banners and promotional content |
| Brand Carousel | [`components/BrandCarousel.jsx`](components/BrandCarousel.jsx:1) | Brand partner showcase |
| Brand Story | [`components/BrandStory.jsx`](components/BrandStory.jsx:1) | Brand narrative and values |
| Collection Sections | [`components/CollectionSections.jsx`](components/CollectionSections.jsx:1) | Product collection displays |
| Popular Products | [`components/PopularProducts.jsx`](components/PopularProducts.jsx:1) | Featured/trending products grid |
| Product Card | [`components/ProductCard.jsx`](components/ProductCard.jsx:1) | Individual product display component |
| Features Section | [`components/FeaturesSection.jsx`](components/FeaturesSection.jsx:1) | Key selling points and benefits |
| Testimonials Section | [`components/TestimonialsSection.jsx`](components/TestimonialsSection.jsx:1) | Customer reviews and testimonials |
| Editorial Grid | [`components/EditorialGrid.jsx`](components/EditorialGrid.jsx:1) | Magazine-style product display |
| Top Categories | [`components/TopCategories.jsx`](components/TopCategories.jsx:1) | Category navigation and display |
| Custom Fit Form | [`components/CustomFitForm.jsx`](components/CustomFitForm.jsx:1) | Custom measurement request form |
| Text Marquee | [`components/TextMarquee.jsx`](components/TextMarquee.jsx:1) | Scrolling announcement bar |
| Button | [`components/Button.jsx`](components/Button.jsx:1) | Reusable button component |

### Modals & Overlays

| Component | File | Description |
|-----------|------|-------------|
| Login Modal | [`components/LoginModal.jsx`](components/LoginModal.jsx:1) | Authentication modal with login/register |
| OTP Verification Modal | [`components/OTPVerificationModal.jsx`](components/OTPVerificationModal.jsx:1) | OTP input and verification |
| Payment Modal | [`components/PaymentModal.jsx`](components/PaymentModal.jsx:1) | Payment processing modal |
| Logout Success Modal | [`components/LogoutSuccessModal.jsx`](components/LogoutSuccessModal.jsx:1) | Logout confirmation |
| Wishlist Sidebar | [`components/WishlistSidebar.jsx`](components/WishlistSidebar.jsx:1) | Slide-out wishlist panel |
| Toast Notification | [`components/ToastNotification.jsx`](components/ToastNotification.jsx:1) | Alert and notification system |

### Policy Sections

| Component | File | Description |
|-----------|------|-------------|
| Privacy Policy Section | [`components/PrivacyPolicySection.jsx`](components/PrivacyPolicySection.jsx:1) | Privacy policy content |
| Terms Conditions Section | [`components/TermsConditionsSection.jsx`](components/TermsConditionsSection.jsx:1) | Terms and conditions content |
| Returns Policy Section | [`components/ReturnsPolicySection.jsx`](components/ReturnsPolicySection.jsx:1) | Returns policy content |
| Shipping Policy Section | [`components/ShippingPolicySection.jsx`](components/ShippingPolicySection.jsx:1) | Shipping policy content |

### Product-Related Components

| Component | File | Description |
|-----------|------|-------------|
| Product Rating | [`src/components/ProductRating.jsx`](src/components/ProductRating.jsx:1) | Star rating display |
| Product Rating Enhanced | [`src/components/ProductRatingEnhanced.jsx`](src/components/ProductRatingEnhanced.jsx:1) | Enhanced rating with reviews count |
| Review Modal | [`src/components/ReviewModal.jsx`](src/components/ReviewModal.jsx:1) | Review submission form |

### Admin Components

| Component | File | Description |
|-----------|------|-------------|
| Dashboard Overview | [`src/components/admin/DashboardOverview.jsx`](src/components/admin/DashboardOverview.jsx:1) | Admin dashboard main view |
| Dashboard Stats Cards | [`src/components/admin/DashboardStatsCards.jsx`](src/components/admin/DashboardStatsCards.jsx:1) | Statistics cards display |
| Tab Navigation | [`src/components/admin/TabNavigation.jsx`](src/components/admin/TabNavigation.jsx:1) | Admin section navigation |
| Products Management | [`src/components/admin/ProductsManagement.jsx`](src/components/admin/ProductsManagement.jsx:1) | Product CRUD operations |
| Product Modal | [`src/components/admin/ProductModal.jsx`](src/components/admin/ProductModal.jsx:1) | Product add/edit modal |
| Orders Management | [`src/components/admin/OrdersManagement.jsx`](src/components/admin/OrdersManagement.jsx:1) | Order management interface |
| Order Modal | [`src/components/admin/OrderModal.jsx`](src/components/admin/OrderModal.jsx:1) | Order details modal |
| Users Management | [`src/components/admin/UsersManagement.jsx`](src/components/admin/UsersManagement.jsx:1) | User management interface |
| Categories Management | [`src/components/admin/CategoriesManagement.jsx`](src/components/admin/CategoriesManagement.jsx:1) | Category management |
| Category Modal | [`src/components/admin/CategoryModal.jsx`](src/components/admin/CategoryModal.jsx:1) | Category add/edit modal |
| Coupons Management | [`src/components/admin/CouponsManagement.jsx`](src/components/admin/CouponsManagement.jsx:1) | Coupon management interface |
| Coupon Modal | [`src/components/admin/CouponModal.jsx`](src/components/admin/CouponModal.jsx:1) | Coupon add/edit modal |
| Payments Management | [`src/components/admin/PaymentsManagement.jsx`](src/components/admin/PaymentsManagement.jsx:1) | Payment tracking and management |
| Payment Modal | [`src/components/admin/PaymentModal.jsx`](src/components/admin/PaymentModal.jsx:1) | Payment details modal |
| Shipping Management | [`src/components/admin/ShippingManagement.jsx`](src/components/admin/ShippingManagement.jsx:1) | Shipping and logistics management |
| Create Shipment Modal | [`src/components/admin/CreateShipmentModal.jsx`](src/components/admin/CreateShipmentModal.jsx:1) | Shipment creation interface |
| Add Pickup Location Modal | [`src/components/admin/AddPickupLocationModal.jsx`](src/components/admin/AddPickupLocationModal.jsx:1) | Pickup location management |
| Edit Address Modal | [`src/components/admin/EditAddressModal.jsx`](src/components/admin/EditAddressModal.jsx:1) | Address editing modal |
| Refund Modal | [`src/components/admin/RefundModal.jsx`](src/components/admin/RefundModal.jsx:1) | Refund processing modal |

---

## Section 3: Services & Firebase Integration

### Authentication Service
**File:** [`src/firebase/services/authService.js`](src/firebase/services/authService.js:1)

| Method | Description |
|--------|-------------|
| `signInUser(email, password)` | User login with email and password |
| `registerUserWithOTP(email, password, displayName, otp, isAdmin)` | User registration with OTP verification |
| `registerUser(email, password, displayName, isAdmin)` | Legacy user registration without OTP |
| `signOutUser()` | User logout |
| `onAuthStateChange(callback)` | Monitor authentication state changes |
| `updateUserPassword(user, currentPassword, newPassword)` | Update user password |
| `checkIsAdmin(user)` | Check if user has admin privileges |

### Cart Service
**File:** [`src/firebase/services/cartService.js`](src/firebase/services/cartService.js:1)

| Method | Description |
|--------|-------------|
| `getUserCart(userId)` | Get authenticated user's cart from Firebase |
| `addToUserCart(userId, product)` | Add product to user's cart |
| `updateCartItemQuantity(userId, productId, quantity, size, color)` | Update item quantity in cart |
| `removeFromUserCart(userId, productId, size, color)` | Remove item from cart |
| `clearUserCart(userId)` | Clear entire cart |
| `getUserCartItemCount(userId)` | Get total cart item count |
| `getUserCartTotal(userId)` | Calculate cart total |
| `isProductInUserCart(userId, productId, size, color)` | Check if product is in cart |
| `getUserCartItemQuantity(userId, productId, size, color)` | Get specific item quantity |
| `getUserWishlist(userId)` | Get user's wishlist |
| `addToUserWishlist(userId, item)` | Add item to wishlist |
| `removeFromUserWishlist(userId, itemId)` | Remove item from wishlist |
| `toggleUserWishlist(userId, item)` | Toggle item in wishlist |
| `saveUserWishlist(userId, wishlist)` | Save wishlist to Firebase |

### Guest Cart Service
**File:** [`src/firebase/services/guestCartService.js`](src/firebase/services/guestCartService.js:1)

| Method | Description |
|--------|-------------|
| `getGuestCart()` | Get guest cart from localStorage |
| `addToGuestCart(product)` | Add product to guest cart |
| `updateGuestCartItemQuantity(productId, quantity, size, color)` | Update guest cart item |
| `removeFromGuestCart(productId, size, color)` | Remove item from guest cart |
| `clearGuestCart()` | Clear guest cart |
| `getGuestCartItemCount()` | Get guest cart count |
| `getGuestCartTotal()` | Calculate guest cart total |
| `isProductInGuestCart(productId, size, color)` | Check if product in guest cart |
| `getGuestCartItemQuantity(productId, size, color)` | Get guest item quantity |
| `migrateGuestCartToUserCart(userId, addToUserCart)` | Migrate guest cart to user cart |

### Guest Wishlist Service
**File:** [`src/firebase/services/guestWishlistService.js`](src/firebase/services/guestWishlistService.js:1)

| Method | Description |
|--------|-------------|
| `getGuestWishlist()` | Get guest wishlist from localStorage |
| `addToGuestWishlist(item)` | Add item to guest wishlist |
| `removeFromGuestWishlist(itemId)` | Remove item from guest wishlist |
| `toggleGuestWishlist(item)` | Toggle item in guest wishlist |
| `clearGuestWishlist()` | Clear guest wishlist |
| `saveGuestWishlist(wishlist)` | Save guest wishlist to localStorage |

### Product Service
**File:** [`src/firebase/services/productService.js`](src/firebase/services/productService.js:1)

| Method | Description |
|--------|-------------|
| `getAllProducts()` | Get all products |
| `getProductById(productId)` | Get single product by ID |
| `getProductsByCategory(category)` | Get products by category |
| `getProductsBySubcategory(subcategory)` | Get products by subcategory |
| `getProductsByCategoryOrSubcategory(categoryOrSubcategory)` | Get products by category or subcategory |
| `createProduct(productData, imageFiles)` | Create new product with image upload |
| `updateProduct(productId, productData, newImageFiles)` | Update product details and images |
| `deleteProduct(productId)` | Delete product and associated images |
| `deleteProductImage(productId, imageUrl)` | Delete specific product image |
| `getFeaturedProducts(limitCount)` | Get featured products |
| `updateProductStock(productId, stockChange)` | Update product stock |
| `isProductAvailableForPreOrder(productId)` | Check if pre-order available |
| `isProductInStock(productId)` | Check if product in stock |
| `validatePreOrderStock(productId, quantity)` | Validate pre-order stock |
| `checkCustomerPreOrderLimit(productId, userId, quantity)` | Check pre-order limit per customer |
| `getPreOrderPricing(productId)` | Get pre-order pricing |
| `updatePreOrderStock(productId, stockChange)` | Update pre-order stock |
| `getPreOrderProducts(limitCount)` | Get available pre-order products |
| `getProductsWithStock()` | Get products with stock information |
| `getProductsByIds(productIds)` | Batch fetch products by IDs |

### Product Query Service
**File:** [`src/firebase/services/productQueryService.js`](src/firebase/services/productQueryService.js:1)

| Method | Description |
|--------|-------------|
| `getProductsByFilters(filters, options)` | Get products with advanced filtering |
| `searchProducts(searchTerm, filters, options)` | Search products by term |
| `getProductByIdOptimized(productId)` | Optimized product fetch with caching |
| `getFeaturedProducts(limitCount)` | Get featured products with caching |
| `invalidateProductCache(type, key)` | Invalidate product cache |
| `clearProductCache()` | Clear all product cache |

### Order Service
**File:** [`src/firebase/services/orderService.js`](src/firebase/services/orderService.js:1)

| Method | Description |
|--------|-------------|
| `createOrder(orderData)` | Create new order with stock management |
| `getAllOrders()` | Get all orders (admin) |
| `getOrdersByUserId(userId)` | Get user's orders |
| `getOrderById(orderId)` | Get single order details |
| `updateOrderStatus(orderId, status, additionalData)` | Update order status |
| `updateOrderTracking(orderId, trackingNumber, carrier)` | Update tracking information |
| `cancelOrder(orderId, reason)` | Cancel order and restore stock |
| `getOrdersByStatus(status)` | Get orders by status |
| `getOrderStatistics()` | Get order statistics |
| `calculateOrderStatistics()` | Calculate order statistics from scratch |
| `updateOrderStatistics()` | Update order statistics collection |
| `getRecentOrders(limitCount)` | Get recent orders |
| `deleteOrder(orderId)` | Delete order (admin only) |

### Review Service
**File:** [`src/firebase/services/reviewService.js`](src/firebase/services/reviewService.js:1)

| Method | Description |
|--------|-------------|
| `createReview(reviewData)` | Create new product review |
| `getReviewsByProductId(productId)` | Get all reviews for a product |
| `getReviewsByUserId(userId)` | Get user's reviews |
| `getReviewById(reviewId)` | Get single review |
| `updateReview(reviewId, reviewData)` | Update existing review |
| `deleteReview(reviewId)` | Delete review |
| `hasUserReviewedProduct(userId, productId)` | Check if user reviewed product |
| `getUserReviewForProduct(userId, productId)` | Get user's review for product |
| `updateProductRatingStats(productId)` | Update product rating statistics |
| `updateProductRating(productId, averageRating, reviewCount)` | Update product with rating |
| `getReviewsForOrderItems(orderItems, userId)` | Get reviews for order items |
| `getRecentReviews(limitCount)` | Get recent reviews |

### Category Service
**File:** [`src/firebase/services/categoryService.js`](src/firebase/services/categoryService.js:1)

| Method | Description |
|--------|-------------|
| `getAllCategories()` | Get all categories |
| `getCategoryById(categoryId)` | Get category by ID |
| `createCategory(categoryData)` | Create new category |
| `updateCategory(categoryId, categoryData)` | Update category |
| `deleteCategory(categoryId)` | Delete category |
| `getCategoriesWithSubcategories()` | Get categories with subcategories |

### Coupon Service
**File:** [`src/firebase/services/couponService.js`](src/firebase/services/couponService.js:1)

| Method | Description |
|--------|-------------|
| `createCoupon(couponData)` | Create new coupon |
| `getAllCoupons()` | Get all coupons |
| `getCouponById(couponId)` | Get coupon by ID |
| `getCouponByCode(code)` | Get coupon by code |
| `updateCoupon(couponId, couponData)` | Update coupon |
| `deleteCoupon(couponId)` | Delete coupon |
| `validateCoupon(code, userEmail, cartTotal)` | Validate coupon for use |
| `calculateCouponDiscount(code, userEmail, cartTotal)` | Calculate discount without incrementing usage |
| `applyCouponAfterOrder(couponId)` | Apply coupon and increment usage after order |
| `applyCoupon(code, userEmail, cartTotal)` | Legacy apply coupon function |
| `getCouponsByStatus(isActive)` | Get coupons by status |
| `getCouponsByEmail(email)` | Get coupons for specific email |
| `getCouponStatistics()` | Get coupon statistics |
| `toggleCouponStatus(couponId)` | Activate/deactivate coupon |

### Address Service
**File:** [`src/firebase/services/addressService.js`](src/firebase/services/addressService.js:1)

| Method | Description |
|--------|-------------|
| `getUserAddresses(userId)` | Get user's addresses |
| `saveUserAddresses(userId, addresses)` | Save all addresses |
| `addUserAddress(userId, address)` | Add new address |
| `updateUserAddress(userId, addressId, updatedAddress)` | Update existing address |
| `deleteUserAddress(userId, addressId)` | Delete address |
| `setDefaultAddress(userId, addressId)` | Set default address |

### Payment Service
**File:** [`src/firebase/services/paymentService.js`](src/firebase/services/paymentService.js:1)

| Method | Description |
|--------|-------------|
| `createRazorpayOrder(orderData)` | Create Razorpay order |
| `verifyRazorpayPayment(paymentData)` | Verify Razorpay payment |
| `processRefund(orderId, amount)` | Process payment refund |

### Admin Payment Service
**File:** [`src/firebase/services/adminPaymentService.js`](src/firebase/services/adminPaymentService.js:1)

| Method | Description |
|--------|-------------|
| `getAdminPayments()` | Get all admin payments |
| `getPaymentById(paymentId)` | Get payment by ID |
| `updatePaymentStatus(paymentId, status)` | Update payment status |
| `processRefund(paymentId, amount, reason)` | Process refund |

### Shiprocket Service
**File:** [`src/firebase/services/shiprocketService.js`](src/firebase/services/shiprocketService.js:1)

| Method | Description |
|--------|-------------|
| `authenticateShiprocket(email, password)` | Authenticate with Shiprocket API |
| `isShiprocketAuthenticated()` | Check authentication status |
| `logoutShiprocket()` | Logout from Shiprocket |
| `getShiprocketOrders(params)` | Get all orders from Shiprocket |
| `getShiprocketOrderById(orderId)` | Get order details |
| `createShiprocketOrder(orderData)` | Create order in Shiprocket |
| `checkCourierServiceability(params)` | Check courier availability and rates |
| `getPickupLocations()` | Get pickup locations |
| `createPickupLocation(locationData)` | Create pickup location |
| `updatePickupLocation(locationId, locationData)` | Update pickup location |
| `createShipment(orderId, courierId)` | Create shipment for order |
| `trackShipment(shipmentId)` | Track shipment |
| `generateShippingLabel(orderIds)` | Generate shipping labels |
| `generateManifest(orderIds)` | Generate manifest |
| `schedulePickup(pickupData)` | Schedule pickup |
| `cancelShiprocketOrder(orderIds)` | Cancel order |
| `getWalletBalance()` | Get wallet balance |
| `getAllCouriers()` | Get available couriers |

### Email Service
**File:** [`src/firebase/services/emailService.js`](src/firebase/services/emailService.js:1)

| Method | Description |
|--------|-------------|
| `sendOTPEmail(email, otp)` | Send OTP verification email |
| `verifyOTP(email, otp, deleteAfterVerify)` | Verify OTP code |
| `sendOrderConfirmation(email, orderDetails)` | Send order confirmation email |

### User Service
**File:** [`src/firebase/services/userService.js`](src/firebase/services/userService.js:1)

| Method | Description |
|--------|-------------|
| `getUserById(userId)` | Get user by ID |
| `getAllUsers()` | Get all users (admin) |
| `updateUser(userId, userData)` | Update user data |
| `deleteUser(userId)` | Delete user account |
| `searchUsers(searchTerm)` | Search users by term |

### User Search Service
**File:** [`src/firebase/services/userSearchService.js`](src/firebase/services/userSearchService.js:1)

| Method | Description |
|--------|-------------|
| `searchUsers(searchTerm)` | Search users with indexed terms |
| `getUserSearchIndex(userId)` | Get user search index |
| `updateUserSearchIndex(userId, userData)` | Update user search index |
| `rebuildUserSearchIndex()` | Rebuild entire search index |
| `getUserSearchIndexStats()` | Get search index statistics |

### Product Rating Fix Service
**File:** [`src/firebase/services/productRatingFixService.js`](src/firebase/services/productRatingFixService.js:1)

| Method | Description |
|--------|-------------|
| `fixAllProductRatings()` | Fix rating inconsistencies for all products |
| `fixProductRating(productId)` | Fix rating for specific product |

---

## Section 4: Backend Functions

### Order Statistics Functions
**File:** [`firebase/functions/orderStatistics.js`](firebase/functions/orderStatistics.js:1)

| Function | Type | Description |
|----------|------|-------------|
| `onOrderCreated` | Firestore Trigger | Automatically update statistics when order is created |
| `onOrderUpdated` | Firestore Trigger | Update statistics when order status changes |
| `onOrderDeleted` | Firestore Trigger | Update statistics when order is deleted |
| `updateOrderStatisticsDaily` | Scheduled Function | Daily statistics update at midnight UTC |
| `manualUpdateOrderStatistics` | HTTP Function | Manual trigger for statistics update |
| `calculateOrderStatistics` | Helper Function | Calculate statistics from all orders |

### User Search Index Functions
**File:** [`firebase/functions/userSearchIndex.js`](firebase/functions/userSearchIndex.js:1)

| Function | Type | Description |
|----------|------|-------------|
| `onUserCreate` | Firestore Trigger | Add user to search index on creation |
| `onUserUpdate` | Firestore Trigger | Update user in search index on change |
| `onUserDelete` | Firestore Trigger | Remove user from search index on deletion |
| `rebuildUserSearchIndex` | HTTP Function | Rebuild entire search index |
| `getUserSearchIndexStats` | HTTP Function | Get search index statistics |

### Email Service Functions
**File:** [`firebase/functions/emailService.js`](firebase/functions/emailService.js:1)

| Function | Type | Description |
|----------|------|-------------|
| `sendOTPEmail` | HTTP Function | Send OTP verification email |
| `sendOrderConfirmation` | HTTP Function | Send order confirmation email |
| `sendCustomFitEmail` | HTTP Function | Send custom fit request email |

---

## Section 5: State Management

### Context Providers

| Provider | File | Description |
|----------|------|-------------|
| AuthProvider | [`src/contexts/AuthContext.jsx`](src/contexts/AuthContext.jsx:1) | Authentication state and user data |
| AdminProvider | [`src/contexts/AdminContext.jsx`](src/contexts/AdminContext.jsx:1) | Admin authentication and permissions |
| ProductProvider | [`src/contexts/ProductContext.jsx`](src/contexts/ProductContext.jsx:1) | Product data and caching |
| CategoryProvider | [`src/contexts/CategoryContext.jsx`](src/contexts/CategoryContext.jsx:1) | Category data and management |
| CartProvider | [`src/contexts/CartContext.jsx`](src/contexts/CartContext.jsx:1) | Shopping cart state |
| ThemeContext | [`App.jsx`](App.jsx:41) | Theme (light/dark) management |

### Custom Hooks

| Hook | File | Description |
|------|------|-------------|
| `useAuth` | [`src/contexts/AuthContext.jsx`](src/contexts/AuthContext.jsx:6) | Access authentication context |
| `useAdmin` | [`src/contexts/AdminContext.jsx`](src/contexts/AdminContext.jsx:6) | Access admin context |
| `useProductContext` | [`src/contexts/ProductContext.jsx`](src/contexts/ProductContext.jsx:23) | Access product context |
| `useCategoryContext` | [`src/contexts/CategoryContext.jsx`](src/contexts/CategoryContext.jsx:7) | Access category context |
| `useCart` | [`src/contexts/CartContext.jsx`](src/contexts/CartContext.jsx:77) | Access cart context |
| `useCart` (Unified) | [`src/hooks/useCart.js`](src/hooks/useCart.js:22) | Unified cart for guest/authenticated users |
| `useWishlist` | [`src/hooks/useWishlist.js`](src/hooks/useWishlist.js:18) | Wishlist management |
| `useRealtimeCart` | [`src/hooks/useRealtimeCart.js`](src/hooks/useRealtimeCart.js:1) | Real-time cart updates |
| `useRealtimeOrders` | [`src/hooks/useRealtimeOrders.js`](src/hooks/useRealtimeOrders.js:1) | Real-time order updates |
| `useFirebaseCache` | [`src/hooks/useFirebaseCache.js`](src/hooks/useFirebaseCache.js:1) | Firebase caching utilities |
| `useProductCache` | [`src/hooks/useProductCache.js`](src/hooks/useProductCache.js:1) | Product-specific caching |
| `useCategoryCache` | [`src/hooks/useCategoryCache.js`](src/hooks/useCategoryCache.js:1) | Category-specific caching |
| `useAdminData` | [`src/hooks/admin/useAdminData.js`](src/hooks/admin/useAdminData.js:1) | Admin data management |
| `useFilters` | [`src/hooks/admin/useFilters.js`](src/hooks/admin/useFilters.js:1) | Filter management |
| `useShiprocket` | [`src/hooks/admin/useShiprocket.js`](src/hooks/admin/useShiprocket.js:1) | Shiprocket integration |

---

## Section 6: Key Features Implemented

### 1. User Authentication & Management

- **Email/Password Authentication** via Firebase Auth
- **OTP Verification** for registration and email verification
- **Admin Role Management** with special email privileges
- **User Profile Management** (name, email, phone)
- **Password Update** with re-authentication
- **Authentication State Persistence** across sessions
- **Guest User Support** with localStorage cart/wishlist
- **Auto-redirect** for admin users to dashboard
- **Logout** with cart/wishlist cleanup

**Related Files:**
- [`src/firebase/services/authService.js`](src/firebase/services/authService.js:1)
- [`src/contexts/AuthContext.jsx`](src/contexts/AuthContext.jsx:1)
- [`src/contexts/AdminContext.jsx`](src/contexts/AdminContext.jsx:1)
- [`pages/LoginPage.jsx`](pages/LoginPage.jsx:1)

### 2. Product Management

- **Product CRUD Operations** (Create, Read, Update, Delete)
- **Image Upload** to Firebase Storage
- **Image Management** (add, delete individual images)
- **Category & Subcategory** assignment
- **Stock Management** with real-time updates
- **Featured Products** flag
- **Product Search** with filtering
- **Advanced Filtering** (price, category, stock, etc.)
- **Product Caching** for performance optimization
- **Batch Product Fetch** by IDs

**Related Files:**
- [`src/firebase/services/productService.js`](src/firebase/services/productService.js:1)
- [`src/firebase/services/productQueryService.js`](src/firebase/services/productQueryService.js:1)
- [`src/contexts/ProductContext.jsx`](src/contexts/ProductContext.jsx:1)
- [`src/components/admin/ProductsManagement.jsx`](src/components/admin/ProductsManagement.jsx:1)

### 3. Pre-Order System

- **Pre-Order Product Flag** with special pricing
- **Pre-Order Period** (start/end dates)
- **Pre-Order Stock** management separate from regular stock
- **Pre-Order Limit** per customer
- **Expected Shipping Date** display
- **Pre-Order Validation** before purchase
- **Pre-Order Pricing** with discounts
- **Stock Deduction** from pre-order stock
- **Pre-Order Products** listing

**Related Files:**
- [`src/firebase/services/productService.js`](src/firebase/services/productService.js:410) (Pre-order methods)
- [`src/hooks/useCart.js`](src/hooks/useCart.js:108) (Pre-order handling)

### 4. Shopping Cart

- **Guest Cart** (localStorage)
- **User Cart** (Firebase)
- **Cart Migration** from guest to user on login
- **Real-time Cart Updates** via Firestore listeners
- **Quantity Management** (increase, decrease, remove)
- **Size/Color Selection** per item
- **Cart Total Calculation**
- **Cart Item Count** badge
- **Pre-Order Item Handling** in cart
- **Cart Persistence** across sessions

**Related Files:**
- [`src/contexts/CartContext.jsx`](src/contexts/CartContext.jsx:1)
- [`src/hooks/useCart.js`](src/hooks/useCart.js:1)
- [`src/firebase/services/cartService.js`](src/firebase/services/cartService.js:1)
- [`src/firebase/services/guestCartService.js`](src/firebase/services/guestCartService.js:1)
- [`src/hooks/useRealtimeCart.js`](src/hooks/useRealtimeCart.js:1)

### 5. Wishlist

- **Guest Wishlist** (localStorage)
- **User Wishlist** (Firebase)
- **Wishlist Migration** from guest to user
- **Add/Remove Items** from wishlist
- **Toggle Wishlist** functionality
- **Wishlist Item Count** badge
- **Wishlist Sidebar** for quick access
- **Wishlist Page** for full management
- **Real-time Sync** for authenticated users

**Related Files:**
- [`src/hooks/useWishlist.js`](src/hooks/useWishlist.js:1)
- [`src/firebase/services/cartService.js`](src/firebase/services/cartService.js:1) (User wishlist)
- [`src/firebase/services/guestWishlistService.js`](src/firebase/services/guestWishlistService.js:1)
- [`components/WishlistSidebar.jsx`](components/WishlistSidebar.jsx:1)
- [`pages/WishlistPage.jsx`](pages/WishlistPage.jsx:1)

### 6. Checkout & Payment

- **Multi-step Checkout** process
- **Address Selection** from saved addresses
- **New Address** creation during checkout
- **Payment Method Selection**
- **Razorpay Integration** for payments
- **Payment Verification** after completion
- **Order Confirmation** with email
- **Coupon Application** at checkout
- **Shipping Cost Calculation**
- **Order Summary** with all charges

**Related Files:**
- [`pages/CheckoutPage.jsx`](pages/CheckoutPage.jsx:1)
- [`src/firebase/services/paymentService.js`](src/firebase/services/paymentService.js:1)
- [`components/PaymentModal.jsx`](components/PaymentModal.jsx:1)

### 7. Coupon/Discount System

- **Coupon Creation** with flexible rules
- **Coupon Types:** Percentage and Fixed Amount
- **Coupon Validation** (active, expiry, usage limit)
- **Email-Specific Coupons**
- **Minimum Order Amount** requirement
- **Maximum Discount** limit
- **Usage Tracking** and limits
- **Coupon Statistics** dashboard
- **Coupon Activation/Deactivation**

**Related Files:**
- [`src/firebase/services/couponService.js`](src/firebase/services/couponService.js:1)
- [`src/components/admin/CouponsManagement.jsx`](src/components/admin/CouponsManagement.jsx:1)
- [`src/components/admin/CouponModal.jsx`](src/components/admin/CouponModal.jsx:1)

### 8. Order Management

- **Order Creation** with stock management
- **Order Status Tracking** (processing, shipped, delivered, cancelled)
- **Order History** for users
- **Order Details** view
- **Order Cancellation** with stock restoration
- **Tracking Number** management
- **Carrier Information**
- **Order Statistics** (total, by status, revenue)
- **Recent Orders** dashboard
- **Pre-Order Order** handling

**Related Files:**
- [`src/firebase/services/orderService.js`](src/firebase/services/orderService.js:1)
- [`pages/OrdersPage.jsx`](pages/OrdersPage.jsx:1)
- [`src/components/admin/OrdersManagement.jsx`](src/components/admin/OrdersManagement.jsx:1)
- [`firebase/functions/orderStatistics.js`](firebase/functions/orderStatistics.js:1)

### 9. Reviews & Ratings

- **Product Review** submission
- **Star Rating** system (1-5 stars)
- **Review Text** with comments
- **Average Rating** calculation
- **Review Count** per product
- **User Review** history
- **Review Management** (edit, delete)
- **Review Validation** (one review per user per product)
- **Recent Reviews** dashboard
- **Rating Statistics** auto-update

**Related Files:**
- [`src/firebase/services/reviewService.js`](src/firebase/services/reviewService.js:1)
- [`src/components/ReviewModal.jsx`](src/components/ReviewModal.jsx:1)
- [`src/components/ProductRating.jsx`](src/components/ProductRating.jsx:1)
- [`src/components/ProductRatingEnhanced.jsx`](src/components/ProductRatingEnhanced.jsx:1)

### 10. Admin Dashboard

- **Dashboard Overview** with key metrics
- **Statistics Cards** (orders, revenue, users, products)
- **Tab Navigation** for different sections
- **Products Management** (CRUD, stock, images)
- **Orders Management** (status, tracking, details)
- **Users Management** (search, view, edit)
- **Categories Management** (create, edit, delete)
- **Coupons Management** (create, validate, track)
- **Payments Management** (track, verify, refund)
- **Shipping Management** (Shiprocket integration)
- **Real-time Updates** for orders and statistics

**Related Files:**
- [`pages/AdminDashboardPage.jsx`](pages/AdminDashboardPage.jsx:1)
- [`src/components/admin/DashboardOverview.jsx`](src/components/admin/DashboardOverview.jsx:1)
- [`src/components/admin/DashboardStatsCards.jsx`](src/components/admin/DashboardStatsCards.jsx:1)
- [`src/hooks/admin/useAdminData.js`](src/hooks/admin/useAdminData.js:1)

### 11. Shipping & Logistics (Shiprocket)

- **Shiprocket Authentication** with token management
- **Order Creation** in Shiprocket
- **Courier Serviceability** check
- **Courier Selection** with rates
- **Pickup Location** management
- **Shipment Creation** for orders
- **Shipment Tracking** real-time
- **Shipping Label** generation
- **Manifest** generation
- **Pickup Scheduling**
- **Order Cancellation** in Shiprocket
- **Wallet Balance** tracking
- **Available Couriers** listing

**Related Files:**
- [`src/firebase/services/shiprocketService.js`](src/firebase/services/shiprocketService.js:1)
- [`src/hooks/admin/useShiprocket.js`](src/hooks/admin/useShiprocket.js:1)
- [`src/components/admin/ShippingManagement.jsx`](src/components/admin/ShippingManagement.jsx:1)

### 12. Email Notifications

- **OTP Email** for verification
- **Order Confirmation** emails
- **Custom Fit Request** emails
- **HTML Email Templates**
- **SMTP Configuration** (Hostinger)
- **Email Queue** handling
- **Error Handling** for failed emails

**Related Files:**
- [`firebase/functions/emailService.js`](firebase/functions/emailService.js:1)
- [`src/firebase/services/emailService.js`](src/firebase/services/emailService.js:1)

### 13. Address Management

- **Multiple Addresses** per user
- **Default Address** setting
- **Address CRUD** operations
- **Address Validation**
- **Address Selection** during checkout
- **Address Editing** modal

**Related Files:**
- [`src/firebase/services/addressService.js`](src/firebase/services/addressService.js:1)
- [`pages/AddressesPage.jsx`](pages/AddressesPage.jsx:1)
- [`src/components/admin/EditAddressModal.jsx`](src/components/admin/EditAddressModal.jsx:1)

### 14. User Search & Indexing

- **User Search** by name, email, phone
- **Search Index** collection
- **Auto-indexing** on user create/update/delete
- **Partial Matches** for autocomplete
- **Search Statistics** dashboard
- **Index Rebuilding** utility
- **Performance Optimized** queries

**Related Files:**
- [`src/firebase/services/userSearchService.js`](src/firebase/services/userSearchService.js:1)
- [`firebase/functions/userSearchIndex.js`](firebase/functions/userSearchIndex.js:1)
- [`src/components/admin/UsersManagement.jsx`](src/components/admin/UsersManagement.jsx:1)

### 15. Performance Optimizations

- **Firebase Caching** system
- **Product Cache** with TTL
- **Category Cache** with TTL
- **Query Optimization** with compound indexes
- **Batch Operations** for multiple updates
- **Real-time Listeners** for cart/orders
- **Lazy Loading** for images
- **Debounced Search** to reduce API calls
- **Memoized Components** for re-render optimization

**Related Files:**
- [`src/hooks/useFirebaseCache.js`](src/hooks/useFirebaseCache.js:1)
- [`src/hooks/useProductCache.js`](src/hooks/useProductCache.js:1)
- [`src/hooks/useCategoryCache.js`](src/hooks/useCategoryCache.js:1)
- [`src/utils/cacheUtils.js`](src/utils/cacheUtils.js:1)
- [`firestore.indexes.json`](firestore.indexes.json:1)

### 16. Additional Features

- **Theme Switching** (light/dark mode)
- **Responsive Design** (mobile, tablet, desktop)
- **Toast Notifications** for user feedback
- **Loading States** for async operations
- **Error Handling** with user-friendly messages
- **Scroll-to-Top** on route changes
- **Custom Fit Form** for personalized products
- **Brand Story** and editorial content
- **Testimonials** section
- **Hero Carousel** with promotions
- **Text Marquee** for announcements
- **Policy Pages** (privacy, terms, returns, shipping)
- **Contact Form** for inquiries
- **Social Media Integration**
- **SEO-friendly** structure

---

## Section 7: Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|----------|---------|
| React | 19.2.0 | UI Framework |
| React DOM | 19.2.0 | React DOM renderer |
| React Router DOM | 7.9.5 | Client-side routing |
| Vite | 6.2.0 | Build tool and dev server |
| Tailwind CSS | - | Utility-first CSS framework |
| Lucide React | 0.552.0 | Icon library |

### Backend Technologies

| Technology | Version | Purpose |
|------------|----------|---------|
| Firebase | 12.5.0 | Backend services (Auth, Firestore, Storage, Functions) |
| Firebase Admin | 13.6.0 | Server-side Firebase operations |
| Nodemailer | 7.0.10 | Email sending |
| Razorpay | 2.9.6 | Payment processing |

### Third-Party Integrations

| Service | Purpose |
|---------|---------|
| Firebase Authentication | User authentication and authorization |
| Firebase Firestore | NoSQL database for all data |
| Firebase Storage | File storage for product images |
| Firebase Cloud Functions | Serverless backend functions |
| Razorpay | Payment gateway integration |
| Shiprocket | Shipping and logistics API |
| Hostinger SMTP | Email service provider |

### Development Tools

| Tool | Purpose |
|------|---------|
| Vite | Fast build tool and dev server |
| ESLint | Code linting |
| Git | Version control |
| Firebase CLI | Firebase deployment and management |

---

## Section 8: Data Structures

### Firestore Collections

#### Users Collection
**Path:** `users/{userId}`

**Fields:**
- `uid` (string) - User ID
- `email` (string) - User email
- `displayName` (string) - User display name
- `isAdmin` (boolean) - Admin status
- `emailVerified` (boolean) - Email verification status
- `phoneNumber` (string) - Phone number (optional)
- `createdAt` (timestamp) - Account creation date
- `memberSince` (string) - Formatted member since date
- `isActive` (boolean) - Account active status
- `updatedAt` (timestamp) - Last update timestamp

#### Products Collection
**Path:** `products/{productId}`

**Fields:**
- `id` (string) - Product ID
- `name` (string) - Product name
- `description` (string) - Product description
- `price` (number) - Regular price
- `category` (string) - Category ID
- `categoryName` (string) - Category name
- `subcategory` (string) - Subcategory ID
- `subcategoryName` (string) - Subcategory name
- `images` (array) - Image URLs
- `stock` (number) - Available stock
- `isPreOrder` (boolean) - Pre-order flag
- `preOrderPrice` (number) - Pre-order price
- `preOrderStartDate` (timestamp) - Pre-order start date
- `preOrderEndDate` (timestamp) - Pre-order end date
- `expectedShippingDate` (timestamp) - Expected shipping date
- `preOrderStock` (number) - Pre-order stock
- `preOrderLimit` (number) - Pre-order limit per customer
- `preOrderMessage` (string) - Pre-order message
- `isFeatured` (boolean) - Featured product flag
- `averageRating` (number) - Average rating
- `reviewCount` (number) - Number of reviews
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Last update timestamp

#### Orders Collection
**Path:** `orders/{orderId}`

**Fields:**
- `id` (string) - Order ID
- `userId` (string) - User ID
- `items` (array) - Order items with product details
  - `id` (string) - Product ID
  - `name` (string) - Product name
  - `price` (number) - Price
  - `quantity` (number) - Quantity
  - `size` (string) - Selected size
  - `color` (string) - Selected color
  - `images` (array) - Product images
  - `isPreOrder` (boolean) - Pre-order flag
  - `expectedShippingDate` (timestamp) - Expected shipping date
  - `preOrderMessage` (string) - Pre-order message
- `shippingAddress` (object) - Shipping address details
- `billingAddress` (object) - Billing address details
- `subtotal` (number) - Subtotal
- `shipping` (number) - Shipping cost
- `discount` (number) - Discount amount
- `total` (number) - Total amount
- `couponCode` (string) - Applied coupon code
- `paymentMethod` (string) - Payment method
- `paymentStatus` (string) - Payment status
- `status` (string) - Order status (processing, shipped, delivered, cancelled)
- `hasPreOrderItems` (boolean) - Contains pre-order items
- `trackingNumber` (string) - Tracking number
- `carrier` (string) - Shipping carrier
- `shippedAt` (timestamp) - Shipped date
- `deliveredAt` (timestamp) - Delivered date
- `cancelledAt` (timestamp) - Cancelled date
- `cancellationReason` (string) - Cancellation reason
- `createdAt` (timestamp) - Order creation date
- `updatedAt` (timestamp) - Last update timestamp

#### Reviews Collection
**Path:** `reviews/{reviewId}`

**Fields:**
- `id` (string) - Review ID
- `productId` (string) - Product ID
- `userId` (string) - User ID
- `userName` (string) - User name
- `rating` (number) - Star rating (1-5)
- `comment` (string) - Review text
- `createdAt` (timestamp) - Review creation date
- `updatedAt` (timestamp) - Last update timestamp

#### Categories Collection
**Path:** `categories/{categoryId}`

**Fields:**
- `id` (string) - Category ID
- `name` (string) - Category name
- `slug` (string) - URL slug
- `description` (string) - Category description
- `image` (string) - Category image URL
- `parentId` (string) - Parent category ID (for subcategories)
- `order` (number) - Display order
- `isActive` (boolean) - Active status
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Last update timestamp

#### Coupons Collection
**Path:** `coupons/{couponId}`

**Fields:**
- `id` (string) - Coupon ID
- `code` (string) - Coupon code (uppercase)
- `discountType` (string) - Discount type (percentage/fixed)
- `discountValue` (number) - Discount value
- `minimumAmount` (number) - Minimum order amount
- `maxDiscount` (number) - Maximum discount amount
- `expiryDate` (timestamp) - Expiry date
- `usageLimit` (number) - Maximum usage limit
- `usedCount` (number) - Usage count
- `emailSpecific` (boolean) - Email-specific flag
- `email` (string) - Specific email
- `isActive` (boolean) - Active status
- `description` (string) - Coupon description
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Last update timestamp

#### Addresses Collection
**Path:** `addresses/{userId}`

**Fields:**
- `userId` (string) - User ID
- `addresses` (array) - Array of address objects
  - `id` (string) - Address ID
  - `fullName` (string) - Full name
  - `phone` (string) - Phone number
  - `addressLine1` (string) - Address line 1
  - `addressLine2` (string) - Address line 2
  - `city` (string) - City
  - `state` (string) - State
  - `pinCode` (string) - Postal code
  - `country` (string) - Country
  - `isDefault` (boolean) - Default address flag
- `updatedAt` (timestamp) - Last update timestamp

#### Statistics Collection
**Path:** `statistics/orders`

**Fields:**
- `total` (number) - Total orders
- `processing` (number) - Processing orders
- `shipped` (number) - Shipped orders
- `delivered` (number) - Delivered orders
- `cancelled` (number) - Cancelled orders
- `totalRevenue` (number) - Total revenue from delivered orders
- `lastUpdated` (timestamp) - Last update timestamp

#### User Search Index Collection
**Path:** `userSearchIndex/{userId}`

**Fields:**
- `userId` (string) - User ID
- `displayName` (string) - Display name
- `email` (string) - Email address
- `phoneNumber` (string) - Phone number
- `isAdmin` (boolean) - Admin status
- `isActive` (boolean) - Active status
- `searchTerms` (array) - Searchable terms
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Last update timestamp

---

## Conclusion

The HaathSaga Ecommerce Platform is a comprehensive, full-featured ecommerce solution built with modern web technologies. It provides a complete shopping experience for customers with features like product browsing, cart management, wishlist, checkout, and order tracking. The admin dashboard offers powerful tools for managing products, orders, users, coupons, and shipping logistics.

The platform leverages Firebase for backend services, providing real-time capabilities, authentication, database, storage, and serverless functions. Integration with Razorpay enables secure payment processing, while Shiprocket handles shipping and logistics.

The codebase is well-organized with clear separation of concerns, using React Context for state management, custom hooks for reusable logic, and Firebase services for data operations. Performance optimizations including caching, real-time listeners, and query optimization ensure a smooth user experience.

This documentation serves as a complete reference for understanding the platform's architecture, features, and implementation details.
