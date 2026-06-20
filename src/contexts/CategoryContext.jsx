import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getAllCategories, getCategoriesWithSubcategories } from '../firebase/services/categoryService';
import { useFirebaseCache } from '../hooks/useFirebaseCache';

const CategoryContext = createContext();

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const { getCachedData, setCachedData, invalidateCache } = useFirebaseCache();
  const [categories, setCategories] = useState([]);
  const [categoriesWithSubcategories, setCategoriesWithSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingWithSubcategories, setLoadingWithSubcategories] = useState(false);
  const [error, setError] = useState(null);
  const pendingFetchesRef = useRef(new Map());
  // Refs so timeout/error fallbacks always see the LATEST state (not stale closure)
  const categoriesRef = useRef([]);
  const categoriesWithSubRef = useRef([]);
  const hasFetchedRef = useRef(false);

  const CACHE_DURATION = 30 * 1000; // 30 seconds – categories update frequently from admin

  // Fetch all categories (flat structure)
  const fetchCategories = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'categories-flat';
    
    // Check if a fetch is already in progress for this key
    if (pendingFetchesRef.current.has(cacheKey)) {
      console.log(`CategoryContext using existing pending fetch for ${cacheKey}`);
      return pendingFetchesRef.current.get(cacheKey);
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        console.log('CategoryContext cache hit for flat categories');
        setCategories(cachedData);
        setLoading(false);
        return cachedData;
      }
    }
    
    setLoading(true);
    setError(null);
    
    // Create the fetch promise
    const fetchPromise = (async () => {
      try {
        console.log('CategoryContext fetching flat categories from Firebase...');
        
        const networkPromise = getAllCategories();
        const timeoutPromise = new Promise((resolve) => 
          setTimeout(() => resolve('TIMEOUT'), 8000)
        );

        let categoriesData = await Promise.race([networkPromise, timeoutPromise]);
        
        if (categoriesData === 'TIMEOUT') {
          console.log('CategoryContext: Flat categories fetch timeout. Using current state.');
          categoriesData = categoriesRef.current; // always-fresh ref, not stale closure
        } else {
          categoriesRef.current = categoriesData;
          setCategories(categoriesData);
          setCachedData(cacheKey, categoriesData);
        }
        
        setLoading(false);
        return categoriesData;
      } catch (err) {
        console.error('CategoryContext error fetching categories:', err);
        setError(err.message || 'Failed to fetch categories');
        setLoading(false);
        return categoriesRef.current;
      } finally {
        // Remove from pending fetches when done
        pendingFetchesRef.current.delete(cacheKey);
      }
    })();

    // Store the pending promise
    pendingFetchesRef.current.set(cacheKey, fetchPromise);
    
    return fetchPromise;
  }, [getCachedData, setCachedData]);

  // Fetch categories with subcategories (nested structure)
  const fetchCategoriesWithSubcategories = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'categories-with-subcategories';
    
    // Check if a fetch is already in progress for this key
    if (pendingFetchesRef.current.has(cacheKey)) {
      console.log(`CategoryContext using existing pending fetch for ${cacheKey}`);
      return pendingFetchesRef.current.get(cacheKey);
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        console.log('CategoryContext cache hit for nested categories');
        setCategoriesWithSubcategories(cachedData);
        setLoadingWithSubcategories(false);
        return cachedData;
      }
    }
    
    setLoadingWithSubcategories(true);
    setError(null);
    
    // Create the fetch promise
    const fetchPromise = (async () => {
      try {
        console.log('CategoryContext fetching nested categories from Firebase...');
        
        const networkPromise = getCategoriesWithSubcategories();
        const timeoutPromise = new Promise((resolve) => 
          setTimeout(() => resolve('TIMEOUT'), 8000)
        );

        let categoriesData = await Promise.race([networkPromise, timeoutPromise]);
        
        if (categoriesData === 'TIMEOUT') {
          console.log('CategoryContext: Nested categories fetch timeout. Using current state.');
          categoriesData = categoriesWithSubRef.current; // always-fresh ref
        } else {
          categoriesWithSubRef.current = categoriesData;
          setCategoriesWithSubcategories(categoriesData);
          setCachedData(cacheKey, categoriesData);
        }
        
        setLoadingWithSubcategories(false);
        return categoriesData;
      } catch (err) {
        console.error('CategoryContext error fetching categories with subcategories:', err);
        setError(err.message || 'Failed to fetch categories with subcategories');
        setLoadingWithSubcategories(false);
        return categoriesWithSubRef.current;
      } finally {
        // Remove from pending fetches when done
        pendingFetchesRef.current.delete(cacheKey);
      }
    })();

    // Store the pending promise
    pendingFetchesRef.current.set(cacheKey, fetchPromise);
    
    return fetchPromise;
  }, [getCachedData, setCachedData]);

  // Get category name by ID (works with both flat and nested structures)
  const getCategoryName = useCallback((categoryId, useNested = false) => {
    if (!categoryId) return 'No Category';
    
    const sourceData = useNested ? categoriesWithSubcategories : categories;
    
    if (useNested) {
      // Search in nested structure
      for (const category of sourceData) {
        if (category.id === categoryId) {
          return category.name;
        }
        if (category.subcategories) {
          const subcat = category.subcategories.find(sub => sub.id === categoryId);
          if (subcat) return subcat.name;
        }
      }
    } else {
      // Search in flat structure
      const category = sourceData.find(cat => cat.id === categoryId);
      return category ? category.name : 'Unknown Category';
    }
    
    return 'Unknown Category';
  }, [categories, categoriesWithSubcategories]);

  // Get subcategories by parent ID
  const getSubcategoriesByParentId = useCallback((parentId) => {
    const parentCategory = categoriesWithSubcategories.find(cat => cat.id === parentId);
    return parentCategory ? parentCategory.subcategories || [] : [];
  }, [categoriesWithSubcategories]);

  // Get all main categories (no parent)
  const getMainCategories = useCallback((useNested = false) => {
    const sourceData = useNested ? categoriesWithSubcategories : categories;
    
    if (useNested) {
      return sourceData.filter(cat => !cat.parentId);
    } else {
      return sourceData.filter(cat => !cat.parentId);
    }
  }, [categories, categoriesWithSubcategories]);

  // Get all subcategories (has parent)
  const getAllSubcategories = useCallback(() => {
    const allSubcats = [];
    categoriesWithSubcategories.forEach(category => {
      if (category.subcategories) {
        allSubcats.push(...category.subcategories);
      }
    });
    return allSubcats;
  }, [categoriesWithSubcategories]);

  // Refresh functions
  const refreshCategories = useCallback(async () => {
    invalidateCache('categories-flat');
    return fetchCategories(true);
  }, [invalidateCache, fetchCategories]);

  const refreshCategoriesWithSubcategories = useCallback(async () => {
    invalidateCache('categories-with-subcategories');
    return fetchCategoriesWithSubcategories(true);
  }, [invalidateCache, fetchCategoriesWithSubcategories]);

  // Refresh all category data
  const refreshAllCategories = useCallback(async () => {
    await Promise.all([
      refreshCategories(),
      refreshCategoriesWithSubcategories()
    ]);
  }, [refreshCategories, refreshCategoriesWithSubcategories]);

  // Initial fetch — run only once on mount
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchCategories();
      fetchCategoriesWithSubcategories();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    // Data
    categories,
    categoriesWithSubcategories,
    
    // Loading states
    loading,
    loadingWithSubcategories,
    error,
    
    // Fetch functions
    fetchCategories,
    fetchCategoriesWithSubcategories,
    
    // Refresh functions
    refreshCategories,
    refreshCategoriesWithSubcategories,
    refreshAllCategories,
    
    // Utility functions
    getCategoryName,
    getSubcategoriesByParentId,
    getMainCategories,
    getAllSubcategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;