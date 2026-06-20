# ANGILU E-Commerce Platform - Comprehensive Project Guide

**Project Name:** ANGILU - Premium E-Commerce Platform  
**Project Type:** Full-Stack E-Commerce Application  
**Version:** 1.0.0  
**Last Updated:** 2026-06-20

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Why This Project Exists](#why-this-project-exists)
3. [Project Use Cases](#project-use-cases)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Key Features](#key-features)
7. [System Architecture](#system-architecture)
8. [Database Schema Overview](#database-schema-overview)
9. [Getting Started Guide](#getting-started-guide)
10. [Installation & Setup](#installation--setup)
11. [Environment Configuration](#environment-configuration)
12. [Running the Project](#running-the-project)
13. [Project Architecture Details](#project-architecture-details)
14. [Development Workflow](#development-workflow)
15. [Deployment Guide](#deployment-guide)
16. [Important Configuration Files](#important-configuration-files)
17. [External Service Integrations](#external-service-integrations)
18. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
19. [Development Guidelines](#development-guidelines)
20. [Performance Optimization](#performance-optimization)

---

## 📌 Project Overview

**ANGILU** is India's first premium 3D graphic-designed t-shirt e-commerce platform, built for the next generation of streetwear enthusiasts. The platform specializes in high-quality, uniquely designed apparel with exceptional craftsmanship and exclusive high-detail artwork.

### Key Positioning
- **Not Fast Fashion** - This is forward fashion
- **Premium Quality** - Hand-crafted, limited-edition designs
- **Unique Aesthetic** - 3D graphic design focus with artistic visuals
- **Target Audience** - Millennials and Gen Z streetwear enthusiasts

---

## 🎯 Why This Project Exists

### Problem Statement
Traditional e-commerce platforms lack:
1. **Aesthetic Design** - Poor visual storytelling
2. **Niche Focus** - Generic products for generic audiences
3. **Community** - No connection with creative audiences
4. **Storytelling** - Products presented without context or artistry

### Solution
ANGILU creates a curated premium fashion platform that:
- ✅ Tells a story with every product
- ✅ Connects with creative, forward-thinking individuals
- ✅ Offers limited-edition, unique designs
- ✅ Provides premium shopping experience
- ✅ Builds community around quality and creativity

---

## 🛍️ Project Use Cases

### 1. **Customer Shopping Experience**
- Browse curated collection of premium t-shirts, hoodies, and apparel
- View detailed product information with artistic storytelling
- Read customer reviews and ratings
- Add items to wishlist and cart
- Checkout with multiple payment options (Razorpay)

### 2. **User Account Management**
- User registration and authentication (Firebase Auth)
- Profile management and account details
- Order history and tracking
- Address management (multiple addresses support)
- Wishlist management
- Download order invoices

### 3. **Admin Operations**
- Product management (CRUD operations)
- Inventory management
- Order management and tracking
- Customer insights and analytics
- Payment and refund management
- Review and rating moderation

### 4. **Order & Logistics**
- Real-time order tracking
- Integration with Shiprocket for shipping
- Automated order notifications via email
- Multi-step order status updates

### 5. **Content Management**
- Blog and editorial content
- FAQ management
- Policy pages (Terms, Privacy, Shipping, Returns)
- Product categorization and filtering

---

## 🛠️ Technology Stack

### Frontend Technology
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 19.2.0 | UI library and component framework |
| **Build Tool** | Vite | 6.2.0 | Fast build tool and dev server |
| **Routing** | React Router DOM | 7.9.5 | Client-side navigation |
| **Styling** | Tailwind CSS | 4.2.4 | Utility-first CSS framework |
| **UI Icons** | Lucide React | 0.552.0 | Icon library |
| **Markdown** | React Markdown | 10.1.0 | Markdown rendering |
| **CSS Processing** | PostCSS | 8.5.14 | CSS transformations |
| **Error Monitoring** | Sentry | 10.32.1 | Error tracking and monitoring |

### Backend & Database
| Service | Technology | Version | Purpose |
|---------|-----------|---------|---------|
| **Database** | Firebase Firestore | 12.5.0 | Real-time NoSQL database |
| **Authentication** | Firebase Auth | 12.5.0 | User authentication |
| **Storage** | Firebase Storage | 12.5.0 | File and image storage |
| **Serverless** | Firebase Functions | 12.5.0 | Backend logic execution |
| **Analytics** | Firebase Analytics | 12.5.0 | User behavior tracking |

### External Services
| Service | Purpose | Integration |
|---------|---------|-----------|
| **Razorpay** | Payment Processing | v2.9.6 |
| **Shiprocket** | Shipping & Logistics | API v2 |
| **Nodemailer** | Email Notifications | v7.0.10 |
| **EmailJS** | Client-side Email | CDN |

### Development Tools
```json
{
  "@vitejs/plugin-react": "^5.0.0",
  "@tailwindcss/postcss": "^4.2.4",
  "tailwindcss": "^4.2.4",
  "autoprefixer": "^10.5.0"
}
```

---

## 📁 Project Structure

```
abgilu-prod/
├── 📄 Configuration Files
│   ├── package.json              # Project dependencies and scripts
│   ├── vite.config.js            # Vite build configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── firebase.json             # Firebase hosting config
│   ├── firestore.rules           # Firestore security rules
│   ├── storage.rules             # Cloud Storage security rules
│   ├── firestore.indexes.json    # Firestore index definitions
│   ├── .htaccess                 # Apache server rules
│   ├── cors-config.json          # CORS configuration
│   ├── constants.js              # App-wide constants
│   └── types.js                  # Type definitions
│
├── 📄 Entry Point
│   ├── index.html                # HTML entry point
│   ├── index.jsx                 # React entry point
│   └── App.jsx                   # Root React component
│
├── 🎨 Components/ (Reusable UI Components)
│   ├── Header.jsx                # Navigation header
│   ├── Footer.jsx                # Footer section
│   ├── ProductCard.jsx           # Product display card
│   ├── CartSidebar.jsx           # Shopping cart sidebar
│   ├── WishlistSidebar.jsx       # Wishlist sidebar
│   ├── LoginModal.jsx            # Login dialog
│   ├── PaymentModal.jsx          # Payment form
│   ├── OTPVerificationModal.jsx  # OTP verification
│   ├── Button.jsx                # Reusable button
│   ├── ScrollToTopButton.jsx     # Scroll to top
│   ├── WhatsAppWidget.jsx        # WhatsApp integration
│   ├── ToastNotification.jsx     # Toast messages
│   ├── HeroCarousel.jsx          # Image carousel
│   ├── BrandCarousel.jsx         # Brand slider
│   ├── ProductCard.css           # Product card styles
│   └── ... (20+ more components)
│
├── 📄 Pages/ (Route Pages)
│   ├── HomePage.jsx              # Landing page
│   ├── ShopPage.jsx              # Product listing
│   ├── ProductDetailPage.jsx     # Product details
│   ├── CartPage.jsx              # Shopping cart
│   ├── CheckoutPage.jsx          # Checkout flow
│   ├── LoginPage.jsx             # Login/Register
│   ├── DashboardPage.jsx         # User dashboard
│   ├── AccountDetailsPage.jsx    # User account
│   ├── OrdersPage.jsx            # Order history
│   ├── AddressesPage.jsx         # Address management
│   ├── WishlistPage.jsx          # Wishlist
│   ├── AdminDashboardPage.jsx    # Admin panel
│   ├── BlogPage.jsx              # Blog listing
│   ├── BlogPostPage.jsx          # Blog post details
│   ├── AboutPage.jsx             # About page
│   ├── ContactPage.jsx           # Contact form
│   ├── FaqsPage.jsx              # FAQ section
│   ├── SizeGuidePage.jsx         # Size guide
│   └── ... (Policy pages)
│
├── 🔧 src/ (Source Code)
│   ├── firebase/                 # Firebase configuration and services
│   │   ├── config.js             # Firebase initialization
│   │   ├── initData.js           # Database initialization
│   │   └── services/             # Firebase service functions
│   │       ├── productService.js
│   │       ├── orderService.js
│   │       ├── authService.js
│   │       ├── cartService.js
│   │       ├── categoryService.js
│   │       ├── couponService.js
│   │       ├── reviewService.js
│   │       ├── paymentService.js
│   │       └── ... (15+ services)
│   │
│   ├── contexts/                 # React Context API
│   │   ├── AuthContext.jsx       # Auth state management
│   │   ├── CartContext.jsx       # Cart state management
│   │   ├── ProductContext.jsx    # Products state
│   │   ├── CategoryContext.jsx   # Categories state
│   │   ├── AdminContext.jsx      # Admin state
│   │   ├── StoreContext.jsx      # Unified store state
│   │   └── ThemeContext.jsx      # Theme state (dark/light)
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useCart.js            # Cart operations
│   │   ├── useWishlist.js        # Wishlist operations
│   │   ├── useRealtimeCart.js    # Real-time cart sync
│   │   ├── useRealtimeOrders.js  # Real-time orders
│   │   ├── useProductCache.js    # Product caching
│   │   ├── useCategoryCache.js   # Category caching
│   │   ├── useFirebaseCache.js   # Firebase cache
│   │   └── admin/                # Admin-specific hooks
│   │
│   ├── utils/                    # Utility functions
│   │   ├── scrollUtils.js        # Scroll operations
│   │   ├── errorHandler.js       # Error handling
│   │   ├── adminUtils.js         # Admin utilities
│   │   └── ... (More utilities)
│   │
│   ├── components/               # Additional components
│   │   └── ErrorBoundary.jsx     # Error boundary
│   │
│   └── index.css                 # Global styles
│
├── 🔥 firebase/ (Backend)
│   ├── functions/                # Cloud Functions
│   │   ├── index.js              # Functions entry
│   │   ├── package.json          # Functions dependencies
│   │   ├── emailService.js       # Email notifications
│   │   ├── shiprocketService.js  # Shipping integration
│   │   ├── orderStatistics.js    # Analytics
│   │   └── userSearchIndex.js    # Search indexing
│   │
│   └── test.cjs                  # Cloud Functions tests
│
├── 📚 Design/ (Documentation)
│   ├── HLD.md                    # High-level design
│   ├── LLD.md                    # Low-level design
│   ├── HLD.html                  # HLD (HTML version)
│   ├── LLD.html                  # LLD (HTML version)
│   └── Comprehensive_Design_Document.html
│
├── 📦 public/ (Static Assets)
│   └── (Images, favicon, etc.)
│
├── 📝 Documentation Files
│   ├── README.md                 # Quick start
│   ├── metadata.json             # App metadata
│   ├── colors.txt                # Color palette
│   ├── 404.html                  # 404 error page
│   └── ignoreFile                # Ignore list
│
└── 🗂️ Dump/ (Reference & Archived)
    ├── DEPLOYMENT_SUMMARY.md
    ├── FIREBASE_OPTIMIZATION_ANALYSIS.md
    ├── ADMIN_SETUP.md
    ├── Shiprocket API.postman_collection.json
    └── ... (Setup and debug files)
```

---

## ✨ Key Features

### 1. **Product Management**
- Dynamic product catalog with filtering and search
- Multiple product categories (T-Shirts, Hoodies, Oversized T-Shirts)
- Product variants (sizes, colors)
- Product rating and reviews system
- Wishlist functionality

### 2. **Shopping Cart**
- Add/remove products
- Quantity management
- Real-time cart updates
- Cart persistence (localStorage and Firebase)
- Guest cart support

### 3. **Authentication**
- Email/password registration
- OTP-based verification
- Firebase Authentication
- Role-based access (User/Admin)
- Session management

### 4. **Checkout & Payment**
- Multi-step checkout process
- Address management (save multiple addresses)
- Razorpay payment integration
- Order confirmation
- Invoice generation and download

### 5. **Order Management**
- Order history
- Order status tracking
- Order details viewing
- Invoice download
- Return/refund requests

### 6. **Shipping Integration**
- Shiprocket API integration
- Real-time shipment tracking
- Courier selection
- Pickup location management
- Shipping cost calculation

### 7. **Admin Dashboard**
- Product management (CRUD)
- Order management
- User analytics
- Payment tracking
- Review moderation
- Inventory management

### 8. **User Account**
- Profile management
- Address book
- Order history
- Wishlist management
- Email preferences

### 9. **Content Management**
- Blog/Editorial content
- FAQ section
- Policy pages (Terms, Privacy, Shipping, Returns)
- About page
- Contact form

### 10. **Additional Features**
- Dark/Light theme toggle
- Responsive design (Mobile, Tablet, Desktop)
- Error monitoring (Sentry integration)
- Analytics tracking
- WhatsApp widget integration
- Toast notifications
- Scroll-to-top button

---

## 🏗️ System Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  USER BROWSER                       │
│               (React SPA - Vite App)                │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    ┌────────┐  ┌──────────┐  ┌─────────┐
    │ React  │  │ Router   │  │Contexts │
    │Component│  │(Navigation)│(State)  │
    └────────┘  └──────────┘  └─────────┘
        │            │            │
        └────────────┼────────────┘
                     │
        ┌────────────▼────────────┐
        │   Services Layer       │
        │  (Firebase Services)   │
        └────────────┬────────────┘
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ▼               ▼               ▼
 ┌──────────┐  ┌──────────┐  ┌──────────────┐
 │ Firebase │  │ Firebase │  │ External     │
 │Firestore │  │ Storage  │  │ APIs         │
 │(Database)│  │(Files)   │  │ (Razorpay,   │
 └──────────┘  └──────────┘  │ Shiprocket)  │
                              └──────────────┘
```

### Data Flow

```
1. User Interaction
   └─> Component State Update
       └─> Context API Updates
           └─> Service Layer Call
               └─> Firebase/External API
                   └─> Response Handling
                       └─> UI Re-render
```

### Component Hierarchy

```
App
├── ErrorBoundary
│   ├── Header (Navigation)
│   ├── Main Routes
│   │   ├── HomePage
│   │   ├── ShopPage
│   │   ├── ProductDetailPage
│   │   ├── CartPage
│   │   ├── CheckoutPage
│   │   ├── LoginPage
│   │   ├── DashboardPage
│   │   ├── AdminDashboardPage
│   │   └── ... (More pages)
│   ├── CartSidebar (Overlay)
│   ├── WishlistSidebar (Overlay)
│   ├── LoginModal (Dialog)
│   ├── Footer
│   └── ScrollToTopButton
```

---

## 💾 Database Schema Overview

### Firestore Collections

#### 1. **users** Collection
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  displayName: "User Name",
  createdAt: timestamp,
  lastLogin: timestamp,
  preferences: {
    newsletter: boolean,
    notifications: boolean
  },
  role: "customer" | "admin"
}
```

#### 2. **products** Collection
```javascript
{
  id: "product_id",
  name: "Product Name",
  category: "t-shirts" | "hoodies" | "oversized-t-shirts",
  price: 5999,
  originalPrice: 7999,
  description: "Product description",
  images: ["url1", "url2", ...],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  colors: ["Black", "White", ...],
  fabric: "Premium Cotton",
  stock: 50,
  rating: 4.5,
  reviews: number,
  tags: ["new", "sale", "popular"],
  position: 1,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 3. **orders** Collection
```javascript
{
  id: "order_id",
  userId: "user_id",
  orderNumber: "ORD-001",
  items: [
    {
      productId: "product_id",
      name: "Product",
      quantity: 1,
      price: 5999,
      size: "M",
      color: "Black"
    }
  ],
  total: 5999,
  subtotal: 5999,
  tax: 0,
  shippingCost: 100,
  discountAmount: 0,
  paymentMethod: "razorpay",
  paymentId: "pay_12345",
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
  shippingAddress: {...},
  billingAddress: {...},
  shiprocketOrderId: "ship_id",
  trackingNumber: "Track123",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 4. **cart** (Subcollection under users)
```javascript
{
  userId: "user_id",
  items: [
    {
      productId: "product_id",
      quantity: 1,
      selectedSize: "M",
      selectedColor: "Black",
      addedAt: timestamp
    }
  ],
  lastUpdated: timestamp
}
```

#### 5. **reviews** Collection
```javascript
{
  id: "review_id",
  productId: "product_id",
  userId: "user_id",
  userName: "User Name",
  rating: 5,
  title: "Great quality!",
  text: "Review text...",
  helpful: 12,
  createdAt: timestamp,
  verified: true
}
```

#### 6. **categories** Collection
```javascript
{
  id: "category_id",
  name: "T-Shirts",
  slug: "t-shirts",
  description: "Description",
  image: "url",
  parentCategory: "apparel",
  position: 1
}
```

#### 7. **addresses** (Subcollection under users)
```javascript
{
  id: "address_id",
  fullName: "Name",
  phone: "9876543210",
  email: "user@example.com",
  addressLine1: "123 Street",
  addressLine2: "Apt 4",
  city: "City",
  state: "State",
  pincode: "12345",
  country: "Country",
  isDefault: true,
  type: "home" | "office" | "other"
}
```

#### 8. **wishlist** (Subcollection under users)
```javascript
{
  productId: "product_id",
  addedAt: timestamp
}
```

---

## 🚀 Getting Started Guide

### Quick Start (5 minutes)

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- Firebase account
- Razorpay account
- Shiprocket account

#### Step 1: Clone the Repository
```bash
cd c:\abgilu-prod\abgilu-prod
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure Environment Variables
Create `.env.local` file (see Environment Configuration section)

#### Step 4: Start Development Server
```bash
npm run dev
```

#### Step 5: Open in Browser
Navigate to `http://localhost:5173` (default Vite port)

---

## 📦 Installation & Setup

### Detailed Setup Instructions

#### 1. **Prerequisites Installation**

**Windows:**
```bash
# Check Node.js version
node --version  # Should be v16+
npm --version   # Should be v8+

# If not installed, download from nodejs.org
```

**macOS/Linux:**
```bash
# Using Homebrew (macOS)
brew install node

# Using apt (Ubuntu/Debian)
sudo apt-get install nodejs npm
```

#### 2. **Repository Setup**

```bash
# Navigate to project directory
cd c:\abgilu-prod\abgilu-prod

# Clone any updates (if using git)
git clone <repository-url>
cd abgilu-prod

# Install dependencies
npm install

# Verify installation
npm list react  # Should show React 19.2.0
```

#### 3. **Create Environment File**

Create `.env.local` in root directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC0QU2BLabGySxm3NL8rDHEKWbjX3rX6yk
VITE_FIREBASE_AUTH_DOMAIN=angilu-dev-e1042.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=angilu-dev-e1042
VITE_FIREBASE_STORAGE_BUCKET=angilu-dev-e1042.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=603257310608
VITE_FIREBASE_APP_ID=1:603257310608:web:f279083afbfd54240db715
VITE_FIREBASE_MEASUREMENT_ID=G-LZNNPED5PQ

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# Shiprocket Configuration
VITE_SHIPROCKET_API_KEY=your_shiprocket_api_key

# Email Configuration (for backend)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Admin Email (for verification)
VITE_ADMIN_EMAIL=admin@angilu.com
```

#### 4. **Install Dependencies**

```bash
# Install all npm packages
npm install

# Install specific packages if needed
npm install firebase react-router-dom razorpay

# For development
npm install --save-dev vite @vitejs/plugin-react tailwindcss postcss
```

#### 5. **Verify Installation**

```bash
# Check all dependencies
npm list

# Run linter (if configured)
npm run lint

# Test build
npm run build
```

---

## ⚙️ Environment Configuration

### Environment Variables Explanation

#### Firebase Configuration
```env
# These are provided by Firebase Console
VITE_FIREBASE_API_KEY         # Public API key for frontend
VITE_FIREBASE_AUTH_DOMAIN     # Authentication domain
VITE_FIREBASE_PROJECT_ID      # Firebase project ID
VITE_FIREBASE_STORAGE_BUCKET  # Cloud Storage bucket
VITE_FIREBASE_MESSAGING_SENDER_ID  # For messaging
VITE_FIREBASE_APP_ID          # App identifier
VITE_FIREBASE_MEASUREMENT_ID  # Analytics measurement ID
```

#### Third-Party Services
```env
VITE_RAZORPAY_KEY_ID          # Razorpay merchant key
VITE_SHIPROCKET_API_KEY       # Shiprocket API token
VITE_EMAILJS_SERVICE_ID       # EmailJS service ID
VITE_EMAILJS_TEMPLATE_ID      # EmailJS template
VITE_EMAILJS_PUBLIC_KEY       # EmailJS public key
VITE_ADMIN_EMAIL              # Admin email address
```

### Setting Up Each Service

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or select existing
3. Get Web App credentials
4. Copy values to `.env.local`

#### Razorpay Setup
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Get API Keys from Settings
3. Use Key ID in `.env.local`
4. Keep Key Secret in backend only

#### Shiprocket Setup
1. Go to [Shiprocket Dashboard](https://www.shiprocket.in/login)
2. Generate API token
3. Add to `.env.local`
4. Configure pickup location in settings

#### EmailJS Setup
1. Go to [EmailJS Console](https://dashboard.emailjs.com)
2. Create email service
3. Get Service, Template, and Public Key IDs
4. Add to `.env.local`

---

## 🏃 Running the Project

### Development Mode

```bash
# Start development server
npm run dev

# Output:
# ✓ built in 1.23s
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help

# Open browser and navigate to http://localhost:5173
```

**Features in Dev Mode:**
- Hot Module Replacement (HMR)
- Source maps for debugging
- Console errors display
- Fast refresh on file changes

### Production Build

```bash
# Build for production
npm run build

# This will:
# 1. Compile React components
# 2. Optimize code splitting
# 3. Generate dist/ folder
# 4. Copy static files (.htaccess, 404.html)
# 5. Output size report

# Verify build
ls -la dist/
```

### Preview Production Build

```bash
# Preview built version locally
npm run preview

# Navigate to http://localhost:4173
```

### Build Output Structure

```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-xxxxx.js  # Main bundle
│   ├── vendor-xxxxx.js # React/React-DOM
│   ├── router-xxxxx.js # React Router
│   └── index.css       # Compiled styles
├── 404.html            # 404 error page
└── .htaccess           # Server configuration
```

---

## 🔧 Project Architecture Details

### State Management Architecture

#### Global State (React Context)

```javascript
// Example: How state flows through app

// 1. StoreContext - Unified state management
const { cartItems, wishlistItems } = useStore();

// 2. Individual Contexts
const { user, isAdmin } = useAdmin();
const { products, loading } = useProduct();
const { theme, toggleTheme } = useTheme();

// 3. Context Provider Hierarchy
<BrowserRouter>
  <ErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <ProductProvider>
            <CategoryProvider>
              <CartProvider>
                <StoreProvider>
                  <App />
                </StoreProvider>
              </CartProvider>
            </CategoryProvider>
          </ProductProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
</BrowserRouter>
```

### Service Layer Architecture

```
Components
    ↓
React Hooks (useCart, useProduct, etc.)
    ↓
Context API (State Management)
    ↓
Service Functions (cartService, productService)
    ↓
Firebase SDK
    ↓
Firebase Backend / External APIs
```

### Firebase Service Architecture

```
firebaseServices/
├── authService.js           # User authentication
├── productService.js        # Product operations
├── cartService.js           # Shopping cart
├── orderService.js          # Order management
├── categoryService.js       # Categories
├── reviewService.js         # Reviews/ratings
├── paymentService.js        # Payment integration
├── adminPaymentService.js   # Admin payment ops
└── ... (More services)

Each service module contains:
- Firestore CRUD operations
- Real-time listeners
- Data transformations
- Error handling
- Caching logic
```

### Real-time Features

```javascript
// Real-time cart updates across tabs
useRealtimeCart() - Syncs cart across browser tabs

// Real-time orders
useRealtimeOrders() - Watches for order changes

// Real-time wishlist
useRealtimeWishlist() - Syncs wishlist updates
```

---

## 💻 Development Workflow

### Component Development Workflow

#### 1. **Create New Component**

```javascript
// src/components/NewComponent.jsx
import React, { useState } from 'react';

export default function NewComponent() {
  const [state, setState] = useState('');

  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-lg font-bold">{state}</h2>
    </div>
  );
}
```

#### 2. **Use in Page**

```javascript
// pages/HomePage.jsx
import NewComponent from '../components/NewComponent';

export default function HomePage() {
  return (
    <div>
      <NewComponent />
    </div>
  );
}
```

#### 3. **Add Styling**

```tailwind
/* Use Tailwind classes in component */
<div className="
  bg-gradient-to-r from-black to-gray-900
  p-4 sm:p-6 lg:p-8
  rounded-lg
  shadow-lg
  hover:shadow-xl
  transition-shadow duration-300
">
```

#### 4. **Test in Dev Server**

```bash
npm run dev
# Component hot-reloads on save
```

### Firebase Integration

#### Adding Firestore Query

```javascript
// In service file
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config';

export async function getProductsByCategory(categoryId) {
  const q = query(
    collection(db, 'products'),
    where('category', '==', categoryId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

#### Using in Component

```javascript
import { useEffect, useState } from 'react';
import { getProductsByCategory } from '../services/productService';

export function ProductList({ categoryId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsByCategory(categoryId).then(setProducts);
  }, [categoryId]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Adding New Routes

```javascript
// Update App.jsx
import NewPage from './pages/NewPage';

<Routes>
  {/* Existing routes */}
  <Route path="/new-page" element={<NewPage />} />
</Routes>
```

---

## 🚢 Deployment Guide

### Pre-Deployment Checklist

- [ ] All `.env` variables configured
- [ ] No console errors in dev mode
- [ ] Build succeeds: `npm run build`
- [ ] All features tested locally
- [ ] Firebase rules updated
- [ ] Error monitoring configured

### Deployment to Firebase Hosting

#### 1. **Install Firebase CLI**

```bash
npm install -g firebase-tools
```

#### 2. **Login to Firebase**

```bash
firebase login
```

#### 3. **Initialize Firebase Project**

```bash
firebase init
# Select: Hosting, Firestore, Storage, Functions
# Project: angilu-dev-e1042
# Public directory: dist
# Configure SPA rewrites: Yes
```

#### 4. **Build Project**

```bash
npm run build
```

#### 5. **Deploy**

```bash
# Deploy everything
firebase deploy

# Or specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only storage
firebase deploy --only functions
```

### Deployment Output

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/angilu-dev-e1042
Hosting URL: https://angilu-dev-e1042.firebaseapp.com
```

### Post-Deployment Verification

```bash
# Test deployed site
https://angilu-dev-e1042.firebaseapp.com

# Check error monitoring
https://sentry.io/your-org/your-project/

# View analytics
Firebase Console > Analytics
```

---

## 📄 Important Configuration Files

### 1. **vite.config.js**

```javascript
// Build configuration
export default {
  plugins: [react()],
  build: {
    outDir: 'dist',           // Output directory
    sourcemap: false,         // No source maps in prod
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  server: {
    historyApiFallback: true,  // SPA routing
    proxy: {                    // API proxy
      '/shiprocket-api': {
        target: 'https://apiv2.shiprocket.in/v1/external',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shiprocket-api/, '')
      }
    }
  }
}
```

### 2. **tailwind.config.js**

```javascript
// Custom theme
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette
        black: '#4c0e0e',      // Deep crimson black
        terracotta: '#6B0F10'  // Brand color
      }
    },
    content: [
      './index.html',
      './src/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './pages/**/*.{js,jsx}'
    ]
  }
}
```

### 3. **firebase.json**

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "firebase/functions"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### 4. **firestore.rules**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow read/write for authenticated users
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Allow read for products
    match /products/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Helper function
    function isAdmin() {
      return request.auth.token.admin == true;
    }
  }
}
```

### 5. **storage.rules**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Allow read all
    match /{allPaths=**} {
      allow read;
    }
    
    // Allow write for authenticated
    match /uploads/{uid}/{allPaths=**} {
      allow write: if request.auth.uid == uid;
    }
  }
}
```

---

## 🔗 External Service Integrations

### Razorpay Payment Integration

#### How It Works

```javascript
// 1. Create order on backend
const razorpayOrder = await createRazorpayOrder(amount);

// 2. Open Razorpay modal
const options = {
  key: RAZORPAY_KEY_ID,
  amount: amount * 100,  // In paise
  currency: "INR",
  name: "ANGILU",
  description: "Premium T-Shirts",
  order_id: razorpayOrder.id,
  handler: handlePaymentSuccess,
  prefill: {
    email: user.email,
    contact: user.phone
  }
};

const rzp = new window.Razorpay(options);
rzp.open();

// 3. Verify payment on backend
await verifyRazorpaySignature(payment);
```

### Shiprocket Shipping Integration

#### How It Works

```javascript
// 1. Create shipment
const shipment = await createShipment({
  order_id: orderId,
  courier_id: courierId
});

// 2. Get tracking details
const tracking = await getTrackingDetails(shipment.shipment_id);

// 3. Update order with tracking
await updateOrderTracking(orderId, tracking);
```

### Firebase Cloud Functions

#### Email Notification Function

```javascript
// firebase/functions/emailService.js
exports.sendOrderConfirmation = functions
  .firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    
    // Send email
    await nodemailer.sendMail({
      to: order.userEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `<h1>Order Confirmed!</h1>...`
    });
  });
```

---

## 🆘 Common Issues & Troubleshooting

### Issue 1: Firebase Connection Failed

**Problem:**
```
Error: Firebase config is not initialized
```

**Solution:**
```javascript
// Check .env.local has all Firebase keys
// Verify .env.local is in root directory
// Restart dev server: npm run dev

// In config.js, verify:
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  // ... all keys present
};
```

### Issue 2: Razorpay Payment Not Loading

**Problem:**
```
Razorpay is not defined
```

**Solution:**
```html
<!-- Ensure script in index.html -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Issue 3: Build Size Too Large

**Problem:**
```
Bundle size warning during build
```

**Solution:**
```javascript
// vite.config.js - Check code splitting
rollupOptions: {
  output: {
    manualChunks: {
      'react': ['react', 'react-dom'],
      'router': ['react-router-dom']
    }
  }
}
```

### Issue 4: Firestore Rules Permission Denied

**Problem:**
```
Missing or insufficient permissions
```

**Solution:**
```
// Update firestore.rules
match /products/{document=**} {
  allow read: if true;  // Public read
  allow write: if isAdmin();
}

// Deploy rules
firebase deploy --only firestore:rules
```

### Issue 5: Hot Reload Not Working

**Problem:**
```
Page not updating on file changes
```

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

### Issue 6: Environment Variables Not Loading

**Problem:**
```
process.env.VITE_FIREBASE_API_KEY is undefined
```

**Solution:**
```javascript
// Vite requires VITE_ prefix
// ✅ Correct:  VITE_FIREBASE_API_KEY
// ❌ Wrong:    FIREBASE_API_KEY

// Access in code:
import.meta.env.VITE_FIREBASE_API_KEY

// Not:
process.env.VITE_FIREBASE_API_KEY
```

---

## 📋 Development Guidelines

### Code Style

#### React Components

```javascript
// ✅ Good - Functional component with hooks
export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <button onClick={handleWishlist}>
        {isWishlisted ? '❤️' : '🤍'}
      </button>
    </div>
  );
}

// ❌ Bad - Class component or improper hooks
class ProductCard extends React.Component {
  // Outdated pattern
}
```

#### Naming Conventions

```javascript
// Components - PascalCase
ProductCard.jsx
UserDashboard.jsx

// Functions/Variables - camelCase
const getProductById = async (id) => {};
const [isLoading, setIsLoading] = useState(false);

// Constants - UPPER_SNAKE_CASE
const MAX_PRODUCTS_PER_PAGE = 12;
const FIREBASE_CONFIG = {...};

// Private functions - leadingUnderscore
const _formatPrice = (price) => {};
```

#### Tailwind CSS Usage

```javascript
// ✅ Good - Organized classes
<div className="
  bg-white 
  rounded-lg 
  shadow-md 
  p-4 
  hover:shadow-lg 
  transition-shadow 
  duration-300
">

// ❌ Bad - Messy inline
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">

// ❌ Very Bad - Mixing inline styles
<div style={{backgroundColor: 'white'}} className="p-4">
```

### File Organization

```
src/
├── components/        # Reusable components only
│   ├── Button.jsx
│   ├── Card.jsx
│   └── Modal.jsx
│
├── pages/            # Page/Route components
│   ├── HomePage.jsx
│   └── ProductPage.jsx
│
├── firebase/
│   ├── config.js
│   └── services/
│       └── productService.js
│
├── contexts/         # State management
│   └── ProductContext.jsx
│
├── hooks/            # Custom hooks
│   └── useProduct.js
│
└── utils/            # Helper functions
    └── helpers.js
```

### Commit Guidelines

```bash
# ✅ Good commit messages
git commit -m "feat: Add wishlist functionality to product cards"
git commit -m "fix: Resolve Firebase auth timeout issue"
git commit -m "refactor: Simplify cart context logic"

# ❌ Bad commit messages
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

---

## ⚡ Performance Optimization

### Image Optimization

```javascript
// Use responsive images
<img 
  src={product.image}
  srcSet={`
    ${product.image}?w=300 300w,
    ${product.image}?w=600 600w,
    ${product.image}?w=900 900w
  `}
  sizes="(max-width: 600px) 300px, (max-width: 1200px) 600px, 900px"
  alt={product.name}
/>
```

### Code Splitting

```javascript
// Lazy load pages
import { lazy, Suspense } from 'react';

const AdminPage = lazy(() => import('./pages/AdminPage'));

<Suspense fallback={<Loading />}>
  <AdminPage />
</Suspense>
```

### Firebase Optimization

```javascript
// Use collection groups for queries
const q = query(
  collection(db, 'users'),
  where('verified', '==', true),
  limit(100)
);

// Index frequently queried fields
// (Configure in Firebase Console or firestore.indexes.json)
```

### Caching Strategy

```javascript
// Cache products for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

const getProductsWithCache = async () => {
  const cached = sessionStorage.getItem('products');
  if (cached) return JSON.parse(cached);
  
  const products = await fetchProducts();
  sessionStorage.setItem('products', JSON.stringify(products));
  return products;
};
```

---

## 📞 Support & Resources

### Documentation
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com)

### Project Documentation
- [HLD.md](./Design/HLD.md) - High-Level Design
- [LLD.md](./Design/LLD.md) - Low-Level Design
- [README.md](./README.md) - Quick Start

### External Services Docs
- [Razorpay Integration](https://razorpay.com/docs/payments/server-side/integration/)
- [Shiprocket API](https://www.shiprocket.in/api-details)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Firebase
firebase login          # Login to Firebase
firebase deploy         # Deploy to Firebase
firebase functions:log  # View Cloud Functions logs

# Debugging
npm run dev -- --inspect  # Debug with Node inspector
# Then open chrome://inspect

# Clean cache
npm cache clean --force
rm -rf dist node_modules
npm install
```

---

## 🎓 Learning Paths

### For Frontend Developers
1. Learn React fundamentals → Context API → Hooks
2. Study Tailwind CSS layout and components
3. Master React Router for navigation
4. Practice Firebase Firestore queries
5. Implement error handling and loading states

### For Backend Developers
1. Learn Cloud Functions syntax
2. Study Firestore security rules
3. Understand Razorpay and Shiprocket APIs
4. Practice email notifications
5. Implement analytics and reporting

### For Full-Stack Developers
1. Complete frontend path
2. Complete backend path
3. Learn deployment and CI/CD
4. Study performance optimization
5. Master error monitoring and debugging

---

## 📊 Project Metrics

### Current Stack Overview

| Aspect | Details |
|--------|---------|
| **Framework** | React 19.2.0 |
| **Build Tool** | Vite 6.2.0 |
| **Database** | Firebase Firestore |
| **Hosting** | Firebase Hosting |
| **Payment** | Razorpay |
| **Shipping** | Shiprocket |
| **Styling** | Tailwind CSS |
| **Components** | 30+ reusable components |
| **Pages** | 23+ route pages |
| **Services** | 15+ Firebase services |

### Development Timeline

- **Phase 1**: Setup and basic structure
- **Phase 2**: Product catalog and shopping cart
- **Phase 3**: User authentication and accounts
- **Phase 4**: Payment and checkout
- **Phase 5**: Admin dashboard
- **Phase 6**: Shipping integration
- **Phase 7**: Performance optimization
- **Phase 8**: Deployment and monitoring

---

## 🔐 Security Best Practices

### Frontend Security
```javascript
// ✅ Sanitize user input
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '');
};

// ✅ Never store sensitive data in localStorage
// Store only session tokens, not passwords

// ✅ Use HTTPS only
// Configure in firebase.json

// ✅ Validate on both client and server
```

### Firebase Security Rules
```
// ✅ Only authenticated users can write
match /orders/{orderId} {
  allow read: if request.auth.uid == resource.data.userId;
  allow write: if false;  // Backend only
}

// ✅ Public read, authenticated write
match /reviews/{reviewId} {
  allow read: if true;
  allow write: if request.auth != null && isNewReview();
}
```

---

## 🎉 Conclusion

**ANGILU** is a modern, feature-rich e-commerce platform combining:
- ✅ Beautiful React UI
- ✅ Scalable Firebase backend
- ✅ Real-time inventory and orders
- ✅ Seamless payment integration
- ✅ Professional shipping management
- ✅ Admin capabilities
- ✅ Mobile-responsive design

### Next Steps
1. Complete environment setup
2. Run development server
3. Explore components and pages
4. Test features locally
5. Deploy to Firebase
6. Monitor and optimize

### Contact & Support
For issues or questions:
- Check Design documentation
- Review service implementations
- Test in dev mode
- Monitor error logs with Sentry

---

## 📝 Quick Reference

### Port Numbers
- Development: `http://localhost:5173`
- Firebase Emulator: `http://localhost:8080`
- Functions Emulator: `http://localhost:5001`

### Key Folders
- Components: `./components/`
- Pages: `./pages/`
- Services: `./src/firebase/services/`
- Contexts: `./src/contexts/`
- Utilities: `./src/utils/`

### Important Files
- Config: `./src/firebase/config.js`
- Types: `./types.js`
- Constants: `./constants.js`
- Tailwind: `./tailwind.config.js`
- Vite: `./vite.config.js`

### Deployment
- Build: `npm run build`
- Deploy: `firebase deploy`
- Preview: `npm run preview`

---

**Happy coding! 🚀 ANGILU**
