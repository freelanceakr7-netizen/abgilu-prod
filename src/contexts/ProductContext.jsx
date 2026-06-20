import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  getProductsWithStock,
  getAllProducts,
  getProductsByCategoryOrSubcategory,
  getFeaturedProducts as getFeaturedProductsService
} from '../firebase/services/productService';
import {
  getProductsByFilters,
  searchProducts as searchProductsOptimized,
  invalidateProductCache as invalidateProductCacheService
} from '../firebase/services/productQueryService';
import { useFirebaseCache } from '../hooks/useFirebaseCache';
import {
  getCachedData,
  setCachedData,
  invalidateCachePattern as invalidateCacheUtil,
  generateCacheKey as generateCacheKeyUtil
} from '../utils/cacheUtils';

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Black Bloom Flyers T-Shirt',
    category: 'T-Shirts',
    subcategory: 'Streetwear',
    price: 8200,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '2',
    name: 'Grey Tiger T-Shirt',
    category: 'T-Shirts',
    subcategory: 'Streetwear',
    price: 4700,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '3',
    name: 'Grey Alpha Descent T-Shirt',
    category: 'T-Shirts',
    subcategory: 'Streetwear',
    price: 5800,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '4',
    name: 'Green Alpha Descent T-Shirt',
    category: 'T-Shirts',
    subcategory: 'Streetwear',
    price: 5800,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80']
  }
];

const ProductContext = createContext();

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const { getCachedData: getFirebaseCachedData, setCachedData: setFirebaseCachedData, invalidateCache: invalidateFirebaseCache } = useFirebaseCache();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastFetchTimeRef = useRef(0);
  const productsRef = useRef([]);
  const pendingFetchesRef = useRef(new Map());

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const generateCacheKey = useCallback((options = {}) => {
    const { includeStock = true, category = null, subcategory = null, filters = {} } = options;
    const cacheData = {
      type: 'products',
      includeStock,
      ...(category && { category }),
      ...(subcategory && { subcategory }),
      ...filters
    };
    return generateCacheKeyUtil(cacheData);
  }, []);

  const fetchProducts = useCallback(async (options = {}) => {
    const {
      includeStock = true,
      category = null,
      subcategory = null,
      filters = {},
      forceRefresh = false
    } = options;
    
    const cacheKey = generateCacheKeyUtil({ type: 'products', includeStock, category, subcategory, filters });
    
    // Check if a fetch is already in progress for this key
    if (pendingFetchesRef.current.has(cacheKey)) {
      console.log(`ProductContext using existing pending fetch for ${cacheKey}`);
      return pendingFetchesRef.current.get(cacheKey);
    }

    // Check cache first — use !== null so empty arrays are not mistaken for cache miss
    if (!forceRefresh) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData !== null && cachedData.length > 0) {
        console.log(`ProductContext cache hit for ${cacheKey}`);
        setProducts(cachedData);
        setLoading(false);
        return cachedData;
      }
    }
    
    // Check if we recently fetched (within last 30 seconds) to avoid rapid successive calls
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTimeRef.current < 30000 && productsRef.current.length > 0) {
      console.log('ProductContext using recent data to avoid rapid refetch');
      return productsRef.current;
    }
    
    setLoading(true);
    setError(null);
    lastFetchTimeRef.current = now;
    
    // Create the fetch promise
    const fetchPromise = (async () => {
      try {
        console.log(`ProductContext fetching products from Firebase for ${cacheKey}...`);
      
        // Network fetch with 2.5s "Soft Timeout"
        const networkPromise = (async () => {
          let fetchedData;
          
          // Use optimized query service for complex filters
          if (Object.keys(filters).length > 0 || category || subcategory) {
            const queryFilters = {
              ...filters,
              ...(category && { category }),
              ...(subcategory && { subcategory })
            };
            
            const queryOptions = { includeStock };
            fetchedData = await getProductsByFilters(queryFilters, queryOptions);
          } else if (includeStock) {
            fetchedData = await getProductsWithStock();
          } else {
            fetchedData = await getAllProducts();
          }
          return fetchedData;
        })();

        const timeoutPromise = new Promise((resolve) => 
          setTimeout(() => resolve('TIMEOUT'), 10000) // Increased to 10s for better robustness
        );

        let productsData = await Promise.race([networkPromise, timeoutPromise]);
        
        // If we timeout, use current state
        if (productsData === 'TIMEOUT') {
          console.warn(`ProductContext: Network soft timeout (10s) hit for ${cacheKey}. Using previous state.`);
          productsData = productsRef.current; 
        } else {
          console.log(`ProductContext: Fetched ${productsData ? productsData.length : 0} products from Firebase.`);
          if (!productsData || productsData.length === 0) {
            console.log('ProductContext: Firebase DB returned empty array for products.');
            productsData = [];
          }
        }
        
        setProducts(productsData);
        productsRef.current = productsData;
        // Only cache non-empty results to prevent a slow/failed first load from
        // blocking real data for the entire 5-minute cache window
        if (productsData.length > 0) {
          setCachedData(cacheKey, productsData);
        } else {
          // Schedule a retry for 3 seconds later to handle slow cold-start
          console.warn('ProductContext: Got empty product list — will retry in 3s');
          setTimeout(() => fetchProducts({ forceRefresh: true }), 3000);
        }
        setLoading(false);
        
        return productsData;
      } catch (err) {
        console.error('ProductContext error fetching products:', err);
        // Only set error if we don't have any data at all
        if (productsRef.current.length === 0) {
          setError(err.message || 'Failed to fetch products');
        }
        setLoading(false);
        return productsRef.current.length > 0 ? productsRef.current : [];
      } finally {
        // Remove from pending fetches when done
        pendingFetchesRef.current.delete(cacheKey);
      }
    })();

    // Store the pending promise
    pendingFetchesRef.current.set(cacheKey, fetchPromise);
    
    return fetchPromise;
  }, [generateCacheKey]);

  const getProductsByOptions = useCallback((options = {}) => {
    const { includeStock = true, category = null, subcategory = null, limit = null, filters = {}, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    let filteredProducts = [...products];
    
    // 1. Sort products before filtering and limiting to ensure we get "Latest" if requested
    filteredProducts.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle Firestore Timestamps or generic dates
      if (valA?.seconds) valA = valA.seconds;
      if (valB?.seconds) valB = valB.seconds;
      
      const timeA = new Date(valA || 0).getTime();
      const timeB = new Date(valB || 0).getTime();
      
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    // Apply additional filters if specified
    if (Object.keys(filters).length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        return Object.entries(filters).every(([key, value]) => {
          if (key === 'minPrice' && product.price) {
            return product.price >= value;
          }
          if (key === 'maxPrice' && product.price) {
            return product.price <= value;
          }
          if (key === 'inStockOnly') {
            return (product.stock || 0) > 0;
          }
          return product[key] === value;
        });
      });
    }
    
    // If category is specified and we don't have category-specific data, filter locally
    if (category && !generateCacheKey({ includeStock, category }).includes('category')) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === category ||
        product.subcategory === category
      );
    }
    
    // If subcategory is specified and we don't have subcategory-specific data, filter locally
    if (subcategory && !generateCacheKey({ includeStock, subcategory }).includes('subcategory')) {
      filteredProducts = filteredProducts.filter(product =>
        product.subcategory === subcategory
      );
    }
    
    // Apply limit if specified
    if (limit) {
      filteredProducts = filteredProducts.slice(0, limit);
    }
    
    return filteredProducts;
  }, [products, generateCacheKey]);

  const getProductById = useCallback((productId) => {
    return products.find(product => product.id === productId) || null;
  }, [products]);

  const refreshProducts = useCallback(async (options = {}) => {
    const {
      category = null,
      subcategory = null,
      all = false,
      invalidateStock = false
    } = options;
    
    if (all) {
      // Invalidate all product-related caches
      invalidateCacheUtil('*type:products*');
      invalidateFirebaseCache('products');
      invalidateFirebaseCache('products-withStock');
      if (invalidateProductCacheService) {
        invalidateProductCacheService('all');
      }
    } else if (category) {
      // Invalidate specific category cache
      invalidateProductCacheService('category', category);
      invalidateCacheUtil(`*category:${category}*`);
    } else if (subcategory) {
      // Invalidate specific subcategory cache
      invalidateProductCacheService('category', subcategory);
      invalidateCacheUtil(`*subcategory:${subcategory}*`);
    } else if (invalidateStock) {
      // Invalidate stock-related caches
      invalidateProductCacheService('stock');
      invalidateCacheUtil('*includeStock:true*');
    }
    
    return fetchProducts({ ...options, forceRefresh: true });
  }, [fetchProducts, invalidateFirebaseCache, generateCacheKey]);

  const invalidateProductCache = useCallback((options = {}) => {
    const {
      productId = null,
      category = null,
      subcategory = null,
      stock = false
    } = options;
    
    if (productId) {
      invalidateProductCacheService('product', productId);
    }
    
    if (category) {
      invalidateProductCacheService('category', category);
      invalidateCacheUtil(`*category:${category}*`);
    }
    
    if (subcategory) {
      invalidateProductCacheService('category', subcategory);
      invalidateCacheUtil(`*subcategory:${subcategory}*`);
    }
    
    if (stock) {
      invalidateProductCacheService('stock');
      invalidateCacheUtil('*includeStock:true*');
    }
    
    // Also invalidate current cache key
    const cacheKey = generateCacheKey(options);
    invalidateCacheUtil(cacheKey);
  }, [generateCacheKey]);

  // Search products function
  const searchProducts = useCallback(async (searchTerm, searchOptions = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchCacheKey = generateCacheKey({
        search: searchTerm,
        ...searchOptions
      });
      
      // Check cache first
      const cachedResults = getCachedData(searchCacheKey);
      if (cachedResults) {
        console.log(`ProductContext search cache hit for ${searchTerm}`);
        setProducts(cachedResults);
        setLoading(false);
        return cachedResults;
      }
      
      // Perform search
      const results = await searchProductsOptimized(searchTerm, searchOptions.filters || {}, {
        includeStock: searchOptions.includeStock !== false,
        limit: searchOptions.limit
      });
      
      setProducts(results);
      setCachedData(searchCacheKey, results);
      setLoading(false);
      
      return results;
    } catch (err) {
      console.error('ProductContext error searching products:', err);
      setError(err.message || 'Failed to search products');
      setLoading(false);
      return [];
    }
  }, [generateCacheKey, getCachedData, setCachedData]);

  // Get featured products function
  const getFeaturedProducts = useCallback(async (limitCount = 8) => {
    setLoading(true);
    setError(null);
    
    try {
      const featuredCacheKey = generateCacheKey({ featured: true, limit: limitCount });
      
      // Check cache first
      const cachedFeatured = getCachedData(featuredCacheKey);
      if (cachedFeatured) {
        console.log(`ProductContext featured products cache hit for limit ${limitCount}`);
        setProducts(cachedFeatured);
        setLoading(false);
        return cachedFeatured;
      }
      
      // Fetch featured products
      let featuredProductsData = await getFeaturedProductsService(limitCount);
      
      if (!featuredProductsData || featuredProductsData.length === 0) {
        featuredProductsData = MOCK_PRODUCTS.slice(0, limitCount);
      }
      
      setProducts(featuredProductsData);
      setCachedData(featuredCacheKey, featuredProductsData);
      setLoading(false);
      
      return featuredProductsData;
    } catch (err) {
      console.error('ProductContext error fetching featured products:', err);
      setError(err.message || 'Failed to fetch featured products');
      setLoading(false);
      return [];
    }
  }, [generateCacheKey, getCachedData, setCachedData]);

  // Initial fetch of products
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    getProductsByOptions,
    getProductById,
    refreshProducts,
    invalidateProductCache,
    searchProducts,
    getFeaturedProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;