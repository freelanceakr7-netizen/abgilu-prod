import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { categoryNameToSlug, slugToCategoryName, SPECIAL_CATEGORIES } from '../src/utils/slugUtils.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { useCategoryContext } from '../src/contexts/CategoryContext';
import { useProductContext } from '../src/contexts/ProductContext';
import { useStore } from '../src/contexts/StoreContext';

const ShopPage = ({ viewProduct, navigateTo, toggleWishlist }) => {
    const location = useLocation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All Categories');
    const [expandedCategories, setExpandedCategories] = useState(['main', 'traditional', 'contemporary']);
    const [expandedPrice, setExpandedPrice] = useState(true);
    const [expandedStock, setExpandedStock] = useState(true);
    const [priceFilter, setPriceFilter] = useState('All Prices');
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [stockFilters, setStockFilters] = useState({
        inStock: false,
        outOfStock: false,
        preOrder: false
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState([]);

    // Firebase Context Hooks
    const { 
        categoriesWithSubcategories, 
        loading: loadingFlatCategories, 
        loadingWithSubcategories: loadingNestedCategories 
    } = useCategoryContext();
    const { products: allProducts, loading: loadingProducts } = useProductContext();
    console.log('All products count:', allProducts.length);
    const { wishlistItems, toggleWishlist: toggleWishlistHook } = useStore();
    const loadingCategories = loadingFlatCategories || loadingNestedCategories;

    // Sync categories from Firebase context
    useEffect(() => {
        try {
            setCategories(categoriesWithSubcategories);
            setError(null);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories. Please try again later.');
        }
    }, [categoriesWithSubcategories, toggleWishlistHook]);

    // Sync active category from URL
    useEffect(() => {
        let currentCategory = 'All Categories';

        if (slug) {
            // Wait for categories to load, or use fallback for special ones
            const resolvedName = slugToCategoryName(slug, categoriesWithSubcategories);
            if (resolvedName) {
                currentCategory = resolvedName;
            } else {
                const specialFallback = SPECIAL_CATEGORIES.find(s => s.slug === slug)?.name;
                if (specialFallback) currentCategory = specialFallback;
            }
        } else {
            const queryParams = new URLSearchParams(location.search);
            const urlCategory = queryParams.get('category');
            if (urlCategory) {
                currentCategory = urlCategory;
            }
        }

        setActiveFilter(currentCategory);

        if (currentCategory !== 'All Categories' && categoriesWithSubcategories && categoriesWithSubcategories.length > 0) {
            const parent = categoriesWithSubcategories.find(cat => 
                cat.name === currentCategory || 
                (cat.subcategories && cat.subcategories.some(sub => sub.name === currentCategory))
            );
            if (parent) {
                const key = parent.name.toLowerCase().replace(/\s+/g, '_');
                setExpandedCategories(prev => {
                    if (!prev.includes(key)) {
                        return [...prev, key];
                    }
                    return prev;
                });
            }
        }
    }, [slug, location.search, categoriesWithSubcategories]);

    // Transform Firebase categories to categoryGroups format
    const categoryGroups = useMemo(() => {
        if (!categories || categories.length === 0) {
            return {
                main: {
                    title: 'All Categories',
                    items: ['All Categories']
                }
            };
        }

        const groups = {
            main: {
                title: 'All Categories',
                items: ['All Categories']
            }
        };

        // Group categories by their names
        categories.forEach(category => {
            const key = category.name.toLowerCase().replace(/\s+/g, '_');
            const items = [category.name];
            
            // Add subcategories if they exist
            if (category.subcategories && category.subcategories.length > 0) {
                category.subcategories.forEach(sub => {
                    items.push(sub.name);
                });
            }

            groups[key] = {
                title: category.name,
                items: items
            };
        });

        return groups;
    }, [categories]);

    const priceOptions = [
        { label: 'All Prices', value: 'All Prices' },
        { label: 'Under ₹1000', value: 'Under ₹1000' },
        { label: '₹1000 - ₹1500', value: '₹1000 - ₹1500' },
        { label: 'Over ₹1500', value: 'Over ₹1500' }
    ];

    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

    const toggleCategory = (category) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const handleStockFilterChange = (filter) => {
        setStockFilters(prev => ({
            ...prev,
            [filter]: !prev[filter]
        }));
    };

    const filteredProducts = useMemo(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get('search')?.toLowerCase() || '';

        return allProducts.filter(product => {
            // 0. Search Filter
            if (searchTerm) {
                const nameMatch = product.name?.toLowerCase().includes(searchTerm);
                const descMatch = product.description?.toLowerCase().includes(searchTerm);
                const colorMatch = product.colors?.some(c => c.toLowerCase().includes(searchTerm));
                const categoryMatch = product.category?.toLowerCase().includes(searchTerm);
                
                if (!nameMatch && !descMatch && !colorMatch && !categoryMatch) {
                    return false;
                }
            }

            // 1. Category Filter - match by category name or subcategory name
            if (activeFilter !== 'All Categories') {
                // Handle special virtual categories (e.g., Best Sellers, New Arrivals)
                const special = SPECIAL_CATEGORIES.find(s => s.name === activeFilter);
                if (!special) {
                    const selectedCategory = categories.find(cat => cat.name === activeFilter);
                    const parentCategory = categories.find(cat =>
                        cat.subcategories && cat.subcategories.some(sub => sub.name === activeFilter)
                    );

                    let categoryMatch = false;
                    if (selectedCategory) {
                        // Check if product belongs to this main category
                        if (product.category === selectedCategory.name || product.category === selectedCategory.id) {
                            categoryMatch = true;
                        }
                        // Also check categoryName field
                        if (product.categoryName === selectedCategory.name) {
                            categoryMatch = true;
                        }
                        // Check if product belongs to any subcategory of this category
                        if (selectedCategory.subcategories && selectedCategory.subcategories.length > 0) {
                            const subcategoryIds = selectedCategory.subcategories.map(sub => sub.id);
                            const subcategoryNames = selectedCategory.subcategories.map(sub => sub.name);
                            if (subcategoryIds.includes(product.subcategory) || subcategoryNames.includes(product.subcategory)) {
                                categoryMatch = true;
                            }
                            if (subcategoryNames.includes(product.subcategoryName)) {
                                categoryMatch = true;
                            }
                        }
                    } else if (parentCategory) {
                        const selectedSubcategory = parentCategory.subcategories.find(sub => sub.name === activeFilter);
                        if (selectedSubcategory) {
                            // Check if product belongs to this specific subcategory
                            if (product.subcategory === selectedSubcategory.name || product.subcategory === selectedSubcategory.id) {
                                categoryMatch = true;
                            }
                            if (product.subcategoryName === selectedSubcategory.name) {
                                categoryMatch = true;
                            }
                        }
                    }

                    if (!categoryMatch) return false;
                }
            }

            // 2. Size Filter
            if (selectedSizes.length > 0) {
                const productSizes = product.sizes || product.availableSizes || [];
                const hasSizeMatch = selectedSizes.some(size => 
                    productSizes.some(ps => (typeof ps === 'string' ? ps : ps.size || ps.label || '')
                        .toUpperCase() === size.toUpperCase())
                );
                if (!hasSizeMatch) return false;
            }

            // 3. Price Filter (Radio Button)
            const price = Number(product.price) || 0;
            if (priceFilter === 'Under ₹1000' && price >= 1000) {
                return false;
            } else if (priceFilter === '₹1000 - ₹1500' && (price < 1000 || price > 1500)) {
                return false;
            } else if (priceFilter === 'Over ₹1500' && price <= 1500) {
                return false;
            }

            // 4. Price Range Filter (Slider)
            if (price < priceRange[0] || price > priceRange[1]) {
                return false;
            }

            // 5. Stock Filters (OR logic among selected types)
            const hasStockFilter = stockFilters.inStock || stockFilters.outOfStock || stockFilters.preOrder;
            if (hasStockFilter) {
                let stockMatch = false;
                const availableStock = Number(product.stock) || 0;
                
                if (stockFilters.inStock && availableStock > 0) stockMatch = true;
                if (stockFilters.outOfStock && (availableStock <= 0)) stockMatch = true;
                if (stockFilters.preOrder && product.isPreOrder) stockMatch = true;
                
                if (!stockMatch) return false;
            }

            return true;
        });
    }, [activeFilter, priceFilter, priceRange, stockFilters, selectedSizes, allProducts, categories]);

    const sortedProducts = useMemo(() => {
        // Copy filtered products array to avoid mutating original
        let sorted = [...filteredProducts];
        // Apply special category sorting if applicable
        if (activeFilter !== 'All Categories') {
            const special = SPECIAL_CATEGORIES.find(s => s.name === activeFilter);
            if (special) {
                sorted.sort((a, b) => {
                    if (special.sortBy === 'createdAt') {
                        const aVal = a.createdAt?.seconds || 0;
                        const bVal = b.createdAt?.seconds || 0;
                        return special.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
                    }
                    if (special.sortBy === 'position') {
                        const aVal = a.position || 0;
                        const bVal = b.position || 0;
                        return special.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
                    }
                    return 0;
                });
            }
        }
        return sorted;
    }, [filteredProducts, activeFilter]);

    const pageTitle = activeFilter === 'All Categories' ? 'Collections' : activeFilter;
    const bannerSubtitle = activeFilter === 'All Categories' ? 'Season 01' : 'Collection';
    const bannerTitle = activeFilter === 'All Categories' ? 'Core Collection' : activeFilter;
    
    // Find category for banner image
    const activeCategoryDoc = categories.find(c => c.name === activeFilter) || 
                              categories.find(c => c.subcategories?.some(s => s.name === activeFilter))?.subcategories.find(s => s.name === activeFilter);
    const specialDoc = SPECIAL_CATEGORIES.find(s => s.name === activeFilter);
    
    let heroImage = 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200';
    if (activeCategoryDoc?.imageUrl) {
        heroImage = activeCategoryDoc.imageUrl;
    } else if (specialDoc && specialDoc.slug === 'best-sellers') {
        heroImage = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200';
    }

    // Loading state
    if (loadingCategories || loadingProducts) {
        return (
            <div className="bg-kora text-indigo  pb-24 px-[40px] max-w-[1440px] mx-auto">
                <header className="mb-6 md:mb-8 relative z-[60]">
                    <h1 className="font-serif text-4xl md:text-6xl mb-4 text-indigo">Collections</h1>
                </header>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-terracotta mx-auto mb-4"></div>
                        <p className="text-indigo/60">Loading collections...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-kora text-indigo pb-24 px-[40px] max-w-[1440px] mx-auto">
                <header className="mb-6 md:mb-8 relative z-[60]">
                    <h1 className="font-serif text-4xl md:text-6xl mb-4 text-indigo">Collections</h1>
                </header>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-terracotta text-white rounded-none hover:bg-terracotta/80 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-kora text-indigo pb-16">
            <div className="px-4 sm:px-8 md:px-[40px] max-w-[1440px] mx-auto">

                {/* Hero Banner */}
                <div className="mb-6 w-full relative z-[55]">
                    <img
                        src={heroImage}
                        alt={bannerTitle}
                        className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-none shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-none">
                        <div className="text-center text-white space-y-2">
                             <span className="text-xs uppercase tracking-[0.4em] font-medium opacity-80">{bannerSubtitle}</span>
                             <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif">{bannerTitle}</h2>
                        </div>
                    </div>
                </div>

                {/* Filter Toggle Bar */}
                {activeFilter === 'All Categories' ? (
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 border border-indigo/20 text-sm font-bold uppercase tracking-widest text-indigo"
                        >
                            <span>Filters</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between mb-6 py-2">
                        <button
                            onClick={() => setFiltersOpen(!filtersOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-indigo/20 hover:border-indigo/40 transition-colors text-indigo"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-[0.15em]">
                                {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                            </span>
                        </button>
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-indigo/60">
                            {sortedProducts.length} {sortedProducts.length === 1 ? 'Piece' : 'Pieces'}
                        </span>
                    </div>
                )}

                <div className={activeFilter === 'All Categories' ? "flex flex-col lg:flex-row gap-8" : `flex flex-col md:flex-row ${filtersOpen ? 'gap-8' : 'gap-0 md:gap-8'}`}>
                    {/* Left Sidebar - Filters (Toggle-able) */}
                    <aside
                        className={activeFilter === 'All Categories'
                            ? `lg:w-64 flex-shrink-0 space-y-6 self-start lg:sticky top-[90px] lg:max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo/20 scrollbar-track-transparent pr-2 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`
                            : `flex-shrink-0 space-y-6 self-start md:sticky top-[90px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo/20 scrollbar-track-transparent pr-2 transition-all duration-300 ease-in-out ${
                                filtersOpen 
                                    ? 'w-full md:w-[240px] max-h-[1000px] md:max-h-[calc(100vh-100px)] opacity-100 translate-x-0 mb-6 md:mb-0' 
                                    : 'w-full md:w-0 max-h-0 md:max-h-[calc(100vh-100px)] opacity-0 -translate-x-4 overflow-hidden pointer-events-none'
                            }`
                        }
                    >
                        <div className={activeFilter === 'All Categories' ? "" : `${filtersOpen ? 'block' : 'hidden'} min-w-[220px]`}>
                            {/* Product Categories */}
                            <div className="overflow-hidden mb-6">
                                <div className="border-b border-indigo/20 pb-3 mb-2 text-left">
                                    <h2 className="font-serif text-[18px] text-indigo font-bold uppercase tracking-widest">Product Categories</h2>
                                </div>

                                <div className="divide-y divide-indigo/10">
                                    {Object.entries(categoryGroups).map(([key, group]) => (
                                        <div key={key}>
                                            <button
                                                onClick={() => toggleCategory(key)}
                                                className="w-full flex items-center justify-between py-3 hover:text-indigo transition-colors duration-200"
                                            >
                                                <span className="text-sm text-indigo font-bold uppercase tracking-[0.1em]">{group.title}</span>
                                                {expandedCategories.includes(key) ? (
                                                    <ChevronUp className="w-4 h-4 text-indigo/60" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-indigo/60" />
                                                )}
                                            </button>

                                            {expandedCategories.includes(key) && (
                                                <div className="px-4 pb-3 space-y-2">
                                                    {group.items.map(item => (
                                                        <label
                                                            key={item}
                                                            className="flex items-center space-x-3 cursor-pointer group"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="category"
                                                                checked={activeFilter === item}
                                                                onChange={() => {
                                                                    if (item === 'All Categories') {
                                                                        navigate('/shop');
                                                                    } else {
                                                                        navigate(`/collections/${categoryNameToSlug(item)}`);
                                                                    }
                                                                }}
                                                                className="w-4 h-4 text-terracotta border-indigo/30 focus:ring-terracotta focus:ring-offset-0 cursor-pointer"
                                                            />
                                                            <span className={`text-sm transition-colors duration-200 ${activeFilter === item
                                                                ? 'text-terracotta font-medium'
                                                                : 'text-indigo/70 group-hover:text-indigo'
                                                                }`}>
                                                                {item}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes Filter */}
                            <div className="overflow-hidden mb-6">
                                <div className="border-b border-indigo/20 pb-3 mb-4 text-left">
                                    <h2 className="font-serif text-[18px] text-indigo font-bold uppercase tracking-widest">Sizes</h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {sizeOptions.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`w-10 h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
                                                selectedSizes.includes(size)
                                                    ? 'bg-indigo text-kora border-indigo'
                                                    : 'bg-transparent text-indigo border-indigo/30 hover:border-indigo'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="overflow-hidden mb-6">
                                <button
                                    onClick={() => setExpandedPrice(!expandedPrice)}
                                    className="w-full flex items-center justify-between pb-3 mb-2 border-b border-indigo/20 transition-colors duration-200"
                                >
                                    <h2 className="font-serif text-[18px] text-indigo font-bold uppercase tracking-widest">Price</h2>
                                    {expandedPrice ? (
                                        <ChevronUp className="w-4 h-4 text-indigo/60" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-indigo/60" />
                                    )}
                                </button>

                                {expandedPrice && (
                                    <div className="p-4">
                                        <div className="space-y-2 mb-4">
                                            {priceOptions.map(option => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center space-x-3 cursor-pointer group"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="price"
                                                        checked={priceFilter === option.value}
                                                        onChange={() => setPriceFilter(option.value)}
                                                        className="w-4 h-4 text-terracotta border-indigo/30 focus:ring-terracotta focus:ring-offset-0 cursor-pointer"
                                                    />
                                                    <span className={`text-sm transition-colors duration-200 ${priceFilter === option.value
                                                        ? 'text-terracotta font-medium'
                                                        : 'text-indigo/70 group-hover:text-indigo'
                                                        }`}>
                                                        {option.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="pt-4 mt-2 border-t border-indigo/10">
                                            <div className="flex items-center justify-between mb-3 text-indigo font-medium">
                                                <span className="text-xs text-indigo/60">Min: ₹{priceRange[0]}</span>
                                                <span className="text-xs text-indigo/60">Max: ₹{priceRange[1]}</span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="range"
                                                    min="500"
                                                    max="10000"
                                                    value={priceRange[0]}
                                                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                                    className="w-full h-1 bg-indigo/20 rounded-none appearance-none cursor-pointer accent-terracotta"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="overflow-hidden mb-6">
                                <button
                                    onClick={() => setExpandedStock(!expandedStock)}
                                    className="w-full flex items-center justify-between pb-3 mb-2 border-b border-indigo/20 transition-colors duration-200"
                                >
                                    <h2 className="font-serif text-[18px] text-indigo font-bold uppercase tracking-widest">Stock Status</h2>
                                    {expandedStock ? (
                                        <ChevronUp className="w-4 h-4 text-indigo/60" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-indigo/60" />
                                    )}
                                </button>

                                {expandedStock && (
                                    <div className="p-4 space-y-2">
                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={stockFilters.inStock}
                                                onChange={() => handleStockFilterChange('inStock')}
                                                className="w-4 h-4 text-terracotta border-indigo/30 rounded-none focus:ring-terracotta focus:ring-offset-0 cursor-pointer"
                                            />
                                            <span className="text-sm text-indigo/70 group-hover:text-indigo transition-colors duration-200">
                                                In Stock
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={stockFilters.outOfStock}
                                                onChange={() => handleStockFilterChange('outOfStock')}
                                                className="w-4 h-4 text-terracotta border-indigo/30 rounded-none focus:ring-terracotta focus:ring-offset-0 cursor-pointer"
                                            />
                                            <span className="text-sm text-indigo/70 group-hover:text-indigo transition-colors duration-200">
                                                Out of Stock
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={stockFilters.preOrder}
                                                onChange={() => handleStockFilterChange('preOrder')}
                                                className="w-4 h-4 text-terracotta border-indigo/30 rounded-none focus:ring-terracotta focus:ring-offset-0 cursor-pointer"
                                            />
                                            <span className="text-sm text-indigo/70 group-hover:text-indigo transition-colors duration-200">
                                                Pre Order
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className={activeFilter === 'All Categories' ? "flex-1" : "flex-1 min-w-0"}>
                        {/* Product Grid - 4 cols when filters hidden, 3 cols when shown */}
                        <div className={activeFilter === 'All Categories'
                            ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10"
                            : `grid gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 ${
                                filtersOpen 
                                    ? 'grid-cols-2 lg:grid-cols-3' 
                                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                            }`
                        }>
                            {sortedProducts.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    viewProduct={viewProduct}
                                    toggleWishlist={toggleWishlist}
                                    wishlist={wishlistItems}
                                />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="py-24 text-center">
                                <p className="font-serif italic text-2xl text-indigo/40">No pieces found in this saga yet...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
