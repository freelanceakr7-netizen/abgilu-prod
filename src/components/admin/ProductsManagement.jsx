import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import ProductModal from './ProductModal';
import { useCategoryContext } from '../../contexts/CategoryContext';

const ProductsManagement = ({
  products,
  searchTerm,
  setSearchTerm,
  onEditProduct,
  onDeleteProduct,
  deletingProductId,
  onAddProduct
}) => {
  const { categories, loading: loadingCategories, getCategoryName } = useCategoryContext();

  const getSubcategoryName = (subcategoryId) => {
    if (!subcategoryId) return '';
    return getCategoryName(subcategoryId);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUniqueProductKey = (product, index) => {
    return `${product.id || 'no-id'}-${index}`;
  };

  const getStockStatusClass = (stock) => {
    if (stock === 0) return 'bg-terracotta/10 text-terracotta border border-terracotta/20';
    if (stock < 5) return 'bg-[#4C0E0E]/5 text-[#4C0E0E] border border-[#4C0E0E]/10';
    return 'bg-green-500/10 text-green-700 border border-green-500/20';
  };

  const getStockStatusText = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return `Low Stock (${stock})`;
    return `In Stock (${stock})`;
  };

  const handleAddProduct = () => {
    onAddProduct();
  };

  return (
    <div className="bg-kora border border-indigo/10 rounded-none shadow-md overflow-hidden">
      <div className="p-6 border-b border-indigo/10 bg-kora-light">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-auto flex-grow max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo/40" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#4C0E0E] text-white rounded-none hover:bg-terracotta transition-all text-[10px] uppercase font-bold tracking-[0.2em] shadow-lg shadow-maroon/10"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#4C0E0E] text-white">
            <tr>
              <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">#</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Product</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Category</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Price</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Stock</th>
              <th className="text-right py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo/10">
            {filteredProducts.map((product, index) => (
              <tr key={getUniqueProductKey(product, index)} className="hover:bg-kora-light transition-colors group">
                <td className="py-4 px-6 text-indigo/40 font-bold tabular-nums text-xs">
                  {product.position !== undefined && product.position !== null ? product.position : '-'}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 shrink-0 border border-indigo/10 bg-indigo/5 rounded-none overflow-hidden p-0.5">
                      <img 
                        src={product.images?.[0] || 'https://api.dicebear.com/7.x/shapes/svg?seed=product'} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-none"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-indigo block text-sm tracking-tight">{product.name}</span>
                      <span className="text-[10px] text-indigo/40 uppercase font-bold tracking-widest">
                        {loadingCategories ? '...' : getSubcategoryName(product.subcategory)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-indigo/60 text-sm italic">
                  {loadingCategories ? 'Loading...' : getCategoryName(product.category)}
                </td>
                <td className="py-4 px-6 text-indigo font-black">₹{product.price}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-3 py-1 rounded-none text-[10px] uppercase font-bold tracking-widest ${getStockStatusClass(product.stock || 0)}`}>
                    {getStockStatusText(product.stock || 0)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="p-2 border border-indigo/20 text-indigo hover:bg-indigo hover:text-kora rounded-none transition-colors"
                      title="Edit Product"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      disabled={deletingProductId === product.id}
                      className="p-2 border border-terracotta/20 text-terracotta hover:bg-terracotta hover:text-white rounded-none transition-colors disabled:opacity-50"
                      title="Delete Product"
                    >
                      {deletingProductId === product.id ? (
                        <div className="animate-spin rounded-none h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsManagement;

